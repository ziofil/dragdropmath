/**
 * Every move of every lesson can be made the way a hand would try it, through
 * the real drag engine: one piece dropped on another (36 on the 6 of 36/6 as
 * well as the 6 on the 36), or a tap. Pulling something out of a √, a ln or a
 * fraction's top is a drag outwards instead (see drag.test.tsx).
 */
import { describe, expect, it } from "vitest";
import { harness } from "./testing/harness";
import { CHAPTERS, rulesFor, startOf } from "../game/puzzles";
import { DRILLS, drillExercise } from "../game/generate/moves";
import { allNodes } from "../expr/tree";
import { handles, RULES, tapFor } from "../rules";
import { parseState } from "../expr/parse";
import { stepDone } from "../game/solver";

const cases = Object.entries(DRILLS).flatMap(([chapterId, drills]) =>
  drills.filter((d) => RULES[d.rule].feel?.carry !== "pull-out").map((d) => [chapterId, d.id] as const),
);

describe("lesson moves, by hand", () => {
  it.each(cases)("%s: %s", (chapterId, drillId) => {
    const ch = CHAPTERS.find((c) => c.id === chapterId)!;
    const rules = rulesFor(CHAPTERS.indexOf(ch));
    for (const seed of [11, 222, 3333]) {
      const ex = drillExercise(chapterId, drillId, seed)!;
      const state = startOf(ex.start, ch);
      const wants = [ex.goal, ...ex.also].map((g) => parseState(g));
      const done = (s: ReturnType<typeof parseState>) => wants.some((w) => stepDone(state, s, w));
      const h = harness(state, rules);
      const nodes = state.sides.flatMap(allNodes);
      const ways = handles(state).flatMap((a) => {
        const tap = tapFor(state, a, rules);
        if (tap && done(tap.state)) return ["tap"];
        let grip;
        try {
          grip = h.grab(a);
        } catch {
          return [];
        }
        // Onto every piece that's drawn (a root's ½ isn't: it is the √).
        const dropsOn = (b: string) => {
          const at = h.originOf(b) && h.centreOf(b);
          return at ? done(grip.at(grip.centreOn(at)).state) : false;
        };
        return nodes.filter((b) => b.id !== a && dropsOn(b.id)).map((b) => `${a} → ${b.id}`);
      });
      expect(ways.length, `${ex.start} → ${ex.goal}: no piece dropped on another, nor a tap, makes it`).toBeGreaterThan(0);
    }
  });
});
