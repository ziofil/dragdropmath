/**
 * Exercise shapes for the chapter "collect": like terms added together,
 * walked back from a tidy answer (../walks/collect.ts).
 */
import { walked } from "../walk";
import { walks } from "../walks/collect";
import type { Level, Shape } from "../write";

export const shapes: Record<Level, Shape[]> = {
  easy: walks.easy.map((w) => walked(w, "collect")),
  medium: walks.medium.map((w) => walked(w, "collect")),
  hard: walks.hard.map((w) => walked(w, "collect")),
};
