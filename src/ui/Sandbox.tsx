import { useState, type FormEvent } from "react";
import { parseState } from "../expr/parse";
import { ALL_RULES } from "../rules";
import { MathCanvas } from "./MathCanvas";
import { useMoveHistory } from "./useMoveHistory";
import { t } from "../i18n";

const START = "2(x + 3) - x";

/** Any expression or equation, every move: no goal, just playing with it. */
export function Sandbox() {
  const [text, setText] = useState(START);
  const [error, setError] = useState<string | null>(null);
  // Tidying (x·2 → 2x) follows a move on its own, as in the exercises.
  const { current, onDrop, undo, reset, canUndo, load: start } = useMoveHistory(parseState(START));

  const load = (e: FormEvent) => {
    e.preventDefault();
    try {
      start(parseState(text));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
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
          <div className="actions">
            <button onClick={undo} disabled={!canUndo}>
              {t().undo}
            </button>
            <button onClick={reset} disabled={!canUndo}>
              {t().reset}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
