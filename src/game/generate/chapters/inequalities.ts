/**
 * Inequalities: solved like equations (the same recipes, ../linear.ts),
 * the sign turning round where a negative multiplies or divides, or the
 * sides swap. About half composed (../compose.ts); more at Hard.
 */
import { composed } from "../compose";
import { rulesOf } from "../../puzzles";
import * as L from "../linear";
import type { Level, Shape } from "../write";

const shape = (rc: L.Recipe, id?: string) => L.shapeOf(rc, { ineq: true, letter: L.ineqLetter, id });
const rules = () => rulesOf("inequalities");

export const shapes: Record<Level, Shape[]> = {
  easy: [shape(L.oneStep, "add"), ...[L.timesX, L.divided, L.twoStep, L.overPlus, L.bracketX, L.bothSides].map((rc) => shape(rc)), composed("easy", rules, true, 7)],
  medium: [...[L.bracketsBoth, L.bracketLess, L.minusInFront].map((rc) => shape(rc)), composed("medium", rules, true, 5)],
  // Brackets inside brackets, squares that cancel.
  hard: [...[L.nestedBrackets, L.bracketInFraction, L.squareExpand, L.bracketsSquare].map((rc) => shape(rc)), composed("hard", rules, true, 8)],
};
