import { frac, num } from "../expr/build";
import { key } from "../expr/key";
import type { Expr, MathState } from "../expr/types";
import { dragCtx, replaceIn, type Rule } from "./types";
import { fractionOf, rebuildTerm } from "./view";

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** The fraction tapped (its bar), seen whole: with whatever multiplies it (6·(x/3) is 6x over 3). */
function tappedFraction(state: MathState, id: string) {
  const c = dragCtx(state, id);
  if (c?.node.kind !== "frac") return null;
  return fractionOf(state, c.node.num.id);
}

/**
 * 6x/(3y) → 2x/y, 16x/12 → 4x/3 (tap the fraction bar: numbers on top and
 * bottom are divided by what they share). Simplifying is always a tap on the
 * bar; dropping a piece across it multiplies top and bottom (expand-fraction).
 */
export const divideNumbers: Rule = {
  id: "divide-numbers",
  name: "Divide numbers",
  gesture: "Tap the fraction bar: numbers on top and bottom are divided by what they share.",
  tap: true,
  tapOrder: 0.4,
  apply(state, id) {
    const h = tappedFraction(state, id);
    if (!h) return [];
    const { view } = h;
    const top = [...view.top];
    const bottom = [...view.bottom];
    let any = false;
    for (let j = 0; j < bottom.length; j++) {
      const d = bottom[j];
      if (d.kind !== "num" || d.value === 0) continue;
      for (let i = 0; i < top.length; i++) {
        const t = top[i];
        if (t.kind !== "num") continue;
        const g = gcd(t.value, (bottom[j] as Extract<Expr, { kind: "num" }>).value);
        if (g <= 1) continue;
        top[i] = num(t.value / g, t.id);
        bottom[j] = num((bottom[j] as Extract<Expr, { kind: "num" }>).value / g, d.id);
        any = true;
      }
    }
    if (!any) return [];
    // A number that came out 1 goes (unless it's all there is on top: 1/2).
    const ones = (xs: Expr[], keepOne: boolean) => {
      const out = xs.filter((x) => !(x.kind === "num" && x.value === 1));
      return out.length || !keepOne ? out : [num(1)];
    };
    return [{ rule: "divide-numbers", state: replaceIn(state, h.loc, rebuildTerm(view, ones(top, true), ones(bottom, false))) }];
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
 * ab/b → a, (2·3)/(2·5) → 3/5, 3·(x/3) → x, (x + 1)/(2(x + 1)) → 1/2 (tap the
 * fraction bar: whatever the top and bottom share cancels).
 */
export const cancelFactor: Rule = {
  id: "cancel-factor",
  name: "Cancel a common factor",
  gesture: "Tap the fraction bar: the factors the top and bottom share cancel.",
  tap: true,
  tapOrder: 0.2,
  apply(state, id) {
    const h = tappedFraction(state, id);
    if (!h) return [];
    const { view } = h;
    const top = [...view.top];
    const bottom = [...view.bottom];
    let any = false;
    for (let i = 0; i < top.length; i++) {
      const j = bottom.findIndex((b) => key(b) === key(top[i]));
      if (j < 0) continue;
      top.splice(i, 1);
      bottom.splice(j, 1);
      i--;
      any = true;
    }
    if (!any) return [];
    return [{ rule: "cancel-factor", state: replaceIn(state, h.loc, rebuildTerm(view, top, bottom)) }];
  },
};
