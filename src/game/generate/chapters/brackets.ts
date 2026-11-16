/**
 * Multiplying brackets: each term of one by each term of the other, then
 * collect. Each shape picks its pieces and numbers; the answer and the way
 * to it are worked out from them (../composeExpr.ts).
 */
import { brackets as twoBrackets, composedExpression, expression, lin, P, square as squared, term, times, type Piece } from "../composeExpr";
import { byIds, one, type Level, type Rng, type Shape } from "../write";
import { all as powers } from "./powers";


const shape = (id: string, name: string, pieces: (r: Rng) => Piece[] | null): Shape => ({
  id,
  name,
  make: (r) => {
    const ps = pieces(r);
    return ps && expression(id, ps, r);
  },
});

const letterTimes = shape("letter-times", "a letter times a bracket", (r) => {
  // x(x + b), x(ax + b)
  const x = one(r, ["x", "x", "y", "a"]);
  return [times(1, x, lin(r.next() < 0.6 ? 1 : r.int(2, 5), r.int(1, 9) * (r.next() < 0.3 ? -1 : 1), x))];
});

const powerTimes = shape("power-times", "a power comes out of the bracket", (r) => {
  // x(x² + b), x²(x + b)
  const b = r.int(1, 9) * (r.next() < 0.3 ? -1 : 1);
  return r.next() < 0.5 ? [times(1, "x", P(`x^2 + ${b}`.replace("+ -", "- ")))] : [times(1, "x^2", lin(1, b))];
});

const thenCollect = shape("then-collect", "a letter times a bracket, then collect", (r) => {
  // x(x + p) + qx
  const x = one(r, ["x", "x", "y", "a"]);
  const [p, q] = [r.signed(1, 6), r.signed(1, 6)];
  if (p + q === 0) return null;
  return [times(1, x, lin(1, p, x)), term(q, x)];
});

const twoPlus = shape("two-plus", "two brackets, both plus", (r) => {
  const x = one(r, ["x", "x", "a", "p"]);
  const [p, q] = [r.int(1, 6), r.int(1, 6)];
  return p === q ? null : [twoBrackets(lin(1, p, x), lin(1, q, x))];
});

/** (x + k)(x − k), or (x − y)(x + y): the middle terms cancel. */
function difference(r: Rng): Piece[] {
  if (r.next() < 0.25) {
    const [x, y] = one(r, [["x", "y"], ["a", "b"], ["p", "q"]] as const);
    return [twoBrackets(P(`${x} - ${y}`), P(`${x} + ${y}`))];
  }
  const x = one(r, ["x", "x", "a", "y"]);
  const k = r.int(2, 9);
  return [twoBrackets(lin(1, -k, x), lin(1, k, x))];
}

const signs = shape("signs", "two brackets, a minus in one", (r) => {
  // (ax + b)(x + d), one minus; now and then the middle terms cancel.
  if (r.next() < 0.3) return difference(r);
  const x = one(r, ["x", "x", "a", "p"]);
  const a = r.next() < 0.6 ? 1 : 2;
  const [b, d] = [r.signed(1, 5), r.signed(1, 5)];
  if (b > 0 === d > 0 || (a > 1 && Math.abs(d) > 3) || (a === 1 && b === -d) || (a > 1 && b % a === 0)) return null;
  return [twoBrackets(lin(a, b, x), lin(1, d, x))];
});

const timesSquare = shape("times-square", "a bracket times a bracket with a square", (r) => [twoBrackets(lin(1, r.int(1, 4)), P(`x^2 + ${r.int(1, 4)}`))]);

const thenTake = shape("then-take", "two brackets, then a term taken away", (r) => {
  // (x + p)(x + q) − x², or + cx with the x terms cancelling
  const x = one(r, ["x", "a", "a", "p"]);
  const [p, q] = [r.signed(1, 5), r.int(1, 5)];
  if (p === q || p === -q || (Math.abs(p) !== 1 && q !== 1)) return null;
  return [twoBrackets(lin(1, p, x), lin(1, q, x)), r.next() < 0.5 ? term(-1, `${x}^2`) : term(-(p + q), x)];
});

const bothNumbers = shape("both-numbers", "a number in front of x in both brackets", (r) => {
  const [a, c, b, d] = [r.int(2, 3), r.int(2, 3), r.signed(1, 4), r.signed(1, 4)];
  if ((b < 0 && d < 0) || b % a === 0 || d % c === 0 || a * d + b * c === 0 || (a === c && b === d)) return null;
  return [twoBrackets(lin(a, b), lin(c, d))];
});

const square = shape("square", "a bracket squared", (r) => {
  const pick = r.next();
  if (pick < 0.25) {
    // (x − k)² + 2kx: the middle term cancels.
    const k = r.signed(2, 5);
    return [squared(lin(1, k)), term(-2 * k, "x")];
  }
  if (pick < 0.5) {
    // (x ± y)², or (x + y)² − 2xy
    const [x, y] = one(r, [["x", "y"], ["a", "b"], ["p", "q"]] as const);
    const minus = r.next() < 0.5;
    return [squared(P(`${x} ${minus ? "-" : "+"} ${y}`)), ...(!minus && r.next() < 0.4 ? [term(-2, `${x}${y}`)] : [])];
  }
  const a = r.next() < 0.3 ? r.int(2, 3) : 1;
  const b = a === 1 ? r.signed(2, 6) : r.int(1, 3) * (r.next() < 0.3 ? -1 : 1);
  return a > 1 && b % a === 0 ? null : [squared(lin(a, b))];
});

const numberTimes = shape("number-times", "a number times two brackets", (r) => {
  // k(x + p)(x + q)
  const [k, p, q] = [r.int(2, 3), r.signed(1, 4), r.int(1, 4)];
  if (p === q || p === -q || Math.abs(p) === 1 || q === 1) return null;
  return [twoBrackets(lin(1, p), lin(1, q), k)];
});

const threeFactors = shape("three-factors", "x times two brackets", (r) => {
  // x(x + k)(x − k) = x³ − k²x
  const k = r.int(1, 5);
  const [b, d] = r.next() < 0.5 ? [k, -k] : [-k, k];
  return [twoBrackets(lin(1, b), lin(1, d), 1, { x: 1 })];
});

// ---------- hard: brackets of x and y ----------

const twoLetterProductMinus = shape("two-letter-product-minus", "two brackets of x and y multiplied, take away x times a bracket", (r) => {
  // (x + ay)(x − by) − x(x + cy)
  const [a, b, c] = [r.int(1, 4), r.int(1, 4), r.int(1, 4)];
  if (a === b || a - b - c === 0) return null;
  return [twoBrackets(P(`x + ${a}y`), P(`x - ${b}y`)), times(-1, "x", P(`x + ${c}y`))];
});

const letterBracketMinusProduct = shape("letter-bracket-minus-product", "x times a bracket, take away two brackets of x and y multiplied", (r) => {
  // x(x + ay) − (x + ay)(x − by)
  const [a, b] = [r.int(1, 4), r.int(1, 4)];
  return [times(1, "x", P(`x + ${a}y`)), twoBrackets(P(`x + ${a}y`), P(`x - ${b}y`), -1)];
});

export const shapes: Record<Level, Shape[]> = {
  // And powers with a bracket to multiply out, from the powers chapter (which now comes before the distributive law).
  easy: [letterTimes, powerTimes, thenCollect, twoPlus, signs, timesSquare, thenTake, ...byIds(powers, "bracket-cancel", "expand-collect"), composedExpression("brackets", "easy", 4)],
  medium: [bothNumbers, square, numberTimes, threeFactors, ...byIds(powers, "bracket-square", "square-and-more"), composedExpression("brackets", "medium", 4)],
  hard: [twoLetterProductMinus, letterBracketMinusProduct, composedExpression("brackets", "hard", 4)],
};
