/**
 * Every exercise can be solved, as a learner would: with the moves of the
 * chapter and of every chapter on the way to it, and tidying after each move,
 * as the app does. Split into shards (solvable.*.test.ts) that run in parallel.
 */
import { describe, expect, it } from "vitest";
import { parseState } from "../../expr/parse";
import { allPuzzles } from "../puzzles";
import { solutionVia } from "../solver";

/** Every `n`th exercise from the `k`th. */
export function solvableShard(k: number, n: number) {
  const mine = allPuzzles().filter((_, i) => i % n === k);
  describe(`exercises can be solved (${k + 1} of ${n})`, () => {
    it.each(mine.map((r) => [r.puzzle.id, r] as const))("%s can be solved", (_, ref) => {
      const { puzzle, rules } = ref;
      // Long ones are checked checkpoint by checkpoint (see Puzzle.via).
      const way = solutionVia(parseState(puzzle.start), parseState(puzzle.goal), (puzzle.via ?? []).map(parseState), rules, {
        maxDepth: 10,
        maxStates: 120_000,
      });
      expect(way, `${puzzle.start} → ${[...(puzzle.via ?? []), puzzle.goal].join(" → ")}`).not.toBeNull();
      // What limits the search is maxStates (the same on every run). The time
      // limit is only a backstop: with every core busy, a long search can take
      // well over half a minute.
    }, 120_000);
  });
}
