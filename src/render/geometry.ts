import { getElementPositionCheap, Vec2, type DragInitContext } from "dragology";
import type { MathState } from "../expr/types";
import type { RenderCtx } from "./typeset";

/**
 * Geometry of a node on the canvas, measured on the *symbol* (the box minus
 * its leading sign), since that is what people aim with and at. Aiming at
 * whole boxes put the "after this term" gap closer than the term itself,
 * because a term's sign sits on the left of its box.
 */
export type CanvasBox = { symLeft: Vec2; symRight: Vec2; centre: Vec2; w: number; h: number };

/**
 * Canvas position of node `id`'s origin (baseline-left) when the canvas shows
 * `state`. Each lookup renders the whole board, and a drag asks the same ones
 * again and again (a piece's place in a state never changes): kept per state
 * and drawing.
 */
export function originOf(ctx: DragInitContext<MathState>, id: string, state: MathState): Vec2 | null {
  let byDrawing = origins.get(state);
  if (!byDrawing) origins.set(state, (byDrawing = new WeakMap()));
  let byId = byDrawing.get(ctx.draggable);
  if (!byId) byDrawing.set(ctx.draggable, (byId = new Map()));
  if (!byId.has(id)) byId.set(id, getElementPositionCheap({ ...ctx, draggedId: id, draggedPath: id, anchorPos: Vec2(0, 0) }, state));
  return byId.get(id)!;
}
const origins = new WeakMap<MathState, WeakMap<object, Map<string, Vec2 | null>>>();

/** Where node `id` is on the canvas when it shows `rc.state` (laid out, so its size is known). */
export function canvasBox(rc: RenderCtx, ctx: DragInitContext<MathState>, id: string): CanvasBox {
  const size = rc.sizes?.get(id);
  const origin = originOf(ctx, id, rc.state);
  if (!size || !origin) throw new Error(`canvasBox: node ${id} not laid out`);
  const midY = origin.y + (size.desc - size.asc) / 2;
  return {
    symLeft: Vec2(origin.x + size.lead, midY),
    symRight: Vec2(origin.x + size.w, midY),
    centre: Vec2(origin.x + size.lead + (size.w - size.lead) / 2, midY),
    w: size.w - size.lead,
    h: size.asc + size.desc,
  };
}

/** Centre of the carried symbol (without its sign): floating keeps the grab point under the pointer. */
export function carriedCentre(rc: RenderCtx, ctx: DragInitContext<MathState>, pointer: Vec2): Vec2 {
  const me = rc.sizes!.get(ctx.draggedId!)!;
  return pointer.sub(ctx.anchorPos).add(Vec2(me.lead + (me.w - me.lead) / 2, (me.desc - me.asc) / 2));
}

/** 0 → 1: how far `p` has come from `from` towards `to`, by distance (1 within `settled` of it). */
export function approach(p: Vec2, from: Vec2, to: Vec2, settled = 0): number {
  const far = Math.max(1, from.dist(to));
  const close = Math.min(settled, far / 4);
  return clamp01((far - p.dist(to)) / (far - close));
}

/** 0 → 1: how far `p` has come from `from` along the direction to `to` (projected). */
export function along(p: Vec2, from: Vec2, to: Vec2): number {
  const d = to.sub(from);
  return clamp01(p.sub(from).dot(d) / Math.max(1e-9, d.dot(d)));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
