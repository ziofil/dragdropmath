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
import { useMemo } from "react";
import { chapterById, rulesOf, type Chapter } from "../game/puzzles";
import { freshSeed, LEVELS, practiceExercise, predictSeed, type Level } from "../game/generate/practice";
import { loadScore } from "../game/scoring";
import { parseState } from "../expr/parse";
import { autoDecoys } from "../game/autoDecoys";
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

function exerciseOf(mode: Mode, chapter: Chapter, level: Level, seed: number): Exercise | null {
  const d = practiceExercise(chapter.id, level, mode === "predict" ? predictSeed(seed) : seed);
  if (!d) return null;
  const id = `${mode}-${chapter.id}-${level}-${seed}`;
  // Predicting first: the wrong answers are the usual slips.
  let choices: string[] | null = null;
  if (mode === "predict")
    try {
      choices = choicesFor({ id, goal: d.goal }, autoDecoys(parseState(d.start), parseState(d.goal)));
    } catch {
      /* no wrong answers to offer: straight to solving */
    }
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
    onward: { href: exerciseHref(mode, chapter, level), text: t().anotherOne },
    context: { kind: mode, chapter: chapter.id, level },
    positiveLetters: d.positive,
  };
}

export function ExerciseRoute({ mode, chapterId, level, seed }: { mode: Mode; chapterId: string; level: string; seed: number }) {
  const chapter = chapterById(chapterId);
  // Once per exercise: its links to another one (new seeds) mustn't change while it's open.
  const ex = useMemo(
    () => (chapter && (LEVELS as readonly string[]).includes(level) ? exerciseOf(mode, chapter, level as Level, seed) : null),
    [mode, chapter, level, seed],
  );
  if (!ex) return <NotFound />;
  return <PuzzleView exercise={ex} />;
}
