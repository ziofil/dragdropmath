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
  /** Column, 0 to COLS − 1 (halves sit between two columns). */
  col: number;
  /** Row, from the top. */
  row: number;
};

export type PathLayout = {
  nodes: PathNode[];
  cols: number;
  rows: number;
  /** Each arrow, from a chapter to one that builds on it. */
  edges: { from: PathNode; to: PathNode }[];
};

/**
 * Where each chapter sits, by hand: the graph is small, and a hand layout
 * keeps arrows from crossing or running through a chapter (checked in
 * path.test.ts). Expressions on the left, equations on the right.
 */
const COLS = 4;
const PLACES: Record<string, [col: number, row: number]> = {
  shuffle: [1.5, 0],
  collect: [1.5, 1],
  distribute: [1.5, 2],
  brackets: [0.5, 3],
  balance: [2.5, 3],
  powers: [0, 4],
  factor: [1, 4],
  formulas: [2, 4],
  inequalities: [3, 4],
  fractions: [2, 5],
  simultaneous: [3, 5],
  roots: [1.5, 6],
  explog: [1.5, 7],
};

export function layoutPath(chapters: readonly Chapter[] = CHAPTERS): PathLayout {
  const nodes: PathNode[] = chapters.map((chapter, index) => {
    const place = PLACES[chapter.id];
    if (!place) throw new Error(`No place on the path for chapter ${chapter.id}: add it to PLACES in path.ts`);
    return { chapter, index, col: place[0], row: place[1] };
  });
  const node = new Map(nodes.map((n) => [n.chapter.id, n]));
  return {
    nodes,
    cols: COLS,
    rows: Math.max(...nodes.map((n) => n.row)) + 1,
    edges: nodes.flatMap((to) => to.chapter.after.map((id) => ({ from: node.get(id)!, to }))),
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
