import type { Expr, MathState } from "./types";

export function children(e: Expr): Expr[] {
  switch (e.kind) {
    case "num":
    case "var":
    case "const":
      return [];
    case "neg":
      return [e.arg];
    case "sum":
      return e.terms;
    case "prod":
      return e.factors;
    case "frac":
      return [e.num, e.den];
    case "pow":
      return [e.base, e.exp];
    case "log":
      return [e.base, e.arg];
  }
}

export function withChildren(e: Expr, cs: Expr[]): Expr {
  switch (e.kind) {
    case "num":
    case "var":
    case "const":
      return e;
    case "neg":
      return { ...e, arg: cs[0] };
    case "sum":
      return { ...e, terms: cs };
    case "prod":
      return { ...e, factors: cs };
    case "frac":
      return { ...e, num: cs[0], den: cs[1] };
    case "pow":
      return { ...e, base: cs[0], exp: cs[1] };
    case "log":
      return { ...e, base: cs[0], arg: cs[1] };
  }
}

/** Where a node lives: which side of the equation, and the child-index path to it. */
export type Loc = { side: number; path: number[] };

export function getAt(root: Expr, path: number[]): Expr {
  return path.reduce((e, i) => children(e)[i], root);
}

export function replaceAt(root: Expr, path: number[], f: (e: Expr) => Expr): Expr {
  if (path.length === 0) return f(root);
  const [i, ...rest] = path;
  const cs = children(root).slice();
  cs[i] = replaceAt(cs[i], rest, f);
  return withChildren(root, cs);
}

function findPath(e: Expr, id: string): number[] | null {
  if (e.id === id) return [];
  const cs = children(e);
  for (let i = 0; i < cs.length; i++) {
    const p = findPath(cs[i], id);
    if (p) return [i, ...p];
  }
  return null;
}

export function locate(state: MathState, id: string): Loc | null {
  for (let side = 0; side < state.sides.length; side++) {
    const path = findPath(state.sides[side], id);
    if (path) return { side, path };
  }
  return null;
}

export function nodeAt(state: MathState, loc: Loc): Expr {
  return getAt(state.sides[loc.side], loc.path);
}

export function parentLoc(loc: Loc): Loc | null {
  return loc.path.length === 0 ? null : { side: loc.side, path: loc.path.slice(0, -1) };
}

export function allNodes(e: Expr): Expr[] {
  return [e, ...children(e).flatMap(allNodes)];
}

export function mapTree(e: Expr, f: (e: Expr) => Expr): Expr {
  return f(withChildren(e, children(e).map((c) => mapTree(c, f))));
}
