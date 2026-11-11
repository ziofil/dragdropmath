import { CHAPTERS, exerciseLabel, type Chapter } from "../game/puzzles";
import { badgeTier, solvedCount } from "../game/scoring";
import { Badge, BadgeNote } from "./Badge";

/** Where a chapter stands (badge, solved count, what the next badge takes), then its exercises as cards. */
export function ChapterProgress({ chapter, solved }: { chapter: Chapter; solved: ReadonlySet<string> }) {
  const ci = CHAPTERS.indexOf(chapter);
  return (
    <>
      <div className="panel-progress">
        <Badge tier={badgeTier(chapter, solved)} n={ci + 1} size={30} />
        <span>
          {solvedCount(chapter, solved)} of {chapter.puzzles.length} exercises solved
          <br />
          <BadgeNote chapter={chapter} solved={solved} />
        </span>
      </div>
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
    </>
  );
}
