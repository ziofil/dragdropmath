// Polynomials as the exercise makers use them (poly.ts).
import { describe, expect, it } from "vitest";
import { answersText, coefOf, fromAnswers, fromCoefs, linear, mul, P, teacherWrites, written } from "./poly";
import { rng } from "./write";

describe("polynomials", () => {
  it("the brackets whose answers these are, multiplied out", () => {
    expect(written(fromAnswers("x", [3, 1], [-2, 1]))).toBe("x^2 - x - 6");
    expect(written(fromAnswers("x", [0, 1], [2, 3]))).toBe("3x^2 - 2x");
    expect(coefOf(fromAnswers("x", [3, 1], [-2, 1]), 1)).toBe(-1);
  });
  it("writes answers in lowest terms", () => {
    expect(answersText("x", [3, 1], [-4, 6])).toBe("x = 3 or x = -2/3");
  });
  it("any piece can play the letter: a quadratic in √x, in x²", () => {
    const q = fromAnswers("u", [1, 1], [8, 1]);
    expect(written(q, { u: (n) => (n === 2 ? "x" : "√x") })).toBe("x - 9√x + 8");
    expect(written(q, { u: (n) => `x^${2 * n}` })).toBe("x^4 - 9x^2 + 8");
  });
  it("squares and products as a teacher multiplies them out", () => {
    expect(written(mul(linear(1, 3), linear(1, 3)))).toBe("x^2 + 6x + 9");
    expect(written(mul(linear(-1, 7), linear(-1, 7)))).toBe("x^2 - 14x + 49");
    expect(written(P("3 - x"))).toBe("3 - x"); // two terms: the plus first
  });
  it("an equation written as a teacher might: the same equation, whole numbers", () => {
    const p = fromCoefs([12, -7, 1]);
    for (let seed = 1; seed < 20; seed++) {
      const eq = teacherWrites(rng(seed), p, { k: 2 });
      expect(eq).toMatch(/x\^2/);
      expect(eq).not.toMatch(/\./);
    }
  });
});
