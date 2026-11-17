// The way writer (way.ts): coarse checkpoints and their stages in, close checkpoints with their exact moves out.
import { describe, expect, it } from "vitest";
import { rulesOf } from "../puzzles";
import { writeWay, type Stage } from "./way";
import { stuckOf, verify } from "./verify";
import type { Draft } from "./write";

const rules = rulesOf("quadratic");

/** A draft from coarse checkpoints, each stretch's stage given. */
const draft = (start: string, via: string[], goal: string, stages: Stage[]): Draft => ({ shape: "test", start, via, goal, stages: stages.map((s) => [s]) });

describe("the way writer", () => {
  // Routes from Matematica C3, Algebra 2 (chapters 3 and 8).
  const cases: [string, Draft][] = [
    [
      "a root and a term: isolate, square, multiply out, gather, factor (8.4 d)",
      draft(
        "√(25 - x^2) + x = 7 where x ≤ 7",
        ["√(25 - x^2) = 7 - x where x ≤ 7", "25 - x^2 = (7 - x)^2 where x ≤ 7", "25 - x^2 = 49 - 14x + x^2 where x ≤ 7", "0 = 2x^2 - 14x + 24 where x ≤ 7", "0 = 2(x - 3)(x - 4) where x ≤ 7"],
        "x = 3 or x = 4",
        ["isolate", "square", "expand", "gather", "factor", "split"],
      ),
    ],
    [
      "two roots: square, multiply out, gather, square again (8.13 a)",
      draft(
        "4 - √(x - 2) = √(x - 1) + 3 where x ≥ 2",
        ["1 - √(x - 2) = √(x - 1) where x ≥ 2", "(1 - √(x - 2))^2 = x - 1 where x ≥ 2", "1 - 2√(x - 2) + x - 2 = x - 1 where x ≥ 2", "√(x - 2) = 0 where x ≥ 2"],
        "x = 2",
        ["isolate", "square", "expand", "gather", "square"],
      ),
    ],
    [
      "brackets squared on both sides: a bracket at a time (3.28 d)",
      draft("6(x + 2)^2 - (29x + 26) = 2(3x - 1)^2 - (5x - 2)^2", ["6x^2 - 5x - 2 = -7x^2 + 8x - 2", "13x^2 - 13x = 0"], "x = 0 or x = 1", ["expand", "gather", "solve"]),
    ],
  ];
  it.each(cases)("%s", (_, d) => {
    const w = writeWay(d, rules);
    expect(w, "no way written").not.toBeNull();
    // Close checkpoints, each stretch with the moves it takes: checked quickly, as practice serves it.
    expect(w!.via.length).toBeGreaterThan(d.via.length);
    expect(w!.legs).toHaveLength(w!.via.length + 1);
    expect(stuckOf(verify(w!, rules, { quick: true }))).toBe("");
  }, 60_000);

  it("falls back on all the chapter's moves where a stretch's stage can't do it", () => {
    // Squaring moves can't factor: the stretch is searched with every move instead.
    const w = writeWay(draft("x^2 - 5x + 6 = 0", ["(x - 2)(x - 3) = 0"], "x = 2 or x = 3", ["square", "split"]), rules);
    expect(w).not.toBeNull();
    expect(stuckOf(verify(w!, rules, { quick: true }))).toBe("");
  });
});
