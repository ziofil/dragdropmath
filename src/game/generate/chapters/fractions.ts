/** Exercise shapes for the chapter "fractions" (see ../write.ts). */
import { NESTED } from "./nested";
import { composedFractions } from "../composeFrac";
import { ax, gcd, byIds, letter as someLetter, type Level, type Rng, type Shape } from "../write";

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

export const shapes: Record<Level, Shape[]> = {
  easy: [...byIds(all, "same-bottom", "whole-and-fraction", "split-top", "top-factor", "divide"), composedFractions("easy", 5)],
  medium: [...byIds(all, "unlike-bottoms", "mixed-divide", "sum-times"), composedFractions("medium", 4)],
  // Hard nests one thing in another, with x and y: chapters/nested.ts.
  hard: [...NESTED.fractions, composedFractions("hard", 3)],
};
