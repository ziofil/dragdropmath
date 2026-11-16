/**
 * Exercise sets of one's own (a teacher's, for their students), written in
 * YAML, checked, and shared as a link that carries the whole set: nothing is
 * stored anywhere but in the link.
 *
 *   title: Homework week 3
 *   moves: balance            # optional: a chapter (its id, number or title; a link keeps its id)
 *   exercises:
 *     - start: 2x + 3 = 11
 *       goal: x = 4
 *       wrong: [x = 7, x = 8] # optional: two wrong answers for guessing first
 *       hint: Take the 3 across first.
 *       moves: collect        # optional, for this exercise only
 *
 * The moves are a chapter's (with every chapter before it, as in the learning
 * path); without `moves`, all of them. Without `wrong`, wrong answers are made
 * from classic slips (autoDecoys).
 */
import { parseState } from "../expr/parse";
import type { RuleId } from "../rules";
import { ALL_RULES } from "../rules";
import { CHAPTERS, lettersPositive, rulesOf, type Chapter } from "./puzzles";
import { allTitles } from "../i18n";

export type SetExercise = { start: string; goal: string; wrong?: string[]; hint?: string; moves?: string };
export type ExerciseSet = { title: string; moves?: string; exercises: SetExercise[] };

/** One exercise as checked: what's wrong with it (it can't be used), and what to know. */
export type CheckedExercise = {
  n: number;
  exercise: SetExercise;
  problems: string[];
  notes: string[];
  /** The two wrong answers it'll be guessed with (its own, or made), if any. */
  decoys: string[];
};

export type CheckedSet = { set: ExerciseSet | null; problems: string[]; exercises: CheckedExercise[] };

/** Reading and checking a set's YAML: readSet.ts (with the YAML library, loaded only by the set maker). */

/** A chapter named by its id, its number on the path (1, 2, …) or its title (in any language: a set is shared across them). */
export function chapterNamed(name: string): Chapter | undefined {
  const s = String(name).trim().toLowerCase();
  return CHAPTERS.find((c, i) => c.id === s || String(i + 1) === s || allTitles(c).some((title) => title.toLowerCase() === s));
}

/**
 * The chapters' order until 2026-11-15 (commit bab30f7), when links kept a
 * chapter the way the teacher wrote it: a number in a link made then means
 * this order. Links now keep the chapter's id.
 */
const NUMBERED_UNTIL_2026_11_15 = ["shuffle", "collect", "distribute", "brackets", "balance", "powers", "factor", "formulas", "inequalities", "fractions", "simultaneous", "roots", "explog"];

/** A chapter as a link keeps it: its id (a name no chapter has stays as it is, and is reported when checked). */
const toLink = (name: string | undefined) => (name ? (chapterNamed(name)?.id ?? name) : "");
/** A chapter as a link kept it: a number from an old link is a chapter of the order then. */
const fromLink = (name: string) => (/^\d+$/.test(name.trim()) ? (NUMBERED_UNTIL_2026_11_15[Number(name) - 1] ?? name) : name);

/** The chapter whose moves an exercise in a set uses, if one is named. */
export function chapterOf(set: ExerciseSet, ex: SetExercise): Chapter | undefined {
  const name = ex.moves ?? set.moves;
  return name === undefined ? undefined : chapterNamed(name);
}

/** The moves of an exercise in a set: its own chapter's, else the set's, else all. */
export function movesOf(set: ExerciseSet, ex: SetExercise): RuleId[] {
  const ch = chapterOf(set, ex);
  return ch ? rulesOf(ch.id) : ALL_RULES;
}

/** Its letters stand for positive numbers: as its chapter's would, or (no chapter) where it has a power, a root or a log. */
export const positiveOf = (set: ExerciseSet, ex: SetExercise): boolean => lettersPositive(chapterOf(set, ex), ex.start);

// ---------- the link ----------

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

/** The set packed small, for a link: [title, moves, [[start, goal, wrong1, wrong2, hint, moves], …]], chapters by id. */
export async function encodeSet(set: ExerciseSet): Promise<string> {
  const packed = [set.title, toLink(set.moves), set.exercises.map((e) => [e.start, e.goal, e.wrong?.[0] ?? "", e.wrong?.[1] ?? "", e.hint ?? "", toLink(e.moves)])];
  return b64url(await pipe(new TextEncoder().encode(JSON.stringify(packed)), new CompressionStream("deflate-raw")));
}

/** The set in a link. A link that isn't one (cut short, or made by hand) throws. */
export async function decodeSet(code: string): Promise<ExerciseSet> {
  const json = new TextDecoder().decode(await pipe(unb64url(code), new DecompressionStream("deflate-raw")));
  const packed: unknown = JSON.parse(json);
  const isText = (v: unknown): v is string => typeof v === "string";
  const parses = (v: string) => {
    try {
      parseState(v);
      return true;
    } catch {
      return false;
    }
  };
  if (!Array.isArray(packed) || !isText(packed[0]) || !isText(packed[1]) || !Array.isArray(packed[2])) throw new Error("not a set");
  const [title, moves, list] = packed as [string, string, unknown[]];
  return {
    title,
    ...(moves ? { moves: fromLink(moves) } : {}),
    exercises: list.map((row) => {
      if (!Array.isArray(row) || !row.every(isText)) throw new Error("not an exercise");
      const [start, goal, w1, w2, hint, mv] = row as string[];
      if (!start || !goal || !parses(start) || !parses(goal)) throw new Error("not an exercise");
      return {
        start,
        goal,
        ...(w1 && w2 && parses(w1) && parses(w2) ? { wrong: [w1, w2] } : {}),
        ...(hint ? { hint } : {}),
        ...(mv ? { moves: fromLink(mv) } : {}),
      };
    }),
  };
}

/** A short, stable name for a set (from its link), for keeping progress: the same set, the same progress. */
export function setKey(code: string): string {
  let h = 2166136261;
  for (let i = 0; i < code.length; i++) h = Math.imul(h ^ code.charCodeAt(i), 16777619) >>> 0;
  return h.toString(36);
}

