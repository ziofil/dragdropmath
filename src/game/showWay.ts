/**
 * The way Show plays a lesson board to its end: after the lesson's own move
 * (render/demo.ts), every step on to the goal, through the board's
 * checkpoints (`via`: they pin the way its words describe), each state as
 * the board shows it (tidied). Searched when Show is pressed, so it starts
 * from wherever the board then is.
 */
import type { MathState } from "../expr/types";
import type { RuleId } from "../rules";
import { atCheckpoint, search, searchBest, stepDone } from "./solver";
import { assuming } from "../expr/setting";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { verify } from "./generate/verify";

/**
 * How many of the checkpoints (in order) the board has passed, from the
 * states it has shown since its start (`seen`, the board now last): a
 * checkpoint is passed once the board has been at it (atCheckpoint), and
 * stays passed as the board goes on to the next, however far along that
 * stretch it is (where the board is now says nothing of that: it is at no
 * checkpoint). Taken back by Undo, as its states are. A checkpoint further
 * on counts too, and those before it with it (two stretches done in one).
 */
export function passedIn(seen: readonly MathState[], stops: readonly MathState[]): number {
  let passed = 0;
  for (const s of seen)
    for (let j = stops.length - 1; j >= passed; j--)
      if (atCheckpoint(s, stops[j])) {
        passed = j + 1;
        break;
      }
  return passed;
}

/**
 * The states from the board (the last of `seen`, the states it has shown) to
 * a state `done` likes, through those of `stops` it hasn't passed (in order),
 * each step a move and its tidying; [] when it's done already, null when
 * there's no way within reach.
 */
export function wayOn(seen: readonly MathState[], stops: readonly MathState[], done: (s: MathState) => boolean, rules: readonly RuleId[]): MathState[] | null {
  const from = seen[seen.length - 1];
  if (done(from)) return [];
  const ahead = stops.slice(passedIn(seen, stops));
  const out: MathState[] = [];
  let now = from;
  for (const stop of [...ahead, null]) {
    // A checkpoint is passed on the way, even where the goal is nearer (they pin the way the words describe:
    // 25 split into 5·5 before the factor comes out); after the last, the goal.
    const end = (s: MathState) => (stop === null ? done(s) : atCheckpoint(s, stop));
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

/** Asked of the worker (showWorker.ts): states as written (printState), the board's letters as it says; `seen` the states the board has shown, now last. */
export type WayRequest = { start: string; seen: string[]; stops: string[]; goals: string[]; rules: RuleId[]; positive: boolean };

/** The way on (see wayOn) for a request: the board's own done-check rebuilt from its start and goals. */
export function wayFor({ start, seen, stops, goals, rules, positive }: WayRequest): string[] | null {
  const read = (s: string) => assuming(parseState(s), positive);
  const begin = read(start);
  const wants = goals.map(read);
  const done = (s: MathState) => wants.some((w) => stepDone(begin, s, w));
  return wayOn(seen.map(read), stops.map(read), done, rules)?.map(printState) ?? null;
}

/**
 * Asked for an exercise's next step (practice's Next step): the states the board has shown (now last), its goal,
 * the milestones of the way it was made and (when known) the moves each stretch takes.
 */
export type NextRequest = { seen: string[]; goal: string; via: string[]; legs?: RuleId[][]; rules: RuleId[]; positive: boolean };

/**
 * The way on for an exercise, from wherever the board is (each state as the
 * board shows it, tidied), to its goal as the exercise judges it (task.ts):
 * through the milestones it hasn't passed (passedIn), checked as the exercise was when it
 * was made (generate/verify.ts: a goal to match exactly ends with its terms
 * put in order). Null when no way is within reach (a board led far off: Undo,
 * or Start over). The whole way, not just its first step: searched again
 * from each step, a way can wander back and forth, so Next step follows one
 * way while the board stays on it.
 *
 * Quick first (each stretch with the moves it's known to take: milliseconds),
 * then with all the chapter's moves on a budget (a board led off the way).
 */
export function nextStep({ seen, goal, via, legs, rules, positive }: NextRequest): string[] | null {
  const read = (s: string) => assuming(parseState(s), positive);
  const passed = passedIn(seen.map(read), via.map(read));
  const d = { start: seen[seen.length - 1], goal, via: via.slice(passed), positive, ...(legs ? { legs: legs.slice(passed) } : {}) };
  for (const opts of [{ quick: true }, { leg: 4, states: 4_000 }, { leg: 5, states: 20_000 }]) {
    const checked = verify(d, rules, opts);
    if ("path" in checked && checked.path.length > 1) return checked.path.slice(1).map(printState);
  }
  return null;
}
