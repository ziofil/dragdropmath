/**
 * Exponentials and logarithms: one chapter, its lesson (a board per move)
 * and its practice, walked back from a tidy answer (../generate/walk.ts): a
 * number in front put into the log as a power, a power split or written over
 * another inside it, a log of a product split into a sum of logs, e to a log.
 * Letters are positive.
 */
import type { Chapter } from "../puzzles";
import { type Walk, walked } from "../generate/walk";
import { eOfLog, overPower, splitLog, splitPower } from "../generate/backs";
import { one, type Rng, type Level, type Shape, letter, one as pick } from "../generate/write";
import { d, letters2 } from "../generate/drill";

const BACK = ["power-into-log", "log-of-power", splitPower(), overPower(), splitLog()] as const;
/** With e to a log, too (e^(ln x) is x). */
const WITH_E = [...BACK, eOfLog()] as const;
const LOGS = ["log-of-power", "combine-logs", "power-into-log", "log-of-product"] as const;

const walk = (id: string, name: string, answer: (r: Rng) => string | null, steps: [number, number], back: Walk["back"] = BACK): Walk => ({
  id,
  name,
  answer,
  back,
  steps,
  needs: back === BACK ? [...LOGS] : [...LOGS, "exp-of-log"],
  positive: true,
});

const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [
    walk("walk-log-of-power", "a log of a power, written another way", (r) => `${r.int(2, 6)}ln(${one(r, ["x", "y", "a"])})`, [2, 3]),
    walk("walk-e-of-log", "e to a log, and a power", (r) => `${one(r, ["x", "y", "a"])}^${r.int(2, 5)}`, [2, 3], WITH_E),
  ],
  medium: [
    walk("walk-logs-of-powers", "logs of powers, added and taken away", (r) => `${r.int(2, 7)}ln(x)`, [3, 4]),
    walk("walk-two-logs", "logs of two letters", (r) => `${r.int(2, 5)}ln(x) + ${r.int(2, 5)}ln(y)`, [3, 4]),
    walk("walk-e-and-logs", "e to logs of powers", (r) => `x^${r.int(2, 4)}·y^${r.int(2, 4)}`, [3, 4], WITH_E),
  ],
  hard: [
    walk("walk-logs-every-way", "logs of powers, every way at once", (r) => `${r.int(2, 6)}ln(x) + ${r.int(2, 4)}ln(y)`, [5, 7]),
    walk("walk-e-every-way", "e to logs, and logs of powers, every way at once", (r) => `${r.int(2, 4)}ln(x) + y^${r.int(2, 4)}`, [5, 7], WITH_E),
  ],
};

const levels = (): Record<Level, Shape[]> => ({
  easy: walks.easy.map((w) => walked(w, "explog")),
  medium: walks.medium.map((w) => walked(w, "explog")),
  hard: walks.hard.map((w) => walked(w, "explog")),
});

export const explog: Chapter = {
  id: "explog",
  title: "Exponentials and logarithms",
  blurb: "ln(x) is the power of e that gives x. So ln and e^ undo each other, and the log of a product is a sum of logs.",
  after: ["roots"],
  unlocks: [
    "exp-of-log",
    "log-of-product",
    "log-of-power",
    "power-into-log",
    "combine-logs",
    "evaluate-log",
    "power-of-base",
  ],
  positive: true,
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    d("exp-of-log", (r) => (r.next() < 0.5 ? `e^(ln(${letter(r)}))` : `2^(log_2(${letter(r)}))`)),
    d("evaluate-log", (r) => (r.next() < 0.5 ? `${letter(r)} + ln(e)` : `log_${r.int(2, 9)}(1) + ${letter(r)}`)),
    // A log of a product, then of a power (x³ = x·x·x: the logs add up); working out log₂(8) takes the latter (8 = 2³, then the 3 comes out).
    d("log-of-product", (r) => `ln(${r.int(2, 9)}${letter(r)})`),
    d("log-of-power", (r) => `ln(${letter(r)}^${r.int(2, 5)})`),
    d("power-of-base", (r) => {
      const k = r.int(2, 5);
      return { start: `log_2(${2 ** k})`, goal: `${k}` };
    }),
    d("power-into-log", (r) => `${r.int(2, 5)}ln(${letter(r)})`),
    d("combine-logs", (r) => {
      const [x, y] = letters2(r);
      return `ln(${x}) ${pick(r, ["+", "-"])} ln(${y})`;
    }),
    // Back to Roots: a root is a power, so its exponent comes out of the log too.
    d("log-of-root", (r) => {
      const x = letter(r);
      return { start: `ln(√${x})`, goal: `(1/2)ln(${x})` };
    }, "root-notation"),
  ],
  stepsBack: () => ["power-into-log", "log-of-power", splitLog()],
  levels,
};
