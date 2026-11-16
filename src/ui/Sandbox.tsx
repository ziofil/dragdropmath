import { useState, type FormEvent } from "react";
import { parseState } from "../expr/parse";
import { ALL_RULES } from "../rules";
import { Board } from "./Board";
import { useMoveHistory } from "./useMoveHistory";
import { t } from "../i18n";
import { href } from "./routes";

const START = "2(x + 3) - x";

/** Any expression or equation, every move: no goal, just playing with it. */
export function Sandbox() {
  const [text, setText] = useState(START);
  const [error, setError] = useState<string | null>(null);
  // Tidying (x·2 → 2x) follows a move on its own, as in the exercises.
  const moves = useMoveHistory(parseState(START));

  const load = (e: FormEvent) => {
    e.preventDefault();
    try {
      moves.load(parseState(text));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <main className="puzzle">
      <header className="puzzle-head">
        <a href={href({ page: "home" })} className="back-link">
          {t().backToPath}
        </a>
        <div className="puzzle-title">Sandbox</div>
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
      {error && <p className="sandbox-error">{error}</p>}

      <Board moves={moves} rules={ALL_RULES} />
    </main>
  );
}
