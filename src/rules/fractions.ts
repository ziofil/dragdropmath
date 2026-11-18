/**
 * Simplifying a fraction is done by hand, a factor at a time: a factor of the
 * whole top dropped onto an equal factor of the whole bottom (or the other
 * way round) cancels with it; dropped onto a power of the same base, the
 * exponents subtract. Numbers that only share a factor are split first
 * (tapping 8 of 8x/12 shows 4·2: split-number), so the 4s can cancel.
 * Nothing simplifies by tapping the bar.
 */
import { negate, pow, sum } from "../expr/build";
import { key } from "../expr/key";
import type { Expr, MathState } from "../expr/types";
import { replaceIn, type Candidate, type Rule } from "./types";
import { asPower } from "./shapes";
import { fractionOf, rebuildTerm } from "./view";

/** Piece `id` as one factor of a whole top or bottom, with the fraction it's in and the factors across the bar. */
function acrossBar(state: MathState, id: string) {
  const h = fractionOf(state, id);
  if (!h) return null;
  const { view, onTop } = h;
  const mine = onTop ? view.top : view.bottom;
  const i = mine.findIndex((f) => f.id === id);
  if (i < 0 || !view.frac) return null;
  return { ...h, node: mine[i], others: onTop ? view.bottom : view.top };
}

const isZero = (e: Expr) => e.kind === "num" && e.value === 0;

/**
 * (3x)/3 → x, (x + 1)/(2(x + 1)) → 1/2, 3·(x/3) → x (drop a factor of the
 * whole top onto an equal factor of the whole bottom, or the other way round:
 * both go). In (3x + 1)/3 the 3 multiplies only part of the top: nothing cancels.
 */
export const cancelFactor: Rule = {
  id: "cancel-factor",
  name: "Cancel a common factor",
  gesture: "Drop a factor of the whole top onto the same factor of the whole bottom (or the other way round): both cancel.",
  apply(state, id) {
    const a = acrossBar(state, id);
    if (!a || isZero(a.node)) return [];
    const { view, onTop, node } = a;
    return a.others.flatMap((o): Candidate[] => {
      if (key(o) !== key(node)) return [];
      const top = view.top.filter((f) => f.id !== (onTop ? node.id : o.id));
      const bottom = view.bottom.filter((f) => f.id !== (onTop ? o.id : node.id));
      return [{ rule: "cancel-factor", state: replaceIn(state, a.loc, rebuildTerm(view, top, bottom)), targetId: o.id }];
    });
  },
};

/**
 * x⁵/x² → x^(5 − 2) (drop a power on the bottom onto one of the same base on
 * top: the exponents subtract, and the learner works 5 − 2 out). Dropped the
 * other way, onto the bottom's power, it lands there: x^(2 − 5) underneath.
 * The very same power cancels instead (cancel-factor).
 */
export const dividePowers: Rule = {
  id: "divide-powers",
  name: "Same base: subtract exponents",
  gesture: "Drop a power across the fraction bar onto a power of the same base: the exponents subtract.",
  apply(state, id) {
    const a = acrossBar(state, id);
    if (!a) return [];
    const { view, node } = a;
    const mine = asPower(node);
    return a.others.flatMap((o): Candidate[] => {
      const theirs = asPower(o);
      if (key(theirs.base) !== key(mine.base) || key(o) === key(node) || (o.kind !== "pow" && node.kind !== "pow") || o.kind === "num") return [];
      // What it's dropped on keeps its place: its exponent less the carried one.
      const merged = o.kind === "pow" ? pow(o.base, sum([theirs.exp, negate(mine.exp)]), o.id) : pow(o, sum([theirs.exp, negate(mine.exp)]));
      const swap = (fs: Expr[]) => fs.flatMap((f) => (f.id === node.id ? [] : f.id === o.id ? [merged] : [f]));
      return [{ rule: "divide-powers", state: replaceIn(state, a.loc, rebuildTerm(view, swap(view.top), swap(view.bottom))), targetId: o.id }];
    });
  },
};
