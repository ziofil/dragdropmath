/**
 * The way through an exercise, written by the moves themselves. A shape says
 * where its solution goes, a few coarse checkpoints apart (squared, multiplied
 * out, all on one side, factored, solved), and what kind of work each
 * stretch is (its stage: expand, gather, factor, …); the way writer plays the
 * chapter's real moves forward through each stretch and hands back the
 * states it passed: checkpoints every few moves, each stretch with the exact
 * moves it takes.
 *
 * So no shape writes the in-between steps by hand (how the app writes
 * 2x·x, which number comes first): what a step looks like lives in the
 * rules only. And because every stretch is short and knows its moves, an
 * exercise is checked in milliseconds (verify.ts, quick) and Next step can
 * follow it, however long it is.
 *
 * It runs on the one draft a shape serves (Shape.check), not on every try.
 */
import type { MathState } from "../../expr/types";
import type { RuleId } from "../../rules";
import { parseState } from "../../expr/parse";
import { printState, stateKey } from "../../expr/key";
import { allNodes } from "../../expr/tree";
import { assuming } from "../../expr/setting";
import { atCheckpoint, search, searchBest } from "../solver";
import { isDone } from "../task";
import { undoneBy } from "./back";
import type { Draft } from "./write";

/** What kind of work a stretch is: its stage names the moves it takes. */
export type Stage = "arith" | "expand" | "gather" | "factor" | "split" | "square" | "isolate" | "clear" | "solve";

/** The numbers worked out as they come (in every stage). */
const ARITH: RuleId[] = ["combine", "multiply-numbers", "numbers-first", "multiply-out", "evaluate-fraction", "divide-numbers", "times-one", "power-one", "evaluate-power", "tap-power", "evaluate-root"];

/**
 * The moves of each stage, in one place (an un-move names its stage, rather
 * than listing moves that can go stale).
 */
export const STAGES: Record<Stage, readonly RuleId[]> = {
  arith: ARITH,
  // Brackets and powers of sums multiplied out, x·x as x², like terms collected.
  expand: [...ARITH, "power-to-product", "distribute", "distribute-neg", "merge-powers", "root-notation", "power-of-power", "commute"],
  // Every term on one side (the other 0), or terms moved to where they're wanted; sides swapped.
  gather: [...ARITH, "move-term", "swap-sides", "move-sign", "commute", "distribute-neg"],
  // A sum made a product: the middle term split, what pairs share taken out, a difference of squares; a number shared by
  // every term divided away (2x² − 14x + 24 = 0 → x² − 7x + 12 = 0).
  factor: [...ARITH, "split-term", "factor-out", "factor-shared", "split-number", "difference-of-squares", "move-factor", "commute"],
  // A product equal to 0 pulled apart, and each row solved.
  split: [...ARITH, "zero-product", "move-term", "move-factor", "move-sign", "cancel-factor", "swap-sides"],
  // A root on its own carried across (squared), and the square worked out.
  square: [...ARITH, "root-notation", "root-across", "power-of-power", "split-square"],
  // A root (or the piece wanted) got on its own on one side.
  isolate: [...ARITH, "move-term", "move-factor", "move-sign", "swap-sides", "commute"],
  // Bottoms carried across (each multiplying the other side), and what cancels cancelled.
  clear: [...ARITH, "move-denominator", "move-letter-denominator", "cancel-factor", "divide-powers", "split-fraction", "distribute", "merge-powers"],
  // Anything the chapter has (the last stretch to the answer).
  solve: [],
};

/** A stretch's moves: its stages' (all the chapter's for "solve"), only those the chapter has. */
function movesOf(stages: readonly Stage[], rules: readonly RuleId[]): RuleId[] {
  if (!stages.length || stages.includes("solve")) return [...rules];
  const want = new Set(stages.flatMap((s) => STAGES[s]));
  return rules.filter((r) => want.has(r));
}

/** Moves played between two checkpoints, at most (a longer stretch gets checkpoints in it). */
const EVERY = 3;
/** States looked at per stretch. */
const BUDGET = 4000;

/**
 * How much of a state is still to multiply out: every bracket in a product
 * (6(x + 2)(x + 2): two), a bracket to a whole power (as many as the power),
 * a minus in front of a bracket. Multiplying out brings it down, a few moves
 * at a time.
 */
function unexpanded(s: MathState): number {
  let n = 0;
  for (const side of s.sides)
    for (const e of allNodes(side)) {
      if (e.kind === "prod") n += e.factors.filter((f) => f.kind === "sum").length;
      if (e.kind === "pow" && e.base.kind === "sum" && e.exp.kind === "num" && Number.isInteger(e.exp.value)) n += e.exp.value;
      if (e.kind === "neg" && e.arg.kind === "sum") n++;
    }
  return n;
}

/**
 * The way from `from` to a state `done` likes, with `moves`: best-first, then
 * breadth-first; failing those, a bracket at a time (a stretch that multiplies
 * out three brackets is three short searches, not one long one). Null if
 * none within the budget.
 */
function stretch(from: MathState, done: (s: MathState) => boolean, moves: readonly RuleId[]): MathState[] | null {
  const direct = searchBest(from, done, moves, { ordered: false, maxStates: BUDGET }) ?? search(from, done, moves, { ordered: false, maxDepth: 6, maxStates: BUDGET });
  if (direct) return direct;
  // A bracket at a time: each short search ends where there's one bracket less.
  const way = [from];
  for (let guard = 0; guard < 12; guard++) {
    const at = way[way.length - 1];
    const left = unexpanded(at);
    if (left === 0) break;
    const less = searchBest(at, (s) => unexpanded(s) < left, moves, { ordered: false, maxStates: BUDGET });
    if (!less) return null;
    way.push(...less.slice(1));
  }
  const rest = searchBest(way[way.length - 1], done, moves, { ordered: false, maxStates: BUDGET });
  return rest && [...way, ...rest.slice(1)];
}

/**
 * The draft's way written by the moves: from its start through each coarse
 * checkpoint (`d.via`, its stretches' stages `d.stages`) to its goal, every
 * state on the way; then checkpoints every few moves, each stretch with the
 * exact moves it takes (`legs`). Null if a stretch can't be done with its
 * stage's moves (nor, failing that, with all the chapter's): another draft
 * is picked.
 */
export function writeWay(d: Draft, rules: readonly RuleId[]): Draft | null {
  const read = (t: string) => assuming(parseState(t), d.positive);
  const start = read(d.start);
  const goal = parseState(d.goal);
  const stops = d.via.map(read);
  const states: MathState[] = [start];
  const coarse = new Set<number>();
  for (let i = 0; i <= stops.length; i++) {
    const last = i === stops.length;
    const done = last ? (s: MathState) => isDone(goal, s) : (s: MathState) => atCheckpoint(s, stops[i]);
    const at = states[states.length - 1];
    if (done(at)) continue;
    const stages = d.stages?.[i] ?? ["solve"];
    const way = stretch(at, done, movesOf(stages, rules)) ?? (stages.includes("solve") ? null : stretch(at, done, rules));
    if (!way) return null;
    states.push(...way.slice(1));
    if (!last) coarse.add(states.length - 1);
  }
  // The moves of each step, as a learner makes it (what takes it from one state to the next).
  const steps: RuleId[][] = [];
  for (let i = 1; i < states.length; i++) {
    const by = undoneBy(states[i - 1], states[i], rules);
    if (!by.length) return null;
    steps.push(by);
  }
  // Checkpoints: every coarse one, and one every few moves in between.
  const via: string[] = [];
  const legs: RuleId[][] = [];
  let leg = new Set<RuleId>();
  let since = 0;
  const seen = new Set([stateKey(start, false)]);
  for (let i = 1; i < states.length; i++) {
    steps[i - 1].forEach((r) => leg.add(r));
    since++;
    const end = i === states.length - 1;
    if (end) break;
    const k = stateKey(states[i], false);
    if ((coarse.has(i) || since >= EVERY) && !seen.has(k)) {
      seen.add(k);
      via.push(printState({ ...states[i], letters: undefined }));
      legs.push([...leg]);
      leg = new Set();
      since = 0;
    }
  }
  legs.push([...leg]);
  const { stages: _s, ...rest } = d;
  void _s;
  return { ...rest, via, legs, proven: undefined };
}

/** A shape's last check that writes its way (Shape.check): its stretches searched with their stages' moves. */
export const writesWay = (rules: () => readonly RuleId[]) => (d: Draft) => writeWay(d, rules());

/** One stretch, as writeWay searches it: every state from `from` to one matching `to` (terms in any order), with `stage`'s moves. */
export function wayThrough(from: MathState, to: MathState, stage: Stage, rules: readonly RuleId[]): MathState[] | null {
  return stretch(from, (s) => atCheckpoint(s, to), movesOf([stage], rules));
}
