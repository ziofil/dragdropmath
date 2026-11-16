/**
 * A chapter's exercises, all made up on the spot from a seed (so a link always
 * gives the same one), in two modes, each at Easy / Medium / Hard:
 *
 * - practice: solved straight away, counted nowhere (no score);
 * - the mind's eye (predict): the answer picked first, in one's head; a right
 *   one adds 1 to the score at its level, a wrong one takes 1 away (Reveal
 *   costs nothing). Not the same exercises as practice's at the same seed:
 *   one solved there would be a free point here.
 */
import { useEffect, useMemo, useState } from "react";
import { chapterById, rulesOf, type Chapter } from "../game/puzzles";
import { freshSeed, LEVELS, type Level } from "../game/generate/practice";
import { makeExercise, type Made, type MakeRequest } from "../game/exerciseWorker";
import { workerClient } from "../util/worker";
import { loadScore } from "../game/scoring";
import { choicesFor } from "../game/predict";
import { PuzzleView, type Exercise } from "./PuzzleView";
import { NotFound } from "./NotFound";
import { href, type Mode } from "./routes";
import { chapterText, t } from "../i18n";

/** A new exercise: a fresh seed each time the link is drawn. */
export const exerciseHref = (mode: Mode, chapter: Chapter, level: Level) => href({ page: "exercise", mode, chapter: chapter.id, level, seed: freshSeed() });

/** A mode's name on screen. */
export const modeName = (mode: Mode) => (mode === "predict" ? t().predict : t().practice);

/** A button for each level; the mind's eye's say the score at their level. */
export function LevelButtons({ mode, chapter }: { mode: Mode; chapter: Chapter }) {
  const score = mode === "predict" ? loadScore() : null;
  return (
    <div className="levels">
      {LEVELS.map((level) => (
        <a key={level} className="button level" href={exerciseHref(mode, chapter, level)}>
          <span className="level-name">{t().level[level]}</span>
          {score && <span className="level-count">{t().scoreOf(score[level])}</span>}
        </a>
      ))}
    </div>
  );
}

/** Exercises made (or being made) off the page's thread, by request: the next one is made while this one is played. */
const make = workerClient(() => new Worker(new URL("../game/exerciseWorker.ts", import.meta.url), { type: "module" }), makeExercise, 30_000);
const making = new Map<string, Promise<Made>>();
const made = new Map<string, Made>();
const keyOf = (r: MakeRequest) => `${r.mode}/${r.chapter}/${r.level}/${r.seed}`;
function madeFor(r: MakeRequest): Promise<Made> {
  const k = keyOf(r);
  let p = making.get(k);
  if (!p) {
    p = make(r).then((m) => {
      made.set(k, m);
      return m;
    });
    making.set(k, p);
    // The latest few only.
    for (const old of [...making.keys()].slice(0, Math.max(0, making.size - 12))) {
      making.delete(old);
      made.delete(old);
    }
  }
  return p;
}

function exerciseOf(mode: Mode, chapter: Chapter, level: Level, seed: number, d: NonNullable<Made>, onwardSeed: number): Exercise {
  const id = `${mode}-${chapter.id}-${level}-${seed}`;
  // Predicting first: the wrong answers are the usual slips.
  const choices = mode === "predict" ? choicesFor({ id, goal: d.goal }, d.decoys) : null;
  return {
    puzzle: { id, start: d.start, goal: d.goal },
    rules: rulesOf(chapter.id),
    label: `${modeName(mode)} · ${t().level[level]}`,
    choices,
    back: [
      { href: href({ page: "home", at: chapter.id }), text: t().backToPath },
      { href: href({ page: "chapter", chapter: chapter.id }), text: t().lessonLink(chapterText(chapter).title) },
    ],
    levels: LEVELS.map((l) => ({ href: exerciseHref(mode, chapter, l), text: t().level[l], current: l === level })),
    onward: { href: href({ page: "exercise", mode, chapter: chapter.id, level, seed: onwardSeed }), text: t().anotherOne },
    context: { kind: mode, chapter: chapter.id, level },
    positiveLetters: d.positive,
  };
}

export function ExerciseRoute({ mode, chapterId, level, seed }: { mode: Mode; chapterId: string; level: string; seed: number }) {
  const chapter = chapterById(chapterId);
  const valid = !!chapter && (LEVELS as readonly string[]).includes(level);
  const req: MakeRequest | null = valid ? { mode, chapter: chapter.id, level: level as Level, seed } : null;
  const key = req ? keyOf(req) : "";
  // Made off the page's thread (already made, if it was the "another one" of the last).
  const [d, setD] = useState<Made | undefined>(() => (req ? made.get(key) : null));
  // Once per exercise: its links to another one (new seeds) mustn't change while it's open.
  const [onwardSeed] = useState(freshSeed);
  useEffect(() => {
    if (!req || d !== undefined) return;
    let live = true;
    madeFor(req).then((m) => live && setD(m));
    return () => {
      live = false;
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  // While this one is played, the next is made.
  useEffect(() => {
    if (req && d) void madeFor({ ...req, seed: onwardSeed });
  }, [d]); // eslint-disable-line react-hooks/exhaustive-deps
  const ex = useMemo(() => (chapter && req && d ? exerciseOf(mode, chapter, req.level, seed, d, onwardSeed) : null), [d]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!valid || d === null) return <NotFound />;
  if (!ex)
    return (
      <main className="puzzle puzzle-making" aria-busy="true">
        <p className="puzzle-making-note" role="status">
          {t().makingExercise}
        </p>
      </main>
    );
  return <PuzzleView exercise={ex} />;
}
