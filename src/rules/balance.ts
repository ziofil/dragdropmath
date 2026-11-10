import type { Expr, MathState } from "../expr/types";
import { frac, freshId, neg, prod, sum } from "../expr/build";
import { evaluate, isConstant } from "../expr/eval";
import { adopt, dragCtx, setSides, signOwner, without, type Candidate, type DragCtx, type Rule } from "./types";

/** Dragging something across `=` only makes sense in a 2-sided state. */
function sideCtx(state: MathState, id: string): (DragCtx & { other: number }) | null {
  if (state.sides.length !== 2) return null;
  const c = dragCtx(state, id);
  return c && { ...c, other: 1 - c.loc.side };
}

/** Safe to divide/multiply both sides by: a constant that isn't zero. */
const nonzeroConstant = (e: Expr) => isConstant(e) && evaluate(e, {}) !== 0;
/** Worth moving across =: a constant that isn't 0 (undefined) or 1 (does nothing; times-one removes it). */
const usefulFactor = (e: Expr) => nonzeroConstant(e) && evaluate(e, {}) !== 1;

function withSides(state: MathState, side: number, mine: Expr, theirs: Expr): MathState {
  const sides = state.sides.slice();
  sides[side] = mine;
  sides[1 - side] = theirs;
  return setSides(sides);
}

/** x + 3 = 10 → x = 10 − 3 (drag a term across; its sign flips). */
export const moveTerm: Rule = {
  id: "move-term",
  name: "Move a term across",
  gesture: "Drag a term to the other side of = — it flips sign on the way.",
  apply(state, id) {
    const c = sideCtx(state, id);
    if (!c || c.loc.path.length !== 1 || c.parent?.kind !== "sum") return [];
    const t = c.node;
    // Keep the dragged id on whatever glyph group represents the term over there.
    // The dragged id goes on the *outermost* node of the moved term, sign
    // included, so the piece you carry itself flips sign as it crosses
    // (rather than a − appearing on the far side).
    // (−(y + 1) lands as + y + 1, flattened into the other side, so there the id
    // goes on its first term.)
    const flipped: Expr =
      t.kind === "neg"
        ? t.arg.kind === "sum"
          ? { ...t.arg, terms: [adopt(t.arg.terms[0], t.id), ...t.arg.terms.slice(1)] }
          : { ...t.arg, id: t.id }
        : neg({ ...t, id: freshId() }, t.id);
    const remaining = sum(without(c.parent.terms, c.index), c.parent.id);
    const other = state.sides[c.other];
    const target = sum([...(other.kind === "sum" ? other.terms : [other]), flipped], other.kind === "sum" ? other.id : undefined);
    return [{ rule: "move-term", state: withSides(state, c.loc.side, remaining, target) }];
  },
};

/** 2x = 8 → x = 8/2 (drag a number factor across; it becomes a divisor). */
export const moveFactor: Rule = {
  id: "move-factor",
  name: "Divide both sides",
  gesture: "Drag a number multiplying a whole side across = — it divides the other side.",
  apply(state, id) {
    const c = sideCtx(state, id);
    if (!c || c.loc.path.length !== 1 || c.parent?.kind !== "prod" || !usefulFactor(c.node)) return [];
    const remaining = prod(without(c.parent.factors, c.index), c.parent.id);
    const other = state.sides[c.other];
    const divided = other.kind === "frac" ? frac(other.num, prod([other.den, c.node]), other.id) : frac(other, c.node);
    return [{ rule: "move-factor", state: withSides(state, c.loc.side, remaining, divided) } satisfies Candidate];
  },
};

/** x/3 = 4 → x = 4·3 (drag a denominator across; it multiplies the other side). */
export const moveDenominator: Rule = {
  id: "move-denominator",
  name: "Multiply both sides",
  gesture: "Drag the bottom of a fraction across = — it multiplies the other side.",
  apply(state, id) {
    const c = sideCtx(state, id);
    if (!c || c.loc.path.length !== 1 || c.parent?.kind !== "frac" || c.index !== 1) return [];
    if (!nonzeroConstant(c.node)) return [];
    const other = state.sides[c.other];
    return [{ rule: "move-denominator", state: withSides(state, c.loc.side, c.parent.num, prod([other, c.node])) }];
  },
};

/** −x = 6 → x = −6 (drag the minus sign across). */
export const moveSign: Rule = {
  id: "move-sign",
  name: "Move a minus across",
  gesture: "Drag just the minus in front of a whole side across = — it lands on the other side.",
  apply(state, id) {
    // Carried by the minus sign alone (−x = 6: the x stays put).
    const owner = signOwner(id);
    const c = owner ? sideCtx(state, owner) : null;
    if (!c || c.loc.path.length !== 0 || c.node.kind !== "neg") return [];
    const other = state.sides[c.other];
    if (other.kind === "neg") {
      // −x = −6 → x = 6: the two minus signs annihilate.
      // The carried minus takes over what's left of its side, so its contents don't outlive it.
      return [{ rule: "move-sign", state: withSides(state, c.loc.side, adopt(c.node.arg, c.node.id), other.arg), targetId: other.id }];
    }
    if (other.kind === "num" && other.value === 0) {
      // −x = 0 → x = 0: a minus on 0 changes nothing, so the − is absorbed into the 0.
      return [{ rule: "move-sign", state: withSides(state, c.loc.side, c.node.arg, other), targetId: other.id }];
    }
    return [{ rule: "move-sign", state: withSides(state, c.loc.side, c.node.arg, neg(other, c.node.id)) }];
  },
};
