/**
 * What this viewer has done, and what it earned. The one owner of exercise
 * outcomes: the screens tell `record` what happened, and it decides what that
 * counts towards (and says so), once per exercise.
 *
 * - Every exercise's first outcomes are kept (the latest few thousand): its
 *   first prediction and the answer picked, whether it was tried, and solved.
 *   Telling it the same again changes nothing: a reload, a second visit or a
 *   second pick earns nothing more.
 * - A chapter's predict exercises: a right first prediction counts at its
 *   level (the badge: bronze at 10 easy, silver medium, gold hard), and runs
 *   of them make a streak. One with no answers to pick from counts once solved.
 * - A chapter's practice exercises: each one tried (a move made) counts.
 *
 * Per-viewer convenience only: storage can be missing or blocked.
 */
import { LEVELS, type Level } from "./generate/write";
import { isRecord, isStrings, readJson, writeJson } from "../util/storage";

// ---------- what happened ----------

export type Prediction = "right" | "wrong" | "revealed";
export type Outcome = Prediction | "solved" | "tried";

/** Where an exercise comes from: what its outcomes count towards. */
export type Context = { kind: Kind; chapter: string; level: Level } | { kind: "set" };
export type Kind = "practice" | "predict";

/** What's known of one exercise: its first prediction (and the answer picked), and whether it was tried and solved. */
export type Seen = { predicted?: Prediction; pick?: string; tried?: true; solved?: true };

/** What one outcome did. `first`: it's new for this exercise (else nothing changed). */
export type Recorded = {
  first: boolean;
  /** It added to the chapter's count. */
  counted: boolean;
  /** Right predictions in a row, after it (a chapter's predict exercises). */
  streak: Streak | null;
  /** The chapter's badge before it and after it. */
  tier: { before: Tier; after: Tier };
};

const SEEN_KEY = "mathbyhand.outcomes.v1";
/** How many exercises are remembered (the latest). */
export const KEEP = 5000;

type SeenAll = Record<string, Seen>;
const isPrediction = (v: unknown): v is Prediction => v === "right" || v === "wrong" || v === "revealed";

function loadSeen(): SeenAll {
  const all = readJson<SeenAll | null>(SEEN_KEY, null, isRecord);
  if (all) return all;
  const migrated = fromOldKeys();
  writeJson(SEEN_KEY, migrated);
  return migrated;
}

/** What's known of an exercise. */
export const seen = (id: string): Seen => loadSeen()[id] ?? {};

/** Tell what happened on an exercise; it's counted where it counts, once. `pick`: the answer picked. */
export function record(id: string, ctx: Context, outcome: Outcome, pick?: string): Recorded {
  const all = loadSeen();
  const was: Seen = isRecord(all[id]) ? all[id] : {};
  const now: Seen = { ...was };
  let first: boolean;
  if (isPrediction(outcome)) {
    first = !was.predicted;
    now.predicted ??= outcome;
    if (first && pick !== undefined) now.pick = pick;
  } else if (outcome === "solved") {
    first = !was.solved;
    now.solved = true;
  } else {
    first = !was.tried;
    now.tried = true;
  }

  const chapter = ctx.kind === "set" ? null : { id: ctx.chapter };
  const before = chapter ? badgeTier(chapter, loadProgress()) : 0;
  const result: Recorded = { first, counted: false, streak: null, tier: { before, after: before } };
  if (!first) return result;

  if (ctx.kind === "predict") {
    // Solved with nothing predicted: there were no answers to pick from, and solving it is its answer.
    const right = outcome === "right" || (outcome === "solved" && !was.predicted);
    if (outcome === "solved" && !was.predicted) now.predicted = "right";
    if (right) result.counted = count("predict", ctx.chapter, ctx.level);
    if (right || outcome === "wrong" || outcome === "revealed") result.streak = nextStreak(ctx.chapter, right);
    result.tier.after = badgeTier(chapter!, loadProgress());
  } else if (ctx.kind === "practice" && outcome === "tried") {
    result.counted = count("practice", ctx.chapter, ctx.level);
  }

  // The latest last; the oldest forgotten beyond KEEP.
  delete all[id];
  all[id] = now;
  const ids = Object.keys(all);
  for (const old of ids.slice(0, Math.max(0, ids.length - KEEP))) delete all[old];
  writeJson(SEEN_KEY, all);
  return result;
}

// ---------- a chapter: how many at each level ----------

/** Right predictions at a level for its step of the badge. */
export const PER_LEVEL = 10;

export type Counts = Record<Level, number>;
export type Progress = Record<string, Counts>;

const COUNTS_KEY: Record<Kind, string> = { predict: "mathbyhand.counts.v1", practice: "mathbyhand.practice.v1" };

export const loadProgress = (kind: Kind = "predict"): Progress => readJson(COUNTS_KEY[kind], {}, isRecord);

function count(kind: Kind, chapterId: string, level: Level): true {
  const progress = loadProgress(kind);
  const c = countsOf({ id: chapterId }, progress);
  c[level]++;
  writeJson(COUNTS_KEY[kind], { ...progress, [chapterId]: c });
  return true;
}

/** A chapter's counts (a stored one that isn't numbers counts as none). */
export function countsOf(chapter: { id: string }, p: Progress): Counts {
  const c: Counts = { easy: 0, medium: 0, hard: 0 };
  const stored = p[chapter.id];
  if (isRecord(stored)) for (const l of LEVELS) if (Number.isFinite(stored[l])) c[l] = stored[l];
  return c;
}

/** Done in a chapter, at any level. */
export const solvedCount = (chapter: { id: string }, p: Progress) => LEVELS.reduce((n, l) => n + countsOf(chapter, p)[l], 0);

/** How far towards gold on every level, out of GOAL (for the ring on the path). */
export const GOAL = PER_LEVEL * LEVELS.length;
export const progressOf = (chapter: { id: string }, p: Progress) => LEVELS.reduce((n, l) => n + Math.min(PER_LEVEL, countsOf(chapter, p)[l]), 0);

/** A chapter's badge: none, bronze, silver, gold. */
export type Tier = 0 | 1 | 2 | 3;
/** For class names (the words on screen are in i18n). */
export const TIER_NAMES = ["none", "bronze", "silver", "gold"] as const;

/** The highest level with enough right: whoever goes straight to hard ones can earn gold. */
export function badgeTier(chapter: { id: string }, p: Progress): Tier {
  const c = countsOf(chapter, p);
  for (let i = LEVELS.length - 1; i >= 0; i--) if (c[LEVELS[i]] >= PER_LEVEL) return (i + 1) as Tier;
  return 0;
}

/** A chapter is mastered at gold. */
export const isMastered = (chapter: { id: string }, p: Progress) => badgeTier(chapter, p) === 3;

/** The next step of the badge: its level, and how many more right there (null at gold). */
export function toNextTier(chapter: { id: string }, p: Progress): { level: Level; more: number } | null {
  const tier = badgeTier(chapter, p);
  if (tier === 3) return null;
  const level = LEVELS[tier];
  return { level, more: PER_LEVEL - countsOf(chapter, p)[level] };
}

/** Practice counts tries: a mark at each of these. */
export const TRIED_MARKS = [10, 25, 50, 100, 200, 500];

// ---------- predicting: right answers in a row ----------

/** Runs of right predictions that earn a mark. */
export const STREAK_MARKS = [3, 5, 10, 20];
export type Streak = { now: number; best: number };
const STREAK_KEY = "mathbyhand.streaks.v1";

export function streakOf(chapter: { id: string }): Streak {
  const s = readJson<Record<string, unknown>>(STREAK_KEY, {}, isRecord)[chapter.id] as Partial<Streak> | undefined;
  return s && Number.isFinite(s.now) && Number.isFinite(s.best) ? { now: s.now!, best: s.best! } : { now: 0, best: 0 };
}

/** A first prediction: the run goes on, or starts again (a wrong one, or revealing the answer). */
function nextStreak(chapterId: string, right: boolean): Streak {
  const was = streakOf({ id: chapterId });
  const now = right ? was.now + 1 : 0;
  const s = { now, best: Math.max(was.best, now) };
  writeJson(STREAK_KEY, { ...readJson<Record<string, unknown>>(STREAK_KEY, {}, isRecord), [chapterId]: s });
  return s;
}

// ---------- earlier versions ----------

/**
 * What earlier versions kept, under keys of their own: read once into the
 * outcomes (the old keys are left as they were). The predict exercises were
 * called tests then ("test-…" ids).
 */
function fromOldKeys(): SeenAll {
  const all: SeenAll = {};
  const at = (id: string) => (all[id.replace(/^test-/, "predict-")] ??= {});
  // Each read on its own: an unreadable key mustn't lose the rest.
  for (const [id, g] of Object.entries(readJson<Record<string, unknown>>("mathbyhand.guesses.v1", {}, isRecord))) if (isPrediction(g)) at(id).predicted = g;
  for (const [id, p] of Object.entries(readJson<Record<string, unknown>>("mathbyhand.picks.v1", {}, isRecord))) if (typeof p === "string") at(id).pick = p;
  const solved = [
    ...readJson<string[]>("mathbyhand.solved.v1", [], isStrings),
    ...readJson<string[]>("graspable.solved.v1", [], isStrings),
    ...Object.keys(readJson<Record<string, unknown>>("graspable.best.v1", {}, isRecord)),
  ];
  for (const id of solved) at(id).solved = true;
  // Counted: a practice one tried, a test one right (picked right, or solved with nothing to pick).
  for (const id of readJson<string[]>("mathbyhand.counted.v1", [], isStrings)) {
    if (id.startsWith("practice-")) at(id).tried = true;
    else if (id.startsWith("test-")) at(id).predicted ??= "right";
  }
  return all;
}
