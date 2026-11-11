/**
 * How hard each exercise is: the fewest moves it takes, with the chapter's
 * moves, and with everything on the way to it automated (as for a learner
 * who has mastered it all). "null" = not solvable within the search limit.
 *
 *   npx tsx scripts/rate.ts <chapterId>            the chapter's exercises
 *   npx tsx scripts/rate.ts <chapterId> drafts.json  candidates: [{ start, goal }]
 */
import { readFileSync } from "node:fs";
import { parseState } from "../src/expr/parse";
import { CHAPTERS, rulesFor, routinesFor } from "../src/game/puzzles";
import { fewestMoves } from "../src/game/solver";

const id = process.argv[2];
const ci = CHAPTERS.findIndex((c) => c.id === id);
if (ci < 0) throw new Error(`no chapter ${id}: ${CHAPTERS.map((c) => c.id).join(", ")}`);
const rules = rulesFor(ci);
const routines = routinesFor(ci, () => true);
const items: { id?: string; start: string; goal: string }[] = process.argv[3]
  ? JSON.parse(readFileSync(process.argv[3], "utf8"))
  : CHAPTERS[ci].puzzles;

const opts = { maxDepth: 12, maxStates: 80_000 };
for (const p of items) {
  try {
    const plain = fewestMoves(parseState(p.start), parseState(p.goal), rules, opts);
    const auto = fewestMoves(parseState(p.start), parseState(p.goal), rules, { ...opts, routines });
    console.log(`${String(plain).padStart(4)} ${String(auto).padStart(4)}  ${(p.id ?? "").padEnd(4)} ${p.start}  →  ${p.goal}`);
  } catch (e) {
    console.log(`ERR  ${p.start}: ${String(e).slice(0, 100)}`);
  }
}
