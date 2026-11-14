/**
 * How far apart a chapter's levels are: 8 exercises per level as the app
 * makes them, each solved by the move engine; prints the range of moves and
 * a few examples.  npx tsx scripts/levels.ts [chapterId]
 */
import { CHAPTERS, lettersPositive, rulesFor } from "../src/game/puzzles";
import { LEVELS, practiceExercise } from "../src/game/generate/practice";
import { verify } from "../src/game/generate/verify";
const only = process.argv[2];
for (const [ci, c] of CHAPTERS.entries()) {
  if (only && c.id !== only) continue;
  const rules = rulesFor(ci), pos = lettersPositive(c);
  const line: string[] = [];
  const ex: string[] = [];
  for (const l of LEVELS) {
    const m: number[] = [];
    for (let s = 1; s <= 8; s++) {
      const d = practiceExercise(c.id, l, s * 104729)!;
      const v = verify(d, rules, pos);
      m.push(v.moves ?? -1);
      if (s <= 3) ex.push(`    ${l.padEnd(6)} ${d.start}  →  ${d.goal}  (${v.moves})`);
    }
    m.sort((a, b) => a - b);
    line.push(`${l} ${m[0]}–${m[m.length - 1]} (median ${m[4]})`);
  }
  console.log(`${c.id.padEnd(13)} ${line.join(" | ")}`);
  console.log(ex.join("\n"));
}
