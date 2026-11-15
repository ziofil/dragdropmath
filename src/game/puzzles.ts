import type { RuleId } from "../rules";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { allNodes } from "../expr/tree";
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

/** A chapter of the learning path: its lesson (its moves), practice and test. */
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
  /**
   * Its letters stand for positive numbers (said on screen): there x² = 4
   * can become x = 4^(1/2), √(x²) is x, and ln(x²) is 2ln(x). See
   * rules/signs.ts.
   */
  positive?: boolean;
};

export const CHAPTERS: Chapter[] = [
  shuffle,
  collect,
  distribute,
  brackets,
  factor,
  powers,
  fractions,
  roots,
  explog,
  balance,
  inequalities,
  formulas,
  simultaneous,
];

export const chapterById = (id: string | undefined): Chapter | undefined => CHAPTERS.find((c) => c.id === id);

/** The chapters on the way to this one: everything it builds on, directly or not (itself excluded). */
function pathTo(id: string, seen = new Set<string>()): Set<string> {
  for (const before of chapterById(id)?.after ?? []) if (!seen.has(before)) pathTo(before, seen.add(before));
  return seen;
}

/** The moves in a chapter: its own, and those of every chapter on the way to it (in path order). */
export function rulesOf(chapterId: string): RuleId[] {
  const on = pathTo(chapterId).add(chapterId);
  return [...new Set(CHAPTERS.filter((c) => on.has(c.id)).flatMap((c) => c.unlocks))];
}

/** The moves in chapter number `ci` (its index in CHAPTERS). */
export const rulesFor = (ci: number): RuleId[] => rulesOf(CHAPTERS[ci].id);

/** A root, a log or a power in it: what letters must be positive for (x² = 4 gives x = 2 only then). */
export const hasPowerRootLog = (s: MathState): boolean => s.sides.some((e) => allNodes(e).some((n) => n.kind === "pow" || n.kind === "log"));

/**
 * Where letters stand for positive numbers when nothing else says: in the
 * powers, roots and logs chapters, and elsewhere where the start has a power,
 * a root or a log in it. (Generated exercises say for themselves: Draft.positive.)
 */
export function lettersPositive(chapter: Chapter | undefined, start: string): boolean {
  if (chapter?.positive) return true;
  try {
    return hasPowerRootLog(parseState(start));
  } catch {
    return false;
  }
}

/** An exercise's start, with what its letters stand for. */
export function startOf(start: string, chapter?: Chapter, positive = chapter !== undefined && lettersPositive(chapter, start)): MathState {
  const s = parseState(start);
  return positive ? { ...s, letters: "positive" } : s;
}

/** The chapters that build directly on this one. */
export const leadsTo = (chapter: Chapter): Chapter[] => CHAPTERS.filter((c) => c.after.includes(chapter.id));
