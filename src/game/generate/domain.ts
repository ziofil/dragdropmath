/**
 * The conditions an equation's letters come with, read off how it's written:
 *
 * - what an even root holds isn't negative (√(x + 7): x ≥ −7);
 * - what an even root is equal to isn't negative either (√(…) = x + 1: x ≥ −1;
 *   √(…) − x = 4: x ≥ −4);
 * - a bottom with a letter in it isn't 0 ((…)/(x − 2): x ≠ 2; (…)/(x² − 4):
 *   x ≠ 2, x ≠ −2, the values that make it 0 when they're whole numbers).
 *
 * Each is written the way a teacher writes it, solved for the letter when
 * it's a·x + b (x ≥ −7, not x + 7 ≥ 0), and left out when it can't fail
 * (x² + 5 ≥ 0). Given at the start, they stay true all along: a row that
 * squaring invents and that breaks one is crossed out (expr/conditions.ts).
 */
import type { Condition, Expr, MathState } from "../../expr/types";
import { rootOrder } from "../../expr/key";
import { allNodes } from "../../expr/tree";
import { variables } from "../../expr/eval";
import { adding, conditionOn, linear, value } from "../../expr/conditions";
import { canBeNegative } from "../../rules/signs";
import { rows } from "../../expr/rows";
import { negate, sum, variable } from "../../expr/build";
import { polyOf } from "./poly";

const hasLetter = (e: Expr) => variables(e).length > 0;

/** An even root (√, ∜, x^(1/2)) and what it holds. */
function evenRootOf(e: Expr): Expr | null {
  if (e.kind !== "pow") return null;
  const n = rootOrder(e.exp);
  return n !== null && n % 2 === 0 ? e.base : null;
}

/**
 * What a bottom is 0 only if one of them is: its factors, and what a power
 * of it raises ((x − 2)³(x + 1) is 0 when x − 2 or x + 1 is).
 */
function zeroParts(e: Expr): Expr[] {
  if (e.kind === "prod") return e.factors.flatMap(zeroParts);
  if (e.kind === "neg") return zeroParts(e.arg);
  if (e.kind === "pow" && e.exp.kind === "num" && Number.isInteger(e.exp.value) && e.exp.value > 0) return zeroParts(e.base);
  return [e];
}

/**
 * The whole numbers that make a polynomial in one letter 0, each once, when
 * they're all there are (x² − 4: 2 and −2; x² + 1 or x² − 2: null).
 */
function wholeZeros(e: Expr): { x: string; values: number[] } | null {
  const p = polyOf(e);
  const xs = variables(e);
  if (!p || xs.length !== 1) return null;
  const x = xs[0];
  // Coefficients by power, lowest first.
  let cs: number[] = [];
  for (const t of p.values()) {
    const k = t.m[x] ?? 0;
    if (!Number.isInteger(k) || k < 0 || !Number.isInteger(t.c)) return null;
    cs[k] = (cs[k] ?? 0) + t.c;
  }
  cs = Array.from(cs, (c) => c ?? 0);
  while (cs.length && cs[cs.length - 1] === 0) cs.pop();
  if (cs.length < 3) return null;
  const values: number[] = [];
  // Each whole zero divided out in turn (0 first, then the divisors of the lowest coefficient).
  while (cs.length > 1) {
    const c0 = Math.abs(cs[0]);
    const tries = c0 === 0 ? [0] : [...Array(c0).keys()].map((i) => i + 1).filter((d) => c0 % d === 0).flatMap((d) => [d, -d]);
    const v = tries.find((t) => cs.reduceRight((acc, c) => acc * t + c, 0) === 0);
    if (v === undefined) return null;
    // Synthetic division by (x − v).
    const q: number[] = [];
    let carry = 0;
    for (let i = cs.length - 1; i > 0; i--) {
      carry = carry * v + cs[i];
      q.unshift(carry);
    }
    cs = q;
    if (!values.includes(v)) values.push(v);
  }
  return { x, values };
}

/**
 * A side that's an even root, or an even root and other terms (√P − x): the
 * root, and what it equals once those terms are carried across (x + 4, for
 * √P − x = 4). Null for a side with no root or several.
 */
function rootAlone(side: Expr, other: Expr): { root: Expr; equals: Expr } | null {
  if (evenRootOf(side)) return { root: side, equals: other };
  if (side.kind !== "sum") return null;
  const roots = side.terms.filter((t) => allNodes(t).some((n) => evenRootOf(n)));
  if (roots.length !== 1 || !evenRootOf(roots[0])) return null;
  const rest = side.terms.filter((t) => t !== roots[0]);
  return { root: roots[0], equals: sum([other, ...rest.map(negate)]) };
}

/** The conditions the letters of `s` come with (see above), as a teacher writes them (each once, the tightest bound only: conditions.ts adding). */
export function domainOf(s: MathState): Condition[] {
  let out: Condition[] = [];
  const add = (e: Expr, rel: "≥" | "≠") => {
    if (!hasLetter(e)) return;
    if (rel === "≥" && !canBeNegative(e, { positiveLetters: s.letters === "positive" })) return;
    out = adding(out, conditionOn(e, rel));
  };
  // What an even root equals (the root alone on its side, once what's beside it is carried across) isn't negative.
  const valued = rows(s).flatMap(([l, r]) => [rootAlone(l, r), rootAlone(r, l)]).filter((v) => v !== null);
  // Then what's under it is a square, not negative either: said anyway when it's a bound on the letter (x ≥ −7), as a
  // teacher writes it, not when it's longer (x² + 2x + 4 ≥ 0), which the root's value says for it. (Not when that
  // value is a root itself: √(x + 2) = √(5 − x) needs both.)
  const implied = new Set(valued.filter((v) => !allNodes(v.equals).some((n) => evenRootOf(n))).map((v) => v.root.id));
  for (const side of s.sides) {
    for (const n of allNodes(side)) {
      const inside = evenRootOf(n);
      if (inside && !(implied.has(n.id) && !linear(inside))) add(inside, "≥");
    }
  }
  for (const v of valued) add(v.equals, "≥");
  const notZero = (e: Expr) => {
    const z = wholeZeros(e);
    if (!z) return add(e, "≠");
    for (const v of z.values) out = adding(out, { sides: [variable(z.x), value(v, 1)], rel: "≠" });
  };
  for (const side of s.sides) for (const n of allNodes(side)) if (n.kind === "frac") zeroParts(n.den).forEach(notZero);
  return out;
}
