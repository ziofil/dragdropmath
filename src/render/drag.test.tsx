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
import { ALL_RULES, candidatesFor, handles, isGrabbable, signId, signOwner, type RuleId } from "../rules";
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
  /** The drag behaviour for node `id`, to inspect frame by frame. */
  const behaviorFor = (id: string, anchor = ANCHOR) => dragSpecToBehavior(dragSpec(rc(id), id), ctxFor(id, anchor));
  return { posOf, dropAt, dragPath, sizeOf, behaviorFor };
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

describe("pulling a factor out of a log", () => {
  /** The first element in `el`'s tree with this dragologyKey. */
  const findKey = (el: unknown, k: string): { props: Record<string, unknown> } | null => {
    if (!el || typeof el !== "object") return null;
    if (Array.isArray(el)) return el.map((c) => findKey(c, k)).find(Boolean) ?? null;
    const props = (el as { props?: Record<string, unknown> }).props;
    if (!props) return null;
    if (props.dragologyKey === k) return el as { props: Record<string, unknown> };
    return findKey(props.children, k);
  };

  it.each([
    ["ln(2x)", "2", -1, "ln(2) + ln(x)"],
    ["ln(2x)", "x", 1, "ln(2) + ln(x)"],
    ["log_2(8x)", "8", -1, "log_2(8) + log_2(x)"],
  ] as const)("%s: carrying the %s out, a faint log goes with it and firms up", (src, what, dir, split) => {
    const state = parseState(src);
    const { posOf, behaviorFor } = setup(state, ALL_RULES);
    const piece = state.sides.flatMap(allNodes).find((n) => printState({ sides: [n] }) === what)!;
    const home = posOf(piece.id, state)!;
    const b = behaviorFor(piece.id);
    const frames = Array.from({ length: 31 }, (_, i) => {
      const r = b({ pointer: home.add(Vec2((dir * 160 * i) / 30, 0)) });
      const layers = r.preview();
      const shell = findKey(layers.byId.get(piece.id)?.element, "carry-shell");
      return { state: printState(r.dropState), opacity: shell?.props.opacity as number | undefined, layers };
    });
    // There from the moment it's picked up, faint...
    expect(frames[0].opacity).toBeCloseTo(0.2);
    // ...never fading as it comes out...
    for (let i = 1; i < frames.length; i++) expect(frames[i].opacity!).toBeGreaterThanOrEqual(frames[i - 1].opacity!);
    // ...and fully there once the split is what dropping would do.
    const last = frames[frames.length - 1];
    expect(last.state).toBe(split);
    expect(last.opacity).toBe(1);
    // Meanwhile no second log shows up at the destination: the carried one is it.
    // (Only the log left behind, around the rest, has a visible label.)
    const labels = [...last.layers.byId]
      .filter(([id]) => id !== piece.id)
      .filter(([, l]) => findKey(l.element, "ln") || findKey(l.element, "log"))
      .filter(([, l]) => (l.element.props as { opacity?: number }).opacity !== 0);
    expect(labels).toHaveLength(1);
  });

  it("other drags carry nothing extra", () => {
    const state = parseState("2x + 3");
    const { behaviorFor } = setup(state, ALL_RULES);
    const two = state.sides.flatMap(allNodes).find((n) => n.kind === "num" && n.value === 2)!;
    const layers = behaviorFor(two.id)({ pointer: Vec2(300, 100) }).preview();
    expect(findKey(layers.byId.get(two.id)?.element, "carry-shell")).toBeNull();
  });
});

describe("combining two logs", () => {
  /** Opacity of the first element keyed `k` in a layer (or of the layer itself). */
  const opacityOf = (el: unknown, k?: string): number => {
    const walk = (e: unknown): number | null => {
      if (!e || typeof e !== "object") return null;
      if (Array.isArray(e)) return e.map(walk).find((x) => x !== null) ?? null;
      const props = (e as { props?: Record<string, unknown> }).props;
      if (!props) return null;
      if (k === undefined || props.dragologyKey === k) return (props.opacity as number | undefined) ?? 1;
      return walk(props.children);
    };
    const o = walk(el);
    if (o === null) throw new Error(`no ${k}`);
    return o;
  };

  it.each([
    ["ln(2) + ln(x)", "ln(x)", "ln(2*x)"],
    ["ln(12) - ln(3)", "-ln(3)", "ln(12/3)"],
    ["ln(12) - ln(3)", "ln(12)", "ln(12/3)"],
  ] as const)("%s: carrying %s, its ln( ) fades on the way to the other log", (src, what, merged) => {
    const state = parseState(src);
    const { posOf, sizeOf, behaviorFor } = setup(state, ALL_RULES);
    const nodes = state.sides.flatMap(allNodes);
    const T = nodes.find((n) => printState({ sides: [n] }) === what)!;
    const L = (T.kind === "neg" ? T.arg : T) as Extract<MathState["sides"][number], { kind: "log" }>;
    const target = candidatesFor(state, T.id, ALL_RULES).find((c) => c.rule === "combine-logs")!.targetId!;
    const me = sizeOf(T.id);
    const them = sizeOf(target);
    const grab = Vec2(me.lead + 4, -10);
    const start = posOf(T.id, state)!.sub(ANCHOR).add(grab);
    const centreOf = (id: string, sz: { w: number; lead: number; asc: number; desc: number }) =>
      posOf(id, state)!.sub(ANCHOR).add(Vec2(sz.lead + (sz.w - sz.lead) / 2, (sz.desc - sz.asc) / 2));
    const end = centreOf(target, them).sub(centreOf(T.id, me)).add(start);
    const b = behaviorFor(T.id, grab);
    const frames = Array.from({ length: 31 }, (_, i) => {
      const r = b({ pointer: start.add(end.sub(start).mul(i / 30)) });
      return { state: printState(r.dropState), layers: r.preview() };
    });
    const label = (f: (typeof frames)[number]) => opacityOf(f.layers.byId.get(L.base.id)?.element);
    const bracket = (f: (typeof frames)[number]) => opacityOf(f.layers.byId.get(L.arg.id)?.element, "lp");
    const inside = (f: (typeof frames)[number]) => opacityOf(f.layers.byId.get(L.arg.id)?.element, L.arg.kind === "num" ? "t-num" : "t-var");
    // Solid when picked up...
    expect(label(frames[0])).toBeCloseTo(1);
    expect(bracket(frames[0])).toBeCloseTo(1);
    // ...fading steadily while it's still being carried, the inside staying solid...
    const carried = frames.filter((f) => f.state !== merged);
    for (let i = 1; i < carried.length; i++) expect(label(carried[i])).toBeLessThanOrEqual(label(carried[i - 1]) + 1e-9);
    const lastCarried = carried[carried.length - 1];
    expect(label(lastCarried)).toBeLessThan(0.6);
    expect(bracket(lastCarried)).toBeCloseTo(label(lastCarried));
    expect(inside(lastCarried)).toBe(1);
    if (T.kind === "neg") expect(opacityOf(lastCarried.layers.byId.get(signId(T.id))?.element)).toBeCloseTo(label(lastCarried));
    // ...and the merge still happens on the target.
    expect(frames[frames.length - 1].state).toBe(merged);
  });
});
