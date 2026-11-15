import { useMemo, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import type { RuleId } from "../rules";
import { stepDone } from "../game/solver";
import type { ShowMove } from "./MathCanvas";
import { Board } from "./Board";
import { MathText } from "./MathText";
import { useMoveHistory } from "./useMoveHistory";
import { t } from "../i18n";

/**
 * One move to learn, on a board of its own (a chapter's lesson is a row of
 * these): every move is allowed, as in an exercise, and it's done once the
 * board shows one of `goals` (in any order) — what the move makes, or where
 * the board finishes when the move alone would leave it half done.
 */
export function MoveBoard({
  start: startText,
  goals,
  how,
  rules,
  rule,
  positive,
  more,
}: {
  start: string;
  goals: string[];
  /** What to do, in the reader's language. */
  how: string;
  rules: readonly RuleId[];
  /** The move it teaches (what Show plays). */
  rule: RuleId;
  /** Its letters stand for positive numbers. */
  positive?: boolean;
  /** A button for a fresh one. */
  more: { text: string; onClick: () => void };
}) {
  const start = useMemo((): MathState => ({ ...parseState(startText), ...(positive ? { letters: "positive" as const } : {}) }), [startText, positive]);
  const wants = useMemo(() => goals.map((g) => parseState(g)), [goals]);
  const reached = (s: MathState) => wants.some((w) => stepDone(start, s, w));
  const moves = useMoveHistory(start, reached);
  const { current, undo, reset, canUndo } = moves;
  const showMove = useRef<ShowMove | null>(null);
  const [showing, setShowing] = useState(false);
  const done = reached(current) && !showing;
  // Show: the move played on the board (from the start), then taken back for the learner to try.
  const show = async () => {
    if (showing) return;
    setShowing(true);
    if (canUndo) {
      reset();
      await new Promise((r) => setTimeout(r, 450));
    }
    const ok = await showMove.current?.(rule, reached);
    if (ok) {
      await new Promise((r) => setTimeout(r, 1300));
      undo();
    }
    setShowing(false);
  };

  return (
    <div className="lesson-move">
      <p className="lesson-how">
        <MathText text={how} />
      </p>
      <Board
        moves={moves}
        rules={rules}
        height={160}
        show={showMove}
        busy={showing}
        status={done && t().done}
        before={
          <button onClick={show} disabled={showing}>
            {t().showMove}
          </button>
        }
        after={
          <button className={done ? "primary" : ""} onClick={more.onClick}>
            {more.text}
          </button>
        }
      />
    </div>
  );
}
