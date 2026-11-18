/**
 * Moves that go together, named once: the stages of a way (way.ts) and the
 * stretches of an exercise built backwards (unmove.ts) are made of these, so
 * a move added, changed or dropped is changed here, not in every list.
 */
import type { RuleId } from "../../rules";

/** Working out: two numbers become one (3 + 4, 2·3, 4x·3, 0·x, 2³). */
export const ARITH: readonly RuleId[] = ["combine", "multiply-numbers", "multiply-out", "times-zero", "evaluate-power"];

/** A fraction worked out by hand: its numbers split to show what they share, and that cancelled. */
export const SIMPLIFY: readonly RuleId[] = ["split-number", "cancel-factor"];
