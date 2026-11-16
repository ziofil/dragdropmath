/**
 * What a chapter's lesson boards are made of (one per move; see moves.ts):
 * a drill, the helpers chapters write theirs with, and which piece a drill's
 * words say to carry. Imports nothing that imports the chapters.
 */
import type { RuleId } from "../../rules";
import type { MathState } from "../../expr/types";
import { locate, nodeAt } from "../../expr/tree";
import { letter, type Rng } from "./write";

export type Drill = {
  /** Its words (i18n `drills`) and its link. */
  id: string;
  /** The move it teaches. */
  rule: RuleId;
  /**
   * The start; `want`, if given, is the first term the move's result must have on the left (when it
   * could be made in more than one place). `goal`, if given, is where the
   * board finishes, a few moves on: the move alone would leave it half done
   * (x = 16 − 6 still to work out, 1/3 + 1/4 with only one bottom changed).
   */
  make: (r: Rng) => string | { start: string; want?: string; goal?: string; via?: string[] };
  /** The piece its words say to carry, if they say (Show carries that one). */
  carries?: Carry;
};

/**
 * The piece a drill's words say to carry, where the move could be made with
 * either of two (the bottom power onto the top one, or the top onto the
 * bottom; the 5 of 4/(3/5) up, not the 3; the y of y = 2x onto the other y,
 * not that one onto it): Show carries that one, so it does what the words say.
 */
export type Carry = "bottom" | "lower-bottom" | "exponent" | "outer-exponent" | "number" | "alone";

/** A drill whose words name the piece to carry. */
export const carrying = (carries: Carry, drill: Drill): Drill => ({ ...drill, carries });

/** Whether piece `id` is the kind `carry` names. */
export function carries(state: MathState, id: string, carry: Carry): boolean {
  const loc = locate(state, id);
  if (!loc) return false;
  const node = nodeAt(state, loc);
  const parent = loc.path.length ? nodeAt(state, { ...loc, path: loc.path.slice(0, -1) }) : null;
  const last = loc.path.at(-1);
  switch (carry) {
    case "number":
      return node.kind === "num";
    case "exponent":
      return parent?.kind === "pow" && last === 1;
    case "outer-exponent":
      return parent?.kind === "pow" && last === 1 && parent.base.kind === "pow";
    case "bottom":
      // Under some fraction's bar: its bottom, or a factor of it.
      return bars(state, loc) >= 1;
    case "lower-bottom":
      // Under two bars: the bottom of a fraction that is itself a bottom (the 5 of 4/(3/5)).
      return bars(state, loc) >= 2;
    case "alone":
      // A letter alone on its side (the y of y = 2x: substituted, it's the one carried).
      return loc.path.length === 0 && node.kind === "var";
  }
}

/** How many fraction bars are over the piece at `loc`. */
function bars(state: MathState, loc: NonNullable<ReturnType<typeof locate>>): number {
  return loc.path.filter((step, k) => step === 1 && nodeAt(state, { ...loc, path: loc.path.slice(0, k) }).kind === "frac").length;
}

/** Two different letters. */
export function letters2(r: Rng): [string, string] {
  const a = letter(r);
  const b = ["x", "y", "a", "b"].filter((l) => l !== a)[r.int(0, 2)];
  return [a, b];
}

export const d = (id: string, make: Drill["make"], rule = id as RuleId): Drill => ({ id, rule, make });
