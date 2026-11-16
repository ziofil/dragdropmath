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
import { d } from "../generate/drill";

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
    d("substitute", (r) => {
      const [x, y] = ["x", "y"];
      const [a, k] = [r.int(2, 4), r.int(1, 5)];
      return {
        start: `${y} = ${a}${x}; ${x} + ${y} = ${(a + 1) * k}`,
        goal: `${y} = ${a * k}; ${x} = ${k}`,
        // Checkpoints on the way (for the tests: a search between each is quick).
        via: [`${y} = ${a}${x}; ${x} + ${a}${x} = ${(a + 1) * k}`, `${y} = ${a}${x}; ${a + 1}${x} = ${(a + 1) * k}`, `${y} = ${a}${x}; ${x} = ${k}`],
      };
    }),
  ],
  levels,
};
