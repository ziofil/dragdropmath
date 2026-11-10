import { useEffect, useState } from "react";
import { findPuzzle } from "../game/puzzles";
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
      {ref ? <PuzzleView key={ref.puzzle.id} puzzleRef={ref} /> : hash === "#/sandbox" ? <Sandbox /> : <Home />}
    </div>
  );
}
