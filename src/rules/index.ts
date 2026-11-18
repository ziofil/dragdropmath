import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { inSetting } from "../expr/setting";
import { settleCopies, withoutCopies } from "../expr/copies";
import { allNodes, locate } from "../expr/tree";
import { dragCtx, replaceIn, type Candidate, type Feel, type Rule, type RuleId } from "./types";
import { handles, opOwner, pieceAround, rootParts, signId, signOwner, unheld } from "./handles";
import { num } from "../expr/build";
import { powerOf, roleOf } from "./view";
export { dotBetween, handles, opId, opOwner, signId, signOwner } from "./handles";
import { combine, commute, mergePowers, multiplyNumbers, multiplyOut, numbersFirst, timesOne, timesZero } from "./rearrange";
import { differenceOfSquares, distribute, distributeNeg, factorOut, factorShared, splitTerm } from "./distribute";
import { substitute } from "./rows";
import { moveDenominator, moveFactor, moveLetterDenominator, moveLetterFactor, moveSign, moveTerm, swapSides } from "./balance";
import { cancelFactor, dividePowers } from "./fractions";
import {
  combineLogs,
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
  splitSquare,
  zeroPower } from "./powlog";
import { zeroProduct } from "./either";
import { tapsOn } from "./taps";
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
    timesZero,
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
    splitExponent,
    moveExponentTerm,
    joinPowers,
    rootNotation,
      splitSquare,
    rootAcross,
    zeroProduct,
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


/** One way to make a step: piece `id` carried (onto `candidate.targetId`, if any), or tapped. */
export type Way = { id: string; tap: boolean; candidate: Candidate };
/** One step a learner can make: the state it gives, and every way to make it (by any rule). */
export type Step = { state: MathState; ways: Way[] };

/**
 * Every step one move away from `state`: each distinct result once, with all
 * the ways of making it — the pieces a learner can pick up and carry, and
 * taps. A learner thinks in steps ("6x/6 became x"), not in rules (the bottom
 * 6 carried up divides the numbers; the top one carried down cancels a
 * factor): the solver, the lessons and Show all read moves from here.
 */
export function stepsFrom(state: MathState, enabled: readonly RuleId[]): Step[] {
  const moves = movesFor(state, enabled);
  const byKey = new Map<string, Step>();
  const add = (w: Way) => {
    const k = stateKey(w.candidate.state, "exact");
    const step = byKey.get(k);
    if (step) step.ways.push(w);
    else byKey.set(k, { state: w.candidate.state, ways: [w] });
  };
  for (const id of handles(state)) {
    if (moves.grabbable(id)) for (const c of moves.drag(id)) add({ id, tap: false, candidate: c });
    const t = moves.tap(id);
    if (t) add({ id, tap: true, candidate: t });
  }
  return [...byKey.values()];
}

/**
 * Tapping the +, − or · in front of a piece (`itemId`: the term or factor
 * after it) works out the two on either side, as dropping one on the other
 * would: 3 + 4 → 7, 3x + 2x → 5x, 1/5 + 2/5 → (1 + 2)/5, 2·3 → 6, x²·x³ →
 * x^(2 + 3). A number times a fraction of numbers comes out as one fraction,
 * worked out: 6·(1/12) → 6/12. When the two don't merge: in a sum, what they
 * share comes out (x² + 3x → x(x + 3)), else a difference of two squares
 * factors (x² − 9 → (x − 3)(x + 3)); in a product, its numbers are
 * multiplied out (4x·3 → 12x).
 */
export function operatorMove(state: MathState, itemId: string, enabled: readonly RuleId[]): Candidate | null {
  const c = dragCtx(state, itemId);
  const row = c?.parent;
  if (!c || c.index === 0 || (row?.kind !== "sum" && row?.kind !== "prod")) return null;
  const prev = row.kind === "sum" ? row.terms[c.index - 1] : row.factors[c.index - 1];
  const kinds = enabled.filter((r) => RULES[r].operatorTap === (row.kind === "sum" ? "sum" : "product"));
  const moves = movesFor(state, enabled);
  const merge = (from: string, onto: string) => moves.drag(from).find((k) => kinds.includes(k.rule) && k.targetId === onto);
  const found = merge(itemId, prev.id) ?? merge(prev.id, itemId);
  if (found) return { rule: found.rule, state: found.rule === "multiply-fractions" ? workedOut(found.state, prev.id, itemId) : found.state };
  const by = (rule: RuleId, id: string) => (enabled.includes(rule) ? (collect(state, id, [rule])[0] ?? null) : null);
  if (row.kind === "sum") {
    // (Only where factoring is a move here: finding what two terms share drags every piece of both.)
    const shared = enabled.includes("factor-out") || enabled.includes("factor-shared") ? shareOut(state, row.terms, prev.id, itemId, enabled) : undefined;
    if (shared) return { rule: shared.rule, state: shared.state };
    return c.node.kind === "neg" ? by("difference-of-squares", signId(itemId)) : null;
  }
  return by("multiply-out", row.id);
}

/** What tapping the operator in front of piece `itemId` gives (see operatorMove), or null. */
export function operatorTap(state: MathState, itemId: string, enabled: readonly RuleId[]): MathState | null {
  return operatorMove(state, itemId, enabled)?.state ?? null;
}

/**
 * Two terms side by side that don't combine: what they share comes out, as
 * pressing and holding it in one and dropping it on the other would (x² + 3x
 * → x(x + 3), −2x − 6 → −2(x + 3)); a sum of just those two, by taking it
 * out in front (x(x + 3) − 2(x + 3) → (x + 3)(x − 2)). A bracket they share
 * first, then a letter, then a number.
 */
function shareOut(state: MathState, terms: readonly MathState["sides"][number][], a: string, b: string, enabled: readonly RuleId[]): Candidate | undefined {
  const moves = movesFor(state, enabled);
  const pair = terms.length === 2;
  const term = (id: string) => terms.find((t) => t.id === id)!;
  // A bracket first, then a letter, then a number; of two powers of a letter, the higher (x² of x⁴ − x², not x);
  // a minus last, when nothing else is shared (−x + 4 → −(x − 4)).
  const rank = (id: string) => {
    if (signOwner(id)) return 300;
    const n = allNodes(term(a)).concat(allNodes(term(b))).find((x) => x.id === id);
    return (n?.kind === "sum" ? 0 : n?.kind === "num" ? 2 : 1) * 100 - (n ? powerOf(n).n : 0);
  };
  const found: { c: Candidate; r: number }[] = [];
  for (const [from, onto] of [[a, b], [b, a]] as const) {
    const t = term(from);
    // The term's pieces, and its minus (a handle of its own) when it's written with one.
    for (const id of [...allNodes(t).map((n) => n.id), ...(t.kind === "neg" && !pair ? [signId(t.id)] : [])]) {
      if (id === from && !pair) continue;
      for (const c of moves.drag(id)) {
        const shares = pair ? c.rule === "factor-out" : c.rule === "factor-shared" && c.targetId === onto;
        if (shares) found.push({ c, r: rank(id) });
      }
    }
  }
  return found.sort((x, y) => x.r - y.r)[0]?.c;
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

  // Tidying is done for the learner (game/tidy.ts); what a tap does is decided by the piece (taps.ts).
  const dragRules = enabled.filter((id) => !RULES[id].tidy && !RULES[id].tap);
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
  // A product with nothing to grab it by as a whole (no · drawn, not a term among others) has no moves of its own.
  const own = memo((id) => (inert.has(id) || unheld(state, id) ? [] : collect(state, id, dragRules)));
  // Two-way merges: dropping B on A does what dropping A on B does (see Rule.either).
  const mirrorable = enabled.filter((id) => RULES[id].either);
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
  // An operator's tap works out its two sides; any other piece's, the first of its taps (taps.ts) the chapter has that applies.
  const tap = memo((id): Candidate | null => {
    if (inert.has(id)) return null;
    const after = opOwner(id);
    if (after) return operatorMove(state, after, enabled);
    for (const rule of tapsOn(state, id)) {
      if (!enabled.includes(rule)) continue;
      const made = collect(state, id, [rule])[0];
      // (A merge made by a tap, as x⁰ dropped on its base is: the same result, no target.)
      if (made) return { rule: made.rule, state: made.state };
    }
    return null;
  });
  // Any piece with a real move can be picked up: a quick press takes it when it's
  // a term (or in no sum at all), a press held still takes it out of its term.
  const grabbable = memo((id) => drag(id).some((c) => !isCosmetic(state, id, c)));
  const pressable = memo((id) => {
    if (!grabbable(id)) return false;
    const around = signOwner(id) ? null : pieceAround(state, id);
    return around === null || !grabbable(around);
  });
  const tappable = memo((id) => tap(id) !== null);
  const moves = { drag, tap, grabbable, pressable, tappable };
  byRules.set(rulesKey, moves);
  return moves;
}

/** Every candidate the given rules give for dragging (or tapping) `draggedId`, without the learner's restrictions: tidying uses it. */
export function applyRules(state: MathState, draggedId: string, rules: readonly RuleId[]): Candidate[] {
  return collect(state, draggedId, rules);
}

function collect(withMarks: MathState, draggedId: string, enabled: readonly RuleId[]): Candidate[] {
  // Copies made by the previous move are ordinary pieces now.
  const state = withoutCopies(withMarks);
  // (The start's key only once a move gives something: most pieces have no move of most rules.)
  let seen: Set<string> | null = null;
  const out: Candidate[] = [];
  for (const id of enabled) {
    for (const found of RULES[id].apply(state, draggedId)) {
      seen ??= new Set([stateKey(state, "exact")]);
      // Rules rewrite sides; the relation, how rows go together and what the letters
      // stand for carry over (unless the move sets them: an inequality turned round).
      const cand = { ...found, state: settleCopies(inSetting(found.state, state), state) };
      const k = stateKey(cand.state, "exact");
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(cand);
    }
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

/** Does a quick press pick this piece up (see Moves.pressable)? */
export function isPressable(state: MathState, id: string, enabled: readonly RuleId[]): boolean {
  return movesFor(state, enabled).pressable(id);
}


