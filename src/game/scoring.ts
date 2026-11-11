/**
 * Which exercises this viewer has solved. Per-viewer convenience only:
 * storage can be missing or blocked, so every access is guarded.
 */
const KEY = "graspable.solved.v1";
const OLD_BEST_KEY = "graspable.best.v1"; // earlier versions stored best move counts

export function loadSolved(): Set<string> {
  try {
    const solved: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const oldBest: Record<string, number> = JSON.parse(localStorage.getItem(OLD_BEST_KEY) ?? "{}");
    return new Set([...solved, ...Object.keys(oldBest)]);
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

/** TEMPORARY (testing): forget every solved exercise. */
export function clearSolved(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(OLD_BEST_KEY);
  } catch {
    /* storage unavailable: nothing stored anyway */
  }
}

/** A chapter is mastered once every one of its exercises is solved. */
export const isMastered = (chapter: { puzzles: { id: string }[] }, solved: ReadonlySet<string>) =>
  chapter.puzzles.every((p) => solved.has(p.id));

/** A chapter's badge, earned in steps as its exercises get solved: none, bronze, silver, gold. */
export type Tier = 0 | 1 | 2 | 3;
export const TIER_NAMES = ["", "bronze", "silver", "gold"] as const;

/** Bronze for a third of the exercises, silver for two thirds, gold for all (which is mastering it). */
export function badgeTier(chapter: { puzzles: { id: string }[] }, solved: ReadonlySet<string>): Tier {
  const n = chapter.puzzles.length;
  const done = chapter.puzzles.filter((p) => solved.has(p.id)).length;
  if (done >= n) return 3;
  if (done >= Math.ceil((2 * n) / 3)) return 2;
  if (done >= Math.ceil(n / 3)) return 1;
  return 0;
}

/** Solved exercises still needed for the next step of the badge (0 at gold). */
export function toNextTier(chapter: { puzzles: { id: string }[] }, solved: ReadonlySet<string>): number {
  const n = chapter.puzzles.length;
  const done = chapter.puzzles.filter((p) => solved.has(p.id)).length;
  const marks = [Math.ceil(n / 3), Math.ceil((2 * n) / 3), n];
  const next = marks.find((m) => m > done);
  return next === undefined ? 0 : next - done;
}
