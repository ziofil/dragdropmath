/**
 * A chapter's lesson is its moves: endless one-move drills, one kind per move.
 * A drill writes a small start where its move applies; the goal is what that
 * one move makes of it (found with the move engine, so it is always exactly
 * one move away). Each drill has its own words in i18n (`drills`).
 */
import type { RuleId } from "../../rules";
import { stepsFrom } from "../../rules";
import type { MathState } from "../../expr/types";
import { assuming } from "../../expr/setting";
import { parseState } from "../../expr/parse";
import { allNodes } from "../../expr/tree";
import { key, printState, stateKey } from "../../expr/key";
import { CHAPTERS, chapterById, lettersPositive, rulesOf } from "../puzzles";
import type { Drill } from "./drill";
import { one as pick, rng } from "./write";

export { carries, type Carry, type Drill } from "./drill";

/** Each chapter's drills, in the order a learner meets the moves (from the chapters themselves). */
export const DRILLS: Record<string, Drill[]> = Object.fromEntries(CHAPTERS.map((c) => [c.id, c.drills]));

/** The left side's first term (the left side, if it isn't a sum). */
const firstTerm = (s: MathState) => (s.sides[0].kind === "sum" ? s.sides[0].terms[0] : s.sides[0]);

export const drillsOf = (chapterId: string): Drill[] => DRILLS[chapterId] ?? [];
export const drillById = (chapterId: string, id: string) => drillsOf(chapterId).find((x) => x.id === id);

/** Every state one `rule` move makes of `state` (drags a learner can make, and taps). */
export function oneMove(state: MathState, rule: RuleId, rules: readonly RuleId[]): MathState[] {
  return stepsFrom(state, rules)
    .filter((s) => s.ways.some((w) => w.candidate.rule === rule))
    .map((s) => s.state);
}

/**
 * A board for a drill, made from a seed: its start, its goal, and everything
 * else that counts as done (`also`). A move complete in itself: what it
 * makes, every way it can be made (either bracket of (x + 1)(x + 2) dropped
 * on the other). A move that leaves things half done: where the board
 * finishes, a few moves on. A start the move can't be made on (or whose
 * result can't be written back as it is) is tried again with the next
 * numbers. `positive`: its letters stand for positive numbers.
 */
export function drillExercise(chapterId: string, drillId: string, seed: number): { start: string; goal: string; also: string[]; via?: string[]; positive: boolean } | null {
  const drill = drillById(chapterId, drillId);
  const chapter = chapterById(chapterId);
  if (!drill || !chapter) return null;
  const rules = rulesOf(chapterId);
  const r = rng(seed);
  for (let tries = 0; tries < 30; tries++) {
    const made = drill.make(r);
    const { start, want, goal: finish, via } = typeof made === "string" ? { start: made, via: undefined } : made;
    const parsed = parseState(start);
    const positive = lettersPositive(chapter, start);
    const state: MathState = assuming(parsed, positive);
    const results = oneMove(state, drill.rule, rules).filter((s) => !want || key(firstTerm(s)) === key(parseState(want).sides[0]));
    if (!results.length) continue;
    // Finished a few moves on: that's the goal, whichever way the move was made.
    if (finish) return { start, goal: finish, also: [], ...(via ? { via } : {}), positive };
    // The plainest of what the move can make (the 3 across x + 3 = 10, not the 10), else any.
    const size = (s: MathState) => s.sides.reduce((n, e) => n + allNodes(e).length, 0) - (s.sides.some((e) => e.kind === "var") ? 1 : 0);
    const least = Math.min(...results.map(size));
    const goal = printState(pick(r, results.filter((s) => size(s) === least)));
    // The goal must read back as the very state the move makes.
    if (results.some((s) => stateKey(s, "exact") === stateKey(parseState(goal), "exact")))
      return { start, goal, also: results.map(printState).filter((g) => g !== goal), positive };
  }
  return null;
}
