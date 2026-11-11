import { describe, expect, it } from "vitest";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { allNodes } from "../expr/tree";
import { ALL_RULES, candidatesFor, tapFor, type RuleId } from "../rules";
import { autoSteps, ROUTINES, type Routine } from "./auto";

/** Make one move (rule `rule`, on the node printed `text`), then print what automation does after it. */
function after(src: string, rule: RuleId, text: string, routines: Routine[], nth = 0) {
  const before = parseState(src);
  const node = before.sides.flatMap(allNodes).filter((n) => printState({ sides: [n] }) === text)[nth];
  if (!node) throw new Error(`no ${text} in ${src}`);
  const tap = tapFor(before, node.id, ALL_RULES);
  const move = [...candidatesFor(before, node.id, ALL_RULES), ...(tap ? [tap] : [])].find((c) => c.rule === rule);
  if (!move) throw new Error(`no ${rule} for ${text} in ${src}`);
  return [printState(move.state), ...autoSteps(before, move.state, routines).map((s) => printState(s.state))];
}

describe("steps done for you", () => {
  it("finishes the arithmetic a move leaves behind", () => {
    expect(after("x + 3 = 10", "move-term", "3", [ROUTINES.arithmetic])).toEqual(["x = 10 - 3", "x = 7"]);
    expect(after("2(x + 3)", "distribute", "2", [ROUTINES.arithmetic])).toEqual(["2*x + 2*3", "2*x + 6"]);
  });

  it("keeps going while there's more to finish, one step at a time", () => {
    expect(after("1/5 + 2/5 + x", "add-fractions", "1/5", [ROUTINES.arithmetic])).toEqual(["(1 + 2)/5 + x", "3/5 + x"]);
    expect(after("x^2·x^3", "merge-powers", "x^2", [ROUTINES.arithmetic])).toEqual(["x^(2 + 3)", "x^5"]);
  });

  it("only what's mastered: like terms are left alone with just arithmetic", () => {
    expect(after("x^2 + 2x + 3x", "power-to-product", "2", [ROUTINES.arithmetic])).toEqual(["x*x + 2*x + 3*x"]);
  });

  it("leaves alone what the move didn't touch", () => {
    // Factoring in pairs needs 2x + 3x kept apart, even with like terms automated.
    const [, ...auto] = after("x^2 + 2x + 3x + 6", "power-to-product", "2", [ROUTINES.likeTerms, ROUTINES.arithmetic]);
    expect(auto).toEqual([]);
  });

  it("never undoes the move: a number split apart isn't multiplied straight back", () => {
    expect(after("2x + 6", "split-number", "6", [ROUTINES.arithmetic])).toEqual(["2*x + 2*3"]);
    // ...nor x·x turned straight back into x².
    expect(after("x^2 + 3x", "power-to-product", "2", [ROUTINES.squares])).toEqual(["x*x + 3*x"]);
  });

  it("x·x = x² once distributing is mastered, but adding exponents waits for the powers chapter", () => {
    expect(after("x(x + 2)", "distribute", "x", [ROUTINES.squares])).toEqual(["x*x + x*2", "x^2 + x*2"]);
    expect(after("x(x^2 + 2)", "distribute", "x", [ROUTINES.squares])).toEqual(["x*x^2 + x*2"]);
  });

  it("divisions only when they come out whole", () => {
    expect(after("2x = 8", "move-factor", "2", [ROUTINES.wholeDivision])).toEqual(["x = 8/2", "x = 4"]);
    expect(after("2x = 3", "move-factor", "2", [ROUTINES.wholeDivision])).toEqual(["x = 3/2"]);
  });

  it("drops a ·1 left by distributing", () => {
    expect(after("(x + 4)(x - 1)", "distribute", "x + 4", [ROUTINES.timesOne])).toEqual(["(x + 4)*x - (x + 4)*1", "(x + 4)*x - (x + 4)"]);
  });
});
