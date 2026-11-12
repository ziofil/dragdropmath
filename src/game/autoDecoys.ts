/**
 * Wrong answers made automatically, for exercises that don't come with their
 * own (a teacher's set without `wrong:`). Each is a classic slip applied to
 * the right answer: an inequality sign not turned round, a term's sign
 * flipped, a number doubled or halved, a fraction upside down, a term left
 * out, an exponent off by one, the whole answer doubled or squared. Hand-written ones are better (they come from
 * the exercise's own pitfalls); these are a fallback, checked like them.
 */
import type { Expr, MathState } from "../expr/types";
import { flipRel, negate, normalize, num, pow, prod } from "../expr/build";
import { children, withChildren } from "../expr/tree";
import { printState } from "../expr/key";
import { follows, isWrong, rowsOf, shapeMismatch } from "./answers";

/** `e` with the node `id` replaced. */
function replace(e: Expr, id: string, by: Expr): Expr {
  if (e.id === id) return by;
  const cs = children(e);
  if (!cs.length) return e;
  const next = cs.map((c) => replace(c, id, by));
  return next.every((c, i) => c === cs[i]) ? e : withChildren(e, next);
}

const nodes = (e: Expr): Expr[] => [e, ...children(e).flatMap(nodes)];

/** Slips on one expression, by kind. */
function slips(e: Expr): Record<string, Expr[]> {
  const out: Record<string, Expr[]> = { sign: [], number: [], flip: [], drop: [], power: [], whole: [] };
  // The whole answer doubled or squared (x + x read as x², 2x taken as x, …).
  if (e.kind !== "num") out.whole.push(prod([num(2), e]), pow(e, num(2)));
  // A sign slip: one term's sign (or the whole thing's).
  if (e.kind === "sum") e.terms.forEach((t) => out.sign.push(replace(e, t.id, negate(t))));
  else if (!(e.kind === "num" && e.value === 0)) out.sign.push(negate(e));
  for (const n of nodes(e)) {
    // A number doubled (forgot to halve) or halved.
    if (n.kind === "num" && n.value > 1) {
      out.number.push(replace(e, n.id, num(n.value * 2)));
      if (n.value % 2 === 0) out.number.push(replace(e, n.id, num(n.value / 2)));
    }
    // A fraction upside down.
    if (n.kind === "frac") out.flip.push(replace(e, n.id, { ...n, num: n.den, den: n.num }));
    // An exponent off by one (adding where it should multiply, …).
    if (n.kind === "pow" && n.exp.kind === "num" && !n.radical) out.power.push(replace(e, n.id, pow(n.base, num(n.exp.value + 1), n.id)));
  }
  // A term left out.
  if (e.kind === "sum") e.terms.forEach((t) => out.drop.push(replace(e, e.id, { ...e, terms: e.terms.filter((u) => u !== t) })));
  return out;
}

const KINDS = ["relation", "sign", "number", "flip", "drop", "power", "whole"];

/**
 * Two wrong answers for an exercise, from different kinds of slip where it
 * can: printed so they parse back. Fewer than two if no slip gives a
 * convincing one (then the exercise is solved without guessing).
 */
export function autoDecoys(start: MathState, goal: MathState): string[] {
  const rows = rowsOf(goal);
  const byKind = new Map<string, MathState[]>(KINDS.map((k) => [k, []]));
  rows.forEach((row, r) => {
    const withRow = (next: MathState): MathState => {
      if (rows.length === 1) return next;
      const sides = goal.sides.slice();
      sides[2 * r] = next.sides[0];
      sides[2 * r + 1] = next.sides[1];
      return { ...goal, sides };
    };
    // An inequality not turned round.
    if (row.sides.length === 2 && (row.rel ?? "=") !== "=") byKind.get("relation")!.push(withRow({ ...row, rel: flipRel(row.rel!) }));
    // The answer part: what the letter is said to be, or the whole expression.
    const at = row.sides.length === 1 ? 0 : 1;
    for (const [kind, es] of Object.entries(slips(row.sides[at]))) {
      for (const e of es) {
        const sides = row.sides.slice();
        sides[at] = normalize(e);
        byKind.get(kind)!.push(withRow({ ...row, sides }));
      }
    }
  });
  const goalPrint = printState(goal);
  const ok = (c: MathState) => shapeMismatch(goal, c) === null && isWrong(goal, c) && !follows(start, c) && printState(c) !== goalPrint;
  // One from each kind in turn, so the two differ in what went wrong.
  const picked: string[] = [];
  const queues = KINDS.map((k) => byKind.get(k)!.slice());
  while (picked.length < 2 && queues.some((q) => q.length)) {
    for (const q of queues) {
      while (q.length) {
        const c = q.shift()!;
        const p = printState(c);
        if (!picked.includes(p) && ok(c)) {
          picked.push(p);
          break;
        }
      }
      if (picked.length === 2) break;
    }
  }
  return picked;
}

