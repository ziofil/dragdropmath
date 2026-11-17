/**
 * Quadratic equations: one chapter, its lesson (a board per move) and
 * its practice, built back from their answers (../generate/back.ts): x = 3
 * or x = −2 is (x − 3)(x + 2) = 0 (a product is 0 when a factor is), that
 * multiplied out (x² − x − 6 = 0), then written as a teacher might, with
 * terms moved across, both sides multiplied, the sides swapped. Or x = ±3 is
 * x² = 9 (an even power has two roots). A root of both sides, or a fraction
 * over a bottom, brings conditions with it, read off the start
 * (../generate/domain.ts): an answer that breaks one is crossed out, and
 * isn't in the goal.
 */
import type { Chapter } from "../puzzles";
import type { MathState } from "../../expr/types";
import { parseState } from "../../expr/parse";
import { build, draftOf, type Step } from "../generate/back";
import { ex, overBottom, productIsZero, restate, rootBoth, rowsAs, squaredRows, writeAs } from "../generate/unmove";
import { gcd, one, type Draft, type Level, type Rng, type Shape, letter as anyLetter } from "../generate/write";
import { d } from "../generate/drill";
import { answersText, fromAnswers, fromCoefs, linear, mul, teacherWrites, written, type Poly } from "../generate/poly";
import { writesWay, type Stage } from "../generate/way";
import { rulesOf } from "../puzzles";
import { BOOK_SHAPES } from "./quadraticBook";

/** (p·x − q)·(s·x − t)·…, multiplied out: the brackets whose answers are q/p, t/s, … */
const times = (x: string, ...fs: [number, number][]): Poly => fromAnswers(x, ...fs.map(([p, q]) => [q, p] as [number, number]));

const letter = (r: Rng) => (r.next() < 0.75 ? "x" : one(r, ["t", "y", "a"]));

/**
 * A side written another way (equal to it), then the whole row as a teacher
 * writes it (a multiple of it), each with the kind of work undoing it is:
 * the way between is written by the moves (../generate/way.ts).
 */
const side = (src: string, stage: Stage, at = 0): Step => ({ ...writeAs([], ex(src), at), stage });
const row = (src: string, stage: Stage = "gather"): Step => {
  const [l, r] = parseState(src).sides;
  return { ...restate([], l, r), stage };
};

/** Built back from `answer` by `steps`, as a draft with its conditions; its way between the milestones written by the moves (`check`). */
function made(shape: string, answer: string, steps: Step[], r: Rng): Draft | null {
  const b = build(parseState(answer) as MathState, steps, r);
  return b && { ...draftOf(shape, b, { conditions: true }), legs: undefined };
}

/** From the answers to the product of brackets, multiplied out (q[0]x² + q[1]x + q[2] = 0). */
const factored = (q: Poly): Step[] => [{ ...productIsZero(), stage: "split" }, side(written(q), "factor")];

/** The root of both sides (undone by squaring them), x² = 9 from x = ±3, the rows of a bracket's answers. */
const rootedBoth = (): Step => ({ ...rootBoth(), stage: "square" });
const squared = (): Step => ({ ...squaredRows(), stage: "square" });
const asRows = (e: string): Step => ({ ...rowsAs(ex(e)), stage: "split" });

const shapes: Shape[] = [
  {
    id: "pure",
    name: "a square equal to a number",
    make: (r) => {
      // x² = 9, 4x² − 36 = 0, 25 = 9x² (the answers ± a whole number or a fraction).
      const x = letter(r);
      const [p, q] = [r.int(1, 9), one(r, [1, 1, 1, 2, 3])];
      if (gcd(p, q) !== 1) return null;
      const k = one(r, [1, 1, 2, 3, 4]);
      return made("pure", answersText(x, [p, q], [-p, q]), [squared(), row(teacherWrites(r, fromCoefs([-p * p * k, 0, q * q * k], x), { move: 0.6 }))], r);
    },
  },
  {
    id: "pure-fraction",
    name: "a fraction in front of x²",
    make: (r) => {
      // (a/q)·x² = c with whole answers ±n.
      const x = letter(r);
      const [a, q, n] = [r.int(1, 3), one(r, [2, 3, 4]), r.int(1, 6)];
      if (gcd(a, q) !== 1 || (a * n * n) % q !== 0) return null;
      const c = (a * n * n) / q;
      return made("pure-fraction", answersText(x, [n, 1], [-n, 1]), [squared(), row(r.next() < 0.5 ? `(${a}/${q})${x}^2 = ${c}` : `(${a}/${q})${x}^2 - ${c} = 0`)], r);
    },
  },
  {
    id: "pure-root",
    name: "a square equal to a number that isn't a square",
    make: (r) => {
      // x² − 5 = 0 → x = √5 or x = −√5.
      const x = letter(r);
      const n = one(r, [2, 3, 5, 6, 7, 10]);
      return made("pure-root", `${x} = √${n} or ${x} = -√${n}`, [squared(), row(teacherWrites(r, fromCoefs([-n, 0, 1], x), { move: 0.6 }))], r);
    },
  },
  {
    id: "spurious",
    name: "no number on its own: take the letter out",
    make: (r) => {
      // a·x² + b·x = 0 → x(ax + b) = 0 → x = 0 or x = −b/a.
      const x = letter(r);
      const [p, q] = [r.signed(1, 9), one(r, [1, 1, 2, 3])];
      if (gcd(p, q) !== 1) return null;
      const k = one(r, [1, 1, 2, 3]);
      const [a, b] = [q * k, -p * k];
      return made("spurious", answersText(x, [0, 1], [p, q]), [...factored(fromCoefs([0, -p, q], x)), row(teacherWrites(r, fromCoefs([0, b, a], x)))], r);
    },
  },
  {
    id: "factors-one",
    name: "x² and two whole answers",
    make: (r) => {
      const x = letter(r);
      const [u, v] = [r.signed(1, 9), r.signed(1, 9)];
      if (u === v || u === -v || u === 0 || v === 0) return null;
      const q = times(x, [1, u], [1, v]);
      return made("factors-one", answersText(x, [u, 1], [v, 1]), [...factored(q), row(teacherWrites(r, q, { move: 0.3 }))], r);
    },
  },
  {
    id: "factors-a",
    name: "a number in front of x², and a fraction for an answer",
    make: (r) => {
      // (px − q)(x − v) = 0 → x = q/p or x = v.
      const x = letter(r);
      const [p, q, v] = [one(r, [2, 3, 4, 5]), r.signed(1, 7), r.signed(1, 6)];
      // Both pairs of the split middle term share a number of 2 or more (px(x − v) and −q(x − v)): a shared 1 can't be taken out by hand.
      if (gcd(p, q) !== 1 || q === p * v || Math.abs(q) < 2 || Math.abs(v) < 2) return null;
      const q3 = times(x, [p, q], [1, v]);
      return made("factors-a", answersText(x, [q, p], [v, 1]), [...factored(q3), row(teacherWrites(r, q3, { move: 0.3 }))], r);
    },
  },
  {
    id: "square-of-bracket",
    name: "a bracket squared, equal to a number",
    make: (r) => {
      // (px + q)² = m² → px + q = m or px + q = −m.
      const x = letter(r);
      const [p, q, m] = [one(r, [1, 1, 2, 3]), r.signed(1, 6), r.int(1, 7)];
      if (q === m || q === -m) return null;
      const br = `${p === 1 ? "" : p}${x} ${q < 0 ? "-" : "+"} ${Math.abs(q)}`;
      const k = one(r, [1, 1, 1, 2, 3]);
      const left = `${k === 1 ? "" : k}(${br})^2`;
      // Each answer as the bracket equal to ±m, the bracket squared, then both sides times k.
      return made("square-of-bracket", answersText(x, [m - q, p], [-m - q, p]), [asRows(br), squared(), row(r.next() < 0.3 ? `${k * m * m} = ${left}` : `${left} = ${k * m * m}`)], r);
    },
  },
  {
    id: "expand-first",
    name: "brackets to multiply out first",
    make: (r) => {
      // (x + u)(x + v) = b·x + c where the x² cancels down to (x − r1)(x − r2) = 0.
      const x = letter(r);
      const [r1, r2, u, v] = [r.signed(1, 7), r.signed(1, 7), r.signed(1, 6), r.signed(1, 6)];
      if (r1 === r2 || r1 === -r2) return null;
      // (x + u)(x + v) − (x − r1)(x − r2) = (u + v + r1 + r2)x + (uv − r1·r2).
      const [b, c] = [u + v + r1 + r2, u * v - r1 * r2];
      if (b === 0 && c === 0) return null;
      const bracket = (w: number) => `(${x} ${w < 0 ? "-" : "+"} ${Math.abs(w)})`;
      const right = written(fromCoefs([c, b], x));
      // Multiplied out, then collected (backwards: collected, multiplied out, one bracket in, both).
      const steps: Step[] = [
        ...factored(times(x, [1, r1], [1, r2])),
        row(`${written(fromCoefs([u * v, u + v, 1], x))} = ${right}`),
        side(`${bracket(u)}${bracket(v)}`, "expand"),
      ];
      return made("expand-first", answersText(x, [r1, 1], [r2, 1]), steps, r);
    },
  },
  {
    id: "root-cancels",
    name: "a root equal to x and a number: the squares cancel",
    make: (r) => {
      // √(x² + k) = x + d → x² + k = x² + 2dx + d² → x = (k − d²)/(2d); where x ≥ −d (a root is never negative).
      const x = letter(r);
      const [d, x0] = [r.int(1, 4), r.int(-1, 6)];
      const k = 2 * d * x0 + d * d;
      if (k <= 0 || x0 < -d) return null;
      const steps: Step[] = [row(`${x}^2 + ${k} = ${written(mul(linear(1, d, x), linear(1, d, x)))}`), side(`(${x} + ${d})^2`, "expand", 1), rootedBoth()];
      return made("root-cancels", `${x} = ${x0}`, steps, r);
    },
  },
  {
    id: "root-squared",
    name: "a root equal to x and a number: squared, a second-degree equation",
    make: (r) => {
      // √(a·x + b) = x + d squares to x² + (2d − a)x + d² − b = 0, made (x − r1)(x − r2): a = 2d + r1 + r2, b = d² − r1·r2.
      // Where a·x + b ≥ 0 (the root's inside) and x ≥ −d (what it equals): a root below −d is crossed out.
      const x = letter(r);
      const [d, r1, r2] = [r.int(-2, 4), r.signed(1, 6), r.signed(1, 6)];
      const [a, b] = [2 * d + r1 + r2, d * d - r1 * r2];
      if (r1 === r2 || a <= 0 || b === 0 || Math.abs(b) > 30) return null;
      if (![r1, r2].some((v) => v >= -d)) return null;
      const inside = `${a === 1 ? "" : a}${x} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
      const right = d === 0 ? x : `${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
      const steps: Step[] = [...factored(times(x, [1, r1], [1, r2])), row(`${inside} = ${written(mul(linear(1, d, x), linear(1, d, x)))}`), side(`(${right})^2`, "expand", 1), rootedBoth()];
      return made("root-squared", answersText(x, [r1, 1], [r2, 1]), steps, r);
    },
  },
  {
    id: "fraction-zero",
    name: "a fraction equal to 0: its bottom is never 0",
    make: (r) => {
      // (x − r1)(x − r2), multiplied out, over (x − r1) = 0, where x ≠ r1: x = r1 is crossed out, x = r2 is the answer.
      const x = letter(r);
      const [r1, r2] = [r.signed(1, 6), r.signed(1, 6)];
      if (r1 === r2 || r1 === -r2) return null;
      return made("fraction-zero", answersText(x, [r1, 1], [r2, 1]), [...factored(times(x, [1, r1], [1, r2])), { ...overBottom(ex(written(linear(1, -r1, x)))), stage: "clear" }], r);
    },
  },
];

// Right by construction (built back from their answers); the tests solve every shape with the moves.
const chosen = (...ids: string[]) =>
  ids.map((id) => ({ ...[...shapes, ...BOOK_SHAPES].find((s) => s.id === id)!, check: writesWay(() => rulesOf("quadratic")), pool: 4 }) as Shape);

const levels = (): Record<Level, Shape[]> => ({
  easy: chosen("pure", "spurious", "factors-one"),
  medium: chosen("factors-a", "square-of-bracket", "expand-first", "pure-fraction", "root-cancels", "root-squared", "fraction-zero"),
  // As the book's hardest (quadraticBook.ts): long, a root or a bottom to clear first, or a letter that's x² or √x.
  hard: chosen("root-and-term", "two-roots", "bottom-powers", "bottoms-that-factor", "in-pairs", "in-squares", "in-roots"),
});

/** A coefficient as it's written after another term: " + 3x", " - x", " - 6". */
const coef = (k: number, x = "") => (k < 0 ? " - " : " + ") + (Math.abs(k) === 1 && x ? "" : Math.abs(k)) + x;

/**
 * x² + bx + c = 0 factored the way the lesson says, as the moves write it:
 * the middle term split (as split-term splits it: the smaller number
 * first), each pair's shared factor taken out, then the shared bracket.
 */
function factoredInPairs(b: number, c: number): string[] {
  let [p, q] = [0, 0];
  for (let n = -Math.abs(c); n <= Math.abs(c); n++) {
    if (n === 0 || c % n !== 0) continue;
    if (n + c / n === b && Math.abs(n) <= Math.abs(c / n)) {
      [p, q] = [n, c / n];
      break;
    }
  }
  const bracket = `(x${coef(p)})`;
  return [
    `x^2${coef(p, "x")}${coef(q, "x")}${coef(c)} = 0`,
    `x${bracket}${coef(q, "x").replace(/x$/, "")}${bracket} = 0`,
    `${bracket}(x${coef(q)}) = 0`,
  ];
}

export const quadratic: Chapter = {
  id: "quadratic",
  title: "Quadratic equations",
  blurb: "An equation with x² can have two answers. Make one side 0 and write the other as a product: a product is 0 only when one of its factors is. Or get the square on its own: x² = 9 means x = 3 or x = −3.",
  after: ["simultaneous"],
  unlocks: ["zero-product", "move-letter-denominator"],
  // x² = 9: x may be −3 as well (unlike the chapters where letters stand for positive numbers).
  positive: false,
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    d("zero-product", (r) => {
      const [a, b] = [r.int(1, 8), r.int(1, 8)];
      const x = anyLetter(r);
      return { start: `(${x} - ${a})(${x} + ${b}) = 0`, goal: `${x} = ${a} or ${x} = -${b}` };
    }),
    d("plus-minus", (r) => {
      const n = r.int(2, 9);
      const x = anyLetter(r);
      return { start: `${x}^2 = ${n * n}`, goal: `${x} = ${n} or ${x} = -${n}` };
    }, "root-across"),
    d("take-out-then-split", (r) => {
      const a = r.int(2, 9);
      const x = anyLetter(r);
      return { start: `${x}^2 - ${a}${x} = 0`, goal: `${x} = 0 or ${x} = ${a}` };
    }, "factor-out"),
    d("split-middle", (r) => {
      // (x + u)(x − v) = x² + (u − v)x − uv; never u = v (that's a difference of two squares).
      const [u, v0] = [r.int(1, 6), r.int(1, 6)];
      const v = v0 === u ? (u % 6) + 1 : v0;
      const [b, c] = [u - v, -u * v];
      return { start: `x^2${coef(b, "x")}${coef(c)} = 0`, via: factoredInPairs(b, c), goal: `x = ${v} or x = -${u}` };
    }, "split-term"),
    // The root squared away: an answer the squared equation has, but the first one hasn't, is crossed out.
    d("square-both-sides", (r) => {
      // √(x + c) = x + d: squared, x² + (2d − 1)x + d² − c = 0 = (x − p)(x − q), with p ≥ −d an answer and q < −d crossed out.
      const [dd, p] = [r.int(1, 2), r.int(1, 3)];
      const q = 1 - 2 * dd - p;
      const c = dd * dd - p * q;
      const where = ` where x ≥ ${-c}, x ≥ ${-dd}`;
      const [b, k] = [2 * dd - 1, dd * dd - c];
      const via = [
        `(x + ${c})^(1/2) = x + ${dd}`,
        `x + ${c} = (x + ${dd})^2`,
        `x + ${c} = (x + ${dd})(x + ${dd})`,
        `x + ${c} = x^2 + ${2 * dd}x + ${dd * dd}`,
        `0 = x^2${coef(b, "x")}${coef(k)}`,
        ...factoredInPairs(b, k).map((f) => `0 = ${f.replace(" = 0", "")}`),
      ].map((v) => v + where);
      return { start: `√(x + ${c}) = x + ${dd}${where}`, via, goal: `x = ${p} or x = ${q}${where}` };
    }, "root-notation"),
    // A fraction equal to 0: its bottom (never 0, the condition says) carried across, 0 times it is 0.
    d("fraction-zero", (r) => {
      const [a, b] = [r.int(1, 6), r.int(1, 6)];
      const where = ` where x ≠ -${b}`;
      // 0 times the bottom worked out first (0 gets rid of what it multiplies), then the number moved across.
      return { start: `(x - ${a})/(x + ${b}) = 0${where}`, via: [`x - ${a} = 0${where}`], goal: `x = ${a}${where}` };
    }, "move-letter-denominator"),
  ],
  levels,
};
