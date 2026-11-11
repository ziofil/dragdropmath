import type { Expr, MathState, Neg, Num, Rel } from "./types";
import { children, mapTree, withChildren } from "./tree";

let counter = 0;
/** Globally unique, slash-free ids (Dragology requirement). */
export const freshId = (): string => `n${(counter++).toString(36)}`;

/**
 * Make sure fresh ids won't repeat ones already used in `e` — needed when a
 * state comes from elsewhere (a saved recording) rather than this session.
 */
export function reserveIds(e: { id: string } & object): void {
  const visit = (x: unknown) => {
    if (!x || typeof x !== "object") return;
    if (Array.isArray(x)) return x.forEach(visit);
    const id = (x as { id?: unknown }).id;
    const m = typeof id === "string" ? id.match(/^n([0-9a-z]+)$/) : null;
    if (m) counter = Math.max(counter, parseInt(m[1], 36) + 1);
    Object.values(x).forEach(visit);
  };
  visit(e);
}

export const num = (value: number, id = freshId()): Expr => ({ kind: "num", id, value });
export const variable = (name: string, id = freshId()): Expr => ({ kind: "var", id, name });
export const neg = (arg: Expr, id = freshId()): Expr => ({ kind: "neg", id, arg });
export const sum = (terms: Expr[], id = freshId()): Expr => ({ kind: "sum", id, terms });
export const prod = (factors: Expr[], id = freshId()): Expr => ({ kind: "prod", id, factors });
export const frac = (n: Expr, d: Expr, id = freshId()): Expr => ({ kind: "frac", id, num: n, den: d });
export const pow = (base: Expr, exp: Expr, id = freshId()): Expr => ({ kind: "pow", id, base, exp });
export const econst = (id = freshId()): Expr => ({ kind: "const", id, name: "e" });
/** ⁿ√x, i.e. x^(1/n) drawn as a root. */
export const root = (base: Expr, n = 2, id = freshId()): Expr => ({ kind: "pow", id, base, exp: frac(num(1), num(n)), radical: true });
export const log = (base: Expr, arg: Expr, id = freshId()): Expr => ({ kind: "log", id, base, arg });

export const isNum = (e: Expr, v?: number): e is Num =>
  e.kind === "num" && (v === undefined || e.value === v);

/** Deep copy with fresh ids; every copied node remembers its source in `from`. */
export function cloneFresh(e: Expr): Expr {
  const copy = withChildren(e, children(e).map(cloneFresh));
  return { ...copy, id: freshId(), from: e.id };
}

/** Negate, cancelling a double negative instead of stacking it. */
export function negate(e: Expr): Expr {
  return e.kind === "neg" ? e.arg : neg(e);
}

/** Bring a tree into canonical shape (see conventions in types.ts). Idempotent. */
export function normalize(e: Expr): Expr {
  return mapTree(e, normalizeNode);
}

export function normalizeState(s: MathState): MathState {
  return { ...s, sides: s.sides.map(normalize) };
}

/** The relation of a state ("=" unless it says otherwise). */
export const relOf = (s: MathState): Rel => s.rel ?? "=";

/** The relation read the other way round / after multiplying both sides by −1: < ↔ >, ≤ ↔ ≥. */
export function flipRel(r: Rel): Rel {
  return ({ "=": "=", "<": ">", ">": "<", "≤": "≥", "≥": "≤" } as const)[r];
}

/** `s` with its relation turned round (an equation stays an equation). */
export const withFlippedRel = (s: MathState, from: MathState): MathState => {
  const r = flipRel(relOf(from));
  return r === "=" ? s : { ...s, rel: r };
};

function normalizeNode(e: Expr): Expr {
  switch (e.kind) {
    case "neg": {
      if (e.arg.kind === "neg") return e.arg.arg;
      if (isNum(e.arg, 0)) return e.arg;
      return e;
    }
    case "sum": {
      let terms = e.terms.flatMap((t) => (t.kind === "sum" ? t.terms : [t]));
      if (terms.length > 1) terms = terms.filter((t) => !isNum(t, 0));
      if (terms.length === 0) return num(0);
      if (terms.length === 1) return terms[0];
      return { ...e, terms };
    }
    case "prod": {
      let negative = false;
      let factors = e.factors
        .flatMap((f) => (f.kind === "prod" ? f.factors : [f]))
        .map((f) => {
          if (f.kind !== "neg") return f;
          negative = !negative;
          return f.arg;
        })
        .flatMap((f) => (f.kind === "prod" ? f.factors : [f]));
      if (factors.length > 1) factors = factors.filter((f) => !isNum(f, 1) || (f.kind === "num" && f.explicit));
      const core: Expr =
        factors.length === 0 ? num(1) : factors.length === 1 ? factors[0] : { ...e, factors };
      return negative ? (neg(core) as Neg) : core;
    }
    case "frac": {
      let negative = false;
      let { num: n, den: d } = e;
      if (n.kind === "neg") [negative, n] = [!negative, n.arg];
      if (d.kind === "neg") [negative, d] = [!negative, d.arg];
      const core: Expr = isNum(d, 1) ? n : { ...e, num: n, den: d };
      return negative ? neg(core) : core;
    }
    // x¹ stays visible: the learner removes the 1 themselves (power-one).
    default:
      return e;
  }
}

