/**
 * "Show me": where a hand would press and let go to make one move, so the
 * app can play it with the real drag engine (see MathCanvas's demo). Worked
 * out headlessly, the way the drag tests do (testing/harness.ts), from the
 * drag's own aims: a merge is carried to where it completes, any other move
 * to where the drag aims it (searching along the row, or around it, only
 * if letting go there doesn't give the move).
 */
import { Vec2 } from "dragology";
import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { handles, movesFor, RULES, type Candidate, type RuleId } from "../rules";
import { ANCHOR, Grip, harness } from "./testing/harness";

export type Demo =
  | { kind: "tap"; id: string; next: MathState }
  /** Press at `from` (held first, when a quick press would take its term), let go at `to` (canvas coordinates). */
  | { kind: "drag"; id: string; from: Vec2; to: Vec2; next: MathState; hold: boolean };

const ROW = Array.from({ length: 181 }, (_, i) => Vec2(i * 8 - 720, 0)).sort((p, q) => p.len() - q.len());
const AROUND = Array.from({ length: 21 * 11 }, (_, i) => Vec2((i % 21) * 16 - 160, Math.floor(i / 21) * 16 - 80))
  .filter((v) => v.y !== 0)
  .sort((p, q) => p.len() - q.len());

const same = (a: MathState, b: MathState) => stateKey(a, "exact") === stateKey(b, "exact");

/**
 * How to show `rule` on `state` in a W×H canvas: preferring a move that
 * `good` likes (one that heads for the board's goal). Null if none can be shown.
 */
export function planDemo(state: MathState, rules: readonly RuleId[], rule: RuleId, W: number, H: number, good: (s: MathState) => boolean = () => true): Demo | null {
  const moves = movesFor(state, rules);
  const ids = handles(state);
  if (RULES[rule].tap) {
    const taps = ids.flatMap((id) => {
      const c = moves.tap(id);
      return c && c.rule === rule ? [{ id, c }] : [];
    });
    const t = taps.find((x) => good(x.c.state)) ?? taps[0];
    return t ? { kind: "tap", id: t.id, next: t.c.state } : null;
  }
  const h = harness(state, rules, W, H);
  const all: { id: string; c: Candidate }[] = ids.filter((id) => moves.grabbable(id)).flatMap((id) => moves.drag(id).filter((c) => c.rule === rule).map((c) => ({ id, c })));
  const ordered = [...all.filter((x) => good(x.c.state)), ...all.filter((x) => !good(x.c.state))];
  for (const { id, c } of ordered) {
    const origin = h.originOf(id);
    if (!origin) continue;
    if (c.targetId) {
      const grip = h.grab(id);
      const to = grip.start.add(h.endsUpOffset(id, c.targetId, c.rule));
      if (same(grip.at(to).state, c.state)) return { kind: "drag", id, from: grip.start, to, next: c.state, hold: !moves.pressable(id) };
      continue;
    }
    const from = origin.add(ANCHOR);
    // A fresh drag for each point tried, as a hand would.
    const gives = (v: Vec2) => same(new Grip(h, id, ANCHOR).at(from.add(v)).state, c.state);
    // Where the drag itself aims this move (its layout, as the drag reads it); only failing that, a search.
    const aim = h.aimOf(id, c).sub(h.centreOf(id));
    const o = [aim].find(gives) ?? ROW.find(gives) ?? AROUND.find(gives);
    if (o) return { kind: "drag", id, from, to: from.add(o), next: c.state, hold: !moves.pressable(id) };
  }
  return null;
}
