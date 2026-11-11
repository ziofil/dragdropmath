/**
 * Steps a learner has mastered, done for them.
 *
 * Once every exercise of a chapter is solved, the routine steps it taught
 * (adding numbers, collecting like terms, adding fractions...) happen by
 * themselves in later chapters, right after the learner's own move, so they
 * can attend to what's new. Each automatic step is an ordinary move, shown
 * as one.
 *
 * Automation only ever finishes off what the learner's move just made: it
 * acts on pieces that move created or changed, never on the rest (so the
 * 2x + 3x a factoring exercise starts with stays split), and never undoes a
 * move by returning to an earlier state (splitting 6 into 2·3 isn't
 * multiplied straight back).
 */
import type { Expr, MathState } from "../expr/types";
import { key, stateKey } from "../expr/key";
import { allNodes, children } from "../expr/tree";
import { candidatesFor, handles, signOwner, tapFor, type Candidate, type RuleId } from "../rules";

/** A routine kind of step, and which of a rule's moves count as it. */
export type Routine = {
  id: string;
  /** What gets done automatically, for the learner ("adding plain numbers"). */
  label: string;
  rules: RuleId[];
  /** Which of these rules' moves count (default: all). */
  accepts?: (state: MathState, draggedId: string, c: Candidate) => boolean;
};

const nodeById = (state: MathState, id: string | undefined) =>
  id === undefined ? undefined : state.sides.flatMap(allNodes).find((n) => n.id === id);

/** A plain number, possibly negative: 3, −3. */
const isPlainNumber = (e: Expr | undefined): boolean => !!e && (e.kind === "num" || (e.kind === "neg" && e.arg.kind === "num"));

export const ROUTINES = {
  /** Always on, from the start: x·2 → 2x, 1x → x, x¹ → x. Only tidies what a move made. */
  tidy: {
    id: "tidy",
    label: "writing things the usual way (2x, not x·2; x, not x¹)",
    rules: ["numbers-first", "power-one"],
  },
  arithmetic: {
    id: "arithmetic",
    label: "adding and multiplying plain numbers",
    rules: ["combine", "multiply-numbers"],
    accepts: (s, id, c) => isPlainNumber(nodeById(s, id)) && isPlainNumber(nodeById(s, c.targetId)),
  },
  likeTerms: {
    id: "like-terms",
    label: "collecting like terms",
    rules: ["combine"],
  },
  squares: {
    id: "squares",
    label: "x·x = x²",
    rules: ["merge-powers"],
    // Only a letter meeting itself; adding exponents belongs to the powers chapter.
    accepts: (s, id, c) => {
      const a = nodeById(s, id), b = nodeById(s, c.targetId);
      return a?.kind === "var" && b?.kind === "var" && a.name === b.name;
    },
  },
  timesOne: {
    id: "times-one",
    label: "dropping a ·1",
    rules: ["times-one"],
  },
  wholeDivision: {
    id: "whole-division",
    label: "divisions that come out whole (8/2 = 4)",
    rules: ["divide-numbers"],
    // The bottom number disappears: it went in exactly.
    accepts: (_s, id, c) => !nodeById(c.state, id),
  },
  fractions: {
    id: "fractions",
    label: "adding and multiplying fractions",
    rules: ["add-fractions", "multiply-fractions"],
  },
  powers: {
    id: "powers",
    label: "x¹ = x, x⁰ = 1, and powers of numbers (2³ = 8)",
    rules: ["power-one", "zero-power", "evaluate-power"],
  },
} satisfies Record<string, Routine>;

/**
 * Ids of the nodes in `after` that a move from `before` made: new or changed
 * nodes, and everything inside a new one (the 2 and 3 of the 2·3 that
 * distributing just wrote, though each was there before).
 */
export function changedIds(before: MathState, after: MathState): Set<string> {
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

/** One step done automatically. */
export type AutoStep = { state: MathState; routine: Routine };

/** At most this many automatic steps after one move. */
const MAX_STEPS = 12;

/**
 * The automatic steps after a move from `before` to `after`: the states that
 * follow, in order, each with the routine that made it (empty when there's
 * nothing routine to finish).
 * `earlier`: states the learner has already been through (never returned to).
 */
export function autoSteps(
  before: MathState,
  after: MathState,
  routines: readonly Routine[],
  earlier: readonly MathState[] = [before],
): AutoStep[] {
  if (routines.length === 0) return [];
  const rules = [...new Set(routines.flatMap((r) => r.rules))];
  const seen = new Set([...earlier, before, after].map((s) => stateKey(s, "exact")));
  let touched = changedIds(before, after);
  let cur = after;
  const out: AutoStep[] = [];
  for (let step = 0; step < MAX_STEPS; step++) {
    const next = nextStep(cur, routines, rules, touched, seen);
    if (!next) break;
    touched = new Set([...touched, ...changedIds(cur, next.state)]);
    seen.add(stateKey(next.state, "exact"));
    out.push(next);
    cur = next.state;
  }
  return out;
}

function nextStep(
  state: MathState,
  routines: readonly Routine[],
  rules: RuleId[],
  touched: ReadonlySet<string>,
  seen: ReadonlySet<string>,
): AutoStep | null {
  for (const id of handles(state)) {
    const owner = signOwner(id) ?? id;
    const tap = tapFor(state, id, rules);
    for (const c of [...candidatesFor(state, id, rules), ...(tap ? [tap] : [])]) {
      // Only finishing off what the last move made.
      if (!touched.has(owner) && !(c.targetId && touched.has(c.targetId))) continue;
      if (seen.has(stateKey(c.state, "exact"))) continue;
      const routine = routines.find((r) => r.rules.includes(c.rule) && (r.accepts?.(state, id, c) ?? true));
      if (routine) return { state: c.state, routine };
    }
  }
  return null;
}
