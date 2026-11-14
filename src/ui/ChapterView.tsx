import { CHAPTERS, leadsTo, rulesFor, type Chapter } from "../game/puzzles";
import { useEffect } from "react";
import { loadProgress } from "../game/scoring";
import { drillsOf } from "../game/generate/moves";
import { GuidedExample } from "./Guided";
import { MathText } from "./MathText";
import { BadgeRow, movesHref, PracticeLevels, TestLevels } from "./Practice";
import { chapterText, t } from "../i18n";

/**
 * A chapter: the lesson (ideas, each tried by hand), then its moves to learn
 * one at a time, practice, and the test. `section`: one to scroll to.
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
            {part.example && <GuidedExample example={part.example} words={words} rules={rules} n={++example} />}
            {words.watch && (
              <p className="watch">
                <strong>{t().watchOut}</strong> <MathText text={words.watch} />
              </p>
            )}
          </section>
        );
      })}

      {drillsOf(chapter.id).length > 0 && (
        <section className="practice" id="moves">
          <h2>{t().learnMoves}</h2>
          <p className="practice-note">{t().learnMovesNote}</p>
          <a className="button primary" href={movesHref(chapter)}>
            {t().learnMoves} →
          </a>
        </section>
      )}

      <section className="practice" id="practice">
        <h2>{t().practice}</h2>
        <p className="practice-note">{t().practiceNote}</p>
        <PracticeLevels chapter={chapter} progress={practice} />
      </section>

      <section className="practice" id="test">
        <h2>{t().testSkills}</h2>
        <p className="practice-note">{t().testNote}</p>
        <BadgeRow chapter={chapter} progress={progress} />
        <TestLevels chapter={chapter} progress={progress} />
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
