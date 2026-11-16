/**
 * Players who pick a Mind's eye answer without reading the question: from the
 * three cards alone. Their scores say whether the wrong answers give the right
 * one away (autoDecoys.test.ts).
 */
import { parseState } from "../../expr/parse";
import { evaluate } from "../../expr/eval";
import { isConstant } from "../../expr/eval";

/** Edit distance between two strings. */
function edits(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur.push(Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
    prev = cur;
  }
  return prev[b.length];
}

/** The card nearest the other two, by some distance (the first on a tie). */
function hub(n: number, dist: (i: number, j: number) => number): number {
  let best = 0;
  let bestSum = Infinity;
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) if (j !== i) s += dist(i, j);
    if (s < bestSum) [best, bestSum] = [i, s];
  }
  return best;
}

/** The card each blind player picks (undefined: that player can't play these cards). */
export function blindPicks(cards: readonly string[]): Record<string, number | undefined> {
  const out: Record<string, number | undefined> = {};
  // Closest to the other two as written.
  out.middleCard = hub(cards.length, (i, j) => edits(cards[i], cards[j]));
  // Closest to the other two in value, where each card gives one letter a number.
  const values = cards.map((c) => {
    const s = parseState(c);
    if (s.sides.length !== 2 || s.sides[0].kind !== "var" || !isConstant(s.sides[1])) return NaN;
    return evaluate(s.sides[1], {});
  });
  out.middleValue = values.every(Number.isFinite) ? hub(cards.length, (i, j) => Math.abs(values[i] - values[j])) : undefined;
  return out;
}
