/**
 * Expressions to simplify, made of pieces: a term, a product of numbers and
 * letters (2·x·3), a number or term times a bracket, a minus in front of a
 * bracket, two brackets multiplied, a bracket squared, a bracket inside a
 * bracket. A recipe picks the pieces and their numbers; the answer is worked
 * out exactly (polynomial arithmetic), and the milestones are the way a
 * person goes: each piece multiplied out where it stands, step by step, and
 * collected into what's there so far; then the terms put in order.
 */
import type { Draft, Level, Rng, Shape } from "./write";
import { one } from "./write";
import { parseState } from "../../expr/parse";
import type { Expr } from "../../expr/types";

// ---------- polynomials ----------

/** A monomial: each letter's power. */
export type Mono = Record<string, number>;
/** A polynomial: monomial key → coefficient (in the order terms first appeared). */
export type Poly = Map<string, { m: Mono; c: number }>;

const keyOf = (m: Mono) =>
  Object.keys(m)
    .filter((v) => m[v] !== 0)
    .sort()
    .map((v) => `${v}${m[v]}`)
    .join("");
const degree = (m: Mono) => Object.values(m).reduce((a, b) => a + b, 0);

function add(p: Poly, q: Poly, sign = 1): Poly {
  const out: Poly = new Map([...p].map(([k, t]) => [k, { ...t }]));
  for (const [k, t] of q) out.set(k, { m: t.m, c: (out.get(k)?.c ?? 0) + sign * t.c });
  for (const [k, t] of out) if (t.c === 0) out.delete(k);
  return out;
}
function mul(p: Poly, q: Poly): Poly {
  let out: Poly = new Map();
  for (const a of p.values())
    for (const b of q.values()) {
      const m: Mono = { ...a.m };
      for (const v in b.m) m[v] = (m[v] ?? 0) + b.m[v];
      out = add(out, new Map([[keyOf(m), { m, c: a.c * b.c }]]));
    }
  return out;
}
const scale = (p: Poly, c: number): Poly => new Map([...p].map(([k, t]) => [k, { m: t.m, c: t.c * c }]));
const mono = (c: number, m: Mono = {}): Poly => new Map([[keyOf(m), { m, c }]]);
const terms = (p: Poly) => [...p.values()];

/**
 * A polynomial as written ("2x - 3", "x^2 + a·b"), its terms in the order
 * given: P("3 - x") keeps the 3 first.
 */
export function P(src: string): Poly {
  let out: Poly = new Map();
  const visit = (e: Expr, sign: number) => {
    if (e.kind === "sum") return e.terms.forEach((t) => visit(t, sign));
    if (e.kind === "neg") return visit(e.arg, -sign);
    let c = sign;
    const m: Mono = {};
    for (const f of e.kind === "prod" ? e.factors : [e]) {
      if (f.kind === "num") c *= f.value;
      else if (f.kind === "var") m[f.name] = (m[f.name] ?? 0) + 1;
      else if (f.kind === "pow" && f.base.kind === "var" && f.exp.kind === "num") m[f.base.name] = (m[f.base.name] ?? 0) + f.exp.value;
      else throw new Error(`Not a polynomial: ${src}`);
    }
    out = add(out, mono(c, m));
  };
  visit(parseState(src).sides[0], 1);
  return out;
}

/** a·x + n as a polynomial, the letter first (or the number, `numberFirst`): lin(2, -3) is 2x − 3. */
export const lin = (a: number, n: number, x = "x", numberFirst = false) => P((numberFirst ? `${n} + ${a}${x}` : `${a}${x} + ${n}`).replace("+ -", "- "));

/** "x^2·y", "xy", "" (no letters). A power is followed by a · so it reads back as written. */
function letters(m: Mono): string {
  const vs = Object.keys(m)
    .filter((v) => m[v] !== 0)
    .sort();
  return vs.map((v, i) => `${v}${m[v] === 1 ? "" : `^${m[v]}`}${m[v] !== 1 && i < vs.length - 1 ? "·" : ""}`).join("");
}
/** c·m as written: "3x", "-x", "7", "x^2·y". */
function termStr(c: number, m: Mono): string {
  const l = letters(m);
  if (!l) return `${c}`;
  return c === 1 ? l : c === -1 ? `-${l}` : `${c}${l}`;
}
/** A polynomial written out, its terms in the order given. */
export function polyStr(p: Poly | { m: Mono; c: number }[]): string {
  const ts = Array.isArray(p) ? p : terms(p);
  if (!ts.length) return "0";
  return ts.map((t, i) => (i === 0 ? termStr(t.c, t.m) : t.c < 0 ? ` - ${termStr(-t.c, t.m)}` : ` + ${termStr(t.c, t.m)}`)).join("");
}
/**
 * The answer as a teacher writes it: highest power first, then by letter;
 * of two terms, a plus first where it would start with a minus (4 − x, not
 * −x + 4).
 */
function usual(p: Poly): string {
  const ts = terms(p).sort((a, b) => degree(b.m) - degree(a.m) || (keyOf(a.m) < keyOf(b.m) ? -1 : keyOf(a.m) > keyOf(b.m) ? 1 : 0));
  if (ts.length === 2 && ts[0].c < 0 && ts[1].c > 0) ts.reverse();
  return polyStr(ts);
}

// ---------- pieces ----------

/** A piece of the start: how it's written (no sign), its value, and its forms on the way to multiplied out. */
export type Piece = {
  text: string;
  value: Poly;
  sign: 1 | -1;
  /** A bracket to multiply out (else a term, joined straight into what's there). */
  bracketed: boolean;
  /** Its forms on the way to multiplied out (or worked out: 2·x·3, then 6x). */
  steps: string[];
  /** Each step a product (no brackets needed for it after a minus). */
  products?: boolean;
};

const front = (k: number, m: Mono = {}) => (k === 1 && !letters(m) ? "" : termStr(k, m));
const signOf = (k: number): 1 | -1 => (k < 0 ? -1 : 1);

/** A term, k·m: 3x, −2, x². */
export function term(k: number, m: Mono | string = {}): Piece {
  const mm = typeof m === "string" ? (m ? terms(P(m))[0].m : {}) : m;
  return { text: termStr(Math.abs(k), mm), value: mono(Math.abs(k), mm), sign: signOf(k), bracketed: false, steps: [] };
}

/** A term written as a product of numbers among its letters: 2·x·3, a·2·b·3 (`text` the way it's written, its numbers multiplying to |k|). */
export function product(k: number, m: Mono | string, text: string): Piece {
  const t = term(k, m);
  return { ...t, text, steps: [termStr(Math.abs(k), terms(t.value)[0].m)] };
}

/**
 * k·m times a bracket: 3(x + 2), −2(x − 1), 4x(x + 3), −(x − 5). A letter in
 * front goes in first (4x(3x + 4) → 4(3x² + 4x)), and comes first in what it
 * makes; `numbers`: the k in front written as a product (2·3(x + 1)).
 */
export function times(k: number, m: Mono | string, inside: Poly, numbers?: number[]): Piece {
  const mm = typeof m === "string" ? (m ? terms(P(m))[0].m : {}) : m;
  const K = Math.abs(k);
  const head = numbers ? `${numbers.join("·")}` : front(K, mm);
  const steps = [...(numbers ? [`${front(K, mm)}(${polyStr(inside)})`] : []), ...(letters(mm) && K !== 1 ? [`${K}(${polyStr(mul(mono(1, mm), inside))})`] : [])];
  return { text: `${head}(${polyStr(inside)})`, value: mul(mono(K, mm), inside), sign: signOf(k), bracketed: true, steps, products: true };
}

/** Two brackets multiplied, k in front (or a letter): (x + 2)(x − 3), 2(x + 1)(x + 4), x(x + 1)(x − 1). */
export function brackets(a: Poly, b: Poly, k = 1, m: Mono = {}): Piece {
  const K = Math.abs(k);
  const out = front(K, m);
  const wrap = (s: string) => (out ? `${out}(${s})` : s);
  return { text: `${out}(${polyStr(a)})(${polyStr(b)})`, value: mul(mono(K, m), mul(a, b)), sign: signOf(k), bracketed: true, steps: [...timesEach(a, b).map(wrap), ...(out ? [wrap(polyStr(mul(a, b)))] : [])] };
}

/** A bracket squared: (x + 3)^2. */
export const square = (a: Poly, k = 1): Piece => ({ text: `(${polyStr(a)})^2`, value: mul(a, a), sign: signOf(k), bracketed: true, steps: [`(${polyStr(a)})(${polyStr(a)})`, ...timesEach(a, a)] });

/**
 * A bracket inside a bracket: k·m(outer + b(inner)), the inner one worked out
 * first, then what's inside collected: 2(x + 3(x − 1)) → 2(x + 3x − 3) →
 * 2(4x − 3).
 */
export function nested(k: number, m: Mono | string, outer: Poly, b: number, inner: Poly): Piece {
  const mm = typeof m === "string" ? (m ? terms(P(m))[0].m : {}) : m;
  const K = Math.abs(k);
  const inBracket = (s: string) => `${front(K, mm)}(${s})`;
  const innerText = `${b < 0 ? " - " : " + "}${front(Math.abs(b))}(${polyStr(inner)})`;
  const spread = [...terms(outer), ...terms(scale(inner, b))];
  const collected = add(outer, scale(inner, b));
  const outerText = polyStr(outer);
  return {
    text: inBracket(`${outerText}${innerText}`),
    value: mul(mono(K, mm), collected),
    sign: signOf(k),
    bracketed: true,
    steps: [inBracket(polyStr(spread)), ...(collected.size < spread.length ? [inBracket(polyStr(collected))] : [])],
    products: true,
  };
}

/** (a + b)(q) on the way to multiplied out: a(q) + b(q), then a·q worked out and b(q) still to do. */
function timesEach(p: Poly, q: Poly): string[] {
  const [a, b] = terms(p);
  const qs = `(${polyStr(q)})`;
  // A factor of 1 isn't written: (x + 6), not 1(x + 6).
  const second = (t: { m: Mono; c: number }) => (t.c < 0 ? ` - ${front(-t.c, t.m)}${qs}` : ` + ${front(t.c, t.m)}${qs}`);
  const aq = polyStr(mul(new Map([[keyOf(a.m), a]]), q));
  return [`${front(a.c, a.m)}${qs}${second(b)}`, `${aq}${second(b)}`];
}

// ---------- the exercise ----------

/**
 * The expression these pieces make, and the way to simplify it. `order`:
 * the pieces as given, or shuffled (not starting with a minus, and with
 * `apart`, no two like terms side by side where there are unlike ones).
 */
export function expression(shape: string, pieces: Piece[], r: Rng, { order = "given", apart = false }: { order?: "given" | "shuffled"; apart?: boolean } = {}): Draft | null {
  let ps = pieces;
  if (order === "shuffled") {
    const kind = (p: Piece) => (p.bracketed ? "" : keyOf(terms(p.value)[0].m));
    const together = (xs: Piece[]) => xs.some((p, i) => i > 0 && kind(p) !== "" && kind(p) === kind(xs[i - 1]));
    const ok = (xs: Piece[]) => xs[0].sign > 0 && !(apart && new Set(xs.map(kind)).size > 1 && together(xs));
    let found: Piece[] | null = null;
    for (let t = 0; t < 30 && !found; t++) {
      const xs = pieces.slice();
      for (let i = xs.length - 1; i > 0; i--) {
        const j = r.int(0, i);
        [xs[i], xs[j]] = [xs[j], xs[i]];
      }
      if (ok(xs)) found = xs;
    }
    if (!found) return null;
    ps = found;
  }
  const write = (xs: { text: string; sign: number }[]) => xs.map((p, i) => (i === 0 ? (p.sign < 0 ? `-${p.text}` : p.text) : `${p.sign < 0 ? " - " : " + "}${p.text}`)).join("");
  const start = write(ps);
  // The way through: each piece multiplied out where it stands, then collected into what came before.
  const via: string[] = [];
  let sofar: Poly = new Map();
  /** What's collected so far, then these pieces. */
  const join = (items: { text: string; sign: number }[]) => (sofar.size ? polyStr(sofar) + items.map((p) => `${p.sign < 0 ? " - " : " + "}${p.text}`).join("") : write(items));
  /** Piece i written as `text`, with what's collected before it and the pieces after. */
  const line = (i: number, text: string, sign: number) => join([{ text, sign }, ...ps.slice(i + 1)]);
  ps.forEach((p, i) => {
    if (p.bracketed || p.steps.length) {
      // Inside a minus, a bracket is worked out first; then the minus taken in.
      for (const step of p.steps) via.push(line(i, p.sign < 0 && p.bracketed && !p.products ? `(${step})` : step, p.sign));
      if (p.sign < 0 && p.bracketed && p.steps.length && !p.products) via.push(line(i, `(${polyStr(p.value)})`, -1));
      const done = polyStr(scale(p.value, p.sign));
      via.push(line(i, done.startsWith("-") ? done.slice(1) : done, done.startsWith("-") ? -1 : 1));
    }
    sofar = add(sofar, scale(p.value, p.sign));
    if (sofar.size) via.push(join(ps.slice(i + 1)));
  });
  if (sofar.size === 0) return null;
  const goal = usual(sofar);
  // Something left to see: not a single number, not the start itself.
  if (goal === start || (sofar.size === 1 && !letters(terms(sofar)[0].m))) return null;
  return { shape, start, goal, via: via.filter((v, i) => v !== start && v !== goal && v !== via[i - 1]) };
}

// ---------- composed: pieces at random ----------

type Ctx = { r: Rng; vars: string[] };

/** A short linear sum: "2x - 3", "a + 2b". */
function linear(c: Ctx, n = 2, numberLast = false): Poly {
  let p: Poly = new Map();
  const used = new Set<string>();
  for (let tries = 0; used.size < n && tries < 20; tries++) {
    const last = used.size === n - 1;
    const v = last && (numberLast || c.r.next() < 0.7) ? "" : one(c.r, c.vars);
    if (used.has(v)) continue;
    used.add(v);
    p = add(p, mono(c.r.signed(1, used.size === 1 ? 3 : 6), v ? { [v]: 1 } : {}));
  }
  // A leading minus inside a bracket reads awkwardly: start with a plus.
  const first = terms(p)[0];
  return first && first.c < 0 ? scale(p, -1) : p;
}

type Kind = "term" | "numbers" | "times-bracket" | "minus-bracket" | "two-brackets" | "square" | "nested";

function randomPiece(kind: Kind, c: Ctx): Piece {
  const r = c.r;
  const x = one(r, c.vars);
  switch (kind) {
    case "term":
      return term((r.next() < 0.35 ? -1 : 1) * r.int(1, 7), r.next() < 0.25 ? {} : { [x]: r.next() < 0.2 ? 2 : 1 });
    case "numbers": {
      const [p, q] = [r.int(2, 5), r.int(2, 5)];
      return product((r.next() < 0.3 ? -1 : 1) * p * q, { [x]: 1 }, one(r, [`${p}·${x}·${q}`, `${x}·${p}·${q}`, `${p}·${q}·${x}`]));
    }
    case "times-bracket": {
      // A letter in front only of a short bracket (3a(a − 6)), and only of letters that come after it (2y(x + 3) gives 2·y·x, which no move turns into 2xy).
      const v = r.next() < 0.3 ? x : "";
      const later = (p: Poly) => terms(p).every((t) => Object.keys(t.m).every((l) => l >= v));
      let inside = v ? linear(c, 2, true) : linear(c, r.int(2, 3));
      for (let t = 0; (inside.size < 2 || !later(inside)) && t < 10; t++) inside = linear(c, 2, true);
      if (inside.size < 2 || !later(inside)) return randomPiece("term", c);
      return times((r.next() < 0.4 ? -1 : 1) * r.int(2, 5), v ? { [v]: 1 } : {}, inside);
    }
    case "minus-bracket": {
      let inside = linear(c, 2);
      for (let t = 0; inside.size < 2 && t < 10; t++) inside = linear(c, 2, true);
      return times(-1, {}, inside);
    }
    case "two-brackets": {
      const a = add(mono(r.next() < 0.7 ? 1 : r.int(2, 3), { [x]: 1 }), mono(r.signed(1, 6)));
      const b = add(mono(r.next() < 0.8 ? 1 : 2, { [x]: 1 }), mono(r.signed(1, 6)));
      return brackets(a, b, r.next() < 0.25 ? -1 : 1);
    }
    case "square":
      return square(add(mono(1, { [x]: 1 }), mono(r.signed(1, 5))));
    case "nested":
      return nested(r.int(2, 3), {}, mono(1, { [x]: 1 }), r.int(2, 3), add(mono(1, { [x]: 1 }), mono(r.signed(1, 4))));
  }
}

/** What each chapter's composed exercises are made of, at each level. */
const RANDOM: Record<string, Record<Level, (r: Rng) => { kinds: Kind[]; vars: string[] }>> = {
  distribute: {
    easy: (r) => ({ kinds: ["times-bracket", "term"], vars: [one(r, ["x", "a", "y"])] }),
    medium: (r) => ({ kinds: ["times-bracket", r.next() < 0.5 ? "minus-bracket" : "times-bracket", "term"], vars: ["a", "b"] }),
    hard: (r) => ({ kinds: [one(r, ["times-bracket", "nested"] as const), "times-bracket", "minus-bracket", "term"], vars: ["x", "y"] }),
  },
  brackets: {
    easy: (r) => ({ kinds: ["two-brackets"], vars: [one(r, ["x", "a", "y"])] }),
    medium: (r) => ({ kinds: [one(r, ["two-brackets", "square"] as const), "term", "term"], vars: [one(r, ["x", "a"])] }),
    hard: (r) => ({ kinds: ["two-brackets", one(r, ["square", "two-brackets"] as const), "times-bracket"], vars: ["x"] }),
  },
};

/** The composed exercises as a shape of a chapter's level (see practice.ts). */
export const composedExpression = (chapterId: string, level: Level, weight = 1): Shape => ({
  id: "composed",
  name: "pieces to multiply out and collect, the answer worked out",
  make: (r) => {
    const recipe = RANDOM[chapterId][level](r);
    const c: Ctx = { r, vars: recipe.vars };
    return expression("composed", recipe.kinds.map((k) => randomPiece(k, c)), r, { order: "shuffled" });
  },
  weight,
});
