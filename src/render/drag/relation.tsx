/**
 * turn-relation: a move that multiplies both sides by a negative number
 * (carrying the − of −x < 6 across) turns the inequality sign round, and you
 * see it turn: a half turn about its upright axis, < becoming >, while the
 * cursor crosses the sign itself. Letting go finishes the turn.
 */
import { modifier, Modifier, type DragFrame, type DragInitContext, type DragSpecData, type OpTreeViewProps } from "dragology";
import type { MathState } from "../../expr/types";
import { locate } from "../../expr/tree";
import { isLeft } from "../../expr/rows";
import { signOwner } from "../../rules";
import { clamp01 } from "../geometry";
import { editLayer, pathed } from "../preview";
import { REL, relation, type RenderCtx } from "../typeset";

class TurnRelation extends Modifier<MathState> {
  readonly name = "turnRelation";
  /** The relation sign's extent, from the side the piece starts on to the other. */
  private readonly from: number;
  private readonly to: number;
  t = 0;

  constructor(
    ctx: DragInitContext<MathState>,
    inner: DragSpecData<MathState>,
    readonly rc: RenderCtx,
  ) {
    super(ctx, inner);
    const id = ctx.draggedId!;
    const side = locate(rc.state, signOwner(id) ?? id)?.side ?? 0;
    const eq = rc.eq!;
    [this.from, this.to] = isLeft(side) ? [eq.left, eq.right] : [eq.right, eq.left];
  }

  frame(frame: DragFrame) {
    const r = this.inner.run(frame);
    const t = (this.t = clamp01((frame.pointer.x - this.from) / (this.to - this.from)));
    const eq = this.rc.eq!;
    const sign = pathed(relation(this.rc.state, eq.centre, eq.baseline, eq.size, t), "");
    return { ...r, preview: () => editLayer(r.preview(), REL, () => sign) };
  }

  treeView(props: OpTreeViewProps) {
    return this.wrapperView(props, `relation turned ${Math.round(this.t * 100)}%`);
  }
}

export const turnRelation = modifier(TurnRelation);
