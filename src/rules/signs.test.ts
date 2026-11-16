import { describe, expect, it } from "vitest";
import { parseExpr, parseState } from "../expr/parse";
import { printState } from "../expr/key";
import type { Expr, MathState } from "../expr/types";
import { signOf } from "./signs";
import { ALL_RULES, candidatesFor } from ".";

const anyLetters = { positiveLetters: false };
const positive = { positiveLetters: true };

describe("what can be said about a sign", () => {
  it.each([
    ["3", "positive"],
    ["-3", "negative"],
    ["0", "zero"],
    ["x", "unknown"],
    ["x^2", "non-negative"],
    ["(x - 1)^4", "non-negative"],
    ["√x", "non-negative"],
    ["2√x", "non-negative"],
    ["2^x", "positive"],
    ["e^x", "positive"],
    ["x^2 + 1", "positive"],
    ["-(x^2)", "non-positive"],
    ["x^3", "unknown"],
    ["x - 1", "unknown"],
    ["1/x", "unknown"],
    ["ln(x)", "unknown"],
  ])("%s is %s, whatever x is", (src, sign) => {
    expect(signOf(parseExpr(src), anyLetters)).toBe(sign);
  });

  it.each([
    ["x", "positive"],
    ["3x", "positive"],
    ["x/y", "positive"],
    ["-x", "negative"],
    ["x - 1", "unknown"],
  ])("%s is %s when letters are positive", (src, sign) => {
    expect(signOf(parseExpr(src), positive)).toBe(sign);
  });
});

describe("undoing a square across = asks the sign", () => {
  /** What carrying the outer ² of the left side across gives. */
  const carrySquare = (s: MathState) => {
    const square = (s.sides[0] as Extract<Expr, { kind: "pow" }>).exp;
    return candidatesFor(s, square.id, ALL_RULES).filter((c) => c.rule === "root-across").map((c) => printState(c.state));
  };
  it("(2√x)² = 12: 2√x can't be negative, so nothing is lost (12.23)", () => {
    expect(carrySquare(parseState("(2√x)^2 = 12"))).toEqual(["2*√(x) = 12^(1/2)"]);
  });
  it("x² = 4: x could be −2 too, so both roots: two rows, x = 2 or x = −2…", () => {
    expect(carrySquare(parseState("x^2 = 4"))).toEqual(["x = 4^(1/2) or x = -4^(1/2)"]);
  });
  it("…but yes where letters stand for positive numbers (12.30)", () => {
    expect(carrySquare({ ...parseState("x^2 = 4"), letters: "positive" })).toEqual(["x = 4^(1/2)"]);
  });
  it("the assumption carries over to the next state", () => {
    const s: MathState = { ...parseState("x^2 = 4"), letters: "positive" };
    const square = (s.sides[0] as Extract<Expr, { kind: "pow" }>).exp;
    const [c] = candidatesFor(s, square.id, ALL_RULES).filter((k) => k.rule === "root-across");
    expect(c.state.letters).toBe("positive");
  });
});
