import { useMemo, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import type { RuleId } from "../rules";
import { stepDone } from "../game/solver";
import { TIDY_STEP_MS, tidied } from "../game/tidy";
import { MathCanvas } from "./MathCanvas";
import { MathText } from "./MathText";
import { t } from "../i18n";

/**
 * One move to make by hand, on a board of its own (a chapter's lesson is a
 * row of these). Whichever way the move is made counts (`goals`: everything
 * it can make there). Other moves are real moves, just not this one's:
 * they're shown, then gently put back. Once it's made, the board stays live.
 */
export function MoveBoard({
  start: startText,
  goals,
  how,
  rules,
  positive,
  more,
}: {
  start: string;
  /** What the move can make (the same terms in another order count too). */
  goals: string[];
  /** What to do, in the reader's language. */
  how: string;
  rules: readonly RuleId[];
  /** Its letters stand for positive numbers. */
  positive?: boolean;
  /** A button for a fresh one. */
  more: { text: string; onClick: () => void };
}) {
  const start = useMemo((): MathState => ({ ...parseState(startText), ...(positive ? { letters: "positive" as const } : {}) }), [startText, positive]);
  const wants = useMemo(() => goals.map((g) => parseState(g)), [goals]);
  const [states, setStates] = useState<MathState[]>([start]);
  const [detour, setDetour] = useState<MathState | null>(null);
  const done = states.length > 1;
  const current = detour ?? states[states.length - 1];

  // Tidying (x·2 → 2x) happens on its own here too, just after the move. A
  // move made before it shows takes it over (tidying from where it started).
  const tidyFrom = useRef<MathState | null>(null);
  const accept = (next: MathState) => {
    const from = tidyFrom.current ?? current;
    setStates((ss) => [...ss, next]);
    const neat = tidied(from, next);
    tidyFrom.current = neat === next ? null : from;
    if (neat === next) return;
    setTimeout(() => {
      setStates((ss) => (ss[ss.length - 1] === next ? [...ss.slice(0, -1), neat] : ss));
      if (tidyFrom.current === from) tidyFrom.current = null;
    }, TIDY_STEP_MS);
  };

  const onDrop = (next: MathState) => {
    if (detour || stateKey(next, "exact") === stateKey(current, "exact")) return;
    if (done || wants.some((w) => stepDone(current, next, w))) return accept(next);
    // A fine move, but not the one this board is about: show it, then go back.
    setDetour(next);
    setTimeout(() => setDetour(null), 900);
  };

  return (
    <div className={`guided ${done ? "guided-done" : ""}`}>
      <div className="guided-head">
        <p className="guided-say">
          <MathText text={how} />
        </p>
      </div>
      <div className="board guided-board">
        <MathCanvas state={current} rules={rules} onDrop={onDrop} height={160} />
        <div className="board-bar">
          <p className="guided-status" role="status">
            {detour ? (
              t().notThisStep
            ) : done ? (
              <>
                {t().done} <span className="guided-free">{t().keepGoing}</span>
              </>
            ) : null}
          </p>
          <div className="actions">
            <button
              onClick={() => {
                tidyFrom.current = null;
                setStates([start]);
              }}
              disabled={!done}
            >
              {t().startOver}
            </button>
            <button className={done ? "primary" : ""} onClick={more.onClick}>
              {more.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
