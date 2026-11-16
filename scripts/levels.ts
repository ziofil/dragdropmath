/**
 * How far apart a chapter's levels are, and how varied each is: 12
 * exercises per level as the app makes them, each solved by the move engine.
 * Prints the range of moves, how many different shapes the starts have (the
 * start with every number written # and every letter v), how many different
 * moves the solutions take, and a few examples.
 *
 *   npx tsx scripts/levels.ts [chapterId] [--json]
 */
import { CHAPTERS, rulesFor } from "../src/game/puzzles";
import { LEVELS, PRACTICE, practiceExercise } from "../src/game/generate/practice";
import { verify } from "../src/game/generate/verify";
import { stepsFrom, type RuleId } from "../src/rules";
import { tidied } from "../src/game/tidy";
import { stateKey } from "../src/expr/key";
import type { MathState } from "../src/expr/types";

const args = process.argv.slice(2);
const json = args.includes("--json");
const only = args.find((a) => !a.startsWith("--"));
const N = Number(args.find((a) => a.startsWith("--n="))?.slice(4) ?? 12);
/** --walks: only the shapes built by walking (to see whether a chapter's walks alone are as varied). */
if (args.includes("--walks")) for (const lv of Object.values(PRACTICE)) for (const l of LEVELS) lv[l] = lv[l].filter((s) => s.id.startsWith("walk"));

/** The move that takes `a` to `b` (as tidied), if one does. */
function ruleOf(a: MathState, b: MathState, rules: readonly RuleId[]): RuleId | null {
  const k = stateKey(b, false);
  for (const st of stepsFrom(a, rules)) if (stateKey(tidied(a, st.state), false) === k) return st.ways[0].candidate.rule;
  return null;
}

const skeleton = (s: string) => s.replace(/\d+/g, "#").replace(/\b[a-df-z]\b/g, "v");

const out: Record<string, Record<string, unknown>> = {};
for (const [ci, c] of CHAPTERS.entries()) {
  if (only && c.id !== only) continue;
  const rules = rulesFor(ci);
  const line: string[] = [];
  const ex: string[] = [];
  out[c.id] = {};
  const which: Record<string, string[]> = {};
  for (const l of LEVELS) {
    const m: number[] = [];
    const shapes = new Set<string>();
    const used = new Set<string>();
    let failed = 0;
    for (let s = 1; s <= N; s++) {
      const d = practiceExercise(c.id, l, s * 104729);
      if (!d) {
        failed++;
        continue;
      }
      shapes.add(skeleton(d.start));
      const v = verify(d, rules);
      if ("stuck" in v) {
        failed++;
        m.push(-1);
      } else {
        m.push(v.path.length - 1);
        for (let i = 1; i < v.path.length; i++) {
          const r = ruleOf(v.path[i - 1], v.path[i], rules);
          if (r) used.add(r);
        }
      }
      if (s <= 3) ex.push(`    ${l.padEnd(6)} ${d.start}  →  ${d.goal}  (${m[m.length - 1]})`);
    }
    m.sort((a, b) => a - b);
    const med = m[Math.floor(m.length / 2)];
    which[l] = [...used].sort();
    out[c.id][l] = { min: m[0], median: med, max: m[m.length - 1], shapes: shapes.size, moves: used.size, failed };
    line.push(`${l} ${m[0]}–${m[m.length - 1]} (median ${med}) shapes ${shapes.size}/${N} moves ${used.size}${failed ? ` FAILED ${failed}` : ""}`);
  }
  if (!json) {
    console.log(`${c.id.padEnd(13)} ${line.join(" | ")}`);
    if (args.includes("--which")) console.log(JSON.stringify(which));
    console.log(ex.join("\n"));
  }
}
if (json) console.log(JSON.stringify(out, null, 1));
