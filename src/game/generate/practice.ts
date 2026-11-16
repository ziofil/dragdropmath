/**
 * More practice: a fresh exercise for a chapter, at a level, made up on the
 * spot from a seed (so its link always gives the same one). No search runs
 * here (a few milliseconds an exercise): exercises built backwards
 * (unmove.ts) are right by construction, and every shape is checked with
 * the move engine in the tests (testing/practiceChecks.ts), quickly with the
 * moves each stretch says it takes, and fully.
 */
import { LEVELS, rng, type Draft, type Level, type Rng, type Shape } from "./write";
import { SHAPES } from "./served";
import { judge } from "./beauty";
import { parseState } from "../../expr/parse";
import { autoDecoys } from "../autoDecoys";

export { LEVELS, type Level };

/** An exercise as practice serves it: whether its letters are positive is always said. */
export type Exercise = Draft & { positive: boolean };

/** The chapters with practice, and the shapes at each level. */
export const PRACTICE = SHAPES;

export const hasPractice = (chapterId: string) => LEVELS.every((l) => (SHAPES[chapterId]?.[l].length ?? 0) > 0);

/** Drafts that pass the hard rules, among the best-scoring of which one is kept. */
const POOL = 12;
/** How far below the best a draft may score and still be picked: the best alone would nearly always be the same one. */
const NEAR_BEST = 10;

/**
 * The exercise for this seed: a shape of the level, the nicest of a few
 * tries. Which shape is drawn by weight from the seed and the shapes' ids
 * alone (each shape's draw is its own), and each shape's tries are seeded
 * by the seed and its id: adding or removing a shape leaves the other
 * shapes' links as they were. A shape that makes nothing usable from this
 * seed hands over to the next best drawn, so a level never comes up empty.
 */
export const practiceExercise = (chapterId: string, level: Level, seed: number): Exercise | null => exerciseOf(PRACTICE[chapterId]?.[level] ?? [], seed);

/** The mind's eye's exercise at a seed is practice's at another: one solved in practice would be a free point there. */
export const predictSeed = (seed: number) => (seed ^ 0x5bd1e995) >>> 0;

/** The exercise for this seed among these shapes (see practiceExercise). */
export function exerciseOf(shapes: readonly Shape[], seed: number): Exercise | null {
  // Weighted rendezvous: each shape draws u in (0, 1) from (seed, id); the largest u^(1/weight) wins.
  const drawn = shapes.map((s) => ({ s, at: Math.log(rng(mix(seed, s.id)).next() || Number.MIN_VALUE) / (s.weight ?? 1) })).sort((a, b) => b.at - a.at);
  for (const { s } of drawn) {
    const d = nicest(s, rng(mix(seed, s.id) ^ 0x5bd1e995));
    if (d) return { ...d, positive: d.positive ?? false };
  }
  return null;
}

/** The seed mixed with a shape's id (FNV-1a), so each shape's draw is its own. */
function mix(seed: number, id: string): number {
  let h = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619) >>> 0;
  return h;
}

export function nicest(s: Shape, r: Rng): Draft | null {
  const found: { d: Draft; score: number }[] = [];
  let tries = 0;
  // A pool of drafts, the nicest checked first; when every one fails its check, a fresh pool (within the tries).
  while (tries < 500) {
    for (; found.length < (s.pool ?? POOL) && tries < 500; tries++) {
      const d = s.make(r);
      if (!d) continue;
      const v = s.curated ? { ok: true, score: 0 } : judge(d);
      if (!v.ok || !predictable(d)) continue;
      found.push({ d, score: v.score });
    }
    if (!found.length) return null;
    while (found.length) {
      const best = Math.max(...found.map((f) => f.score));
      const near = found.filter((f) => f.score >= best - NEAR_BEST);
      const pick = near[r.int(0, near.length - 1)];
      const passed = s.check ? s.check(pick.d) : pick.d;
      if (passed) return passed;
      found.splice(found.indexOf(pick), 1);
    }
    if (!s.check) return null;
  }
  return null;
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
