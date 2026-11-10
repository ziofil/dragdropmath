import type { Expr, MathState } from "../expr/types";
import { normalize } from "../expr/build";
import { allNodes, children, locate, nodeAt, parentLoc, replaceAt, type Loc } from "../expr/tree";

export type RuleId =
  | "commute"
  | "combine"
  | "multiply-numbers"
  | "merge-powers"
  | "distribute"
  | "distribute-neg"
  | "factor-out"
  | "move-term"
  | "move-factor"
  | "move-denominator"
  | "move-sign"
  | "divide-numbers"
  | "cancel-factor"
  | "power-of-power"
  | "zero-power"
  | "evaluate-power"
  | "divide-powers"
  | "flip-across-bar"
  | "times-one"
  | "numbers-first"
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
  | "power-of-base";

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
/**
 * `secondary`: offered when the node is already being dragged for another
 * reason, but never on its own a reason to make the node grabbable.
 */
export type Candidate = { rule: RuleId; state: MathState; targetId?: string; secondary?: boolean };

export type Rule = {
  id: RuleId;
  name: string;
  /** One line telling a learner what gesture does this. */
  gesture: string;
  /** Tap (click) the node instead of dragging it. A tap rule yields at most one candidate. */
  tap?: true;
  apply(state: MathState, draggedId: string): Candidate[];
};

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
export function replaceIn(state: MathState, loc: Loc, e: Expr): MathState {
  const sides = state.sides.slice();
  sides[loc.side] = normalize(replaceAt(sides[loc.side], loc.path, () => e));
  return { sides };
}

export function setSides(sides: Expr[]): MathState {
  return { sides: sides.map(normalize) };
}

/**
 * A minus sign can be its own drag handle, separate from the term it negates:
 * in −x = 6 you carry just the −. Its handle id is derived from the neg node's.
 */
export const signId = (negId: string) => `${negId}-sign`;
export const signOwner = (id: string): string | null => (id.endsWith("-sign") ? id.slice(0, -"-sign".length) : null);

/** Every handle a learner could press: each node, plus each minus sign. */
export function handles(state: MathState): string[] {
  return state.sides.flatMap(allNodes).flatMap((n) => (n.kind === "neg" ? [n.id, signId(n.id)] : [n.id]));
}

/** Give a node a different id, so it takes over the identity of e.g. the dragged node. */
export function adopt(e: Expr, id: string): Expr {
  return { ...e, id };
}

export function without<T>(xs: T[], i: number): T[] {
  return xs.filter((_, j) => j !== i);
}

export function moveItem<T>(xs: T[], from: number, to: number): T[] {
  const out = without(xs, from);
  out.splice(to, 0, xs[from]);
  return out;
}

export const siblings = (c: DragCtx) => (c.parent ? children(c.parent) : []);
