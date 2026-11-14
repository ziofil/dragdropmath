/**
 * A chapter's exercises: Easy / Medium / Hard, each a freshly made-up one
 * (game/generate/practice.ts), solved on the usual screen. An exercise's
 * link (#/ex/<chapter>/<level>/<seed>) always gives the same exercise.
 */
import { chapterById, CHAPTERS, lettersPositive, rulesFor, type Chapter } from "../game/puzzles";
import { freshSeed, LEVELS, practiceExercise, type Level } from "../game/generate/practice";
import { badgeTier, countsOf, PER_LEVEL, type Progress } from "../game/scoring";
import { parseState } from "../expr/parse";
import { autoDecoys } from "../game/autoDecoys";
import { choicesFor } from "../game/guess";
import { Badge, BadgeNote } from "./Badge";
import { PuzzleView, type Exercise } from "./PuzzleView";
import { chapterText, t } from "../i18n";

export const exerciseHref = (chapter: Chapter, level: Level, seed = freshSeed()) => `#/ex/${chapter.id}/${level}/${seed}`;

/** Where the chapter's badge stands, and a button for each level with how many are solved there. */
export function ChapterExercises({ chapter, progress }: { chapter: Chapter; progress: Progress }) {
  const counts = countsOf(chapter, progress);
  return (
    <>
      <div className="panel-progress">
        <Badge tier={badgeTier(chapter, progress)} n={CHAPTERS.indexOf(chapter) + 1} size={30} />
        <BadgeNote chapter={chapter} progress={progress} />
      </div>
      <div className="levels">
        {LEVELS.map((level) => {
          const n = counts[level];
          return (
            // A new seed each time the page is shown, so each visit gives a new exercise.
            <a key={level} className={`button level ${n >= PER_LEVEL ? "level-done" : ""}`} href={exerciseHref(chapter, level)}>
              <span className="level-name">{t().level[level]}</span>
              <span className="level-count">{n >= PER_LEVEL ? `✓ ${n}` : `${n}/${PER_LEVEL}`}</span>
            </a>
          );
        })}
      </div>
    </>
  );
}

function exerciseOf(chapter: Chapter, level: Level, seed: number): Exercise | null {
  const d = practiceExercise(chapter.id, level, seed);
  if (!d) return null;
  const ci = CHAPTERS.indexOf(chapter);
  const text = chapterText(chapter);
  const id = `ex-${chapter.id}-${level}-${seed}`;
  // Predicting first: the wrong answers are the usual slips.
  let choices: string[] | null = null;
  try {
    choices = choicesFor({ id, goal: d.goal }, autoDecoys(parseState(d.start), parseState(d.goal)));
  } catch {
    /* no wrong answers to offer: straight to solving */
  }
  return {
    puzzle: { id, start: d.start, goal: d.goal },
    rules: rulesFor(ci),
    label: t().level[level],
    title: `${t().exercises} · ${t().level[level]}`,
    choices,
    back: [
      { href: `#/at/${chapter.id}`, text: t().backToPath },
      { href: `#/c/${chapter.id}`, text: t().lessonLink(text.title) },
    ],
    levels: LEVELS.map((l) => ({ href: exerciseHref(chapter, l), text: t().level[l], current: l === level })),
    onward: { href: exerciseHref(chapter, level), text: t().anotherOne },
    counts: { chapter, level },
    positiveLetters: lettersPositive(chapter),
  };
}

export function ExerciseRoute({ chapterId, level, seed }: { chapterId: string; level: string; seed: number }) {
  const chapter = chapterById(chapterId);
  const ex = chapter && (LEVELS as readonly string[]).includes(level) ? exerciseOf(chapter, level as Level, seed) : null;
  if (!ex)
    return (
      <main className="set-page">
        <h1>{t().brokenLink}</h1>
        <a className="button primary" href="#/">
          {t().learningPathButton}
        </a>
      </main>
    );
  return <PuzzleView key={ex.puzzle.id} exercise={ex} />;
}
