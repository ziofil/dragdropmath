import { useEffect, useState } from "react";
import { chapterById, findPuzzle } from "../game/puzzles";
import { ChapterView } from "./ChapterView";
import { Home } from "./Home";
import { PuzzleView } from "./PuzzleView";
import { Sandbox } from "./Sandbox";
import { setDebug, useDebug, useDebugShortcut } from "./debug";

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
  const debug = useDebug();
  useDebugShortcut();

  return (
    <div className="app">
      <nav className="topbar">
        <a href="#/" className="logo">
          graspable<span>.</span>
        </a>
        <a href="#/sandbox">Sandbox</a>
        {debug && (
          <button className="debug-badge" onClick={() => setDebug(false)} title="Debug mode is on (Shift+D)">
            debug ✕
          </button>
        )}
      </nav>
      {ref ? (
        <PuzzleView key={ref.puzzle.id} puzzleRef={ref} />
      ) : chapter ? (
        <ChapterView key={chapter.id} chapter={chapter} />
      ) : hash === "#/sandbox" ? (
        <Sandbox />
      ) : (
        <Home key={at?.id ?? ""} at={at} />
      )}
    </div>
  );
}
