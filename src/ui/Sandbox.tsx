import { useEffect, useRef, useState, type FormEvent } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import { ALL_RULES } from "../rules";
import { TIDY_STEP_MS, tidySteps } from "../game/tidy";
import { MathCanvas } from "./MathCanvas";
import { t } from "../i18n";

const START = "2(x + 3) - x";

/** A state reached: by a move, or by tidying after it. */
type Entry = { state: MathState; tidy?: true };

/** Any expression or equation, every move: no goal, just playing with it. */
export function Sandbox() {
  const [text, setText] = useState(START);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Entry[]>(() => [{ state: parseState(START) }]);
  const current = history[history.length - 1].state;

  // Tidying (x·2 → 2x) follows a move on its own, as in the exercises. It
  // belongs to that move: undoing it, or loading something new, cancels it.
  const generation = useRef(0);
  const tidyFrom = useRef<MathState | null>(null);
  useEffect(() => () => void generation.current++, []);
  const cancelTidying = () => {
    generation.current++;
    tidyFrom.current = null;
  };

  const load = (e: FormEvent) => {
    e.preventDefault();
    try {
      const s = parseState(text);
      cancelTidying();
      setHistory([{ state: s }]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const onDrop = (next: MathState) => {
    if (stateKey(next, "exact") === stateKey(current, "exact")) return;
    const gen = ++generation.current;
    const from = tidyFrom.current ?? current;
    tidyFrom.current = null;
    setHistory((h) => [...h, { state: next }]);
    const steps = tidySteps(from, next, history.map((e) => e.state));
    if (steps.length) tidyFrom.current = from;
    steps.forEach((state, i) =>
      setTimeout(() => {
        if (generation.current !== gen) return;
        setHistory((h) => [...h, { state, tidy: true }]);
        if (i === steps.length - 1) tidyFrom.current = null;
      }, TIDY_STEP_MS * (i + 1)),
    );
  };

  // Undo takes back the last move, with the tidying after it.
  const undo = () => {
    cancelTidying();
    setHistory((h) => {
      let n = h.length - 1;
      while (n > 0 && h[n].tidy) n--;
      return h.slice(0, Math.max(1, n));
    });
  };
  const reset = () => {
    cancelTidying();
    setHistory((h) => [h[0]]);
  };

  return (
    <main className="puzzle">
      <header className="puzzle-head">
        <a href="#/" className="back">
          {t().backToPath}
        </a>
        <div className="title">{t().sandbox}</div>
      </header>

      <form className="sandbox-form" onSubmit={load}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label={t().sandboxInput}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={t().sandboxPlaceholder}
        />
        <button className="primary" type="submit">
          {t().sandboxLoad}
        </button>
      </form>
      {error && <p className="error">{error}</p>}

      <section className="board">
        <MathCanvas state={current} rules={ALL_RULES} onDrop={onDrop} />
        <div className="board-bar">
          <span />
          <div className="actions">
            <button onClick={undo} disabled={history.length <= 1}>
              {t().undo}
            </button>
            <button onClick={reset} disabled={history.length <= 1}>
              {t().reset}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
