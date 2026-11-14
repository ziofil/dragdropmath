/** Exercise shapes for the chapter "collect": like terms added together (see ../write.ts). */
import { ax, type Draft, type Level, type Rng, type Shape } from "../write";

/** Terms written one after another, each with its own sign: ["2x", "-y", "3"] → "2x - y + 3". */
const sum = (terms: string[]) =>
  terms.map((t, i) => (i === 0 ? t : t.startsWith("-") ? ` - ${t.slice(1)}` : ` + ${t}`)).join("");

const one = <T>(r: Rng, xs: readonly T[]): T => xs[r.int(0, xs.length - 1)];

function shuffled<T>(r: Rng, xs: T[]): T[] {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = r.int(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A term: k times a monomial ("" for a plain number). */
const term = (k: number, mono: string) => (mono === "" ? `${k}` : ax(k, mono));

/** k as a product of two small numbers, if it is one: 6 → [2, 3]. */
function factors(r: Rng, k: number): [number, number] | null {
  const m = Math.abs(k);
  const ways: [number, number][] = [];
  for (let p = 2; p <= 5; p++) if (m % p === 0 && m / p >= 2 && m / p <= 5) ways.push([p, m / p]);
  return ways.length ? one(r, ways) : null;
}

/** A group of like terms: the pieces it's written as (adding up to 0 if they cancel); `prod` of the biggest written as number·letter·number. */
type Group = { mono: string; parts: number[]; prod?: number };

/** Split `total` into `n` non-zero pieces, each at most `max` in size, with some minus signs. */
function split(r: Rng, total: number, n: number, max = 6): number[] | null {
  const parts: number[] = [];
  for (let i = 0; i < n - 1; i++) parts.push(r.next() < 0.35 ? -r.int(1, max) : r.int(1, max));
  const last = total - parts.reduce((s, p) => s + p, 0);
  if (last === 0 || Math.abs(last) > max) return null;
  // No hidden pair that cancels (3y ... - 3y) when the group doesn't cancel as a whole.
  const all = [...parts, last];
  if (all.some((p, i) => all.some((q, j) => j > i && p === -q))) return null;
  return all;
}

/**
 * The exercise from its groups of like terms: the start is every piece, in a
 * jumble (no two like terms side by side when there are unlike ones); the goal
 * is each group added up, in the groups' order, cancelled ones left out.
 */
function build(r: Rng, shape: string, groups: Group[], opts: { firstMinus?: boolean } = {}): Draft | null {
  type Piece = { k: number; mono: string; prod: boolean };
  const pieces: Piece[] = groups.flatMap((g) => {
    const big = g.parts.map((k, i) => [Math.abs(k), i]).sort((x, y) => y[0] - x[0]).slice(0, g.prod ?? 0).map(([, i]) => i);
    return g.parts.map((k, i) => ({ k, mono: g.mono, prod: big.includes(i) }));
  });
  let order: Piece[] | null = null;
  for (let t = 0; t < 30 && !order; t++) {
    const o = shuffled(r, pieces);
    if (!opts.firstMinus && o[0].k < 0) continue;
    if (groups.length > 1 && o.some((p, i) => i > 0 && o[i - 1].mono === p.mono)) continue;
    order = o;
  }
  if (!order) return null;
  const numbers: number[] = [];
  const along: number[] = [];
  const texts: string[] = [];
  for (const { k, mono, prod } of order) {
    const f = prod ? factors(r, k) : null;
    if (prod && !f) return null;
    if (f) {
      numbers.push(...f);
      along.push(k);
      const [p, q] = f;
      const body =
        mono === ""
          ? `${p}·${q}`
          : /^[a-z]{2}$/.test(mono)
            ? // Two letters with the numbers among them: 2·a·3·b, a·2·b·3, 2·a·b·3. (Letters kept in order:
              // in a sum, the engine can't turn b·a round into ab, see the report on y·x + 4.)
              one(r, [`${p}·${mono[0]}·${q}·${mono[1]}`, `${mono[0]}·${p}·${mono[1]}·${q}`, `${p}·${mono[0]}·${mono[1]}·${q}`])
            : one(r, [`${p}·${mono}·${q}`, `${mono}·${p}·${q}`, `${p}·${q}·${mono}`]);
      texts.push(k < 0 ? `-${body}` : body);
    } else {
      if (Math.abs(k) > 1 || mono === "") numbers.push(Math.abs(k));
      texts.push(term(k, mono));
    }
  }
  const totals = groups.map((g) => ({ mono: g.mono, k: g.parts.reduce((s, p) => s + p, 0) })).filter((g) => g.k !== 0);
  if (!totals.length || totals[0].k < 0) return null;
  along.push(...totals.map((g) => g.k));
  const goal = sum(totals.map((g) => term(g.k, g.mono)));
  const start = sum(texts);
  if (start === goal) return null;
  // Milestones, for the longer ones: each product worked out, then each group added up, where its first term stood.
  const via: string[] = [];
  if (pieces.length > 4) {
    const now: (string | null)[] = texts.slice();
    order.forEach((p, i) => {
      if (now[i] === term(p.k, p.mono)) return;
      now[i] = term(p.k, p.mono);
      via.push(sum(now.filter((t): t is string => t !== null)));
    });
    for (const g of groups) {
      const at = order.map((p, i) => (p.mono === g.mono ? i : -1)).filter((i) => i >= 0);
      if (at.length < 2) continue;
      // One term at a time onto the first.
      let k = order[at[0]].k;
      for (const i of at.slice(1)) {
        k += order[i].k;
        now[at[0]] = k !== 0 ? term(k, g.mono) : null;
        now[i] = null;
        const left = now.filter((t): t is string => t !== null);
        if (left.length) via.push(sum(left));
      }
    }
  }
  return { shape, start, goal, via: via.filter((v, i) => v !== goal && via.indexOf(v) === i), numbers, along };
}

const letter = (r: Rng) => one(r, ["x", "y", "a", "b"]);
const pair = (r: Rng) => one(r, [["x", "y"], ["a", "b"]]);

const all: Shape[] = [
  {
    id: "two-like",
    name: "two like terms, maybe a number",
    make: (r) => {
      // 3x + 2x → 5x, x + 4 + x → 2x + 4, 5y - 2y + 3 → 3y + 3, xy + 3 + 2xy → 3xy + 3
      const mono = r.next() < 0.25 ? one(r, ["ab", "xy"]) : letter(r);
      const p = r.int(1, 6);
      const q = r.int(1, 5);
      const minus = r.next() < 0.35;
      if (minus && p <= q) return null;
      const groups: Group[] = [{ mono, parts: [p, minus ? -q : q] }];
      if (r.next() < 0.6) groups.push({ mono: "", parts: [r.int(1, 9)] });
      return build(r, "two-like", groups);
    },
  },
  {
    id: "cancel-or-product",
    name: "a term that cancels, or a product to work out first",
    make: (r) => {
      const [a, b] = pair(r);
      switch (r.int(0, 2)) {
        case 0: {
          // a + b - a → b, x + y - x + 2y → 3y
          const k = r.int(1, 3);
          const q = r.next() < 0.5 ? [k] : [1, k];
          const d = build(r, "cancel-or-product", [{ mono: a, parts: [1, -1] }, { mono: b, parts: q }]);
          // The cancelling pair kept apart, so it's spotted, not just next to each other.
          return d && d.start.startsWith(a) ? d : null;
        }
        case 1:
          // 2·x·3 + x → 7x
          return build(r, "cancel-or-product", [{ mono: letter(r), parts: [one(r, [4, 6, 8, 9, 10, 12]), r.int(1, 3)], prod: 1 }]);
        default: {
          // 5a - 2a + a → 4a
          const parts = split(r, r.int(2, 6), 3, 6);
          return parts && build(r, "cancel-or-product", [{ mono: letter(r), parts }]);
        }
      }
    },
  },
  {
    id: "letter-and-numbers",
    name: "one letter's terms and numbers",
    make: (r) => {
      // 2x + 3 + 4x - 1 + x - 5 → 7x - 3, with a product now and then
      const xs = split(r, r.int(2, 9), 3);
      const ns = split(r, r.signed(1, 9), 3, 9);
      if (!xs || !ns) return null;
      return build(r, "letter-and-numbers", [{ mono: letter(r), parts: xs, prod: Math.max(...xs) >= 4 ? 1 : 0 }, { mono: "", parts: ns }]);
    },
  },
  {
    id: "two-letters",
    name: "two letters' terms",
    make: (r) => {
      // 4x - y + 2y - 3x + 5x - 3y → 6x - 2y, 5x - 3 + 2y - 4x + 3 + y → x + 3y
      const [a, b] = pair(r);
      const xs = split(r, r.int(1, 7), 3);
      const ys = split(r, r.signed(1, 6), r.int(2, 3));
      if (!xs || !ys) return null;
      const groups: Group[] = [{ mono: a, parts: xs }, { mono: b, parts: ys }];
      if (ys.length === 2) {
        const n = r.int(1, 6);
        groups.push({ mono: "", parts: r.next() < 0.5 ? [-n, n] : [n, r.signed(1, 6)] });
      }
      return build(r, "two-letters", groups);
    },
  },
  {
    id: "products-and-like",
    name: "products to work out, then like terms",
    make: (r) => {
      // 4·x·2 - 3x + y·2·3 + y - 2x → 3x + 7y
      const [a, b] = pair(r);
      const big = one(r, [4, 6, 8, 9, 10, 12]);
      const xs = [big, -r.int(1, big - 1), r.signed(1, 4)];
      if (xs[0] + xs[1] + xs[2] <= 0 || xs[1] === -xs[2]) return null;
      const ys = [one(r, [4, 6, 8, 9]), r.signed(1, 4)];
      if (ys[0] + ys[1] === 0) return null;
      return build(r, "products-and-like", [{ mono: a, parts: xs, prod: 1 }, { mono: b, parts: ys, prod: 1 }]);
    },
  },
  {
    id: "letters-and-number",
    name: "three letters and a number, products and all",
    make: (r) => {
      // 2·4 + 3a - c + 2·b·3 - a + 2c - 2b + a - 3 → 3a + 4b + c + 5
      const [a, b, c] = one(r, [["a", "b", "c"], ["x", "y", "z"]]);
      const as = split(r, r.int(1, 6), 3);
      const bs = split(r, r.int(1, 6), 2, 9);
      const cs = split(r, r.signed(1, 5), 2);
      const n = one(r, [4, 6, 8, 9, 10, 12]);
      const ns = [n, r.signed(1, 9)];
      if (!as || !bs || !cs || ns[0] + ns[1] === 0 || Math.max(...bs.map(Math.abs)) < 4) return null;
      return build(r, "letters-and-number", [
        { mono: a, parts: as },
        { mono: b, parts: bs, prod: 1 },
        { mono: c, parts: cs },
        { mono: "", parts: ns, prod: 1 },
      ]);
    },
  },
  {
    id: "mixed-terms",
    name: "unlike terms that look alike",
    make: (r) => {
      // 2ab + 3a - ab + b + 2·a·2 - 2b + ab - a + 3b → 2ab + 6a + 2b
      // 3·x·2 - 2x^2 + 5 + x^2 - 4x + 2x^2 - 1 + x + 2 → x^2 + 3x + 6
      const kind = r.int(0, 2);
      const top = split(r, r.int(1, 4), 3, 5);
      const mid = split(r, r.int(1, 6), 3, 9);
      const third = split(r, r.signed(1, 5), 3);
      const thirdN = split(r, r.signed(1, 9), 3, 9);
      if (!top || !mid || !third || !thirdN || Math.max(...mid.map(Math.abs)) < 4) return null;
      if (kind === 0)
        return build(r, "mixed-terms", [{ mono: "ab", parts: top }, { mono: "a", parts: mid, prod: 1 }, { mono: "b", parts: third }]);
      if (kind === 1)
        return build(r, "mixed-terms", [{ mono: "xy", parts: top }, { mono: "x", parts: mid, prod: 1 }, { mono: "y", parts: third }]);
      return build(r, "mixed-terms", [{ mono: "x^2", parts: top }, { mono: "x", parts: mid, prod: 1 }, { mono: "", parts: thirdN }]);
    },
  },
  {
    id: "cancel-out",
    name: "a whole letter cancels",
    make: (r) => {
      // 3a - 2b + 5c - a + 4b - 2a + c·2·3 + b - c → 3b + 10c (the a's cancel)
      const [a, b, c] = one(r, [["a", "b", "c"], ["x", "y", "z"]]);
      const k = r.int(2, 6);
      const as = shuffled(r, [k, -r.int(1, k - 1)]);
      as.push(-(as[0] + as[1]));
      const bs = split(r, r.int(1, 5), 3);
      const cs = split(r, r.int(1, 9), 3, 9);
      if (!bs || !cs || Math.max(...cs.map(Math.abs)) < 4) return null;
      return build(r, "cancel-out", [{ mono: a, parts: as }, { mono: b, parts: bs }, { mono: c, parts: cs, prod: 1 }]);
    },
  },
  {
    id: "letter-products",
    name: "products of two letters, single letters and numbers, all mixed",
    make: (r) => {
      // 2·a·3·b - ab + 2·a·2 + a·4·b - 2·3 - a + 8 - 2b + 3b → 9ab + 3a + b + 2
      const [a, b] = one(r, [["a", "b"], ["x", "y"]]);
      const ab = split(r, r.int(2, 9), 3, 12);
      const as = split(r, r.signed(1, 6), 2, 9);
      const bs = split(r, r.signed(1, 5), 2);
      const ns = split(r, r.signed(1, 9), 2, 12);
      if (!ab || !as || !bs || !ns) return null;
      const big = (xs: number[], n: number) => xs.filter((k) => factors(r, k)).length >= n;
      if (!big(ab, 2) || !big(as, 1) || !big(ns, 1)) return null;
      return build(r, "letter-products", [
        { mono: a + b, parts: ab, prod: 2 },
        { mono: a, parts: as, prod: 1 },
        { mono: b, parts: bs },
        { mono: "", parts: ns, prod: 1 },
      ]);
    },
  },
  {
    id: "square-products",
    name: "squares, letters and numbers, products and minus signs",
    make: (r) => {
      // 2·x^2·3 - 4x + 5 - x^2 + 2·x·3 - 2·4 - 3x^2 + x + 6 → 2x^2 + 3x + 3
      const v = one(r, ["x", "y", "a"]);
      const sq = split(r, r.int(1, 5), 3, 12);
      const xs = split(r, r.signed(1, 7), 3, 12);
      const ns = split(r, r.signed(1, 9), 3, 12);
      if (!sq || !xs || !ns) return null;
      const big = (ks: number[]) => ks.some((k) => factors(r, k));
      if (!big(sq) || !big(xs) || !big(ns)) return null;
      return build(r, "square-products", [
        { mono: `${v}^2`, parts: sq, prod: 1 },
        { mono: v, parts: xs, prod: 1 },
        { mono: "", parts: ns, prod: 1 },
      ]);
    },
  },
  {
    id: "partly-cancel",
    name: "three kinds of term, one cancelling, with products",
    make: (r) => {
      // 3xy - 2·x·3 + y + 2·x·y - 4y + 6x - xy + 3·2 - 1 → 4xy - 3y + 5 (the x's cancel)
      const [a, b] = one(r, [["x", "y"], ["a", "b"]]);
      const k = one(r, [4, 6, 8, 9]);
      const ax0 = shuffled(r, [k, -r.int(1, k - 1)]);
      ax0.push(-(ax0[0] + ax0[1]));
      const ab = split(r, r.int(1, 6), 3, 8);
      const bs = split(r, r.signed(1, 6), 3);
      const ns = [one(r, [4, 6, 8, 9, 10]), r.signed(1, 9)];
      if (!ab || !bs || ns[0] + ns[1] === 0 || Math.abs(ax0[2]) > 9 || ax0[2] === 0) return null;
      return build(r, "partly-cancel", [
        { mono: a + b, parts: ab, prod: ab.some((x) => factors(r, x)) ? 1 : 0 },
        { mono: a, parts: ax0, prod: 1 },
        { mono: b, parts: bs },
        { mono: "", parts: ns, prod: 1 },
      ]);
    },
  },
];

const pick = (...ids: string[]) => ids.map((id) => all.find((s) => s.id === id)!);

export const shapes: Record<Level, Shape[]> = {
  easy: pick("two-like", "cancel-or-product", "letter-and-numbers", "two-letters", "products-and-like"),
  medium: pick("letters-and-number", "mixed-terms", "cancel-out"),
  hard: pick("letter-products", "square-products", "partly-cancel"),
};
