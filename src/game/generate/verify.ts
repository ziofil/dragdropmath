/**
 * The one check that an exercise can be done by hand: from the start, by each
 * milestone, to a finish the app accepts (task.ts), a few moves at a time
 * (any order of terms at a milestone), with only the chapter's moves. The way
 * found is a real solution, drag by drag, every state as the moves and
 * tidying make it. Exercises built backwards (unmove.ts) say which moves
 * each stretch takes: searched with those alone first, a check takes
 * milliseconds.
 */
import { assuming } from "../../expr/setting";
import { parseState } from "../../expr/parse";
import { printState } from "../../expr/key";
import type { MathState } from "../../expr/types";
import type { RuleId } from "../../rules";
import { matchesGoal, search, searchBest } from "../solver";
import { isDone, taskOf } from "../task";

export type Checkable = { start: string; goal: string; via: readonly string[]; positive?: boolean; legs?: readonly (readonly RuleId[])[] };

/** The way through, every state from start to finish; or the stretch it couldn't do. */
export type Checked = { path: MathState[] } | { stuck: string };

/** Moves allowed between two milestones; states looked at per stretch. */
const LEG = 5;
const STATES = 40_000;
const QUICK_STATES = 600;
/** States looked at best-first before searching breadth-first. */
const BEST_STATES = 3000;

/**
 * `quick`: only the moves each stretch says it takes, a few hundred states a
 * stretch (milliseconds, mostly); a draft that doesn't say isn't checked.
 */
export function verify(d: Checkable, rules: readonly RuleId[], { leg = LEG, states = STATES, quick = false } = {}): Checked {
  if (quick && !d.legs) return { path: [] };
  const start = parseState(d.start);
  const goal = parseState(d.goal);
  const path: MathState[] = [assuming(start, d.positive)];
  const targets = [...d.via.map(parseState), goal];
  // Terms in any order count, except at the end of a "make it look like this" (task.ts).
  const exact = taskOf(goal).kind === "match";
  const allowed = new Set(rules);
  const reorder = rules.filter((x) => REORDER.includes(x));
  for (const [i, target] of targets.entries()) {
    const last = i === targets.length - 1;
    const at = path[path.length - 1];
    // The moves the stretch takes, when the draft knows them (a few, so quick), else (or failing that) all the chapter's.
    const own = d.legs?.[i]?.filter((x) => allowed.has(x));
    // Best-first first (quick where a stretch is a few obvious moves among many possible ones), breadth-first failing that.
    const find = (done: (s: MathState) => boolean, from: MathState, opts: { ordered: false | "exact"; maxDepth: number; maxStates: number }) => {
      if (quick) return searchBest(from, done, own ?? [], { ordered: opts.ordered, maxStates: QUICK_STATES }) ?? search(from, done, own ?? [], { ...opts, maxStates: QUICK_STATES });
      return (own && search(from, done, own, opts)) || searchBest(from, done, rules, { ordered: opts.ordered, maxStates: BEST_STATES }) || search(from, done, rules, opts);
    };
    let way: MathState[] | null;
    if (last && exact) {
      // A goal to match exactly: its terms in any order first (the work), then put in its order (a few drags).
      const loose = find((s) => matchesGoal(s, goal, false), at, { ordered: false, maxDepth: leg, maxStates: states });
      const tight = loose && search(loose[loose.length - 1], (s) => isDone(goal, s), reorder, { ordered: "exact", maxDepth: leg, maxStates: states });
      way = loose && tight ? [...loose, ...tight.slice(1)] : find((s) => isDone(goal, s), at, { ordered: "exact", maxDepth: leg, maxStates: states });
    } else way = find(last ? (s) => isDone(goal, s) : (s) => matchesGoal(s, target, false), at, { ordered: false, maxDepth: leg, maxStates: states });
    if (!way) return { stuck: `${printState(at)} ⇢ ${printState(target)}` };
    path.push(...way.slice(1));
  }
  return { path };
}

/** Moves that only put terms in another order (or a number in front). */
const REORDER: RuleId[] = ["commute", "numbers-first"];

/** Its stuck stretch, for a test's message ("" when it went through). */
export const stuckOf = (c: Checked) => ("stuck" in c ? c.stuck : "");

