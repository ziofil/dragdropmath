/**
 * Equations whose numbers in front are fractions or roots, as the book uses
 * them once Fractions and Roots have come: ⅔x − 1 = 3, √2·x + 3 = 5 (its
 * answer, 2/√2, made whole underneath: √2). Built back from their answers
 * (back.ts): the letter's term alone first, then the number beside it.
 */
import { parseState } from "../../expr/parse";
import { build, draftOf } from "./back";
import { ex, restate } from "./unmove";
import { gcd, one, type Draft, type Rng, type Shape } from "./write";

const plusMinus = (b: number) => (b < 0 ? ` - ${-b}` : ` + ${b}`);

/** From `answer`: `term = value`, then the row as written. */
function made(shape: string, answer: string, term: string, value: string, row: string, r: Rng): Draft | null {
  const [l, rt] = parseState(row).sides;
  const b = build(parseState(answer), [restate([], ex(term), ex(value)), restate([], l, rt)], r);
  return b && { ...draftOf(shape, b), legs: undefined };
}

export const fractionCoefficient: Shape = {
  id: "fraction-coefficient",
  name: "a fraction in front of the letter",
  make: (r) => {
    // (p/q)·x + b = c, x a multiple of q.
    const [p, q] = [r.int(1, 5), one(r, [2, 3, 4, 5])];
    if (gcd(p, q) !== 1) return null;
    const x0 = q * r.signed(1, 3);
    const b = r.signed(1, 9);
    const c = (p * x0) / q + b;
    const x = one(r, ["x", "x", "y", "t"]);
    const front = `(${p}/${q})${x}`;
    const row = r.next() < 0.3 ? `${c} = ${front}${plusMinus(b)}` : `${front}${plusMinus(b)} = ${c}`;
    return made("fraction-coefficient", `${x} = ${x0}`, front, `${(p * x0) / q}`, row, r);
  },
};

export const rootCoefficient: Shape = {
  id: "root-coefficient",
  name: "a root in front of the letter",
  make: (r) => {
    // √m·x + b = c with x = k√m: √m·x = k·m, so x = km/√m, made whole underneath: k√m.
    const m = one(r, [2, 3, 5, 6, 7]);
    const k = r.int(1, 3);
    const b = r.signed(1, 9);
    const c = k * m + b;
    const x = one(r, ["x", "x", "y"]);
    return made("root-coefficient", `${x} = ${k === 1 ? "" : k}√${m}`, `√${m}·${x}`, `${k * m}`, `√${m}·${x}${plusMinus(b)} = ${c}`, r);
  },
};
