/**
 * Simultaneous equations: one chapter, its lesson (a board per move) and its
 * practice — two letters, solved by substituting (../generate/systems.ts).
 * About half of each level is composed: one equation is one from the
 * earlier chapters — at Medium with a root, a log or a power in it; at Hard
 * a root, a log or a power, and a fraction.
 */
import { type Chapter, rulesOf } from "../puzzles";
import { composedSystem, SYSTEMS as S } from "../generate/systems";
import type { Level, Shape } from "../generate/write";
import { carrying, d } from "../generate/drill";

const rules = () => rulesOf("simultaneous");

const levels = (): Record<Level, Shape[]> => ({
  easy: [S.knownX, S.knownY, S.multiple, S.linear, S.takeAway, composedSystem({ first: "easy" }, "easy", rules, 5)],
  medium: [S.sumDifference, S.sumAndOther, S.bracketSub, S.minusBracket, composedSystem({ first: "medium", sub: "easy" }, "medium", rules, 4)],
  hard: [S.tidyFactor, S.tidyBracket, S.minusBracketSub, S.nestedThenSubstitute, composedSystem({ first: "hard", sub: "hard" }, "hard", rules, 4)],
});

export const simultaneous: Chapter = {
  id: "simultaneous",
  title: "Simultaneous equations",
  blurb: "Two equations with two unknowns, both true at the same time. Get one letter on its own in one equation, then substitute it into the other.",
  after: ["formulas"],
  unlocks: ["substitute"],
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    // 1. A letter on its own already: substitute it, and solve the equation that's left.
    carrying("alone", d("substitute", (r) => {
      const [a, k] = [r.int(2, 4), r.int(1, 5)];
      return {
        start: `y = ${a}x; x + y = ${(a + 1) * k}`,
        goal: `y = ${a}x; x = ${k}`,
        // Checkpoints on the way (for the tests: a search between each is quick).
        via: [`y = ${a}x; x + ${a}x = ${(a + 1) * k}`, `y = ${a}x; ${a + 1}x = ${(a + 1) * k}`],
      };
    })),
    // 2. One letter found: put it back into the other equation, for the other letter.
    carrying("alone", d("substitute-back", (r) => {
      const [a, b, k] = [r.int(2, 4), r.int(1, 6), r.int(1, 5)];
      return { start: `y = ${a}x + ${b}; x = ${k}`, goal: `y = ${a * k + b}; x = ${k}`, via: [`y = ${a}*${k} + ${b}; x = ${k}`] };
    }, "substitute")),
    // 3. The whole way: no letter on its own, so make one first; then substitute, solve, and put it back.
    d("alone-first", (r) => {
      for (;;) {
        const [p, q] = [r.int(1, 5), r.int(1, 5)];
        const t = 2 * p - q;
        if (t <= 0) continue;
        return {
          start: `x + y = ${p + q}; 2x - y = ${t}`,
          goal: `y = ${q}; x = ${p}`,
          // The way the words go: the minus in front of the bracket changes the signs inside, then the x's are collected.
          via: [
            `y = ${p + q} - x; 2x - y = ${t}`,
            `y = ${p + q} - x; 2x - (${p + q} - x) = ${t}`,
            `y = ${p + q} - x; 2x - ${p + q} + x = ${t}`,
            `y = ${p + q} - x; 3x - ${p + q} = ${t}`,
            `y = ${p + q} - x; 3x = ${t + p + q}`,
            `y = ${p + q} - x; x = ${p}`,
            `y = ${p + q} - ${p}; x = ${p}`,
          ],
        };
      }
    }, "move-term"),
  ],
  levels,
};
