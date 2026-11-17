// More practice: every level makes good exercises, and each shape's can be solved with the chapter's moves (run by practice.*.test.ts).
import { describe, expect, it } from "vitest";
import { rulesOf } from "../../puzzles";
import { assuming } from "../../../expr/setting";
import { parseState } from "../../../expr/parse";
import { atCheckpoint } from "../../solver";
import { follows } from "../../answers";
import { exerciseOf, hasPractice, LEVELS, nicest, PRACTICE, practiceExercise } from "../practice";
import { SLOW } from "../../testing/corpus";
import { stuckOf, verify } from "../verify";
import { rng } from "../write";

/** Exercises checked per shape (a composed shape is many shapes in one: more of those). One in a quick run: a shape's way is the same each time. */
const PER_SHAPE = SLOW ? 6 : 1;
const PER_COMPOSED = SLOW ? 40 : 4;

/** The checks for some chapters (split over files, so they run side by side). */
export function practiceChecks(chapters: (id: string) => boolean) {
  describe("more practice", () => {
    for (const [chapterId, levels] of Object.entries(PRACTICE).filter(([id]) => hasPractice(id) && chapters(id))) {
      const rules = rulesOf(chapterId);
      for (const level of LEVELS) {
        it(`${chapterId}, ${level}: the same seed, the same exercise; never none`, () => {
          expect(practiceExercise(chapterId, level, 42)).toEqual(practiceExercise(chapterId, level, 42));
          // Never an empty exercise (a broken link), whatever the seed.
          for (let seed = 1000; seed < 1030; seed++) expect(practiceExercise(chapterId, level, seed), `seed ${seed}`).not.toBeNull();
          // (32 exercises made as practice makes them: a walked one takes up to a couple of hundred milliseconds.)
        }, 60_000);
        it(`${chapterId}, ${level}: a shape more or less leaves the other shapes' links as they were`, () => {
          const shapes = levels[level];
          for (let seed = 1; seed <= 10; seed++) {
            const all = exerciseOf(shapes, seed);
            if (all?.shape !== shapes[0].id) expect(exerciseOf(shapes.slice(1), seed), `seed ${seed}`).toEqual(all);
          }
        }, 60_000);
        // Each shape on its own, as practice serves them: solved move by move, and the goal really is the answer.
        for (const shape of levels[level])
          it(`${chapterId}, ${level}, ${shape.id}: solvable`, () => {
            for (let k = 0; k < (shape.id === "composed" ? PER_COMPOSED : PER_SHAPE); k++) {
              const d = nicest(shape, rng(7919 * (k + 1)));
              expect(d, "makes nothing usable").not.toBeNull();
              // No milestone is the start, the goal, or the one before it (a − c = 1 once made x = 4 a milestone of x = 4).
              // (As the board is at a checkpoint: terms and rows in any order.)
              const all = [d!.start, ...d!.via, d!.goal].map((t) => parseState(t));
              const at = (i: number, j: number) => atCheckpoint(all[i], all[j]);
              expect(d!.via.filter((_, i) => at(i + 1, i) || at(i + 1, 0) || at(i + 1, all.length - 1)), d!.start).toEqual([]);
              // Built backwards: the stretches go with the moves they say (what practice checks before serving;
              // a walk's stretches proven as it walked are taken as done there, as here).
              if (d!.legs) expect(stuckOf(verify(d!, rules, { quick: true, trusting: true })), `${d!.start}, quickly`).toBe("");
              // Fully, with all the chapter's moves: for a hand-written shape (no stretches to go by), for a
              // walk (its proven stretches searched again), and in a slow run for every shape, without the stretches' word.
              if (!d!.legs || d!.proven || SLOW) expect(stuckOf(verify(SLOW ? { ...d!, legs: undefined } : d!, rules)), d!.start).toBe("");
              const start = parseState(d!.start);
              expect(follows(assuming(start, d!.positive), parseState(d!.goal)), `${d!.start} ⇒ ${d!.goal}`).toBe(true);
            }
          }, 120_000);
      }
    }
  });
}
