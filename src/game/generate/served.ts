/** Every chapter's exercise shapes, by level, as practice serves them. */
import type { Draft, Level, Shape } from "./write";
import { CHAPTERS } from "../puzzles";
import { parseState } from "../../expr/parse";
import { stateKey } from "../../expr/key";

/**
 * A chapter's shape as practice serves it: every draft says whether its
 * letters are positive (its own word, else its shape's, else its chapter's),
 * and keeps no milestone that is the start, the goal or the one before.
 */
function served(s: Shape, chapterPositive: boolean): Shape {
  const positive = s.positive ?? chapterPositive;
  const make = (r: Parameters<Shape["make"]>[0]): Draft | null => {
    const d = s.make(r);
    if (!d) return null;
    // A milestone the same as the start, the goal or the one before goes; its stretch joins the next.
    const keys = [d.start, ...d.via, d.goal].map((t) => stateKey(parseState(t)));
    const keep = d.via.map((_, i) => keys[i + 1] !== keys[i] && keys[i + 1] !== keys[0] && keys[i + 1] !== keys[keys.length - 1]);
    const legs = d.legs && joinLegs(d.legs, keep);
    const stages = d.stages && joinLegs(d.stages, keep);
    // A stretch joined from several is proven only if each of them was.
    const proven = d.proven && joinLegs(d.proven.map((p) => (p ? [] : [false])), keep).map((x) => x.length === 0);
    return { ...d, via: d.via.filter((_, i) => keep[i]), ...(legs ? { legs } : {}), ...(stages ? { stages } : {}), ...(proven ? { proven } : {}), positive: d.positive ?? positive };
  };
  return { ...s, positive, make };
}

/** Each kept milestone's stretch, with those of the dropped ones before it. */
function joinLegs<T>(legs: readonly T[][], keep: readonly boolean[]): T[][] {
  const out: T[][] = [];
  let acc: T[] = [];
  legs.forEach((leg, i) => {
    acc = [...acc, ...leg];
    if (i >= keep.length || keep[i]) {
      out.push([...new Set(acc)]);
      acc = [];
    }
  });
  return out;
}

export const SHAPES: Record<string, Record<Level, Shape[]>> = Object.fromEntries(
  CHAPTERS.flatMap((c) => {
    const levels = c.levels?.();
    if (!levels) return [];
    return [[c.id, Object.fromEntries(Object.entries(levels).map(([l, ss]) => [l, ss.map((s) => served(s, c.positive ?? false))])) as Record<Level, Shape[]>]];
  }),
);
