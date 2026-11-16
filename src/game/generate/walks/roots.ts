/**
 * Roots, walked back from a tidy answer (see walk.ts): square, cube and
 * fourth roots, and roots as fraction powers, as Powers and Fractions allow —
 * a number in front put under its root (3√2 → √18, 2∛3 → ∛24), a power
 * written as a root of a bigger power (x² → ∛x⁶), a fraction power split
 * into a whole power and a root (x^(5/2) → x²√x), a root written as a power
 * and back, a term split into like roots, a root of a product split or two
 * roots joined. Letters are positive.
 */
import type { Walk } from "../walk";
import { rootIn, rootOfPower, splitFractionPower, splitLike } from "../backs";
import { one, type Rng } from "../write";

const BACK = [splitLike(6), rootIn(), rootOfPower(), splitFractionPower(), "root-notation", "pull-out-of-power", "join-powers"] as const;
const ROOTS = ["pull-out-of-power", "join-powers", "split-square", "evaluate-root", "root-notation"] as const;

/** More than writing a root as a power: a root to split, work out, or join. */
const REAL = ROOTS.filter((x) => x !== "root-notation");

/** k times the nth root of m (m with no nth power in it). */
const kroot = (k: number, n: number, m: number) => `${k === 1 ? "" : k}${n === 2 ? `√${m}` : `root_${n}(${m})`}`;
const FREE = [2, 3, 5, 6, 7];

const walk = (id: string, name: string, answer: (r: Rng) => string | null, steps: [number, number], needs: readonly string[] = ROOTS): Walk => ({
  id,
  name,
  answer,
  back: BACK,
  steps,
  needs: needs as Walk["needs"],
  positive: true,
});

export const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [
    walk("walk-root", "a square or cube root, written another way", (r) => kroot(r.int(2, 4), one(r, [2, 2, 3]), one(r, FREE)), [2, 3], REAL),
    walk("walk-letter-root", "a number times the root of a letter", (r) => kroot(r.int(2, 4), 2, 0).replace("0", one(r, ["x", "y", "a"])), [2, 3]),
    walk("walk-root-of-power", "a root of a power", (r) => `${one(r, ["x", "y", "a"])}^${r.int(2, 3)}`, [1, 3]),
  ],
  medium: [
    walk("walk-fraction-power", "a fraction power, as roots and powers", (r) => {
      const b = one(r, [2, 3]);
      const a = b * r.int(1, 2) + r.int(1, b - 1);
      return `x^(${a}/${b})`;
    }, [3, 5]),
    walk("walk-root-and-letter", "roots and letters together", (r) => `${kroot(r.int(2, 4), one(r, [2, 3]), one(r, FREE))} + ${r.int(2, 5)}x`, [3, 5]),
    walk("walk-like-roots", "like roots, one written another way", (r) => `${kroot(r.int(2, 6), one(r, [2, 3]), one(r, FREE))}`, [3, 5]),
  ],
  hard: [
    walk("walk-two-roots", "a square root and a cube root, every way at once", (r) => `${kroot(r.int(2, 3), 2, one(r, FREE))} + ${kroot(r.int(2, 3), 3, one(r, [2, 3]))}`, [4, 5]),
    walk("walk-powers-and-roots", "fraction powers of two letters", (r) => `x^(${one(r, [3, 5, 7])}/2)·y^(${one(r, [2, 4, 5])}/3)`, [4, 5]),
    walk("walk-letter-roots", "roots of letters and numbers, every way at once", (r) => `${kroot(r.int(2, 3), 2, one(r, FREE))}·x^(${one(r, [3, 5])}/2)`, [4, 5]),
  ],
};
