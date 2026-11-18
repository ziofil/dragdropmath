import type { Expr, MathState } from "../expr/types";
import type { Loc } from "../expr/tree";
import { cloneFresh, frac, neg, num, prod, sum } from "../expr/build";
import { dropFactor } from "./shapes";
import { key } from "../expr/key";
import { allNodes, nodeAt } from "../expr/tree";
import { roleOf, viewTerm } from "./view";
import { sharedFactor } from "./numbers";
import { dragCtx, mergeInto, replaceIn, without, type Candidate, type Rule } from "./types";
import { fractionPart, timesVisible } from "./shapes";

// ---------- helpers ----------

/** A term of a sum seen as sign × body (−x/3 → −, x/3); see view.ts. */
const signed = viewTerm;

const withSign = (negative: boolean, e: Expr, id?: string) => (negative ? neg(e, id) : e);

const smallestPrime = (n: number) => {
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return p;
  return n;
};

/** The same fraction, top and bottom multiplied by a copy of `f` (dropped from one side onto the other). */
function ownFraction(state: MathState, f: Expr, part: { F: Extract<Expr, { kind: "frac" }>; fracLoc: Loc; inDen: boolean }): Candidate[] {
  const { F, fracLoc, inDen } = part;
  // Only a root from the bottom, to make the bottom whole (1/√3 → √3/(√3·√3)): any other piece carried up
  // across the bar flips to a negative exponent (flip-across-bar), landing right where this would.
  // In a fraction of fractions, pieces cross the main bar by that move (divide-by-fraction).
  const isRoot = allNodes(f).some((n) => n.kind === "pow" && n.radical);
  if (!inDen || !isRoot || F.num.kind === "frac" || F.den.kind === "frac") return [];
  const expanded = frac(timesVisible(F.num, cloneFresh(f)), timesVisible(F.den, cloneFresh(f)), F.id);
  return [{ rule: "expand-fraction", state: replaceIn(state, fracLoc, expanded), targetId: inDen ? F.num.id : F.den.id }];
}

// ---------- rules ----------

/**
 * 8 → 4·2 (tap a number to split it, the useful factor first): what it
 * shares across the fraction bar, when it's a factor of a whole top or
 * bottom (8x/12 → (4·2·x)/12, ready for the 4s to cancel once 12 is 4·3);
 * else what it shares with the other terms of its sum (15x + 10 → 5·3x + 10,
 * ready to take the 5 out); else its smallest prime (6 → 2·3). Works on a
 * number in a fraction, a term of a sum, or a factor of a product.
 */
export const splitNumber: Rule = {
  id: "split-number",
  undoneBy: ["multiply-numbers",  "multiply-out"],
  name: "Split a number",
  gesture: "Tap a number to split it into two factors (6 → 2·3).",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.node.kind !== "num") return [];
    // In a fraction (its top or bottom, or a factor of one), a sum or a product —
    // not alone on a side, in an exponent, or inside a log or root.
    const holder = c.parent?.kind === "prod" ? dragCtx(state, c.parent.id) : c;
    const r = roleOf(state, id);
    const termOfSum = (r?.part === "term" || r?.part === "body") && r.terms.length >= 2; // −6 is a term too
    const inPlace = holder?.parent?.kind === "frac" || termOfSum || c.parent?.kind === "prod";
    if (!inPlace) return [];
    const n = c.node.value;
    if (!Number.isInteger(n) || n < 4) return [];
    // What it shares first, else its smallest prime (a power of a base, before that, is taps.ts's to choose).
    const p = sharedFactor(state, id, n) ?? smallestPrime(n);
    if (p === n) return [];
    return [{ rule: "split-number", state: replaceIn(state, c.loc, prod([num(p), num(n / p)], c.node.id)) }];
  },
};

/**
 * 1/2 + 1/3: drag the 3 from one denominator onto another term — that term is
 * multiplied top and bottom by 3 (copies fly out of the carried 3; the 3
 * itself stays where it was). A whole number becomes a fraction: 2 → (2·3)/3.
 */
export const expandFraction: Rule = {
  id: "expand-fraction",
  name: "Same denominators",
  gesture: "Drag a factor from one denominator onto another term — it multiplies that term's top and bottom.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const part = c && fractionPart(state, c);
    if (!c || !part) return [];
    // A root from the bottom onto its own top: top and bottom are both multiplied by it (1/√3 → √3/(√3·√3)).
    const own = ownFraction(state, c.node, part);
    if (!part.inDen) return own;

    // The fraction it came from must be a term (or −term) of a sum.
    const r = roleOf(state, part.F.id);
    if (!r || (r.part !== "term" && r.part !== "body") || r.terms.length < 2) return own;
    const S = nodeAt(state, r.holderLoc);
    const termCtx = { index: r.index, parent: S, parentLoc: r.holderLoc };
    const terms = r.terms;
    const f = c.node;
    return [...own, ...terms.flatMap((T, j): Candidate[] => {
      if (j === termCtx.index) return [];
      const { negative, body } = signed(T);
      if (allNodes(body).some((n) => n.id === f.id)) return [];
      const copy = () => cloneFresh(f);
      const expanded =
        body.kind === "frac"
          ? frac(timesVisible(body.num, copy()), timesVisible(body.den, copy()), body.id)
          : frac(timesVisible(body, copy()), copy());
      const newTerms = terms.map((t, k) => (k === j ? withSign(negative, expanded, negative ? T.id : undefined) : t));
      return [
        {
          rule: "expand-fraction",
          state: replaceIn(state, termCtx.parentLoc!, { ...termCtx.parent!, terms: newTerms } as Expr),
          targetId: T.id,
        },
      ];
    })];
  },
};

/** 1/5 + 2/5 → (1 + 2)/5 (drop a fraction onto one with the same denominator). */
export const addFractions: Rule = {
  id: "add-fractions",
  undoneBy: ["split-fraction"],
  operatorTap: "sum",
  name: "Add fractions",
  gesture: "Drop a fraction onto another with the same denominator — the tops add up.",
  apply(state, id) {
    const r = roleOf(state, id);
    if (r?.part !== "term" || r.terms.length < 2) return [];
    const c = { node: r.node, index: r.index, parent: nodeAt(state, r.holderLoc), parentLoc: r.holderLoc };
    const mine = signed(c.node);
    if (mine.body.kind !== "frac") return [];
    const myFrac = mine.body;
    const terms = r.terms;
    return terms.flatMap((U, j): Candidate[] => {
      if (j === c.index) return [];
      const theirs = signed(U);
      if (theirs.body.kind !== "frac" || key(theirs.body.den) !== key(myFrac.den)) return [];
      // Numerators in left-to-right order, each with its sign.
      const parts: [boolean, Expr][] = j < c.index
        ? [[theirs.negative, theirs.body.num], [mine.negative, myFrac.num]]
        : [[mine.negative, myFrac.num], [theirs.negative, theirs.body.num]];
      const top = sum(parts.map(([negative, n]) => withSign(negative, n)));
      const merged = frac(top, theirs.body.den, theirs.body.id);
      return [
        {
          rule: "add-fractions",
          state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, merged),
          targetId: U.id,
        },
      ];
    });
  },
};

/** (x + 2)/2 → x/2 + 2/2 (pull a term out of the top; it takes a copy of the bottom). */
export const splitFraction: Rule = {
  id: "split-fraction",
  undoneBy: ["add-fractions"],
  feel: { carry: "pull-out" },
  name: "Split a fraction",
  gesture: "Pull a term out of a fraction's top — it takes a copy of the bottom with it.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "sum") return [];
    const N = dragCtx(state, c.parent.id);
    if (N?.parent?.kind !== "frac" || N.index !== 0) return [];
    const F = N.parent;
    const { negative, body } = signed(c.node);
    // A carried −term keeps its identity (its − stays the same piece).
    const mine = withSign(negative, { ...frac(body, cloneFresh(F.den)), from: F.id }, negative ? c.node.id : undefined);
    const rest = frac(sum(without(c.parent.terms, c.index), c.parent.id), F.den, F.id);
    const split = sum(c.index === 0 ? [mine, rest] : [rest, mine]);
    return [{ rule: "split-fraction", state: replaceIn(state, N.parentLoc!, split) }];
  },
};

/** x/3 · 6/x → (x·6)/(3·x), 2 · 3/4 → (2·3)/4 (drop a factor onto a fraction it multiplies). */
export const multiplyFractions: Rule = {
  id: "multiply-fractions",
  operatorTap: "product",
  name: "Multiply fractions",
  gesture: "Drop a fraction (or number) onto a fraction it multiplies — tops multiply, bottoms multiply.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod") return [];
    const factors = c.parent.factors;
    const parts = (e: Expr) => (e.kind === "frac" ? { top: e.num, bottom: e.den as Expr | null } : { top: e, bottom: null });
    return factors.flatMap((G, j): Candidate[] => {
      if (j === c.index || (G.kind !== "frac" && c.node.kind !== "frac")) return [];
      // Onto a bracket (or a bracket onto it), a fraction goes into every term: that's distributing.
      if (G.kind === "sum" || c.node.kind === "sum") return [];
      // A number dropped on a log goes *into* it (½·ln x → ln(x^½)), not over it.
      if (G.kind === "log" || c.node.kind === "log") return [];
      const [a, b] = j < c.index ? [parts(G), parts(c.node)] : [parts(c.node), parts(G)];
      const bottoms = [a.bottom, b.bottom].filter((x): x is Expr => x !== null);
      // The result takes over the target's identity only if the target is the fraction
      // (a number target survives inside it: 3/4 onto 2 → (2·3)/4 keeps that 2).
      const merged = frac(timesVisible(a.top, b.top), bottoms.length === 1 ? bottoms[0] : timesVisible(...bottoms), G.kind === "frac" ? G.id : undefined);
      return [
        {
          rule: "multiply-fractions",
          state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, merged),
          targetId: G.id,
        },
      ];
    });
  },
};

/**
 * A fraction of fractions, (A/B)/(C/D): a factor's meaning is how many bars
 * are over it — under none or two it multiplies (A, D), under one it divides
 * (B, C). So it may move to the other side of the main bar, into the place
 * with as many bars over it, and nothing changes: D dropped onto the top,
 * (A·D/B)/C; C onto the top, (A/(B·C))/(1/D); B onto the bottom, A/(C·B/D).
 * 6/(3/6): the 6 under the 3 goes up, (6·6)/3. A factor of A only moves when
 * it can't be 0 (it would become a divisor).
 */
export const divideByFraction: Rule = {
  id: "divide-by-fraction",
  name: "A fraction of fractions",
  gesture: "Carry a factor across the main bar of a fraction of fractions, onto the other side: it lands where it means the same.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const at = c && placeIn(state, c.loc);
    if (!c || !at || c.node.kind === "frac" || (c.node.kind === "num" && c.node.value === 1)) return [];
    const { F, fracLoc, side, inner, partLoc } = at;
    const f = c.node;
    // Bars over it: its side's (the bottom's one), and its inner fraction's (a bottom's one).
    const bars = side + inner;
    // A factor of A becomes a divisor: only what can't be 0.
    if (bars === 0 && (allNodes(f).some((n) => n.kind === "var") ? state.letters !== "positive" : f.kind === "num" && f.value === 0)) return [];
    // Taken from where it was (1 left if it was all of it; a bottom of 1 goes).
    const part = nodeAt(state, partLoc);
    const left = part.id === f.id ? num(1) : (dropFactor(part, (x) => x.id === f.id) ?? part);
    const sideNow = (k: 0 | 1) => (k === 0 ? F.num : F.den);
    const from = sideNow(side as 0 | 1);
    let source: Expr;
    if (from.kind === "frac" && partLoc.path.length > fracLoc.path.length + 1) {
      const inTop = partLoc.path[partLoc.path.length - 1] === 0;
      const top = inTop ? left : from.num;
      const bottom = inTop ? from.den : left;
      source = bottom.kind === "num" && bottom.value === 1 ? top : frac(top, bottom, from.id);
    } else source = left;
    // Into the other side, where as many bars are over it.
    const other = sideNow((1 - side) as 0 | 1);
    const intoTop = (bars - (1 - side)) % 2 === 0;
    const copy = cloneFresh(f);
    const target =
      other.kind === "frac"
        ? intoTop
          ? frac(timesVisible(other.num, copy), other.den, other.id)
          : frac(other.num, timesVisible(other.den, copy), other.id)
        : intoTop
          ? timesVisible(other, copy)
          : frac(other, copy);
    const [top, bottom] = side === 0 ? [source, target] : [target, source];
    const result = bottom.kind === "num" && bottom.value === 1 ? top : frac(top, bottom, F.id);
    return [{ rule: "divide-by-fraction", state: replaceIn(state, fracLoc, result), targetId: other.id }];
  },
};

/**
 * Where a factor is in a fraction of fractions (the main bar's fraction F,
 * with a fraction above or below it): which side of the main bar (0 top, 1
 * bottom), and on which side of its own inner bar (0, or 1 when it's under
 * it); the factor's part (the product it's in, or itself). Null elsewhere.
 */
function placeIn(state: MathState, loc: Loc): { F: Extract<Expr, { kind: "frac" }>; fracLoc: Loc; side: number; inner: number; partLoc: Loc } | null {
  const up = loc.path.length ? { ...loc, path: loc.path.slice(0, -1) } : null;
  const partLoc = up && nodeAt(state, up).kind === "prod" ? up : loc;
  const above = partLoc.path.length ? { ...partLoc, path: partLoc.path.slice(0, -1) } : null;
  if (!above) return null;
  const G = nodeAt(state, above);
  if (G.kind !== "frac") return null;
  const gSide = partLoc.path[partLoc.path.length - 1];
  const aboveG = above.path.length ? { ...above, path: above.path.slice(0, -1) } : null;
  const F = aboveG && nodeAt(state, aboveG);
  // Inside an inner fraction G, itself the top or bottom of F.
  if (F?.kind === "frac") return { F, fracLoc: aboveG!, side: above.path[above.path.length - 1], inner: gSide, partLoc };
  // Or a top or bottom of G that isn't a fraction, when G's other side is one.
  const otherSide = gSide === 0 ? G.den : G.num;
  if (otherSide.kind === "frac") return { F: G, fracLoc: above, side: gSide, inner: 0, partLoc };
  return null;
}
