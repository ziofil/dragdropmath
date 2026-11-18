/**
 * What can be picked up, structurally (docs/move-system.md, "Pieces and
 * handles"): the handles a board has (every node, a minus sign by itself, a
 * +, − or · between two pieces), the bigger piece a quick press takes
 * instead, the pieces that are never handles (a root's √), and the products
 * nothing picks up as a whole. The press model (render/press.ts) adds only
 * where these are on screen.
 */
import type { Expr, MathState } from "../expr/types";
import { allNodes, locate, nodeAt, parentLoc } from "../expr/tree";

/**
 * A minus sign can be its own drag handle, separate from the term it negates:
 * in −x = 6 you carry just the −. Its handle id is derived from the neg node's.
 */
export const signId = (negId: string) => `${negId}-sign`;
export const signOwner = (id: string): string | null => (id.endsWith("-sign") ? id.slice(0, -"-sign".length) : null);

/**
 * An operator as a handle of its own: the + or − in front of a term of a sum,
 * or the · in front of a factor (where one is drawn). Tapping it works out the
 * two sides of it (rules/index.ts operatorTap). Its id is derived from the
 * piece after it.
 */
export const opId = (itemId: string) => `${itemId}-op`;
export const opOwner = (id: string): string | null => (id.endsWith("-op") ? id.slice(0, -"-op".length) : null);

/**
 * Where a · is drawn between two factors (elsewhere they're written side by
 * side): before a number (x·5), before or after a fraction (2·¾ is not 2¾),
 * and before a power of a number (2·3ˣ is not 23ˣ). A root reads fine without
 * one (2√3).
 */
export const dotBetween = (left: Expr, right: Expr) =>
  right.kind === "num" || right.kind === "frac" || left.kind === "frac" || (right.kind === "pow" && !right.radical && right.base.kind === "num");

/** Every handle a learner could press: each node, each minus sign, and each operator drawn between two pieces. */
export function handles(state: MathState): string[] {
  return state.sides.flatMap(allNodes).flatMap((n) => [
    n.id,
    ...(n.kind === "neg" ? [signId(n.id)] : []),
    ...(n.kind === "sum" ? n.terms.slice(1).map((t) => opId(t.id)) : []),
    ...(n.kind === "prod" ? n.factors.flatMap((f, i) => (i > 0 && dotBetween(n.factors[i - 1], f) ? [opId(f.id)] : [])) : []),
  ]);
}


/**
 * The bigger piece a quick press on `id` takes instead (holding still takes
 * `id` itself), or null if a quick press takes `id`. The one place this is
 * decided:
 *
 * - In a sum with others, its term: 3xy for the x of 3xy + 2, 2(x + 1) for
 *   its 2 or its bracket (side by side through factors, a minus, and a
 *   power's base: the x of 3x² is part of its term).
 * - A term of a sum that is an exponent (2^(x − 3)): the whole exponent (it
 *   has no brackets to press).
 * - Inside a fraction on top of or under another's bar: that fraction (the
 *   3 of 6/(3/6) takes 3/6).
 * - Set apart on screen — a fraction's top or bottom, an exponent, what a
 *   log or a root holds: nothing; it is pressed directly.
 *
 * Only a piece around that can itself be picked up takes the press (see
 * Moves.pressable).
 */
export function pieceAround(state: MathState, id: string): string | null {
  let loc = locate(state, id);
  while (loc && loc.path.length > 0) {
    const up = parentLoc(loc)!;
    const P = nodeAt(state, up);
    if (P.kind === "sum" && P.terms.length >= 2) {
      const t = nodeAt(state, loc).id;
      // An exponent written as a sum is pressed as a whole.
      const holder = up.path.length > 0 ? nodeAt(state, parentLoc(up)!) : null;
      if (t === id && holder?.kind === "pow" && up.path.at(-1) === 1) return P.id;
      return t === id ? null : t;
    }
    if (P.kind === "frac" && up.path.length > 0 && nodeAt(state, parentLoc(up)!).kind === "frac") return P.id;
    const besideIt = P.kind === "prod" || P.kind === "neg" || (P.kind === "pow" && !P.radical && loc.path.at(-1) === 0);
    if (!besideIt) return null;
    loc = up;
  }
  return null;
}


/** A root's exponent (drawn as the √) and everything inside it. */
export function rootParts(state: MathState): Set<string> {
  const out = new Set<string>();
  for (const n of state.sides.flatMap(allNodes)) {
    if (n.kind === "pow" && n.radical) for (const h of allNodes(n.exp)) out.add(h.id);
  }
  return out;
}


/**
 * A product nothing on screen picks up as a whole: no · drawn between its
 * factors, and not a term among others (where a quick press on any factor
 * takes it). 5(x − 9) alone on its side, the 2y of x²/(2y), the 3x of
 * y = 3x: a press on the 5 takes the 5. A move exists only where its piece
 * has a handle (docs/move-system.md).
 */
export function unheld(state: MathState, id: string): boolean {
  const loc = locate(state, id);
  const e = loc && nodeAt(state, loc);
  if (e?.kind !== "prod") return false;
  if (e.factors.some((f, i) => i > 0 && dotBetween(e.factors[i - 1], f))) return false;
  return pieceAround(state, e.factors[0].id) !== id;
}
