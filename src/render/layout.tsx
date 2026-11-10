import { cloneElement, type ReactElement } from "react";
import {
  getElementPositionCheap,
  modifier,
  Modifier,
  type DragFrame,
  type DragSpecData,
  type LayeredSvgx,
  renderStateReadOnly,
  translate,
  Vec2,
  type DragInitContext,
  type DragSpec,
  type DragSpecBuilder,
  type Svgx,
} from "dragology";
import type { Expr, Frac, Log, MathState } from "../expr/types";
import { print, rootIndex } from "../expr/key";
import { candidatesFor, isGrabbable, signId, tapFor, type RuleId } from "../rules";
import { allNodes, children, locate, nodeAt } from "../expr/tree";
import { dragCtx } from "../rules/types";
import { textWidth } from "./measure";

/**
 * Math typesetting in plain SVG (Dragology needs real SVG elements it can
 * measure and interpolate, so no KaTeX/MathJax).
 *
 * Every expression node becomes `<g id={node.id}>` positioned with a
 * transform, nested like the tree, carrying its own drag spec.
 *
 * Decorations inside a node (its glyph, sign, brackets, fraction bar) must
 * NOT get ids: Dragology lifts every id'd element into its own layer, and a
 * layer without `dragologyOnDrag` swallows clicks — the symbol would sit on
 * top of its own grab area. They use `dragologyKey` instead, which keeps
 * them in the node's group but still lets them fade in/out between states.
 *
 * A term's leading sign is drawn *inside the term's group*, so the sign
 * travels with its term — and grabbing the sign grabs the whole term.
 */

export type RenderCtx = {
  state: MathState;
  /** null → static, non-interactive rendering */
  d: DragSpecBuilder<MathState> | null;
  rules: readonly RuleId[];
  draggedId: string | null;
  /** Filled in by layout: each node's box, relative to its own origin (baseline-left). */
  sizes?: Map<string, Size>;
  /** Filled in by layout: each node's font size. */
  fontSizes?: Map<string, number>;
  /** Filled in by layout: the canvas size it was laid out for. */
  canvas?: { W: number; H: number };
  /** Apply a tap move (e.g. tap the 8 in log₂8 to make it 2³). */
  onTap?: (next: MathState) => void;
};

/** `lead` = width of the leading sign (+, −, ·) at the start of the box; the symbol itself follows it. */
type Size = { w: number; asc: number; desc: number; lead: number };

type Box = { w: number; asc: number; desc: number; draw: (x: number, y: number) => Svgx };
type Content = { w: number; asc: number; desc: number; parts: (x0: number) => Svgx[] };

type Lead = "plus" | "minus" | "uminus" | "dot";
const LEAD: Record<Lead, { glyph: string; left: number; right: number }> = {
  plus: { glyph: "+", left: 0.24, right: 0.24 },
  minus: { glyph: "−", left: 0.24, right: 0.24 },
  uminus: { glyph: "−", left: 0, right: 0.04 },
  dot: { glyph: "⋅", left: 0.1, right: 0.1 },
};

const ASC = 0.72;
const DESC = 0.24;

function glyph(gkey: string, text: string, x: number, y: number, size: number, cls: string) {
  return (
    <text dragologyKey={gkey} transform={translate(x, y)} fontSize={size} className={cls}>
      {text}
    </text>
  );
}

/**
 * What dropping the dragged node does, by where the carried piece is:
 *
 *   on a mergeable piece (its middle)      → merge
 *   between two pieces (their boundary)    → reorder into that gap
 *   near where it started                  → nothing
 *   elsewhere (across =, out in front...)  → the nearest other move's landing spot
 *
 * Reorders are aimed at *gaps*, not at the slot a neighbour occupies, because
 * that slot is exactly where a merge with the neighbour happens too. (Using
 * Dragology's landing spots for reorders made swaps steal merges, and the
 * swap preview slid the target out from under the piece.)
 */
export function dragSpec(rc: RenderCtx, id: string): DragSpec<MathState> {
  const d = rc.d!;
  const candidates = candidatesFor(rc.state, id, rc.rules);
  const c0 = dragCtx(rc.state, id);
  // Only sums and products are rows you can reorder along; elsewhere (fraction
  // parts, exponents, ...) the only "within" option is staying put.
  const inRow = c0?.parent?.kind === "sum" || c0?.parent?.kind === "prod";
  const siblings = inRow ? children(c0!.parent!) : [];

  // Reordering within the row (or staying put) is one option; moves that leave
  // the row (across =, out in front of brackets...) compete by landing spot.
  const reorders = new Map<number, MathState>();
  for (const c of candidates) {
    if (c.rule !== "commute") continue;
    const loc = locate(c.state, id)!;
    reorders.set(loc.path[loc.path.length - 1], c.state);
  }
  const moves = d.closest([
    rowSlot(rc, id, siblings.map((s) => s.id), c0?.index ?? 0, reorders),
    ...candidates
      .filter((c) => !c.targetId && c.rule !== "commute")
      .map((c) =>
        c.rule === "factor-out"
          ? outInFront(rc, id, c.state)
          : c.rule === "log-of-product" || c.rule === "split-fraction" || c.rule === "pull-out-of-power"
            ? pullOut(rc, id, c.state)
            : landing(rc, id, c.state),
      ),
  ]);

  // Pulling a factor out of a log: the piece carries a faint copy of the log
  // from the start, firming up as it comes out.
  const split = candidates.find((c) => c.rule === "log-of-product");
  // Combining logs: the reverse — the carried log's ln( ) fades as it nears
  // the log it joins, until only what goes inside is left.
  const joins = candidates.filter((c) => c.rule === "combine-logs").map((c) => c.targetId!);
  const carried = split
    ? moves.with(carryLogShell(rc, id, split.state))
    : joins.length
      ? moves.with(fadeCarriedLog(rc, id, joins))
      : moves;

  const merges = candidates.filter((c) => c.targetId);
  if (merges.length === 0) return carried.withFloating();
  // On a target the carried piece is absorbed: no floating copy, just the
  // result shown where it will stay. Off targets it floats under the pointer.
  // Switching between the two animates (the carried piece flies in; copies
  // made by distributing fly out of it). Merge zones have gap 0 inside and ∞
  // outside, so `whenFar` with gap 1 = "not on any target".
  return d
    .closest(merges.map((c) => onTarget(rc, id, c.targetId!, c.state)))
    .whenFar(carried.withFloating(), { gap: 1 })
    .withBranchTransition(BRANCH_MS);
}

/** How long the switch between carrying a piece and merging it takes to animate. */
const BRANCH_MS = 180;

/**
 * "On" a target = the carried symbol's centre is over the target symbol
 * (within half its width), or at least this fraction of the wider of the two.
 */
const ON_TARGET = 0.3;

/**
 * Geometry of a node on the canvas, measured on the *symbol* (the box minus
 * its leading sign), since that is what people aim with and at. Aiming at
 * whole boxes put the "after this term" gap closer than the term itself,
 * because a term's sign sits on the left of its box.
 */
type CanvasBox = { symLeft: Vec2; symRight: Vec2; centre: Vec2; w: number; h: number };

/** Where node `id` is on the canvas when it shows `rc.state`. */
function canvasBox(rc: RenderCtx, ctx: DragInitContext<MathState>, id: string): CanvasBox {
  const size = rc.sizes?.get(id);
  const origin = getElementPositionCheap({ ...ctx, draggedId: id, draggedPath: id, anchorPos: Vec2(0, 0) }, rc.state);
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
function carriedCentre(rc: RenderCtx, ctx: DragInitContext<MathState>, pointer: Vec2): Vec2 {
  const me = rc.sizes!.get(ctx.draggedId!)!;
  return pointer.sub(ctx.anchorPos).add(Vec2(me.lead + (me.w - me.lead) / 2, (me.desc - me.asc) / 2));
}

/**
 * Reordering by *order*, not distance: the carried piece goes into the slot
 * given by how many of its neighbours' centres lie before its own centre. So
 * a slot beyond a neighbour is only reached after passing that neighbour's
 * middle — where a merge with it, if possible, has already taken over.
 * (Aiming at the nearest gap let "in front of 5y" win just before 5y's merge
 * zone, sending 5y behind the piece.) The gap is 0 over the row and grows
 * with the distance off it, so moves that leave the row can win out there.
 */
function rowSlot(
  rc: RenderCtx,
  draggedId: string,
  rowIds: string[],
  myIndex: number,
  reorders: Map<number, MathState>,
): DragSpec<MathState> {
  return rc.d!.custom((ctx: DragInitContext<MathState>) => {
    const boxes = (rowIds.length ? rowIds : [draggedId]).map((id) => canvasBox(rc, ctx, id));
    const others = boxes.filter((_, k) => rowIds.length && k !== myIndex).map((b) => b.centre.x);
    const h = Math.max(...boxes.map((b) => b.h));
    const left = boxes[0].symLeft.x - 0.5 * h;
    const right = boxes[boxes.length - 1].symRight.x + 0.5 * h;
    const midY = boxes[0].centre.y;
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
      const state = reorders.get(slot) ?? rc.state;
      const dx = Math.max(0, left - c.x, c.x - right);
      const dy = Math.max(0, Math.abs(c.y - midY) - h / 2);
      return { preview: previewOf(reorders.has(slot) ? slot : -1, state), dropState: state, gap: Math.hypot(dx, dy) };
    };
  });
}

/** Distance from the carried symbol's centre to `aim` (computed once per drag). */
function aimAt(rc: RenderCtx, result: MathState, aim: (ctx: DragInitContext<MathState>) => Vec2): DragSpec<MathState> {
  return rc.d!.custom((ctx: DragInitContext<MathState>) => {
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
function landing(rc: RenderCtx, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(rc, result, (ctx) => {
    const after: RenderCtx = { state: result, d: null, rules: [], draggedId: null };
    renderState(after, rc.canvas!.W, rc.canvas!.H);
    return canvasBox(after, ctx, draggedId).centre;
  });
}

/**
 * Pulling something out of its container, past the container's edge: a
 * factor out of ln( … ) or √( … ), or a term out of a fraction's top. The first one
 * goes out to the left, the others to the right.
 */
function pullOut(rc: RenderCtx, draggedId: string, result: MathState): DragSpec<MathState> {
  return aimAt(rc, result, (ctx) => pullOutAim(rc, ctx, draggedId));
}

function pullOutAim(rc: RenderCtx, ctx: DragInitContext<MathState>, draggedId: string): Vec2 {
  const c = dragCtx(rc.state, draggedId)!;
  const containerId = dragCtx(rc.state, c.parent!.id)!.parent!.id;
  const b = canvasBox(rc, ctx, containerId);
  return c.index === 0 ? b.symLeft.sub(Vec2(0.6 * b.h, 0)) : b.symRight.add(Vec2(0.6 * b.h, 0));
}

/** How visible the carried log is the moment the piece is picked up. */
const SHELL_FAINT = 0.2;

/**
 * ln(2x): the 2 can't leave without a copy of the ln. So from the moment it's
 * picked up, the carried 2 wears a faint ln( ), which firms up the further it
 * is pulled out (fully there where the split lands). In the split's preview
 * the new ln at the destination is hidden: the one being carried is it.
 */
class CarryLogShell extends Modifier<MathState> {
  readonly name = "carryLogShell";
  private readonly home: Vec2;
  private readonly aim: Vec2;
  private readonly bare: unknown[];
  private readonly hidden: Set<string>;
  private readonly shell: Svgx[];

  constructor(
    ctx: DragInitContext<MathState>,
    inner: DragSpecData<MathState>,
    readonly rc: RenderCtx,
    readonly draggedId: string,
    readonly result: MathState,
  ) {
    super(ctx, inner);
    this.home = canvasBox(rc, ctx, draggedId).centre;
    this.aim = pullOutAim(rc, ctx, draggedId);
    // The piece as it looks now (no brackets of its own yet), in every preview.
    const start = renderStateReadOnly(ctx, rc.state).byId.get(draggedId)?.element as ReactElement<{ children?: unknown }> | undefined;
    this.bare = ([] as unknown[]).concat(start?.props.children ?? []);
    // The new log around the piece in the result: its label is what we carry.
    const newLog = result.sides
      .flatMap(allNodes)
      .find((n): n is Log => n.kind === "log" && n.arg.id === draggedId);
    this.hidden = new Set(newLog ? [newLog.id, ...allNodes(newLog.base).map((n) => n.id)] : []);
    const log = dragCtx(rc.state, dragCtx(rc.state, draggedId)!.parent!.id)!.parent as Log;
    this.shell = logShell(log, rc.fontSizes!.get(draggedId)!, rc.sizes!.get(draggedId)!);
  }

  frame(frame: DragFrame) {
    const r = this.inner.run(frame);
    const out = this.aim.sub(this.home);
    const along = carriedCentre(this.rc, this.ctx, frame.pointer).sub(this.home).dot(out) / out.dot(out);
    const opacity = SHELL_FAINT + (1 - SHELL_FAINT) * Math.min(1, Math.max(0, along));
    const onSplit = r.dropState === this.result;
    return { ...r, preview: () => this.dress(r.preview(), opacity, onSplit) };
  }

  private dress(layers: LayeredSvgx, opacity: number, onSplit: boolean): LayeredSvgx {
    const byId = new Map(layers.byId);
    const me = byId.get(this.draggedId);
    if (me) {
      const shell = (
        <g dragologyKey="carry-shell" opacity={opacity} style={{ pointerEvents: "none" }}>
          {this.shell}
        </g>
      );
      byId.set(this.draggedId, { ...me, element: cloneElement(me.element, {}, ...(this.bare as Svgx[]), shell) as Svgx });
    }
    if (onSplit) {
      for (const id of this.hidden) {
        const layer = byId.get(id);
        if (layer) byId.set(id, { ...layer, element: cloneElement(layer.element, { opacity: 0 }) as Svgx });
      }
    }
    return { ...layers, byId };
  }
}
const carryLogShell = modifier(CarryLogShell);

/**
 * ln(2) + ln(x): carrying ln(x) onto ln(2), its ln( ) (and a minus in front,
 * which becomes the fraction bar or joins the other's) fades as it nears the
 * target, down to faint just before the merge takes over. What stays solid is
 * the x — the part that actually goes into the other log.
 */
class FadeCarriedLog extends Modifier<MathState> {
  readonly name = "fadeCarriedLog";
  private readonly home: Vec2;
  private readonly targets: Vec2[];
  /** Layers that fade whole (the ln label, a minus), and layers where only some glyphs fade (brackets, "log"). */
  private readonly whole: string[];
  private readonly glyphs: [string, Set<string>][];

  constructor(
    ctx: DragInitContext<MathState>,
    inner: DragSpecData<MathState>,
    readonly rc: RenderCtx,
    draggedId: string,
    targetIds: string[],
  ) {
    super(ctx, inner);
    this.home = canvasBox(rc, ctx, draggedId).centre;
    this.targets = targetIds.map((t) => canvasBox(rc, ctx, t).centre);
    const T = dragCtx(rc.state, draggedId)!.node;
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
    const near = Math.max(0, ...this.targets.map((t) => 1 - c.dist(t) / Math.max(1, this.home.dist(t))));
    const opacity = 1 - (1 - SHELL_FAINT) * Math.min(1, near);
    return { ...r, preview: () => this.dress(r.preview(), opacity) };
  }

  private dress(layers: LayeredSvgx, opacity: number): LayeredSvgx {
    const byId = new Map(layers.byId);
    for (const id of this.whole) {
      const layer = byId.get(id);
      if (layer) byId.set(id, { ...layer, element: cloneElement(layer.element, { opacity }) as Svgx });
    }
    for (const [id, keys] of this.glyphs) {
      const layer = byId.get(id);
      if (layer) byId.set(id, { ...layer, element: withGlyphOpacity(layer.element, keys, opacity) as Svgx });
    }
    return { ...layers, byId };
  }
}
const fadeCarriedLog = modifier(FadeCarriedLog);

/** `el` with the decorations keyed by `keys` (anywhere inside it) at this opacity. */
function withGlyphOpacity(el: unknown, keys: Set<string>, opacity: number): unknown {
  if (Array.isArray(el)) return el.map((c) => withGlyphOpacity(c, keys, opacity));
  if (!el || typeof el !== "object" || !("props" in el)) return el;
  const e = el as ReactElement<{ dragologyKey?: string; children?: unknown }>;
  if (e.props.dragologyKey && keys.has(e.props.dragologyKey)) return cloneElement(e as ReactElement<{ opacity?: number }>, { opacity });
  if (e.props.children === undefined) return e;
  return cloneElement(e, {}, withGlyphOpacity(e.props.children, keys, opacity) as never);
}

/** "ln(" and ")" (or "log₂(" and ")") around a piece of the given size, in its own coordinates. */
function logShell(L: Log, size: number, me: Size): Svgx[] {
  const pw = textWidth("(", size) + 0.02 * size;
  const gap = 0.04 * size;
  const sy = Math.max(1, (me.asc + me.desc) / ((ASC + DESC) * size));
  const shiftY = (me.desc - me.asc) / 2 + ((ASC - DESC) / 2) * size * sy;
  const paren = (pkey: string, ch: string, x: number) => (
    <text dragologyKey={pkey} transform={`${translate(x, shiftY)} scale(1, ${sy})`} fontSize={size} className="m-op">
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

/** Factoring out: carry the factor out past the left end of its expression. */
function outInFront(rc: RenderCtx, draggedId: string, result: MathState): DragSpec<MathState> {
  let loc = locate(rc.state, draggedId);
  while (loc && nodeAt(rc.state, loc).kind !== "sum") loc = loc.path.length ? { ...loc, path: loc.path.slice(0, -1) } : null;
  const first = loc && (nodeAt(rc.state, loc) as { terms: { id: string }[] }).terms[0].id;
  return aimAt(rc, result, (ctx) => {
    const b = canvasBox(rc, ctx, first ?? draggedId);
    return b.symLeft.sub(Vec2(0.9 * b.h, 0));
  });
}

/**
 * A merge zone keyed to where the carried *piece* is, not the pointer: people
 * line up the symbol they carry with the one they aim at, wherever they
 * grabbed it. (Dragology's `dropTarget` is pointer-in-bounds.)
 */
function onTarget(rc: RenderCtx, draggedId: string, targetId: string, result: MathState): DragSpec<MathState> {
  // A target *inside* the dragged piece (the brackets of −(x − 4)) is always
  // under it, so there the grab point itself must reach it, after a real move.
  const loc = locate(rc.state, draggedId);
  const nested = !!loc && allNodes(nodeAt(rc.state, loc)).some((n) => n.id === targetId);
  return rc.d!.custom((ctx: DragInitContext<MathState>) => {
    const preview = renderStateReadOnly(ctx, result);
    const t = canvasBox(rc, ctx, targetId);
    const me = canvasBox(rc, ctx, draggedId);
    const home = getElementPositionCheap(ctx, rc.state);
    const reachX = Math.max(t.w / 2, ON_TARGET * Math.max(me.w, t.w));
    const reachY = (me.h + t.h) / 4;
    return (frame) => {
      let hit: boolean;
      if (nested) {
        const p = frame.pointer;
        const moved = home ? p.dist(home) > 0.3 * t.h : true;
        hit = moved && p.x >= t.symLeft.x && p.x <= t.symRight.x && Math.abs(p.y - t.centre.y) <= t.h / 2;
      } else {
        const c = carriedCentre(rc, ctx, frame.pointer);
        hit = Math.abs(c.x - t.centre.x) <= reachX && Math.abs(c.y - t.centre.y) <= reachY;
      }
      return { preview: () => preview, dropState: result, gap: hit ? 0 : Infinity };
    };
  });
}

function layoutNode(
  e: Expr,
  rc: RenderCtx,
  size: number,
  lead: Lead | null,
  opts: { parens?: boolean; asLn?: boolean; root?: RootGeometry } = {},
): Box {
  if (e.kind === "neg" && lead === null) lead = "uminus";
  const content = withParens(layoutContent(e, rc, size, opts.asLn ?? false, opts.root), size, opts.parens ?? false);

  const L = lead ? LEAD[lead] : null;
  const leadW = L ? (L.left + L.right) * size + textWidth(L.glyph, size) : 0;
  const w = leadW + content.w;
  const asc = Math.max(content.asc, ASC * size);
  const desc = Math.max(content.desc, DESC * size);
  const interactive = rc.d !== null;
  // Symbols with no real move of their own let presses fall through to the
  // term underneath (pointer-events: none), so 3x + 2x moves as whole terms.
  const grabbable = interactive && isGrabbable(rc.state, e.id, rc.rules);
  const tap = grabbable ? tapFor(rc.state, e.id, rc.rules) : null;
  rc.sizes?.set(e.id, { w, asc, desc, lead: leadW });
  rc.fontSizes?.set(e.id, size);
  // A minus sign is also its own piece (see signHandle); every layout records its size.
  if (e.kind === "neg" && L) rc.sizes?.set(signId(e.id), { w: textWidth(L.glyph, size) + 0.04 * size, asc: ASC * size, desc: DESC * size, lead: 0 });

  return {
    w,
    asc,
    desc,
    draw: (x, y) => (
      <g
        id={e.id}
        transform={translate(x, y)}
        className={grabbable ? "m-node" : undefined}
        style={interactive ? { pointerEvents: grabbable ? "auto" : "none" } : undefined}
        {...(grabbable
          ? {
              dragologyOnDrag: () => dragSpec(rc, e.id),
              onClick: tap && rc.onTap ? () => rc.onTap!(tap.state) : undefined,
              dragologyZIndex: rc.draggedId === e.id ? "/1" : false,
              dragologyEmergeFrom: e.from,
              // Copies (from distributing) fly out of their source fully visible.
              dragologyEmergeMode: e.from ? ("clone" as const) : undefined,
            }
          : {})}
      >
        <rect dragologyKey="hit" transform={translate(0, -asc)} width={w} height={asc + desc} className="m-hit" />
        {L && (e.kind === "neg" && interactive ? signHandle(rc, e.id, L, size) : glyph(`lead-${lead}`, L.glyph, L.left * size, 0, size, "m-op"))}
        {content.parts(leadW)}
      </g>
    ),
  };
}

/**
 * A minus sign as its own handle: grabbable alone only when a move exists for
 * the minus by itself (−x = 6 → carry the −; −(x − 4) → carry it onto the
 * brackets). Otherwise presses fall through to the term, as for −a in a + b − a.
 */
function signHandle(rc: RenderCtx, negId: string, L: { glyph: string; left: number }, size: number): Svgx {
  const id = signId(negId);
  const w = textWidth(L.glyph, size) + 0.04 * size;
  const asc = ASC * size;
  const desc = DESC * size;
  const grabbable = isGrabbable(rc.state, id, rc.rules);
  return (
    <g
      id={id}
      transform={translate(L.left * size, 0)}
      className={grabbable ? "m-node" : undefined}
      style={{ pointerEvents: grabbable ? "auto" : "none" }}
      {...(grabbable
        ? { dragologyOnDrag: () => dragSpec(rc, id), dragologyZIndex: rc.draggedId === id ? "/1" : false }
        : {})}
    >
      <rect dragologyKey="hit" transform={translate(0, -asc)} width={w} height={asc + desc} className="m-hit" />
      {glyph("t-sign", L.glyph, 0, 0, size, "m-op")}
    </g>
  );
}

/** Where a root's sign must reach: its overline's height (top) and how far below the baseline it dips. */
type RootGeometry = { top: number; bottom: number; stroke: number };

/**
 * The √ sign as a path: a short rising tick, down to the bottom, then up to
 * the top-right corner where the overline begins. An index (∛) sits above
 * the tick.
 */
function rootSign(e: Frac, size: number, g: RootGeometry): Content {
  const n = e.den.kind === "num" ? e.den.value : 2;
  const idxSize = size * 0.42;
  const idx = n === 2 ? 0 : textWidth(String(n), idxSize) * 0.85;
  const h = g.bottom - g.top;
  const w = 0.5 * size + 0.08 * h;
  const tickY = g.top + 0.62 * h;
  const pts: [number, number][] = [
    [idx, tickY],
    [idx + 0.14 * w, tickY - 0.07 * size],
    [idx + 0.42 * w, g.bottom],
    [idx + w, g.top],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  return {
    w: idx + w,
    asc: -g.top + g.stroke,
    desc: g.bottom + g.stroke,
    parts: (x0) => [
      <path
        dragologyKey="root"
        transform={translate(x0, 0)}
        d={d}
        strokeWidth={g.stroke}
        className="m-root"
      />,
      ...(n === 2 ? [] : [glyph("rootidx", String(n), x0, tickY - 0.12 * size, idxSize, "m-num")]),
    ],
  };
}

/** An operator glyph that belongs to its row (keyed by the item after it, so it moves with that slot). */
function separator(kind: "plus" | "dot", key: string, size: number): Box {
  const L = LEAD[kind];
  return {
    w: (L.left + L.right) * size + textWidth(L.glyph, size),
    asc: ASC * size,
    desc: DESC * size,
    draw: (x, y) => glyph(key, L.glyph, x + L.left * size, y, size, "m-op"),
  };
}

function withParens(c: Content, size: number, parens: boolean): Content {
  if (!parens) return c;
  const pw = textWidth("(", size) + 0.02 * size;
  const sy = Math.max(1, (c.asc + c.desc) / ((ASC + DESC) * size));
  const shiftY = (c.desc - c.asc) / 2 + ((ASC - DESC) / 2) * size * sy;
  const paren = (pkey: string, ch: string, x: number) => (
    <text dragologyKey={pkey} transform={`${translate(x, shiftY)} scale(1, ${sy})`} fontSize={size} className="m-op">
      {ch}
    </text>
  );
  return {
    w: c.w + 2 * pw,
    asc: Math.max(c.asc, ASC * size * sy),
    desc: Math.max(c.desc, DESC * size * sy),
    parts: (x0) => [paren("lp", "(", x0), ...c.parts(x0 + pw), paren("rp", ")", x0 + pw + c.w)],
  };
}

/**
 * Where writing factors side by side would misread, show a ·: before a number
 * (x·5), before or after a fraction (2·¾ is not 2¾), and before a power of a
 * number (2·3ˣ is not 23ˣ). A root reads fine without one (2√3).
 */
const needsDot = (left: Expr, right: Expr) =>
  right.kind === "num" ||
  right.kind === "frac" ||
  left.kind === "frac" ||
  (right.kind === "pow" && !right.radical && right.base.kind === "num");

function row(boxes: Box[], gap = 0): Content {
  const xs: number[] = [];
  let w = 0;
  boxes.forEach((b, i) => {
    if (i > 0) w += gap;
    xs.push(w);
    w += b.w;
  });
  return {
    w,
    asc: Math.max(0, ...boxes.map((b) => b.asc)),
    desc: Math.max(0, ...boxes.map((b) => b.desc)),
    parts: (x0) => boxes.map((b, i) => b.draw(x0 + xs[i], 0)),
  };
}

function layoutContent(e: Expr, rc: RenderCtx, size: number, asLn: boolean, root?: RootGeometry): Content {
  switch (e.kind) {
    case "num":
    case "var": {
      const text = e.kind === "num" ? String(e.value) : e.name;
      const italic = e.kind === "var";
      const w = textWidth(text, size, italic) + (italic ? 0.04 * size : 0);
      return {
        w,
        asc: ASC * size,
        desc: DESC * size,
        // Keyed by kind: when a node changes kind under the same id (x⁰ → 1),
        // the glyphs crossfade. Same key + different className can't be
        // blended, and Dragology throws (see lerp.test.tsx).
        parts: (x0) => [glyph(`t-${e.kind}`, text, x0, 0, size, italic ? "m-var" : "m-num")],
      };
    }
    case "neg": {
      // The minus itself is the lead glyph of this node (see layoutNode).
      const arg = layoutNode(e.arg, rc, size, null, { parens: e.arg.kind === "sum" || e.arg.kind === "neg" });
      return row([arg]);
    }
    case "sum": {
      // A "+" belongs to the row, not to the term after it: carrying 2 out of
      // 2 + x carries just the 2, and the + waits in the row where it will
      // land. A "−" is part of its term's value, so it travels with the term.
      return row(
        e.terms.flatMap((t, i) =>
          i > 0 && t.kind !== "neg"
            ? [separator("plus", `plus-${t.id}`, size), layoutNode(t, rc, size, null)]
            : [layoutNode(t, rc, size, i > 0 ? "minus" : null)],
        ),
      );
    }
    case "prod":
      // Likewise a "·" between factors belongs to the product, not the factor.
      return row(
        e.factors.flatMap((f, i) => {
          const factor = layoutNode(f, rc, size, null, { parens: f.kind === "sum" || f.kind === "neg" });
          return i > 0 && needsDot(e.factors[i - 1], f) ? [separator("dot", `dot-${f.id}`, size), factor] : [factor];
        }),
        0.03 * size,
      );
    case "frac": {
      if (root !== undefined) return rootSign(e, size, root);
      const inner = size * 0.92;
      const n = layoutNode(e.num, rc, inner, null);
      const d = layoutNode(e.den, rc, inner, null);
      const axis = 0.26 * size;
      const gap = 0.14 * size;
      const thick = 0.055 * size;
      const pad = 0.1 * size;
      const w = Math.max(n.w, d.w) + 2 * pad;
      const nY = -axis - gap - n.desc;
      const dY = -axis + gap + d.asc;
      return {
        w,
        asc: axis + gap + n.desc + n.asc,
        desc: gap + d.asc + d.desc - axis,
        parts: (x0) => [
          n.draw(x0 + (w - n.w) / 2, nY),
          <rect dragologyKey="bar" transform={translate(x0, -axis - thick / 2)} width={w} height={thick} className="m-bar" />,
          d.draw(x0 + (w - d.w) / 2, dY),
        ],
      };
    }
    case "pow": {
      if (rootIndex(e) !== null) {
        // ⁿ√x: the exponent 1/n is drawn as the √ itself, so dragging the √ drags
        // the exponent. The √ is a stroked path whose top-right corner is exactly
        // where the overline starts; both use the same stroke, so they join up.
        const base = layoutNode(e.base, rc, size, null);
        const geo: RootGeometry = {
          top: -(base.asc + 0.08 * size),
          bottom: Math.max(base.desc * 0.85, 0.16 * size),
          stroke: 0.055 * size,
        };
        const sign = layoutNode(e.exp, rc, size, null, { root: geo });
        const gap = 0.06 * size;
        const pad = 0.06 * size;
        return {
          w: sign.w + gap + base.w + pad,
          asc: -geo.top + geo.stroke,
          desc: Math.max(geo.bottom + geo.stroke, base.desc),
          parts: (x0) => [
            sign.draw(x0, 0),
            <rect
              dragologyKey="overline"
              transform={translate(x0 + sign.w - geo.stroke / 2, geo.top - geo.stroke / 2)}
              width={gap + base.w + pad + geo.stroke / 2}
              height={geo.stroke}
              className="m-bar"
            />,
            base.draw(x0 + sign.w + gap, 0),
          ],
        };
      }
      const base = layoutNode(e.base, rc, size, null, { parens: !["num", "var", "const"].includes(e.base.kind) });
      const exp = layoutNode(e.exp, rc, size * 0.68, null);
      const raise = 0.44 * size;
      const gap = 0.03 * size;
      return {
        w: base.w + gap + exp.w,
        asc: Math.max(base.asc, raise + exp.asc),
        desc: Math.max(base.desc, exp.desc - raise),
        parts: (x0) => [base.draw(x0, 0), exp.draw(x0 + base.w + gap, -raise)],
      };
    }
    case "const": {
      // Inside ln, the base e *is* the "ln" label, so dragging the e of eˣ
      // across = visibly turns it into ln. (Different keys: the glyphs crossfade.)
      const text = asLn ? "ln" : e.name;
      const w = textWidth(text, size, !asLn) + (asLn ? 0.06 * size : 0.04 * size);
      return {
        w,
        asc: ASC * size,
        desc: DESC * size,
        parts: (x0) => [glyph(asLn ? "ln" : "t-const", text, x0, 0, size, asLn ? "m-fn" : "m-const")],
      };
    }
    case "log": {
      const arg = layoutNode(e.arg, rc, size, null, { parens: true });
      const gap = 0.04 * size;
      if (e.base.kind === "const") {
        const label = layoutNode(e.base, rc, size, null, { asLn: true });
        return row([label, arg], gap);
      }
      const word = textWidth("log", size) + 0.02 * size;
      const base = layoutNode(e.base, rc, size * 0.68, null, { parens: !["num", "var", "const"].includes(e.base.kind) });
      const drop = 0.28 * size;
      return {
        w: word + base.w + gap + arg.w,
        asc: Math.max(ASC * size, arg.asc),
        desc: Math.max(DESC * size, base.desc + drop, arg.desc),
        parts: (x0) => [
          glyph("log", "log", x0, 0, size, "m-fn"),
          base.draw(x0 + word, drop),
          arg.draw(x0 + word + base.w + gap, 0),
        ],
      };
    }
  }
}

export const BASE_SIZE = 46;

/** Lay out a whole expression or equation centred in a W×H canvas. */
export function renderState(rc: RenderCtx, W: number, H: number): Svgx {
  rc.sizes ??= new Map();
  rc.fontSizes ??= new Map();
  rc.canvas = { W, H };
  const build = (size: number) => {
    const sides = rc.state.sides.map((s) => layoutNode(s, rc, size, null));
    const eqW = textWidth("=", size);
    const space = 0.35 * size;
    return { sides, eqW, space };
  };

  let size = BASE_SIZE;
  let { sides, eqW, space } = build(size);
  const halfWidth = (s: typeof sides) =>
    s.length === 1 ? s[0].w / 2 : Math.max(s[0].w, s[1].w) + space + eqW / 2;
  const maxHalf = W / 2 - 16;
  if (halfWidth(sides) > maxHalf) {
    size *= maxHalf / halfWidth(sides);
    ({ sides, eqW, space } = build(size));
  }

  const asc = Math.max(...sides.map((s) => s.asc));
  const desc = Math.max(...sides.map((s) => s.desc));
  const baseline = H / 2 + (asc - desc) / 2;
  const cx = W / 2;

  if (sides.length === 1) {
    return <g>{sides[0].draw(cx - sides[0].w / 2, baseline)}</g>;
  }
  // The = sign stays put in the middle, like the pivot of a balance.
  return (
    <g>
      {sides[0].draw(cx - eqW / 2 - space - sides[0].w, baseline)}
      {glyph("eq", "=", cx - eqW / 2, baseline, size, "m-op m-eq")}
      {sides[1].draw(cx + eqW / 2 + space, baseline)}
    </g>
  );
}
