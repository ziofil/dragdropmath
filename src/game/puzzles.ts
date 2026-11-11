import type { RuleId } from "../rules";
import { shuffle } from "./chapters/shuffle";
import { collect } from "./chapters/collect";
import { distribute } from "./chapters/distribute";
import { brackets } from "./chapters/brackets";
import { factor } from "./chapters/factor";
import { balance } from "./chapters/balance";
import { inequalities } from "./chapters/inequalities";
import { fractions } from "./chapters/fractions";
import { powers } from "./chapters/powers";
import { roots } from "./chapters/roots";
import { explog } from "./chapters/explog";

export type Puzzle = {
  id: string;
  start: string;
  goal: string;
  hint?: string;
};

/**
 * A worked example the learner does by hand, one instructed move at a time.
 * `then` is what the expression must look like after the move.
 */
export type Guided = {
  start: string;
  steps: { say: string; then: string }[];
  /** A closing remark, once it's done. */
  after?: string;
};

export type LessonPart = {
  title: string;
  text: string[];
  example?: Guided;
  /** A common mistake. */
  watch?: string;
};

export type Chapter = {
  id: string;
  title: string;
  blurb: string;
  /**
   * Chapters this one builds on: the learning path's arrows. Only advice,
   * never a lock — every chapter is open from the start.
   */
  after: string[];
  /**
   * The lesson, before the exercises: short parts, each an idea in a few
   * sentences (`backticks` mark maths), usually with an example to do by
   * hand, and sometimes a common mistake to watch out for.
   */
  lesson: LessonPart[];
  /** Rules this chapter unlocks; earlier chapters' rules stay available. */
  unlocks: RuleId[];
  puzzles: Puzzle[];
};

export const CHAPTERS: Chapter[] = [
  shuffle,
  collect,
  distribute,
  brackets,
  factor,
  balance,
  inequalities,
  fractions,
  powers,
  roots,
  explog,
];

export type PuzzleRef = {
  chapter: Chapter;
  puzzle: Puzzle;
  index: number;
  rules: RuleId[];
  label: string;
};

/** "Exercise N.M": set N, exercise M within it (both from 1). */
export const exerciseLabel = (chapterIndex: number, index: number) => `${chapterIndex + 1}.${index + 1}`;

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

export const chapterById = (id: string | undefined): Chapter | undefined => CHAPTERS.find((c) => c.id === id);

/** The chapters that build directly on this one. */
export const leadsTo = (chapter: Chapter): Chapter[] => CHAPTERS.filter((c) => c.after.includes(chapter.id));

/** Every exercise, in order, with its chapter, label and moves. */
const ALL: PuzzleRef[] = CHAPTERS.flatMap((chapter, ci) => {
  const rules = rulesFor(ci);
  return chapter.puzzles.map((puzzle, index) => ({ chapter, puzzle, index, rules, label: exerciseLabel(ci, index) }));
});

export const allPuzzles = (): readonly PuzzleRef[] => ALL;

export const findPuzzle = (id: string): PuzzleRef | undefined => ALL.find((p) => p.puzzle.id === id);
