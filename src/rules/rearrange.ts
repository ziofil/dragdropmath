import type { Expr } from "../expr/types";
import { num, pow, sum } from "../expr/build";
import { key } from "../expr/key";
import { allNodes, withChildren } from "../expr/tree";
import { buildTerm, restKey, splitCoef } from "./monomial";
import { asPower } from "./shapes";
import { adopt, dragCtx, moveItem, replaceIn, siblings, without, type Candidate, type Rule } from "./types";

/** a + b → b + a, a·b → b·a (drag a term or factor to a new slot). */
export const commute: Rule = {
  id: "commute",
  feel: { carry: "reorder" },
  name: "Swap",
  gesture: "Drag a term or factor past its neighbours — order doesn't matter for + and ×.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (!c?.parent || (c.parent.kind !== "sum" && c.parent.kind !== "prod")) return [];
    const items = siblings(c);
    return items.flatMap((_, j): Candidate[] =>
      j === c.index
        ? []
        : [{ rule: "commute", state: replaceIn(state, c.parentLoc!, withChildren(c.parent!, moveItem(items, c.index, j))) }],
    );
  },
};

/** 3x + 2x → 5x, 4 + 3 → 7, x − x → 0 (drop a term onto a like term). */
export const combine: Rule = {
  id: "combine",
  name: "Combine like terms",
  gesture: "Drop a term onto a term of the same kind to add them up.",
  apply(state, id) {
    const node = dragCtx(state, id);
    if (!node) return [];
    // Holding the symbol part of a term (the ln(x) in 3ln(x) or −ln(x)) and
    // dropping it on a like term combines the whole terms. Marked secondary:
    // it never makes that symbol grabbable by itself, so in 3x + 2x a press on
    // the x still picks up the term.
    let c = node;
    let secondary = false;
    if (c.parent?.kind === "prod" && splitCoef(c.parent).rest.length === 1 && splitCoef(c.parent).rest[0].id === c.node.id) {
      c = dragCtx(state, c.parent.id)!;
      secondary = true;
    }
    if (c.parent?.kind === "neg") {
      c = dragCtx(state, c.parent.id)!;
      secondary = secondary || c.node.id !== node.node.id;
    }
    if (c.parent?.kind !== "sum") return [];
    const terms = c.parent.terms;
    const mine = splitCoef(c.node);
    const isFraction = (m: { rest: Expr[] }) => m.rest.length === 1 && m.rest[0].kind === "frac";
    if (isFraction(mine)) return []; // fractions are added with add-fractions
    return terms.flatMap((t, j): Candidate[] => {
      if (j === c.index) return [];
      const theirs = splitCoef(t);
      if (isFraction(theirs)) return [];
      if (restKey(mine) !== restKey(theirs)) return [];
      // The result takes over the target's identity — unless the target itself
      // survives inside it (x + x → 2·x keeps that x), which would duplicate the id.
      const built = buildTerm({ ...theirs, coef: mine.coef + theirs.coef });
      const merged = allNodes(built).some((n) => n.id === t.id) ? built : adopt(built, t.id);
      const newTerms = terms.slice();
      newTerms[j] = merged;
      return [
        {
          rule: "combine",
          state: replaceIn(state, c.parentLoc!, { ...c.parent!, terms: without(newTerms, c.index) } as Expr),
          targetId: t.id,
          secondary,
        },
      ];
    });
  },
};

/** 2·3 → 6 (drop a number onto another number in the same product). */
export const multiplyNumbers: Rule = {
  id: "multiply-numbers",
  name: "Multiply numbers",
  gesture: "Drop a number onto another number it's multiplied by.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" || c.node.kind !== "num") return [];
    const a = c.node.value;
    const factors = c.parent.factors;
    return factors.flatMap((f, j): Candidate[] => {
      if (j === c.index || f.kind !== "num") return [];
      const newFactors = factors.slice();
      newFactors[j] = num(a * f.value, f.id);
      return [
        {
          rule: "multiply-numbers",
          state: replaceIn(state, c.parentLoc!, { ...c.parent!, factors: without(newFactors, c.index) } as Expr),
          targetId: f.id,
        },
      ];
    });
  },
};

/** x·x → x², x²·x³ → x⁵ (drop a factor onto one with the same base). */
export const mergePowers: Rule = {
  id: "merge-powers",
  name: "Same base: add exponents",
  gesture: "Drop a factor onto another with the same base — the exponents add up.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod" || c.node.kind === "num") return [];
    const mine = asPower(c.node);
    const factors = c.parent.factors;
    return factors.flatMap((f, j): Candidate[] => {
      if (j === c.index || f.kind === "num") return [];
      const theirs = asPower(f);
      if (key(theirs.base) !== key(mine.base)) return [];
      // A square root times itself gives back what's inside: √2·√2 → 2. That's
      // what a square root is (like x·x → x² below), not arithmetic to show.
      if (f.kind === "pow" && f.radical && c.node.kind === "pow" && c.node.radical && key(f) === key(c.node)) {
        const newFactors = factors.slice();
        newFactors[j] = theirs.base;
        return [
          {
            rule: "merge-powers",
            state: replaceIn(state, c.parentLoc!, { ...c.parent!, factors: without(newFactors, c.index) } as Expr),
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
      const newFactors = factors.slice();
      newFactors[j] = pow(theirs.base, exp, f.kind === "pow" ? f.id : undefined);
      return [
        {
          rule: "merge-powers",
          state: replaceIn(state, c.parentLoc!, { ...c.parent!, factors: without(newFactors, c.index) } as Expr),
          targetId: f.id,
        },
      ];
    });
  },
};

/** x·1 → x (drop a 1 onto anything it multiplies). */
export const timesOne: Rule = {
  id: "times-one",
  name: "Times one",
  gesture: "Drop a 1 onto what it multiplies — multiplying by 1 changes nothing.",
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
  // Tidies a whole product, so a more specific tap on the thing tapped (log₂2 → 1 in log₂2·3) comes first.
  tapOrder: 1,
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

/** 2·3 → 6, 3·2·x → 6x (tap the product, or one of its numbers: the numbers in it are multiplied out). */
export const multiplyOut: Rule = {
  id: "multiply-out",
  // After tidying: x·2·3 is first written 2·3·x.
  tapOrder: 2,
  name: "Multiply out",
  gesture: "Tap a product of numbers, like 2·3, to work it out.",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (!c) return [];
    const nums = (p: Expr) => (p.kind === "prod" ? (p.factors.filter((f) => f.kind === "num") as Extract<Expr, { kind: "num" }>[]) : []);
    // The product itself, or one of its numbers (grabbable anyway: they can be dropped on each other).
    const P = c.node.kind === "prod" ? c.node : c.node.kind === "num" && c.parent?.kind === "prod" ? c.parent : null;
    const loc = c.node.kind === "prod" ? c.loc : c.parentLoc;
    if (!P || P.kind !== "prod" || !loc || nums(P).length < 2) return [];
    const ns = nums(P);
    const value = num(
      ns.reduce((a, f) => a * f.value, 1),
      ns[0].id,
    );
    const factors = P.factors.flatMap((f) => (f === ns[0] ? [value] : f.kind === "num" ? [] : [f]));
    return [{ rule: "multiply-out", state: replaceIn(state, loc, factors.length === 1 ? factors[0] : { ...P, factors }) }];
  },
};
