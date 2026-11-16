/**
 * Rearranging terms, walked back from a tidy answer (see walk.ts): its number
 * split into numbers to add, or written as a product to work out, the pieces
 * put anywhere among the terms.
 */
import type { Walk } from "../walk";
import { productCoef, splitLike } from "../backs";
import { one, poly, type Rng } from "../write";

const BACK = [splitLike(12, true), productCoef()];

const walk = (id: string, name: string, answer: (r: Rng) => string, steps: [number, number]): Walk => ({
  id,
  name,
  answer,
  back: BACK,
  steps,
  needs: ["combine", "multiply-numbers", "multiply-out"],
});

export const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [walk("walk-numbers", "a letter and numbers to add up", (r) => poly([[r.int(1, 5), one(r, ["x", "y", "a", "t"])], [r.int(2, 20), ""]]), [1, 2])],
  medium: [walk("walk-letters-numbers", "letters, numbers to add and products", (r) => poly([[r.int(1, 5), "x"], [r.int(1, 5), "y"], [r.int(2, 20), ""]]), [2, 3])],
  hard: [walk("walk-long", "a long row of letters and numbers", (r) => poly([[r.int(1, 5), "a"], [r.int(1, 5), "b"], [r.int(1, 5), "c"], [r.signed(2, 20), ""]]), [3, 4])],
};
