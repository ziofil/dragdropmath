/**
 * Moves between equations shown as rows: substituting one equation into
 * another.
 */
import type { Expr } from "../expr/types";
import { cloneFresh, freshId } from "../expr/build";
import { allNodes, children, withChildren } from "../expr/tree";
import { adopt, dragCtx, setSides, type Candidate, type Rule } from "./types";
import { partner, rowCount, rowOf } from "../expr/rows";

/**
 * y = 2x and x + y = 9 → x + 2x = 9: a letter that one equation gives alone
 * can be swapped, everywhere else, for what it equals. Drag the letter onto
 * one of its uses in another equation.
 */
export const substitute: Rule = {
  id: "substitute",
  either: true,
  name: "Substitute",
  gesture: "In y = 2x, drag the y onto a y in the other equation: it becomes 2x there.",
  apply(state, id) {
    if (state.join !== "and" || rowCount(state) < 2) return [];
    const c = dragCtx(state, id);
    if (!c || c.loc.path.length !== 0 || c.node.kind !== "var") return [];
    const name = c.node.name;
    const value = state.sides[partner(c.loc.side)];
    if (allNodes(value).some((n) => n.kind === "var" && n.name === name)) return [];
    const row = rowOf(c.loc.side);
    return state.sides.flatMap((s, i): Candidate[] => {
      if (rowOf(i) === row) return [];
      return allNodes(s)
        .filter((n) => n.kind === "var" && n.name === name)
        .map((target) => {
          const sides = state.sides.slice();
          // The x there turns into the value right where it is (x → 4 in
          // place: the value keeps the target's identity, and nothing flies
          // over from the other equation)…
          sides[i] = replaceNode(s, target.id, adopt(cloneFresh(value, false), target.id));
          // …and the carried x is absorbed into it, while the x of x = 4 stays
          // where it was (a piece of its own, so the carried one doesn't fly back).
          sides[c.loc.side] = { ...c.node, id: freshId() };
          return { rule: "substitute", state: setSides(sides), targetId: target.id };
        });
    });
  },
};

/** `e` with node `id` replaced by `by`. */
function replaceNode(e: Expr, id: string, by: Expr): Expr {
  if (e.id === id) return by;
  const kids = children(e);
  return kids.length
    ? withChildren(
        e,
        kids.map((k) => replaceNode(k, id, by)),
      )
    : e;
}
