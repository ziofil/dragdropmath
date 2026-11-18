import type { Expr, MathState } from "../expr/types";
import { cloneFresh, frac, isNum, neg, prod, relOf, sum, withFlippedRel } from "../expr/build";
import { evaluate, isConstant } from "../expr/eval";
import { adopt, dragCtx, isEquation, partner, setSides, without, type Candidate, type DragCtx, type Rule } from "./types";
import { signOwner } from "./handles";
import { fromTerms, rebuildTerm, roleOf, termsOf, viewTerm, type Role } from "./view";
import { visibleOne } from "./shapes";
import { assumeOf, isNegative, isPositive } from "./signs";
import { conditionOn, says } from "../expr/conditions";
import { combine } from "./rearrange";

/**
 * Multiplying or dividing both sides by a negative number turns an
 * inequality round (2 < 3, but −2 > −3); an equation stays as it is.
 */
const turnedBy = (state: MathState, factor: Expr, result: MathState) => (isNegative(factor, assumeOf(state)) ? withFlippedRel(result, state) : result);

/** Dragging something across `=` (or <, ≤, ...) only makes sense in a 2-sided state. */
function sideCtx(state: MathState, id: string): (DragCtx & { other: number }) | null {
  if (!isEquation(state)) return null;
  const c = dragCtx(state, id);
  return c && { ...c, other: partner(c.loc.side) };
}

/** Safe to divide/multiply both sides by: a constant that isn't zero. */
const nonzeroConstant = (e: Expr) => isConstant(e) && evaluate(e, {}) !== 0;
/** Worth moving across =: a constant that isn't 0 (undefined) or 1 (does nothing; times-one removes it). */
const usefulFactor = (e: Expr) => nonzeroConstant(e) && evaluate(e, {}) !== 1;

function withSides(state: MathState, side: number, mine: Expr, theirs: Expr): MathState {
  const sides = state.sides.slice();
  sides[side] = mine;
  sides[partner(side)] = theirs;
  return setSides(sides);
}

/**
 * 7 = x → x = 7, 3 > x → x < 3 (drag a whole side across: the sides change
 * places; an inequality reads the other way round, so its sign turns).
 */
export const swapSides: Rule = {
  id: "swap-sides",
  // Past the far end of the other side: just over the = is where 10 of
  // x + 3 = 10 lands crossing as a term (x + 3 − 10 = 0).
  feel: { carry: "far-end" },
  name: "Swap the sides",
  gesture: "Drag a whole side across the = (or <, >) and past the far end — the two sides change places.",
  apply(state, id) {
    const c = sideCtx(state, id);
    if (!c || c.loc.path.length !== 0) return [];
    const sides = state.sides.slice();
    [sides[c.loc.side], sides[c.other]] = [sides[c.other], sides[c.loc.side]];
    const swapped = setSides(sides);
    return [{ rule: "swap-sides", state: withFlippedRel({ ...swapped, rel: state.rel }, state) }];
  },
};

/**
 * The role of a piece on a whole side of an equation (see view.ts): every
 * move across = starts from one, so all of them agree on what a term, a
 * factor and a bottom are, whatever shape the side has.
 */
function onSide(state: MathState, id: string): (Role & { other: number }) | null {
  if (!isEquation(state)) return null;
  const r = roleOf(state, id);
  return r?.isSide ? { ...r, other: partner(r.side) } : null;
}

/**
 * x + 3 = 10 → x = 10 − 3 (drag a term across; its sign flips). Any term of
 * either side: one in a long sum, or one alone on its side (x + 2 = −6 →
 * x + 2 + 6 = 0). Dropped onto a like term over there, it combines with it.
 */
export const moveTerm: Rule = {
  id: "move-term",
  name: "Move a term across",
  // The carried piece's sign crossfades (− ↔ +) as it crosses the =.
  feel: { wears: "flip-sign" },
  gesture: "Drag a term to the other side of = — it flips sign on the way.",
  apply(state, id) {
    const r = onSide(state, id);
    if (!r || r.part !== "term" || isNum(r.node, 0)) return [];
    const t = r.node;
    // The dragged id stays on the term's body over there: −5 lands as + 5 (the
    // 5 takes the −5's id), 5 lands as − 5 (the 5 keeps its id, inside a new −).
    // The sign itself is carried by the piece and crossfades as it crosses the
    // = (see render/drag/sign.tsx). (−(y + 1) lands as + y + 1, flattened into
    // the other side, so there the id goes on its first term.)
    const flipped: Expr =
      t.kind === "neg"
        ? t.arg.kind === "sum"
          ? { ...t.arg, terms: [adopt(t.arg.terms[0], t.id), ...t.arg.terms.slice(1)] }
          : { ...t.arg, id: t.id }
        : neg(t);
    const mine = state.sides[r.side];
    const remaining = fromTerms(without(r.terms, r.index), mine);
    const other = state.sides[r.other];
    const target = sum([...termsOf(other), flipped], other.kind === "sum" ? other.id : undefined);
    const moved = withSides(state, r.side, remaining, target);
    // Carried on onto a like term over there, it combines with it as it arrives (its sign already flipped):
    // 3x + 5 = 2x + 1, the 2x dropped on the 3x → 3x − 2x + 5 = 1 at once, worked out as combining does.
    // (Not a term that is all of its side: carried across whole, a side swaps places instead.)
    if (r.terms.length === 1) return [{ rule: "move-term", state: moved }];
    const arrived = termsOf(moved.sides[r.other]).at(-1)!;
    const there = new Set(termsOf(other).map((o) => o.id));
    const onto = combine.apply(moved, arrived.id).flatMap((c): Candidate[] => (c.targetId && there.has(c.targetId) ? [{ rule: "move-term", state: c.state, targetId: c.targetId }] : []));
    return [{ rule: "move-term", state: moved }, ...onto];
  },
};

/**
 * 2x = 8 → x = 8/2: a factor of a side that is one term (2x, −2x, 2x/3,
 * 2(x + 1)) carried across divides the other side. `allowed`: which factors
 * (numbers, or, for formulas, letters too).
 *
 * Only a side of one term: dividing 2x + 1 = 7 by 2 would make the 2 a handle
 * of its own, and a press on it could then no longer pick up the term 2x.
 * (Factor out first: 2x + 4 = 10 → 2(x + 2) = 10.)
 */
function moveFactorRule(id: "move-factor" | "move-letter-factor", allowed: (e: Expr, state: MathState) => boolean, gesture: string): Rule {
  return {
    id,
    name: "Divide both sides",
    gesture,
    apply(state, dragged) {
      const r = onSide(state, dragged);
      if (!r || r.part !== "top-factor" || r.terms.length !== 1 || !allowed(r.node, state)) return [];
      const t = r.term;
      const remaining = rebuildTerm(t, t.top.filter((f) => f.id !== r.node.id), t.bottom);
      const other = state.sides[r.other];
      const divided = other.kind === "frac" ? frac(other.num, prod([other.den, r.node]), other.id) : frac(other, r.node);
      return [{ rule: id, state: turnedBy(state, r.node, withSides(state, r.side, remaining, divided)) } satisfies Candidate];
    },
  };
}

/**
 * x/3 = 4 → x = 4·3: a bottom carried across multiplies the other side. On a
 * side of several terms, every term there is multiplied too: the carried
 * bottom leaves its own fraction, and copies of it fly to the others, for the
 * learner to work out (x/3 + 1 = 5 → x + 1·3 = 5·3).
 */
function moveDenominatorRule(id: "move-denominator" | "move-letter-denominator", allowed: (e: Expr, state: MathState) => boolean, gesture: string): Rule {
  return {
    id,
    name: "Multiply both sides",
    gesture,
    apply(state, dragged) {
      const r = onSide(state, dragged);
      if (!r || (r.part !== "bottom" && r.part !== "bottom-factor") || !allowed(r.node, state)) return [];
      const d = r.node;
      const times = (term: Expr): Expr => {
        const u = viewTerm(term);
        return rebuildTerm(u, [...u.top.map(visibleOne), cloneFresh(d)], u.bottom);
      };
      // The whole bottom goes, or one factor of it.
      const left = r.part === "bottom" ? [] : r.term.bottom.filter((f) => f.id !== d.id);
      const terms = r.terms.map((term, k) => (k === r.index ? rebuildTerm(r.term, r.term.top, left) : times(term)));
      const other = state.sides[r.other];
      // A bottom that is itself a product (2·3) flattens into the other side's
      // product, which then carries its identity, so the drag can follow it there.
      const multiplied = d.kind === "prod" ? prod([other, ...d.factors], d.id) : prod([other, d]);
      const result = withSides(state, r.side, fromTerms(terms, state.sides[r.side]), multiplied);
      return [{ rule: id, state: turnedBy(state, d, result) }];
    },
  };
}

/**
 * Letters (and anything with letters in it) can only be carried across an
 * equation: an inequality would need to know their sign — unless the
 * exercise says letters are positive (see signs.ts).
 */
const letterFactor = (e: Expr, state: MathState) => !isConstant(e) && (relOf(state) === "=" || isPositive(e, assumeOf(state)));

/**
 * Dividing both sides by something with letters loses the answers that make
 * it 0: x(x − 3) = 0 divided by x is x − 3 = 0, and x = 0 is gone; so is it
 * from 9x² = −15x divided by x. So only by what can't be 0: what the letters
 * being positive makes positive, or what a condition says isn't 0
 * (ax = 3a where a ≠ 0, divided by a).
 */
const letterDivisor = (e: Expr, state: MathState) => {
  if (!letterFactor(e, state)) return false;
  if (isPositive(e, assumeOf(state))) return true;
  return (state.conditions ?? []).some((c) => says(c, conditionOn(e, "≠")));
};

export const moveFactor = moveFactorRule("move-factor", usefulFactor, "Drag a number multiplying a whole side across = — it divides the other side.");
export const moveDenominator = moveDenominatorRule("move-denominator", nonzeroConstant, "Drag the bottom of a fraction across = — it multiplies the other side.");
/** ax = 3a where a ≠ 0 → x = 3a/a: a letter that can't be 0 (see letterDivisor). */
export const moveLetterFactor = moveFactorRule("move-letter-factor", letterDivisor, "Drag a letter that can't be 0 (a condition says so) multiplying a whole side across = — it divides the other side.");
/** Formulas: P = F/A → PA = F. */
export const moveLetterDenominator = moveDenominatorRule("move-letter-denominator", letterFactor, "Drag a letter on the bottom of a fraction across = — it multiplies the other side.");

/** −x = 6 → x = −6 (drag the minus sign across). */
export const moveSign: Rule = {
  id: "move-sign",
  name: "Move a minus across",
  // Multiplying both sides by −1: an inequality sign turns round as the minus
  // crosses it (any move that turns the relation does; see render/drag/relation.tsx).
  gesture: "Drag just the minus in front of a whole side across = — it lands on the other side. Across < or >, the sign turns round.",
  apply(state, id) {
    // Carried by the minus sign alone (−x = 6: the x stays put).
    const owner = signOwner(id);
    const c = owner ? sideCtx(state, owner) : null;
    if (!c || c.loc.path.length !== 0 || c.node.kind !== "neg") return [];
    const other = state.sides[c.other];
    if (other.kind === "neg") {
      // −x = −6 → x = 6: the two minus signs annihilate.
      // The carried minus takes over what's left of its side, so its contents don't outlive it.
      return [{ rule: "move-sign", state: withFlippedRel(withSides(state, c.loc.side, adopt(c.node.arg, c.node.id), other.arg), state), targetId: other.id }];
    }
    if (other.kind === "num" && other.value === 0) {
      // −x = 0 → x = 0: a minus on 0 changes nothing, so the − is absorbed into the 0.
      return [{ rule: "move-sign", state: withFlippedRel(withSides(state, c.loc.side, c.node.arg, other), state), targetId: other.id }];
    }
    return [{ rule: "move-sign", state: withFlippedRel(withSides(state, c.loc.side, c.node.arg, neg(other, c.node.id)), state) }];
  },
};
