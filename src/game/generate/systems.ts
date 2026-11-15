/**
 * Simultaneous equations, built back from the answer (x = 3; y = 2) with
 * un-moves on both rows (unmove.ts): one letter's row is written in terms of
 * the other (y = 2x − 1) and put into the other row (3x + y = 13 ← 5x − 1 =
 * 13), then each row dressed as a teacher would. Solving is the way back:
 * get one letter on its own, substitute, solve, then the other.
 *
 * Row 0 is x's, row 1 is y's (swapped round now and then at the end).
 */
import type { Expr, MathState } from "../../expr/types";
import { children, mapTree } from "../../expr/tree";
import { variable } from "../../expr/build";
import type { RuleId } from "../../rules";
import { bracket, build, draftOf, n, plus, sumOf, swap, swapRows, termExpr, times, unsubstitute, valueIn, type UnMove } from "./unmove";
import { composeSteps, type Kind } from "./compose";
import { letterPair, one, type Level, type Rng, type Shape } from "./write";

type Ctx = { r: Rng; X: (k: number) => Expr; Y: (k: number) => Expr };
type Steps = (UnMove | null | false | undefined)[];
/** The answer, and the steps back from it. */
type Made = { x0: number; y0: number; steps: Steps };

/** A system's shape: the answer picked (whole, small, positive), and the steps back from it. */
function system(id: string, name: string, make: (c: Ctx) => Made | null): Shape {
  return {
    id,
    name,
    make: (r) => {
      const [x, y] = letterPair(r);
      const made = make({ r, X: (k) => termExpr(k, variable(x)), Y: (k) => termExpr(k, variable(y)) });
      if (!made) return null;
      const b = build({ sides: [variable(x), n(made.x0), variable(y), n(made.y0)], join: "and" }, made.steps, r);
      return b && draftOf(id, b);
    },
  };
}

const side = (...ts: (Expr | null | false)[]): Expr => sumOf(ts.filter((t): t is Expr => !!t && !(t.kind === "num" && t.value === 0)));
const ok = (...ns: number[]) => ns.every((v) => v !== 0 && Math.abs(v) <= 15);
/** The rows in either order. */
const shuffle = (r: Rng, odds = 0.5) => r.next() < odds && swapRows();

// ---------- easy ----------

/** x = 2; px + y = c: put x in, then y. */
const knownX = system("known-x", "one letter already known", ({ r }) => {
  const [x0, y0, p] = [r.int(1, 6), r.int(1, 6), r.int(1, 3)];
  if (!ok(p * x0 + y0)) return null;
  return { x0, y0, steps: [plus(n(p * x0), true, 1), unsubstitute(1, 0, p, true)] };
});

/** y = 3; x ± py = c. */
const knownY = system("known-y", "one letter already known", ({ r }) => {
  const [x0, y0] = [r.int(1, 6), r.int(1, 6)];
  const p = r.int(1, 3) * (r.next() < 0.4 ? -1 : 1);
  if (!ok(x0 + p * y0)) return null;
  return { x0, y0, steps: [plus(n(p * y0), false, 0), unsubstitute(0, 1, p), swapRows()] };
});

/** y = kx; px + y = c. */
const multiple = system("multiple", "one letter a number of times the other", ({ r, X }) => {
  const [x0, k, p] = [r.int(1, 5), r.int(2, 4), r.int(1, 3)];
  if (!ok((p + k) * x0) || k * x0 > 15) return null;
  return { x0, y0: k * x0, steps: [valueIn(X(k), 1), times(p + k, 0, 0), unsubstitute(0, 1, 1), shuffle(r, 0.25)] };
});

/** y = mx + b; px + y = c. */
const linear = system("linear", "a letter given as mx + b", ({ r, X }) => {
  const [x0, m, b, p] = [r.int(1, 5), r.int(1, 3), r.signed(1, 5), r.int(1, 3)];
  const y0 = m * x0 + b;
  if (y0 <= 0 || y0 > 12 || !ok(p * x0 + y0)) return null;
  return { x0, y0, steps: [valueIn(side(X(m), n(b)), 1), times(p + m, 0, 0), plus(n(b), false, 0), unsubstitute(0, 1, 1)] };
});

/** y = b − mx; px + y = c. */
const takeAway = system("take-away", "a letter given as a number take away", ({ r, X }) => {
  const [x0, m, y0, p] = [r.int(1, 5), r.int(1, 2), r.int(1, 6), r.int(1, 3)];
  const b = y0 + m * x0;
  if (p === m || !ok(b, p * x0 + y0)) return null;
  return { x0, y0, steps: [valueIn(side(n(b), X(-m)), 1), times(p - m, 0, 0), plus(n(b), false, 0), unsubstitute(0, 1, 1)] };
});

// ---------- medium ----------

/** x + y = s; x − y = d: from the second, x = d + y. */
const sumDifference = system("sum-difference", "the sum and the difference", ({ r, X, Y }) => {
  const [x0, y0] = [r.int(1, 8), r.int(1, 8)];
  if (x0 === y0) return null;
  // The bigger letter is given by the difference; the smaller is found first.
  const [small, bigRow, smallRow] = x0 > y0 ? [Y, 0, 1] : [X, 1, 0];
  const d = Math.abs(x0 - y0);
  return {
    x0,
    y0,
    // x + y = s, x first either way.
    steps: [valueIn(side(n(d), small(1)), bigRow), times(2, 0, smallRow), plus(n(d), false, smallRow), unsubstitute(smallRow, bigRow, 1, bigRow === 0), plus(small(-1), false, bigRow), shuffle(r, 0.3)],
  };
});

/** x + y = s; px + y = c: y = s − x from the first. */
const sumAndOther = system("sum-and-other", "a sum, and another equation", ({ r, X }) => {
  const [x0, y0, p] = [r.int(1, 6), r.int(1, 6), r.int(3, 4)];
  const s = x0 + y0;
  if (!ok(p * x0 + y0)) return null;
  return { x0, y0, steps: [valueIn(side(n(s), X(-1)), 1), times(p - 1, 0, 0), plus(n(s), false, 0), unsubstitute(0, 1, 1), plus(X(1), true, 1), shuffle(r)] };
});

/** px + qy = c; x − ky = d: x = d + ky, and px becomes p(d + ky). */
const bracketSub = system("bracket-sub", "substituting a whole bracket", ({ r, Y }) => {
  const [y0, k, d, p, q] = [r.int(1, 4), r.int(1, 2), r.int(1, 4), r.int(2, 3), r.int(1, 2)];
  const x0 = d + k * y0;
  if (!ok(p * x0 + q * y0) || x0 > 9) return null;
  return { x0, y0, steps: [valueIn(side(n(d), Y(k)), 0), times(p * k + q, 0, 1), plus(n(p * d), false, 1), unsubstitute(1, 0, p, true), plus(Y(-k), false, 0), swapRows(), shuffle(r)] };
});

/** px − y = c; x + y = s: y = s − x, and −y becomes −(s − x). */
const minusBracket = system("minus-bracket", "taking away a substituted bracket", ({ r, X }) => {
  const [x0, y0, p] = [r.int(1, 6), r.int(1, 6), r.int(2, 4)];
  const s = x0 + y0;
  if (p * x0 - y0 <= 0 || !ok(p * x0 - y0)) return null;
  return { x0, y0, steps: [valueIn(side(n(s), X(-1)), 1), times(p + 1, 0, 0), plus(n(-s), false, 0), unsubstitute(0, 1, -1), plus(X(1), true, 1), shuffle(r)] };
});

// ---------- hard: an equation to tidy first (brackets, a common factor), then substitute ----------

/** p(x + y) = ps; qx − y = c. */
const tidyFactor = system("tidy-factor", "a common factor to divide out first", ({ r, X }) => {
  const [x0, y0, p, q] = [r.int(1, 6), r.int(1, 6), r.int(2, 3), r.int(2, 4)];
  const s = x0 + y0;
  if (q * x0 - y0 <= 0 || p * s > 30 || !ok(q * x0 - y0)) return null;
  return { x0, y0, steps: [valueIn(side(n(s), X(-1)), 1), times(q + 1, 0, 0), plus(n(-s), false, 0), unsubstitute(0, 1, -1), plus(X(1), true, 1), times(p, 0, 1), shuffle(r, 0.4)] };
});

/** p(x − a) = y + b; x + qy = c. */
const tidyBracket = system("tidy-bracket", "a bracket to expand first", ({ r, X }) => {
  const [x0, y0, p, a, q] = [r.int(2, 6), r.int(1, 6), r.int(2, 3), r.int(1, 3), r.int(1, 2)];
  const b = p * (x0 - a) - y0;
  const K = p * a + b;
  if (x0 === a || b === 0 || K <= 0 || !ok(x0 + q * y0, K)) return null;
  return { x0, y0, steps: [valueIn(side(X(p), n(-K)), 1), times(1 + p * q, 0, 0), plus(n(-q * K), false, 0), unsubstitute(0, 1, q), swap(1), plus(n(b), false, 1), bracket(p, 0, { row: 1 }), shuffle(r, 0.4)] };
});

/** x + y = s; px − q(y − t) = c. */
const minusBracketSub = system("minus-bracket-sub", "substituting into a bracket that is taken away", ({ r, X }) => {
  const [x0, y0, p, q, t] = [r.int(1, 6), r.int(2, 7), r.int(2, 3), 2, r.int(1, 3)];
  const s = x0 + y0;
  if (y0 === t || !ok(p * x0 - q * (y0 - t))) return null;
  return { x0, y0, steps: [valueIn(side(n(s), X(-1)), 1), times(p + q, 0, 0), plus(n(q * (t - s)), false, 0), unsubstitute(0, 1, -q), bracket(-q, 0, { first: 1, count: 2 }), plus(X(1), true, 1), shuffle(r, 0.4)] };
});

/** a(x + b(y − c)) = R; x − y = d. */
const nestedThenSubstitute = system("nested-then-substitute", "a bracket inside a bracket to undo, then substitute", ({ r, Y }) => {
  const y0 = r.int(1, 5);
  const [x0, a, b, c] = [r.int(y0 + 1, y0 + 4), r.int(2, 3), r.int(2, 3), r.int(1, 3)];
  const d = x0 - y0;
  const inner = x0 + b * (y0 - c);
  if (inner <= 0 || a * inner > 30) return null;
  return {
    x0,
    y0,
    steps: [valueIn(side(n(d), Y(1)), 0), times(1 + b, 0, 1), plus(n(d - b * c), false, 1), unsubstitute(1, 0, 1, true), bracket(b, 0, { first: 1, count: 2, row: 1 }), times(a, 0, 1), plus(Y(-1), false, 0), swapRows()],
  };
});

// ---------- composed: one row an equation from the earlier chapters ----------

type Needs = (kinds: readonly Kind[]) => boolean;
const isRoot = (k: Kind) => k === "root" || k === "cube";
const isLogExp = (k: Kind) => k === "log" || k === "exp";
/** What each level's equation must have in it: Medium a root, a log or a power; Hard a root, a log or a power, and a fraction. */
const NEEDS: Record<Level, Needs | undefined> = {
  easy: undefined,
  medium: (ks) => ks.some((k) => isRoot(k) || isLogExp(k)),
  hard: (ks) => ks.some(isRoot) && ks.some(isLogExp) && ks.includes("over"),
};

/**
 * One letter first: y's row a composed equation (√(y + 7) = 4), x's linear
 * (2x + y = 11). Solve the first, put its answer in the second.
 */
function oneFirst(r: Rng, level: Level, rules: readonly RuleId[], needs: Needs | undefined): Shape["make"] {
  return () => {
    const [x, y] = letterPair(r);
    const composed = composeSteps(r, level, rules, { letter: y, row: 1, needs, three: level === "hard" });
    if (!composed) return null;
    const y0 = composed.x0;
    const x0 = r.int(1, 8);
    const a = one(r, [1, 1, 2, 3]);
    const b = one(r, [1, 1, 2, -1]);
    const c = a * x0 + b * y0;
    if (c <= 0 || c > 30 || x0 === y0) return null;
    const start: MathState = { sides: [variable(x), n(x0), variable(y), n(y0)], join: "and" };
    const built = build(start, [times(a, 0, 0), plus(n(b * y0), false, 0), unsubstitute(0, 1, b), ...composed.steps, r.next() < 0.6 && swapRows()], r);
    return built && draftOf("composed", built);
  };
}

/**
 * Substitute in: y = mx + c given, and x's row a composed equation with y
 * inside it, √(x + y + 3) = 4. Put y in, collect, and it's an equation in x
 * to peel; then y from x.
 */
function substituteIn(r: Rng, level: Level, rules: readonly RuleId[], needs: Needs | undefined): Shape["make"] {
  return () => {
    const [x, y] = letterPair(r);
    let def: { e: Expr; y0: number } | null = null;
    const composed = composeSteps(r, level, rules, {
      letter: x,
      needs,
      three: level === "hard",
      around: (x0) => {
        const m = r.int(1, 3);
        const c = r.signed(1, 5);
        def = { e: side(termExpr(m, variable(x)), n(c)), y0: m * x0 + c };
        return putIn(x, y, m, c, r);
      },
    });
    const d = def as { e: Expr; y0: number } | null;
    if (!composed || !d || c0(d.y0)) return null;
    const start: MathState = { sides: [variable(x), n(composed.x0), variable(y), n(d.y0)], join: "and" };
    const built = build(start, [valueIn(d.e, 1), ...composed.steps, r.next() < 0.6 && swapRows()], r);
    return built && draftOf("composed", built);
  };
}

/** y's value is no small whole positive number. */
const c0 = (y0: number) => y0 < 1 || y0 > 12;

/** The un-move that puts y (= mx + c) into x's row, where a sum there has enough x to give up (a·x + b becomes k·y + (b − k·c), or (a − m)·x + y + (b − c)). */
function putIn(x: string, y: string, m: number, c: number, r: Rng): UnMove {
  return {
    rules: ["substitute", "combine", "distribute", "multiply-numbers"],
    on: (s) => {
      const sums: Extract<Expr, { kind: "sum" }>[] = [];
      const visit = (e: Expr) => {
        if (e.kind === "sum") sums.push(e);
        children(e).forEach(visit);
      };
      visit(s.sides[0]);
      visit(s.sides[1]);
      const spots = sums.flatMap((sum) => sum.terms.map((t, i) => ({ sum, i, a: coefOf(t, x) })).filter((p) => p.a !== null && p.a > 0 && (m < p.a || p.a % m === 0)));
      if (!spots.length) return null;
      const spot = one(r, spots);
      const a = spot.a!;
      const split = m < a && (a % m !== 0 || r.next() < 0.5);
      const k = split ? 1 : a / m;
      const terms = spot.sum.terms.slice();
      terms.splice(spot.i, 1, ...(split ? [termExpr(a - m, variable(x)), variable(y)] : [termExpr(k, variable(y))]));
      const j = terms.findIndex((t) => Number.isFinite(numOf(t)));
      if (j >= 0) {
        const v = numOf(terms[j]) - k * c;
        if (v === 0) terms.splice(j, 1);
        else terms[j] = n(v);
      } else terms.push(n(-k * c));
      const made = sumOf(terms);
      return { ...s, sides: [mapTree(s.sides[0], (e) => (e.id === spot.sum.id ? made : e)), mapTree(s.sides[1], (e) => (e.id === spot.sum.id ? made : e)), ...s.sides.slice(2)] };
    },
  };
}

const numOf = (e: Expr): number => (e.kind === "num" ? e.value : e.kind === "neg" && e.arg.kind === "num" ? -e.arg.value : NaN);
function coefOf(e: Expr, x: string): number | null {
  if (e.kind === "var" && e.name === x) return 1;
  if (e.kind === "prod" && e.factors.length === 2 && e.factors[0].kind === "num" && e.factors[1].kind === "var" && e.factors[1].name === x) return e.factors[0].value;
  return null;
}

/**
 * The composed shape of a level: either way in, `inLevel` the composer's
 * level for the equation inside, `weight` against the level's other shapes.
 */
export const composedSystem = (inLevel: { first?: Level; sub?: Level }, level: Level, rules: () => readonly RuleId[], weight = 1): Shape => ({
  id: "composed",
  name: "an equation from the earlier chapters, and a second letter to find",
  weight,
  make: (r) => {
    const ways = [...(inLevel.first ? [oneFirst(r, inLevel.first, rules(), NEEDS[level])] : []), ...(inLevel.sub ? [substituteIn(r, inLevel.sub, rules(), NEEDS[level])] : [])];
    return one(r, ways)(r);
  },
});

export const SYSTEMS = { knownX, knownY, multiple, linear, takeAway, sumDifference, sumAndOther, bracketSub, minusBracket, tidyFactor, tidyBracket, minusBracketSub, nestedThenSubstitute };

