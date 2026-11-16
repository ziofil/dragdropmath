import { useLayoutEffect, useMemo, useRef, useState, type Ref } from "react";
import { chapterById, CHAPTERS, type Chapter } from "../game/puzzles";
import { layoutPath, type PathNode } from "../game/path";
import { FeelWord } from "./FeelWord";
import { loadScore } from "../game/scoring";
import { LEVELS } from "../game/generate/write";
import { chapterText, t } from "../i18n";
import { LevelButtons } from "./Practice";
import { LeadsTo } from "./ChapterView";
import { href } from "./routes";

/** Height of one row of the path. */
const ROW = 136;
/** Radius of a chapter's circle. */
const R = 28;
/** Room under a chapter for its title (two lines), before its arrows start. */
const TITLE_H = 40;
/** The path is never drawn wider than this. */
const MAX_W = 620;

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
          <div className="path-legend">
            <span className="path-open">{t().everyChapterOpen}</span>
          </div>
          <PathMap selected={selected} onSelect={select} />
        </section>

        <ChapterPanel panelRef={panel} chapter={selected} />
      </div>

      <section className="card home-sandbox">
        <a href={href({ page: "sandbox" })} className="button">
          {t().openSandbox}
        </a>
        <p>{t().sandboxIntro}</p>
      </section>

    </main>
  );
}

/** The chapters as a graph, each arrow pointing to what builds on it. */
function PathMap({ selected, onSelect }: { selected: Chapter; onSelect: (c: Chapter) => void }) {
  const { cols, rows, nodes, edges } = useMemo(() => layoutPath(), []);
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const w = Math.min(width, MAX_W);
  const left = (width - w) / 2;
  const at = (n: { col: number; row: number }) => ({ x: left + ((n.col + 0.5) / cols) * w, y: R + 12 + n.row * ROW });
  const height = rows * ROW;
  // A chapter's title may be as wide as the gap to its nearest neighbour in
  // the row (chapters 4 and 5 sit two columns apart): on a narrow phone a long
  // title then takes two lines, not four that run into the arrows below.
  const room = (n: PathNode) => {
    const gaps = nodes.filter((m) => m !== n && m.row === n.row).map((m) => Math.abs(m.col - n.col));
    return Math.min(140, gaps.length ? (Math.min(...gaps) * w) / cols - 6 : w / 2);
  };

  return (
    <div className="path" ref={box} style={{ height }}>
      {width > 0 && (
        <>
          <svg className="path-edges" width={width} height={height} aria-hidden="true">
            <defs>
              <marker id="path-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className="edge-arrow" />
              </marker>
            </defs>
            {edges.map(({ from, to }) => {
              // From below the chapter's title, curving down into the next chapter.
              const a = at(from);
              const b = at(to);
              const top = a.y + R + TITLE_H;
              const bottom = b.y - R - 8;
              const mid = (top + bottom) / 2;
              const d = `M ${a.x} ${top} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${bottom}`;
              return <path key={`${from.chapter.id}-${to.chapter.id}`} className="edge" d={d} markerEnd="url(#path-arrow)" />;
            })}
          </svg>
          {nodes.map((n) => {
            const p = at(n);
            const c = n.chapter;
            return (
              <button
                key={c.id}
                className={`bare path-node ${c === selected ? "node-selected" : ""} ${room(n) < 100 ? "node-narrow" : ""}`}
                style={{ left: p.x, top: p.y - R, width: room(n) }}
                onClick={() => onSelect(c)}
                aria-pressed={c === selected}
                aria-label={t().chapterNodeLabel(n.index + 1, chapterText(c).title)}
              >
                <span className="node-ring">
                  <Ring label={String(n.index + 1)} />
                </span>
                <span className="node-title">{chapterText(c).title}</span>
              </button>
            );
          })}
        </>
      )}
    </div>
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
        <p className="panel-mode-note">{t().predictNote}</p>
      </div>
      <LeadsTo chapter={chapter} />
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
      <p className="scores-note">{t().scoresNote}</p>
    </section>
  );
}
