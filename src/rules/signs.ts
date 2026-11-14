/**
 * What can be said about an expression's sign, whatever its letters are.
 *
 * One place for every move whose correctness depends on a sign: undoing a
 * square across = (x² = 9 loses x = −3, but (2√x)² = 12 loses nothing),
 * multiplying or dividing an inequality (by a negative, it turns round; by
 * something of unknown sign, it can't be done). Rules ask here instead of
 * each checking shapes of their own, so a new shape can't slip through one
 * rule's special case.
 *
 * Letters are of unknown sign, unless the exercise says they stand for
 * positive numbers (MathState.letters, as the powers, roots and logs chapters do).
 */
import type { Expr, MathState } from "../expr/types";
import { evaluate, isConstant } from "../expr/eval";

export type Sign = "positive" | "negative" | "zero" | "non-negative" | "non-positive" | "unknown";

/** What's assumed about letters. */
export type Assume = { positiveLetters: boolean };
export const assumeOf = (s: MathState): Assume => ({ positiveLetters: s.letters === "positive" });

const flip = (s: Sign): Sign =>
  (({ positive: "negative", negative: "positive", "non-negative": "non-positive", "non-positive": "non-negative" }) as Record<string, Sign>)[s] ?? s;

const atLeast0 = (s: Sign) => s === "positive" || s === "zero" || s === "non-negative";
const atMost0 = (s: Sign) => s === "negative" || s === "zero" || s === "non-positive";

/** The sign of a product (or quotient) of two things of known sign. */
function times(a: Sign, b: Sign): Sign {
  if (a === "zero" || b === "zero") return "zero";
  if (a === "unknown" || b === "unknown") return "unknown";
  const strict = (s: Sign) => s === "positive" || s === "negative";
  const neg = atMost0(a) !== atMost0(b);
  if (strict(a) && strict(b)) return neg ? "negative" : "positive";
  return neg ? "non-positive" : "non-negative";
}

/** The sign of a sum of two things of known sign. */
function plus(a: Sign, b: Sign): Sign {
  if (a === "zero") return b;
  if (b === "zero") return a;
  if (atLeast0(a) && atLeast0(b)) return a === "positive" || b === "positive" ? "positive" : "non-negative";
  if (atMost0(a) && atMost0(b)) return a === "negative" || b === "negative" ? "negative" : "non-positive";
  return "unknown";
}

export function signOf(e: Expr, a: Assume): Sign {
  if (isConstant(e)) {
    const v = evaluate(e, {});
    return Number.isNaN(v) ? "unknown" : v > 0 ? "positive" : v < 0 ? "negative" : "zero";
  }
  switch (e.kind) {
    case "var":
      return a.positiveLetters ? "positive" : "unknown";
    case "neg":
      return flip(signOf(e.arg, a));
    case "sum":
      return e.terms.map((t) => signOf(t, a)).reduce(plus);
    case "prod":
      return e.factors.map((f) => signOf(f, a)).reduce(times);
    case "frac": {
      const d = signOf(e.den, a);
      // Dividing by something that may be 0: nothing to say.
      return d === "positive" || d === "negative" ? times(signOf(e.num, a), d) : "unknown";
    }
    case "pow": {
      const b = signOf(e.base, a);
      if (b === "positive") return "positive"; // 2ˣ, eˣ, a positive base to any power
      // An even root is never negative (√ means the one that isn't); an odd one keeps the sign (∛−8 = −2).
      if (e.radical) {
        const n = isConstant(e.exp) ? Math.round(1 / evaluate(e.exp, {})) : NaN;
        if (n % 2 === 1) return b;
        return b === "zero" ? "zero" : "non-negative";
      }
      // An even whole power is never negative: x², (x − 1)⁴.
      if (isConstant(e.exp)) {
        const n = evaluate(e.exp, {});
        if (Number.isInteger(n) && n > 0 && n % 2 === 0) return b === "zero" ? "zero" : "non-negative";
        if (Number.isInteger(n) && n > 0) return b; // odd: keeps the sign
      }
      return "unknown";
    }
    case "log":
      return "unknown";
    default:
      return "unknown";
  }
}

export const canBeNegative = (e: Expr, a: Assume) => !atLeast0(signOf(e, a));
export const isPositive = (e: Expr, a: Assume) => signOf(e, a) === "positive";
export const isNegative = (e: Expr, a: Assume) => signOf(e, a) === "negative";
