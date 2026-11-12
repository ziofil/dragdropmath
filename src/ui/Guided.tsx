import { useMemo, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import type { RuleId } from "../rules";
import type { Guided } from "../game/puzzles";
import { matchesGoal } from "../game/solver";
import { TIDY_STEP_MS, tidied } from "../game/tidy";
import { MathCanvas } from "./MathCanvas";
import { MathText } from "./MathText";
import { t, type ChapterText } from "../i18n";

/**
 * A worked example the learner does by hand, one instructed move at a time.
 * Moves other than the one asked for are real moves, just not this
 * example's: they're shown, then gently put back.
 */
export function GuidedExample({
  example,
  words,
  rules,
  n,
}: {
  example: Guided;
  /** Its instructions and closing remark, in the reader's language. */
  words: ChapterText["lesson"][number];
  rules: readonly RuleId[];
  n: number;
}) {
  const start = useMemo(() => parseState(example.start), [example]);
  const wants = useMemo(() => example.steps.map((s) => parseState(s.then)), [example]);
  const [states, setStates] = useState<MathState[]>([start]);
  const [detour, setDetour] = useState<MathState | null>(null);

  // Steps are followed in order; once they're all done, the board stays live
  // to finish the job freely (tidy up 2·9/(3·4), work out √4...).
  const step = Math.min(states.length - 1, example.steps.length);
  const done = step >= example.steps.length;
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
    if (done || matchesGoal(next, wants[step])) return accept(next);
    // A fine move, but not the one this example is about: show it, then go back.
    setDetour(next);
    setTimeout(() => setDetour(null), 900);
  };

  return (
    <div className={`guided ${done ? "guided-done" : ""}`}>
      <div className="guided-head">
        <span className="guided-num">{t().exampleN(n)}</span>
        <ol className="guided-steps">
          {example.steps.map((s, i) => (
            <li key={i} className={i < step ? "past" : i === step ? "now" : "later"}>
              {i < step && <span className="guided-tick">✓ </span>}
              <MathText text={words.steps?.[i] ?? s.say} />
            </li>
          ))}
        </ol>
      </div>
      <div className="board guided-board">
        <MathCanvas state={current} rules={rules} onDrop={onDrop} height={160} />
        <div className="board-bar">
          <p className="guided-status" role="status">
            {detour ? t().notThisStep : done ? (
              <>
                <MathText text={words.after ?? t().done} /> <span className="guided-free">{t().keepGoing}</span>
              </>
            ) : t().stepOf(step + 1, example.steps.length)}
          </p>
          <div className="actions">
            <button
              onClick={() => {
                tidyFrom.current = null;
                setStates([start]);
              }}
              disabled={states.length <= 1}
            >
              {t().startOver}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
