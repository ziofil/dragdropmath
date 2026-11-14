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
/** " + 3", " - 3" after a term. */
export const plus = (b: number) => (b < 0 ? ` - ${-b}` : ` + ${b}`);
/** a·x + b. */
export const lin = (a: number, b: number, x = "x") => `${ax(a, x)}${b === 0 ? "" : plus(b)}`;
/** a(x + b), or (x + b) when a is 1. */
export const bracket = (a: number, b: number) => `${a === 1 ? "" : a === -1 ? "-" : a}(${lin(1, b)})`;
/** The answer as the goal reads it. */
export const answer = (x: number) => `x = ${x}`;

export type Shape = { id: string; name: string; make: (r: Rng) => Draft | null };

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Mostly small positive answers, now and then a negative one. */
export function pickAnswer(r: Rng): number {
  return r.next() < 0.15 ? -r.int(1, 5) : r.int(1, 9);
}
