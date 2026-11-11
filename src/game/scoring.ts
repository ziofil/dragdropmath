/**
 * Which exercises this viewer has solved. Per-viewer convenience only:
 * storage can be missing or blocked, so every access is guarded.
 */
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

type HasPuzzles = { puzzles: { id: string }[] };

/** How many of a chapter's exercises are solved. */
export const solvedCount = (chapter: HasPuzzles, solved: ReadonlySet<string>) => chapter.puzzles.filter((p) => solved.has(p.id)).length;

/** A chapter is mastered once every one of its exercises is solved. */
export const isMastered = (chapter: HasPuzzles, solved: ReadonlySet<string>) => solvedCount(chapter, solved) === chapter.puzzles.length;

/** A chapter's badge, earned in steps as its exercises get solved: none, bronze, silver, gold. */
export type Tier = 0 | 1 | 2 | 3;
export const TIER_NAMES = ["", "bronze", "silver", "gold"] as const;

/** Exercises solved for each step: bronze a third, silver two thirds, gold all (mastering it). */
const marks = (chapter: HasPuzzles) => {
  const n = chapter.puzzles.length;
  return [Math.ceil(n / 3), Math.ceil((2 * n) / 3), n];
};

export function badgeTier(chapter: HasPuzzles, solved: ReadonlySet<string>): Tier {
  const done = solvedCount(chapter, solved);
  return marks(chapter).filter((m) => done >= m).length as Tier;
}

/** Solved exercises still needed for the next step of the badge (0 at gold). */
export function toNextTier(chapter: HasPuzzles, solved: ReadonlySet<string>): number {
  const done = solvedCount(chapter, solved);
  const next = marks(chapter).find((m) => m > done);
  return next === undefined ? 0 : next - done;
}
