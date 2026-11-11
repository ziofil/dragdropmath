import { describe, expect, it } from "vitest";
import { CHAPTERS } from "./puzzles";
import { layoutPath, suggested } from "./path";

describe("the learning path", () => {
  it("each chapter builds only on chapters that come before it", () => {
    // So the numbering (and the moves available in each chapter) follows the path.
    CHAPTERS.forEach((c, i) => {
      for (const id of c.after) {
        const j = CHAPTERS.findIndex((p) => p.id === id);
        expect(j, `${c.id} builds on ${id}`).toBeGreaterThanOrEqual(0);
        expect(j, `${c.id} builds on ${id}`).toBeLessThan(i);
      }
    });
  });

  it("starts from one chapter, and every arrow points down a row", () => {
    const { nodes, widths, edges } = layoutPath();
    expect(nodes.filter((n) => n.layer === 0).map((n) => n.chapter.id)).toEqual(["shuffle"]);
    for (const e of edges) {
      expect(e.to.layer).toBeGreaterThan(e.from.layer);
      // A long arrow has a lane on every row it skips.
      expect(e.via.map((v) => v.layer)).toEqual(Array.from({ length: e.to.layer - e.from.layer - 1 }, (_, i) => e.from.layer + 1 + i));
    }
    // No two things share a place.
    const places = [...nodes, ...edges.flatMap((e) => e.via)].map((p) => `${p.layer}:${p.slot}`);
    expect(new Set(places).size).toBe(places.length);
    for (const p of places) expect(Number(p.split(":")[1])).toBeLessThan(widths[Number(p.split(":")[0])]);
  });

  it("suggests the first chapter, then what the mastered ones open up", () => {
    expect(suggested(new Set()).map((c) => c.id)).toEqual(["shuffle"]);
    const solved = new Set(CHAPTERS.slice(0, 2).flatMap((c) => c.puzzles.map((p) => p.id)));
    expect(suggested(solved).map((c) => c.id)).toEqual(["distribute"]);
  });
});
