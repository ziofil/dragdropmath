/**
 * Exercises built backwards, as a teacher does: start from the answer
 * (x = 3) and undo the solution, one step at a time. Each step is an
 * un-move: the reverse of a move a learner makes (x = 3 becomes 2x = 6, the
 * reverse of moving the 2 across), named by the move that undoes it. Solving
 * is the way back, so it can always be done; the states on the way are the
 * milestones; the start, the goal and the numbers met are all read off them.
 *
 * Un-moves work on trees (expr/types), on the row they're given (an
 * equation, an inequality, or a row of a system), and pick their own numbers
 * when told what the next step needs (`need`, on the value of the side
 * that isn't being built).
 */
import type { Expr, MathState, Rel } from "../../expr/types";
import { econst, flipRel, frac, log, neg, num, pow, prod, root, sum, variable } from "../../expr/build";
import { key } from "../../expr/key";
import { parseState } from "../../expr/parse";
import { allNodes, children, mapTree, withChildren } from "../../expr/tree";
import type { RuleId } from "../../rules";
import type { Rng } from "./write";
import type { Stage } from "./way";
import { ARITH as WORK, SIMPLIFY } from "./families";
import { differ, envs } from "../answers";
import { evaluate } from "../../expr/eval";
import { rowAt, rowOf, rows, withRow, withRows, type Row } from "../../expr/rows";

// ---------- terms: k·m, a number times what it's made of ----------

/** A term as a number times the rest of it (`m` null: a plain number). */
export type Term = { k: number; m: Expr | null };

export const n = (v: number): Expr => (v < 0 ? neg(num(-v)) : num(v));

/** An expression read from how it's written ("(x + 3)^2"). */
export const ex = (src: string): Expr => parseState(src).sides[0];

export function termOf(e: Expr): Term {
  if (e.kind === "num") return { k: e.value, m: null };
  if (e.kind === "neg") {
    const t = termOf(e.arg);
    return { k: -t.k, m: t.m };
  }
  if (e.kind === "prod" && e.factors[0].kind === "num") {
    const rest = e.factors.slice(1);
    return { k: e.factors[0].value, m: rest.length === 1 ? rest[0] : prod(rest) };
  }
  return { k: 1, m: e };
}

/** k·m written as a person would: 3x, -x, x, 7, 2(x + 1). */
export function termExpr(k: number, m: Expr | null): Expr {
  if (m === null) return n(k);
  const pos = k === 1 || k === -1 ? m : prod([num(Math.abs(k)), ...(m.kind === "prod" ? m.factors : [m])]);
  return k < 0 ? neg(pos) : pos;
}

const like = (a: Term, b: Term) => (a.m === null ? b.m === null : b.m !== null && key(a.m) === key(b.m));

export const termsOf = (e: Expr): Expr[] => (e.kind === "sum" ? e.terms : [e]);
export const sumOf = (ts: Expr[]): Expr => (ts.length === 0 ? num(0) : ts.length === 1 ? ts[0] : sum(ts));

/** `side` + t, t joined to a like term if there is one (and gone if they cancel); else put first or last. */
export function plusTerm(side: Expr, t: Expr, first = false): Expr {
  const tt = termOf(t);
  const ts = termsOf(side);
  const i = ts.findIndex((x) => like(termOf(x), tt));
  if (i < 0) return sumOf(first ? [t, ...ts] : [...ts, t]);
  const k = termOf(ts[i]).k + tt.k;
  const out = ts.slice();
  if (k === 0) out.splice(i, 1);
  else out[i] = termExpr(k, tt.m);
  return sumOf(out);
}

/** Every term times a (a fraction over a number whose multiple a is: its top times what's left, ln(5)/2 · 2 → ln(5)). */
export function scaled(side: Expr, a: number): Expr {
  if (side.kind === "frac" && side.den.kind === "num" && a % side.den.value === 0) return scaled(side.num, a / side.den.value);
  return sumOf(termsOf(side).map((t) => {
    const { k, m } = termOf(t);
    return termExpr(k * a, m);
  }));
}

/** The side divided by a, exactly: every term's number a multiple of a, or a fraction's top; else null. */
export function divided(side: Expr, a: number): Expr | null {
  if (side.kind === "frac") {
    const top = divided(side.num, a);
    return top && (top.kind === "num" && top.value === 1 ? frac(num(1), side.den) : frac(top, side.den));
  }
  const ts = termsOf(side).map(termOf);
  if (ts.some((t) => t.k % a !== 0)) return null;
  return sumOf(ts.map((t) => termExpr(t.k / a, t.m)));
}

/** The value of a side that is a plain number (NaN if it isn't one). */
export const valueOf = (e: Expr): number => (e.kind === "num" ? e.value : e.kind === "neg" && e.arg.kind === "num" ? -e.arg.value : NaN);

// ---------- un-moves ----------

/**
 * One step back from the answer. `on` gets the state and returns it one step
 * further from solved (null: it can't be done here, the draft is dropped).
 * `need`: what the step after wants of the value side (a square under a
 * root): a step picking numbers picks ones that give it.
 */
export type UnMove = {
  /** The moves that undo it (with the arithmetic after them). */
  rules: RuleId[];
  on: (s: MathState, r: Rng, need: (v: number) => boolean) => MathState | MathState[] | null;
  /** What it wants of the value side before it (see `need`). */
  wants?: (v: number) => boolean;
  /** Not a milestone of its own (a swap: either way round is the same). */
  quiet?: boolean;
  /** It only holds where letters are positive (√(x²) = x, ln(x²) = 2ln(x)). */
  positive?: boolean;
  /** Its `rules` always undo what it makes, wherever it makes it: a walk needn't check (walk.ts; the tests still do). */
  trusted?: boolean;
  /** What kind of work undoing it is (way.ts): a draft whose steps say has its way written by the moves. */
  stage?: Stage;
};

/** Row `row` changed by f; the relation turned round when f says. */
function onRow(s: MathState, row: number, f: (l: Expr, r: Expr) => [Expr, Expr, boolean?] | null): MathState | null {
  const [l, r] = rowAt(s, row);
  if (!l || !r) return null;
  const out = f(l, r);
  if (!out) return null;
  const rel = out[2] && s.rel ? flipRel(s.rel) : s.rel;
  return { ...withRow(s, row, [out[0], out[1]]), ...(rel ? { rel } : {}) };
}

/** Working out, and fractions of numbers worked out (12/3 → (3·4)/3 → 4): what undoes a number written the long way. */
const ARITH: RuleId[] = [...WORK, ...SIMPLIFY];

/**
 * a·(side `at`), the other side times a: x = 3 → 2x = 6; x + 1 = 4 →
 * 2(x + 1) = 8; a negative a turns an inequality round.
 */
export const times = (a: number, at = 0, row = 0): UnMove => ({
  rules: ["move-factor", "move-sign", ...ARITH],
  on: (s) =>
    onRow(s, row, (L, R) => {
      const [u, v] = at === 0 ? [L, R] : [R, L];
      // The top of a fraction takes it: (3x)/2, (3(x + 1))/2.
      const body = u.kind === "frac" ? u.num : u;
      // 2·(3x) would be 6x: moving the 6 across isn't undoing the 2.
      if (a === 1 || a === 0 || termOf(body).k !== 1) return null;
      const made = u.kind === "frac" ? frac(termExpr(a, body), u.den) : termExpr(a, body);
      return at === 0 ? [made, scaled(v, a), a < 0] : [scaled(v, a), made, a < 0];
    }),
});

/**
 * (side `at`)/a, the other side divided by a: x = 12 → x/3 = 4; or, not
 * `exact`, over a too where it doesn't go: x = 7 → x/4 = 7/4.
 */
export const over = (a: number, at = 0, { row = 0, exact = true } = {}): UnMove => ({
  rules: ["move-denominator", ...ARITH],
  on: (s) =>
    onRow(s, row, (L, R) => {
      const [u, v] = at === 0 ? [L, R] : [R, L];
      const other = divided(v, a) ?? (exact ? null : frac(v, num(a)));
      if (!other || u.kind === "frac") return null;
      return at === 0 ? [frac(u, num(a)), other] : [other, frac(u, num(a))];
    }),
});

/** t added to both sides (joined to a like term where there is one): x = 3 → x + 4 = 7; 3x = 6 → 5x = 2x + 6. */
export const plus = (t: Expr, first = false, row = 0): UnMove => ({
  rules: ["move-term", ...ARITH],
  on: (s) => onRow(s, row, (L, R) => [plusTerm(L, t, first), plusTerm(R, t, first)]),
});

/** b − (side 0), and b − the other: 2x = 6 → 7 − 2x = 1 (an inequality turns round). */
export const from = (b: number, row = 0): UnMove => ({
  rules: ["move-term", "move-sign", "distribute-neg", ...ARITH],
  on: (s) =>
    onRow(s, row, (L, R) => {
      // A product keeps its bracket: 7 − 2(x + 1).
      const minusL = L.kind === "sum" ? termsOf(L).map((t) => termExpr(-termOf(t).k, termOf(t).m)) : [neg(L)];
      return [sumOf([n(b), ...minusL]), plusTerm(scaled(R, -1), n(b), true), true];
    }),
});

/** The two sides swapped (quiet: either way round is the same equation). */
export const swap = (row = 0): UnMove => ({
  rules: ["swap-sides"],
  quiet: true,
  on: (s) => onRow(s, row, (L, R) => [R, L, true]),
});

/** The part of a side at `path` (child indices: [1] is the bracket of 3(x + 1)) changed by f. */
function within(side: Expr, path: readonly number[], f: (e: Expr) => Expr | null): Expr | null {
  if (!path.length) return f(side);
  const cs = children(side);
  if (path[0] >= cs.length) return null;
  const inner = within(cs[path[0]], path.slice(1), f);
  if (!inner) return null;
  const out = cs.slice();
  out[path[0]] = inner;
  return withChildren(side, out);
}

/** Side `at` (or the part of it at `path`) changed by f. */
const onSide = (at: number, path: readonly number[], f: (e: Expr) => Expr | null, row = 0) => (s: MathState) =>
  onRow(s, row, (L, R) => {
    const made = within(at === 0 ? L : R, path, f);
    return made && (at === 0 ? [made, R] : [L, made]);
  });

/**
 * Terms `first`…`first + count − 1` of side `at` (all of it by default; or of
 * the sum at `path` in it) put in a bracket with g in front: 2x + 6 → 2(x + 3);
 * −3x − 6 → −3(x + 2); −x − 2 → −(x + 2). Every term's number must be a
 * multiple of g.
 */
export const bracket = (g: number, at = 0, { first = 0, count = Infinity, path = [] as number[], row = 0 } = {}): UnMove => ({
  rules: ["distribute", "distribute-neg", ...ARITH],
  on: onSide(
    at,
    path,
    (e) => {
      const ts = termsOf(e);
      const group = ts.slice(first, first + count);
      if (group.length < 2 || g === 1) return null;
      const inside = divided(sumOf(group), g);
      if (!inside) return null;
      const made = g === -1 ? neg(inside) : termExpr(g, inside);
      return sumOf([...ts.slice(0, first), made, ...ts.slice(first + group.length)]);
    },
    row,
  ),
});

/** The like terms of each kind, added up (for telling two ways of writing a sum apart). */
const totals = (e: Expr) => {
  let back: Expr = num(0);
  for (const t of termsOf(e)) back = plusTerm(back, t);
  return termsOf(back).map(termOf).filter((t) => t.k !== 0).map((t) => `${t.k}·${t.m ? key(t.m) : ""}`).sort().join(" ");
};

/**
 * Side `at` (or the sum at `path` in it) written as these terms instead,
 * which add up to the same: 2x + 1 → 5x + 3 − 3x − 2.
 */
export const spread = (terms: Expr[], at = 0, { path = [] as number[], row = 0 } = {}): UnMove => ({
  rules: ["combine"],
  on: onSide(at, path, (e) => (totals(sumOf(terms)) === totals(e) && terms.length > termsOf(e).length ? sumOf(terms) : null), row),
});

/**
 * The letter on both sides: x = 3 becomes lk·x + l0 = rk·x + r0 (in that
 * order; l0 and r0 numbers, or terms of other letters in a formula), by way
 * of (lk − rk)x = (lk − rk)·3 — the letters gathered where there are more of
 * them. Null if 3 isn't what it solves to.
 */
export const both = (left: Expr, right: Expr, row = 0): UnMove => ({
  rules: ["move-term", "move-factor", ...ARITH],
  on: (s) => {
    const [X, V] = rowAt(s, row);
    if (X?.kind !== "var") return null;
    const xk = (e: Expr) => termsOf(e).map(termOf).filter((t) => t.m && key(t.m) === key(X)).reduce((a, t) => a + t.k, 0);
    const rest = (e: Expr) => sumOf(termsOf(e).filter((t) => !(termOf(t).m && key(termOf(t).m!) === key(X))));
    const K = xk(left) - xk(right);
    // r0 − l0 = K·V: the letter's value solves it.
    let diff = rest(right);
    for (const t of termsOf(rest(left))) diff = plusTerm(diff, termExpr(-termOf(t).k, termOf(t).m));
    if (K === 0 || totals(diff) !== totals(scaled(V, K))) return null;
    const gathered = onRow(s, row, () => [termExpr(Math.abs(K), X), scaled(V, Math.abs(K))]);
    const written = onRow(s, row, () => [left, right, K < 0]);
    return Math.abs(K) === 1 ? [written!] : [gathered!, written!];
  },
});

/**
 * a·(side 0) + b, its numbers picked so the value side gives what the next
 * step needs; now and then b − a·(side 0) instead (turning an inequality
 * round). Its milestones: a·u, then the + b.
 */
export const lin = (minusOdds = 0.15, row = 0): UnMove => ({
  rules: [...new Set([...times(2).rules, ...plus(num(1)).rules, ...from(1).rules])],
  on: (s, r, need) => {
    const [L, R] = rowAt(s, row);
    for (let t = 0; t < 30; t++) {
      const a = r.next() < 0.3 ? 1 : r.int(2, 5);
      const b = r.int(-9, 9);
      const minus = r.next() < minusOdds && b > 0;
      const w = minus ? b - a * valueOf(R) : a * valueOf(R) + b;
      if ((a === 1 && b === 0) || !need(w) || Math.abs(w) > 60) continue;
      // (6x)/3 reads as a trick.
      if (a !== 1 && L.kind === "frac" && L.den.kind === "num" && (L.den.value % a === 0 || a % L.den.value === 0)) continue;
      const scaledUp = a === 1 ? s : times(a, 0, row).on(s, r, need);
      if (!scaledUp || Array.isArray(scaledUp)) continue;
      const shifted = minus ? from(b, row).on(scaledUp, r, need) : b === 0 ? null : plus(n(b), false, row).on(scaledUp, r, need);
      const out = [scaledUp, shifted].filter((x): x is MathState => !!x && !Array.isArray(x) && x !== s);
      if (out.length) return out;
    }
    return null;
  },
});

/** (side 0)/a, a picked so the value side, divided by it, gives what the next step needs. */
export const overSome = (row = 0): UnMove => ({
  rules: over(2).rules,
  wants: (v) => v !== 0 && Math.abs(v) <= 60 && [2, 3, 4, 5].some((a) => v % a === 0 && v !== a),
  on: (s, r, need) => {
    const [L, R] = rowAt(s, row);
    const as = [2, 3, 4, 5].filter((a) => valueOf(R) % a === 0 && need(valueOf(R) / a));
    if (!as.length || L.kind === "frac" || (L.kind === "prod" && L.factors[0].kind === "num")) return null;
    return over(as[r.int(0, as.length - 1)], 0, { row }).on(s, r, need);
  },
});

/** x on both sides: k·x + … = R becomes (k + c)·x + … = c·x + R (only where the side has an x term of its own). */
export const xBoth = (x: string, row = 0): UnMove => ({
  rules: plus(num(1)).rules,
  on: (s, r) => {
    const X = variable(x);
    const [L] = rowAt(s, row);
    if (L.kind !== "sum" || !termsOf(L).some((t) => termOf(t).m && key(termOf(t).m!) === key(X))) return null;
    return plus(termExpr(r.int(1, 4), X), r.next() < 0.5, row).on(s, r, () => true);
  },
});

// ---------- several rows: simultaneous equations ----------

/** What the rows that give a letter a number say (x = 3; y = 2 → {x: 3, y: 2}). */
function known(s: MathState): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [l, r] of rows(s)) {
    const v = valueOf(r);
    if (l.kind === "var" && Number.isFinite(v)) out[l.name] = v;
  }
  return out;
}

/**
 * Row `row`'s value written with another letter in it, as much as it is at
 * the answer: y = 7 → y = 2x + 1 (where x = 3). Undone by putting the answer
 * in and working it out.
 */
export const valueIn = (e: Expr, row: number): UnMove => ({
  rules: ["substitute", ...ARITH],
  on: (s) => {
    const env = known(s);
    try {
      return Math.abs(evaluate(e, env) - valueOf(rowAt(s, row)[1])) < 1e-9 ? onRow(s, row, (L) => [L, e]) : null;
    } catch {
      return null;
    }
  },
});

/**
 * Row `def` says y = F; k of F in row `row` become k·y: 5x − 1 = 9 → 3x + y = 9
 * (k = 1, y = 2x − 1), by way of 3x + 2x − 1 = 9 (what substituting gives).
 * The y goes in after the first term (or first, `first`).
 */
export const unsubstitute = (row: number, def: number, k: number, first = false): UnMove => ({
  rules: ["substitute", "distribute", "distribute-neg", ...ARITH],
  on: (s) => {
    const [Y, F] = rowAt(s, def);
    const [L] = rowAt(s, row);
    if (Y?.kind !== "var" || !L || k === 0) return null;
    let rest = L;
    for (const t of termsOf(F)) rest = plusTerm(rest, termExpr(-k * termOf(t).k, termOf(t).m));
    const at = first ? 0 : Math.min(1, termsOf(rest).length);
    const put = (made: Expr[]) => {
      const ts = termsOf(rest).filter((t) => !(t.kind === "num" && t.value === 0));
      return sumOf([...ts.slice(0, at), ...made, ...ts.slice(at)]);
    };
    // What substituting gives: F's terms, or k(F) (a number worked out: 3·2 is 6, and 3·1 is never written).
    const substituted = put(k === 1 ? termsOf(F) : Number.isFinite(valueOf(F)) ? [n(k * valueOf(F))] : [k === -1 ? neg(F) : termExpr(k, F)]);
    const withY = put([termExpr(k, Y)]);
    const replace = (e: Expr) => onRow(s, row, (_, R) => [e, R]);
    return [replace(substituted)!, replace(withY)!];
  },
});

/** Two rows swapped round (quiet: rows are in no order). */
export const swapRows = (a = 0, b = 1): UnMove => ({
  rules: [],
  quiet: true,
  on: (s) => {
    const rs = rows(s);
    [rs[a], rs[b]] = [rs[b], rs[a]];
    return withRows(s, rs);
  },
});

// ---------- functions around the letter's side: roots, squares, logs, powers ----------

const isSquare = (v: number) => v > 0 && Number.isInteger(Math.sqrt(v));
const isCube = (v: number) => v > 0 && Math.round(Math.cbrt(v)) ** 3 === v;
/** k with bᵏ = v (k ≥ 1), else null. */
export function logOf(b: number, v: number): number | null {
  for (let k = 1, p = b; p <= v; k++, p *= b) if (p === v) return k;
  return null;
}
const LOG_BASES = [2, 3, 10];
const EXP_MAX: Record<number, number> = { 2: 5, 3: 3, 10: 2 };

/** Positive for every positive letter, at a glance: no minus anywhere, no log. */
export const plainlyPositive = (e: Expr): boolean => allNodes(e).every((k) => k.kind !== "neg" && k.kind !== "log");

/** Side 0 under a root (k = 2: √, 3: ∛); the value side its root. An inequality's side must be positive. */
export const rootOf = (k: 2 | 3, row = 0): UnMove => ({
  rules: ["root-across", "evaluate-power", "root-notation"],
  positive: true,
  wants: (v) => (k === 2 ? isSquare(v) : isCube(v)) && v > 1,
  on: (s, _r, need) =>
    onRow(s, row, (L, R) => {
      const v = Math.round(k === 2 ? Math.sqrt(valueOf(R)) : Math.cbrt(valueOf(R)));
      if (!(v > 1) || v ** k !== valueOf(R) || !need(v)) return null;
      if (s.rel && s.rel !== "=" && k === 2 && !plainlyPositive(L)) return null;
      return [root(L, k), num(v)];
    }),
});

/** Side 0 squared, the value side too. */
export const squareOf = (row = 0): UnMove => ({
  rules: ["root-across", "power-of-power", "evaluate-power", "root-notation"],
  positive: true,
  wants: (v) => v >= 2 && v <= 9,
  on: (s, _r, need) =>
    onRow(s, row, (L, R) => {
      const v = valueOf(R);
      if (!(v >= 2 && v <= 9) || !plainlyPositive(L) || !need(v * v)) return null;
      return [pow(L, num(2)), num(v * v)];
    }),
});

/** log_b of side 0, the value side its log (a power of b). */
export const logOfSide = (row = 0): UnMove => ({
  rules: ["log-across", "power-of-base", "evaluate-power", "evaluate-log"],
  positive: true,
  wants: (v) => v > 1 && LOG_BASES.some((b) => (logOf(b, v) ?? 0) >= 2),
  on: (s, r, need) =>
    onRow(s, row, (L, R) => {
      const v = valueOf(R);
      if (s.rel && s.rel !== "=" && !plainlyPositive(L)) return null;
      const bs = LOG_BASES.filter((b) => (logOf(b, v) ?? 0) >= 2 && need(logOf(b, v)!));
      if (!bs.length) return null;
      const b = bs[r.int(0, bs.length - 1)];
      return [log(num(b), L), num(logOf(b, v)!)];
    }),
});

/** b to the power side 0, the value side bᵛ. */
export const expOfSide = (row = 0): UnMove => ({
  rules: ["exp-across", "evaluate-log", "power-of-base", "log-of-power", "evaluate-power"],
  positive: true,
  wants: (v) => v >= 2 && v <= 5,
  on: (s, r, need) =>
    onRow(s, row, (L, R) => {
      const v = valueOf(R);
      const bs = LOG_BASES.filter((b) => v >= 2 && v <= EXP_MAX[b] && need(b ** v));
      if (!bs.length) return null;
      const b = bs[r.int(0, bs.length - 1)];
      return [pow(num(b), L), num(b ** v)];
    }),
});

/**
 * Side `at` (or the part of it at `path`) written another way, equal to it
 * for every value of the letters (a teacher's form of what the moves `rules`
 * make of it: ln(x³) − ln(x) for 2ln(x), (x² + 3x)/x for x + 3).
 */
export const writeAs = (rules: RuleId[], e: Expr | ((side: Expr) => Expr | null), at = 0, { path = [] as number[], row = 0 } = {}): UnMove => ({
  rules: [...rules, ...ARITH],
  on: onSide(
    at,
    path,
    (side) => {
      const made = typeof e === "function" ? e(side) : e;
      return made && !differ(made, side) ? made : null;
    },
    row,
  ),
});

/**
 * Row `row` written as these two sides instead, the same equation (one a
 * multiple of the other: (x + 2)/3 − (x + 1)/2 = a for 2(x + 2) − 3(x + 1) = 6a).
 */
export const restate = (rules: RuleId[], left: Expr, right: Expr, row = 0): UnMove => ({
  rules: [...rules, ...ARITH],
  on: (s) =>
    onRow(s, row, (L, R) => {
      const res = (a: Expr, b: Expr, env: Record<string, number>) => evaluate(a, env) - evaluate(b, env);
      const ratios = envs([L, R, left, right]).map((env) => res(L, R, env) / res(left, right, env));
      return ratios.every((q) => Number.isFinite(q) && Math.abs(q - ratios[0]) < 1e-9 && q !== 0) ? [left, right] : null;
    }),
});

/** k with bᵏ = v for a side that is a number (b a number) or e to a power (b e), else null. */
function exponentOf(b: Expr, v: Expr): Expr | null {
  if (b.kind === "const") return v.kind === "pow" && v.base.kind === "const" ? v.exp : null;
  if (b.kind !== "num") return null;
  const k = logOf(b.value, valueOf(v));
  return k === null ? null : num(k);
}

/** log_b of both sides: x = 8 → log₂(x) = 3; x = e³ → ln(x) = 3. */
export const logBoth = (b: number | "e", row = 0): UnMove => ({
  rules: ["log-across", "exp-across", "power-of-base", "evaluate-power", "evaluate-log"],
  positive: true,
  on: (s) =>
    onRow(s, row, (L, R) => {
      const base = b === "e" ? econst() : num(b);
      const k = exponentOf(base, R);
      return k && [log(base, L), k];
    }),
});

/** b to the power of both sides: x = 2 → 3ˣ = 9; 2x = ln(5) → e^(2x) = 5. */
export const expBoth = (b: number | "e", row = 0): UnMove => ({
  rules: ["exp-across", "log-across", "exp-of-log", "evaluate-log", "power-of-base", "log-of-power", "evaluate-power"],
  positive: true,
  on: (s) =>
    onRow(s, row, (L, R) => {
      if (b === "e") return R.kind === "log" && R.base.kind === "const" ? [pow(econst(), L), R.arg] : Number.isFinite(valueOf(R)) ? [pow(econst(), L), pow(econst(), R)] : null;
      return Number.isFinite(valueOf(R)) && valueOf(R) >= 1 && b ** valueOf(R) <= 60 ? [pow(num(b), L), num(b ** valueOf(R))] : null;
    }),
});

// ---------- disguises: a piece written the long way, undone by one or two moves ----------

/** `rule` undoes it (and `then`, when it takes a second move: √25 → 25^(1/2) → 5). */
type Disguise = { rule: RuleId; then?: RuleId; on: (e: Expr, parent: Expr | null, r: Rng) => Expr | null };

const factorPairs = (v: number) => [2, 3, 4, 5, 6].filter((p) => v % p === 0 && v / p >= 2);
const pickOf = <T,>(r: Rng, xs: readonly T[]): T => xs[r.int(0, xs.length - 1)];

const DISGUISES: Disguise[] = [
  // 6 → 2·3
  { rule: "multiply-numbers", on: (e, parent, r) => (e.kind === "num" && parent?.kind !== "prod" && factorPairs(e.value).length ? ((p) => prod([num(p), num(e.value / p)]))(pickOf(r, factorPairs(e.value))) : null) },
  // 7 → 3 + 4 (where a sum needs no brackets)
  { rule: "combine", on: (e, parent, r) => (e.kind === "num" && e.value >= 3 && (parent === null || parent.kind === "sum") ? ((p) => sum([num(p), num(e.value - p)]))(r.int(1, e.value - 1)) : null) },
  // 4 → 12/3 (on its own, not inside a sum: x − 10/2 reads as a trick); undone by splitting 12 → 3·4 and cancelling the 3s
  { rule: "split-number", then: "cancel-factor", on: (e, parent, r) => (e.kind === "num" && e.value >= 2 && e.value <= 10 && parent === null ? ((k) => frac(num(e.value * k), num(k)))(r.int(2, 3)) : null) },
  // 5 → √25 (tapped, 25^(1/2); its ½ dropped on the 25)
  { rule: "root-notation", then: "evaluate-power", on: (e, parent) => (e.kind === "num" && e.value >= 2 && e.value <= 6 && parent?.kind !== "pow" && parent?.kind !== "prod" ? root(num(e.value * e.value)) : null) },
  // 3 → log₂ 8
  {
    rule: "power-of-base",
    on: (e, parent, r) => {
      if (e.kind !== "num" || e.value < 2 || parent?.kind === "log" || parent?.kind === "pow" || parent?.kind === "prod") return null;
      const bs = [2, 3].filter((b) => b ** e.value <= 32);
      return bs.length ? ((b) => log(num(b), num(b ** e.value)))(pickOf(r, bs)) : null;
    },
  },
  // 8 → 2³
  {
    rule: "evaluate-power",
    on: (e, parent) => {
      if (e.kind !== "num" || parent?.kind === "pow" || parent?.kind === "log" || parent?.kind === "prod") return null;
      const ps = ([[2, 2], [2, 3], [3, 2], [2, 4], [5, 2], [3, 3], [2, 5]] as const).filter(([b, k]) => b ** k === e.value);
      return ps.length ? pow(num(ps[0][0]), num(ps[0][1])) : null;
    },
  },
  // 5x → 3x + 2x (a term of a sum; 2x as x + x reads as a trick)
  {
    rule: "combine",
    on: (e, parent, r) => {
      const { k, m } = termOf(e);
      if (parent?.kind !== "sum" || k < 3 || !m || !(m.kind === "var" || (m.kind === "pow" && m.base.kind === "var" && !m.radical))) return null;
      const p = r.int(1, k - 1);
      return sum([termExpr(p, m), termExpr(k - p, m)]);
    },
  },
  // 3·log₂(u) → log₂(u³), only of something positive
  { rule: "log-of-power", on: (e) => (e.kind === "prod" && e.factors.length === 2 && e.factors[0].kind === "num" && e.factors[1].kind === "log" && e.factors[0].value <= 4 && plainlyPositive(e.factors[1].arg) ? log(e.factors[1].base, pow(e.factors[1].arg, e.factors[0])) : null) },
  // 2^(u + 3) → 2^u·2³
  {
    rule: "merge-powers",
    on: (e) => {
      if (e.kind !== "pow" || e.base.kind !== "num" || e.exp.kind !== "sum") return null;
      const c = e.exp.terms.find((t) => t.kind === "num");
      if (!c) return null;
      const rest = e.exp.terms.filter((t) => t !== c);
      return prod([pow(e.base, sumOf(rest)), pow(num(e.base.value), c)]);
    },
  },
  // 3√u → √(9u)
  {
    rule: "pull-out-of-power",
    on: (e) => {
      if (e.kind !== "prod" || e.factors.length !== 2 || e.factors[0].kind !== "num" || e.factors[0].value > 4) return null;
      const w = e.factors[1];
      if (!(w.kind === "pow" && w.radical && w.exp.kind === "frac" && w.exp.den.kind === "num" && w.exp.den.value === 2)) return null;
      const a = e.factors[0].value;
      return root(w.base.kind === "sum" ? prod([num(a * a), w.base]) : termExpr(a * a * termOf(w.base).k, termOf(w.base).m));
    },
  },
];

/**
 * One piece of the state written the long way, with a move the chapter has
 * (`rules`); not inside what an earlier disguise (sharing `done`) wrote.
 * Where nothing can be, the state stays as it is.
 */
export const disguise = (rules: ReadonlySet<RuleId>, done: Set<string> = new Set(), row?: number): UnMove => {
  const ds = DISGUISES.filter((d) => rules.has(d.rule));
  return {
    rules: [...new Set(ds.flatMap((d) => [d.rule, ...(d.then ? [d.then] : [])])), ...ARITH],
    on: (s, r) => {
      const spots: { side: number; e: Expr; d: Disguise; parent: Expr | null }[] = [];
      s.sides.forEach((side, i) => {
        if (row !== undefined && rowOf(i) !== row) return;
        // Not a log's base, a root's or a square's exponent, nor the base of 2ˣ.
        const visit = (e: Expr, parent: Expr | null) => {
          if (done.has(key(e, "exact") + "@" + i)) return;
          for (const d of ds) spots.push({ side: i, e, d, parent });
          const keep = (c: Expr) => (e.kind === "log" && c === e.base) || (e.kind === "pow" && (e.base.kind === "num" ? c === e.base : c === e.exp));
          for (const c of children(e)) if (!keep(c)) visit(c, e);
        };
        visit(side, null);
      });
      for (let t = 0; t < 20 && spots.length; t++) {
        const spot = spots.splice(r.int(0, spots.length - 1), 1)[0];
        const made = spot.d.on(spot.e, spot.parent, r);
        if (!made) continue;
        const sides = s.sides.slice();
        sides[spot.side] = mapTree(sides[spot.side], (e) => (e.id === spot.e.id ? made : e));
        for (const e of allNodes(made)) done.add(key(e, "exact") + "@" + spot.side);
        return { ...s, sides };
      }
      // Nothing to disguise: it stays as it is.
      return s;
    },
  };
};

// ---------- building ----------

/** The answer: `x = 3`, `x ≥ 3`, or a letter's value as a tree (x = 2a). */
export function solved(x: string, value: number | Expr, rel: Rel = "="): MathState {
  return { sides: [variable(x), typeof value === "number" ? n(value) : value], ...(rel !== "=" ? { rel } : {}) };
}

// ---------- several answers: rows joined by "or" ----------

/** The answers' rows: [letter, value] for each `x = v` (null if a row isn't one). */
function answerRows(s: MathState): Row[] | null {
  return s.join === "or" && rows(s).length >= 2 ? rows(s) : null;
}

/** One row, the "or" gone: the state written as `left = right`. */
const oneRow = (s: MathState, left: Expr, right: Expr): MathState => {
  const { join: _j, ...rest } = s;
  void _j;
  return withRows(rest, [[left, right]]);
};

/** A number as p/q (q > 0), if it's a whole number or a fraction of two. */
function ratio(e: Expr): [number, number] | null {
  const v = valueOf(e);
  if (Number.isInteger(v)) return [v, 1];
  const signed = e.kind === "neg" ? e.arg : e;
  const s = e.kind === "neg" ? -1 : 1;
  if (signed.kind === "frac" && signed.num.kind === "num" && signed.den.kind === "num") return [s * signed.num.value, signed.den.value];
  return null;
}

/**
 * x = 3 or x = −2/3 → (x − 3)(3x + 2) = 0: a product is 0 when one of its
 * factors is (each factor q·x − p for an answer p/q; x itself for 0).
 * Undone by pulling a factor off the product, then solving each row.
 */
export const productIsZero = (): UnMove => ({
  rules: ["zero-product", "move-term", "move-factor", ...ARITH],
  on: (s) => {
    const rows = answerRows(s);
    if (!rows || rows.some(([l]) => l.kind !== "var" || key(l) !== key(rows[0][0]))) return null;
    const x = rows[0][0];
    const fs: Expr[] = [];
    for (const [, v] of rows) {
      const pq = ratio(v);
      if (!pq) return null;
      const [p, q] = pq;
      fs.push(p === 0 ? variable((x as { name: string }).name) : sumOf([termExpr(q, variable((x as { name: string }).name)), n(-p)]));
    }
    return oneRow(s, prod(fs), num(0));
  },
});

/** v² written as a number: 9 for 3, 4/9 for 2/3, 5 for √5 (null if it isn't one of those). */
function squared(v: Expr): Expr | null {
  const b = v.kind === "neg" ? v.arg : v;
  if (b.kind === "num") return num(b.value * b.value);
  if (b.kind === "frac" && b.num.kind === "num" && b.den.kind === "num") return frac(num(b.num.value ** 2), num(b.den.value ** 2));
  if (b.kind === "pow" && b.exp.kind === "frac" && b.exp.num.kind === "num" && b.exp.num.value === 1 && b.exp.den.kind === "num" && b.exp.den.value === 2 && b.base.kind === "num") return num(b.base.value);
  return null;
}

/**
 * A = v or A = −v → A² = v² (x = 3 or x = −3 → x² = 9; 2x + 1 = 5 or
 * 2x + 1 = −5 → (2x + 1)² = 25). Undone by taking the root of both sides
 * (an even power has two roots).
 */
export const squaredRows = (): UnMove => ({
  rules: ["root-across", "evaluate-power", "split-square", ...ARITH],
  on: (s) => {
    const rows = answerRows(s);
    if (!rows || rows.length !== 2) return null;
    const [[a, v], [b, w]] = rows;
    if (key(a) !== key(b) || differ(v, neg(w))) return null;
    const v2 = squared(v);
    return v2 && oneRow(s, pow(a, num(2)), v2);
  },
});

/**
 * Each answer row x = v written as E = E(v), for a·x + b (x = 2 or x = −3 →
 * 2x + 1 = 5 or 2x + 1 = −5). Undone by solving each row.
 */
export const rowsAs = (E: Expr): UnMove => ({
  rules: ["move-term", "move-factor", ...ARITH],
  on: (s) => {
    const rows = answerRows(s);
    if (!rows) return null;
    const made: Row[] = [];
    for (const [x, v] of rows) {
      if (x.kind !== "var") return null;
      const at = evaluate(E, { [x.name]: evaluate(v, {}) });
      if (!Number.isInteger(at)) return null;
      made.push([E, n(at)]);
    }
    return withRows(s, made);
  },
});

/**
 * L = B² → √L = B: the root of both sides, where B isn't negative (a
 * condition the exercise then gives: see domain.ts). Undone by carrying the
 * root across (squaring both sides).
 */
export const rootBoth = (row = 0): UnMove => ({
  rules: ["root-notation", "root-across", "power-of-power", "evaluate-power", ...ARITH],
  on: (s) =>
    onRow(s, row, (L, R) => {
      if (R.kind !== "pow" || R.exp.kind !== "num" || R.exp.value !== 2) return null;
      return [root(L, 2), R.base];
    }),
});

/**
 * L = 0 → L/B = 0 (where B isn't 0: a condition the exercise then gives).
 * Undone by multiplying both sides by B (0 times anything is 0).
 */
export const overBottom = (B: Expr, row = 0): UnMove => ({
  rules: ["move-denominator", "move-letter-denominator", "multiply-numbers", "times-one", ...ARITH],
  on: (s) =>
    onRow(s, row, (L, R) => {
      if (valueOf(R) !== 0) return null;
      return [frac(L, B), R];
    }),
});
