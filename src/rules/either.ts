/**
 * Equations with more than one answer: rows joined by "or" (x = 2 or
 * x = −3), each solved on its own.
 */
import type { Expr } from "../expr/types";
import { num, prod } from "../expr/build";
import { allNodes } from "../expr/tree";
import { dragCtx, type Rule } from "./types";
import { intoRows, isLeft, partner, rowOf } from "../expr/rows";

const hasLetter = (e: Expr) => allNodes(e).some((n) => n.kind === "var");

/**
 * (x − 2)(x + 3) = 0 → x − 2 = 0 or x + 3 = 0 (pull a factor down, off a
 * product equal to 0: a product is 0 only when one of its factors is). The
 * other half of never dividing by what might be 0.
 */
export const zeroProduct: Rule = {
  id: "zero-product",
  feel: { carry: "below" },
  name: "A product equal to 0",
  gesture: "Pull a factor down off a product equal to 0: that factor is 0, or the rest is.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (!c?.parent || (state.rel ?? "=") !== "=" || state.join === "and" || state.sides.length < 2) return [];
    // A factor of a whole side (or of a whole side under a minus).
    const P = c.parent;
    const pc = dragCtx(state, P.id);
    const whole = c.parentLoc!.path.length === 0 || (pc?.parent?.kind === "neg" && pc.parentLoc!.path.length === 0);
    if (P.kind !== "prod" || !whole) return [];
    const side = c.loc.side;
    const other = state.sides[partner(side)];
    if (other.kind !== "num" || other.value !== 0) return [];
    // Both the factor and what's left have letters: 3x = 0 is solved by moving the 3 across.
    const rest = P.factors.filter((f) => f.id !== c.node.id);
    const left = rest.length === 1 ? rest[0] : prod(rest);
    if (!hasLetter(c.node) || !hasLetter(left)) return [];
    const row = rowOf(side);
    const first = isLeft(side);
    const r = (e: Expr): [Expr, Expr] => (first ? [e, num(0)] : [num(0), e]);
    return [{ rule: "zero-product", state: intoRows(state, row, [r(c.node), r(left)]), carry: "below" }];
  },
};
