/** Exercise shapes for the chapter "roots" (see ../write.ts). */
import { NESTED } from "./nested";
import { walked } from "../walk";
import { walks } from "../walks/roots";
import { ax, plus, byIds, letter, type Level, type Shape } from "../write";

/** Numbers with no square factor, to stay inside a root. */
const SQUAREFREE = [2, 3, 5, 6, 7];
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
      return { shape: "cube-simplify", start: `root_3(${n})`, goal: `${k}root_3(${m})`, via: [] };
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
      return { shape: "nth-root-of-power", start: nroot(n, `${x}^${n * m}`), goal: `${x}^${m}`, via: [] };
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
      return { shape: "simplify", start: `√${n}`, goal: kroot(k, m), via: [] };
    },
  },
  {
    id: "square-times-letter",
    name: "a square times a letter, under a root",
    make: (r) => {
      // √(k²x) → k√x
      const k = r.int(2, 5);
      const x = letter(r);
      return { shape: "square-times-letter", start: `√(${k * k}${x})`, goal: kroot(k, x), via: [] };
    },
  },
  {
    id: "root-times-bracket",
    name: "a root times a bracket",
    make: (r) => {
      // √x(√x + a) → x + a√x
      const a = r.int(1, 6);
      const x = letter(r);
      return { shape: "root-times-bracket", start: `√${x}(√${x}${plus(a)})`, goal: `${x} + ${kroot(a, x)}`, via: [] };
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
      return { shape: "simplify-with-letter", start: `√(${n}${x}^2)`, goal: `${k}${x}√${m}`, via: [`${k}√(${m}${x}^2)`] };
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
      };
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
      return { shape: "add-roots", start: `√${n} + ${kroot(c, m)}`, goal: kroot(k + c, m), via: [] };
    },
  },
];

export const shapes: Record<Level, Shape[]> = {
  easy: [...byIds(all, "simplify", "square-times-letter", "root-times-bracket", "add-roots", "cube-simplify", "nth-root-of-power"), ...walks.easy.map((w) => walked(w, "roots"))],
  medium: [...byIds(all, "simplify-with-letter", "square-of-root-plus", "cube-root-and-like"), ...walks.medium.map((w) => walked(w, "roots"))],
  // Hard nests one thing in another, with x and y: chapters/nested.ts; and walks every way at once.
  hard: [...NESTED.roots, ...walks.hard.map((w) => walked(w, "roots"))],
};
