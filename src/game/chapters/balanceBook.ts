/**
 * Solving equations as the book's hardest first-degree exercises have them
 * (Matematica C3, Algebra 1, equations), each built back from a whole-number
 * answer and given as the book solves it, a few milestones apart
 * (generate/route.ts); the moves write the way between (generate/way.ts):
 *
 * - squares over numbers: (x + 1)²/2 − (x − 1)(x + 3)/3 = (x² + 4x + 5)/6,
 *   every bottom cleared, multiplied out, the squares cancel;
 * - a root equal to a bracket: √(x² + 9) = x + 1, squared, the squares cancel
 *   (an answer that makes x + 1 negative is crossed out).
 *
 * (Bottoms with the letter in them come with Quadratic equations, which
 * carries them across: quadraticBook.ts.)
 */
import { add, linear, mono, mul, scale, written, type Poly } from "../generate/poly";
import { routed } from "../generate/route";
import { gcd, one, type Draft, type Rng, type Shape } from "../generate/write";

const letter = (r: Rng) => (r.next() < 0.8 ? "x" : one(r, ["t", "y", "a"]));

/** (x + a) as written, in brackets. */
const br = (x: string, a: number) => `(${written(linear(1, a, x))})`;

/** "3", "", "-": a number in front of something (1 left out). */
const times = (k: number) => (k === 1 ? "" : k === -1 ? "-" : String(k));

/** " + 3·…", " - 3·…": a term written after something. */
const then = (k: number, what: string) => `${k < 0 ? " - " : " + "}${times(Math.abs(k))}${what}`;

const small = (p: Poly, most: number) => [...p.values()].every((t) => Math.abs(t.c) <= most);

export const squaresOverNumbers: Shape = {
  id: "squares-over-numbers",
  name: "squares over numbers: every bottom cleared, the squares cancel",
  make: (r): Draft | null => {
    // (x + a)²/m − (x + b)(x + c)/n = (kx² + px + q)/L, L = lcm(m, n): times L, u(x + a)² − v(x + b)(x + c) = kx² + px + q
    // with k = u − v, the squares cancel; αx = β.
    const x = letter(r);
    const [m, n] = one(r, [[2, 3], [3, 2], [2, 6], [3, 6], [4, 6], [6, 4], [3, 4], [4, 3]] as const);
    const L = (m * n) / gcd(m, n);
    const [u, v] = [L / m, L / n];
    const [a, b, c, x0] = [r.signed(1, 4), r.signed(1, 4), r.signed(1, 4), r.signed(1, 6)];
    if (b === c) return null;
    const A = mul(linear(1, a, x), linear(1, a, x));
    const B = mul(linear(1, b, x), linear(1, c, x));
    const left = add(scale(A, u), scale(B, -v));
    // The right side's x-term: what's left of x once moved across is α (not 0).
    const alpha = r.signed(1, 4);
    const lx = [...left.values()].find((t) => t.m[x] === 1)?.c ?? 0;
    const l0 = [...left.values()].find((t) => !t.m[x])?.c ?? 0;
    const p = lx - alpha;
    const q = alpha * x0 + l0;
    const right = add(mono(u - v, { [x]: 2 }), linear(p, q, x));
    // Not every top a multiple of L (then the right side is a whole one, not a fraction).
    const whole = [u - v, p, q].every((k) => k % L === 0);
    if (!small(right, 30) || !small(left, 40) || whole) return null;
    const start = `${br(x, a)}^2/${m} - (${br(x, b)}${br(x, c)})/${n} = (${written(right)})/${L}`;
    return routed(
      "squares-over-numbers",
      start,
      [
        ["clear", `${times(u)}${br(x, a)}^2 - ${times(v)}${br(x, b)}${br(x, c)} = ${written(right)}`],
        // Multiplied out a product at a time: the square (then the number in front), the two brackets (then theirs).
        ["expand", `${times(u)}(${written(A)}) - ${times(v)}${br(x, b)}${br(x, c)} = ${written(right)}`],
        ["expand", `${written(scale(A, u))} - ${times(v)}${br(x, b)}${br(x, c)} = ${written(right)}`],
        ["expand", `${written(scale(A, u))} - ${times(v)}(${written(B)}) = ${written(right)}`],
        ["expand", `${written(scale(A, u))} - (${written(scale(B, v))}) = ${written(right)}`],
        ["expand", `${written(left)} = ${written(right)}`],
        ["gather", `${written(linear(alpha, 0, x))} = ${alpha * x0}`],
      ],
      `${x} = ${x0}`,
    );
  },
};

export const rootSquaresCancel: Shape = {
  id: "root-squares-cancel",
  name: "a root equal to a bracket: squared, the squares cancel",
  make: (r): Draft | null => {
    // √P = L with P = L² + α(x − x0): squared, P = L², multiplied out the squares cancel, α(x − x0) = 0. The answer is one
    // where L ≥ 0 (it's what the root equals).
    const x = letter(r);
    const [s, d, x0, alpha] = [one(r, [1, 1, 2]), r.signed(1, 6), r.signed(1, 6), r.signed(1, 6)];
    const L = linear(s, d, x);
    if (s * x0 + d < 0) return null;
    const P = add(mul(L, L), linear(alpha, -alpha * x0, x));
    // Every term of what's under the root there (none cancelled to nothing), and small.
    if (P.size < 3 || [...P.values()].some((t) => t.c === 0) || !small(P, 40)) return null;
    const root = `√(${written(P)})`;
    // The root on its own, or with the letter's term beside it (moved there first).
    const start = r.next() < 0.5 ? `${root} = ${written(L)}` : `${root}${then(-s, x)} = ${d}`;
    return routed(
      "root-squares-cancel",
      start,
      [
        ["isolate", `${root} = ${written(L)}`],
        ["square", `${written(P)} = (${written(L)})^2`],
        ["expand", `${written(P)} = ${written(mul(L, L))}`],
        ["gather", `${written(linear(alpha, 0, x))} = ${alpha * x0}`],
      ],
      `${x} = ${x0}`,
    );
  },
};

export const BALANCE_BOOK: Shape[] = [squaresOverNumbers, rootSquaresCancel];
