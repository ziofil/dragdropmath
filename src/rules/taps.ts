/**
 * What a tap does: decided by what the tapped piece is, in this one place
 * (docs/move-system.md, "Tap"). Each tap move only does its own maths; which
 * one a tap makes is never left to the moves themselves, so a piece has one
 * meaning for a tap by construction. (A tap on a +, − or · is the operator's:
 * see operatorMove in index.ts.)
 *
 * - a number: 0 multiplying something, or over something → 0 (or, as an
 *   exponent, x⁰ → 1); an exponent → the power written out; under a root →
 *   split off a power; the 1 of ln(1) → 0, another number in a log → a power
 *   of its base; elsewhere → split off what it shares across the bar or with
 *   its sum, else a power of the base it's used with, else its smallest prime
 * - a root, or a power with a fraction exponent → root ↔ power
 * - a log of its base, or of 1 → worked out
 * - the middle term of x² + 5x + 6 → split in two
 */
import type { MathState } from "../expr/types";
import { rootOrder } from "../expr/key";
import { dragCtx, type RuleId } from "./types";
import { sharedFactor } from "./numbers";

/** The moves a tap on piece `id` may make, in the order tried: the first of them the chapter has, that applies, is the tap. */
export function tapsOn(state: MathState, id: string): readonly RuleId[] {
  const c = dragCtx(state, id);
  if (!c) return [];
  const e = c.node;
  const up = c.parent;
  if (e.kind === "num") {
    if (e.value === 0) return ["times-zero", "zero-power"];
    if (up?.kind === "pow" && c.index === 1) return ["power-to-product"];
    // Under a root: the radicand, or a factor of it.
    const holder = up?.kind === "prod" ? dragCtx(state, up.id) : c;
    if (holder?.parent?.kind === "pow" && holder.index === 0 && rootOrder(holder.parent.exp) !== null) return ["split-square"];
    if (up?.kind === "log" && c.index === 1) return e.value === 1 ? ["evaluate-log"] : ["power-of-base"];
    return Number.isInteger(e.value) && sharedFactor(state, id, e.value) ? ["split-number"] : ["power-of-base", "split-number"];
  }
  if ((e.kind === "pow" && rootOrder(e.exp) !== null) || (up?.kind === "pow" && c.index === 1 && rootOrder(e) !== null)) return ["root-notation"];
  if (e.kind === "log" || (up?.kind === "log" && c.index === 0)) return ["evaluate-log"];
  return ["split-term"];
}
