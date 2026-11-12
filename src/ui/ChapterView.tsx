import { CHAPTERS, leadsTo, rulesFor, type Chapter } from "../game/puzzles";
import { loadSolved } from "../game/scoring";
import { GuidedExample } from "./Guided";
import { ChapterProgress } from "./ChapterProgress";
import { MathText } from "./MathText";

/** A chapter: the lesson (ideas, each tried by hand), then exercises from easy to hard. */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const ci = CHAPTERS.indexOf(chapter);
  const solved = loadSolved();
  const next = leadsTo(chapter);
  const rules = rulesFor(ci);
  let example = 0;

  return (
    <main className="chapter-page">
      <header className="puzzle-head">
        <a href={`#/at/${chapter.id}`} className="back">
          ← Learning path
        </a>
        <div className="title">Chapter {ci + 1}</div>
      </header>

      <h1 className="chapter-title">{chapter.title}</h1>
      <p className="chapter-blurb">{chapter.blurb}</p>

      {chapter.lesson.map((part, i) => (
        <section className="theory lesson-part" key={i}>
          <h2>
            <span className="part-num">{i + 1}</span> {part.title}
          </h2>
          {part.text.map((t, k) => (
            <p key={k}>
              <MathText text={t} />
            </p>
          ))}
          {part.example && <GuidedExample example={part.example} rules={rules} n={++example} />}
          {part.watch && (
            <p className="watch">
              <strong>Watch out.</strong> <MathText text={part.watch} />
            </p>
          )}
        </section>
      ))}

      <section className="practice" id="exercises">
        <h2>Exercises</h2>
        <p className="practice-note">They start easy and get harder. Later ones also use what you learned in earlier chapters.</p>
        <ChapterProgress chapter={chapter} solved={solved} />
        {next.length > 0 && (
          <p className="leads-to">
            Leads on to{" "}
            {next.map((c, k) => (
              <span key={c.id}>
                {k > 0 && ", "}
                <a href={`#/c/${c.id}`}>{c.title}</a>
              </span>
            ))}
            . You can go there any time.
          </p>
        )}
      </section>
    </main>
  );
}
