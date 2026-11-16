/**
 * Roots: one chapter, its lesson (a board per move) and its practice —
 * square, cube and higher roots, and roots as fraction powers, walked back
 * from a tidy answer (../generate/walk.ts): a number in front put under its
 * root (3√2 → √18), a power written as a root of a bigger power (x² → ∛x⁶),
 * a fraction power split into a whole power and a root (x^(5/2) → x²√x), a
 * root written as a power and back, like roots split. Letters are positive.
 */
import type { Chapter } from "../puzzles";
import { type Walk, walked } from "../generate/walk";
import { rootIn, rootOfPower, splitFractionPower, splitLike } from "../generate/backs";
import { one, type Rng, type Level, type Shape, letter, one as pick } from "../generate/write";
import { d, carrying } from "../generate/drill";

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

const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
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

const levels = (): Record<Level, Shape[]> => ({
  easy: walks.easy.map((w) => walked(w, "roots")),
  medium: walks.medium.map((w) => walked(w, "roots")),
  hard: walks.hard.map((w) => walked(w, "roots")),
});

export const roots: Chapter = {
  id: "roots",
  title: "Roots",
  blurb: "√x is x to the power ½, and ∛x is x to the power ⅓, so the rules for powers work for roots too.",
  after: ["fractions"],
  unlocks: ["root-notation", "split-square", "evaluate-root", "pull-out-of-power", "join-powers"],
  positive: true,
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    // Square roots mostly, now and then a cube or fourth root.
    d("evaluate-root", (r) => (r.next() < 0.6 ? `√${pick(r, [4, 9, 16, 25, 36, 49, 64, 81, 100])}` : pick(r, ["root_3(8)", "root_3(27)", "root_3(64)", "root_4(16)", "root_4(81)"]))),
    d("pull-out-of-power", (r) => {
      const x = letter(r);
      if (r.next() < 0.6) {
        const a = r.int(2, 5);
        return { start: `√(${a * a}${x})`, goal: `${a}√${x}` };
      }
      const a = r.int(2, 3);
      return { start: `root_3(${a ** 3}${x})`, goal: `${a}root_3(${x})` };
    }),
    // Then a number that isn't a square: split under the root so one splits off (then it's pulled out, as above).
    d("split-square", (r) => {
      // √(a²·b) → a√b; ∛(a³·b) → a∛b.
      if (r.next() < 0.6) {
        const [a, b] = pick(r, [[2, 2], [2, 3], [3, 2], [2, 5], [3, 3], [3, 5], [5, 2]] as const);
        return { start: `√${a * a * b}`, goal: `${a}√${b}` };
      }
      const [a, b] = pick(r, [[2, 2], [2, 3], [3, 2]] as const);
      return { start: `root_3(${a ** 3 * b})`, goal: `${a}root_3(${b})` };
    }),
    d("join-powers", (r) => {
      const [a, b] = pick(r, [[2, 3], [2, 5], [3, 5], [2, 7], [3, 7], [5, 7]] as const);
      return { start: `√${a}·√${b}`, goal: `√${a * b}` };
    }),
    d("root-notation", (r) => `${r.next() < 0.6 ? "√" : `root_${r.int(3, 4)}`}(${letter(r)}) + ${r.int(2, 9)}`),
    // Back to Powers: a root of a power is a power of a power.
    d("root-of-power", (r) => {
      const [x, n, m] = [letter(r), pick(r, [2, 3, 3, 4]), r.int(2, 3)];
      return { start: `${n === 2 ? "√" : `root_${n}`}(${x}^${n * m})`, goal: `${x}^${m}` };
    }, "root-notation"),
    // Back to Powers and Fractions: a root times a power, as one power (the exponents add, as fractions).
    d("fraction-power", (r) => {
      const [x, k] = [letter(r), r.int(1, 3)];
      // (x¹ is written x: it's what tidying makes of it.)
      return { start: `√${x}·${k === 1 ? x : `${x}^${k}`}`, goal: `${x}^(${2 * k + 1}/2)` };
    }, "merge-powers"),
    // A whole number under the bar: the root that's there, dropped onto the top (Fractions' own move).
    carrying("bottom", d("rationalise", (r) => {
      const [a, b] = [r.int(1, 5), pick(r, [2, 3, 5, 6, 7])];
      const goal = a % b === 0 ? `${a / b === 1 ? "" : a / b}√${b}` : `${a === 1 ? "" : a}√${b}/${b}`;
      return { start: `${a}/√${b}`, goal };
    }, "expand-fraction")),
  ],
  stepsBack: () => [rootIn(), "root-notation", rootOfPower(), splitFractionPower(), "pull-out-of-power", "join-powers"],
  levels,
};
