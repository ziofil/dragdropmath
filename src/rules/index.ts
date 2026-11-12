import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { allNodes, withoutFrom } from "../expr/tree";
import { dragCtx, type Candidate, type Feel, type Rule, type RuleId } from "./types";
import { roleOf } from "./view";
export { handles, signId, signOwner } from "./types";
import { combine, commute, mergePowers, multiplyNumbers, multiplyOut, numbersFirst, timesOne } from "./rearrange";
import { distribute, distributeNeg, factorOut, factorShared } from "./distribute";
import { substitute } from "./rows";
import { moveDenominator, moveFactor, moveLetterDenominator, moveLetterFactor, moveSign, moveTerm, swapSides } from "./balance";
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
    moveLetterFactor,
    moveLetterDenominator,
    substitute,
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


/**
 * Tapping the + or − in front of a term, when it and the term before it are
 * plain numbers (3 + 4, 10 − 4): they're added up, as dropping one on the
 * other would (like tapping 2·3 multiplies it out).
 */
export function operatorTap(state: MathState, termId: string, enabled: readonly RuleId[]): MathState | null {
  if (!enabled.includes("combine")) return null;
  const c = dragCtx(state, termId);
  if (c?.parent?.kind !== "sum" || c.index === 0) return null;
  const plain = (e: { kind: string; arg?: { kind: string } }) => e.kind === "num" || (e.kind === "neg" && e.arg?.kind === "num");
  const prev = c.parent.terms[c.index - 1];
  if (!plain(c.node) || !plain(prev)) return null;
  return movesFor(state, enabled).drag(termId).find((k) => k.rule === "combine" && k.targetId === prev.id)?.state ?? null;
}

/** How a candidate's move feels to drag (see Feel). */
export const feelOf = (c: Candidate): Feel => RULES[c.rule].feel ?? {};

/** Everything a state allows, computed once per piece and kept with the state. */
export type Moves = {
  drag(id: string): Candidate[];
  tap(id: string): Candidate | null;
  /** A drag handle: pressing it carries this piece (it has a real move to make). */
  grabbable(id: string): boolean;
  /** Tapping it does something. A piece that can only be tapped isn't a handle: dragging it carries what encloses it. */
  tappable(id: string): boolean;
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
  // Pieces that are never handles of their own: a root's exponent, drawn as
  // the √ (and the 1 and n inside it). A root moves as one piece; its ½ is
  // reached by tapping the root into x^(1/2) first.
  const inert = rootParts(state);
  const drag = memo((id) => (inert.has(id) ? [] : collect(state, id, dragRules)));
  const tap = memo((id) => (inert.has(id) ? null : (collect(state, id, tapRules)[0] ?? null)));
  const grabbable = memo((id) => drag(id).some((c) => !isCosmetic(state, id, c) && !c.secondary));
  const tappable = memo((id) => tap(id) !== null);
  const moves = { drag, tap, grabbable, tappable };
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
      // …and rows keep how they go together, unless the move says otherwise.
      const withRel = found.state.rel || !state.rel ? found : { ...found, state: { ...found.state, rel: state.rel } };
      const cand = withRel.state.join || !state.join ? withRel : { ...withRel, state: { ...withRel.state, join: state.join } };
      const k = stateKey(cand.state, "exact");
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(cand);
    }
  }
  return out;
}

/** A root's exponent (drawn as the √) and everything inside it. */
function rootParts(state: MathState): Set<string> {
  const out = new Set<string>();
  for (const n of state.sides.flatMap(allNodes)) {
    if (n.kind === "pow" && n.radical) for (const h of allNodes(n.exp)) out.add(h.id);
  }
  return out;
}

/**
 * Swapping factors inside a term that has company (2x in 2x + 3x → x·2)
 * changes nothing that matters, and a press there must pick up the term (to
 * combine it, carry it across, …): on its own it doesn't make a symbol worth
 * grabbing. Elsewhere — a product that is a whole side or expression,
 * (x²y)³·y⁻¹ — there's no bigger term to pick up, and a factor you can see
 * should come along when you grab it.
 */
export function isCosmetic(state: MathState, draggedId: string, c: Candidate): boolean {
  if (feelOf(c).carry !== "reorder") return false;
  const P = dragCtx(state, draggedId)?.parent;
  if (P?.kind !== "prod") return false;
  const r = roleOf(state, P.id);
  return r !== null && r.terms.length >= 2;
}

/**
 * Let go of what was worked out for a state. The app keeps a handful of
 * states; a search keeps thousands, and their move lists (each move a whole
 * expression) would otherwise live as long as the states do.
 */
export function forgetMoves(state: MathState): void {
  cache.delete(state);
}

/** The state without "copied from" marks from earlier moves (keeps the object when there are none). */
export function withoutMarks(state: MathState): MathState {
  const sides = state.sides.map(withoutFrom);
  return sides.every((e, i) => e === state.sides[i]) ? state : { ...state, sides };
}
