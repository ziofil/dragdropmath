import { useState, type FormEvent } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import { ALL_RULES } from "../rules";
import { MathCanvas } from "./MathCanvas";
import { checkEnv, Invariant } from "./Invariant";

const START = "2(x + 3) - x";

export function Sandbox() {
  const [text, setText] = useState(START);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<MathState[]>(() => [parseState(START)]);
  const current = history[history.length - 1];

  const load = (e: FormEvent) => {
    e.preventDefault();
    try {
      setHistory([parseState(text)]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const onDrop = (dropped: MathState) => {
    const next = dropped;
    if (stateKey(next, "exact") !== stateKey(current, "exact")) setHistory((h) => [...h, next]);
  };

  return (
    <main className="puzzle">
      <header className="puzzle-head">
        <a href="#/" className="back">
          ← Map
        </a>
        <div className="title">Sandbox</div>
      </header>

      <form className="sandbox-form" onSubmit={load}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Expression or equation"
          spellCheck={false}
          placeholder="e.g. 3(x - 2) = 2x + 1   or   ln(x^2) = e^(ln(4))"
        />
        <button className="primary" type="submit">
          Load
        </button>
      </form>
      {error && <p className="error">{error}</p>}

      <section className="board">
        <MathCanvas state={current} rules={ALL_RULES} onDrop={onDrop} />
        <div className="board-bar">
          {current.sides.length === 1 && <Invariant state={current} env={checkEnv(current)} />}
          <div className="actions">
            <button onClick={() => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))} disabled={history.length <= 1}>
              Undo
            </button>
            <button onClick={() => setHistory((h) => [h[0]])} disabled={history.length <= 1}>
              Reset
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
