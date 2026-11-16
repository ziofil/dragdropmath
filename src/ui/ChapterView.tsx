import { CHAPTERS, rulesOf, type Chapter } from "../game/puzzles";
import { useState } from "react";
import { carries, carryOf, drillExercise, drillsOf, type Drill } from "../game/generate/moves";
import { freshSeed } from "../game/generate/practice";
import { MoveBoard } from "./Guided";
import { MathText } from "./MathText";
import { href } from "./routes";
import { chapterText, t } from "../i18n";
import type { MoveWords } from "../i18n/en";

/**
 * A chapter's lesson: its moves one at a time, why each works, and a board to
 * try it on. Practice and the mind's eye start from the chapter's node on the
 * learning path (Home's panel).
 */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const ci = CHAPTERS.indexOf(chapter);
  const rules = rulesOf(chapter.id);
  const text = chapterText(chapter);

  return (
    <main className="chapter-page">
      <header className="puzzle-head">
        <a href={href({ page: "home", at: chapter.id })} className="back-link">
          {t().backToPath}
        </a>
        <div className="puzzle-title">{t().chapterN(ci + 1)}</div>
      </header>

      <h1>{text.title}</h1>
      <p className="page-intro">{text.blurb}</p>


      {/* The lesson: the chapter's moves, one after another, each with a board to try it on. */}
      <div id="lesson">
        {drillsOf(chapter.id).map((d, i) => (
          <MoveBlock key={d.id} chapter={chapter} drill={d} rules={rules} n={i + 1} />
        ))}
      </div>

    </main>
  );
}

/** One move: its name, why it works, what to do, and a board to do it on, again with new numbers as often as one likes. */
function MoveBlock({ chapter, drill, rules, n }: { chapter: Chapter; drill: Drill; rules: ReturnType<typeof rulesOf>; n: number }) {
  const [seed, setSeed] = useState(freshSeed);
  const d = drillExercise(chapter.id, drill.id, seed);
  const words: MoveWords = t().drills[drill.id as keyof ReturnType<typeof t>["drills"]];
  if (!d) return null;
  return (
    <section className="lesson-part">
      <h2>
        <span className="lesson-num">{n}</span> {words.name}
      </h2>
      {words.text.map((p, k) => (
        <p key={k}>
          <MathText text={p} />
        </p>
      ))}
      <MoveBoard
        key={seed}
        start={d.start}
        goals={[d.goal, ...d.also]}
        how={words.how}
        rules={rules}
        rule={drill.rule}
        prefer={carryOf(drill.id) && ((s, id) => carries(s, id, carryOf(drill.id)!))}
        positive={d.positive}
        more={{ text: t().anotherOne, onClick: () => setSeed(freshSeed()) }}
      />
    </section>
  );
}
