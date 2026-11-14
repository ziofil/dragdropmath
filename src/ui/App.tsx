import { useEffect, useState } from "react";
import { chapterById } from "../game/puzzles";
import { ChapterView } from "./ChapterView";
import { Home } from "./Home";
import { SetMaker, SetRoute } from "./SetView";
import { Sandbox } from "./Sandbox";
import { ExerciseRoute, MovesPage } from "./Practice";
import { setDebug, useDebug, useDebugShortcut } from "./debug";
import { ENGLISH_ONLY, LANGS, setLang, t, useLang, type Lang } from "../i18n";

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
  // A chapter, perhaps at one of its sections: #/c/<chapter>[/practice|test].
  const chapterLink = hash.match(/^#\/c\/([\w-]+)(?:\/(practice|test))?$/);
  const chapter = chapterById(chapterLink?.[1]);
  // The learning path, with a chapter picked out (coming back from it).
  const atId = hash.match(/^#\/at\/([\w-]+)$/)?.[1];
  const at = chapterById(atId);
  // Sets of one's own: making one, or one opened from its link (and its exercises).
  const making = hash === "#/sets/new";
  const sandbox = hash === "#/sandbox";
  // A chapter's exercise: #/practice|test/<chapter>/<level>/<seed> (#/ex/ is an earlier test link);
  // learning the moves: #/moves/<chapter>.
  const exercise = hash.match(/^#\/(practice|test|ex)\/([\w-]+)\/(\w+)\/(\d+)$/);
  const moves = hash.match(/^#\/moves\/([\w-]+)$/);
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
          <a href="#/sandbox" className="top-link" aria-current={sandbox ? "page" : undefined}>
            {t().sandbox}
          </a>
          {/* For teachers (or anyone): write exercises and share them as a link. */}
          <a href="#/sets/new" className="top-link" aria-current={making ? "page" : undefined}>
            {t().makeExercises}
          </a>
          {/* The select's own arrow sits too far right: it's drawn by .lang-wrap instead. */}
          {!ENGLISH_ONLY && (
            <span className="lang-wrap">
              <select className="lang-pick" value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label={t().language}>
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </span>
          )}
        </span>
      </nav>
      {sandbox ? (
        <Sandbox />
      ) : making ? (
        <SetMaker />
      ) : exercise ? (
        <ExerciseRoute
          key={hash}
          kind={exercise[1] === "practice" ? "practice" : "test"}
          chapterId={exercise[2]}
          level={exercise[3]}
          seed={Number(exercise[4])}
        />
      ) : moves ? (
        <MovesPage key={hash} chapterId={moves[1]} />
      ) : setLink ? (
        <SetRoute key={hash} code={setLink[1]} n={setLink[2] ? Number(setLink[2]) : null} />
      ) : chapter ? (
        <ChapterView key={hash} chapter={chapter} section={chapterLink?.[2]} />
      ) : (
        <Home key={at?.id ?? ""} at={at} />
      )}
    </div>
  );
}
