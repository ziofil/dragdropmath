/**
 * Exercise sets of one's own (a teacher's, for their students), written in
 * YAML, checked, and shared as a link that carries the whole set: nothing is
 * stored anywhere but in the link.
 *
 *   title: Homework week 3
 *   moves: balance            # optional: a chapter (its id, number or title)
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
import { parse as parseYaml } from "yaml";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import type { RuleId } from "../rules";
import { ALL_RULES } from "../rules";
import { CHAPTERS, lettersPositive, rulesFor, type Chapter } from "./puzzles";
import { follows, isWrong, shapeMismatch } from "./answers";
import { autoDecoys } from "./autoDecoys";
import { allTitles, t } from "../i18n";
import type { Mismatch } from "./answers";

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

/** A chapter named by its id, its number (1, 2, …) or its title (in any language: a set is shared across them). */
export function chapterNamed(name: string): Chapter | undefined {
  const s = String(name).trim().toLowerCase();
  return CHAPTERS.find((c, i) => c.id === s || String(i + 1) === s || allTitles(c).some((title) => title.toLowerCase() === s));
}

function why(m: Mismatch): string {
  const s = t().set;
  return m.kind === "count" ? s.shapeCount : m.kind === "relation" ? s.shapeRelation : s.shapeIsolated(m.letter);
}

/** The chapter whose moves an exercise in a set uses, if one is named. */
export function chapterOf(set: ExerciseSet, ex: SetExercise): Chapter | undefined {
  const name = ex.moves ?? set.moves;
  return name === undefined ? undefined : chapterNamed(name);
}

/** The moves of an exercise in a set: its own chapter's, else the set's, else all. */
export function movesOf(set: ExerciseSet, ex: SetExercise): RuleId[] {
  const ch = chapterOf(set, ex);
  return ch ? rulesFor(CHAPTERS.indexOf(ch)) : ALL_RULES;
}

/** Its letters stand for positive numbers (its chapter's do). */
export function positiveOf(set: ExerciseSet, ex: SetExercise): boolean {
  const ch = chapterOf(set, ex);
  return ch ? lettersPositive(ch) : false;
}

const str = (v: unknown) => (typeof v === "number" ? String(v) : typeof v === "string" ? v.trim() : undefined);

function tryParse(src: string): MathState | string {
  try {
    return parseState(src);
  } catch (e) {
    return (e as Error).message;
  }
}

/** Read a set from YAML and check every exercise in it. */
export function readSet(text: string): CheckedSet {
  let raw: unknown;
  try {
    raw = parseYaml(text);
  } catch (e) {
    return { set: null, problems: [t().set.badYaml((e as Error).message.split("\n")[0])], exercises: [] };
  }
  const s = t().set;
  const obj = (raw ?? {}) as Record<string, unknown>;
  const problems: string[] = [];
  if (typeof raw !== "object" || Array.isArray(raw)) problems.push(s.expectedTop);
  const title = str(obj.title) || s.defaultTitle;
  const moves = str(obj.moves);
  if (moves !== undefined && !chapterNamed(moves)) problems.push(s.noChapter(moves));
  const list = Array.isArray(obj.exercises) ? obj.exercises : [];
  if (!Array.isArray(obj.exercises)) problems.push(s.expectedList);
  else if (list.length === 0) problems.push(s.emptyList);

  const exercises: SetExercise[] = list.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    const wrong = Array.isArray(o.wrong) ? o.wrong.map(str).filter((w): w is string => !!w) : undefined;
    return { start: str(o.start) ?? "", goal: str(o.goal) ?? "", ...(wrong ? { wrong } : {}), ...(str(o.hint) ? { hint: str(o.hint) } : {}), ...(str(o.moves) ? { moves: str(o.moves) } : {}) };
  });
  const set: ExerciseSet = { title, ...(moves ? { moves } : {}), exercises };
  return { set: problems.length ? null : set, problems, exercises: exercises.map((ex, i) => checkExercise(ex, i + 1)) };
}

function checkExercise(ex: SetExercise, n: number): CheckedExercise {
  const problems: string[] = [];
  const notes: string[] = [];
  let decoys: string[] = [];
  const s = t().set;
  if (!ex.start) problems.push(s.needsStart);
  if (!ex.goal) problems.push(s.needsGoal);
  if (ex.moves && !chapterNamed(ex.moves)) problems.push(s.noChapterShort(ex.moves));
  const start = ex.start ? tryParse(ex.start) : null;
  const goal = ex.goal ? tryParse(ex.goal) : null;
  if (typeof start === "string") problems.push(s.cantReadStart(start));
  if (typeof goal === "string") problems.push(s.cantReadGoal(goal));
  if (start && goal && typeof start !== "string" && typeof goal !== "string") {
    if (!follows(start, goal)) problems.push(s.doesntFollow);
    if (ex.wrong) {
      if (ex.wrong.length !== 2) problems.push(s.twoWrong);
      for (const w of ex.wrong) {
        const parsed = tryParse(w);
        const mismatch = typeof parsed === "string" ? null : shapeMismatch(goal, parsed);
        if (typeof parsed === "string") problems.push(s.cantReadWrong(w, parsed));
        else if (mismatch) problems.push(s.wrongShape(w, why(mismatch)));
        else if (!isWrong(goal, parsed) || follows(start, parsed)) problems.push(s.wrongIsRight(w));
      }
      decoys = ex.wrong.slice(0, 2);
    } else {
      decoys = autoDecoys(start, goal);
      if (decoys.length < 2) notes.push(s.noDecoys);
      else notes.push(s.decoysMade(decoys.join(", ")));
    }
  }
  return { n, exercise: ex, problems, notes, decoys: problems.length || decoys.length < 2 ? [] : decoys };
}

// ---------- the link ----------

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

/** The set packed small, for a link: [title, moves, [[start, goal, wrong1, wrong2, hint, moves], …]]. */
export async function encodeSet(set: ExerciseSet): Promise<string> {
  const packed = [set.title, set.moves ?? "", set.exercises.map((e) => [e.start, e.goal, e.wrong?.[0] ?? "", e.wrong?.[1] ?? "", e.hint ?? "", e.moves ?? ""])];
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
    ...(moves ? { moves } : {}),
    exercises: list.map((row) => {
      if (!Array.isArray(row) || !row.every(isText)) throw new Error("not an exercise");
      const [start, goal, w1, w2, hint, mv] = row as string[];
      if (!start || !goal || !parses(start) || !parses(goal)) throw new Error("not an exercise");
      return {
        start,
        goal,
        ...(w1 && w2 && parses(w1) && parses(w2) ? { wrong: [w1, w2] } : {}),
        ...(hint ? { hint } : {}),
        ...(mv ? { moves: mv } : {}),
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

