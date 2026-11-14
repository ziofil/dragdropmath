/** Exercise shapes for the chapter "shuffle": terms in any order, numbers worked out (see ../write.ts). */
import { ax, lin, type Draft, type Level, type Rng, type Shape } from "../write";

/** Terms written one after another, each with its own sign: ["2", "-x", "3·y·2"] → "2 - x + 3·y·2". */
const sum = (terms: string[]) =>
  terms.map((t, i) => (i === 0 ? t : t.startsWith("-") ? ` - ${t.slice(1)}` : ` + ${t}`)).join("");

/** One of the list. */
const one = <T>(r: Rng, xs: readonly T[]): T => xs[r.int(0, xs.length - 1)];

/** k times a letter, as a product of two numbers and the letter in some order: "2·x·3", "x·2·3", "2·3·x". */
function product(r: Rng, k: number, v: string): { text: string; factors: [number, number] } | null {
  const m = Math.abs(k);
  const ways: [number, number][] = [];
  for (let p = 2; p <= 5; p++) if (m % p === 0 && m / p >= 2 && m / p <= 5) ways.push([p, m / p]);
  if (!ways.length) return null;
  const [p, q] = one(r, ways);
  const text = one(r, [`${p}·${v}·${q}`, `${v}·${p}·${q}`, `${p}·${q}·${v}`]);
  return { text: k < 0 ? `-${text}` : text, factors: [p, q] };
}

const letter = (r: Rng) => one(r, ["x", "y", "a", "b"]);

const all: Shape[] = [
  {
    id: "numbers-around",
    name: "a letter among numbers",
    make: (r) => {
      const v = letter(r);
      const p = r.int(1, 9);
      const q = r.int(1, 9);
      const k = r.next() < 0.3 ? r.int(2, 5) : 1;
      switch (r.int(0, 3)) {
        case 0: // p + v + q → v + (p + q)
          return draft("numbers-around", sum([`${p}`, ax(k, v), `${q}`]), lin(k, p + q, v), [p, q, k], [p + q]);
        case 1: // v + p - q → v + (p - q)
          if (p === q) return null;
          return draft("numbers-around", sum([ax(k, v), `${p}`, `-${q}`]), lin(k, p - q, v), [p, q, k], [p - q]);
        case 2: // p - q + v → v + (p - q)
          if (p === q) return null;
          return draft("numbers-around", sum([`${p}`, `-${q}`, ax(k, v)]), lin(k, p - q, v), [p, q, k], [p - q]);
        default: {
          // p - v - q → (p - q) - v
          const big = p + q;
          return draft("numbers-around", sum([`${big}`, `-${ax(k, v)}`, `-${q}`]), `${p} - ${ax(k, v)}`, [big, q, k], [p]);
        }
      }
    },
  },
  {
    id: "numbers-together",
    name: "two numbers multiplied with a letter",
    make: (r) => {
      const v = letter(r);
      const p = r.int(2, 5);
      const q = r.int(2, 5);
      const c = r.int(1, 12);
      const k = p * q;
      const order = one(r, [`${p}·${v}·${q}`, `${v}·${p}·${q}`, `${p}·${q}·${v}`]);
      switch (r.int(0, 3)) {
        case 0: // p·v·q → (pq)v
          return draft("numbers-together", order, ax(k, v), [p, q], [k]);
        case 1: {
          // p·a·q·b → (pq)ab
          const [a, b] = one(r, [["a", "b"], ["x", "y"]]);
          return draft("numbers-together", `${p}·${a}·${q}·${b}`, ax(k, a + b), [p, q], [k]);
        }
        case 2: // c - p·q·y → c - (pq)y
          return draft("numbers-together", `${c} - ${order}`, `${c} - ${ax(k, v)}`, [c, p, q], [k]);
        default: // c + p·v·q → (pq)v + c
          return draft("numbers-together", `${c} + ${order}`, lin(k, c, v), [c, p, q], [k]);
      }
    },
  },
  {
    id: "product-and-numbers",
    name: "a product and two numbers",
    make: (r) => {
      const k = r.int(2, 5) * r.int(2, 5);
      const p = r.int(1, 9);
      const q = r.int(1, 9);
      if (p === q) return null;
      if (r.next() < 0.4) {
        // k·x·m·y + p - q → (km)xy + (p - q)
        const [a, b] = one(r, [["x", "y"], ["a", "b"]]);
        const pr = product(r, k, "")!;
        const [m, n] = pr.factors;
        return draft("product-and-numbers", sum([`${m}·${a}·${n}·${b}`, `${p}`, `-${q}`]), lin(k, p - q, a + b), [m, n, p, q], [k, p - q]);
      }
      // p + k·a·m - q + b → (km)a + b + (p - q), the second letter after the first in the alphabet
      const [a, b] = one(r, [["x", "y"], ["a", "b"]]);
      const pr = product(r, k, a);
      if (!pr) return null;
      const terms = r.next() < 0.5 ? [`${p}`, pr.text, `-${q}`, b] : [pr.text, `${p}`, `-${q}`, b];
      return draft("product-and-numbers", sum(terms), `${ax(k, a)} + ${b}${sign(p - q)}`, [...pr.factors, p, q], [k, p - q]);
    },
  },
  {
    id: "two-letters",
    name: "two letters and some numbers",
    make: (r) => {
      const [a, b] = one(r, [["x", "y"], ["a", "b"]]);
      const p = r.int(1, 9);
      const q = r.int(1, 9);
      switch (r.int(0, 2)) {
        case 0: // p + a + q + b → a + b + (p + q)
          return draft("two-letters", sum(r.next() < 0.5 ? [`${p}`, a, `${q}`, b] : [a, `${p}`, b, `${q}`]), `${a} + ${b}${sign(p + q)}`, [p, q], [p + q]);
        case 1: {
          // a + p + b + q + s → a + b + (p + q + s)
          const s = r.int(1, 5);
          return draft("two-letters", sum([a, `${p}`, b, `${q}`, `${s}`]), `${a} + ${b}${sign(p + q + s)}`, [p, q, s], [p + q, p + q + s]);
        }
        default: {
          // k·b·m + p + a → a + (km)b + p, or with "- q" as well
          const k = r.int(2, 5) * r.int(2, 4);
          const pr = product(r, k, b);
          if (!pr) return null;
          if (r.next() < 0.5) return draft("two-letters", sum([pr.text, `${p}`, a]), `${a} + ${ax(k, b)}${sign(p)}`, [...pr.factors, p], [k]);
          if (p === q) return null;
          return draft("two-letters", sum([`${p}`, pr.text, a, `-${q}`]), `${a} + ${ax(k, b)}${sign(p - q)}`, [...pr.factors, p, q], [k, p - q]);
        }
      }
    },
  },
  {
    id: "three-letters",
    name: "three letters, products, and a number to put last",
    make: (r) => {
      // 2·4 - z + y·3 + x·3·3 → 9x + 3y - z + 8: each letter a term, some written as products.
      const vs = one(r, [["x", "y", "z"], ["a", "b", "c"]]);
      // Two or three of the letters written as products, the others plain; at most one minus, never on the first letter.
      const asProduct = shuffled(r, [true, true, r.next() < 0.4]);
      const neg = r.next() < 0.6 ? r.int(1, 2) : -1;
      const cs = vs.map((_, i) => (i === neg ? -1 : 1) * (asProduct[i] ? one(r, [4, 6, 8, 9, 10, 12, 15]) : r.int(1, 6)));
      const c = r.int(2, 12);
      const mids: string[] = [];
      const numbers: number[] = [];
      const along: number[] = [];
      for (let i = 0; i < 3; i++) {
        const pr = asProduct[i] ? product(r, cs[i], vs[i]) : null;
        if (pr) {
          mids.push(pr.text);
          numbers.push(...pr.factors);
          along.push(cs[i]);
        } else {
          mids.push(ax(cs[i], vs[i]));
          if (Math.abs(cs[i]) > 1) numbers.push(Math.abs(cs[i]));
        }
      }
      // The number first, also a product now and then.
      const cp = product(r, c, "");
      const first = cp && r.next() < 0.6 ? `${cp.factors[0]}·${cp.factors[1]}` : `${c}`;
      if (cp && first.includes("·")) (numbers.push(...cp.factors), along.push(c));
      else numbers.push(c);
      // Never already in order.
      const order = shuffled(r, [0, 1, 2]);
      if (order[0] === 0 && order[1] === 1) return null;
      const start = sum([first, ...order.map((i) => mids[i])]);
      const goal = sum([...cs.map((k, i) => ax(k, vs[i])), `${c}`]);
      // Halfway: every product worked out, the terms as they were.
      const via = sum([`${c}`, ...order.map((i) => ax(cs[i], vs[i]))]);
      return { shape: "three-letters", start, goal, via: [via], numbers, along };
    },
  },
  {
    id: "ab-product",
    name: "a product of two letters and three numbers",
    make: (r) => {
      // 2·a·3·b·2 + 5 - 3 + 4·c → 12ab + 4c + 2
      const [a, b, c] = one(r, [["a", "b", "c"], ["x", "y", "z"]]);
      const m = r.int(2, 3);
      const n = r.int(2, 4);
      const o = r.int(2, 3);
      const k = m * n * o;
      const p = r.int(2, 9);
      const q = r.int(1, 8);
      const s = r.int(2, 6);
      if (p === q || k > 30) return null;
      const big = `${m}·${a}·${n}·${b}·${o}`;
      const terms = r.next() < 0.5 ? [big, `${p}`, `-${q}`, `${s}·${c}`] : [`${p}`, big, `-${q}`, `${s}·${c}`];
      // Halfway: the long product worked out.
      const via = sum(terms.map((t) => (t === big ? ax(k, a + b) : t)));
      return draft("ab-product", sum(terms), `${ax(k, a + b)} + ${ax(s, c)}${sign(p - q)}`, [m, n, o, p, q, s], [m * n, k, p - q], [via]);
    },
  },
];

const sign = (n: number) => (n < 0 ? ` - ${-n}` : ` + ${n}`);

function shuffled<T>(r: Rng, xs: T[]): T[] {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = r.int(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function draft(shape: string, start: string, goal: string, numbers: number[], along: number[], via: string[] = []) {
  return { shape, start, goal, via, numbers, along };
}

/** A letter term of a longer sum: k times `mono`, written plain ("-3y"), as a product ("y·3·2"), or with three numbers ("2·a·3·b·2"). */
type Lt = { mono: string; k: number; form: "plain" | "product" | "triple" };

/**
 * A long sum to tidy: letter terms (some written as products) and plain
 * numbers (the first maybe as a product), jumbled. The goal is the letters
 * in alphabetical order, then the number. Milestones: the products worked
 * out, then the numbers added up.
 */
function mix(r: Rng, shape: string, letters: Lt[], nums: number[], numProduct = false): Draft | null {
  const numbers: number[] = [];
  const along: number[] = [];
  type Piece = { text: string; done: string; neg: boolean; num: boolean };
  const pieces: Piece[] = [];
  for (const { mono, k, form } of letters) {
    if (k === 0) return null;
    let text = ax(k, mono);
    if (form === "product") {
      const f = factorsOf(r, k);
      if (!f) return null;
      const [p, q] = f;
      const body =
        mono.length === 2 ? `${p}·${mono[0]}·${q}·${mono[1]}` : one(r, [`${p}·${mono}·${q}`, `${mono}·${p}·${q}`, `${p}·${q}·${mono}`]);
      text = k < 0 ? `-${body}` : body;
      numbers.push(p, q);
      along.push(k);
    } else if (form === "triple") {
      const m = Math.abs(k);
      const ways: number[][] = [];
      for (const x of [2, 3]) for (const y of [2, 3, 4]) for (const z of [2, 3]) if (x * y * z === m) ways.push([x, y, z]);
      if (!ways.length || mono.length !== 2) return null;
      const [x, y, z] = one(r, ways);
      const body = `${x}·${mono[0]}·${y}·${mono[1]}·${z}`;
      text = k < 0 ? `-${body}` : body;
      numbers.push(x, y, z);
      along.push(x * y, k);
    } else if (Math.abs(k) > 1) numbers.push(Math.abs(k));
    pieces.push({ text, done: ax(k, mono), neg: k < 0, num: false });
  }
  nums.forEach((n, i) => {
    const f = i === 0 && numProduct && n > 0 ? factorsOf(r, n) : null;
    if (f) (numbers.push(...f), along.push(n));
    else numbers.push(Math.abs(n));
    pieces.push({ text: f ? `${f[0]}·${f[1]}` : `${n}`, done: `${n}`, neg: n < 0, num: true });
  });
  // No pair of numbers that cancels at sight (… + 1 … - 1).
  if (nums.some((n, i) => nums.some((m, j) => j > i && n === -m))) return null;
  const total = nums.reduce((s, n) => s + n, 0);
  if (total === 0) return null;
  // Partial sums met on the way.
  let acc = 0;
  for (const n of nums.slice(0, -1)) ((acc += n), along.push(acc));
  if (along.includes(0)) return null;
  let order: Piece[] | null = null;
  for (let t = 0; t < 30 && !order; t++) {
    const o = shuffled(r, pieces);
    // Not starting with a minus; no two plain numbers side by side (they'd be added at sight).
    if (o[0].neg || o.some((p, i) => i > 0 && p.num && o[i - 1].num)) continue;
    order = o;
  }
  if (!order) return null;
  const start = sum(order.map((p) => p.text));
  // One milestone per product worked out, in the order they're written.
  const steps: string[] = [];
  const now = order.map((p) => p.text);
  order.forEach((p, i) => {
    if (p.text === p.done) return;
    now[i] = p.done;
    steps.push(sum(now));
  });
  const sorted = letters.slice().sort((x, y) => (x.mono < y.mono ? -1 : 1));
  const goal = sum([...sorted.map((l) => ax(l.k, l.mono)), `${total}`]);
  const added = sum([...letters.map((l) => ax(l.k, l.mono)), `${total}`]);
  const via = [...steps, added].filter((v, i, vs) => v !== start && vs.indexOf(v) === i);
  return { shape, start, goal, via, numbers, along };
}

/** k (either sign) as two small numbers multiplied: 12 → [3, 4]. */
function factorsOf(r: Rng, k: number): [number, number] | null {
  const m = Math.abs(k);
  const ways: [number, number][] = [];
  for (let p = 2; p <= 5; p++) if (m % p === 0 && m / p >= 2 && m / p <= 5) ways.push([p, m / p]);
  return ways.length ? one(r, ways) : null;
}

const PRODUCTS = [4, 6, 8, 9, 10, 12, 15];
/** Small numbers to add up, some taken away. */
const someNumbers = (r: Rng, n: number) => Array.from({ length: n }, (_, i) => (i > 0 && r.next() < 0.4 ? -1 : 1) * r.int(1, 9));

all.push(
  {
    id: "two-products",
    name: "two letters as products, and numbers",
    make: (r) => {
      // 4 + b·2·3 - 1 + 2·a·5 + 2 → 10a + 6b + 5
      const [a, b] = one(r, [["x", "y"], ["a", "b"]]);
      return mix(
        r,
        "two-products",
        [
          { mono: a, k: one(r, PRODUCTS), form: "product" },
          { mono: b, k: (r.next() < 0.3 ? -1 : 1) * one(r, PRODUCTS), form: "product" },
        ],
        someNumbers(r, 3),
      );
    },
  },
  {
    id: "three-plain",
    name: "three letters and numbers to put in order",
    make: (r) => {
      // z + 4 - y·2·3 + 3 + x·2·3 - 1 → 6x - 6y + z + 6
      const vs = one(r, [["x", "y", "z"], ["a", "b", "c"]]);
      const plain = r.int(0, 2);
      return mix(
        r,
        "three-plain",
        vs.map((mono, i) => (i !== plain ? { mono, k: one(r, PRODUCTS), form: "product" as const } : { mono, k: (i > 0 && r.next() < 0.3 ? -1 : 1) * r.int(1, 6), form: "plain" as const })),
        someNumbers(r, 3),
      );
    },
  },
  {
    id: "long-sum",
    name: "three letters as products, a product of numbers, and more numbers",
    make: (r) => {
      // 2·3 - z·2·2 + 5 + y·3·3 + x·2·5 - 4 + 1 → 10x + 9y - 4z + 8
      const vs = one(r, [["x", "y", "z"], ["a", "b", "c"]]);
      const neg = r.int(1, 2);
      const letters: Lt[] = vs.map((mono, i) => ({ mono, k: (i === neg && r.next() < 0.6 ? -1 : 1) * one(r, PRODUCTS), form: "product" }));
      const nums = [one(r, [4, 6, 8, 9, 10, 12]), ...someNumbers(r, 3)];
      return mix(r, "long-sum", letters, nums, true);
    },
  },
  {
    id: "long-ab",
    name: "a product of two letters and three numbers, and more",
    make: (r) => {
      // 2·4 + 2·a·3·b·2 - 3 + c·2·3 - 1 + 2·d·2 + 5 → 12ab + 6c + 4d + 9
      const [ab, c, d] = one(r, [["ab", "c", "d"], ["xy", "z", "a"]]);
      const letters: Lt[] = [
        { mono: ab, k: one(r, [8, 12, 18, 24]), form: "triple" },
        { mono: c, k: (r.next() < 0.3 ? -1 : 1) * one(r, PRODUCTS), form: "product" },
        { mono: d, k: one(r, PRODUCTS), form: "product" },
      ];
      return mix(r, "long-ab", letters, [one(r, [4, 6, 8, 9, 10, 12]), ...someNumbers(r, 3)], true);
    },
  },
);

const pick = (...ids: string[]) => ids.map((id) => all.find((s) => s.id === id)!);

export const shapes: Record<Level, Shape[]> = {
  easy: pick("numbers-around", "numbers-together"),
  medium: pick("two-products", "three-plain"),
  hard: pick("long-sum", "long-ab"),
};
