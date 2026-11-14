import type { RuleId } from "../rules";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { shuffle } from "./chapters/shuffle";
import { collect } from "./chapters/collect";
import { distribute } from "./chapters/distribute";
import { brackets } from "./chapters/brackets";
import { factor } from "./chapters/factor";
import { balance } from "./chapters/balance";
import { inequalities } from "./chapters/inequalities";
import { formulas } from "./chapters/formulas";
import { simultaneous } from "./chapters/simultaneous";
import { fractions } from "./chapters/fractions";
import { powers } from "./chapters/powers";
import { roots } from "./chapters/roots";
import { explog } from "./chapters/explog";

/**
 * A worked example the learner does by hand, one instructed move at a time.
 * `then` is what the expression must look like after the move.
 */
export type Chapter = {
  id: string;
  title: string;
  blurb: string;
  /**
   * Chapters this one builds on: the learning path's arrows. Only advice,
   * never a lock — every chapter is open from the start.
   */
  after: string[];
  /** Rules this chapter unlocks; earlier chapters' rules stay available. */
  unlocks: RuleId[];
};

export const CHAPTERS: Chapter[] = [
  shuffle,
  collect,
  distribute,
  brackets,
  balance,
  powers,
  factor,
  formulas,
  inequalities,
  fractions,
  simultaneous,
  roots,
  explog,
];

/**
 * The chapters on the way to chapter `ci`: everything it builds on, directly
 * or not (as indices, in chapter order; `ci` itself excluded).
 */
function pathTo(ci: number): number[] {
  const seen = new Set<number>();
  const visit = (i: number) => {
    for (const id of CHAPTERS[i].after) {
      const j = CHAPTERS.findIndex((c) => c.id === id);
      if (!seen.has(j)) {
        seen.add(j);
        visit(j);
      }
    }
  };
  visit(ci);
  return [...seen].sort((a, b) => a - b);
}

/** The moves in chapter `ci`: its own, and those of every chapter on the way to it. */
export const rulesFor = (ci: number): RuleId[] => [...pathTo(ci), ci].flatMap((i) => CHAPTERS[i].unlocks);

/**
 * Chapters where letters stand for positive numbers (said on screen): there
 * x² = 4 can become x = 4^(1/2), and √(x²) is x. See rules/signs.ts.
 */
const POSITIVE_LETTERS = new Set(["powers", "roots", "explog"]);
export const lettersPositive = (chapter: Chapter) => POSITIVE_LETTERS.has(chapter.id);

/** An exercise's start, with what its letters stand for. */
export function startOf(start: string, chapter?: Chapter): MathState {
  const s = parseState(start);
  return chapter && lettersPositive(chapter) ? { ...s, letters: "positive" } : s;
}

export const chapterById = (id: string | undefined): Chapter | undefined => CHAPTERS.find((c) => c.id === id);

/** The chapters that build directly on this one. */
export const leadsTo = (chapter: Chapter): Chapter[] => CHAPTERS.filter((c) => c.after.includes(chapter.id));
