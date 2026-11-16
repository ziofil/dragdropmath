/**
 * A set's YAML read and every exercise in it checked (see sets.ts). Apart
 * from sets.ts so the YAML library is loaded only where sets are written
 * (the set maker), not for every page.
 */
import { parse as parseYaml } from "yaml";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { follows, hasValue, isWrong, shapeMismatch, type Mismatch } from "./answers";
import { autoDecoys } from "./autoDecoys";
import { chapterNamed, type CheckedExercise, type CheckedSet, type ExerciseSet, type SetExercise } from "./sets";
import { t } from "../i18n";

function why(m: Mismatch): string {
  const s = t().set;
  return m.kind === "count" ? s.shapeCount : m.kind === "relation" ? s.shapeRelation : s.shapeIsolated(m.letter);
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
    if (!hasValue(start)) problems.push(s.noValue);
    else if (!follows(start, goal)) problems.push(s.doesntFollow);
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

