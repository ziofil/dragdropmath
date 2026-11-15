/**
 * A chapter's exercises, all made up on the spot from a seed (so a link always
 * gives the same one), in two modes, each at Easy / Medium / Hard:
 *
 * - practice: solved straight away; each one tried counts (no score);
 * - predict: the answer picked first, in one's head; a right one counts
 *   towards the chapter's badge.
 */
import { useMemo } from "react";
import { chapterById, CHAPTERS, rulesOf, type Chapter } from "../game/puzzles";
import { freshSeed, LEVELS, practiceExercise, type Level } from "../game/generate/practice";
import { badgeTier, countsOf, PER_LEVEL, type Progress } from "../game/scoring";
import { parseState } from "../expr/parse";
import { autoDecoys } from "../game/autoDecoys";
import { choicesFor } from "../game/predict";
import { Badge, BadgeNote } from "./Badge";
import { PuzzleView, type Exercise } from "./PuzzleView";
import { NotFound } from "./NotFound";
import { href, type Mode } from "./routes";
import { chapterText, t } from "../i18n";

/** A new exercise: a fresh seed each time the link is drawn. */
export const exerciseHref = (mode: Mode, chapter: Chapter, level: Level) => href({ page: "exercise", mode, chapter: chapter.id, level, seed: freshSeed() });

/** A mode's name on screen. */
export const modeName = (mode: Mode) => (mode === "predict" ? t().predict : t().practice);

/** A button for each level, with how many are done there. */
export function LevelButtons({ mode, chapter, progress }: { mode: Mode; chapter: Chapter; progress: Progress }) {
  const counts = countsOf(chapter, progress);
  return (
    <div className="levels">
      {LEVELS.map((level) => {
        const n = counts[level];
        // Predicting aims at PER_LEVEL at each level; practice just counts.
        const done = mode === "predict" && n >= PER_LEVEL;
        return (
          <a key={level} className={`button level ${done ? "level-done" : ""}`} href={exerciseHref(mode, chapter, level)}>
            <span className="level-name">{t().level[level]}</span>
            <span className="level-count">{mode === "practice" ? t().solvedN(n) : done ? `✓ ${n}` : `${n}/${PER_LEVEL}`}</span>
          </a>
        );
      })}
    </div>
  );
}

/** Where the chapter's badge stands. */
export function BadgeRow({ chapter, progress }: { chapter: Chapter; progress: Progress }) {
  return (
    <div className="badge-row">
      <Badge tier={badgeTier(chapter, progress)} n={CHAPTERS.indexOf(chapter) + 1} size={30} />
      <BadgeNote chapter={chapter} progress={progress} />
    </div>
  );
}

function exerciseOf(mode: Mode, chapter: Chapter, level: Level, seed: number): Exercise | null {
  const d = practiceExercise(chapter.id, level, seed);
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
