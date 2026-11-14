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

/** A term after another: " + 3y", " - y", " - 2xy" (nothing for 0). */
const then = (c: number, s: string) => (c === 0 ? "" : c < 0 ? ` - ${co(-c, s)}` : ` + ${co(c, s)}`);
/** A first term: "3y", "-y". */
const first = (c: number, s: string) => (c < 0 ? `-${co(-c, s)}` : co(c, s));

const distribute: Shape[] = [
  {
    id: "bracket-in-bracket",
    name: "a bracket inside a bracket, with x and y",
    make: (r) => {
      // a(x + b(x − y)) + cy → a(1 + b)x + (c − ab)y
      const a = r.int(2, 3);
      const b = r.int(2, 3);
      const c = r.int(1, 9);
      if (c === a * b) return null;
      return {
        shape: "bracket-in-bracket",
        start: `${a}(x + ${b}(x - y)) + ${co(c, "y")}`,
        goal: `${a * (1 + b)}x${then(c - a * b, "y")}`,
        via: [`${a}(x + ${b}x - ${b}y) + ${co(c, "y")}`, `${a}(${1 + b}x - ${b}y) + ${co(c, "y")}`, `${a * (1 + b)}x - ${a * b}y + ${co(c, "y")}`],
        numbers: [a, b, c],
        along: [1 + b, a * (1 + b), a * b, c - a * b],
      };
    },
  },
  {
    id: "minus-bracket-in-bracket",
    name: "a minus in front of a bracket with a bracket inside",
    make: (r) => {
      // x − (ay − b(x − y)) → (1 + b)x − (a + b)y
      const a = r.int(1, 4);
      const b = r.int(2, 4);
      return {
        shape: "minus-bracket-in-bracket",
        start: `x - (${co(a, "y")} - ${b}(x - y))`,
        goal: `${1 + b}x - ${a + b}y`,
        via: [`x - (${co(a, "y")} - ${b}x + ${b}y)`, `x - (${a + b}y - ${b}x)`, `x - ${a + b}y + ${b}x`],
        numbers: [a, b],
        along: [a + b, 1 + b],
      };
    },
  },
  {
    id: "letter-times-nested",
    name: "x times a bracket with a bracket inside",
    make: (r) => {
      // x(y + b(x − y)) → bx² − (b − 1)xy
      const b = r.int(2, 5);
      return {
        shape: "letter-times-nested",
        start: `x(y + ${b}(x - y))`,
        goal: `${b}x^2 - ${co(b - 1, "xy")}`,
        via: [`x(y + ${b}x - ${b}y)`, `x(${b}x - ${co(b - 1, "y")})`],
        numbers: [b],
        along: [b - 1],
      };
    },
  },
];

const brackets: Shape[] = [
  {
    id: "two-letter-product-minus",
    name: "two brackets of x and y multiplied, take away x times a bracket",
    make: (r) => {
      // (x + ay)(x − by) − x(x + cy) → (a − b − c)xy − ab·y²
      const a = r.int(1, 3);
      const b = r.int(1, 3);
      const c = r.int(1, 3);
      const k = a - b - c;
      if (a === b || k === 0) return null;
      const A = co(a, "y");
      const B = co(b, "y");
      const C = co(c, "y");
      const tail = ` - x(x + ${C})`;
      return {
        shape: "two-letter-product-minus",
        start: `(x + ${A})(x - ${B})${tail}`,
        goal: `${first(k, "xy")} - ${co(a * b, "y^2")}`,
        via: [`(x + ${A})x - (x + ${A})·${B}${tail}`, `x^2 + ${co(a, "xy")} - (x + ${A})·${B}${tail}`, `x^2 + ${co(a, "xy")} - (${co(b, "xy")} + ${co(a * b, "y^2")})${tail}`, `x^2${then(a - b, "xy")} - ${co(a * b, "y^2")}${tail}`, `x^2${then(a - b, "xy")} - ${co(a * b, "y^2")} - x^2 - ${co(c, "xy")}`],
        numbers: [a, b, c],
        along: [a - b, a * b, k],
      };
    },
  },
  {
    id: "letter-bracket-minus-product",
    name: "x times a bracket, take away two brackets of x and y multiplied",
    make: (r) => {
      // x(x + ay) − (x + ay)(x − ay) → axy + a²y²
      const a = r.int(1, 3);
      const A = co(a, "y");
      return {
        shape: "letter-bracket-minus-product",
        start: `x(x + ${A}) - (x + ${A})(x - ${A})`,
        goal: `${co(a, "xy")} + ${co(a * a, "y^2")}`,
        via: [
          `x^2 + ${co(a, "xy")} - (x + ${A})(x - ${A})`,
          `x^2 + ${co(a, "xy")} - ((x + ${A})x - (x + ${A})·${A})`,
          `x^2 + ${co(a, "xy")} - (x^2 + ${co(a, "xy")} - (x + ${A})·${A})`,
          `x^2 + ${co(a, "xy")} - (x^2 + ${co(a, "xy")} - ${co(a, "xy")} - ${co(a * a, "y^2")})`,
          `x^2 + ${co(a, "xy")} - (x^2 - ${co(a * a, "y^2")})`,
        ],
        numbers: [a],
        along: [a * a],
      };
    },
  },
];

/** Solving with brackets inside brackets: one letter, the answer a whole number (balance, inequalities). */
function nestedSolve(rel: string, id: string): Shape[] {
  return [
    {
      id: `${id}nested-brackets`,
      name: "a bracket inside a bracket, the letter on both sides",
      make: (r) => {
        // a(b(x − c) + d) rel e·x + f, solved: x rel x0
        const a = r.int(2, 3);
        const b = r.int(2, 3);
        const c = r.int(1, 4);
        const d = r.int(1, 6);
        const e = r.int(1, a * b - 1);
        const x0 = r.int(1, 6);
        const k = d - b * c; // inside: b·x + k
        const f = (a * b - e) * x0 + a * k;
        if (k === 0 || f === 0 || Math.abs(f) > 30) return null;
        const rhs = `${co(e, "x")}${f < 0 ? ` - ${-f}` : ` + ${f}`}`;
        return {
          shape: `${id}nested-brackets`,
          start: `${a}(${b}(x - ${c}) + ${d}) ${rel} ${rhs}`,
          goal: `x ${rel} ${x0}`,
          via: [`${a}(${b}x - ${b * c} + ${d}) ${rel} ${rhs}`, `${a}(${b}x${k < 0 ? ` - ${-k}` : ` + ${k}`}) ${rel} ${rhs}`, `${a * b}x${a * k < 0 ? ` - ${-a * k}` : ` + ${a * k}`} ${rel} ${rhs}`, `${co(a * b - e, "x")} ${rel} ${(a * b - e) * x0}`],
          answer: x0,
          numbers: [a, b, c, d, e, f],
          along: [b * c, k, a * b, a * k, a * b - e, (a * b - e) * x0],
        };
      },
    },
    {
      id: `${id}bracket-in-fraction`,
      name: "a bracket inside a fraction, with more x beside it",
      make: (r) => {
        // (b(x + c) + x)/a rel q → x rel x0
        const a = r.int(2, 5);
        const b = r.int(2, 3);
        const c = r.int(1, 4);
        const x0 = r.int(1, 6);
        const top = (b + 1) * x0 + b * c;
        if (top % a !== 0) return null;
        const q = top / a;
        return {
          shape: `${id}bracket-in-fraction`,
          start: `(${b}(x + ${c}) + x)/${a} ${rel} ${q}`,
          goal: `x ${rel} ${x0}`,
          via: [`${b}(x + ${c}) + x ${rel} ${top}`, `${b}x + ${b * c} + x ${rel} ${top}`, `${b + 1}x + ${b * c} ${rel} ${top}`, `${b + 1}x ${rel} ${(b + 1) * x0}`],
          answer: x0,
          numbers: [a, b, c, q],
          along: [top, b * c, b + 1, (b + 1) * x0],
        };
      },
    },
  ];
}

const factor: Shape[] = [
  {
    id: "common-xy",
    name: "a number, x and y in common",
    make: (r) => {
      // g·p·x²y + g·q·xy² − g·s·xy → g·xy(px + qy − s)
      const g = r.int(2, 3); // a prime: it splits off in one tap
      const [p, q] = pick(r, COPRIME);
      const t = r.int(1, 5);
      if (g * q > 30 || g * t > 30) return null;
      return {
        shape: "common-xy",
        start: `${g * p}x^2y + ${g * q}xy^2 - ${g * t}xy`,
        goal: `${g}xy(${p}x + ${q}y - ${t})`,
        via: [`${g}·${p}x^2y + ${g}·${q}xy^2 - ${g}·${co(t, "xy")}`, `${g}(${p}x^2y + ${q}xy^2 - ${co(t, "xy")})`, `${g}x(${p}xy + ${q}y^2 - ${co(t, "y")})`],
        numbers: [g * p, g * q, g * t],
        along: [g, p, q, t],
      };
    },
  },
  {
    id: "pairs-x-y",
    name: "four terms in x and y, factored in pairs",
    make: (r) => {
      // p·x² + pa·xy + q·xy + qa·y² → (x + ay)(px + qy)
      const [p, q] = pick(r, COPRIME);
      const a = r.int(2, 3);
      const A = `x + ${a}y`;
      if (q * a > 30) return null;
      return {
        shape: "pairs-x-y",
        start: `${p}x^2 + ${p * a}xy + ${q}xy + ${q * a}y^2`,
        goal: `(${A})(${p}x + ${q}y)`,
        via: [`${p}(x^2 + ${a}xy) + ${q}xy + ${q * a}y^2`, `${p}x(${A}) + ${q}xy + ${q * a}y^2`, `${p}x(${A}) + ${q}(xy + ${a}y^2)`, `${p}x(${A}) + ${q}y(${A})`],
        numbers: [p, p * a, q, q * a],
        along: [a],
      };
    },
  },
];

const simultaneous: Shape[] = [
  {
    id: "nested-then-substitute",
    name: "a bracket inside a bracket to undo, then substitute",
    make: (r) => {
      // a(x + b(y − c)) = R; x − y = d
      const a = r.int(2, 3);
      const b = r.int(2, 3);
      const y0 = r.int(1, 5);
      const x0 = r.int(y0 + 1, y0 + 4);
      const c = r.int(1, 3);
      const d = x0 - y0;
      const inner = x0 + b * (y0 - c);
      const R = a * inner;
      const S = inner + b * c; // x + by = S
      if (inner <= 0 || R > 30) return null;
      const eq2 = `x - y = ${d}`;
      return {
        shape: "nested-then-substitute",
        start: `${a}(x + ${b}(y - ${c})) = ${R}; ${eq2}`,
        goal: `x = ${x0}; y = ${y0}`,
        via: [`${a}(x + ${b}y - ${b * c}) = ${R}; ${eq2}`, `x + ${b}y - ${b * c} = ${inner}; ${eq2}`, `x + ${b}y = ${S}; x = ${d} + y`, `${d} + y + ${b}y = ${S}; x = ${d} + y`, `y = ${y0}; x = ${d} + y`],
        numbers: [a, b, c, R, d],
        along: [inner, S, b * c],
      };
    },
  },
];

/** Each chapter's nested hard shapes. */
export const NESTED: Record<string, Shape[]> = {
  powers,
  roots,
  fractions,
  explog,
  distribute,
  brackets,
  balance: nestedSolve("=", ""),
  inequalities: nestedSolve("<", "ineq-"),
  factor,
  simultaneous,
};
