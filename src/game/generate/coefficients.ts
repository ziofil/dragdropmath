/**
 * Equations whose numbers in front are fractions or roots, as the book uses
 * them once Fractions and Roots have come: ⅔x − 1 = 3, √2·x + 3 = 5 (its
 * answer, 2/√2, made whole underneath: √2). Made from their answers.
 */
import { gcd, one, type Draft, type Shape } from "./write";

const plusMinus = (b: number) => (b < 0 ? ` - ${-b}` : ` + ${b}`);

export const fractionCoefficient: Shape = {
  id: "fraction-coefficient",
  name: "a fraction in front of the letter",
  make: (r): Draft | null => {
    // (p/q)·x + b = c, x a multiple of q.
    const [p, q] = [r.int(1, 5), one(r, [2, 3, 4, 5])];
    if (gcd(p, q) !== 1) return null;
    const x0 = q * r.signed(1, 3);
    const b = r.signed(1, 9);
    const c = (p * x0) / q + b;
    const x = one(r, ["x", "x", "y", "t"]);
    const front = `(${p}/${q})${x}`;
    const start = r.next() < 0.3 ? `${c} = ${front}${plusMinus(b)}` : `${front}${plusMinus(b)} = ${c}`;
    return { shape: "fraction-coefficient", start, goal: `${x} = ${x0}`, via: [] };
  },
};

export const rootCoefficient: Shape = {
  id: "root-coefficient",
  name: "a root in front of the letter",
  make: (r): Draft | null => {
    // √m·x + b = c with x = k√m: √m·x = k·m, so x = km/√m, made whole underneath: k√m.
    const m = one(r, [2, 3, 5, 6, 7]);
    const k = r.int(1, 3);
    const b = r.signed(1, 9);
    const c = k * m + b;
    const x = one(r, ["x", "x", "y"]);
    return { shape: "root-coefficient", start: `√${m}·${x}${plusMinus(b)} = ${c}`, goal: `${x} = ${k === 1 ? "" : k}√${m}`, via: [`√${m}·${x} = ${k * m}`] };
  },
};
