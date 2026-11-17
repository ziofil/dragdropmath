/**
 * A board's rows: the equations it holds, one under the other (x + y = 5;
 * x − y = 1, or x = 2 or x = −3). Row k is sides 2k and 2k + 1, its left side
 * first; one relation and one join for them all. Only this file knows that.
 */
import type { Expr, MathState } from "./types";

/** One row's two sides: [left, right]. */
export type Row = [Expr, Expr];

/** An equation (or several, in rows): an even number of sides. */
export const isEquation = (s: MathState) => s.sides.length >= 2 && s.sides.length % 2 === 0;

/** How many rows a board has (an expression has none). */
export const rowCount = (s: MathState) => s.sides.length >> 1;

/** The row side `side` is in (0, 1 → 0; 2, 3 → 1; …). */
export const rowOf = (side: number) => side >> 1;

/** The other side of the same row (0 ↔ 1, 2 ↔ 3, …). */
export const partner = (side: number) => side ^ 1;

/** Is side `side` its row's left one? */
export const isLeft = (side: number) => side % 2 === 0;

/** Where row k's sides are: [left, right]. */
export const sidesOf = (k: number): [number, number] => [2 * k, 2 * k + 1];

/** Row k's two sides. */
export const rowAt = (s: MathState, k: number): Row => [s.sides[2 * k], s.sides[2 * k + 1]];

/** Each row's two sides: x = 3; y = 2 → [x, 3], [y, 2]. */
export function rows(s: MathState): Row[] {
  const out: Row[] = [];
  for (let k = 0; k + 1 < s.sides.length; k += 2) out.push([s.sides[k], s.sides[k + 1]]);
  return out;
}

/** A board of these rows, all at once (x = 3; y = 2) or either (x = 2 or x = −3). */
export const fromRows = (rs: Row[], join: "and" | "or"): MathState => ({ sides: rs.flat(), join });

/** The board with these rows for its own. */
export const withRows = (s: MathState, rs: Row[]): MathState => ({ ...s, sides: rs.flat() });

/** The board with row k's sides now `left` and `right`. */
export function withRow(s: MathState, k: number, [left, right]: Row): MathState {
  const sides = s.sides.slice();
  [sides[2 * k], sides[2 * k + 1]] = [left, right];
  return { ...s, sides };
}

/** The board with row k replaced by these rows, joined by "or": x² = 9 → x = 3 or x = −3. */
export function intoRows(s: MathState, k: number, rs: Row[]): MathState {
  return fromRows([...rows(s).slice(0, k), ...rs, ...rows(s).slice(k + 1)], "or");
}

/** Each row of a board as a board of its own, with the relation; an expression is one row. */
export function rowsOf(s: MathState): MathState[] {
  if (s.sides.length <= 2) return [s];
  return rows(s).map((r) => ({ sides: r, rel: s.rel }));
}
