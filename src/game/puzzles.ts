import type { RuleId } from "../rules";
import { ROUTINES, type Routine } from "./auto";
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
  /** Routine steps that happen by themselves in later chapters, once all of this chapter's exercises are solved. */
  automates?: Routine[];
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
export const exerciseLabel = (chapterIndex: number, index: number) =>
  `${chapterIndex + 1}.${index + 1}`;

export function allPuzzles(): PuzzleRef[] {
  return CHAPTERS.flatMap((chapter, ci) => {
    const rules = rulesFor(ci);
    return chapter.puzzles.map((puzzle, index) => ({
      chapter,
      puzzle,
      index,
      rules,
      label: exerciseLabel(ci, index),
    }));
  });
}

/**
 * The chapters on the way to chapter `ci`: everything it builds on, directly
 * or not (as indices, in chapter order; `ci` itself excluded).
 */
export function pathTo(ci: number): number[] {
  const seen = new Set<number>();
  const visit = (i: number) => {
    for (const id of CHAPTERS[i].after) {
      const j = chapterIndex(id);
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
export const rulesFor = (ci: number): RuleId[] =>
  [...pathTo(ci), ci].flatMap((i) => CHAPTERS[i].unlocks);

/**
 * What's done automatically in chapter `ci`: tidying products (always), and
 * the routines of the chapters on the way to it that are mastered.
 */
export const routinesFor = (ci: number, mastered: (c: Chapter) => boolean): Routine[] => [
  ROUTINES.tidy,
  ...pathTo(ci).flatMap((i) => (mastered(CHAPTERS[i]) ? (CHAPTERS[i].automates ?? []) : [])),
];

export const chapterIndex = (id: string) =>
  CHAPTERS.findIndex((c) => c.id === id);

export function findPuzzle(id: string): PuzzleRef | undefined {
  return allPuzzles().find((p) => p.puzzle.id === id);
}
