/**
 * Small facts about expression shapes that several rules share.
 */
import type { Expr, Frac } from "../expr/types";
import { num, pow, prod } from "../expr/build";
import { nodeAt, parentLoc, type Loc } from "../expr/tree";
import { without, type DragCtx } from "./types";
import type { MathState } from "../expr/types";

/**
 * A 1 the learner should see and simplify themselves (2·1, −2·1), rather than
 * have it vanish: marks a 1, or a −1, as explicit.
 */
export function visibleOne(e: Expr): Expr {
  if (e.kind === "num" && e.value === 1) return { ...e, explicit: true };
  if (e.kind === "neg" && e.arg.kind === "num" && e.arg.value === 1) return { ...e, arg: { ...e.arg, explicit: true } };
  return e;
}

/** Product of the given factors, keeping 1s visible. */
export const timesVisible = (...fs: Expr[]) => prod(fs.map(visibleOne));

/** x → (x, 1); xⁿ → (x, n). */
export function asPower(e: Expr): { base: Expr; exp: Expr } {
  return e.kind === "pow" ? { base: e.base, exp: e.exp } : { base: e, exp: num(1) };
}

/**
 * `f` raised to `e`; a factor that is already a power multiplies exponents
 * ((x²)³ → x^(2·3)), keeping its identity. `radical` keeps root notation.
 */
export function raise(f: Expr, e: Expr, radical = false): Expr {
  if (f.kind === "pow") return pow(f.base, prod([f.exp, e]), f.id);
  return radical ? ({ ...pow(f, e), radical: true } as Expr) : pow(f, e);
}

/**
 * The fraction a node is part of: as its whole top or bottom, or as one
 * factor of it. `partLoc` is the top or bottom itself.
 */
export function fractionPart(state: MathState, c: DragCtx): { F: Frac; fracLoc: Loc; partLoc: Loc; inDen: boolean } | null {
  const up = parentLoc(c.loc);
  const partLoc = up && nodeAt(state, up).kind === "prod" ? up : c.loc;
  const fracLoc = parentLoc(partLoc);
  if (!fracLoc) return null;
  const F = nodeAt(state, fracLoc);
  if (F.kind !== "frac") return null;
  return { F, fracLoc, partLoc, inDen: partLoc.path[partLoc.path.length - 1] === 1 };
}

/** `e` without the factor `pick` finds (1, if that was all of it), or null if there's none. */
export function dropFactor(e: Expr, pick: (x: Expr) => boolean): Expr | null {
  if (pick(e)) return num(1);
  if (e.kind !== "prod") return null;
  const i = e.factors.findIndex(pick);
  return i < 0 ? null : prod(without(e.factors, i), e.id);
}
