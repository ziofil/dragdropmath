import { describe, expect, it } from "vitest";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { allNodes } from "../expr/tree";
import { ALL_RULES, candidatesFor, tapFor, type RuleId } from "../rules";
import { tidySteps } from "./tidy";

/** Make one move (rule `rule`, on the node printed `text`), then print the move and the tidying after it. */
function after(src: string, rule: RuleId, text: string, nth = 0) {
  const before = parseState(src);
  const node = before.sides.flatMap(allNodes).filter((n) => printState({ sides: [n] }) === text)[nth];
  if (!node) throw new Error(`no ${text} in ${src}`);
  const tap = tapFor(before, node.id, ALL_RULES);
  const move = [...candidatesFor(before, node.id, ALL_RULES), ...(tap ? [tap] : [])].find((c) => c.rule === rule);
  if (!move) throw new Error(`no ${rule} for ${text} in ${src}`);
  return [printState(move.state), ...tidySteps(before, move.state).map(printState)];
}

describe("tidying after a move", () => {
  it("writes what the move made the usual way: numbers in front, no ·1, no ¹", () => {
    // The bracket multiplied into is held a moment, then let go (Sum.grouped).
    expect(after("x(x + 2)", "distribute", "x")).toEqual(["(x*x + x*2)", "x*x + x*2", "x*x + 2*x"]);
    expect(after("(x + 3)(x - 3)", "distribute", "x + 3")).toEqual(["((x + 3)*x - (x + 3)*3)", "(x + 3)*x - (x + 3)*3", "(x + 3)*x - 3*(x + 3)"]);
    expect(after("x^(3 - 2)", "combine", "-2")).toEqual(["x^1", "x"]);
  });

  it("does no arithmetic: 2·3 waits for a tap, 1 + 2 for a drag", () => {
    expect(after("2(x + 3)", "distribute", "2")).toEqual(["(2*x + 2*3)", "2*x + 2*3"]);
    expect(after("1/5 + 2/5", "add-fractions", "1/5")).toEqual(["(1 + 2)/5"]);
  });

  it("leaves alone what the move didn't make", () => {
    expect(after("x·2 + 3 + 4", "combine", "4")).toEqual(["x*2 + 7"]);
  });

  it("lets a bracket go after a plus, keeps it after a minus or as a factor", () => {
    expect(after("1 + 2(x + 3)", "distribute", "2")).toEqual(["1 + (2*x + 2*3)", "1 + 2*x + 2*3"]);
    expect(after("1 - 2(x + 3)", "distribute", "2")).toEqual(["1 - (2*x + 2*3)"]);
    expect(after("5*2(x + 3)", "distribute", "2")).toEqual(["5*(2*x + 2*3)"]);
  });

  it("never undoes the move", () => {
    // The tap wrote x² as x·x: tidying doesn't write it back.
    expect(after("x^2 + 3x", "power-to-product", "2")).toEqual(["x*x + 3*x"]);
  });
});
