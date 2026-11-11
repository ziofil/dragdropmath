/**
 * Every single move from an expression, with a chapter's moves: for writing
 * guided examples, whose steps must each be exactly one move.
 *
 *   npx tsx scripts/moves.ts <chapterId> "<expression>" ["<expression>" ...]
 */
import { parseState } from "../src/expr/parse";
import { printState } from "../src/expr/key";
import { CHAPTERS, rulesFor } from "../src/game/puzzles";
import { candidatesFor, handles, isGrabbable, tapFor } from "../src/rules";

const [id, ...srcs] = process.argv.slice(2);
const ci = CHAPTERS.findIndex((c) => c.id === id);
if (ci < 0) throw new Error(`no chapter ${id}`);
const rules = rulesFor(ci);
for (const src of srcs) {
  const s = parseState(src);
  console.log(`${src}:`);
  const seen = new Set<string>();
  for (const h of handles(s).filter((x) => isGrabbable(s, x, rules))) {
    const tap = tapFor(s, h, rules);
    for (const c of [...candidatesFor(s, h, rules), ...(tap ? [tap] : [])]) {
      const line = `  [${c.rule}] ${printState(c.state)}`;
      if (!seen.has(line)) console.log(line), seen.add(line);
    }
  }
}
