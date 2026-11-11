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

  it("is laid out cleanly: arrows point down, never cross, never run through a chapter", () => {
    const { nodes, edges, cols } = layoutPath();
    expect(nodes.filter((n) => n.row === 0).map((n) => n.chapter.id)).toEqual(["shuffle"]);
    // No two chapters share a place, and all fit.
    const places = nodes.map((n) => `${n.col}:${n.row}`);
    expect(new Set(places).size).toBe(places.length);
    for (const n of nodes) expect(n.col >= 0 && n.col <= cols - 1, n.chapter.id).toBe(true);
    // Numbered in reading order: row by row, left to right.
    const read = [...nodes].sort((a, b) => a.row - b.row || a.col - b.col);
    expect(read.map((n) => n.index)).toEqual(nodes.map((n) => n.index));
    // Geometry in row units (a row is about as tall as a column is wide on a phone).
    const pt = (n: { col: number; row: number }) => ({ x: n.col, y: n.row });
    for (const e of edges) {
      expect(e.to.row, `${e.from.chapter.id} → ${e.to.chapter.id}`).toBeGreaterThan(e.from.row);
      const a = pt(e.from);
      const b = pt(e.to);
      for (const n of nodes) {
        if (n === e.from || n === e.to) continue;
        expect(distToSegment(pt(n), a, b), `${e.from.chapter.id} → ${e.to.chapter.id} runs through ${n.chapter.id}`).toBeGreaterThan(0.4);
      }
    }
    for (const e of edges)
      for (const f of edges) {
        if (e === f || e.from === f.from || e.to === f.to || e.to === f.from || e.from === f.to) continue;
        expect(crosses(pt(e.from), pt(e.to), pt(f.from), pt(f.to)), `${e.from.chapter.id} → ${e.to.chapter.id} crosses ${f.from.chapter.id} → ${f.to.chapter.id}`).toBe(false);
      }
  });

  it("suggests the first chapter, then what the mastered ones open up", () => {
    expect(suggested(new Set()).map((c) => c.id)).toEqual(["shuffle"]);
    const solved = new Set(CHAPTERS.slice(0, 2).flatMap((c) => c.puzzles.map((p) => p.id)));
    expect(suggested(solved).map((c) => c.id)).toEqual(["distribute"]);
  });
});

type P = { x: number; y: number };
function distToSegment(p: P, a: P, b: P): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}
function crosses(a: P, b: P, c: P, d: P): boolean {
  const side = (p: P, q: P, r: P) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
  return side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0;
}
