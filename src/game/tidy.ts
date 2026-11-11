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
import { allNodes, children } from "../expr/tree";
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

function nextStep(state: MathState, touched: ReadonlySet<string>, seen: ReadonlySet<string>): MathState | null {
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
