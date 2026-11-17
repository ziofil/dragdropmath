// The conditions an equation's letters come with (domain.ts), written as a teacher writes them.
import { describe, expect, it } from "vitest";
import { parseState } from "../../expr/parse";
import { printState } from "../../expr/key";
import { domainOf } from "./domain";

const where = (src: string) => {
  const s = parseState(src);
  return printState({ sides: [], conditions: domainOf(s) }).replace(/^.*where /, "");
};

describe("conditions read off an equation", () => {
  it.each([
    ["√(x + 7) = 3", "x ≥ -7"],
    // What a root equals isn't negative either, a tighter bound here: that one only.
    ["√(x + 7) = x + 1", "x ≥ -1"],
    // The root beside a term: what it equals once the term is carried across. What's under it is then a square, so
    // not negative: said when it's a bound on the letter, not when it's longer.
    ["√(x^2 + 2x + 4) - x = 4", "x ≥ -4"],
    ["3 = √(-x^2 + 18x - 7) - x", "x ≥ -3"],
    ["√(x + 7) + x = 5", "x ≥ -7, x ≤ 5"],
    // The tightest bound only: what's under both roots isn't negative, so x ≥ 1/2 (and so x ≥ −11/14 too).
    ["√(14x + 11) - √(8x - 4) = 3", "x ≥ 1/2"],
    // A power of a bottom, a product of bottoms: 0 only when a factor is.
    ["1/(x - 2) + 3/(x - 2)^2 = 4/(x - 2)^3", "x ≠ 2"],
    ["1/((x - 1)(x + 3)) = 2", "x ≠ 1, x ≠ -3"],
    // A bottom that factors: the numbers that make it 0, as the factored bottoms beside it give them (once each).
    ["2/(x - 1) + 3/(x + 1) = 7/(x^2 - 1)", "x ≠ 1, x ≠ -1"],
    ["1/(x^2 - 5x + 6) = 2", "x ≠ 2, x ≠ 3"],
    // One that never is 0, or not at a whole number: as it is.
    ["1/(x^2 - 2) = 2", "x^2 - 2 ≠ 0"],
    // An upper bound and a lower one say different things: both.
    ["√(x + 2) = √(5 - x)", "x ≥ -2, x ≤ 5"],
  ])("%s: where %s", (eq, conditions) => {
    expect(where(eq)).toBe(conditions);
  });
});
