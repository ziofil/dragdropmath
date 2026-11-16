import { useEffect, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { stateKey } from "../expr/key";
import { TIDY_STEP_MS, tidySteps } from "../game/tidy";

export type MoveHistory = ReturnType<typeof useMoveHistory>;

/** A state reached: by the learner's own move, or by tidying after it. */
type Entry = { state: MathState; tidy?: true };

/**
 * The states a board goes through: each move, then the tidying after it
 * (x·2 → 2x), shown one step at a time. Pending tidying belongs to its move:
 * undoing it, resetting or loading something new cancels it, and a move made
 * before it's shown takes it over (tidying from where it started).
 *
 * `stopAt`: tidying stops once a state like this is reached (an exercise's goal).
 */
export function useMoveHistory(start: MathState, stopAt?: (s: MathState) => boolean) {
  const [history, setHistory] = useState<Entry[]>(() => [{ state: start }]);
  const generation = useRef(0);
  const tidyFrom = useRef<MathState | null>(null);
  useEffect(() => () => void generation.current++, []);
  const current = history[history.length - 1].state;

  const cancelTidying = () => {
    generation.current++;
    tidyFrom.current = null;
  };

  const onDrop = (next: MathState) => {
    if (stateKey(next, "exact") === stateKey(current, "exact")) return;
    const gen = ++generation.current;
    const from = tidyFrom.current ?? current;
    tidyFrom.current = null;
    setHistory((h) => [...h, { state: next }]);
    if (stopAt?.(next)) return;
    const steps = tidySteps(from, next, history.map((e) => e.state));
    const done = stopAt ? steps.findIndex(stopAt) : -1;
    const upTo = done < 0 ? steps : steps.slice(0, done + 1);
    // With reduced motion, the tidying isn't played step by step: its end, at once.
    const shown = reducedMotion() ? upTo.slice(-1) : upTo;
    if (shown.length) tidyFrom.current = from;
    shown.forEach((state, i) =>
      setTimeout(() => {
        if (generation.current !== gen) return;
        setHistory((h) => [...h, { state, tidy: true }]);
        if (i === shown.length - 1) tidyFrom.current = null;
      }, TIDY_STEP_MS * (i + 1)),
    );
  };

  return {
    current,
    onDrop,
    canUndo: history.length > 1,
    /** Takes back the last move, with the tidying after it. */
    undo: () => {
      cancelTidying();
      setHistory((h) => {
        let n = h.length - 1;
        while (n > 0 && h[n].tidy) n--;
        return h.slice(0, Math.max(1, n));
      });
    },
    reset: () => {
      cancelTidying();
      setHistory((h) => [h[0]]);
    },
    /** Something new to start from. */
    load: (s: MathState) => {
      cancelTidying();
      setHistory([{ state: s }]);
    },
  };
}

/** The viewer asks for less motion (a system setting). */
export const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
