/** Exercise shapes for the chapter "distribute": multiplying out brackets, and taking a factor out (see ../write.ts). */
import { NESTED } from "./nested";
import { ax, byIds, gcd, lin, one, poly, type Level, type Rng, type Shape } from "../write";

/** The factor in front of brackets: "3", "", "-", "-2", "x", "2x". */
const front = (k: number, v = "") => (k === 1 ? v : k === -1 ? `-${v}` : `${k}${v}`);

/** k·v + n with the letter first, or "" parts left out: "3x - 2", "x", "-6" ("0" for nothing). */
const polyOr0 = (terms: [number, string][]) => poly(terms) || "0";

/**
 * Milestones for adding up like terms in a long sum, one kind at a time:
 * each kind's terms put together where the first of them stood.
 */
function collecting(terms: [number, string][]): string[] {
  let now = terms.filter(([k]) => k !== 0);
  const out: string[] = [];
  for (const mono of [...new Set(now.map(([, m]) => m))]) {
    const at = now.map(([, m], i) => (m === mono ? i : -1)).filter((i) => i >= 0);
    if (at.length < 2) continue;
    const k = at.reduce((t, i) => t + now[i][0], 0);
    now = now.flatMap((t, i) => (i === at[0] ? (k === 0 ? [] : [[k, mono] as [number, string]]) : at.includes(i) ? [] : [t]));
    if (now.length) out.push(polyOr0(now));
  }
  return out.slice(0, -1);
}

const letter = (r: Rng) => one(r, ["x", "y", "a", "b"]);

const all: Shape[] = [
  {
    id: "expand",
    name: "multiply out one bracket",
    make: (r) => {
      const v = letter(r);
      const n = r.signed(1, 6);
      const k = r.next() < 0.25 ? -1 : r.int(2, 6);
      if (Math.abs(k * n) > 30) return null;
      // -(x - 4) → 4 - x: the number first when it's the only plus.
      if (k === -1 && n < 0) return { shape: "expand", start: `-(${lin(1, n, v)})`, goal: `${-n} - ${v}`, via: [], numbers: [n], along: [] };
      if (k === -1) return { shape: "expand", start: `-(${lin(1, n, v)})`, goal: lin(-1, -n, v), via: [], numbers: [n], along: [] };
      if (r.next() < 0.15) {
        // a(b + c) → ab + ac
        const [a, b, c] = one(r, [["a", "b", "c"], ["x", "y", "z"]]);
        return { shape: "expand", start: `${a}(${b} + ${c})`, goal: `${a}${b} + ${a}${c}`, via: [], numbers: [], along: [] };
      }
      return { shape: "expand", start: `${k}(${lin(1, n, v)})`, goal: lin(k, k * n, v), via: [], numbers: [k, n], along: [k * n] };
    },
  },
  {
    id: "factor",
    name: "take the shared factor out",
    make: (r) => {
      const [a, b] = one(r, [["x", "y"], ["a", "b"]]);
      const k = r.int(2, 9);
      switch (r.int(0, 3)) {
        case 0: // 3x + 3y → 3(x + y)
          return { shape: "factor", start: `${k}${a} + ${k}${b}`, goal: `${k}(${a} + ${b})`, via: [], numbers: [k], along: [] };
        case 1: // 4a + 4 → 4(a + 1)
          return { shape: "factor", start: `${k}${a} + ${k}`, goal: `${k}(${a} + 1)`, via: [], numbers: [k], along: [] };
        case 2: // xy + x → x(y + 1)
          return { shape: "factor", start: `${a}${b} + ${a}`, goal: `${a}(${b} + 1)`, via: [], numbers: [], along: [] };
        default: {
          // xy + xz → x(y + z), ab + ac → a(b + c)
          const [p, q, s] = one(r, [["x", "y", "z"], ["a", "b", "c"]]);
          return { shape: "factor", start: `${p}${q} + ${p}${s}`, goal: `${p}(${q} + ${s})`, via: [], numbers: [], along: [] };
        }
      }
    },
  },
  {
    id: "expand-cancel",
    name: "multiply out, and a term cancels",
    make: (r) => {
      const [a, b] = one(r, [["x", "y"], ["a", "b"]]);
      const k = r.int(2, 6);
      const n = r.int(1, 6);
      if (k * n > 20) return null;
      switch (r.int(0, 2)) {
        case 0: // 3(y + 4) - 12 → 3y
          return { shape: "expand-cancel", start: `${k}(${b} + ${n}) - ${k * n}`, goal: ax(k, b), via: [], numbers: [k, n, k * n], along: [] };
        case 1: // 2(a + b) - 2a → 2b
          return { shape: "expand-cancel", start: `${k}(${a} + ${b}) - ${k}${a}`, goal: ax(k, b), via: [], numbers: [k], along: [] };
        default: // x(y + 2) - xy → 2x
          return { shape: "expand-cancel", start: `${a}(${b} + ${n}) - ${a}${b}`, goal: ax(n, a), via: [], numbers: [n], along: [] };
      }
    },
  },
  {
    id: "expand-and-add",
    name: "multiply out, then add like terms",
    make: (r) => {
      // 3(2x + 1) + x - 5 → 7x - 2
      const v = letter(r);
      const k = r.int(2, 5);
      const m = r.int(2, 4);
      const n = r.signed(1, 6);
      const p = r.signed(1, 5);
      const q = r.signed(1, 9);
      if (k * m + p <= 0 || k * m > 12 || k * n + q === 0 || gcd(m, n) > 1) return null;
      const extra = `${p < 0 ? ` - ${ax(-p, v)}` : ` + ${ax(p, v)}`}${q < 0 ? ` - ${-q}` : ` + ${q}`}`;
      return {
        shape: "expand-and-add",
        start: `${k}(${lin(m, n, v)})${extra}`,
        goal: lin(k * m + p, k * n + q, v),
        via: [`${lin(k * m, k * n, v)}${extra}`],
        numbers: [k, m, n, p, q],
        along: [k * m, k * n, k * m + p, k * n + q],
      };
    },
  },
  {
    id: "simple-brackets",
    name: "two simple brackets",
    make: (r) => {
      // 2(x + 1) + 3(x - 1) → 5x - 1, 4(x + 1) - 2(x + 3) → 2x - 2
      const v = letter(r);
      const a = r.int(2, 5);
      const b = r.signed(1, 5);
      const c = r.int(2, 4);
      const d = r.signed(1, 5);
      const s = r.next() < 0.5 ? -1 : 1;
      const xs = a + s * c;
      const ns = a * b + s * c * d;
      if (xs <= 0 || b === d || ns === 0 || Math.abs(ns) > 20) return null;
      const second = `${s < 0 ? " - " : " + "}${c}(${lin(1, d, v)})`;
      return {
        shape: "simple-brackets",
        start: `${a}(${lin(1, b, v)})${second}`,
        goal: polyOr0([[xs, v], [ns, ""]]),
        via: [`${lin(a, a * b, v)}${second}`],
        numbers: [a, b, c, d],
        along: [a * b, c * d, xs, ns],
      };
    },
  },
  {
    id: "square",
    name: "x times a bracket, and a number times one",
    make: (r) => {
      // x(x + 2) + 3(x + 2) → x^2 + 5x + 6, a(a + 3) - 2(a + 1) → a^2 + a - 2
      const v = one(r, ["x", "y", "a"]);
      const n = r.signed(1, 5);
      const m = r.signed(2, 5);
      const e = r.next() < 0.5 ? n : r.signed(1, 5);
      if (n + m === 0 || m * e === 0) return null;
      const second = `${m < 0 ? " - " : " + "}${Math.abs(m)}(${lin(1, e, v)})`;
      return {
        shape: "square",
        start: `${v}(${lin(1, n, v)})${second}`,
        goal: polyOr0([[1, `${v}^2`], [n + m, v], [m * e, ""]]),
        via: [`${polyOr0([[1, `${v}^2`], [n, v]])}${second}`],
        numbers: [n, m, e],
        along: [m * e, n + m],
      };
    },
  },
  {
    id: "two-brackets",
    name: "two brackets with a number times the letter inside",
    make: (r) => {
      // 3(2x + 1) - 2(x - 3) → 4x + 9
      const v = letter(r);
      const a = r.int(2, 4);
      const m = r.int(2, 3);
      const b = r.signed(1, 5);
      const c = r.int(2, 4);
      const n = r.int(2, 3);
      const d = r.signed(1, 5);
      // Always taken away: the signs in the second bracket turn round.
      const s = -1;
      const xs = a * m + s * c * n;
      const ns = a * b + s * c * d;
      if (xs <= 0 || ns === 0 || Math.abs(ns) > 20 || (m === n && b === d) || gcd(m, b) > 1 || gcd(n, d) > 1) return null;
      const second = `${s < 0 ? " - " : " + "}${c}(${lin(n, d, v)})`;
      const start = `${a}(${lin(m, b, v)})${second}`;
      const via = [`${lin(a * m, a * b, v)}${second}`, polyOr0([[a * m, v], [a * b, ""], [s * c * n, v], [s * c * d, ""]])];
      return { shape: "two-brackets", start, goal: polyOr0([[xs, v], [ns, ""]]), via, numbers: [a, m, b, c, n, d], along: [a * m, a * b, c * n, c * d, xs, ns] };
    },
  },
  {
    id: "two-letters",
    name: "two brackets with two letters",
    make: (r) => {
      // 2(3a + b) - 3(a - 2b) → 3a + 8b, 4(3a + 2b) - 3(2a + 3b) → 6a - b
      const [a, b] = one(r, [["a", "b"], ["x", "y"]]);
      const p = r.int(2, 4);
      const m = r.int(1, 3);
      const n = r.signed(1, 3);
      // Taking away the second bracket: every sign in it turns round.
      const q = -r.int(2, 3);
      const u = r.int(1, 3);
      const w = r.signed(1, 3);
      if (m === u && n === w) return null;
      if (Math.abs(m * n) === 1 || Math.abs(u * w) === 1) return null;
      const ka = p * m + q * u;
      const kb = p * n + q * w;
      if (kb === 0 || ka <= 0 || gcd(m, n) > 1 || gcd(u, w) > 1) return null;
      const br = (k: number, l: number) => polyOr0([[k, a], [l, b]]);
      const second = `${q < 0 ? " - " : " + "}${Math.abs(q)}(${br(u, w)})`;
      const start = `${p}(${br(m, n)})${second}`;
      const goal = polyOr0([[ka, a], [kb, b]]);
      // Milestones: the first bracket multiplied out, then both.
      const via = [`${br(p * m, p * n)}${second}`, polyOr0([[p * m, a], [p * n, b], [q * u, a], [q * w, b]])];
      return { shape: "two-letters", start, goal, via, numbers: [p, m, n, q, u, w].filter((x) => Math.abs(x) !== 1), along: [p * m, p * n, q * u, q * w, ka, kb] };
    },
  },
  {
    id: "letter-brackets",
    name: "a number and a letter in front of each bracket",
    make: (r) => {
      // 3x(x + 2) - 2x(x + 1) → x^2 + 4x
      const v = one(r, ["x", "y", "a"]);
      const p = r.int(2, 4);
      const q = r.int(1, p - 1);
      const b = r.signed(1, 4);
      const c = r.signed(1, 4);
      const k2 = p - q;
      const k1 = p * b - q * c;
      if (k1 === 0 || b === c) return null;
      const start = `${front(p, v)}(${lin(1, b, v)}) - ${front(q, v)}(${lin(1, c, v)})`;
      const goal = polyOr0([[k2, `${v}^2`], [k1, v]]);
      const via = [polyOr0([[p, `${v}^2`], [p * b, v]]) + ` - ${front(q, v)}(${lin(1, c, v)})`, polyOr0([[p, `${v}^2`], [p * b, v], [-q, `${v}^2`], [-q * c, v]])];
      return { shape: "letter-brackets", start, goal, via, numbers: [p, q, b, c], along: [p * b, q * c, k1] };
    },
  },
  {
    id: "products-and-brackets",
    name: "products to work out, brackets to multiply out, like terms to add",
    make: (r) => {
      // 2·3(x - 2y) - (4x - 3·2·y) + 5x → 7x - 6y, 2·2(a + 2b) - 2(a - 2·3·b) + a → 3a + 20b
      const [a, b] = one(r, [["x", "y"], ["a", "b"]]);
      const [p, q] = one(r, [[2, 2], [2, 3], [3, 2], [2, 4], [3, 3]]);
      const k = p * q;
      const n = r.signed(2, 3);
      const m = r.int(2, 5);
      const [u, w] = one(r, [[2, 2], [2, 3], [3, 2], [2, 4], [3, 3]]);
      const ws = r.next() < 0.5 ? -1 : 1;
      const t = r.signed(1, 6);
      const z = r.int(2, 3);
      const ka = k - z * m + t;
      const kb = k * n - z * ws * u * w;
      if (ka <= 0 || kb === 0 || Math.abs(kb) > 20 || k * n === z * ws * u * w) return null;
      const extra = t < 0 ? ` - ${ax(-t, a)}` : ` + ${ax(t, a)}`;
      const second = `${z === 1 ? "" : z}(${ax(m, a)}${ws < 0 ? " - " : " + "}${u}·${w}·${b})`;
      const start = `${p}·${q}(${polyOr0([[1, a], [n, b]])}) - ${second}${extra}`;
      const via = [
        `${k}(${polyOr0([[1, a], [n, b]])}) - ${second}${extra}`,
        `${polyOr0([[k, a], [k * n, b]])} - ${second}${extra}`,
        ...[[[k, a], [k * n, b], [-z * m, a], [-z * ws * u * w, b], [t, a]] as [number, string][]].flatMap((ts) => [polyOr0(ts), ...collecting(ts)]),
      ];
      return { shape: "products-and-brackets", start, goal: polyOr0([[ka, a], [kb, b]]), via, numbers: [p, q, n, m, u, w, t, z].filter((x) => Math.abs(x) !== 1), along: [k, k * n, u * w, z * m, z * u * w, ka, kb] };
    },
  },
  {
    id: "three-brackets",
    name: "three brackets, two letters, minus signs",
    make: (r) => {
      // -(2a - 3b) + 3(a - b) - 2(2a + b) → -3a - 2b … kept to goals that start with a plus
      const [a, b] = one(r, [["a", "b"], ["x", "y"]]);
      const br = () => [r.int(1, 3), r.signed(1, 3)] as const;
      const [c1, d1] = br();
      const [c2, d2] = br();
      const [c3, d3] = br();
      const p = r.int(2, 4);
      const q = r.int(2, 3);
      if (Math.abs(c2) + Math.abs(d2) < 3 || Math.abs(c3) + Math.abs(d3) < 3) return null;
      const ka = -c1 + p * c2 - q * c3;
      const kb = -d1 + p * d2 - q * d3;
      if (ka <= 0 || kb === 0 || gcd(c2, d2) > 1 || gcd(c3, d3) > 1) return null;
      const inner = (c: number, d: number) => polyOr0([[c, a], [d, b]]);
      const first = `-(${inner(c1, d1)})`;
      const second = ` + ${p}(${inner(c2, d2)})`;
      const third = ` - ${q}(${inner(c3, d3)})`;
      const via = [
        `${inner(-c1, -d1)}${second}${third}`,
        `${polyOr0([[-c1, a], [-d1, b], [p * c2, a], [p * d2, b]])}${third}`,
        ...[[[-c1, a], [-d1, b], [p * c2, a], [p * d2, b], [-q * c3, a], [-q * d3, b]] as [number, string][]].flatMap((ts) => [polyOr0(ts), ...collecting(ts)]),
      ];
      return {
        shape: "three-brackets",
        start: `${first}${second}${third}`,
        goal: polyOr0([[ka, a], [kb, b]]),
        via,
        numbers: [c1, d1, c2, d2, c3, d3, p, q].filter((x) => Math.abs(x) !== 1),
        along: [p * c2, p * d2, q * c3, q * d3, ka, kb],
      };
    },
  },
  {
    id: "square-brackets",
    name: "a square made and taken away again",
    make: (r) => {
      // x(x - 2) - 2(x - 2) - (x^2 - 4x) → 2x + 4, 2x(x + 1) - 3(x - 2) - (2x^2 - 5x) → 4x + 6
      const v = one(r, ["x", "y", "a"]);
      const n = r.signed(1, 5);
      const m = r.int(2, 4);
      const e = r.signed(1, 5);
      const f = r.signed(1, 6);
      const j = r.int(2, 3);
      const k = j * n - m - f;
      const c = -m * e;
      if (k <= 0 || f === n || Math.abs(c) > 20) return null;
      const second = ` - ${m}(${lin(1, e, v)})`;
      const third = ` - (${polyOr0([[j, `${v}^2`], [f, v]])})`;
      const via = [
        // Multiplied out, not yet tidied: 3a·a + 3·4·a.
        `${j}${v}·${v}${n < 0 ? " - " : " + "}${Math.abs(n) === 1 ? `${j}${v}` : `${j}·${Math.abs(n)}·${v}`}${second}${third}`,
        `${polyOr0([[j, `${v}^2`], [j * n, v]])}${second}${third}`,
        `${polyOr0([[j, `${v}^2`], [j * n, v], [-m, v], [-m * e, ""]])}${third}`,
        ...[[[j, `${v}^2`], [j * n, v], [-m, v], [-m * e, ""], [-j, `${v}^2`], [-f, v]] as [number, string][]].flatMap((ts) => [polyOr0(ts), ...collecting(ts)]),
      ];
      return {
        shape: "square-brackets",
        start: `${front(j, v)}(${lin(1, n, v)})${second}${third}`,
        goal: polyOr0([[k, v], [c, ""]]),
        via,
        numbers: [n, m, e, f, j].filter((x) => Math.abs(x) !== 1),
        along: [j * n, m * e, k],
      };
    },
  },
  {
    id: "number-minus-bracket",
    name: "a number minus a bracket, a product, another bracket",
    make: (r) => {
      // 4 - 3(2 - x) + 2·x·3 - 2(x + 1) → 7x - 4
      const v = letter(r);
      const c = r.int(2, 12);
      const p = r.int(2, 5);
      const q = r.int(1, 5);
      const [g, h] = one(r, [[2, 2], [2, 3], [3, 2], [2, 4]]);
      const u = r.int(2, 4);
      const d = r.signed(1, 5);
      const kx = p + g * h - u;
      const k0 = c - p * q - u * d;
      if (kx <= 0 || k0 === 0 || c - p * q === 0) return null;
      const rest = ` + ${g}·${v}·${h} - ${u}(${lin(1, d, v)})`;
      const via = [
        `${c} - ${p * q} + ${ax(p, v)}${rest}`,
        `${c} - ${p * q} + ${ax(p, v)} + ${ax(g * h, v)} - ${u}(${lin(1, d, v)})`,
        ...[[[c, ""], [-p * q, ""], [p, v], [g * h, v], [-u, v], [-u * d, ""]] as [number, string][]].flatMap((ts) => [polyOr0(ts), ...collecting(ts)]),
      ];
      return {
        shape: "number-minus-bracket",
        start: `${c} - ${p}(${q} - ${v})${rest}`,
        goal: polyOr0([[kx, v], [k0, ""]]),
        via,
        numbers: [c, p, q, g, h, u, d],
        along: [p * q, g * h, u * d, c - p * q, kx, k0],
      };
    },
  },
];

export const shapes: Record<Level, Shape[]> = {
  easy: byIds(all, "expand", "factor", "expand-cancel", "expand-and-add", "simple-brackets", "square"),
  medium: byIds(all, "two-brackets", "two-letters", "letter-brackets"),
  // And brackets inside brackets: chapters/nested.ts.
  hard: [...byIds(all, "products-and-brackets", "three-brackets", "square-brackets", "number-minus-bracket"), ...NESTED.distribute],
};
