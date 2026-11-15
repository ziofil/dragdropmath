/**
 * Number fractions to work out, built from random pieces: fractions and
 * whole numbers joined by +, −, · and ÷, nested at Hard. The answer is
 * worked out exactly (rational arithmetic); the milestones are each
 * operation done in turn, innermost first (two bottoms made the same before
 * adding), so the move engine checks each in a few moves.
 */
import { gcd, one as pick, type Draft, type Level, type Rng, type Shape } from "./write";

type Q = { n: number; d: number };
const q = (n: number, d = 1): Q => {
  const g = gcd(n, d) || 1;
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
};
const plusQ = (a: Q, b: Q, sign = 1) => q(a.n * b.d + sign * b.n * a.d, a.d * b.d);
const timesQ = (a: Q, b: Q) => q(a.n * b.n, a.d * b.d);
const overQ = (a: Q, b: Q) => q(a.n * b.d, a.d * b.n);

type Op = "+" | "-" | "·" | "÷";
type Node = { kind: "leaf"; v: Q } | { kind: "op"; op: Op; a: Node; b: Node } | { kind: "raw"; text: string; v: Q };

const valueOf = (t: Node): Q =>
  t.kind !== "op" ? t.v : t.op === "+" ? plusQ(valueOf(t.a), valueOf(t.b)) : t.op === "-" ? plusQ(valueOf(t.a), valueOf(t.b), -1) : t.op === "·" ? timesQ(valueOf(t.a), valueOf(t.b)) : overQ(valueOf(t.a), valueOf(t.b));

const qStr = (v: Q) => (v.d === 1 ? `${v.n}` : `${v.n}/${v.d}`);

/** How a node is written: fractions in brackets where a product or a bar needs them. */
function write(t: Node, parent: Op | null = null, right = false): string {
  if (t.kind === "raw") return parent === "·" || parent === "÷" ? `(${t.text})` : t.text;
  if (t.kind === "leaf") {
    const s = qStr(t.v);
    return t.v.d !== 1 && (parent === "·" || parent === "÷") ? `(${s})` : s;
  }
  const inner = t.op === "÷" ? `${write(t.a, "÷")}/${write(t.b, "÷", true)}` : `${write(t.a, t.op)} ${t.op === "·" ? "·" : t.op} ${write(t.b, t.op, true)}`;
  // Inside a product or a bar every operation is bracketed: ((4/5)/(2/3)) · (…) reads one way only.
  const wrap = parent === "·" || parent === "÷" ? true : parent === "-" && right && (t.op === "+" || t.op === "-");
  return wrap ? `(${inner})` : inner;
}

const BOTTOMS = [2, 3, 4, 5, 6, 8, 10];
/** A simple fraction (proper, lowest terms) or now and then a whole number. */
function leaf(r: Rng, whole = 0.15): Node {
  if (r.next() < whole) return { kind: "leaf", v: q(r.int(1, 4)) };
  const d = pick(r, BOTTOMS);
  let n = r.int(1, d - 1);
  while (gcd(n, d) !== 1) n = r.int(1, d - 1);
  return { kind: "leaf", v: q(n, d) };
}

/** Two fractions over the same bottom (for a sum inside a product or a bar: unlike bottoms there make too long a stretch). */
function likePair(r: Rng): [Node, Node] {
  const d = pick(r, [3, 4, 5, 6, 7, 8, 9]);
  // In lowest terms, and two different ones.
  const tops = Array.from({ length: d - 1 }, (_, i) => i + 1).filter((n) => gcd(n, d) === 1);
  const n1 = pick(r, tops);
  const n2 = pick(r, tops.length > 1 ? tops.filter((n) => n !== n1) : tops);
  return [
    { kind: "leaf", v: { n: n1, d } },
    { kind: "leaf", v: { n: n2, d } },
  ];
}

function tree(r: Rng, level: Level): Node {
  const op = (): Op => pick(r, level === "easy" ? (["+", "-", "·"] as const) : (["+", "-", "·", "÷"] as const));
  const join = (a: Node, b: Node, o = op()): Node => ({ kind: "op", op: o, a, b });
  // Sums over the same bottom (unlike bottoms are their own shape, in chapters/fractions.ts: their search branches too much to check here).
  const like = (): Node => join(...likePair(r), pick(r, ["+", "-"] as const));
  if (level === "easy") return r.next() < 0.4 ? like() : join(leaf(r, 0.2), leaf(r, 0), pick(r, ["·", "÷"] as const));
  if (level === "medium") return r.next() < 0.5 ? join(like(), leaf(r, 0), pick(r, ["·", "÷"] as const)) : join(leaf(r, 0), like(), "÷");
  // Hard: two operations inside one, both sides worked first; or a sum of two products.
  return r.next() < 0.5
    ? join(like(), r.next() < 0.5 ? like() : join(leaf(r, 0), leaf(r, 0), "·"), pick(r, ["·", "÷"] as const))
    : join(join(leaf(r, 0), leaf(r, 0), pick(r, ["·", "÷"] as const)), like(), "÷");
}

/** The innermost operation (both sides plain numbers), done; with a step before it when two bottoms differ. */
function step(t: Node): { next: Node; before: Node[] } | null {
  if (t.kind !== "op") return null;
  if (t.a.kind === "op") {
    const s = step(t.a);
    return s && { next: { ...t, a: s.next }, before: s.before.map((b) => ({ ...t, a: b })) };
  }
  if (t.b.kind === "op") {
    const s = step(t.b);
    return s && { next: { ...t, b: s.next }, before: s.before.map((b) => ({ ...t, b: b })) };
  }
  const next: Node = { kind: "leaf", v: valueOf(t) };
  // Adding over different bottoms, the way the move does it: each fraction's
  // top and bottom times the other's bottom (two drops, two taps).
  if ((t.op === "+" || t.op === "-") && t.a.v.d !== t.b.v.d) {
    const [a, b] = [t.a.v, t.b.v];
    const done = (v: Q, k: number): Node => ({ kind: "raw", text: `${v.n * k}/${v.d * k}`, v });
    const raw = (n: Node) => (n.kind === "leaf" && n.v.d === 1 ? n : null);
    // A whole number has no bottom to drop: it's written over 1 by the move. Keep it simple: fractions only.
    if (raw(t.a) || raw(t.b)) return { next, before: [] };
    return { next, before: [{ ...t, a: done(a, b.d), b: done(b, a.d) }] };
  }
  return { next, before: [] };
}

export function composeFractions(level: Level, r: Rng): Draft | null {
  const t = tree(r, level);
  const v = valueOf(t);
  if (v.n === 0 || v.d > 30 || Math.abs(v.n) > 60) return null;
  // Every operation inside comes out a proper fraction (a whole number there reads as a trick: 1 · (1/5)),
  // and common bottoms stay small.
  const inner = (n: Node): boolean =>
    n.kind !== "op" ||
    (inner(n.a) && inner(n.b) && (n === t || valueOf(n).d !== 1) && valueOf(n).n !== 0 &&
      !((n.op === "+" || n.op === "-") && n.a.kind === "leaf" && n.b.kind === "leaf" && n.a.v.d !== n.b.v.d && n.a.v.d * n.b.v.d > 30));
  if (!inner(t)) return null;
  const via: string[] = [];
  let at: Node = t;
  for (let s = step(at); s; s = step(at)) {
    via.push(...s.before.map((b) => write(b)));
    at = s.next;
    if (at.kind === "op") via.push(write(at));
  }
  const start = write(t);
  const goal = v.n < 0 ? `-${qStr(q(-v.n, v.d))}` : qStr(v);
  return { shape: "composed", start, goal, via };
}

export const composedFractions = (level: Level, weight = 1): Shape => ({
  id: "composed",
  name: "fractions joined by + − · ÷, worked out one operation at a time",
  make: (r) => composeFractions(level, r),
  weight,
});
