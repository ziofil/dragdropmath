/**
 * Powers, walked back from a tidy answer (see walk.ts): a power split into a
 * product of powers, nested in another, written over a power, or grouped
 * with others to the same power — anywhere in it, in any order.
 * Letters are positive.
 */
import type { Walk } from "../walk";
import { groupPower, nestPower, overPower, splitPower } from "../backs";
import { one, pw, type Rng } from "../write";

const BACK = [splitPower(), nestPower(), overPower(), groupPower()];
const POWERS = ["merge-powers", "power-of-power", "divide-powers", "power-of-product"] as const;

/** k·x^a·y^b as written (k left out when 1). */
const term = (k: number, parts: [string, number][]) => `${k === 1 ? "" : k}${parts.map(([x, n]) => pw(x, n)).join("·")}`;

const walk = (id: string, name: string, answer: (r: Rng) => string | null, steps: [number, number]): Walk => ({
  id,
  name,
  answer,
  back: BACK,
  steps,
  needs: [...POWERS],
  positive: true,
});

export const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [
    walk("walk-one-letter", "one letter's power, written the long way", (r) => term(1, [[one(r, ["x", "y", "a"]), r.int(3, 9)]]), [1, 2]),
    walk("walk-number-and-letter", "a number and a letter's power", (r) => term(one(r, [2, 3, 4, 5]), [["x", r.int(3, 8)]]), [1, 2]),
  ],
  medium: [
    walk("walk-two-letters", "two letters' powers", (r) => term(1, [["x", r.int(2, 8)], ["y", r.int(2, 8)]]), [2, 3]),
    walk("walk-cube-number", "a number that is a power, and letters", (r) => {
      const n = r.int(2, 3);
      return term(one(r, n === 2 ? [4, 9, 16, 25] : [8, 27]), [["x", n * r.int(1, 2)], ["y", n]]);
    }, [2, 3]),
  ],
  hard: [
    walk("walk-three-letters", "three letters' powers, every way at once", (r) => term(1, [["a", r.int(2, 6)], ["b", r.int(2, 6)], ["c", r.int(2, 6)]]), [3, 4]),
    walk("walk-number-letters", "a number and two letters, every way at once", (r) => term(one(r, [4, 8, 9, 16, 27]), [["x", r.int(2, 9)], ["y", r.int(2, 6)]]), [3, 4]),
  ],
};
