import type { Expr, Log, MathState, Pow } from "../expr/types";
import { cloneFresh, frac, log, neg, negate, num, pow, prod, relOf, sum, withFlippedRel } from "../expr/build";
import { key, rootOrder } from "../expr/key";
import { evaluate, isConstant } from "../expr/eval";
import { dragCtx, isEquation, mergeInto, partner, replaceIn, setSides, without, type Candidate, type DragCtx, type Rule } from "./types";
import { asPower, dropFactor, fractionPart, raise as raiseTo } from "./shapes";
import { factorsOf, roleOf, viewTerm } from "./view";
import { assumeOf, canBeNegative, isPositive, splitsOver } from "./signs";
import { allNodes, nodeAt } from "../expr/tree";
import { intoRows } from "./either";

// ---------- helpers ----------

/** A whole-number exponent: powers like these split and merge whatever the sign of their base. */
const whole = (e: Expr) => isConstant(e) && Number.isInteger(evaluate(e, {}));

/** Nothing here can be negative (so a log of it, or a root, splits as the rules say). */
const noneNegative = (state: MathState, ...es: Expr[]) => es.every((e) => !canBeNegative(e, assumeOf(state)));

/**
 * An inequality after undoing a power or log of base b: below 1, the power
 * goes down as its exponent goes up, so the relation turns round.
 */
const acrossBase = (next: MathState, state: MathState, b: number): MathState => (relOf(state) !== "=" && b < 1 ? withFlippedRel(next, state) : next);

/** The log being dragged: the log itself, or its base (the "ln" label is the base e). */
function logAt(c: DragCtx): Log | null {
  if (c.node.kind === "log") return c.node;
  if (c.parent?.kind === "log" && c.index === 0) return c.parent;
  return null;
}

/** Where the log being dragged lives. */
function logLoc(c: DragCtx) {
  return c.node.kind === "log" ? c.loc : c.parentLoc!;
}

/** The node one level up, if it is a pow and we are its exponent. */
function exponentOf(c: DragCtx): Pow | null {
  return c.parent?.kind === "pow" && c.index === 1 ? c.parent : null;
}

/** Remove the factor with this id (leaving 1 if it was the whole thing). */
const removeFactor = (e: Expr, id: string): Expr => dropFactor(e, (f) => f.id === id) ?? e;

function replaceFactor(e: Expr, id: string, by: Expr): Expr {
  if (e.id === id) return by;
  return e.kind === "prod" ? prod(e.factors.map((f) => (f.id === id ? by : f)), e.id) : e;
}

// ---------- powers ----------

/** (x²)³ → x⁶ (drop the outer exponent onto the inner one). */
export const powerOfPower: Rule = {
  id: "power-of-power",
  either: true,
  name: "Power of a power",
  gesture: "Drop an outer exponent onto the inner one — they multiply.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    if (!c || !P || P.base.kind !== "pow") return [];
    const Q = P.base;
    // √(x²) is |x|, not x: a fractional outer power only merges onto something never negative.
    if (!whole(c.node) && !noneNegative(state, Q.base)) return [];
    // Show the operation: (x²)³ → x^(2·3); the learner multiplies 2·3 themselves.
    const exp = prod([Q.exp, c.node]);
    return [{ rule: "power-of-power", state: replaceIn(state, c.parentLoc!, pow(Q.base, exp, Q.id)), targetId: Q.exp.id }];
  },
};

/** x¹ → x (drop the 1 onto its base). */
export const powerOne: Rule = {
  id: "power-one",
  tidy: true,
  either: true,
  tapsToo: true,
  name: "Power of one",
  gesture: "Tap an exponent of 1, or drop it onto its base — x¹ is just x.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    if (!c || !P || c.node.kind !== "num" || c.node.value !== 1) return [];
    return [{ rule: "power-one", state: replaceIn(state, c.parentLoc!, P.base), targetId: P.base.id }];
  },
};

/** x⁰ → 1 (drop the 0 onto its base). */
export const zeroPower: Rule = {
  id: "zero-power",
  either: true,
  tapsToo: true,
  name: "Power of zero",
  gesture: "Tap an exponent of 0, or drop it onto its base — anything to the power 0 is 1.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    if (!c || !P || c.node.kind !== "num" || c.node.value !== 0) return [];
    const one = { ...num(1, P.base.id), explicit: true } as Expr; // 2x⁰ → 2·1, simplified by the learner
    return [{ rule: "zero-power", state: replaceIn(state, c.parentLoc!, one), targetId: P.base.id }];
  },
};

/**
 * x² → x·x, (x + 2)² → (x + 2)(x + 2) (tap a small whole-number exponent).
 * A power is just repeated multiplication; written out, its pieces can be
 * distributed, shared and factored like any others. The copies fly out of
 * the base.
 */
export const powerToProduct: Rule = {
  id: "power-to-product",
  name: "Write a power out",
  gesture: "Tap a small exponent to write the power out as a product: x² → x·x.",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    // Numbers have their own move (2³ → 8); roots are fractions of a power.
    if (!c || !P || P.radical || P.base.kind === "num" || c.node.kind !== "num") return [];
    const n = c.node.value;
    if (!Number.isInteger(n) || n < 2 || n > 4) return [];
    // The base n times: the first is the base itself, the others copies of it (expr/copies.ts).
    return [{ rule: "power-to-product", state: replaceIn(state, c.parentLoc!, prod(Array.from({ length: n }, () => P.base), P.id)) }];
  },
};

/** 2³ → 8 (drop the exponent onto a number base). */
export const evaluatePower: Rule = {
  id: "evaluate-power",
  either: true,
  name: "Work out a power",
  gesture: "Drop a whole-number exponent onto a number to work it out.",
  apply: (state, id) => workOutPower(state, id, "evaluate-power"),
};

/** 2³ → 8 by tapping the exponent: the same as dropping it on the base. */
export const tapPower: Rule = {
  id: "tap-power",
  name: "Work out a power",
  gesture: "Tap a whole-number exponent on a number to work it out: 2³ → 8.",
  tap: true,
  apply: (state, id) => workOutPower(state, id, "tap-power"),
};

/** 2³ → 8, the exponent `id` dropped on its base or tapped. */
function workOutPower(state: MathState, id: string, rule: "evaluate-power" | "tap-power"): Candidate[] {
  const c = dragCtx(state, id);
  const P = c && exponentOf(c);
  // Whole-number exponents only: √9 is worked out step by step (√(3·3) → √3·√3 → …), not in one jump.
  // A whole negative exponent works out to one over the power: 2⁻⁶ → 1/64.
  const negative = c?.node.kind === "neg" && c.node.arg.kind === "num";
  const n = c?.node.kind === "num" ? c.node.value : negative ? (c!.node as { arg: { value: number } }).arg.value : NaN;
  if (!c || !P || P.base.kind !== "num" || !Number.isInteger(n) || n < 0) return [];
  const v = P.base.value ** n;
  if (!Number.isSafeInteger(v) || v > 100_000) return [];
  const state2 = replaceIn(state, c.parentLoc!, negative ? frac(num(1), num(v, P.base.id)) : num(v, P.base.id));
  return [rule === "evaluate-power" ? { rule, state: state2, targetId: P.base.id } : { rule, state: state2 }];
}

/**
 * √2·√3 → √(2·3), x³·y³ → (x·y)³ (drop a power onto another with the same
 * exponent: the bases share it; the way back of splitting a power). For roots
 * and other exponents that aren't whole, only as splitsOver allows.
 */
export const joinPowers: Rule = {
  id: "join-powers",
  undoneBy: ["pull-out-of-power"],
  name: "Same exponent: join the bases",
  gesture: "Drop a power onto another with the same exponent — the bases go under one: √2·√3 = √(2·3).",
  apply(state, id) {
    const c = dragCtx(state, id);
    const me = c?.node;
    if (c?.parent?.kind !== "prod" || me?.kind !== "pow") return [];
    const factors = c.parent.factors;
    return factors.flatMap((f, j): Candidate[] => {
      if (j === c.index || f.kind !== "pow" || !!f.radical !== !!me.radical || key(f.exp) !== key(me.exp) || key(f.base) === key(me.base)) return [];
      if (!whole(me.exp) && !splitsOver([me.base, f.base], assumeOf(state))) return [];
      // Left to right as they stood; the joined power takes the target's place and identity.
      const bases = j < c.index ? [f.base, me.base] : [me.base, f.base];
      const joined: Expr = { ...pow(prod(bases), f.exp, f.id), ...(f.radical ? { radical: true } : {}) } as Expr;
      return [{ rule: "join-powers", state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, joined), targetId: f.id }];
    });
  },
};

/** x⁵/x² → x³ (drop a power on the bottom onto one with the same base on top). */
export const dividePowers: Rule = {
  id: "divide-powers",
  name: "Same base: subtract exponents",
  gesture: "Tap the fraction bar: powers of the same base on top and bottom merge, their exponents subtracted.",
  tap: true,
  tapOrder: 0.3,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.node.kind !== "frac") return [];
    const F = c.node;
    let top = F.num;
    let bottom: Expr | null = F.den;
    let any = false;
    for (const d of factorsOf(F.den)) {
      const mine = asPower(d);
      const t = factorsOf(top).find((t) => {
        const theirs = asPower(t);
        // Same base; at least one a power (y/y and 6/2 cancel or divide instead), and not the very same power (it cancels).
        return key(theirs.base) === key(mine.base) && (t.kind === "pow" || d.kind === "pow") && key(t) !== key(d);
      });
      if (!t || !bottom) continue;
      // Show the operation: x⁵/x² → x^(5−2); the learner subtracts themselves.
      const theirs = asPower(t);
      const exp = sum([theirs.exp, negate(mine.exp)]);
      const merged = t.kind === "pow" ? pow(t.base, exp, t.id) : pow(t, exp);
      top = replaceFactor(top, t.id, merged);
      bottom = factorsOf(bottom).length === 1 ? null : removeFactor(bottom, d.id);
      any = true;
    }
    if (!any) return [];
    return [{ rule: "divide-powers", state: replaceIn(state, c.loc, bottom ? frac(top, bottom, F.id) : top) }];
  },
};

/** 1/x³ → x⁻³ and x⁻²/y → 1/(x²y) (carry a factor across the fraction bar; its exponent flips sign). */
export const flipAcrossBar: Rule = {
  id: "flip-across-bar",
  name: "Across the fraction bar",
  gesture: "Carry a factor across the fraction bar — its exponent changes sign.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (!c) return [];
    const fc = fractionPart(state, c);
    const f = c.node;
    // No bar yet: a power with a negative exponent goes under one of its own (2⁻⁶ → 1/2⁶, 3x⁻² → 3/x²).
    if (!fc) {
      if (f.kind !== "pow" || f.exp.kind !== "neg" || f.radical) return [];
      const under = pow(f.base, negate(f.exp), f.id);
      if (c.parent?.kind === "prod") {
        const rest = c.parent.factors.filter((g) => g.id !== f.id);
        return [{ rule: "flip-across-bar", state: replaceIn(state, c.parentLoc!, frac(rest.length === 1 ? rest[0] : prod(rest, c.parent.id), under)), carry: "below" }];
      }
      // (Pulled down under the bar it makes: where it lands is too close to where it is to aim at.)
      return [{ rule: "flip-across-bar", state: replaceIn(state, c.loc, frac(num(1), under)), carry: "below" }];
    }
    const { F, fracLoc, inDen } = fc;
    // Top → bottom only for negative exponents (x⁻² up top is really "x² underneath").
    if (!inDen && !(f.kind === "pow" && f.exp.kind === "neg")) return [];
    if (f.kind === "num") return []; // numbers don't flip into 2⁻¹
    if (f.kind === "frac") return []; // a fraction underneath is divided by (divide-by-fraction), not flipped into (2/6)⁻¹
    // The dragged node itself crosses over (x becomes the base of x⁻¹).
    // Written as a power from now on (1/√x → x^(−1/2)): the √ sign can't show a negative exponent.
    const moved: Expr = f.kind === "pow" ? pow(f.base, negate(f.exp), f.id) : pow(f, neg(num(1)));
    const result = inDen
      ? frac(prod([F.num, moved]), removeFactor(F.den, f.id), F.id)
      : frac(removeFactor(F.num, f.id), prod([F.den, moved]), F.id);
    return [{ rule: "flip-across-bar", state: replaceIn(state, fracLoc, result) }];
  },
};

// ---------- logs & exponentials ----------

/** e^(ln x) → x (drop the e onto the ln). */
export const expOfLog: Rule = {
  id: "exp-of-log",
  either: true,
  name: "e^ undoes ln",
  gesture: "Drop a base onto a log of the same base in its exponent — they cancel.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "pow" || c.index !== 0) return [];
    const L = c.parent.exp;
    if (L.kind !== "log" || key(L.base) !== key(c.node)) return [];
    return [{ rule: "exp-of-log", state: replaceIn(state, c.parentLoc!, L.arg), targetId: L.id }];
  },
};

/** ln(ab) → ln a + ln b, ln(a/b) → ln a − ln b (drop the ln onto its brackets). */
export const logOfProduct: Rule = {
  id: "log-of-product",
  undoneBy: ["combine-logs"],
  feel: { carry: "pull-out", wears: "grow-log" },
  name: "Split a log",
  gesture: "Pull a factor out of a log's brackets — it takes a copy of the log with it.",
  apply(state, id) {
    // ln(2x) → ln 2 + ln x: carry the 2 (or the x) out of the brackets. The
    // carried factor gets a copy of the ln (flying out of the original), the
    // rest keeps the original. Order stays left to right.
    const c = dragCtx(state, id);
    if (!c?.parent) return [];
    const copy = (L: Log, arg: Expr): Expr => ({ ...log(cloneFresh(L.base), arg), from: L.id });
    if (c.parent.kind === "prod") {
      const up = dragCtx(state, c.parent.id);
      const L = up?.parent;
      if (L?.kind !== "log" || up!.index !== 1) return [];
      const fs = c.parent.factors;
      const rest = prod(without(fs, c.index), c.parent.id);
      // ln(ab) = ln a + ln b only when a and b are positive (see splitsOver).
      if (!splitsOver(fs, assumeOf(state))) return [];
      const mineLog = copy(L, c.node);
      const theirs = log(L.base, rest, L.id);
      const split = sum(c.index === 0 ? [mineLog, theirs] : [theirs, mineLog]);
      return [{ rule: "log-of-product", state: replaceIn(state, up!.parentLoc!, split) }];
    }
    if (c.parent.kind === "frac") {
      const up = dragCtx(state, c.parent.id);
      const L = up?.parent;
      if (L?.kind !== "log" || up!.index !== 1) return [];
      const F = c.parent;
      if (!splitsOver([F.num, F.den], assumeOf(state))) return [];
      const split =
        c.index === 0
          ? sum([copy(L, F.num), neg(log(L.base, F.den, L.id))])
          : sum([log(L.base, F.num, L.id), neg(copy(L, F.den))]);
      return [{ rule: "log-of-product", state: replaceIn(state, up!.parentLoc!, split) }];
    }
    return [];
  },
};

/** ln(x³) → 3·ln x (carry the exponent out in front of the log). */
export const logOfPower: Rule = {
  id: "log-of-power",
  undoneBy: ["power-into-log"],
  name: "Exponent out of a log",
  gesture: "Carry the exponent inside a log out in front of it.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    if (!c || !P) return [];
    const pc = dragCtx(state, P.id);
    const L = pc?.parent;
    if (L?.kind !== "log" || pc!.index !== 1) return [];
    // ln(x²) = 2·ln x only for positive x: ln(x²) is also there for negative x (an odd power, or a root, isn't).
    const even = whole(c.node) && evaluate(c.node, {}) % 2 === 0;
    if (even && !noneNegative(state, P.base)) return [];
    return [{ rule: "log-of-power", state: replaceIn(state, pc!.parentLoc!, prod([c.node, log(L.base, P.base, L.id)])) }];
  },
};

/** 3·ln x → ln(x³) (drop the number in front onto the log). */
export const powerIntoLog: Rule = {
  id: "power-into-log",
  undoneBy: ["log-of-power"],
  either: true,
  name: "Number into a log",
  gesture: "Drop a number multiplying a log onto it — it becomes an exponent inside.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" || !isConstant(c.node)) return [];
    const factors = c.parent.factors;
    return factors.flatMap((L, j): Candidate[] => {
      if (j === c.index || L.kind !== "log") return [];
      const merged = log(L.base, pow(L.arg, c.node), L.id);
      return [
        {
          rule: "power-into-log",
          state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, merged),
          targetId: L.id,
        },
      ];
    });
  },
};

/** ln a + ln b → ln(ab), ln a − ln b → ln(a/b) (drop one log term onto another). */
export const combineLogs: Rule = {
  id: "combine-logs",
  undoneBy: ["log-of-product"],
  operatorTap: "sum",
  feel: { wears: "shed-log" },
  name: "Combine logs",
  gesture: "Drop a log onto another log with the same base — adding logs multiplies inside, subtracting divides.",
  apply(state, id) {
    // Works whichever one is carried: ln 12 − ln 3 → ln(12/3) either way. The
    // + log's inside goes on top; the result takes the target's place.
    const r = roleOf(state, id);
    if (r?.part !== "term" || r.terms.length < 2) return [];
    const c = { index: r.index, parent: nodeAt(state, r.holderLoc), parentLoc: r.holderLoc };
    const T = r.node;
    const mine = r.term.body;
    if (mine.kind !== "log") return [];
    const terms = r.terms;
    return terms.flatMap((U, j): Candidate[] => {
      const theirs = viewTerm(U).body;
      if (j === c.index || theirs.kind !== "log" || key(theirs.base) !== key(mine.base)) return [];
      if (key(theirs.arg) === key(mine.arg)) return []; // that's combining like terms (2 ln x)
      const myNeg = T.kind === "neg";
      const theirNeg = U.kind === "neg";
      const [left, right] = j < c.index ? [theirs.arg, mine.arg] : [mine.arg, theirs.arg];
      let merged: Expr;
      if (myNeg === theirNeg) {
        const l = log(theirs.base, prod([left, right]), theirs.id);
        merged = theirNeg ? neg(l, U.id) : l;
      } else {
        const top = myNeg ? theirs.arg : mine.arg;
        const bottom = myNeg ? mine.arg : theirs.arg;
        merged = log(theirs.base, frac(top, bottom), theirs.id);
      }
      return [
        {
          rule: "combine-logs",
          state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, merged),
          targetId: U.id,
        },
      ];
    });
  },
};

/** log₂8 → 3, ln e → 1, ln 1 → 0 (drop the log onto what's inside it). */
export const evaluateLog: Rule = {
  id: "evaluate-log",
  name: "Log of its own base",
  gesture: "Tap log₂(2) to make it 1 (or ln(1) to make it 0).",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    const L = c && logAt(c);
    if (!c || !L) return [];
    const v = key(L.arg) === key(L.base) ? 1 : L.arg.kind === "num" && L.arg.value === 1 ? 0 : null;
    if (v === null) return [];
    // A 1 stays visible (3·log₂2 → 3·1) for the learner to simplify themselves.
    const result: Expr = v === 1 ? { ...num(1, L.id), explicit: true } as Expr : num(v, L.id);
    return [{ rule: "evaluate-log", state: replaceIn(state, logLoc(c), result) }];
  },
};

/** log₂(8): tap the 8 to write it as 2³ (a power of the log's base). */
export const powerOfBase: Rule = {
  id: "power-of-base",
  name: "Write as a power of the base",
  gesture: "Tap a number to write it as a power of the base it's used with: inside log₂, or across from 2ˣ (16 → 2⁴).",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.node.kind !== "num") return [];
    // The base it goes with: its log's, or else one a power on the board is raised from (2^(x − 3) = 16).
    const inLog = c.parent?.kind === "log" && c.index === 1 ? c.parent.base : null;
    const bases = inLog
      ? [inLog]
      : state.sides.flatMap(allNodes).flatMap((e) => (e.kind === "pow" && !e.radical && e.base.kind === "num" && !isConstant(e.exp) ? [e.base] : []));
    const n = c.node.value;
    for (const B of bases) {
      if (B.kind !== "num" || B.value < 2) continue;
      const b = B.value;
      let k = 0;
      for (let v = 1; v < n; v *= b) k++;
      if (k >= 2 && b ** k === n) return [{ rule: "power-of-base", state: replaceIn(state, c.loc, pow(num(b), num(k), c.node.id)) }];
    }
    return [];
  },
};

/**
 * 2^(x − 3) → 2^x·2^(−3) (pull a term out of an exponent: the power splits into
 * two powers of the same base; the way back of "same base: add exponents").
 * Only for a base that is positive, where it always holds.
 */
export const splitExponent: Rule = {
  id: "split-exponent",
  undoneBy: ["merge-powers"],
  feel: { carry: "pull-out" },
  name: "Same base: split the exponent",
  gesture: "Pull a term out of an exponent — the power splits into two powers of the same base.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "sum") return [];
    const E = dragCtx(state, c.parent.id);
    const P = E?.parent;
    if (P?.kind !== "pow" || E!.index !== 1 || P.radical || !isPositive(P.base, assumeOf(state))) return [];
    const rest = without(c.parent.terms, c.index);
    const kept = pow(P.base, rest.length === 1 ? rest[0] : sum(rest, c.parent.id), P.id);
    // The carried term takes a copy of the base out with it.
    const mine: Expr = { ...pow(cloneFresh(P.base), c.node), from: P.id };
    return [{ rule: "split-exponent", state: replaceIn(state, E!.parentLoc!, prod(c.index === 0 ? [mine, kept] : [kept, mine])) }];
  },
};

// ---------- across = ----------

/**
 * 2^(x − 3) = 2⁴ → 2^x = 2^(4 + 3): both sides powers of the same base, a term
 * of one exponent carried to the other flips sign (both sides were multiplied
 * by 2³). For a positive base other than 1; across < or >, a base above 1
 * keeps the relation's direction (and only such a base is allowed there).
 */
export const moveExponentTerm: Rule = {
  id: "move-exponent-term",
  name: "Move a term between exponents",
  feel: { wears: "flip-sign" },
  gesture: "When both sides are powers of the same base, drag a term of one exponent to the other — it flips sign.",
  apply(state, id) {
    if (!isEquation(state)) return [];
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "sum") return [];
    const E = dragCtx(state, c.parent.id);
    const P = E?.parent;
    if (P?.kind !== "pow" || E!.index !== 1 || E!.parentLoc!.path.length !== 0 || P.radical) return [];
    const otherSide = partner(c.loc.side);
    const O = state.sides[otherSide];
    if (O.kind !== "pow" || O.radical || key(O.base) !== key(P.base) || !isPositive(P.base, assumeOf(state))) return [];
    const b = isConstant(P.base) ? evaluate(P.base, {}) : NaN;
    if (b === 1 || (relOf(state) !== "=" && !(b > 1))) return [];
    const t = c.node;
    // As a term across =: −3 lands as + 3 (the 3 takes the −3's id), 3 lands as − 3 (inside a new −).
    const flipped: Expr = t.kind === "neg" ? { ...t.arg, id: t.id } : neg(t);
    const rest = without(c.parent.terms, c.index);
    const mine = pow(P.base, rest.length === 1 ? rest[0] : sum(rest, c.parent.id), P.id);
    const theirs = pow(O.base, sum([...(O.exp.kind === "sum" ? O.exp.terms : [O.exp]), flipped], O.exp.kind === "sum" ? O.exp.id : undefined), O.id);
    const sides = state.sides.slice();
    sides[c.loc.side] = mine;
    sides[otherSide] = theirs;
    return [{ rule: "move-exponent-term", state: setSides(sides) }];
  },
};

/** eˣ = 5 → x = ln 5 (drag the base across =; it turns into a log). */
export const expAcross: Rule = {
  id: "exp-across",
  name: "Undo a power across =",
  gesture: "Drag the base of a power across = — it becomes a log on the other side.",
  apply(state, id) {
    if (!isEquation(state)) return [];
    const c = dragCtx(state, id);
    if (!c || c.loc.path.length !== 1 || c.index !== 0 || c.parent?.kind !== "pow") return [];
    const b = isConstant(c.node) ? evaluate(c.node, {}) : NaN;
    if (!(b > 0) || b === 1) return [];
    const sides = state.sides.slice();
    const other = partner(c.loc.side);
    // A log of something that may be negative isn't there (2ˣ = −8 has no solution).
    if (!noneNegative(state, sides[other])) return [];
    sides[c.loc.side] = c.parent.exp;
    sides[other] = log(c.node, sides[other]);
    return [{ rule: "exp-across", state: acrossBase(setSides(sides), state, b) }];
  },
};

/**
 * ln x = 2 → x = e² (carry the ln across =; it lands as the e of e²).
 * The ln label *is* the base e, so the carried symbol visibly turns into e.
 */
export const logAcross: Rule = {
  id: "log-across",
  name: "Undo a log across =",
  gesture: "Carry the ln (or log₂) across = — it becomes e^ (or 2^) on the other side.",
  apply(state, id) {
    if (!isEquation(state)) return [];
    const c = dragCtx(state, id);
    const L = c && logAt(c);
    if (!c || !L || logLoc(c).path.length !== 0) return [];
    const b = isConstant(L.base) ? evaluate(L.base, {}) : NaN;
    if (!(b > 0) || b === 1) return [];
    const sides = state.sides.slice();
    const other = partner(c.loc.side);
    sides[c.loc.side] = L.arg;
    sides[other] = pow(L.base, sides[other], c.node.kind === "log" ? L.id : undefined);
    return [{ rule: "log-across", state: acrossBase(setSides(sides), state, b) }];
  },
};

// ---------- roots ----------

/**
 * √9 → 3, ∛8 → 2 (tap the root): a root of a number that comes out whole is
 * worked out, as tapping 2·3 multiplies it out. One that doesn't (√12) is left
 * for splitting: tapping it shows it as a power instead.
 */
export const evaluateRoot: Rule = {
  id: "evaluate-root",
  // Before root ↔ power, which a tap on any root would otherwise do.
  tapOrder: -1,
  name: "Work out a root",
  gesture: "Tap a root of a number, like √9, to work it out (when it comes out whole).",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.node.kind !== "pow" || !c.node.radical || !isConstant(c.node.base)) return [];
    const n = rootOrder(c.node.exp);
    const v = evaluate(c.node.base, {});
    if (!n || !Number.isInteger(v) || v < 0) return [];
    const r = Math.round(v ** (1 / n));
    if (r ** n !== v) return [];
    return [{ rule: "evaluate-root", state: replaceIn(state, c.loc, num(r, c.node.id)) }];
  },
};

/** √x ↔ x^(1/2) (tap to switch notation). */
export const rootNotation: Rule = {
  id: "root-notation",
  name: "Root ↔ power",
  gesture: "Tap a root to write it as a power with a fraction exponent — and back.",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (!c) return [];
    const P = c.node.kind === "pow" ? c.node : exponentOf(c);
    const loc = c.node.kind === "pow" ? c.loc : c.parentLoc;
    if (!P || !loc || rootOrder(P.exp) === null) return [];
    // A √ sign isn't a handle of its own for this: tapping it falls through to
    // the root, and pressing it picks up the whole root (√3 carried onto √3),
    // unless the sign has a move of its own (carried across =).
    if (P.radical && c.node.kind !== "pow") return [];
    return [{ rule: "root-notation", state: replaceIn(state, loc, { ...P, radical: !P.radical }) }];
  },
};

/** √12 → √(4·3) (tap a number under a root to split off a perfect square). */
export const splitSquare: Rule = {
  id: "split-square",
  name: "Split under a root",
  gesture: "Tap a number under a root: a perfect square splits into equal factors (9 → 3·3), others split off a square (12 → 4·3).",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.node.kind !== "num") return [];
    const holder = c.parent?.kind === "prod" ? dragCtx(state, c.parent.id) : c;
    const P = holder && holder.parent?.kind === "pow" && holder.index === 0 ? holder.parent : null;
    const n = P && rootOrder(P.exp);
    if (!P || !n) return [];
    const N = c.node.value;
    // A perfect power splits into its equal factors: 9 → 3·3 (∛8 → 2·2·2).
    const r = Math.round(N ** (1 / n));
    if (r >= 2 && r ** n === N) {
      return [{ rule: "split-square", state: replaceIn(state, c.loc, prod(Array.from({ length: n }, () => num(r)), c.node.id)) }];
    }
    // Otherwise split off the biggest perfect power: 12 → 4·3.
    let best = 1;
    for (let k = 2; k ** n <= N; k++) if (N % k ** n === 0) best = k ** n;
    if (best === 1) return [];
    return [{ rule: "split-square", state: replaceIn(state, c.loc, prod([num(best), num(N / best)], c.node.id)) }];
  },
};

/**
 * √x = 3 → x = 3² (carry the √ across =; it lands as a square), and back:
 * x = 3² → x^(1/2) = 3 (carry the 2 across; it lands as a ½ exponent).
 * Backwards only when the squared thing is a positive number, so no solution
 * is lost (x² = 9 → x = 9^(1/2) would drop x = −3).
 */
export const rootAcross: Rule = {
  id: "root-across",
  name: "Undo a root (or square) across =",
  gesture: "Drop a √ onto the other side of = — that side is squared. Carry the square back and it becomes ½ again.",
  apply(state, id) {
    if (!isEquation(state)) return [];
    const c = dragCtx(state, id);
    // A whole root, alone on its side, carried across: as its ½ would be (√(x + 7) = x + 1 → x + 7 = (x + 1)²).
    if (c && c.node.kind === "pow" && c.node.radical && c.loc.path.length === 0) {
      const n = rootOrder(c.node.exp);
      const sides = state.sides.slice();
      const other = partner(c.loc.side);
      if (!n || (canBeNegative(sides[other], assumeOf(state)) && !state.conditions?.length)) return [];
      sides[c.loc.side] = c.node.base;
      // The carried √ turns into the ² (it lands where the square is written, over the other side).
      sides[other] = pow(sides[other], num(n, c.node.id));
      return [{ rule: "root-across", state: setSides(sides), carry: "onto-side" }];
    }
    const P = c && exponentOf(c);
    if (!c || !P || c.parentLoc!.path.length !== 0) return [];
    const sides = state.sides.slice();
    const other = partner(c.loc.side);
    const n = rootOrder(c.node);
    // Only when the other side can't be negative: √x = −3 has no solution,
    // and squaring would invent one (x = 9). Or where the exercise gives its
    // conditions from the start (x ≥ −1 for √(x + 7) = x + 1): a row squaring
    // invents breaks one, and is crossed out (expr/conditions.ts).
    if (n && (!canBeNegative(sides[other], assumeOf(state)) || !!state.conditions?.length)) {
      // The carried √ itself turns into the ² (same identity).
      sides[c.loc.side] = P.base;
      sides[other] = pow(sides[other], num(n, c.node.id));
      return [{ rule: "root-across", state: setSides(sides) }];
    }
    // x² = 9 when x could be negative: x = 3 or x = −3 (an even power has two roots); x³ = −8: x = ∛(−8), one.
    if (c.node.kind === "num" && c.node.value >= 2 && canBeNegative(P.base, assumeOf(state)) && (state.rel ?? "=") === "=" && state.join !== "and") {
      const n = c.node.value;
      const k = sides[other];
      if (n % 2 === 1) {
        sides[c.loc.side] = P.base;
        sides[other] = pow(k, frac(num(1), num(n), c.node.id));
        return [{ rule: "root-across", state: setSides(sides) }];
      }
      // Even: what's on the other side mustn't be negative (x² = −4 has no answer).
      if (canBeNegative(k, assumeOf(state))) return [];
      const base = (e: Expr): [Expr, Expr] => (c.loc.side % 2 === 0 ? [cloneFresh(P.base), e] : [e, cloneFresh(P.base)]);
      const row = c.loc.side >> 1;
      if (k.kind === "num" && k.value === 0) return [{ rule: "root-across", state: intoRows(state, row, [base(num(0))]) }];
      // The carried 2 becomes the first row's ½ (where the drag aims it).
      const r = (id?: string) => pow(cloneFresh(k), frac(num(1), num(n), id));
      return [{ rule: "root-across", state: intoRows(state, row, [base(r(c.node.id)), base(neg(r()))]) }];
    }
    if (c.node.kind === "num" && c.node.value >= 2 && !canBeNegative(P.base, assumeOf(state))) {
      // …and the carried ² turns back into a ½ exponent: (2ˣ)² = 16 → 2ˣ = 16^(1/2),
      // (2√x)² = 12 → 2√x = 12^(1/2). Only when what's squared can't be
      // negative, or a solution would be lost (x² = 9: x = 3, but x = −3 too),
      // unless the exercise says letters are positive.
      sides[c.loc.side] = P.base;
      sides[other] = pow(sides[other], frac(num(1), num(c.node.value), c.node.id));
      return [{ rule: "root-across", state: setSides(sides) }];
    }
    return [];
  },
};

/**
 * √(4x) → √4·√x, (2x)³ → 2³·x³ (pull a factor out of the brackets; it takes
 * its own copy of the root/exponent, flying out of the original).
 */
export const pullOutOfPower: Rule = {
  id: "pull-out-of-power",
  undoneBy: ["join-powers"],
  feel: { carry: "pull-out" },
  name: "Split a power or root",
  gesture: "Pull a factor out of a root's (or power's) brackets — it takes its own copy of the root.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" && c?.parent?.kind !== "frac") return [];
    const up = dragCtx(state, c.parent.id);
    const P = up?.parent;
    if (P?.kind !== "pow" || up!.index !== 0) return [];
    // √(ab) = √a·√b only when a and b aren't negative; a whole power splits anyway.
    if (!whole(P.exp) && !splitsOver(c.parent.kind === "frac" ? [c.parent.num, c.parent.den] : c.parent.factors, assumeOf(state))) return [];
    const copy = { ...cloneFresh(P.exp), from: P.exp.id };
    // A factor that is already a power multiplies exponents: (x²y)³ → x^(2·3)·y³.
    const raise = (f: Expr, e: Expr) => raiseTo(f, e, P.radical);
    if (c.parent.kind === "frac") {
      // (x/y)² → x²/y²: pulling the top (or bottom) out splits the power over the fraction.
      const F = c.parent;
      const [eTop, eBottom] = c.index === 0 ? [copy, P.exp] : [P.exp, copy];
      return [{ rule: "pull-out-of-power", state: replaceIn(state, up!.parentLoc!, frac(raise(F.num, eTop), raise(F.den, eBottom), F.id)) }];
    }
    const mine = raise(c.node, copy);
    const restFactors = without(c.parent.factors, c.index);
    const restBase = restFactors.length === 1 ? restFactors[0] : prod(restFactors, c.parent.id);
    const rest = restBase.kind === "pow" ? raise(restBase, P.exp) : ({ ...P, base: restBase } as Expr);
    const split = prod(c.index === 0 ? [mine, rest] : [rest, mine]);
    return [{ rule: "pull-out-of-power", state: replaceIn(state, up!.parentLoc!, split) }];
  },
};

/**
 * (3·3)^(1/2) → 3^(1/2)·3^(1/2), (2x)³ → 2³·x³ (drag the exponent into the
 * brackets; every factor gets its own copy). Only when it's written as a
 * power: a √ is split by pulling a factor out instead (pull-out-of-power).
 */
export const powerOfProduct: Rule = {
  id: "power-of-product",
  name: "Exponent into the brackets",
  gesture: "Drag an exponent into its brackets — every factor inside gets its own copy.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    if (!c || !P || P.radical) return [];
    const B = P.base;
    const n = c.node;
    // (ab)^(1/2) = a^(1/2)·b^(1/2) only as splitsOver says; a whole power spreads anyway.
    if (!whole(n) && !splitsOver(B.kind === "prod" ? B.factors : B.kind === "frac" ? [B.num, B.den] : [B], assumeOf(state))) return [];
    // A factor that is already a power multiplies exponents: (x²y)³ → x^(2·3)·y³.
    let spread: Expr;
    if (B.kind === "prod") spread = prod(B.factors.map((f) => raiseTo(f, n)), B.id);
    else if (B.kind === "frac") spread = frac(raiseTo(B.num, n), raiseTo(B.den, n), B.id);
    else return [];
    return [{ rule: "power-of-product", state: replaceIn(state, c.parentLoc!, spread), targetId: B.id }];
  },
};
