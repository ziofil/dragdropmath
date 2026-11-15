/**
 * Solving equations. They come after the expression chapters, so they use
 * them all: most are composed (../compose.ts), layers of fractions, roots,
 * squares, logs and powers around x with pieces disguised; the rest are
 * recipes a teacher would write (../linear.ts, ../equations.ts): x on both
 * sides in brackets, x over two bottoms, answers with e and ln in them.
 */
import { composed } from "../compose";
import { rulesOf } from "../../puzzles";
import * as L from "../linear";
import * as E from "../equations";
import { letter, type Level, type Shape } from "../write";

const shape = (rc: L.Recipe) => L.shapeOf(rc, { letter: LETTERED.has(rc) ? letter : undefined });
/** Mostly x; these now and then with another letter, as the hand-made ones were. */
const LETTERED = new Set([E.expEquals, E.cancelEquals, E.logSumEquals, E.logWithE, E.rootsSumEquals, E.splitLog, E.sameBaseProduct]);

export const shapes: Record<Level, Shape[]> = {
  easy: [
    ...[L.oneStep, L.timesX, L.twoStep, L.overPlus, L.bracketX, L.bothSides, L.bracketPlus, E.fractionEquals, E.wholeEquals, E.expEquals].map(shape),
    composed("easy", () => rulesOf("balance"), false, 8),
  ],
  medium: [
    ...[L.bracketsBoth, L.minusBracket, L.fraction, L.bracketsAndX, L.minusTimesBracket, L.twoFractions, L.fractionsAx, L.nested, L.bracketOver].map(shape),
    ...[E.cancelEquals, E.letterUnlikeEquals, E.squareOfTimesRoot, E.rootsSumEquals, E.sameBaseProduct, E.logSumEquals, E.logWithE, E.isolateExp, E.isolateLn, E.splitLog].map(shape),
    composed("medium", () => rulesOf("balance"), false, 19),
  ],
  // Brackets inside brackets, squares that cancel, logs of quotients.
  hard: [...[L.nestedBrackets, L.bracketInFraction, L.squareExpand, L.bracketsSquare, E.logOfQuotient, E.powersInLogs].map(shape), composed("hard", () => rulesOf("balance"), false, 12)],
};
