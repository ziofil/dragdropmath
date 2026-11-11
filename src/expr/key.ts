import type { Expr, MathState } from "./types";

/**
 * How much order matters when comparing:
 * - false:   sums and products are multisets (`x + 2` ≡ `2 + x`)
 * - true:    the order of *terms* matters, factor order doesn't (`6y` ≡ `y·6`)
 *            — what "put these in order" puzzles mean
 * - "exact": every order matters (detecting whether a drop changed anything)
 */
export type Ordering = boolean | "exact";

/** Structural key, ignoring ids. */
export function key(e: Expr, ordered: Ordering = false): string {
  const list = (xs: Expr[], keepOrder: boolean) => {
    const ks = xs.map((x) => key(x, ordered));
    return (keepOrder ? ks : ks.sort()).join(",");
  };
  switch (e.kind) {
    case "num":
      return String(e.value);
    case "var":
      return e.name;
    case "neg":
      return `-(${key(e.arg, ordered)})`;
    case "sum":
      return `+(${list(e.terms, ordered !== false)})`;
    case "prod":
      return `*(${list(e.factors, ordered === "exact")})`;
    case "frac":
      return `/(${key(e.num, ordered)},${key(e.den, ordered)})`;
    case "pow":
      // Notation counts whenever order does: a goal of 2√x isn't met by 2·x^(1/2).
      return `${ordered !== false && e.radical ? "√" : ""}^(${key(e.base, ordered)},${key(e.exp, ordered)})`;
    case "const":
      return `#${e.name}`;
    case "log":
      return `log(${key(e.base, ordered)},${key(e.arg, ordered)})`;
  }
}

export function stateKey(s: MathState, ordered: Ordering = false): string {
  return s.sides.map((e) => key(e, ordered)).join(` ${s.rel ?? "="} `);
}

/** n if this is a root drawn as ⁿ√ (x^(1/n) with the radical flag), else null. */
export function rootIndex(e: Expr): number | null {
  if (e.kind !== "pow" || !e.radical) return null;
  const x = e.exp;
  return x.kind === "frac" && x.num.kind === "num" && x.num.value === 1 && x.den.kind === "num" ? x.den.value : null;
}

/** Plain-text rendering, mostly for tests and debugging. */
export function print(e: Expr): string {
  const wrap = (x: Expr, kinds: Expr["kind"][]) =>
    kinds.includes(x.kind) ? `(${print(x)})` : print(x);
  switch (e.kind) {
    case "num":
      return String(e.value);
    case "var":
      return e.name;
    case "neg":
      return `-${wrap(e.arg, ["sum", "neg"])}`;
    case "sum":
      return e.terms
        .map((t, i) =>
          t.kind === "neg" ? `${i ? " - " : "-"}${wrap(t.arg, ["sum", "neg"])}` : `${i ? " + " : ""}${print(t)}`,
        )
        .join("");
    case "prod":
      return e.factors.map((f) => wrap(f, ["sum", "neg", "frac"])).join("*");
    case "frac":
      return `${wrap(e.num, ["sum", "neg", "prod", "frac"])}/${wrap(e.den, ["sum", "neg", "prod", "frac"])}`;
    case "pow": {
      const n = rootIndex(e);
      if (n !== null) return n === 2 ? `√(${print(e.base)})` : `root_${n}(${print(e.base)})`;
      return `${wrap(e.base, ["sum", "neg", "prod", "frac", "pow", "log"])}^${wrap(e.exp, ["sum", "neg", "prod", "frac", "pow", "log"])}`;
    }
    case "const":
      return e.name;
    case "log":
      return e.base.kind === "const" ? `ln(${print(e.arg)})` : `log_${wrap(e.base, ["sum", "neg", "prod", "frac", "pow", "log"])}(${print(e.arg)})`;
  }
}

export function printState(s: MathState): string {
  return s.sides.map(print).join(` ${s.rel ?? "="} `);
}
