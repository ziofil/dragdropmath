/** Factoring: take a common factor out in front — a number, a letter, a whole bracket — or factor in pairs. */
import { NESTED } from "./nested";
import { walked } from "../walk";
import { walks } from "../walks/factor";
import type { Level, Shape } from "../write";

/** Walked back from the factored answer (../walks/factor.ts); Hard also nests one thing in another, with x and y (nested.ts). */
export const shapes: Record<Level, Shape[]> = {
  easy: walks.easy.map((w) => walked(w, "factor")),
  medium: walks.medium.map((w) => walked(w, "factor")),
  hard: [...walks.hard.map((w) => walked(w, "factor")), ...NESTED.factor],
};
