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
      return { preview: previewOf(reorders.has(slot) ? slot : -1, state), dropState: state, gap: Math.hypot(dx, dy) };
    };
  });
}

/** Distance from the carried symbol's centre to `aim` (computed once per drag). */
function aimAt({ rc, d }: DragEnv, result: MathState, aim: (ctx: DragInitContext<MathState>) => Vec2): DragSpec<MathState> {
  return d.custom((ctx: DragInitContext<MathState>) => {
    const preview = renderStateReadOnly(ctx, result);
    const target = aim(ctx);
    return (frame) => ({ preview: () => preview, dropState: result, gap: carriedCentre(rc, ctx, frame.pointer).dist(target) });
  });
}

/**
 * A move that leaves the row (across =, ...): aim for where the symbol itself
 * would sit afterwards — measured like everything else, symbol centre to
 * symbol centre. (Dragology's landing spots are measured from the element's
 * origin, which includes a sign that may not be there afterwards.)
 */
export function landing(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(env, result, (ctx) => {
    const after: RenderCtx = { state: result };
    renderState(after, env.rc.canvas!.W, env.rc.canvas!.H);
    return canvasBox(after, ctx, draggedId).centre;
  });
}

/**
 * Pulling something out of its container, past the container's edge: a
 * factor out of ln( … ) or √( … ), or a term out of a fraction's top. The
 * first one goes out to the left, the others to the right.
 */
export function pullOut(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(env, result, (ctx) => pullOutAim(env.rc, ctx, draggedId));
}

export function pullOutAim(rc: RenderCtx, ctx: DragInitContext<MathState>, draggedId: string): Vec2 {
  const c = dragCtx(rc.state, draggedId)!;
  const containerId = dragCtx(rc.state, c.parent!.id)!.parent!.id;
  const b = canvasBox(rc, ctx, containerId);
  return c.index === 0 ? b.symLeft.sub(Vec2(0.6 * b.h, 0)) : b.symRight.add(Vec2(0.6 * b.h, 0));
}

/** Factoring out: carry the factor out past the left end of its expression. */
export function outInFront(env: DragEnv, draggedId: string, result: MathState): DragSpec<MathState> {
  const { rc } = env;
  // The sum it's taken out of: the nearest one *around* it (a bracket being taken out is a sum itself).
  const up = (l: NonNullable<ReturnType<typeof locate>>) => (l.path.length ? { ...l, path: l.path.slice(0, -1) } : null);
  const at = locate(rc.state, draggedId);
  let loc = at && up(at);
  while (loc && nodeAt(rc.state, loc).kind !== "sum") loc = up(loc);
  const first = loc && (nodeAt(rc.state, loc) as { terms: { id: string }[] }).terms[0].id;
  return aimAt(env, result, (ctx) => {
    const b = canvasBox(rc, ctx, first ?? draggedId);
    return b.symLeft.sub(Vec2(0.9 * b.h, 0));
  });
}
