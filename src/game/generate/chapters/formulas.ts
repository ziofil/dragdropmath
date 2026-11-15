/**
 * Exercise shapes for the chapter "formulas" (see ../write.ts): real formulas,
 * with a letter to make the subject picked at random, and made-up equations
 * solved for x in terms of another letter (x = 5a).
 */
import * as L from "../linear";
import * as E from "../equations";
import { one, type Level, type Rng, type Shape } from "../write";

/** A formula and the subjects it can be rearranged for (each goal as the engine writes it). */
type Formula = { start: string; goals: string[]; via?: Record<string, string[]> };

const PRODUCTS: Formula[] = [
  { start: "F = ma", goals: ["a = F/m", "m = F/a"] },
  { start: "V = IR", goals: ["R = V/I", "I = V/R"] },
  { start: "d = st", goals: ["t = d/s", "s = d/t"] },
  { start: "p = mv", goals: ["v = p/m", "m = p/v"] },
  { start: "W = Fd", goals: ["d = W/F", "F = W/d"] },
  { start: "P = IV", goals: ["I = P/V", "V = P/I"] },
  { start: "A = lw", goals: ["w = A/l", "l = A/w"] },
  { start: "E = mc^2", goals: ["m = E/c^2"] },
  { start: "P = F/A", goals: ["F = PA", "A = F/P"] },
  { start: "s = d/t", goals: ["d = st", "t = d/s"] },
  { start: "D = m/V", goals: ["m = DV", "V = m/D"] },
];

const SUMS: Formula[] = [
  { start: "y = x + c", goals: ["x = y - c", "c = y - x"] },
  { start: "a = b - c", goals: ["b = a + c", "c = b - a"] },
  { start: "P = a + b + c", goals: ["a = P - b - c"] },
  { start: "v = u + at", goals: ["t = (v - u)/a", "a = (v - u)/t", "u = v - at"] },
  { start: "y = mx + c", goals: ["x = (y - c)/m", "m = (y - c)/x", "c = y - mx"] },
  { start: "2a + b = c", goals: ["a = (c - b)/2", "b = c - 2a"] },
  { start: "y = 3x + c", goals: ["x = (y - c)/3"] },
];

/** Two moves, or three: a fraction or a bracket to clear first, a letter in two places. */
const TWO_STEP: Formula[] = [
  { start: "A = (bh)/2", goals: ["h = (2A)/b", "b = (2A)/h"] },
  { start: "a = (v - u)/t", goals: ["t = (v - u)/a", "u = v - at"] },
  { start: "T = 2(a + b)", goals: ["a = T/2 - b", "b = T/2 - a"] },
  { start: "P = 2(l + w)", goals: ["l = P/2 - w"] },
  { start: "m(v - u) = I", goals: ["u = v - I/m"] },
  { start: "P = V^2/R", goals: ["R = V^2/P"] },
  { start: "V = lwh", goals: ["h = V/(lw)"] },
  { start: "E = (mv^2)/2", goals: ["m = (2E)/v^2"] },
  { start: "s = ((u + v)t)/2", goals: ["t = (2s)/(u + v)"] },
  { start: "px + qx = r", goals: ["x = r/(p + q)"] },
  { start: "A = P + Prt", goals: ["P = A/(1 + rt)"] },
  { start: "F = (9C)/5 + 32", goals: ["C = (5(F - 32))/9"] },
  { start: "C = (5(F - 32))/9", goals: ["F = (9C)/5 + 32"] },
  { start: "v^2 = u^2 + 2as", goals: ["s = (v^2 - u^2)/(2a)", "a = (v^2 - u^2)/(2s)"] },
  { start: "2x + a = x + b", goals: ["x = b - a"] },
];

/** Four or five moves: x on both sides, taken out as a factor. */
const LONGER: Formula[] = [
  { start: "3(x + y) = 2x + z", goals: ["x = z - 3y"] },
  { start: "ax + b = cx + d", goals: ["x = (d - b)/(a - c)"] },
  { start: "k(x - 1) = x", goals: ["x = k/(k - 1)"] },
  { start: "a(x + 1) = 2x + b", goals: ["x = (b - a)/(a - 2)"], via: { "x = (b - a)/(a - 2)": ["ax + a = 2x + b", "ax - 2x = b - a"] } },
];

function fromBank(id: string, bank: Formula[]): Shape {
  return {
    id,
    name: "a formula, one letter to make the subject",
    // Real formulas: the 32 of F = 9C/5 + 32 is what it is.
    curated: true,
    make: (r) => {
      const f = bank[r.int(0, bank.length - 1)];
      const goal = f.goals[r.int(0, f.goals.length - 1)];
      return { shape: id, start: f.start, goal, via: f.via?.[goal] ?? [] };
    },
  };
}

/** x in two places and other letters around: factor x out at the end. */
const FACTOR: Formula[] = [
  { start: "a(x - b) = c(x + b)", goals: ["x = (ab + bc)/(a - c)"], via: { "x = (ab + bc)/(a - c)": ["ax - ab = cx + cb", "ax - cx = cb + ab", "x(a - c) = cb + ab"] } },
  { start: "a(x + b) = c(x + d)", goals: ["x = (cd - ab)/(a - c)"], via: { "x = (cd - ab)/(a - c)": ["ax + ab = cx + cd", "ax - cx = cd - ab", "x(a - c) = cd - ab"] } },
  { start: "p(x - q) = x + r", goals: ["x = (pq + r)/(p - 1)"], via: { "x = (pq + r)/(p - 1)": ["px - pq = x + r", "px - x = r + pq", "x(p - 1) = r + pq"] } },
];

// ---------- solving for x in terms of a letter: the equations' recipes, every number a multiple of a ----------

/** How many a's x comes to: mostly small and positive, now and then negative. */
const pickK = (r: Rng) => (r.next() < 0.15 ? -r.int(1, 3) : r.int(1, 6));
const inLetters = (rc: L.Recipe, id: string) => L.shapeOf(rc, { id, unit: (r) => one(r, ["a", "b", "c"]), answer: pickK });

const banks = { product: fromBank("product", PRODUCTS), sum: fromBank("sum", SUMS), twoStep: fromBank("two-step", TWO_STEP), formula: fromBank("formula", LONGER), factorTwice: fromBank("factor-twice", FACTOR) };

export const shapes: Record<Level, Shape[]> = {
  easy: [banks.product, banks.sum, banks.twoStep, banks.formula, inLetters(L.bothSides, "letters-both"), inLetters(L.bracketX, "bracket-letter"), inLetters(E.fractionEquals, "fraction-equal")],
  medium: [inLetters(L.bracketsBoth, "two-brackets"), inLetters(L.twoFractions, "two-fractions"), inLetters(L.fraction, "fraction-letter"), inLetters(L.bracketPlusBoth, "bracket-and-letter"), banks.factorTwice],
  // And a log or an exponential to undo, with x and y.
  hard: [inLetters(L.fractionsMinus, "fractions-minus"), inLetters(L.twoBracketsMixed, "two-brackets-mixed"), L.shapeOf(E.expOfQuotient), L.shapeOf(E.logOfRootOfExp)],
};
