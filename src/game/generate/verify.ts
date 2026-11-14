/**
 * Checking a candidate with the real move engine: from the start, by each
 * milestone, to the goal, a few moves at a time (any order of terms at a
 * milestone; the goal exactly as shown). The way found is a real solution,
 * drag by drag, with only the moves the chapter allows — and its length is
 * how many moves the exercise takes.
 */
import { parseState } from "../../expr/parse";
import { printState } from "../../expr/key";
import type { MathState } from "../../expr/types";
import type { RuleId } from "../../rules";
import { solution } from "../solver";
import type { Draft } from "./write";

/** Moves allowed between two milestones. */
const LEG = 5;

export type Checked = { moves: number; way: string[] } | { moves: null; stuck: string };

/** `positive`: the chapter's letters stand for positive numbers (see lettersPositive). */
export function verify(d: Draft, rules: readonly RuleId[], positive = false): Checked {
  let at: MathState = { ...parseState(d.start), ...(positive ? { letters: "positive" as const } : {}) };
  const way = [printState(at)];
  const targets = [...d.via, d.goal];
  for (let i = 0; i < targets.length; i++) {
    const last = i === targets.length - 1;
    const leg = solution(at, parseState(targets[i]), rules, { ordered: last ? "exact" : false, maxDepth: LEG, maxStates: 40_000 });
    if (!leg) return { moves: null, stuck: `${printState(at)} ⇢ ${targets[i]}` };
    way.push(...leg.slice(1).map(printState));
    at = leg[leg.length - 1];
  }
  return { moves: way.length - 1, way };
}
