/**
 * The conditions an equation's letters come with, read off how it's written:
 *
 * - what an even root holds isn't negative (√(x + 7): x ≥ −7);
 * - what an even root is equal to isn't negative either (√(…) = x + 1: x ≥ −1);
 * - a bottom with a letter in it isn't 0 ((…)/(x − 2): x ≠ 2).
 *
 * Each is written the way a teacher writes it, solved for the letter when
 * it's a·x + b (x ≥ −7, not x + 7 ≥ 0), and left out when it can't fail
 * (x² + 5 ≥ 0). Given at the start, they stay true all along: a row that
 * squaring invents and that breaks one is crossed out (expr/conditions.ts).
 */
import type { Condition, Expr, MathState, Rel } from "../../expr/types";
import { frac, neg, num, variable } from "../../expr/build";
import { key, rootOrder } from "../../expr/key";
import { allNodes } from "../../expr/tree";
import { evaluate, variables } from "../../expr/eval";
import { canBeNegative } from "../../rules/signs";
import { rows } from "../../expr/rows";

const hasLetter = (e: Expr) => variables(e).length > 0;

/** An even root (√, ∜, x^(1/2)) and what it holds. */
function evenRootOf(e: Expr): Expr | null {
  if (e.kind !== "pow") return null;
  const n = rootOrder(e.exp);
  return n !== null && n % 2 === 0 ? e.base : null;
}

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

/** e rel 0, written solved for its letter when it's a·x + b. */
function solvedFor(e: Expr, rel: "≥" | "≠"): Condition {
  const l = linear(e);
  if (!l) return { sides: [e, num(0)], rel };
  return { sides: [variable(l.x), value(-l.b, l.a)], rel: l.a < 0 ? turned[rel] : rel };
}

/** The conditions the letters of `s` come with (see above), each once. */
export function domainOf(s: MathState): Condition[] {
  const out: Condition[] = [];
  const add = (e: Expr, rel: "≥" | "≠") => {
    if (!hasLetter(e)) return;
    if (rel === "≥" && !canBeNegative(e, { positiveLetters: s.letters === "positive" })) return;
    const c = solvedFor(e, rel);
    const k = `${key(c.sides[0])} ${c.rel} ${key(c.sides[1])}`;
    if (!out.some((o) => `${key(o.sides[0])} ${o.rel} ${key(o.sides[1])}` === k)) out.push(c);
  };
  for (const side of s.sides) {
    for (const n of allNodes(side)) {
      const inside = evenRootOf(n);
      if (inside) add(inside, "≥");
    }
  }
  // What an even root equals (a whole side under a root): the other side isn't negative.
  for (const [l, r] of rows(s)) {
    if (evenRootOf(l)) add(r, "≥");
    if (evenRootOf(r)) add(l, "≥");
  }
  for (const side of s.sides) for (const n of allNodes(side)) if (n.kind === "frac") add(n.den, "≠");
  return out;
}
