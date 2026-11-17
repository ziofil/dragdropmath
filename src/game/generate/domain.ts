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
import type { Condition, Expr, MathState } from "../../expr/types";
import { rootOrder } from "../../expr/key";
import { allNodes } from "../../expr/tree";
import { variables } from "../../expr/eval";
import { adding, conditionOn } from "../../expr/conditions";
import { canBeNegative } from "../../rules/signs";
import { rows } from "../../expr/rows";

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

/** The conditions the letters of `s` come with (see above), as a teacher writes them (each once, the tightest bound only: conditions.ts adding). */
export function domainOf(s: MathState): Condition[] {
  let out: Condition[] = [];
  const add = (e: Expr, rel: "≥" | "≠") => {
    if (!hasLetter(e)) return;
    if (rel === "≥" && !canBeNegative(e, { positiveLetters: s.letters === "positive" })) return;
    out = adding(out, conditionOn(e, rel));
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
  for (const side of s.sides) for (const n of allNodes(side)) if (n.kind === "frac") zeroParts(n.den).forEach((f) => add(f, "≠"));
  return out;
}
