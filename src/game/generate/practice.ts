/**
 * More practice: a fresh exercise for a chapter, at a level, made up on the
 * spot from a seed (so its link always gives the same one). No search runs
 * here: every shape is checked with the move engine in practice.test.ts.
 */
import { LEVELS, rng, type Draft, type Level, type Rng, type Shape } from "./write";
import { SHAPES } from "./chapters";
import { judge } from "./beauty";
import { parseState } from "../../expr/parse";
import { autoDecoys } from "../autoDecoys";

export { LEVELS, type Level };

/** The chapters with practice, and the shapes at each level. */
export const PRACTICE = SHAPES;

export const hasPractice = (chapterId: string) => LEVELS.every((l) => (SHAPES[chapterId]?.[l].length ?? 0) > 0);

/** Drafts that pass the hard rules, among the best-scoring of which one is kept. */
const POOL = 12;
/** How far below the best a draft may score and still be picked: the best alone would nearly always be the same one. */
const NEAR_BEST = 10;

/**
 * The exercise for this seed: a shape of the level, the nicest of a few
 * tries. A shape that makes nothing usable from this seed hands over to the
 * level's next one, so a level never comes up empty.
 */
export function practiceExercise(chapterId: string, level: Level, seed: number): Draft | null {
  const shapes = PRACTICE[chapterId]?.[level];
  if (!shapes?.length) return null;
  const r = rng(seed);
  const first = r.int(0, shapes.length - 1);
  for (let k = 0; k < shapes.length; k++) {
    const d = nicest(shapes[(first + k) % shapes.length], r);
    if (d) return d;
  }
  return null;
}

function nicest(s: Shape, r: Rng): Draft | null {
  const found: { d: Draft; score: number }[] = [];
  for (let tries = 0; found.length < POOL && tries < 500; tries++) {
    const d = s.make(r);
    if (!d) continue;
    const v = judge(d);
    if (!v.ok || !predictable(d)) continue;
    found.push({ d, score: v.score });
  }
  if (!found.length) return null;
  const best = Math.max(...found.map((f) => f.score));
  const near = found.filter((f) => f.score >= best - NEAR_BEST);
  return near[r.int(0, near.length - 1)].d;
}

/** It has two wrong answers to predict between (see autoDecoys). */
function predictable(d: Draft): boolean {
  try {
    return autoDecoys(parseState(d.start), parseState(d.goal)).length >= 2;
  } catch {
    return false;
  }
}

/** A new seed, for "another one". */
export const freshSeed = () => Math.floor(Math.random() * 1_000_000_000);
