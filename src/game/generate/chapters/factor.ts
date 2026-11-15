/** Factoring: take a common factor out in front, a number, a letter or a whole bracket. Built from the factors, then multiplied out. */
import { NESTED } from "./nested";
import { byIds, gcd, lin, one, poly, term, timesBracket, type Level, type Shape } from "../write";

const letter = one;

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
    via: [...(letterFirst ? [after(letterFirst)] : []), after(`${f}(${shared})`), `${f}(${shared})${timesBracket(d, shared)}`],
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
        return { shape: "number-out", start: `${k}${x}${s}${k}${y}`, goal: `${k}(${x}${s}${y})`, via: [] };
      }
      const x = letter(r, ["x", "x", "a", "y"]);
      const a = r.next() < 0.7 ? 1 : r.int(2, 3);
      const m = r.signed(1, 5);
      if (gcd(a, m) > 1 || splitCost(k * a, k) + splitCost(k * m, k) > 2) return null;
      return { shape: "number-out", start: lin(k * a, k * m, x), goal: `${k}(${lin(a, m, x)})`, via: [] };
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
        return { shape: "letter-out", start: `${x}^2${s}${x}${y}`, goal: `${x}(${x}${s}${y})`, via: [] };
      }
      if (kind < 0.45) {
        if (Math.abs(b) > 5) return null;
        return { shape: "letter-out", start: poly([[1, "x^3"], [b, "x^2"]]), goal: `x^2(${lin(1, b)})`, via: [] };
      }
      const x = letter(r, ["x", "x", "a", "y"]);
      return { shape: "letter-out", start: poly([[1, `${x}^2`], [b, x]]), goal: `${x}(${lin(1, b, x)})`, via: [] };
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
      return { shape: "bracket-out", start: `${x}(${shared})${timesBracket(q, shared)}`, goal: `(${shared})(${lin(1, q, x)})`, via: [] };
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
      return { shape: "number-and-letter", start: poly([[k, `${x}^2`], [k * m, x]]), goal: `${k}${x}(${lin(1, m, x)})`, via: [`${x}(${lin(k, k * m, x)})`] };
    },
  },
  {
    id: "square-and-bracket",
    name: "a square and a bracket",
    make: (r) => {
      // (x + p)^2 + q(x + p) = (x + p)(x + p + q)
      const p = r.signed(1, 5);
      const q = r.signed(1, 5);
      if (p + q === 1 || p + q === 0 || q === 1) return null;
      const shared = lin(1, p);
      return {
        shape: "square-and-bracket",
        start: `(${shared})^2${timesBracket(q, shared)}`,
        goal: `(${shared})(${lin(1, p + q)})`,
        via: [],
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
        via: [`x(${shared})${timesBracket(q, shared)}`],
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
        return { shape: "pairs", start: w.start, goal: `(${lin(1, p, b)})(${lin(1, q, a)})`, via: w.via};
      }
      const w = pairs("x", [1, "x^2"], [p, "x"], q, 1, p, "x");
      return { shape: "pairs", start: w.start, goal: `(${lin(1, p)})(${lin(1, q)})`, via: w.via};
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
      return { shape: "pairs-numbers", start: w.start, goal: `(${lin(a, b)})(${lin(c, d)})`, via: w.via};
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
      return { shape: "pairs-cube", start: w.start, goal: `(${lin(1, p)})(${lin(c, q, "x^2")})`, via: w.via};
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
      };
    },
  },
];

/** Easy: one thing out in front. Medium: four terms in pairs (numbers in front, cubes, a number out first). Hard: a common factor of x and y, pairs with x and y (nested.ts). */
export const shapes: Record<Level, Shape[]> = {
  easy: byIds(all, "number-out", "letter-out", "bracket-out", "square-and-bracket", "number-and-letter", "half-done", "pairs"),
  medium: byIds(all, "pairs-numbers", "pairs-cube", "number-then-pairs"),
  // Hard nests one thing in another (with x and y where the chapter allows): chapters/nested.ts.
  hard: NESTED.factor,
};
