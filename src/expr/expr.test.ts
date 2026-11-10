import { describe, expect, it } from "vitest";
import { parseExpr, parseState } from "./parse";
import { print, printState, key } from "./key";
import { evaluate } from "./eval";

describe("parser", () => {
  it.each([
    ["2 + x", "2 + x"],
    ["3x + 2x", "3*x + 2*x"],
    ["a(b + c)", "a*(b + c)"],
    ["5y - 2y + 3", "5*y - 2*y + 3"],
    ["-(x - 4)", "-(x - 4)"],
    ["x^2 + 3x", "x^2 + 3*x"],
    ["x/3", "x/3"],
    ["2·x·5", "2*x*5"],
    ["a + (b + c)", "a + b + c"], // associativity is implicit
    ["2·(-3)", "-2*3"], // negation is pulled out of products
  ])("%s → %s", (src, printed) => {
    expect(print(parseExpr(src))).toBe(printed);
  });

  it("parses equations", () => {
    expect(printState(parseState("5x - 2 = 3x + 6"))).toBe("5*x - 2 = 3*x + 6");
  });

  it("evaluates", () => {
    expect(evaluate(parseExpr("2(x + 1) - x^2/4"), { x: 2 })).toBe(5);
  });

  it("keys ignore order and ids", () => {
    expect(key(parseExpr("x + 2y"))).toBe(key(parseExpr("2y + x")));
    expect(key(parseExpr("x + 2y"), true)).not.toBe(key(parseExpr("2y + x"), true));
  });

  it("rejects junk", () => {
    expect(() => parseExpr("2 + $")).toThrow();
    expect(() => parseExpr("(x + 1")).toThrow();
  });
});
