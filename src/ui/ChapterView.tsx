import { CHAPTERS, rulesFor, type Chapter } from "../game/puzzles";
import { badgeTier, loadSolved } from "../game/scoring";
import { Badge, BadgeNote } from "./Badge";
import { GuidedExample } from "./Guided";
import { ExerciseCards } from "./ExerciseCards";
import { MathText } from "./MathText";

/** A chapter: the lesson (ideas, each tried by hand), then exercises from easy to hard. */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const ci = CHAPTERS.indexOf(chapter);
  const solved = loadSolved();
  const done = chapter.puzzles.filter((p) => solved.has(p.id)).length;
  const leadsTo = CHAPTERS.filter((c) => c.after.includes(chapter.id));
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
          {part.example && <GuidedExample example={part.example} rules={rulesFor(ci)} n={++example} />}
          {part.watch && (
            <p className="watch">
              <strong>Watch out.</strong> <MathText text={part.watch} />
            </p>
          )}
        </section>
      ))}

      <section className="practice" id="exercises">
        <h2>Exercises</h2>
        <p className="practice-note">They start easy and get harder. The later ones mix in what you learned on the way here.</p>
        <div className="panel-progress">
          <Badge tier={badgeTier(chapter, solved)} n={ci + 1} size={30} />
          <span>
            {done} of {chapter.puzzles.length} solved
            <br />
            <BadgeNote chapter={chapter} solved={solved} />
          </span>
        </div>
        <ExerciseCards chapter={chapter} solved={solved} />
        {leadsTo.length > 0 && (
          <p className="leads-to">
            Leads on to{" "}
            {leadsTo.map((c, k) => (
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
