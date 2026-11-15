/** Exercise shapes for the chapter "explog" (see ../write.ts). */
import { NESTED } from "./nested";
import { byIds, letter, type Level, type Rng, type Shape } from "../write";

/** A base and an exponent whose power stays small: 2 to 2⁵, 3 to 3³, 5². */
function power(r: Rng, lo = 2): { b: number; n: number; p: number } | null {
  const b = [2, 2, 2, 3, 3, 5][r.int(0, 5)];
  const n = r.int(lo, b === 2 ? 5 : b === 3 ? 3 : 2);
  if (n < lo) return null;
  return { b, n, p: b ** n };
}

const all: Shape[] = [
  {
    id: "log-of-power",
    name: "the log of a power of its base",
    make: (r) => {
      // log_b(bⁿ) → n
      const p = power(r);
      if (!p) return null;
      return { shape: "log-of-power", start: `log_${p.b}(${p.p})`, goal: `${p.n}`, via: [] };
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
      return { shape: "logs-of-powers", start: `ln(${pow(a)}) ${minus ? "-" : "+"} ln(${pow(b)})`, goal: `${k}ln(${x})`, via: [] };
    },
  },
  {
    id: "split-number-log",
    name: "the log of a number times x, less the log of x",
    make: (r) => {
      // log_b(bⁿ·x) − log_b(x) → n
      const p = power(r);
      if (!p) return null;
      const x = letter(r);
      return {
        shape: "split-number-log",
        start: `log_${p.b}(${p.p}${x}) - log_${p.b}(${x})`,
        goal: `${p.n}`,
        via: [`log_${p.b}(${p.p}) + log_${p.b}(${x}) - log_${p.b}(${x})`],
      };
    },
  },
  {
    id: "exp-of-power-log",
    name: "e to a multiple of ln(x), times x",
    make: (r) => {
      // e^(a·ln(x))·xᵇ → x^(a + b)
      const a = r.int(2, 4);
      const b = r.int(1, 3);
      const x = letter(r);
      const pow = (k: number) => (k === 1 ? x : `${x}^${k}`);
      return {
        shape: "exp-of-power-log",
        start: `e^(${a}ln(${x}))·${pow(b)}`,
        goal: `${x}^${a + b}`,
        via: [`e^(ln(${x}^${a}))·${pow(b)}`, `${x}^${a}·${pow(b)}`],
      };
    },
  },
];

export const shapes: Record<Level, Shape[]> = {
  easy: byIds(all, "log-of-power", "logs-of-powers"),
  medium: byIds(all, "split-number-log", "exp-of-power-log"),
  // Hard nests one thing in another, with x and y: chapters/nested.ts.
  hard: NESTED.explog,
};
