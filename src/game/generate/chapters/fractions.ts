/** Exercise shapes for the chapter "fractions" (see ../write.ts). */
import { NESTED } from "./nested";
import { ax, gcd, lin, plus, type Level, type Rng, type Shape } from "../write";

/** One of a few letters, mostly x. */
const letter = (r: Rng) => (r.next() < 0.6 ? "x" : ["y", "a", "n", "k"][r.int(0, 3)]);
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
  const done = (n: number, k: number) => (x ? `(${n * k}${x})/${l}` : `${n * k}/${l}`);
  const raw = (n: number, d: number, k: number) => (k === 1 ? `${top(n, 1)}/${d}` : `${top(n, k)}/(${d}*${k})`);
  const fst = raw(p, a, ka);
  const snd = raw(q, b, kb);
  if (ka !== 1 && kb !== 1) return [`${fst} ${sign} ${snd}`, `${done(p, ka)} ${sign} ${snd}`, `${done(p, ka)} ${sign} ${done(q, kb)}`];
  // One bottom is already the common one.
  return ka !== 1 ? [`${fst} ${sign} ${raw(q, b, 1)}`, `${done(p, ka)} ${sign} ${done(q, 1)}`] : [`${raw(p, a, 1)} ${sign} ${snd}`, `${done(p, 1)} ${sign} ${done(q, kb)}`];
}

/**
 * (x + a)/p ± (x + b)/q made one fraction over pq (p, q with nothing in
 * common): each made up to pq, its bracket multiplied out, its bottom worked
 * out, then the tops put together and collected. The milestones, and the
 * top (cx + d) it ends with.
 */
function bracketsOver(a: number, p: number, b: number, q: number, sign: "+" | "-") {
  const l = p * q;
  const [aq, bp] = [a * q, b * p];
  const c = sign === "+" ? q + p : q - p;
  const d = sign === "+" ? aq + bp : aq - bp;
  const one = (n: number, k: number) => `(${k}(${lin(1, n)}))`;
  // k(x + n) multiplied out: "(3x - 3*3)", then "(3x - 9)".
  const raw = (n: number, k: number) => (Math.abs(n) === 1 ? `(${ax(k)}${plus(n * k)})` : `(${ax(k)} ${n < 0 ? "-" : "+"} ${k}*${Math.abs(n)})`);
  const top1 = `(${ax(q)}${plus(aq)})`;
  const top2 = `(${ax(p)}${plus(bp)})`;
  const [d1, d2] = [`(${p}*${q})`, `(${q}*${p})`];
  const via = [
    `${one(a, q)}/${d1} ${sign} ${one(b, p)}/${d2}`,
    `${raw(a, q)}/${d1} ${sign} ${one(b, p)}/${d2}`,
    `${top1}/${d1} ${sign} ${one(b, p)}/${d2}`,
    `${top1}/${l} ${sign} ${one(b, p)}/${d2}`,
    `${top1}/${l} ${sign} ${raw(b, p)}/${d2}`,
    `${top1}/${l} ${sign} ${top2}/${d2}`,
    `${top1}/${l} ${sign} ${top2}/${l}`,
    ...(sign === "+"
      ? [`(${ax(q)}${plus(aq)} + ${ax(p)}${plus(bp)})/${l}`]
      : [`(${ax(q)}${plus(aq)} - ${top2})/${l}`, `(${ax(q)}${plus(aq)} - ${ax(p)}${plus(-bp)})/${l}`]),
  ].filter((v, i, all) => all.indexOf(v) === i);
  return { via, c, d, l };
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
      return { shape: "same-bottom", start: `${a}/${d} ${minus ? "-" : "+"} ${b}/${d}`, goal: frac(top, d), via: [], numbers: [a, b, d], along: [top] };
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
      return { shape: "whole-and-fraction", start: `${n} ${minus ? "-" : "+"} ${a}/${b}`, goal: `${top}/${b}`, via: [], numbers: [n, a, b], along: [n * b, top] };
    },
  },
  {
    id: "split-top",
    name: "a sum over a number",
    make: (r) => {
      // (x + a)/a → x/a + 1
      const a = r.int(2, 9);
      const x = letter(r);
      return { shape: "split-top", start: `(${x} + ${a})/${a}`, goal: `${x}/${a} + 1`, via: [], numbers: [a], along: [] };
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
      return { shape: "divide", start: `(${a}/${b})/(${c}/${d})`, goal: frac(a * d, b * c), via: [], numbers: [a, b, c, d], along: [a * d, b * c] };
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
      return { shape: "top-factor", start: `(${ax(a, x)} + ${a * b})/${a}`, goal: `${x} + ${b}`, via: [], numbers: [a, a * b], along: [b] };
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
        numbers: [p, a, q, b],
        along: [l, pa, qb, top],
      };
    },
  },
  {
    id: "fraction-equals",
    name: "a fraction equal to a number",
    make: (r) => {
      // (ax + b)/c = d → x
      const x = r.int(1, 6);
      const a = r.int(2, 4);
      const c = r.int(2, 5);
      const b = r.signed(1, 9);
      const top = a * x + b;
      if (top <= 0 || top % c !== 0 || a === c) return null;
      const d = top / c;
      return { shape: "fraction-equals", start: `(${ax(a)}${plus(b)})/${c} = ${d}`, goal: `x = ${x}`, via: [`${ax(a)}${plus(b)} = ${top}`], answer: x, numbers: [a, b, c, d], along: [top, top - b] };
    },
  },
  {
    id: "cancel-equals",
    name: "cancel, then solve",
    make: (r) => {
      // (k² + ak)/k = b → k = b - a
      const k0 = r.int(2, 7);
      const a = r.int(1, 5);
      const k = letter(r);
      return { shape: "cancel-equals", start: `(${k}^2 + ${ax(a, k)})/${k} = ${k0 + a}`, goal: `${k} = ${k0}`, via: [`${k} + ${a} = ${k0 + a}`], answer: k0, numbers: [a, k0 + a], along: [] };
    },
  },
  {
    id: "whole-equals",
    name: "x over a number, equal to a whole number and a fraction",
    make: (r) => {
      // x/q = n ± p/q → x = nq ± p
      const q = r.int(2, 5);
      const n = r.int(1, 3);
      const p = r.int(1, q - 1);
      const sign = r.next() < 0.4 ? "-" : "+";
      const x = sign === "-" ? n * q - p : n * q + p;
      if (gcd(p, q) > 1 || x > 9) return null;
      return {
        shape: "whole-equals",
        start: `x/${q} = ${n} ${sign} ${p}/${q}`,
        goal: `x = ${x}`,
        via: [`x/${q} = ${x}/${q}`],
        answer: x,
        numbers: [q, n, p],
        along: [n * q, x],
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
        numbers: [n, p, q, c, d],
        along: [n * q, top, u, v],
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
        numbers: [p, a, q, b, c, d],
        along: [l, p * b, q * a, top, u, v],
      };
    },
  },
  {
    id: "letter-unlike-equals",
    name: "x over two different bottoms, equal to a number",
    make: (r) => {
      // x/a + x/b = (a + b)m → x = abm
      const a = r.int(2, 4);
      const b = r.int(a + 1, 5);
      const m = r.int(1, 3);
      if (gcd(a, b) > 1) return null;
      const l = a * b;
      const c = (a + b) * m;
      const v = unlikeVia(1, a, 1, b, "+", "x").map((e) => `${e} = ${c}`);
      return {
        shape: "letter-unlike-equals",
        start: `x/${a} + x/${b} = ${c}`,
        goal: `x = ${l * m}`,
        via: [...v, `(${a + b}x)/${l} = ${c}`],
        numbers: [a, b, c],
        along: [l, a + b, l * c, l * m],
      };
    },
  },
  {
    id: "brackets-over-numbers",
    name: "two brackets over different numbers, made one fraction",
    make: (r) => {
      // (x + a)/p ± (x + b)/q → (cx + d)/(pq)
      const p = r.int(2, 3);
      const q = r.int(p + 1, 5);
      const a = r.signed(1, 4);
      const b = r.signed(1, 4);
      const sign = r.next() < 0.5 ? "-" : "+";
      if (gcd(p, q) > 1 || a === b) return null;
      const { via, c, d, l } = bracketsOver(a, p, b, q, sign);
      if (d === 0 || gcd(gcd(c, d), l) > 1) return null;
      return {
        shape: "brackets-over-numbers",
        start: `(${lin(1, a)})/${p} ${sign} (${lin(1, b)})/${q}`,
        goal: `(${lin(c, d)})/${l}`,
        via,
        numbers: [a, p, b, q],
        along: [l, a * q, b * p, c, d],
      };
    },
  },
  {
    id: "brackets-over-numbers-equation",
    name: "two brackets over different numbers, equal to a number",
    make: (r) => {
      // (x + a)/p + (x + b)/q = e → cx + d = el → x
      const p = r.int(2, 3);
      const q = r.int(p + 1, 5);
      const a = r.signed(1, 4);
      const b = r.signed(1, 4);
      const x = r.int(1, 9);
      if (gcd(p, q) > 1 || a === b) return null;
      const { via, c, d, l } = bracketsOver(a, p, b, q, "+");
      const top = c * x + d;
      if (d === 0 || top <= 0 || top % l !== 0) return null;
      const e = top / l;
      return {
        shape: "brackets-over-numbers-equation",
        start: `(${lin(1, a)})/${p} + (${lin(1, b)})/${q} = ${e}`,
        goal: `x = ${x}`,
        via: [...via.map((v) => `${v} = ${e}`), `(${lin(c, d)})/${l} = ${e}`, `${lin(c, d)} = ${top}`],
        answer: x,
        numbers: [a, p, b, q, e],
        along: [l, a * q, b * p, c, d, top, top - d],
      };
    },
  },
  {
    id: "factor-cancel-add",
    name: "factor and cancel, then add fractions with different bottoms",
    make: (r) => {
      // (x² + ax)/(px + pa) + x/q → x/p + x/q → ((p + q)x)/(pq)
      const p = r.int(2, 4);
      const q = r.int(2, 5);
      // A prime a: one way to split p·a.
      const a = [2, 3, 5][r.int(0, 2)];
      if (p === q || gcd(p, q) > 1 || p === a || p * a > 30) return null;
      const rest = ` + x/${q}`;
      return {
        shape: "factor-cancel-add",
        start: `(x^2 + ${a}x)/(${p}x + ${p * a})${rest}`,
        goal: `(${p + q}x)/${p * q}`,
        via: [
          `(x*x + ${a}x)/(${p}x + ${p * a})${rest}`,
          `(x(x + ${a}))/(${p}x + ${p * a})${rest}`,
          `(x(x + ${a}))/(${p}x + ${p}*${a})${rest}`,
          `(x(x + ${a}))/(${p}(x + ${a}))${rest}`,
          `x/${p}${rest}`,
          ...unlikeVia(1, p, 1, q, "+", "x"),
        ],
        numbers: [a, p, p * a, q],
        along: [p * q, p + q],
      };
    },
  },
  {
    id: "factor-cancel-solve",
    name: "factor and cancel, add over x, then solve",
    make: (r) => {
      // (ax + ab)/(x² + bx) + c/x = d → (a + c)/x = d → x = (a + c)/d
      const a = [2, 3, 5][r.int(0, 2)];
      const b = [2, 3, 5][r.int(0, 2)];
      const c = r.int(1, 7);
      const x = r.int(2, 6);
      if (a === b || (a + c) % x !== 0) return null;
      const d = (a + c) / x;
      if (d < 2) return null;
      const rest = ` + ${c}/x = ${d}`;
      return {
        shape: "factor-cancel-solve",
        start: `(${a}x + ${a * b})/(x^2 + ${b}x)${rest}`,
        goal: `x = ${x}`,
        via: [
          `(${a}x + ${a}*${b})/(x^2 + ${b}x)${rest}`,
          `(${a}(x + ${b}))/(x^2 + ${b}x)${rest}`,
          `(${a}(x + ${b}))/(x*x + ${b}x)${rest}`,
          `(${a}(x + ${b}))/(x(x + ${b}))${rest}`,
          `${a}/x${rest}`,
          `${a + c}/x = ${d}`,
        ],
        answer: x,
        numbers: [a, a * b, b, c, d],
        along: [a + c],
      };
    },
  },
];

const pick = (...ids: string[]) => ids.map((id) => all.find((s) => s.id === id)!);

export const shapes: Record<Level, Shape[]> = {
  easy: pick("same-bottom", "whole-and-fraction", "split-top", "top-factor", "divide", "fraction-equals", "cancel-equals", "whole-equals"),
  medium: pick("unlike-bottoms", "mixed-divide", "sum-times", "letter-unlike-equals"),
  // Hard nests one thing in another, with x and y: chapters/nested.ts.
  hard: NESTED.fractions,
};
