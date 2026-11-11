import { describe, expect, it } from "vitest";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { allPuzzles, CHAPTERS, routinesFor, rulesFor } from "./puzzles";
import { fewestMoves, matchesGoal, neighbours } from "./solver";

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

  it.each(refs.map((r) => [r.puzzle.id, r] as const))("%s can be solved with the moves unlocked so far", (_, ref) => {
    const { puzzle, rules } = ref;
    const steps = fewestMoves(parseState(puzzle.start), parseState(puzzle.goal), rules, {
      maxDepth: 10,
    });
    expect(steps, `${puzzle.start} → ${puzzle.goal}`).not.toBeNull();
  });
});

describe("with everything earlier mastered", () => {
  // The most automation a learner can have: every earlier chapter mastered.
  it.each(allPuzzles().map((r) => [r.puzzle.id, r] as const))("%s can still be solved", (_, ref) => {
    const ci = CHAPTERS.indexOf(ref.chapter);
    const steps = fewestMoves(parseState(ref.puzzle.start), parseState(ref.puzzle.goal), ref.rules, {
      maxDepth: 10,
      maxStates: 120_000,
      routines: routinesFor(ci, () => true),
    });
    expect(steps, `${ref.puzzle.start} → ${ref.puzzle.goal}`).not.toBeNull();
  }, 30_000); // the longest exercises search a lot of states
});

describe("guided examples", () => {
  const examples = CHAPTERS.flatMap((ch, ci) =>
    ch.lesson.flatMap((part) => (part.example ? [[`${ch.id} "${part.title}": ${part.example.start}`, part.example, rulesFor(ci)] as const] : [])),
  );

  it("every chapter has a lesson, with at least one example to try", () => {
    for (const ch of CHAPTERS) {
      expect(ch.lesson.length, ch.id).toBeGreaterThan(0);
      for (const part of ch.lesson) expect(part.text.length, `${ch.id}: ${part.title}`).toBeGreaterThan(0);
      expect(ch.lesson.some((p) => p.example), ch.id).toBe(true);
    }
  });

  it.each(examples)("%s: each step is one move", (_, g, rules) => {
    let state = parseState(g.start);
    for (const step of g.steps) {
      const want = parseState(step.then);
      const options = neighbours(state, rules);
      const next = options.find((n) => matchesGoal(n, want));
      expect(next, `"${step.say}" from ${printState(state)}: one move gives ${options.map(printState).join(" | ")}`).toBeDefined();
      state = next!;
    }
  });
});
