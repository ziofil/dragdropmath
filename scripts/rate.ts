/**
 * How hard each exercise is: the moves it takes with the chapter's moves,
 * checkpoint to checkpoint (`via`), the fewest on each leg. "null" = not
 * solvable within the search limit.
 *
 *   npx tsx scripts/rate.ts <chapterId>              one exercise of each practice shape, at every level
 *   npx tsx scripts/rate.ts <chapterId> drafts.json  candidates: [{ start, goal, via? }]
 */
import { readFileSync } from "node:fs";
import { parseState } from "../src/expr/parse";
import type { MathState } from "../src/expr/types";
import { chapterById, rulesOf } from "../src/game/puzzles";
import { solution } from "../src/game/solver";
import { LEVELS, nicest, PRACTICE } from "../src/game/generate/practice";
import { rng } from "../src/game/generate/write";

const id = process.argv[2];
if (!chapterById(id)) throw new Error(`no chapter ${id}`);
const rules = rulesOf(id);
type Item = { id?: string; start: string; goal: string; via?: string[] };
const items: Item[] = process.argv[3]
  ? JSON.parse(readFileSync(process.argv[3], "utf8"))
  : LEVELS.flatMap((level) =>
      (PRACTICE[id]?.[level] ?? []).flatMap((shape) => {
        const d = nicest(shape, rng(1));
        return d ? [{ id: `${level}/${shape.id}`, start: d.start, goal: d.goal, via: d.via }] : [];
      }),
    );

const opts = { ordered: false as const, maxDepth: 12, maxStates: 120_000 };
/** Moves from start to goal through the checkpoints in order, or null. */
function movesVia(start: MathState, via: MathState[], goal: MathState): number | null {
  let n = 0;
  let at = start;
  for (const stop of [...via, goal]) {
    const leg = solution(at, stop, rules, opts);
    if (!leg) return null;
    n += leg.length - 1;
    at = leg[leg.length - 1];
  }
  return n;
}

for (const p of items) {
  try {
    const moves = movesVia(parseState(p.start), (p.via ?? []).map(parseState), parseState(p.goal));
    console.log(`${String(moves).padStart(4)}  ${(p.id ?? "").padEnd(28)} ${p.start}  →  ${p.goal}`);
  } catch (e) {
    console.log(`ERR  ${p.start}: ${String(e).slice(0, 100)}`);
  }
}
