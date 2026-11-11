import { describe, expect, it } from "vitest";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { evaluate, variables } from "../expr/eval";
import { allNodes } from "../expr/tree";
import { ALL_RULES, candidatesFor, handles, isGrabbable, RULES, signId, signOwner, tapFor, type RuleId } from ".";

/** Apply one rule to one node (found by its printed form) and print the results. */
/** `nodeText` names a node by its printed form; "sign:…" means that node's minus-sign handle. */
function results(src: string, rule: RuleId, nodeText: string, occurrence = 0): string[] {
  const state = parseState(src);
  const sign = nodeText.startsWith("sign:");
  const text = sign ? nodeText.slice(5) : nodeText;
  const nodes = state.sides.flatMap(allNodes).filter((n) => printState({ sides: [n] }) === text);
  const node = nodes[occurrence];
  if (!node) throw new Error(`No node "${text}" in ${src}`);
  return RULES[rule].apply(state, sign ? signId(node.id) : node.id).map((c) => printState(c.state));
}

describe("rules do what they say", () => {
  it.each<[string, RuleId, string, string[], number?]>([
    ["a + b + c", "commute", "a", ["b + a + c", "b + c + a"]],
    ["3x + 2x", "combine", "2*x", ["5*x"]],
    ["a + b - a", "combine", "-a", ["b"]],
    ["3ln(x) - ln(x)", "combine", "ln(x)", ["2*ln(x)"], 1], // holding just the ln(x) of −ln(x)…
    ["3ln(x) - ln(x)", "combine", "ln(x)", ["2*ln(x)"], 0], // …or of 3ln(x)
    ["10 - 3", "combine", "-3", ["7"]],
    ["2·x·5", "multiply-numbers", "5", ["10*x"]],
    ["x·x", "merge-powers", "x", ["x^2"], 1], // the one shortcut: x·x is x²
    ["x·x^2", "merge-powers", "x", ["x^(1 + 2)"]], // otherwise the sum shows first
    ["a(b + c)", "distribute", "a", ["a*b + a*c"]],
    ["2(x - 1)", "distribute", "2", ["2*x - 2*1"]],
    ["x^2 + 3x", "power-to-product", "2", ["x*x + 3*x"]], // a square is something times itself
    ["(x + 2)^2", "power-to-product", "2", ["(x + 2)*(x + 2)"], 1], // the exponent (the first 2 is in the brackets)
    ["x^3", "power-to-product", "3", ["x*x*x"]],
    ["2^3", "power-to-product", "3", []], // numbers are worked out instead
    ["x·x + 2x + 3x + 6", "factor-shared", "x", ["x*(x + 2) + 3*x + 6", "x*(x + 3) + 2*x + 6"]], // the first x, onto 2x or 3x
    ["x(x + 2) + 3x + 3·2", "factor-shared", "3", ["x*(x + 2) + 3*(x + 2)"]],
    ["x·x - 3x + 1", "factor-shared", "x", ["x*(x - 3) + 1"]],
    ["2x + 6 + y", "split-number", "6", ["2*x + 2*3 + y"]],
    ["x - 6", "split-number", "6", ["x - 2*3"]],
    ["x = 6", "split-number", "6", []], // alone on a side: nothing to share it with
    ["-(x - 4)", "distribute-neg", "sign:-(x - 4)", ["-x + 4"]], // carry just the −…
    ["-(x - 4)", "distribute-neg", "-(x - 4)", []], // …not the whole thing
    ["ab + ac", "factor-out", "a", ["a*(b + c)"]],
    ["xy + x", "factor-out", "x", ["x*(y + 1)"]],
    ["xy + z", "factor-out", "x", []],
    ["x + 3 = 10", "move-term", "3", ["x = 10 - 3"]],
    ["x - 5 = 2", "move-term", "-5", ["x = 2 + 5"]],
    ["2x = 8", "move-factor", "2", ["x = 8/2"]],
    ["xy = 8", "move-factor", "x", []], // never divide by something that might be 0
    ["x/3 = 4", "move-denominator", "3", ["x = 4*3"]],
    ["-x = 6", "move-sign", "sign:-x", ["x = -6"]], // carry just the −…
    ["-x = 6", "move-sign", "-x", []], // …not the whole −x
    ["8/2", "divide-numbers", "2", ["4"]],
    ["6/4", "divide-numbers", "4", ["3/2"]],
    ["6x/3", "divide-numbers", "3", ["2*x"]],
    ["ab/b", "cancel-factor", "b", ["a"], 1],
    ["(2·3)/(2·5)", "cancel-factor", "2", ["3/5"], 0], // top 2 onto bottom 2…
    ["(2·3)/(2·5)", "cancel-factor", "2", ["3/5"], 1], // …or bottom onto top
    ["ab/b", "cancel-factor", "b", ["a"], 0],
    ["1/6", "split-number", "6", ["1/(2*3)"]],
    ["1/2 + 1/3", "expand-fraction", "3", ["(1*3)/(2*3) + 1/3"]], // copies of the 3, top and bottom
    ["1/2 + 1/3", "expand-fraction", "2", ["1/2 + (1*2)/(3*2)"]],
    ["2 + 1/3", "expand-fraction", "3", ["(2*3)/3 + 1/3"]], // a whole number becomes a fraction
    ["1/5 + 2/5", "add-fractions", "2/5", ["(1 + 2)/5"]],
    ["1/5 - 2/5", "add-fractions", "1/5", ["(1 - 2)/5"]],
    ["1/6 + 1/6", "combine", "1/6", []], // fractions add as fractions, not as "like terms"
    ["(x + 2)/2", "split-fraction", "2", ["x/2 + 2/2"]],
    ["(x + 2)/2", "split-fraction", "x", ["x/2 + 2/2"]],
    ["(x/3)·(6/x)", "multiply-fractions", "6/x", ["(x*6)/(3*x)"]],
    ["2·(3/4)", "multiply-fractions", "2", ["(2*3)/4"]],
    ["(1/2)/(3/4)", "divide-by-fraction", "3/4", ["(1/2)*(4/3)"]],
    ["√9", "evaluate-power", "1/2", []], // no jump: √9 is worked out step by step…
    ["√9", "split-square", "9", ["√(3*3)"]], // …starting with 9 → 3·3
    ["root_3(8)", "split-square", "8", ["root_3(2*2*2)"]],
    ["x^1", "power-one", "1", ["x"]],
    ["3^1", "evaluate-power", "1", ["3"]],
    ["x^(1/2)", "root-notation", "x^(1/2)", ["√(x)"]],
    ["√x", "root-notation", "√(x)", ["x^(1/2)"]],
    ["√(4x)", "pull-out-of-power", "1/2", []], // not by dropping the √ onto the brackets…
    ["√(4x)", "power-of-product", "1/2", []], // …a √ is split by pulling a factor out
    ["(3·3)^(1/2)", "power-of-product", "1/2", ["3^(1/2)*3^(1/2)"]], // but a visible exponent can go in
    ["(2x)^3", "power-of-product", "3", ["2^3*x^3"]],
    ["(x^2·y)^3", "power-of-product", "3", ["x^(2*3)*y^3"]],
    ["√12", "split-square", "12", ["√(4*3)"]],
    ["√(4x)", "pull-out-of-power", "4", ["√(4)*√(x)"]], // pull the 4 out…
    ["√(4x)", "pull-out-of-power", "x", ["√(4)*√(x)"]], // …or the x
    ["(2x)^3", "pull-out-of-power", "2", ["2^3*x^3"]],
    ["(x^2·y)^3", "pull-out-of-power", "y", ["x^(2*3)*y^3"]],
    ["√x·√x", "merge-powers", "√(x)", ["x"], 1], // a root times itself: what's inside
    ["√x·x^(1/2)", "merge-powers", "√(x)", ["x^(1/2 + 1/2)"]], // otherwise exponents add (fractions in exponents)
    ["√(x^2)", "power-of-power", "1/2", ["x^(2*(1/2))"]],
    ["√x = 3", "root-across", "1/2", ["x = 3^2"]],
    ["x^(1/2) = 3", "root-across", "1/2", ["x = 3^2"]],
    ["x = 3^2", "root-across", "2", ["x^(1/2) = 3"]], // and back again
    ["x^2 = 9", "root-across", "2", []], // not when it could lose x = −3
    ["√x = -3", "root-across", "1/2", []], // no solution: squaring would invent x = 9 (QA #4)
    ["x^(1/2) = y", "root-across", "1/2", []], // y might be negative
    ["-x = 0", "move-sign", "sign:-x", ["x = 0"]], // the − is absorbed by the 0 (QA #5)
    ["ln(√x)", "log-of-power", "1/2", ["(1/2)*ln(x)"]],
    ["1/2", "flip-across-bar", "2", []], // numbers don't flip into 2⁻¹
    ["(1/2)·ln(x)", "multiply-fractions", "1/2", []], // a number on a log goes into it…
    ["(1/2)·ln(x)", "power-into-log", "1/2", ["ln(x^(1/2))"]], // …like this
    ["(x^2)^3", "power-of-power", "3", ["x^(2*3)"]],
    ["(x^2/y)^3", "pull-out-of-power", "y", ["x^(2*3)/y^3"]], // a fraction under a power splits too
    ["x^0 + 4", "zero-power", "0", ["1 + 4"]],
    ["2^3", "evaluate-power", "3", ["8"]],
    ["x^5/x^2", "divide-powers", "x^2", ["x^(5 - 2)"]],
    ["1/x^3", "flip-across-bar", "x^3", ["x^(-3)"]],
    ["x^-2·x^5", "merge-powers", "x^5", ["x^(-2 + 5)"]],
    ["x^2·x^3", "merge-powers", "x^2", ["x^(2 + 3)"]], // order kept whichever is carried
    ["x·2", "numbers-first", "x*2", ["2*x"]], // tap the product (a press on a factor falls through to it)
    ["x·2", "numbers-first", "x", []], // factors don't offer it themselves (QA #7)
    ["x·2 + 3", "numbers-first", "x*2", ["2*x + 3"]],
    ["2x", "numbers-first", "2*x", []], // already tidy
    ["x^2·x^3", "merge-powers", "x^3", ["x^(2 + 3)"]],
    ["ln(e^x)", "log-of-power", "x", ["x*ln(e)"]], // ln(eˣ) → x·ln(e) → x·1 → x
    ["x·ln(e)", "evaluate-log", "ln(e)", ["x*1"]],
    ["e^(ln(x))", "exp-of-log", "e", ["x"]],
    ["ln(2x)", "log-of-product", "ln(2*x)", []], // not by touching the ln…
    ["ln(2x)", "log-of-product", "2", ["ln(2) + ln(x)"]], // …but by pulling a factor out
    ["ln(2x)", "log-of-product", "x", ["ln(2) + ln(x)"]],
    ["ln(x/y)", "log-of-product", "y", ["ln(x) - ln(y)"]],
    ["ln(x/y)", "log-of-product", "x", ["ln(x) - ln(y)"]],
    ["ln(x^3)", "log-of-power", "3", ["3*ln(x)"]],
    ["3ln(x)", "power-into-log", "3", ["ln(x^3)"]],
    ["ln(a) + ln(b)", "combine-logs", "ln(b)", ["ln(a*b)"]],
    ["ln(a) + ln(b)", "combine-logs", "ln(a)", ["ln(a*b)"]], // order kept whichever one is carried
    ["ln(a) - ln(b)", "combine-logs", "-ln(b)", ["ln(a/b)"]],
    ["ln(12) - ln(3)", "combine-logs", "ln(12)", ["ln(12/3)"]], // either one can be carried
    ["-ln(a) - ln(b)", "combine-logs", "-ln(b)", ["-ln(a*b)"]],
    ["log_2(8)", "evaluate-log", "log_2(8)", []], // no shortcut: tap 8 → 2³ first
    ["log_2(8)", "power-of-base", "8", ["log_2(2^3)"]],
    ["log_2(2)", "evaluate-log", "log_2(2)", ["1"]],
    ["3log_2(2)", "evaluate-log", "log_2(2)", ["3*1"]], // the 1 stays for the learner to simplify
    ["ln(1)", "evaluate-log", "ln(1)", ["0"]],
    ["ln(e)", "evaluate-log", "ln(e)", ["1"]],
    ["e^x = 5", "exp-across", "e", ["x = ln(5)"]],
    ["ln(x) = 2", "log-across", "ln(x)", ["x = e^2"]],
    ["ln(x) = 2", "log-across", "e", ["x = e^2"]], // carried by its "ln" label (the base e)
    ["x + 3 = 10", "move-term", "3", ["x = 10 - 3"]],
  ])("%s  [%s on %s]", (src, rule, node, expected, occurrence = 0) => {
    expect(results(src, rule, node, occurrence)).toEqual(expected);
  });
});

// Soundness: no rule may ever change what an expression means.
const CORPUS = [
  "a + b + c",
  "x + 4 + x",
  "1/2 + 1/3 + 2",
  "1/5 - 2/5 + (x + 2)/2",
  "(x/3)·(6/x) + 2·(3/4)",
  "(1/2)/(3/4) + 1/6",
  "x/2 = 3/4",
  "(2·3)/(2·5) + (x·y)/(y·z)",
  "√(4x) + √12 + √x·√x",
  "√(x^2) + (√x)^4 + ln(√x)",
  "√x = 3",
  "x = 3^2",
  "x - (y + 1) = 3",
  "(x - 2)/2 + (3 - y)/4",
  "-x = 0",
  "root_3(8) + x^(1/2)",
  "x·2 + y·3·z",
  "3x + 2x - x",
  "2·x·5 + 1",
  "x·x·x + x^2",
  "a(b + c) + d(b - c)",
  "-(x - 4) + 2(x + 3)",
  "ab + ac - a",
  "xy + x + 2xy",
  "6x/3 + 8/2",
  "ab/b + 4/6",
  "(x + 1)(x - 1)",
  "x + 3 = 10",
  "2(x + 1) = 10",
  "5x - 2 = 3x + 6",
  "x/3 = 4 - x",
  "-x = 6",
  "-x = -6",
  "3 - (x - 4)",
  "3x/6 = 2/4",
  "(x^2)^3·x + (2y)^2",
  "x^5/x^2 + x^0",
  "1/x^3 + x^-2·x^5",
  "2^3 + log_2(8)",
  "log_2(2^3) + log_3(9) + ln(1)",
  "ln(e^x) + e^(ln(y))",
  "ln(2x) - ln(x/y) + ln(x^3)",
  "3ln(x) + ln(y) - ln(x)",
  "e^x = 5",
  "ln(x) = 2",
  "e^(2x) = 7 + x",
];

function randomEnv(state: MathState, seed: number) {
  const names = [...new Set(state.sides.flatMap(variables))];
  return Object.fromEntries(names.map((n, i) => [n, ((seed * 7919 + i * 104729) % 1000) / 97 + 0.31]));
}

/** For an equation, its meaning is the solution set of lhs − rhs = 0; rewriting may scale lhs − rhs by a nonzero constant. */
function residual(s: MathState, env: Record<string, number>) {
  return s.sides.length === 1 ? evaluate(s.sides[0], env) : evaluate(s.sides[0], env) - evaluate(s.sides[1], env);
}

describe("every rule is sound", () => {
  it.each(CORPUS)("%s", (src) => {
    const state = parseState(src);
    for (const h of handles(state)) {
      for (const cand of [...candidatesFor(state, h, ALL_RULES), tapFor(state, h, ALL_RULES)].filter((c) => c !== null)) {
        const ratios = [1, 2, 3, 4].map((seed) => {
          const env = randomEnv(state, seed);
          return residual(cand.state, env) / residual(state, env);
        });
        const label = `${cand.rule}: ${src}  ⟶  ${printState(cand.state)}`;
        if (state.sides.length === 1) {
          ratios.forEach((r) => expect(r, label).toBeCloseTo(1, 9));
        } else {
          // Same solutions: lhs − rhs keeps its sign everywhere (up to one overall flip).
          // Linear moves scale it by a constant; ln/e^ of both sides are increasing.
          ratios.forEach((r) => expect(Number.isFinite(r) && Math.sign(r) === Math.sign(ratios[0]) && r !== 0, `${label} (ratio ${r})`).toBe(true));
        }
      }
    }
  });

  it("every result has unique ids (Dragology requires it)", () => {
    for (const src of CORPUS) {
      const state = parseState(src);
      for (const h of handles(state)) {
        for (const cand of candidatesFor(state, h, ALL_RULES)) {
          const ids = cand.state.sides.flatMap(allNodes).map((n) => n.id);
          const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
          expect(dupes, `${cand.rule}: ${src} ⟶ ${printState(cand.state)}`).toEqual([]);
        }
      }
    }
  });

  it("targets of drop-zone candidates exist in the current state", () => {
    for (const src of CORPUS) {
      const state = parseState(src);
      const ids = new Set(state.sides.flatMap(allNodes).map((n) => n.id));
      for (const h of handles(state)) {
        for (const cand of candidatesFor(state, h, ALL_RULES)) {
          if (cand.targetId) {
            expect(ids.has(cand.targetId), `${cand.rule} in ${src}`).toBe(true);
          } else {
            // Non-target moves must keep the dragged node, so the drag engine can follow it.
            const after = new Set(cand.state.sides.flatMap(allNodes).map((n) => n.id));
            expect(after.has(signOwner(h) ?? h), `${cand.rule} in ${src} keeps dragged node`).toBe(true);
          }
        }
      }
    }
  });
});

describe("what a press picks up", () => {
  /** Printed forms of every node that can be grabbed by itself. */
  const grabbable = (src: string, puzzleRules: RuleId[]) => {
    const state = parseState(src);
    return state.sides
      .flatMap(allNodes)
      .filter((n) => isGrabbable(state, n.id, puzzleRules))
      .map((n) => printState({ sides: [n] }));
  };
  const SHUFFLE: RuleId[] = ["commute", "combine", "multiply-numbers"];

  it.each<[string, RuleId[], string[]]>([
    // 2 and x can only swap with each other, so they hand the press to their term.
    ["3x + 2x", SHUFFLE, ["3*x", "2*x"]],
    // The 2 can multiply into the 3, so it's its own handle; the y isn't.
    ["3·y·2 + 1 + x", SHUFFLE, ["3*y*2", "3", "2", "1", "x"]],
    // The 2 can cross the =; each whole side can too (swapping the sides).
    ["2x = 8", ALL_RULES, ["2*x", "2", "8"]],
    // QA #7: in x·2 (from distributing), the 2 can only swap places, so a press picks up the term.
    ["x·x + x·2 - 2x", ["commute", "combine", "multiply-numbers", "numbers-first", "merge-powers"], ["x*x", "x", "x", "x*2", "-2*x"]],
    // With factoring unlocked, a common factor is its own handle.
    ["ab + ac", ALL_RULES, ["a*b", "a", "a*c", "a"]],
  ])("%s", (src, rules, expected) => {
    expect(grabbable(src, rules)).toEqual(expected);
  });
});

describe("ln(eˣ) step by step", () => {
  it("ln(eˣ) → x·ln(e) → x·1 → x, one visible step at a time", () => {
    const step = (state: MathState, rule: RuleId, text: string) => {
      const node = state.sides.flatMap(allNodes).find((n) => printState({ sides: [n] }) === text);
      expect(node, `${text} in ${printState(state)}`).toBeDefined();
      const [c] = RULES[rule].apply(state, node!.id);
      expect(c, `${rule} on ${text}`).toBeDefined();
      return c.state;
    };
    let s = parseState("ln(e^x)");
    s = step(s, "log-of-power", "x");
    expect(printState(s)).toBe("x*ln(e)");
    s = step(s, "evaluate-log", "ln(e)");
    expect(printState(s)).toBe("x*1");
    s = step(s, "times-one", "1");
    expect(printState(s)).toBe("x");
  });
});

describe("√9 step by step", () => {
  const find = (state: MathState, text: string, occ = 0) => {
    const n = state.sides.flatMap(allNodes).filter((m) => printState({ sides: [m] }) === text)[occ];
    expect(n, `${text} in ${printState(state)}`).toBeDefined();
    return n!.id;
  };
  const step = (state: MathState, rule: RuleId, text: string, occ = 0) => {
    const [c] = RULES[rule].apply(state, find(state, text, occ));
    expect(c, `${rule} on ${text} in ${printState(state)}`).toBeDefined();
    return c.state;
  };

  it("√9 → √(3·3) → √3·√3 → 3 (a root dropped on the same root gives what's inside)", () => {
    let s = parseState("√9");
    s = step(s, "split-square", "9");
    expect(printState(s)).toBe("√(3*3)");
    s = step(s, "pull-out-of-power", "3");
    expect(printState(s)).toBe("√(3)*√(3)");
    s = step(s, "merge-powers", "√(3)", 1);
    expect(printState(s)).toBe("3");
  });

  it("written as powers, the exponents add: 3^(1/2)·3^(1/2) → 3^(1/2 + 1/2) → 3^((1 + 1)/2) → 3^(2/2) → 3^1 → 3", () => {
    let s = parseState("3^(1/2)·3^(1/2)");
    s = step(s, "merge-powers", "3^(1/2)", 1);
    expect(printState(s)).toBe("3^(1/2 + 1/2)");
    s = step(s, "add-fractions", "1/2", 1);
    expect(printState(s)).toBe("3^((1 + 1)/2)");
    s = step(s, "combine", "1", 1);
    expect(printState(s)).toBe("3^(2/2)");
    s = step(s, "divide-numbers", "2", 1);
    expect(printState(s)).toBe("3^1");
    s = step(s, "power-one", "1");
    expect(printState(s)).toBe("3");
  });
});

describe("QA regressions", () => {
  it("an explicit ·1 is not moved across = (exercise 4.7: 2·1 = 10 − 2x)", () => {
    let s = parseState("2(x + 1) = 10");
    const two = s.sides.flatMap(allNodes).find((n) => n.kind === "num" && n.value === 2)!;
    s = RULES["distribute"].apply(s, two.id)[0].state;
    const term = (s.sides[0] as { terms: { id: string }[] }).terms[0];
    s = RULES["move-term"].apply(s, term.id)[0].state;
    expect(printState(s)).toBe("2*1 = 10 - 2*x");
    const one = s.sides.flatMap(allNodes).find((n) => n.kind === "num" && n.value === 1)!;
    expect(RULES["move-factor"].apply(s, one.id)).toEqual([]);
  });

  it("tapping x·1 tidies it to x, not 1x", () => {
    // Made the way a learner would: ln(e) → 1, kept visible.
    const tidy = (src: string, logId: (s: ReturnType<typeof parseState>) => string) => {
      let s = parseState(src);
      s = RULES["evaluate-log"].apply(s, logId(s))[0].state; // ln(e) → 1, kept visible
      const P = s.sides.flatMap(allNodes).find((n) => n.kind === "prod")!;
      return RULES["numbers-first"].apply(s, P.id).map((c) => printState(c.state));
    };
    const lnE = (s: ReturnType<typeof parseState>) => s.sides.flatMap(allNodes).find((n) => n.kind === "log")!.id;
    expect(tidy("x·ln(e)", lnE)).toEqual(["x"]);
    expect(tidy("ln(e)·x", lnE)).toEqual(["x"]);
    expect(tidy("x·2·ln(e)", lnE)).toEqual(["2*x"]);
  });
});

describe("inequalities", () => {
  /** Every result of dragging the piece printed `text` (or its minus, "sign:…"), through the real move list. */
  const moves = (src: string, text: string) => {
    const state = parseState(src);
    const sign = text.startsWith("sign:");
    const t = sign ? text.slice(5) : text;
    const node = state.sides.flatMap(allNodes).find((n) => printState({ sides: [n] }) === t)!;
    return candidatesFor(state, sign ? signId(node.id) : node.id, ALL_RULES).map((c) => printState(c.state));
  };

  it.each([
    // Adding, subtracting, dividing by a positive number: the sign stays as it is.
    ["x + 3 < 10", "3", "x < 10 - 3"],
    ["2x ≥ 8", "2", "x ≥ 8/2"],
    ["x/3 > 2", "3", "x > 2*3"],
    // Multiplying both sides by −1: it turns round.
    ["-x < 4", "sign:-x", "x > -4"],
    ["-x ≤ -6", "sign:-x", "x ≥ 6"],
    ["-x > 0", "sign:-x", "x < 0"],
    ["4 ≥ -x", "sign:-x", "-4 ≤ x"],
    // An equation stays an equation.
    ["-x = 4", "sign:-x", "x = -4"],
  ])("%s: carrying %s across gives %s", (src, what, expected) => {
    expect(moves(src, what)).toContain(expected);
  });

  it("moves that don't cross keep the relation", () => {
    expect(moves("3x + 2x < 10", "2*x")).toContain("5*x < 10");
    expect(moves("2(x + 1) ≥ 4", "2")).toContain("2*x + 2*1 ≥ 4");
  });
});
