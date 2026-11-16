/**
 * The learning path: chapters as a graph, each pointing to the chapters
 * that build on it. It's a suggested order, never a lock.
 */
import { CHAPTERS, type Chapter } from "./puzzles";

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
 * path.test.ts). Expressions first, then equations, which use them all.
 */
const COLS = 4;
const PLACES: Record<string, [col: number, row: number]> = {
  shuffle: [1.5, 0],
  collect: [1.5, 1],
  powers: [1.5, 2],
  distribute: [1.5, 3],
  brackets: [1.5, 4],
  factor: [1.5, 5],
  fractions: [1.5, 6],
  roots: [1.5, 7],
  explog: [1.5, 8],
  balance: [1.5, 9],
  inequalities: [0.5, 10],
  formulas: [2.5, 10],
  simultaneous: [2.5, 11],
  quadratic: [2.5, 12],
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
