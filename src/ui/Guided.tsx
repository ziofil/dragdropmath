import { useMemo, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { assuming } from "../expr/setting";
import { parseState } from "../expr/parse";
import type { RuleId } from "../rules";
import { stepDone } from "../game/solver";
import { tidied } from "../game/tidy";
import { wayFor, type WayAnswer, type WayRequest } from "../game/showWay";
import { printState, stateKey } from "../expr/key";
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
  via,
  how,
  rules,
  rule,
  prefer,
  positive,
  more,
}: {
  start: string;
  goals: string[];
  /** Checkpoints on the way to the goal, in order (Show passes through them: the way the words describe). */
  via?: string[];
  /** What to do, in the reader's language. */
  how: string;
  rules: readonly RuleId[];
  /** The move it teaches (what Show plays first). */
  rule: RuleId;
  /** The piece Show carries, when the words say which. */
  prefer?: (s: MathState, id: string) => boolean;
  /** Its letters stand for positive numbers. */
  positive?: boolean;
  /** A button for a fresh one. */
  more: { text: string; onClick: () => void };
}) {
  const start = useMemo((): MathState => assuming(parseState(startText), positive), [startText, positive]);
  const wants = useMemo(() => goals.map((g) => parseState(g)), [goals]);
  const stops = useMemo(() => (via ?? []).map((v) => assuming(parseState(v), positive)), [via, positive]);
  const reached = (s: MathState) => wants.some((w) => stepDone(start, s, w));
  const moves = useMoveHistory(start, reached);
  const { current, reset, canUndo } = moves;
  const showMove = useRef<ShowMove | null>(null);
  const [showing, setShowing] = useState(false);
  // The board as it is now, for Show's steps (they run on across renders), and whether Stop was pressed.
  const latest = useRef(current);
  latest.current = current;
  const stopped = useRef(false);
  const done = reached(current) && !showing;

  /** Until the board shows `want` (the step and its tidying), or has stopped changing. */
  const settle = async (want: MathState) => {
    let key = stateKey(latest.current, "exact");
    let still = 0;
    for (let k = 0; k < 60 && !stopped.current; k++) {
      if (same(latest.current, want) || reached(latest.current)) return;
      await wait(100);
      const now = stateKey(latest.current, "exact");
      still = now === key ? still + 1 : 0;
      key = now;
      if (still >= 9) return;
    }
  };

  // Show: the lesson's move played on the board, then every step on to its end; then taken back for the learner to try.
  const show = async () => {
    if (showing) {
      stopped.current = true;
      return;
    }
    stopped.current = false;
    setShowing(true);
    if (canUndo) {
      reset();
      await wait(450);
    }
    // The lesson's own move, heading for the first checkpoint (or the end); the way on from where it
    // leads is searched (off the page's thread) while it's played.
    const toward = (s: MathState) => reached(s) || (stops.length > 0 && stepDone(start, tidied(start, s), stops[0]));
    const ask = (from: MathState) => askWay({ start: startText, from: printState(from), stops: via ?? [], goals, rules: [...rules], positive: !!positive }).then((w) => (w ?? []).map((x) => assuming(parseState(x), positive)));
    // (Set by `planned`, while the move is played: written so, the checker doesn't take them for always null.)
    let expected = null as MathState | null;
    let pending = null as Promise<MathState[]> | null;
    let way: MathState[] = [];
    let before = start;
    const planned = (next: MathState) => {
      expected = tidied(start, next);
      pending = ask(expected);
    };
    let dropped = (await showMove.current?.({ rule, good: toward, prefer, planned })) ?? null;
    // Then every step on to the end, along that way (searched again only if the board isn't where it said).
    for (let n = 0; dropped && n < 40; n++) {
      await settle(tidied(before, dropped));
      if (stopped.current || reached(latest.current)) break;
      if (pending) {
        way = await pending;
        pending = null;
      }
      if (!expected || !same(latest.current, expected)) way = await ask(latest.current);
      if (stopped.current || !way.length) break;
      before = latest.current;
      const next = way[0];
      way = way.slice(1);
      expected = next;
      dropped = (await showMove.current?.({ to: (s) => same(tidied(before, s), next) })) ?? null;
    }
    if (!stopped.current) await wait(1300);
    reset();
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
        before={<button onClick={show}>{showing ? t().stopShow : t().showMove}</button>}
        after={
          <button className={done ? "primary" : ""} onClick={more.onClick} disabled={showing}>
            {more.text}
          </button>
        }
      />
    </div>
  );
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const same = (a: MathState, b: MathState) => stateKey(a, "exact") === stateKey(b, "exact");

/**
 * Show's way on, searched by a worker (one for every board, made when Show is
 * first pressed); where there are no workers, searched here.
 */
let worker: Worker | null | undefined;
const waiting = new Map<number, (way: string[] | null) => void>();
let asked = 0;
function askWay(req: Omit<WayRequest, "id">): Promise<string[] | null> {
  if (worker === undefined) {
    try {
      worker = new Worker(new URL("../game/showWorker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (e: MessageEvent<WayAnswer>) => {
        waiting.get(e.data.id)?.(e.data.way);
        waiting.delete(e.data.id);
      };
    } catch {
      worker = null;
    }
  }
  if (!worker) return Promise.resolve(wayFor(req));
  const id = asked++;
  return new Promise((resolve) => {
    waiting.set(id, resolve);
    worker!.postMessage({ ...req, id } satisfies WayRequest);
  });
}
