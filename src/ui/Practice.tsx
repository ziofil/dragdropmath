/**
 * A chapter's exercises, all made up on the spot from a seed (so a link always
 * gives the same one), in three kinds:
 *
 * - learning the moves: one page, like a book, each move with a board to
 *   try it on as often as one likes (game/generate/moves.ts), #/moves/<chapter>;
 * - practice: Easy / Medium / Hard, solved straight away,
 *   #/practice/<chapter>/<level>/<seed>;
 * - the test: the same, but first predicting the answer, in one's head. A
 *   right answer counts towards the chapter's badge. #/test/<chapter>/<level>/<seed>.
 */
import { chapterById, CHAPTERS, lettersPositive, rulesFor, type Chapter } from "../game/puzzles";
import { freshSeed, LEVELS, practiceExercise, type Level } from "../game/generate/practice";
import { useState } from "react";
import { drillExercise, drillsOf, type Drill } from "../game/generate/moves";
import { badgeTier, countsOf, PER_LEVEL, type Kind, type Progress } from "../game/scoring";
import { parseState } from "../expr/parse";
import { autoDecoys } from "../game/autoDecoys";
import { choicesFor } from "../game/guess";
import { Badge, BadgeNote } from "./Badge";
import { PuzzleView, type Exercise } from "./PuzzleView";
import { GuidedExample } from "./Guided";
import { chapterText, t } from "../i18n";

export const exerciseHref = (kind: Kind, chapter: Chapter, level: Level, seed = freshSeed()) => `#/${kind}/${chapter.id}/${level}/${seed}`;
export const movesHref = (chapter: Chapter) => `#/moves/${chapter.id}`;
/** A section of the chapter page: practice, test. */
export const sectionHref = (chapter: Chapter, section: "practice" | "test") => `#/c/${chapter.id}/${section}`;

/** A button for each level, with how many are done there. */
function LevelButtons({ kind, chapter, progress }: { kind: Kind; chapter: Chapter; progress: Progress }) {
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

export const PracticeLevels = ({ chapter, progress }: { chapter: Chapter; progress: Progress }) => <LevelButtons kind="practice" chapter={chapter} progress={progress} />;
export const TestLevels = ({ chapter, progress }: { chapter: Chapter; progress: Progress }) => <LevelButtons kind="test" chapter={chapter} progress={progress} />;

/** On the learning path: the badge, and the way to each kind of exercise. */
export function ChapterLinks({ chapter, progress }: { chapter: Chapter; progress: Progress }) {
  return (
    <>
      <BadgeRow chapter={chapter} progress={progress} />
      <div className="sections">
        {drillsOf(chapter.id).length > 0 && (
          <a className="button" href={movesHref(chapter)}>
            {t().learnMoves}
          </a>
        )}
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

function Broken() {
  return (
    <main className="set-page">
      <h1>{t().brokenLink}</h1>
      <a className="button primary" href="#/">
        {t().learningPathButton}
      </a>
    </main>
  );
}

export function ExerciseRoute({ kind, chapterId, level, seed }: { kind: Kind; chapterId: string; level: string; seed: number }) {
  const chapter = chapterById(chapterId);
  const ex = chapter && (LEVELS as readonly string[]).includes(level) ? exerciseOf(kind, chapter, level as Level, seed) : null;
  if (!ex) return <Broken />;
  return <PuzzleView key={ex.puzzle.id} exercise={ex} />;
}

/** Learning the moves: the chapter's moves one after another, each with a board to try it on. */
export function MovesPage({ chapterId }: { chapterId: string }) {
  const chapter = chapterById(chapterId);
  if (!chapter || !drillsOf(chapter.id).length) return <Broken />;
  const ci = CHAPTERS.indexOf(chapter);
  const rules = rulesFor(ci);
  return (
    <main className="chapter-page">
      <header className="puzzle-head">
        <span className="back-links">
          {backLinks(chapter).map((b, i) => (
            <a key={b.href} href={b.href} className={i === 0 ? "back" : "back back-lesson"}>
              {b.text}
            </a>
          ))}
        </span>
        <div className="title">{chapterText(chapter).title}</div>
      </header>
      <h1 className="chapter-title">{t().learnMoves}</h1>
      <p className="chapter-blurb">{t().learnMovesNote}</p>
      {drillsOf(chapter.id).map((d, i) => (
        <MoveBlock key={d.id} chapter={chapter} drill={d} rules={rules} n={i + 1} />
      ))}
      <a className="button primary" href={sectionHref(chapter, "practice")}>
        {t().toPractice}
      </a>
    </main>
  );
}

/** One move: its name, and a board to make it on, again with new numbers as often as one likes. */
function MoveBlock({ chapter, drill, rules, n }: { chapter: Chapter; drill: Drill; rules: ReturnType<typeof rulesFor>; n: number }) {
  const [seed, setSeed] = useState(freshSeed);
  const d = drillExercise(chapter.id, drill.id, seed);
  const words = t().drills[drill.id as keyof ReturnType<typeof t>["drills"]];
  if (!d) return null;
  return (
    <section className="theory lesson-part">
      <h2>
        <span className="part-num">{n}</span> {words.name}
      </h2>
      <GuidedExample
        key={seed}
        example={{ start: d.start, steps: [{ say: words.how, then: d.goal }] }}
        words={{ steps: [words.how] }}
        rules={rules}
        positive={lettersPositive(chapter)}
        more={{ text: t().anotherOne, onClick: () => setSeed(freshSeed()) }}
      />
    </section>
  );
}
