/**
 * Exercise shapes for the chapter "collect": like terms added together.
 * Walked back from a tidy answer (../walks/collect.ts), and composed from
 * pieces (../composeExpr.ts).
 */
import { composedExpression } from "../composeExpr";
import { walked } from "../walk";
import { walks } from "../walks/collect";
import type { Level, Shape } from "../write";

export const shapes: Record<Level, Shape[]> = {
  easy: [...walks.easy.map((w) => walked(w, "collect")), composedExpression("collect", "easy", 4)],
  medium: [...walks.medium.map((w) => walked(w, "collect")), composedExpression("collect", "medium", 4)],
  hard: [...walks.hard.map((w) => walked(w, "collect")), composedExpression("collect", "hard", 4)],
};
