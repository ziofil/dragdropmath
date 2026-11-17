// Rearranging formulas: every real formula, rearranged for every quantity it offers, and every pair combined,
// can be done with the chapter's moves (as served: the engine finds the way), and is right.
import { describe, expect, it } from "vitest";
import { FORMULA_BANK } from "./chapters/formulas";
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
});
