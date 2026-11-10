/**
 * Debug mode, for chasing how a drag feels: Dragology's own overlay (each
 * spec's aims and distances on the canvas), an inspector for the current
 * state (every piece's id, marks, and moves), and a recorder for the last
 * drag that can be saved and replayed as a test.
 *
 * On with `?debug` in the address, or Shift+D (remembered in this browser).
 */
import { useEffect, useSyncExternalStore } from "react";
import type { Expr, MathState } from "../expr/types";
import { printState, stateKey } from "../expr/key";
import { allNodes, children } from "../expr/tree";
import { movesFor, signId, type RuleId } from "../rules";
import type { Recording } from "../render/testing/recording";

// ---------- on/off ----------

const STORAGE_KEY = "graspable.debug";
let enabled = initial();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function initial(): boolean {
  if (new URLSearchParams(window.location.search).has("debug")) return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setDebug(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* fine: just won't be remembered */
  }
  notify();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Whether debug mode is on (re-renders when it changes). */
export function useDebug(): boolean {
  return useSyncExternalStore(subscribe, () => enabled);
}

/** Shift+D toggles debug mode (not while typing in a field). */
export function useDebugShortcut() {
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName);
      if (!typing && e.shiftKey && e.key.toLowerCase() === "d") setDebug(!enabled);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
}

// ---------- the last drag ----------

let last: { rec: Recording; frames: number } | null = null;

/** Called by the recorder on every frame of a drag. */
export function noteRecording(rec: Recording) {
  last = { rec, frames: rec.pointers.length };
  notify();
}

const useLastRecording = () => useSyncExternalStore(subscribe, () => last);

// ---------- panel ----------

const show = (e: Expr) => printState({ sides: [e] });

export function DebugPanel({ state, rules }: { state: MathState; rules: readonly RuleId[] }) {
  const lastDrag = useLastRecording();
  const moves = movesFor(state, rules);
  return (
    <section className="debug-panel" aria-label="Debug">
      <div className="debug-head">
        <strong>Debug</strong>
        <span>Shift+D to hide · the overlay shows each option's aim and distance</span>
      </div>

      <div className="debug-block">
        <div className="debug-title">Last drag</div>
        {lastDrag ? (
          <LastDrag rec={lastDrag.rec} frames={lastDrag.frames} />
        ) : (
          <p className="debug-muted">Drag a piece: its path is recorded so it can be replayed as a test.</p>
        )}
      </div>

      <div className="debug-block">
        <div className="debug-title">
          State <code>{stateKey(state, "exact")}</code>
        </div>
        <ul className="debug-tree">
          {state.sides.map((side, i) => (
            <Node key={side.id} e={side} depth={0} label={state.sides.length > 1 ? (i === 0 ? "left" : "right") : undefined} moves={moves} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function LastDrag({ rec, frames }: { rec: Recording; frames: number }) {
  const piece = rec.state.sides.flatMap(allNodes).find((n) => n.id === rec.draggedId || signId(n.id) === rec.draggedId);
  const json = () => JSON.stringify(rec);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json());
    } catch {
      /* clipboard blocked: use Download */
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([json()], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `drag-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="debug-drag">
      <p>
        Carried <code>{piece ? (rec.draggedId.endsWith("-sign") ? "−" : show(piece)) : rec.draggedId}</code> from{" "}
        <code>{printState(rec.state)}</code> over {frames} frames; letting go gave <code>{rec.dropped}</code>.
      </p>
      <div className="debug-actions">
        <button onClick={copy}>Copy recording</button>
        <button onClick={download}>Download .json</button>
      </div>
      <p className="debug-muted">
        Saved into <code>src/render/recordings/</code>, it's replayed by the tests (add <code>"expect": {"{"}"drops": "…"{"}"}</code> to pin the right result).
      </p>
    </div>
  );
}

function Node({ e, depth, label, moves }: { e: Expr; depth: number; label?: string; moves: ReturnType<typeof movesFor> }) {
  const flags = [
    e.from && `from ${e.from}`,
    e.kind === "num" && e.explicit && "explicit",
    e.kind === "pow" && e.radical && "radical",
  ].filter(Boolean);
  const handles = e.kind === "neg" ? [e.id, signId(e.id)] : [e.id];
  const dragOptions = handles.flatMap((h) => moves.drag(h).map((c) => ({ h, c })));
  const tap = moves.tap(e.id);
  const grabbable = handles.filter((h) => moves.grabbable(h));
  return (
    <li>
      <div className="debug-node" style={{ paddingLeft: depth * 14 }}>
        {label && <span className="debug-muted">{label}: </span>}
        <code>{show(e)}</code> <span className="debug-muted">{e.kind}</span> <span className="debug-id">#{e.id}</span>
        {flags.map((f) => (
          <span key={String(f)} className="debug-flag">
            {f}
          </span>
        ))}
        {grabbable.length > 0 && <span className="debug-flag debug-grab">{grabbable.some((h) => h !== e.id) ? "grab (and its −)" : "grab"}</span>}
      </div>
      {(dragOptions.length > 0 || tap) && (
        <details className="debug-moves" style={{ marginLeft: depth * 14 + 14 }}>
          <summary>
            {dragOptions.length} move{dragOptions.length === 1 ? "" : "s"}
            {tap ? " + tap" : ""}
          </summary>
          <ul>
            {dragOptions.map(({ h, c }, k) => (
              <li key={k}>
                {h !== e.id && "(its −) "}
                {c.rule}
                {c.targetId && <> onto <span className="debug-id">#{c.targetId}</span></>}
                {c.secondary && " (secondary)"} → <code>{printState(c.state)}</code>
              </li>
            ))}
            {tap && (
              <li>
                tap: {tap.rule} → <code>{printState(tap.state)}</code>
              </li>
            )}
          </ul>
        </details>
      )}
      {children(e).length > 0 && (
        <ul>
          {children(e).map((c) => (
            <Node key={c.id} e={c} depth={depth + 1} moves={moves} />
          ))}
        </ul>
      )}
    </li>
  );
}
