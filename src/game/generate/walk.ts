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
import { assuming } from "../../expr/setting";
import { parseState } from "../../expr/parse";
import { printState } from "../../expr/key";
import type { RuleId } from "../../rules";
import { verify } from "./verify";
import { CHAPTERS, rulesOf } from "../puzzles";
import { OWN_STEPS } from "./walks/steps";
import { build, canonical, type Back } from "./back";
import type { UnMove } from "./unmove";
import type { Draft, Rng, Shape } from "./write";

export type { Back } from "./back";

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
  /** Only its own steps back, never an earlier chapter's (a walk that must end somewhere exact: everything multiplied out). */
  alone?: boolean;
  /** One more step back after the wandering, now and then (half the time): the start written another way. */
  last?: UnMove;
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


/** The steps back of the chapters before this one (see walks/steps.ts). */
function earlierSteps(chapterId: string): Back[] {
  const at = CHAPTERS.findIndex((c) => c.id === chapterId);
  return CHAPTERS.slice(0, Math.max(0, at)).flatMap((c) => OWN_STEPS[c.id] ?? []);
}


/** Drafts a walked shape makes to pick the nicest from. */
const WALK_POOL = 4;

/** A walk as one of a chapter's exercise shapes, solved with that chapter's moves, taking earlier chapters' steps back too. */
export function walked(w: Walk, chapterId: string): Shape {
  let earlier: Back[] | null = null;
  return {
    id: w.id,
    name: w.name,
    weight: w.weight,
    positive: w.positive,
    make: (r) => walk({ ...w, earlier: (earlier ??= earlierSteps(chapterId)) }, rulesOf(chapterId), r),
    // Every draft is a walk, each step checked: a few to pick from are enough (they're varied by walking).
    pool: WALK_POOL,
    check: (d) => walkSolves(d, rulesOf(chapterId)),
  };
}

function walk(w: Walk, rules: readonly RuleId[], r: Rng): Draft | null {
  const src = w.answer(r);
  if (!src) return null;
  const positive = !!w.positive;
  const b = build(canonical(parseState(src)), [{ wander: w.back, earlier: w.alone ? [] : w.earlier, times: w.steps }, w.last && r.next() < 0.5 && w.last], r, { rules, positive });
  if (!b) return null;
  const path = b.path;
  if (w.settle) settle(w.settle, path, positive);
  if (w.needs && !b.rules.some((l) => l.some((x) => w.needs!.includes(x)))) return null;
  if (w.fits && !w.fits(path[path.length - 1])) return null;
  const shown = path.map((s) => printState({ ...s, letters: undefined }));
  // The states it walked through are its milestones, each stretch with the moves that undo its step (a start
  // written another way, `settle`, takes the moves of writing too). `check` follows them, quickly; where the
  // moves don't pass through a state the walk wrote (ln(x) + ln(x) combines to ln(x²), not ln(x·x)), it
  // searches from start to goal instead.
  const settling = SETTLING.filter((x) => rules.includes(x));
  const legs = b.rules.map((l) => (w.settle ? [...new Set([...l, ...settling])] : [...l])).reverse();
  // A walk whose start is written as a person writes it has its milestones written so too (what the moves and tidying meet).
  if (w.settle) for (let i = 1; i < path.length - 1; i++) shown[i] = printState({ ...canonical(w.settle(path[i])), letters: undefined });
  // Steps checked as they were taken are proven (back.ts); trusted ones aren't, nor any once the states are written another way.
  const proven = b.checked.slice().reverse().map((c) => c && !w.settle);
  return { shape: w.id, start: shown[shown.length - 1], goal: shown[0], via: shown.slice(1, -1).reverse(), legs, proven, ...(positive ? { positive } : {}) };
}

/** Moves that undo writing a start as a person would (Walk.settle): numbers multiplied, put first, x·x as x². */
const SETTLING: RuleId[] = ["multiply-numbers", "numbers-first", "merge-powers", "commute"];

/**
 * The draft solved along its milestones, quickly (the stretches it proved as
 * it walked taken as done), or null: another draft is picked. (A blind
 * search from start to goal can take seconds where the moves can't do it.)
 */
export function walkSolves(d: Draft, rules: readonly RuleId[]): Draft | null {
  return d.legs && !("stuck" in verify(d, rules, { quick: true, trusting: true, bestOnly: true })) ? d : null;
}

/** The walk's end written as a person writes it (see Walk.settle), as the start. */
function settle(write: Settle, path: MathState[], positive: boolean): void {
  const start = assuming(canonical(write(path[path.length - 1])), positive);
  // In place of the walk's end: the moves needn't pass through it (12 splits as 2·6, not as the 4·3 it was).
  path[path.length - 1] = start;
}
