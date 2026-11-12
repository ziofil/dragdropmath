import { useEffect, useLayoutEffect, useMemo, useRef, useState, type Ref } from "react";
import { chapterById, CHAPTERS, leadsTo, type Chapter } from "../game/puzzles";
import { layoutPath, suggested } from "../game/path";
import { FeelWord } from "./FeelWord";
import { badgeTier, isMastered, loadSolved, solvedCount, TIER_NAMES } from "../game/scoring";
import { Badge } from "./Badge";
import { ChapterProgress } from "./ChapterProgress";

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
  const solved = useMemo(() => loadSolved(), []);
  const next = useMemo(() => suggested(solved), [solved]);
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
          Algebra you can <FeelWord />.
        </h1>
        <p>
          Drag any part of an equation. It can only move in ways the maths allows. Rearrange it until it matches
          the goal.
        </p>
      </section>

      <Shelf solved={solved} onSelect={select} />

      <div className="path-layout" ref={pathRef}>
        <section className="path-card" aria-label="Learning path">
          <div className="path-legend">
            <span>
              <i className="dot dot-next" /> next up
            </span>
            <span>
              <i className="dot dot-done" /> mastered
            </span>
            <span className="path-open">Every chapter is open. The arrows show a suggested order.</span>
          </div>
          <PathMap solved={solved} next={next} selected={selected} onSelect={select} />
        </section>

        <ChapterPanel panelRef={panel} chapter={selected} solved={solved} isNext={next.includes(selected)} />
      </div>

    </main>
  );
}

/** The chapters as a graph, each arrow pointing to what builds on it. */
function PathMap({
  solved,
  next,
  selected,
  onSelect,
}: {
  solved: ReadonlySet<string>;
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
              const done = isMastered(from.chapter, solved);
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
            const done = solvedCount(c, solved);
            const state = isMastered(c, solved) ? "done" : next.includes(c) ? "next" : done > 0 ? "started" : "open";
            return (
              <button
                key={c.id}
                className={`path-node node-${state} ${c === selected ? "node-selected" : ""}`}
                style={{ left: p.x, top: p.y - R, width: Math.min(140, nodes.filter((m) => m.row === n.row).length === 1 ? w / 2 : w / cols - 4) }}
                onClick={() => onSelect(c)}
                aria-pressed={c === selected}
                aria-label={`Chapter ${n.index + 1}: ${c.title}, ${done} of ${c.puzzles.length} solved`}
              >
                <span className="node-ring">
                  <Ring done={done} total={c.puzzles.length} label={String(n.index + 1)} />
                  {badgeTier(c, solved) > 0 && (
                    <span className="node-medal">
                      <Badge tier={badgeTier(c, solved)} n={n.index + 1} size={22} />
                    </span>
                  )}
                </span>
                <span className="node-title">{c.title}</span>
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
  solved,
  isNext,
}: {
  panelRef: Ref<HTMLElement>;
  chapter: Chapter;
  solved: ReadonlySet<string>;
  isNext: boolean;
}) {
  const ci = CHAPTERS.indexOf(chapter);
  const started = solvedCount(chapter, solved) > 0;
  const mastered = isMastered(chapter, solved);
  const builds = chapter.after.map((id) => chapterById(id)!);
  const missing = builds.filter((c) => !isMastered(c, solved));
  const opens = leadsTo(chapter);

  return (
    <section className="chapter path-panel" ref={panelRef}>
      <div className="panel-kicker">
        Chapter {ci + 1}
        {mastered ? <span className="tag tag-done">mastered</span> : isNext && <span className="tag tag-next">next up</span>}
      </div>
      <h2 className="panel-title">
        <a href={`#/c/${chapter.id}`}>{chapter.title}</a>
      </h2>
      <p className="panel-blurb">{chapter.blurb}</p>

      {builds.length > 0 && (
        <p className="panel-builds">
          Builds on {builds.map((c) => c.title).join(" and ")}.
          {missing.length > 0 && ` Not mastered yet: ${missing.map((c) => c.title).join(", ")}. You can start anyway.`}
        </p>
      )}

      <a className="button primary panel-start" href={`#/c/${chapter.id}`}>
        {started ? "Back to the lesson →" : "Start the lesson →"}
      </a>

      <ChapterProgress chapter={chapter} solved={solved} />

      {opens.length > 0 && <p className="panel-opens">Leads on to {opens.map((c) => c.title).join(", ")}.</p>}
    </section>
  );
}

/** Every chapter's badge, earned or not yet: a small reason to come back, nothing more. */
function Shelf({ solved, onSelect }: { solved: ReadonlySet<string>; onSelect: (c: Chapter) => void }) {
  const tiers = CHAPTERS.map((c) => badgeTier(c, solved));
  const earned = tiers.filter((t) => t > 0).length;
  return (
    <section className="shelf" aria-label="Badges">
      <div className="shelf-head">
        Badges <span>{earned === 0 ? "Solve exercises in any chapter to earn its badge." : `${earned} of ${CHAPTERS.length}`}</span>
      </div>
      <ul className="shelf-row">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <button className="shelf-badge" onClick={() => onSelect(c)} title={`${c.title}: ${tiers[i] ? `${TIER_NAMES[tiers[i]]} badge` : "not earned yet"}`}>
              <Badge tier={tiers[i]} n={i + 1} size={34} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
