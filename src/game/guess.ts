/**
 * Guess first: on every exercise, the learner first picks what the start
 * becomes, out of three answers — the goal, and two
 * that typical mistakes lead to (decoys.ts) — and only then solves it. So
 * they work it out in their head first, then show it, or see where they
 * went wrong. A right first guess earns a star; "Reveal" skips the guess
 * (no star).
 */
import { DECOYS } from "./decoys";

export type Guess = "right" | "wrong" | "revealed";

/**
 * The three answers for an exercise, in a fixed shuffled order (the same each
 * visit), or null if it isn't guessed first. `decoys`: its two wrong answers
 * (by default, the built-in ones).
 */
export function choicesFor(puzzle: { id: string; goal: string }, decoys: readonly string[] | undefined = DECOYS[puzzle.id]): string[] | null {
  if (!decoys || decoys.length < 2) return null;
  const all = [puzzle.goal, ...decoys];
  // Where the right answer goes depends on the exercise, not on chance: stable across visits.
  const at = [...puzzle.id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 3;
  const [right, ...wrong] = all;
  return [...wrong.slice(0, at), right, ...wrong.slice(at)];
}

const KEY = "mathbyhand.guesses.v1";

/** First guesses made so far (per viewer; storage may be unavailable). */
export function loadGuesses(): Record<string, Guess> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

const PICKS = "mathbyhand.picks.v1";

/** Which answer was picked first, per exercise (to show it again on a later visit). */
export function loadPicks(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(PICKS) ?? "{}");
  } catch {
    return {};
  }
}

/** Remember the first guess for an exercise, and the answer picked (later ones don't count). */
export function saveGuess(id: string, guess: Guess, pick?: string): void {
  const all = loadGuesses();
  if (all[id]) return;
  all[id] = guess;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    if (pick !== undefined) localStorage.setItem(PICKS, JSON.stringify({ ...loadPicks(), [id]: pick }));
  } catch {
    /* storage unavailable: the star just won't persist */
  }
}

/** Stars a chapter has: its exercises guessed right first time. */
export const starsIn = (chapter: { puzzles: { id: string }[] }, guesses: Record<string, Guess>) =>
  chapter.puzzles.filter((p) => guesses[p.id] === "right").length;
