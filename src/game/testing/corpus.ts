/**
 * What the tests try things on: the states learners actually meet. Every
 * move of every lesson (its board's start), and every practice shape at every
 * level (one exercise each, from a fixed seed), with the moves its chapter
 * allows. The same every run.
 */
import { CHAPTERS, rulesOf, startOf, type Chapter } from "../puzzles";
import { candidatesFor, handles, isGrabbable, type RuleId } from "../../rules";
import { DRILLS, drillExercise } from "../generate/moves";
import { LEVELS, PRACTICE } from "../generate/practice";
import { judge } from "../generate/beauty";
import { rng } from "../generate/write";

export type Case = {
  /** "fractions/move/add-fractions", "fractions/hard/fraction-of-fractions". */
  id: string;
  kind: "move" | "practice";
  chapter: Chapter;
  rules: RuleId[];
  start: string;
  goal: string;
  /** Checkpoints along one way to solve it. */
  via: string[];
  /** Its letters stand for positive numbers. */
  positive: boolean;
};

/** Slow runs (`npm run test:all`) try everything on every case; quick ones skip the biggest. */
export const SLOW = !!(globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.SLOW;
/** Possible drags (every piece's moves) above which a case waits for a slow run: exhaustive checks grow fast with them. */
const BIG = 20;

/** How many drags its start allows. */
export function drags(c: Case): number {
  const s = startOf(c.start, c.chapter, c.positive);
  return handles(s)
    .filter((h) => isGrabbable(s, h, c.rules))
    .reduce((n, h) => n + candidatesFor(s, h, c.rules).length, 0);
}

/** The cases for an exhaustive check: all of them in a slow run, else all but the biggest. */
export const forExhaustive = (cases: readonly Case[]) => (SLOW ? cases : cases.filter((c) => drags(c) <= BIG));

const SEED = 1;

function build(): Case[] {
  return CHAPTERS.flatMap((chapter) => {
    const rules = rulesOf(chapter.id);
    const moves = (DRILLS[chapter.id] ?? []).flatMap((d): Case[] => {
      const ex = drillExercise(chapter.id, d.id, SEED);
      return ex ? [{ id: `${chapter.id}/move/${d.id}`, kind: "move", chapter, rules, start: ex.start, goal: ex.goal, via: ex.via ?? [], positive: ex.positive }] : [];
    });
    const practice = LEVELS.flatMap((level) =>
      (PRACTICE[chapter.id]?.[level] ?? []).flatMap((shape): Case[] => {
        // A composed shape is many shapes in one: a few of its exercises (more in a slow run).
        const count = shape.id === "composed" ? (SLOW ? 10 : 3) : 1;
        const r = rng(SEED);
        const out: Case[] = [];
        for (let tries = 0; out.length < count && tries < 500; tries++) {
          const d = shape.make(r);
          if (d && judge(d).ok && !out.some((c) => c.start === d.start))
            out.push({ id: `${chapter.id}/${level}/${shape.id}${count > 1 ? `-${out.length + 1}` : ""}`, kind: "practice", chapter, rules, start: d.start, goal: d.goal, via: d.via, positive: d.positive ?? false });
        }
        return out;
      }),
    );
    return [...moves, ...practice];
  });
}

let built: Case[] | null = null;
/** Every case, in chapter order: its moves, then its practice shapes, easy to hard. */
export const corpus = (): readonly Case[] => (built ??= build());

/** Every `n`th case from the `k`th: one shard, for running a slow check in parallel. */
export const shard = (k: number, n: number) => corpus().filter((_, i) => i % n === k);
