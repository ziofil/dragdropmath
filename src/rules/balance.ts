import type { Expr, MathState } from "../expr/types";
import { frac, neg, prod, sum, withFlippedRel } from "../expr/build";
import { evaluate, isConstant } from "../expr/eval";
import { adopt, dragCtx, setSides, signOwner, without, type Candidate, type DragCtx, type Rule } from "./types";

/**
 * Multiplying or dividing both sides by a negative number turns an
 * inequality round (2 < 3, but −2 > −3); an equation stays as it is.
 */
const turnedBy = (state: MathState, factor: Expr, result: MathState) =>
  evaluate(factor, {}) < 0 ? withFlippedRel(result, state) : result;

/** Dragging something across `=` (or <, ≤, ...) only makes sense in a 2-sided state. */
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

/**
 * 7 = x → x = 7, 3 > x → x < 3 (drag a whole side across: the sides change
 * places; an inequality reads the other way round, so its sign turns).
 */
export const swapSides: Rule = {
  id: "swap-sides",
  name: "Swap the sides",
  gesture: "Drag a whole side across the = (or <, >) — the two sides change places.",
  apply(state, id) {
    const c = sideCtx(state, id);
    if (!c || c.loc.path.length !== 0) return [];
    const swapped = setSides([state.sides[1], state.sides[0]]);
    return [{ rule: "swap-sides", state: withFlippedRel({ ...swapped, rel: state.rel }, state) }];
  },
};

/**
 * The product or fraction a dragged piece belongs to, when that's a whole
 * side: either the side itself (2x = 6), or the side under a minus (−2x = 6,
 * −x/2 > 1). `wrap` puts what's left back under the minus.
 */
function wholeSideParent(state: MathState, c: DragCtx): { wrap: (e: Expr) => Expr } | null {
  if (c.loc.path.length === 1) return { wrap: (e) => e };
  const root = state.sides[c.loc.side];
  if (c.loc.path.length === 2 && root.kind === "neg" && root.arg === c.parent) return { wrap: (e) => neg(e, root.id) };
  return null;
}

/** x + 3 = 10 → x = 10 − 3 (drag a term across; its sign flips). */
export const moveTerm: Rule = {
  id: "move-term",
  name: "Move a term across",
  // The carried piece's sign crossfades (− ↔ +) as it crosses the =.
  feel: { wears: "flip-sign" },
  gesture: "Drag a term to the other side of = — it flips sign on the way.",
  apply(state, id) {
    const c = sideCtx(state, id);
    if (!c || c.loc.path.length !== 1 || c.parent?.kind !== "sum") return [];
    const t = c.node;
    // The dragged id stays on the term's body over there: −5 lands as + 5 (the
    // 5 takes the −5's id), 5 lands as − 5 (the 5 keeps its id, inside a new −).
    // The sign itself is carried by the piece and crossfades as it crosses the
    // = (see render/drag/sign.tsx). (−(y + 1) lands as + y + 1, flattened into
    // the other side, so there the id goes on its first term.)
    const flipped: Expr =
      t.kind === "neg"
        ? t.arg.kind === "sum"
          ? { ...t.arg, terms: [adopt(t.arg.terms[0], t.id), ...t.arg.terms.slice(1)] }
          : { ...t.arg, id: t.id }
        : neg(t);
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
    const side = c && wholeSideParent(state, c);
    if (!c || !side || c.parent?.kind !== "prod" || !usefulFactor(c.node)) return [];
    const remaining = side.wrap(prod(without(c.parent.factors, c.index), c.parent.id));
    const other = state.sides[c.other];
    const divided = other.kind === "frac" ? frac(other.num, prod([other.den, c.node]), other.id) : frac(other, c.node);
    return [{ rule: "move-factor", state: turnedBy(state, c.node, withSides(state, c.loc.side, remaining, divided)) } satisfies Candidate];
  },
};

/** x/3 = 4 → x = 4·3 (drag a denominator across; it multiplies the other side). */
export const moveDenominator: Rule = {
  id: "move-denominator",
  name: "Multiply both sides",
  gesture: "Drag the bottom of a fraction across = — it multiplies the other side.",
  apply(state, id) {
    const c = sideCtx(state, id);
    const side = c && wholeSideParent(state, c);
    if (!c || !side || c.parent?.kind !== "frac" || c.index !== 1) return [];
    if (!nonzeroConstant(c.node)) return [];
    const other = state.sides[c.other];
    return [{ rule: "move-denominator", state: turnedBy(state, c.node, withSides(state, c.loc.side, side.wrap(c.parent.num), prod([other, c.node]))) }];
  },
};

/** −x = 6 → x = −6 (drag the minus sign across). */
export const moveSign: Rule = {
  id: "move-sign",
  name: "Move a minus across",
  // Multiplying both sides by −1: an inequality sign turns round as the minus
  // crosses it (any move that turns the relation does; see render/drag/relation.tsx).
  gesture: "Drag just the minus in front of a whole side across = — it lands on the other side. Across < or >, the sign turns round.",
  apply(state, id) {
    // Carried by the minus sign alone (−x = 6: the x stays put).
    const owner = signOwner(id);
    const c = owner ? sideCtx(state, owner) : null;
    if (!c || c.loc.path.length !== 0 || c.node.kind !== "neg") return [];
    const other = state.sides[c.other];
    if (other.kind === "neg") {
      // −x = −6 → x = 6: the two minus signs annihilate.
      // The carried minus takes over what's left of its side, so its contents don't outlive it.
      return [{ rule: "move-sign", state: withFlippedRel(withSides(state, c.loc.side, adopt(c.node.arg, c.node.id), other.arg), state), targetId: other.id }];
    }
    if (other.kind === "num" && other.value === 0) {
      // −x = 0 → x = 0: a minus on 0 changes nothing, so the − is absorbed into the 0.
      return [{ rule: "move-sign", state: withFlippedRel(withSides(state, c.loc.side, c.node.arg, other), state), targetId: other.id }];
    }
    return [{ rule: "move-sign", state: withFlippedRel(withSides(state, c.loc.side, c.node.arg, neg(other, c.node.id)), state) }];
  },
};
