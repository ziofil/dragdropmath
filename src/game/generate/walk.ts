/**
 * Exercises made by walking back from their answer, one step at a time, with
 * the moves themselves: a step back is a learner's move made forwards (its
 * opposite: multiplying out is the step back from factoring) or an un-move
 * written for it (5x written as 2x + 3x). A step back is kept only if one of
 * the chapter's own moves undoes it — so every exercise can be solved, by
 * construction, and the states on the way are its milestones.
 *
 * Variety comes from walking, not from listing: any of the steps back, in
 * any order, anywhere they apply, as many as the level asks for.
 */
import type { MathState } from "../../expr/types";
import { parseState } from "../../expr/parse";
import { printState, stateKey } from "../../expr/key";
import { stepsFrom, type RuleId } from "../../rules";
import { tidied } from "../tidy";
import { searchBest } from "../solver";
import { CHAPTERS, rulesOf } from "../puzzles";
import { OWN_STEPS } from "./walks/steps";
import type { UnMove } from "./unmove";
import { shuffled, type Draft, type Rng, type Shape } from "./write";

/** A step back: a move made forwards (its opposite undoes it), or an un-move. */
export type Back = RuleId | UnMove;

export type Walk = {
  id: string;
  name: string;
  /** The answer, as written (null: try again). */
  answer: (r: Rng) => string | null;
  /** The steps back it may take. */
  back: readonly Back[];
  /** Earlier chapters' steps back, taken now and then (filled in by `walked`). */
  earlier?: readonly Back[];
  /** How many steps back, at least and at most. */
  steps: readonly [number, number];
  /** The start as a person writes it (3·5 worked out to 15, x·x as x²). */
  settle?: Settle;
  /** What a start must be like to be kept (not too long, say). */
  fits?: (start: MathState) => boolean;
  /** Undoing it must take one of these moves (the chapter's own) somewhere on the way. */
  needs?: readonly RuleId[];
  /** Its letters stand for positive numbers. */
  positive?: boolean;
  weight?: number;
};

/** Writing a walk's end as a person would (12x + 28, not 4·3x + 4·7): the start. */
export type Settle = (s: MathState) => MathState;

/** Every tree as the parser reads its print: what the moves will meet. */
const canonical = (s: MathState): MathState => parseState(printState(s));
const sameTerms = (a: MathState, b: MathState) => stateKey(a, false) === stateKey(b, false);

/** The steps back of the chapters before this one (see walks/steps.ts). */
function earlierSteps(chapterId: string): Back[] {
  const at = CHAPTERS.findIndex((c) => c.id === chapterId);
  return CHAPTERS.slice(0, Math.max(0, at)).flatMap((c) => OWN_STEPS[c.id] ?? []);
}

/** How often a step back is one of the chapter's own, not an earlier chapter's. */
const OWN_FIRST = 0.7;

/** A walk as one of a chapter's exercise shapes, solved with that chapter's moves, taking earlier chapters' steps back too. */
export function walked(w: Walk, chapterId: string): Shape {
  let earlier: Back[] | null = null;
  return {
    id: w.id,
    name: w.name,
    weight: w.weight,
    positive: w.positive,
    make: (r) => walk({ ...w, earlier: (earlier ??= earlierSteps(chapterId)) }, rulesOf(chapterId), r),
    check: (d) => stillSolves(d, rulesOf(chapterId)),
  };
}

/**
 * The moves that undo a move made forwards (a step back): factoring undoes
 * multiplying out. Checking only these is what keeps a walk quick; a move
 * not listed is checked against all of the chapter's.
 */
export const UNDONE_BY: Partial<Record<RuleId, RuleId[]>> = {
  distribute: ["factor-out", "factor-shared"],
  "distribute-neg": ["factor-out"],
  "factor-out": ["distribute"],
  "multiply-numbers": ["split-number"],
  "multiply-out": ["split-number"],
  "split-number": ["multiply-numbers", "multiply-out"],
  "merge-powers": ["split-exponent"],
  "split-exponent": ["merge-powers"],
  "add-fractions": ["split-fraction"],
  "split-fraction": ["add-fractions"],
  "log-of-product": ["combine-logs"],
  "combine-logs": ["log-of-product"],
  "log-of-power": ["power-into-log"],
  "power-into-log": ["log-of-power"],
  "join-powers": ["pull-out-of-power"],
  "pull-out-of-power": ["join-powers"],
  commute: ["commute"],
};

/** The states one step back from `s`, each with the moves that may undo it. */
type Option = { state: MathState; undo: readonly RuleId[] | null; trusted: boolean };

function backFrom(s: MathState, back: readonly Back[], r: Rng): Option[] {
  return back.flatMap((b): Option[] => {
    if (typeof b === "string") return stepsFrom(s, [b]).map((st) => ({ state: st.state, undo: UNDONE_BY[b] ?? null, trusted: false }));
    const made = b.on(s, r, () => true);
    return (made === null ? [] : Array.isArray(made) ? made : [made]).map((state) => ({ state, undo: b.rules, trusted: !!b.trusted }));
  });
}

/** The chapter's moves that take `from` back to `to` in one step (none: it can't be undone in one). */
export function undoneBy(from: MathState, to: MathState, rules: readonly RuleId[]): RuleId[] {
  const out = new Set<RuleId>();
  for (const st of stepsFrom(from, rules)) if (sameTerms(tidied(from, st.state), to)) for (const w of st.ways) out.add(w.candidate.rule);
  return [...out];
}

/** One step back from `s` that the chapter's moves undo, at random (and not back where it has been): its own steps first, mostly, else an earlier chapter's. */
function stepBack(
  s: MathState,
  back: readonly Back[],
  earlier: readonly Back[],
  rules: readonly RuleId[],
  seen: Set<string>,
  r: Rng,
  positive: boolean,
) {
  const letters = positive ? { letters: "positive" as const } : {};
  const at = { ...s, ...letters };
  const mine = () => shuffled(r, backFrom(at, back, r));
  const theirs = () => shuffled(r, backFrom(at, earlier, r));
  const groups = r.next() < OWN_FIRST ? [mine, theirs] : [theirs, mine];
  for (const group of groups)
    for (const o of group()) {
      const next = { ...canonical(o.state), ...letters };
      const k = stateKey(next, "exact");
      if (seen.has(k)) continue;
      const undoers = o.undo?.filter((x) => rules.includes(x));
      const undo = o.trusted && undoers?.length ? undoers : undoneBy(next, { ...s, ...letters }, undoers?.length ? undoers : rules);
      if (undo.length) return { next, undo, k };
    }
  return null;
}

function walk(w: Walk, rules: readonly RuleId[], r: Rng): Draft | null {
  const src = w.answer(r);
  if (!src) return null;
  const positive = !!w.positive;
  const goal = canonical(parseState(src));
  const path: MathState[] = [goal];
  const legs: RuleId[][] = [];
  const seen = new Set([stateKey(goal, "exact")]);
  const n = r.int(w.steps[0], w.steps[1]);
  const take = (back: readonly Back[]) => {
    const got = stepBack(path[path.length - 1], back, back === w.back ? (w.earlier ?? []) : [], rules, seen, r, positive);
    if (!got) return false;
    seen.add(got.k);
    path.push(got.next);
    legs.push(got.undo);
    return true;
  };
  for (let i = 0; i < n; i++) if (!take(w.back)) break;
  if (path.length - 1 < w.steps[0]) return null;
  if (w.settle) settle(w.settle, path, positive);
  if (w.needs && !legs.some((l) => l.some((x) => w.needs!.includes(x)))) return null;
  if (w.fits && !w.fits(path[path.length - 1])) return null;
  const shown = path.map((s) => printState({ ...s, letters: undefined }));
  // No milestones: a trusted step or a tidied start needn't pass through the states the walk wrote
  // (ln(x) + ln(x) combines to ln(x²), not ln(x·x)). The draft is searched once, start to goal (see `check`).
  return { shape: w.id, start: shown[shown.length - 1], goal: shown[0], via: [], ...(positive ? { positive } : {}) };
}

/** How hard a start may be looked at, to be sure the moves solve it (most take a few dozen states). */
const CHECK_STATES = 1500;

/** The walk's end written as a person writes it (see Walk.settle), as the start. */
function settle(write: Settle, path: MathState[], positive: boolean): void {
  const start = { ...canonical(write(path[path.length - 1])), ...(positive ? { letters: "positive" as const } : {}) };
  // In place of the walk's end: the moves needn't pass through it (12 splits as 2·6, not as the 4·3 it was).
  path[path.length - 1] = start;
}

/** Moves between two milestones taken from a found way (the checks search at most a few between milestones). */
const EVERY = 4;

/**
 * The start gets to the goal with the chapter's moves (tidying can hide a
 * step: x(x − 4) + 1·(x − 4) tidies to x(x − 4) + x − 4, which no move
 * factors). Searched briefly, on the draft practice picks only; the way
 * found gives its milestones, states the moves really reach.
 */
function stillSolves(d: Draft, rules: readonly RuleId[]): Draft | null {
  const start = { ...parseState(d.start), ...(d.positive ? { letters: "positive" as const } : {}) };
  const goal = parseState(d.goal);
  const way = searchBest(start, (x) => sameTerms(x, goal), rules, { ordered: false, maxStates: CHECK_STATES });
  if (!way) return null;
  const via = way.slice(1, -1).filter((_, i) => (i + 1) % EVERY === 0).map((s) => printState({ ...s, letters: undefined }));
  return { ...d, via };
}
