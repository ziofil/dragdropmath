/**
 * The learning path: chapters as a graph, each pointing to the chapters
 * that build on it. It's a suggestion of where to go next, never a lock.
 */
import { CHAPTERS, type Chapter } from "./puzzles";
import { isMastered } from "./scoring";

export type PathNode = {
  chapter: Chapter;
  /** Position in CHAPTERS (its number is this + 1). */
  index: number;
  /** Row: one more than the deepest chapter it builds on. */
  layer: number;
  /** Place within its row, from the left. */
  slot: number;
};

/** A lane an arrow passes through on a row it skips (so it never runs through a chapter). */
export type Via = { layer: number; slot: number };

type Cell = { node: PathNode } | { via: Via; parents: Cell[] };

export type PathLayout = {
  nodes: PathNode[];
  /** How many places each row has (chapters and passing arrows). */
  widths: number[];
  /** Each arrow: where it starts, the lanes it passes through, where it ends. */
  edges: { from: PathNode; to: PathNode; via: Via[] }[];
};

/**
 * Rows of chapters, each below everything it builds on. An arrow that skips
 * rows gets a lane of its own in each, and each row is ordered by where what
 * feeds it sits, to keep arrows from crossing.
 */
export function layoutPath(chapters: readonly Chapter[] = CHAPTERS): PathLayout {
  const byId = new Map(chapters.map((c) => [c.id, c]));
  const layerOf = new Map<string, number>();
  const layer = (c: Chapter): number => {
    const known = layerOf.get(c.id);
    if (known !== undefined) return known;
    const l = c.after.length === 0 ? 0 : 1 + Math.max(...c.after.map((id) => layer(byId.get(id)!)));
    layerOf.set(c.id, l);
    return l;
  };
  const nodes: PathNode[] = chapters.map((chapter, index) => ({ chapter, index, layer: layer(chapter), slot: 0 }));
  const node = new Map(nodes.map((n) => [n.chapter.id, n]));
  const rows: Cell[][] = [];
  const cellOf = new Map<PathNode, Cell>();
  for (const n of nodes) {
    const cell = { node: n };
    cellOf.set(n, cell);
    (rows[n.layer] ??= []).push(cell);
  }
  // Long arrows: one lane per skipped row, each fed by the one above.
  const edges: { from: PathNode; to: PathNode; lanes: Extract<Cell, { via: Via }>[] }[] = [];
  const parentsOf = new Map<Cell, Cell[]>();
  for (const to of nodes) {
    const parents: Cell[] = [];
    for (const id of to.chapter.after) {
      const from = node.get(id)!;
      let above: Cell = cellOf.get(from)!;
      const lanes: Extract<Cell, { via: Via }>[] = [];
      for (let l = from.layer + 1; l < to.layer; l++) {
        const lane = { via: { layer: l, slot: 0 }, parents: [above] };
        rows[l].push(lane);
        lanes.push(lane);
        above = lane;
      }
      parents.push(above);
      edges.push({ from, to, lanes });
    }
    parentsOf.set(cellOf.get(to)!, parents);
  }
  const slotOf = (c: Cell) => ("node" in c ? c.node.slot : c.via.slot);
  const layerOfCell = (c: Cell) => ("node" in c ? c.node.layer : c.via.layer);
  const setSlot = (c: Cell, i: number) => ("node" in c ? (c.node.slot = i) : (c.via.slot = i));
  const order = (c: Cell) => ("node" in c ? c.node.index : Infinity);
  for (const row of rows) {
    const centre = (c: Cell) => {
      const ps = "node" in c ? parentsOf.get(c)! : c.parents;
      return ps.length ? ps.reduce((s, p) => s + (slotOf(p) + 1) / (rows[layerOfCell(p)].length + 1), 0) / ps.length : 0;
    };
    row.sort((a, b) => centre(a) - centre(b) || order(a) - order(b));
    row.forEach((c, i) => setSlot(c, i));
  }
  return {
    nodes,
    widths: rows.map((r) => r.length),
    edges: edges.map(({ from, to, lanes }) => ({ from, to, via: lanes.map((l) => l.via) })),
  };
}

/**
 * Where to go next: chapters not yet mastered whose groundwork is (all
 * mastered: none). In chapter order.
 */
export function suggested(solved: ReadonlySet<string>, chapters: readonly Chapter[] = CHAPTERS): Chapter[] {
  const done = new Set(chapters.filter((c) => isMastered(c, solved)).map((c) => c.id));
  return chapters.filter((c) => !done.has(c.id) && c.after.every((id) => done.has(id)));
}
