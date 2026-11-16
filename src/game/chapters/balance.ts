/**
 * Solving equations: one chapter, its lesson (a board per move) and its
 * practice. Equations come after the expression chapters, so they use them
 * all: most are composed (../generate/compose.ts), layers of fractions,
 * roots, squares, logs and powers around x with pieces disguised; the rest
 * are recipes a teacher would write (../generate/linear.ts, equations.ts): x
 * on both sides in brackets, x over two bottoms, answers with e and ln in them.
 */
import * as L from "../generate/linear";
import * as E from "../generate/equations";
import { type Chapter, rulesOf } from "../puzzles";
import { composed } from "../generate/compose";
import { fractionCoefficient, rootCoefficient } from "../generate/coefficients";
import { letter, type Level, type Shape, one as pick } from "../generate/write";
import { d, carrying } from "../generate/drill";

const shape = (rc: L.Recipe) => L.shapeOf(rc, { letter: LETTERED.has(rc) ? letter : undefined });
/** Mostly x; these now and then with another letter, as the hand-made ones were. */
const LETTERED = new Set([E.expEquals, E.cancelEquals, E.logSumEquals, E.logWithE, E.rootsSumEquals, E.splitLog, E.sameBaseProduct]);

const levels = (): Record<Level, Shape[]> => ({
  easy: [
    ...[L.oneStep, L.timesX, L.twoStep, L.overPlus, L.bracketX, L.bothSides, L.bracketPlus, E.fractionEquals, E.wholeEquals, E.expEquals].map(shape),
    composed("easy", () => rulesOf("balance"), false, 8),
  ],
  medium: [
    ...[L.bracketsBoth, L.minusBracket, L.fraction, L.bracketsAndX, L.minusTimesBracket, L.twoFractions, L.fractionsAx, L.nested, L.bracketOver].map(shape),
    ...[E.cancelEquals, E.letterUnlikeEquals, E.squareOfTimesRoot, E.rootsSumEquals, E.sameBaseProduct, E.logSumEquals, E.logWithE, E.isolateExp, E.isolateLn, E.splitLog].map(shape),
    fractionCoefficient,
    composed("medium", () => rulesOf("balance"), false, 19),
  ],
  // Brackets inside brackets, squares that cancel, logs of quotients.
  hard: [...[L.nestedBrackets, L.bracketInFraction, L.squareExpand, L.bracketsSquare, E.logOfQuotient, E.powersInLogs].map(shape), rootCoefficient, composed("hard", () => rulesOf("balance"), false, 12)],
});

export const balance: Chapter = {
  id: "balance",
  title: "Solving equations",
  blurb: "Do the same thing to both sides and the equation stays true. Whatever moves across the = does the opposite on the other side: a plus becomes a minus, a times becomes a divide, a root becomes a power, a log becomes a power.",
  after: ["explog"],
  unlocks: ["move-term", "swap-sides", "move-factor", "move-denominator", "move-sign", "root-across", "exp-across", "move-exponent-term", "log-across"],
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    carrying("number", d("move-term", (r) => {
      const [x, a, b] = [letter(r), r.int(2, 9), r.int(10, 20)];
      return { start: `${x} + ${a} = ${b}`, want: x, goal: `${x} = ${b - a}` };
    })),
    d("move-factor", (r) => {
      const [x, a, k] = [letter(r), r.int(2, 9), r.int(2, 6)];
      return { start: `${a}${x} = ${a * k}`, want: x, goal: `${x} = ${k}` };
    }),
    d("move-denominator", (r) => {
      const [x, a, b] = [letter(r), r.int(2, 9), r.int(2, 9)];
      return { start: `${x}/${a} = ${b}`, want: x, goal: `${x} = ${a * b}` };
    }),
    d("move-sign", (r) => `-${letter(r)} = ${r.int(2, 9)}`),
    d("swap-sides", (r) => `${r.int(2, 20)} = ${letter(r)}`),
    d("root-across", (r) => {
      const [x, n, b] = [letter(r), pick(r, [2, 2, 3, 4]), r.int(2, 4)];
      return { start: `${x}^(1/${n}) = ${b}`, want: x, goal: `${x} = ${b ** n}` };
    }),
    d("exp-across", (r) => `${pick(r, ["e", "2", "3", "10"])}^${letter(r)} = ${r.int(5, 20)}`),
    // Both sides powers of the same base: the exponents balance like the sides do.
    d("move-exponent-term", (r) => {
      const [x, b, a, k] = [letter(r), pick(r, [2, 3]), r.int(1, 5), r.int(2, 4)];
      return { start: `${b}^(${x} - ${a}) = ${b}^${k}`, goal: `${b}^${x} = ${b}^(${k} + ${a})` };
    }),
    d("log-across", (r) => {
      const x = letter(r);
      if (r.next() < 0.5) return `ln(${x}) = ${r.int(2, 9)}`;
      const [b, k] = [r.int(2, 3), r.int(2, 3)];
      return { start: `log_${b}(${x}) = ${k}`, want: x, goal: `${x} = ${b ** k}` };
    }),
  ],
  levels,
};
