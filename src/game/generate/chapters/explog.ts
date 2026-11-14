/** Exercise shapes for the chapter "explog" (see ../write.ts). */
import { NESTED } from "./nested";
import { gcd, plus, byIds, type Level, type Rng, type Shape } from "../write";

/** One of a few letters, mostly x. */
const letter = (r: Rng) => (r.next() < 0.6 ? "x" : ["y", "a", "t", "n"][r.int(0, 3)]);
/** A base and an exponent whose power stays small: 2 to 2⁵, 3 to 3³, 5². */
function power(r: Rng, lo = 2): { b: number; n: number; p: number } | null {
  const b = [2, 2, 2, 3, 3, 5][r.int(0, 5)];
  const n = r.int(lo, b === 2 ? 5 : b === 3 ? 3 : 2);
  if (n < lo) return null;
  return { b, n, p: b ** n };
}
/** "a·x" with the product sign written as the hand-made exercises do: "2x". */
const times = (a: number, x: string) => (a === 1 ? x : `${a}${x}`);

const all: Shape[] = [
  {
    id: "exp-equals",
    name: "e to a multiple of x, equal to a number",
    make: (r) => {
      // e^(ax) = c → x = ln(c)/a
      const a = r.int(2, 5);
      const c = r.int(2, 12);
      const x = letter(r);
      if (c === a) return null;
      return { shape: "exp-equals", start: `e^(${times(a, x)}) = ${c}`, goal: `${x} = ln(${c})/${a}`, via: [], numbers: [a, c], along: [] };
    },
  },
  {
    id: "log-equals",
    name: "a log equal to a number",
    make: (r) => {
      // log_b(y) = n → y = bⁿ
      const p = power(r);
      if (!p) return null;
      const y = letter(r);
      return { shape: "log-equals", start: `log_${p.b}(${y}) = ${p.n}`, goal: `${y} = ${p.p}`, via: [], numbers: [p.b, p.n], along: [p.p] };
    },
  },
  {
    id: "log-of-power",
    name: "the log of a power of its base",
    make: (r) => {
      // log_b(bⁿ) → n
      const p = power(r);
      if (!p) return null;
      return { shape: "log-of-power", start: `log_${p.b}(${p.p})`, goal: `${p.n}`, via: [], numbers: [p.b, p.p], along: [p.n] };
    },
  },
  {
    id: "logs-of-powers",
    name: "logs of powers of one letter",
    make: (r) => {
      // ln(xᵃ) ± ln(xᵇ) → (a ± b)ln(x)
      const a = r.int(2, 5);
      const b = r.int(1, 4);
      const minus = r.next() < 0.5;
      const k = minus ? a - b : a + b;
      const x = letter(r);
      if (k < 2 || a === b) return null;
      const pow = (n: number) => (n === 1 ? x : `${x}^${n}`);
      return { shape: "logs-of-powers", start: `ln(${pow(a)}) ${minus ? "-" : "+"} ln(${pow(b)})`, goal: `${k}ln(${x})`, via: [], numbers: [a, b], along: [k] };
    },
  },
  {
    id: "same-base-product",
    name: "two powers of e multiplied",
    make: (r) => {
      // e^(ax)·e^(bx) = c → x = ln(c)/(a + b)
      const a = r.int(1, 4);
      const b = r.int(1, 3);
      const c = r.int(2, 12);
      const x = letter(r);
      if (c === a + b) return null;
      const ex = (k: number) => (k === 1 ? `e^${x}` : `e^(${times(k, x)})`);
      return { shape: "same-base-product", start: `${ex(a)}·${ex(b)} = ${c}`, goal: `${x} = ln(${c})/${a + b}`, via: [`e^(${times(a, x)} + ${times(b, x)}) = ${c}`], numbers: [a, b, c], along: [a + b] };
    },
  },
  {
    id: "log-sum-equals",
    name: "a sum of logs equal to a number",
    make: (r) => {
      // log_b(n) + log_b(bᵏ) = m → n = b^(m - k)
      const b = r.int(2, 3);
      const k = r.int(1, b === 2 ? 3 : 2);
      const j = r.int(1, b === 2 ? 3 : 2);
      const m = k + j;
      const n = letter(r);
      return {
        shape: "log-sum-equals",
        start: `log_${b}(${n}) + log_${b}(${b ** k}) = ${m}`,
        goal: `${n} = ${b ** j}`,
        via: [`log_${b}(${b ** k}${n}) = ${m}`],
        numbers: [b, b ** k, m],
        along: [b ** m, b ** j],
      };
    },
  },
  {
    id: "log-with-e",
    name: "an ln with e inside",
    make: (r) => {
      // ln(x/eᵏ) = n → x = e^(n + k);  ln(eᵏx) = n → x = e^(n - k)
      const k = r.int(1, 2);
      const n = r.int(2, 5);
      const over = r.next() < 0.5;
      const m = over ? n + k : n - k;
      const x = letter(r);
      const ek = k === 1 ? "e" : `e^${k}`;
      if (m < 2 || m > 6) return null;
      return {
        shape: "log-with-e",
        start: over ? `ln(${x}/${ek}) = ${n}` : `ln(${k === 1 ? `e${x}` : `${ek}·${x}`}) = ${n}`,
        goal: `${x} = e^${m}`,
        via: [],
        numbers: [k, n],
        along: [m],
      };
    },
  },
  {
    id: "times-power-equals",
    name: "a number times a power",
    make: (r) => {
      // c·bˣ = c·bⁿ → x = n
      const p = power(r);
      const c = r.int(2, 5);
      if (!p || c === p.b || c * p.p > 60) return null;
      return {
        shape: "times-power-equals",
        start: `${c}·${p.b}^x = ${c * p.p}`,
        goal: `x = ${p.n}`,
        via: [`${p.b}^x = ${c * p.p}/${c}`, `x = log_${p.b}(${p.p})`],
        answer: p.n,
        numbers: [c, p.b, c * p.p],
        along: [p.p],
      };
    },
  },
  {
    id: "isolate-exp",
    name: "a power of e to get on its own, then a linear exponent",
    make: (r) => {
      // a·e^(bx + c) + d = a·k + d → x = (ln(k) - c)/b
      const a = r.int(2, 3);
      const b = r.int(2, 3);
      const c = r.signed(1, 3);
      const k = r.int(2, 7);
      const d = r.signed(1, 5);
      const rhs = a * k + d;
      if (rhs <= 0 || k === a) return null;
      return {
        shape: "isolate-exp",
        start: `${a}e^(${times(b, "x")}${plus(c)})${plus(d)} = ${rhs}`,
        goal: `x = (ln(${k})${plus(-c)})/${b}`,
        via: [`${a}e^(${times(b, "x")}${plus(c)}) = ${a * k}`, `e^(${times(b, "x")}${plus(c)}) = ${k}`],
        numbers: [a, b, c, d, rhs],
        along: [a * k, k],
      };
    },
  },
  {
    id: "isolate-ln",
    name: "an ln taken away, to get on its own and undo",
    make: (r) => {
      // d - a·ln(x + c) = d - a·k → x = eᵏ - c
      const a = r.int(2, 3);
      const k = r.int(2, 4);
      const c = r.signed(1, 4);
      const e = r.int(1, 5);
      const d = a * k + e;
      if (d > 30) return null;
      return {
        shape: "isolate-ln",
        start: `${d} - ${a}ln(x${plus(c)}) = ${e}`,
        goal: `x = e^${k}${plus(-c)}`,
        via: [`${a}ln(x${plus(c)}) = ${a * k}`, `ln(x${plus(c)}) = ${k}`],
        numbers: [d, a, c, e],
        along: [a * k, k],
      };
    },
  },
  {
    id: "undo-log-linear",
    name: "a number times a log of a linear expression",
    make: (r) => {
      // a·log_B(px + q) = a·n, with px + q = Bⁿ
      const B = r.int(2, 3);
      const n = r.int(2, B === 2 ? 4 : 3);
      const p = r.int(2, 3);
      const x = r.int(2, 5);
      const q = B ** n - p * x;
      const a = r.int(2, 3);
      if (q === 0 || Math.abs(q) > 9 || gcd(p, q) > 1 || a * n > 30) return null;
      const lin = `${times(p, "x")}${plus(q)}`;
      return {
        shape: "undo-log-linear",
        start: `${a}log_${B}(${lin}) = ${a * n}`,
        goal: `x = ${x}`,
        via: [`log_${B}(${lin}) = ${n}`, `${lin} = ${B ** n}`],
        answer: x,
        numbers: [a, B, p, q, a * n],
        along: [n, B ** n, p * x],
      };
    },
  },
  {
    id: "powers-in-logs",
    name: "logs of powers to collect, then solve",
    make: (r) => {
      // L(xᵃ) ± L(xᵇ) + c = d → x = base^m, L = ln or log_2
      const ln = r.next() < 0.5;
      const a = r.int(2, 4);
      const b = r.int(1, 2);
      const minus = r.next() < 0.5;
      const s = minus ? a - b : a + b;
      const m = r.int(2, 3);
      const c = r.signed(1, 4);
      const d = s * m + c;
      if (s < 2 || a === b || d <= 0 || d > 20) return null;
      const L = ln ? "ln" : "log_2";
      const pow = (k: number) => (k === 1 ? "x" : `x^${k}`);
      return {
        shape: "powers-in-logs",
        start: `${L}(${pow(a)}) ${minus ? "-" : "+"} ${L}(${pow(b)})${plus(c)} = ${d}`,
        goal: ln ? `x = e^${m}` : `x = ${2 ** m}`,
        via: [`${s}${L}(x)${plus(c)} = ${d}`, `${s}${L}(x) = ${s * m}`],
        numbers: [a, b, c, d],
        along: [s, s * m, m],
      };
    },
  },
  {
    id: "split-log",
    name: "the log of a product or a quotient, split and worked out",
    make: (r) => {
      // log_B(Bᵏ·x) = n → x = B^(n - k);  log_B(x/Bᵏ) = n → x = B^(n + k)
      const B = r.int(2, 3);
      const k = r.int(2, B === 2 ? 4 : 2);
      const over = r.next() < 0.5;
      const m = r.int(1, B === 2 ? 4 : 3);
      const n = over ? m - k : m + k;
      const x = letter(r);
      if (n < 1 || B ** m > 27) return null;
      return {
        shape: "split-log",
        start: over ? `log_${B}(${x}/${B ** k}) = ${n}` : `log_${B}(${B ** k}${x}) = ${n}`,
        goal: `${x} = ${B ** m}`,
        via: [over ? `log_${B}(${x}) - ${k} = ${n}` : `${k} + log_${B}(${x}) = ${n}`],
        numbers: [B ** k, n],
        along: [k, m],
      };
    },
  },
];

export const shapes: Record<Level, Shape[]> = {
  easy: byIds(all, "exp-equals", "log-equals", "log-of-power", "logs-of-powers", "same-base-product", "log-sum-equals", "log-with-e", "times-power-equals"),
  medium: byIds(all, "isolate-exp", "isolate-ln", "undo-log-linear", "split-log", "powers-in-logs"),
  // Hard nests one thing in another, with x and y: chapters/nested.ts.
  hard: NESTED.explog,
};
