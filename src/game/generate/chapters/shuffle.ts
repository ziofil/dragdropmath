/** Exercise shapes for the chapter "shuffle": terms in any order, numbers worked out (see ../write.ts). */
import { ax, byIds, lin, one, shuffled, signedSum, type Draft, type Level, type Rng, type Shape } from "../write";

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
          return draft("numbers-around", signedSum([`${p}`, ax(k, v), `${q}`]), lin(k, p + q, v), [p, q, k], [p + q]);
        case 1: // v + p - q → v + (p - q)
          if (p === q) return null;
          return draft("numbers-around", signedSum([ax(k, v), `${p}`, `-${q}`]), lin(k, p - q, v), [p, q, k], [p - q]);
        case 2: // p - q + v → v + (p - q)
          if (p === q) return null;
          return draft("numbers-around", signedSum([`${p}`, `-${q}`, ax(k, v)]), lin(k, p - q, v), [p, q, k], [p - q]);
        default: {
          // p - v - q → (p - q) - v
          const big = p + q;
          return draft("numbers-around", signedSum([`${big}`, `-${ax(k, v)}`, `-${q}`]), `${p} - ${ax(k, v)}`, [big, q, k], [p]);
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
];

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
  const start = signedSum(order.map((p) => p.text));
  // One milestone per product worked out, in the order they're written.
  const steps: string[] = [];
  const now = order.map((p) => p.text);
  order.forEach((p, i) => {
    if (p.text === p.done) return;
    now[i] = p.done;
    steps.push(signedSum(now));
  });
  const sorted = letters.slice().sort((x, y) => (x.mono < y.mono ? -1 : 1));
  const goal = signedSum([...sorted.map((l) => ax(l.k, l.mono)), `${total}`]);
  const added = signedSum([...letters.map((l) => ax(l.k, l.mono)), `${total}`]);
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

export const shapes: Record<Level, Shape[]> = {
  easy: byIds(all, "numbers-around", "numbers-together"),
  medium: byIds(all, "two-products", "three-plain"),
  hard: byIds(all, "long-sum", "long-ab"),
};
