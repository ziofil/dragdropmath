/**
 * Powers: multiply, divide, a power of a power, negative exponents, numbers
 * in front. Letters are positive. Walked back from a tidy answer
 * (../walks/powers.ts); Hard every way at once. (Powers with brackets to
 * multiply out come after the distributive law: chapters/brackets.ts.)
 */
import { walked } from "../walk";
import { walks } from "../walks/powers";
import type { Level, Shape } from "../write";

export const shapes: Record<Level, Shape[]> = {
  easy: walks.easy.map((w) => walked(w, "powers")),
  medium: walks.medium.map((w) => walked(w, "powers")),
  hard: walks.hard.map((w) => walked(w, "powers")),
};
