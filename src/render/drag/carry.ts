/**
 * Specs for carrying a piece somewhere that isn't a merge target: along its
 * row, across =, out of a container, out in front. Each reports the gap from
 * the carried symbol to where that move puts it; `closest` picks the nearest.
 */
import { renderStateReadOnly, Vec2, type DragInitContext, type DragSpec } from "dragology";
import type { MathState } from "../../expr/types";
import { locate, nodeAt } from "../../expr/tree";
import { dragCtx } from "../../rules/types";
import { withoutMarks } from "../../rules";
import { canvasBox, carriedCentre } from "../geometry";
import { renderState, type RenderCtx } from "../typeset";
import type { DragEnv } from "./env";

/**
 * Reordering by *order*, not distance: the carried piece goes into the slot
 * given by how many of its neighbours' centres lie before its own centre. So
 * a slot beyond a neighbour is only reached after passing that neighbour's
 * middle — where a merge with it, if possible, has already taken over.
 * (Aiming at the nearest gap let "in front of 5y" win just before 5y's merge
 * zone, sending 5y behind the piece.) The gap is 0 over the row and grows
 * with the distance off it, so moves that leave the row can win out there.
 */
export function rowSlot(
  { rc, d }: DragEnv,
  draggedId: string,
  rowIds: string[],
  myIndex: number,
  reorders: Map<number, MathState>,
): DragSpec<MathState> {
  return d.custom((ctx: DragInitContext<MathState>) => {
    const boxes = (rowIds.length ? rowIds : [draggedId]).map((id) => canvasBox(rc, ctx, id));
    const others = boxes.filter((_, k) => rowIds.length && k !== myIndex).map((b) => b.centre.x);
    const h = Math.max(...boxes.map((b) => b.h));
    const left = boxes[0].symLeft.x - 0.5 * h;
    const right = boxes[boxes.length - 1].symRight.x + 0.5 * h;
    const midY = boxes[0].centre.y;
    // Staying put, minus the previous move's "copied from" marks: a copy that
    // disappears now (merged away) must not fly back into where it came from.
    const stay = withoutMarks(rc.state);
    const previews = new Map<number, () => ReturnType<typeof renderStateReadOnly>>();
    const previewOf = (slot: number, state: MathState) => {
      if (!previews.has(slot)) {
        const layered = renderStateReadOnly(ctx, state);
        previews.set(slot, () => layered);
      }
      return previews.get(slot)!;
    };
    return (frame) => {
      const c = carriedCentre(rc, ctx, frame.pointer);
      const slot = others.filter((x) => x < c.x).length;
      const state = reorders.get(slot) ?? stay;
      const dx = Math.max(0, left - c.x, c.x - right);
      const dy = Math.max(0, Math.abs(c.y - midY) - h / 2);
      const at = reorders.has(slot) ? slot : -1;
      // Naming the slot lets the engine animate a change of slot: the
      // neighbours slide out of the way instead of jumping there.
      return { preview: previewOf(at, state), dropState: state, gap: Math.hypot(dx, dy), activePath: `slot${at}`, activePathTransition: SLIDE };
    };
  });
}

/** How the rest of the expression moves when the preview changes under a drag: a short slide. */
export const SLIDE = { easing: "cubic-out", duration: 160 } as const;

/** Distance from the carried symbol's centre to `aim` (computed once per drag). */
function aimAt({ rc, d }: DragEnv, result: MathState, aim: (ctx: DragInitContext<MathState>) => Vec2): DragSpec<MathState> {
  return d.custom((ctx: DragInitContext<MathState>) => {
    const preview = lazily(() => renderStateReadOnly(ctx, result));
    const target = aim(ctx);
    return (frame) => ({ preview, dropState: result, gap: carriedCentre(rc, ctx, frame.pointer).dist(target) });
  });
}

/**
 * Drawn the first time it's needed, then kept: a drag offers many moves, and
 * most of their pictures are never shown (nor needed to tell which move a drop
 * gives).
 */
export function lazily<T>(make: () => T): () => T {
  let made: { v: T } | null = null;
  return () => (made ??= { v: make() }).v;
}

/** A state laid out on a W×H canvas, kept: the same state always lays out the same. */
export function laidOut(state: MathState, W: number, H: number): RenderCtx {
  const key = `${W}x${H}`;
  let byCanvas = layouts.get(state);
  if (!byCanvas) layouts.set(state, (byCanvas = new Map()));
  let rc = byCanvas.get(key);
  if (!rc) {
    rc = { state };
    renderState(rc, W, H);
    byCanvas.set(key, rc);
  }
  return rc;
}
const layouts = new WeakMap<MathState, Map<string, RenderCtx>>();

/**
 * A move that leaves the row (across =, ...): aim for where the symbol itself
 * would sit afterwards — measured like everything else, symbol centre to
 * symbol centre. (Dragology's landing spots are measured from the element's
 * origin, which includes a sign that may not be there afterwards.)
 */
export function landing(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(env, result, AIMS.landing(env.rc, draggedId, result));
}

/**
 * A piece carried across = (a term, a bottom, a factor) can also be let go
 * anywhere over the other side, not only just where it will sit: dropped on
 * the 16 of x + 6 = 16, the 6 goes across. Aims at the middle of that side,
 * when the piece ends up there (part of a side: a whole side carried over
 * is swapping them).
 */
export function overOtherSide(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState>[] {
  const from = locate(env.rc.state, draggedId);
  const to = locate(result, draggedId);
  // A whole side carried over the other is swapping them (11 = x → x = 11), not this.
  if (!from || !to || env.rc.state.sides.length !== 2 || from.side === to.side || from.path.length === 0) return [];
  const side = env.rc.state.sides[to.side];
  const { rc, d } = env;
  return [
    d.custom((ctx: DragInitContext<MathState>) => {
      const preview = lazily(() => renderStateReadOnly(ctx, result));
      const box = canvasBox(rc, ctx, side.id);
      return (frame) => {
        const at = carriedCentre(rc, ctx, frame.pointer);
        // Only once it's over that side: short of it, the row's own slots (a swap with the last term) come first.
        const over = at.x >= box.symLeft.x && at.x <= box.symRight.x;
        return { preview, dropState: result, gap: over ? at.dist(box.centre) : Infinity };
      };
    }),
  ];
}

/**
 * Pulling something out of its container, past the container's edge: a
 * factor out of ln( … ) or √( … ), or a term out of a fraction's top. The
 * first one goes out to the left, the others to the right.
 */
export function pullOut(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(env, result, AIMS["pull-out"](env.rc, draggedId, result));
}

export function pullOutAim(rc: RenderCtx, ctx: DragInitContext<MathState>, draggedId: string): Vec2 {
  const c = dragCtx(rc.state, draggedId)!;
  const containerId = dragCtx(rc.state, c.parent!.id)!.parent!.id;
  const b = canvasBox(rc, ctx, containerId);
  return c.index === 0 ? b.symLeft.sub(Vec2(0.6 * b.h, 0)) : b.symRight.add(Vec2(0.6 * b.h, 0));
}

/**
 * Pulling a piece down, away from where it is (a factor out of a product
 * equal to 0, onto a row of its own): aim straight below it, wherever the
 * result then draws it.
 */
export function below(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(env, result, AIMS.below(env.rc, draggedId, result));
}

/** Factoring out: carry the factor out past the left end of its expression. */
export function outInFront(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(env, result, AIMS["out-in-front"](env.rc, draggedId, result));
}

/**
 * Swapping the sides: carry a whole side past the far end of the other side
 * (past its left end, coming from the right, and the other way round).
 */
export function farEnd(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(env, result, AIMS["far-end"](env.rc, draggedId, result));
}

type Aim = (ctx: DragInitContext<MathState>) => Vec2;

/**
 * Where the carried symbol's centre aims, for each way a move without a
 * target is carried (see Feel): what the drag measures against, and what
 * tests drop at to check the move can be reached.
 */
export const AIMS: Record<"landing" | "pull-out" | "below" | "out-in-front" | "far-end", (rc: RenderCtx, draggedId: string, result: MathState) => Aim> = {
  // Where the piece itself sits afterwards.
  landing: (rc, id, result) => (ctx) => canvasBox(laidOut(result, rc.canvas!.W, rc.canvas!.H), ctx, id).centre,
  "pull-out": (rc, id) => (ctx) => pullOutAim(rc, ctx, id),
  // Straight below it, wherever the result then draws it.
  below: (rc, id) => (ctx) => {
    const b = canvasBox(rc, ctx, id);
    return b.centre.add(Vec2(0, 1.6 * b.h));
  },
  // Past the left end of the sum it's taken out of: the nearest one *around* it (a bracket being taken out is a sum itself).
  "out-in-front": (rc, id) => {
    const up = (l: NonNullable<ReturnType<typeof locate>>) => (l.path.length ? { ...l, path: l.path.slice(0, -1) } : null);
    const at = locate(rc.state, id);
    let loc = at && up(at);
    while (loc && nodeAt(rc.state, loc).kind !== "sum") loc = up(loc);
    const first = loc && (nodeAt(rc.state, loc) as { terms: { id: string }[] }).terms[0].id;
    return (ctx) => {
      const b = canvasBox(rc, ctx, first ?? id);
      return b.symLeft.sub(Vec2(0.9 * b.h, 0));
    };
  },
  // At the far edge of the other side itself: past it, a long side would put the aim out of reach.
  "far-end": (rc, id) => {
    const at = locate(rc.state, id)!;
    const other = rc.state.sides[at.side ^ 1];
    return (ctx) => {
      const b = canvasBox(rc, ctx, other.id);
      return at.side % 2 === 1 ? b.symLeft : b.symRight;
    };
  },
};
