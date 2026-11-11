/**
 * How hard each exercise is: the fewest moves it takes with the chapter's
 * moves (tidying after each, as in the app). "null" = not solvable within
 * the search limit.
 *
 *   npx tsx scripts/rate.ts <chapterId>            the chapter's exercises
 *   npx tsx scripts/rate.ts <chapterId> drafts.json  candidates: [{ start, goal, via? }]
 */
import { readFileSync } from "node:fs";
import { parseState } from "../src/expr/parse";
import { CHAPTERS, rulesFor } from "../src/game/puzzles";
import { solutionVia } from "../src/game/solver";

const id = process.argv[2];
const ci = CHAPTERS.findIndex((c) => c.id === id);
if (ci < 0) throw new Error(`no chapter ${id}: ${CHAPTERS.map((c) => c.id).join(", ")}`);
const rules = rulesFor(ci);
const items: { id?: string; start: string; goal: string; via?: string[] }[] = process.argv[3]
  ? JSON.parse(readFileSync(process.argv[3], "utf8"))
  : CHAPTERS[ci].puzzles;

const opts = { maxDepth: 12, maxStates: 120_000 };
for (const p of items) {
  try {
    // With checkpoints (via): the moves of that way, checkpoint to checkpoint.
    const way = solutionVia(parseState(p.start), parseState(p.goal), (p.via ?? []).map(parseState), rules, opts);
    const moves = way ? way.length - 1 : null;
    console.log(`${String(moves).padStart(4)}  ${(p.id ?? "").padEnd(4)} ${p.start}  →  ${p.goal}`);
  } catch (e) {
    console.log(`ERR  ${p.start}: ${String(e).slice(0, 100)}`);
  }
}
