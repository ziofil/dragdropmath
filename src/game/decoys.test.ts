import { describe, expect, it } from "vitest";
import { DECOYS } from "./decoys";
import { CHAPTERS } from "./puzzles";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { follows, isWrong, shapeMismatch } from "./answers";

describe("decoys", () => {
  const all = CHAPTERS.flatMap((c) => c.puzzles.map((p) => p.id));

  it("only puzzles that exist have decoys", () => {
    const stray = Object.keys(DECOYS).filter((id) => !all.includes(id));
    expect(stray).toEqual([]);
  });

  describe.each(CHAPTERS.map((c) => [c.id, c] as const))("%s", (_, chapter) => {
    it("every puzzle has decoys", () => {
      const missing = chapter.puzzles.filter((p) => !(p.id in DECOYS)).map((p) => p.id);
      expect(missing).toEqual([]);
    });

    it.each(chapter.puzzles.map((p) => [p.id, p] as const))("%s", (id, puzzle) => {
      const decoys = DECOYS[id];
      expect(decoys, id).toBeDefined();
      const start = parseState(puzzle.start);
      const goal = parseState(puzzle.goal);
      // The goal is a right answer…
      expect(follows(start, goal), `${id}: ${puzzle.goal} should follow from ${puzzle.start}`).toBe(true);
      const printed = decoys.map((src) => {
        const label = `${id}: ${src} vs goal ${puzzle.goal}`;
        const decoy = parseState(src);
        // …and each decoy looks like one, but is wrong.
        expect(shapeMismatch(goal, decoy), label).toBeNull();
        expect(isWrong(goal, decoy), `${label} is not wrong`).toBe(true);
        expect(follows(start, decoy), `${label} follows from the start`).toBe(false);
        return printState(decoy);
      });
      expect(decoys[0], id).not.toBe(decoys[1]);
      expect(printed[0], id).not.toBe(printed[1]);
    });
  });
});
