import type { MutableRefObject, ReactNode } from "react";
import type { RuleId } from "../rules";
import { MathCanvas, type ShowMove } from "./MathCanvas";
import type { MoveHistory } from "./useMoveHistory";
import { t } from "../i18n";

/**
 * A board: the maths to drag (no frame: a piece carried past its edge is
 * never cut off), and under it one bar: a line of status on one side, and
 * the buttons on the other — Undo and Start over, with `before` and `after`
 * them what this board adds (Show; Reveal or "Another one"). Every board in
 * the app is this one. Locked, it's drawn the same, at the same height, but
 * nothing moves: so when it unlocks, nothing on the page moves either.
 */
export function Board({
  moves,
  rules,
  locked = false,
  busy = false,
  height,
  show,
  status,
  before,
  after,
}: {
  moves: MoveHistory;
  rules: readonly RuleId[];
  /** Drawn, but waiting (predict first). */
  locked?: boolean;
  /** A move is being shown: hands off. */
  busy?: boolean;
  height?: number;
  show?: MutableRefObject<ShowMove | null>;
  /** What's happened (Done, Right!): said aloud by screen readers. */
  status?: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
}) {
  const off = !moves.canUndo || busy || locked;
  return (
    <section className={`board ${locked ? "board-locked" : ""}`}>
      <MathCanvas state={moves.current} rules={rules} onDrop={moves.onDrop} height={height} show={show} locked={locked} />
      <div className="board-bar">
        <div className="board-actions">
          {before}
          <button onClick={moves.undo} disabled={off}>
            {t().undo}
          </button>
          <button onClick={moves.reset} disabled={off}>
            {t().startOver}
          </button>
          {after}
        </div>
        <div className="board-status" role="status">
          {status}
        </div>
      </div>
    </section>
  );
}
