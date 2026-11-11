import { useMemo, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import type { RuleId } from "../rules";
import type { Guided } from "../game/puzzles";
import { matchesGoal } from "../game/solver";
import { autoSteps, ROUTINES } from "../game/auto";
import { MathCanvas } from "./MathCanvas";
import { MathText } from "./MathText";

/**
 * A worked example the learner does by hand, one instructed move at a time.
 * Moves other than the one asked for are real moves, just not this
 * example's: they're shown, then gently put back.
 */
export function GuidedExample({ example, rules, n }: { example: Guided; rules: readonly RuleId[]; n: number }) {
  const start = useMemo(() => parseState(example.start), [example]);
  const wants = useMemo(() => example.steps.map((s) => parseState(s.then)), [example]);
  const [states, setStates] = useState<MathState[]>([start]);
  const [detour, setDetour] = useState<MathState | null>(null);

  // Steps are followed in order; once they're all done, the board stays live
  // to finish the job freely (tidy up 2·9/(3·4), work out √4...).
  const step = Math.min(states.length - 1, example.steps.length);
  const done = step >= example.steps.length;
  const current = detour ?? states[states.length - 1];

  const accept = (next: MathState) => {
    setStates((ss) => [...ss, next]);
    // Tidying (x·2 → 2x) happens on its own here too, just after.
    const tidied = autoSteps(current, next, [ROUTINES.tidy], states).at(-1)?.state;
    if (tidied) setTimeout(() => setStates((ss) => (ss[ss.length - 1] === next ? [...ss.slice(0, -1), tidied] : ss)), 420);
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
        <span className="guided-num">Example {n}</span>
        <ol className="guided-steps">
          {example.steps.map((s, i) => (
            <li key={i} className={i < step ? "past" : i === step ? "now" : "later"}>
              {i < step && <span className="guided-tick">✓ </span>}
              <MathText text={s.say} />
            </li>
          ))}
        </ol>
      </div>
      <div className="board guided-board">
        <MathCanvas state={current} rules={rules} onDrop={onDrop} height={160} />
        <div className="board-bar">
          <p className="guided-status" role="status">
            {detour ? "That's a real move, but not the one this example is about. Back it goes." : done ? (
              <>
                <MathText text={example.after ?? "Done."} /> <span className="guided-free">Keep going if you like: any move works now.</span>
              </>
            ) : `Step ${step + 1} of ${example.steps.length}`}
          </p>
          <div className="actions">
            <button onClick={() => setStates([start])} disabled={states.length <= 1}>
              Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
