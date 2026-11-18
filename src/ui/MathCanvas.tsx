import { Component, createElement, isValidElement, lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type MutableRefObject, type ReactNode, type RefObject } from "react";
import { fontEpoch, subscribeFont } from "../render/measure";
import { printState, stateKey } from "../expr/key";
import { DraggableRenderer, Vec2, type Draggable } from "dragology";
import type { MathState } from "../expr/types";
import type { RuleId } from "../rules";
import { pivotOf, renderState } from "../render/typeset";
import { boardFor, type Press } from "../render/press";
import { interactive, recorded } from "../render/drag";
import { thumbLift } from "../render/drag/lift";
import { planDemo, planStepTo } from "../render/demo";
import { useSettings } from "./settings";
import { t } from "../i18n";

const NO_RULES: readonly RuleId[] = [];

/**
 * How far a press may move and still be a press, not a drag: one tolerance
 * for the drag engine (below it, no drag starts), for taps, and for holding
 * still (useHold). A hold therefore always fires before any drag has begun.
 */
const PRESS_SLOP = 6;

/**
 * A step for Show to play: the lesson's own move (by `rule`, heading where
 * `good` likes, carrying the piece `prefer` names), or the next step on, to
 * a state `to` likes (played a little quicker).
 */
export type ShowStep =
  | {
      rule: RuleId;
      good?: (s: MathState) => boolean;
      prefer?: (s: MathState, id: string) => boolean;
      /** Told what the move will give as soon as it's planned, before it's played. */
      planned?: (next: MathState) => void;
    }
  | { to: (s: MathState) => boolean };

/** Plays one step on the board, as a hand would (see Demo): the state it gave, or null if it can't be shown. */
export type ShowMove = (step: ShowStep & { stopped?: () => boolean }) => Promise<MathState | null>;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** The interactive surface: drag pieces of the expression around. */
export function MathCanvas({
  state,
  rules,
  onDrop,
  height = 220,
  show,
  locked = false,
}: {
  state: MathState;
  rules: readonly RuleId[];
  onDrop: (next: MathState) => void;
  height?: number;
  /** Drawn exactly as usual, but nothing can be moved or tapped yet (predict first). */
  locked?: boolean;
  /** Filled in with a way to play a move on this board. */
  show?: MutableRefObject<ShowMove | null>;
}) {
  const width = useContainerWidth();
  // Laid out again when the maths font changes (a skin, or the font arriving late).
  const font = useSyncExternalStore(subscribeFont, fontEpoch);
  const live = locked ? NO_RULES : rules;
  // Taps apply like drops; a ref keeps the draggable stable across renders.
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;
  const debug = useSettings().debug;
  // Where the = sits: read off the board as it is, and kept for everything a drag passes through.
  const pivot = useMemo(() => pivotOf(state, width.value), [state, width.value, font]); // eslint-disable-line react-hooks/exhaustive-deps
  const draggable = useMemo<Draggable<MathState>>(
    () =>
      ({ state, d, draggedId }) =>
        renderState(
          interactive({
            state,
            d,
            rules: live,
            draggedId,
            onTap: (next) => onDropRef.current(next),
            // Touch drags ride above the finger. Debug mode also records every drag, to replay as a test.
            wrap: (spec) => {
              const seen = import.meta.env.DEV && debug ? spec.with(recorded(live, width.value, height, (rec) => void import("./debug").then((m) => m.noteRecording(rec)))) : spec;
              return seen.with(thumbLift());
            },
            pivot,
          }),
          width.value,
          height,
        ),
    [live, width.value, height, debug, font, pivot],
  );
  // Taps go by position (see useTaps).
  const now = useRef({ state, rules: live });
  now.current = { state, rules: live };
  // A press held still picks up the piece under it, not its term (see useHold).
  const [heldAt, setHeldAt] = useState<{ x: number; y: number } | null>(null);
  // What a press at a point does (render/press.ts): the one place it's decided, for presses, holds, taps and Show.
  const pressAt = useRef((_x: number, _y: number): Press | null => null);
  pressAt.current = (clientX, clientY) => {
    const svg = width.ref.current?.querySelector("svg");
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const k = r.width / width.value;
    return boardFor(now.current.state, now.current.rules, width.value, height).at({ x: (clientX - r.left) / k, y: (clientY - r.top) / k });
  };
  const held = useHold(width.ref, pressAt, (p) => {
    setHeldAt(p);
    setTimeout(() => setHeldAt(null), 450);
  });
  useTaps(width.ref, held, (x, y) => {
    // A tap that goes wrong (outside React's reach: an event, not a render) does nothing, as a wrong move does.
    let next = null;
    try {
      next = pressAt.current(x, y)?.tap?.state ?? null;
    } catch (e) {
      console.error(e);
    }
    if (next) onDropRef.current(next);
  });
  // A finger, for a move played to watch: where it is, and whether it's pressing.
  const [finger, setFinger] = useState<{ x: number; y: number; down: boolean } | null>(null);
  // While it plays, the board is the finger's: a real press would mix its events with the played ones.
  const playing = useRef(false);
  useEffect(() => {
    const box = width.ref.current;
    if (!box) return;
    // A real press goes to the piece a quick press there takes (render/press.ts), whatever the pointer is over:
    // the + or − of x − 4 takes the whole x − 4. While a move is played, the board is the finger's alone.
    const route = (e: PointerEvent) => {
      if (!e.isTrusted) return;
      e.stopPropagation();
      if (playing.current) return e.preventDefault();
      const id = pressAt.current(e.clientX, e.clientY)?.quick;
      const piece = id ? box.querySelector(`g[id="${CSS.escape(id)}"]`) : null;
      if (piece) piece.dispatchEvent(new PointerEvent("pointerdown", e));
    };
    // The pointer shows a hand where a press picks something up.
    const hover = (e: PointerEvent) => {
      if (e.buttons) return;
      box.style.cursor = pressAt.current(e.clientX, e.clientY)?.quick ? "grab" : "";
    };
    box.addEventListener("pointerdown", route, true);
    box.addEventListener("pointermove", hover);
    return () => {
      box.removeEventListener("pointerdown", route, true);
      box.removeEventListener("pointermove", hover);
    };
  }, [width.ref]);
  if (show)
    show.current = async (step) => {
      playing.current = true;
      try {
        return await play(step);
      } finally {
        playing.current = false;
      }
    };
  const play: ShowMove = async (step) => {
      const box = width.ref.current;
      const svg = box?.querySelector("svg");
      const { state: at0, rules: live0 } = now.current;
      const own = "rule" in step;
      // Stop pressed: the step ends where it is, its finger gone.
      const halt = () => step.stopped?.() ?? false;
      const quit = () => {
        setFinger(null);
        return null;
      };
      const plan = own ? planDemo(at0, live0, step.rule, width.value, height, step.good, step.prefer) : planStepTo(at0, live0, width.value, height, step.to);
      if (!box || !svg || !plan) return null;
      if (own) step.planned?.(plan.next);
      // The steps after the lesson's own move go a little quicker.
      const pause = own ? 450 : 300;
      const r = svg.getBoundingClientRect();
      const k = r.width / width.value;
      const client = (p: { x: number; y: number }) => ({ clientX: r.left + p.x * k, clientY: r.top + p.y * k });
      if (plan.kind === "tap") {
        // Where a tap gives it (render/press.ts): on the piece, or on its +, − or ·.
        const at = plan.at;
        setFinger({ ...at, down: false });
        await wait(pause);
        if (halt()) return quit();
        setFinger({ ...at, down: true });
        await wait(250);
        if (halt()) return quit();
        onDropRef.current(plan.next);
        setFinger({ ...at, down: false });
        await wait(400);
        setFinger(null);
        return plan.next;
      }
      // The piece's own element is pressed (held first when a quick press would take something bigger, as useHold does).
      const target = svg.querySelector(`g[id="${CSS.escape(plan.id)}"]`);
      if (!target) return null;
      // The finger is drawn where a press takes the piece (render/press.ts: the + of x + 4, not its x, which
      // takes the x). The drag itself is played from plan.from, as worked out; the finger keeps that offset all along.
      const shift = Vec2(plan.grip.x - plan.from.x, plan.grip.y - plan.from.y);
      const drawn = (p: Vec2) => p.add(shift);
      setFinger({ ...drawn(plan.from), down: false });
      await wait(pause);
      if (halt()) return quit();
      const init = (p: { x: number; y: number }, buttons: number): PointerEventInit => ({
        ...client(p),
        bubbles: true,
        cancelable: true,
        pointerId: 77,
        pointerType: "mouse",
        isPrimary: true,
        button: 0,
        buttons,
      });
      setFinger({ ...drawn(plan.from), down: true });
      if (plan.hold) {
        await wait(HOLD_MS + 150);
        if (halt()) return quit();
        setHeldAt({ ...drawn(plan.from) });
        setTimeout(() => setHeldAt(null), 450);
      }
      target.dispatchEvent(new PointerEvent("pointerdown", init(plan.from, 1)));
      const ms = (own ? 1 : 0.75) * Math.min(1400, Math.max(700, plan.to.sub(plan.from).len() * 4));
      const t0 = performance.now();
      for (;;) {
        await new Promise((res) => requestAnimationFrame(res));
        // Stopped on the way: let go where it was picked up (no move), and the finger goes.
        if (halt()) {
          document.dispatchEvent(new PointerEvent("pointermove", init(plan.from, 1)));
          document.dispatchEvent(new PointerEvent("pointerup", init(plan.from, 0)));
          return quit();
        }
        const t = Math.min(1, (performance.now() - t0) / ms);
        const p = plan.from.add(plan.to.sub(plan.from).mul(ease(t)));
        setFinger({ ...drawn(p), down: true });
        document.dispatchEvent(new PointerEvent("pointermove", init(p, 1)));
        if (t >= 1) break;
      }
      await wait(150);
      document.dispatchEvent(new PointerEvent("pointerup", init(plan.to, 0)));
      setFinger({ ...drawn(plan.to), down: false });
      await wait(400);
      setFinger(null);
      return plan.next;
    };
  return (
    <>
      <div ref={width.ref} className="canvas">
        {finger && <div className={`demo-finger ${finger.down ? "down" : ""}`} style={{ left: finger.x, top: finger.y }} aria-hidden />}
        {heldAt && <div className="held-ring" style={{ left: heldAt.x, top: heldAt.y }} aria-hidden />}
        <CanvasErrorBoundary resetKey={stateKey(state, "exact")} height={height}>
          <DraggableRenderer
            draggable={draggable}
            state={state}
            onDropState={onDrop}
            width={width.value}
            height={height}
            dragThreshold={PRESS_SLOP}
            showDebugOverlay={debug}
          />
        </CanvasErrorBoundary>
      </div>
      {debug && DebugPanel && (
        <Suspense fallback={null}>
          <DebugPanel state={state} rules={rules} />
        </Suspense>
      )}
    </>
  );
}

/**
 * A crash inside the drag engine must not blank the whole page. Show what
 * went wrong in place of the canvas, with a way back.
 */
class CanvasErrorBoundary extends Component<
  { resetKey: string; height: number; children: ReactNode },
  { error: Error | null; key: string }
> {
  state = { error: null as Error | null, key: this.props.resetKey };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(props: { resetKey: string }, state: { key: string }) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }

  componentDidCatch(error: Error) {
    console.error("Drag canvas crashed:", error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="canvas-error" style={{ height: this.props.height }} role="alert">
        <strong>{t().moveCrashed}</strong>
        <span>{t().moveCrashedDetails}</span>
        <button onClick={() => this.setState({ error: null })}>{t().tryAgain}</button>
      </div>
    );
  }
}

/**
 * Maths for plain React (nothing to drag, nothing to animate): the drawing
 * without the drag engine's props, every element keyed (by its name, its
 * piece, or its place), as React wants of a list.
 */
function plain(n: ReactNode, at = "0"): ReactNode {
  if (Array.isArray(n)) return n.map((c, i) => plain(c, `${at}.${i}`));
  if (!isValidElement(n) || typeof n.type !== "string") return n;
  const { children, ...props } = n.props as Record<string, unknown> & { children?: ReactNode };
  const kept = Object.fromEntries(Object.entries(props).filter(([p]) => !p.startsWith("dragology")));
  return createElement(n.type, { ...kept, key: n.key ?? (typeof props.id === "string" ? props.id : at) }, plain(children, at));
}


/** Debug mode's panel (move details, the last drag's recording): on the dev server only (tools.ts). */
// (import.meta.env.DEV written out, not TOOLS: so a build drops the import, and the file with it.)
const DebugPanel = import.meta.env.DEV ? lazy(() => import("./debug").then((m) => ({ default: m.DebugPanel }))) : null;

/** A non-interactive rendering, e.g. for showing the goal. */
/**
 * `room`: extra height above and below, always kept, so a row of these (the
 * answers to pick from) is drawn at one scale whether or not there are fractions.
 */
export function StaticMath({
  state,
  width = 720,
  height = 110,
  room = 0,
  inline = false,
  scale,
}: {
  state: MathState;
  width?: number;
  height?: number;
  room?: number;
  inline?: boolean;
  /** Drawn at this many pixels a unit, fitted to what's drawn: drawings side by side at one scale (else it fills its box). */
  scale?: number;
}) {
  // Fitted to what's drawn, so a short expression isn't shrunk to fit an empty strip.
  const ref = useRef<SVGSVGElement>(null);
  const font = useSyncExternalStore(subscribeFont, fontEpoch);
  const [view, setView] = useState(`0 0 ${width} ${height}`);
  useLayoutEffect(() => {
    const g = ref.current?.getBBox();
    if (!g || g.width <= 0) return;
    // The usual strip, grown wherever something tall (a power on top of a fraction) would be cut off.
    // Inline in a sentence: just what's drawn, so it sits at the size of the words.
    const fit = inline || scale !== undefined;
    const top = fit ? g.y - 2 : Math.min(-room, g.y - 6);
    const bottom = fit ? g.y + g.height + 2 : Math.max(height + room, g.y + g.height + 6);
    setView(`${g.x - (inline ? 2 : 8)} ${top} ${g.width + (inline ? 4 : 16)} ${bottom - top}`);
  }, [state, width, height, room, font, inline, scale]);
  return (
    <svg
      ref={ref}
      className={inline ? "static-math static-math-inline" : "static-math"}
      viewBox={view}
      style={scale === undefined ? undefined : { width: Number(view.split(" ")[2]) * scale }}
      role="img" aria-label={printState(state).replace(/\*/g, "·")}>
      {plain(renderState({ state }, width, height))}
    </svg>
  );
}

/**
 * A tap is a press let go within a few pixels of where it started. Browsers
 * send no click for a press on a piece that can be dragged (the drag engine
 * takes the press), so taps are watched here instead, whatever is pressed.
 */
function useTaps(ref: RefObject<HTMLElement | null>, held: RefObject<boolean>, onTap: (x: number, y: number) => void) {
  const handler = useRef(onTap);
  handler.current = onTap;
  useEffect(() => {
    let down: PointerEvent | null = null;
    // A press that ever went further than PRESS_SLOP was a drag, even if it came back where it started.
    let wandered = false;
    const onDown = (e: PointerEvent) => {
      if (!e.isTrusted || !ref.current?.contains(e.target as Node)) return;
      down = e;
      wandered = false;
    };
    const onMove = (e: PointerEvent) => {
      if (down && e.isTrusted && e.pointerId === down.pointerId && Math.hypot(e.clientX - down.clientX, e.clientY - down.clientY) > PRESS_SLOP) wandered = true;
    };
    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      // A press held long enough to pick a piece up isn't a tap, nor is a drag brought back.
      if (!d || !e.isTrusted || e.pointerId !== d.pointerId || held.current || wandered) return;
      // After the drag engine has let go of the press too: a press on a piece
      // it could drag ends with it putting back the state it started from.
      if (Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) <= PRESS_SLOP) setTimeout(() => handler.current(d.clientX, d.clientY), 0);
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerup", onUp, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerup", onUp, true);
    };
  }, [ref, held]);
}

/** How long a press must stay still to pick up the piece under it rather than its term. */
export const HOLD_MS = 250;

/**
 * Press and hold: a press that stays still for HOLD_MS on a piece inside a
 * term (the x of 3xy + 2) lets go of the term the press picked up and picks
 * up that piece instead, with the same pointer, so moving on carries it.
 * Returns whether the current press was such a hold (taps ignore it).
 */
function useHold(
  ref: RefObject<HTMLElement | null>,
  pressAt: RefObject<(x: number, y: number) => Press | null>,
  onHeld: (at: { x: number; y: number }) => void,
): RefObject<boolean> {
  const held = useRef(false);
  const handler = useRef(onHeld);
  handler.current = onHeld;
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let down: PointerEvent | null = null;
    // Counts presses and releases: a pick-up a frame late is for the same press, still down.
    let press = 0;
    const stop = () => {
      clearTimeout(timer);
      down = null;
    };
    const onDown = (e: PointerEvent) => {
      if (!e.isTrusted) return;
      press++;
      held.current = false;
      stop();
      const box = ref.current;
      if (!box?.contains(e.target as Node)) return;
      down = e;
      timer = setTimeout(() => {
        const d = down;
        if (!d) return;
        // The piece a hold there takes (render/press.ts), when it isn't what the quick press took.
        const id = pressAt.current!(d.clientX, d.clientY)?.hold;
        const piece = id ? box.querySelector(`g[id="${CSS.escape(id)}"]`) : null;
        if (!piece) return;
        const mine = press;
        const init: PointerEventInit = {
          bubbles: true,
          cancelable: true,
          clientX: d.clientX,
          clientY: d.clientY,
          pointerId: d.pointerId,
          pointerType: d.pointerType,
          isPrimary: d.isPrimary,
          button: 0,
        };
        held.current = true;
        // Let go of the term (still within PRESS_SLOP, no drag has started: it's
        // just a press let go), and once the board has taken that in, pick up the piece.
        document.dispatchEvent(new PointerEvent("pointerup", { ...init, buttons: 0 }));
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (press !== mine) return;
            piece.dispatchEvent(new PointerEvent("pointerdown", { ...init, buttons: 1 }));
          }),
        );
        navigator.vibrate?.(12);
        const r = box.getBoundingClientRect();
        handler.current({ x: d.clientX - r.left, y: d.clientY - r.top });
      }, HOLD_MS);
    };
    const onMove = (e: PointerEvent) => {
      if (down && e.isTrusted && e.pointerId === down.pointerId && Math.hypot(e.clientX - down.clientX, e.clientY - down.clientY) > PRESS_SLOP) stop();
    };
    const onUp = (e: PointerEvent) => {
      if (!e.isTrusted) return;
      press++;
      stop();
    };
    // A long press on a phone would open a menu instead.
    const noMenu = (e: Event) => {
      if (ref.current?.contains(e.target as Node)) e.preventDefault();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("pointercancel", onUp, true);
    document.addEventListener("contextmenu", noMenu, true);
    return () => {
      stop();
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("pointercancel", onUp, true);
      document.removeEventListener("contextmenu", noMenu, true);
    };
  }, [ref, pressAt]);
  return held;
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(720);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setValue(Math.max(280, Math.floor(el.clientWidth)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, value };
}
