/**
 * Completeness: if a step can reasonably be done by hand, the move for it is
 * there — whatever shape the expression happens to have. (Soundness, in
 * rules.test.ts, checks the opposite: that no move changes the maths.)
 *
 * Each promise is stated in the learner's terms (a term, a factor, a bottom),
 * over every exercise's start and a list of awkward shapes: a term alone on
 * its side, a side of several terms, minus signs, fractions.
 */
import { describe, expect, it } from "vitest";
import type { Expr, MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { print, printState } from "../expr/key";
import { evaluate, isConstant } from "../expr/eval";
import { relOf } from "../expr/build";
import { allPuzzles, CHAPTERS, exerciseLabel, rulesFor } from "../game/puzzles";
import { allNodes, children } from "../expr/tree";
import { ALL_RULES, candidatesFor, movesFor, signId, type RuleId } from ".";
import { termsOf, viewTerm } from "./view";

const SHAPES = [
  "x + 2 = -6",
  "x + 2 = 6",
  "5 = x",
  "-6 = x + 2",
  "x/3 + 1 = 5",
  "1 + x/3 = y + 5",
  "x/3 = y/2 + 1",
  "2x/3 = 4",
  "-2x/3 = 4",
  "x/(2·3) = 4",
  "1 - x/3 = 5 - x",
  "x/3 + x/4 = 7",
  "2(x + 1) = 6 + y",
  "P = F/A + c",
  "v = u + at",
  "x/3 + 1 < 5",
  "3 > x/2 - 1",
  "-x = 6",
  "-x/2 = 3 + x",
  "x + y = 5; x - y = 1",
];

const isEquation = (s: MathState) => s.sides.length >= 2 && s.sides.length % 2 === 0;
const STATES: [string, MathState][] = [
  ...SHAPES.map((src): [string, MathState] => [src, parseState(src)]),
  ...allPuzzles().map((p): [string, MathState] => [`${p.label}: ${p.puzzle.start}`, parseState(p.puzzle.start)]),
].filter(([, s]) => isEquation(s));

const value = (e: Expr) => evaluate(e, {});
/** A factor worth carrying across = (dividing or multiplying both sides by it). */
const crossable = (f: Expr, s: MathState) => (isConstant(f) ? value(f) !== 0 && value(f) !== 1 && !(f.kind === "num" && f.explicit) : relOf(s) === "=");
const across = (f: Expr): [RuleId, RuleId] => (isConstant(f) ? ["move-factor", "move-denominator"] : ["move-letter-factor", "move-letter-denominator"]);

/** Every promise this state makes: [what, the piece to drag, the rule that must offer something]. */
function promises(s: MathState): [string, string, RuleId][] {
  const out: [string, string, RuleId][] = [];
  s.sides.forEach((side, i) => {
    const terms = termsOf(side);
    if (side.kind === "neg") out.push([`the minus of side ${i} crosses`, signId(side.id), "move-sign"]);
    for (const term of terms) {
      const t = viewTerm(term);
      if (!(term.kind === "num" && term.value === 0)) out.push([`term ${print(term)} crosses`, term.id, "move-term"]);
      // Dividing both sides: a factor of a side that is a single term.
      if (terms.length === 1 && t.top.length >= 2)
        for (const f of t.top) if (crossable(f, s)) out.push([`factor ${print(f)} of ${print(term)} divides both sides`, f.id, across(f)[0]]);
      // Multiplying both sides: a bottom factor of any term, however many terms there are.
      for (const f of t.bottom) if (crossable(f, s)) out.push([`bottom ${print(f)} of ${print(term)} multiplies both sides`, f.id, across(f)[1]]);
    }
  });
  return out;
}

describe("every hand step across = is a move", () => {
  it.each(STATES)("%s", (_, s) => {
    const missing = promises(s)
      .filter(([, id, rule]) => !candidatesFor(s, id, ALL_RULES).some((c) => c.rule === rule))
      .map(([what]) => what);
    expect(missing, printState(s)).toEqual([]);
  });
});

/**
 * What a press picks up: the innermost piece under the pointer that can be
 * grabbed (see typeset.tsx: pieces without a move of their own let presses
 * fall through). The promise: every term of a sum can be picked up whole from
 * at least one of its symbols — under every chapter's moves, so unlocking a
 * move never makes a term impossible to carry.
 */
/**
 * Known exceptions: a product whose every factor is a handle of its own (the x
 * and the bracket of x(x + 2) can each be carried, to distribute or factor) has
 * no symbol left that picks up the whole term. Open design question.
 */
const KNOWN_STUCK: Record<string, string[]> = {
  "x(x + 2) + 3(x + 2)": ["x*(x + 2)"],
  "(x + 1)(x - 1) + 1": ["(x + 1)*(x - 1)"],
  "(a + 1)(a + 2) - a^2": ["(a + 1)*(a + 2)"],
  "(a + 3)(a - 1) - 2a": ["(a + 3)*(a - 1)"],
  "x(x + 1) - 2(x + 1)": ["x*(x + 1)"],
  "ab + 2a + 3b + 6": ["a*b"],
};

describe("every term can be picked up whole", () => {
  const chapters = CHAPTERS.map((ch, ci) => ({ ch, ci, rules: rulesFor(ci) }));
  const cases = chapters.flatMap(({ ch, ci, rules }) =>
    ch.puzzles.map((p, i): [string, MathState, RuleId[]] => [`${exerciseLabel(ci, i)}: ${p.start}`, parseState(p.start), rules]),
  );
  it.each(cases)("%s", (label, s, rules) => {
    const moves = movesFor(s, rules);
    /**
     * Spots a press can land on inside `e`, each with the pieces it passes
     * through on the way up to `e` — every symbol drawn, owned by the piece
     * that draws it (as in typeset.tsx): a letter or number, a fraction's bar
     * (or a root's √), a minus (its own handle), a "+" (the sum's), a "·" (the
     * product's), brackets (the bracketed piece's), a log's label.
     */
    const spots = (e: Expr, above: string[], parent: Expr | null): string[][] => {
      const here = [...above, e.id];
      const bracketed = parent !== null && ["prod", "neg", "pow", "log"].includes(parent.kind) && (e.kind === "sum" || e.kind === "neg" || (parent.kind !== "prod" && e.kind === "prod"));
      const draws =
        bracketed ||
        ["num", "var", "const", "frac", "log"].includes(e.kind) ||
        (e.kind === "sum" && e.terms.some((t, i) => i > 0 && t.kind !== "neg")) ||
        (e.kind === "prod" && e.factors.some((f, i) => i > 0 && (f.kind === "num" || f.kind === "frac" || e.factors[i - 1].kind === "frac")));
      const own: string[][] = draws ? [here] : [];
      if (e.kind === "neg") own.push([...here, signId(e.id)]);
      return [...own, ...children(e).flatMap((k) => spots(k, here, e))];
    };
    const stuck: string[] = [];
    for (const side of s.sides)
      for (const sm of allNodes(side))
        if (sm.kind === "sum")
          for (const t of sm.terms) {
            if (!moves.grabbable(t.id)) continue;
            // From some spot, nothing between it and the term takes the press first.
            const free = spots(t, [], sm).some((path) => path.slice(1).every((id) => !moves.grabbable(id)));
            if (!free) stuck.push(print(t));
          }
    expect(stuck, printState(s)).toEqual(KNOWN_STUCK[label.replace(/^[\d.]+: /, "")] ?? []);
  });
});
