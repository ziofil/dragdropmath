import { frac, num } from "../expr/build";
import { key } from "../expr/key";
import { dragCtx, replaceIn, type Candidate, type Rule } from "./types";
import { fractionOf, rebuildTerm } from "./view";

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/**
 * 8/2 → 4, 6/4 → 3/2, 6x/(3y) → 2x/y (drop a number on the bottom onto a
 * number on top: both are divided by what they share). The top includes
 * whatever multiplies the fraction: 6·(x/3) → 2x.
 */
export const divideNumbers: Rule = {
  id: "divide-numbers",
  name: "Divide numbers",
  gesture: "Drop a number on the bottom of a fraction onto a number on top.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const h = fractionOf(state, id);
    if (c?.node.kind !== "num" || c.node.value === 0 || !h || h.onTop) return [];
    const d = c.node;
    const { view } = h;
    return view.top.flatMap((t): Candidate[] => {
      const g = t.kind === "num" ? gcd(t.value, d.value) : 1;
      if (t.kind !== "num" || g <= 1) return [];
      // A top number that comes out 1 goes, unless it's all there is (1/2).
      const top = view.top.flatMap((x) => (x !== t ? [x] : t.value / g === 1 && view.top.length > 1 ? [] : [num(t.value / g, t.id)]));
      const bottom = view.bottom.flatMap((x) => (x.id !== d.id ? [x] : d.value / g === 1 ? [] : [num(d.value / g, d.id)]));
      return [{ rule: "divide-numbers", state: replaceIn(state, h.loc, rebuildTerm(view, top, bottom)), targetId: t.id }];
    });
  },
};

/** 8/2 → 4, 2/4 → 1/2: tap the fraction bar to work it out, or to simplify it when it doesn't come out whole. */
export const evaluateFraction: Rule = {
  id: "evaluate-fraction",
  name: "Work out a fraction",
  gesture: "Tap the bar of a fraction of two numbers to work it out (8/2 → 4), or to simplify it (2/4 → 1/2).",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    const f = c?.node;
    if (!c || f?.kind !== "frac" || f.num.kind !== "num" || f.den.kind !== "num" || f.den.value === 0) return [];
    const [p, q] = [f.num.value, f.den.value];
    if (Number.isInteger(p / q)) return [{ rule: "evaluate-fraction", state: replaceIn(state, c.loc, num(p / q, f.id)) }];
    const g = gcd(p, q);
    if (g <= 1) return [];
    return [{ rule: "evaluate-fraction", state: replaceIn(state, c.loc, frac(num(p / g, f.num.id), num(q / g, f.den.id), f.id)) }];
  },
};

/**
 * ab/b → a, (2·3)/(2·5) → 3/5, 3·(x/3) → x (drop a factor onto the same
 * factor across the bar, either way: both go).
 */
export const cancelFactor: Rule = {
  id: "cancel-factor",
  name: "Cancel a common factor",
  gesture: "Drop a factor onto the same factor across the fraction bar — both disappear.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const h = fractionOf(state, id);
    if (!c || !h) return [];
    const { view } = h;
    const [mine, theirs] = h.onTop ? [view.top, view.bottom] : [view.bottom, view.top];
    // The piece is one factor of its side, or (a whole top or bottom of several factors) all of it.
    const left = mine.some((x) => x.id === c.node.id) ? mine.filter((x) => x.id !== c.node.id) : [];
    return theirs.flatMap((t): Candidate[] => {
      if (key(t) !== key(c.node)) return [];
      const kept = theirs.filter((x) => x !== t);
      const [top, bottom] = h.onTop ? [left, kept] : [kept, left];
      return [{ rule: "cancel-factor", state: replaceIn(state, h.loc, rebuildTerm(view, top, bottom)), targetId: t.id }];
    });
  },
};
