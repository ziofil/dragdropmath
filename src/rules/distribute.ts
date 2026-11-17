import type { Expr } from "../expr/types";
import { cloneFresh, frac, neg, negate, num, pow, prod, sum, variable } from "../expr/build";
import { adopt, dragCtx, mergeInto, replaceIn, signOwner, type Candidate, type Rule } from "./types";
import { nodeAt, type Loc } from "../expr/tree";
import { key } from "../expr/key";
import { divideOut, powerOf, rebuildTerm, roleOf, viewTerm, wholePower, type Taken } from "./view";
import type { MathState } from "../expr/types";
import { restKey, splitCoef } from "./monomial";
import { visibleOne } from "./shapes";

/** a(b + c) → ab + ac (drop a factor onto the parentheses next to it). */
export const distribute: Rule = {
  id: "distribute",
  undoneBy: ["factor-out",  "factor-shared"],
  either: true,
  name: "Distribute",
  gesture: "Drop a factor onto the brackets it multiplies — it visits every term inside.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod") return [];
    const f = c.node;
    const factors = c.parent.factors;
    return factors.flatMap((s, j): Candidate[] => {
      if (j === c.index || s.kind !== "sum") return [];
      // Each term gets its own copy of the factor, flying out of the carried one.
      // The carried factor itself stops at the first term in its way, and the
      // copies fly on to the terms further along: 2(x + 3), the 2 stops by the
      // x and a copy goes to the 3; (1 + x)y, the y stops right of the x and a
      // copy goes to the 1. That first term stays put as the piece lands.
      // A ·1 stays visible as 2·1 (and 2(x − 1) → 2x − 2·1), for the learner to simplify.
      const fromLeft = c.index < j;
      const first = fromLeft ? 0 : s.terms.length - 1;
      const near = s.terms[first];
      const each = (t: Expr, k: number): Expr => {
        const g = k === first ? f : cloneFresh(f);
        // A minus stays the term's own (the same sign, now in front of the product).
        // Carried in from the right, it sits after each term: (2x + 1)(x + 3) → 2x(x + 3) + 1(x + 3).
        // The product takes the term's place in the row (its + stays the same +: Base.slot).
        const times = (u: Expr): Expr => ({ ...prod(fromLeft ? [g, visibleOne(u)] : [visibleOne(u), g]), slot: t.id });
        return t.kind === "neg" ? neg(times(t.arg), t.id) : times(t);
      };
      // Still in its bracket for a moment, so the factor is seen to have gone inside (see Sum.grouped) —
      // where the bracket would otherwise vanish: into a sum, or as a whole side. (As a factor, or under
      // a minus, it keeps its brackets anyway.)
      const holder = dragCtx(state, c.parent!.id)?.parent ?? null;
      const vanishes = factors.length === 2 && (holder === null || holder.kind === "sum");
      const spread: Expr = vanishes ? ({ ...sum(s.terms.map(each), s.id), grouped: true } as Expr) : sum(s.terms.map(each), s.id);
      return [
        {
          rule: "distribute",
          state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, spread),
          targetId: s.id,
          stays: staysPut(near, fromLeft),
        },
      ];
    });
  },
};

/**
 * What stays put in the first term the carried factor meets: the term itself
 * (x), or, as products merge into one ((x + 1)·2x → (x + 1)·2·x, where 2x's own
 * id is gone), its factor nearest the carried one.
 */
function staysPut(near: Expr, fromLeft: boolean): string {
  const body = near.kind === "neg" ? near.arg : near;
  if (body.kind !== "prod") return body.id;
  return body.factors[fromLeft ? 0 : body.factors.length - 1].id;
}

/** −(a − b) → −a + b (drop the minus sign onto its brackets). */
export const distributeNeg: Rule = {
  id: "distribute-neg",
  undoneBy: ["factor-out"],
  name: "Distribute a minus",
  gesture: "Drop a minus sign onto its brackets, or onto the top or bottom of the fraction it's in front of — every sign inside flips.",
  apply(state, id) {
    // Carried by the minus sign alone, onto its own brackets.
    const owner = signOwner(id);
    const c = owner ? dragCtx(state, owner) : null;
    if (c?.node.kind !== "neg") return [];
    const minus = c.node;
    // The carried minus becomes the sign of the first term (−(x − 4) → −x + 4),
    // so it lands somewhere instead of vanishing while its contents stay.
    const flipped = (s: Extract<Expr, { kind: "sum" }>) => sum(s.terms.map((t, i) => (i === 0 ? adopt(negate(t), minus.id) : negate(t))), s.id);
    if (minus.arg.kind === "sum") return [{ rule: "distribute-neg", state: replaceIn(state, c.loc, flipped(minus.arg)), targetId: minus.arg.id }];
    // In front of a fraction, its top or its bottom is the brackets: −4/(2 − x) → 4/(x − 2).
    const F = minus.arg;
    if (F.kind !== "frac") return [];
    return ([F.num, F.den] as Expr[]).flatMap((part, k): Candidate[] =>
      part.kind === "sum"
        ? [{ rule: "distribute-neg", state: replaceIn(state, c.loc, k === 0 ? frac(flipped(part), F.den, F.id) : frac(F.num, flipped(part), F.id)), targetId: part.id }]
        : [],
    );
  },
};

/**
 * The sum whose term a dragged factor is in (see view.ts): the term itself,
 * its body under a minus, or a factor of it — not part of a fraction.
 */
function termOf(state: MathState, id: string): { sumLoc: Loc; s: Extract<Expr, { kind: "sum" }>; index: number } | null {
  const r = roleOf(state, id);
  if (!r || r.term.frac || !(r.part === "term" || r.part === "body" || r.part === "top-factor")) return null;
  const s = nodeAt(state, r.holderLoc);
  return s.kind === "sum" ? { sumLoc: r.holderLoc, s, index: r.index } : null;
}

/**
 * A term with one copy of factor `f` taken out (see divideOut): 3x → 3,
 * −2xy → −2y, x → 1, x³ → x². `taken`: which copy, in the dragged piece's own
 * term. Null if `f` isn't a factor of it (or it's a fraction).
 */
function stripFactor(t: Expr, f: Expr, taken?: Taken): Expr | null {
  const v = viewTerm(t);
  if (v.frac) return null;
  // The whole term carried out (ab + a → a(b + 1)): 1 is left.
  if (taken && "id" in taken && (taken.id === t.id || taken.id === v.body.id)) return rebuildTerm(v, [], []);
  const top = divideOut(v.top, f, taken) ?? (taken ? null : divideNumber(v.top, f));
  return top && rebuildTerm(v, top, []);
}

/**
 * A whole number out of a term's number that it divides, as by hand: 3 out of
 * 9x leaves 3x, out of 3 leaves 1 (9x + 3y → 3(3x + y), no 9 = 3·3 first).
 */
function divideNumber(fs: Expr[], f: Expr): Expr[] | null {
  if (f.kind !== "num" || !Number.isInteger(f.value) || f.value < 2) return null;
  const i = fs.findIndex((x) => x.kind === "num" && Number.isInteger(x.value) && x.value % f.value === 0);
  if (i < 0) return null;
  const q = (fs[i] as Extract<Expr, { kind: "num" }>).value / f.value;
  return q === 1 ? fs.filter((_, k) => k !== i) : fs.map((x, k) => (k === i ? num(q, x.id) : x));
}

/** The piece carried out of its term, and which copy of it that is (the x of x³: one copy of x). */
function carried(state: MathState, id: string) {
  const c = dragCtx(state, id);
  const P = c?.parent;
  const ofPower = P?.kind === "pow" && c!.index === 0 && wholePower(P).n >= 2;
  const at = c && termOf(state, ofPower ? P!.id : id);
  if (!c || !at) return null;
  return { f: c.node, at, taken: (ofPower ? { powerOf: P!.id } : { id }) as Taken };
}

/**
 * ab + ac → a(b + c) (drag a factor out of one term; it must appear in every term).
 * Also covers a whole term: ab + a → a(b + 1), and powers: x³ + x² → x²(x + 1).
 */
export const factorOut: Rule = {
  id: "factor-out",
  undoneBy: ["distribute"],
  feel: { carry: "out-in-front" },
  name: "Factor out",
  gesture: "Pull a factor that's in every term out in front of brackets.",
  apply(state, id) {
    const m = carried(state, id);
    if (!m) return [];
    const { f, at, taken } = m;
    const stripped = at.s.terms.map((t, i) => stripFactor(t, f, i === at.index ? taken : undefined));
    if (stripped.some((t) => t === null)) return [];
    return [{ rule: "factor-out", state: replaceIn(state, at.sumLoc, prod([f, sum(stripped as Expr[], at.s.id)])) }];
  },
};

/**
 * x·x + 2x → x(x + 2) (drop a factor onto another term that has it too: the
 * two terms now share it). Factoring a few terms at a time is how x² + 2x +
 * 3x + 6 becomes x(x + 2) + 3(x + 2), and then (x + 2)(x + 3). The pair sits
 * where the leftmost of the two was. (Like terms are combined instead.)
 */
export const factorShared: Rule = {
  id: "factor-shared",
  name: "Share a factor",
  gesture: "Drop a factor onto another term that has it too — the two terms share it: x·x + 2x → x(x + 2).",
  apply(state, id) {
    const m = carried(state, id);
    if (!m || m.at.s.terms.length < 3) return []; // two terms: that's factoring out the whole thing
    const { f, at, taken } = m;
    const terms = at.s.terms;
    const mine = stripFactor(terms[at.index], f, taken);
    if (!mine) return [];
    return terms.flatMap((t, j): Candidate[] => {
      if (j === at.index) return [];
      const theirs = stripFactor(t, f);
      if (!theirs) return [];
      if (restKey(splitCoef(terms[at.index])) === restKey(splitCoef(t))) return []; // like terms
      const [lo, hi] = j < at.index ? [j, at.index] : [at.index, j];
      const inside = j < at.index ? [theirs, mine] : [mine, theirs];
      // A number taken out of a term written with a minus takes the minus along: −4x + 12 → −4(x − 3), as by hand
      // (4(−x + 3) never factors on with x(x − 3)).
      const minus = f.kind === "num" && viewTerm(terms[at.index]).negative;
      const shared = minus ? neg(prod([f, sum(inside.map(negate))])) : prod([f, sum(inside)]);
      const newTerms = terms.map((x, k) => (k === lo ? shared : x)).filter((_, k) => k !== hi);
      return [{ rule: "factor-shared", state: replaceIn(state, at.sumLoc, sum(newTerms, at.s.id)), targetId: t.id }];
    });
  },
};

/**
 * A term as a whole number times a power of one base (read with powerOf):
 * 3x² → (3, x, 2), −9√x → (−9, x, ½), 2x⁴ → (2, x, 4), 6 → (6, null, 0);
 * `rest` is what isn't the number (x², √x). Null for anything else.
 */
function monomial(t: Expr): { k: number; base: Expr | null; n: number; rest: Expr[] } | null {
  const v = viewTerm(t);
  if (v.frac) return null;
  let k = v.negative ? -1 : 1;
  let base: Expr | null = null;
  let n = 0;
  const rest: Expr[] = [];
  for (const f of v.top) {
    if (f.kind === "num" && Number.isInteger(f.value)) {
      k *= f.value;
      continue;
    }
    const p = powerOf(f);
    if (base !== null && key(base) !== key(p.base)) return null;
    base = p.base;
    n += p.n;
    rest.push(f);
  }
  return { k, base, n, rest };
}

/** The letter of a monomial that is a power of one letter (x of 3x²), else null. */
const letterOf = (m: { base: Expr | null }) => (m.base?.kind === "var" ? m.base.name : null);

/** k times the factors `rest` (k·√x, −x², 8x), the first part keeping id `id`. */
function timesRest(k: number, rest: Expr[], id?: string): Expr {
  const m = Math.abs(k);
  const body = m === 1 ? (rest.length === 1 ? rest[0] : prod(rest)) : prod([num(m), ...rest]);
  if (k < 0) return id ? { ...neg(body), id } : neg(body);
  // (A lone factor keeps its own id: it's the same piece, sliding to its place.)
  return id && body !== rest[0] ? { ...body, id } : body;
}

/** The term k·xⁿ, written as a person writes it (with a fresh id unless given). */
function writeTerm(k: number, x: string, n: number, id?: string): Expr {
  const body = (m: number): Expr => {
    const letter = n === 0 ? null : n === 1 ? variable(x) : pow(variable(x), num(n));
    return letter === null ? num(m, id) : m === 1 ? { ...letter, ...(id ? { id } : {}) } : prod([num(m), letter], id);
  };
  return k < 0 ? neg(body(-k)) : body(k);
}

/**
 * x² + 5x + 6 → x² + 2x + 3x + 6 (tap the middle term of a quadratic: it splits
 * into the two whose numbers multiply to the first times the last, ready to
 * factor in pairs). Only when such whole numbers exist.
 */
export const splitTerm: Rule = {
  id: "split-term",
  name: "Split the middle term",
  gesture: "Tap the middle term of something like x² + 5x + 6: it splits in two (2x + 3x), ready to factor in pairs.",
  tap: true,
  // Before splitting a number: the 8 of y² + 8y + 15 tapped splits its term, as the y does.
  tapOrder: -0.5,
  apply(state, id) {
    const r = roleOf(state, termHolding(state, id));
    if (!r || r.part !== "term" || r.terms.length !== 3) return [];
    const ms = r.terms.map(monomial);
    if (ms.some((m) => m === null)) return [];
    // The middle term is the one tapped; another is its square (twice its exponent, the same base: x² of x,
    // x⁴ of x², x of √x), the third a number.
    const lin = ms[r.index]!;
    const con = ms.find((m) => m!.n === 0);
    const sq = ms.find((m, i) => i !== r.index && m!.n !== 0 && m!.n === 2 * lin.n && key(m!.base!) === key(lin.base!));
    if (!sq || !con || lin.n === 0) return [];
    const target = sq.k * con.k;
    for (let p = -Math.abs(target); p <= Math.abs(target); p++) {
      if (p === 0 || target % p !== 0) continue;
      const q = target / p;
      if (p + q !== lin.k || q === 0 || Math.abs(p) > Math.abs(q)) continue;
      // Each part written as the middle term is: 2x and 3x, −√x and −8√x.
      const parts = [timesRest(p, lin.rest, r.node.id), timesRest(q, lin.rest.map((e) => cloneFresh(e)))];
      const terms = r.terms.flatMap((t, i) => (i === r.index ? parts : [t]));
      return [{ rule: "split-term", state: replaceIn(state, r.holderLoc, sum(terms, nodeAt(state, r.holderLoc).id)) }];
    }
    return [];
  },
};

/** The term a number in front belongs to (the 8y of the 8, through a minus), else `id` itself. */
function termHolding(state: MathState, id: string): string {
  let c = dragCtx(state, id);
  if (c?.node.kind !== "num") return id;
  while (c?.parent && (c.parent.kind === "prod" || c.parent.kind === "neg")) c = dragCtx(state, c.parent.id);
  return c?.node.id ?? id;
}

/** √ of a term k·xⁿ, when it's a whole square (9 → 3, 4x² → 2x, x⁴ → x²). */
function rootOf(m: { k: number; n: number }): { k: number; n: number } | null {
  const s = Math.round(Math.sqrt(m.k));
  return m.k > 0 && s * s === m.k && m.n % 2 === 0 ? { k: s, n: m.n / 2 } : null;
}

/** x² − 9 → (x − 3)(x + 3) (tap the minus between two squares). */
export const differenceOfSquares: Rule = {
  id: "difference-of-squares",
  name: "Difference of two squares",
  gesture: "Tap the minus between two squares: a² − b² = (a − b)(a + b).",
  tap: true,
  apply(state, id) {
    const owner = signOwner(id);
    const r = owner ? roleOf(state, owner) : null;
    if (!r || r.terms.length !== 2 || r.index !== 1 || r.node.kind !== "neg") return [];
    const [m1, m2] = r.terms.map(monomial);
    if (!m1 || !m2 || m1.k <= 0 || m2.k >= 0) return [];
    // Powers of a letter only, whole ones (x − 9 isn't (√x − 3)(√x + 3) here).
    if ([m1, m2].some((m) => (m.base !== null && m.base.kind !== "var") || !Number.isInteger(m.n))) return [];
    const a = rootOf(m1);
    const b = rootOf({ ...m2, k: -m2.k });
    // Letters in it somewhere (9 − 4 is worked out, not factored), and one letter at most.
    const [x1, x2] = [letterOf(m1), letterOf(m2)];
    if (!a || !b || (x1 === null && x2 === null) || (x1 && x2 && x1 !== x2)) return [];
    const A = writeTerm(a.k, x1 ?? "", a.n);
    const B = writeTerm(b.k, x2 ?? "", b.n);
    const result = prod([sum([A, neg(B)]), sum([cloneFresh(A), cloneFresh(B)])]);
    return [{ rule: "difference-of-squares", state: replaceIn(state, r.holderLoc, result) }];
  },
};
