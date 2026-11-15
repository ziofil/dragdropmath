import { describe, expect, it } from "vitest";
import { corpus } from "./testing/corpus";
import { answer, arrive, cardOf, canSolve, choicesFor } from "./predict";
import { autoDecoys } from "./autoDecoys";
import { parseState } from "../expr/parse";

/** The exercises with their automatic wrong answers (as every exercise now gets them). */
const cases = corpus().map((c) => {
  const puzzle = { id: c.id, goal: c.goal };
  let decoys: string[] = [];
  try {
    decoys = autoDecoys(parseState(c.start), parseState(c.goal));
  } catch {
    /* none */
  }
  return { puzzle, decoys };
});

describe("the answers to pick from", () => {
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

describe("predicting, step by step", () => {
  const goal = "x = 4";
  const choices = ["x = 7", goal, "x = 8"];

  it("solves straight away when there's nothing to pick", () => {
    expect(arrive(null, goal, {})).toEqual({ kind: "none" });
    expect(canSolve(arrive(null, goal, {}))).toBe(true);
  });

  it("asks first, with the board waiting", () => {
    const p = arrive(choices, goal, {});
    expect(p).toEqual({ kind: "asking" });
    expect(canSolve(p)).toBe(false);
    expect(choices.map((c) => cardOf(p, c, goal))).toEqual(["open", "open", "open"]);
  });

  it("a wrong pick: red where picked, green where right", () => {
    const p = answer(arrive(choices, goal, {}), goal, "x = 7");
    expect(p).toEqual({ kind: "answered", prediction: "wrong", pick: "x = 7", earlier: false });
    expect(choices.map((c) => cardOf(p, c, goal))).toEqual(["picked", "right", "plain"]);
    expect(canSolve(p)).toBe(true);
  });

  it("only the first answer counts", () => {
    const p = answer(arrive(choices, goal, {}), goal, "x = 7");
    expect(answer(p, goal, goal)).toBe(p);
    expect(answer(p, goal, null)).toBe(p);
  });

  it("revealing: the right one green, nothing picked", () => {
    const p = answer(arrive(choices, goal, {}), goal, null);
    expect(p).toEqual({ kind: "answered", prediction: "revealed", earlier: false });
    expect(choices.map((c) => cardOf(p, c, goal))).toEqual(["plain", "right", "plain"]);
  });

  it("coming back: answered as it was, never asked again", () => {
    expect(arrive(choices, goal, { predicted: "wrong", pick: "x = 8" })).toEqual({ kind: "answered", prediction: "wrong", pick: "x = 8", earlier: true });
    expect(arrive(choices, goal, { predicted: "right" })).toEqual({ kind: "answered", prediction: "right", pick: goal, earlier: true });
    expect(arrive(choices, goal, { predicted: "revealed" })).toEqual({ kind: "answered", prediction: "revealed", earlier: true });
  });
});
