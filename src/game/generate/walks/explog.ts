/**
 * Logs, walked back from a tidy answer (see walk.ts): a number in front put
 * into the log as a power, a power split or written over another inside it,
 * a log of a product split into a sum of logs. Letters are positive.
 */
import type { Walk } from "../walk";
import { overPower, splitLog, splitPower } from "../backs";
import { one, type Rng } from "../write";

const BACK = ["power-into-log", "log-of-power", splitPower(), overPower(), splitLog()] as const;
const LOGS = ["log-of-power", "combine-logs", "power-into-log", "log-of-product"] as const;

const walk = (id: string, name: string, answer: (r: Rng) => string | null, steps: [number, number]): Walk => ({
  id,
  name,
  answer,
  back: BACK,
  steps,
  needs: [...LOGS],
  positive: true,
});

export const walks: Record<"easy" | "medium" | "hard", Walk[]> = {
  easy: [walk("walk-log-of-power", "a log of a power, written another way", (r) => `${r.int(2, 6)}ln(${one(r, ["x", "y", "a"])})`, [1, 2])],
  medium: [
    walk("walk-logs-of-powers", "logs of powers, added and taken away", (r) => `${r.int(2, 7)}ln(x)`, [2, 3]),
    walk("walk-two-logs", "logs of two letters", (r) => `${r.int(2, 5)}ln(x) + ${r.int(2, 5)}ln(y)`, [2, 3]),
  ],
  hard: [walk("walk-logs-every-way", "logs of powers, every way at once", (r) => `${r.int(2, 6)}ln(x) + ${r.int(2, 4)}ln(y)`, [3, 4])],
};
