/**
 * Moves between equations shown as rows: splitting one equation into its
 * possible answers (x(x − 3) = 0 → x = 0 or x − 3 = 0; x² = 9 → x = √9 or
 * x = −√9), and working with two equations at once (substituting one into
 * the other; adding them).
 */
import type { Expr, MathState } from "../expr/types";
import { cloneFresh, neg, num, prod, root, sum } from "../expr/build";
import { isConstant, evaluate } from "../expr/eval";
import { allNodes, children, withChildren } from "../expr/tree";
import { dragCtx, isEquation, partner, setSides, without, type Candidate, type Rule } from "./types";
import { buildTerm, restKey, splitCoef, type Monomial } from "./monomial";

const isZero = (e: Expr) => e.kind === "num" && e.value === 0;

/** `state` with row `r` replaced by `rows` (each a pair of sides), joined as `join`. */
function replaceRow(state: MathState, r: number, rows: Expr[][], join: "and" | "or"): MathState {
  const sides = [...state.sides.slice(0, 2 * r), ...rows.flat(), ...state.sides.slice(2 * r + 2)];
  return { ...setSides(sides), rel: state.rel, join };
}

/**
 * x(x − 3) = 0 → x = 0 or x − 3 = 0: when a product is 0, one of its factors
 * is. Drag a factor away (down onto a row of its own).
 */
export const splitZero: Rule = {
  id: "split-zero",
  name: "One factor is zero",
  // Pulled down, onto a row of its own.
  feel: { carry: "below" },
  gesture: "When a product is 0, drag one of its factors away: one of them must be 0.",
  apply(state, id) {
    if (!isEquation(state) || state.join === "and" || (state.rel ?? "=") !== "=") return [];
    const c = dragCtx(state, id);
    if (!c || c.loc.path.length !== 1 || c.parent?.kind !== "prod" || isConstant(c.node)) return [];
    const side = c.loc.side;
    if (!isZero(state.sides[partner(side)])) return [];
    const rest = prod(without(c.parent.factors, c.index), c.parent.id);
    if (isConstant(rest)) return [];
    const row = side >> 1;
    // Keep each side where it was (0 on the right stays on the right).
    const pair = (e: Expr, zero: Expr) => (side % 2 === 0 ? [e, zero] : [zero, e]);
    const rows = [pair(rest, state.sides[partner(side)]), pair(c.node, num(0))];
    return [{ rule: "split-zero", state: replaceRow(state, row, rows, "or") }];
  },
};

/**
 * x² = 9 → x = √9 or x = −√9: carry the ² across, and the other side's root
 * comes in two signs (3² and (−3)² are both 9).
 */
export const rootBothSides: Rule = {
  id: "root-both-sides",
  name: "Square root of both sides",
  gesture: "Carry a ² across = — the other side becomes its square root, + or −.",
  apply(state, id) {
    if (!isEquation(state) || state.join === "and" || (state.rel ?? "=") !== "=") return [];
    const c = dragCtx(state, id);
    if (!c || c.parent?.kind !== "pow" || c.index !== 1 || c.loc.path.length !== 1) return [];
    if (c.node.kind !== "num" || c.node.value !== 2 || isConstant(c.parent.base)) return [];
    const side = c.loc.side;
    const other = state.sides[partner(side)];
    if (!isConstant(other) || evaluate(other, {}) < 0) return [];

    const base = c.parent.base;
    // A perfect square comes out as a number (√9 = 3 was the Roots chapter's
    // job; doing it twice over for + and − would just be busywork).
    const value = evaluate(other, {});
    const whole = Math.sqrt(value);
    const exact = Number.isInteger(whole);
    const plus = exact ? num(whole, c.node.id) : root(other, 2, c.node.id);
    const minus = neg(exact ? num(whole) : root(cloneFresh(other), 2));
    const pair = (a: Expr, b: Expr) => (side % 2 === 0 ? [a, b] : [b, a]);
    return [{ rule: "root-both-sides", state: replaceRow(state, side >> 1, [pair(base, plus), pair(cloneFresh(base), minus)], "or") }];
  },
};

/**
 * x² = 5x → x² − 5x = 0: drop a whole side onto the other side — it's taken
 * away from both, leaving 0 behind (to get a product equal to 0). (Carrying
 * a side across instead swaps the sides.)
 */
export const moveSide: Rule = {
  id: "move-side",
  name: "Everything to one side",
  gesture: "Drop a whole side onto the other side: it's taken away from both, and 0 is left behind.",
  apply(state, id) {
    if (!isEquation(state) || (state.rel ?? "=") !== "=") return [];
    const c = dragCtx(state, id);
    if (!c || c.loc.path.length !== 0 || c.node.kind === "sum" || isZero(c.node)) return [];
    const other = state.sides[partner(c.loc.side)];
    if (isZero(other)) return [];
    const sides = state.sides.slice();
    sides[c.loc.side] = num(0);
    sides[partner(c.loc.side)] = sum([...(other.kind === "sum" ? other.terms : [other]), neg(c.node)], other.kind === "sum" ? other.id : undefined);
    return [{ rule: "move-side", state: { ...setSides(sides), rel: state.rel, join: state.join }, targetId: other.id }];
  },
};

/**
 * y = 2x and x + y = 9 → x + 2x = 9: a letter that one equation gives alone
 * can be swapped, everywhere else, for what it equals. Drag the letter onto
 * one of its uses in another equation.
 */
export const substitute: Rule = {
  id: "substitute",
  name: "Substitute",
  gesture: "In y = 2x, drag the y onto a y in the other equation: it becomes 2x there.",
  apply(state, id) {
    if (state.join !== "and" || state.sides.length < 4) return [];
    const c = dragCtx(state, id);
    if (!c || c.loc.path.length !== 0 || c.node.kind !== "var") return [];
    const name = c.node.name;
    const value = state.sides[partner(c.loc.side)];
    if (allNodes(value).some((n) => n.kind === "var" && n.name === name)) return [];
    const row = c.loc.side >> 1;
    return state.sides.flatMap((s, i): Candidate[] => {
      if (i >> 1 === row) return [];
      return allNodes(s)
        .filter((n) => n.kind === "var" && n.name === name)
        .map((target) => {
          const sides = state.sides.slice();
          sides[i] = replaceNode(s, target.id, cloneFresh(value));
          return { rule: "substitute", state: { ...setSides(sides), rel: state.rel, join: state.join }, targetId: target.id };
        });
    });
  },
};

/**
 * x + y = 7 and x − y = 1 → 2x = 8 (after collecting): equal things added to
 * equal things are equal. Drop one equation's side onto the other's same side
 * (left onto left): both sides add up.
 */
export const addRows: Rule = {
  id: "add-rows",
  name: "Add the equations",
  gesture: "Drop one equation's side onto the other equation's same side: both sides add up.",
  apply(state, id) {
    if (state.join !== "and" || state.sides.length < 4) return [];
    const c = dragCtx(state, id);
    if (!c || c.loc.path.length !== 0) return [];
    const from = c.loc.side;
    return state.sides.flatMap((target, i): Candidate[] => {
      if (i >> 1 === from >> 1 || i % 2 !== from % 2) return [];
      // Added and collected at once (x + y plus x − y is 2x): the point of
      // adding is the letter that drops out, not the tidying after.
      const sides = state.sides.slice();
      // (Copies of the other equation: it stays as it is.)
      const keepId = (e: Expr) => (e.kind === "sum" ? e.id : undefined);
      sides[i] = collected([target, cloneFresh(state.sides[from])], keepId(target));
      sides[partner(i)] = collected([state.sides[partner(i)], cloneFresh(state.sides[partner(from)])], keepId(state.sides[partner(i)]));
      // Only worth it when a letter drops out (the y's of x + y and x − y).
      if (!eliminates([state.sides[i], state.sides[partner(i)]], [sides[i], sides[partner(i)]])) return [];
      return [{ rule: "add-rows", state: { ...setSides(sides), rel: state.rel, join: state.join }, targetId: target.id }];
    });
  },
};

/** The sum of `sides`, like terms collected (numbers too): 7 + 1 → 8, x + y + x − y → 2x. */
function collected(sides: Expr[], id?: string): Expr {
  const terms = sides.flatMap((e) => (e.kind === "sum" ? e.terms : [e]));
  const groups = new Map<string, Monomial>();
  for (const t of terms) {
    const m = splitCoef(t);
    const k = restKey(m);
    const g = groups.get(k);
    groups.set(k, g ? { ...g, coef: g.coef + m.coef } : m);
  }
  const kept = [...groups.values()].filter((m) => m.coef !== 0).map(buildTerm);
  // Letters first, then the number.
  kept.sort((a, b) => Number(isConstant(a)) - Number(isConstant(b)));
  return kept.length === 0 ? num(0) : kept.length === 1 ? kept[0] : sum(kept, id);
}

/** Whether a letter of the row before is gone from the row after (the y's of x + y and x − y). */
function eliminates(before: Expr[], after: Expr[]): boolean {
  const letters = (es: Expr[]) => new Set(es.flatMap((e) => allNodes(e).flatMap((n) => (n.kind === "var" ? [n.name] : []))));
  const left = letters(after);
  return [...letters(before)].some((v) => !left.has(v));
}

/** `e` with node `id` replaced by `by`. */
function replaceNode(e: Expr, id: string, by: Expr): Expr {
  if (e.id === id) return by;
  const kids = children(e);
  return kids.length ? withChildren(e, kids.map((k) => replaceNode(k, id, by))) : e;
}

