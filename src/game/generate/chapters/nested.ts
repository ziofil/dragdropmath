/**
 * Hard exercises for the chapters whose maths nests: one structure inside
 * another (a power of a quotient of powers, a fraction of fractions, a log
 * of a root of a power of e, ...), with two letters, x and y, so nothing
 * collapses too soon. See ../write.ts.
 */
import { plus, type Rng, type Shape } from "../write";

/** xⁿ as written: "x", "x^3". */
const pw = (x: string, n: number) => (n === 1 ? x : `${x}^${n}`);
/** A coefficient in front: "3x", "x". */
const co = (c: number, s: string) => (c === 1 ? s : `${c}${s}`);
/** a/b with a product on the bottom kept together. */
const over = (top: string, bottom: string) => `${/[·+\-]/.test(top) || /^\d+[a-z]/.test(top) ? `(${top})` : top}/${/[·+\-]/.test(bottom) || /^\d+[a-z]/.test(bottom) ? `(${bottom})` : bottom}`;
const pick = <T,>(r: Rng, xs: readonly T[]): T => xs[r.int(0, xs.length - 1)];

const powers: Shape[] = [
  {
    id: "power-of-quotient",
    name: "a power of a quotient of powers of x and y",
    make: (r) => {
      // ((k·xᵃyᵇ)/(xᶜyᵈ))ⁿ → kⁿ·x^((a−c)n) y^((b−d)n), y on top or on the bottom
      const n = r.int(2, 3);
      const k = r.int(2, 3);
      if (k ** n > 30) return null;
      const c = r.int(1, 3);
      const e = r.int(1, 2);
      const a = c + e;
      const b = r.int(1, 4);
      const d = r.int(1, 4);
      if (b === d || Math.abs(b - d) > 2) return null;
      const ey = Math.abs(b - d);
      const inner = b > d ? `${k}${pw("x", e)}·${pw("y", ey)}` : `(${k}${pw("x", e)})/${pw("y", ey)}`;
      const goal = b > d ? `${k ** n}${pw("x", e * n)}·${pw("y", ey * n)}` : `(${k ** n}${pw("x", e * n)})/${pw("y", ey * n)}`;
      return {
        shape: "power-of-quotient",
        start: `(${over(`${k}${pw("x", a)}·${pw("y", b)}`, `${pw("x", c)}·${pw("y", d)}`)})^${n}`,
        goal,
        // As one does it: y over y first (a negative power goes back under the bar), then x over x.
        via: b > d ? [`(${over(`${k}${pw("x", e)}·${pw("y", b)}`, pw("y", d))})^${n}`, `(${inner})^${n}`] : [`(${over(`${k}${pw("x", a)}·y^(-${ey})`, pw("x", c))})^${n}`, `(${over(`${k}${pw("x", a)}`, `${pw("x", c)}·${pw("y", ey)}`)})^${n}`, `(${inner})^${n}`],
        numbers: [k, a, b, c, d, n],
        along: [e, ey, e * n, ey * n, k ** n],
      };
    },
  },
  {
    id: "quotient-of-powers",
    name: "powers of products of x and y, one over the other",
    make: (r) => {
      // (xᵃy)ᵐ/(xyᵇ)ⁿ → x^(am − n) / y^(bn − m)
      const a = r.int(2, 3);
      const m = r.int(2, 3);
      const n = 2;
      const b = r.int(2, 3);
      const ex = a * m - n;
      const ey = b * n - m;
      if (ex < 1 || ey < 1) return null;
      return {
        shape: "quotient-of-powers",
        start: `(${pw("x", a)}·y)^${m}/(x·${pw("y", b)})^${n}`,
        goal: `${pw("x", ex)}/${pw("y", ey)}`,
        via: [over(`${pw("x", a * m)}·${pw("y", m)}`, `${pw("x", n)}·${pw("y", b * n)}`), over(`${pw("x", a * m)}·y^(-${ey})`, pw("x", n)), over(pw("x", a * m), `${pw("x", n)}·${pw("y", ey)}`)],
        numbers: [a, m, n, b],
        along: [a * m, b * n, ex, ey],
      };
    },
  },
  {
    id: "power-of-quotient-and-more",
    name: "a power of a quotient, and a product of powers, collected",
    make: (r) => {
      // c·xᵖ·x^q·y² ± ((xᵃy)/xᵇ)² → (c ± 1)xᵏy², k = 2(a − b) = p + q
      const e = r.int(2, 3);
      const k = 2 * e;
      const b = r.int(1, 2);
      const a = b + e;
      const p = r.int(1, k - 1);
      const q = k - p;
      const c = r.int(2, 4);
      const minus = r.next() < 0.5;
      const sq = `(${over(`${pw("x", a)}·y`, pw("x", b))})^2`;
      const prod = `${co(c, pw("x", p))}·${pw("x", q)}·y^2`;
      return {
        shape: "power-of-quotient-and-more",
        start: `${prod} ${minus ? "-" : "+"} ${sq}`,
        goal: `${co(minus ? c - 1 : c + 1, pw("x", k))}·y^2`,
        via: [`${prod} ${minus ? "-" : "+"} (${pw("x", e)}·y)^2`, `${prod} ${minus ? "-" : "+"} ${pw("x", k)}·y^2`, `${co(c, pw("x", k))}·y^2 ${minus ? "-" : "+"} ${pw("x", k)}·y^2`],
        numbers: [c, p, q, a, b],
        along: [e, k],
      };
    },
  },
];

const roots: Shape[] = [
  {
    id: "root-of-quotient",
    name: "the root of a quotient of a number and powers of x and y",
    make: (r) => {
      // √((k²m·x^(2a+1)·y)/(m·x·y)) → k·xᵃ
      const k = r.int(2, 3);
      const m = r.int(2, 3);
      const a = r.int(1, 2);
      return {
        shape: "root-of-quotient",
        start: `√(${over(`${k * k * m}${pw("x", 2 * a + 1)}·y`, `${m}x·y`)})`,
        goal: co(k, pw("x", a)),
        via: [`√(${k * k}${pw("x", 2 * a)})`],
        numbers: [k * k * m, m, 2 * a + 1],
        along: [k * k, 2 * a, k],
      };
    },
  },
  {
    id: "root-of-powers",
    name: "the root of a quotient of powers of x and y",
    make: (r) => {
      // √((x^(2a+2b)·yᶜ)/(x^(2b)·y^(c+2d))) → xᵃ/yᵈ
      const a = r.int(1, 2);
      const b = r.int(1, 2);
      const c = r.int(1, 3);
      const d = 1;
      return {
        shape: "root-of-powers",
        start: `√(${over(`${pw("x", 2 * a + 2 * b)}·${pw("y", c)}`, `${pw("x", 2 * b)}·${pw("y", c + 2 * d)}`)})`,
        goal: `${pw("x", a)}/${pw("y", d)}`,
        via: [`√(${over(`${pw("x", 2 * a + 2 * b)}·y^(-${2 * d})`, pw("x", 2 * b))})`, `√(${over(pw("x", 2 * a + 2 * b), `${pw("x", 2 * b)}·${pw("y", 2 * d)}`)})`, `√(${pw("x", 2 * a)}/${pw("y", 2 * d)})`],
        numbers: [2 * a + 2 * b, c, 2 * b, c + 2 * d],
        along: [2 * a, 2 * d],
      };
    },
  },
  {
    id: "root-over-power",
    name: "a root of a product over a half power",
    make: (r) => {
      // √(k²·x^(2a)·y)/y^(1/2) + m·xᵃ → (k + m)xᵃ
      const k = r.int(2, 5);
      const a = r.int(1, 3);
      const m = r.int(1, 4);
      return {
        shape: "root-over-power",
        start: `√(${k * k}${pw("x", 2 * a)}·y)/y^(1/2) + ${co(m, pw("x", a))}`,
        goal: co(k + m, pw("x", a)),
        via: [`(${k}√(${pw("x", 2 * a)}·y))/y^(1/2) + ${co(m, pw("x", a))}`, `${co(k, pw("x", a))}·√y/y^(1/2) + ${co(m, pw("x", a))}`, `${co(k, pw("x", a))} + ${co(m, pw("x", a))}`],
        numbers: [k * k, 2 * a, m],
        along: [k, a, k + m],
      };
    },
  },
  {
    id: "root-of-root",
    name: "a root of a root of powers of x and y",
    make: (r) => {
      // √(∛(x^(6a)·y^(6b))) → xᵃyᵇ, or the other way round, ∛(√(...))
      const a = r.int(1, 2);
      const b = r.int(1, 2);
      const cubeInside = r.next() < 0.5;
      const inside = `${pw("x", 6 * a)}·${pw("y", 6 * b)}`;
      const mid = cubeInside ? `${pw("x", 2 * a)}·${pw("y", 2 * b)}` : `${pw("x", 3 * a)}·${pw("y", 3 * b)}`;
      return {
        shape: "root-of-root",
        start: cubeInside ? `√(root_3(${inside}))` : `root_3(√(${inside}))`,
        goal: `${pw("x", a)}·${pw("y", b)}`,
        via: [cubeInside ? `√(${mid})` : `root_3(${mid})`],
        numbers: [6 * a, 6 * b],
        along: [2 * a, 3 * a, 2 * b, 3 * b],
      };
    },
  },
  {
    id: "cube-root-of-quotient",
    name: "the cube root of a quotient of a number and powers of x and y",
    make: (r) => {
      // ∛((8m·x^(3a+1)·y)/(m·x·y)) → 2xᵃ
      const m = r.int(2, 3);
      const a = r.int(1, 2);
      return {
        shape: "cube-root-of-quotient",
        start: `root_3(${over(`${8 * m}${pw("x", 3 * a + 1)}·y`, `${m}x·y`)})`,
        goal: co(2, pw("x", a)),
        via: [`root_3(8${pw("x", 3 * a)})`],
        numbers: [8 * m, m, 3 * a + 1],
        along: [8, 3 * a, 2],
      };
    },
  },
];

/** Bottoms with no common factor, and their product small. */
const COPRIME: [number, number][] = [
  [2, 3],
  [2, 5],
  [3, 4],
  [3, 5],
  [2, 7],
  [4, 5],
];

const fractions: Shape[] = [
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
        numbers: [a, b, ab],
        along: [a + b],
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
        via: [`((${p}x)/y)·((${q}y)/x^2) + ${s}/x`, `(${p * q}x·y)/(y·x^2) + ${s}/x`, `${p * q}/x + ${s}/x`],
        numbers: [p, q, s],
        along: [p * q, p * q + s],
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
        via: [`((${p}x)/y)·((${q}x)/y) - ${co(s, "x^2")}/y^2`, `(${p * q}x^2)/y^2 - ${co(s, "x^2")}/y^2`],
        numbers: [p, q, s],
        along: [p * q, p * q - s],
      };
    },
  },
];

const explog: Shape[] = [
  {
    id: "fraction-of-logs",
    name: "a log over a log, of powers of x and y",
    make: (r) => {
      // ln(x^(pa)·yᵃ)/ln(xᵖ·y) → a
      const p = r.int(2, 3);
      const a = r.int(2, 3);
      const top = `${p * a}ln(x) + ${a}ln(y)`;
      const bottom = `${p}ln(x) + ln(y)`;
      return {
        shape: "fraction-of-logs",
        start: `ln(${pw("x", p * a)}·${pw("y", a)})/ln(${pw("x", p)}·y)`,
        goal: `${a}`,
        via: [`(${top})/ln(${pw("x", p)}·y)`, `(${top})/(${bottom})`, `(${a}(${bottom}))/(${bottom})`],
        numbers: [p * a, a, p],
        along: [a],
      };
    },
  },
  {
    id: "exp-of-quotient",
    name: "e to a quotient of powers of x and y, to get on its own and undo",
    make: (r) => {
      // c·e^((xᵃyᵇ)/(x^(a−1)y^(b−1))) + d = ck + d → x = ln(k)/y
      const a = r.int(2, 4);
      const b = r.int(2, 3);
      const c = r.int(2, 3);
      const k = r.int(2, 7);
      const d = r.signed(1, 5);
      const rhs = c * k + d;
      if (rhs <= 0 || k === c) return null;
      const q = over(`${pw("x", a)}·${pw("y", b)}`, `${pw("x", a - 1)}·${pw("y", b - 1)}`);
      return {
        shape: "exp-of-quotient",
        start: `${c}e^(${q})${plus(d)} = ${rhs}`,
        goal: `x = ln(${k})/y`,
        via: [`${c}e^(x·y)${plus(d)} = ${rhs}`, `e^(x·y) = ${k}`, `x·y = ln(${k})`],
        numbers: [c, a, b, d, rhs],
        along: [c * k, k],
      };
    },
  },
  {
    id: "log-of-quotient",
    name: "the log of a quotient of powers of x and y, equal to a number",
    make: (r) => {
      // log₂((xᵃyᵇ)/(xᶜyᵇ)) = em → x = 2ᵐ, e = a − c
      const e = r.int(2, 3);
      const m = r.int(2, 3);
      const c = r.int(1, 2);
      const b = r.int(1, 3);
      const n = e * m;
      return {
        shape: "log-of-quotient",
        start: `log_2(${over(`${pw("x", c + e)}·${pw("y", b)}`, `${pw("x", c)}·${pw("y", b)}`)}) = ${n}`,
        goal: `x = ${2 ** m}`,
        via: [`log_2(${pw("x", e)}) = ${n}`, `${e}log_2(x) = ${n}`, `log_2(x) = ${m}`],
        numbers: [c + e, b, c, n],
        along: [e, m, 2 ** m],
      };
    },
  },
  {
    id: "log-of-root-of-exp",
    name: "the log of a root of a power of e",
    make: (r) => {
      // ln(√(e^(2k·xy))) = k·v → x = v/y
      const k = r.int(2, 3);
      const v = r.int(2, 5);
      return {
        shape: "log-of-root-of-exp",
        start: `ln(√(e^(${2 * k}xy))) = ${k * v}`,
        goal: `x = ${v}/y`,
        via: [`ln(e^(${k}xy)) = ${k * v}`, `${k}xy = ${k * v}`, `xy = ${v}`],
        numbers: [2 * k, k * v],
        along: [k, v],
      };
    },
  },
];

/** Each nesting chapter's hard shapes. */
export const NESTED: Record<string, Shape[]> = { powers, roots, fractions, explog };
