/**
 * What every chapter's exercise shapes are written with (chapters/*.ts).
 * A shape is a textbook pattern with blanks. It picks the answer first, then
 * the numbers, and works out the rest so everything stays whole: built
 * backward from the solution. It also writes the natural milestones of
 * solving it (expanded, unknowns on one side, ...), which the move engine
 * then checks leg by leg (verify.ts).
 */

export const LEVELS = ["easy", "medium", "hard"] as const;
export type Level = (typeof LEVELS)[number];

/** A seeded random source, so a candidate can be made again from its seed. */
export function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  /** A whole number from lo to hi. */
  const int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
  /** A whole number from lo to hi, either sign, never 0. */
  const signed = (lo: number, hi: number) => (next() < 0.5 ? -1 : 1) * int(lo, hi);
  return { next, int, signed };
}
export type Rng = ReturnType<typeof rng>;

/** One of the list, at random. */
export const one = <T,>(r: Rng, xs: readonly T[]): T => xs[r.int(0, xs.length - 1)];

/** The list in a random order. */
export function shuffled<T>(r: Rng, xs: readonly T[]): T[] {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = r.int(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type Draft = {
  shape: string;
  start: string;
  goal: string;
  /** Milestones on the way, in order. */
  via: string[];
  /** The answer, when the exercise is solving for one number; and every number the start is written with (for the beauty rules). */
  answer?: number;
  numbers: number[];
  /** Numbers met on the way (products, sums), for the beauty rules. */
  along: number[];
};

// ---------- writing maths as a person would ----------

/** a·x: "3x", "x", "-x", "-3x". */
export const ax = (a: number, x = "x") => (a === 1 ? x : a === -1 ? `-${x}` : `${a}${x}`);
/** Terms written one after another, each with its own sign: ["2x", "-y", "3"] → "2x - y + 3". */
export const signedSum = (ts: string[]) => ts.map((t, i) => (i === 0 ? t : t.startsWith("-") ? ` - ${t.slice(1)}` : ` + ${t}`)).join("");
/** c·v as a person writes it: "3x^2", "x", "-x", "7" (v empty: a number). */
export const term = (c: number, v: string) => (v === "" ? `${c}` : ax(c, v));
/** Terms in the order given, zeros left out: [[1, "x^2"], [-3, "x"], [2, ""]] → "x^2 - 3x + 2". */
export const poly = (ts: [number, string][]) =>
  ts
    .filter(([c]) => c !== 0)
    .map(([c, v], i) => (i === 0 ? term(c, v) : c < 0 ? ` - ${term(-c, v)}` : ` + ${term(c, v)}`))
    .join("");
/** " + 3(x + 1)", " - (x + 1)": d times a bracket, after a term. */
export const timesBracket = (d: number, inside: string) => `${d < 0 ? " - " : " + "}${Math.abs(d) === 1 ? "" : Math.abs(d)}(${inside})`;
/** " + 3", " - 3" after a term. */
export const plus = (b: number) => (b < 0 ? ` - ${-b}` : ` + ${b}`);
/** a·x + b. */
export const lin = (a: number, b: number, x = "x") => `${ax(a, x)}${b === 0 ? "" : plus(b)}`;
/** a(x + b), or (x + b) when a is 1. */
export const bracket = (a: number, b: number, x = "x") => `${a === 1 ? "" : a === -1 ? "-" : a}(${lin(1, b, x)})`;
/** A sum written as a person would (a 0 leaves its term out): terms(2, "x", -3, "", 1, "x") → "2x - 3 + x". */
export function terms(...parts: (number | string)[]): string {
  const ts: [number, string][] = [];
  for (let i = 0; i < parts.length; i += 2) ts.push([parts[i] as number, parts[i + 1] as string]);
  return poly(ts);
}

/** The answer as the goal reads it. */
export const answer = (x: number) => `x = ${x}`;

export type Shape = { id: string; name: string; make: (r: Rng) => Draft | null };

/** The shapes with these ids, in this order: a level's list. */
export function byIds(shapes: readonly Shape[], ...ids: string[]): Shape[] {
  return ids.map((id) => {
    const s = shapes.find((s) => s.id === id);
    if (!s) throw new Error(`No exercise shape "${id}"`);
    return s;
  });
}

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Mostly small positive answers, now and then a negative one. */
export function pickAnswer(r: Rng): number {
  return r.next() < 0.15 ? -r.int(1, 5) : r.int(1, 9);
}
