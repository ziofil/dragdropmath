/**
 * The conditions on an exercise's letters (MathState.conditions): written
 * after "where" (√(x + 7) = x + 1 where x ≥ -7, x ≥ -1), and which answer
 * rows break them.
 */
import type { Condition, Expr, MathState, Rel } from "./types";
import { evaluate, variables } from "./eval";
import { frac, neg, num, variable } from "./build";
import { key } from "./key";
import { rowAt, rowCount, rows, withRows } from "./rows";

/** A condition holds at these values (one it can't decide holds). */
function holds(c: Condition, env: Record<string, number>): boolean {
  let a: number, b: number;
  try {
    a = evaluate(c.sides[0], env);
    b = evaluate(c.sides[1], env);
  } catch {
    return true;
  }
  if (!Number.isFinite(a) || !Number.isFinite(b)) return true;
  const eps = 1e-9;
  switch (c.rel) {
    case "≥":
      return a >= b - eps;
    case ">":
      return a > b + eps;
    case "≤":
      return a <= b + eps;
    case "<":
      return a < b - eps;
    case "≠":
      return Math.abs(a - b) > eps;
    case "=":
      return Math.abs(a - b) <= eps;
  }
}

/** The value a row gives its letter (x = 3, x = √5), if it's a letter alone equal to a number. */
function answerOf(row: Expr[]): { letter: string; value: number } | null {
  const [l, r] = row;
  const [x, v] = l?.kind === "var" ? [l, r] : r?.kind === "var" ? [r, l] : [null, null];
  if (!x || x.kind !== "var" || !v) return null;
  try {
    const value = evaluate(v, {});
    return Number.isFinite(value) ? { letter: x.name, value } : null;
  } catch {
    return null;
  }
}

/** Row `k` of the board is an answer that breaks a condition (x = −3 where x ≥ −1): not an answer at all. */
export function breaks(s: MathState, k: number): boolean {
  if (!s.conditions?.length || s.sides.length < 2) return false;
  const a = answerOf(rowAt(s, k));
  if (!a) return false;
  return s.conditions.some((c) => !holds(c, { [a.letter]: a.value }));
}

/** The board without the rows that break a condition (all of them, if every one does). */
export function standing(s: MathState): MathState {
  if (!s.conditions?.length || s.sides.length < 4) return s;
  const kept = rows(s).filter((_, k) => !breaks(s, k));
  if (!kept.length || kept.length === rowCount(s)) return s;
  return withRows(s, kept);
}

/** Do these values break a condition? */
export const breaksAt = (s: MathState, env: Record<string, number>) => !!s.conditions?.some((c) => !holds(c, env));

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** e as a·x + b in its one letter x (whole a ≠ 0 and b), else null. */
function linear(e: Expr): { x: string; a: number; b: number } | null {
  const vs = variables(e);
  if (vs.length !== 1) return null;
  const x = vs[0];
  const at = (v: number) => evaluate(e, { [x]: v });
  try {
    const [f0, f1, f2] = [at(0), at(1), at(2)];
    const a = f1 - f0;
    if (!Number.isFinite(f0) || Math.abs(f2 - f1 - a) > 1e-9 || Math.abs(at(-3) - (f0 - 3 * a)) > 1e-9) return null;
    if (!Number.isInteger(a) || !Number.isInteger(f0) || a === 0) return null;
    return { x, a, b: f0 };
  } catch {
    return null;
  }
}

/** −b/a written as a number or a fraction (whole top and bottom). */
function value(p: number, q: number): Expr {
  const g = gcd(p, q) * Math.sign(q);
  const [n, d] = [p / g, q / g];
  const top = num(Math.abs(n));
  const v = d === 1 ? top : frac(top, num(d));
  return n < 0 ? neg(v) : v;
}

const turned: Record<Rel | "≠", Rel | "≠"> = { "=": "=", "≠": "≠", "<": ">", ">": "<", "≤": "≥", "≥": "≤" };

/** e rel 0 (x + 7 ≥ 0), written as a teacher writes it: solved for its letter when it's a·x + b (x ≥ −7). */
export function conditionOn(e: Expr, rel: "≥" | "≠"): Condition {
  const l = linear(e);
  if (!l) return { sides: [e, num(0)], rel };
  return { sides: [variable(l.x), value(-l.b, l.a)], rel: l.a < 0 ? turned[rel] : rel };
}

const conditionKey = (c: Condition) => `${key(c.sides[0])} ${c.rel} ${key(c.sides[1])}`;

/** A condition on a lone letter against a number (x ≥ 1/2, x < 3): the letter, which way it bounds it, the number. */
function boundOf(c: Condition): { x: string; upper: boolean; strict: boolean; v: number } | null {
  const [l, r] = c.sides;
  if (l.kind !== "var" || c.rel === "≠" || c.rel === "=" || variables(r).length) return null;
  try {
    const v = evaluate(r, {});
    return Number.isFinite(v) ? { x: l.name, upper: c.rel === "≤" || c.rel === "<", strict: c.rel === "<" || c.rel === ">", v } : null;
  } catch {
    return null;
  }
}

/** `d` says what `c` says, and maybe more: the same condition, or a tighter bound on its letter (x ≥ 2 says x ≥ 1). */
export function says(d: Condition, c: Condition): boolean {
  if (conditionKey(d) === conditionKey(c)) return true;
  const [a, b] = [boundOf(d), boundOf(c)];
  if (!a || !b || a.x !== b.x || a.upper !== b.upper) return false;
  if (a.v === b.v) return a.strict || !b.strict;
  return a.upper ? a.v < b.v : a.v > b.v;
}

/**
 * The conditions with `c` too, as a teacher writes them: not if one of them
 * says it already (x ≥ −1 beside x ≥ 1/2), and in place of those it says
 * more than (x ≥ 1/2, not x ≥ −11/14 and x ≥ 1/2).
 */
export function adding(cs: readonly Condition[], c: Condition): Condition[] {
  if (cs.some((o) => says(o, c))) return [...cs];
  const i = cs.findIndex((o) => says(c, o));
  if (i < 0) return [...cs, c];
  return [...cs.slice(0, i), c, ...cs.slice(i + 1).filter((o) => !says(c, o))];
}

/** The board with one more condition (see adding: it says more than those it replaces, or nothing new and isn't written). */
export function withCondition(s: MathState, c: Condition): MathState {
  const cs = adding(s.conditions ?? [], c);
  const same = cs.length === (s.conditions?.length ?? 0) && cs.every((x, i) => x === s.conditions![i]);
  return same ? s : { ...s, conditions: cs };
}
