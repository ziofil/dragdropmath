import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { allNodes, locate, nodeAt, parentLoc, withoutFrom } from "../expr/tree";
import { dragCtx, replaceIn, signOwner, type Candidate, type Feel, type Rule, type RuleId } from "./types";
import { num } from "../expr/build";
import { roleOf } from "./view";
export { handles, signId, signOwner } from "./types";
import { combine, commute, mergePowers, multiplyNumbers, multiplyOut, numbersFirst, timesOne } from "./rearrange";
import { differenceOfSquares, distribute, distributeNeg, factorOut, factorShared, splitTerm } from "./distribute";
import { substitute } from "./rows";
import { moveDenominator, moveFactor, moveLetterDenominator, moveLetterFactor, moveSign, moveTerm, swapSides } from "./balance";
import { cancelFactor, divideNumbers, evaluateFraction } from "./fractions";
import {
  combineLogs,
  dividePowers,
  evaluateLog,
  evaluatePower,
  powerOfBase,
  splitExponent,
  moveExponentTerm,
  joinPowers,
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
  evaluateRoot,
  splitSquare,
  zeroPower, tapPower } from "./powlog";
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
    splitTerm,
    differenceOfSquares,
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
    evaluateFraction,
    cancelFactor,
    powerOfPower,
    zeroPower,
    powerOne,
    pullOutOfPower,
    powerOfProduct,
    evaluatePower,
    tapPower,
    dividePowers,
    flipAcrossBar,
    expOfLog,
    logOfProduct,
    logOfPower,
    powerIntoLog,
    combineLogs,
    evaluateLog,
    powerOfBase,
    splitExponent,
    moveExponentTerm,
    joinPowers,
    rootNotation,
    evaluateRoot,
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


/** Merges a tap on the operator between two pieces does: what dropping the second on the first would. */
const SUM_TAPS: RuleId[] = ["combine", "add-fractions", "combine-logs"];
const PRODUCT_TAPS: RuleId[] = ["multiply-numbers", "merge-powers", "multiply-fractions"];

/**
 * Tapping the +, − or · in front of a piece (`itemId`: the term or factor
 * after it) works out the two on either side, as dropping one on the other
 * would: 3 + 4 → 7, 3x + 2x → 5x, 1/5 + 2/5 → (1 + 2)/5, 2·3 → 6, x²·x³ →
 * x^(2 + 3). A number times a fraction of numbers comes out as one fraction,
 * worked out: 6·(1/12) → 6/12.
 */
export function operatorTap(state: MathState, itemId: string, enabled: readonly RuleId[]): MathState | null {
  const c = dragCtx(state, itemId);
  const row = c?.parent;
  if (!c || c.index === 0 || (row?.kind !== "sum" && row?.kind !== "prod")) return null;
  const prev = row.kind === "sum" ? row.terms[c.index - 1] : row.factors[c.index - 1];
  const kinds = (row.kind === "sum" ? SUM_TAPS : PRODUCT_TAPS).filter((r) => enabled.includes(r));
  const moves = movesFor(state, enabled);
  const merge = (from: string, onto: string) => moves.drag(from).find((k) => kinds.includes(k.rule) && k.targetId === onto);
  const found = merge(itemId, prev.id) ?? merge(prev.id, itemId);
  if (!found) return null;
  return found.rule === "multiply-fractions" ? workedOut(found.state, prev.id, itemId) : found.state;
}

/** The fraction a number-times-fraction tap made, with its products of numbers multiplied out ((6·1)/12 → 6/12). */
function workedOut(state: MathState, ...ids: string[]): MathState {
  const frac = state.sides.flatMap(allNodes).find((n) => n.kind === "frac" && ids.some((id) => allNodes(n).some((m) => m.id === id) || n.id === id));
  if (frac?.kind !== "frac") return state;
  const product = (e: typeof frac.num) => (e.kind === "prod" && e.factors.every((f) => f.kind === "num") ? e.factors.reduce((a, f) => a * (f as { value: number }).value, 1) : null);
  const top = product(frac.num);
  const bottom = product(frac.den);
  if (top === null && bottom === null) return state;
  const loc = locate(state, frac.id)!;
  const next = { ...frac, num: top === null ? frac.num : num(top, frac.num.id), den: bottom === null ? frac.den : num(bottom, frac.den.id) };
  return replaceIn(state, loc, next);
}

/** How a candidate's move feels to drag (see Feel). */
export const feelOf = (c: Candidate): Feel => (c.carry ? { ...RULES[c.rule].feel, carry: c.carry } : (RULES[c.rule].feel ?? {}));

/** Everything a state allows, computed once per piece and kept with the state. */
export type Moves = {
  drag(id: string): Candidate[];
  tap(id: string): Candidate | null;
  /** It has a real move to make, so it can be picked up: by a quick press, or by pressing and holding (see pressable). */
  grabbable(id: string): boolean;
  /**
   * A quick press picks it up: it's a term of a sum (or in no sum with
   * others). A piece inside a term (the x of 3xy + 2) is taken by a press held
   * still; a quick one takes its term.
   */
  pressable(id: string): boolean;
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
  const own = memo((id) => (inert.has(id) ? [] : collect(state, id, dragRules)));
  // Two-way merges: dropping B on A does what dropping A on B does (see MIRRORED).
  const mirrorable = enabled.filter((id) => MIRRORED.includes(id));
  const nodes = state.sides.flatMap(allNodes);
  // Two pieces side by side in a row, or not in the same row at all.
  const neighbours = (a: string, b: string) => {
    const ca = dragCtx(state, a);
    const cb = dragCtx(state, b);
    const row = ca?.parent && cb?.parent && ca.parent.id === cb.parent.id && (ca.parent.kind === "prod" || ca.parent.kind === "sum");
    return !row || Math.abs(ca!.index - cb!.index) === 1;
  };
  const drag = memo((id): Candidate[] => {
    const mine = own(id);
    // A piece carried out in front (a factor, a bracket taken out) passes over its neighbours on
    // the way: the merges it only has the other way round would form there instead (the bracket of
    // x(x + 6) + 2(x + 6) multiplying into its x). They're its neighbours' to make.
    const outInFront = mine.some((c) => !c.targetId && feelOf(c).carry === "out-in-front");
    // (Nor, then, swaps with those neighbours: cosmetic, and in the way. Dragging the neighbour still swaps them.)
    if (outInFront) return mine.filter((c) => !isCosmetic(state, id, c));
    if (inert.has(id) || !mirrorable.length) return mine;
    const seen = new Set(mine.map((c) => stateKey(c.state, "exact")));
    const back: Candidate[] = [];
    for (const n of nodes) {
      if (n.id === id || inert.has(n.id)) continue;
      for (const c of own(n.id)) {
        // Only where this piece has no move of its own onto that one. Nor from a bracket: carried onto another factor it has a direction of its own ((x + 1) onto (x + 2)).
        if (c.targetId !== id || !mirrorable.includes(c.rule) || mine.some((m) => m.targetId === n.id) || n.kind === "sum") continue;
        // In the same row, only from a neighbour: (x + 2) doesn't reach over (x + 1) to the 2 of 2(x + 1)(x + 2).
        if (!neighbours(id, n.id)) continue;
        const k = stateKey(c.state, "exact");
        if (seen.has(k)) continue;
        seen.add(k);
        back.push({ rule: c.rule, state: c.state, targetId: n.id });
      }
    }
    return [...mine, ...back];
  });
  const tap = memo((id) => (inert.has(id) ? null : (collect(state, id, tapRules)[0] ?? null)));
  // Any piece with a real move can be picked up: a quick press takes it when it's
  // a term (or in no sum at all), a press held still takes it out of its term.
  const grabbable = memo((id) => drag(id).some((c) => !isCosmetic(state, id, c)));
  const pressable = memo((id) => {
    if (!grabbable(id)) return false;
    // An exponent written as a sum (2^(x − 3)) has no brackets to press: a press
    // anywhere on it takes it all, when it has a move of its own (a hold, a term of it).
    const c = signOwner(id) ? null : dragCtx(state, id);
    const up = c?.parent && dragCtx(state, c.parent.id);
    if (c?.parent?.kind === "sum" && up?.parent?.kind === "pow" && up.index === 1 && grabbable(c.parent.id)) return false;
    const term = termAround(state, id);
    return term === null || !grabbable(term);
  });
  const tappable = memo((id) => tap(id) !== null);
  const moves = { drag, tap, grabbable, pressable, tappable };
  byRules.set(rulesKey, moves);
  return moves;
}

function collect(withMarks: MathState, draggedId: string, enabled: readonly RuleId[]): Candidate[] {
  // Copies made by the previous move are ordinary pieces now (see withoutFrom).
  const state = withoutMarks(withMarks);
  const seen = new Set([stateKey(state, "exact")]);
  const out: Candidate[] = [];
  const kept = Object.fromEntries((["rel", "join", "letters"] as const).flatMap((k) => (state[k] ? [[k, state[k]]] : []))) as Partial<MathState>;
  for (const id of enabled) {
    for (const found of RULES[id].apply(state, draggedId)) {
      // Rules rewrite sides; the relation, how rows go together and what the letters
      // stand for carry over (unless the move sets them: an inequality turned round).
      const cand = { ...found, state: { ...kept, ...found.state } };
      const k = stateKey(cand.state, "exact");
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(cand);
    }
  }
  return out;
}

/**
 * Merges that work both ways round: whichever of the two is dropped on the
 * other, the same happens (36 on the 6 of 36/6 as well as 6 on the 36, the
 * bracket of 4(x + 6) on the 4, ln x on the 4 of 4·ln x, …).
 */
const MIRRORED: RuleId[] = [
  "divide-numbers",
  "power-of-power",
  "divide-powers",
  "evaluate-power",
  "distribute",
  "substitute",
  "exp-of-log",
  "power-into-log",
  "divide-by-fraction",
  "times-one",
  "power-one",
  "zero-power",
];

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

/**
 * The term of a sum (with others) that `id` sits in side by side with other
 * factors: 3xy for the x of 3xy + 2, 2(x + 1) for its 2 or its bracket. Null
 * if it is itself such a term, in no sum with others, or set apart from its
 * term on screen — a fraction's top or bottom, an exponent, what a log or a
 * root holds: those are pressed directly. (A power's base isn't set apart:
 * the x of 3x² is pressed as part of its term.)
 */
function termAround(state: MathState, id: string): string | null {
  let loc = locate(state, id);
  while (loc && loc.path.length > 0) {
    const up = parentLoc(loc)!;
    const P = nodeAt(state, up);
    if (P.kind === "sum" && P.terms.length >= 2) {
      const t = nodeAt(state, loc).id;
      return t === id ? null : t;
    }
    // Side by side: factors, a minus, and a power's base (the x of x², not its exponent, nor what a √ holds).
    const besideIt = P.kind === "prod" || P.kind === "neg" || (P.kind === "pow" && !P.radical && loc.path.at(-1) === 0);
    if (!besideIt) return null;
    loc = up;
  }
  return null;
}

/** Does a quick press pick this piece up (see Moves.pressable)? */
export function isPressable(state: MathState, id: string, enabled: readonly RuleId[]): boolean {
  return movesFor(state, enabled).pressable(id);
}


/** The state without "copied from" marks from earlier moves (keeps the object when there are none). */
export function withoutMarks(state: MathState): MathState {
  const sides = state.sides.map(withoutFrom);
  return sides.every((e, i) => e === state.sides[i]) ? state : { ...state, sides };
}
