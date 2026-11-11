/**
 * flip-sign: a term carried across = changes sign on the way, and you see it
 * happen on the piece itself. Carrying −5 from x − 5 = 2, its − fades into a
 * + as it crosses the = (x = 2 + 5); carrying 5 from x + 5 = 2 (its + stays in
 * the row), a − fades in on it (x = 2 − 5). The change happens while the
 * cursor crosses the = sign itself, from its near edge to its far edge. The sign waiting at the
 * destination stays hidden while dragging — the carried one is it; on
 * release the two crossfade in the same spot.
 */
import {
  modifier,
  Modifier,
  renderStateReadOnly,
  type DragFrame,
  type DragInitContext,
  type DragSpecData,
  type LayeredSvgx,
  type OpTreeViewProps,
} from "dragology";
import type { MathState } from "../../expr/types";
import { allNodes, children } from "../../expr/tree";
import { signId } from "../../rules";
import { dragCtx } from "../../rules/types";
import { clamp01 } from "../geometry";
import { textWidth } from "../measure";
import { fadeGlyphs, fadeGlyphsEverywhere, fadeLayer, layerChildren, redrawLayer, transplant } from "../preview";
import { glyph, LEAD, type RenderCtx } from "../typeset";

class FlipSign extends Modifier<MathState> {
  readonly name = "flipSign";
  private readonly start: LayeredSvgx;
  private readonly negative: boolean;
  /** The = sign's glyph, from the side the piece starts on to the other. */
  private readonly from: number;
  private readonly to: number;
  private readonly newSign: ReturnType<typeof glyph>;
  /** The sign waiting at the destination in the result: a "+" glyph in the row, or a new − (its layer and its own handle). */
  private readonly waiting: { glyphs?: Set<string>; layers: string[] };
  t = 0;

  constructor(
    ctx: DragInitContext<MathState>,
    inner: DragSpecData<MathState>,
    readonly rc: RenderCtx,
    readonly result: MathState,
  ) {
    super(ctx, inner);
    const id = ctx.draggedId!;
    // The piece exactly as it looks now, in every preview.
    this.start = renderStateReadOnly(ctx, rc.state);
    const c = dragCtx(rc.state, id)!;
    this.negative = c.node.kind === "neg";
    const eq = rc.eq!;
    [this.from, this.to] = c.loc.side === 0 ? [eq.left, eq.right] : [eq.right, eq.left];
    const size = rc.fontSizes!.get(id)!;
    const me = rc.sizes!.get(id)!;
    // The new sign sits where the row will draw it: right before the term's body.
    const L = this.negative ? LEAD.plus : LEAD.minus;
    const ch = L.glyph;
    this.newSign = glyph(this.negative ? "carry-plus" : "carry-minus", ch, me.lead - L.right * size - textWidth(ch, size), 0, size, "m-op");
    if (this.negative) {
      this.waiting = { glyphs: new Set([`plus-${id}`]), layers: [] };
    } else {
      const wrapper = result.sides.flatMap(allNodes).find((n) => n.kind === "neg" && children(n)[0]?.id === id);
      this.waiting = { layers: wrapper ? [wrapper.id, signId(wrapper.id)] : [] };
    }
  }

  frame(frame: DragFrame) {
    const r = this.inner.run(frame);
    // The sign changes while the cursor crosses the = itself: old sign before it, new sign past it.
    const t = (this.t = clamp01((frame.pointer.x - this.from) / (this.to - this.from)));
    const onMove = r.dropState === this.result;
    return { ...r, preview: () => this.dress(r.preview(), t, onMove) };
  }

  private dress(layers: LayeredSvgx, t: number, onMove: boolean): LayeredSvgx {
    const id = this.ctx.draggedId!;
    let out = transplant(layers, this.start, id);
    out = redrawLayer(out, id, layerChildren(this.start, id), <g dragologyKey="carry-sign" opacity={t}>{this.newSign}</g>);
    if (this.negative) {
      // The − it had fades out (its own handle, or drawn in the term's layer).
      out = fadeLayer(out, signId(id), 1 - t);
      out = fadeGlyphs(out, id, new Set(["lead-minus", "lead-uminus"]), 1 - t);
    }
    if (onMove) {
      if (this.waiting.glyphs) out = fadeGlyphsEverywhere(out, this.waiting.glyphs, 0);
      for (const layer of this.waiting.layers) out = fadeLayer(out, layer, 0);
    }
    return out;
  }

  treeView(props: OpTreeViewProps) {
    return this.wrapperView(props, `${this.negative ? "− → +" : "→ −"} at ${Math.round(this.t * 100)}%`);
  }
}

export const flipSign = modifier(FlipSign);
