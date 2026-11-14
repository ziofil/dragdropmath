import type { Expr, MathState } from "./types";

/**
 * How much order matters when comparing:
 * - false:   sums and products are multisets (`x + 2` ≡ `2 + x`)
 * - true:    the order of *terms* matters, factor order doesn't (`6y` ≡ `y·6`)
 *            — what "put these in order" puzzles mean
 * - "exact": every order matters (detecting whether a drop changed anything)
 */
export type Ordering = boolean | "exact";

/**
 * Structural key, ignoring ids. `notation`: whether √x and x^(1/2) differ
 * (they do whenever order counts; a search wants them apart always, so as
 * not to lose the move between them).
 */
export function key(e: Expr, ordered: Ordering = false, notation = ordered !== false): string {
  const k = (x: Expr) => key(x, ordered, notation);
  const list = (xs: Expr[], keepOrder: boolean) => {
    const ks = xs.map(k);
    return (keepOrder ? ks : ks.sort()).join(",");
  };
  switch (e.kind) {
    case "num":
      return String(e.value);
    case "var":
      return e.name;
    case "neg":
      return `-(${k(e.arg)})`;
    case "sum":
      return `+(${list(e.terms, ordered !== false)})`;
    case "prod":
      return `*(${list(e.factors, ordered === "exact")})`;
    case "frac":
      return `/(${k(e.num)},${k(e.den)})`;
    case "pow":
      // Notation counts whenever order does: a goal of 2√x isn't met by 2·x^(1/2).
      return `${notation && e.radical ? "√" : ""}^(${k(e.base)},${k(e.exp)})`;
    case "const":
      return `#${e.name}`;
    case "log":
      return `log(${k(e.base)},${k(e.arg)})`;
  }
}

export function stateKey(s: MathState, ordered: Ordering = false, notation = ordered !== false): string {
  return joinRows(s, (e) => key(e, ordered, notation));
}

/** Each row's sides with their relation, rows joined by ;. */
function joinRows(s: MathState, f: (e: Expr) => string): string {
  const row = (k: number) => s.sides.slice(k, k + 2).map(f).join(` ${s.rel ?? "="} `);
  if (s.sides.length <= 2) return row(0);
  const rows = [];
  for (let k = 0; k < s.sides.length; k += 2) rows.push(row(k));
  return rows.join(" ; ");
}

/** n if this exponent is 1/n (n ≥ 2): a power that can be written as a root. */
export function rootOrder(x: Expr): number | null {
  return x.kind === "frac" && x.num.kind === "num" && x.num.value === 1 && x.den.kind === "num" && x.den.value >= 2 ? x.den.value : null;
}

/** n if this is a root drawn as ⁿ√ (x^(1/n) with the radical flag), else null. */
export const rootIndex = (e: Expr): number | null => (e.kind === "pow" && e.radical ? rootOrder(e.exp) : null);

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
  return joinRows(s, print);
}
