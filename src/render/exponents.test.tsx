// Powers with negative exponents and powers on both sides: every move there can be reached by
// dragging and animates sanely (a power going under a bar of its own, merging, crossing =).
import { describe, expect, it } from "vitest";
import { checkAllMovesReachable, checkMergesAnimate } from "./testing/checks";
import { rulesOf } from "../game/puzzles";

describe("negative exponents and powers on both sides", () => {
  it.each(["2^(-6) = x", "2^x*2^(-6) = 2^4", "3x^(-2) + 1", "2^(x - 3) = 2^4", "log_2(2^(x - 3)) = 4"])("%s", (s) => {
    expect(checkAllMovesReachable(s, rulesOf("balance"))).toEqual([]);
    expect(checkMergesAnimate(s, rulesOf("balance"))).toEqual([]);
  });
});
