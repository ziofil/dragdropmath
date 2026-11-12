import { describe, expect, it } from "vitest";
import { allPuzzles } from "./puzzles";
import { choicesFor } from "./guess";

describe("guess first", () => {
  it("offers the goal among three different answers, in the same order every visit", () => {
    for (const { puzzle } of allPuzzles()) {
      const c = choicesFor(puzzle);
      if (!c) continue;
      expect(c, puzzle.id).toHaveLength(3);
      expect(c, puzzle.id).toContain(puzzle.goal);
      expect(new Set(c).size, puzzle.id).toBe(3);
      expect(choicesFor(puzzle), puzzle.id).toEqual(c);
    }
  });

  it("doesn't always put the right answer in the same place", () => {
    const places = new Set(allPuzzles().flatMap(({ puzzle }) => (choicesFor(puzzle) ? [choicesFor(puzzle)!.indexOf(puzzle.goal)] : [])));
    expect(places.size).toBe(3);
  });
});
