// What an exercise asks, and when a board has done it (task.ts).
import { describe, expect, it } from "vitest";
import { parseState } from "../expr/parse";
import { isDone, taskOf } from "./task";

const done = (goal: string, board: string) => isDone(parseState(goal), parseState(board));

describe("what counts as done", () => {
  it("a number for an answer: worked out, any order, either way round", () => {
    expect(taskOf(parseState("x = 3"))).toEqual({ kind: "solve", letters: ["x"] });
    expect(done("x = 3", "x = 3")).toBe(true);
    expect(done("x = 3", "3 = x")).toBe(true);
    expect(done("x = 3", "x = 6/2")).toBe(false);
    expect(done("x = 1; y = 4", "y = 4; x = 1")).toBe(true);
  });
  it("a formula rearranged: any form equal in value, the letter alone", () => {
    expect(done("a = T/2 - b", "a = (T - 2b)/2")).toBe(true);
    expect(done("a = T/2 - b", "(T - 2b)/2 = a")).toBe(true);
    expect(done("a = T/2 - b", "a = (T - b)/2")).toBe(false);
    expect(done("a = T/2 - b", "2a = T - 2b")).toBe(false);
  });
  it("anything else: only the goal as shown", () => {
    expect(taskOf(parseState("2x + 6"))).toEqual({ kind: "match" });
    expect(done("2x + 6", "2x + 6")).toBe(true);
    expect(done("2x + 6", "6 + 2x")).toBe(false);
    expect(done("2(x + 3)", "2x + 6")).toBe(false);
  });
});
