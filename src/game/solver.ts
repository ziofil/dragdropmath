import type { MathState } from "../expr/types";
import { withFlippedRel } from "../expr/build";
import { tidied } from "./tidy";
import { stateKey, type Ordering } from "../expr/key";
import { allNodes } from "../expr/tree";
import { rowCount, rowsOf } from "../expr/rows";
import { forgetMoves, stepsFrom, type RuleId } from "../rules";

/**
 * Has the learner reached the goal? "Make it look like" means it must look
 * like it: terms in the goal's order (7 + x is not x + 7), and factors too
 * (a·6b is not 6ab). An equation may be either way round (7 = x is x = 7),
 * an inequality too, read the other way (3 < x is x > 3).
 */
export function matchesGoal(state: MathState, goal: MathState, ordered: Ordering = "exact"): boolean {
  if (stateKey(state, ordered) === stateKey(goal, ordered)) return true;
  // Several rows (x = 2; y = 3): the same rows, in any order, each either way round.
  if (rowCount(state) > 1 || rowCount(goal) > 1) {
    const rows = (s: MathState) =>
      rowsOf(s)
        .map(({ sides }) => {
          const row = { sides, rel: s.rel };
          const a = stateKey(row, ordered);
          const b = stateKey(withFlippedRel({ sides: [row.sides[1], row.sides[0]] }, row), ordered);
          return a < b ? a : b;
        })
        .sort()
        .join(" & ");
    return (state.join ?? "and") === (goal.join ?? "and") && rows(state) === rows(goal);
  }
  if (state.sides.length === 2) {
    const swapped = withFlippedRel({ sides: [state.sides[1], state.sides[0]] }, state);
    return stateKey(swapped, ordered) === stateKey(goal, ordered);
  }
  return false;
}

/** Every state one move away, as the move leaves it (before tidying): each step once (see stepsFrom). */
export function moves(state: MathState, rules: readonly RuleId[]): MathState[] {
  return stepsFrom(state, rules).map((s) => s.state);
}

/** Every state one move away, tidied as the app tidies it. */
export const neighbours = (state: MathState, rules: readonly RuleId[]): MathState[] => moves(state, rules).map((n) => tidied(state, n));

export type SearchOpts = { ordered?: Ordering; maxDepth?: number; maxStates?: number };

/**
 * A shortest way from start to goal (breadth-first): every state on the way,
 * start and goal-matching end included, exactly as the moves make them (with
 * their marks, as a learner would have them). Null if none within `maxDepth`.
 */
export function solution(start: MathState, goal: MathState, rules: readonly RuleId[], opts: SearchOpts = {}): MathState[] | null {
  const ordered = opts.ordered ?? "exact";
  return search(start, (s) => matchesGoal(s, goal, ordered), rules, opts);
}

/** A shortest way from start to a state that is `done` (see solution). */
export function search(
  start: MathState,
  done: (s: MathState) => boolean,
  rules: readonly RuleId[],
  { ordered = "exact", maxDepth = 8, maxStates = 50_000 }: SearchOpts = {},
): MathState[] | null {
  let frontier = [start];
  const parent = new Map<MathState, MathState>();
  // Seen with notation: √x and x^(1/2) are a move apart, even where a goal doesn't mind which.
  const seen = new Set([stateKey(start, ordered, true)]);
  for (let depth = 0; depth <= maxDepth; depth++) {
    const found = frontier.find(done);
    if (found) {
      const path = [found];
      while (parent.has(path[0])) path.unshift(parent.get(path[0])!);
      return path;
    }
    if (depth === maxDepth) break;
    const next: MathState[] = [];
    for (const s of frontier) {
      const ns = neighbours(s, rules);
      // Expanded: its moves aren't needed again (the search keeps the state itself, for the path).
      forgetMoves(s);
      for (const n of ns) {
        const k = stateKey(n, ordered, true);
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

/** How big a state is (its nodes): what simplifying mostly makes smaller. */
const sizeOf = (s: MathState) => s.sides.reduce((n, e) => n + allNodes(e).length, 0);

/**
 * A way from start to a state that is `done`, found best-first: fewest moves
 * plus smallest states first (simplifying and solving mostly make a state
 * smaller). Not always the shortest way, but where an exercise takes ten
 * moves it finds one after a few hundred states, where breadth-first gives
 * up after tens of thousands. Null if none within `maxStates`.
 */
export function searchBest(start: MathState, done: (s: MathState) => boolean, rules: readonly RuleId[], { ordered = "exact" as Ordering, maxStates = 15_000 } = {}): MathState[] | null {
  type Node = { s: MathState; g: number; f: number; parent: Node | null };
  // A binary heap on f.
  const heap: Node[] = [];
  const push = (n: Node) => {
    heap.push(n);
    for (let i = heap.length - 1; i > 0; ) {
      const p = (i - 1) >> 1;
      if (heap[p].f <= heap[i].f) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = (): Node => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      for (let i = 0; ; ) {
        const [l, r] = [2 * i + 1, 2 * i + 2];
        let m = i;
        if (l < heap.length && heap[l].f < heap[m].f) m = l;
        if (r < heap.length && heap[r].f < heap[m].f) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  push({ s: start, g: 0, f: sizeOf(start), parent: null });
  const seen = new Set([stateKey(start, ordered, true)]);
  while (heap.length) {
    const at = pop();
    if (done(at.s)) {
      const path: MathState[] = [];
      for (let n: Node | null = at; n; n = n.parent) path.unshift(n.s);
      return path;
    }
    const ns = neighbours(at.s, rules);
    forgetMoves(at.s);
    for (const n of ns) {
      const k = stateKey(n, ordered, true);
      if (seen.has(k)) continue;
      seen.add(k);
      if (seen.size > maxStates) return null;
      push({ s: n, g: at.g + 1, f: at.g + 1 + sizeOf(n), parent: at });
    }
  }
  return null;
}

/**
 * This move does the step: it gives what the step shows, or the same in
 * another order (dropping the first x of x + 2 + x on the second gives
 * 2 + 2x, not 2x + 2: just as right). Not when the step is the order itself
 * (a reorder: the same terms as before, in any order), nor when it's the
 * sides swapped (18 = x to x = 18): then it must look exactly like it, or the
 * board would be done before a move.
 */
export function stepDone(before: MathState, next: MathState, want: MathState): boolean {
  if (matchesGoal(before, want, false)) return stateKey(next, "exact") === stateKey(want, "exact");
  return matchesGoal(next, want) || matchesGoal(next, want, false);
}
