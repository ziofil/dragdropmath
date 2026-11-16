import { describe, expect, it } from "vitest";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { rulesOf } from "../game/puzzles";
import { evaluate, variables } from "../expr/eval";
import { allNodes } from "../expr/tree";
import { ALL_RULES, candidatesFor, handles, isGrabbable, isPressable, operatorTap, RULES, signId, signOwner, tapFor, type RuleId } from ".";

/** Apply one rule to one node (found by its printed form) and print the results. */
/**
 * `nodeText` names a node by its printed form; "sign:…" means that node's minus-sign handle.
 * A `src` ending "(letters > 0)": its letters stand for positive numbers (as in the powers, roots and logs chapters).
 */
function results(src: string, rule: RuleId, nodeText: string, occurrence = 0): string[] {
  const positive = src.endsWith(" (letters > 0)");
  const parsed = parseState(positive ? src.slice(0, -" (letters > 0)".length) : src);
  const state: MathState = positive ? { ...parsed, letters: "positive" } : parsed;
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
    ["3ln(x) - ln(x)", "combine", "-ln(x)", ["2*ln(x)"]], // whole terms, either onto the other
    ["3ln(x) - ln(x)", "combine", "3*ln(x)", ["2*ln(x)"]],
    ["2·3 + 4", "combine", "4", []], // 2·3 is worked out first, not hidden in the sum
    ["10 - 3", "combine", "-3", ["7"]],
    ["2·x·5", "multiply-numbers", "5", ["10*x"]],
    ["x·x", "merge-powers", "x", ["x^2"], 1], // the one shortcut: x·x is x²
    ["x·x^2", "merge-powers", "x", ["x^(1 + 2)"]], // otherwise the sum shows first
    ["a(b + c)", "distribute", "a", ["(a*b + a*c)"]],
    ["2(x - 1)", "distribute", "2", ["(2*x - 2*1)"]],
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
    ["9x + 3y", "factor-out", "3", ["3*(3*x + y)"]], // a number out of a number it divides, as by hand
    ["6 + 3x", "factor-out", "3", ["3*(2 + x)"]],
    ["5x + 3y", "factor-out", "3", []],
    ["x + 3 = 10", "move-term", "3", ["x = 10 - 3"]],
    ["x - 5 = 2", "move-term", "-5", ["x = 2 + 5"]],
    ["2x = 8", "move-factor", "2", ["x = 8/2"]],
    ["xy = 8", "move-factor", "x", []], // never divide by something that might be 0
    ["x/3 = 4", "move-denominator", "3", ["x = 4*3"]],
    ["x + 2 = -6", "move-term", "-6", ["x + 2 + 6 = 0"]], // a term alone on its side is a term too
    ["x/3 + 1 = 5", "move-denominator", "3", ["x + 1*3 = 5*3"]], // every term on its side is multiplied
    ["1 - x/3 = 5 - x", "move-denominator", "3", ["1*3 - x = (5 - x)*3"]],
    ["x/3 = y/2 + 1", "move-denominator", "2", ["(x/3)*2 = y + 1*2"]],
    ["x/(2·3) = 4", "move-denominator", "3", ["x/2 = 4*3"]], // one factor of a bottom
    ["2x/3 = 4", "move-factor", "2", ["x/3 = 4/2"]], // a factor on top of a side's fraction
    ["2x + 1 = 7", "move-factor", "2", []], // not on a side of several terms: a press there picks up 2x
    ["-x = 6", "move-sign", "sign:-x", ["x = -6"]], // carry just the −…
    ["-x = 6", "move-sign", "-x", []], // …not the whole −x
    // Simplifying is a tap on the bar.
    ["8/2", "divide-numbers", "8/2", ["4"]],
    ["6/4", "divide-numbers", "6/4", ["3/2"]],
    ["6x/3", "divide-numbers", "(6*x)/3", ["2*x"]],
    ["ab/b", "cancel-factor", "(a*b)/b", ["a"]],
    ["(2·3)/(2·5)", "cancel-factor", "(2*3)/(2*5)", ["3/5"]],
    ["(x + 1)/(2(x + 1))", "cancel-factor", "(x + 1)/(2*(x + 1))", ["1/2"]],
    // A fraction is read with what multiplies it, and its bottom may have letters too.
    ["3·(x/3)", "cancel-factor", "x/3", ["x"]], // what multiplies the fraction counts as its top
    ["6x/(3y)", "divide-numbers", "(6*x)/(3*y)", ["(2*x)/y"]],
    // A power of a common factor comes out of a higher power.
    ["x^3 + x^2", "factor-out", "x^2", ["x^2*(x + 1)"]],
    ["x^3 + x^2", "factor-out", "x", ["x*(x^2 + x)"]],
    ["1/6", "split-number", "6", ["1/(2*3)"]],
    // A bottom's factor dropped onto another term multiplies its top and bottom (copies of the 3).
    ["1/2 + 1/3", "expand-fraction", "3", ["(1*3)/(2*3) + 1/3"]],
    ["1/2 + 1/3", "expand-fraction", "2", ["1/2 + (1*2)/(3*2)"]],
    ["2 + 1/3", "expand-fraction", "3", ["(2*3)/3 + 1/3"]], // a whole number becomes a fraction
    // A root dropped onto its own top: top and bottom times it, and the bottom comes out whole.
    ["1/√3", "expand-fraction", "√(3)", ["(1*√(3))/(√(3)*√(3))"]],
    ["x/2", "expand-fraction", "x", []],
    ["1/5 + 2/5", "add-fractions", "2/5", ["(1 + 2)/5"]],
    ["1/5 - 2/5", "add-fractions", "1/5", ["(1 - 2)/5"]],
    ["1/6 + 1/6", "combine", "1/6", []], // fractions add as fractions, not as "like terms"
    ["(x + 2)/2", "split-fraction", "2", ["x/2 + 2/2"]],
    ["(x + 2)/2", "split-fraction", "x", ["x/2 + 2/2"]],
    ["(x/3)·(6/x)", "multiply-fractions", "6/x", ["(x*6)/(3*x)"]],
    ["2·(3/4)", "multiply-fractions", "2", ["(2*3)/4"]],
    // A fraction of fractions: a factor crosses the main bar to where as many bars are over it.
    ["(1/2)/(3/4)", "divide-by-fraction", "4", ["((1*4)/2)/3"]],
    ["6/(3/6)", "divide-by-fraction", "6", ["(6*6)/3"], 1],
    ["(a/b)/(c/d)", "divide-by-fraction", "c", ["(a/(b*c))/(1/d)"]],
    ["√9", "evaluate-power", "1/2", []], // no jump: √9 is worked out step by step…
    ["√9", "split-square", "9", ["√(3*3)"]], // …starting with 9 → 3·3
    ["√9", "evaluate-root", "√(9)", ["3"]], // or tap the root: it comes out whole
    ["root_3(8)", "evaluate-root", "root_3(8)", ["2"]],
    ["√(3·3)", "evaluate-root", "√(3*3)", ["3"]],
    ["√12", "evaluate-root", "√(12)", []], // not whole: split it instead
    ["√x", "evaluate-root", "√(x)", []],
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
    ["√(4x) (letters > 0)", "pull-out-of-power", "4", ["√(4)*√(x)"]], // pull the 4 out…
    ["√(4x) (letters > 0)", "pull-out-of-power", "x", ["√(4)*√(x)"]], // …or the x
    ["√(x·y)", "pull-out-of-power", "x", []], // x and y could both be negative
    ["√(4x)", "pull-out-of-power", "4", ["√(4)*√(x)"]], // a positive number out: under the √, x can't be negative
    ["√(4(3 - x))", "pull-out-of-power", "4", ["√(4)*√(3 - x)"]],
    // The same rule for a log as for a root: where ln(2x) is defined, x > 0.
    ["ln(2x)", "log-of-product", "2", ["ln(2) + ln(x)"]],
    ["ln(x·y)", "log-of-product", "x", []], // x and y could both be negative
    // 16 as a power of the base it's used with (2^(x − 3) = 16), and an exponent split (the way back of adding them).
    ["2^(x - 3) = 16", "power-of-base", "16", ["2^(x - 3) = 2^4"]],
    ["x^2 = 16", "power-of-base", "16", []], // no number base to go with
    ["2^(x - 3) = 16", "split-exponent", "-3", ["2^x*2^(-3) = 16"]],
    ["2^(x + 1)", "split-exponent", "x", ["2^x*2^1"]],
    // A negative exponent with no bar to cross: it goes under one of its own, or works out to one over the power.
    ["2^(-6)", "flip-across-bar", "2^(-6)", ["1/2^6"]],
    ["3x^(-2)", "flip-across-bar", "x^(-2)", ["3/x^2"]],
    ["2^(-6)", "tap-power", "-6", ["1/64"]],
    // A minus in front of a fraction goes into its top or its bottom, flipping every sign there.
    ["-4/(2 - ln(2))", "distribute-neg", "sign:-4/(2 - ln(2))", ["4/(-2 + ln(2))"]],
    ["-(x - 1)/3", "distribute-neg", "sign:-(x - 1)/3", ["(-x + 1)/3"]],
    // Factoring a quadratic: the middle term splits into two whose numbers multiply to first × last.
    ["x^2 + 5x + 6", "split-term", "5*x", ["x^2 + 2*x + 3*x + 6"]],
    ["x^2 - x - 6", "split-term", "-x", ["x^2 + 2*x - 3*x - 6"]],
    ["x^2 + x + 1", "split-term", "x", []], // no whole numbers do it
    // A difference of two squares: tap the minus.
    ["x^2 - 9", "difference-of-squares", "sign:-9", ["(x - 3)*(x + 3)"]],
    ["4x^2 - 25", "difference-of-squares", "sign:-25", ["(2*x - 5)*(2*x + 5)"]],
    ["x^2 - 7", "difference-of-squares", "sign:-7", []], // 7 isn't a square
    // Same exponent: the bases join under it.
    ["√2·√3", "join-powers", "√(3)", ["√(2*3)"]],
    ["x^3·y^3", "join-powers", "y^3", ["(x*y)^3"]],
    ["√x·√y", "join-powers", "√(y)", []], // x and y could both be negative
    // Dividing by something that could be 0 loses answers: never by a factor sharing a letter with the rest of its side.
    ["(x - 2)(x + 3) = 0", "move-letter-factor", "x - 2", []],
    ["x(x - 3) = 0", "move-letter-factor", "x", []],
    ["v - u = a*t", "move-letter-factor", "a", ["(v - u)/a = t"]],
    ["x(a - 2) = b - a", "move-letter-factor", "a - 2", ["x = (b - a)/(a - 2)"]],
    // Both sides powers of the same base: a term of one exponent moves to the other, flipping sign.
    ["2^(x - 3) = 2^4", "move-exponent-term", "-3", ["2^x = 2^(4 + 3)"]],
    ["2^(x - 3) = 3^4", "move-exponent-term", "-3", []], // different bases
    ["(1/2)^(x - 3) < (1/2)^4", "move-exponent-term", "-3", []], // a base below 1 would turn the relation
    ["(2x)^3", "pull-out-of-power", "2", ["2^3*x^3"]], // a whole power splits anyway
    ["(2x)^3", "pull-out-of-power", "2", ["2^3*x^3"]],
    ["(x^2·y)^3", "pull-out-of-power", "y", ["x^(2*3)*y^3"]],
    ["√x·√x", "merge-powers", "√(x)", ["x"], 1], // a root times itself: what's inside
    ["√x·x^(1/2)", "merge-powers", "√(x)", ["x^(1/2 + 1/2)"]], // otherwise exponents add (fractions in exponents)
    ["√(x^2) (letters > 0)", "power-of-power", "1/2", ["x^(2*(1/2))"]],
    ["√(x^2)", "power-of-power", "1/2", []], // √(x²) is |x|, not x
    ["((-3)^2)^(1/2)", "power-of-power", "1/2", []],
    ["√x = 3", "root-across", "1/2", ["x = 3^2"]],
    ["x^(1/2) = 3", "root-across", "1/2", ["x = 3^2"]],
    ["x = 3^2", "root-across", "2", ["x^(1/2) = 3"]], // and back again
    ["x^2 = 9", "root-across", "2", ["x = 9^(1/2) or x = -9^(1/2)"]], // both roots: x could be −3 too
    ["x^2 = -4", "root-across", "2", []], // no square is negative
    ["x^2 = 0", "root-across", "2", ["x = 0"]],
    ["(x - 2)(x + 3) = 0", "zero-product", "x - 2", ["x - 2 = 0 or x + 3 = 0"]], // a product is 0 when a factor is
    ["(x - 2)(x + 3) = 5", "zero-product", "x - 2", []], // only a product equal to 0
    ["3x = 0", "zero-product", "3", []], // a number isn't an answer: move it across
    ["(2^x)^2 = 16", "root-across", "2", ["2^x = 16^(1/2)"], 1], // 2ˣ is never negative: nothing lost (13.30)
    ["(x - 1)^2 = 16", "root-across", "2", ["x - 1 = 16^(1/2) or x - 1 = -16^(1/2)"]], // a whole bracket too
    ["√x = -3", "root-across", "1/2", []], // no solution: squaring would invent x = 9 (QA #4)
    ["x^(1/2) = y", "root-across", "1/2", []], // y might be negative
    ["-x = 0", "move-sign", "sign:-x", ["x = 0"]], // the − is absorbed by the 0 (QA #5)
    ["ln(√x) (letters > 0)", "log-of-power", "1/2", ["(1/2)*ln(x)"]],
    ["ln(x^2) = 4", "log-of-power", "2", []], // would lose x = −e²
    ["1/2", "flip-across-bar", "2", []], // numbers don't flip into 2⁻¹
    ["7/(2/6)", "flip-across-bar", "2/6", []], // nor fractions into (2/6)⁻¹
    ["(1/2)·ln(x)", "multiply-fractions", "1/2", []], // a number on a log goes into it…
    ["(1/2)·ln(x)", "power-into-log", "1/2", ["ln(x^(1/2))"]], // …like this
    ["(x^2)^3", "power-of-power", "3", ["x^(2*3)"]],
    ["(x^2/y)^3", "pull-out-of-power", "y", ["x^(2*3)/y^3"]], // a fraction under a power splits too
    ["x^0 + 4", "zero-power", "0", ["1 + 4"]],
    ["2^3", "evaluate-power", "3", ["8"]],
    ["x^5/x^2", "divide-powers", "x^5/x^2", ["x^(5 - 2)"]],
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
    ["ln(2x) (letters > 0)", "log-of-product", "2", ["ln(2) + ln(x)"]], // …but by pulling a factor out
    ["ln(2x) (letters > 0)", "log-of-product", "x", ["ln(2) + ln(x)"]],
    ["ln(x/y) (letters > 0)", "log-of-product", "y", ["ln(x) - ln(y)"]],
    ["ln(x·y)", "log-of-product", "x", []], // x and y could both be negative
    // 16 as a power of the base it's used with (2^(x − 3) = 16), and an exponent split (the way back of adding them).
    ["2^(x - 3) = 16", "power-of-base", "16", ["2^(x - 3) = 2^4"]],
    ["x^2 = 16", "power-of-base", "16", []], // no number base to go with
    ["2^(x - 3) = 16", "split-exponent", "-3", ["2^x*2^(-3) = 16"]],
    ["2^(x + 1)", "split-exponent", "x", ["2^x*2^1"]],
    // A negative exponent with no bar to cross: it goes under one of its own, or works out to one over the power.
    ["2^(-6)", "flip-across-bar", "2^(-6)", ["1/2^6"]],
    ["3x^(-2)", "flip-across-bar", "x^(-2)", ["3/x^2"]],
    ["2^(-6)", "tap-power", "-6", ["1/64"]],
    // A minus in front of a fraction goes into its top or its bottom, flipping every sign there.
    ["-4/(2 - ln(2))", "distribute-neg", "sign:-4/(2 - ln(2))", ["4/(-2 + ln(2))"]],
    ["-(x - 1)/3", "distribute-neg", "sign:-(x - 1)/3", ["(-x + 1)/3"]],
    // Factoring a quadratic: the middle term splits into two whose numbers multiply to first × last.
    ["x^2 + 5x + 6", "split-term", "5*x", ["x^2 + 2*x + 3*x + 6"]],
    ["x^2 - x - 6", "split-term", "-x", ["x^2 + 2*x - 3*x - 6"]],
    ["x^2 + x + 1", "split-term", "x", []], // no whole numbers do it
    // A difference of two squares: tap the minus.
    ["x^2 - 9", "difference-of-squares", "sign:-9", ["(x - 3)*(x + 3)"]],
    ["4x^2 - 25", "difference-of-squares", "sign:-25", ["(2*x - 5)*(2*x + 5)"]],
    ["x^2 - 7", "difference-of-squares", "sign:-7", []], // 7 isn't a square
    // Same exponent: the bases join under it.
    ["√2·√3", "join-powers", "√(3)", ["√(2*3)"]],
    ["x^3·y^3", "join-powers", "y^3", ["(x*y)^3"]],
    ["√x·√y", "join-powers", "√(y)", []], // x and y could both be negative
    // Dividing by something that could be 0 loses answers: never by a factor sharing a letter with the rest of its side.
    ["(x - 2)(x + 3) = 0", "move-letter-factor", "x - 2", []],
    ["x(x - 3) = 0", "move-letter-factor", "x", []],
    ["v - u = a*t", "move-letter-factor", "a", ["(v - u)/a = t"]],
    ["x(a - 2) = b - a", "move-letter-factor", "a - 2", ["x = (b - a)/(a - 2)"]],
    // Both sides powers of the same base: a term of one exponent moves to the other, flipping sign.
    ["2^(x - 3) = 2^4", "move-exponent-term", "-3", ["2^x = 2^(4 + 3)"]],
    ["2^(x - 3) = 3^4", "move-exponent-term", "-3", []], // different bases
    ["(1/2)^(x - 3) < (1/2)^4", "move-exponent-term", "-3", []], // a base below 1 would turn the relation
    ["ln(x/y) (letters > 0)", "log-of-product", "x", ["ln(x) - ln(y)"]],
    ["(1/3)^x > 9", "exp-across", "1/3", ["x < log_(1/3)(9)"]], // a base below 1 turns the inequality round
    ["2^x = -8", "exp-across", "2", []], // no solution: no log of −8
    ["log_(1/3)(x) > 2", "log-across", "log_(1/3)(x)", ["x < (1/3)^2"]],
    ["y/√x", "flip-across-bar", "√(x)", ["y*x^(-1/2)"]],
    ["6/0", "divide-numbers", "6/0", []],
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
  "x + 2 = -6",
  "x/3 + 1 = 5",
  "1 - x/3 = 5 - x",
  "x/3 = y/2 + 1",
  "x/(2·3) = 4",
  "-2x/3 = 4 + x",
  "x/3 + 1 < 5",
  "P = F/A + c",
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
  /** Printed forms of every node a quick press picks up, and of those a held press does. */
  const picks = (src: string, puzzleRules: RuleId[]) => {
    const state = parseState(src);
    const show = (f: (id: string) => boolean) =>
      state.sides
        .flatMap(allNodes)
        .filter((n) => f(n.id))
        .map((n) => printState({ sides: [n] }));
    return { quick: show((id) => isPressable(state, id, puzzleRules)), held: show((id) => isGrabbable(state, id, puzzleRules)) };
  };
  const SHUFFLE: RuleId[] = ["commute", "combine", "multiply-numbers"];

  it.each<[string, RuleId[], string[], string[]]>([
    // In a sum, a quick press takes the whole term; holding takes a piece with a move of its own.
    ["3x + 2x", SHUFFLE, ["3*x", "2*x"], ["3*x", "2*x"]],
    ["3·y·2 + 1 + x", SHUFFLE, ["3*y*2", "1", "x"], ["3*y*2", "3", "2", "1", "x"]],
    // In no sum, a press takes the piece itself: the 2 can cross the =, each whole side
    // can (swapping the sides), and with formulas' moves so can the x (dividing by a letter).
    ["2x = 8", ALL_RULES, ["2*x", "2", "x", "8"], ["2*x", "2", "x", "8"]],
    ["x·x + x·2 - 2x", ["commute", "combine", "multiply-numbers", "numbers-first", "merge-powers"], ["x*x", "x*2", "-2*x"], ["x*x", "x", "x", "x*2", "-2*x"]],
    // Set apart on screen, a piece is pressed directly: a fraction's bottom, an exponent.
    ["2^((2x + 4)/2 - 5) = 2^4", ALL_RULES, ["2^((2*x + 4)/2 - 5)", "2", "(2*x + 4)/2", "2*x", "4", "2", "-5", "2^4", "2", "4"], ["2^((2*x + 4)/2 - 5)", "2", "(2*x + 4)/2", "2*x", "2", "4", "2", "-5", "2^4", "2", "4"]], // the 2 of 2x comes out of 2x + 4
    // An exponent written as a sum, with a move of its own, is pressed as a whole; its terms by holding.
    ["log_2(2^(x - 3)) = 4", ALL_RULES, ["log_2(2^(x - 3))", "2", "x - 3", "4"], ["log_2(2^(x - 3))", "2", "x - 3", "x", "-3", "4"]],
    // A common factor comes out of its term by holding it (b and c could only swap: nothing to hold them for).
    ["ab + ac", ALL_RULES, ["a*b", "a*c"], ["a*b", "a", "a*c", "a"]],
  ])("%s", (src, rules, quick, held) => {
    expect(picks(src, rules)).toEqual({ quick, held });
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
    s = step(s, "divide-numbers", "2/2");
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

  it("(x²y)³/y: after bringing y up as y⁻¹, the pieces can still be grabbed", () => {
    const ref = { rules: rulesOf("powers") };
    let s = parseState("(x^2·y)^3/y");
    const y = s.sides.flatMap(allNodes).filter((n) => n.kind === "var" && n.name === "y").at(-1)!;
    s = candidatesFor(s, y.id, ref.rules).find((c) => c.rule === "flip-across-bar")!.state;
    expect(printState(s)).toBe("(x^2*y)^3*y^(-1)");
    const grabbed = s.sides.flatMap(allNodes).filter((n) => isGrabbable(s, n.id, ref.rules)).map((n) => printState({ sides: [n] }));
    // y⁻¹ can move next to the y it will meet; x² and y can be pulled out of the brackets.
    expect(grabbed).toEqual(expect.arrayContaining(["y^(-1)", "x^2", "y"]));
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
    expect(moves("2(x + 1) ≥ 4", "2")).toContain("(2*x + 2*1) ≥ 4");
  });
});

describe("tapping a root", () => {
  const tap = (src: string) => {
    const s = parseState(src);
    const root = s.sides.flatMap(allNodes).find((n) => n.kind === "pow")!;
    const c = tapFor(s, root.id, ALL_RULES);
    return c && `${c.rule}: ${printState(c.state)}`;
  };
  it("works it out when it comes out whole, else shows it as a power", () => {
    expect(tap("√9 + x")).toBe("evaluate-root: 3 + x");
    expect(tap("√12 + x")).toBe("root-notation: 12^(1/2) + x");
  });
});

describe("tapping a fraction's bar", () => {
  const tap = (src: string) => {
    const s = parseState(src);
    const f = s.sides.flatMap(allNodes).find((n) => n.kind === "frac")!;
    const c = tapFor(s, f.id, ALL_RULES);
    return c && `${c.rule}: ${printState(c.state)}`;
  };
  it("works it out when it comes out whole, else simplifies it", () => {
    expect(tap("x = 8/2")).toBe("evaluate-fraction: x = 4");
    expect(tap("x = 12/3 + 1")).toBe("evaluate-fraction: x = 4 + 1");
    expect(tap("x = 6/4")).toBe("evaluate-fraction: x = 3/2");
    expect(tap("x = 3/5")).toBeNull();
    expect(tap("x = 6x/3")).toBe("divide-numbers: x = 2*x"); // the bar simplifies what it can
  });
});

describe("tapping the +, − or · between two pieces", () => {
  const tap = (src: string, after: string) => {
    const s = parseState(src);
    const n = s.sides.flatMap(allNodes).find((m) => printState({ sides: [m] }) === after)!;
    const r = operatorTap(s, n.id, ALL_RULES);
    return r && printState(r);
  };
  it("does what dropping one on the other would", () => {
    expect(tap("3 + 4", "4")).toBe("7");
    expect(tap("3x + 2x", "2*x")).toBe("5*x");
    expect(tap("3x - x", "-x")).toBe("2*x");
    expect(tap("1/5 + 2/5", "2/5")).toBe("(1 + 2)/5");
    expect(tap("2·3·x", "3")).toBe("6*x");
    expect(tap("x^2·x^3", "x^3")).toBe("x^(2 + 3)");
    expect(tap("x + 2", "2")).toBeNull();
  });
  it("works a number times a fraction out as one fraction", () => {
    expect(tap("6·(1/12)", "1/12")).toBe("6/12");
    expect(tap("(2/3)·(9/4)", "9/4")).toBe("18/12");
  });
});

describe("tapping a number's exponent", () => {
  const tap = (src: string) => {
    const s = parseState(src);
    const p = s.sides.flatMap(allNodes).find((n) => n.kind === "pow")!;
    const c = tapFor(s, (p as { exp: { id: string } }).exp.id, ALL_RULES);
    return c && `${c.rule}: ${printState(c.state)}`;
  };
  it("works it out when the base is a number, else writes the power out", () => {
    expect(tap("2^3 + x")).toBe("tap-power: 8 + x");
    expect(tap("x = 3^2")).toBe("tap-power: x = 9");
    expect(tap("x^2")).toBe("power-to-product: x*x");
  });
  it("an exponent of 0 or 1 does what dropping it on its base does", () => {
    expect(tap("x^0 + 4")).toBe("zero-power: 1 + 4");
    expect(tap("3x^1")).toBe("power-one: 3*x");
    expect(tap("x^1")).toBe("power-one: x");
  });
});

describe("tapping + or − between two numbers works it out", () => {
  /** Tap the operator in front of the term printed `text`. */
  const tapOp = (src: string, text: string) => {
    const state = parseState(src);
    const term = state.sides.flatMap(allNodes).find((n) => printState({ sides: [n] }) === text)!;
    const next = operatorTap(state, term.id, ["commute", "combine", "multiply-numbers"]);
    return next && printState(next);
  };
  it.each([
    ["3 + 4 + x", "4", "7 + x"],
    ["10 - 4", "-4", "6"],
    ["x + 2 - 5", "-5", "x - 3"],
    ["x + 3", "3", null], // x isn't a number
    ["2x + 3", "3", null],
    ["3 + 4", "3", null], // nothing in front of the first term
  ])("%s, tapping in front of %s", (src, text, expected) => {
    expect(tapOp(src, text)).toBe(expected);
  });
});

describe("factoring out of a power keeps every piece one piece", () => {
  it.each(["x^2·x - 6x^2", "x·x^3 + x^2", "x^3 + x^2"])("%s", (src) => {
    const s = parseState(src);
    const xs = s.sides.flatMap(allNodes).filter((n) => n.kind === "var");
    for (const x of xs)
      for (const c of candidatesFor(s, x.id, ALL_RULES).filter((k) => k.rule === "factor-out")) {
        const ids = c.state.sides.flatMap(allNodes).map((n) => n.id);
        expect(new Set(ids).size, printState(c.state)).toBe(ids.length);
      }
  });
});
