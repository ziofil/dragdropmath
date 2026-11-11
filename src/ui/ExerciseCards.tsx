import { CHAPTERS, exerciseLabel, type Chapter } from "../game/puzzles";

/** A chapter's exercises as cards: number, and a tick once solved. */
export function ExerciseCards({ chapter, solved }: { chapter: Chapter; solved: ReadonlySet<string> }) {
  const ci = CHAPTERS.indexOf(chapter);
  return (
    <ol className="exercises">
      {chapter.puzzles.map((p, i) => {
        const ok = solved.has(p.id);
        return (
          <li key={p.id}>
            <a href={`#/p/${p.id}`} className={`ex-card ${ok ? "solved" : ""}`} title={`Exercise ${exerciseLabel(ci, i)}${ok ? " — solved" : ""}`}>
              <span className="ex-num">{exerciseLabel(ci, i)}</span>
              {ok && (
                <span className="ex-check" aria-label="solved">
                  ✓
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
