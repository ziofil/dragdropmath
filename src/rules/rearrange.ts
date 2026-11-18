import type { Expr } from "../expr/types";
import { cloneFresh, neg, num, pow, prod, sum } from "../expr/build";
import { key } from "../expr/key";
import { allNodes, nodeAt, withChildren } from "../expr/tree";
import { roleOf, viewTerm } from "./view";
import { buildTerm, restKey, splitCoef } from "./monomial";
import { asPower } from "./shapes";
import { adopt, dragCtx, mergeInto, moveItem, replaceIn, siblings, without, type Candidate, type Rule } from "./types";

/** a + b → b + a, a·b → b·a (drag a term or factor to a new slot). */
export const commute: Rule = {
  id: "commute",
  undoneBy: ["commute"],
  feel: { carry: "reorder" },
  name: "Swap",
  gesture: "Drag a term or factor past its neighbours — order doesn't matter for + and ×.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (!c?.parent || (c.parent.kind !== "sum" && c.parent.kind !== "prod")) return [];
    const items = siblings(c);
    // In a product, numbers stay in front: tidying would put y·2 straight back
    // to 2y, so such a "move" would only get in the way (of distributing the 2
    // of 2y(y + 3), say).
    const numbersFirst = (fs: readonly Expr[]) => !fs.some((f, i) => f.kind === "num" && fs.slice(0, i).some((g) => g.kind !== "num"));
    const keepsOrder = (fs: readonly Expr[]) => c.parent!.kind !== "prod" || !numbersFirst(items) || numbersFirst(fs);
    return items.flatMap((_, j): Candidate[] => {
      if (j === c.index) return [];
      const moved = moveItem(items, c.index, j);
      return keepsOrder(moved) ? [{ rule: "commute", state: replaceIn(state, c.parentLoc!, withChildren(c.parent!, moved)) }] : [];
    });
  },
};

/** 3x + 2x → 5x, 4 + 3 → 7, x − x → 0 (drop a term onto a like term). */
/** A term's number in front (a whole number or a fraction of two, with its sign), and the rest; null if it has none of those, or more than one. */
function coefficient(t: Expr): { c: Expr; rest: Expr[]; fraction: boolean } | null {
  const negative = t.kind === "neg";
  const body = t.kind === "neg" ? t.arg : t;
  const fs = body.kind === "prod" ? body.factors : [body];
  const isNumber = (f: Expr) => f.kind === "num" || (f.kind === "frac" && f.num.kind === "num" && f.den.kind === "num");
  const numbers = fs.filter(isNumber);
  if (numbers.length > 1) return null;
  const rest = fs.filter((f) => !isNumber(f));
  if (!rest.length) return null;
  const c = numbers.length ? cloneFresh(numbers[0]) : num(1);
  return { c: negative ? neg(c) : c, rest, fraction: numbers[0]?.kind === "frac" };
}

/**
 * Like terms where one has a fraction for its number in front: ¾x + ½x →
 * (¾ + ½)x, x − ⅓x → (1 − ⅓)x. Null where neither has one (whole numbers are
 * added straight away).
 */
function fractionLike(mine: Expr, terms: readonly Expr[], index: number): { j: number; merged: Expr }[] | null {
  const a = coefficient(mine);
  if (!a) return null;
  const out = terms.flatMap((t, j) => {
    if (j === index) return [];
    const b = coefficient(t);
    if (!b || !(a.fraction || b.fraction) || key(prod(a.rest), false) !== key(prod(b.rest), false)) return [];
    return [{ j, merged: prod([sum([a.c, b.c]), ...b.rest]) }];
  });
  return a.fraction || out.length ? out : null;
}

export const combine: Rule = {
  id: "combine",
  operatorTap: "sum",
  name: "Combine like terms",
  gesture: "Drop a term onto a term of the same kind to add them up.",
  apply(state, id) {
    // Whole terms only: a quick press picks up a term, and its pieces (held) have moves of their own.
    const r = roleOf(state, id);
    if (!r || r.terms.length < 2 || r.part !== "term") return [];
    const S = nodeAt(state, r.holderLoc) as Extract<Expr, { kind: "sum" }>;
    const c = { node: r.term.term, index: r.index, parent: S, parentLoc: r.holderLoc };
    const terms = c.parent.terms;
    // A fraction for a number in front: ¾x + ½x → (¾ + ½)x, the fractions then added in the bracket.
    const byFraction = fractionLike(c.node, terms, c.index);
    if (byFraction) return byFraction.map(({ j, merged }) => ({ rule: "combine", state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, merged), targetId: terms[j].id }));
    if (r.term.frac) return [];
    const mine = splitCoef(c.node);
    const isFraction = (m: { rest: Expr[] }) => m.rest.length === 1 && m.rest[0].kind === "frac";
    if (isFraction(mine)) return []; // fractions are added with add-fractions
    // 2·3 + 4: the 2·3 is worked out first (multiply-numbers), not hidden inside the sum.
    const oneNumber = (t: Expr) => viewTerm(t).top.filter((f) => f.kind === "num").length <= 1;
    if (!oneNumber(c.node)) return [];
    return terms.flatMap((t, j): Candidate[] => {
      if (j === c.index) return [];
      const theirs = splitCoef(t);
      if (isFraction(theirs) || !oneNumber(t)) return [];
      if (restKey(mine) !== restKey(theirs)) return [];
      // The result takes over the target's identity — unless the target itself
      // survives inside it (x + x → 2·x keeps that x), which would duplicate the id.
      const built = buildTerm({ ...theirs, coef: mine.coef + theirs.coef });
      const merged = allNodes(built).some((n) => n.id === t.id) ? built : adopt(built, t.id);
      return [
        {
          rule: "combine",
          state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, merged),
          targetId: t.id,
        },
      ];
    });
  },
};

/** 2·3 → 6 (drop a number onto another number in the same product). */
export const multiplyNumbers: Rule = {
  id: "multiply-numbers",
  undoneBy: ["split-number"],
  operatorTap: "product",
  name: "Multiply numbers",
  gesture: "Drop a number onto another number it's multiplied by.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" || c.node.kind !== "num") return [];
    const a = c.node.value;
    const factors = c.parent.factors;
    return factors.flatMap((f, j): Candidate[] => {
      if (j === c.index || f.kind !== "num") return [];
      return [
        {
          rule: "multiply-numbers",
          state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, num(a * f.value, f.id)),
          targetId: f.id,
        },
      ];
    });
  },
};

/** x·x → x², x²·x³ → x⁵ (drop a factor onto one with the same base). */
export const mergePowers: Rule = {
  id: "merge-powers",
  undoneBy: ["split-exponent"],
  operatorTap: "product",
  name: "Same base: add exponents",
  gesture: "Drop a factor onto another with the same base — the exponents add up.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" || c.node.kind === "num") return [];
    const mine = asPower(c.node);
    const factors = c.parent.factors;
    return factors.flatMap((f, j): Candidate[] => {
      if (j === c.index || f.kind === "num") return [];
      // Two equal brackets multiply out (distribute), as any bracket onto a bracket does.
      if (f.kind === "sum" && c.node.kind === "sum") return [];
      const theirs = asPower(f);
      if (key(theirs.base) !== key(mine.base)) return [];
      // A square root times itself gives back what's inside: √2·√2 → 2. That's
      // what a square root is (like x·x → x² below), not arithmetic to show.
      if (f.kind === "pow" && f.radical && c.node.kind === "pow" && c.node.radical && key(f) === key(c.node)) {
        return [
          {
            rule: "merge-powers",
            state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, theirs.base),
            targetId: f.id,
            // What's inside stays where it is while its √ fades away.
            stays: theirs.base.id,
          },
        ];
      }
      // Show the operation, not the answer: x³·x² → x^(3+2), and the learner
      // combines 3 + 2 themselves — keeping the factors' left-to-right order.
      // The exception is x·x → x², which is just what "squared" means.
      const plain = f.kind !== "pow" && c.node.kind !== "pow";
      const exp = plain ? num(2) : sum(j < c.index ? [theirs.exp, mine.exp] : [mine.exp, theirs.exp]);
      return [
        {
          rule: "merge-powers",
          state: mergeInto(state, c.parentLoc!, c.parent!, c.index, j, pow(theirs.base, exp, f.kind === "pow" ? f.id : undefined)),
          targetId: f.id,
        },
      ];
    });
  },
};

/** x·1 → x (drop a 1 onto anything it multiplies). */
export const timesOne: Rule = {
  id: "times-one",
  // Tidying: done for the learner after a move (game/tidy.ts).
  tidy: true,
  either: true,
  name: "Times one",
  gesture: "Tap a 1 that multiplies something, or drop it onto what it multiplies — multiplying by 1 changes nothing.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" || c.node.kind !== "num" || c.node.value !== 1) return [];
    const factors = c.parent.factors;
    return factors.flatMap((f, j): Candidate[] =>
      j === c.index
        ? []
        : [
            {
              rule: "times-one",
              state: replaceIn(state, c.parentLoc!, { ...c.parent!, factors: without(factors, c.index) } as Expr),
              targetId: f.id,
            },
          ],
    );
  },
};

/** x·2 → 2x, x·1 → x (tap a product to write it the usual way: numbers in front, no ·1). */
export const numbersFirst: Rule = {
  id: "numbers-first",
  tidy: true,
  name: "Numbers in front",
  gesture: "Tap something like x·2 to write it the usual way, 2x.",
  tap: true,
  apply(state, id) {
    // Tapping the product itself: a press on a factor with nothing else to do
    // falls through to it anyway, and offering it on factors would make them
    // grabbable alone (then x·2's term couldn't be picked up to combine with −2x).
    const c = dragCtx(state, id);
    const P = c?.node.kind === "prod" ? c.node : null;
    if (!P || !c?.loc) return [];
    const nums = P.factors.filter((f) => f.kind === "num" && !isOne(f));
    const rest = P.factors.filter((f) => f.kind !== "num");
    // A ·1 is just dropped when tidying (x·1 → x, not 1x).
    const ones = P.factors.filter(isOne);
    const reordered = [...nums, ...rest];
    if (reordered.length === 0) reordered.push(ones[0]);
    if (reordered.length === P.factors.length && reordered.every((f, i) => f === P.factors[i])) return [];
    const tidy = reordered.length === 1 ? reordered[0] : { ...P, factors: reordered };
    return [{ rule: "numbers-first", state: replaceIn(state, c.loc, tidy) }];
  },
};

const isOne = (f: Expr) => f.kind === "num" && f.value === 1;

/**
 * 0·(x − 3) → 0, 5·0·x → 0, 0/13 → 0 (tap a 0 that multiplies something, or
 * that is a fraction's top: anything times 0 is 0, and 0 divided by anything
 * else is 0).
 */
export const timesZero: Rule = {
  id: "times-zero",
  name: "Times zero",
  gesture: "Tap a 0 that multiplies something, or that is a fraction's top: the product, or the fraction, is 0.",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.node.kind !== "num" || c.node.value !== 0 || !c.parentLoc) return [];
    const zero = num(0, c.node.id);
    if (c.parent?.kind === "prod") return [{ rule: "times-zero", state: replaceIn(state, c.parentLoc, zero) }];
    // 0 over something: the whole fraction (its bottom isn't 0: a bottom never is).
    if (c.parent?.kind === "frac" && c.index === 0 && !(c.parent.den.kind === "num" && c.parent.den.value === 0)) return [{ rule: "times-zero", state: replaceIn(state, c.parentLoc, zero) }];
    return [];
  },
};

/** 2·3 → 6, 3·2·x → 6x (tap the product, or one of its numbers: the numbers in it are multiplied out). */
export const multiplyOut: Rule = {
  id: "multiply-out",
  undoneBy: ["split-number"],
  name: "Multiply out",
  gesture: "Tap a · in a product to multiply all its numbers together: 4x·3 → 12x (anything times 0 is 0).",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (!c) return [];
    const nums = (p: Expr) => (p.kind === "prod" ? (p.factors.filter((f) => f.kind === "num") as Extract<Expr, { kind: "num" }>[]) : []);
    // The product itself, or one of its numbers (grabbable anyway: they can be dropped on each other).
    const P = c.node.kind === "prod" ? c.node : c.node.kind === "num" && c.parent?.kind === "prod" ? c.parent : null;
    const loc = c.node.kind === "prod" ? c.loc : c.parentLoc;
    const ns = P ? nums(P) : [];
    // Anything times 0 is 0: 0·(x − 3) → 0.
    const zero = ns.find((f) => f.value === 0);
    if (P && loc && zero) return [{ rule: "multiply-out", state: replaceIn(state, loc, num(0, zero.id)) }];
    if (!P || !loc || ns.length < 2) return [];
    const value = num(
      ns.reduce((a, f) => a * f.value, 1),
      ns[0].id,
    );
    const factors = P.factors.flatMap((f) => (f === ns[0] ? [value] : f.kind === "num" ? [] : [f]));
    return [{ rule: "multiply-out", state: replaceIn(state, loc, factors.length === 1 ? factors[0] : { ...P, factors }) }];
  },
};
