/**
 * Linear equations and inequalities in one letter, as recipes: how a teacher
 * writes one, backwards from its answer (see unmove.ts). The same recipe
 * makes an equation (balance), an inequality (the relation picked at random,
 * turned round where a minus or the sides' order turns it), or a formula's
 * x in terms of another letter (formulas: every number a multiple of a, the
 * answer x = 3a).
 *
 * A recipe picks its numbers (the answer first) and says which un-moves
 * make the start; the milestones, the goal and every number on the way
 * follow from them. Null: these numbers don't make a nice one, try again.
 */
import type { Expr, Rel } from "../../expr/types";
import { frac, neg, num, variable } from "../../expr/build";
import { both, bracket, build, draftOf, ex, from, over, plus, restate, solved, spread, sumOf, swap, termExpr, times, writeAs, type UnMove } from "./unmove";
import type { RuleId } from "../../rules";
import { gcd, letter as someLetter, one, type Rng, type Shape } from "./write";

/** What a recipe works with. */
export type Ctx = {
  r: Rng;
  /** The letter. */
  x: string;
  /** The answer (x = x0; x = x0·a in a formula). */
  x0: number;
  /** An inequality: some recipes write one their own way. */
  ineq: boolean;
  /** k times the letter (null for 0). */
  X: (k: number) => Expr | null;
  /** k as a value: the number k, or k times the formula's other letter (null for 0). */
  u: (k: number) => Expr | null;
};

export type Steps = (UnMove | null | false | undefined)[];

export type Recipe = {
  id: string;
  name: string;
  /** The answer, when not the usual (mostly small and positive, now and then negative). */
  answer?: (r: Rng) => number;
  /** The steps; or the steps and the letter's value, when that's no number (x = ln(5)/2). */
  steps: (c: Ctx) => Steps | { value: Expr; steps: Steps } | null;
  /** Its letters stand for positive numbers (its moves need them to: √(x²) = x). */
  positive?: boolean;
};

/** A side written from its terms, those that are 0 left out. */
const side = (...ts: (Expr | null)[]): Expr => sumOf(ts.filter((t): t is Expr => t !== null));
/** A step that is no milestone of its own (its stretch and the next are one). */
const quiet = (u: UnMove): UnMove => ({ ...u, quiet: true });
const divides = (a: number, b: number) => b % a === 0;

/** Mostly small positive answers, now and then a negative one. */
export const pickAnswer = (r: Rng): number => (r.next() < 0.15 ? -r.int(1, 5) : r.int(1, 9));

const RELS: Rel[] = ["<", ">", "≤", "≥"];

export type Use = {
  /** Its id in the chapter, when not the recipe's. */
  id?: string;
  /** The answer, when not the recipe's own. */
  answer?: (r: Rng) => number;
  /** Inequalities: the relation at random. */
  ineq?: boolean;
  /** The letter (x when left out). */
  letter?: (r: Rng) => string;
  /** A formula: values are multiples of this letter's (picked at random, never the unknown). */
  unit?: (r: Rng, x: string) => string;
  weight?: number;
};

/** A recipe as a shape of a chapter's level. */
export function shapeOf(rc: Recipe, use: Use = {}): Shape {
  const id = use.id ?? rc.id;
  return {
    id,
    name: rc.name,
    weight: use.weight,
    positive: !!rc.positive,
    make: (r) => {
      const x = use.letter?.(r) ?? "x";
      const unit = use.unit?.(r, x);
      const x0 = (use.answer ?? rc.answer ?? pickAnswer)(r);
      const rel: Rel = use.ineq ? one(r, RELS) : "=";
      const term = (m: string | undefined) => (k: number) => (k === 0 ? null : termExpr(k, m ? variable(m) : null));
      const c: Ctx = { r, x, x0, ineq: !!use.ineq, X: term(x), u: term(unit) };
      const made = rc.steps(c);
      if (!made || x0 === 0) return null;
      const [value, steps] = Array.isArray(made) ? [c.u(x0)!, made] : [made.value, made.steps];
      const b = build(solved(x, value, rel), steps, r);
      return b && draftOf(id, b, b.positive || !!rc.positive);
    },
  };
}

// ---------- the recipes ----------

export const oneStep: Recipe = {
  id: "one-step",
  name: "a number added or taken away",
  steps: ({ r, u, ineq }) => {
    // x + a, a + x, x − a; an inequality now and then the other way round (c > x + b).
    const a = r.int(2, ineq ? 9 : 15);
    const kind = r.int(0, 2);
    return [plus(u(kind === 2 ? -a : a)!, kind === 1), ineq && r.next() < 0.3 && swap()];
  },
};

export const timesX: Recipe = {
  id: "times",
  name: "a number times the letter, or the letter over a number",
  steps: ({ r, x0, ineq }) => {
    if (!ineq && r.next() < 0.4) {
      // x/a = b: a goes into the answer.
      const as = [2, 3, 4, 5, 6, 7, 8, 9].filter((a) => divides(a, x0));
      return as.length ? [over(one(r, as))] : null;
    }
    // An inequality: a negative number in front turns it round.
    const a = ineq && r.next() < 0.15 ? -1 : ineq ? r.signed(2, 6) : r.int(2, 9);
    return [times(a), ineq && a > 0 && r.next() < 0.3 && swap()];
  },
};

export const divided: Recipe = {
  id: "divided",
  name: "the letter over a number",
  answer: (r) => r.signed(1, 5) * r.int(2, 4),
  steps: ({ r, x0 }) => {
    // x/a R c, or −x/a R c (that one turns round); x/2 ≤ 1 is done in one move: too quick.
    const a = r.int(2, 5);
    const minus = r.next() < 0.5;
    if (!divides(a, x0) || (!minus && Math.abs(x0) === a)) return null;
    return [over(a), minus && times(-1)];
  },
};

export const twoStep: Recipe = {
  id: "two-step",
  name: "a number times the letter, and a number",
  steps: ({ r, u, ineq }) => {
    // ax + b, or (an inequality, turning round) b − ax.
    const a = ineq ? r.int(2, 5) : r.int(2, 9);
    if (ineq && r.next() < 0.5) return [times(a), from(r.int(1, 12))];
    return [times(a), plus(u(r.signed(1, 12))!)];
  },
};

export const overPlus: Recipe = {
  id: "over-plus",
  name: "the letter over a number, and a number",
  answer: (r) => r.int(1, 6) * r.int(2, 4) * (r.next() < 0.2 ? -1 : 1),
  steps: ({ r, u, x0, ineq }) => {
    const a = r.int(2, ineq ? 4 : 5);
    if (!divides(a, x0)) return null;
    if (ineq && r.next() < 0.5) return [over(a), from(r.int(1, 6))];
    return [over(a), plus(u(r.signed(1, ineq ? 6 : 9))!)];
  },
};

export const bracketX: Recipe = {
  id: "bracket",
  name: "a bracket",
  steps: ({ r, u, ineq }) => {
    const a = r.int(2, ineq ? 5 : 6);
    // c R a(d − x): turned round twice, the sides swapped and a minus.
    if (ineq && r.next() < 0.4) return [from(r.int(1, 8)), times(a), swap()];
    return [plus(u(r.signed(1, ineq ? 6 : 9))!), times(a)];
  },
};

export const bothSides: Recipe = {
  id: "both-sides",
  name: "the letter on both sides",
  steps: ({ r, X, u, x0, ineq }) => {
    // ax + b = cx + d; an inequality's a may be negative (b − 2x < 3x + 1).
    let a = ineq ? r.int(1, 5) : r.int(2, 9);
    const c = ineq ? r.int(1, 5) : r.int(1, 8);
    if (ineq && r.next() < 0.3) a = -a;
    const b = r.signed(1, ineq ? 9 : 12);
    const d = (a - c) * x0 + b;
    if (a === c || (!ineq && a < c) || d === 0) return null;
    return [both(a < 0 ? side(u(b), X(a)) : side(X(a), u(b)), side(X(c), u(d)))];
  },
};

export const bracketPlus: Recipe = {
  id: "bracket-plus",
  name: "a bracket, then a number",
  steps: ({ r, u }) => [plus(u(r.signed(1, 9))!), times(r.int(2, 6)), plus(u(r.signed(1, 12))!)],
};

export const bracketsBoth: Recipe = {
  id: "brackets-both",
  name: "brackets on both sides",
  steps: ({ r, X, u, x0, ineq }) => {
    // a(x + b) = c(x + d); an inequality's a and c at least 2 apart (a division at the end).
    const a = r.int(2, ineq ? 5 : 7);
    const c = r.int(2, ineq ? 5 : 7);
    const b = r.signed(1, ineq ? 6 : 9);
    const top = a * (x0 + b);
    if (Math.abs(a - c) < (ineq ? 2 : 1) || !divides(c, top)) return null;
    const d = top / c - x0;
    if (d === 0 || d === b || Math.abs(d) > 9) return null;
    return [both(side(X(a), u(a * b)), side(X(c), u(c * d))), bracket(a, 0), bracket(c, 1)];
  },
};

export const minusBracket: Recipe = {
  id: "minus-bracket",
  name: "taking away a bracket",
  steps: ({ r, X, u, x0 }) => {
    // a(x + b) − c(x + d) = e
    const a = r.int(3, 7);
    const c = r.int(2, a - 1);
    const b = r.signed(1, 6);
    const d = r.signed(1, 6);
    const e = a * (x0 + b) - c * (x0 + d);
    if (e === 0 || b === d) return null;
    return [
      both(side(X(a - c), u(a * b - c * d)), side(u(e))),
      spread([X(a)!, u(a * b)!, X(-c)!, u(-c * d)!]),
      bracket(a, 0, { count: 2 }),
      bracket(-c, 0, { first: 1, count: 2 }),
    ];
  },
};

export const fraction: Recipe = {
  id: "fraction",
  name: "a fraction equal to the letter minus a number",
  steps: ({ r, X, u, x0 }) => {
    // (x + a)/b = x − c
    const b = r.int(2, 5);
    const a = r.signed(1, 12);
    if (!divides(b, x0 + a) || x0 + a === 0) return null;
    const c = x0 - (x0 + a) / b;
    if (c === 0) return null;
    return [both(side(X(1), u(a)), side(X(b), u(-b * c))), bracket(b, 1), over(b, 0)];
  },
};

export const minusTimesBracket: Recipe = {
  id: "minus-times-bracket",
  name: "a number minus a bracket",
  steps: ({ r, u, x0 }) => {
    // a − b(x − c) = d
    const b = r.int(2, 5);
    const c = r.int(1, 9);
    const a = r.int(2, 15);
    if (x0 === c || a - b * (x0 - c) === 0) return null;
    return [times(b), plus(u(-b * c)!), bracket(b, 0), from(a)];
  },
};

export const twoFractions: Recipe = {
  id: "two-fractions",
  name: "two fractions to clear",
  steps: ({ r, X, u, x0 }) => {
    // (x + a)/b = (x + c)/d
    const b = r.int(2, 5);
    const d = r.int(2, 5);
    const a = r.signed(1, 9);
    if (b === d || !divides(b, x0 + a)) return null;
    const c = (d * (x0 + a)) / b - x0;
    if (!Number.isInteger(c) || c === 0 || c === a || x0 + a === 0 || x0 + c === 0) return null;
    return [both(side(X(d), u(d * a)), side(X(b), u(b * c))), bracket(d, 0), bracket(b, 1), quiet(over(b, 0)), over(d, 1)];
  },
};

export const bracketsAndX: Recipe = {
  id: "brackets-and-x",
  name: "brackets on both sides, and one more of the letter",
  steps: ({ r, X, u, x0 }) => {
    // a(x + b) + x = c(x + d)
    const a = r.int(2, 6);
    const c = r.int(2, 7);
    const b = r.signed(1, 8);
    const top = a * (x0 + b) + x0;
    if (a + 1 === c || !divides(c, top)) return null;
    const d = top / c - x0;
    if (d === 0 || d === b) return null;
    return [both(side(X(a + 1), u(a * b)), side(X(c), u(c * d))), spread([X(a)!, u(a * b)!, X(1)!]), bracket(a, 0, { count: 2 }), bracket(c, 1)];
  },
};

export const nested: Recipe = {
  id: "nested",
  name: "a bracket inside a bracket",
  steps: ({ r, u, x0 }) => {
    // a(b(x + c) + d) = e
    const c = r.signed(1, 6);
    const b = r.int(2, 5);
    const d = r.signed(1, 9);
    if (x0 + c === 0 || b * (x0 + c) + d === 0) return null;
    return [plus(u(c)!), times(b), plus(u(d)!), times(r.int(2, 4))];
  },
};

export const fractionsAx: Recipe = {
  id: "fractions-ax",
  name: "two fractions, a number times the letter on top",
  steps: ({ r, X, u, x0 }) => {
    // (ax + b)/c = (dx + e)/f
    const a = r.int(2, 5);
    const d = r.int(1, 4);
    const c = r.int(2, 5);
    const f = r.int(2, 5);
    const b = r.signed(1, 9);
    if (c === f || !divides(c, a * x0 + b) || a * x0 + b === 0) return null;
    const e = (f * (a * x0 + b)) / c - d * x0;
    if (!Number.isInteger(e) || e === 0 || f * a === c * d || d * x0 + e === 0) return null;
    // Nothing that cancels at sight: no common factor on a top, or between a top and its bottom.
    if (gcd(a, b) > 1 || gcd(d, e) > 1 || gcd(gcd(a, b), c) > 1 || gcd(gcd(d, e), f) > 1) return null;
    return [both(side(X(f * a), u(f * b)), side(X(c * d), u(c * e))), bracket(f, 0), bracket(c, 1), quiet(over(c, 0)), over(f, 1)];
  },
};

export const bracketOver: Recipe = {
  id: "bracket-over",
  name: "a bracket over a number",
  steps: ({ r, X, u, x0 }) => {
    // a(x + b)/c = x + d
    const a = r.int(2, 5);
    const c = r.int(2, 5);
    const b = r.signed(1, 9);
    if (a === c || gcd(a, c) > 1 || !divides(c, a * (x0 + b)) || x0 + b === 0) return null;
    const d = (a * (x0 + b)) / c - x0;
    if (d === 0 || x0 + d === 0) return null;
    return [both(side(X(a), u(a * b)), side(X(c), u(c * d))), bracket(a, 0), bracket(c, 1), over(c, 0)];
  },
};

export const bracketLess: Recipe = {
  id: "bracket-less",
  name: "a bracket, less some of the letter",
  steps: ({ r, X, u, x0 }) => {
    // a(x + b) − cx R e, more taken away than the bracket has: it turns round at the end.
    const a = r.int(2, 5);
    const c = a + r.int(2, 4);
    const b = r.signed(1, 6);
    const e = (a - c) * x0 + a * b;
    if (e === 0) return null;
    return [both(side(X(a - c), u(a * b)), side(u(e))), spread([X(a)!, u(a * b)!, X(-c)!]), bracket(a, 0, { count: 2 })];
  },
};

export const minusInFront: Recipe = {
  id: "minus-bracket",
  name: "a minus in front of a bracket",
  steps: ({ r, X, u, x0 }) => {
    // −(x + a) R bx + c
    const a = r.signed(1, 6);
    const b = r.int(1, 4);
    const c = -(x0 + a) - b * x0;
    if (c === 0 || c === a) return null;
    return [both(side(X(-1), u(-a)), side(X(b), u(c))), bracket(-1, 0)];
  },
};

export const nestedBrackets: Recipe = {
  id: "nested-brackets",
  name: "a bracket inside a bracket, the letter on both sides",
  answer: (r) => r.int(1, 6),
  steps: ({ r, X, u, x0 }) => {
    // a(b(x − c) + d) R ex + f
    const a = r.int(2, 3);
    const b = r.int(2, 3);
    const c = r.int(1, 4);
    const d = r.int(1, 6);
    const e = r.int(1, a * b - 1);
    const k = d - b * c;
    const f = (a * b - e) * x0 + a * k;
    if (k === 0 || f === 0 || Math.abs(f) > 30) return null;
    return [
      both(side(X(a * b), u(a * k)), side(X(e), u(f))),
      bracket(a, 0),
      spread([X(b)!, u(-b * c)!, u(d)!], 0, { path: [1] }),
      bracket(b, 0, { count: 2, path: [1] }),
    ];
  },
};

export const bracketInFraction: Recipe = {
  id: "bracket-in-fraction",
  name: "a bracket inside a fraction, with more of the letter beside it",
  answer: (r) => r.int(1, 6),
  steps: ({ r, X, u, x0 }) => {
    // (b(x + c) + x)/a R q
    const a = r.int(2, 5);
    const b = r.int(2, 3);
    const c = r.int(1, 4);
    if (!divides(a, (b + 1) * x0 + b * c)) return null;
    return [times(b + 1), plus(u(b * c)!), spread([X(b)!, u(b * c)!, X(1)!]), bracket(b, 0, { count: 2 }), over(a, 0)];
  },
};

export const bracketPlusBoth: Recipe = {
  id: "bracket-and-letter",
  name: "a bracket, a number added, the letter on both sides",
  steps: ({ r, X, u, x0 }) => {
    // p(x + m) + t = x + s
    const p = r.int(3, 4);
    const m = r.signed(1, 4);
    const t = r.signed(1, 5);
    const s = (p - 1) * x0 + p * m + t;
    if (s === 0 || s === p * m + t || p * m + t === 0) return null;
    return [both(side(X(p), u(p * m + t)), side(X(1), u(s))), spread([X(p)!, u(p * m)!, u(t)!]), bracket(p, 0, { count: 2 })];
  },
};

export const fractionsMinus: Recipe = {
  id: "fractions-minus",
  name: "one fraction less another",
  steps: ({ r, X, u, x0 }) => {
    // (x + m)/b − (x + n)/d = e: times bd, d(x + m) − b(x + n) = bde.
    const [b, d] = one(r, [[2, 3], [3, 2], [3, 4], [4, 3]] as const);
    const m = r.signed(1, 6);
    const n = r.signed(1, 6);
    const top = d * (x0 + m) - b * (x0 + n);
    if (m === n || top % (b * d) !== 0 || x0 + m === 0 || x0 + n === 0) return null;
    const e = top / (b * d);
    if (e === 0 || d * m - b * n === 0 || d * m - b * n === b * d * e) return null;
    const lin = (k: number) => side(X(1), u(k));
    return [
      both(side(X(d - b), u(d * m - b * n)), side(u(b * d * e))),
      spread([X(d)!, u(d * m)!, X(-b)!, u(-b * n)!]),
      bracket(d, 0, { count: 2 }),
      bracket(-b, 0, { first: 1, count: 2 }),
      restate(["move-denominator", "multiply-fractions", "distribute", "cancel-factor"], sumOf([frac(lin(m), num(b)), neg(frac(lin(n), num(d)))]), u(e)!),
    ];
  },
};

export const twoBracketsMixed: Recipe = {
  id: "two-brackets-mixed",
  name: "two brackets, one taken away",
  steps: ({ r, X, u, x0 }) => {
    // p(qx + m) − d(x + n) = fx + G
    const [p, q, m, d, n, f] = [r.int(2, 4), r.int(1, 3), r.signed(1, 5), r.int(2, 4), r.signed(1, 5), r.int(1, 4)];
    const L = p * q - d;
    const K = p * m - d * n;
    const G = (L - f) * x0 + K;
    if (L === f || L === 0 || K === 0 || G === 0 || p * q > 12 || Math.abs(G) > 20 || (q === 1 && (p === d || m === n))) return null;
    return [both(side(X(L), u(K)), side(X(f), u(G))), spread([X(p * q)!, u(p * m)!, X(-d)!, u(-d * n)!]), bracket(p, 0, { count: 2 }), bracket(-d, 0, { first: 1, count: 2 })];
  },
};

/** Multiplying out squares and brackets, and collecting. */
const EXPAND: RuleId[] = ["power-to-product", "distribute", "merge-powers", "combine"];

export const squareExpand: Recipe = {
  id: "square-expand",
  name: "a bracket squared, against the square of the letter and a number",
  answer: (r) => r.int(1, 6),
  steps: ({ r, x, X, u, x0 }) => {
    // (x + a)² R x² + c: the squares cancel.
    const a = r.int(2, 5);
    const c = 2 * a * x0 + a * a;
    if (c > 40) return null;
    return [
      both(side(X(2 * a), u(a * a)), side(u(c))),
      plus(ex(`${x}^2`), true),
      writeAs(EXPAND, ex(`${x}^2 + ${a}${x} + ${a}(${x} + ${a})`)),
      writeAs(EXPAND, ex(`${x}(${x} + ${a}) + ${a}(${x} + ${a})`)),
      writeAs(EXPAND, ex(`(${x} + ${a})^2`)),
    ];
  },
};

export const bracketsSquare: Recipe = {
  id: "brackets-square",
  name: "two brackets multiplied, against a bracket squared",
  answer: (r) => r.int(1, 5),
  steps: ({ r, x, X, u, x0 }) => {
    // (x + a)(x + b) R (x + c)² + d: the squares cancel.
    const a = r.int(2, 6);
    const b = r.int(1, 6);
    const c = r.int(2, 3);
    const k = a + b - 2 * c;
    const d = k * x0 + a * b - c * c;
    if (k < 1 || a === b || d === 0 || Math.abs(d) > 20) return null;
    const plusD = d < 0 ? ` - ${-d}` : ` + ${d}`;
    const bx = b === 1 ? x : `${b}${x}`;
    return [
      both(side(X(a + b), u(a * b)), side(X(2 * c), u(c * c + d))),
      plus(ex(`${x}^2`), true),
      writeAs(EXPAND, ex(`${x}^2 + ${c}${x} + ${c}(${x} + ${c})${plusD}`), 1),
      writeAs(EXPAND, ex(`${x}(${x} + ${c}) + ${c}(${x} + ${c})${plusD}`), 1),
      writeAs(EXPAND, ex(`(${x} + ${c})^2${plusD}`), 1),
      writeAs(EXPAND, ex(`${x}^2 + ${bx} + ${a}(${x} + ${b})`)),
      writeAs(EXPAND, ex(`${x}(${x} + ${b}) + ${a}(${x} + ${b})`)),
      writeAs(EXPAND, ex(`(${x} + ${a})(${x} + ${b})`)),
    ];
  },
};


/** The inequalities' letters: mostly x, now and then another, as the hand-made ones do. */
export const ineqLetter = (r: Rng) => someLetter(r, ["y", "n", "a", "k", "m", "p"]);
