/**
 * Roots: square, cube and higher roots, and roots as fraction powers.
 * Letters are positive. Walked back from a tidy answer (../walks/roots.ts).
 */
import { walked } from "../walk";
import { walks } from "../walks/roots";
import type { Level, Shape } from "../write";

export const shapes: Record<Level, Shape[]> = {
  easy: walks.easy.map((w) => walked(w, "roots")),
  medium: walks.medium.map((w) => walked(w, "roots")),
  hard: walks.hard.map((w) => walked(w, "roots")),
};
