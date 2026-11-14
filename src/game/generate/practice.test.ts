// More practice: every level makes good exercises, and each shape's can be solved with the chapter's moves.
import { describe, expect, it } from "vitest";
import { CHAPTERS, lettersPositive, rulesFor } from "../puzzles";
import { parseState } from "../../expr/parse";
import { autoDecoys } from "../autoDecoys";
import { judge } from "./beauty";
import { hasPractice, LEVELS, PRACTICE, practiceExercise } from "./practice";
import { verify } from "./verify";

describe("more practice", () => {
  for (const [chapterId, levels] of Object.entries(PRACTICE).filter(([id]) => hasPractice(id))) {
    const ci = CHAPTERS.findIndex((c) => c.id === chapterId);
    const rules = rulesFor(ci);
    const positive = lettersPositive(CHAPTERS[ci]);
    for (const level of LEVELS) {
      it(`${chapterId}, ${level}: the same seed, the same exercise; every shape solvable`, () => {
        expect(practiceExercise(chapterId, level, 42)).toEqual(practiceExercise(chapterId, level, 42));
        // Seeds until each of the level's shapes has come up twice, each solved move by move.
        const left = new Map(levels[level].map((s) => [s.id, 2]));
        for (let seed = 1; left.size && seed < 200; seed++) {
          const d = practiceExercise(chapterId, level, seed);
          expect(d, `seed ${seed}`).not.toBeNull();
          if (!left.has(d!.shape)) continue;
          expect(judge(d!).ok).toBe(true);
          // Two wrong answers to predict between.
          expect(autoDecoys(parseState(d!.start), parseState(d!.goal)).length, d!.start).toBeGreaterThanOrEqual(2);
          const check = verify(d!, rules, positive);
          expect(check.moves, `${d!.start}: ${"stuck" in check ? check.stuck : ""}`).not.toBeNull();
          const n = left.get(d!.shape)! - 1;
          if (n) left.set(d!.shape, n);
          else left.delete(d!.shape);
        }
        expect([...left.keys()]).toEqual([]);
        // Never an empty exercise (a broken link), whatever the seed.
        for (let seed = 1000; seed < 1300; seed++) expect(practiceExercise(chapterId, level, seed), `seed ${seed}`).not.toBeNull();
      }, 120_000);
    }
  }
});
