/**
 * A chapter's exercise made off the page's thread: a Hard one is checked with
 * the move engine as it's made (generate/verify.ts), which can take a second
 * or two on a slow machine, and the page mustn't freeze meanwhile. Imported
 * on the page too, for when there's no worker (see util/worker.ts).
 */
import { practiceExercise, predictSeed, type Level } from "./generate/practice";
import { autoDecoys } from "./autoDecoys";
import { parseState } from "../expr/parse";
import { serve } from "../util/worker";

/** Practice's exercise at a seed, or the mind's eye's (another seed's, with its wrong answers). */
export type MakeRequest = { mode: "practice" | "predict"; chapter: string; level: Level; seed: number };
/** Null: no exercise there. `decoys`: the mind's eye's two wrong answers (fewer: none to offer). */
export type Made = { start: string; goal: string; positive: boolean; decoys: string[] } | null;

export function makeExercise({ mode, chapter, level, seed }: MakeRequest): Made {
  const d = practiceExercise(chapter, level, mode === "predict" ? predictSeed(seed) : seed);
  if (!d) return null;
  let decoys: string[] = [];
  if (mode === "predict")
    try {
      decoys = autoDecoys(parseState(d.start), parseState(d.goal));
    } catch {
      /* no wrong answers to offer: straight to solving */
    }
  return { start: d.start, goal: d.goal, positive: d.positive, decoys };
}

serve(makeExercise);
