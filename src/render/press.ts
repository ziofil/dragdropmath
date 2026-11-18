/**
 * What a press on the board takes: the one place this is decided (see
 * docs/move-system.md, "Pieces and handles"). The canvas asks it where the
 * pointer goes down, Show asks it where to put the finger, and the tests ask
 * it whether every step can be made at all — so they can't disagree.
 *
 * - A quick press takes the biggest piece around the point that can move
 *   (the x of 3x + 2 takes 3x).
 * - A press held still takes the piece itself (the x).
 * - An operator is the handle of what it joins: the + or − between terms
 *   takes the sum, the · between factors the product. (The bar of a fraction
 *   is in the fraction's box and in no part of it, so it takes the fraction.)
 *   The − between two terms is also the minus of the term after it: a quick
 *   press takes the sum, a hold takes the minus alone.
 * - A tap on an operator works out the two sides of it (operatorTap); a tap
 *   anywhere else, the innermost piece there with a tap.
 */
import type { Expr, MathState } from "../expr/types";
import { allNodes, children } from "../expr/tree";
import { dotBetween, handles, movesFor, opId, signId, signOwner, type Moves, type RuleId } from "../rules";
import { ASC, DESC, LEAD, pivotOf, placesOf, type RenderCtx } from "./typeset";
import { laidOut } from "./geometry";
import { textWidth } from "./measure";

export type Point = { x: number; y: number };
type Box = { left: number; right: number; top: number; bottom: number };

/** An operator glyph on the board: its handle id, where it is, what it joins, the piece after it, and (a −) the minus it also is. */
export type Op = { id: string; box: Box; joins: string; after: string; kind: "plus" | "minus" | "dot"; sign?: string };

/** What a press at a point does: the piece a quick press takes, the piece a hold takes, and what a tap there gives. */
export type Press = { quick: string | null; hold: string | null; tap: { op: boolean; id: string; state: MathState } | null };

const inside = (b: Box, p: Point) => p.x >= b.left && p.x <= b.right && p.y >= b.top && p.y <= b.bottom;
const area = (b: Box) => (b.right - b.left) * (b.bottom - b.top);

/** Everything about one laid-out board a press needs, worked out once. */
export class Board {
  readonly boxes = new Map<string, Box>();
  readonly ops: Op[] = [];
  private readonly parent = new Map<string, string | null>();

  constructor(
    readonly rc: RenderCtx,
    readonly moves: Moves,
    readonly rules: readonly RuleId[],
  ) {
    const state = rc.state;
    const places = placesOf(rc);
    const boxOf = (id: string): Box | null => {
      const at = places.get(id);
      const s = rc.sizes?.get(id);
      return at && s ? { left: at.x, right: at.x + s.w, top: at.y - s.asc, bottom: at.y + s.desc } : null;
    };
    for (const id of handles(state)) {
      const b = boxOf(id);
      if (b) this.boxes.set(id, b);
    }
    const visit = (e: Expr, up: string | null) => {
      this.parent.set(e.id, up);
      for (const c of children(e)) visit(c, e.id);
    };
    state.sides.forEach((s) => visit(s, null));
    for (const n of state.sides.flatMap(allNodes)) {
      if (n.kind === "sum")
        n.terms.forEach((t, i) => {
          if (i === 0) return;
          const at = places.get(t.id);
          const s = rc.sizes?.get(t.id);
          const size = rc.fontSizes?.get(t.id);
          if (!at || !s || size === undefined) return;
          const band = { top: at.y - ASC * size, bottom: at.y + DESC * size };
          if (t.kind === "neg") this.ops.push({ id: opId(t.id), box: { left: at.x, right: at.x + s.lead, ...band }, joins: n.id, after: t.id, kind: "minus", sign: signId(t.id) });
          else {
            const w = (LEAD.plus.left + LEAD.plus.right) * size + textWidth(LEAD.plus.glyph, size);
            this.ops.push({ id: opId(t.id), box: { left: at.x - w, right: at.x, ...band }, joins: n.id, after: t.id, kind: "plus" });
          }
        });
      if (n.kind === "prod")
        n.factors.forEach((f, i) => {
          if (i === 0 || !dotBetween(n.factors[i - 1], f)) return; // no · drawn between them
          const at = places.get(f.id);
          const prev = this.boxes.get(n.factors[i - 1].id) ?? boxOf(n.factors[i - 1].id);
          const size = rc.fontSizes?.get(f.id);
          if (!at || !prev || size === undefined) return;
          this.ops.push({ id: opId(f.id), box: { left: prev.right, right: at.x, top: at.y - ASC * size, bottom: at.y + DESC * size }, joins: n.id, after: f.id, kind: "dot" });
        });
    }
  }

  /** The piece itself, then what it's in, out to its side. */
  private *outward(id: string): Generator<string> {
    for (let at: string | null | undefined = id; at; at = signOwner(at) ?? this.parent.get(at)) yield at;
  }

  /** The smallest piece with a box at the point that `ok` accepts. */
  private smallest(p: Point, ok: (id: string) => boolean): string | null {
    let best: { id: string; a: number } | null = null;
    for (const [id, b] of this.boxes) {
      if (!inside(b, p) || !ok(id)) continue;
      const a = area(b);
      if (!best || a < best.a) best = { id, a };
    }
    return best?.id ?? null;
  }

  opAt(p: Point): Op | null {
    return this.ops.find((o) => inside(o.box, p)) ?? null;
  }

  /** What a press at `p` takes (quick or held) and what a tap there gives. */
  at(p: Point): Press {
    const m = this.moves;
    const op = this.opAt(p);
    // On an operator: what it joins, or the biggest piece around that which can move.
    const joined = op ? [...this.outward(op.joins)].find((id) => m.pressable(id)) ?? null : null;
    const quick = joined ?? this.smallest(p, (id) => m.pressable(id));
    // Held: on a −, the minus alone, if it has a move of its own; on another operator, what it joins; else the smallest piece there with a move.
    const held = op ? (op.sign && m.grabbable(op.sign) ? op.sign : m.grabbable(op.joins) ? op.joins : null) : null;
    const smallest = held ?? this.smallest(p, (id) => m.grabbable(id));
    const hold = smallest && smallest !== quick ? smallest : null;
    // A tap on an operator works out its two sides (the operator's own handle); elsewhere the smallest piece there with a tap.
    const tapId = op && m.tappable(op.id) ? op.id : this.smallest(p, (id) => m.tappable(id));
    const tap = tapId ? { op: tapId === op?.id, id: tapId, state: m.tap(tapId)!.state } : null;
    return { quick, hold, tap };
  }

  /** Points to try a press at, over piece `id`'s box (and its operators), nearest its middle first. */
  spotsOver(id: string): Point[] {
    const boxes = [this.boxes.get(id), ...this.ops.filter((o) => o.joins === id || o.sign === id).map((o) => o.box)].filter((b): b is Box => !!b);
    const out: Point[] = [];
    const N = 12;
    for (const b of boxes) {
      out.push({ x: (b.left + b.right) / 2, y: (b.top + b.bottom) / 2 });
      for (let i = 0; i < N * N; i++) out.push({ x: b.left + (((i % N) + 0.5) / N) * (b.right - b.left), y: b.top + ((Math.floor(i / N) + 0.5) / N) * (b.bottom - b.top) });
    }
    return out;
  }

  /** Where a finger picks up piece `id`, and whether it must be held there; null if nowhere does. */
  spotFor(id: string): { at: Point; hold: boolean } | null {
    const spots = this.spotsOver(id);
    for (const p of spots) if (this.at(p).quick === id) return { at: p, hold: false };
    for (const p of spots) if (this.at(p).hold === id) return { at: p, hold: true };
    return null;
  }

  /** Where a tap gives what `same` accepts: on handle `id` (a piece, or an operator). Null if nowhere does. */
  tapSpotFor(id: string, same: (s: MathState) => boolean): Point | null {
    const op = this.ops.find((o) => o.id === id);
    const spots = op ? [{ x: (op.box.left + op.box.right) / 2, y: (op.box.top + op.box.bottom) / 2 }] : this.spotsOver(id);
    return spots.find((p) => {
      const t = this.at(p).tap;
      return t !== null && same(t.state);
    }) ?? null;
  }
}

const boards = new WeakMap<MathState, Map<string, Board>>();

/** The press model of `state` on a W×H canvas, laid out as the canvas draws it (the = where pivotOf puts it). */
export function boardFor(state: MathState, rules: readonly RuleId[], W: number, H: number): Board {
  const key = `${W}x${H}:${rules.join(",")}`;
  let byKey = boards.get(state);
  if (!byKey) boards.set(state, (byKey = new Map()));
  let b = byKey.get(key);
  if (!b) byKey.set(key, (b = new Board(laidOut(state, W, H, pivotOf(state, W)), movesFor(state, rules), rules)));
  return b;
}
