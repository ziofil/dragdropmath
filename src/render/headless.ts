/**
 * Runs the real Dragology drag engine headlessly, the way a hand would: grab
 * a piece, move the pointer, and look at each frame — what letting go would
 * give, how far a merge has formed, which glyphs are drawn where and how
 * visibly. Also replays drags recorded in the app's debug mode. Show plays
 * moves with it (demo.ts); the drag tests drive it (testing/).
 */
import {
  dragSpecToBehavior,
  getElementPosition,
  renderStateReadOnly,
  Vec2,
  type Draggable,
  type DragInitContext,
  type DragSpecBuilder,
  type LayeredSvgx,
} from "dragology";
import type { Expr, MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { reserveIds } from "../expr/build";
import { printState } from "../expr/key";
import { allNodes } from "../expr/tree";
import { ALL_RULES, candidatesFor, feelOf, type Candidate, type RuleId } from "../rules";
import { AIMS } from "./drag/carry";
import { interactive } from "./drag";
import { mergePlan } from "./drag/merge";
import { canvasBox, originOf } from "./geometry";
import { probeBlend } from "./preview";
import { pivotOf, renderState, type RenderCtx, type Size } from "./typeset";
import type { Recording } from "./testing/recording";

/** A point near the start of a glyph's baseline: inside any node's hit box. */
export const ANCHOR = Vec2(4, -10);

export const show = (s: MathState) => printState(s);
const showNode = (e: Expr) => printState({ sides: [e] });

/** One glyph as drawn in a preview: its text, the layer it's in, where, how visible. */
export type Drawn = { text: string; layer: string; x: number; y: number; opacity: number };

/** What the screen shows (and what letting go would give) at one pointer position. */
export class Frame {
  private _preview: LayeredSvgx | null = null;
  constructor(
    readonly pointer: Vec2,
    readonly state: MathState,
    private readonly makePreview: () => LayeredSvgx,
    private readonly ctxFor: (id: string) => DragInitContext<MathState>,
  ) {}
  /** What letting go here gives, printed. */
  get drops(): string {
    return show(this.state);
  }
  /** The preview (rendering it is what crashes the page if something's off, so tests should look). */
  get preview(): LayeredSvgx {
    try {
      return (this._preview ??= this.makePreview());
    } catch (e) {
      throw new Error(`preview crashed while showing ${this.drops}: ${(e as Error).message}`);
    }
  }
  /** How far the picture is blended towards a merge (0–1). */
  get blend(): number {
    return probeBlend(this.preview);
  }
  /** Every glyph drawn, with accumulated position and opacity. */
  glyphs(): Drawn[] {
    const out: Drawn[] = [];
    for (const [layer, l] of this.preview.byId) walk(l.element, 0, 0, 1, (text, x, y, opacity) => out.push({ text, layer, x, y, opacity }));
    return out;
  }
  /** Opacity of layer `id` itself (1 if unset, 0 if absent). */
  layerOpacity(id: string): number {
    const el = this.preview.byId.get(id)?.element as { props: { opacity?: number } } | undefined;
    return el ? (el.props.opacity ?? 1) : 0;
  }
  /**
   * Opacity of the first decoration keyed `key` (or starting with it, written
   * "plus-*"), in layer `id` or anywhere, including its layer's (0 if none).
   */
  keyOpacity(key: string, id?: string): number {
    const layers = id !== undefined ? [this.preview.byId.get(id)].filter(Boolean) : [...this.preview.byId.values()];
    for (const l of layers) {
      const o = findKey(l!.element, key, 1);
      if (o !== null) return o;
    }
    return 0;
  }
  /** Where node `id`'s origin is drawn in this frame (null if not drawn). */
  positionOf(id: string): Vec2 | null {
    return getElementPosition({ ...this.ctxFor(id), draggedPath: `${id}/`, anchorPos: Vec2(0, 0) }, this.preview);
  }
}

function walk(e: unknown, x: number, y: number, o: number, visit: (text: string, x: number, y: number, o: number) => void) {
  if (!e || typeof e !== "object") return;
  if (Array.isArray(e)) return e.forEach((c) => walk(c, x, y, o, visit));
  const pr = (e as { props?: Record<string, unknown> }).props;
  if (!pr) return;
  let nx = x;
  let ny = y;
  if (typeof pr.transform === "string") {
    for (const m of pr.transform.matchAll(/translate\(\s*([-+\d.eE]+)[\s,]+([-+\d.eE]+)/g)) {
      nx += parseFloat(m[1]);
      ny += parseFloat(m[2]);
    }
  }
  const no = o * ((pr.opacity as number | undefined) ?? 1);
  const kids = ([] as unknown[]).concat(pr.children ?? []);
  if (kids.length === 1 && (typeof kids[0] === "string" || typeof kids[0] === "number")) visit(String(kids[0]), nx, ny, no);
  else walk(pr.children, nx, ny, no, visit);
}

function findKey(e: unknown, key: string, o: number): number | null {
  if (!e || typeof e !== "object") return null;
  if (Array.isArray(e)) return e.map((c) => findKey(c, key, o)).find((x) => x !== null) ?? null;
  const pr = (e as { props?: Record<string, unknown> }).props;
  if (!pr) return null;
  const here = o * ((pr.opacity as number | undefined) ?? 1);
  const k = pr.dragologyKey;
  if (typeof k === "string" && (key.endsWith("*") ? k.startsWith(key.slice(0, -1)) : k === key)) return here;
  return findKey(pr.children, key, here);
}

/** A piece being held: move the pointer and look at what's shown. */
export class Grip {
  private readonly behavior;
  constructor(
    readonly h: Harness,
    readonly id: string,
    /** Where on the piece it was grabbed, in its own coordinates. */
    readonly anchor: Vec2,
  ) {
    this.behavior = dragSpecToBehavior(h.rc(id).interact!.drag(id), h.ctxFor(id, anchor));
  }
  /** The pointer where the piece was grabbed. */
  get start(): Vec2 {
    return this.h.originOf(this.id)!.add(this.anchor);
  }
  /** Pointer at `p`. */
  at(p: Vec2): Frame {
    const r = this.behavior({ pointer: p });
    return new Frame(p, r.dropState, r.preview, (id) => this.h.ctxFor(id));
  }
  /** Pointer moved by `v` from where it was grabbed. */
  by(v: Vec2): Frame {
    return this.at(this.start.add(v));
  }
  /** Along a straight line from the grab point to `to`, like a hand: `steps` frames after the start. */
  path(to: Vec2, steps = 30): Frame[] {
    return Array.from({ length: steps + 1 }, (_, i) => this.at(this.start.add(to.sub(this.start).mul(i / steps))));
  }
  /** The pointer that puts the carried symbol's centre on `point`. */
  centreOn(point: Vec2): Vec2 {
    return point.sub(this.h.centreOf(this.id)).add(this.start);
  }
}

export type Harness = ReturnType<typeof harness>;

/** A canvas showing `src`, with the real renderer and drag engine. */
export function harness(src: string | MathState, rules: readonly RuleId[] = ALL_RULES, W = 720, H = 220) {
  const state = typeof src === "string" ? parseState(src) : src;
  // A state from elsewhere (a recording): new pieces must not reuse its ids.
  state.sides.forEach(reserveIds);
  // Where the = sits, read off the board as it starts, as the app's canvas does (MathCanvas).
  const pivot = pivotOf(state, W);
  let builder: DragSpecBuilder<MathState> | null = null;
  const draggable: Draggable<MathState> = ({ state: s, d, draggedId }) => {
    if (s === state) builder = d; // capture the library's own spec builder
    return renderState(interactive({ state: s, d, rules, draggedId, pivot }), W, H);
  };
  const ctxFor = (id: string, anchor = ANCHOR): DragInitContext<MathState> => ({
    draggable,
    draggedPath: id,
    draggedId: id,
    anchorPos: anchor,
    startState: state,
    debug: { varyVisualizer: false },
  });
  const sizes = new Map<MathState, RenderCtx>();
  /** The canvas laid out for `s` (static: sizes and positions only). */
  const laidOut = (s: MathState) => {
    if (!sizes.has(s)) {
      const rc: RenderCtx = { state: s, ...(pivot === undefined ? {} : { pivot }) };
      renderState(rc, W, H);
      sizes.set(s, rc);
    }
    return sizes.get(s)!;
  };
  const nodes = () => state.sides.flatMap(allNodes);

  const h = {
    state,
    rules,
    show,
    W,
    H,
    ctxFor,
    /** The `nth` node that prints as `text` ("2*x", "ln(x)", "3"). */
    find(text: string, nth = 0): Expr {
      const found = nodes().filter((n) => showNode(n) === text);
      if (!found[nth]) throw new Error(`no ${nth > 0 ? `#${nth + 1} ` : ""}"${text}" in ${show(state)} (pieces: ${nodes().map(showNode).join(", ")})`);
      return found[nth];
    },
    /** The interactive canvas, as it is while dragging `id`. */
    rc(id: string | null = null): RenderCtx {
      if (!builder) renderStateReadOnly(ctxFor(id ?? ""), state);
      const rc = interactive({ state, d: builder!, rules, draggedId: id, pivot });
      renderState(rc, W, H);
      return rc;
    },
    /** Canvas position of node `id`'s origin (baseline-left) when showing `s`. */
    originOf(id: string, s: MathState = state): Vec2 | null {
      return originOf(laidOut(s), id);
    },
    /** Node `id`'s size when showing `s`. */
    sizeOf(id: string, s: MathState = state): Size {
      return laidOut(s).sizes!.get(id)!;
    },
    /** Centre of node `id`'s symbol (without its sign) when showing `s`. */
    centreOf(id: string, s: MathState = state): Vec2 {
      const z = h.sizeOf(id, s);
      return h.originOf(id, s)!.add(Vec2(z.lead + (z.w - z.lead) / 2, (z.desc - z.asc) / 2));
    },
    candidates(id: string): Candidate[] {
      return candidatesFor(state, id, rules);
    },
    /** The result of dropping `id` onto `targetId`. */
    merged(id: string, targetId: string): MathState {
      const c = h.candidates(id).find((k) => k.targetId === targetId);
      if (!c) throw new Error(`${show(state)}: nothing merges ${id} onto ${targetId}`);
      return c.state;
    },
    /**
     * How far to carry `id` so the merge completes under the hand: the part
     * of it that lives on to where the merged (recentred) result puts it
     * (around whatever the move keeps in place); if
     * nothing of it lives on, its centre onto the target (which stays put).
     */
    endsUpOffset(id: string, targetId: string, rule?: string): Vec2 {
      // Exactly what the app aims for (see mergePlan), from where the piece's centre starts.
      // (`rule`: which move, when two share the target.)
      const c = h.candidates(id).find((k) => k.targetId === targetId && (!rule || k.rule === rule))!;
      const rc = h.rc(id);
      return mergePlan(rc, id, c.state, targetId, c.stays).aim.sub(canvasBox(rc, id).centre);
    },
    /**
     * Where a move without a target aims (the carried symbol's centre), as the
     * drag measures it (render/drag/carry.ts AIMS): a reorder aims where the
     * piece sits in the reordered row.
     */
    aimOf(id: string, c: Candidate): Vec2 {
      const carry = feelOf(c).carry ?? "landing";
      return AIMS[carry === "reorder" ? "landing" : carry](h.rc(id), id, c.state)();
    },
    /** Pick up node `id` (or the first piece printing as `text`) at a point on it (default: near its symbol's start). */
    grab(idOrText: string, at?: Vec2): Grip {
      const id = nodes().some((n) => n.id === idOrText) || idOrText.endsWith("-sign") ? idOrText : h.find(idOrText).id;
      const z = laidOut(state).sizes!.get(id);
      return new Grip(h, id, at ?? Vec2((z?.lead ?? 0) + 4, -10));
    },
  };
  return h;
}

export type { Recording } from "./testing/recording";

/** Replay a recorded drag frame by frame (each frame's preview rendered, as on screen). */
export function replay(r: Recording): Frame[] {
  const h = harness(r.state, r.rules, r.W, r.H);
  const grip = new Grip(h, r.draggedId, Vec2(r.anchor[0], r.anchor[1]));
  return r.pointers.map(([x, y]) => {
    const f = grip.at(Vec2(x, y));
    void f.preview;
    return f;
  });
}
