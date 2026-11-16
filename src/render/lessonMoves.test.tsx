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
import { planDemo, planStepTo } from "./demo";
import type { MathState } from "../expr/types";
import { printState, stateKey } from "../expr/key";
import { tidied } from "../game/tidy";
import { wayOn } from "../game/showWay";
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

// Show plays a board to its end: the lesson's own move (as above), then every step on, through the
// board's checkpoints, each made as a hand would make it (a tap, or a drag through the real engine).
describe("Show plays every lesson board to its end", () => {
  const all = Object.entries(DRILLS).flatMap(([chapterId, drills]) => drills.map((d) => [chapterId, d.id] as const));
  const same = (a: MathState, b: MathState) => stateKey(a, "exact") === stateKey(b, "exact");
  it.each(all)("%s: %s", (chapterId, drillId) => {
    const ch = CHAPTERS.find((c) => c.id === chapterId)!;
    const rules = rulesOf(ch.id);
    const drill = DRILLS[chapterId].find((d) => d.id === drillId)!;
    for (const seed of [11, 222]) {
      const ex = drillExercise(chapterId, drillId, seed)!;
      const start = startOf(ex.start, ch);
      const goals = [ex.goal, ...ex.also].map((g) => startOf(g, ch));
      const stops = (ex.via ?? []).map((v) => startOf(v, ch));
      const reached = (s: MathState) => goals.some((g) => stepDone(start, s, g));
      const toward = (s: MathState) => reached(s) || (stops.length > 0 && stepDone(start, tidied(start, s), stops[0]));
      const first = planDemo(start, rules, drill.rule, 720, 160, toward, drill.carries && ((s, id) => carries(s, id, drill.carries!)));
      expect(first, `${ex.start}: the lesson's move`).not.toBeNull();
      let at = tidied(start, first!.next);
      const shown = [printState(at)];
      let way: MathState[] | null = null;
      while (!reached(at)) {
        if (way?.length && same(at, way[0])) way = way.slice(1);
        else way = wayOn(at, stops, reached, rules);
        expect(way?.length, `${ex.start}: no way on from ${printState(at)} (shown: ${shown.join(" ; ")})`).toBeGreaterThan(0);
        const next = way![0];
        const from = at;
        const step = planStepTo(from, rules, 720, 160, (s) => same(tidied(from, s), next));
        expect(step, `${ex.start}: can't show ${printState(from)} → ${printState(next)}`).not.toBeNull();
        at = tidied(from, step!.next);
        shown.push(printState(at));
        expect(shown.length, `${ex.start}: ${shown.join(" ; ")}`).toBeLessThan(30);
      }
    }
  }, 120_000);
});
