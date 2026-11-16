/**
 * Copies a move makes, and what they grow out of.
 *
 * A rule builds its result from the pieces it has: a piece used twice
 * (2(x + 1) → 2x + 2·1 uses the 2 twice) is a copy the second time, and a
 * piece made with `cloneFresh` says what it was copied from. The engine
 * settles both here, once for every move: each piece ends up with one id,
 * and the board records which new pieces grew out of which (`copies`), so
 * they fly out of their source when the move is drawn. The marks belong to
 * that one move only: they are not part of the setting and never reach the
 * next move.
 */
import { allNodes, children, withChildren } from "./tree";
import { freshId } from "./build";
import type { Expr, MathState } from "./types";

/**
 * `result` as a board: every id once (a piece used again becomes a copy of
 * it), no marks left in the tree, and `copies` naming what each new copy grew
 * out of. `before`: the board the move was made on (a mark on a piece that was
 * already there is an old one, and is dropped).
 */
export function settleCopies(result: MathState, before: MathState): MathState {
  const had = new Set(before.sides.flatMap(allNodes).map((n) => n.id));
  const seen = new Set<string>();
  const copies: Record<string, string> = {};
  const copyOf = (e: Expr): Expr => {
    const id = freshId();
    copies[id] = e.id;
    const { from: _from, ...rest } = e;
    void _from;
    return withChildren({ ...rest, id } as Expr, children(e).map(copyOf));
  };
  const visit = (e: Expr): Expr => {
    if (seen.has(e.id)) return copyOf(e);
    seen.add(e.id);
    const cs = children(e).map(visit);
    const changed = cs.some((c, i) => c !== children(e)[i]);
    if (e.from === undefined) return changed ? withChildren(e, cs) : e;
    if (!had.has(e.id)) copies[e.id] = e.from;
    const { from: _from, ...rest } = e;
    void _from;
    return withChildren(rest as Expr, cs);
  };
  const sides = result.sides.map(visit);
  const { copies: _old, ...rest } = result;
  void _old;
  return Object.keys(copies).length ? { ...rest, sides, copies } : { ...rest, sides };
}

/** The board without the last move's copy marks: a copy that goes now must not fly back into its source. */
export function withoutCopies(s: MathState): MathState {
  if (!s.copies) return s;
  const { copies: _c, ...rest } = s;
  void _c;
  return rest;
}
