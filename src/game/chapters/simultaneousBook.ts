/**
 * Simultaneous equations as the book's hardest have them (Matematica C3,
 * Algebra 1, systems), each built back from a whole-number answer and given
 * as the book solves it, a few milestones apart (generate/route.ts); the
 * moves write the way between (generate/way.ts). Both equations need tidying
 * before either letter can be put into the other:
 *
 * - one over numbers, (x + 1)/2 + (y − 1)/3 = 3: its bottoms cleared,
 *   multiplied out, gathered (3x + 2y = 17);
 * - the other with squares that cancel, (x + 2)² − x(x + 1) = y + 4, or a
 *   product of the letters that cancels, (x + 1)(y − 3) − xy = 2: multiplied
 *   out, y on its own (y = 3x + 2);
 *
 * then y put into the first, x found, and y from it.
 */
import { linear, written } from "../generate/poly";
import { routed } from "../generate/route";
import { letterPair, one, type Draft, type Shape } from "../generate/write";

/** (x + a) as written, in brackets. */
const br = (x: string, a: number) => `(${written(linear(1, a, x))})`;

/** "3x", "x", "-x": a letter with its number (1 left out). */
const of = (k: number, x: string) => `${k === 1 ? "" : k === -1 ? "-" : k}${x}`;

/** a·x + b·y (+ c) as written: "3x - 2y + 1". */
const sumOf = (...ts: [number, string][]) =>
  ts
    .filter(([k]) => k !== 0)
    .map(([k, v], i) => {
      const body = v ? of(Math.abs(k), v) : String(Math.abs(k));
      return i === 0 ? (k < 0 ? `-${body}` : body) : `${k < 0 ? " - " : " + "}${body}`;
    })
    .join("") || "0";

/** Both equations tidied, then one put into the other: the second with squares that cancel, or a product of the letters. */
const tidyBoth = (id: string, squares: boolean): Shape => ({
  id,
  name: squares ? "both tidied, squares that cancel in one" : "both tidied, a product of the letters that cancels in one",
  make: (r): Draft | null => {
    const [x, y] = letterPair(r);
    const [x0, y0] = [r.signed(1, 6), r.signed(1, 6)];
    // (x + a)/m + (y + b)/n = c: x + a and y + b multiples of m and n at the answer.
    const [m, n] = one(r, [[2, 3], [3, 2], [2, 5], [5, 2], [3, 4], [4, 3], [2, 3]] as const);
    const [k1, k2] = [r.signed(1, 3), r.signed(1, 3)];
    const [a, b] = [k1 * m - x0, k2 * n - y0];
    if (a === 0 || b === 0 || Math.abs(a) > 6 || Math.abs(b) > 6) return null;
    const c = k1 + k2;
    // Cleared, multiplied out, gathered: nx + my = K.
    const K = m * n * c - n * a - m * b;
    // The other: multiplied out it's y = sx + e.
    let second: string, out: string, s: number, e: number;
    if (squares) {
      // (x + p)² − x(x + q) = y + d: (2p − q)x + p² = y + d.
      const [p, q] = [r.signed(1, 4), r.signed(1, 5)];
      s = 2 * p - q;
      const d = s * x0 + p * p - y0;
      if (d === 0 || Math.abs(d) > 20) return null;
      e = p * p - d;
      second = `${br(x, p)}^2 - ${x}${br(x, q)} = ${y}${d < 0 ? " - " : " + "}${Math.abs(d)}`;
      out = `${sumOf([s, x], [p * p, ""])} = ${y}${d < 0 ? " - " : " + "}${Math.abs(d)}`;
    } else {
      // (x + p)(y + q) − xy = d with p = 1: qx + y + q = d (the xy cancels).
      const q = r.signed(1, 5);
      s = -q;
      const d = q * x0 + y0 + q;
      if (d === 0 || Math.abs(d) > 20) return null;
      e = d - q;
      second = `${br(x, 1)}${br(y, q)} - ${x}${y} = ${d}`;
      out = `${sumOf([q, x], [1, y], [q, ""])} = ${d}`;
    }
    if (s === 0 || Math.abs(s) > 6 || e === 0) return null;
    // y put into nx + my = K: (n + ms)x = K − me.
    const A = n + m * s;
    if (A === 0 || A * x0 !== K - m * e) return null;
    const sy = sumOf([s, x], [e, ""]);
    const eq1 = `${br(x, a)}/${m} + ${br(y, b)}/${n} = ${c}`;
    const swap = r.next() < 0.5;
    const pair = (p: string, q: string) => (swap ? `${q} ; ${p}` : `${p} ; ${q}`);
    const tidy1 = `${sumOf([n, x], [m, y])} = ${K}`;
    return routed(
      id,
      pair(eq1, second),
      [
        // The bottoms carried across one at a time (3·(x − 4)/3 is x − 4 straight away), what's left multiplied out.
        [["clear", "expand", "gather"], pair(tidy1, second)],
        ["expand", pair(tidy1, out)],
        [["gather", "isolate"], pair(tidy1, `${y} = ${sy}`)],
        ["substitute", pair(`${of(n, x)} + ${m}(${sy}) = ${K}`, `${y} = ${sy}`)],
        [["expand", "gather", "isolate"], pair(`${x} = ${x0}`, `${y} = ${sy}`)],
      ],
      pair(`${x} = ${x0}`, `${y} = ${y0}`),
      ["substitute", "isolate", "expand"],
    );
  },
});

export const SIMULTANEOUS_BOOK: Shape[] = [tidyBoth("tidy-both-squares", true), tidyBoth("tidy-both-product", false)];
