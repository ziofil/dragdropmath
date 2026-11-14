// Learning the moves: every drill makes a start its move can be made on, with the goal exactly that one move away.
import { describe, expect, it } from "vitest";
import { CHAPTERS, lettersPositive, rulesFor } from "../puzzles";
import { parseState } from "../../expr/parse";
import { stateKey } from "../../expr/key";
import { en } from "../../i18n/en";
import { DRILLS, drillExercise, oneMove } from "./moves";

describe("learn the moves", () => {
  it("every chapter's drills are real chapters, and every drill has its words", () => {
    for (const id of Object.keys(DRILLS)) expect(CHAPTERS.some((c) => c.id === id), id).toBe(true);
    const ids = Object.values(DRILLS).flatMap((ds) => ds.map((d) => d.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.sort()).toEqual(Object.keys(en.drills).sort());
  });

  it("every move can be learnt, in its own chapter or (splitting a root) a later one", () => {
    const taught = new Set(Object.values(DRILLS).flatMap((ds) => ds.map((d) => d.rule)));
    // Two ways to work out a power: tapping it is the one taught.
    for (const c of CHAPTERS) for (const rule of c.unlocks.filter((r) => r !== "evaluate-power")) expect(taught.has(rule), `${c.id}: ${rule}`).toBe(true);
  });

  for (const [chapterId, drills] of Object.entries(DRILLS)) {
    const ci = CHAPTERS.findIndex((c) => c.id === chapterId);
    const rules = rulesFor(ci);
    for (const drill of drills)
      it(`${chapterId}: ${drill.id}`, () => {
        expect(drillExercise(chapterId, drill.id, 42)).toEqual(drillExercise(chapterId, drill.id, 42));
        for (let seed = 1; seed <= 40; seed++) {
          const d = drillExercise(chapterId, drill.id, seed * 7919);
          expect(d, `seed ${seed}`).not.toBeNull();
          const parsed = parseState(d!.start);
          const start = lettersPositive(CHAPTERS[ci]) ? { ...parsed, letters: "positive" as const } : parsed;
          const goal = stateKey(parseState(d!.goal), "exact");
          expect(goal, d!.start).not.toBe(stateKey(start, "exact"));
          expect(oneMove(start, drill.rule, rules).map((s) => stateKey(s, "exact")), `${d!.start} → ${d!.goal}`).toContain(goal);
        }
      });
  }
});
