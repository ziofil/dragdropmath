/**
 * What makes an exercise beautiful, as rules a program can check: hard rules
 * (a candidate breaking one is thrown away) and a score for ranking the rest.
 * Everything is read off the exercise itself (its start, milestones and
 * goal), the same way for every shape.
 */
import type { Expr, MathState } from "../../expr/types";
import { parseState } from "../../expr/parse";
import { printState } from "../../expr/key";
import { allNodes, children } from "../../expr/tree";

export type Verdict = { ok: boolean; why: string[]; score: number; notes: string[] };

/** Numbers a person writes without thinking twice. */
const FRIENDLY = 12;

/**
 * Every number written in it (sizes, no signs): coefficients, constants,
 * exponents; not the base of a log or the index of a root, which are
 * notation (log₂, ∛).
 */
export function numbersIn(s: MathState): number[] {
  const out: number[] = [];
  const visit = (e: Expr) => {
    if (e.kind === "num") out.push(e.value);
    if (e.kind === "log") return visit(e.arg);
    if (e.kind === "pow" && e.radical) return visit(e.base);
    children(e).forEach(visit);
  };
  s.sides.forEach(visit);
  return out;
}

/** The answer when the goal gives one letter a whole number (x = 3, x ≥ −2). */
export function answerOf(goal: MathState): number | undefined {
  if (goal.sides.length !== 2) return undefined;
  const [l, r] = goal.sides;
  if (l.kind !== "var") return undefined;
  if (r.kind === "num") return r.value;
  if (r.kind === "neg" && r.arg.kind === "num") return -r.arg.value;
  return undefined;
}

/** What the rules look at: the answer, the numbers the start is written with, and those met on the way. */
export function measure(d: { start: string; goal: string; via: readonly string[] }) {
  const start = parseState(d.start);
  const goal = parseState(d.goal);
  return {
    start,
    answer: answerOf(goal),
    numbers: numbersIn(start),
    along: [...d.via.map(parseState), goal].flatMap(numbersIn),
  };
}

export function judge(d: { start: string; goal: string; via: readonly string[] }): Verdict {
  const why: string[] = [];
  const notes: string[] = [];
  const m = measure(d);
  const { start, answer: x } = m;
  // The answers of one equation (x = 0 or x = 7): 0 is an answer, and "… = 0" how it's solved.
  const either = parseState(d.goal).join === "or" || !!parseState(d.start).conditions?.length;
  const numbers = either ? m.numbers.filter((n) => n !== 0) : m.numbers;
  const along = either ? m.along.filter((n) => n !== 0) : m.along;

  // ---- hard rules ----
  if (x !== undefined && x === 0) why.push("answer 0");
  if (x !== undefined && Math.abs(x) > 9) why.push("answer too big");
  if (numbers.some((n) => !Number.isInteger(n) || n === 0)) why.push("a 0 or a non-whole number in the start");
  if (numbers.some((n) => n > 30)) why.push("a number over 30 in the start");
  if (along.some((n) => !Number.isInteger(n) || n > 60)) why.push("a big number on the way");
  if (along.includes(0)) why.push("something cancels to 0 on the way");

  // ---- score: 100, less for what makes it harder to read than it needs to be ----
  let score = 100;
  const pen = (points: number, note: string) => {
    if (points <= 0) return;
    score -= points;
    notes.push(`−${Math.round(points)} ${note}`);
  };
  const big = Math.max(0, ...numbers);
  pen(2 * (big - FRIENDLY), `largest number ${big}`);
  const bigAlong = Math.max(0, ...along);
  pen(bigAlong - 20, `${bigAlong} on the way`);
  const distinct = new Set(numbers).size;
  pen(3 * (distinct - 4), `${distinct} different numbers`);
  if (x !== undefined && x < 0) pen(4, "negative answer");
  if (x === 1) pen(6, "answer 1 feels like a trick");
  const minuses = start.sides.flatMap(allNodes).filter((e) => e.kind === "neg").length;
  pen(2 * (minuses - 2), `${minuses} minus signs`);
  const length = printState(start).replace(/\*/g, "").length;
  pen(length - 22, `${length} characters long`);
  // The answer showing up in the start gives it away.
  if (x !== undefined && numbers.includes(Math.abs(x))) pen(3, "the answer appears in the start");

  return { ok: why.length === 0, why, score, notes };
}
