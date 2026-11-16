/**
 * Try a chapter's shapes: a few exercises of each, checked with the move
 * engine, with how many moves each takes and how long the check took.
 *
 *   npx tsx scripts/generate.ts <chapter> [perShape=4]
 */
import { CHAPTERS, lettersPositive, rulesFor } from "../src/game/puzzles";
import { SHAPES } from "../src/game/generate/served";
import { LEVELS, rng } from "../src/game/generate/write";
import { judge } from "../src/game/generate/beauty";
import { verify } from "../src/game/generate/verify";

const chapterId = process.argv[2];
const perShape = Number(process.argv[3] ?? 4);
const ci = CHAPTERS.findIndex((c) => c.id === chapterId);
if (ci < 0 || !SHAPES[chapterId]) throw new Error(`no chapter "${chapterId}"`);
const rules = rulesFor(ci);
const positive = lettersPositive(CHAPTERS[ci]);
for (const level of LEVELS) {
  for (const shape of SHAPES[chapterId][level]) {
    let n = 0;
    for (let seed = 1; n < perShape && seed < 5000; seed++) {
      const d = shape.make(rng(seed * 7919));
      if (!d) continue;
      const v = judge(d);
      if (!v.ok) continue;
      n++;
      const t = performance.now();
      const check = verify(d, rules, positive);
      const ms = Math.round(performance.now() - t);
      const result = check.moves === null ? `STUCK at ${check.stuck}` : `${check.moves} moves`;
      console.log(`${level.padEnd(6)} ${shape.id.padEnd(20)} ${d.start}  →  ${d.goal}   ${result}  (${ms}ms, score ${Math.round(v.score)})`);
    }
    if (n < perShape) console.log(`${level.padEnd(6)} ${shape.id.padEnd(20)} only ${n} passed the beauty rules`);
  }
}
