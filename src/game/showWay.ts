/**
 * The way Show plays a lesson board to its end: after the lesson's own move
 * (render/demo.ts), every step on to the goal, through the board's
 * checkpoints (`via`: they pin the way its words describe), each state as
 * the board shows it (tidied). Searched when Show is pressed, so it starts
 * from wherever the board then is.
 */
import type { MathState } from "../expr/types";
import type { RuleId } from "../rules";
import { matchesGoal, search, searchBest, stepDone } from "./solver";
import { assuming } from "../expr/setting";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";

/** A checkpoint is passed when the board shows it, in any order of terms. */
const at = (s: MathState, stop: MathState) => matchesGoal(s, stop) || matchesGoal(s, stop, false);

/**
 * The states from `from` to a state `done` likes, through those of `stops`
 * not yet passed (in order), each step a move and its tidying; [] when
 * `from` is done already, null when there's no way within reach.
 */
export function wayOn(from: MathState, stops: readonly MathState[], done: (s: MathState) => boolean, rules: readonly RuleId[]): MathState[] | null {
  if (done(from)) return [];
  // The checkpoints still ahead: after the last one the board has passed.
  const passed = stops.findLastIndex((s) => at(from, s));
  const ahead = stops.slice(passed + 1);
  const out: MathState[] = [];
  let now = from;
  for (const stop of [...ahead, null]) {
    // The goal may come on the way to a checkpoint (the goal says where the board ends): it ends there.
    const end = (s: MathState) => done(s) || (stop !== null && at(s, stop));
    // The shortest way if it's near; else a good one, quickly (best-first: a long board branches a lot).
    // States that differ only in the order of terms are one (swapping terms is never a step worth showing).
    const leg = search(now, end, rules, { ordered: false, maxDepth: 4, maxStates: 1_500 }) ?? searchBest(now, end, rules, { ordered: false, maxStates: 6_000 });
    if (!leg) return null;
    out.push(...leg.slice(1));
    now = leg[leg.length - 1];
    if (done(now)) return out;
  }
  return null;
}

/** Asked of the worker (showWorker.ts): states as written (printState), the board's letters as it says. */
export type WayRequest = { id: number; start: string; from: string; stops: string[]; goals: string[]; rules: RuleId[]; positive: boolean };
export type WayAnswer = { id: number; way: string[] | null };

/** The way on (see wayOn) for a request: the board's own done-check rebuilt from its start and goals. */
export function wayFor({ start, from, stops, goals, rules, positive }: Omit<WayRequest, "id">): string[] | null {
  const read = (s: string) => assuming(parseState(s), positive);
  const begin = read(start);
  const wants = goals.map(read);
  const done = (s: MathState) => wants.some((w) => stepDone(begin, s, w));
  return wayOn(read(from), stops.map(read), done, rules)?.map(printState) ?? null;
}
