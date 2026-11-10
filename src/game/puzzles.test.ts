import { describe, expect, it } from "vitest";
import { parseState } from "../expr/parse";
import { allPuzzles } from "./puzzles";
import { fewestMoves, matchesGoal } from "./solver";

describe("goals are matched as shown", () => {
  it("term order matters, factor order and equation sides don't", () => {
    const goal = parseState("x + 7");
    expect(matchesGoal(parseState("x + 7"), goal)).toBe(true);
    expect(matchesGoal(parseState("7 + x"), goal)).toBe(false); // exercise 4 of the first set
    expect(matchesGoal(parseState("y·6 + 1"), parseState("6y + 1"))).toBe(true);
    expect(matchesGoal(parseState("4 = x"), parseState("x = 4"))).toBe(true);
    expect(matchesGoal(parseState("2x^(1/2)"), parseState("2√x"))).toBe(false); // notation counts
    expect(matchesGoal(parseState("2√x"), parseState("2√x"))).toBe(true);
  });
});

describe("exercises", () => {
  const refs = allPuzzles();

  it("have unique ids", () => {
    const ids = refs.map((r) => r.puzzle.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(refs.map((r) => [r.puzzle.id, r] as const))("%s can be solved with the moves unlocked so far", (_, ref) => {
    const { puzzle, rules } = ref;
    const steps = fewestMoves(parseState(puzzle.start), parseState(puzzle.goal), rules, {
      maxDepth: 10,
    });
    expect(steps, `${puzzle.start} → ${puzzle.goal}`).not.toBeNull();
  });
});
