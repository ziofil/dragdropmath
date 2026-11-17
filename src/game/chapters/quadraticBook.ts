/**
 * Quadratic equations as the book's hardest exercises have them (Matematica
 * C3, Algebra 2, chapters 3 and 8), each built back from whole-number
 * answers and given as the book solves it, a few milestones apart
 * (generate/route.ts); the moves write the way between (generate/way.ts):
 *
 * - a root and a term: get the root alone, square, a second-degree equation
 *   (√(25 − x²) + x = 7; an answer that makes 7 − x negative is crossed out);
 * - two roots: square, get the root that's left alone, square again
 *   (√(4x + 1) − √(x + 1) = 1 ...);
 * - powers of one bottom: 1/(x − 2) + b/(x − 2)² = c/(x − 2)³, its bottoms
 *   carried across (x ≠ 2);
 * - a cubic in pairs: x³ + 2x² − 9x − 18 = 0, x²(x + 2) − 9(x + 2) = 0;
 * - a quadratic in x²: x⁴ − 5x² + 4 = 0 (four answers);
 * - a quadratic in √x: x − 9√x + 8 = 0;
 * - bottoms that factor: 3/(x − 2) + 1/(x + 2) = (2x + 14)/(x² − 4), the last
 *   bottom factored, each cleared (x ≠ 2, x ≠ −2); or the letter on top too,
 *   x/(x − 2) − (x + 1)/(x + 2) = …/(x² − 4), the squares cancelling.
 */
import { add, fromAnswers, fromCoefs, linear, mul, scale, written, type Poly } from "../generate/poly";
import { routed } from "../generate/route";
import { one, type Draft, type Rng, type Shape } from "../generate/write";

const letter = (r: Rng) => (r.next() < 0.8 ? "x" : one(r, ["t", "y", "a"]));

/** (x − r1)(x − r2)… multiplied out. */
const fromRoots = (x: string, ...rs: number[]): Poly => fromAnswers(x, ...rs.map((v) => [v, 1] as const));

/** Each root's bracket, x − r (x for 0), side by side: (x − 3)(x + 2). */
const brackets = (x: string, ...rs: number[]) => rs.map((v) => (v === 0 ? x : `(${written(linear(1, -v, x))})`)).join("");

/** x = 3 or x = −2 (each once, in order). */
const answers = (x: string, vs: (number | string)[]) => [...new Set(vs.map(String))].map((v) => `${x} = ${v}`).join(" or ");

/** " + 3", " - 3": a number written after something. */
const plus = (n: number) => (n < 0 ? ` - ${-n}` : ` + ${n}`);

/** Every coefficient small enough to work with by hand. */
const small = (p: Poly, most = 60) => [...p.values()].every((t) => Math.abs(t.c) <= most);

/** (x + a) as written, in brackets. */
const br = (x: string, a: number) => `(${written(linear(1, a, x))})`;

/** "3", "", "-": a number in front of something (1 left out). */
const times = (k: number) => (k === 1 ? "" : k === -1 ? "-" : String(k));

/** " + 3·…", " - 3·…": a term written after something. */
const then = (k: number, what: string) => `${k < 0 ? " - " : " + "}${times(Math.abs(k))}${what}`;

const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

export const rootAndTerm: Shape = {
  id: "root-and-term",
  name: "a root and a term: the root alone, then squared",
  make: (r): Draft | null => {
    // √P = L with P = L² − k(x − r1)(x − r2): squared, L² − P = k(x − r1)(x − r2) = 0; an answer is one where L ≥ 0.
    const x = letter(r);
    const [r1, r2] = [r.signed(1, 6), r.signed(1, 6)];
    if (r1 === r2) return null;
    const [k, s, d] = [one(r, [2, 2, 3]), one(r, [1, -1]), r.signed(1, 9)];
    const L = linear(s, d, x);
    const q = fromRoots(x, r1, r2);
    const P = add(mul(L, L), scale(q, -k));
    if (!small(P, 25) || ![r1, r2].some((v) => s * v + d >= 0)) return null;
    const root = `√(${written(P)})`;
    // The root with the term beside it: √P − s·x = d (the letter's term moved to the root's side).
    const start = r.next() < 0.3 ? `${d} = ${root}${s === 1 ? " - " : " + "}${x}` : `${root}${s === 1 ? " - " : " + "}${x} = ${d}`;
    return routed(
      "root-and-term",
      start,
      [
        ["isolate", `${root} = ${written(L)}`],
        ["square", `${written(P)} = (${written(L)})^2`],
        ["expand", `${written(P)} = ${written(mul(L, L))}`],
        ["gather", `0 = ${written(scale(q, k))}`],
        ["factor", `0 = ${brackets(x, r1, r2)}`],
      ],
      answers(x, [r1, r2]),
      "split",
    );
  },
};

export const twoRoots: Shape = {
  id: "two-roots",
  name: "two roots: squared, the root that's left alone, squared again",
  make: (r): Draft | null => {
    // √A = √B + c. Squared: A = B + 2c√B + c², so 2c·w = 2c√B with w = A − B − c² over 2c; squared again
    // (where w ≥ 0): w² = B, built as w² − B = (x − x0)(x − x1). An answer is one where w ≥ 0.
    const x = letter(r);
    const [x0, x1, e, c] = [r.int(-3, 8), r.int(-3, 8), r.signed(0, 5), r.int(1, 3)];
    if (x0 === x1 || x0 + e < 0) return null;
    const w = linear(1, e, x);
    const B = add(mul(w, w), scale(fromRoots(x, x0, x1), -1));
    const A = add(add(B, scale(w, 2 * c)), linear(0, c * c, x));
    const deg1 = (p: Poly) => [...p.values()].some((t) => (t.m[x] ?? 0) === 1 && t.c !== 0);
    if (!deg1(A) || !deg1(B) || !small(A, 30) || !small(B, 30)) return null;
    const [ra, rb] = [`√(${written(A)})`, `√(${written(B)})`];
    const start = one(r, [`${ra} - ${rb} = ${c}`, `${ra} = ${rb} + ${c}`, `${c} + ${rb} = ${ra}`]);
    return routed(
      "two-roots",
      start,
      [
        ["isolate", `${ra} = ${rb} + ${c}`],
        ["square", `${written(A)} = (${rb} + ${c})^2`],
        // Multiplied out as the moves write it: √B·√B is B, the two 3√B together.
        ["expand", `${written(A)} = ${written(B)} + ${2 * c}${rb} + ${c * c}`],
        ["gather", `${written(scale(w, 2 * c))} = ${2 * c}${rb}`],
        ["isolate", `${written(w)} = ${rb}`],
        ["square", `(${written(w)})^2 = ${written(B)}`],
        ["expand", `${written(mul(w, w))} = ${written(B)}`],
        ["gather", `${written(fromRoots(x, x0, x1))} = 0`],
        ["factor", `${brackets(x, x0, x1)} = 0`],
      ],
      answers(x, [x0, x1]),
      "split",
    );
  },
};

export const bottomPowers: Shape = {
  id: "bottom-powers",
  name: "powers of one bottom",
  make: (r): Draft | null => {
    // 1/(x − p) + b/(x − p)² = c/(x − p)³ where x ≠ p: times (x − p)³, (x − p)² + b(x − p) = c, a second-degree
    // equation in x − p, its answers t1, t2 (neither 0): x = p + t.
    const x = letter(r);
    const [p, t1, t2] = [r.signed(1, 5), r.signed(1, 5), r.signed(1, 5)];
    if (t1 === t2) return null;
    const [b, c] = [-(t1 + t2), -t1 * t2];
    if (b === 0) return null;
    const bottom = `(${written(linear(1, -p, x))})`;
    const twoBottoms = r.next() < 0.4;
    // Or one power less: 1 + b/(x − p) = c/(x − p)².
    const over = (k: number, power: string) => `${k < 0 ? " - " : " + "}${Math.abs(k)}/${bottom}${power}`;
    const start = twoBottoms ? `1${over(b, "")} = ${c}/${bottom}^2` : `1/${bottom}${over(b, "^2")} = ${c}/${bottom}^3`;
    const q = fromRoots(x, p + t1, p + t2);
    const P = linear(1, -p, x);
    return routed(
      "bottom-powers",
      start,
      [
        ["clear", `${bottom}^2${b < 0 ? " - " : " + "}${Math.abs(b) === 1 ? "" : Math.abs(b)}${bottom} = ${c}`],
        ["expand", `${written(add(mul(P, P), scale(P, b)))} = ${c}`],
        ["gather", `${written(q)} = 0`],
        ["factor", `${brackets(x, p + t1, p + t2)} = 0`],
      ],
      answers(x, [p + t1, p + t2]),
      "split",
    );
  },
};

export const inPairs: Shape = {
  id: "in-pairs",
  name: "a cubic: factored in pairs",
  make: (r): Draft | null => {
    // (x + a)(x² − n) = x³ + ax² − nx − an: in pairs x²(x + a) − n(x + a), then (x + a)(x² − n); x² = n has ±√n.
    const x = letter(r);
    const [a, n] = [r.signed(1, 6), one(r, [1, 4, 9, 16, 25, 4, 9, 2, 3, 5])];
    const b = Math.sqrt(n);
    if (isSquare(n) && (a === b || a === -b)) return null;
    const cubic = fromCoefs([-a * n, -n, a, 1], x);
    const roots: string[] = [String(-a), ...(isSquare(n) ? [String(b), String(-b)] : [`√${n}`, `-√${n}`])];
    const pair = `(${written(linear(1, a, x))})`;
    return routed(
      "in-pairs",
      `${written(cubic)} = 0`,
      [
        ["factor", `${x}^2${pair} - ${n === 1 ? "" : n}${pair} = 0`],
        ["factor", `${pair}(${x}^2${plus(-n)}) = 0`],
        ["split", `${x} = ${-a} or ${x}^2 = ${n}`],
      ],
      answers(x, roots),
      "square",
    );
  },
};

export const inSquares: Shape = {
  id: "in-squares",
  name: "a quadratic in x²",
  make: (r): Draft | null => {
    // (x² − m)(x² − n) = x⁴ − (m + n)x² + mn: split as any second-degree equation, its letter x²; x² = m has ±√m.
    const x = letter(r);
    const [m, n] = [one(r, [1, 4, 9, 16, 25, 36]), one(r, [1, 4, 9, 16, 2, 3, 5])];
    if (m === n || (!isSquare(m) && !isSquare(n))) return null;
    const both = (v: number) => (isSquare(v) ? [String(Math.sqrt(v)), String(-Math.sqrt(v))] : [`√${v}`, `-√${v}`]);
    return routed(
      "in-squares",
      `${x}^4 - ${m + n}${x}^2 + ${m * n} = 0`,
      [
        ["factor", `(${x}^2 - ${m})(${x}^2 - ${n}) = 0`],
        ["split", `${x}^2 = ${m} or ${x}^2 = ${n}`],
      ],
      answers(x, [...both(m), ...both(n)]),
      "square",
    );
  },
};

export const inRoots: Shape = {
  id: "in-roots",
  name: "a quadratic in √x",
  make: (r): Draft | null => {
    // (√x − a)(√x − b) = x − (a + b)√x + ab where x ≥ 0: √x = a or √x = b, squared.
    const x = letter(r);
    const [a, b] = [r.int(1, 7), r.int(1, 7)];
    if (a === b) return null;
    const rx = `√(${x})`;
    const start = r.next() < 0.5 ? `${x} - ${a + b}${rx} + ${a * b} = 0` : `${x} + ${a * b} = ${a + b}${rx}`;
    return routed(
      "in-roots",
      start,
      [
        ["gather", `${x} - ${a + b}${rx} + ${a * b} = 0`],
        ["factor", `(${rx} - ${a})(${rx} - ${b}) = 0`],
        ["split", `${rx} = ${a} or ${rx} = ${b}`],
      ],
      answers(x, [a * a, b * b]),
      "square",
    );
  },
};

export const bottomsThatFactor: Shape = {
  id: "bottoms-that-factor",
  name: "bottoms that factor: the shared bottom factored, each bottom cleared",
  make: (r): Draft | null => {
    // a/(x − p) + b/(x + p) = (cx + d)/(x² − p²) where x ≠ ±p: x² − p² = (x − p)(x + p), times it: a(x + p) + b(x − p) = cx + d.
    // Or the letter on top: x/(x − p) − (x + e)/(x + p): x(x + p) − (x + e)(x − p) = cx + d, the squares cancel.
    const x = letter(r);
    const [p, x0] = [r.int(1, 5), r.signed(1, 7)];
    if (Math.abs(x0) === p) return null;
    const onTop = r.next() < 0.5;
    const [a, b, e] = [r.int(1, 5), r.signed(1, 4), r.signed(1, 5)];
    // What's over the shared bottom once each top takes the other's bottom.
    const left = onTop
      ? add(mul(linear(1, 0, x), linear(1, p, x)), mul(linear(1, e, x), linear(1, -p, x)), -1)
      : add(scale(linear(1, p, x), a), scale(linear(1, -p, x), b));
    const lx = [...left.values()].find((t) => t.m[x] === 1)?.c ?? 0;
    const l0 = [...left.values()].find((t) => !t.m[x])?.c ?? 0;
    const alpha = r.signed(1, 3);
    const [c, d] = [lx - alpha, alpha * x0 + l0];
    if (c === 0 || d === 0 || Math.abs(c) > 9 || Math.abs(d) > 30 || (onTop && e === 0) || (onTop && e === -p)) return null;
    const top = written(linear(c, d, x));
    const tops = onTop ? `${x}/${br(x, -p)} - ${br(x, e)}/${br(x, p)}` : `${a}/${br(x, -p)}${b < 0 ? " - " : " + "}${Math.abs(b)}/${br(x, p)}`;
    const start = `${tops} = (${top})/(${x}^2 - ${p * p})`;
    const cleared = onTop ? `${x}${br(x, p)} - ${br(x, e)}${br(x, -p)}` : `${times(a)}${br(x, p)}${then(b, br(x, -p))}`;
    return routed(
      "bottoms-that-factor",
      start,
      [
        ["factor", `${tops} = (${top})/(${br(x, -p)}${br(x, p)})`],
        ["clear", `${cleared} = ${top}`],
        ["expand", `${written(left)} = ${top}`],
        ["gather", `${written(linear(alpha, 0, x))} = ${alpha * x0}`],
      ],
      `${x} = ${x0}`,
    );
  },
};

export const BOOK_SHAPES: Shape[] = [rootAndTerm, twoRoots, bottomPowers, inPairs, inSquares, inRoots, bottomsThatFactor];
