import { describe, expect, it } from "vitest";
import { dragSpecToBehavior, Vec2 } from "dragology";
import { stateKey } from "../expr/key";
import { LIFT, thumbLift } from "./drag/lift";
import { harness } from "./testing/harness";

/** Drag `text` in `src` along a hand-like path to `by`, with or without the lift; what's dropped at each frame. */
function drops(src: string, text: string, by: Vec2, lift: boolean | undefined) {
  const h = harness(src);
  const g = h.grab(text);
  const spec = h.rc(g.id).interact!.drag(g.id);
  const run = dragSpecToBehavior(lift === undefined ? spec : spec.with(thumbLift(lift)), h.ctxFor(g.id, g.anchor));
  return Array.from({ length: 31 }, (_, i) => stateKey(run({ pointer: g.start.add(by.mul(i / 30)) }).dropState, "exact"));
}

describe("touch drags carry the piece above the finger", () => {
  const src = "x + 3 = 7";
  it("lifted, the piece rides 64px above the finger and lands the move it's shown over", () => {
    const across = Vec2(260, LIFT);
    expect(drops(src, "3", across, true).at(-1)).toBe(drops(src, "3", Vec2(260, 0), undefined).at(-1));
    const h = harness(src);
    const g = h.grab("3");
    const spec = h.rc(g.id).interact!.drag(g.id);
    const lifted = dragSpecToBehavior(spec.with(thumbLift(true)), h.ctxFor(g.id, g.anchor));
    const plain = dragSpecToBehavior(spec, h.ctxFor(g.id, g.anchor));
    for (let i = 0; i <= 30; i++) lifted({ pointer: g.start.add(across.mul(i / 30)) });
    const finger = g.start.add(across);
    const shown = lifted({ pointer: finger }).grabPos!;
    expect(shown.y).toBeCloseTo(plain({ pointer: finger.add(Vec2(0, -LIFT)) }).grabPos!.y, 0);
    expect(finger.y - shown.y).toBeGreaterThan(LIFT / 2);
  });
  it("a tiny wiggle doesn't move anything", () => {
    expect(drops(src, "3", Vec2(3, 3), true).at(-1)).toBe(drops(src, "3", Vec2(0, 0), undefined).at(-1));
  });
  it("with a mouse it does nothing", () => {
    expect(drops(src, "3", Vec2(260, 30), false)).toEqual(drops(src, "3", Vec2(260, 30), undefined));
  });
});
