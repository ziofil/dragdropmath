import { expect, it } from "vitest";
import { parseState } from "./parse";
import { printState } from "./key";
it("reads λ and ρ as letters (v = fλ, ρ = m/V)", () => {
  expect(printState(parseState("v = fλ"))).toBe("v = f*λ");
  expect(printState(parseState("ρ = m/V"))).toBe("ρ = m/V");
});
