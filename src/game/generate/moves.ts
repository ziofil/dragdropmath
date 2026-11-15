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
import { key, printState, stateKey } from "../../expr/key";
import { chapterById, lettersPositive, rulesOf } from "../puzzles";
import { letter, one as pick, rng, term, type Rng } from "./write";

export type Drill = {
  /** Its words (i18n `drills`) and its link. */
  id: string;
  /** The move it teaches. */
  rule: RuleId;
  /**
   * The start; `want`, if given, is the first term the move's result must have on the left (when it
   * could be made in more than one place). `goal`, if given, is where the
   * board finishes, a few moves on: the move alone would leave it half done
   * (x = 16 − 6 still to work out, 1/3 + 1/4 with only one bottom changed).
   */
  make: (r: Rng) => string | { start: string; want?: string; goal?: string; via?: string[] };
};

/** Two different letters. */
function letters2(r: Rng): [string, string] {
  const a = letter(r);
  const b = ["x", "y", "a", "b"].filter((l) => l !== a)[r.int(0, 2)];
  return [a, b];
}

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
      return `${term(r.int(1, 5), x)} + ${term(r.int(1, 5), y)} + ${term(r.int(1, 5), x)}`;
    }, "combine"),
    d("collect-cancel", (r) => {
      const [x, y] = letters2(r);
      return `${x} + ${y} - ${x}`;
    }, "combine"),
  ],
  distribute: [
    d("distribute", (r) => {
      const [a, b, x] = [r.int(2, 6), r.int(1, 9), letter(r)];
      return { start: `${a}(${x} + ${b})`, goal: `${a}${x} + ${a * b}` };
    }),
    d("distribute-neg", (r) => `-(${letter(r)} ${pick(r, ["+", "-"])} ${r.int(1, 9)})`),
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
      const [x, a, b] = [letter(r), r.int(1, 5), r.int(1, 5)];
      return { start: `(${x} + ${a})(${x} + ${b})`, goal: `${x}^2 + ${term(a + b, x)} + ${a * b}` };
    }, "distribute"),
    d("power-to-product", (r) => {
      const [x, a] = [letter(r), r.int(1, 6)];
      return { start: `(${x} + ${a})^2`, goal: `${x}^2 + ${2 * a}${x} + ${a * a}` };
    }),
  ],
  balance: [
    d("move-term", (r) => {
      const [x, a, b] = [letter(r), r.int(2, 9), r.int(10, 20)];
      return { start: `${x} + ${a} = ${b}`, want: x, goal: `${x} = ${b - a}` };
    }),
    d("move-factor", (r) => {
      const [x, a, k] = [letter(r), r.int(2, 9), r.int(2, 6)];
      return { start: `${a}${x} = ${a * k}`, want: x, goal: `${x} = ${k}` };
    }),
    d("move-denominator", (r) => {
      const [x, a, b] = [letter(r), r.int(2, 9), r.int(2, 9)];
      return { start: `${x}/${a} = ${b}`, want: x, goal: `${x} = ${a * b}` };
    }),
    d("move-sign", (r) => `-${letter(r)} = ${r.int(2, 9)}`),
    d("swap-sides", (r) => `${r.int(2, 20)} = ${letter(r)}`),
    d("root-across", (r) => {
      const [x, n, b] = [letter(r), pick(r, [2, 2, 3, 4]), r.int(2, 4)];
      return { start: `${x}^(1/${n}) = ${b}`, want: x, goal: `${x} = ${b ** n}` };
    }),
    d("exp-across", (r) => `${pick(r, ["e", "2", "3", "10"])}^${letter(r)} = ${r.int(5, 20)}`),
    // Both sides powers of the same base: the exponents balance like the sides do.
    d("move-exponent-term", (r) => {
      const [x, b, a, k] = [letter(r), pick(r, [2, 3]), r.int(1, 5), r.int(2, 4)];
      return { start: `${b}^(${x} - ${a}) = ${b}^${k}`, goal: `${b}^${x} = ${b}^(${k} + ${a})` };
    }),
    d("log-across", (r) => {
      const x = letter(r);
      if (r.next() < 0.5) return `ln(${x}) = ${r.int(2, 9)}`;
      const [b, k] = [r.int(2, 3), r.int(2, 3)];
      return { start: `log_${b}(${x}) = ${k}`, want: x, goal: `${x} = ${b ** k}` };
    }),
  ],
  powers: [
    d("merge-powers", (r) => {
      const [x, a, b] = [letter(r), r.int(2, 5), r.int(2, 5)];
      return { start: `${x}^${a}·${x}^${b}`, goal: `${x}^${a + b}` };
    }),
    // The way back: an exponent that is a sum splits into a product of powers.
    d("split-exponent", (r) => {
      const [x, b, a] = [letter(r), pick(r, [2, 3]), r.int(2, 4)];
      return { start: `${b}^(${x} + ${a})`, goal: `${b}^${x}*${b}^${a}` };
    }),
    d("power-of-power", (r) => {
      const [x, a, b] = [letter(r), r.int(2, 5), r.int(2, 4)];
      return { start: `(${x}^${a})^${b}`, goal: `${x}^${a * b}` };
    }),
    d("divide-powers", (r) => {
      const [x, b, k] = [letter(r), r.int(2, 4), r.int(2, 4)];
      return { start: `${x}^${b + k}/${x}^${b}`, goal: `${x}^${k}` };
    }),
    d("zero-power", (r) => {
      const [x, a] = [letter(r), r.int(2, 9)];
      return { start: `${x}^0 + ${a}`, goal: `${a + 1}` };
    }),
    d("flip-across-bar", (r) => `1/${letter(r)}^${r.int(2, 5)}`),
    d("power-one", (r) => `${r.int(2, 9)}${letter(r)}^1`),
    d("tap-power", (r) => `${pick(r, ["2^3", "2^4", "2^5", "3^2", "3^3", "4^2", "5^2", "10^2"])} + ${letter(r)}`),
    d("power-of-product", (r) => {
      const [a, x, n] = [r.int(2, 5), letter(r), r.int(2, 3)];
      return { start: `(${a}${x})^${n}`, goal: `${a ** n}${x}^${n}` };
    }),
  ],
  factor: [
    d("split-number", (r) => {
      // a·b splits as a·b when a is its smallest prime: 2·anything, 3·odd, 5·(5, 7).
      const [a, b] = pick(r, [[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [2, 9], [5, 7]] as const);
      const x = letter(r);
      return { start: `${a}${x} + ${a * b}`, goal: `${a}(${x} + ${b})` };
    }),
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
      return { start: `x·x + ${term(a, "x")} + ${b}x + ${a * b}`, want: `x*(x + ${a})`, goal: `(x + ${a})(x + ${b})` };
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
    d("ineq-move-term", (r) => {
      const [x, a, b, rel] = [letter(r), r.int(2, 9), r.int(10, 20), pick(r, ["<", ">", "≤", "≥"])];
      return { start: `${x} + ${a} ${rel} ${b}`, want: x, goal: `${x} ${rel} ${b - a}` };
    }, "move-term"),
    d("ineq-move-factor", (r) => {
      const [x, a, k, rel] = [letter(r), r.int(2, 6), r.int(2, 6), pick(r, ["<", ">", "≤", "≥"])];
      return { start: `${a}${x} ${rel} ${a * k}`, want: x, goal: `${x} ${rel} ${k}` };
    }, "move-factor"),
    d("ineq-swap", (r) => `${r.int(2, 9)} ${pick(r, ["<", ">"])} ${letter(r)}`, "swap-sides"),
    d("ineq-sign", (r) => `-${letter(r)} ${pick(r, ["<", ">", "≤", "≥"])} ${r.int(2, 9)}`, "move-sign"),
  ],
  fractions: [
    d("evaluate-fraction", (r) => {
      const a = r.int(2, 9);
      return `${a * r.int(2, 9)}/${a} + ${letter(r)}`;
    }),
    d("divide-numbers", (r) => {
      const g = r.int(2, 5);
      const [p, q] = pick(r, [[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5]]);
      return `${g * p}/${g * q} + ${letter(r)}`;
    }),
    d("cancel-factor", (r) => {
      const a = r.int(2, 9);
      return `${a}${letter(r)}/${a}`;
    }),
    d("add-fractions", (r) => {
      const [q, a, b] = [r.int(5, 9), r.int(1, 2), r.int(1, 2)];
      return { start: `${a}/${q} + ${b}/${q}`, goal: `${a + b}/${q}` };
    }),
    d("expand-fraction", (r) => {
      const [p, q] = pick(r, [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7]] as const);
      return { start: `1/${p} + 1/${q}`, goal: `${p + q}/${p * q}`, via: [`${q}/${p * q} + ${p}/${p * q}`] };
    }),
    d("multiply-fractions", (r) => {
      const p = r.int(1, 3);
      const q = r.int(1, 3);
      const b = p + r.int(1, 4);
      // Never the same fraction twice: (2/5)·(2/5) is a square (dropping one on the other makes (2/5)²).
      const d0 = q + r.int(1, 4);
      const d = p === q && d0 === b ? d0 + 1 : d0;
      return { start: `(${p}/${b})·(${q}/${d})`, goal: `${p * q}/${b * d}` };
    }),
    d("divide-by-fraction", (r) => {
      const [a, b, c] = [r.int(2, 9), r.int(2, 3), r.int(4, 7)];
      // a·(c/b), worked out: a whole number when it comes out whole.
      return { start: `${a}/(${b}/${c})`, goal: Number.isInteger((a * c) / b) ? `${(a * c) / b}` : `${a * c}/${b}` };
    }),
    d("split-fraction", (r) => `(${letter(r)} + ${r.int(1, 9)})/${r.int(2, 9)}`),
    d("times-one", (r) => `1·${letter(r)} + ${r.int(2, 9)}`),
  ],
  simultaneous: [
    d("substitute", (r) => {
      const [x, y] = ["x", "y"];
      const [a, k] = [r.int(2, 4), r.int(1, 5)];
      return {
        start: `${y} = ${a}${x}; ${x} + ${y} = ${(a + 1) * k}`,
        goal: `${y} = ${a * k}; ${x} = ${k}`,
        // Checkpoints on the way (for the tests: a search between each is quick).
        via: [`${y} = ${a}${x}; ${x} + ${a}${x} = ${(a + 1) * k}`, `${y} = ${a}${x}; ${a + 1}${x} = ${(a + 1) * k}`, `${y} = ${a}${x}; ${x} = ${k}`],
      };
    }),
  ],
  roots: [
    // Square roots mostly, now and then a cube or fourth root.
    d("evaluate-root", (r) => (r.next() < 0.6 ? `√${pick(r, [4, 9, 16, 25, 36, 49, 64, 81, 100])}` : pick(r, ["root_3(8)", "root_3(27)", "root_3(64)", "root_4(16)", "root_4(81)"]))),
    d("split-square", (r) => {
      // √(a²·b) → a√b; ∛(a³·b) → a∛b.
      if (r.next() < 0.6) {
        const [a, b] = pick(r, [[2, 2], [2, 3], [3, 2], [2, 5], [3, 3], [3, 5], [5, 2]] as const);
        return { start: `√${a * a * b}`, goal: `${a}√${b}` };
      }
      const [a, b] = pick(r, [[2, 2], [2, 3], [3, 2]] as const);
      return { start: `root_3(${a ** 3 * b})`, goal: `${a}root_3(${b})` };
    }),
    d("pull-out-of-power", (r) => {
      const x = letter(r);
      if (r.next() < 0.6) {
        const a = r.int(2, 5);
        return { start: `√(${a * a}${x})`, goal: `${a}√${x}` };
      }
      const a = r.int(2, 3);
      return { start: `root_3(${a ** 3}${x})`, goal: `${a}root_3(${x})` };
    }),
    d("root-notation", (r) => `${r.next() < 0.6 ? "√" : `root_${r.int(3, 4)}`}(${letter(r)}) + ${r.int(2, 9)}`),
  ],
  explog: [
    d("exp-of-log", (r) => (r.next() < 0.5 ? `e^(ln(${letter(r)}))` : `2^(log_2(${letter(r)}))`)),
    d("evaluate-log", (r) => (r.next() < 0.5 ? `${letter(r)} + ln(e)` : `log_${r.int(2, 9)}(1) + ${letter(r)}`)),
    d("power-of-base", (r) => {
      const k = r.int(2, 5);
      return { start: `log_2(${2 ** k})`, goal: `${k}` };
    }),
    d("log-of-product", (r) => `ln(${r.int(2, 9)}${letter(r)})`),
    d("log-of-power", (r) => `ln(${letter(r)}^${r.int(2, 5)})`),
    d("power-into-log", (r) => `${r.int(2, 5)}ln(${letter(r)})`),
    d("combine-logs", (r) => {
      const [x, y] = letters2(r);
      return `ln(${x}) ${pick(r, ["+", "-"])} ln(${y})`;
    }),
  ],
};

/** The left side's first term (the left side, if it isn't a sum). */
const firstTerm = (s: MathState) => (s.sides[0].kind === "sum" ? s.sides[0].terms[0] : s.sides[0]);

export const drillsOf = (chapterId: string): Drill[] => DRILLS[chapterId] ?? [];
export const drillById = (chapterId: string, id: string) => drillsOf(chapterId).find((x) => x.id === id);

/** Every state one `rule` move makes of `state` (drags a learner can make, and taps). */
export function oneMove(state: MathState, rule: RuleId, rules: readonly RuleId[]): MathState[] {
  const seen = new Set<string>();
  const out: MathState[] = [];
  for (const id of handles(state)) {
    const found = [
      ...(isGrabbable(state, id, rules) ? candidatesFor(state, id, rules).filter((c) => c.rule === rule) : []),
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
 * A board for a drill, made from a seed: its start, its goal, and everything
 * else that counts as done (`also`). A move complete in itself: what it
 * makes, every way it can be made (either bracket of (x + 1)(x + 2) dropped
 * on the other). A move that leaves things half done: where the board
 * finishes, a few moves on. A start the move can't be made on (or whose
 * result can't be written back as it is) is tried again with the next
 * numbers. `positive`: its letters stand for positive numbers.
 */
export function drillExercise(chapterId: string, drillId: string, seed: number): { start: string; goal: string; also: string[]; via?: string[]; positive: boolean } | null {
  const drill = drillById(chapterId, drillId);
  const chapter = chapterById(chapterId);
  if (!drill || !chapter) return null;
  const rules = rulesOf(chapterId);
  const r = rng(seed);
  for (let tries = 0; tries < 30; tries++) {
    const made = drill.make(r);
    const { start, want, goal: finish, via } = typeof made === "string" ? { start: made, via: undefined } : made;
    const parsed = parseState(start);
    const positive = lettersPositive(chapter, start);
    const state: MathState = positive ? { ...parsed, letters: "positive" } : parsed;
    const results = oneMove(state, drill.rule, rules).filter((s) => !want || key(firstTerm(s)) === key(parseState(want).sides[0]));
    if (!results.length) continue;
    // Finished a few moves on: that's the goal, whichever way the move was made.
    if (finish) return { start, goal: finish, also: [], ...(via ? { via } : {}), positive };
    // The plainest of what the move can make (the 3 across x + 3 = 10, not the 10), else any.
    const size = (s: MathState) => s.sides.reduce((n, e) => n + allNodes(e).length, 0) - (s.sides.some((e) => e.kind === "var") ? 1 : 0);
    const least = Math.min(...results.map(size));
    const goal = printState(pick(r, results.filter((s) => size(s) === least)));
    // The goal must read back as the very state the move makes.
    if (results.some((s) => stateKey(s, "exact") === stateKey(parseState(goal), "exact")))
      return { start, goal, also: results.map(printState).filter((g) => g !== goal), positive };
  }
  return null;
}
