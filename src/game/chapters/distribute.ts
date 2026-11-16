/**
 * The distributive law: one chapter, its lesson (a board per move) and its
 * practice — multiplying out brackets (taking a factor out is Factoring).
 * Each shape picks its pieces and numbers; the answer and the way to it are
 * worked out from them (../generate/composeExpr.ts).
 */
import type { Chapter } from "../puzzles";
import { composedExpression, expression, lin, nested, P, product, term, times, type Piece } from "../generate/composeExpr";
import { gcd, one, type Level, type Rng, type Shape, letter as anyLetter, one as pick } from "../generate/write";
import { d } from "../generate/drill";

const letter = (r: Rng) => one(r, ["x", "y", "a", "b"]);
const pair = (r: Rng) => one(r, [["x", "y"], ["a", "b"]] as const);

/** A shape whose pieces (in this order) are picked by `pieces`; null: these numbers don't make a nice one. */
const shape = (id: string, name: string, pieces: (r: Rng) => Piece[] | null): Shape => ({
  id,
  name,
  make: (r) => {
    const ps = pieces(r);
    return ps && expression(id, ps, r);
  },
});

const expand = shape("expand", "multiply out one bracket", (r) => {
  const v = letter(r);
  const n = r.signed(1, 6);
  const k = r.next() < 0.25 ? -1 : r.int(2, 6);
  if (Math.abs(k * n) > 30) return null;
  // a(b + c) → ab + ac, now and then.
  if (k > 0 && r.next() < 0.15) {
    const [a, b, c] = one(r, [["a", "b", "c"], ["x", "y", "z"]]);
    return [times(1, a, P(`${b} + ${c}`))];
  }
  return [times(k, "", lin(1, n, v))];
});

const expandCancel = shape("expand-cancel", "multiply out, and a term cancels", (r) => {
  const [a, b] = pair(r);
  const k = r.int(2, 6);
  const n = r.int(1, 6);
  if (k * n > 20) return null;
  return one(r, [
    // 3(y + 4) − 12 → 3y
    [times(k, "", P(`${b} + ${n}`)), term(-k * n)],
    // 2(a + b) − 2a → 2b
    [times(k, "", P(`${a} + ${b}`)), term(-k, a)],
    // x(y + 2) − xy → 2x
    [times(1, a, P(`${b} + ${n}`)), term(-1, `${a}${b}`)],
  ]);
});

const expandAndAdd = shape("expand-and-add", "multiply out, then add like terms", (r) => {
  // 3(2x + 1) + x − 5 → 7x − 2
  const v = letter(r);
  const [k, m, n, p, q] = [r.int(2, 5), r.int(2, 4), r.signed(1, 6), r.signed(1, 5), r.signed(1, 9)];
  if (k * m + p <= 0 || k * m > 12 || k * n + q === 0 || gcd(m, n) > 1) return null;
  return [times(k, "", lin(m, n, v)), term(p, v), term(q)];
});

const simpleBrackets = shape("simple-brackets", "two simple brackets", (r) => {
  // 2(x + 1) + 3(x − 1) → 5x − 1
  const v = letter(r);
  const [a, b, c, d] = [r.int(2, 5), r.signed(1, 5), r.int(2, 4) * (r.next() < 0.5 ? -1 : 1), r.signed(1, 5)];
  if (a + c <= 0 || b === d || a * b + c * d === 0 || Math.abs(a * b + c * d) > 20) return null;
  return [times(a, "", lin(1, b, v)), times(c, "", lin(1, d, v))];
});

const square = shape("square", "a letter times a bracket, and a number times one", (r) => {
  // x(x + 2) + 3(x + 2) → x² + 5x + 6
  const v = one(r, ["x", "y", "a"]);
  const n = r.signed(1, 5);
  const m = r.signed(2, 5);
  const e = r.next() < 0.5 ? n : r.signed(1, 5);
  if (n + m === 0) return null;
  return [times(1, v, lin(1, n, v)), times(m, "", lin(1, e, v))];
});

const twoBrackets = shape("two-brackets", "two brackets with a number times the letter inside", (r) => {
  // 3(2x + 1) − 2(x − 3) → 4x + 9: always taken away, the signs in the second turn round.
  const v = letter(r);
  const [a, m, b, c, n, d] = [r.int(2, 4), r.int(2, 3), r.signed(1, 5), r.int(2, 4), r.int(2, 3), r.signed(1, 5)];
  const [xs, ns] = [a * m - c * n, a * b - c * d];
  if (xs <= 0 || ns === 0 || Math.abs(ns) > 20 || (m === n && b === d) || gcd(m, b) > 1 || gcd(n, d) > 1) return null;
  return [times(a, "", lin(m, b, v)), times(-c, "", lin(n, d, v))];
});

const twoLetters = shape("two-letters", "two brackets with two letters", (r) => {
  // 2(3a + b) − 3(a − 2b) → 3a + 8b
  const [a, b] = pair(r);
  const [p, m, n, q, u, w] = [r.int(2, 4), r.int(1, 3), r.signed(1, 3), r.int(2, 3), r.int(1, 3), r.signed(1, 3)];
  if ((m === u && n === w) || Math.abs(m * n) === 1 || Math.abs(u * w) === 1) return null;
  if (p * n - q * w === 0 || p * m - q * u <= 0 || gcd(m, n) > 1 || gcd(u, w) > 1) return null;
  const br = (k: number, l: number) => P(`${k}${a} + ${l}${b}`.replace("+ -", "- "));
  return [times(p, "", br(m, n)), times(-q, "", br(u, w))];
});

const letterBrackets = shape("letter-brackets", "a number and a letter in front of each bracket", (r) => {
  // 3x(x + 2) − 2x(x + 1) → x² + 4x
  const v = one(r, ["x", "y", "a"]);
  const p = r.int(2, 4);
  const q = r.int(1, p - 1);
  const [b, c] = [r.signed(1, 4), r.signed(1, 4)];
  if (p * b - q * c === 0 || b === c) return null;
  return [times(p, v, lin(1, b, v)), times(-q, v, lin(1, c, v))];
});

const productsAndBrackets = shape("products-and-brackets", "products to work out, brackets to multiply out, like terms to add", (r) => {
  // 2·3(x − 2y) − 2(3x + 5y) + 2·x·3 → …
  const [a, b] = pair(r);
  const [p, q] = one(r, [[2, 2], [2, 3], [3, 2], [2, 4], [3, 3]] as const);
  const [n, m, w, z] = [r.signed(2, 3), r.int(2, 5), r.signed(2, 6), r.int(2, 3)];
  const [g, h] = one(r, [[2, 2], [2, 3], [3, 2]] as const);
  const ka = p * q - z * m + g * h;
  const kb = p * q * n - z * w;
  if (ka <= 0 || kb === 0 || Math.abs(kb) > 20) return null;
  return [times(p * q, "", P(`${a} + ${n}${b}`.replace("+ -", "- ")), [p, q]), times(-z, "", P(`${m}${a} + ${w}${b}`.replace("+ -", "- "))), product(g * h, a, `${g}·${a}·${h}`)];
});

const threeBrackets = shape("three-brackets", "three brackets, two letters, minus signs", (r) => {
  // −(2a − 3b) + 3(a − b) − 2(2a + b)
  const [a, b] = pair(r);
  const br = () => [r.int(1, 3), r.signed(1, 3)] as const;
  const [[c1, d1], [c2, d2], [c3, d3]] = [br(), br(), br()];
  const [p, q] = [r.int(2, 4), r.int(2, 3)];
  if (Math.abs(c2) + Math.abs(d2) < 3 || Math.abs(c3) + Math.abs(d3) < 3) return null;
  if (-c1 + p * c2 - q * c3 <= 0 || -d1 + p * d2 - q * d3 === 0 || gcd(c2, d2) > 1 || gcd(c3, d3) > 1) return null;
  const inner = (c: number, d: number) => P(`${c}${a} + ${d}${b}`.replace("+ -", "- "));
  return [times(-1, "", inner(c1, d1)), times(p, "", inner(c2, d2)), times(-q, "", inner(c3, d3))];
});

const squareBrackets = shape("square-brackets", "a square made and taken away again", (r) => {
  // 2x(x + 1) − 3(x − 2) − (2x² − 5x) → 4x + 6
  const v = one(r, ["x", "y", "a"]);
  const [n, m, e, f, j] = [r.signed(1, 5), r.int(2, 4), r.signed(1, 5), r.signed(1, 6), r.int(2, 3)];
  if (j * n - m - f <= 0 || f === n || m * e > 20) return null;
  return [times(j, v, lin(1, n, v)), times(-m, "", lin(1, e, v)), times(-1, "", P(`${j}${v}^2 + ${f}${v}`.replace("+ -", "- ")))];
});

const numberMinusBracket = shape("number-minus-bracket", "a number minus a bracket, a product, another bracket", (r) => {
  // 4 − 3(2 − x) + 2·x·3 − 2(x + 1) → 7x − 4
  const v = letter(r);
  const [c, p, q, u, d] = [r.int(2, 12), r.int(2, 5), r.int(1, 5), r.int(2, 4), r.signed(1, 5)];
  const [g, h] = one(r, [[2, 2], [2, 3], [3, 2], [2, 4]] as const);
  if (p + g * h - u <= 0 || c - p * q - u * d === 0 || c - p * q === 0) return null;
  return [term(c), times(-p, "", lin(-1, q, v, true)), product(g * h, v, `${g}·${v}·${h}`), times(-u, "", lin(1, d, v))];
});

// ---------- hard: a bracket inside a bracket, with x and y ----------

const bracketInBracket = shape("bracket-in-bracket", "a bracket inside a bracket, with x and y", (r) => {
  // a(x + b(x − y)) + cy
  const [a, b, c] = [r.int(2, 3), r.int(2, 3), r.int(1, 9)];
  if (c === a * b) return null;
  return [nested(a, "", P("x"), b, P("x - y")), term(c, "y")];
});

const minusBracketInBracket = shape("minus-bracket-in-bracket", "a minus in front of a bracket with a bracket inside", (r) => {
  // x − (ay − b(x − y))
  const [a, b] = [r.int(1, 4), r.int(2, 4)];
  return [term(1, "x"), nested(-1, "", P(`${a}y`), -b, P("x - y"))];
});

const letterTimesNested = shape("letter-times-nested", "x times a bracket with a bracket inside", (r) => [nested(1, "x", P("y"), r.int(2, 5), P("x - y"))]);

const levels = (): Record<Level, Shape[]> => ({
  easy: [expand, expandCancel, expandAndAdd, simpleBrackets, square, composedExpression("distribute", "easy", 4)],
  medium: [twoBrackets, twoLetters, letterBrackets, composedExpression("distribute", "medium", 4)],
  hard: [productsAndBrackets, threeBrackets, squareBrackets, numberMinusBracket, bracketInBracket, minusBracketInBracket, letterTimesNested, composedExpression("distribute", "hard", 4)],
});

export const distribute: Chapter = {
  id: "distribute",
  title: "The distributive law",
  blurb: "A number outside brackets multiplies every term inside.",
  after: ["powers"],
  unlocks: ["distribute", "distribute-neg"],
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    d("distribute", (r) => {
      const [a, b, x] = [r.int(2, 6), r.int(1, 9), anyLetter(r)];
      return { start: `${a}(${x} + ${b})`, goal: `${a}${x} + ${a * b}` };
    }),
    d("distribute-neg", (r) => `-(${anyLetter(r)} ${pick(r, ["+", "-"])} ${r.int(1, 9)})`),
    // A negative number in front: its number, then its minus (minus times minus is plus).
    d("minus-number-in", (r) => {
      const [a, b, x] = [r.int(2, 5), r.int(1, 9), anyLetter(r)];
      return { start: `-${a}(${x} - ${b})`, via: [`-(${a}${x} - ${a * b})`], goal: `-${a}${x} + ${a * b}` };
    }, "distribute"),
    // Back to Powers: a letter times a bracket makes a power (x·x = x²).
    d("letter-in", (r) => {
      const [x, a] = [anyLetter(r), r.int(2, 9)];
      return { start: `${x}(${x} + ${a})`, goal: `${x}^2 + ${a}${x}` };
    }, "distribute"),
  ],
  // A bracket put back (undone by multiplying it out).
  stepsBack: () => ["factor-out"],
  levels,
};
