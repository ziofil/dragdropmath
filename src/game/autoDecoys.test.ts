import { describe, expect, it } from "vitest";
import { corpus } from "./testing/corpus";
import { parseState } from "../expr/parse";
import { autoDecoys } from "./autoDecoys";
import { follows, isWrong, shapeMismatch } from "./answers";

describe("automatic wrong answers", () => {
  // The exercises learners predict (the test's), not the one-move boards.
  const made = corpus()
    .filter((c) => c.kind === "practice")
    .map((c) => ({ id: c.id, start: parseState(c.start), goal: parseState(c.goal), decoys: autoDecoys(parseState(c.start), parseState(c.goal)) }));

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

  it("can be made for every exercise", () => {
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
