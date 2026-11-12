import { CHAPTERS, leadsTo, rulesFor, type Chapter } from "../game/puzzles";
import { loadSolved } from "../game/scoring";
import { GuidedExample } from "./Guided";
import { ChapterProgress } from "./ChapterProgress";
import { MathText } from "./MathText";
import { chapterText, t } from "../i18n";

/** A chapter: the lesson (ideas, each tried by hand), then exercises from easy to hard. */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const ci = CHAPTERS.indexOf(chapter);
  const solved = loadSolved();
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

      <section className="practice" id="exercises">
        <h2>{t().exercises}</h2>
        <p className="practice-note">{t().practiceNote}</p>
        <ChapterProgress chapter={chapter} solved={solved} />
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
