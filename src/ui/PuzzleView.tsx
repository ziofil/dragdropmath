import { useEffect, useMemo, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import { allPuzzles, CHAPTERS, type PuzzleRef } from "../game/puzzles";
import { matchesGoal } from "../game/solver";
import { badgeTier, loadSolved, markSolved } from "../game/scoring";
import { TIDY_STEP_MS, tidySteps } from "../game/tidy";
import { Badge, tierName } from "./Badge";
import { MathCanvas, StaticMath } from "./MathCanvas";
import { checkEnv, Invariant } from "./Invariant";

/** A state reached: by the learner's own move, or by tidying after it. */
type Entry = { state: MathState; tidy?: true };

export function PuzzleView({ puzzleRef: pref }: { puzzleRef: PuzzleRef }) {
  const { puzzle, chapter, rules } = pref;
  const start = useMemo(() => parseState(puzzle.start), [puzzle]);
  const goal = useMemo(() => parseState(puzzle.goal), [puzzle]);
  const env = useMemo(() => checkEnv(start, goal), [start, goal]);
  // The chapter's badge before this exercise, and with it solved.
  const tiers = useMemo(() => {
    const before = loadSolved();
    return { before: badgeTier(chapter, before), after: badgeTier(chapter, new Set([...before, puzzle.id])) };
  }, [chapter, puzzle.id]);
  const [history, setHistory] = useState<Entry[]>([{ state: start }]);
  const [showHint, setShowHint] = useState(false);
  // Pending tidying belongs to one move: undoing it cancels it. A move made
  // before it's shown takes it over (tidying from where it started).
  const generation = useRef(0);
  const tidyFrom = useRef<MathState | null>(null);
  useEffect(() => () => void generation.current++, []);

  const current = history[history.length - 1].state;
  const solved = matchesGoal(current, goal);
  useEffect(() => {
    if (solved) markSolved(puzzle.id);
  }, [solved, puzzle.id]);

  const onDrop = (next: MathState) => {
    if (stateKey(next, "exact") === stateKey(current, "exact")) return;
    const gen = ++generation.current;
    const from = tidyFrom.current ?? current;
    tidyFrom.current = null;
    setHistory((h) => [...h, { state: next }]);
    if (matchesGoal(next, goal)) return;
    const steps = tidySteps(from, next, history.map((e) => e.state));
    // Tidying stops once the goal is reached.
    const done = steps.findIndex((s) => matchesGoal(s, goal));
    const shown = done < 0 ? steps : steps.slice(0, done + 1);
    if (shown.length) tidyFrom.current = from;
    shown.forEach((state, i) =>
      setTimeout(() => {
        if (generation.current !== gen) return;
        setHistory((h) => [...h, { state, tidy: true }]);
        if (i === shown.length - 1) tidyFrom.current = null;
      }, TIDY_STEP_MS * (i + 1)),
    );
  };

  const cancelTidying = () => {
    generation.current++;
    tidyFrom.current = null;
  };
  // Undo takes back your last move, with the tidying after it.
  const undo = () => {
    cancelTidying();
    setHistory((h) => h.slice(0, Math.max(1, lastMove(h))));
  };
  const reset = () => {
    cancelTidying();
    setHistory([{ state: start }]);
  };

  const all = allPuzzles();
  const next = all[all.findIndex((r) => r.puzzle.id === puzzle.id) + 1];

  return (
    <main className="puzzle">
      <header className="puzzle-head">
        <span className="back-links">
          <a href={`#/at/${chapter.id}`} className="back">
            ← Learning path
          </a>
          <a href={`#/c/${chapter.id}`} className="back back-lesson">
            {chapter.title}: lesson
          </a>
        </span>
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
            <button onClick={undo} disabled={history.length <= 1}>
              Undo
            </button>
            <button onClick={reset} disabled={history.length <= 1}>
              Reset
            </button>
          </div>
        </div>
        {showHint && puzzle.hint && <p className="hint">{puzzle.hint}</p>}
      </section>

      {solved && (
        <section className="result" role="status">
          <div className="result-name">Solved!</div>
          {tiers.after > tiers.before && (
            <div className="new-badge">
              <Badge tier={tiers.after} n={CHAPTERS.indexOf(chapter) + 1} size={36} />
              {tierName(tiers.after)} badge for {chapter.title}!
            </div>
          )}
          {next && next.chapter === chapter ? (
            <a className="button primary" href={`#/p/${next.puzzle.id}`}>
              Next exercise →
            </a>
          ) : (
            <a className="button primary" href={`#/at/${chapter.id}`}>
              Back to the learning path
            </a>
          )}
        </section>
      )}
    </main>
  );
}

/** Where the learner's last move is in the history (tidying after it comes later). */
function lastMove(h: Entry[]): number {
  let n = h.length - 1;
  while (n > 0 && h[n].tidy) n--;
  return n;
}
