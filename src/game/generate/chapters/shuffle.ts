/**
 * Exercise shapes for the chapter "shuffle": terms in any order, numbers
 * worked out. Walked back from a tidy answer (../walks/shuffle.ts).
 */
import { walked } from "../walk";
import { walks } from "../walks/shuffle";
import type { Level, Shape } from "../write";

export const shapes: Record<Level, Shape[]> = {
  easy: walks.easy.map((w) => walked(w, "shuffle")),
  medium: walks.medium.map((w) => walked(w, "shuffle")),
  hard: walks.hard.map((w) => walked(w, "shuffle")),
};
