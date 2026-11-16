/**
 * What this viewer has done, and what it counts towards. The one owner of exercise
 * outcomes: the screens tell `record` what happened, and it decides what that
 * counts towards (and says so), once per exercise.
 *
 * - Every exercise's first outcomes are kept (the latest few thousand): its
 *   first prediction and the answer picked, whether it was tried, and solved.
 *   Telling it the same again changes nothing: a reload, a second visit or a
 *   second pick earns nothing more.
 * - A chapter's mind's-eye exercises: a right first answer adds 1 to the
 *   score at its level (one score per level, across every chapter); a wrong
 *   one, or revealing it, takes 1 away (never below 0). One with no answers
 *   to pick from counts as right once solved.
 * - Practice and sets count towards nothing: there's no score there.
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

/** A score changed: at which level, from what to what. */
export type Change = { level: Level; was: number; now: number };

/** What one outcome did. `first`: it's new for this exercise (else nothing changed). `score`: the mind's eye's score it changed. */
export type Recorded = { first: boolean; score: Change | null };

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

  const result: Recorded = { first, score: null };
  if (!first) return result;

  if (ctx.kind === "predict") {
    // Solved with nothing predicted: there were no answers to pick from, and solving it is its answer.
    const right = outcome === "right" || (outcome === "solved" && !was.predicted);
    if (outcome === "solved" && !was.predicted) now.predicted = "right";
    if (right || outcome === "wrong" || outcome === "revealed") result.score = nextScore(ctx.level, right);
  }

  // The latest last; the oldest forgotten beyond KEEP.
  delete all[id];
  all[id] = now;
  const ids = Object.keys(all);
  for (const old of ids.slice(0, Math.max(0, ids.length - KEEP))) delete all[old];
  writeJson(SEEN_KEY, all);
  return result;
}

// ---------- the mind's eye: one score per level, across every chapter ----------

export type Score = Record<Level, number>;
/** A fresh start: earlier versions' badges, streaks, runs and tries aren't read. */
const SCORE_KEY = "mathbyhand.score.v1";

/** The scores (none yet: 0). */
export function loadScore(): Score {
  const stored = readJson<Record<string, unknown>>(SCORE_KEY, {}, isRecord);
  const t: Score = { easy: 0, medium: 0, hard: 0 };
  for (const l of LEVELS) if (typeof stored[l] === "number" && Number.isFinite(stored[l])) t[l] = Math.max(0, stored[l] as number);
  return t;
}

/** A first answer at a level: one up if right, one down if not (never below 0). */
function nextScore(level: Level, right: boolean): Change {
  const all = loadScore();
  const was = all[level];
  const now = Math.max(0, was + (right ? 1 : -1));
  writeJson(SCORE_KEY, { ...all, [level]: now });
  return { level, was, now };
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
