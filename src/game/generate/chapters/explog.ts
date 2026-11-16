/**
 * Exponentials and logarithms: logs of products and powers, e to a log.
 * Letters are positive. Walked back from a tidy answer (../walks/explog.ts).
 */
import { walked } from "../walk";
import { walks } from "../walks/explog";
import type { Level, Shape } from "../write";

export const shapes: Record<Level, Shape[]> = {
  easy: walks.easy.map((w) => walked(w, "explog")),
  medium: walks.medium.map((w) => walked(w, "explog")),
  hard: walks.hard.map((w) => walked(w, "explog")),
};
