/**
 * Every move of every lesson can be made the way a hand would try it, through
 * the real drag engine: one piece dropped on another (36 on the 6 of 36/6 as
 * well as the 6 on the 36), or a tap. Pulling something out of a √, a ln or a
 * fraction's top is a drag outwards instead (see drag.test.tsx).
 */
import { describe, expect, it } from "vitest";
import { harness } from "./testing/harness";
import { CHAPTERS, rulesOf, startOf } from "../game/puzzles";
import { carries, DRILLS, drillExercise, oneMove } from "../game/generate/moves";
import { planDemo } from "./demo";
import { allNodes } from "../expr/tree";
import { handles, RULES, tapFor } from "../rules";
import { stepDone } from "../game/solver";

const cases = Object.entries(DRILLS).flatMap(([chapterId, drills]) =>
  // Pulled out of a container, or carried out in front of a sum: a drag outwards, not onto a piece (drag.test.tsx, and every exercise's reach check).
  drills.filter((d) => !["pull-out", "out-in-front", "below"].includes(RULES[d.rule].feel?.carry ?? "")).map((d) => [chapterId, d.id] as const),
);

describe("lesson moves, by hand", () => {
  it.each(cases)("%s: %s", (chapterId, drillId) => {
    const ch = CHAPTERS.find((c) => c.id === chapterId)!;
    const rules = rulesOf(ch.id);
    for (const seed of [11, 222, 3333]) {
      const ex = drillExercise(chapterId, drillId, seed)!;
      const state = startOf(ex.start, ch);
      // The move itself (whatever the board then goes on to finish).
      const drill = DRILLS[chapterId].find((d) => d.id === drillId)!;
      const wants = oneMove(state, drill.rule, rules);
      const done = (s: (typeof wants)[number]) => wants.some((w) => stepDone(state, s, w));
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

// Show does what the words say: where they name the piece to carry (the bottom one up, the exponent onto its base), Show carries that one.
describe("lesson moves, as their words say", () => {
  const named = Object.entries(DRILLS).flatMap(([chapterId, drills]) => drills.filter((d) => d.carries).map((d) => [chapterId, d.id] as const));
  it.each(named)("%s: %s", (chapterId, drillId) => {
    const ch = CHAPTERS.find((c) => c.id === chapterId)!;
    const rules = rulesOf(ch.id);
    const drill = DRILLS[chapterId].find((d) => d.id === drillId)!;
    const carry = drill.carries!;
    for (const seed of [11, 222, 3333]) {
      const ex = drillExercise(chapterId, drillId, seed)!;
      const state = startOf(ex.start, ch);
      const goals = [ex.goal, ...ex.also].map((g) => startOf(g, ch));
      const good = (s: typeof state) => goals.some((g) => stepDone(state, s, g));
      const plan = planDemo(state, rules, drill.rule, 720, 220, good, (s, id) => carries(s, id, carry));
      expect(plan, ex.start).not.toBeNull();
      expect(plan!.kind === "drag" && carries(state, plan!.id, carry), `${ex.start}: Show carries ${plan && "id" in plan ? plan.id : "?"}, not the ${carry} its words say`).toBe(true);
    }
  });
});
