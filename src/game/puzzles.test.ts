import { describe, expect, it } from "vitest";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { allPuzzles, CHAPTERS, rulesFor } from "./puzzles";
import { matchesGoal, moves, solutionVia } from "./solver";
import { tidied } from "./tidy";

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

  // As a learner would: with the moves of the chapter and of every chapter on
  // the way to it, and tidying after each move, as the app does.
  it.each(refs.map((r) => [r.puzzle.id, r] as const))("%s can be solved", (_, ref) => {
    const { puzzle, rules } = ref;
    // Long ones are checked checkpoint by checkpoint (see Puzzle.via).
    const way = solutionVia(parseState(puzzle.start), parseState(puzzle.goal), (puzzle.via ?? []).map(parseState), rules, {
      maxDepth: 10,
      maxStates: 120_000,
    });
    expect(way, `${puzzle.start} → ${[...(puzzle.via ?? []), puzzle.goal].join(" → ")}`).not.toBeNull();
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
      // As in the app: the move is checked as made, then tidied.
      const options = moves(state, rules);
      const next = options.find((n) => matchesGoal(n, want));
      expect(next, `"${step.say}" from ${printState(state)}: one move gives ${options.map(printState).join(" | ")}`).toBeDefined();
      state = tidied(state, next!);
    }
  });
});
