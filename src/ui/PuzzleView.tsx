import { useEffect, useMemo, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import { allPuzzles, CHAPTERS, routinesFor, type PuzzleRef } from "../game/puzzles";
import { matchesGoal } from "../game/solver";
import { badgeTier, isMastered, loadSolved, markSolved } from "../game/scoring";
import { Badge, tierName } from "./Badge";
import { autoSteps } from "../game/auto";
import { MathCanvas, StaticMath } from "./MathCanvas";
import { checkEnv, Invariant } from "./Invariant";

/** Each automatic step is shown as a move of its own, this long after the one before. */
const AUTO_STEP_MS = 420;

/** A state reached: by the learner's own move, or done for them (`auto`: what was done). */
type Entry = { state: MathState; auto?: string };

export function PuzzleView({ puzzleRef: pref }: { puzzleRef: PuzzleRef }) {
  const { puzzle, chapter, rules } = pref;
  const start = useMemo(() => parseState(puzzle.start), [puzzle]);
  const goal = useMemo(() => parseState(puzzle.goal), [puzzle]);
  const env = useMemo(() => checkEnv(start, goal), [start, goal]);
  // Steps from chapters already mastered are done automatically.
  const routines = useMemo(() => {
    const solved = loadSolved();
    return routinesFor(CHAPTERS.indexOf(chapter), (c) => isMastered(c, solved));
  }, [chapter]);
  // The chapter's badge before this exercise, and with it solved.
  const tiers = useMemo(() => {
    const before = loadSolved();
    return { before: badgeTier(chapter, before), after: badgeTier(chapter, new Set([...before, puzzle.id])) };
  }, [chapter, puzzle.id]);
  const [history, setHistory] = useState<Entry[]>([{ state: start }]);
  const [showHint, setShowHint] = useState(false);
  // Pending automatic steps belong to one move: undoing it cancels them.
  const generation = useRef(0);
  useEffect(() => () => void generation.current++, []);

  const current = history[history.length - 1].state;
  const solved = matchesGoal(current, goal);
  useEffect(() => {
    if (solved) markSolved(puzzle.id);
  }, [solved, puzzle.id]);

  const onDrop = (next: MathState) => {
    if (stateKey(next, "exact") === stateKey(current, "exact")) return;
    const gen = ++generation.current;
    setHistory((h) => [...h, { state: next }]);
    if (matchesGoal(next, goal)) return;
    const steps = autoSteps(current, next, routines, history.map((e) => e.state));
    steps.forEach((s, i) =>
      setTimeout(() => {
        if (generation.current === gen) setHistory((h) => [...h, { state: s.state, auto: s.routine.id === "tidy" ? "" : s.routine.label }]);
      }, AUTO_STEP_MS * (i + 1)),
    );
  };

  const undo = () => {
    generation.current++;
    // Your last move, with whatever was done for you after it.
    setHistory((h) => {
      let n = h.length;
      while (n > 1 && h[n - 1].auto !== undefined) n--;
      return n > 1 ? h.slice(0, n - 1) : h;
    });
  };
  const reset = () => {
    generation.current++;
    setHistory([{ state: start }]);
  };

  const doneForYou = [...new Set(history.slice(trailingStart(history)).flatMap((e) => (e.auto ? [e.auto] : [])))];
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
        {doneForYou.length > 0 && (
          <p className="auto-note" role="status">
            Done for you (you've mastered it): {doneForYou.join("; ")}.
          </p>
        )}
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

/** Where the last move (the learner's own, and what was done after it) starts in the history. */
function trailingStart(h: Entry[]): number {
  let n = h.length;
  while (n > 1 && h[n - 1].auto !== undefined) n--;
  return n - 1;
}

