/**
 * What a number shares that's worth showing when it's tapped (split-number),
 * in the one order every tap on a number goes by (docs/move-system.md): with
 * the numbers across the fraction bar, when it's a factor of a whole top or
 * bottom; else with the other terms of its sum. Writing it as a power of a
 * base (power-of-base) comes only after both.
 */
import type { Expr, MathState } from "../expr/types";
import { dragCtx } from "./types";
import { fractionOf, roleOf, viewTerm } from "./view";

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
/** The whole numbers among some factors, multiplied together. */
const numberIn = (fs: readonly Expr[]) => fs.reduce((k, f) => (f.kind === "num" && Number.isInteger(f.value) ? k * f.value : k), 1);

/**
 * The factor number `n` (piece `id`) shares that's worth showing, if any: with
 * the numbers across the bar (it a factor of a whole top or bottom), else with
 * the other terms of its sum. Only a proper factor (not 1, not n itself).
 */
export function sharedFactor(state: MathState, id: string, n: number): number | null {
  const proper = (g: number) => (g > 1 && g < n ? g : null);
  const h = fractionOf(state, id);
  if (h?.view.frac && (h.onTop ? h.view.top : h.view.bottom).some((f) => f.id === id)) {
    const g = proper(gcd(n, numberIn(h.onTop ? h.view.bottom : h.view.top)));
    if (g) return g;
  }
  const r = roleOf(state, termOf(state, id));
  if (r && (r.part === "term" || r.part === "body") && r.terms.length >= 2) {
    const others = r.terms.filter((_, i) => i !== r.index).map((t) => numberIn(viewTerm(t).top));
    return proper(others.reduce((g, k) => gcd(g, k), n));
  }
  return null;
}

/** The term of a sum a number in front belongs to (the 15x of the 15, through a minus), else the number itself. */
function termOf(state: MathState, id: string): string {
  let c = dragCtx(state, id);
  while (c?.parent && (c.parent.kind === "prod" || c.parent.kind === "neg")) c = dragCtx(state, c.parent.id);
  return c?.node.id ?? id;
}

