/**
 * The one way exercises are made: backwards from the answer, as a teacher
 * does. Start from what the learner should end with (x = 3, 5x + 2, x = 2 or
 * x = −3) and take steps back, each the reverse of something a learner does
 * by hand. Solving is the way back, so every exercise can be solved; the
 * states on the way are its milestones, and each step says which moves undo
 * it (so checking it takes milliseconds).
 *
 * A step back is one of:
 *
 * - an un-move (unmove.ts, backs.ts): written for the step, picking its own
 *   numbers when told what the next step needs (`wants`);
 * - a wander (`{ wander, times }`): steps taken at random among a list of
 *   un-moves and moves made forwards (multiplying out is the step back from
 *   factoring: see Rule.undoneBy), each kept only when one of the chapter's
 *   moves really undoes it. Variety comes from walking, not from listing.
 *
 * A recipe is a list of these, in order (linear.ts, systems.ts, compose.ts,
 * the chapters' shapes); a walk is one wander (walk.ts). Both are built here.
 */
import type { MathState } from "../../expr/types";
import { assuming } from "../../expr/setting";
import { parseState } from "../../expr/parse";
import { printState, stateKey } from "../../expr/key";
import { allNodes } from "../../expr/tree";
import { standing } from "../../expr/conditions";
import { RULES, stepsFrom, type RuleId } from "../../rules";
import { tidied } from "../tidy";
import { domainOf } from "./domain";
import type { UnMove } from "./unmove";
import type { Stage } from "./way";
import { shuffled, type Draft, type Rng } from "./write";

/** A step back taken by a wander: a move made forwards (undone by its `undoneBy`), or an un-move. */
export type Back = RuleId | UnMove;

/**
 * Steps back at random among `wander` (and now and then among `earlier`: an
 * earlier chapter's), between `times[0]` and `times[1]` of them, each one
 * undone by one of the chapter's moves.
 */
export type Wander = { wander: readonly Back[]; earlier?: readonly Back[]; times: readonly [number, number] };

/** One step of a recipe (a falsy one is left out: `level === "hard" && plus(…)`). */
export type Step = UnMove | Wander | null | false | undefined;

export type Built = {
  /** Solved first, the start last. */
  path: MathState[];
  /** Which of `path` are milestones (not quiet). */
  shown: boolean[];
  positive: boolean;
  /** For each step back (path[i + 1] → path[i]), the moves it takes. */
  rules: RuleId[][];
  /** Steps taken by wandering (their states weren't written by hand: see Draft.via). */
  wandered: number;
  /** For each step back (as `rules`), whether a move was found that undoes it, there and then (not just trusted to). */
  checked: boolean[];
  /** For each step back (as `rules`), what kind of work undoing it is (way.ts; none said: []). */
  stages: Stage[][];
};

/** What building needs to know for wandering: the chapter's moves, and what its letters stand for. */
export type BuildCtx = { rules?: readonly RuleId[]; positive?: boolean };

/** Every tree as the parser reads its print: what the moves will meet. */
export const canonical = (s: MathState): MathState => parseState(printState(s));
const sameTerms = (a: MathState, b: MathState) => stateKey(a, false) === stateKey(b, false);

/** How often a wander's step is one of its own, not an earlier chapter's. */
const OWN_FIRST = 0.7;

const isWander = (s: UnMove | Wander): s is Wander => "wander" in s;

/** The answer undone by these steps, in order; null if one can't be. */
export function build(answer: MathState, steps: readonly Step[], r: Rng, ctx: BuildCtx = {}): Built | null {
  const real = steps.filter((x): x is UnMove | Wander => !!x);
  let s = answer;
  const out: Built = { path: [s], shown: [true], positive: false, rules: [], wandered: 0, checked: [], stages: [] };
  const seen = new Set([stateKey(s, "exact")]);
  for (const [i, step] of real.entries()) {
    if (isWander(step)) {
      const n = r.int(step.times[0], step.times[1]);
      let taken = 0;
      for (; taken < n; taken++) {
        const got = stepBack(s, step.wander, step.earlier ?? [], ctx.rules ?? [], seen, r, !!ctx.positive);
        if (!got) break;
        seen.add(got.k);
        s = got.next;
        out.path.push(s);
        out.shown.push(true);
        out.rules.push(got.undo);
        out.checked.push(got.checked);
        out.stages.push([]);
      }
      out.wandered += taken;
      if (taken < step.times[0]) return null;
      continue;
    }
    const after = real[i + 1];
    const need = after && !isWander(after) && after.wants ? after.wants : () => true;
    const made = step.on(s, r, need);
    if (!made || (Array.isArray(made) && !made.length)) return null;
    for (const next of Array.isArray(made) ? made : [made]) {
      if (next === s) continue;
      const before = printState(s);
      s = canonical(next);
      if (printState(s) === before) continue;
      if (s.sides.some(hasFractionalNumber)) return null;
      out.path.push(s);
      out.shown.push(!step.quiet);
      out.rules.push(step.rules);
      out.checked.push(false);
      out.stages.push(step.stage ? [step.stage] : []);
      seen.add(stateKey(s, "exact"));
    }
    out.positive ||= !!step.positive;
  }
  return out;
}

const hasFractionalNumber = (e: MathState["sides"][number]) => allNodes(e).some((x) => x.kind === "num" && !Number.isInteger(x.value));

// ---------- wandering ----------

/** The states one step back from `s`, each with the moves that may undo it. */
type Option = { state: MathState; undo: readonly RuleId[] | null; trusted: boolean };

function backFrom(s: MathState, back: readonly Back[], r: Rng): Option[] {
  return back.flatMap((b): Option[] => {
    if (typeof b === "string") return stepsFrom(s, [b]).map((st) => ({ state: st.state, undo: RULES[b].undoneBy ?? null, trusted: false }));
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
function stepBack(s: MathState, back: readonly Back[], earlier: readonly Back[], rules: readonly RuleId[], seen: Set<string>, r: Rng, positive: boolean) {
  const at = assuming(s, positive);
  const mine = () => shuffled(r, backFrom(at, back, r));
  const theirs = () => shuffled(r, backFrom(at, earlier, r));
  const groups = r.next() < OWN_FIRST ? [mine, theirs] : [theirs, mine];
  for (const group of groups)
    for (const o of group()) {
      const next = assuming(canonical(o.state), positive);
      const k = stateKey(next, "exact");
      if (seen.has(k)) continue;
      const undoers = o.undo?.filter((x) => rules.includes(x));
      const trusted = !!(o.trusted && undoers?.length);
      const undo = trusted ? undoers! : undoneBy(next, at, undoers?.length ? undoers : rules);
      if (undo.length) return { next: { ...next, letters: undefined } as MathState, undo, k, checked: !trusted };
    }
  return null;
}

// ---------- the draft ----------

export type DraftOpts = {
  /** Its letters stand for positive numbers (default: as its steps say). */
  positive?: boolean;
  /**
   * The conditions on its letters, read off the start (a root's inside isn't
   * negative, nor what a root equals; a bottom isn't 0: see domain.ts), given
   * with it and every milestone; an answer that breaks one is no answer.
   */
  conditions?: boolean;
};

/**
 * A built exercise as a draft: the start the last state, the milestones those
 * in between (the start's side first), and the moves of each stretch. A
 * recipe with a wander in it has no milestones of its own here (walk.ts
 * writes a walk's).
 */
export function draftOf(shape: string, b: Built, opts: DraftOpts = {}): Draft {
  const { path, shown, rules, stages } = b;
  const positive = opts.positive ?? b.positive;
  const start = path[path.length - 1];
  const conditions = opts.conditions ? domainOf(start) : [];
  const where = (s: MathState) => printState({ ...s, letters: undefined, conditions: conditions.length ? conditions : undefined });
  const via: string[] = [];
  const legs: RuleId[][] = [];
  const kinds: Stage[][] = [];
  let leg = new Set<RuleId>();
  let kind = new Set<Stage>();
  for (let i = path.length - 1; i > 0; i--) {
    rules[i - 1].forEach((x) => leg.add(x));
    stages[i - 1].forEach((x) => kind.add(x));
    if (i - 1 > 0 && !shown[i - 1]) continue;
    if (i - 1 > 0) via.push(where(path[i - 1]));
    legs.push([...leg]);
    kinds.push([...kind]);
    leg = new Set();
    kind = new Set();
  }
  // The answer, without the rows that break a condition (x = −3 where x ≥ −1 is no answer).
  const goal = printState({ ...standing({ ...path[0], conditions }), conditions: undefined, letters: undefined });
  // Stages said for every stretch: the way is written by the moves (way.ts), its legs found then.
  const staged = kinds.every((k) => k.length > 0);
  const draft: Draft = { shape, start: where(start), goal, via, ...(positive ? { positive } : {}), legs, ...(staged ? { stages: kinds } : {}) };
  return b.wandered ? { ...draft, via: [], legs: undefined } : draft;
}
