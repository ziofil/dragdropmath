/**
 * What an exercise asks, read from its goal, and when a board has done it.
 *
 *  - "solve": every goal row is a letter alone on one side (x = 2; x = 1, y = 4;
 *    x < 3; a = T/2 − b). The goal is hidden ("Solve for x"), so any order of
 *    terms counts; and when the answer has letters in it (a formula
 *    rearranged), any form equal in value counts too: a = (T − 2b)/2 is as
 *    right as a = T/2 − b.
 *  - "match": anything else (simplify, make it look like this): the goal is
 *    shown, and only it counts.
 */
import type { MathState } from "../expr/types";
import { allNodes } from "../expr/tree";
import { differ, isolated, rowsOf } from "./answers";
import { matchesGoal } from "./solver";

export type Task = { kind: "match" } | { kind: "solve"; letters: string[] };

export function taskOf(goal: MathState): Task {
  if (goal.sides.length < 2 || goal.sides.length % 2) return { kind: "match" };
  const letters: string[] = [];
  for (const row of rowsOf(goal)) {
    const x = isolated(row);
    if (!x) return { kind: "match" };
    letters.push(x);
  }
  return { kind: "solve", letters };
}

const hasLetters = (s: MathState) => s.sides.some((e) => allNodes(e).some((n) => n.kind === "var"));

/** Has board `s` done what `goal` asks? */
export function isDone(goal: MathState, s: MathState, task: Task = taskOf(goal)): boolean {
  if (task.kind === "match") return matchesGoal(s, goal, "exact");
  if (matchesGoal(s, goal, false)) return true;
  // A number for an answer must be worked out (x = 6/2 isn't done); a formula's answer may take any equal form.
  const goalRows = rowsOf(goal);
  if (!goalRows.some((r) => hasLetters({ sides: [r.sides[1]] }))) return false;
  // Either way round: (T − 2b)/2 = a is a = (T − 2b)/2.
  const mine = rowsOf(s).map((r) => (r.sides.length === 2 && !isolated(r) && isolated({ ...r, sides: [r.sides[1], r.sides[0]] }) ? { ...r, sides: [r.sides[1], r.sides[0]] } : r));
  if (mine.length !== goalRows.length || (s.rel ?? "=") !== "=" || (goal.rel ?? "=") !== "=") return false;
  return goalRows.every((g) => {
    const x = isolated(g)!;
    const row = mine.find((m) => isolated(m) === x);
    return row !== undefined && !differ(row.sides[1], g.sides[1]);
  });
}
