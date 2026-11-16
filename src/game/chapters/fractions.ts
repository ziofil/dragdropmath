/**
 * Fractions: one chapter, its lesson (a board per move) and its practice —
 * hand-written shapes, fractions composed from pieces
 * (../generate/composeFrac.ts), and at Hard one fraction inside another.
 */
import type { Chapter } from "../puzzles";
import { composedFractions } from "../generate/composeFrac";
import { ax, byIds, gcd, letter as someLetter, type Level, type Rng, type Shape, letter as anyLetter, one as pick } from "../generate/write";
import { d, carrying } from "../generate/drill";

/** A coefficient in front: "3x", "x". */
const co = (c: number, s: string) => (c === 1 ? s : `${c}${s}`);

const COPRIME: [number, number][] = [
  [2, 3],
  [2, 5],
  [3, 4],
  [3, 5],
  [2, 7],
  [4, 5],
];


/** Hard: one fraction inside another, with x and y, so nothing collapses too soon. */
const nestedFractions: Shape[] = [
  {
    id: "fraction-of-fractions",
    name: "a sum of fractions over a fraction",
    make: (r) => {
      // (x/a + x/b)/(y/(ab)) → ((a + b)x)/y
      const [a, b] = pick(r, COPRIME);
      const ab = a * b;
      return {
        shape: "fraction-of-fractions",
        start: `(x/${a} + x/${b})/(y/${ab})`,
        goal: `(${a + b}x)/y`,
        via: [`((${b}x)/${ab} + (${a}x)/${ab})/(y/${ab})`, `((${a + b}x)/${ab})/(y/${ab})`],
      };
    },
  },
  {
    id: "divide-letter-fractions",
    name: "a fraction of x and y divided by another",
    make: (r) => {
      // (px/y)/(x²/(qy)) + s/x → (pq + s)/x
      const p = r.int(2, 5);
      const q = r.int(2, 5);
      const s = r.int(1, 5);
      if (p * q > 30) return null;
      return {
        shape: "divide-letter-fractions",
        start: `((${p}x)/y)/(x^2/(${q}y)) + ${s}/x`,
        goal: `${p * q + s}/x`,
        // The q and the y under two bars go up onto the top (they multiply), then everything cancels down.
        via: [`((${p}x·${q}·y)/y)/x^2 + ${s}/x`, `${p * q}/x + ${s}/x`],
      };
    },
  },
  {
    id: "fraction-over-flipped",
    name: "a fraction over another with x and y swapped",
    make: (r) => {
      // (px/y)/(y/(qx)) − (s·x²)/y² → ((pq − s)x²)/y²
      const p = r.int(2, 5);
      const q = r.int(2, 5);
      const s = r.int(1, 5);
      if (p * q > 30 || p * q - s < 2) return null;
      return {
        shape: "fraction-over-flipped",
        start: `((${p}x)/y)/(y/(${q}x)) - ${co(s, "x^2")}/y^2`,
        goal: `(${p * q - s}x^2)/y^2`,
        // The q and the x under two bars go up onto the top, the outer y joins the inner bottom.
        via: [`((${p}x·${q}·x)/y)/y - ${co(s, "x^2")}/y^2`, `(${p * q}x^2)/y^2 - ${co(s, "x^2")}/y^2`],
      };
    },
  },
];

const letter = (r: Rng) => someLetter(r, ["y", "a", "n", "k"]);

/** p/q in lowest terms, as the goal reads it: "3/4", "2", "-1/2". */
function frac(p: number, q: number): string {
  const g = gcd(p, q);
  const [a, b] = [p / g, q / g];
  return b === 1 ? `${a}` : `${a}/${b}`;
}
/** A fraction that isn't whole once simplified. */
const notWhole = (p: number, q: number) => p % q !== 0;

/**
 * The milestones of p/a ± q/b (times x, when x is given): each fraction made
 * up to the common bottom, then each bottom worked out, one at a time.
 */
function unlikeVia(p: number, a: number, q: number, b: number, sign: string, x: string): string[] {
  const g = gcd(a, b);
  const l = (a * b) / g;
  // What a top looks like times k: "3", "(2*3)", "(3x)", "(2*3x)".
  const top = (n: number, k: number) => (k === 1 ? (n === 1 ? x || "1" : `${n}${x}`) : n === 1 ? (x ? `(${k}${x})` : `${k}`) : `(${n}*${k}${x})`);
  const ka = l / a;
  const kb = l / b;
  const done = (n: number, k: number) => (!x ? `${n * k}/${l}` : n * k === 1 ? `${x}/${l}` : `(${n * k}${x})/${l}`);
  const raw = (n: number, d: number, k: number) => (k === 1 ? `${top(n, 1)}/${d}` : `${top(n, k)}/(${d}*${k})`);
  const fst = raw(p, a, ka);
  const snd = raw(q, b, kb);
  if (ka !== 1 && kb !== 1) return [`${fst} ${sign} ${snd}`, `${done(p, ka)} ${sign} ${snd}`, `${done(p, ka)} ${sign} ${done(q, kb)}`];
  // One bottom is already the common one.
  return ka !== 1 ? [`${fst} ${sign} ${raw(q, b, 1)}`, `${done(p, ka)} ${sign} ${done(q, 1)}`] : [`${raw(p, a, 1)} ${sign} ${snd}`, `${done(p, 1)} ${sign} ${done(q, kb)}`];
}

const all: Shape[] = [
  {
    id: "same-bottom",
    name: "two fractions with the same bottom",
    make: (r) => {
      // a/d ± b/d → (a ± b)/d, simplified
      const d = r.int(3, 9);
      const a = r.int(1, d - 1);
      const b = r.int(1, d - 1);
      const minus = r.next() < 0.4;
      const top = minus ? a - b : a + b;
      if (top <= 0 || !notWhole(top, d) || gcd(a, d) > 1 || gcd(b, d) > 1) return null;
      return { shape: "same-bottom", start: `${a}/${d} ${minus ? "-" : "+"} ${b}/${d}`, goal: frac(top, d), via: [] };
    },
  },
  {
    id: "whole-and-fraction",
    name: "a whole number and a fraction",
    make: (r) => {
      // n ± a/b → (nb ± a)/b
      const n = r.int(1, 4);
      const b = r.int(2, 6);
      const a = r.int(1, b - 1);
      const minus = r.next() < 0.4;
      const top = minus ? n * b - a : n * b + a;
      if (gcd(a, b) > 1) return null;
      return { shape: "whole-and-fraction", start: `${n} ${minus ? "-" : "+"} ${a}/${b}`, goal: `${top}/${b}`, via: [] };
    },
  },
  {
    id: "split-top",
    name: "a sum over a number",
    make: (r) => {
      // (x + a)/a → x/a + 1
      const a = r.int(2, 9);
      const x = letter(r);
      return { shape: "split-top", start: `(${x} + ${a})/${a}`, goal: `${x}/${a} + 1`, via: [] };
    },
  },
  {
    id: "divide",
    name: "a fraction over a fraction",
    make: (r) => {
      // (a/b)/(c/d) → (ad)/(bc), simplified
      const a = r.int(1, 4);
      const b = r.int(2, 6);
      const c = r.int(1, 5);
      const d = r.int(2, 8);
      if (gcd(a, b) > 1 || gcd(c, d) > 1 || a * d > 60 || b * c > 60 || b === d || a === c || c === 1) return null;
      // Something to cancel once flipped, and not whole.
      if (gcd(a * d, b * c) === 1 || !notWhole(a * d, b * c)) return null;
      return { shape: "divide", start: `(${a}/${b})/(${c}/${d})`, goal: frac(a * d, b * c), via: [] };
    },
  },
  {
    id: "top-factor",
    name: "a number to cancel from the top",
    make: (r) => {
      // (ax + ab)/a → x + b
      const a = r.int(2, 5);
      const b = r.int(1, 6);
      const x = letter(r);
      if (a === b) return null;
      return { shape: "top-factor", start: `(${ax(a, x)} + ${a * b})/${a}`, goal: `${x} + ${b}`, via: [] };
    },
  },
  {
    id: "unlike-bottoms",
    name: "two fractions with different bottoms",
    make: (r) => {
      // p/a ± q/b → one fraction over the smallest common bottom
      const a = r.int(2, 6);
      const b = r.int(2, 8);
      const p = r.int(1, a - 1);
      const q = r.int(1, b - 1);
      const sign = r.next() < 0.4 ? "-" : "+";
      if (a === b || gcd(p, a) > 1 || gcd(q, b) > 1) return null;
      const g = gcd(a, b);
      // Bottoms with nothing in common, and a top that isn't 1 (both make up a step).
      if (g !== 1 || (p === 1 && q === 1)) return null;
      const l = (a * b) / g;
      const [pa, qb] = [(p * l) / a, (q * l) / b];
      const top = sign === "-" ? pa - qb : pa + qb;
      if (top <= 0 || top >= l || l > 15) return null;
      return {
        shape: "unlike-bottoms",
        start: `${p}/${a} ${sign} ${q}/${b}`,
        goal: frac(top, l),
        via: unlikeVia(p, a, q, b, sign, ""),
      };
    },
  },
  {
    id: "mixed-divide",
    name: "a whole number and a fraction, over a fraction",
    make: (r) => {
      // (n ± p/q)/(c/d) → simplified
      const q = r.int(2, 5);
      const n = r.int(1, 3);
      const p = r.int(1, q - 1);
      const c = r.int(1, 5);
      const d = r.int(2, 9);
      const sign = r.next() < 0.4 ? "-" : "+";
      const top = sign === "-" ? n * q - p : n * q + p;
      if (gcd(p, q) > 1 || gcd(c, d) > 1 || c === 1 || d === q || c === top) return null;
      // (top/q)·(d/c): something cancels, and it isn't 1.
      const [u, v] = [top * d, q * c];
      if (gcd(u, v) === 1 || u === v || u > 60 || v > 60) return null;
      return {
        shape: "mixed-divide",
        start: `(${n} ${sign} ${p}/${q})/(${c}/${d})`,
        goal: frac(u, v),
        via: [`(${top}/${q})/(${c}/${d})`],
      };
    },
  },
  {
    id: "sum-times",
    name: "a sum of fractions, times a fraction",
    make: (r) => {
      // (p/a ± q/b)·(c/d) → simplified
      const a = r.int(2, 4);
      const b = r.int(a + 1, 5);
      const p = r.int(1, a - 1);
      const q = r.int(1, b - 1);
      const c = r.int(1, 9);
      const d = r.int(2, 9);
      const sign = r.next() < 0.4 ? "-" : "+";
      if (gcd(a, b) > 1 || gcd(p, a) > 1 || gcd(q, b) > 1 || gcd(c, d) > 1) return null;
      const l = a * b;
      const top = sign === "-" ? p * b - q * a : p * b + q * a;
      if (top <= 0 || gcd(top, l) > 1) return null;
      const [u, v] = [top * c, l * d];
      // Something cancels, and the result is a fraction (not 1, not whole).
      if (gcd(u, v) === 1 || !notWhole(u, v) || u > 60 || v > 60) return null;
      const times = (e: string) => `(${e})*(${c}/${d})`;
      return {
        shape: "sum-times",
        start: `(${p}/${a} ${sign} ${q}/${b})·(${c}/${d})`,
        goal: frac(u, v),
        via: [...unlikeVia(p, a, q, b, sign, "").map(times), `(${top}/${l})*(${c}/${d})`],
      };
    },
  },
];

const levels = (): Record<Level, Shape[]> => ({
  easy: [...byIds(all, "same-bottom", "whole-and-fraction", "split-top", "top-factor", "divide"), composedFractions("easy", 5)],
  medium: [...byIds(all, "unlike-bottoms", "mixed-divide", "sum-times"), composedFractions("medium", 4)],
  // Hard nests one fraction in another, with x and y (nestedFractions).
  hard: [...nestedFractions, composedFractions("hard", 3)],
});

export const fractions: Chapter = {
  id: "fractions",
  title: "Fractions",
  blurb:
    "To add fractions, first make the bottoms the same. Multiplying the top and bottom by the same number doesn't change a fraction's value.",
  after: ["factor"],
  unlocks: ["divide-numbers", "evaluate-fraction", "cancel-factor", "expand-fraction", "add-fractions", "split-fraction", "multiply-fractions", "divide-by-fraction", "times-one"],
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    d("evaluate-fraction", (r) => {
      const a = r.int(2, 9);
      return `${a * r.int(2, 9)}/${a} + ${anyLetter(r)}`;
    }),
    d("divide-numbers", (r) => {
      const g = r.int(2, 5);
      const [p, q] = pick(r, [[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5]]);
      // A letter on top: two plain numbers would just be worked out (evaluate-fraction).
      return `${g * p}${anyLetter(r)}/${g * q}`;
    }),
    d("cancel-factor", (r) => {
      const a = r.int(2, 9);
      return `${a}${anyLetter(r)}/${a}`;
    }),
    d("add-fractions", (r) => {
      const [q, a, b] = [r.int(5, 9), r.int(1, 2), r.int(1, 2)];
      return { start: `${a}/${q} + ${b}/${q}`, goal: `${a + b}/${q}` };
    }),
    d("expand-fraction", (r) => {
      const [p, q] = pick(r, [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7]] as const);
      return { start: `1/${p} + 1/${q}`, goal: `${p + q}/${p * q}`, via: [`${q}/${p * q} + ${p}/${p * q}`] };
    }),
    d("multiply-fractions", (r) => {
      const p = r.int(1, 3);
      const q = r.int(1, 3);
      const b = p + r.int(1, 4);
      // Never the same fraction twice: (2/5)·(2/5) is a square (dropping one on the other makes (2/5)²).
      const d0 = q + r.int(1, 4);
      const d = p === q && d0 === b ? d0 + 1 : d0;
      return { start: `(${p}/${b})·(${q}/${d})`, goal: `${p * q}/${b * d}` };
    }),
    carrying("bottom", d("divide-by-fraction", (r) => {
      const [a, b, c] = [r.int(2, 9), r.int(2, 3), r.int(4, 7)];
      // a·(c/b), worked out: a whole number when it comes out whole.
      return { start: `${a}/(${b}/${c})`, goal: Number.isInteger((a * c) / b) ? `${(a * c) / b}` : `${a * c}/${b}` };
    })),
    d("split-fraction", (r) => `(${anyLetter(r)} + ${r.int(1, 9)})/${r.int(2, 9)}`),
    d("times-one", (r) => `1·${anyLetter(r)} + ${r.int(2, 9)}`),
    // Back to Factoring: take out the factor the top shares with the bottom, then cancel it.
    d("factor-then-cancel", (r) => {
      const [x, k, a] = [anyLetter(r), r.int(2, 5), r.int(1, 7)];
      return { start: `(${k}${x} + ${k * a})/${k}`, goal: `${x} + ${a}` };
    }, "factor-out"),
  ],
  levels,
};
