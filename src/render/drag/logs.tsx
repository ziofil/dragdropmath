/**
 * What a carried piece wears on the way, for logs:
 *
 * - grow-log: pulling the 2 out of ln(2x), it picks up a faint ln( ) that
 *   firms up as it comes out (a piece can't leave a log without a copy of it).
 * - shed-log: carrying ln(x) onto ln(2), its ln( ) fades as it nears the log
 *   it joins, until only the x — what actually goes in — is left.
 */
import {
  modifier,
  Modifier,
  renderStateReadOnly,
  translate,
  Vec2,
  type DragFrame,
  type DragInitContext,
  type DragSpecData,
  type LayeredSvgx,
  type OpTreeViewProps,
  type Svgx,
} from "dragology";
import type { Log, MathState } from "../../expr/types";
import { print } from "../../expr/key";
import { allNodes } from "../../expr/tree";
import { signId, type Candidate } from "../../rules";
import { dragCtx } from "../../rules/types";
import { along, approach, canvasBox, carriedCentre } from "../geometry";
import { textWidth } from "../measure";
import { fadeGlyphs, fadeLayer, layerChildren, redrawLayer } from "../preview";
import { ASC, DESC, glyph, named, type RenderCtx, type Size } from "../typeset";
import { pullOutAim } from "./carry";
import { mergeAim } from "./merge";

/** How visible a carried log is at its faintest (just picked up, or about to merge). */
const FAINT = 0.2;

/**
 * ln(2x): from the moment the 2 is picked up it wears a faint ln( ), firming
 * up the further it is pulled out (fully there where the split lands). In
 * the split's preview the new ln at the destination is hidden: the one being
 * carried is it.
 */
class GrowLog extends Modifier<MathState> {
  readonly name = "growLog";
  private readonly home: Vec2;
  private readonly aim: Vec2;
  private readonly bare: unknown[];
  private readonly hidden: string[];
  private readonly shell: Svgx[];
  opacity = FAINT;

  constructor(
    ctx: DragInitContext<MathState>,
    inner: DragSpecData<MathState>,
    readonly rc: RenderCtx,
    readonly result: MathState,
  ) {
    super(ctx, inner);
    const id = ctx.draggedId!;
    this.home = canvasBox(rc, ctx, id).centre;
    this.aim = pullOutAim(rc, ctx, id);
    // The piece as it looks now (no brackets of its own yet), in every preview.
    this.bare = layerChildren(renderStateReadOnly(ctx, rc.state), id);
    // The new log around the piece in the result: its label is what we carry.
    const newLog = result.sides.flatMap(allNodes).find((n): n is Log => n.kind === "log" && n.arg.id === id);
    this.hidden = newLog ? [newLog.id, ...allNodes(newLog.base).map((n) => n.id)] : [];
    const log = dragCtx(rc.state, dragCtx(rc.state, id)!.parent!.id)!.parent as Log;
    this.shell = logShell(log, rc.fontSizes!.get(id)!, rc.sizes!.get(id)!);
  }

  frame(frame: DragFrame) {
    const r = this.inner.run(frame);
    this.opacity = FAINT + (1 - FAINT) * along(carriedCentre(this.rc, this.ctx, frame.pointer), this.home, this.aim);
    const onSplit = r.dropState === this.result;
    const opacity = this.opacity;
    return { ...r, preview: () => this.dress(r.preview(), opacity, onSplit) };
  }

  private dress(layers: LayeredSvgx, opacity: number, onSplit: boolean): LayeredSvgx {
    const shell = (
      <g key={named("carry-shell")} dragologyKey="carry-shell" opacity={opacity} style={{ pointerEvents: "none" }}>
        {this.shell}
      </g>
    );
    let out = redrawLayer(layers, this.ctx.draggedId!, this.bare, shell);
    if (onSplit) for (const id of this.hidden) out = fadeLayer(out, id, 0);
    return out;
  }

  treeView(props: OpTreeViewProps) {
    return this.wrapperView(props, `ln( ) at ${Math.round(this.opacity * 100)}%`);
  }
}

/**
 * ln(2) + ln(x): carrying ln(x) onto ln(2), its ln( ) (and a minus in front,
 * which becomes the fraction bar or joins the other's) fades as it nears
 * where the merge completes.
 */
class ShedLog extends Modifier<MathState> {
  readonly name = "shedLog";
  private readonly home: Vec2;
  private readonly aims: Vec2[];
  /** Layers that fade whole (the ln label, a minus' own handle), and layers where only some glyphs fade. */
  private readonly whole: string[];
  private readonly glyphs: [string, Set<string>][];
  opacity = 1;

  constructor(
    ctx: DragInitContext<MathState>,
    inner: DragSpecData<MathState>,
    readonly rc: RenderCtx,
    joins: Candidate[],
  ) {
    super(ctx, inner);
    const id = ctx.draggedId!;
    this.home = canvasBox(rc, ctx, id).centre;
    this.aims = joins.map((c) => mergeAim(rc, ctx, id, c.state, c.targetId!));
    const T = dragCtx(rc.state, id)!.node;
    const L = (T.kind === "neg" ? T.arg : T) as Log;
    this.whole = [...allNodes(L.base).map((n) => n.id), ...(T.kind === "neg" ? [signId(T.id)] : [])];
    this.glyphs = [
      [L.id, new Set(["log"])],
      [L.arg.id, new Set(["lp", "rp"])],
      // Without its own handle, a minus is drawn in the term's layer.
      ...(T.kind === "neg" ? [[T.id, new Set(["t-sign", "lead-uminus", "lead-minus"])] as [string, Set<string>]] : []),
    ];
  }

  frame(frame: DragFrame) {
    const r = this.inner.run(frame);
    const c = carriedCentre(this.rc, this.ctx, frame.pointer);
    const near = Math.max(0, ...this.aims.map((a) => approach(c, this.home, a)));
    const opacity = (this.opacity = 1 - (1 - FAINT) * near);
    return { ...r, preview: () => this.dress(r.preview(), opacity) };
  }

  private dress(layers: LayeredSvgx, opacity: number): LayeredSvgx {
    let out = layers;
    for (const id of this.whole) out = fadeLayer(out, id, opacity);
    for (const [id, keys] of this.glyphs) out = fadeGlyphs(out, id, keys, opacity);
    return out;
  }

  treeView(props: OpTreeViewProps) {
    return this.wrapperView(props, `ln( ) at ${Math.round(this.opacity * 100)}%`);
  }
}

export const growLog = modifier(GrowLog);
export const shedLog = modifier(ShedLog);

/** "ln(" and ")" (or "log₂(" and ")") around a piece of the given size, in its own coordinates. */
function logShell(L: Log, size: number, me: Size): Svgx[] {
  const pw = textWidth("(", size) + 0.02 * size;
  const gap = 0.04 * size;
  const sy = Math.max(1, (me.asc + me.desc) / ((ASC + DESC) * size));
  const shiftY = (me.desc - me.asc) / 2 + ((ASC - DESC) / 2) * size * sy;
  const paren = (pkey: string, ch: string, x: number) => (
    <text key={named(pkey)} dragologyKey={pkey} transform={`${translate(x, shiftY)} scale(1, ${sy})`} fontSize={size} className="m-op">
      {ch}
    </text>
  );
  const left = me.lead - pw;
  const parts = [paren("carry-lp", "(", left), paren("carry-rp", ")", me.w)];
  if (L.base.kind === "const") {
    const w = textWidth("ln", size) + 0.06 * size;
    return [glyph("carry-ln", "ln", left - gap - w, 0, size, "m-fn"), ...parts];
  }
  const small = size * 0.68;
  const baseText = print(L.base);
  const baseW = textWidth(baseText, small);
  const word = textWidth("log", size) + 0.02 * size;
  const x0 = left - gap - baseW - word;
  return [
    glyph("carry-log", "log", x0, 0, size, "m-fn"),
    glyph("carry-base", baseText, x0 + word, 0.28 * size, small, "m-num"),
    ...parts,
  ];
}
