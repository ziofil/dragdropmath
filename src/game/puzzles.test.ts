import { describe, expect, it } from "vitest";
import { parseState } from "../expr/parse";
import { CHAPTERS } from "./puzzles";
import { matchesGoal } from "./solver";
import { drillsOf } from "./generate/moves";
import { en } from "../i18n";
import type { MoveWords } from "../i18n/en";

describe("goals are matched as shown", () => {
  it("term and factor order matter, equation sides don't", () => {
    const goal = parseState("x + 7");
    expect(matchesGoal(parseState("x + 7"), goal)).toBe(true);
    expect(matchesGoal(parseState("7 + x"), goal)).toBe(false); // exercise 4 of the first set
    expect(matchesGoal(parseState("y·6 + 1"), parseState("6y + 1"))).toBe(false);
    expect(matchesGoal(parseState("a·6b"), parseState("6ab"))).toBe(false); // not the shape asked for
    expect(matchesGoal(parseState("6·a·b"), parseState("6ab"))).toBe(true);
    expect(matchesGoal(parseState("4 = x"), parseState("x = 4"))).toBe(true);
    expect(matchesGoal(parseState("2x^(1/2)"), parseState("2√x"))).toBe(false); // notation counts
    expect(matchesGoal(parseState("2√x"), parseState("2√x"))).toBe(true);
  });

  it("an inequality may be read from either end, but not the other way round", () => {
    expect(matchesGoal(parseState("3 < x"), parseState("x > 3"))).toBe(true);
    expect(matchesGoal(parseState("x <= -2"), parseState("x ≤ -2"))).toBe(true);
    expect(matchesGoal(parseState("-2 ≥ x"), parseState("x ≤ -2"))).toBe(true);
    expect(matchesGoal(parseState("x < 3"), parseState("x > 3"))).toBe(false);
    expect(matchesGoal(parseState("x < 3"), parseState("x ≤ 3"))).toBe(false);
    expect(matchesGoal(parseState("x = 3"), parseState("x < 3"))).toBe(false);
  });
});

describe("lessons", () => {
  it("every chapter's lesson is its moves, each saying why it works and what to do", () => {
    for (const ch of CHAPTERS) {
      const moves = drillsOf(ch.id);
      expect(moves.length, ch.id).toBeGreaterThan(0);
      for (const m of moves) {
        const w = en.drills[m.id as keyof typeof en.drills] as MoveWords;
        expect(w?.name && w.how, `${ch.id}: ${m.id}`).toBeTruthy();
        expect(w.text.length, `${ch.id}: ${m.id}: why it works`).toBeGreaterThan(0);
      }
    }
  });
});
