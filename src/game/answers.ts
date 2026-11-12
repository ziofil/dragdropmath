/**
 * Telling answers apart, numerically: is a goal a right answer to its start,
 * is a wrong answer (for guessing first) really wrong, and does it look like
 * an answer of the same kind? Used for the built-in exercises' wrong answers
 * (decoys.test.ts), for teachers' exercise sets, and to make wrong answers
 * when a set gives none (autoDecoys).
 */
import type { Expr, MathState } from "../expr/types";
import { evaluate, variables, type Env } from "../expr/eval";
import { printState } from "../expr/key";

/** Several random positive values for every letter in these expressions. */
export function envs(exprs: Expr[], n = 6): Env[] {
  const names = [...new Set(exprs.flatMap(variables))];
  return Array.from({ length: n }, (_, k) => k + 1).map((seed) =>
    Object.fromEntries(names.map((name, i) => [name, ((seed * 7919 + i * 104729) % 1000) / 97 + 0.31])),
  );
}

const close = (x: number, y: number) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));

/** Differ in value somewhere. */
export function differ(a: Expr, b: Expr): boolean {
  return envs([a, b]).some((env) => !close(evaluate(a, env), evaluate(b, env)));
}

/** Each row of a state (sides 2k and 2k + 1) as a state of its own; an expression is one row. */
export function rowsOf(s: MathState): MathState[] {
  if (s.sides.length <= 2) return [s];
  const out: MathState[] = [];
  for (let k = 0; k < s.sides.length; k += 2) out.push({ sides: s.sides.slice(k, k + 2), rel: s.rel });
  return out;
}

/** The letter a row isolates on its left (`x = …`, `x < …`), if any. */
export function isolated(s: MathState): string | null {
  if (s.sides.length !== 2) return null;
  const [lhs, rhs] = s.sides;
  return lhs.kind === "var" && !variables(rhs).includes(lhs.name) ? lhs.name : null;
}

const relKind = (s: MathState) => (s.sides.length === 1 ? "none" : (s.rel ?? "=") === "=" ? "=" : "ineq");

/** Why `other` doesn't look like an answer of the same kind as `goal` (null: it does). */
export function shapeMismatch(goal: MathState, other: MathState): string | null {
  const g = rowsOf(goal);
  const o = rowsOf(other);
  if (g.length !== o.length || goal.sides.length !== other.sides.length) return "a different number of equations";
  for (let k = 0; k < g.length; k++) {
    if (relKind(g[k]) !== relKind(o[k])) return "an expression where an equation is expected, or the other way round";
    if (isolated(g[k]) && isolated(o[k]) !== isolated(g[k])) return `it doesn't say what ${isolated(g[k])} is`;
  }
  return null;
}

/** Is this row a wrong version of the goal row? */
function rowWrong(goal: MathState, other: MathState): boolean {
  if (goal.sides.length === 1) return differ(goal.sides[0], other.sides[0]);
  if ((goal.rel ?? "=") !== (other.rel ?? "=")) return true;
  if (isolated(goal)) return differ(goal.sides[1], other.sides[1]);
  const res = (s: MathState, env: Env) => evaluate(s.sides[0], env) - evaluate(s.sides[1], env);
  return envs([...goal.sides, ...other.sides]).some((env) => !close(res(goal, env), res(other, env)));
}

/** Is `other` a wrong answer, where `goal` is the right one? */
export function isWrong(goal: MathState, other: MathState): boolean {
  if (printState(goal) === printState(other)) return false;
  const g = rowsOf(goal);
  const o = rowsOf(other);
  return g.length !== o.length || g.some((row, k) => rowWrong(row, o[k]));
}

/** Truth of a row (an equation or inequality) at these values. */
function holds(row: MathState, env: Env): boolean {
  const a = evaluate(row.sides[0], env);
  const b = evaluate(row.sides[1], env);
  switch (row.rel ?? "=") {
    case "=":
      return close(a, b);
    case "<":
      return a < b;
    case ">":
      return a > b;
    case "≤":
      return a < b || close(a, b);
    case "≥":
      return a > b || close(a, b);
  }
}

/**
 * Does `goal` follow from `start` — is it a right answer? An expression must
 * keep its value. Equations: if the goal says what letters are (x = 4,
 * t = (v − u)/a), putting that into the start must make it true; otherwise
 * both must be the same equation up to a factor. Inequalities: both must hold
 * for the same values.
 */
export function follows(start: MathState, goal: MathState): boolean {
  if (start.sides.length === 1 || goal.sides.length === 1) {
    return start.sides.length === 1 && goal.sides.length === 1 && !differ(start.sides[0], goal.sides[0]);
  }
  const startRows = rowsOf(start);
  const goalRows = rowsOf(goal);
  const all = [...start.sides, ...goal.sides];
  const inequality = [start, goal].some((s) => (s.rel ?? "=") !== "=");
  if (inequality) {
    const names = [...new Set(all.flatMap(variables))];
    if (names.length === 1) {
      // One letter: scan it finely (−50 to 50), so a narrow stretch where they disagree isn't missed.
      return Array.from({ length: 4001 }, (_, i) => -50 + i * 0.025 + 0.00731).every((v) => {
        const e = { [names[0]]: v };
        return startRows.every((r) => holds(r, e)) === goalRows.every((r) => holds(r, e));
      });
    }
    // The same values make both true: try a spread of values, negative ones too.
    return envs(all, 40).every((env, k) => {
      const e = Object.fromEntries(Object.entries(env).map(([n, v]) => [n, (k % 2 ? -1 : 1) * (v * 1.7 - 3)]));
      return startRows.every((r) => holds(r, e)) === goalRows.every((r) => holds(r, e));
    });
  }
  const said = goalRows.map(isolated);
  if (said.every((x) => x !== null) && new Set(said).size === said.length) {
    // Put what the goal says each letter is into the start.
    return envs(all).every((env) => {
      const e = { ...env };
      for (let pass = 0; pass < said.length; pass++) goalRows.forEach((r, k) => (e[said[k]!] = evaluate(r.sides[1], e)));
      return Number.isFinite(Object.values(e).reduce((a, b) => a + b, 0)) && startRows.every((r) => holds(r, e));
    });
  }
  // The same equation up to a factor: lhs − rhs keeps its sign, everywhere, row by row.
  if (startRows.length !== goalRows.length) return false;
  return startRows.every((sr, k) => {
    const res = (s: MathState, env: Env) => evaluate(s.sides[0], env) - evaluate(s.sides[1], env);
    const ratios = envs([...sr.sides, ...goalRows[k].sides]).map((env) => res(sr, env) / res(goalRows[k], env));
    return ratios.every((r) => Number.isFinite(r) && r !== 0 && Math.sign(r) === Math.sign(ratios[0]));
  });
}
