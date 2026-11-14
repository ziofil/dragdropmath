/** Factoring: take a common factor out in front, a number, a letter or a whole bracket. Built from the factors, then multiplied out. */
import { gcd, lin, type Level, type Rng, type Shape } from "../write";

/** c·v as a person writes it: "3x^2", "x", "-x", "7" (v empty: a number). */
const term = (c: number, v: string) => (v === "" ? `${c}` : c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);
/** Terms in the order given, zeros left out: [[1, "x^2"], [-3, "x"], [2, ""]] → "x^2 - 3x + 2". */
const poly = (ts: [number, string][]) =>
  ts
    .filter(([c]) => c !== 0)
    .map(([c, v], i) => (i === 0 ? term(c, v) : c < 0 ? ` - ${term(-c, v)}` : ` + ${term(c, v)}`))
    .join("");
/** " + 3(x + 1)", " - (x + 1)": d times a bracket, after a term. */
const times = (d: number, inside: string) => `${d < 0 ? " - " : " + "}${Math.abs(d) === 1 ? "" : Math.abs(d)}(${inside})`;

const letter = (r: Rng, ls: string[]) => ls[r.int(0, ls.length - 1)];

/**
 * How many moves it takes to write n as f·(n/f): tapping a number splits off
 * its smallest prime (12 → 2·6), and two numbers can be multiplied back
 * together. Taking a 3 out of 12 means 2·6, 2·2·3, then 4·3: three moves.
 * What makes one factoring longer than another, so it sorts them into levels.
 */
function splitCost(n: number, f: number): number {
  n = Math.abs(n);
  f = Math.abs(f);
  if (n === f || f === 1) return 0;
  const key = (fs: number[]) => [...fs].sort((a, b) => a - b).join("·");
  const goal = key([f, n / f]);
  const smallest = (m: number) => {
    for (let p = 2; p * p <= m; p++) if (m % p === 0) return p;
    return m;
  };
  let level = [[n]];
  const seen = new Set([key([n])]);
  for (let depth = 1; depth <= 6; depth++) {
    const next: number[][] = [];
    for (const fs of level) {
      const outs: number[][] = [];
      fs.forEach((m, i) => {
        const p = smallest(m);
        if (p !== m) outs.push([...fs.slice(0, i), p, m / p, ...fs.slice(i + 1)]);
        fs.forEach((o, j) => {
          if (j > i) outs.push([...fs.filter((_, k) => k !== i && k !== j), m * o]);
        });
      });
      for (const o of outs) {
        const k = key(o);
        if (k === goal) return depth;
        if (!seen.has(k)) {
          seen.add(k);
          next.push(o);
        }
      }
    }
    level = next;
  }
  return 99;
}

/**
 * Four terms in pairs: f(ax + b) + d(ax + b) multiplied out, where f is the first
 * pair's factor (cx, cx^2, ...). Milestones: the first pair factored, then the second.
 */
function pairs(f: string, fa: [number, string], fb: [number, string], d: number, a: number, b: number, x: string, letterFirst?: string) {
  const shared = lin(a, b, x);
  const rest = poly([[d * a, x], [d * b, ""]]);
  const after = (first: string) => `${first} + ${rest}`.replace("+ -", "- ");
  return {
    start: after(poly([fa, fb])),
    via: [...(letterFirst ? [after(letterFirst)] : []), after(`${f}(${shared})`), `${f}(${shared})${times(d, shared)}`],
  };
}

const all: Shape[] = [
  {
    id: "number-out",
    name: "a number out in front",
    make: (r) => {
      // k(ax + m) multiplied out: 4x - 8, 6x + 9, 3x + 3y
      const k = r.int(2, 6);
      if (r.next() < 0.2) {
        const [x, y] = [["x", "y"], ["a", "b"], ["p", "q"]][r.int(0, 2)];
        const s = r.next() < 0.7 ? " + " : " - ";
        return { shape: "number-out", start: `${k}${x}${s}${k}${y}`, goal: `${k}(${x}${s}${y})`, via: [], numbers: [k], along: [] };
      }
      const x = letter(r, ["x", "x", "a", "y"]);
      const a = r.next() < 0.7 ? 1 : r.int(2, 3);
      const m = r.signed(1, 5);
      if (gcd(a, m) > 1 || splitCost(k * a, k) + splitCost(k * m, k) > 2) return null;
      return { shape: "number-out", start: lin(k * a, k * m, x), goal: `${k}(${lin(a, m, x)})`, via: [], numbers: [k * a, k * m], along: [k] };
    },
  },
  {
    id: "letter-out",
    name: "a letter out in front",
    make: (r) => {
      // x(x + b), x(x + y), x^2(x + b) multiplied out
      const b = r.int(1, 9) * (r.next() < 0.3 ? -1 : 1);
      const kind = r.next();
      if (kind < 0.2) {
        const [x, y] = [["x", "y"], ["a", "b"], ["p", "q"]][r.int(0, 2)];
        const s = r.next() < 0.7 ? " + " : " - ";
        return { shape: "letter-out", start: `${x}^2${s}${x}${y}`, goal: `${x}(${x}${s}${y})`, via: [], numbers: [], along: [] };
      }
      if (kind < 0.45) {
        if (Math.abs(b) > 5) return null;
        return { shape: "letter-out", start: poly([[1, "x^3"], [b, "x^2"]]), goal: `x^2(${lin(1, b)})`, via: [], numbers: [b], along: [] };
      }
      const x = letter(r, ["x", "x", "a", "y"]);
      return { shape: "letter-out", start: poly([[1, `${x}^2`], [b, x]]), goal: `${x}(${lin(1, b, x)})`, via: [], numbers: [b], along: [] };
    },
  },
  {
    id: "bracket-out",
    name: "a whole bracket out in front",
    make: (r) => {
      // x(x + p) + q(x + p) = (x + p)(x + q)
      const x = letter(r, ["x", "x", "a", "y"]);
      const p = r.signed(1, 6);
      const q = r.signed(1, 6);
      if (p === q || q === 1) return null;
      const shared = lin(1, p, x);
      return { shape: "bracket-out", start: `${x}(${shared})${times(q, shared)}`, goal: `(${shared})(${lin(1, q, x)})`, via: [], numbers: [p, q], along: [] };
    },
  },
  {
    id: "number-and-letter",
    name: "a number and a letter out in front",
    make: (r) => {
      // kx(x + m) multiplied out: 3x^2 + 6x
      const k = r.int(2, 5);
      const m = r.signed(1, 5);
      const x = letter(r, ["x", "x", "a"]);
      // 3 + the splitting: a 1 in the bracket is too quick for this level.
      if (Math.abs(m) === 1 || splitCost(k * m, k) > 3) return null;
      return { shape: "number-and-letter", start: poly([[k, `${x}^2`], [k * m, x]]), goal: `${k}${x}(${lin(1, m, x)})`, via: [`${x}(${lin(k, k * m, x)})`], numbers: [k, k * m], along: [] };
    },
  },
  {
    id: "square-and-bracket",
    name: "a square and a bracket",
    make: (r) => {
      // (x + p)^2 + q(x + p) = (x + p)(x + p + q)
      const p = r.signed(1, 5);
      const q = r.signed(1, 5);
      if (p + q === 1 || q === 1) return null;
      const shared = lin(1, p);
      return {
        shape: "square-and-bracket",
        start: `(${shared})^2${times(q, shared)}`,
        goal: `(${shared})(${lin(1, p + q)})`,
        via: [],
        numbers: [p, q],
        along: [p + q],
      };
    },
  },
  {
    id: "half-done",
    name: "a bracket, and two terms that make it again",
    make: (r) => {
      // x(x + p) + qx + qp = (x + p)(x + q)
      const p = r.signed(1, 5);
      const q = r.int(2, 5);
      if (p === q || splitCost(q * p, q) < 2) return null;
      const shared = lin(1, p);
      return {
        shape: "half-done",
        start: `x(${shared}) + ${poly([[q, "x"], [q * p, ""]])}`.replace("+ -", "- "),
        goal: `(${shared})(${lin(1, q)})`,
        via: [`x(${shared})${times(q, shared)}`],
        numbers: [p, q, q * p],
        along: [],
      };
    },
  },
  {
    id: "pairs",
    name: "four terms in pairs",
    make: (r) => {
      // x^2 + px + qx + pq = (x + p)(x + q); ab + pa + qb + pq = (b + p)(a + q)
      const p = r.signed(1, 6);
      const q = r.int(2, 6);
      // About 4 moves, plus the splitting to find q in pq: 4 to 6 in all.
      if (p === q || splitCost(p * q, q) > 2) return null;
      if (r.next() < 0.25) {
        const [a, b] = [["a", "b"], ["x", "y"], ["p", "q"]][r.int(0, 2)];
        if (splitCost(p * q, q) < 1) return null;
        const w = pairs(a, [1, `${a}${b}`], [p, a], q, 1, p, b);
        return { shape: "pairs", start: w.start, goal: `(${lin(1, p, b)})(${lin(1, q, a)})`, via: w.via, numbers: [p, q, p * q], along: [] };
      }
      const w = pairs("x", [1, "x^2"], [p, "x"], q, 1, p, "x");
      return { shape: "pairs", start: w.start, goal: `(${lin(1, p)})(${lin(1, q)})`, via: w.via, numbers: [p, q, p * q], along: [] };
    },
  },
  {
    id: "pairs-numbers",
    name: "four terms in pairs, numbers in front",
    make: (r) => {
      // (ax + b)(cx + d) as cx(ax + b) + d(ax + b): 2x^2 - 4x + 3x - 6 = (x - 2)(2x + 3)
      const a = r.int(2, 3);
      const c = r.int(2, 3);
      const b = r.signed(1, 4);
      const d = r.int(2, 4);
      if (a === 1 || c === 1) return null;
      if (gcd(a, b) > 1 || gcd(c, d) > 1 || (a === c && b === d)) return null;
      const w = pairs(term(c, "x"), [a * c, "x^2"], [b * c, "x"], d, a, b, "x", c > 1 ? `x(${lin(a * c, b * c)})` : undefined);
      return { shape: "pairs-numbers", start: w.start, goal: `(${lin(a, b)})(${lin(c, d)})`, via: w.via, numbers: [a * c, b * c, a * d, b * d], along: [] };
    },
  },
  {
    id: "pairs-cube",
    name: "four terms in pairs, with a cube",
    make: (r) => {
      // (x + p)(cx^2 + q) as cx^2(x + p) + q(x + p): x^3 - 3x^2 + 2x - 6 = (x - 3)(x^2 + 2)
      const c = r.next() < 0.6 ? 1 : 2;
      const p = r.signed(1, 4);
      const q = r.int(2, 5);
      if ((c === 1 ? 2 : 1) > splitCost(p * q, q) || gcd(c, q) > 1) return null;
      const w = pairs(term(c, "x^2"), [c, "x^3"], [c * p, "x^2"], q, 1, p, "x", c > 1 ? `x^2(${lin(c, c * p)})` : undefined);
      return { shape: "pairs-cube", start: w.start, goal: `(${lin(1, p)})(${lin(c, q, "x^2")})`, via: w.via, numbers: [c, c * p, q, p * q], along: [] };
    },
  },
  {
    id: "number-then-pairs",
    name: "a number out first, then pairs",
    make: (r) => {
      // k(x + p)(x + q) multiplied out in pairs: 2x^2 + 6x + 4x + 12 = 2(x + 3)(x + 2)
      const k = r.int(2, 3);
      const p = r.signed(1, 4);
      const q = r.int(2, 4);
      // Taking a 3 out of 12 or 24 means splitting again and again: keep 3 for small numbers.
      if (p === q || (k === 3 && Math.abs(p * q) > 3)) return null;
      const inner = pairs("x", [1, "x^2"], [p, "x"], q, 1, p, "x");
      return {
        shape: "number-then-pairs",
        start: poly([[k, "x^2"], [k * p, "x"], [k * q, "x"], [k * p * q, ""]]),
        goal: `${k}(${lin(1, p)})(${lin(1, q)})`,
        via: [`${k}(${inner.start})`, `${k}(${inner.via[0]})`, `${k}(${inner.via[1]})`],
        numbers: [k, k * p, k * q, k * p * q],
        along: [p * q],
      };
    },
  },
];

// ---------- Hard: multiply out and simplify first, then factor fully ----------

/** "k(...)" for k > 1, the thing itself for k = 1. */
const kTimes = (k: number, inside: string) => (k === 1 ? inside : `${k}(${inside})`);
/** gx(ax + b) with g the biggest number that goes into both: x(5x + 6), 2x(x + 5), 4x(x + 1). */
function letterAndNumber(a: number, b: number): { goal: string; cost: number } {
  const g = gcd(a, b);
  return { goal: `${g === 1 ? "" : g}x(${lin(a / g, b / g)})`, cost: splitCost(a, g) + splitCost(b, g) };
}

const mixed: Shape[] = [
  {
    id: "square-minus-number",
    name: "a square take away a number, then factor",
    make: (r) => {
      if (r.next() < 0.3) {
        // (ax + 1)^2 - 1 = a^2x^2 + 2ax: (2x + 1)^2 - 1 = 4x(x + 1)
        const a = r.int(2, 3);
        const inside = lin(a, 1);
        const f = letterAndNumber(a * a, 2 * a);
        return {
          shape: "square-minus-number",
          start: `(${inside})^2 - 1`,
          goal: f.goal,
          via: [`(${inside})(${inside}) - 1`, `${poly([[a * a, "x^2"], [a, "x"], [a, "x"], [1, ""]])} - 1`, poly([[a * a, "x^2"], [2 * a, "x"]]), `x(${lin(a * a, 2 * a)})`],
          numbers: [a],
          along: [a * a, 2 * a],
        };
      }
      // k(x + p)^2 - kp^2 = kx(x + 2p): 2(x + 3)^2 - 18 = 2x(x + 6)
      const k = r.int(1, 3);
      const p = r.signed(1, 4);
      if (splitCost(2 * k * p, k) > 3 || (k === 1 && Math.abs(p) === 1) || (k === 3 && Math.abs(p) > 2)) return null;
      const inside = lin(1, p);
      const sq = k * p * p;
      const open = poly([[1, "x^2"], [2 * p, "x"], [p * p, ""]]);
      return {
        shape: "square-minus-number",
        start: `${k === 1 ? "" : k}(${inside})^2 - ${sq}`,
        goal: `${k === 1 ? "" : k}x(${lin(1, 2 * p)})`,
        via: [
          `${k === 1 ? "" : k}(${inside})(${inside}) - ${sq}`,
          `${kTimes(k, `${poly([[1, "x^2"], [p, "x"]])}${times(p, inside)}`)} - ${sq}`,
          `${kTimes(k, poly([[1, "x^2"], [p, "x"], [p, "x"], [p * p, ""]]))} - ${sq}`,
          `${kTimes(k, open)} - ${sq}`,
          ...(k > 1 ? [`${poly([[k, "x^2"], [2 * k * p, "x"], [sq, ""]])} - ${sq}`] : []),
          poly([[k, "x^2"], [2 * k * p, "x"]]),
          ...(k > 1 ? [`x(${lin(k, 2 * k * p)})`] : []),
        ],
        numbers: [k, p, sq],
        along: [2 * p, p * p, 2 * k * p],
      };
    },
  },
  {
    id: "product-minus-number",
    name: "a product take away a number, then factor",
    make: (r) => {
      // k(x + p)(x + q) - kpq = kx(x + p + q): (x + 2)(x + 5) - 10 = x(x + 7)
      const k: number = 2; // with 1 it is short for this level
      const p = r.signed(1, 5);
      const q = r.int(2, 5);
      const n = k * p * q;
      if (p === q || p + q === 0) return null;
      const [A, B] = [lin(1, p), lin(1, q)];
      return {
        shape: "product-minus-number",
        start: `${k === 1 ? "" : k}(${A})(${B})${n < 0 ? " + " : " - "}${Math.abs(n)}`,
        goal: `${k === 1 ? "" : k}x(${lin(1, p + q)})`,
        via: [
          `${kTimes(k, `${poly([[1, "x^2"], [p, "x"]])}${times(q, A)}`)}${n < 0 ? " + " : " - "}${Math.abs(n)}`,
          `${kTimes(k, poly([[1, "x^2"], [p + q, "x"], [p * q, ""]]))}${n < 0 ? " + " : " - "}${Math.abs(n)}`,
          ...(k > 1 ? [`${poly([[k, "x^2"], [k * (p + q), "x"], [n, ""]])}${n < 0 ? " + " : " - "}${Math.abs(n)}`] : []),
          poly([[k, "x^2"], [k * (p + q), "x"]]),
          ...(k > 1 ? [`x(${lin(k, k * (p + q))})`] : []),
        ],
        numbers: [k, p, q, n],
        along: [p + q, p * q, k * (p + q)],
      };
    },
  },
  {
    id: "two-terms-common",
    name: "two products, one taken from the other, then factor",
    make: (r) => {
      // ax(x + p) - bx(x + q) = (a - b)x^2 + (ap - bq)x: 3x(x + 2) - x(x - 4) = 2x(x + 5)
      const a = r.int(2, 4);
      const b = r.int(1, a - 1);
      const p = r.signed(1, 4);
      const q = r.signed(1, 5);
      const c = a * p - b * q;
      if (c <= 0 || c > 12 || p === q) return null;
      const f = letterAndNumber(a - b, c);
      if (f.cost > 3) return null;
      const second = `${b === 1 ? "" : b}x(${lin(1, q)})`;
      return {
        shape: "two-terms-common",
        start: `${a}x(${lin(1, p)}) - ${second}`,
        goal: f.goal,
        via: [
          `${poly([[a, "x^2"], [a * p, "x"]])} - ${second}`,
          ...(b > 1 ? [`${poly([[a, "x^2"], [a * p, "x"]])} - (${poly([[b, "x^2"], [b * q, "x"]])})`] : []),
          poly([[a, "x^2"], [a * p, "x"], [-b, "x^2"], [-b * q, "x"]]),
          poly([[a - b, "x^2"], [c, "x"]]),
          `x(${lin(a - b, c)})`,
        ].filter((v) => v !== f.goal),
        numbers: [a, b, p, q],
        along: [a * p, b * q, a - b, c],
      };
    },
  },
];

const pick = (...ids: string[]) => ids.map((id) => [...all, ...mixed].find((s) => s.id === id)!);

/** Easy: one thing out in front. Medium: four terms in pairs (numbers in front, cubes, a number out first). Hard: multiply out and simplify first (brackets, collecting), then factor fully. */
export const shapes: Record<Level, Shape[]> = {
  easy: pick("number-out", "letter-out", "bracket-out", "square-and-bracket", "number-and-letter", "half-done", "pairs"),
  medium: pick("pairs-numbers", "pairs-cube", "number-then-pairs"),
  hard: pick("square-minus-number", "product-minus-number", "two-terms-common"),
};
