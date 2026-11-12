import { describe, expect, it } from "vitest";
import { DECOYS } from "./decoys";
import { CHAPTERS } from "./puzzles";
import { parseState } from "../expr/parse";
import { evaluate, variables, type Env } from "../expr/eval";
import { printState } from "../expr/key";
import type { Expr, MathState } from "../expr/types";

/** Several random positive environments covering every letter in these expressions. */
function envs(exprs: Expr[]): Env[] {
  const names = [...new Set(exprs.flatMap(variables))];
  return [1, 2, 3, 4, 5, 6].map((seed) =>
    Object.fromEntries(names.map((n, i) => [n, ((seed * 7919 + i * 104729) % 1000) / 97 + 0.31])),
  );
}

/** Differ in value somewhere (relative tolerance). */
function differ(a: Expr, b: Expr): boolean {
  return envs([a, b]).some((env) => {
    const x = evaluate(a, env);
    const y = evaluate(b, env);
    return Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
  });
}

/** Each row of a state as its own state (a single row stays as is). */
const rows = (src: string): MathState[] => src.split(";").map((r) => parseState(r));

/** The letter a row isolates on its left (`x = …`, `x < …`), if any. */
function isolated(s: MathState): string | null {
  if (s.sides.length !== 2) return null;
  const [lhs, rhs] = s.sides;
  return lhs.kind === "var" && !variables(rhs).includes(lhs.name) ? lhs.name : null;
}

const relKind = (s: MathState) => (s.sides.length === 1 ? "none" : (s.rel ?? "=") === "=" ? "=" : "ineq");

/** Is this decoy row a wrong version of the goal row? */
function rowWrong(goal: MathState, decoy: MathState): boolean {
  if (goal.sides.length === 1) return differ(goal.sides[0], decoy.sides[0]);
  if (isolated(goal)) {
    return (goal.rel ?? "=") !== (decoy.rel ?? "=") || differ(goal.sides[1], decoy.sides[1]);
  }
  // Not isolated: compare lhs − rhs.
  const res = (s: MathState, env: Env) => evaluate(s.sides[0], env) - evaluate(s.sides[1], env);
  return (goal.rel ?? "=") !== (decoy.rel ?? "=") || envs([...goal.sides, ...decoy.sides]).some((env) => Math.abs(res(goal, env) - res(decoy, env)) > 1e-9);
}

describe("decoys", () => {
  const all = CHAPTERS.flatMap((c) => c.puzzles.map((p) => p.id));

  it("only puzzles that exist have decoys", () => {
    const stray = Object.keys(DECOYS).filter((id) => !all.includes(id));
    expect(stray).toEqual([]);
  });

  describe.each(CHAPTERS.map((c) => [c.id, c] as const))("%s", (_, chapter) => {
    it("every puzzle has decoys", () => {
      const missing = chapter.puzzles.filter((p) => !(p.id in DECOYS)).map((p) => p.id);
      expect(missing).toEqual([]);
    });

    it.each(chapter.puzzles.map((p) => [p.id, p] as const))("%s", (id, puzzle) => {
      const decoys = DECOYS[id];
      expect(decoys, id).toBeDefined();
      const goal = parseState(puzzle.goal);
      const goalRows = rows(puzzle.goal);
      const goalPrint = printState(goal);
      const printed = decoys.map((src) => {
        const label = `${id}: ${src} vs goal ${puzzle.goal}`;
        const decoy = parseState(src);
        const decoyRows = rows(src);

        // Same shape.
        expect(decoy.sides.length, label).toBe(goal.sides.length);
        expect(decoyRows.length, label).toBe(goalRows.length);
        goalRows.forEach((g, k) => {
          const d = decoyRows[k];
          expect(d.sides.length, label).toBe(g.sides.length);
          expect(relKind(d), label).toBe(relKind(g));
          if (isolated(g)) expect(isolated(d), label).toBe(isolated(g));
        });

        // Wrong.
        expect(goalRows.some((g, k) => rowWrong(g, decoyRows[k])), `${label} is not wrong`).toBe(true);

        const p = printState(decoy);
        expect(p, label).not.toBe(goalPrint);
        return p;
      });
      expect(decoys[0], id).not.toBe(decoys[1]);
      expect(printed[0], id).not.toBe(printed[1]);
    });
  });
});
