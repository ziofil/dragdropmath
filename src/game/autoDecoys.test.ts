import { describe, expect, it } from "vitest";
import { corpus } from "./testing/corpus";
import { parseState } from "../expr/parse";
import { autoDecoys, movedSlips, unsimplified } from "./autoDecoys";
import { printState } from "../expr/key";
import { follows, isWrong, shapeMismatch } from "./answers";
import { choicesFor } from "./predict";
import { blindPicks } from "./testing/blind";

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

  // A player who never reads the question (the card in the middle of the other two, as written or
  // in value) does no better than chance: the wrong answers don't give the right one away.
  it("can't be told from the right one without the maths", () => {
    const tally: Record<string, { right: number; played: number }> = {};
    for (const m of made) {
      const choices = choicesFor({ id: m.id, goal: printState(m.goal) }, m.decoys);
      if (!choices) continue;
      for (const [player, pick] of Object.entries(blindPicks(choices))) {
        if (pick === undefined) continue;
        const t = (tally[player] ??= { right: 0, played: 0 });
        t.played++;
        if (choices[pick] === printState(m.goal)) t.right++;
      }
    }
    for (const [player, { right, played }] of Object.entries(tally)) {
      expect(played, player).toBeGreaterThan(50);
      expect(right / played, `${player}: ${right} of ${played} right`).toBeLessThanOrEqual(0.4);
    }
  });

  it("are written as answers are: simplified", () => {
    for (const m of made) for (const d of m.decoys) expect(unsimplified(parseState(d)), `${m.id}: ${d}`).toBe(false);
    expect(unsimplified(parseState("x = 18/8"))).toBe(true);
    expect(unsimplified(parseState("2*(8/5)"))).toBe(true);
    expect(unsimplified(parseState("-6*(4*x - 5)"))).toBe(false);
  });

  it("include slips made on the way (a term carried across with its sign kept)", () => {
    // 2x + 3 = 11 with the 3 carried across unchanged: 2x = 14, x = 7.
    expect(movedSlips(parseState("2x + 3 = 11"), parseState("x = 4")).map(printState)).toContain("x = 7");
    // 3x = 12 with the 3 multiplying the 12 instead of dividing it: x = 36.
    expect(movedSlips(parseState("3x = 12"), parseState("x = 4")).map(printState)).toContain("x = 36");
  });

  it.each([
    ["2x + 3 = 11", "x = 4"],
    ["x + 3 < 10", "x < 7"],
    ["3x + 2x", "5x"],
  ])("%s → %s", (start, goal) => {
    expect(autoDecoys(parseState(start), parseState(goal))).toHaveLength(2);
  });
});
