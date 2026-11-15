/**
 * Predict first: the learner picks what the start becomes, out of three
 * answers — the goal, and two that typical mistakes lead to (autoDecoys.ts) —
 * and only then solves it. So they work it out in their head first, then
 * show it, or see where they went wrong. "Reveal" skips predicting.
 *
 * What the exercise screen shows of it, as a small state machine:
 * asking → answered (picked right, picked wrong, or revealed), this visit or
 * an earlier one (scoring.ts keeps the first prediction of every exercise).
 */
import type { Prediction, Seen } from "./scoring";

/**
 * The three answers for an exercise, in a fixed shuffled order (the same each
 * visit), or null if it isn't predicted first. `decoys`: its two wrong answers.
 */
export function choicesFor(puzzle: { id: string; goal: string }, decoys: readonly string[] | undefined): string[] | null {
  if (!decoys || decoys.length < 2) return null;
  // Where the right answer goes depends on the exercise, not on chance: stable across visits.
  const at = [...puzzle.id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 3;
  const wrong = decoys.slice(0, 2);
  return [...wrong.slice(0, at), puzzle.goal, ...wrong.slice(at)];
}

export type Phase =
  /** Nothing to pick from: solved straight away. */
  | { kind: "none" }
  /** The answers wait for a pick; the board waits too. */
  | { kind: "asking" }
  /** `pick`: the answer picked (none when revealed). `earlier`: on an earlier visit. */
  | { kind: "answered"; prediction: Prediction; pick?: string; earlier: boolean };

/** On arriving at an exercise. */
export function arrive(choices: readonly string[] | null, goal: string, before: Seen): Phase {
  if (!choices) return { kind: "none" };
  const p = before.predicted;
  if (!p) return { kind: "asking" };
  const pick = before.pick ?? (p === "right" ? goal : undefined);
  return { kind: "answered", prediction: p, earlier: true, ...(pick !== undefined && p !== "revealed" ? { pick } : {}) };
}

/** A pick, or null to reveal the answer. Only an exercise still asking takes one. */
export function answer(phase: Phase, goal: string, pick: string | null): Phase {
  if (phase.kind !== "asking") return phase;
  if (pick === null) return { kind: "answered", prediction: "revealed", earlier: false };
  return { kind: "answered", prediction: pick === goal ? "right" : "wrong", pick, earlier: false };
}

/** How an answer card looks: still to pick, the right one (green), the wrong one picked (red), or neither. */
export function cardOf(phase: Phase, choice: string, goal: string): "open" | "right" | "picked" | "plain" {
  if (phase.kind === "asking") return "open";
  if (choice === goal) return "right";
  return phase.kind === "answered" && phase.pick === choice ? "picked" : "plain";
}

/** The board can be played on. */
export const canSolve = (phase: Phase) => phase.kind !== "asking";
