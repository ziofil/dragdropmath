import type { Expr, MathState } from "./types";
import { rows } from "./rows";

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
/**
 * Keys are asked for again and again (every move compares states, every
 * search dedupes them), and an expression never changes: each one's key is
 * worked out once per way of keying it, then kept.
 */
const keys = new WeakMap<Expr, Map<string, string>>();

export function key(e: Expr, ordered: Ordering = false, notation = ordered !== false): string {
  const how = `${ordered}${notation}`;
  let byHow = keys.get(e);
  if (!byHow) keys.set(e, (byHow = new Map()));
  let made = byHow.get(how);
  if (made === undefined) byHow.set(how, (made = keyOf(e, ordered, notation)));
  return made;
}

function keyOf(e: Expr, ordered: Ordering, notation: boolean): string {
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
      // A bracket kept for a moment (Sum.grouped) is a state of its own: tidying lets it go.
      return `${e.grouped ? "()" : ""}+(${list(e.terms, ordered !== false)})`;
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

/** Each row's sides with their relation, rows joined by ; (all at once) or "or" (either). */
function joinRows(s: MathState, f: (e: Expr) => string): string {
  const row = (sides: Expr[]) => sides.map(f).join(` ${s.rel ?? "="} `);
  if (s.sides.length <= 2) return row(s.sides);
  return rows(s).map(row).join(s.join === "or" ? " or " : " ; ");
}

/** n if this exponent is 1/n (n ≥ 2): a power that can be written as a root. */
export function rootOrder(x: Expr): number | null {
  return x.kind === "frac" && x.num.kind === "num" && x.num.value === 1 && x.den.kind === "num" && x.den.value >= 2 ? x.den.value : null;
}

/** n if this is a root drawn as ⁿ√ (x^(1/n) with the radical flag), else null. */
export const rootIndex = (e: Expr): number | null => (e.kind === "pow" && e.radical ? rootOrder(e.exp) : null);

/** Plain-text rendering, mostly for tests and debugging. */
export function print(e: Expr): string {
  // (A bracket held for a moment, Sum.grouped, prints its own brackets.)
  const wrap = (x: Expr, kinds: Expr["kind"][]) =>
    kinds.includes(x.kind) && !(x.kind === "sum" && x.grouped) ? `(${print(x)})` : print(x);
  switch (e.kind) {
    case "num":
      return String(e.value);
    case "var":
      return e.name;
    case "neg":
      return `-${wrap(e.arg, ["sum", "neg"])}`;
    case "sum": {
      const inner = e.terms
        .map((t, i) =>
          t.kind === "neg" ? `${i ? " - " : "-"}${wrap(t.arg, ["sum", "neg"])}` : `${i ? " + " : ""}${print(t)}`,
        )
        .join("");
      return e.grouped ? `(${inner})` : inner;
    }
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
  const where = s.conditions?.length ? ` where ${s.conditions.map((c) => `${print(c.sides[0])} ${c.rel} ${print(c.sides[1])}`).join(", ")}` : "";
  return joinRows(s, print) + where;
}
