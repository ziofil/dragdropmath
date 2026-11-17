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
  it.each(cases)("%s", (id) => {
    const [chapter, level, seed] = id.split("/");
    const c = { ...practiceExercise(chapter, level as (typeof LEVELS)[number], Number(seed))!, rules: rulesOf(chapter) };
    const t0 = Date.now();
    const way = nextStep({ from: c.start, goal: c.goal, via: c.via, legs: c.legs, rules: c.rules, positive: c.positive });
    expect(Date.now() - t0, "quick enough for a press").toBeLessThan(3000);
    expect(way, c.start).not.toBeNull();
    const goal = parseState(c.goal);
    expect(isDone(goal, assuming(parseState(way!.at(-1)!), c.positive), taskOf(goal)), `${c.start} → ${way!.at(-1)}`).toBe(true);
  });
});
