import type { Expr, Log, Pow } from "../expr/types";
import { cloneFresh, frac, log, neg, negate, num, pow, prod, sum } from "../expr/build";
import { key, rootOrder } from "../expr/key";
import { evaluate, isConstant } from "../expr/eval";
import { dragCtx, isEquation, partner, replaceIn, setSides, without, type Candidate, type DragCtx, type Rule } from "./types";
import { asPower, fractionPart, raise as raiseTo } from "./shapes";
import { roleOf, viewTerm } from "./view";
import { nodeAt } from "../expr/tree";

// ---------- helpers ----------

/** An integer as an expression (negatives as −n). */
export function integer(v: number, id?: string): Expr {
  return v < 0 ? neg(num(-v, id)) : num(v, id);
}

/** n if this exponent is 1/n (a root), else null. */

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

/** Factors of an expression (a product's factors, or the expression itself). */
const factorsOf = (e: Expr) => (e.kind === "prod" ? e.factors : [e]);

/** Remove the factor with this id (leaving 1 if it was the whole thing). */
function removeFactor(e: Expr, id: string): Expr {
  if (e.id === id) return num(1);
  return e.kind === "prod" ? prod(without(e.factors, e.factors.findIndex((f) => f.id === id)), e.id) : e;
}

function replaceFactor(e: Expr, id: string, by: Expr): Expr {
  if (e.id === id) return by;
  return e.kind === "prod" ? prod(e.factors.map((f) => (f.id === id ? by : f)), e.id) : e;
}

// ---------- powers ----------

/** (x²)³ → x⁶ (drop the outer exponent onto the inner one). */
export const powerOfPower: Rule = {
  id: "power-of-power",
  name: "Power of a power",
  gesture: "Drop an outer exponent onto the inner one — they multiply.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    if (!c || !P || P.base.kind !== "pow") return [];
    const Q = P.base;
    // Show the operation: (x²)³ → x^(2·3); the learner multiplies 2·3 themselves.
    const exp = prod([Q.exp, c.node]);
    return [{ rule: "power-of-power", state: replaceIn(state, c.parentLoc!, pow(Q.base, exp, Q.id)), targetId: Q.exp.id }];
  },
};

/** x¹ → x (drop the 1 onto its base). */
export const powerOne: Rule = {
  id: "power-one",
  name: "Power of one",
  gesture: "Drop an exponent of 1 onto its base — x¹ is just x.",
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
  name: "Power of zero",
  gesture: "Drop an exponent of 0 onto its base — anything to the power 0 is 1.",
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
    const copies = Array.from({ length: n - 1 }, () => cloneFresh(P.base));
    return [{ rule: "power-to-product", state: replaceIn(state, c.parentLoc!, prod([P.base, ...copies], P.id)) }];
  },
};

/** 2³ → 8 (drop the exponent onto a number base). */
export const evaluatePower: Rule = {
  id: "evaluate-power",
  name: "Work out a power",
  gesture: "Drop a whole-number exponent onto a number to work it out.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    // Whole-number exponents only: √9 is worked out step by step (√(3·3) → √3·√3 → …), not in one jump.
    if (!c || !P || P.base.kind !== "num" || c.node.kind !== "num") return [];
    const v = P.base.value ** c.node.value;
    if (!Number.isSafeInteger(v) || v > 100_000) return [];
    return [{ rule: "evaluate-power", state: replaceIn(state, c.parentLoc!, num(v, P.base.id)), targetId: P.base.id }];
  },
};

/** x⁵/x² → x³ (drop a power on the bottom onto one with the same base on top). */
export const dividePowers: Rule = {
  id: "divide-powers",
  name: "Same base: subtract exponents",
  gesture: "Drop a power from the bottom onto the same base on top — the exponents subtract.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const fc = c && fractionPart(state, c);
    if (!c || !fc || !fc.inDen) return [];
    const { F, fracLoc } = fc;
    const mine = asPower(c.node);
    return factorsOf(F.num).flatMap((t): Candidate[] => {
      const theirs = asPower(t);
      if (key(theirs.base) !== key(mine.base)) return [];
      // Plain numbers on both sides are just divided (6/2 → 3, 2/2 → 1), not
      // treated as powers of themselves (2/2 → 2^(1−1)).
      if (t.kind === "num" && c.node.kind === "num") return [];
      // Show the operation: x⁵/x² → x^(5−2); the learner subtracts themselves.
      const exp = sum([theirs.exp, negate(mine.exp)]);
      const merged = t.kind === "pow" ? pow(t.base, exp, t.id) : pow(t, exp);
      const top = replaceFactor(F.num, t.id, merged);
      const bottom = removeFactor(F.den, c.node.id);
      return [{ rule: "divide-powers", state: replaceIn(state, fracLoc, frac(top, bottom, F.id)), targetId: t.id }];
    });
  },
};

/** 1/x³ → x⁻³ and x⁻²/y → 1/(x²y) (carry a factor across the fraction bar; its exponent flips sign). */
export const flipAcrossBar: Rule = {
  id: "flip-across-bar",
  name: "Across the fraction bar",
  gesture: "Carry a factor across the fraction bar — its exponent changes sign.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const fc = c && fractionPart(state, c);
    if (!c || !fc) return [];
    const { F, fracLoc, inDen } = fc;
    const f = c.node;
    // Top → bottom only for negative exponents (x⁻² up top is really "x² underneath").
    if (!inDen && !(f.kind === "pow" && f.exp.kind === "neg")) return [];
    if (f.kind === "num") return []; // numbers don't flip into 2⁻¹
    // The dragged node itself crosses over (x becomes the base of x⁻¹).
    const moved: Expr = f.kind === "pow" ? { ...f, exp: negate(f.exp) } : pow(f, neg(num(1)));
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
  name: "Exponent out of a log",
  gesture: "Carry the exponent inside a log out in front of it.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    if (!c || !P) return [];
    const pc = dragCtx(state, P.id);
    const L = pc?.parent;
    if (L?.kind !== "log" || pc!.index !== 1) return [];
    return [{ rule: "log-of-power", state: replaceIn(state, pc!.parentLoc!, prod([c.node, log(L.base, P.base, L.id)])) }];
  },
};

/** 3·ln x → ln(x³) (drop the number in front onto the log). */
export const powerIntoLog: Rule = {
  id: "power-into-log",
  name: "Number into a log",
  gesture: "Drop a number multiplying a log onto it — it becomes an exponent inside.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" || !isConstant(c.node)) return [];
    const factors = c.parent.factors;
    return factors.flatMap((L, j): Candidate[] => {
      if (j === c.index || L.kind !== "log") return [];
      const merged = log(L.base, pow(L.arg, c.node), L.id);
      const newFactors = factors.map((f, k) => (k === j ? merged : f));
      return [
        {
          rule: "power-into-log",
          state: replaceIn(state, c.parentLoc!, { ...c.parent!, factors: without(newFactors, c.index) } as Expr),
          targetId: L.id,
        },
      ];
    });
  },
};

/** ln a + ln b → ln(ab), ln a − ln b → ln(a/b) (drop one log term onto another). */
export const combineLogs: Rule = {
  id: "combine-logs",
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
      const newTerms = terms.map((t, k) => (k === j ? merged : t));
      return [
        {
          rule: "combine-logs",
          state: replaceIn(state, c.parentLoc!, { ...c.parent!, terms: without(newTerms, c.index) } as Expr),
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
  gesture: "Tap a number inside a log to write it as a power of the log's base.",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "log" || c.index !== 1 || c.node.kind !== "num" || c.parent.base.kind !== "num") return [];
    const b = c.parent.base.value;
    const n = c.node.value;
    if (b < 2) return [];
    let k = 0;
    for (let v = 1; v < n; v *= b) k++;
    if (k < 2 || b ** k !== n) return [];
    return [{ rule: "power-of-base", state: replaceIn(state, c.loc, pow(num(b), num(k), c.node.id)) }];
  },
};

// ---------- across = ----------

/** eˣ = 5 → x = ln 5 (drag the base across =; it turns into a log). */
export const expAcross: Rule = {
  id: "exp-across",
  name: "Undo a power across =",
  gesture: "Drag the base of a power across = — it becomes a log on the other side.",
  apply(state, id) {
    if (!isEquation(state)) return [];
    const c = dragCtx(state, id);
    if (!c || c.loc.path.length !== 1 || c.index !== 0 || c.parent?.kind !== "pow") return [];
    if (!isConstant(c.node) || evaluate(c.node, {}) <= 0 || evaluate(c.node, {}) === 1) return [];
    const sides = state.sides.slice();
    const other = partner(c.loc.side);
    sides[c.loc.side] = c.parent.exp;
    sides[other] = log(c.node, sides[other]);
    return [{ rule: "exp-across", state: setSides(sides) }];
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
    const sides = state.sides.slice();
    const other = partner(c.loc.side);
    sides[c.loc.side] = L.arg;
    sides[other] = pow(L.base, sides[other], c.node.kind === "log" ? L.id : undefined);
    return [{ rule: "log-across", state: setSides(sides) }];
  },
};

// ---------- roots ----------

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
  gesture: "Carry a √ across = — it becomes a square on the other side. Carry the square back and it becomes ½ again.",
  apply(state, id) {
    if (!isEquation(state)) return [];
    const c = dragCtx(state, id);
    const P = c && exponentOf(c);
    if (!c || !P || c.parentLoc!.path.length !== 0) return [];
    const sides = state.sides.slice();
    const other = partner(c.loc.side);
    const n = rootOrder(c.node);
    // Only when the other side is a number ≥ 0: √x = −3 has no solution, and
    // squaring would invent one (x = 9).
    if (n && isConstant(sides[other]) && evaluate(sides[other], {}) >= 0) {
      // The carried √ itself turns into the ² (same identity).
      sides[c.loc.side] = P.base;
      sides[other] = pow(sides[other], num(n, c.node.id));
      return [{ rule: "root-across", state: setSides(sides) }];
    }
    if (c.node.kind === "num" && c.node.value >= 2 && isConstant(P.base) && evaluate(P.base, {}) > 0) {
      // …and the carried ² turns back into a ½ exponent.
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
  feel: { carry: "pull-out" },
  name: "Split a power or root",
  gesture: "Pull a factor out of a root's (or power's) brackets — it takes its own copy of the root.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" && c?.parent?.kind !== "frac") return [];
    const up = dragCtx(state, c.parent.id);
    const P = up?.parent;
    if (P?.kind !== "pow" || up!.index !== 0) return [];
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
    // A factor that is already a power multiplies exponents: (x²y)³ → x^(2·3)·y³.
    const raise = (f: Expr, e: Expr) => raiseTo(f, e);
    let spread: Expr;
    if (B.kind === "prod") spread = prod(B.factors.map((f, k) => raise(f, k === 0 ? n : cloneFresh(n))), B.id);
    else if (B.kind === "frac") spread = frac(raise(B.num, n), raise(B.den, cloneFresh(n)), B.id);
    else return [];
    return [{ rule: "power-of-product", state: replaceIn(state, c.parentLoc!, spread), targetId: B.id }];
  },
};
