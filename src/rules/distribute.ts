import type { Expr } from "../expr/types";
import { cloneFresh, neg, negate, prod, sum } from "../expr/build";
import { key } from "../expr/key";
import { adopt, dragCtx, mergeInto, replaceIn, signOwner, type Candidate, type Rule } from "./types";
import { nodeAt, type Loc } from "../expr/tree";
import { roleOf } from "./view";
import type { MathState } from "../expr/types";
import { restKey, splitCoef } from "./monomial";
import { dropFactor, visibleOne } from "./shapes";

/** a(b + c) → ab + ac (drop a factor onto the parentheses next to it). */
export const distribute: Rule = {
  id: "distribute",
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
        const times = (u: Expr) => prod(fromLeft ? [g, visibleOne(u)] : [visibleOne(u), g]);
        return t.kind === "neg" ? neg(times(t.arg), t.id) : times(t);
      };
      const spread = sum(s.terms.map(each), s.id);
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
  name: "Distribute a minus",
  gesture: "Drop a minus sign onto its brackets — every sign inside flips.",
  apply(state, id) {
    // Carried by the minus sign alone, onto its own brackets.
    const owner = signOwner(id);
    const c = owner ? dragCtx(state, owner) : null;
    if (c?.node.kind !== "neg" || c.node.arg.kind !== "sum") return [];
    const s = c.node.arg;
    return [
      {
        rule: "distribute-neg",
        // The carried minus becomes the sign of the first term (−(x − 4) → −x + 4),
        // so it lands somewhere instead of vanishing while its contents stay.
        state: replaceIn(state, c.loc, sum(s.terms.map((t, i) => (i === 0 ? adopt(negate(t), c.node.id) : negate(t))), s.id)),
        targetId: s.id,
      },
    ];
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
 * A term with one copy of factor `f` taken out (the dragged copy itself when
 * `mine`, else any factor equal to it): 3x → 3, −2xy → −2y, x → 1. Null if `f`
 * isn't a factor of it.
 */
function stripFactor(t: Expr, f: Expr, mine: boolean): Expr | null {
  const fKey = key(f);
  if (t.kind === "neg") {
    const inner = stripFactor(t.arg, f, mine);
    return inner && negate(inner);
  }
  return dropFactor(t, (x) => (mine ? x.id === f.id : key(x) === fKey));
}

/**
 * ab + ac → a(b + c) (drag a factor out of one term; it must appear in every term).
 * Also covers a whole term: ab + a → a(b + 1).
 */
export const factorOut: Rule = {
  id: "factor-out",
  feel: { carry: "out-in-front" },
  name: "Factor out",
  gesture: "Pull a factor that's in every term out in front of brackets.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const at = c && termOf(state, id);
    if (!c || !at) return [];
    const f = c.node;
    const stripped = at.s.terms.map((t, i) => stripFactor(t, f, i === at.index));
    if (stripped.some((t) => t === null)) return [];
    // Like terms (a√12 + a√12) are added, not factored: a part of one isn't a
    // handle of its own then, or no press could pick up the whole term.
    const like = at.s.terms.every((t) => restKey(splitCoef(t)) === restKey(splitCoef(at.s.terms[0])));
    const part = f.id !== at.s.terms[at.index].id;
    return [{ rule: "factor-out", state: replaceIn(state, at.sumLoc, prod([f, sum(stripped as Expr[], at.s.id)])), ...(like && part ? { secondary: true } : {}) }];
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
    const c = dragCtx(state, id);
    const at = c && termOf(state, id);
    if (!c || !at || at.s.terms.length < 3) return []; // two terms: that's factoring out the whole thing
    const f = c.node;
    const terms = at.s.terms;
    const mine = stripFactor(terms[at.index], f, true)!;
    return terms.flatMap((t, j): Candidate[] => {
      if (j === at.index) return [];
      const theirs = stripFactor(t, f, false);
      if (!theirs) return [];
      if (restKey(splitCoef(terms[at.index])) === restKey(splitCoef(t))) return []; // like terms
      const [lo, hi] = j < at.index ? [j, at.index] : [at.index, j];
      const inside = j < at.index ? [theirs, mine] : [mine, theirs];
      const shared = prod([f, sum(inside)]);
      const newTerms = terms.map((x, k) => (k === lo ? shared : x)).filter((_, k) => k !== hi);
      return [{ rule: "factor-shared", state: replaceIn(state, at.sumLoc, sum(newTerms, at.s.id)), targetId: t.id }];
    });
  },
};
