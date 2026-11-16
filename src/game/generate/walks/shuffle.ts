/**
 * Rearranging terms, walked back from a tidy answer (see walk.ts): its number
 * split into numbers to add, or written as a product to work out, the pieces
 * put anywhere among the terms.
 */
import type { Walk } from "../walk";
import { productCoef, splitLike, termMoved } from "../backs";
import { one, poly, type Rng } from "../write";

const BACK = [splitLike(12, true), productCoef()];

const walk = (id: string, name: string, answer: (r: Rng) => string, steps: [number, number]): Walk => ({
  id,
  name,
  answer,
  back: BACK,
  steps,
  // The letters' terms aren't left at the front: one goes somewhere among the numbers.
  last: termMoved(),
  needs: ["combine", "multiply-numbers", "multiply-out"],
});

/** Letters with numbers in front (first ones mostly plain), a number last. */
const answer = (r: Rng, letters: readonly string[]) => poly([...letters.map((v): [number, string] => [r.int(1, 9), v]), [r.signed(2, 20), ""]]);

export const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [walk("walk-numbers", "a letter and numbers to add up", (r) => poly([[r.int(1, 5), one(r, ["x", "y", "a", "t"])], [r.int(2, 20), ""]]), [1, 3])],
  medium: [
    walk("walk-letters-numbers", "letters, numbers to add and products", (r) => answer(r, ["x", "y"]), [5, 6]),
    walk("walk-three-letters", "three letters, numbers to add and products", (r) => answer(r, ["a", "b", "c"]), [5, 6]),
  ],
  hard: [
    walk("walk-long", "a long row of letters and numbers", (r) => answer(r, ["a", "b", "c"]), [5, 9]),
    walk("walk-long-product", "a long row, with a product of letters", (r) => answer(r, one(r, [["a", "x*y", "z"], ["a*b", "c", "d"]])), [5, 9]),
  ],
};
