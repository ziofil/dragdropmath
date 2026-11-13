import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { stateKey } from "../expr/key";
import { DraggableRenderer, type Draggable } from "dragology";
import type { MathState } from "../expr/types";
import { movesFor, operatorTap, type RuleId } from "../rules";
import { OP_TAP, renderState } from "../render/typeset";
import { interactive, recorded } from "../render/drag";
import { thumbLift } from "../render/drag/lift";
import { DebugPanel, noteRecording, useDebug } from "./debug";
import { t } from "../i18n";

/** The interactive surface: drag pieces of the expression around. */
export function MathCanvas({
  state,
  rules,
  onDrop,
  height = 220,
}: {
  state: MathState;
  rules: readonly RuleId[];
  onDrop: (next: MathState) => void;
  height?: number;
}) {
  const width = useContainerWidth();
  // Taps apply like drops; a ref keeps the draggable stable across renders.
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;
  const debug = useDebug();
  useEndCancelledDrags(width.ref);
  const draggable = useMemo<Draggable<MathState>>(
    () =>
      ({ state, d, draggedId }) =>
        renderState(
          interactive({
            state,
            d,
            rules,
            draggedId,
            onTap: (next) => onDropRef.current(next),
            // Touch drags ride above the finger. Debug mode also records every drag, to replay as a test.
            wrap: (spec) => {
              const seen = debug ? spec.with(recorded(rules, width.value, height, noteRecording)) : spec;
              return seen.with(thumbLift());
            },
          }),
          width.value,
          height,
        ),
    [rules, width.value, height, debug],
  );
  // Taps go by position (see useTaps).
  const now = useRef({ state, rules });
  now.current = { state, rules };
  useTaps(width.ref, (x, y) => {
    const next = tapAt(width.ref.current, now.current.state, now.current.rules, x, y);
    if (next) onDropRef.current(next);
  });
  return (
    <>
      <div ref={width.ref} className="canvas">
        <CanvasErrorBoundary resetKey={stateKey(state, "exact")} height={height}>
          <DraggableRenderer
            draggable={draggable}
            state={state}
            onDropState={onDrop}
            width={width.value}
            height={height}
            showDebugOverlay={debug}
          />
        </CanvasErrorBoundary>
      </div>
      {debug && <DebugPanel state={state} rules={rules} />}
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

/** The board as the canvas draws it (same size and place), but nothing can be moved yet: guessing first. */
export function StillBoard({ state, height = 220 }: { state: MathState; height?: number }) {
  const width = useContainerWidth();
  return (
    <div ref={width.ref} className="canvas">
      <svg width={width.value} height={height} role="img" aria-label={t().theExercise}>
        {renderState({ state }, width.value, height)}
      </svg>
    </div>
  );
}

/** A non-interactive rendering, e.g. for showing the goal. */
/**
 * `room`: extra height above and below, always kept, so a row of these (the
 * answers to pick from) is drawn at one scale whether or not there are fractions.
 */
export function StaticMath({ state, width = 720, height = 110, room = 0 }: { state: MathState; width?: number; height?: number; room?: number }) {
  // Fitted to what's drawn, so a short expression isn't shrunk to fit an empty strip.
  const ref = useRef<SVGSVGElement>(null);
  const [view, setView] = useState(`0 0 ${width} ${height}`);
  useLayoutEffect(() => {
    const g = ref.current?.getBBox();
    if (!g || g.width <= 0) return;
    // The usual strip, grown wherever something tall (a power on top of a fraction) would be cut off.
    const top = Math.min(-room, g.y - 6);
    const bottom = Math.max(height + room, g.y + g.height + 6);
    setView(`${g.x - 8} ${top} ${g.width + 16} ${bottom - top}`);
  }, [state, width, height, room]);
  return (
    <svg ref={ref} className="static-math" viewBox={view} role="img" aria-label={t().goal}>
      {renderState({ state }, width, height)}
    </svg>
  );
}

/**
 * A tap is a press let go within a few pixels of where it started. Browsers
 * send no click for a press on a piece that can be dragged (the drag engine
 * takes the press), so taps are watched here instead, whatever is pressed.
 */
function useTaps(ref: RefObject<HTMLElement | null>, onTap: (x: number, y: number) => void) {
  const handler = useRef(onTap);
  handler.current = onTap;
  useEffect(() => {
    let down: PointerEvent | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.isTrusted && ref.current?.contains(e.target as Node)) down = e;
    };
    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || !e.isTrusted || e.pointerId !== d.pointerId) return;
      // After the drag engine has let go of the press too: a press on a piece
      // it could drag ends with it putting back the state it started from.
      if (Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) <= 5) setTimeout(() => handler.current(d.clientX, d.clientY), 0);
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
    };
  }, [ref]);
}

/**
 * What tapping at a point gives: a + or − there that works its sum out
 * (3 + 4 → 7), else the innermost piece there with a tap (the smallest whose
 * box holds the point: 2·3 → 6, √9 → 3, 6 → 2·3), or null.
 */
function tapAt(canvas: HTMLElement | null, state: MathState, rules: readonly RuleId[], x: number, y: number): MathState | null {
  if (!canvas) return null;
  const inside = (el: Element) => {
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom ? r.width * r.height : null;
  };
  for (const el of canvas.querySelectorAll(`svg [${OP_TAP}]`)) {
    if (inside(el) !== null) return operatorTap(state, el.getAttribute(OP_TAP)!, rules);
  }
  const moves = movesFor(state, rules);
  let best: { id: string; area: number } | null = null;
  for (const g of canvas.querySelectorAll("svg g[id]")) {
    if (!moves.tappable(g.id)) continue;
    const area = inside(g);
    if (area !== null && (!best || area < best.area)) best = { id: g.id, area };
  }
  return best ? (moves.tap(best.id)?.state ?? null) : null;
}

/**
 * The drag engine ends a drag on pointerup only. When the browser cancels a
 * press instead (a system gesture, a palm, the pointer leaving the window,
 * the tab losing focus), the drag would never end: the board freezes
 * mid-preview and nothing can be grabbed. So a cancelled press is ended for
 * it, back where it started: like putting the piece back, nothing changes.
 */
function useEndCancelledDrags(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let down: PointerEvent | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.isTrusted && ref.current?.contains(e.target as Node)) down = e;
    };
    const putBack = () => {
      if (!down) return;
      const init = { pointerId: down.pointerId, pointerType: down.pointerType, isPrimary: true, clientX: down.clientX, clientY: down.clientY, bubbles: true };
      down = null;
      document.dispatchEvent(new PointerEvent("pointermove", { ...init, buttons: 1 }));
      document.dispatchEvent(new PointerEvent("pointerup", { ...init, button: 0, buttons: 0 }));
    };
    const onUp = (e: PointerEvent) => {
      if (e.isTrusted && e.pointerId === down?.pointerId) down = null;
    };
    const onCancel = (e: PointerEvent) => {
      if (e.pointerId === down?.pointerId) putBack();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("pointercancel", onCancel, true);
    window.addEventListener("blur", putBack);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("pointercancel", onCancel, true);
      window.removeEventListener("blur", putBack);
    };
  }, [ref]);
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
