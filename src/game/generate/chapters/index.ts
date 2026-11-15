/** Every chapter's exercise shapes, by level. */
import type { Draft, Level, Shape } from "../write";
import type { RuleId } from "../../../rules";
import { chapterById } from "../../puzzles";
import { parseState } from "../../../expr/parse";
import { stateKey } from "../../../expr/key";
import { shapes as balance } from "./balance";
import { shapes as shuffle } from "./shuffle";
import { shapes as collect } from "./collect";
import { shapes as distribute } from "./distribute";
import { shapes as brackets } from "./brackets";
import { shapes as factor } from "./factor";
import { shapes as powers } from "./powers";
import { shapes as roots } from "./roots";
import { shapes as fractions } from "./fractions";
import { shapes as explog } from "./explog";
import { shapes as formulas } from "./formulas";
import { shapes as inequalities } from "./inequalities";
import { shapes as simultaneous } from "./simultaneous";

const BY_CHAPTER: Record<string, Record<Level, Shape[]>> = { balance, shuffle, collect, distribute, brackets, factor, powers, roots, fractions, explog, formulas, inequalities, simultaneous };

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
    return { ...d, via: d.via.filter((_, i) => keep[i]), ...(legs ? { legs } : {}), positive: d.positive ?? positive };
  };
  return { ...s, positive, make };
}

/** Each kept milestone's stretch, with those of the dropped ones before it. */
function joinLegs(legs: readonly RuleId[][], keep: readonly boolean[]): RuleId[][] {
  const out: RuleId[][] = [];
  let acc: RuleId[] = [];
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
  Object.entries(BY_CHAPTER).map(([id, levels]) => {
    const positive = chapterById(id)?.positive ?? false;
    return [id, Object.fromEntries(Object.entries(levels).map(([l, ss]) => [l, ss.map((s) => served(s, positive))])) as Record<Level, Shape[]>];
  }),
);
