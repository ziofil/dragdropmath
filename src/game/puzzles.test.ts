import { describe, expect, it } from "vitest";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { CHAPTERS, rulesFor, startOf } from "./puzzles";
import { allPuzzles } from "./testing/exercises";
import { matchesGoal, moves } from "./solver";
import { tidied } from "./tidy";

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

describe("exercises", () => {
  const refs = allPuzzles();

  it("have unique ids", () => {
    const ids = refs.map((r) => r.puzzle.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Solvability is checked in solvable.*.test.ts (split, to run in parallel).
});

describe("guided examples", () => {
  const examples = CHAPTERS.flatMap((ch, ci) =>
    ch.lesson.flatMap((part) => (part.example ? [[`${ch.id} "${part.title}": ${part.example.start}`, part.example, rulesFor(ci), ch] as const] : [])),
  );

  it("every chapter has a lesson, with at least one example to try", () => {
    for (const ch of CHAPTERS) {
      expect(ch.lesson.length, ch.id).toBeGreaterThan(0);
      for (const part of ch.lesson) expect(part.text.length, `${ch.id}: ${part.title}`).toBeGreaterThan(0);
      expect(ch.lesson.some((p) => p.example), ch.id).toBe(true);
    }
  });

  it.each(examples)("%s: each step is one move", (_, g, rules, ch) => {
    // As in the app: the chapter's letters may stand for positive numbers.
    let state = startOf(g.start, ch);
    for (const step of g.steps) {
      const want = parseState(step.then);
      // As in the app: the move is checked as made, then tidied.
      const options = moves(state, rules);
      const next = options.find((n) => matchesGoal(n, want));
      expect(next, `"${step.say}" from ${printState(state)}: one move gives ${options.map(printState).join(" | ")}`).toBeDefined();
      state = tidied(state, next!);
    }
  });
});
