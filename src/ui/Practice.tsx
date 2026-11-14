/**
 * A chapter's exercises, all made up on the spot from a seed (so a link always
 * gives the same one), in three kinds:
 *
 * - practice: Easy / Medium / Hard, solved straight away,
 *   #/practice/<chapter>/<level>/<seed>;
 * - the test: the same, but first predicting the answer, in one's head. A
 *   right answer counts towards the chapter's badge. #/test/<chapter>/<level>/<seed>.
 */
import { useMemo } from "react";
import { chapterById, CHAPTERS, lettersPositive, rulesFor, type Chapter } from "../game/puzzles";
import { freshSeed, LEVELS, practiceExercise, type Level } from "../game/generate/practice";
import { badgeTier, countsOf, PER_LEVEL, type Kind, type Progress } from "../game/scoring";
import { parseState } from "../expr/parse";
import { autoDecoys } from "../game/autoDecoys";
import { choicesFor } from "../game/guess";
import { Badge, BadgeNote } from "./Badge";
import { PuzzleView, type Exercise } from "./PuzzleView";
import { chapterText, t } from "../i18n";

export const exerciseHref = (kind: Kind, chapter: Chapter, level: Level, seed = freshSeed()) => `#/${kind}/${chapter.id}/${level}/${seed}`;
/** A section of the chapter page: practice, test. */
export const sectionHref = (chapter: Chapter, section: "practice" | "test") => `#/c/${chapter.id}/${section}`;

/** A button for each level, with how many are done there. */
export function LevelButtons({ kind, chapter, progress }: { kind: Kind; chapter: Chapter; progress: Progress }) {
  const counts = countsOf(chapter, progress);
  return (
    <div className="levels">
      {LEVELS.map((level) => {
        const n = counts[level];
        // The test's goal is PER_LEVEL at each level; practice just counts.
        const done = kind === "test" && n >= PER_LEVEL;
        return (
          // A new seed each time the page is shown, so each visit gives a new exercise.
          <a key={level} className={`button level ${done ? "level-done" : ""}`} href={exerciseHref(kind, chapter, level)}>
            <span className="level-name">{t().level[level]}</span>
            <span className="level-count">{kind === "practice" ? t().solvedN(n) : done ? `✓ ${n}` : `${n}/${PER_LEVEL}`}</span>
          </a>
        );
      })}
    </div>
  );
}

/** Where the chapter's badge stands. */
export function BadgeRow({ chapter, progress }: { chapter: Chapter; progress: Progress }) {
  return (
    <div className="panel-progress">
      <Badge tier={badgeTier(chapter, progress)} n={CHAPTERS.indexOf(chapter) + 1} size={30} />
      <BadgeNote chapter={chapter} progress={progress} />
    </div>
  );
}


/** On the learning path: the badge, and the way to each kind of exercise. */
export function ChapterLinks({ chapter, progress }: { chapter: Chapter; progress: Progress }) {
  return (
    <>
      <BadgeRow chapter={chapter} progress={progress} />
      <div className="sections">
        <a className="button" href={sectionHref(chapter, "practice")}>
          {t().practice}
        </a>
        <a className="button" href={sectionHref(chapter, "test")}>
          {t().testSkills}
        </a>
      </div>
    </>
  );
}

const backLinks = (chapter: Chapter) => [
  { href: `#/at/${chapter.id}`, text: t().backToPath },
  { href: `#/c/${chapter.id}`, text: t().lessonLink(chapterText(chapter).title) },
];

function exerciseOf(kind: Kind, chapter: Chapter, level: Level, seed: number): Exercise | null {
  const d = practiceExercise(chapter.id, level, seed);
  if (!d) return null;
  const ci = CHAPTERS.indexOf(chapter);
  const id = `${kind}-${chapter.id}-${level}-${seed}`;
  // The test predicts first: the wrong answers are the usual slips.
  let choices: string[] | null = null;
  if (kind === "test")
    try {
      choices = choicesFor({ id, goal: d.goal }, autoDecoys(parseState(d.start), parseState(d.goal)));
    } catch {
      /* no wrong answers to offer: straight to solving */
    }
  const name = kind === "test" ? t().testSkills : t().practice;
  return {
    puzzle: { id, start: d.start, goal: d.goal },
    rules: rulesFor(ci),
    label: t().level[level],
    title: `${name} · ${t().level[level]}`,
    choices,
    back: backLinks(chapter),
    levels: LEVELS.map((l) => ({ href: exerciseHref(kind, chapter, l), text: t().level[l], current: l === level })),
    onward: { href: exerciseHref(kind, chapter, level), text: t().anotherOne },
    fresh: true,
    counts: { chapter, level, kind },
    positiveLetters: lettersPositive(chapter),
  };
}

/** A link that leads nowhere (a chapter, exercise or set that isn't there). */
export function Broken() {
  return (
    <main className="set-page">
      <h1>{t().brokenLink}</h1>
      <p>{t().brokenLinkText}</p>
      <a className="button primary" href="#/">
        {t().learningPathButton}
      </a>
    </main>
  );
}

export function ExerciseRoute({ kind, chapterId, level, seed }: { kind: Kind; chapterId: string; level: string; seed: number }) {
  const chapter = chapterById(chapterId);
  // Once per exercise: its links to another one (new seeds) mustn't change while it's open.
  const ex = useMemo(
    () => (chapter && (LEVELS as readonly string[]).includes(level) ? exerciseOf(kind, chapter, level as Level, seed) : null),
    [kind, chapter, level, seed],
  );
  if (!ex) return <Broken />;
  return <PuzzleView key={ex.puzzle.id} exercise={ex} />;
}
