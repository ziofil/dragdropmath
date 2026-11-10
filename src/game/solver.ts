import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { candidatesFor, handles, isGrabbable, tapFor, type RuleId } from "../rules";

/**
 * Has the learner reached the goal? "Make it look like" means the terms must
 * be in the goal's order (7 + x is not x + 7). Factor order is free (6y = y·6,
 * and a tap tidies it), and an equation may be written either way round,
 * since there's no move to swap its sides.
 */
export function matchesGoal(state: MathState, goal: MathState, ordered = true): boolean {
  if (stateKey(state, ordered) === stateKey(goal, ordered)) return true;
  if (state.sides.length === 2) {
    const swapped = { sides: [state.sides[1], state.sides[0]] };
    return stateKey(swapped, ordered) === stateKey(goal, ordered);
  }
  return false;
}

export function neighbours(state: MathState, rules: readonly RuleId[]): MathState[] {
  return handles(state)
    .filter((id) => isGrabbable(state, id, rules)) // only grabs a learner can actually make
    .flatMap((id) => [...candidatesFor(state, id, rules), tapFor(state, id, rules)])
    .flatMap((c) => (c ? [c.state] : []));
}

/** Fewest steps from start to goal (breadth-first), or null if not found within `maxDepth`. Used to check exercises are solvable. */
export function fewestMoves(
  start: MathState,
  goal: MathState,
  rules: readonly RuleId[],
  { ordered = true, maxDepth = 8, maxStates = 50_000 } = {},
): number | null {
  let frontier = [start];
  const seen = new Set([stateKey(start, ordered)]);
  for (let depth = 0; depth <= maxDepth; depth++) {
    if (frontier.some((s) => matchesGoal(s, goal, ordered))) return depth;
    const next: MathState[] = [];
    for (const s of frontier) {
      for (const n of neighbours(s, rules)) {
        const k = stateKey(n, ordered);
        if (seen.has(k)) continue;
        seen.add(k);
        next.push(n);
      }
    }
    if (seen.size > maxStates) return null;
    frontier = next;
  }
  return null;
}
