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
import { CHAPTERS, rulesFor, type Chapter } from "./puzzles";
import { follows, isWrong, shapeMismatch } from "./answers";
import { autoDecoys } from "./autoDecoys";

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

/** A chapter named by its id, its number (1, 2, …) or its title. */
export function chapterNamed(name: string): Chapter | undefined {
  const s = String(name).trim().toLowerCase();
  return CHAPTERS.find((c, i) => c.id === s || String(i + 1) === s || c.title.toLowerCase() === s);
}

/** The moves of an exercise in a set: its own chapter's, else the set's, else all. */
export function movesOf(set: ExerciseSet, ex: SetExercise): RuleId[] {
  const name = ex.moves ?? set.moves;
  const ch = name === undefined ? undefined : chapterNamed(name);
  return ch ? rulesFor(CHAPTERS.indexOf(ch)) : ALL_RULES;
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
    return { set: null, problems: [`This isn't valid YAML: ${(e as Error).message.split("\n")[0]}`], exercises: [] };
  }
  const obj = (raw ?? {}) as Record<string, unknown>;
  const problems: string[] = [];
  if (typeof raw !== "object" || Array.isArray(raw)) problems.push("Expected `title:` and `exercises:` at the top.");
  const title = str(obj.title) || "My exercises";
  const moves = str(obj.moves);
  if (moves !== undefined && !chapterNamed(moves)) problems.push(`No chapter called "${moves}" for \`moves:\` (use a chapter's number, id or title).`);
  const list = Array.isArray(obj.exercises) ? obj.exercises : [];
  if (!Array.isArray(obj.exercises)) problems.push("Expected a list under `exercises:`.");
  else if (list.length === 0) problems.push("The list under `exercises:` is empty.");

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
  if (!ex.start) problems.push("It needs a `start:`.");
  if (!ex.goal) problems.push("It needs a `goal:`.");
  if (ex.moves && !chapterNamed(ex.moves)) problems.push(`No chapter called "${ex.moves}" for \`moves:\`.`);
  const start = ex.start ? tryParse(ex.start) : null;
  const goal = ex.goal ? tryParse(ex.goal) : null;
  if (typeof start === "string") problems.push(`Can't read the start: ${start}`);
  if (typeof goal === "string") problems.push(`Can't read the goal: ${goal}`);
  if (start && goal && typeof start !== "string" && typeof goal !== "string") {
    if (!follows(start, goal)) problems.push("The goal doesn't follow from the start (check for a typo).");
    if (ex.wrong) {
      if (ex.wrong.length !== 2) problems.push("`wrong:` should list two wrong answers.");
      for (const w of ex.wrong) {
        const s = tryParse(w);
        if (typeof s === "string") problems.push(`Can't read the wrong answer "${w}": ${s}`);
        else if (shapeMismatch(goal, s)) problems.push(`The wrong answer "${w}" doesn't look like the goal: ${shapeMismatch(goal, s)}.`);
        else if (!isWrong(goal, s) || follows(start, s)) problems.push(`The wrong answer "${w}" is actually right.`);
      }
      decoys = ex.wrong.slice(0, 2);
    } else {
      decoys = autoDecoys(start, goal);
      if (decoys.length < 2) notes.push("No convincing wrong answers could be made: add `wrong:`, or it's solved without guessing.");
      else notes.push(`Wrong answers made for guessing: ${decoys.join(", ")}.`);
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

export async function decodeSet(code: string): Promise<ExerciseSet> {
  const json = new TextDecoder().decode(await pipe(unb64url(code), new DecompressionStream("deflate-raw")));
  const [title, moves, list] = JSON.parse(json) as [string, string, string[][]];
  return {
    title,
    ...(moves ? { moves } : {}),
    exercises: list.map(([start, goal, w1, w2, hint, mv]) => ({
      start,
      goal,
      ...(w1 && w2 ? { wrong: [w1, w2] } : {}),
      ...(hint ? { hint } : {}),
      ...(mv ? { moves: mv } : {}),
    })),
  };
}

/** A short, stable name for a set (from its link), for keeping progress: the same set, the same progress. */
export function setKey(code: string): string {
  let h = 2166136261;
  for (let i = 0; i < code.length; i++) h = Math.imul(h ^ code.charCodeAt(i), 16777619) >>> 0;
  return h.toString(36);
}

/** An example to start from. */
export const EXAMPLE_SET = `title: Homework week 3
# Moves up to "Solving equations" (a chapter's number, id or title). Leave out for all moves.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Two wrong answers to guess between (optional: else they're made for you).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: The 2 leaves first, then the 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`;
