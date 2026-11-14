import { describe, expect, it } from "vitest";
import { allPuzzles } from "./testing/exercises";
import { choicesFor } from "./guess";
import { autoDecoys } from "./autoDecoys";
import { parseState } from "../expr/parse";

/** The exercises with their automatic wrong answers (as every exercise now gets them). */
const cases = allPuzzles().map(({ puzzle }) => {
  let decoys: string[] = [];
  try {
    decoys = autoDecoys(parseState(puzzle.start), parseState(puzzle.goal));
  } catch {
    /* none */
  }
  return { puzzle, decoys };
});

describe("guess first", () => {
  it("offers the goal among three different answers, in the same order every visit", () => {
    for (const { puzzle, decoys } of cases) {
      const c = choicesFor(puzzle, decoys);
      if (!c) continue;
      expect(c, puzzle.id).toHaveLength(3);
      expect(c, puzzle.id).toContain(puzzle.goal);
      expect(new Set(c).size, puzzle.id).toBe(3);
      expect(choicesFor(puzzle, decoys), puzzle.id).toEqual(c);
    }
  });

  it("doesn't always put the right answer in the same place", () => {
    const places = new Set(cases.flatMap(({ puzzle, decoys }) => (choicesFor(puzzle, decoys) ? [choicesFor(puzzle, decoys)!.indexOf(puzzle.goal)] : [])));
    expect(places.size).toBe(3);
  });
});
