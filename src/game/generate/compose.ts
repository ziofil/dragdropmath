/**
 * Equations built from layers around x, as a random recipe of un-moves
 * (unmove.ts): start from x = 3 and wrap the x side in layers, innermost
 * first, each the reverse of a step a learner undoes by hand — a·u + b, u
 * over a number, a root, a square, a log, a power — the numbers picked so
 * each layer gets what the next one needs (a perfect square under a root, a
 * power of 2 inside a log₂). Then a few pieces are disguised with the earlier
 * chapters' work (6 as 2·3 or log₂ 64, 5x as 3x + 2x, x on both sides).
 *
 * Solving it is the path back, so it can always be solved; the milestones
 * are the states on the way (checked with the chapter's moves in
 * compose.test.ts).
 */
import type { Rel } from "../../expr/types";
import type { RuleId } from "../../rules";
import { build, disguise, draftOf, expOfSide, lin, logOfSide, overSome, rootOf, solved, squareOf, xBoth, type UnMove } from "./unmove";
import { one, type Draft, type Level, type Rng, type Shape } from "./write";

export type Kind = "lin" | "over" | "root" | "cube" | "square" | "log" | "exp";

/** Which layers, innermost first: functions with a linear layer before each to steer its numbers. */
function plan(r: Rng, level: Level, three = false): Kind[] {
  // With positive letters every one of these keeps the order (√, log and squares of positive numbers grow with them).
  const fns: Kind[] = ["over", "root", "root", "cube", "square", "log", "log", "exp", "exp"];
  let used: Kind | null = null;
  const pick = (): Kind => {
    const ok = fns.filter((k) => k !== used && !((k === "log" || k === "exp") && (used === "log" || used === "exp")));
    used = ok[r.int(0, ok.length - 1)];
    return used;
  };
  const lin = (p: number): Kind[] => (r.next() < p ? ["lin"] : []);
  if (level === "easy") return r.next() < 0.5 ? [pick()] : (["lin", pick()] as Kind[]).slice(r.next() < 0.5 ? 1 : 0).concat(lin(0.5));
  if (level === "medium") {
    const first = pick();
    return [...lin(0.6), first, "lin", ...(r.next() < 0.4 ? [pick()] : [])];
  }
  const first = pick();
  if (three) {
    const second = pick();
    return [...lin(0.3), first, "lin", second, ...lin(0.5), pick()];
  }
  return [...lin(0.7), first, "lin", pick(), ...lin(0.8)];
}

/** The un-move of each layer (an inequality's minus in front comes a little more often: it turns it round). */
function layer(kind: Kind, ineq: boolean, row: number): UnMove {
  switch (kind) {
    case "lin":
      return lin(ineq ? 0.25 : 0.15, row);
    case "over":
      return overSome(row);
    case "root":
      return rootOf(2, row);
    case "cube":
      return rootOf(3, row);
    case "square":
      return squareOf(row);
    case "log":
      return logOfSide(row);
    case "exp":
      return expOfSide(row);
  }
}

/** How many disguises at each level. */
const DISGUISES: Record<Level, [number, number]> = { easy: [0, 0], medium: [1, 1], hard: [2, 3] };

export type ComposeOptions = {
  /** An inequality: the relation at random. */
  ineq?: boolean;
  /** The unknown's letter (x when left out). */
  letter?: string;
  /** Its row, in a system of equations (0 when left out). */
  row?: number;
  /** One more un-move, before the disguises: the plain equation (every layer on, nothing disguised) written another way. */
  around?: (x0: number) => UnMove;
  /** Which layers it must have (say, a root and a log): drawn again until they do. */
  needs?: (kinds: readonly Kind[]) => boolean;
  /** At Hard, three functions (a root, a log, a fraction…) instead of two. */
  three?: boolean;
};

/** The answer and the steps back from it: the layers of `level` and its disguises, with only the moves in `rules`. */
export function composeSteps(r: Rng, level: Level, rules: readonly RuleId[], opts: ComposeOptions = {}): { x0: number; steps: UnMove[] } | null {
  const x = opts.letter ?? "x";
  const row = opts.row ?? 0;
  const has = new Set(rules);
  let kinds = plan(r, level, opts.three);
  for (let t = 0; t < 40 && opts.needs && !opts.needs(kinds); t++) kinds = plan(r, level, opts.three);
  if (opts.needs && !opts.needs(kinds)) return null;
  const layers = kinds.map((k) => layer(k, !!opts.ineq, row));
  // The last layer leaves a number a person writes without thinking twice.
  layers.push({ rules: [], wants: (v) => v !== 0 && Math.abs(v) <= 60, on: (s) => s });
  // The answer: something the first layer can take.
  const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => layers[0].wants?.(v) ?? true);
  if (!xs.length) return null;
  const x0 = one(r, xs);
  // Three layers are enough work: a disguise at most.
  const [lo, hi] = opts.three ? [0, 1] : DISGUISES[level];
  const done = new Set<string>();
  const disguises = Array.from({ length: r.int(lo, hi) }, (_, k) => (k === 0 && level === "hard" && has.has("move-term") && r.next() < 0.5 ? xBoth(x, row) : disguise(has, done, row)));
  const around = opts.around?.(x0);
  return { x0, steps: [...layers, ...(around ? [around] : []), ...disguises] };
}

/** An equation (or an inequality) solved for x, with the layers and disguises of `level`, using only the moves in `rules`. */
export function composeEquation(r: Rng, level: Level, rules: readonly RuleId[], inequality = false): Draft | null {
  const rel: Rel = inequality ? one(r, ["<", ">", "≤", "≥"] as const) : "=";
  const made = composeSteps(r, level, rules, { ineq: inequality });
  const b = made && build(solved("x", made.x0, rel), made.steps, r);
  return b && draftOf("composed", b);
}

/** The composed exercises as a shape of a level (see practice.ts). */
export const composed = (level: Level, rules: () => readonly RuleId[], inequality = false, weight = 1): Shape => ({
  id: "composed",
  name: "layers around x, built back from the answer",
  make: (r) => composeEquation(r, level, rules(), inequality),
  weight,
});
