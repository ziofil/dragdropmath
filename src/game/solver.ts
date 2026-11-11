import type { MathState } from "../expr/types";
import { withFlippedRel } from "../expr/build";
import { tidied } from "./tidy";
import { stateKey } from "../expr/key";
import { candidatesFor, handles, isGrabbable, tapFor, type RuleId } from "../rules";

/**
 * Has the learner reached the goal? "Make it look like" means the terms must
 * be in the goal's order (7 + x is not x + 7). Factor order is free (tidying
 * writes y·6 as 6y anyway), and an equation may be either way round (7 = x is
 * x = 7), an inequality too, read the other way (3 < x is x > 3).
 */
export function matchesGoal(state: MathState, goal: MathState, ordered = true): boolean {
  if (stateKey(state, ordered) === stateKey(goal, ordered)) return true;
  if (state.sides.length === 2) {
    const swapped = withFlippedRel({ sides: [state.sides[1], state.sides[0]] }, state);
    return stateKey(swapped, ordered) === stateKey(goal, ordered);
  }
  return false;
}

/** Every state one move away, as the move leaves it (before tidying). */
export function moves(state: MathState, rules: readonly RuleId[]): MathState[] {
  return handles(state).flatMap((id) => [
    // Only drags a learner can actually make (a handle's), and taps.
    ...(isGrabbable(state, id, rules) ? candidatesFor(state, id, rules).map((c) => c.state) : []),
    ...(tapFor(state, id, rules) ? [tapFor(state, id, rules)!.state] : []),
  ]);
}

/** Every state one move away, tidied as the app tidies it. */
export const neighbours = (state: MathState, rules: readonly RuleId[]): MathState[] => moves(state, rules).map((n) => tidied(state, n));

type SearchOpts = { ordered?: boolean; maxDepth?: number; maxStates?: number };

/**
 * A shortest way from start to goal (breadth-first): every state on the way,
 * start and goal-matching end included, exactly as the moves make them (with
 * their marks, as a learner would have them). Null if none within `maxDepth`.
 */
export function solution(
  start: MathState,
  goal: MathState,
  rules: readonly RuleId[],
  { ordered = true, maxDepth = 8, maxStates = 50_000 }: SearchOpts = {},
): MathState[] | null {
  let frontier = [start];
  const parent = new Map<MathState, MathState>();
  const seen = new Set([stateKey(start, ordered)]);
  for (let depth = 0; depth <= maxDepth; depth++) {
    const done = frontier.find((s) => matchesGoal(s, goal, ordered));
    if (done) {
      const path = [done];
      while (parent.has(path[0])) path.unshift(parent.get(path[0])!);
      return path;
    }
    const next: MathState[] = [];
    for (const s of frontier) {
      for (const n of neighbours(s, rules)) {
        const k = stateKey(n, ordered);
        if (seen.has(k)) continue;
        seen.add(k);
        parent.set(n, s);
        next.push(n);
        // Checked as states come in: one level can be huge (fractions branch a lot).
        if (seen.size > maxStates) return null;
      }
    }
    frontier = next;
  }
  return null;
}

/** Fewest steps from start to goal, or null if not found within `maxDepth`. Used to check exercises are solvable. */
export function fewestMoves(start: MathState, goal: MathState, rules: readonly RuleId[], opts: SearchOpts = {}): number | null {
  const path = solution(start, goal, rules, opts);
  return path ? path.length - 1 : null;
}
