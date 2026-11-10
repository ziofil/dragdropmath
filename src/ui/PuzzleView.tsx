import { useMemo, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import { allPuzzles, type PuzzleRef } from "../game/puzzles";
import { matchesGoal } from "../game/solver";
import { markSolved } from "../game/scoring";
import { MathCanvas, StaticMath } from "./MathCanvas";
import { checkEnv, Invariant } from "./Invariant";


export function PuzzleView({ puzzleRef: pref }: { puzzleRef: PuzzleRef }) {
  const { puzzle, chapter, rules } = pref;
  const start = useMemo(() => parseState(puzzle.start), [puzzle]);
  const goal = useMemo(() => parseState(puzzle.goal), [puzzle]);
  const env = useMemo(() => checkEnv(start, goal), [start, goal]);
  const [history, setHistory] = useState<MathState[]>([start]);
  const [showHint, setShowHint] = useState(false);

  const current = history[history.length - 1];
  const solved = matchesGoal(current, goal);

  const onDrop = (dropped: MathState) => {
    const next = dropped;
    if (stateKey(next, "exact") === stateKey(current, "exact")) return;
    setHistory([...history, next]);
    if (matchesGoal(next, goal)) markSolved(puzzle.id);
  };

  const all = allPuzzles();
  const next = all[all.findIndex((r) => r.puzzle.id === puzzle.id) + 1];

  return (
    <main className="puzzle">
      <header className="puzzle-head">
        <a href="#/" className="back">
          ← {chapter.title}
        </a>
        <div className="title">Exercise {pref.label}</div>
      </header>

      <section className="goal">
        <span className="goal-label">Make it look like</span>
        <StaticMath state={goal} />
      </section>

      <section className={`board ${solved ? "board-solved" : ""}`}>
        <MathCanvas state={current} rules={rules} onDrop={onDrop} />
        <div className="board-bar">
          <Invariant state={current} env={env} />
          <div className="actions">
            {puzzle.hint && (
              <button onClick={() => setShowHint((h) => !h)} aria-pressed={showHint}>
                Hint
              </button>
            )}
            <button onClick={() => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))} disabled={history.length <= 1}>
              Undo
            </button>
            <button onClick={() => setHistory([start])} disabled={history.length <= 1}>
              Reset
            </button>
          </div>
        </div>
        {showHint && puzzle.hint && <p className="hint">{puzzle.hint}</p>}
      </section>

      {solved && (
        <section className="result" role="status">
          <div className="result-name">Solved!</div>
          {next ? (
            <a className="button primary" href={`#/p/${next.puzzle.id}`}>
              Next exercise →
            </a>
          ) : (
            <a className="button primary" href="#/">
              Back to the map
            </a>
          )}
        </section>
      )}
    </main>
  );
}
