/**
 * Moves between equations shown as rows: substituting one equation into
 * another.
 */
import type { Expr } from "../expr/types";
import { cloneFresh } from "../expr/build";
import { allNodes, children, withChildren } from "../expr/tree";
import { dragCtx, partner, setSides, type Candidate, type Rule } from "./types";

/**
 * y = 2x and x + y = 9 → x + 2x = 9: a letter that one equation gives alone
 * can be swapped, everywhere else, for what it equals. Drag the letter onto
 * one of its uses in another equation.
 */
export const substitute: Rule = {
  id: "substitute",
  name: "Substitute",
  gesture: "In y = 2x, drag the y onto a y in the other equation: it becomes 2x there.",
  apply(state, id) {
    if (state.join !== "and" || state.sides.length < 4) return [];
    const c = dragCtx(state, id);
    if (!c || c.loc.path.length !== 0 || c.node.kind !== "var") return [];
    const name = c.node.name;
    const value = state.sides[partner(c.loc.side)];
    if (allNodes(value).some((n) => n.kind === "var" && n.name === name)) return [];
    const row = c.loc.side >> 1;
    return state.sides.flatMap((s, i): Candidate[] => {
      if (i >> 1 === row) return [];
      return allNodes(s)
        .filter((n) => n.kind === "var" && n.name === name)
        .map((target) => {
          const sides = state.sides.slice();
          sides[i] = replaceNode(s, target.id, cloneFresh(value));
          return { rule: "substitute", state: { ...setSides(sides), rel: state.rel, join: state.join }, targetId: target.id };
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
