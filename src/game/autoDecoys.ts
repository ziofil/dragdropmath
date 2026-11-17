/**
 * Wrong answers made automatically, for exercises that don't come with their
 * own (a teacher's set without `wrong:`). Each is a classic slip applied to
 * the right answer: an inequality sign not turned round, a term's sign
 * flipped, a number doubled or halved, a fraction upside down, a term left
 * out, an exponent off by one, the whole answer doubled or squared. Hand-written ones are better (they come from
 * the exercise's own pitfalls); these are a fallback, checked like them.
 */
import type { Expr, MathState } from "../expr/types";
import { flipRel, frac, neg, negate, normalize, num, pow, prod } from "../expr/build";
import { evaluate, isConstant, variables } from "../expr/eval";
import { rng, shuffled } from "./generate/write";
import { children, withChildren } from "../expr/tree";
import { printState } from "../expr/key";
import { follows, isWrong, shapeMismatch } from "./answers";
import { rowsOf, withRow } from "../expr/rows";
import { breaks } from "../expr/conditions";

/** `e` with the node `id` replaced. */
function replace(e: Expr, id: string, by: Expr): Expr {
  if (e.id === id) return by;
  const cs = children(e);
  if (!cs.length) return e;
  const next = cs.map((c) => replace(c, id, by));
  return next.every((c, i) => c === cs[i]) ? e : withChildren(e, next);
}

const nodes = (e: Expr): Expr[] => [e, ...children(e).flatMap(nodes)];

/** Slips on one expression, by kind. */
function slips(e: Expr): Record<string, Expr[]> {
  const out: Record<string, Expr[]> = { sign: [], number: [], flip: [], drop: [], power: [], whole: [] };
  // The whole answer doubled (2x taken as x): only where that reads as an answer (2x³, not 2(x + 1)).
  if (e.kind === "var" || e.kind === "pow" || (e.kind === "prod" && !e.factors.some((f) => f.kind === "num"))) out.whole.push(prod([num(2), e]));
  // A sign slip: one term's sign (or the whole thing's).
  if (e.kind === "sum") e.terms.forEach((t) => out.sign.push(replace(e, t.id, negate(t))));
  else if (!(e.kind === "num" && e.value === 0)) out.sign.push(negate(e));
  for (const n of nodes(e)) {
    // A number doubled (forgot to halve) or halved.
    if (n.kind === "num" && n.value > 1) {
      out.number.push(replace(e, n.id, num(n.value * 2)));
      if (n.value % 2 === 0) out.number.push(replace(e, n.id, num(n.value / 2)));
    }
    // A fraction upside down.
    if (n.kind === "frac") out.flip.push(replace(e, n.id, { ...n, num: n.den, den: n.num }));
    // An exponent off by one (adding where it should multiply, …).
    if (n.kind === "pow" && n.exp.kind === "num" && !n.radical) out.power.push(replace(e, n.id, pow(n.base, num(n.exp.value + 1), n.id)));
  }
  // A term left out.
  if (e.kind === "sum") e.terms.forEach((t) => out.drop.push(replace(e, e.id, { ...e, terms: e.terms.filter((u) => u !== t) })));
  return out;
}

const KINDS = ["relation", "moved", "sign", "number", "flip", "drop", "power", "whole"];
/** Slips that make a less convincing answer (a term gone, the whole thing doubled): tried after the rest. */
const LAST = ["drop", "whole"];

/** A number as an answer is written: 3, −2, 3/4, −5/2. */
function numberExpr(v: number): Expr | null {
  for (const q of [1, 2, 3, 4, 5]) {
    const p = Math.round(v * q);
    if (Math.abs(p / q - v) > 1e-9 || gcd(p, q) !== 1 || Math.abs(p) > 200) continue;
    const a = q === 1 ? num(Math.abs(p)) : frac(num(Math.abs(p)), num(q));
    return p < 0 ? neg(a) : a;
  }
  return null;
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/**
 * Slips made on the way, not on the answer, for one equation (or inequality)
 * whose answer gives its one letter a number: a term carried across without
 * changing its sign, a number that multiplies a side used to multiply the
 * other side instead of dividing it. Each slipped equation is solved (by
 * trying the numbers an answer could be), and its answer is the wrong one.
 */
export function movedSlips(start: MathState, goal: MathState): MathState[] {
  if (start.sides.length !== 2 || goal.sides.length !== 2 || goal.sides[0].kind !== "var") return [];
  const letter = goal.sides[0].name;
  if (!isConstant(goal.sides[1]) || start.sides.some((e) => variables(e).some((v) => v !== letter))) return [];
  const right = evaluate(goal.sides[1], {});
  const slipped: Expr[][] = [];
  start.sides.forEach((side, k) => {
    const other = start.sides[1 - k];
    const put = (e: Expr) => slipped.push(k === 0 ? [e, other] : [other, e]);
    // A term carried across with its sign kept.
    if (side.kind === "sum") side.terms.forEach((t) => put({ ...side, terms: side.terms.map((u) => (u === t ? negate(t) : u)) }));
    // A number multiplying the whole side taken over as a multiplier (or a divisor as a divisor).
    if (side.kind === "prod") side.factors.forEach((f) => f.kind === "num" && f.value > 1 && put({ ...side, factors: side.factors.map((g) => (g === f ? frac(num(1), f) : g)) }));
    if (side.kind === "frac" && side.den.kind === "num" && side.den.value > 1) put(prod([side.num, side.den]));
  });
  const tries: number[] = [];
  for (let n = -60; n <= 60; n++) for (const q of [1, 2, 3, 4, 5]) tries.push(n / q);
  const out: MathState[] = [];
  for (const [l, r] of slipped) {
    const off = (x: number) => evaluate(l, { [letter]: x }) - evaluate(r, { [letter]: x });
    const root = tries.find((x) => Math.abs(x - right) > 1e-9 && Math.abs(off(x)) < 1e-9);
    const e = root === undefined ? null : numberExpr(root);
    if (e) out.push({ ...goal, sides: [goal.sides[0], e] });
  }
  return out;
}

/** A number written as one (3, 3/4), not a surd or a constant: two of them multiplied is a sum left unworked. */
const plainNumber = (e: Expr): boolean => e.kind === "num" || (e.kind === "frac" && e.num.kind === "num" && e.den.kind === "num");

/** Written as no answer is: 18/8, 10/2, 2·3x (a right answer is always simplified, so these give themselves away). */
export function unsimplified(s: MathState): boolean {
  return s.sides.some((side) =>
    nodes(side).some(
      (n) =>
        (n.kind === "frac" && n.num.kind === "num" && n.den.kind === "num" && (n.den.value === 1 || gcd(n.num.value, n.den.value) > 1)) ||
        (n.kind === "prod" && n.factors.filter(plainNumber).length > 1),
    ),
  );
}

/** Every slip of every kind on an answer, by kind. */
function candidates(start: MathState, goal: MathState): Map<string, MathState[]> {
  const rows = rowsOf(goal);
  const byKind = new Map<string, MathState[]>(KINDS.map((k) => [k, []]));
  if (rows.length === 1) byKind.get("moved")!.push(...movedSlips(start, goal));
  rows.forEach((row, r) => {
    const inRow = (next: MathState): MathState => (rows.length === 1 ? next : withRow(goal, r, [next.sides[0], next.sides[1]]));
    // An inequality not turned round.
    if (row.sides.length === 2 && (row.rel ?? "=") !== "=") byKind.get("relation")!.push(inRow({ ...row, rel: flipRel(row.rel!) }));
    // The answer part: what the letter is said to be, or the whole expression.
    const at = row.sides.length === 1 ? 0 : 1;
    for (const [kind, es] of Object.entries(slips(row.sides[at]))) {
      for (const e of es) {
        const sides = row.sides.slice();
        sides[at] = normalize(e);
        byKind.get(kind)!.push(inRow({ ...row, sides }));
      }
    }
  });
  return byKind;
}

/** A stable number for an exercise, so it gets the same wrong answers every visit. */
const hash = (text: string) => [...text].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7);

/**
 * Two wrong answers for an exercise, from different kinds of slip where it
 * can: printed so they parse back. Fewer than two if no slip gives a
 * convincing one (then the exercise is solved without guessing).
 *
 * Which slips, and how they relate, is drawn at random (seeded by the
 * exercise): two slips on the right answer, or one slip and then a second
 * slip on top of it. So the right answer isn't the card in the middle of the
 * other two, nor any other card a player could spot without the maths.
 */
export function autoDecoys(start: MathState, goal: MathState): string[] {
  const goalPrint = printState(goal);
  const r = rng(hash(`${printState(start)}|${goalPrint}`));
  // A wrong answer the conditions would rule out gives the right one away: every one satisfies them.
  const allowed = (c: MathState) => !start.conditions?.length || rowsOf(c).every((_, k) => !breaks({ ...c, conditions: start.conditions }, k));
  const ok = (c: MathState) => shapeMismatch(goal, c) === null && !unsimplified(c) && isWrong(goal, c) && !follows(start, c) && printState(c) !== goalPrint && allowed(c);
  /** The first good one (and `fits`), kinds and slips in a random order, of a kind not in `not`. */
  const first = (byKind: Map<string, MathState[]>, not: string[], taken: string[], fits: (c: MathState) => boolean = () => true): { kind: string; state: MathState } | null => {
    const kinds = KINDS.filter((k) => !not.includes(k));
    for (const kind of [...shuffled(r, kinds.filter((k) => !LAST.includes(k))), ...shuffled(r, kinds.filter((k) => LAST.includes(k)))]) {
      for (const c of shuffled(r, byKind.get(kind)!)) {
        if (!taken.includes(printState(c)) && fits(c) && ok(c)) return { kind, state: c };
      }
    }
    return null;
  };
  const byKind = candidates(start, goal);
  const one = first(byKind, [], []);
  if (!one) return [];
  const p1 = printState(one.state);
  // Where the answer is a number, the right one is the middle value only a third of the time: else both wrong ones on one side of it.
  const right = valueOf(goal);
  const d1 = valueOf(one.state);
  const between = r.next() < 1 / 3;
  const side = (c: MathState) => {
    const d2 = valueOf(c);
    if (right === null || d1 === null || d2 === null) return true;
    return between === (Math.sign(d2 - right) !== Math.sign(d1 - right));
  };
  // Two thirds of the time, the second is a slip on top of the first (then the first is the card in the middle).
  const chained = () => {
    const on = candidates(start, one.state);
    return first(on, [one.kind, "moved"], [p1], side) ?? first(on, ["moved"], [p1], side);
  };
  const apart = (fits = side) => first(byKind, [one.kind], [p1], fits) ?? first(byKind, [], [p1], fits);
  const two = (r.next() < 2 / 3 ? (chained() ?? apart()) : (apart() ?? chained())) ?? apart(() => true);
  return two ? [p1, printState(two.state)] : [p1];
}

/** The number an answer gives its one letter (x = −3/2), if that's what it is. */
function valueOf(s: MathState): number | null {
  if (s.sides.length !== 2 || s.sides[0].kind !== "var" || !isConstant(s.sides[1])) return null;
  const v = evaluate(s.sides[1], {});
  return Number.isFinite(v) ? v : null;
}
