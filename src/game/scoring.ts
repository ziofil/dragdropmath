/**
 * What this viewer has done. Per-viewer convenience only: storage can be
 * missing or blocked, so every access is guarded.
 *
 * A chapter's exercises are made up on the spot (generate/practice.ts), so
 * progress is how many were done at each level: answered right in the test
 * (which earns the badge), and solved in practice. Sets of one's own keep
 * which of their exercises are solved (loadSolved).
 */
import { LEVELS, type Level } from "./generate/write";
import { isRecord, isStrings, readJson, writeJson } from "../util/storage";

// ---------- a chapter: how many solved at each level ----------

/** Right answers in the test at a level for its step of the badge: bronze easy, silver medium, gold hard. */
export const PER_LEVEL = 10;

export type Counts = Record<Level, number>;
export type Progress = Record<string, Counts>;

/** Where each kind is counted: the test (earlier, every exercise asked for a prediction first: those count as tests). */
export type Kind = "test" | "practice";
const COUNTS_KEY: Record<Kind, string> = { test: "mathbyhand.counts.v1", practice: "mathbyhand.practice.v1" };
/** The exercises already counted (the latest few): solving one again doesn't count twice. */
const COUNTED_KEY = "mathbyhand.counted.v1";
const KEEP_COUNTED = 500;

const none = (): Counts => ({ easy: 0, medium: 0, hard: 0 });

export const loadProgress = (kind: Kind = "test"): Progress => readJson(COUNTS_KEY[kind], {}, isRecord);

/** The exercises counted so far (the latest few). */
const loadCounted = (): string[] => readJson(COUNTED_KEY, [], isStrings);

/** One more exercise done, unless this one was counted already. */
export function countSolved(chapterId: string, level: Level, exerciseId: string, kind: Kind = "test"): void {
  const counted = loadCounted();
  if (counted.includes(exerciseId)) return;
  const progress = loadProgress(kind);
  const c = countsOf({ id: chapterId }, progress);
  c[level]++;
  progress[chapterId] = c;
  writeJson(COUNTS_KEY[kind], progress);
  writeJson(COUNTED_KEY, [...counted, exerciseId].slice(-KEEP_COUNTED));
}

/** This exercise has been counted already. */
export const isCounted = (exerciseId: string): boolean => loadCounted().includes(exerciseId);

/** A chapter's counts (a stored one that isn't numbers counts as none). */
export function countsOf(chapter: { id: string }, p: Progress): Counts {
  const c = none();
  const stored = p[chapter.id];
  if (isRecord(stored)) for (const l of LEVELS) if (Number.isFinite(stored[l])) c[l] = stored[l];
  return c;
}

/** Solved in a chapter, at any level. */
export const solvedCount = (chapter: { id: string }, p: Progress) => LEVELS.reduce((n, l) => n + countsOf(chapter, p)[l], 0);

/** How far towards gold on every level, out of GOAL (for the ring on the path). */
export const GOAL = PER_LEVEL * LEVELS.length;
export const progressOf = (chapter: { id: string }, p: Progress) => LEVELS.reduce((n, l) => n + Math.min(PER_LEVEL, countsOf(chapter, p)[l]), 0);

/** A chapter's badge: none, bronze, silver, gold. */
export type Tier = 0 | 1 | 2 | 3;
export const TIER_NAMES = ["", "bronze", "silver", "gold"] as const;

/** The highest level with enough solved: whoever goes straight to hard ones can earn gold. */
export function badgeTier(chapter: { id: string }, p: Progress): Tier {
  const c = countsOf(chapter, p);
  for (let i = LEVELS.length - 1; i >= 0; i--) if (c[LEVELS[i]] >= PER_LEVEL) return (i + 1) as Tier;
  return 0;
}

/** A chapter is mastered at gold. */
export const isMastered = (chapter: { id: string }, p: Progress) => badgeTier(chapter, p) === 3;

/** The next step of the badge: its level, and how many more to solve there (null at gold). */
export function toNextTier(chapter: { id: string }, p: Progress): { level: Level; more: number } | null {
  const tier = badgeTier(chapter, p);
  if (tier === 3) return null;
  const level = LEVELS[tier];
  return { level, more: PER_LEVEL - countsOf(chapter, p)[level] };
}

// ---------- a set of one's own: which of its exercises are solved ----------

const KEY = "mathbyhand.solved.v1";
// Earlier names of the app stored progress here (and once, best move counts): still read, so nothing is lost.
const OLD_KEY = "graspable.solved.v1";
const OLD_BEST_KEY = "graspable.best.v1";

export function loadSolved(): Set<string> {
  // Each read on its own: an unreadable old key mustn't lose the current list.
  const solved = readJson<string[]>(KEY, [], isStrings);
  const old = readJson<string[]>(OLD_KEY, [], isStrings);
  const oldBest = readJson<Record<string, number>>(OLD_BEST_KEY, {}, isRecord);
  return new Set([...solved, ...old, ...Object.keys(oldBest)]);
}

export function markSolved(exerciseId: string): void {
  writeJson(KEY, [...loadSolved(), exerciseId].filter((id, i, all) => all.indexOf(id) === i));
}
