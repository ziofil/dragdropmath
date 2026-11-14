/** Solving equations: linear, one unknown. */
import { NESTED } from "./nested";
import { answer, ax, bracket, gcd, lin, pickAnswer, plus, type Draft, type Level, type Rng, type Shape } from "../write";

// ---------- mixed exercises: everything from the chapters before at once ----------
// Shared with inequalities.ts, which asks for the same with a < or ≥ in the middle.

export type Rel = "=" | "<" | ">" | "≤" | "≥";
export const turned: Record<Rel, Rel> = { "=": "=", "<": ">", ">": "<", "≤": "≥", "≥": "≤" };

/** A sum written as a person would: terms(2, "x", -3, "", 1, "x") → "2x - 3 + x". */
export function terms(...parts: (number | string)[]): string {
  let out = "";
  for (let i = 0; i < parts.length; i += 2) {
    const c = parts[i] as number;
    const v = parts[i + 1] as string;
    if (c === 0) continue;
    const t = v ? ax(Math.abs(c), v) : `${Math.abs(c)}`;
    out += out === "" ? (c < 0 ? `-${t}` : t) : c < 0 ? ` - ${t}` : ` + ${t}`;
  }
  return out;
}

/**
 * A mixed exercise up to the last step: its sides, the milestones (as pairs
 * of sides), and where it ends, k·x on one side and m = k·x on the other
 * (k positive).
 */
export type Mixed = { sides: [string, string]; via: [string, string][]; k: number; x: number; xLeft: boolean; numbers: number[]; along: number[] };

/** From L·x + K = f·x + g, collected: the x's to the side with more of them. */
function lastSteps(L: number, K: number, f: number, g: number, x: number) {
  const xLeft = L > f;
  const k = Math.abs(L - f);
  const via: [string, string][] = xLeft ? [[ax(L), lin(f, g - K)]] : [[lin(L, K - g), ax(f)]];
  return { xLeft, k, via: f === 0 || L === 0 ? [] : via, x };
}

/** The draft: start, milestones, and the answer read off (an inequality turns round when it must). */
export function finish(id: string, m: Mixed, rel: Rel, v = "x"): Draft {
  const join = ([l, r]: [string, string]) => `${l} ${rel} ${r}`;
  const kx = ax(m.k, v);
  const last: [string, string] = m.xLeft ? [kx, `${m.k * m.x}`] : [`${m.k * m.x}`, kx];
  const via = [...m.via.map(join), ...(m.k === 1 && m.xLeft ? [] : [join(last)])].filter((v, i, all) => all.indexOf(v) === i);
  // x R value when the x's end on the left; value R x reads x turned(R) value.
  const goalRel = m.xLeft ? rel : turned[rel];
  return { shape: id, start: join(m.sides), goal: `${v} ${goalRel} ${m.x}`, via, answer: m.x, numbers: m.numbers, along: m.along };
}

/** a(bx + c) - d(x + e) = fx + g: two brackets, one taken away, x on both sides. */
export function twoBracketsMixed(r: Rng, allowNeg: boolean): Mixed | null {
  const x = pickAnswer(r);
  const a = r.int(2, 4);
  const b = r.int(1, 3);
  const c = r.signed(1, 5);
  const d = r.int(2, 4);
  const e = r.signed(1, 5);
  const f = r.int(1, 4);
  const L = a * b - d;
  const K = a * c - d * e;
  const g = (L - f) * x + K;
  if (L === f || L === 0 || K === 0 || g === 0 || (b === 1 && (a === d || c === e))) return null;
  if (!allowNeg && L < f) return null;
  if (a * b > 12 || Math.abs(g) > 30) return null;
  const R = lin(f, g);
  const end = lastSteps(L, K, f, g, x);
  return {
    sides: [`${a}(${lin(b, c)}) - ${bracket(d, e)}`, R],
    via: [
      [`${terms(a * b, "x", a * c, "")} - ${bracket(d, e)}`, R],
      [terms(a * b, "x", a * c, "", -d, "x", -d * e, ""), R],
      [lin(L, K), R],
      ...end.via,
    ],
    k: end.k,
    x,
    xLeft: end.xLeft,
    numbers: [a, b, c, d, e, f, g],
    along: [a * b, a * c, d * e, L, K, g - K, L - f],
  };
}

/** (x + a)/b - (x + c)/d = e: two fractions, one taken away. */
export function fractionsMinus(r: Rng): Mixed | null {
  const x = pickAnswer(r) + r.int(0, 4);
  const [b, d] = [[2, 3], [3, 2], [2, 5], [3, 4], [4, 3], [2, 3]][r.int(0, 5)];
  const a = r.signed(1, 6);
  const c = r.signed(1, 6);
  const top = d * (x + a) - b * (x + c);
  if (top % (b * d) !== 0 || a === c) return null;
  const e = top / (b * d);
  const N = b * d * e;
  const L = d - b;
  const K = d * a - b * c;
  if (e === 0 || K === 0 || x + a === 0 || x + c === 0 || N - K === 0) return null;
  const end = lastSteps(L, K, 0, N, x);
  return {
    sides: [`(${lin(1, a)})/${b} - (${lin(1, c)})/${d}`, `${e}`],
    via: [
      [`${bracket(d, a)} - ${bracket(b, c)}`, `${N}`],
      [`${terms(d, "x", d * a, "")} - ${bracket(b, c)}`, `${N}`],
      [terms(d, "x", d * a, "", -b, "x", -b * c, ""), `${N}`],
      [lin(L, K), `${N}`],
      ...(L < 0 ? [[`${K - N}`, ax(-L)] as [string, string]] : []),
    ],
    k: end.k,
    x,
    xLeft: end.xLeft,
    numbers: [a, b, c, d, e],
    along: [d * a, b * c, N, L, K, N - K],
  };
}

/** e - p(x + a)/b = x + c: a number less a bracket over a number, x on both sides. */
export function minusFraction(r: Rng): Mixed | null {
  const x = pickAnswer(r);
  const [p, b] = [[3, 2], [2, 3], [5, 2], [3, 4]][r.int(0, 3)];
  const a = r.signed(1, 5);
  const c = r.signed(1, 6);
  const top = (b + p) * x + p * a + b * c;
  if (top % b !== 0) return null;
  const e = top / b;
  const M = b * e - p * a - b * c;
  if (e === 0 || x + a === 0 || b * e - p * a === 0) return null;
  return {
    sides: [`${e} - ${p}(${lin(1, a)})/${b}`, lin(1, c)],
    via: [
      [`${b * e} - ${bracket(p, a)}`, bracket(b, c)],
      [terms(b * e, "", -p, "x", -p * a, ""), bracket(b, c)],
      [terms(b * e, "", -p, "x", -p * a, ""), terms(b, "x", b * c, "")],
      [terms(b * e - p * a, "", -p, "x"), terms(b, "x", b * c, "")],
    ],
    k: b + p,
    x,
    xLeft: false,
    numbers: [e, p, a, b, c],
    along: [b * e, p * a, b * c, b * e - p * a, M, b + p],
  };
}


const all: Shape[] = [
  {
    id: "one-step",
    name: "a number added or taken away",
    make: (r) => {
      // x + a = b, x - a = b, a + x = b
      const x = r.next() < 0.2 ? -r.int(1, 6) : r.int(1, 12);
      const a = r.int(2, 15);
      const kind = r.int(0, 2);
      const start = kind === 0 ? `x + ${a} = ${x + a}` : kind === 1 ? `x - ${a} = ${x - a}` : `${a} + x = ${x + a}`;
      if (x + a === 0 || x - a === 0) return null;
      return { shape: "one-step", start, goal: answer(x), via: [], answer: x, numbers: [a, kind === 1 ? x - a : x + a], along: [] };
    },
  },
  {
    id: "times",
    name: "a number times x, or x over a number",
    make: (r) => {
      // ax = b, x/a = b
      const x = pickAnswer(r);
      const a = r.int(2, 9);
      const over = r.next() < 0.4;
      return {
        shape: "times",
        start: over ? `x/${a} = ${x}` : `${a}x = ${a * x}`,
        goal: over ? answer(x * a) : answer(x),
        via: [],
        answer: over ? x * a : x,
        numbers: [a, over ? x : a * x],
        along: [],
      };
    },
  },
  {
    id: "two-step",
    name: "a number times x, and a number",
    make: (r) => {
      // ax + b = c, b - ax = c
      const x = pickAnswer(r);
      const a = r.int(2, 9);
      const b = r.signed(1, 12);
      const c = a * x + b;
      if (c === 0) return null;
      return { shape: "two-step", start: `${lin(a, b)} = ${c}`, goal: answer(x), via: [`${ax(a)} = ${c - b}`], answer: x, numbers: [a, b, c], along: [c - b] };
    },
  },
  {
    id: "over-plus",
    name: "x over a number, and a number",
    make: (r) => {
      // x/a + b = c
      const q = r.int(1, 6);
      const a = r.int(2, 5);
      const b = r.signed(1, 9);
      const c = q + b;
      if (c === 0) return null;
      return { shape: "over-plus", start: `x/${a}${plus(b)} = ${c}`, goal: answer(a * q), via: [`x/${a} = ${q}`], answer: a * q, numbers: [a, b, c], along: [q] };
    },
  },
  {
    id: "bracket",
    name: "a bracket equal to a number",
    make: (r) => {
      // a(x + b) = c
      const x = pickAnswer(r);
      const a = r.int(2, 6);
      const b = r.signed(1, 9);
      if (x + b === 0) return null;
      return { shape: "bracket", start: `${bracket(a, b)} = ${a * (x + b)}`, goal: answer(x), via: [], answer: x, numbers: [a, b, a * (x + b)], along: [x + b] };
    },
  },
  {
    id: "both-sides",
    name: "x on both sides",
    make: (r) => {
      // ax + b = cx + d
      const x = pickAnswer(r);
      const a = r.int(2, 9);
      const c = r.int(1, 8);
      const b = r.signed(1, 12);
      const d = (a - c) * x + b;
      if (a <= c || d === 0) return null;
      return {
        shape: "both-sides",
        start: `${lin(a, b)} = ${lin(c, d)}`,
        goal: answer(x),
        via: [`${ax(a - c)} = ${d - b}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [a - c, d - b],
      };
    },
  },
  {
    id: "bracket-plus",
    name: "a bracket, then a number",
    make: (r) => {
      // a(x + b) + c = d
      const x = pickAnswer(r);
      const a = r.int(2, 6);
      const b = r.signed(1, 9);
      const c = r.signed(1, 12);
      const d = a * (x + b) + c;
      if (d === 0 || x + b === 0) return null;
      return {
        shape: "bracket-plus",
        start: `${bracket(a, b)}${plus(c)} = ${d}`,
        goal: answer(x),
        via: [`${lin(a, a * b + c)} = ${d}`, `${ax(a)} = ${d - a * b - c}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [a * b, a * b + c, d - a * b - c],
      };
    },
  },
  {
    id: "brackets-both",
    name: "brackets on both sides",
    make: (r) => {
      // a(x + b) = c(x + d)
      const x = pickAnswer(r);
      const a = r.int(2, 7);
      const c = r.int(2, 7);
      const b = r.signed(1, 9);
      if (a === c) return null;
      // c(x + d) = a(x + b) at the answer: d = a(x + b)/c - x, whole.
      const top = a * (x + b);
      if (top % c !== 0) return null;
      const d = top / c - x;
      if (d === 0 || d === b) return null;
      const [hi, lo] = a > c ? [[a, b], [c, d]] : [[c, d], [a, b]];
      return {
        shape: "brackets-both",
        start: `${bracket(a, b)} = ${bracket(c, d)}`,
        goal: answer(x),
        via: [`${lin(a, a * b)} = ${lin(c, c * d)}`, `${ax(hi[0] - lo[0])} = ${lo[0] * lo[1] - hi[0] * hi[1]}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [a * b, c * d, hi[0] - lo[0], lo[0] * lo[1] - hi[0] * hi[1]],
      };
    },
  },
  {
    id: "minus-bracket",
    name: "taking away a bracket",
    make: (r) => {
      // a(x + b) - c(x + d) = e
      const x = pickAnswer(r);
      const a = r.int(3, 7);
      const c = r.int(2, a - 1);
      const b = r.signed(1, 6);
      const d = r.signed(1, 6);
      const e = a * (x + b) - c * (x + d);
      if (e === 0 || b === d) return null;
      const k = a * b - c * d;
      return {
        shape: "minus-bracket",
        start: `${bracket(a, b)} - ${bracket(c, d)} = ${e}`,
        goal: answer(x),
        via: [`${lin(a - c, k)} = ${e}`, `${ax(a - c)} = ${e - k}`],
        answer: x,
        numbers: [a, b, c, d, e],
        along: [a * b, c * d, a - c, k, e - k],
      };
    },
  },
  {
    id: "fraction",
    name: "a fraction equal to x minus a number",
    make: (r) => {
      // (x + a)/b = x - c
      const x = pickAnswer(r);
      const b = r.int(2, 5);
      const a = r.signed(1, 12);
      if ((x + a) % b !== 0) return null;
      const c = x - (x + a) / b;
      if (c === 0 || x + a === 0) return null;
      return {
        shape: "fraction",
        start: `(${lin(1, a)})/${b} = ${lin(1, -c)}`,
        goal: answer(x),
        via: [`${lin(1, a)} = ${b}*(${lin(1, -c)})`, `${ax(b - 1)} = ${a + b * c}`],
        answer: x,
        numbers: [a, b, c],
        along: [b * c, b - 1, a + b * c],
      };
    },
  },
  {
    id: "minus-times-bracket",
    name: "a number minus a bracket",
    make: (r) => {
      // a - b(x - c) = d
      const x = pickAnswer(r);
      const b = r.int(2, 5);
      const c = r.int(1, 9);
      const a = r.int(2, 15);
      const d = a - b * (x - c);
      if (d === 0 || x === c) return null;
      return {
        shape: "minus-times-bracket",
        start: `${a} - ${b}(x - ${c}) = ${d}`,
        goal: answer(x),
        via: [`${a + b * c} - ${ax(b)} = ${d}`, `${ax(b)} = ${a + b * c - d}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [b * c, a + b * c, a + b * c - d],
      };
    },
  },
  {
    id: "two-fractions",
    name: "two fractions to clear",
    make: (r) => {
      // (x + a)/b = (x + c)/d
      const x = pickAnswer(r);
      const b = r.int(2, 5);
      const d = r.int(2, 5);
      const a = r.signed(1, 9);
      if (b === d || (x + a) % b !== 0) return null;
      // (x + c)/d = (x + a)/b at the answer.
      const c = (d * (x + a)) / b - x;
      if (!Number.isInteger(c) || c === 0 || c === a || x + a === 0 || x + c === 0) return null;
      const [hi, lo] = d > b ? [[d, a], [b, c]] : [[b, c], [d, a]];
      return {
        shape: "two-fractions",
        start: `(${lin(1, a)})/${b} = (${lin(1, c)})/${d}`,
        goal: answer(x),
        via: [`${d}*(${lin(1, a)}) = ${b}*(${lin(1, c)})`, `${lin(d, d * a)} = ${lin(b, b * c)}`, `${ax(hi[0] - lo[0])} = ${lo[0] * lo[1] - hi[0] * hi[1]}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [d * a, b * c, hi[0] - lo[0], lo[0] * lo[1] - hi[0] * hi[1]],
      };
    },
  },
  {
    id: "brackets-and-x",
    name: "brackets on both sides, and one more x",
    make: (r) => {
      // a(x + b) + x = c(x + d)
      const x = pickAnswer(r);
      const a = r.int(2, 6);
      const c = r.int(2, 7);
      const b = r.signed(1, 8);
      if (a + 1 === c) return null;
      const top = a * (x + b) + x;
      if (top % c !== 0) return null;
      const d = top / c - x;
      if (d === 0 || d === b) return null;
      const [hi, lo] = a + 1 > c ? [[a + 1, a * b], [c, c * d]] : [[c, c * d], [a + 1, a * b]];
      return {
        shape: "brackets-and-x",
        start: `${bracket(a, b)} + x = ${bracket(c, d)}`,
        goal: answer(x),
        via: [`${lin(a + 1, a * b)} = ${lin(c, c * d)}`, `${ax(hi[0] - lo[0])} = ${lo[1] - hi[1]}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [a * b, c * d, a + 1, hi[0] - lo[0], lo[1] - hi[1]],
      };
    },
  },
  {
    id: "nested",
    name: "a bracket inside a bracket",
    make: (r) => {
      // a(b(x + c) + d) = e
      const x = pickAnswer(r);
      const a = r.int(2, 4);
      const b = r.int(2, 5);
      const c = r.signed(1, 6);
      const d = r.signed(1, 9);
      const inner = b * (x + c) + d;
      const e = a * inner;
      if (x + c === 0 || inner === 0) return null;
      return {
        shape: "nested",
        start: `${a}(${bracket(b, c)}${plus(d)}) = ${e}`,
        goal: answer(x),
        via: [`${bracket(b, c)}${plus(d)} = ${inner}`, `${ax(b)} = ${inner - d - b * c}`],
        answer: x,
        numbers: [a, b, c, d, e],
        along: [inner, b * c, inner - d, inner - d - b * c],
      };
    },
  },
  {
    id: "fractions-ax",
    name: "two fractions, a number times x on top",
    make: (r) => {
      // (ax + b)/c = (dx + e)/f
      const x = pickAnswer(r);
      const a = r.int(2, 5);
      const d = r.int(1, 4);
      const c = r.int(2, 5);
      const f = r.int(2, 5);
      const b = r.signed(1, 9);
      if (c === f || (a * x + b) % c !== 0 || a * x + b === 0) return null;
      const e = (f * (a * x + b)) / c - d * x;
      const k = f * a - c * d;
      if (!Number.isInteger(e) || e === 0 || k === 0 || d * x + e === 0) return null;
      // Nothing that cancels at sight: no common factor on a top, or between a top and its bottom.
      if (gcd(a, b) > 1 || gcd(d, e) > 1 || gcd(gcd(a, b), c) > 1 || gcd(gcd(d, e), f) > 1) return null;
      const [hi, lo] = f * a > c * d ? [[f * a, f * b], [c * d, c * e]] : [[c * d, c * e], [f * a, f * b]];
      return {
        shape: "fractions-ax",
        start: `(${lin(a, b)})/${c} = (${lin(d, e)})/${f}`,
        goal: answer(x),
        via: [
          `${f}*(${lin(a, b)}) = ${c}*(${lin(d, e)})`,
          `${lin(f * a, f * b)} = ${c}*(${lin(d, e)})`,
          `${lin(f * a, f * b)} = ${lin(c * d, c * e)}`,
          `${ax(hi[0] - lo[0])} = ${lo[1] - hi[1]}`,
        ],
        answer: x,
        numbers: [a, b, c, d, e, f],
        along: [f * a, f * b, c * d, c * e, k, c * e - f * b],
      };
    },
  },
  {
    id: "bracket-over",
    name: "a bracket over a number",
    make: (r) => {
      // a(x + b)/c = x + d
      const x = pickAnswer(r);
      const a = r.int(2, 5);
      const c = r.int(2, 5);
      const b = r.signed(1, 9);
      if (a === c || gcd(a, c) > 1 || (a * (x + b)) % c !== 0 || x + b === 0) return null;
      const d = (a * (x + b)) / c - x;
      if (d === 0 || x + d === 0) return null;
      const [hi, lo] = a > c ? [[a, a * b], [c, c * d]] : [[c, c * d], [a, a * b]];
      return {
        shape: "bracket-over",
        start: `${a}(${lin(1, b)})/${c} = ${lin(1, d)}`,
        goal: answer(x),
        via: [`${bracket(a, b)} = ${c}*(${lin(1, d)})`, `${lin(a, a * b)} = ${lin(c, c * d)}`, `${ax(hi[0] - lo[0])} = ${lo[1] - hi[1]}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [a * b, c * d, a - c, c * d - a * b],
      };
    },
  },
];

const mixed: Shape[] = [
  { id: "two-brackets-mixed", name: "two brackets, one taken away, x on both sides", make: (r) => { const m = twoBracketsMixed(r, true); return m && finish("two-brackets-mixed", m, "="); } },
  { id: "fractions-minus", name: "one fraction less another", make: (r) => { const m = fractionsMinus(r); return m && finish("fractions-minus", m, "="); } },
  { id: "minus-fraction", name: "a number less a bracket over a number", make: (r) => { const m = minusFraction(r); return m && finish("minus-fraction", m, "="); } },
];
all.push(...mixed);

const pick = (...ids: string[]) => ids.map((id) => all.find((s) => s.id === id)!);

/** By how many moves they take: easy one step, medium two or three, hard everything at once. */
export const shapes: Record<Level, Shape[]> = {
  easy: pick("one-step", "times", "two-step", "over-plus", "bracket", "both-sides", "bracket-plus"),
  medium: pick("brackets-both", "minus-bracket", "fraction", "brackets-and-x", "minus-times-bracket", "two-fractions", "fractions-ax", "nested", "bracket-over"),
  // Hard nests one thing in another (with x and y where the chapter allows): chapters/nested.ts.
  hard: NESTED.balance,
};
