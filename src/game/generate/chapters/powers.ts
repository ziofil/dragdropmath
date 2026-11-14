/** Powers: multiply, divide, a power of a power, negative exponents, numbers in front. Letters are positive. */
import { type Draft, type Level, type Rng, type Shape } from "../write";

/** x^e as written: "x" for e = 1, "x^-2" for a negative one. */
const pw = (x: string, e: number) => (e === 1 ? x : `${x}^${e}`);
/** c·x^e: "3x^5", "x^4", "-x". */
const mono = (c: number, x: string, e: number) => `${c === 1 ? "" : c === -1 ? "-" : c}${pw(x, e)}`;
/** " + 2x", " - x^3" after a term. */
const then = (c: number, x: string, e: number) => (c < 0 ? ` - ${mono(-c, x, e)}` : ` + ${mono(c, x, e)}`);

const letter = (r: Rng) => ["x", "x", "y", "a"][r.int(0, 3)];

/** A draft from another shape, written as this one (a shape that's sometimes made the other way). */
const another = (id: string, r: Rng, as: string): Draft | null => {
  const d = all.find((s) => s.id === id)!.make(r);
  return d && { ...d, shape: as };
};

const all: Shape[] = [
  {
    id: "multiply",
    name: "multiplying powers",
    make: (r) => {
      if (r.next() < 0.35) return another("numbers-in-front", r, "multiply");
      // x^m·x^n = x^(m+n)
      const x = letter(r);
      const m = r.next() < 0.2 ? 1 : r.int(2, 6);
      const n = r.int(2, 6);
      return { shape: "multiply", start: `${pw(x, m)}·${pw(x, n)}`, goal: pw(x, m + n), via: [], numbers: [m, n], along: [m + n] };
    },
  },
  {
    id: "divide",
    name: "dividing powers",
    make: (r) => {
      if (r.next() < 0.35) return another("negative", r, "divide");
      // x^m/x^n = x^(m-n)
      const x = letter(r);
      const n = r.int(2, 5);
      const m = n + r.int(2, 5);
      return { shape: "divide", start: `${pw(x, m)}/${pw(x, n)}`, goal: pw(x, m - n), via: [], numbers: [m, n], along: [m - n] };
    },
  },
  {
    id: "power-of-power",
    name: "a power of a power",
    make: (r) => {
      // (x^m)^n = x^(mn)
      const x = letter(r);
      const m = r.int(2, 5);
      const n = r.int(2, 4);
      if (m * n > 15) return null;
      return { shape: "power-of-power", start: `(${pw(x, m)})^${n}`, goal: pw(x, m * n), via: [], numbers: [m, n], along: [m * n] };
    },
  },
  {
    id: "number-inside",
    name: "a number inside the bracket",
    make: (r) => {
      if (r.next() < 0.35) return another("term-power", r, "number-inside");
      // (kx)^n = k^n x^n
      const x = letter(r);
      const k = r.int(2, 5);
      const n = r.int(2, 3);
      if (k ** n > 30) return null;
      return { shape: "number-inside", start: `(${k}${x})^${n}`, goal: mono(k ** n, x, n), via: [], numbers: [k, n], along: [k ** n] };
    },
  },
  {
    id: "negative",
    name: "a negative exponent",
    make: (r) => {
      const x = letter(r);
      if (r.next() < 0.5) {
        // x^m/x^n with more on the bottom = x^-(n-m)
        const m = r.int(1, 5);
        const n = m + r.int(1, 4);
        return { shape: "negative", start: `${pw(x, m)}/${pw(x, n)}`, goal: pw(x, m - n), via: [], numbers: [m, n], along: [m - n] };
      }
      // x^-m·x^n = x^(n-m)
      const m = r.int(1, 5);
      const n = r.int(2, 7);
      if (n === m) return null;
      return { shape: "negative", start: `${pw(x, -m)}·${pw(x, n)}`, goal: pw(x, n - m), via: [], numbers: [m, n], along: [n - m] };
    },
  },
  {
    id: "numbers-in-front",
    name: "numbers in front",
    make: (r) => {
      // ax^m·bx^n = ab x^(m+n)
      const x = letter(r);
      const a = r.int(2, 5);
      const b = r.int(2, 5);
      const m = r.int(1, 4);
      const n = r.int(2, 4);
      if (a * b > 20) return null;
      return { shape: "numbers-in-front", start: `${mono(a, x, m)}·${mono(b, x, n)}`, goal: mono(a * b, x, m + n), via: [], numbers: [a, b, m, n], along: [a * b, m + n] };
    },
  },
  {
    id: "term-power",
    name: "a number and a power, raised to a power",
    make: (r) => {
      // (kx^m)^n = k^n x^(mn)
      const x = letter(r);
      const k = r.int(2, 3);
      const m = r.int(2, 4);
      const n = r.int(2, 3);
      if (k ** n > 27 || m * n > 12) return null;
      return { shape: "term-power", start: `(${mono(k, x, m)})^${n}`, goal: mono(k ** n, x, m * n), via: [], numbers: [k, m, n], along: [k ** n, m * n] };
    },
  },
  {
    id: "three-powers",
    name: "three powers at once",
    make: (r) => {
      const x = letter(r);
      if (r.next() < 0.5) {
        // (x^m)^n·x^p = x^(mn+p)
        const m = r.int(2, 4);
        const n = r.int(2, 3);
        const p = r.int(1, 4);
        if (m * n + p > 15) return null;
        return { shape: "three-powers", start: `(${pw(x, m)})^${n}·${pw(x, p)}`, goal: pw(x, m * n + p), via: [`${pw(x, m * n)}·${pw(x, p)}`], numbers: [m, n, p], along: [m * n, m * n + p] };
      }
      // (x^a·x^b)/x^c = x^(a+b-c)
      const a = r.int(2, 5);
      const b = r.int(1, 4);
      const c = r.int(2, 6);
      if (a + b - c < 1 || c === a || c === b) return null;
      return { shape: "three-powers", start: `(${pw(x, a)}·${pw(x, b)})/${pw(x, c)}`, goal: pw(x, a + b - c), via: [`${pw(x, a + b)}/${pw(x, c)}`], numbers: [a, b, c], along: [a + b, a + b - c] };
    },
  },
  {
    id: "two-letters",
    name: "two letters, top and bottom",
    make: (r) => {
      const [x, y] = [["x", "y"], ["a", "b"]][r.next() < 0.75 ? 0 : 1];
      if (r.next() < 0.5) {
        // (x^a·y^b)/(x^c·y^d) = x^(a-c)·y^(b-d)
        const a = r.int(3, 6);
        const c = r.int(1, a - 1);
        const b = r.int(2, 5);
        const d = r.int(1, b - 1);
        return {
          shape: "two-letters",
          start: `(${pw(x, a)}·${pw(y, b)})/(${pw(x, c)}·${pw(y, d)})`,
          goal: `${pw(x, a - c)}·${pw(y, b - d)}`,
          via: [`(${pw(x, a - c)}·${pw(y, b)})/${pw(y, d)}`],
          numbers: [a, b, c, d],
          along: [a - c, b - d],
        };
      }
      // (x^m·y)^n/y^k = x^(mn)·y^(n-k)
      const m = r.int(2, 3);
      const n = r.int(2, 4);
      const k = r.int(1, n - 1);
      if (m * n > 12) return null;
      return {
        shape: "two-letters",
        start: `(${pw(x, m)}·${y})^${n}/${pw(y, k)}`,
        goal: `${pw(x, m * n)}·${pw(y, n - k)}`,
        via: [`(${pw(x, m * n)}·${pw(y, n)})/${pw(y, k)}`],
        numbers: [m, n, k],
        along: [m * n, n - k],
      };
    },
  },
  {
    id: "bracket-cancel",
    name: "a bracket, then a term that cancels",
    make: (r) => {
      // ax^m(x^n - k) + akx^m = ax^(m+n)
      const a = r.next() < 0.5 ? 1 : r.int(2, 3);
      const m = r.int(1, 3);
      const n = r.int(2, 4);
      const k = r.int(1, 3);
      if (m === n || (a === 1 && k === 1 && r.next() < 0.5)) return null;
      const lead = a === 1 ? pw("x", m) : `${a}${pw("x", m)}`;
      return {
        shape: "bracket-cancel",
        start: `${lead}(${pw("x", n)} - ${k}) + ${mono(a * k, "x", m)}`,
        goal: mono(a, "x", m + n),
        via: [
          ...(a > 1 ? [`${a}${pw("x", m)}*${pw("x", n)}${then(-a * k, "x", m)} + ${mono(a * k, "x", m)}`] : []),
          `${mono(a, "x", m + n)}${then(-a * k, "x", m)} + ${mono(a * k, "x", m)}`,
        ],
        numbers: [a, m, n, k, a * k],
        along: [m + n, a * k],
      };
    },
  },
  {
    id: "square-and-more",
    name: "a squared term, and a bracket of the same power",
    make: (r) => {
      // (kx^m)^2 + x^p(x^(2m-p) - b) = (k^2 + 1)x^(2m) - bx^p
      const k = r.int(2, 3);
      const m = r.int(2, 3);
      const p = r.int(1, m);
      const b = r.int(1, 5);
      const q = 2 * m - p;
      return {
        shape: "square-and-more",
        start: `(${mono(k, "x", m)})^2 + ${pw("x", p)}(${pw("x", q)} - ${b})`,
        goal: `${mono(k * k + 1, "x", 2 * m)} - ${mono(b, "x", p)}`,
        via: [`${mono(k * k, "x", 2 * m)} + ${pw("x", p)}(${pw("x", q)} - ${b})`, `${mono(k * k, "x", 2 * m)} + ${pw("x", 2 * m)} - ${mono(b, "x", p)}`],
        numbers: [k, m, p, q, b],
        along: [k * k, k * k + 1, 2 * m],
      };
    },
  },
  {
    id: "two-products",
    name: "two bracketed terms, each to a power",
    make: (r) => {
      // (kx^a)^n·(cx^b)^p = k^n c^p x^(an + bp)
      const k = r.int(2, 3);
      const c = r.int(2, 3);
      const a = r.int(1, 3);
      const b = r.next() < 0.3 ? -r.int(1, 2) : r.int(1, 3);
      const n = r.int(2, 3);
      const p = r.int(2, 3);
      const e = a * n + b * p;
      const big = k ** n * c ** p;
      if (big > 60 || e === 0 || a * n > 9) return null;
      return {
        shape: "two-products",
        start: `(${mono(k, "x", a)})^${n}·(${mono(c, "x", b)})^${p}`,
        goal: mono(big, "x", e),
        via: [`${mono(k ** n, "x", a * n)}·(${mono(c, "x", b)})^${p}`, `${mono(k ** n, "x", a * n)}·${mono(c ** p, "x", b * p)}`],
        numbers: [k, a, n, c, b, p],
        along: [k ** n, c ** p, big, a * n, b * p, e],
      };
    },
  },
  {
    id: "letters-and-number",
    name: "a number and two letters, to a power, over two letters",
    make: (r) => {
      // (kx^a·y)^n/(x^c·y^d) = k^n x^(an-c)·y^(n-d)
      const [x, y] = [["x", "y"], ["a", "b"]][r.next() < 0.75 ? 0 : 1];
      const k = r.int(2, 3);
      const a = r.int(2, 3);
      const n = r.int(2, 3);
      const c = r.int(1, a * n - 1);
      const d = r.int(1, n - 1);
      if (k ** n > 27 || a * n > 9) return null;
      const top = `${k ** n}${pw(x, a * n)}·${pw(y, n)}`;
      return {
        shape: "letters-and-number",
        start: `(${k}${pw(x, a)}·${y})^${n}/(${pw(x, c)}·${pw(y, d)})`,
        goal: `${k ** n}${pw(x, a * n - c)}·${pw(y, n - d)}`,
        via: [`${top}/(${pw(x, c)}·${pw(y, d)})`, `${k ** n}${pw(x, a * n - c)}·${pw(y, n)}/${pw(y, d)}`],
        numbers: [k, a, n, c, d],
        along: [k ** n, a * n, a * n - c, n - d],
      };
    },
  },
  {
    id: "bracket-square",
    name: "a bracket with a power, squared",
    make: (r) => {
      // (x^m + p)^2 = x^(2m) + 2px^m + p^2
      const m = r.int(2, 3);
      const p = r.signed(2, 4);
      const inside = `${pw("x", m)}${p < 0 ? " - " : " + "}${Math.abs(p)}`;
      return {
        shape: "bracket-square",
        start: `(${inside})^2`,
        goal: `${pw("x", 2 * m)}${then(2 * p, "x", m)} + ${p * p}`,
        via: [`(${inside})(${inside})`, `${pw("x", 2 * m)}${then(p, "x", m)}${p < 0 ? " - " : " + "}${Math.abs(p)}(${inside})`, `${pw("x", 2 * m)}${then(p, "x", m)}${then(p, "x", m)} + ${p * p}`],
        numbers: [m, p],
        along: [2 * m, 2 * p, p * p],
      };
    },
  },
  {
    id: "expand-collect",
    name: "multiply out, then collect",
    make: (r) => {
      if (r.next() < 0.35) {
        // x^-m(x^(m+a) + x^m) = x^a + 1
        const m = r.int(1, 3);
        const a = r.int(1, 3);
        return {
          shape: "expand-collect",
          start: `${pw("x", -m)}·(${pw("x", m + a)} + ${pw("x", m)})`,
          goal: `${pw("x", a)} + 1`,
          via: [`${pw("x", a)} + ${pw("x", -m)}·${pw("x", m)}`],
          numbers: [m, m + a],
          along: [a],
        };
      }
      // ax(x^2 + b) - cx^3 = (a - c)x^3 + abx
      const a = r.int(2, 4);
      const c = r.int(1, a - 1);
      const b = r.signed(1, 4);
      return {
        shape: "expand-collect",
        start: `${a}x(x^2${b < 0 ? " - " : " + "}${Math.abs(b)}) - ${mono(c, "x", 3)}`,
        goal: `${mono(a - c, "x", 3)}${then(a * b, "x", 1)}`,
        via: [`${mono(a, "x", 3)}${then(a * b, "x", 1)} - ${mono(c, "x", 3)}`],
        numbers: [a, b, c],
        along: [a * b, a - c],
      };
    },
  },
];

// ---------- Hard: powers inside brackets, multiplied out (brackets) and collected (collect) ----------

/** "3·" before a factor, nothing for 1. */
const times = (k: number) => (k === 1 ? "" : `${k}·`);

const mixed: Shape[] = [
  {
    id: "bracket-minus-power",
    name: "a bracket multiplied out, take away a power of a power",
    make: (r) => {
      // x^m(x^n + kx^p) - (x^a)^b·x^c with ab + c = m + n: x^2(x^3 + 2x) - (x^2)^2·x = 2x^3
      const m = r.int(2, 3);
      const n = r.int(2, 4);
      const p = r.int(1, n - 1);
      const k = r.int(2, 4);
      const a = r.int(2, 3);
      const b = r.int(2, 3);
      const c = m + n - a * b;
      if (c < 1) return null;
      const P = `(${pw("x", a)})^${b}·${pw("x", c)}`;
      const head = pw("x", m + n);
      const kept = mono(k, "x", m + p);
      return {
        shape: "bracket-minus-power",
        start: `${pw("x", m)}(${pw("x", n)} + ${mono(k, "x", p)}) - ${P}`,
        goal: kept,
        via: [
          `${pw("x", m)}·${pw("x", n)} + ${k}·${pw("x", m)}·${pw("x", p)} - ${P}`,
          `${head} + ${k}·${pw("x", m)}·${pw("x", p)} - ${P}`,
          `${head} + ${kept} - ${P}`,
          `${head} + ${kept} - ${pw("x", a * b)}·${pw("x", c)}`,
          `${head} + ${kept} - ${head}`,
        ],
        numbers: [m, n, k, p, a, b, c],
        along: [m + n, m + p, a * b],
      };
    },
  },
  {
    id: "negative-bracket",
    name: "a negative power times a bracket, take away another bracket",
    make: (r) => {
      // x^-m(x^(m+a) + kx^(m+1)) - x(x^(a-1) - j) = (k + j)x: x^-2(x^5 + 3x^3) - x(x^2 - 1) = 4x
      const m = r.int(1, 3);
      const a = r.int(2, 4);
      const k = r.int(1, 4);
      const j = r.int(1, 4);
      const neg = pw("x", -m);
      const second = `x(${pw("x", a - 1)} - ${j})`;
      return {
        shape: "negative-bracket",
        start: `${neg}(${pw("x", m + a)} + ${mono(k, "x", m + 1)}) - ${second}`,
        goal: mono(k + j, "x", 1),
        via: [
          `${neg}·${pw("x", m + a)} + ${times(k)}${neg}·${pw("x", m + 1)} - ${second}`,
          `${pw("x", a)} + ${times(k)}${neg}·${pw("x", m + 1)} - ${second}`,
          `${pw("x", a)} + ${mono(k, "x", 1)} - ${second}`,
          `${pw("x", a)} + ${mono(k, "x", 1)} - (x·${pw("x", a - 1)} - ${mono(j, "x", 1)})`,
          `${pw("x", a)} + ${mono(k, "x", 1)} - ${pw("x", a)} + ${mono(j, "x", 1)}`,
        ],
        numbers: [m, m + a, k, m + 1, a - 1, j],
        along: [a, k + j],
      };
    },
  },
  {
    id: "quotient-plus-bracket",
    name: "a power over a power, plus a bracket, collected",
    make: (r) => {
      // (kx^a)^n/x^c + mx(x^(e-1) + p) - mpx = (k^n + m)x^e: (2x^3)^2/x^3 + x(x^2 + 4) - 4x = 5x^3
      const k = r.int(2, 3);
      const a = r.int(2, 3);
      const n = r.int(2, 3);
      const c = r.int(1, a * n - 3);
      const e = a * n - c;
      const m = r.int(1, 2);
      const q = r.int(1, 5);
      if (k ** n > 9 || a * n > 9) return null;
      const lead = mono(k ** n, "x", e);
      const tail = `${mono(m * q, "x", 1)} - ${mono(m * q, "x", 1)}`;
      const br = `${m === 1 ? "" : m}x(${pw("x", e - 1)} + ${q}) - ${mono(m * q, "x", 1)}`;
      return {
        shape: "quotient-plus-bracket",
        start: `(${mono(k, "x", a)})^${n}/${pw("x", c)} + ${br}`,
        goal: mono(k ** n + m, "x", e),
        via: [
          `(${k}^${n}·${pw("x", a * n)})/${pw("x", c)} + ${br}`,
          `${k ** n}${pw("x", a * n)}/${pw("x", c)} + ${br}`,
          `${lead} + ${br}`,
          `${lead} + ${times(m)}x·${pw("x", e - 1)} + ${tail}`,
          `${lead} + ${mono(m, "x", e)} + ${tail}`,
        ],
        numbers: [k, a, n, c, m, e - 1, q, m * q],
        along: [k ** n, a * n, e, k ** n + m, m * q],
      };
    },
  },
  {
    id: "square-minus-bracket",
    name: "a bracket with a power squared, take away a bracket",
    make: (r) => {
      // (x^m + p)^2 - x^m(x^m + q) = (2p - q)x^m + p^2: (x^2 + 3)^2 - x^2(x^2 + 4) = 2x^2 + 9
      const m = r.int(2, 3);
      const p = r.int(2, 4);
      const q = r.int(1, 2 * p - 1);
      const X = pw("x", m);
      const XX = pw("x", 2 * m);
      const A = `${X} + ${p}`;
      const B = `${X}(${X} + ${q})`;
      return {
        shape: "square-minus-bracket",
        start: `(${A})^2 - ${B}`,
        goal: `${mono(2 * p - q, "x", m)} + ${p * p}`,
        via: [
          `(${A})(${A}) - ${B}`,
          `(${A})*${X} + ${p}(${A}) - ${B}`,
          `${X}*${X} + ${p}${X} + ${p}(${A}) - ${B}`,
          `${XX} + ${p}${X} + ${p}(${A}) - ${B}`,
          `${XX} + ${p}${X} + ${p}${X} + ${p * p} - ${B}`,
          `${XX} + ${2 * p}${X} + ${p * p} - ${B}`,
          `${XX} + ${2 * p}${X} + ${p * p} - (${X}*${X} + ${q === 1 ? "" : q}${X})`,
          `${XX} + ${2 * p}${X} + ${p * p} - (${XX} + ${q === 1 ? "" : q}${X})`,
          `${XX} + ${2 * p}${X} + ${p * p} - ${XX} - ${q === 1 ? "" : q}${X}`,
        ],
        numbers: [m, p, q],
        along: [2 * m, 2 * p, p * p, 2 * p - q],
      };
    },
  },
];

const pick = (...ids: string[]) => ids.map((id) => [...all, ...mixed].find((s) => s.id === id)!);

/** Easy: one rule, once. Medium: numbers, powers of powers and brackets together. Hard: powers inside brackets, multiplied out and collected, negative powers too. */
export const shapes: Record<Level, Shape[]> = {
  easy: pick("multiply", "divide", "power-of-power", "number-inside", "three-powers", "two-letters", "bracket-cancel", "expand-collect"),
  medium: pick("two-products", "letters-and-number", "bracket-square", "square-and-more"),
  hard: pick("bracket-minus-power", "negative-bracket", "quotient-plus-bracket", "square-minus-bracket"),
};
