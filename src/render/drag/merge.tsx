/**
 * Carrying a piece onto another it can merge with: the result forms
 * gradually as the piece approaches, and letting go merges once the picture
 * is mostly the result.
 */
import {
  Box,
  DistanceLine,
  getElementPositionCheap,
  operator,
  Operator,
  renderStateReadOnly,
  Vec2,
  type DragFrame,
  type DragInitContext,
  type DragSpec,
  type LayeredSvgx,
  type OpOverlayVisProps,
  type OpResult,
  type OpTreeViewProps,
} from "dragology";
import type { MathState } from "../../expr/types";
import { allNodes, locate, nodeAt } from "../../expr/tree";
import type { Candidate } from "../../rules";
import { approach, canvasBox, carriedCentre, originOf } from "../geometry";
import { PROBE, PROBE_SPAN, withProbe } from "../preview";
import type { RenderCtx } from "../typeset";
import type { DragEnv } from "./env";

/**
 * "On" a target = the carried symbol's centre is over the target symbol
 * (within half its width), or at least this fraction of the wider of the two.
 */
const ON_TARGET = 0.3;

/** How far the picture must be blended towards a merge for letting go to merge. */
export const MERGE_AT = 0.5;

/** How close to where it ends up counts as "all the way there" while holding. */
const SETTLED_PX = 6;

/** Blend amount for progress t: barely anything at first, most of the change near the target. */
const ease = (t: number) => t * t;

/**
 * Whether the carried piece is "on" the target: keyed to where the carried
 * *piece* is, not the pointer — people line up the symbol they carry with the
 * one they aim at, wherever they grabbed it. (Dragology's `dropTarget` is
 * pointer-in-bounds.)
 */
export function onTarget(rc: RenderCtx, ctx: DragInitContext<MathState>, draggedId: string, targetId: string) {
  // A target *inside* the dragged piece (the brackets of −(x − 4)) is always
  // under it, so there the grab point itself must reach it, after a real move.
  const loc = locate(rc.state, draggedId);
  const nested = !!loc && allNodes(nodeAt(rc.state, loc)).some((n) => n.id === targetId);
  const t = canvasBox(rc, ctx, targetId);
  const me = canvasBox(rc, ctx, draggedId);
  const home = getElementPositionCheap(ctx, rc.state);
  const reachX = Math.max(t.w / 2, ON_TARGET * Math.max(me.w, t.w));
  const reachY = (me.h + t.h) / 4;
  return {
    nested,
    centre: t.centre,
    h: t.h,
    hit(pointer: Vec2): boolean {
      if (nested) {
        const moved = home ? pointer.dist(home) > 0.3 * t.h : true;
        return moved && pointer.x >= t.symLeft.x && pointer.x <= t.symRight.x && Math.abs(pointer.y - t.centre.y) <= t.h / 2;
      }
      const c = carriedCentre(rc, ctx, pointer);
      return Math.abs(c.x - t.centre.x) <= reachX && Math.abs(c.y - t.centre.y) <= reachY;
    },
  };
}

/**
 * Where to carry the piece so that, in the merged (and recentred) result,
 * what you're holding is right under your hand: the part of it that lives on
 * (the 2 of ln(2) dropped on ln(x)) at its place in the result. If none of it
 * lives on (2x onto 3x → 5x), the merged term itself. If that's about where
 * the piece already is (a in a(b + c) → ab + ac), the target: holding still
 * mustn't look like the move is done.
 */
export function mergeAim(rc: RenderCtx, ctx: DragInitContext<MathState>, draggedId: string, result: MathState, targetId: string): Vec2 {
  const target = canvasBox(rc, ctx, targetId);
  const home = canvasBox(rc, ctx, draggedId).centre;
  // A minus carried on its own (its own handle, not a node): aim at the target.
  const loc = locate(rc.state, draggedId);
  if (!loc) return target.centre;
  const inResult = new Set(result.sides.flatMap(allNodes).map((n) => n.id));
  const survivor = allNodes(nodeAt(rc.state, loc)).find((n) => inResult.has(n.id))?.id ?? targetId;
  const before = originOf(ctx, survivor, rc.state);
  const after = originOf(ctx, survivor, result);
  if (!before || !after) return target.centre;
  const aim = (survivor === targetId ? target.centre : home).add(after.sub(before));
  return aim.dist(home) < target.h ? target.centre : aim;
}

/** A branch that shows whatever its owner decided this frame. */
class Shown extends Operator<MathState> {
  readonly name = "shown";
  constructor(
    ctx: DragInitContext<MathState>,
    readonly get: () => OpResult<MathState>,
  ) {
    super(ctx);
  }
  frame() {
    return this.get();
  }
  treeView() {
    return null;
  }
  overlayVis() {
    return null;
  }
}
const shown = operator(Shown);

type Merge = { state: MathState; targetId: string; preview: LayeredSvgx; zone: ReturnType<typeof onTarget>; aim: Vec2 };

/**
 * Carrying a piece towards pieces it can merge with. How far along it is —
 * from where it started (0) to where it ends up in the result (1, see
 * mergeAim) — sets how far the picture is blended from "carrying" to the
 * merged result, using Dragology's own blending (`between`, steered with an
 * invisible probe). Nothing snaps while holding; letting go merges once the
 * picture is mostly the result (or right on a target), else it's whatever
 * carrying would do.
 */
class MergeApproach extends Operator<MathState> {
  readonly name = "mergeApproach";
  private readonly carry;
  private readonly blend;
  private readonly home: Vec2;
  readonly merges: Merge[];
  private a: OpResult<MathState> | null = null;
  private b: OpResult<MathState> | null = null;
  /** Last frame, for the debug views. */
  last: { best: Merge; t: number; mix: number; merging: boolean; carried: Vec2 } | null = null;

  constructor(ctx: DragInitContext<MathState>, carrySpec: DragSpec<MathState>, readonly env: DragEnv, merges: Candidate[]) {
    super(ctx);
    const { rc } = env;
    const id = ctx.draggedId!;
    this.carry = this.child("carry", carrySpec);
    this.home = canvasBox(rc, ctx, id).centre;
    this.merges = merges.map((c) => ({
      state: c.state,
      targetId: c.targetId!,
      preview: withProbe(renderStateReadOnly(ctx, c.state), PROBE_SPAN),
      zone: onTarget(rc, ctx, id, c.targetId!),
      aim: mergeAim(rc, ctx, id, c.state, c.targetId!),
    }));
    const probeCtx = { ...ctx, draggedId: PROBE, draggedPath: `${PROBE}/`, anchorPos: Vec2(0, 0) };
    this.blend = this.child("blend", env.d.between([shown(() => this.a!), shown(() => this.b!)]), probeCtx);
  }

  /** 0 → 1 as the carried piece goes from where it started to where it ends up in the result. */
  private progress(m: Merge, pointer: Vec2): number {
    // A target inside the piece is under it all along: there, all or nothing.
    if (m.zone.nested) return m.zone.hit(pointer) ? 1 : 0;
    return approach(carriedCentre(this.env.rc, this.ctx, pointer), this.home, m.aim, SETTLED_PX);
  }

  frame(frame: DragFrame): OpResult<MathState> {
    const carried = this.carry.run(frame);
    let best = this.merges[0];
    let t = -1;
    for (const m of this.merges) {
      const p = this.progress(m, frame.pointer);
      if (p > t) [best, t] = [m, p];
    }
    const mix = ease(t);
    // What you see is what you get.
    const hit = this.merges.find((m) => m.zone.hit(frame.pointer)) ?? (mix >= MERGE_AT ? best : undefined);
    const dropState = hit ? hit.state : carried.dropState;
    this.last = { best, t, mix, merging: !!hit, carried: carriedCentre(this.env.rc, this.ctx, frame.pointer) };
    if (mix <= 0) return { ...carried, dropState };
    this.a = { ...carried, preview: () => withProbe(carried.preview(), 0) };
    this.b = { preview: () => best.preview, dropState: best.state, gap: 0 };
    const mixed = this.blend.run({ pointer: Vec2(mix * PROBE_SPAN, 0) });
    return { ...carried, preview: mixed.preview, dropState, activePath: undefined };
  }

  treeView(props: OpTreeViewProps) {
    const l = this.last;
    const label = l ? `mergeApproach → ${l.best.targetId}: ${Math.round(l.mix * 100)}%${l.merging ? " (drop merges)" : ""}` : "mergeApproach";
    return (
      <Box label={label} path={props.path} active={props.active} color={props.color}>
        {this.carry.treeView(props)}
      </Box>
    );
  }

  /** Each target's aim (a ring; filled for the leading one), and how far the carried piece still has to go. */
  overlayVis({ active }: OpOverlayVisProps) {
    const l = this.last;
    return (
      <g opacity={active ? 1 : 0.4}>
        {this.merges.map((m) => (
          <circle key={m.targetId} cx={m.aim.x} cy={m.aim.y} r={6} fill={l?.best === m ? "magenta" : "none"} stroke="magenta" />
        ))}
        {l && <DistanceLine from={l.carried} to={l.best.aim} distance={l.carried.dist(l.best.aim)} />}
      </g>
    );
  }
}

/** A spec carrying the piece (`carrySpec`) that blends towards each merge as the piece approaches it. */
export const mergeApproach = operator(MergeApproach);
