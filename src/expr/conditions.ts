/**
 * The conditions on an exercise's letters (MathState.conditions): written
 * after "where" (√(x + 7) = x + 1 where x ≥ -7, x ≥ -1), and which answer
 * rows break them.
 */
import type { Condition, Expr, MathState } from "./types";
import { evaluate } from "./eval";
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
