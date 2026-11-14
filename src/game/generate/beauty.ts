/**
 * What makes an exercise beautiful, as rules a program can check: hard rules
 * (a candidate breaking one is thrown away) and a score for ranking the rest.
 * The weights are a first guess, to be tuned against what the user keeps.
 */
import type { Draft } from "./write";

export type Verdict = { ok: boolean; why: string[]; score: number; notes: string[] };

/** Numbers a person writes without thinking twice. */
const FRIENDLY = 12;

export function judge(d: Draft): Verdict {
  const why: string[] = [];
  const notes: string[] = [];
  const abs = (n: number) => Math.abs(n);

  // ---- hard rules ----
  const x = d.answer;
  if (x !== undefined && (!Number.isInteger(x) || x === 0)) why.push("answer isn't a whole non-zero number");
  if (x !== undefined && abs(x) > 9) why.push("answer too big");
  if (d.numbers.some((n) => !Number.isInteger(n) || n === 0)) why.push("a 0 or a non-whole number in the start");
  if (d.numbers.some((n) => abs(n) > 30)) why.push("a number over 30 in the start");
  if (d.along.some((n) => !Number.isInteger(n) || abs(n) > 60)) why.push("a big number on the way");
  if (d.along.some((n) => n === 0)) why.push("something cancels to 0 on the way");

  // ---- score: 100, less for what makes it harder to read than it needs to be ----
  let score = 100;
  const pen = (points: number, note: string) => {
    if (points <= 0) return;
    score -= points;
    notes.push(`−${Math.round(points)} ${note}`);
  };
  const big = Math.max(0, ...d.numbers.map(abs));
  pen(2 * (big - FRIENDLY), `largest number ${big}`);
  const bigAlong = Math.max(0, ...d.along.map(abs));
  pen(bigAlong - 20, `${bigAlong} on the way`);
  const distinct = new Set(d.numbers.map(abs)).size;
  pen(3 * (distinct - 4), `${distinct} different numbers`);
  if (x !== undefined && x < 0) pen(4, "negative answer");
  if (x === 1) pen(6, "answer 1 feels like a trick");
  const minuses = (d.start.match(/-/g) ?? []).length;
  pen(2 * (minuses - 2), `${minuses} minus signs`);
  pen(d.start.length - 22, `${d.start.length} characters long`);
  // The answer showing up in the start gives it away.
  if (x !== undefined && d.numbers.map(abs).includes(abs(x))) pen(3, "the answer appears in the start");

  return { ok: why.length === 0, why, score, notes };
}
