/**
 * Can this exercise be solved with these moves? Searched off the main thread
 * (it can take a few seconds), for checking a set of one's own.
 */
import { parseState } from "../expr/parse";
import type { RuleId } from "../rules";
import { solution } from "./solver";

/** `positive`: the letters stand for positive numbers, as when the exercise is played. */
export type SolveRequest = { id: number; start: string; goal: string; rules: RuleId[]; positive: boolean };
export type SolveAnswer = { id: number; moves: number | null };

self.onmessage = (e: MessageEvent<SolveRequest>) => {
  const { id, start, goal, rules, positive } = e.data;
  const from = parseState(start);
  const path = solution(positive ? { ...from, letters: "positive" } : from, parseState(goal), rules, { maxDepth: 10, maxStates: 40_000 });
  self.postMessage({ id, moves: path ? path.length - 1 : null } satisfies SolveAnswer);
};
