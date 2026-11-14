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

export function loadProgress(kind: Kind = "test"): Progress {
  try {
    return JSON.parse(localStorage.getItem(COUNTS_KEY[kind]) ?? "{}");
  } catch {
    return {};
  }
}

/** One more exercise done, unless this one was counted already. */
export function countSolved(chapterId: string, level: Level, exerciseId: string, kind: Kind = "test"): void {
  try {
    const counted: string[] = JSON.parse(localStorage.getItem(COUNTED_KEY) ?? "[]");
    if (counted.includes(exerciseId)) return;
    const progress = loadProgress(kind);
    const c = { ...none(), ...progress[chapterId] };
    c[level]++;
    progress[chapterId] = c;
    localStorage.setItem(COUNTS_KEY[kind], JSON.stringify(progress));
    localStorage.setItem(COUNTED_KEY, JSON.stringify([...counted, exerciseId].slice(-KEEP_COUNTED)));
  } catch {
    /* storage unavailable: progress just won't persist */
  }
}

/** This exercise has been counted already. */
export function isCounted(exerciseId: string): boolean {
  try {
    return (JSON.parse(localStorage.getItem(COUNTED_KEY) ?? "[]") as string[]).includes(exerciseId);
  } catch {
    return false;
  }
}

export const countsOf = (chapter: { id: string }, p: Progress): Counts => ({ ...none(), ...p[chapter.id] });

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
  try {
    const solved: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const old: string[] = JSON.parse(localStorage.getItem(OLD_KEY) ?? "[]");
    const oldBest: Record<string, number> = JSON.parse(localStorage.getItem(OLD_BEST_KEY) ?? "{}");
    return new Set([...solved, ...old, ...Object.keys(oldBest)]);
  } catch {
    return new Set();
  }
}

export function markSolved(exerciseId: string): void {
  const solved = loadSolved();
  solved.add(exerciseId);
  try {
    localStorage.setItem(KEY, JSON.stringify([...solved]));
  } catch {
    /* storage unavailable: progress just won't persist */
  }
}
