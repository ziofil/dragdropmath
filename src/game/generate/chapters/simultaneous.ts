/**
 * Simultaneous equations: two letters, solved by substituting (../systems.ts).
 * About half of each level is composed: one equation is one from the
 * earlier chapters — at Medium with a root, a log or a power in it; at Hard
 * a root, a log or a power, and a fraction.
 */
import { rulesOf } from "../../puzzles";
import { composedSystem, SYSTEMS as S } from "../systems";
import type { Level, Shape } from "../write";

const rules = () => rulesOf("simultaneous");

export const shapes: Record<Level, Shape[]> = {
  easy: [S.knownX, S.knownY, S.multiple, S.linear, S.takeAway, composedSystem({ first: "easy" }, "easy", rules, 5)],
  medium: [S.sumDifference, S.sumAndOther, S.bracketSub, S.minusBracket, composedSystem({ first: "medium", sub: "easy" }, "medium", rules, 4)],
  hard: [S.tidyFactor, S.tidyBracket, S.minusBracketSub, S.nestedThenSubstitute, composedSystem({ first: "hard", sub: "hard" }, "hard", rules, 4)],
};
