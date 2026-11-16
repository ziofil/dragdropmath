/**
 * What every chapter's exercise shapes are made with (chapters/*.ts): a
 * seeded random source, the draft a shape makes, and a few ways of writing
 * maths as a person would for the shapes still written as text. Most shapes
 * are recipes now, built backwards from their answer on trees (unmove.ts,
 * linear.ts, equations.ts, systems.ts, compose.ts) or from pieces
 * (composeExpr.ts, composeFrac.ts), their milestones derived; the rest
 * write theirs, and every one is checked with the move engine (verify.ts).
 */

import type { RuleId } from "../../rules";

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

/** xⁿ as written: "x", "x^3", "x^-2". */
export const pw = (x: string, n: number) => (n === 1 ? x : `${x}^${n}`);

/** One of the list, at random. */
export const one = <T,>(r: Rng, xs: readonly T[]): T => xs[r.int(0, xs.length - 1)];

/** A letter: mostly x, now and then one of `others`. */
export const letter = (r: Rng, others: readonly string[] = ["y", "a", "t", "n"]) => (r.next() < 0.6 ? "x" : one(r, others));

/** Two different letters: mostly x and y, now and then a and b. */
export const letterPair = (r: Rng): [string, string] => (r.next() < 0.8 ? ["x", "y"] : ["a", "b"]);

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
  /** Milestones on the way, in order (for checking it can be done: verify.ts). */
  via: string[];
  /** Its letters stand for positive numbers (said on screen; see rules/signs.ts). */
  positive?: boolean;
  /** The moves each stretch takes (start → first milestone, …, last → goal), when known: checking searches with those first. */
  legs?: RuleId[][];
  /** Stretches already proven one of those moves undoes (a walk checks each step as it takes it): serving needn't search them again. */
  proven?: boolean[];
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
export type Shape = {
  id: string;
  name: string;
  make: (r: Rng) => Draft | null;
  /** How often it comes up, against the level's other shapes (1 each by default). */
  weight?: number;
  /** Its letters stand for positive numbers (when its drafts don't say; else its chapter's). */
  positive?: boolean;
  /** Written by hand, numbers and all (real formulas): not held to the beauty rules (beauty.ts). */
  curated?: boolean;
  /** A last check, on the draft picked only (a search: too slow for every try): the draft as it passed (it may add what it found), or null to pick another. */
  check?: (d: Draft) => Draft | null;
  /** How many drafts to make and pick the nicest from (default practice.ts POOL): fewer for a shape whose drafts cost a search each. */
  pool?: number;
};

/** The shapes with these ids, in this order: a level's list. */
export function byIds(shapes: readonly Shape[], ...ids: string[]): Shape[] {
  return ids.map((id) => {
    const s = shapes.find((s) => s.id === id);
    if (!s) throw new Error(`No exercise shape "${id}"`);
    return s;
  });
}

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

