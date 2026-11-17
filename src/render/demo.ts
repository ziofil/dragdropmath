/**
 * "Show me": where a hand would press and let go to make one move, so the
 * app can play it with the real drag engine (see MathCanvas's demo): the
 * lesson's own move (planDemo), then each step on to the board's end
 * (planStepTo). Worked
 * out headlessly, with the headless hand the drag tests use too (headless.ts), from the
 * drag's own aims: a merge is carried to where it completes, any other move
 * to where the drag aims it (searching along the row, or around it, only
 * if letting go there doesn't give the move).
 */
import { Vec2 } from "dragology";
import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { allNodes } from "../expr/tree";
import { handles, movesFor, operatorTap, RULES, stepsFrom, type RuleId, type Step, type Way } from "../rules";
import { ANCHOR, Grip, harness } from "./headless";

export type Demo =
  | { kind: "tap"; id: string; next: MathState }
  /** The +, − or · in front of piece `id` tapped (operatorTap). */
  | { kind: "op-tap"; id: string; next: MathState }
  /** Press at `from` (held first, when a quick press would take its term), let go at `to` (canvas coordinates). */
  | { kind: "drag"; id: string; from: Vec2; to: Vec2; next: MathState; hold: boolean };

const ROW = Array.from({ length: 181 }, (_, i) => Vec2(i * 8 - 720, 0)).sort((p, q) => p.len() - q.len());
const AROUND = Array.from({ length: 21 * 11 }, (_, i) => Vec2((i % 21) * 16 - 160, Math.floor(i / 21) * 16 - 80))
  .filter((v) => v.y !== 0)
  .sort((p, q) => p.len() - q.len());

const same = (a: MathState, b: MathState) => stateKey(a, "exact") === stateKey(b, "exact");

/**
 * How to show a step on `state` in a W×H canvas: one the lesson's move
 * (`rule`) makes, the first that `good` likes (heading for the board's goal),
 * made with the piece the words name (`prefer`) where there is one — by
 * whichever rule that piece makes it (the bottom 6 of 6x/6 carried up divides
 * the numbers: x, as cancelling does). Null if none can be shown.
 */
export function planDemo(
  state: MathState,
  rules: readonly RuleId[],
  rule: RuleId,
  W: number,
  H: number,
  good: (s: MathState) => boolean = () => true,
  /** The piece to carry, when the words say which (see Carry in game/generate/moves.ts). */
  prefer: (state: MathState, id: string) => boolean = () => false,
): Demo | null {
  const steps = stepsFrom(state, rules).filter((st) => st.ways.some((w) => w.candidate.rule === rule));
  // Heading for the goal first, then with the named piece, then by the lesson's own move.
  const rank = (st: Step, w: Way) => (good(st.state) ? 0 : 4) + (prefer(state, w.id) ? 0 : 2) + (w.candidate.rule === rule ? 0 : 1);
  const ways = steps
    .flatMap((st) => st.ways.map((w) => ({ w, r: rank(st, w) })))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.w);
  // A tap is shown as a tap (its rule is one), never as some drag that happens to give the same.
  if (RULES[rule].tap || RULES[rule].tapsToo) {
    const t = ways.find((w) => w.tap);
    return t ? { kind: "tap", id: t.id, next: t.candidate.state } : null;
  }
  return dragOf(state, rules, W, H, ways);
}

/**
 * How to show the next step of a board, one that `lands` likes (the state
 * the board then shows, tidied: see game/showWay.ts), as the lessons' words
 * put such steps: a tap first — the +, − or · between two pieces ("tap the −
 * to work it out"), then a piece ("tap the fraction bar") — else a drag, a
 * quick press before one held. Null if none can be shown.
 */
export function planStepTo(state: MathState, rules: readonly RuleId[], W: number, H: number, lands: (s: MathState) => boolean, opTaps = true): Demo | null {
  // (`opTaps` false: not by tapping a +, − or ·, as where none is drawn: √x·x shows no ·.)
  for (const id of opTaps ? handles(state) : []) {
    const next = operatorTap(state, id, rules);
    if (next && lands(next)) return { kind: "op-tap", id, next };
  }
  const ways = stepsFrom(state, rules)
    .filter((st) => lands(st.state))
    .flatMap((st) => st.ways);
  // The smallest piece whose tap makes it, as a hand would tap it: the 0 of 0(x + 4), not the whole product.
  const size = (id: string) => state.sides.map((e) => allNodes(e).find((n) => n.id === id)).find(Boolean);
  const tap = ways.filter((w) => w.tap).sort((a, b) => allNodes(size(a.id)!).length - allNodes(size(b.id)!).length)[0];
  if (tap) return { kind: "tap", id: tap.id, next: tap.candidate.state };
  const moves = movesFor(state, rules);
  return dragOf(state, rules, W, H, [...ways.filter((w) => moves.pressable(w.id)), ...ways.filter((w) => !moves.pressable(w.id))]);
}

/** The first of `ways` (in order) a hand can make by dragging: where to press, and where to let go. */
function dragOf(state: MathState, rules: readonly RuleId[], W: number, H: number, ways: readonly Way[]): Demo | null {
  const moves = movesFor(state, rules);
  const h = harness(state, rules, W, H);
  for (const { id, tap, candidate: c } of ways) {
    if (tap) continue;
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
