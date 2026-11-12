import type { Expr } from "../expr/types";
import { cloneFresh, frac, neg, num, prod, sum } from "../expr/build";
import { key } from "../expr/key";
import { allNodes, nodeAt } from "../expr/tree";
import { roleOf, viewTerm } from "./view";
import { dragCtx, replaceIn, without, type Candidate, type Rule } from "./types";
import { fractionPart, timesVisible } from "./shapes";

// ---------- helpers ----------

/** A term of a sum seen as sign × body (−x/3 → −, x/3); see view.ts. */
const signed = viewTerm;

const withSign = (negative: boolean, e: Expr, id?: string) => (negative ? neg(e, id) : e);

const smallestPrime = (n: number) => {
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return p;
  return n;
};

// ---------- rules ----------

/**
 * 6 → 2·3 (tap a number to split it into factors) — to find what terms
 * share (2x + 6 → 2x + 2·3 → 2(x + 3)) or what cancels in a fraction. Works
 * on a number in a fraction, a term of a sum, or a factor of a product.
 */
export const splitNumber: Rule = {
  id: "split-number",
  name: "Split a number",
  gesture: "Tap a number to split it into two factors (6 → 2·3).",
  tap: true,
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.node.kind !== "num") return [];
    // In a fraction (its top or bottom, or a factor of one), a sum or a product —
    // not alone on a side, in an exponent, or inside a log or root.
    const holder = c.parent?.kind === "prod" ? dragCtx(state, c.parent.id) : c;
    const r = roleOf(state, id);
    const termOfSum = (r?.part === "term" || r?.part === "body") && r.terms.length >= 2; // −6 is a term too
    const inPlace = holder?.parent?.kind === "frac" || termOfSum || c.parent?.kind === "prod";
    if (!inPlace) return [];
    const n = c.node.value;
    const p = smallestPrime(n);
    if (n < 4 || p === n) return [];
    return [{ rule: "split-number", state: replaceIn(state, c.loc, prod([num(p), num(n / p)], c.node.id)) }];
  },
};

/**
 * 1/2 + 1/3: drag the 3 from one denominator onto another term — that term is
 * multiplied top and bottom by 3 (copies fly out of the carried 3; the 3
 * itself stays where it was). A whole number becomes a fraction: 2 → (2·3)/3.
 */
export const expandFraction: Rule = {
  id: "expand-fraction",
  name: "Same denominators",
  gesture: "Drag a factor from one denominator onto another term — it multiplies that term's top and bottom.",
  apply(state, id) {
    const c = dragCtx(state, id);
    const part = c && fractionPart(state, c);
    if (!c || !part?.inDen) return [];
    // The fraction it came from must be a term (or −term) of a sum.
    const r = roleOf(state, part.F.id);
    if (!r || (r.part !== "term" && r.part !== "body") || r.terms.length < 2) return [];
    const S = nodeAt(state, r.holderLoc);
    const termCtx = { index: r.index, parent: S, parentLoc: r.holderLoc };
    const terms = r.terms;
    const f = c.node;
    return terms.flatMap((T, j): Candidate[] => {
      if (j === termCtx.index) return [];
      const { negative, body } = signed(T);
      if (allNodes(body).some((n) => n.id === f.id)) return [];
      const copy = () => cloneFresh(f);
      const expanded =
        body.kind === "frac"
          ? frac(timesVisible(body.num, copy()), timesVisible(body.den, copy()), body.id)
          : frac(timesVisible(body, copy()), copy());
      const newTerms = terms.map((t, k) => (k === j ? withSign(negative, expanded, negative ? T.id : undefined) : t));
      return [
        {
          rule: "expand-fraction",
          state: replaceIn(state, termCtx.parentLoc!, { ...termCtx.parent!, terms: newTerms } as Expr),
          targetId: T.id,
        },
      ];
    });
  },
};

/** 1/5 + 2/5 → (1 + 2)/5 (drop a fraction onto one with the same denominator). */
export const addFractions: Rule = {
  id: "add-fractions",
  name: "Add fractions",
  gesture: "Drop a fraction onto another with the same denominator — the tops add up.",
  apply(state, id) {
    const r = roleOf(state, id);
    if (r?.part !== "term" || r.terms.length < 2) return [];
    const c = { node: r.node, index: r.index, parent: nodeAt(state, r.holderLoc), parentLoc: r.holderLoc };
    const mine = signed(c.node);
    if (mine.body.kind !== "frac") return [];
    const myFrac = mine.body;
    const terms = r.terms;
    return terms.flatMap((U, j): Candidate[] => {
      if (j === c.index) return [];
      const theirs = signed(U);
      if (theirs.body.kind !== "frac" || key(theirs.body.den) !== key(myFrac.den)) return [];
      // Numerators in left-to-right order, each with its sign.
      const parts: [boolean, Expr][] = j < c.index
        ? [[theirs.negative, theirs.body.num], [mine.negative, myFrac.num]]
        : [[mine.negative, myFrac.num], [theirs.negative, theirs.body.num]];
      const top = sum(parts.map(([negative, n]) => withSign(negative, n)));
      const merged = frac(top, theirs.body.den, theirs.body.id);
      const newTerms = terms.map((t, k) => (k === j ? merged : t));
      return [
        {
          rule: "add-fractions",
          state: replaceIn(state, c.parentLoc!, { ...c.parent!, terms: without(newTerms, c.index) } as Expr),
          targetId: U.id,
        },
      ];
    });
  },
};

/** (x + 2)/2 → x/2 + 2/2 (pull a term out of the top; it takes a copy of the bottom). */
export const splitFraction: Rule = {
  id: "split-fraction",
  feel: { carry: "pull-out" },
  name: "Split a fraction",
  gesture: "Pull a term out of a fraction's top — it takes a copy of the bottom with it.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "sum") return [];
    const N = dragCtx(state, c.parent.id);
    if (N?.parent?.kind !== "frac" || N.index !== 0) return [];
    const F = N.parent;
    const { negative, body } = signed(c.node);
    // A carried −term keeps its identity (its − stays the same piece).
    const mine = withSign(negative, { ...frac(body, cloneFresh(F.den)), from: F.id }, negative ? c.node.id : undefined);
    const rest = frac(sum(without(c.parent.terms, c.index), c.parent.id), F.den, F.id);
    const split = sum(c.index === 0 ? [mine, rest] : [rest, mine]);
    return [{ rule: "split-fraction", state: replaceIn(state, N.parentLoc!, split) }];
  },
};

/** x/3 · 6/x → (x·6)/(3·x), 2 · 3/4 → (2·3)/4 (drop a factor onto a fraction it multiplies). */
export const multiplyFractions: Rule = {
  id: "multiply-fractions",
  name: "Multiply fractions",
  gesture: "Drop a fraction (or number) onto a fraction it multiplies — tops multiply, bottoms multiply.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod") return [];
    const factors = c.parent.factors;
    const parts = (e: Expr) => (e.kind === "frac" ? { top: e.num, bottom: e.den as Expr | null } : { top: e, bottom: null });
    return factors.flatMap((G, j): Candidate[] => {
      if (j === c.index || (G.kind !== "frac" && c.node.kind !== "frac")) return [];
      // A number dropped on a log goes *into* it (½·ln x → ln(x^½)), not over it.
      if (G.kind === "log" || c.node.kind === "log") return [];
      const [a, b] = j < c.index ? [parts(G), parts(c.node)] : [parts(c.node), parts(G)];
      const bottoms = [a.bottom, b.bottom].filter((x): x is Expr => x !== null);
      // The result takes over the target's identity only if the target is the fraction
      // (a number target survives inside it: 3/4 onto 2 → (2·3)/4 keeps that 2).
      const merged = frac(timesVisible(a.top, b.top), bottoms.length === 1 ? bottoms[0] : timesVisible(...bottoms), G.kind === "frac" ? G.id : undefined);
      const newFactors = factors.map((f, k) => (k === j ? merged : f));
      return [
        {
          rule: "multiply-fractions",
          state: replaceIn(state, c.parentLoc!, { ...c.parent!, factors: without(newFactors, c.index) } as Expr),
          targetId: G.id,
        },
      ];
    });
  },
};

/** (1/2)/(3/4) → (1/2)·(4/3) (carry the bottom fraction up across the bar; it flips over). */
export const divideByFraction: Rule = {
  id: "divide-by-fraction",
  name: "Dividing by a fraction",
  gesture: "Carry a fraction from the bottom up across the bar — it flips upside down and multiplies.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "frac" || c.index !== 1 || c.node.kind !== "frac") return [];
    const D = c.node;
    const flipped = frac(D.den, D.num, D.id);
    return [{ rule: "divide-by-fraction", state: replaceIn(state, c.parentLoc!, prod([c.parent.num, flipped])) }];
  },
};
