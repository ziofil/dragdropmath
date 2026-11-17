/**
 * An exercise given as a book writes its solution: the start, a few coarse
 * milestones (squared, multiplied out, all on one side, factored), what kind
 * of work each stretch is, and the answers. The conditions are read off the
 * start (domain.ts) and written beside every milestone; the goal is the
 * answers that make the start true (answers.ts answersOf: what squaring
 * invents isn't one); the way between the milestones is written by the moves
 * (way.ts, the shape's check).
 *
 * For exercises whose answers aren't one or two rows of a letter (four
 * answers of x⁴ − 5x² + 4 = 0, √x = 1 or √x = 8): the un-moves (unmove.ts)
 * build those back from two rows only.
 */
import { parseState } from "../../expr/parse";
import { printState } from "../../expr/key";
import { answersOf } from "../answers";
import { domainOf } from "./domain";
import type { Stage } from "./way";
import type { Draft } from "./write";

/** A stretch: what kind of work it is, and the milestone it ends at. */
export type Leg = [Stage | Stage[], string];

/**
 * The draft of an exercise from `start` through `legs` to `answer` (its rows
 * joined by "or"), the last stretch's work `last`.
 */
export function routed(shape: string, start: string, legs: Leg[], answer: string, last: Stage | Stage[] = "solve"): Draft {
  const s = parseState(start);
  const conditions = domainOf(s);
  const where = (t: string) => printState({ ...parseState(t), conditions: conditions.length ? conditions : undefined });
  const goal = printState({ ...answersOf({ ...s, conditions }, parseState(answer)), conditions: undefined });
  const stages = [...legs.map(([k]) => k), last].map((k) => (Array.isArray(k) ? k : [k]));
  return { shape, start: where(start), via: legs.map(([, t]) => where(t)), goal, stages };
}
