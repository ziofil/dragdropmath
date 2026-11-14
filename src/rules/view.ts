/**
 * The learner's view of an expression: what a symbol *is* in the maths, not
 * where it sits in the tree.
 *
 * The tree is normalized for the computer: a sum of one term is just that
 * term, a product of one factor just that factor, and a minus is pulled out
 * in front of products and fractions. A learner reads every expression the
 * same way whatever its shape:
 *
 *   a side, or a bracket, is a list of signed terms (even if there's just one);
 *   a term is a sign × a top (its factors) over a bottom (its factors, maybe none);
 *   a number times a fraction is one fraction: 2·(x + 4)/3 is 2(x + 4) over 3.
 *
 * Rules ask this view what the dragged piece is (a term, a factor on top, a
 * factor on the bottom, …) instead of each climbing the tree its own way — so
 * "a term" means the same thing to every rule, and a term alone on its side is
 * just as much a term as one in a long sum.
 */
import type { Expr, Frac, MathState } from "../expr/types";
import { frac, neg, num, prod, sum } from "../expr/build";
import { locate, nodeAt, parentLoc, type Loc } from "../expr/tree";
import { signOwner } from "./types";

/** The terms of a side, or of anything else read as a sum: a non-sum is one term. */
export const termsOf = (e: Expr): Expr[] => (e.kind === "sum" ? e.terms : [e]);

/** The factors of a product, or of anything else read as one: a non-product is one factor. */
export const factorsOf = (e: Expr): Expr[] => (e.kind === "prod" ? e.factors : [e]);

/**
 * A term, as a learner reads it: sign × top / bottom.
 * `body` is the term without its sign; `frac` is the body when it's a fraction.
 */
export type TermView = {
  term: Expr;
  negative: boolean;
  body: Expr;
  frac: Frac | null;
  /** Factors on top (the whole body when there's no fraction). */
  top: Expr[];
  /** Factors of the bottom (none when there's no fraction). */
  bottom: Expr[];
};

export function viewTerm(term: Expr): TermView {
  const negative = term.kind === "neg";
  const body = negative ? term.arg : term;
  const f = body.kind === "frac" ? body : fracFactor(body);
  // A fraction among other factors (2·(x + 4)/3): they join its top, in their place.
  const top = f && f !== body ? factorsOf(body).flatMap((x) => (x === f ? factorsOf(f.num) : [x])) : factorsOf(f ? f.num : body);
  return { term, negative, body, frac: f, top, bottom: f ? factorsOf(f.den) : [] };
}

/** The one fraction among a product's factors (2·(x + 4)/3), if there is exactly one. */
function fracFactor(e: Expr): Frac | null {
  if (e.kind !== "prod") return null;
  const fs = e.factors.filter((x): x is Frac => x.kind === "frac");
  return fs.length === 1 ? fs[0] : null;
}

/**
 * What a piece is within its term:
 * - `term`: the term itself (−x/3 in 1 − x/3)
 * - `sign`: the minus sign's own handle
 * - `body`: the term without its sign (x/3 in −x/3)
 * - `top` / `bottom`: a fraction's whole top or bottom
 * - `top-factor` / `bottom-factor`: one factor of a top or bottom with several
 *   (a term without a fraction is all top: the 2 of 2x is a top factor)
 */
export type Part = "term" | "sign" | "body" | "top" | "bottom" | "top-factor" | "bottom-factor";

/** Where a piece sits: its term, the list of terms that term belongs to, and its part in it. */
export type Role = {
  part: Part;
  /** The piece itself (for `sign`, the minus it belongs to). */
  node: Expr;
  term: TermView;
  termLoc: Loc;
  /** The sum the term is in, or the term itself when it stands alone as a side. */
  holderLoc: Loc;
  /** Every term of the holder: [term] when the term stands alone. */
  terms: Expr[];
  /** The term's position among `terms`. */
  index: number;
  /** The holder is a whole side of an equation (or a lone expression). */
  isSide: boolean;
  side: number;
};

const kindAt = (state: MathState, loc: Loc | null) => (loc ? nodeAt(state, loc).kind : null);

/**
 * The role of a piece (a node id, or a minus sign's handle id), or null for
 * something that isn't part of a term: inside a power, a log, a bracket's own
 * factor list deeper down, ….
 */
export function roleOf(state: MathState, id: string): Role | null {
  const owner = signOwner(id);
  const loc = locate(state, owner ?? id);
  if (!loc) return null;
  const node = nodeAt(state, loc);
  if (owner) {
    if (node.kind !== "neg") return null;
    const r = asTerm(state, loc);
    return r && { ...r, part: "sign", node };
  }
  // The fraction among other factors (the (x + 4)/3 of 2·(x + 4)/3) isn't a
  // factor of the term's top (its top and bottom are): no role of its own.
  if (kindAt(state, parentLoc(loc)) === "prod" && fracFactor(nodeAt(state, parentLoc(loc)!)) === node) return null;
  // Climb from the piece to its term: [factor →] [top/bottom →] [body →] term.
  let at = loc;
  let part: Part = "term";
  const up = parentLoc(at);
  if (kindAt(state, up) === "prod") {
    const upUp = parentLoc(up!);
    if (kindAt(state, upUp) === "frac") {
      part = up!.path.at(-1) === 1 ? "bottom-factor" : "top-factor";
      at = upUp!;
    } else {
      part = "top-factor";
      at = up!;
    }
  } else if (kindAt(state, up) === "frac") {
    part = loc.path.at(-1) === 1 ? "bottom" : "top";
    at = up!;
  }
  // A fraction that is a factor (2·(x + 4)/3) belongs to that product's term:
  // its top is one factor of the term's top, its bottom the term's bottom.
  const outer = parentLoc(at);
  if (kindAt(state, at) === "frac" && kindAt(state, outer) === "prod" && fracFactor(nodeAt(state, outer!)) === nodeAt(state, at)) {
    at = outer!;
    if (part === "top") part = "top-factor";
  }
  // `at` is now the body (or the term itself, if nothing was climbed).
  const r = asTerm(state, at);
  if (r) return { ...r, part, node };
  const above = parentLoc(at);
  if (kindAt(state, above) === "neg") {
    const t = asTerm(state, above!);
    if (t) return { ...t, part: part === "term" ? "body" : part, node };
  }
  return null;
}

/** The term at `loc`, if a term sits there: a sum's term, or a whole side. */
function asTerm(state: MathState, loc: Loc): Omit<Role, "part" | "node"> | null {
  const term = nodeAt(state, loc);
  const up = parentLoc(loc);
  if (up && kindAt(state, up) === "sum") {
    const s = nodeAt(state, up);
    return {
      term: viewTerm(term),
      termLoc: loc,
      holderLoc: up,
      terms: termsOf(s),
      index: loc.path.at(-1)!,
      isSide: up.path.length === 0,
      side: loc.side,
    };
  }
  // A whole side is a term of its own (unless it's a sum: then it's the terms' holder).
  if (!up && term.kind !== "sum") return { term: viewTerm(term), termLoc: loc, holderLoc: loc, terms: [term], index: 0, isSide: true, side: loc.side };
  return null;
}

/**
 * Put a term back together with a new top and bottom (factor lists), keeping
 * the ids of its sign, top, bottom and fraction. An empty top is 1; an empty
 * bottom means no fraction.
 */
export function rebuildTerm(t: TermView, top: Expr[], bottom: Expr[]): Expr {
  const join = (parts: Expr[], was: Expr | undefined) =>
    parts.length === 0 ? num(1) : parts.length === 1 ? parts[0] : prod(parts, was?.kind === "prod" ? was.id : undefined);
  const topE = join(top, t.frac ? t.frac.num : t.body);
  const body = bottom.length === 0 ? topE : frac(topE, join(bottom, t.frac?.den), t.frac?.id);
  return t.negative ? neg(body, t.term.id) : body;
}

/** A side or bracket from its terms, keeping the sum's id. */
export function fromTerms(terms: Expr[], was: Expr): Expr {
  return terms.length === 1 ? terms[0] : sum(terms, was.kind === "sum" ? was.id : undefined);
}
