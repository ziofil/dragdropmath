/**
 * Factoring, walked back from a factored answer (see walk.ts): multiplied
 * out, a bracket or a term at a time, then its numbers worked out, as the
 * start is written. Undone by taking the factor (or bracket) out again.
 */
import type { MathState } from "../../../expr/types";
import { printState } from "../../../expr/key";
import type { Walk } from "../walk";
import { written } from "../backs";
import { gcd, lin, one, type Rng } from "../write";

const FACTORING = ["factor-out", "factor-shared"] as const;
/** Multiplying out, the step back; the numbers worked out after. */
const BACK = ["distribute"] as const;

/** a·x + b with no common factor (so what's taken out is all there is). */
function inner(r: Rng, x = "x"): string | null {
  const a = r.int(1, 5);
  const b = r.signed(1, 9);
  return gcd(a, b) === 1 ? lin(a, b, x) : null;
}

const walk = (id: string, name: string, answer: Walk["answer"], steps: [number, number] = [1, 2], whole = false): Walk => ({
  id,
  name,
  answer,
  back: BACK,
  steps,
  settle: written,
  // Hard starts are all multiplied out (nothing half factored to begin with): it walks on until no bracket is left.
  ...(whole ? { alone: true, fits: (s: MathState) => !printState(s).includes("(") } : {}),
  needs: [...FACTORING],
});

/** x + a, x − a. */
const xPlus = (a: number, x = "x") => `${x} ${a < 0 ? "-" : "+"} ${Math.abs(a)}`;

/** Two different numbers, either sign, up to `max`. */
function twoOf(r: Rng, max: number): [number, number] | null {
  const [a, b] = [r.signed(1, max), r.signed(1, max)];
  return a === b ? null : [a, b];
}

export const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [
    walk("walk-number-out", "a number out in front", (r) => ((i) => i && `${r.int(2, 6)}(${i})`)(inner(r))),
    walk("walk-letter-out", "a letter out in front", (r) => {
      const x = one(r, ["x", "y", "a"]);
      const [a, b] = [r.int(1, 4), r.signed(1, 9)];
      return gcd(a, b) === 1 ? `${x}(${lin(a, b, x)})` : null;
    }),
    walk("walk-number-and-letter", "a number and a letter out in front", (r) => ((i) => i && `${r.int(2, 5)}x(${i})`)(inner(r))),
    walk("walk-bracket-out", "a whole bracket out in front", (r) => ((i) => i && `(${xPlus(r.signed(1, 7))})(${i})`)(inner(r)), [1, 1]),
  ],
  medium: [
    walk("walk-pairs", "four terms in pairs", (r) => ((p) => p && `(${xPlus(p[0])})(${xPlus(p[1])})`)(twoOf(r, 7)), [2, 3]),
    walk("walk-number-then-pairs", "a number out first, then pairs", (r) => ((p) => p && `${r.int(2, 4)}(${xPlus(p[0])})(${xPlus(p[1])})`)(twoOf(r, 5)), [2, 4]),
    walk("walk-pairs-cube", "four terms in pairs, with a cube", (r) => ((p) => p && `(x^2 ${p[0] < 0 ? "-" : "+"} ${Math.abs(p[0])})(${xPlus(p[1])})`)(twoOf(r, 6)), [2, 3]),
  ],
  hard: [
    walk("walk-pairs-two-letters", "pairs, with x and y", (r) => {
      const p = twoOf(r, 5);
      return p && `(x ${p[0] < 0 ? "-" : "+"} ${Math.abs(p[0]) === 1 ? "" : Math.abs(p[0])}y)(x ${p[1] < 0 ? "-" : "+"} ${Math.abs(p[1]) === 1 ? "" : Math.abs(p[1])}y)`;
    }, [3, 12], true),
    walk("walk-number-then-pairs-two-letters", "a number out first, then pairs with x and y", (r) => {
      const p = twoOf(r, 4);
      const y = (k: number) => `${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}y`;
      return p && `${r.int(2, 4)}(x ${y(p[0])})(x ${y(p[1])})`;
    }, [3, 12], true),
    walk("walk-pairs-numbers", "pairs, with x and y and numbers in front", (r) => {
      const [p, q, a] = [r.int(2, 5), r.signed(1, 5), r.int(2, 3)];
      return gcd(p, q) === 1 && Math.abs(q * a) <= 30 ? `(x + ${a}y)(${p}x ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}y)` : null;
    }, [3, 12], true),
    walk("walk-common-xy", "a number and both letters out in front", (r) => {
      const [a, b] = [r.int(1, 4), r.signed(1, 6)];
      return gcd(a, b) === 1 ? `${r.int(2, 4)}xy(${lin(a, b)} ${b < 0 ? "+" : "-"} y)` : null;
    }, [1, 2]),
  ],
};
