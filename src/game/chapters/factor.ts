/**
 * Factoring: one chapter, its lesson (a board per move) and its practice —
 * a common factor out in front (a number, a letter, a whole bracket), or
 * pairs. Walked back from a factored answer (../generate/walk.ts): multiplied
 * out, a bracket or a term at a time, the numbers worked out as the start is
 * written; at Hard until nothing is left in brackets.
 */
import type { Chapter } from "../puzzles";
import type { MathState } from "../../expr/types";
import { printState } from "../../expr/key";
import { type Walk, walked } from "../generate/walk";
import { written } from "../generate/backs";
import { gcd, lin, one, type Rng, type Level, type Shape, letter, one as pick, term } from "../generate/write";
import { d, letters2 } from "../generate/drill";

const FACTORING = ["factor-out", "factor-shared"] as const;
/** Multiplying out, the step back; the numbers worked out after. */
const BACK = ["distribute"] as const;

/** a·x + b with no common factor (so what's taken out is all there is). */
function inner(r: Rng, x = "x"): string | null {
  const a = r.int(1, 5);
  const b = r.signed(1, 9);
  return gcd(a, b) === 1 ? lin(a, b, x) : null;
}

const walk = (id: string, name: string, answer: Walk["answer"], steps: [number, number] = [1, 2], whole = false): Walk => ({
  id,
  name,
  answer,
  back: BACK,
  steps,
  settle: written,
  // Hard starts are all multiplied out (nothing half factored to begin with): it walks on until no bracket is left.
  ...(whole ? { alone: true, fits: (s: MathState) => !printState(s).includes("(") } : {}),
  needs: [...FACTORING],
});

/** x + a, x − a. */
const xPlus = (a: number, x = "x") => `${x} ${a < 0 ? "-" : "+"} ${Math.abs(a)}`;

/** Two different numbers, either sign, up to `max`. */
function twoOf(r: Rng, max: number): [number, number] | null {
  const [a, b] = [r.signed(1, max), r.signed(1, max)];
  return a === b ? null : [a, b];
}

const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [
    walk("walk-number-out", "a number out in front", (r) => ((i) => i && `${r.int(2, 6)}(${i})`)(inner(r))),
    walk("walk-letter-out", "a letter out in front", (r) => {
      const x = one(r, ["x", "y", "a"]);
      const [a, b] = [r.int(1, 4), r.signed(1, 9)];
      return gcd(a, b) === 1 ? `${x}(${lin(a, b, x)})` : null;
    }),
    walk("walk-number-and-letter", "a number and a letter out in front", (r) => ((i) => i && `${r.int(2, 5)}x(${i})`)(inner(r))),
    walk("walk-bracket-out", "a whole bracket out in front", (r) => ((i) => i && `(${xPlus(r.signed(1, 7))})(${i})`)(inner(r)), [1, 1]),
  ],
  medium: [
    walk("walk-pairs", "four terms in pairs", (r) => ((p) => p && `(${xPlus(p[0])})(${xPlus(p[1])})`)(twoOf(r, 7)), [2, 3]),
    walk("walk-number-then-pairs", "a number out first, then pairs", (r) => ((p) => p && `${r.int(2, 4)}(${xPlus(p[0])})(${xPlus(p[1])})`)(twoOf(r, 5)), [2, 4]),
    walk("walk-pairs-cube", "four terms in pairs, with a cube", (r) => ((p) => p && `(x^2 ${p[0] < 0 ? "-" : "+"} ${Math.abs(p[0])})(${xPlus(p[1])})`)(twoOf(r, 6)), [2, 3]),
  ],
  hard: [
    walk("walk-pairs-two-letters", "pairs, with x and y", (r) => {
      const p = twoOf(r, 5);
      return p && `(x ${p[0] < 0 ? "-" : "+"} ${Math.abs(p[0]) === 1 ? "" : Math.abs(p[0])}y)(x ${p[1] < 0 ? "-" : "+"} ${Math.abs(p[1]) === 1 ? "" : Math.abs(p[1])}y)`;
    }, [3, 12], true),
    walk("walk-number-then-pairs-two-letters", "a number out first, then pairs with x and y", (r) => {
      const p = twoOf(r, 4);
      const y = (k: number) => `${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}y`;
      return p && `${r.int(2, 4)}(x ${y(p[0])})(x ${y(p[1])})`;
    }, [3, 12], true),
    walk("walk-pairs-numbers", "pairs, with x and y and numbers in front", (r) => {
      const [p, q, a] = [r.int(2, 5), r.signed(1, 5), r.int(2, 3)];
      return gcd(p, q) === 1 && Math.abs(q * a) <= 30 ? `(x + ${a}y)(${p}x ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}y)` : null;
    }, [3, 12], true),
    walk("walk-common-xy", "a number and both letters out in front", (r) => {
      const [a, b] = [r.int(1, 4), r.signed(1, 6)];
      return gcd(a, b) === 1 ? `${r.int(2, 4)}xy(${lin(a, b)} ${b < 0 ? "+" : "-"} y)` : null;
    }, [1, 2]),
  ],
};

const levels = (): Record<Level, Shape[]> => ({
  easy: walks.easy.map((w) => walked(w, "factor")),
  medium: walks.medium.map((w) => walked(w, "factor")),
  hard: walks.hard.map((w) => walked(w, "factor")),
});

export const factor: Chapter = {
  id: "factor",
  title: "Factoring",
  blurb: "Factoring writes a sum as a product. A factor every term has can stand once, in front of brackets: 3x + 3y = 3(x + y).",
  after: ["brackets"],
  unlocks: ["factor-out", "split-number", "factor-shared", "split-term", "difference-of-squares"],
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    d("factor-out", (r) => {
      const [x, y] = letters2(r);
      const a = r.int(2, 7);
      return `${a}${x} + ${a}${y}`;
    }),
    // A common factor that doesn't show: 3 in 6x + 9. Splitting 6 (into its smallest prime, 2, and 3) shows it.
    d("split-number", (r) => {
      const [p, g] = pick(r, [[2, 3], [2, 5], [2, 7], [3, 5], [3, 7]] as const);
      const c = pick(r, [2, 3, 4, 5].filter((n) => gcd(n, p) === 1));
      const x = letter(r);
      return { start: `${p * g}${x} + ${g * c}`, via: [`${p}*${g}*${x} + ${g * c}`], goal: `${g}(${p}${x} + ${c})` };
    }),
    d("bracket-out", (r) => {
      const x = letter(r);
      const a = r.int(1, 6);
      const b = pick(r, [2, 3, 4, 5].filter((n) => n !== a));
      return `${x}(${x} + ${a}) + ${b}(${x} + ${a})`;
    }, "factor-out"),
    d("factor-shared", (r) => {
      // Four terms, worked in pairs: x² + 2x + 3x + 6, the first two first.
      const a = r.int(1, 5);
      const b = pick(r, [2, 3, 4, 5, 6].filter((n) => n !== a));
      return { start: `x^2 + ${term(a, "x")} + ${b}x + ${a * b}`, want: `x*(x + ${a})`, goal: `(x + ${a})(x + ${b})` };
    }),
    // x² + 5x + 6: the middle term splits into the two pairs factor-shared then works on.
    d("split-term", (r) => {
      const x = letter(r);
      const [p, q] = pick(r, [[1, 2], [1, 3], [2, 3], [1, 4], [2, 4], [3, 4], [2, 5], [3, 5]] as const);
      const split = `${x}^2 + ${term(p, x)} + ${q}${x} + ${p * q}`;
      // And on to the product, factored in pairs as in the last board.
      return { start: `${x}^2 + ${p + q}${x} + ${p * q}`, via: [split, `${x}(${x} + ${p}) + ${q}(${x} + ${p})`], goal: `(${x} + ${p})(${x} + ${q})` };
    }),
    d("difference-of-squares", (r) => {
      const [x, k] = [letter(r), r.int(2, 9)];
      // Now and then a number in front that is a square too: 4x² − 9 = (2x − 3)(2x + 3).
      const a = r.next() < 0.3 ? pick(r, [2, 3]) : 1;
      const m = a === 1 ? k : pick(r, [1, 3, 5].filter((n) => gcd(n, a) === 1));
      const ax2 = a === 1 ? `${x}^2` : `${a * a}${x}^2`;
      const ax = a === 1 ? x : `${a}${x}`;
      return { start: `${ax2} - ${m * m}`, goal: `(${ax} - ${m})(${ax} + ${m})` };
    }),
  ],
  // Brackets multiplied out (undone by factoring).
  stepsBack: () => ["distribute"],
  levels,
};
