/**
 * Inequalities: one chapter, its lesson (a board per move) and its practice,
 * solved like equations (the same recipes, ../generate/linear.ts), the sign
 * turning round where a negative multiplies or divides, or the sides swap.
 * About half composed (../generate/compose.ts); more at Hard.
 */
import * as L from "../generate/linear";
import { type Chapter, rulesOf } from "../puzzles";
import { composed } from "../generate/compose";
import { type Level, type Shape, letter, one as pick } from "../generate/write";
import { d, carrying } from "../generate/drill";

const shape = (rc: L.Recipe, id?: string) => L.shapeOf(rc, { ineq: true, letter: L.ineqLetter, id });
const rules = () => rulesOf("inequalities");

const levels = (): Record<Level, Shape[]> => ({
  easy: [shape(L.oneStep, "add"), ...[L.timesX, L.divided, L.twoStep, L.overPlus, L.bracketX, L.bothSides].map((rc) => shape(rc)), composed("easy", rules, true, 7)],
  medium: [...[L.bracketsBoth, L.bracketLess, L.minusInFront].map((rc) => shape(rc)), composed("medium", rules, true, 5)],
  // Brackets inside brackets, squares that cancel.
  hard: [...[L.nestedBrackets, L.bracketInFraction, L.squareExpand, L.bracketsSquare].map((rc) => shape(rc)), composed("hard", rules, true, 8)],
});

export const inequalities: Chapter = {
  id: "inequalities",
  title: "Inequalities",
  blurb:
    "Solve inequalities like equations, with one difference: multiplying or dividing by a negative number turns the sign round.",
  after: ["balance"],
  unlocks: [],
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    carrying("number", d("ineq-move-term", (r) => {
      const [x, a, b, rel] = [letter(r), r.int(2, 9), r.int(10, 20), pick(r, ["<", ">", "≤", "≥"])];
      return { start: `${x} + ${a} ${rel} ${b}`, want: x, goal: `${x} ${rel} ${b - a}` };
    }, "move-term")),
    d("ineq-move-factor", (r) => {
      const [x, a, k, rel] = [letter(r), r.int(2, 6), r.int(2, 6), pick(r, ["<", ">", "≤", "≥"])];
      return { start: `${a}${x} ${rel} ${a * k}`, want: x, goal: `${x} ${rel} ${k}` };
    }, "move-factor"),
    d("ineq-swap", (r) => `${r.int(2, 9)} ${pick(r, ["<", ">"])} ${letter(r)}`, "swap-sides"),
    d("ineq-sign", (r) => `-${letter(r)} ${pick(r, ["<", ">", "≤", "≥"])} ${r.int(2, 9)}`, "move-sign"),
  ],
  levels,
};
