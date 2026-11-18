import type { Expr, MathState } from "../expr/types";
import { normalize } from "../expr/build";
import { children, locate, nodeAt, parentLoc, replaceAt, type Loc } from "../expr/tree";
import { without } from "../util/array";

export type RuleId =
  | "commute"
  | "combine"
  | "multiply-numbers"
  | "merge-powers"
  | "distribute"
  | "distribute-neg"
  | "factor-out"
  | "factor-shared"
  | "power-to-product"
  | "move-term"
  | "swap-sides"
  | "substitute"
  | "move-factor"
  | "move-denominator"
  | "move-letter-factor"
  | "move-letter-denominator"
  | "move-sign"
  | "cancel-factor"
  | "power-of-power"
  | "zero-power"
  | "evaluate-power"
  | "divide-powers"
  | "flip-across-bar"
  | "times-one"
  | "numbers-first"
  | "multiply-out"
  | "times-zero"
  | "split-number"
  | "expand-fraction"
  | "add-fractions"
  | "split-fraction"
  | "multiply-fractions"
  | "divide-by-fraction"
  | "root-notation"
  | "split-square"
  | "root-across"
  | "power-one"
  | "pull-out-of-power"
  | "power-of-product"
  | "exp-of-log"
  | "log-of-product"
  | "log-of-power"
  | "power-into-log"
  | "combine-logs"
  | "evaluate-log"
  | "exp-across"
  | "log-across"
  | "power-of-base"
  | "split-exponent"
  | "move-exponent-term"
  | "split-term"
  | "difference-of-squares"
  | "join-powers"
  | "zero-product";

/**
 * A state the dragged node can lead to.
 *
 * - Without `targetId`, the dragged node still exists in `state`, so the
 *   drag engine can tell where it would land and snap to the nearest option.
 * - With `targetId`, the option is a drop zone: hovering over the target
 *   absorbs the carried piece and shows the result in place. The result keeps
 *   the *target's* ids (5 − 3: the 5 becomes the 2, right where it sits). If
 *   the dragged node disappears, everything inside it must disappear too, or
 *   its contents would be drawn twice (Dragology throws "duplicate id").
 */
export type Candidate = {
  rule: RuleId;
  state: MathState;
  targetId?: string;
  /** A piece that stays where it is on screen while the move is previewed (the rest is laid out around it). */
  stays?: string;
  /** How this one is carried, when it differs from its rule's (see Feel). */
  carry?: Feel["carry"];
};

export type Rule = {
  id: RuleId;
  name: string;
  /** One line telling a learner what gesture does this. */
  gesture: string;
  /** Made by tapping, not dragging (which tap a piece makes: taps.ts). A tap rule yields at most one candidate. */
  tap?: true;
  /** How carrying the piece towards this move feels (see Feel). Merges (with a target) always blend in. */
  feel?: Feel;
  /**
   * A merge that works both ways round: whichever of the two is dropped on
   * the other, the same happens (the bracket of 4(x + 6) on the 4 as well as
   * the 4 on the bracket, ln x on the 4 of 4·ln x, …).
   */
  either?: true;
  /**
   * Tapping the + or − (`sum`) or the · (`product`) between two pieces does
   * this merge, as dropping the second on the first would: 3 + 4 → 7, 2·3 → 6.
   */
  operatorTap?: "sum" | "product";
  /**
   * The moves that undo this one (factoring undoes multiplying out): an
   * exercise built backwards takes this move as a step back, and checks only
   * these undo it (game/generate/back.ts).
   */
  undoneBy?: readonly RuleId[];
  /**
   * Tidying, not a step: writing things the usual way (x·2 → 2x, x¹ → x).
   * Made for the learner right after a move that leaves it to do, on what
   * that move touched (game/tidy.ts); never a move of its own to learn.
   */
  tidy?: true;
  apply(state: MathState, draggedId: string): Candidate[];
};

/**
 * How a move without a target is reached by dragging:
 *
 * - `reorder`: slides along its row; the slot is chosen by order, not distance.
 *   Swapping factors in a product is cosmetic: on its own it doesn't make a
 *   piece worth grabbing.
 * - `landing` (default): carry it to where the piece itself will sit afterwards.
 * - `pull-out`: pull it out past the edge of its container (ln( ), √( ), a fraction's top).
 * - `out-in-front`: carry it out past the left end of its expression (factoring out).
 * - `far-end`: carry it past the far end of the other side (swapping the sides:
 *   just over the = is where a term alone on its side lands when it crosses as a term).
 *
 * `wears` adds a visual on the way: `grow-log` (the piece picks up a faint
 * copy of its log as it leaves, ln(2x) → ln 2 + ln x), `shed-log` (a carried
 * log fades its ln( ) as it nears the log it joins), `flip-sign` (a term
 * carried across = crossfades its sign, − ↔ +, as it crosses).
 */
export type Feel = { carry?: "reorder" | "landing" | "pull-out" | "out-in-front" | "far-end" | "below"; wears?: "grow-log" | "shed-log" | "flip-sign" };

/** Everything a rule typically wants to know about the dragged node. */
export type DragCtx = {
  state: MathState;
  node: Expr;
  loc: Loc;
  /** null when the node is the root of a side */
  parent: Expr | null;
  parentLoc: Loc | null;
  /** index of node among parent's children */
  index: number;
};

export function dragCtx(state: MathState, id: string): DragCtx | null {
  const loc = locate(state, id);
  if (!loc) return null;
  const pLoc = parentLoc(loc);
  return {
    state,
    node: nodeAt(state, loc),
    loc,
    parent: pLoc ? nodeAt(state, pLoc) : null,
    parentLoc: pLoc,
    index: loc.path.length ? loc.path[loc.path.length - 1] : -1,
  };
}

/** Replace the node at `loc` and re-normalize that side. */
/**
 * A piece dropped onto a sibling in the same sum or product (a term onto a
 * like term, a number onto a number): the sibling at `to` becomes `merged`,
 * and the piece at `from` is gone.
 */
export function mergeInto(state: MathState, holderLoc: Loc, holder: Expr, from: number, to: number, merged: Expr): MathState {
  if (holder.kind === "sum") return replaceIn(state, holderLoc, { ...holder, terms: without(holder.terms.map((t, k) => (k === to ? merged : t)), from) });
  if (holder.kind === "prod") return replaceIn(state, holderLoc, { ...holder, factors: without(holder.factors.map((f, k) => (k === to ? merged : f)), from) });
  throw new Error(`mergeInto: a ${holder.kind} holds no terms or factors`);
}

export function replaceIn(state: MathState, loc: Loc, e: Expr): MathState {
  const sides = state.sides.slice();
  sides[loc.side] = normalize(replaceAt(sides[loc.side], loc.path, () => e));
  return { sides };
}

export { isEquation, partner } from "../expr/rows";

export function setSides(sides: Expr[]): MathState {
  return { sides: sides.map(normalize) };
}

/** Give a node a different id, so it takes over the identity of e.g. the dragged node. */
export function adopt(e: Expr, id: string): Expr {
  return { ...e, id };
}

export { moveItem, without } from "../util/array";

export const siblings = (c: DragCtx) => (c.parent ? children(c.parent) : []);
