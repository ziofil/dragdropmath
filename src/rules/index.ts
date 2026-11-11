import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { allNodes, withoutFrom } from "../expr/tree";
import { dragCtx, type Candidate, type Feel, type Rule, type RuleId } from "./types";
export { handles, signId, signOwner } from "./types";
import { combine, commute, mergePowers, multiplyNumbers, multiplyOut, numbersFirst, timesOne } from "./rearrange";
import { distribute, distributeNeg, factorOut, factorShared } from "./distribute";
import { moveDenominator, moveFactor, moveSign, moveTerm, swapSides } from "./balance";
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
  powerToProduct,
  rootAcross,
  rootNotation,
  splitSquare,
  zeroPower,
} from "./powlog";
import { addFractions, divideByFraction, expandFraction, multiplyFractions, splitFraction, splitNumber } from "./fracs";

export type { Candidate, Feel, Rule, RuleId } from "./types";

export const RULES: Record<RuleId, Rule> = Object.fromEntries(
  [
    commute,
    combine,
    multiplyNumbers,
    timesOne,
    numbersFirst,
    multiplyOut,
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
    factorShared,
    powerToProduct,
    moveTerm,
    swapSides,
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
  return movesFor(state, enabled).drag(draggedId);
}

/** What tapping this node does, if anything. */
export function tapFor(state: MathState, nodeId: string, enabled: readonly RuleId[]): Candidate | null {
  return movesFor(state, enabled).tap(nodeId);
}

/**
 * Can this node be grabbed by itself? Only if it has a real move. Otherwise
 * presses on it fall through to the enclosing term — so in 3x + 2x, pressing
 * the 2 picks up the whole term 2x, while in 3·y·2 it picks up just the 2
 * (which can multiply into the 3).
 */
export function isGrabbable(state: MathState, id: string, enabled: readonly RuleId[]): boolean {
  return movesFor(state, enabled).grabbable(id);
}

/** How a candidate's move feels to drag (see Feel). */
export const feelOf = (c: Candidate): Feel => RULES[c.rule].feel ?? {};

/** Everything a state allows, computed once per piece and kept with the state. */
export type Moves = {
  drag(id: string): Candidate[];
  tap(id: string): Candidate | null;
  grabbable(id: string): boolean;
};

const cache = new WeakMap<MathState, Map<string, Moves>>();

/**
 * The moves of a state under some rules. States are never modified, so what a
 * piece can do is worked out once — not again for every render, hit test and
 * drag start.
 */
export function movesFor(state: MathState, enabled: readonly RuleId[]): Moves {
  const rulesKey = enabled.join(",");
  let byRules = cache.get(state);
  if (!byRules) cache.set(state, (byRules = new Map()));
  const known = byRules.get(rulesKey);
  if (known) return known;

  const dragRules = enabled.filter((id) => !RULES[id].tap);
  const tapRules = enabled.filter((id) => RULES[id].tap).sort((a, b) => (RULES[a].tapOrder ?? 0) - (RULES[b].tapOrder ?? 0));
  const memo = <T,>(f: (id: string) => T) => {
    const m = new Map<string, T>();
    return (id: string) => {
      if (!m.has(id)) m.set(id, f(id));
      return m.get(id)!;
    };
  };
  const drag = memo((id) => collect(state, id, dragRules));
  // A √ sign with no tap of its own passes a tap on to its root (√x ↔ x^(1/2)).
  const signOf = new Map(
    state.sides.flatMap(allNodes).flatMap((n) => (n.kind === "pow" && n.radical ? [[n.exp.id, n.id] as const] : [])),
  );
  const tap: (id: string) => Candidate | null = memo((id) => {
    const own = collect(state, id, tapRules)[0];
    const root = signOf.get(id);
    return own ?? (root ? tap(root) : null);
  });
  const hiddenIds = hidden(state);
  const grabbable = memo(
    (id) =>
      !hiddenIds.has(id) && (drag(id).some((c) => !isCosmetic(state, id, c) && !c.secondary) || tap(id) !== null),
  );
  const moves = { drag, tap, grabbable };
  byRules.set(rulesKey, moves);
  return moves;
}

function collect(withMarks: MathState, draggedId: string, enabled: readonly RuleId[]): Candidate[] {
  // Copies made by the previous move are ordinary pieces now (see withoutFrom).
  const state = withoutMarks(withMarks);
  const seen = new Set([stateKey(state, "exact")]);
  const out: Candidate[] = [];
  for (const id of enabled) {
    for (const found of RULES[id].apply(state, draggedId)) {
      // Rules rewrite sides; the relation carries over unless the move turns it round.
      const cand = found.state.rel || !state.rel ? found : { ...found, state: { ...found.state, rel: state.rel } };
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
  return feelOf(c).carry === "reorder" && dragCtx(state, draggedId)?.parent?.kind === "prod";
}

/** The state without "copied from" marks from earlier moves (keeps the object when there are none). */
export function withoutMarks(state: MathState): MathState {
  const sides = state.sides.map(withoutFrom);
  return sides.every((e, i) => e === state.sides[i]) ? state : { ...state, sides };
}
