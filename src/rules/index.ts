import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { allNodes, withoutFrom } from "../expr/tree";
import { dragCtx, type Candidate, type Rule, type RuleId } from "./types";
export { handles, signId, signOwner } from "./types";
import { combine, commute, mergePowers, multiplyNumbers, numbersFirst, timesOne } from "./rearrange";
import { distribute, distributeNeg, factorOut } from "./distribute";
import { moveDenominator, moveFactor, moveSign, moveTerm } from "./balance";
import { cancelFactor, divideNumbers } from "./fractions";
import {
  combineLogs,
  dividePowers,
  evaluateLog,
  evaluatePower,
  powerOfBase,
  expAcross,
  expOfLog,
  flipAcrossBar,
  logAcross,
  logOfPower,
  logOfProduct,
  powerIntoLog,
  powerOfPower,
  powerOne,
  pullOutOfPower,
  powerOfProduct,
  rootAcross,
  rootNotation,
  splitSquare,
  zeroPower,
} from "./powlog";
import { addFractions, divideByFraction, expandFraction, multiplyFractions, splitFraction, splitNumber } from "./fracs";

export type { Candidate, Rule, RuleId } from "./types";

export const RULES: Record<RuleId, Rule> = Object.fromEntries(
  [
    commute,
    combine,
    multiplyNumbers,
    timesOne,
    numbersFirst,
    splitNumber,
    expandFraction,
    addFractions,
    splitFraction,
    multiplyFractions,
    divideByFraction,
    mergePowers,
    distribute,
    distributeNeg,
    factorOut,
    moveTerm,
    moveFactor,
    moveDenominator,
    moveSign,
    divideNumbers,
    cancelFactor,
    powerOfPower,
    zeroPower,
    powerOne,
    pullOutOfPower,
    powerOfProduct,
    evaluatePower,
    dividePowers,
    flipAcrossBar,
    expOfLog,
    logOfProduct,
    logOfPower,
    powerIntoLog,
    combineLogs,
    evaluateLog,
    powerOfBase,
    rootNotation,
    splitSquare,
    rootAcross,
    expAcross,
    logAcross,
  ].map((r) => [r.id, r]),
) as Record<RuleId, Rule>;

export const ALL_RULES = Object.keys(RULES) as RuleId[];

/**
 * Every state that dragging `draggedId` can lead to under the enabled rules,
 * without duplicates or no-ops.
 */
export function candidatesFor(state: MathState, draggedId: string, enabled: readonly RuleId[]): Candidate[] {
  return collect(state, draggedId, enabled.filter((id) => !RULES[id].tap));
}

/** What tapping this node does, if anything. */
export function tapFor(state: MathState, nodeId: string, enabled: readonly RuleId[]): Candidate | null {
  // Tidying (x·2 → 2x) applies to a whole product, so any more specific tap on
  // the thing actually tapped (log₂2 → 1 in log₂2·3) comes first.
  const taps = enabled.filter((id) => RULES[id].tap).sort((a, b) => Number(a === "numbers-first") - Number(b === "numbers-first"));
  return collect(state, nodeId, taps)[0] ?? null;
}

function collect(withMarks: MathState, draggedId: string, enabled: readonly RuleId[]): Candidate[] {
  // Copies made by the previous move are ordinary pieces now (see withoutFrom).
  const state = withoutMarks(withMarks);
  const seen = new Set([stateKey(state, "exact")]);
  const out: Candidate[] = [];
  for (const id of enabled) {
    for (const cand of RULES[id].apply(state, draggedId)) {
      const k = stateKey(cand.state, "exact");
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(cand);
    }
  }
  return out;
}

/** Nodes not drawn: the 1 and n inside a root's exponent (√ is drawn instead). */
function hidden(state: MathState): Set<string> {
  const out = new Set<string>();
  for (const n of state.sides.flatMap(allNodes)) {
    if (n.kind === "pow" && n.radical) for (const h of allNodes(n.exp).slice(1)) out.add(h.id);
  }
  return out;
}

/**
 * Swapping factors inside a product (2x → x·2) changes nothing that matters,
 * so on its own it doesn't make a symbol worth grabbing.
 */
export function isCosmetic(state: MathState, draggedId: string, c: Candidate): boolean {
  return c.rule === "commute" && dragCtx(state, draggedId)?.parent?.kind === "prod";
}

/**
 * Can this node be grabbed by itself? Only if it has a real move. Otherwise
 * presses on it fall through to the enclosing term — so in 3x + 2x, pressing
 * the 2 picks up the whole term 2x, while in 3·y·2 it picks up just the 2
 * (which can multiply into the 3).
 */
export function isGrabbable(state: MathState, id: string, enabled: readonly RuleId[]): boolean {
  if (hidden(state).has(id)) return false;
  return (
    candidatesFor(state, id, enabled).some((c) => !isCosmetic(state, id, c) && !c.secondary) ||
    tapFor(state, id, enabled) !== null
  );
}

/** The state without "copied from" marks from earlier moves (keeps the object when there are none). */
export function withoutMarks(state: MathState): MathState {
  const sides = state.sides.map(withoutFrom);
  return sides.every((e, i) => e === state.sides[i]) ? state : { ...state, sides };
}
