import { CHAPTERS, leadsTo, lettersPositive, rulesFor, type Chapter } from "../game/puzzles";
import { useEffect, useState } from "react";
import { loadProgress } from "../game/scoring";
import { drillExercise, drillsOf, type Drill } from "../game/generate/moves";
import { freshSeed } from "../game/generate/practice";
import { GuidedExample } from "./Guided";
import { MathText } from "./MathText";
import { BadgeRow, LevelButtons } from "./Practice";
import { chapterText, t } from "../i18n";

/**
 * A chapter: the lesson (ideas, each tried by hand, then its moves one at a
 * time, each with a board to try it on), practice, and the test.
 * `section`: one to scroll to.
 */
export function ChapterView({ chapter, section }: { chapter: Chapter; section?: string }) {
  const ci = CHAPTERS.indexOf(chapter);
  const progress = loadProgress("test");
  const practice = loadProgress("practice");
  useEffect(() => {
    if (section) document.getElementById(section)?.scrollIntoView({ block: "start" });
  }, [section]);
  const next = leadsTo(chapter);
  const rules = rulesFor(ci);
  const text = chapterText(chapter);
  const drills = drillsOf(chapter.id);
  let example = 0;

  return (
    <main className="chapter-page">
      <header className="puzzle-head">
        <a href={`#/at/${chapter.id}`} className="back">
          {t().backToPath}
        </a>
        <div className="title">{t().chapterN(ci + 1)}</div>
      </header>

      <h1 className="chapter-title">{text.title}</h1>
      <p className="chapter-blurb">{text.blurb}</p>

      {chapter.lesson.map((part, i) => {
        const words = text.lesson[i];
        return (
          <section className="theory lesson-part" key={i}>
            <h2>
              <span className="part-num">{i + 1}</span> {words.title}
            </h2>
            {words.text.map((p, k) => (
              <p key={k}>
                <MathText text={p} />
              </p>
            ))}
            {part.example && <GuidedExample example={part.example} words={words} rules={rules} positive={lettersPositive(chapter)} n={++example} />}
            {words.watch && (
              <p className="watch">
                <strong>{t().watchOut}</strong> <MathText text={words.watch} />
              </p>
            )}
          </section>
        );
      })}

      {drills.length > 0 && (
        <>
          <h2 className="moves-head" id="moves">
            {t().learnMoves}
          </h2>
          <p className="chapter-blurb">{t().learnMovesNote}</p>
          {drills.map((d, i) => (
            <MoveBlock key={d.id} chapter={chapter} drill={d} rules={rules} n={chapter.lesson.length + i + 1} />
          ))}
        </>
      )}

      <section className="practice" id="practice">
        <h2>{t().practice}</h2>
        <p className="practice-note">{t().practiceNote}</p>
        <LevelButtons kind="practice" chapter={chapter} progress={practice} />
      </section>

      <section className="practice" id="test">
        <h2>{t().testSkills}</h2>
        <p className="practice-note">{t().testNote}</p>
        <BadgeRow chapter={chapter} progress={progress} />
        <LevelButtons kind="test" chapter={chapter} progress={progress} />
        {next.length > 0 && (
          <p className="leads-to">
            {t().leadsOnToStart}
            {next.map((c, k) => (
              <span key={c.id}>
                {k > 0 && ", "}
                <a href={`#/c/${c.id}`}>{chapterText(c).title}</a>
              </span>
            ))}
            {t().leadsOnToEnd}
          </p>
        )}
      </section>
    </main>
  );
}

/** One move: its name, how it's made, and a board to make it on, again with new numbers as often as one likes. */
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
