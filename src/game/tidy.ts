/**
 * Tidying, done for the learner right after each move: x·2 → 2x, 1·x → x,
 * x¹ → x, (x + 3)·3 → 3(x + 3). It's writing things the usual way, not
 * algebra, so it isn't left to the learner (who does all real steps).
 *
 * It only touches what the move just made (a 2x + 3·x an exercise starts
 * with stays as it is), and never returns to a state already seen.
 */
import type { Expr, MathState } from "../expr/types";
import { key, stateKey } from "../expr/key";
import { allNodes, children, mapTree } from "../expr/tree";
import { normalize } from "../expr/build";
import { candidatesFor, handles, signOwner, tapFor, type RuleId } from "../rules";

const TIDY_RULES: RuleId[] = ["numbers-first", "power-one"];

/** Each tidying step is shown as a move of its own, this long after the one before. */
export const TIDY_STEP_MS = 420;

/** At most this many tidying steps after one move. */
const MAX_STEPS = 12;

/**
 * Ids of the nodes in `after` that a move from `before` made: new or changed
 * nodes, and everything inside a new one.
 */
function changedIds(before: MathState, after: MathState): Set<string> {
  const old = new Map(before.sides.flatMap(allNodes).map((n) => [n.id, key(n, "exact")]));
  const out = new Set<string>();
  const visit = (e: Expr, insideNew: boolean) => {
    const isNew = !old.has(e.id);
    if (insideNew || isNew || old.get(e.id) !== key(e, "exact")) out.add(e.id);
    // A changed container (the whole sum, after one of its terms moved) doesn't
    // make its untouched terms count; a new one does.
    for (const c of children(e)) visit(c, insideNew || isNew);
  };
  after.sides.forEach((e) => visit(e, false));
  return out;
}

/**
 * The tidying steps after a move from `before` to `after`, in order (empty
 * when there's nothing to tidy). `earlier`: states already been through.
 */
export function tidySteps(before: MathState, after: MathState, earlier: readonly MathState[] = [before]): MathState[] {
  const seen = new Set([...earlier, before, after].map((s) => stateKey(s, "exact")));
  let touched = changedIds(before, after);
  let cur = after;
  const out: MathState[] = [];
  for (let step = 0; step < MAX_STEPS; step++) {
    const next = nextStep(cur, touched, seen);
    if (!next) break;
    touched = new Set([...touched, ...changedIds(cur, next)]);
    seen.add(stateKey(next, "exact"));
    out.push(next);
    cur = next;
  }
  return out;
}

/** Where a move ends up once tidied. */
export const tidied = (before: MathState, after: MathState): MathState => tidySteps(before, after).at(-1) ?? after;

/**
 * A bracket a move multiplied into (Sum.grouped) lets go once it's been seen:
 * its terms join the sum around it (or it's a whole side). Under a minus, or
 * as a factor, the bracket is needed, and stays.
 */
function ungroup(state: MathState): MathState | null {
  for (let i = 0; i < state.sides.length; i++) {
    const free = (e: Expr, parent: Expr | null): Expr | null => {
      if (e.kind === "sum" && e.grouped && (parent === null || parent.kind === "sum")) return e;
      for (const c of children(e)) {
        const found = free(c, e);
        if (found) return found;
      }
      return null;
    };
    const g = free(state.sides[i], null);
    if (!g) continue;
    const sides = state.sides.slice();
    sides[i] = normalize(mapTree(sides[i], (e) => (e.id === g.id && e.kind === "sum" ? { kind: "sum", id: e.id, terms: e.terms, ...(e.from ? { from: e.from } : {}) } : e)));
    return { ...state, sides };
  }
  return null;
}

function nextStep(state: MathState, touched: ReadonlySet<string>, seen: ReadonlySet<string>): MathState | null {
  // First a bracket that has been seen lets go, then the usual tidying.
  const open = ungroup(state);
  if (open && !seen.has(stateKey(open, "exact"))) return open;
  for (const id of handles(state)) {
    const owner = signOwner(id) ?? id;
    const tap = tapFor(state, id, TIDY_RULES);
    for (const c of [...candidatesFor(state, id, TIDY_RULES), ...(tap ? [tap] : [])]) {
      if (!touched.has(owner) && !(c.targetId && touched.has(c.targetId))) continue;
      if (!seen.has(stateKey(c.state, "exact"))) return c.state;
    }
  }
  return null;
}
