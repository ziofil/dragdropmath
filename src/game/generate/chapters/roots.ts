/** Exercise shapes for the chapter "roots" (see ../write.ts). */
import { NESTED } from "./nested";
import { ax, plus, byIds, type Level, type Rng, type Shape } from "../write";

/** Numbers with no square factor, to stay inside a root. */
const SQUAREFREE = [2, 3, 5, 6, 7];
/** One of a few letters, mostly x. */
const letter = (r: Rng) => (r.next() < 0.6 ? "x" : ["y", "a", "t", "n"][r.int(0, 3)]);
/** k√m: "√3", "2√3". */
const kroot = (k: number, m: number | string) => `${k === 1 ? "" : k}√${typeof m === "number" ? m : m.length > 1 ? `(${m})` : m}`;

/** ⁿ√ as the exercises write it: "∛(x)" is root_3(x). */
const nroot = (n: number, inside: string) => (n === 2 ? `√(${inside})` : `root_${n}(${inside})`);
/** Cube and higher roots (the square roots are below). */
const higher: Shape[] = [
  {
    id: "cube-simplify",
    name: "a cube out of a cube root",
    make: (r) => {
      // ∛(k³m) → k∛m
      const k = r.int(2, 3);
      const m = r.int(2, 3);
      const n = k ** 3 * m;
      // ∛16, ∛24 (the start's numbers stay at 30 or under)
      return { shape: "cube-simplify", start: `root_3(${n})`, goal: `${k}root_3(${m})`, via: [], numbers: [n], along: [k ** 3, k, m] };
    },
  },
  {
    id: "nth-root-equals",
    name: "a cube or higher root equal to a number",
    make: (r) => {
      // ⁿ√x = a → x = aⁿ
      const n = r.int(3, 5);
      const a = n === 3 ? r.int(2, 3) : 2;
      const x = letter(r);
      return { shape: "nth-root-equals", start: `${nroot(n, x)} = ${a}`, goal: `${x} = ${a ** n}`, via: [], numbers: [a, n], along: [a ** n] };
    },
  },
  {
    id: "nth-root-of-power",
    name: "a cube or fourth root of a power",
    make: (r) => {
      // ⁿ√(x^(nm)) → xᵐ
      const n = r.int(3, 4);
      const m = r.int(2, 3);
      const x = letter(r);
      return { shape: "nth-root-of-power", start: nroot(n, `${x}^${n * m}`), goal: `${x}^${m}`, via: [], numbers: [n * m], along: [m] };
    },
  },
  {
    id: "cube-root-and-like",
    name: "the cube root of a cube, and a like term",
    make: (r) => {
      // ∛(k³x³) + m·x → (k + m)x
      const k = r.int(2, 3);
      const m = r.int(1, 4);
      const x = letter(r);
      return {
        shape: "cube-root-and-like",
        start: `root_3(${k ** 3}${x}^3) + ${ax(m, x)}`,
        goal: ax(k + m, x),
        via: [`${k}${x} + ${ax(m, x)}`],
        numbers: [k ** 3, m],
        along: [k, k + m],
      };
    },
  },
];

const all: Shape[] = [
  ...higher,
  {
    id: "simplify",
    name: "a square out of a root",
    make: (r) => {
      // √(k²m) → k√m
      const k = r.int(2, 5);
      const m = SQUAREFREE[r.int(0, SQUAREFREE.length - 1)];
      const n = k * k * m;
      if (n > 30) return null;
      return { shape: "simplify", start: `√${n}`, goal: kroot(k, m), via: [], numbers: [n], along: [k * k, k, m] };
    },
  },
  {
    id: "square-times-letter",
    name: "a square times a letter, under a root",
    make: (r) => {
      // √(k²x) → k√x
      const k = r.int(2, 5);
      const x = letter(r);
      return { shape: "square-times-letter", start: `√(${k * k}${x})`, goal: kroot(k, x), via: [], numbers: [k * k], along: [k] };
    },
  },
  {
    id: "root-equals",
    name: "a root equal to a number",
    make: (r) => {
      // √x = a → x = a²
      const a = r.int(2, 7);
      const x = letter(r);
      return { shape: "root-equals", start: `√${x} = ${a}`, goal: `${x} = ${a * a}`, via: [], numbers: [a], along: [a * a] };
    },
  },
  {
    id: "root-times-bracket",
    name: "a root times a bracket",
    make: (r) => {
      // √x(√x + a) → x + a√x
      const a = r.int(1, 6);
      const x = letter(r);
      return { shape: "root-times-bracket", start: `√${x}(√${x}${plus(a)})`, goal: `${x} + ${kroot(a, x)}`, via: [], numbers: [a], along: [a] };
    },
  },
  {
    id: "simplify-with-letter",
    name: "a number and a square letter out of a root",
    make: (r) => {
      // √(k²m·x²) → kx√m
      const k = r.int(2, 3);
      const m = SQUAREFREE[r.int(0, SQUAREFREE.length - 1)];
      const n = k * k * m;
      const x = letter(r);
      if (n > 30) return null;
      return { shape: "simplify-with-letter", start: `√(${n}${x}^2)`, goal: `${k}${x}√${m}`, via: [`${k}√(${m}${x}^2)`], numbers: [n], along: [k * k, k, m] };
    },
  },
  {
    id: "square-of-root-plus",
    name: "the square of a root plus a number",
    make: (r) => {
      // (√x + a)² → x + 2a√x + a²
      const a = r.int(2, 4);
      const x = letter(r);
      return {
        shape: "square-of-root-plus",
        start: `(√${x} + ${a})^2`,
        goal: `${x} + ${kroot(2 * a, x)} + ${a * a}`,
        via: [`(√${x} + ${a})(√${x} + ${a})`, `${x} + ${kroot(a, x)} + ${kroot(a, x)} + ${a * a}`],
        numbers: [a],
        along: [2 * a, a * a],
      };
    },
  },
  {
    id: "times-root-plus-equals",
    name: "a number times the root of x plus a number",
    make: (r) => {
      // a√(x + b) = c → x = (c/a)² - b
      const a = r.int(2, 4);
      const q = r.int(2, 4);
      const c = a * q;
      const b = r.signed(1, 9);
      const x = q * q - b;
      if (x <= 0 || c > 30) return null;
      return {
        shape: "times-root-plus-equals",
        start: `${a}√(${ax(1)}${plus(b)}) = ${c}`,
        goal: `x = ${x}`,
        via: [`√(${ax(1)}${plus(b)}) = ${q}`],
        numbers: [a, b, c],
        along: [q, q * q, x],
      };
    },
  },
  {
    id: "roots-sum-equals",
    name: "two roots of x that add up, equal to a number",
    make: (r) => {
      // √(k²x) + c√x = d → x = q²
      const k = r.int(2, 4);
      const c = r.int(1, 3);
      const q = r.int(2, 5);
      const d = (k + c) * q;
      const x = letter(r);
      if (d > 30) return null;
      return {
        shape: "roots-sum-equals",
        start: `√(${k * k}${x}) + ${kroot(c, x)} = ${d}`,
        goal: `${x} = ${q * q}`,
        via: [`${kroot(k + c, x)} = ${d}`, `√${x} = ${q}`],
        numbers: [k * k, c, d],
        along: [k, k + c, q, q * q],
      };
    },
  },
  {
    id: "times-root-equals",
    name: "a number times a root, equal to a number",
    make: (r) => {
      // a√x = b → x = (b/a)²
      const a = r.int(2, 5);
      const c = r.int(2, 5);
      const b = a * c;
      const x = letter(r);
      if (b > 30) return null;
      return { shape: "times-root-equals", start: `${a}√${x} = ${b}`, goal: `${x} = ${c * c}`, via: [`√${x} = ${c}`], numbers: [a, b], along: [c, c * c] };
    },
  },
  {
    id: "add-roots",
    name: "roots that become like terms",
    make: (r) => {
      // √(k²m) + c√m → (k + c)√m
      const k = r.int(2, 5);
      const m = SQUAREFREE[r.int(0, SQUAREFREE.length - 1)];
      const c = r.int(1, 3);
      const n = k * k * m;
      if (n > 30) return null;
      return { shape: "add-roots", start: `√${n} + ${kroot(c, m)}`, goal: kroot(k + c, m), via: [], numbers: [n, c], along: [k * k, k, k + c] };
    },
  },
  {
    id: "root-plus-equals",
    name: "a root of x plus a number",
    make: (r) => {
      // √(x + b) = c → x = c² - b
      const c = r.int(2, 5);
      const b = r.signed(1, 9);
      const x = c * c - b;
      if (x <= 0 || x > 30) return null;
      return { shape: "root-plus-equals", start: `√(${ax(1)}${plus(b)}) = ${c}`, goal: `x = ${x}`, via: [], numbers: [b, c], along: [c * c, x] };
    },
  },
  {
    id: "square-of-times-root",
    name: "the square of a number times a root",
    make: (r) => {
      // (a√x)² = b → x = b/a²
      const a = r.int(2, 3);
      const x = r.int(2, 7);
      const b = a * a * x;
      if (b > 30) return null;
      return { shape: "square-of-times-root", start: `(${a}√x)^2 = ${b}`, goal: `x = ${x}`, via: [`${a * a}x = ${b}`], answer: x, numbers: [a, b], along: [a * a] };
    },
  },
];

export const shapes: Record<Level, Shape[]> = {
  easy: byIds(all, "simplify", "square-times-letter", "root-equals", "root-times-bracket", "times-root-equals", "add-roots", "root-plus-equals", "square-of-times-root", "cube-simplify", "nth-root-equals", "nth-root-of-power"),
  medium: byIds(all, "simplify-with-letter", "square-of-root-plus", "times-root-plus-equals", "roots-sum-equals", "cube-root-and-like"),
  // Hard nests one thing in another, with x and y: chapters/nested.ts.
  hard: NESTED.roots,
};
