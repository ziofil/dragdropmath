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
