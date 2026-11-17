// Practice's Next step: from the start of an exercise (as served, with the moves each stretch takes), a way that
// ends where the exercise counts as done, found quickly.
import { describe, expect, it } from "vitest";
import { CHAPTERS, rulesOf } from "./puzzles";
import { LEVELS, practiceExercise } from "./generate/practice";
import { nextStep } from "./showWay";
import { parseState } from "../expr/parse";
import { assuming } from "../expr/setting";
import { isDone, taskOf } from "./task";

describe("next step", () => {
  const cases = CHAPTERS.flatMap((ch) => LEVELS.flatMap((level) => [1, 2].map((seed) => `${ch.id}/${level}/${seed}`)));
  it.each(cases)("%s", { timeout: 60_000 }, (id) => {
    const [chapter, level, seed] = id.split("/");
    const c = { ...practiceExercise(chapter, level as (typeof LEVELS)[number], Number(seed))!, rules: rulesOf(chapter) };
    const t0 = Date.now();
    const way = nextStep({ seen: [c.start], goal: c.goal, via: c.via, legs: c.legs, rules: c.rules, positive: c.positive });
    // (Generous: the whole suite runs at once, many tests side by side; alone, each takes well under a second or two.)
    expect(Date.now() - t0, "quick enough for a press").toBeLessThan(20_000);
    expect(way, c.start).not.toBeNull();
    const goal = parseState(c.goal);
    expect(isDone(goal, assuming(parseState(way!.at(-1)!), c.positive), taskOf(goal)), `${c.start} → ${way!.at(-1)}`).toBe(true);
  });

  // Partway along a stretch the board is at no milestone: it goes on to the next, not back to the one it passed.
  it("goes on from partway along a stretch", () => {
    const rules = rulesOf("simultaneous");
    const via = ["2*√(5*x - 1) + 4 = 10 ; y = 3*x - 3", "2*√(5*x - 1) = 6 ; y = 3*x - 3", "x = 2 ; y = 3*x - 3"];
    const seen = ["y = 3*x - 3 ; 2*√(2*x + y + 2) + 4 = 10", "y = 3*x - 3 ; 2*√(5*x - 1) + 4 = 10", "y = 3*x - 3 ; 2*√(5*x - 1) = 10 - 4"];
    const way = nextStep({ seen, goal: "x = 2 ; y = 3", via, rules, positive: true });
    expect(way?.[0]).toBe("y = 3*x - 3 ; 2*√(5*x - 1) = 6");
  });
});
