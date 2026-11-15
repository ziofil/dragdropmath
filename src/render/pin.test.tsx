// What a move keeps in place stays in place, and nothing runs into anything: a pinned piece
// moves its whole row (both sides and the relation), in a system too, and a carried piece
// completes its merge on the canvas. And a + keeps its place in the drawing as terms move,
// so it slides instead of fading out and in.
import { describe, expect, it } from "vitest";
import { renderStateReadOnly } from "dragology";
import { ALL_RULES } from "../rules";
import { checkMergesAnimate } from "./testing/checks";
import { harness, show } from "./testing/harness";

describe("pieces stay put and stay apart", () => {
  it("multiplying out keeps the x in place, in one equation or the first of two", () => {
    expect(checkMergesAnimate("2(x - 3) = y", ALL_RULES)).toEqual([]);
    expect(checkMergesAnimate("2(x - 3) = y; x + y = 7", ALL_RULES)).toEqual([]);
  });

  it("a pinned side never runs through the = and the other side", () => {
    const h = harness("(x + 4)(x - 1) = 0");
    const piece = h.find("x + 4");
    const c = h.candidates(piece.id).find((k) => k.rule === "distribute")!;
    const g = h.grab(piece.id);
    const end = g.path(g.start.add(h.endsUpOffset(piece.id, c.targetId!, c.rule)), 24).at(-1)!;
    const eq = end.glyphs().find((d) => d.text === "=")!.x;
    const past = end.glyphs().filter((d) => d.opacity > 0.5 && d.layer !== "rel" && d.x > eq && d.text !== "0");
    expect(past.map((d) => `${d.text}@${d.x.toFixed(0)}`)).toEqual([]);
  });

  it("a wide bracket carried onto its number stays on the canvas", () => {
    expect(checkMergesAnimate("2(3(x + 1) + 4) = 50", ALL_RULES)).toEqual([]);
  });

  it("the + in front of a term keeps its place in the drawing when terms reorder", () => {
    const h = harness("3 + x + 4");
    const four = h.find("4");
    const re = h.candidates(four.id).find((c) => show(c.state) === "3 + 4 + x")!;
    const pathOf = (state: typeof h.state, key: string) => {
      let found: string | null = null;
      const walk = (e: unknown) => {
        if (!e || typeof e !== "object") return;
        if (Array.isArray(e)) return e.forEach(walk);
        const p = (e as { props?: Record<string, unknown> }).props;
        if (!p) return;
        if (p.dragologyKey === key) found = p["data-path"] as string;
        walk(p.children);
      };
      for (const [, l] of renderStateReadOnly(h.ctxFor(four.id), state).byId) walk(l.element);
      return found;
    };
    expect(pathOf(re.state, `plus-${four.id}`)).toBe(pathOf(h.state, `plus-${four.id}`));
  });
});
