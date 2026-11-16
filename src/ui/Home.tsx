import { useMemo, useRef, useState, type Ref } from "react";
import { chapterById, CHAPTERS, type Chapter } from "../game/puzzles";
import { FeelWord } from "./FeelWord";
import { loadScore } from "../game/scoring";
import { LEVELS } from "../game/generate/write";
import { chapterText, t } from "../i18n";
import { LevelButtons } from "./Practice";
import { href } from "./routes";

/** Radius of a chapter's circle. */
const R = 22;

/** The learning path. `at`: a chapter to pick out (coming back from it). */
export function Home({ at }: { at?: Chapter }) {
  const [selected, setSelected] = useState<Chapter>(at ?? CHAPTERS[0]);
  const panel = useRef<HTMLElement>(null);

  const select = (c: Chapter) => {
    setSelected(c);
    // On a narrow screen the details sit below the path: bring them into view.
    if (window.matchMedia("(max-width: 860px)").matches) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="home">
      <section className="home-hero">
        <h1>
          {t().heroBefore}
          <FeelWord word={t().heroWord} />
          {t().heroAfter}
        </h1>
        <p>{t().heroText}</p>
      </section>

      <Scores />

      {/* Coming back from a chapter, the page opens here (routes.ts). */}
      <div className="path-layout" id="path">
        <section className="card path-card" aria-label={t().learningPath}>
          <PathMap selected={selected} onSelect={select} />
        </section>

        <ChapterPanel panelRef={panel} chapter={selected} />
      </div>

    </main>
  );
}

/**
 * The chapters in order, as tiles that wrap: a suggested order, never a lock
 * (what each builds on is in its panel).
 */
function PathMap({ selected, onSelect }: { selected: Chapter; onSelect: (c: Chapter) => void }) {
  return (
    <ol className="path">
      {CHAPTERS.map((c, i) => (
        <li key={c.id}>
          <button
            className={`bare path-node ${c === selected ? "node-selected" : ""}`}
            onClick={() => onSelect(c)}
            aria-pressed={c === selected}
            aria-label={t().chapterNodeLabel(i + 1, chapterText(c).title)}
          >
            <span className="node-ring">
              <Ring label={String(i + 1)} />
            </span>
            <span className="node-title">{chapterText(c).title}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/** A chapter's circle, with its number. */
function Ring({ label }: { label: string }) {
  return (
    <svg className="ring" width={2 * R} height={2 * R} viewBox={`0 0 ${2 * R} ${2 * R}`} aria-hidden="true">
      <circle className="ring-face" cx={R} cy={R} r={R - 1} />
      <text className="ring-label" x={R} y={R} dominantBaseline="central" textAnchor="middle">
        {label}
      </text>
    </svg>
  );
}

/** The chosen chapter: what it's about, what it builds on, its exercises. */
function ChapterPanel({ panelRef, chapter }: { panelRef: Ref<HTMLElement>; chapter: Chapter }) {
  const ci = CHAPTERS.indexOf(chapter);
  const builds = chapter.after.map((id) => chapterById(id)!);
  const text = chapterText(chapter);
  const titles = (cs: Chapter[]) => t().list(cs.map((c) => chapterText(c).title));

  return (
    <section className="card path-panel" ref={panelRef}>
      <div className="panel-kicker">{t().chapterN(ci + 1)}</div>
      <h2 className="panel-title">
        <a href={href({ page: "chapter", chapter: chapter.id })}>{text.title}</a>
      </h2>
      <p className="panel-blurb">{text.blurb}</p>

      {builds.length > 0 && <p className="panel-builds">{t().buildsOn(titles(builds))}</p>}

      {/* The three ways into a chapter, from its node: the lesson, practice, and the mind's eye. */}
      <div className="panel-mode">
        <h3 className="panel-mode-name">{t().lesson}</h3>
        <a className="button primary" href={href({ page: "chapter", chapter: chapter.id })}>
          {t().startLesson}
        </a>
      </div>
      <div className="panel-mode">
        <h3 className="panel-mode-name">{t().practice}</h3>
        <LevelButtons mode="practice" chapter={chapter} />
      </div>
      <div className="panel-mode">
        <h3 className="panel-mode-name">{t().predict}</h3>
        <LevelButtons mode="predict" chapter={chapter} />
      </div>
    </section>
  );
}

/** The mind's eye's three scores, one per level across every chapter. */
function Scores() {
  const score = useMemo(() => loadScore(), []);
  return (
    <section className="card scores" aria-label={t().scores}>
      <div className="scores-head">{t().scores}</div>
      <ul className="scores-row">
        {LEVELS.map((l) => (
          <li key={l} className={`score score-${l}`}>
            <span className="score-num">{score[l]}</span>
            <span className="score-level">{t().level[l]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
