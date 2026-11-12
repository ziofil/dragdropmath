import { useEffect, useState } from "react";
import { chapterById, findPuzzle } from "../game/puzzles";
import { ChapterView } from "./ChapterView";
import { Home } from "./Home";
import { exerciseOfPath, PuzzleView } from "./PuzzleView";
import { SetMaker, SetRoute } from "./SetView";
import { setDebug, useDebug, useDebugShortcut } from "./debug";
import { LANGS, setLang, t, useLang, type Lang } from "../i18n";

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export function App() {
  const hash = useHash();
  const puzzleId = hash.match(/^#\/p\/([\w-]+)$/)?.[1];
  const ref = puzzleId ? findPuzzle(puzzleId) : undefined;
  const chapterId = hash.match(/^#\/c\/([\w-]+)$/)?.[1];
  const chapter = chapterById(chapterId);
  // The learning path, with a chapter picked out (coming back from it).
  const atId = hash.match(/^#\/at\/([\w-]+)$/)?.[1];
  const at = chapterById(atId);
  // Sets of one's own: making one, or one opened from its link (and its exercises).
  const making = hash === "#/sets/new";
  const setLink = hash.match(/^#\/set\/([\w-]+)(?:\/(\d+))?$/);
  const debug = useDebug();
  useDebugShortcut();
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = t().htmlLang;
    document.title = t().pageTitle;
  }, [lang]);

  return (
    // Keyed by the language: switching it redraws everything in the new one.
    <div className="app" key={lang}>
      <nav className="topbar">
        <a href="#/" className="logo">
          {t().logo}
          <span>.</span>
        </a>
        <span className="top-right">
          {debug && (
            <button className="debug-badge" onClick={() => setDebug(false)} title={t().debugOn}>
              debug ✕
            </button>
          )}
          {/* For teachers (or anyone): write exercises and share them as a link. */}
          <a href="#/sets/new" className="top-link" aria-current={making ? "page" : undefined}>
            {t().makeExercises}
          </a>
          <select className="lang-pick" value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label={t().language}>
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </span>
      </nav>
      {making ? (
        <SetMaker />
      ) : setLink ? (
        <SetRoute key={hash} code={setLink[1]} n={setLink[2] ? Number(setLink[2]) : null} />
      ) : ref ? (
        <PuzzleView key={ref.puzzle.id} exercise={exerciseOfPath(ref)} />
      ) : chapter ? (
        <ChapterView key={chapter.id} chapter={chapter} />
      ) : (
        <Home key={at?.id ?? ""} at={at} />
      )}
    </div>
  );
}
