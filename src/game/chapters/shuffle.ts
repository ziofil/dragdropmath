/**
 * Rearranging terms: one chapter, its lesson (a board per move) and its
 * practice, walked back from a tidy answer (../generate/walk.ts): its number
 * split into numbers to add, or written as a product to work out, the pieces
 * put anywhere among the terms.
 */
import type { Chapter } from "../puzzles";
import { type Walk, walked } from "../generate/walk";
import { productCoef, splitLike, termMoved } from "../generate/backs";
import { one, poly, type Rng, type Level, type Shape, letter } from "../generate/write";
import { d } from "../generate/drill";

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

const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
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

const levels = (): Record<Level, Shape[]> => ({
  easy: walks.easy.map((w) => walked(w, "shuffle")),
  medium: walks.medium.map((w) => walked(w, "shuffle")),
  hard: walks.hard.map((w) => walked(w, "shuffle")),
});

export const shuffle: Chapter = {
  id: "shuffle",
  title: "Rearranging terms",
  blurb: "Terms can be added in any order, and plain numbers can be worked out.",
  after: [],
  unlocks: ["commute", "combine", "multiply-numbers", "numbers-first", "multiply-out"],
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    // Now and then with a minus: it goes along with its term (7 − x → −x + 7).
    d("commute", (r) => `${r.int(2, 9)} ${r.next() < 0.4 ? "-" : "+"} ${letter(r)}`),
    d("combine", (r) => `${r.int(2, 9)} + ${letter(r)} + ${r.int(2, 9)}`),
    d("multiply-numbers", (r) => `${r.int(2, 5)}·${letter(r)}·${r.int(2, 5)}`),
    d("numbers-first", (r) => `${letter(r)}·${r.int(2, 9)}`),
    d("multiply-out", (r) => `${r.int(2, 6)}·${r.int(2, 6)} + ${letter(r)}`),
  ],
  stepsBack: () => [splitLike(12, true), productCoef()],
  levels,
};
