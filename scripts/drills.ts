// Try out the move drills: npx tsx scripts/drills.ts [chapter]
import { DRILLS, drillExercise } from "../src/game/generate/moves";
const only = process.argv[2];
for (const [ch, drills] of Object.entries(DRILLS)) {
  if (only && ch !== only) continue;
  for (const dr of drills) {
    const out = [11, 222, 3333, 44444].map((s) => drillExercise(ch, dr.id, s * 7919)).map((x) => (x ? `${x.start}  →  ${x.goal}` : "NONE"));
    console.log(`${ch}/${dr.id}:\n   ${out.join("\n   ")}`);
  }
}
