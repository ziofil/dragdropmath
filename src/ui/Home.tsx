import { useEffect, useLayoutEffect, useMemo, useRef, useState, type Ref } from "react";
import { chapterById, CHAPTERS, leadsTo, type Chapter } from "../game/puzzles";
import { layoutPath, suggested, type PathNode } from "../game/path";
import { FeelWord } from "./FeelWord";
import { badgeTier, GOAL, isMastered, loadProgress, progressOf, solvedCount, type Progress } from "../game/scoring";
import { chapterText, t } from "../i18n";
import { Badge } from "./Badge";
import { ChapterExercises } from "./Practice";

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
  const progress = useMemo(() => loadProgress(), []);
  const next = useMemo(() => suggested(progress), [progress]);
  const [selected, setSelected] = useState<Chapter>(at ?? next[0] ?? CHAPTERS[0]);
  const panel = useRef<HTMLElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);
  // Coming back to a chapter: show the path, not the top of the page.
  useEffect(() => {
    if (at) pathRef.current?.scrollIntoView({ block: "start" });
  }, [at]);

  const select = (c: Chapter) => {
    setSelected(c);
    // On a narrow screen the details sit below the path: bring them into view.
    if (window.matchMedia("(max-width: 860px)").matches) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="home">
      <section className="hero">
        <h1>
          {t().heroBefore}
          <FeelWord word={t().heroWord} />
          {t().heroAfter}
        </h1>
        <p>{t().heroText}</p>
      </section>

      <Shelf progress={progress} onSelect={select} />

      <div className="path-layout" ref={pathRef}>
        <section className="path-card" aria-label={t().learningPath}>
          <div className="path-legend">
            <span>
              <i className="dot dot-next" /> {t().nextUp}
            </span>
            <span>
              <i className="dot dot-done" /> {t().mastered}
            </span>
            <span className="path-open">{t().everyChapterOpen}</span>
          </div>
          <PathMap progress={progress} next={next} selected={selected} onSelect={select} />
        </section>

        <ChapterPanel panelRef={panel} chapter={selected} progress={progress} isNext={next.includes(selected)} />
      </div>

      <section className="chapter sandbox-link">
        <a href="#/sandbox" className="button">
          {t().openSandbox}
        </a>
        <p>{t().sandboxIntro}</p>
      </section>

    </main>
  );
}

/** The chapters as a graph, each arrow pointing to what builds on it. */
function PathMap({
  progress,
  next,
  selected,
  onSelect,
}: {
  progress: Progress;
  next: readonly Chapter[];
  selected: Chapter;
  onSelect: (c: Chapter) => void;
}) {
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
              <marker id="path-arrow-done" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className="edge-arrow-done" />
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
              const done = isMastered(from.chapter, progress);
              return (
                <path
                  key={`${from.chapter.id}-${to.chapter.id}`}
                  className={done ? "edge edge-done" : "edge"}
                  d={d}
                  markerEnd={done ? "url(#path-arrow-done)" : "url(#path-arrow)"}
                />
              );
            })}
          </svg>
          {nodes.map((n) => {
            const p = at(n);
            const c = n.chapter;
            const done = progressOf(c, progress);
            const state = isMastered(c, progress) ? "done" : next.includes(c) ? "next" : solvedCount(c, progress) > 0 ? "started" : "open";
            return (
              <button
                key={c.id}
                className={`path-node node-${state} ${c === selected ? "node-selected" : ""} ${room(n) < 100 ? "node-narrow" : ""}`}
                style={{ left: p.x, top: p.y - R, width: room(n) }}
                onClick={() => onSelect(c)}
                aria-pressed={c === selected}
                aria-label={t().chapterNodeLabel(n.index + 1, chapterText(c).title, done, GOAL)}
              >
                <span className="node-ring">
                  <Ring done={done} total={GOAL} label={String(n.index + 1)} />
                  {badgeTier(c, progress) > 0 && (
                    <span className="node-medal">
                      <Badge tier={badgeTier(c, progress)} n={n.index + 1} size={22} />
                    </span>
                  )}
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

/** A chapter's circle: its number, ringed by how much of it is solved. */
function Ring({ done, total, label }: { done: number; total: number; label: string }) {
  const r = R - 3;
  const len = 2 * Math.PI * r;
  return (
    <svg className="ring" width={2 * R} height={2 * R} viewBox={`0 0 ${2 * R} ${2 * R}`} aria-hidden="true">
      <circle className="ring-face" cx={R} cy={R} r={R - 1} />
      <circle className="ring-track" cx={R} cy={R} r={r} />
      {done > 0 && (
        <circle
          className="ring-fill"
          cx={R}
          cy={R}
          r={r}
          strokeDasharray={`${(done / total) * len} ${len}`}
          transform={`rotate(-90 ${R} ${R})`}
        />
      )}
      <text className="ring-label" x={R} y={R} dominantBaseline="central" textAnchor="middle">
        {label}
      </text>
    </svg>
  );
}

/** The chosen chapter: what it's about, what it builds on, its exercises. */
function ChapterPanel({
  panelRef,
  chapter,
  progress,
  isNext,
}: {
  panelRef: Ref<HTMLElement>;
  chapter: Chapter;
  progress: Progress;
  isNext: boolean;
}) {
  const ci = CHAPTERS.indexOf(chapter);
  const started = solvedCount(chapter, progress) > 0;
  const mastered = isMastered(chapter, progress);
  const builds = chapter.after.map((id) => chapterById(id)!);
  const missing = builds.filter((c) => !isMastered(c, progress));
  const opens = leadsTo(chapter);
  const text = chapterText(chapter);
  const titles = (cs: Chapter[]) => t().list(cs.map((c) => chapterText(c).title));

  return (
    <section className="chapter path-panel" ref={panelRef}>
      <div className="panel-kicker">
        {t().chapterN(ci + 1)}
        {mastered ? <span className="tag tag-done">{t().mastered}</span> : isNext && <span className="tag tag-next">{t().nextUp}</span>}
      </div>
      <h2 className="panel-title">
        <a href={`#/c/${chapter.id}`}>{text.title}</a>
      </h2>
      <p className="panel-blurb">{text.blurb}</p>

      {builds.length > 0 && (
        <p className="panel-builds">
          {t().buildsOn(titles(builds))}
          {missing.length > 0 && t().notMasteredYet(titles(missing))}
        </p>
      )}

      <a className="button primary panel-start" href={`#/c/${chapter.id}`}>
        {started ? t().backToLesson : t().startLesson}
      </a>

      <ChapterExercises chapter={chapter} progress={progress} />

      {opens.length > 0 && <p className="panel-opens">{t().leadsOnTo(titles(opens))}</p>}
    </section>
  );
}

/** Every chapter's badge, earned or not yet: a small reason to come back, nothing more. */
function Shelf({ progress, onSelect }: { progress: Progress; onSelect: (c: Chapter) => void }) {
  const tiers = CHAPTERS.map((c) => badgeTier(c, progress));
  const earned = tiers.filter((t) => t > 0).length;
  return (
    <section className="shelf" aria-label={t().badges}>
      <div className="shelf-head">
        {t().badges} <span>{earned === 0 ? t().noBadgesYet : t().badgesEarned(earned, CHAPTERS.length)}</span>
      </div>
      <ul className="shelf-row">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <button className="shelf-badge" onClick={() => onSelect(c)} title={t().shelfTitle(chapterText(c).title, tiers[i])}>
              <Badge tier={tiers[i]} n={i + 1} size={34} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
