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
import { rowSlot } from "./carry";

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
const ease = (t: number) => t * t * t;

/** An absorbed piece starts turning into the result only this far along its approach. */
const ABSORB_FROM = 0.4;

/** Carrying past where a merge completes undoes it within this many target heights. */
const OVERSHOOT = 2;

/**
 * A merge starts forming within this many target heights of where it
 * completes, however far the piece has come: on a long trip the row slots
 * next to the target stay plain reorders (in 4x − y + 2y − 3x, the −3x can
 * still be put down right after the 4x without merging with it).
 */
const REACH = 2;

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
  // Only after a real move: a press that hasn't gone anywhere isn't a drop on something.
  const moved = (pointer: Vec2) => (home ? pointer.dist(home) > 0.3 * t.h : true);
  return {
    nested,
    centre: t.centre,
    left: t.symLeft.x,
    right: t.symRight.x,
    h: t.h,
    hit(pointer: Vec2): boolean {
      if (nested) {
        return moved(pointer) && pointer.x >= t.symLeft.x && pointer.x <= t.symRight.x && Math.abs(pointer.y - t.centre.y) <= t.h / 2;
      }
      const c = carriedCentre(rc, ctx, pointer);
      if (Math.abs(c.x - t.centre.x) <= reachX && Math.abs(c.y - t.centre.y) <= reachY) return true;
      // Or the hand itself is on the target's symbol, wherever the piece was
      // grabbed (a tall √ held by its corner, put down with the cursor on the 4).
      return moved(pointer) && pointer.x >= t.symLeft.x && pointer.x <= t.symRight.x && Math.abs(pointer.y - t.centre.y) <= t.h / 2;
    },
  };
}

/**
 * Where a merge completes, and how it's shown on the way:
 *
 * - If part of the carried piece lives on (the 2 of ln(2) dropped on ln(x)),
 *   carry that part to its place in the merged (recentred) result: holding it
 *   there shows the final expression, with what you hold under your hand.
 * - If the carried piece is absorbed (2 onto 5 → 7, 3x onto 2x → 5x), aim at
 *   the target, which stays put (`pinned`) and turns into the result where it
 *   is; letting go then moves it where it belongs (in x = 2 + 5, dragging the
 *   2 onto the 5, the 7 ends up where the 2 was).
 */
export function mergePlan(
  rc: RenderCtx,
  ctx: DragInitContext<MathState>,
  draggedId: string,
  result: MathState,
  targetId: string,
  /** A piece the move keeps where it is while held (see Candidate.stays). */
  stays?: string,
): { aim: Vec2; pinned: boolean; shown: MathState } {
  const target = canvasBox(rc, ctx, targetId);
  const home = canvasBox(rc, ctx, draggedId).centre;
  const pinAt = (id: string): MathState => ({ ...result, pin: { id, x: canvasBox(rc, ctx, id).symLeft.x } });
  // A minus carried on its own (its own handle, not a node): aim at the target.
  const loc = locate(rc.state, draggedId);
  if (!loc) return { aim: target.centre, pinned: false, shown: result };
  const inResult = new Set(result.sides.flatMap(allNodes).map((n) => n.id));
  const survivor = allNodes(nodeAt(rc.state, loc)).find((n) => inResult.has(n.id))?.id;
  // Absorbed: the target stays put (or, if it's replaced, the part of it that stays: the 2 of √2·√2 → 2).
  if (!survivor) return { aim: target.centre, pinned: true, shown: inResult.has(targetId) || !stays || !inResult.has(stays) ? pinAt(targetId) : pinAt(stays) };
  const shown = stays && inResult.has(stays) ? pinAt(stays) : result;
  const before = originOf(ctx, survivor, rc.state);
  const after = originOf(ctx, survivor, shown);
  if (!before || !after) return { aim: target.centre, pinned: false, shown };
  const aim = home.add(after.sub(before));
  if (aim.dist(home) >= target.h) return { aim, pinned: false, shown };
  // About where the piece already is (the 2 of 2(x + 3) → 2x + 2·3) — holding
  // still mustn't look like the move is done. With a piece that stays put (the
  // x), it completes once the piece reaches that piece's near edge; otherwise
  // at the target.
  if (stays && inResult.has(stays)) {
    const s = canvasBox(rc, ctx, stays);
    const edge = home.x < s.centre.x ? s.symLeft.x : s.symRight.x;
    return { aim: Vec2(edge, s.centre.y), pinned: false, shown };
  }
  return { aim: target.centre, pinned: false, shown };
}

/** Where a merge completes (see mergePlan). */
export const mergeAim = (...args: Parameters<typeof mergePlan>) => mergePlan(...args).aim;

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

type Merge = { state: MathState; targetId: string; preview: LayeredSvgx; zone: ReturnType<typeof onTarget>; aim: Vec2; absorbed: boolean };

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
  /** Carrying without reordering: what's under a forming merge instead of a row reorder. */
  private readonly still;
  private readonly blend;
  private readonly home: Vec2;
  readonly merges: Merge[];
  private a: OpResult<MathState> | null = null;
  private b: OpResult<MathState> | null = null;
  /** Last frame, for the debug views. */
  last: { best: Merge; t: number; mix: number; merging: boolean; carried: Vec2 } | null = null;

  constructor(
    ctx: DragInitContext<MathState>,
    carrySpec: DragSpec<MathState>,
    readonly env: DragEnv,
    merges: Candidate[],
    /** The row reorders carrying can show (they give way to a forming merge). */
    private readonly reorders: readonly MathState[] = [],
  ) {
    super(ctx);
    const { rc } = env;
    const id = ctx.draggedId!;
    this.carry = this.child("carry", carrySpec);
    this.still = this.child("still", rowSlot(env, id, [], 0, new Map()).withFloating());
    this.home = canvasBox(rc, ctx, id).centre;
    this.merges = merges.map((c) => {
      // What stays put (a pinned target, a term being multiplied) stays where it is in the picture until the drop.
      const plan = mergePlan(rc, ctx, id, c.state, c.targetId!, c.stays);
      return {
        state: c.state,
        targetId: c.targetId!,
        preview: withProbe(renderStateReadOnly(ctx, plan.shown), PROBE_SPAN),
        zone: onTarget(rc, ctx, id, c.targetId!),
        aim: plan.aim,
        absorbed: plan.pinned,
      };
    });
    const probeCtx = { ...ctx, draggedId: PROBE, draggedPath: `${PROBE}/`, anchorPos: Vec2(0, 0) };
    this.blend = this.child("blend", env.d.between([shown(() => this.a!), shown(() => this.b!)]), probeCtx);
  }

  /** 0 → 1 as the carried piece goes from where it started to where it ends up in the result. */
  private progress(m: Merge, pointer: Vec2): number {
    // A target inside the piece is under it all along: there, all or nothing.
    if (m.zone.nested) return m.zone.hit(pointer) ? 1 : 0;
    const c = carriedCentre(this.env.rc, this.ctx, pointer);
    // Carried on past where it ends up: the merge fades within a couple of symbol heights.
    if (this.past(m, c)) return Math.max(0, 1 - Math.max(0, c.dist(m.aim) - SETTLED_PX) / (OVERSHOOT * m.zone.h));
    const away = this.home.sub(m.aim);
    const reach = REACH * m.zone.h;
    const from = away.len() > reach ? m.aim.add(away.mul(reach / away.len())) : this.home;
    return approach(c, from, m.aim, SETTLED_PX);
  }

  /** Whether reorder `r` puts the carried piece on the other side of `targetId` in their row. */
  private swapsWith(r: MathState, targetId: string): boolean {
    const side = (s: MathState) => {
      const a = locate(s, this.ctx.draggedId!);
      const b = locate(s, targetId);
      if (!a || !b) return 0;
      // Two whole sides of one equation: which is left of the other (a side swap reorders them).
      if (a.path.length === 0 && b.path.length === 0 && a.side >> 1 === b.side >> 1) return Math.sign(a.side - b.side);
      if (a.side !== b.side || a.path.length !== b.path.length) return 0;
      if (a.path.slice(0, -1).join() !== b.path.slice(0, -1).join()) return 0;
      return Math.sign(a.path[a.path.length - 1] - b.path[b.path.length - 1]);
    };
    const before = side(this.env.rc.state);
    return before !== 0 && side(r) === -before;
  }

  /** Whether the carried centre `c` has gone all the way over merge `m`'s target, out the far side. */
  private beyond(m: Merge, c: Vec2): boolean {
    const dir = Math.sign(m.zone.centre.x - this.home.x);
    return dir !== 0 && (c.x - (dir > 0 ? m.zone.right : m.zone.left)) * dir > 0;
  }

  /** Whether the carried centre `c` has gone beyond where merge `m` completes. */
  private past(m: Merge, c: Vec2): boolean {
    const d = m.aim.sub(this.home);
    return c.sub(this.home).dot(d) > d.dot(d);
  }

  frame(frame: DragFrame): OpResult<MathState> {
    let carried = this.carry.run(frame);
    let best = this.merges[0];
    let t = -1;
    for (const m of this.merges) {
      const p = this.progress(m, frame.pointer);
      if (p > t) [best, t] = [m, p];
    }
    // A carried piece that's absorbed (2 onto 5 → 7, √2 onto √2 → 2) stays
    // itself most of the way, and only changes as it arrives on the target.
    const mix = ease(best.absorbed ? Math.max(0, (t - ABSORB_FROM) / (1 - ABSORB_FROM)) : t);
    // What you see is what you get.
    // Two moves can share a target ((x + 1) onto (x + 1): multiply out, or
    // square): when the leading one's is hit, that's the one.
    const hit = (best.zone.hit(frame.pointer) ? best : this.merges.find((m) => m.zone.hit(frame.pointer))) ?? (mix >= MERGE_AT ? best : undefined);
    // A forming merge wins over reordering past the neighbour (it mustn't
    // jump aside while it turns into the result) until the piece is carried
    // on beyond where the merge completes.
    // (Whether or not it has started forming yet. Beyond = over the target's
    // far edge and past where the merge completes, which may be further.)
    const c = carriedCentre(this.env.rc, this.ctx, frame.pointer);
    const r = carried.dropState;
    const blocked = this.reorders.includes(r) && this.merges.some((m) => (hit ? m === hit : !(this.beyond(m, c) && this.past(m, c))) && this.swapsWith(r, m.targetId));
    if (blocked) carried = this.still.run(frame);
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
