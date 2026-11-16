/**
 * Can this exercise be solved with these moves? Searched off the main thread,
 * for checking a set of one's own: best-first (solver.ts), done as the app
 * judges it (task.ts: a solved equation's terms in any order), so even an
 * exercise of ten moves is found in well under a second.
 */
import { REORDER } from "./generate/verify";
import { assuming } from "../expr/setting";
import { parseState } from "../expr/parse";
import type { RuleId } from "../rules";
import { matchesGoal, search, searchBest } from "./solver";
import { isDone, taskOf } from "./task";
import { serve } from "../util/worker";

/** `positive`: the letters stand for positive numbers, as when the exercise is played. */
export type SolveRequest = { start: string; goal: string; rules: RuleId[]; positive: boolean };

/** The moves a way through takes (not always the fewest), or null if none was found. */
export function solveMoves({ start, goal, rules, positive }: SolveRequest): number | null {
  const from = parseState(start);
  const to = parseState(goal);
  const task = taskOf(to);
  // The terms in any order first (what takes the work); a goal to match exactly is then a few swaps away.
  const way = searchBest(assuming(from, positive), (s) => (task.kind === "match" ? matchesGoal(s, to, false) : isDone(to, s, task)), rules, { ordered: false });
  if (!way || task.kind !== "match") return way ? way.length - 1 : null;
  const order = search(way[way.length - 1], (s) => isDone(to, s, task), rules.filter((r) => REORDER.includes(r)), { ordered: "exact", maxDepth: 8, maxStates: 20_000 });
  return order ? way.length + order.length - 2 : null;
}

// (In a worker; imported elsewhere, as by the tests or the page when there's no worker, it only lends solveMoves.)
serve(solveMoves);
