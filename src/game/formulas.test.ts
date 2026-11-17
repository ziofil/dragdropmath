// Rearranging formulas: every real formula, rearranged for every quantity it offers, and every pair combined,
// can be done with the chapter's moves (as served: the engine finds the way), and is right.
import { describe, expect, it } from "vitest";
import { FORMULA_BANK, UNITS } from "./chapters/formulas";
import { variables } from "../expr/eval";
import { en } from "../i18n";
import { rulesOf } from "./puzzles";
import { verify } from "./generate/verify";
import { follows } from "./answers";
import { parseState } from "../expr/parse";
import { assuming } from "../expr/setting";

const rules = rulesOf("formulas");
const cases = [
  ...FORMULA_BANK.formulas.flatMap((f) => f.goals.map((g) => [f.start, g, f.via?.[g] ?? []] as const)),
  ...FORMULA_BANK.pairs.map((p) => [p.start, p.goal, p.via ?? []] as const),
];

describe("rearranging formulas", () => {
  it.each(cases)("%s → %s", { timeout: 60_000 }, (start, goal, via) => {
    expect(follows(assuming(parseState(start), true), parseState(goal)), "the goal is right").toBe(true);
    const checked = verify({ start, goal, via: [...via], positive: true }, rules);
    expect("path" in checked ? "ok" : checked.stuck).toBe("ok");
  });

  // Said on screen: what each letter stands for, and its unit. Every letter of every formula has a meaning, and
  // every meaning a name.
  it("says what every letter stands for", () => {
    for (const f of [...FORMULA_BANK.formulas, ...FORMULA_BANK.pairs]) {
      const letters = parseState(f.start).sides.flatMap(variables);
      for (const l of letters) expect(f.means[l], `${f.start}: ${l}`).toBeDefined();
      for (const q of Object.values(f.means)) {
        expect(en.quantities[q], q).toBeTruthy();
        expect(UNITS[q], q).toBeTruthy();
      }
    }
  });
});
