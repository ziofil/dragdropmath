/**
 * A chapter's lesson is its moves: endless one-move drills, one kind per move.
 * A drill writes a small start where its move applies; the goal is what that
 * one move makes of it (found with the move engine, so it is always exactly
 * one move away). Each drill has its own words in i18n (`drills`).
 */
import type { RuleId } from "../../rules";
import { candidatesFor, handles, isGrabbable, tapFor } from "../../rules";
import type { MathState } from "../../expr/types";
import { parseState } from "../../expr/parse";
import { allNodes } from "../../expr/tree";
import { printState, stateKey } from "../../expr/key";
import { CHAPTERS, lettersPositive, rulesFor } from "../puzzles";
import { rng, type Rng } from "./write";

export type Drill = {
  /** Its words (i18n `drills`) and its link. */
  id: string;
  /** The move it teaches. */
  rule: RuleId;
  /** The start; `want`, if given, is how the goal must begin (when the move could be made in more than one place). */
  make: (r: Rng) => string | { start: string; want: string };
};

/** One of a few letters, mostly x. */
const letter = (r: Rng) => (r.next() < 0.6 ? "x" : ["y", "a", "t", "n"][r.int(0, 3)]);
/** Two different letters. */
function letters2(r: Rng): [string, string] {
  const a = letter(r);
  const b = ["x", "y", "a", "b"].filter((l) => l !== a)[r.int(0, 2)];
  return [a, b];
}
const pick = <T,>(r: Rng, xs: readonly T[]): T => xs[r.int(0, xs.length - 1)];
/** "3x", "x" (a coefficient of 1 isn't written). */
const times = (a: number, x: string) => (a === 1 ? x : `${a}${x}`);

const d = (id: string, make: Drill["make"], rule = id as RuleId): Drill => ({ id, rule, make });

/** Each chapter's drills, in the order a learner meets the moves. */
export const DRILLS: Record<string, Drill[]> = {
  shuffle: [
    d("commute", (r) => `${r.int(2, 9)} + ${letter(r)}`),
    d("combine", (r) => `${r.int(2, 9)} + ${letter(r)} + ${r.int(2, 9)}`),
    d("multiply-numbers", (r) => `${r.int(2, 5)}·${letter(r)}·${r.int(2, 5)}`),
    d("numbers-first", (r) => `${letter(r)}·${r.int(2, 9)}`),
    d("multiply-out", (r) => `${r.int(2, 6)}·${r.int(2, 6)} + ${letter(r)}`),
  ],
  collect: [
    d("collect", (r) => {
      const [x, y] = letters2(r);
      return `${times(r.int(1, 5), x)} + ${times(r.int(1, 5), y)} + ${times(r.int(1, 5), x)}`;
    }, "combine"),
    d("collect-cancel", (r) => {
      const [x, y] = letters2(r);
      return `${x} + ${y} - ${x}`;
    }, "combine"),
  ],
  distribute: [
    d("distribute", (r) => `${r.int(2, 6)}(${letter(r)} + ${r.int(1, 9)})`),
    d("distribute-neg", (r) => `${r.int(2, 9)} - (${letter(r)} ${pick(r, ["+", "-"])} ${r.int(1, 9)})`),
    // x(x + 2) gives x·x + 2x. Powers with exponents come in the Powers chapter.
    d("x-times-x", (r) => `x·x + ${r.int(2, 9)}x`, "merge-powers"),
    d("factor-out", (r) => {
      const [x, y] = letters2(r);
      const a = r.int(2, 7);
      return `${a}${x} + ${a}${y}`;
    }),
  ],
  brackets: [
    d("bracket-times-bracket", (r) => {
      const x = letter(r);
      return `(${x} + ${r.int(1, 5)})(${x} + ${r.int(1, 5)})`;
    }, "distribute"),
    d("power-to-product", (r) => `(${letter(r)} + ${r.int(1, 9)})^2`),
  ],
  balance: [
    d("move-term", (r) => `${letter(r)} + ${r.int(2, 9)} = ${r.int(10, 20)}`),
    d("move-factor", (r) => `${r.int(2, 9)}${letter(r)} = ${r.int(10, 40)}`),
    d("move-denominator", (r) => `${letter(r)}/${r.int(2, 9)} = ${r.int(2, 9)}`),
    d("move-sign", (r) => `-${letter(r)} = ${r.int(2, 9)}`),
    d("swap-sides", (r) => `${r.int(2, 20)} = ${letter(r)}`),
    d("evaluate-fraction", (r) => {
      const a = r.int(2, 9);
      return `${letter(r)} = ${a * r.int(2, 9)}/${a}`;
    }),
    d("divide-numbers", (r) => {
      const g = r.int(2, 5);
      const [p, q] = pick(r, [[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5]]);
      return `${letter(r)} = ${g * p}/${g * q}`;
    }),
    d("cancel-factor", (r) => {
      const a = r.int(2, 9);
      return `${a}${letter(r)}/${a}`;
    }),
  ],
  powers: [
    d("merge-powers", (r) => {
      const x = letter(r);
      return `${x}^${r.int(2, 5)}·${x}^${r.int(2, 5)}`;
    }),
    d("power-of-power", (r) => `(${letter(r)}^${r.int(2, 5)})^${r.int(2, 4)}`),
    d("divide-powers", (r) => {
      const x = letter(r);
      const b = r.int(2, 4);
      return `${x}^${b + r.int(1, 4)}/${x}^${b}`;
    }),
    d("zero-power", (r) => `${letter(r)}^0 + ${r.int(2, 9)}`),
    d("flip-across-bar", (r) => `1/${letter(r)}^${r.int(2, 5)}`),
    d("power-one", (r) => `${r.int(2, 9)}${letter(r)}^1`),
    d("tap-power", (r) => `${pick(r, ["2^3", "2^4", "2^5", "3^2", "3^3", "4^2", "5^2", "10^2"])} + ${letter(r)}`),
    d("power-of-product", (r) => `(${r.int(2, 5)}${letter(r)})^${r.int(2, 3)}`),
  ],
  factor: [
    d("split-number", (r) => `${letter(r)} + ${pick(r, [4, 6, 9, 10, 14, 15, 21, 25])}`),
    d("bracket-out", (r) => {
      const x = letter(r);
      const a = r.int(1, 6);
      const b = pick(r, [2, 3, 4, 5].filter((n) => n !== a));
      return `${x}(${x} + ${a}) + ${b}(${x} + ${a})`;
    }, "factor-out"),
    d("factor-shared", (r) => {
      // Four terms, worked in pairs: x² + 2x + 3x + 6, the first two first.
      const a = r.int(1, 5);
      const b = pick(r, [2, 3, 4, 5, 6].filter((n) => n !== a));
      return { start: `x·x + ${times(a, "x")} + ${b}x + ${a * b}`, want: `x*(x + ${a})` };
    }),
  ],
  formulas: [
    d("move-letter-factor", (r) => {
      const [x, y] = letters2(r);
      return `${y}${x} = ${pick(r, ["c", "F", "P", "k"])}`;
    }),
    d("move-letter-denominator", (r) => {
      const [x, y] = letters2(r);
      return `${x}/${y} = ${pick(r, ["c", "P", "k"])}`;
    }),
  ],
  inequalities: [
    d("ineq-move-term", (r) => `${letter(r)} + ${r.int(2, 9)} ${pick(r, ["<", ">", "≤", "≥"])} ${r.int(10, 20)}`, "move-term"),
    d("ineq-move-factor", (r) => {
      const a = r.int(2, 6);
      return `${a}${letter(r)} ${pick(r, ["<", ">", "≤", "≥"])} ${a * r.int(2, 6)}`;
    }, "move-factor"),
    d("ineq-swap", (r) => `${r.int(2, 9)} ${pick(r, ["<", ">"])} ${letter(r)}`, "swap-sides"),
    d("ineq-sign", (r) => `-${letter(r)} ${pick(r, ["<", ">", "≤", "≥"])} ${r.int(2, 9)}`, "move-sign"),
  ],
  fractions: [
    d("add-fractions", (r) => {
      const q = r.int(5, 9);
      return `${r.int(1, 2)}/${q} + ${r.int(1, 2)}/${q}`;
    }),
    d("expand-fraction", (r) => {
      const [p, q] = pick(r, [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7]]);
      return `1/${p} + 1/${q}`;
    }),
    d("multiply-fractions", (r) => {
      const p = r.int(1, 3);
      const q = r.int(1, 3);
      const b = p + r.int(1, 4);
      // Never the same fraction twice: (2/5)·(2/5) is a square (dropping one on the other makes (2/5)²).
      const d = q + r.int(1, 4);
      return `(${p}/${b})·(${q}/${p === q && d === b ? d + 1 : d})`;
    }),
    d("divide-by-fraction", (r) => `${r.int(2, 9)}/(${r.int(1, 3)}/${r.int(4, 7)})`),
    d("split-fraction", (r) => `(${letter(r)} + ${r.int(1, 9)})/${r.int(2, 9)}`),
    d("times-one", (r) => `1·${letter(r)} + ${r.int(2, 9)}`),
  ],
  simultaneous: [
    d("substitute", (r) => {
      const [x, y] = ["x", "y"];
      const a = r.int(2, 4);
      return `${y} = ${a}${x}; ${x} + ${y} = ${(a + 1) * r.int(1, 5)}`;
    }),
  ],
  roots: [
    // Square roots mostly, now and then a cube or fourth root.
    d("evaluate-root", (r) => (r.next() < 0.6 ? `√${pick(r, [4, 9, 16, 25, 36, 49, 64, 81, 100])}` : pick(r, ["root_3(8)", "root_3(27)", "root_3(64)", "root_4(16)", "root_4(81)"]))),
    d("split-square", (r) => (r.next() < 0.6 ? `√${pick(r, [8, 12, 18, 20, 27, 45, 50])}` : `root_3(${pick(r, [16, 24, 54])})`)),
    d("pull-out-of-power", (r) => (r.next() < 0.6 ? `√(${pick(r, [4, 9, 16, 25])}${letter(r)})` : `root_3(${pick(r, [8, 27])}${letter(r)})`)),
    d("root-notation", (r) => `${r.next() < 0.6 ? "√" : `root_${r.int(3, 4)}`}(${letter(r)}) + ${r.int(2, 9)}`),
    d("root-across", (r) => `${letter(r)}^(1/${pick(r, [2, 2, 3, 4])}) = ${r.int(2, 5)}`),
  ],
  explog: [
    d("exp-of-log", (r) => (r.next() < 0.5 ? `e^(ln(${letter(r)}))` : `2^(log_2(${letter(r)}))`)),
    d("evaluate-log", (r) => (r.next() < 0.5 ? `${letter(r)} + ln(e)` : `log_${r.int(2, 9)}(1) + ${letter(r)}`)),
    d("power-of-base", (r) => `log_2(${pick(r, [4, 8, 16, 32])})`),
    d("log-of-product", (r) => `ln(${r.int(2, 9)}${letter(r)})`),
    d("log-of-power", (r) => `ln(${letter(r)}^${r.int(2, 5)})`),
    d("power-into-log", (r) => `${r.int(2, 5)}ln(${letter(r)})`),
    d("combine-logs", (r) => {
      const [x, y] = letters2(r);
      return `ln(${x}) ${pick(r, ["+", "-"])} ln(${y})`;
    }),
    d("exp-across", (r) => `${pick(r, ["e", "2", "3", "10"])}^${letter(r)} = ${r.int(5, 20)}`),
    d("log-across", (r) => (r.next() < 0.5 ? `ln(${letter(r)}) = ${r.int(2, 9)}` : `log_${r.int(2, 5)}(${letter(r)}) = ${r.int(2, 4)}`)),
  ],
};

export const drillsOf = (chapterId: string): Drill[] => DRILLS[chapterId] ?? [];
export const drillById = (chapterId: string, id: string) => drillsOf(chapterId).find((x) => x.id === id);

/** Every state one `rule` move makes of `state` (drags a learner can make, and taps). */
export function oneMove(state: MathState, rule: RuleId, rules: readonly RuleId[]): MathState[] {
  const seen = new Set<string>();
  const out: MathState[] = [];
  for (const id of handles(state)) {
    const found = [
      ...(isGrabbable(state, id, rules) ? candidatesFor(state, id, rules).filter((c) => c.rule === rule && !c.secondary) : []),
      ...[tapFor(state, id, rules)].filter((c) => c?.rule === rule),
    ];
    for (const c of found) {
      const k = stateKey(c!.state, "exact");
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(c!.state);
    }
  }
  return out;
}

/**
 * The drill for this seed: its start, and its goal one move away. A start the
 * move can't be made on (or whose result can't be written back as it is) is
 * tried again with the next numbers.
 */
/**
 * A board for a drill: its start, the goal it shows, and everything else its
 * move can make there (`also`): dropping either bracket of (x + 1)(x + 2) on
 * the other is the same move, and both count.
 */
export function drillExercise(chapterId: string, drillId: string, seed: number): { start: string; goal: string; also: string[] } | null {
  const drill = drillById(chapterId, drillId);
  const ci = CHAPTERS.findIndex((c) => c.id === chapterId);
  if (!drill || ci < 0) return null;
  const rules = rulesFor(ci);
  const positive = lettersPositive(CHAPTERS[ci]);
  const r = rng(seed);
  for (let tries = 0; tries < 30; tries++) {
    const made = drill.make(r);
    const { start, want } = typeof made === "string" ? { start: made, want: "" } : made;
    const parsed = parseState(start);
    const state: MathState = positive ? { ...parsed, letters: "positive" } : parsed;
    const results = oneMove(state, drill.rule, rules).filter((s) => printState(s).startsWith(want));
    if (!results.length) continue;
    // The plainest of what the move can make (the 3 across x + 3 = 10, not the 10), else any.
    const size = (s: MathState) => s.sides.reduce((n, e) => n + allNodes(e).length, 0) - (s.sides.some((e) => e.kind === "var") ? 1 : 0);
    const least = Math.min(...results.map(size));
    const goal = printState(pick(r, results.filter((s) => size(s) === least)));
    // The goal must read back as the very state the move makes.
    if (results.some((s) => stateKey(s, "exact") === stateKey(parseState(goal), "exact")))
      return { start, goal, also: results.map(printState).filter((g) => g !== goal) };
  }
  return null;
}
