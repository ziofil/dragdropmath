/**
 * The move system's promises (docs/move-system.md), checked on what learners
 * meet (testing/corpus.ts: every lesson board and practice shape, its start
 * and the checkpoints along its way):
 *
 * 1. Reachable: every step the engine allows can be made on screen — its
 *    piece picked up by a quick press or a hold somewhere, or a tap somewhere
 *    giving it (render/press.ts decides what a press takes).
 * 2. One meaning: dropping a piece on a target gives one result (a tap has
 *    one by construction: rules/taps.ts).
 * 3. Taught: every move that isn't tidying has a lesson board.
 */
import { describe, expect, it } from "vitest";
import type { MathState } from "../expr/types";
import { printState, stateKey } from "../expr/key";
import { allNodes } from "../expr/tree";
import { ALL_RULES, handles, movesFor, opOwner, RULES, signOwner, stepsFrom, type RuleId } from "../rules";
import { corpus } from "../game/testing/corpus";
import { CHAPTERS, rulesOf, startOf } from "../game/puzzles";
import { drillExercise } from "../game/generate/moves";
import { GESTURES, type Gesture } from "../game/generate/drill";
import { en } from "../i18n/en";
import { boardFor } from "./press";

const same = (a: MathState) => (b: MathState) => stateKey(a, "exact") === stateKey(b, "exact");

function statesOf(c: ReturnType<typeof corpus>[number]): MathState[] {
  const out: MathState[] = [];
  for (const src of [c.start, ...c.via]) {
    try {
      out.push(startOf(src, c.chapter, c.positive));
    } catch {
      // a checkpoint written loosely (not a state of its own): skip
    }
  }
  return out;
}

const name = (s: MathState, id: string) => {
  const owner = signOwner(id);
  const n = s.sides.flatMap(allNodes).find((x) => x.id === (owner ?? id));
  return `${owner ? "the − of " : ""}${n ? printState({ sides: [n] }) : id}`;
};

/** Steps no press, hold or tap on screen makes. */
export function unreachable(s: MathState, rules: readonly RuleId[]): string[] {
  const board = boardFor(s, rules, 720, 220);
  const out: string[] = [];
  for (const step of stepsFrom(s, rules)) {
    const ok = step.ways.some((w) => (w.tap ? board.tapSpotFor(w.id, same(step.state)) !== null : board.spotFor(w.id) !== null));
    if (!ok) out.push(`${printState(s)} → ${printState(step.state)} (${step.ways.map((w) => `${w.tap ? "tap" : "drag"} ${name(s, w.id)} [${w.candidate.rule}]`).join(", ")})`);
  }
  return out;
}

/**
 * Drops on one target with more than one result. (A tap has one meaning by
 * construction: what the piece is decides it, rules/taps.ts.)
 */
export function ambiguous(s: MathState, rules: readonly RuleId[]): string[] {
  const out: string[] = [];
  const moves = movesFor(s, rules);
  for (const id of handles(s)) {
    const byTarget = new Map<string, Map<string, RuleId>>();
    for (const c of moves.drag(id)) {
      if (!c.targetId) continue;
      const m = byTarget.get(c.targetId) ?? new Map();
      m.set(stateKey(c.state, "exact"), c.rule);
      byTarget.set(c.targetId, m);
    }
    for (const [t, m] of byTarget) if (m.size > 1) out.push(`drop ${name(s, id)} on ${name(s, t)}: ${[...m.values()].join(" or ")}`);
  }
  return out;
}

const cases = corpus().map((c) => [c.id, c] as const);

describe("every step can be made on screen", () => {
  it.each(cases)("%s", (_, c) => {
    expect(statesOf(c).flatMap((s) => unreachable(s, c.rules))).toEqual([]);
  });
});

describe("every gesture has one meaning", () => {
  it.each(cases)("%s", (_, c) => {
    expect([...new Set(statesOf(c).flatMap((s) => ambiguous(s, c.rules)))]).toEqual([]);
  });
});

/** How a step's way is made on this board, as gestures (a drag with no gesture of its own is just a drag). */
function gesturesOf(s: MathState, rules: readonly RuleId[], step: { ways: { id: string; tap: boolean }[] }): Set<Gesture> {
  const board = boardFor(s, rules, 720, 220);
  const out = new Set<Gesture>();
  for (const w of step.ways) {
    if (w.tap) {
      if (opOwner(w.id)) out.add("operator-tap");
      continue;
    }
    if (signOwner(w.id)) out.add("minus-alone");
    const spot = board.spotFor(w.id);
    if (spot?.hold) out.add("hold");
    if (spot && board.opAt(spot.at)?.joins === w.id) out.add("operator-grab");
  }
  return out;
}

describe("every move is taught", () => {
  const drills = CHAPTERS.flatMap((c) => c.drills.map((d) => ({ chapter: c, drill: d })));
  it("every move a learner makes has a lesson board", () => {
    const taught = new Set(drills.map(({ drill }) => drill.rule));
    expect(ALL_RULES.filter((r) => !RULES[r].tidy && !taught.has(r))).toEqual([]);
  });
  it("every lesson board has its words: a name, how to do it, and why", () => {
    const words = en.drills as Record<string, { name?: string; how?: string; text?: string[] } | undefined>;
    expect(drills.filter(({ drill }) => !words[drill.id]?.name || !words[drill.id]?.how || !words[drill.id]?.text?.length).map(({ drill }) => drill.id)).toEqual([]);
  });
  it("every gesture has a lesson board, whose first step is made that way", () => {
    const missing: string[] = [];
    for (const g of GESTURES) {
      const boards = drills.filter(({ drill }) => drill.shows?.includes(g));
      if (!boards.length) missing.push(`${g}: no board teaches it`);
      for (const { chapter, drill } of boards) {
        const ex = drillExercise(chapter.id, drill.id, 1)!;
        const s = startOf(ex.start, chapter, ex.positive);
        const rules = rulesOf(chapter.id);
        if (!stepsFrom(s, rules).some((step) => gesturesOf(s, rules, step).has(g))) missing.push(`${g}: ${drill.id}'s board (${ex.start}) has no step made that way`);
      }
    }
    expect(missing).toEqual([]);
  });
});
