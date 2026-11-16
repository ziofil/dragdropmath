/**
 * Collecting like terms, walked back from a tidy answer (see walk.ts): its
 * terms split into like ones, pairs that cancel put in, numbers written as
 * products — anywhere, in any order.
 */
import type { MathState } from "../../../expr/types";
import type { Walk } from "../walk";
import { productCoef, splitLike, zeroPair } from "../backs";
import { one, poly, shuffled, type Rng } from "../write";

const c = (r: Rng, max = 9) => r.signed(1, max);

/** At most `n` terms to start with. */
const upTo = (n: number) => (s: MathState) => (s.sides[0].kind === "sum" ? s.sides[0].terms.length : 1) <= n;

/**
 * An answer of `n` unlike terms, in the order a person writes them: `kinds`
 * is that order (squares and products first, then letters), a number last.
 */
function answer(r: Rng, kinds: readonly string[], n: number, number = true): string {
  const keep = new Set(shuffled(r, kinds).slice(0, n - (number ? 1 : 0)));
  const ms = kinds.filter((k) => keep.has(k));
  // Starting with a plus, as answers mostly do (−2x + 3, not − 2x − 3... both happen; a leading minus less often).
  const cs = ms.map((_, i) => (i === 0 && r.next() < 0.8 ? r.int(1, 9) : c(r)));
  return poly([...ms.map((m, i): [number, string] => [cs[i], m]), ...(number ? [[c(r), ""] as [number, string]] : [])]);
}

export const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [
    {
      id: "walk-one-letter",
      name: "one letter's terms and a number, split and mixed",
      answer: (r) => answer(r, [one(r, ["x", "y", "a", "t"])], 2),
      back: [splitLike(), productCoef()],
      steps: [2, 3],
      fits: upTo(5),
      needs: ["combine"],
    },
    {
      id: "walk-two-letters",
      name: "two letters' terms, split and mixed",
      answer: (r) => answer(r, one(r, [["x", "y"], ["a", "b"]]), 2, false),
      back: [splitLike(), productCoef()],
      steps: [2, 3],
      fits: upTo(5),
      needs: ["combine"],
    },
  ],
  medium: [
    {
      id: "walk-letters-number",
      name: "two letters and a number, split, cancelling and mixed",
      answer: (r) => answer(r, ["x", "y"], 3),
      back: [splitLike(), zeroPair(), productCoef()],
      steps: [3, 4],
      fits: upTo(6),
      needs: ["combine"],
    },
    {
      id: "walk-square",
      name: "a square, its letter and a number",
      answer: (r) => answer(r, ["x^2", "x"], 3),
      back: [splitLike(), zeroPair(), productCoef()],
      steps: [3, 4],
      fits: upTo(6),
      needs: ["combine"],
    },
  ],
  hard: [
    {
      id: "walk-products-of-letters",
      name: "products of letters, single letters and numbers",
      answer: (r) => answer(r, ["x*y", "x", "y"], r.int(3, 4)),
      back: [splitLike(), zeroPair(), productCoef()],
      steps: [4, 5],
      fits: upTo(8),
      needs: ["combine"],
    },
    {
      id: "walk-squares",
      name: "squares, letters and numbers",
      answer: (r) => answer(r, ["x^2", "y^2", "x", "y"], r.int(3, 4)),
      back: [splitLike(), zeroPair(), productCoef()],
      steps: [4, 5],
      fits: upTo(8),
      needs: ["combine"],
    },
  ],
};
