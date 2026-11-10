import type { Expr } from "../expr/types";
import { frac, num, prod } from "../expr/build";
import { key } from "../expr/key";
import { buildTerm, splitCoef } from "./monomial";
import { dragCtx, replaceIn, without, type Candidate, type Rule } from "./types";
import { parentLoc, nodeAt } from "../expr/tree";

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** 8/2 → 4, 6/4 → 3/2, 6x/3 → 2x (drop the denominator onto the numerator). */
export const divideNumbers: Rule = {
  id: "divide-numbers",
  name: "Divide numbers",
  gesture: "Drop a number on the bottom of a fraction onto the number on top.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "frac" || c.index !== 1 || c.node.kind !== "num") return [];
    const f = c.parent;
    const d = c.node.value;
    const m = splitCoef(f.num);
    const g = gcd(m.coef, d);
    if (g <= 1 || m.coefId === undefined) return [];
    const top = buildTerm({ ...m, coef: m.coef / g });
    const result: Expr = d / g === 1 ? top : frac(top, num(d / g, c.node.id), f.id);
    return [{ rule: "divide-numbers", state: replaceIn(state, c.parentLoc!, result), targetId: m.coefId }];
  },
};

/** ab/b → a (drop a factor on the bottom onto the same factor on top). */
export const cancelFactor: Rule = {
  id: "cancel-factor",
  name: "Cancel a common factor",
  gesture: "Drop a factor onto the same factor across the fraction bar — both disappear.",
  apply(state, id) {
    // (2·3)/(2·5) → 3/5: drag either 2 onto the other, top → bottom or bottom → top.
    const c = dragCtx(state, id);
    if (!c) return [];
    // The dragged node is the whole top/bottom, or one factor of it.
    let partLoc = c.loc;
    const up = parentLoc(partLoc);
    if (up && nodeAt(state, up).kind === "prod") partLoc = up;
    const fracLoc = parentLoc(partLoc);
    if (!fracLoc) return [];
    const f = nodeAt(state, fracLoc);
    if (f.kind !== "frac") return [];
    const fromBottom = partLoc.path[partLoc.path.length - 1] === 1;
    const [mine, theirs] = fromBottom ? [f.den, f.num] : [f.num, f.den];

    const k = key(c.node);
    const removeOne = (e: Expr, pick: (x: Expr) => boolean): Expr | null => {
      if (pick(e)) return num(1);
      if (e.kind !== "prod") return null;
      const i = e.factors.findIndex(pick);
      return i < 0 ? null : prod(without(e.factors, i), e.id);
    };
    const otherFactors = theirs.kind === "prod" ? theirs.factors : [theirs];
    return otherFactors.flatMap((t): Candidate[] => {
      if (key(t) !== k) return [];
      const kept = removeOne(theirs, (x) => x.id === t.id)!;
      const left = removeOne(mine, (x) => x.id === c.node.id)!;
      const [top, bottom] = fromBottom ? [kept, left] : [left, kept];
      return [{ rule: "cancel-factor", state: replaceIn(state, fracLoc, frac(top, bottom, f.id)), targetId: t.id }];
    });
  },
};
