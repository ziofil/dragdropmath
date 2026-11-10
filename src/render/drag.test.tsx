/**
 * Runs the real Dragology drag engine headlessly: for every move the rules
 * offer, point where that move lands and check that dropping there actually
 * yields that move. Catches drag-spec bugs that rule tests can't see.
 */
import { describe, expect, it } from "vitest";
import {
  dragSpecToBehavior,
  renderStateReadOnly,
  getElementPositionCheap,
  Vec2,
  type Draggable,
  type DragInitContext,
  type DragSpecBuilder,
} from "dragology";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { printState, stateKey } from "../expr/key";
import { allNodes } from "../expr/tree";
import { ALL_RULES, candidatesFor, handles, isGrabbable, signOwner, type RuleId } from "../rules";
import { allPuzzles } from "../game/puzzles";
import { dragSpec, renderState, type RenderCtx } from "./layout";

const W = 720;
const H = 220;
/** A point near the start of a glyph's baseline: inside any node's hit box. */
const ANCHOR = Vec2(4, -10);
/** Drop points along the row through the piece's home, nearest first. */
const ROW = Array.from({ length: 201 }, (_, i) => Vec2(i * 4 - 400, 0)).sort((p, q) => p.len() - q.len());
/** Then a coarser 2D search around home, for vertical moves (across a fraction bar...). */
const AROUND = Array.from({ length: 41 * 21 }, (_, i) => Vec2((i % 41) * 8 - 160, Math.floor(i / 41) * 8 - 80))
  .filter((v) => v.y !== 0)
  .sort((p, q) => p.len() - q.len());

/**
 * Run one frame and also build its preview — what the screen shows mid-drag.
 * A preview that throws blanks the whole page in the app.
 */
function framed(behavior: ReturnType<typeof dragSpecToBehavior<MathState>>, pointer: Vec2): MathState {
  const result = behavior({ pointer });
  try {
    result.preview();
  } catch (e) {
    throw new Error(`preview crashed while showing ${printState(result.dropState)}: ${(e as Error).message}`);
  }
  return result.dropState;
}

function setup(state: MathState, rules: readonly RuleId[]) {
  let builder: DragSpecBuilder<MathState> | null = null;
  const draggable: Draggable<MathState> = ({ state: s, d, draggedId }) => {
    if (s === state) builder = d; // capture the library's own spec builder
    return renderState({ state: s, d, rules, draggedId }, W, H);
  };
  const ctxFor = (id: string, anchor = ANCHOR): DragInitContext<MathState> => ({
    draggable,
    draggedPath: id,
    draggedId: id,
    anchorPos: anchor,
    startState: state,
    debug: { varyVisualizer: false },
  });
  /** Canvas position of node `id`'s anchor point when the canvas shows `s`. */
  const posOf = (id: string, s: MathState) => getElementPositionCheap(ctxFor(id), s);
  /** The node boxes, exactly as the real render lays them out. */
  const rc = (id: string): RenderCtx => {
    if (!builder) renderStateReadOnly(ctxFor(id), state);
    const ctx: RenderCtx = { state, d: builder!, rules, draggedId: id };
    renderState(ctx, W, H);
    return ctx;
  };
  /** Drop node `id`, grabbed at local point `anchor`, with the pointer at `pointer`: which state results? */
  const dropAt = (id: string, pointer: Vec2, anchor = ANCHOR) => {
    const behavior = dragSpecToBehavior(dragSpec(rc(id), id), ctxFor(id, anchor));
    return framed(behavior, pointer);
  };
  /** Drag along a straight line like a hand does, frame by frame: the drop state after each frame. */
  const dragPath = (id: string, from: Vec2, to: Vec2, anchor: Vec2, steps = 30) => {
    const behavior = dragSpecToBehavior(dragSpec(rc(id), id), ctxFor(id, anchor));
    return Array.from({ length: steps + 1 }, (_, i) => {
      const pointer = from.add(to.sub(from).mul(i / steps));
      return { pointer, state: framed(behavior, pointer) };
    });
  };
  const sizeOf = (id: string) => rc(id).sizes!.get(id)!;
  return { posOf, dropAt, dragPath, sizeOf };
}

function checkAllMovesReachable(src: string, rules: readonly RuleId[]) {
  const state = parseState(src);
  const { posOf, dropAt, dragPath, sizeOf } = setup(state, rules);
  const problems: string[] = [];
  // Only symbols a learner can actually pick up (see isGrabbable).
  // Every handle a learner can actually pick up (see isGrabbable): nodes, and minus signs.
  for (const h of handles(state).filter((id) => isGrabbable(state, id, rules))) {
    const owner = signOwner(h);
    const node = state.sides.flatMap(allNodes).find((n) => n.id === (owner ?? h))!;
    const what = `${owner ? "the − of " : ""}${printState({ sides: [node] })}`;
    const home = posOf(h, state);
    if (!home) continue;
    for (const c of candidatesFor(state, h, rules)) {
      const label = `drag ${what} [${c.rule}] → ${printState(c.state)}`;
      if (c.targetId) {
        // Merges: aim like a person — centre the carried piece on the target,
        // having grabbed it at its left edge, middle, or right edge.
        const me = sizeOf(h);
        const them = sizeOf(c.targetId);
        const targetOrigin = posOf(c.targetId, state)!.sub(ANCHOR);
        // People aim with and at the symbols themselves, not their leading signs.
        const targetCentre = targetOrigin.add(Vec2(them.lead + (them.w - them.lead) / 2, (them.desc - them.asc) / 2));
        const myCentre = Vec2(me.lead + (me.w - me.lead) / 2, (me.desc - me.asc) / 2);
        // A target inside the piece (the brackets of −(x − 4)) is reached by carrying the sign onto it.
        const nested = !owner && allNodes(node).some((n) => n.id === c.targetId);
        for (const fx of nested ? [0.02] : [0.1, 0.5, 0.9]) {
          const grab = Vec2(me.w * fx, -me.asc * 0.4);
          const start = home.sub(ANCHOR).add(grab);
          const pointer = nested ? targetCentre : targetCentre.sub(myCentre).add(grab);
          const frames = dragPath(h, start, pointer, grab);
          const got = frames[frames.length - 1].state;
          if (stateKey(got, "exact") !== stateKey(c.state, "exact")) {
            problems.push(`${label}: grabbed at ${fx * 100}% and centred on target, got ${printState(got)}`);
          }
          // The bug a learner hit: heading for 5y, a swap preview moved 5y to *behind* the
          // piece, so the drop became a swap. Until the merge shows, the target must stay
          // ahead of the carried piece. (Small nudges from glyph widths are fine.)
          const ahead = (f: MathState, p: Vec2) => {
            const at = posOf(c.targetId!, f);
            if (!at) return true;
            const dir = Math.sign(pointer.x - start.x) || 1;
            const tc = at.sub(ANCHOR).x + them.lead + (them.w - them.lead) / 2;
            const pc = p.sub(grab).x + me.lead + (me.w - me.lead) / 2;
            return (tc - pc) * dir > -((them.w - them.lead) / 2);
          };
          const fled = nested
            ? undefined
            : frames.find(({ pointer: p, state: f }) => stateKey(f, "exact") !== stateKey(c.state, "exact") && !ahead(f, p));
          if (fled) problems.push(`${label}: grabbed at ${fx * 100}%, target ended up behind the piece (preview ${printState(fled.state)})`);
        }
        continue;
      }
      // Moves: some drop point along the row (or nearby, for vertical moves) must give this move. (Reorders happen when the
      // carried symbol passes a neighbour's middle, so a wide term may need to travel past
      // where it finally settles; factoring out happens past the left end.)
      const gives = (o: Vec2) => stateKey(dropAt(h, home.add(o)), "exact") === stateKey(c.state, "exact");
      if (!ROW.some(gives) && !AROUND.some(gives)) {
        const seen = new Map<string, number>();
        for (const o of ROW) {
          const k = printState(dropAt(h, home.add(o)));
          if (!seen.has(k)) seen.set(k, Math.round(o.x));
        }
        problems.push(`${label}: unreachable along the row; drops give ${[...seen].map(([k, dx]) => `${k} (dx=${dx})`).join("; ")}`);
      }
    }
    // Dropping right back where it started must change nothing.
    const back = dropAt(h, home);
    if (stateKey(back, "exact") !== stateKey(state, "exact")) {
      problems.push(`drop ${what} at home → ${printState(back)}`);
    }
  }
  return problems;
}

describe("moves inside small superscripts can be reached too", () => {
  // Mid-puzzle states the puzzle starts don't cover: combining exponents in place.
  it.each(["x^(3 + 2)", "x^(5 - 2)", "x^(2·3)", "x^(1 + 2) + 3x", "2^(1/2 + 1/2)", "(2·2)^(1/2)", "3^((1 + 1)/2)", "x = 3^2", "x^(1/2) = 3", "(3·3)^(1/2)", "3ln(x) - ln(x)", "x - (y + 1) = 3", "-x = 0", "(x - 2)/2", "x·x + x·2 - 2x", "2·(3/4)"])("%s", (src) => {
    expect(checkAllMovesReachable(src, ALL_RULES)).toEqual([]);
  });
});

describe("every allowed move can be reached by dragging", () => {
  it.each(allPuzzles().map((r) => [r.puzzle.id, r.puzzle.start, r.rules] as const))("%s: %s", (_, src, rules) => {
    expect(checkAllMovesReachable(src, rules)).toEqual([]);
  });
});
