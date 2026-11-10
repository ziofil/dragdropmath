import type { Expr } from "../expr/types";
import { neg, num, prod } from "../expr/build";
import { key } from "../expr/key";

/**
 * A term seen as coefficient × rest, e.g. −3·x·y → { coef: −3, rest: [x, y] }.
 * `coefId` is the id of the number glyph carrying the coefficient, if any,
 * so a merged term can keep showing "the same" number.
 */
export type Monomial = { coef: number; rest: Expr[]; coefId?: string };

export function splitCoef(t: Expr): Monomial {
  switch (t.kind) {
    case "neg": {
      const m = splitCoef(t.arg);
      return { ...m, coef: -m.coef };
    }
    case "num":
      return { coef: t.value, rest: [], coefId: t.id };
    case "prod": {
      const nums = t.factors.filter((f) => f.kind === "num");
      return {
        coef: nums.reduce((a, f) => a * (f.kind === "num" ? f.value : 1), 1),
        rest: t.factors.filter((f) => f.kind !== "num"),
        coefId: nums[0]?.id,
      };
    }
    default:
      return { coef: 1, rest: [t] };
  }
}

export const restKey = (m: Monomial) => key(prod(m.rest), false);

export function buildTerm(m: Monomial): Expr {
  if (m.coef === 0) return num(0);
  const abs = Math.abs(m.coef);
  const core =
    m.rest.length === 0
      ? num(abs, m.coefId)
      : abs === 1
        ? m.rest.length === 1
          ? m.rest[0]
          : prod(m.rest)
        : prod([num(abs, m.coefId), ...m.rest]);
  return m.coef < 0 ? neg(core) : core;
}
