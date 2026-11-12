import { describe, expect, it } from "vitest";
import { allPuzzles } from "./puzzles";
import { parseState } from "../expr/parse";
import { autoDecoys } from "./autoDecoys";
import { follows, isWrong, shapeMismatch } from "./answers";

describe("automatic wrong answers", () => {
  const refs = allPuzzles();
  const made = refs.map((r) => ({ id: r.puzzle.id, start: parseState(r.puzzle.start), goal: parseState(r.puzzle.goal), decoys: autoDecoys(parseState(r.puzzle.start), parseState(r.puzzle.goal)) }));

  it("are wrong, look like answers, and differ from each other", () => {
    for (const m of made) {
      for (const d of m.decoys) {
        const s = parseState(d); // printed so they parse back
        expect(shapeMismatch(m.goal, s), `${m.id}: ${d}`).toBeNull();
        expect(isWrong(m.goal, s), `${m.id}: ${d}`).toBe(true);
        expect(follows(m.start, s), `${m.id}: ${d}`).toBe(false);
      }
      expect(new Set(m.decoys).size, m.id).toBe(m.decoys.length);
    }
  });

  it("can be made for nearly every built-in exercise", () => {
    const short = made.filter((m) => m.decoys.length < 2).map((m) => m.id);
    expect(short.length / made.length, `without two: ${short.join(", ")}`).toBeLessThan(0.05);
  });

  it.each([
    ["2x + 3 = 11", "x = 4"],
    ["x + 3 < 10", "x < 7"],
    ["3x + 2x", "5x"],
  ])("%s → %s", (start, goal) => {
    expect(autoDecoys(parseState(start), parseState(goal))).toHaveLength(2);
  });
});
