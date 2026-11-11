import { Component, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { stateKey } from "../expr/key";
import { DraggableRenderer, type Draggable } from "dragology";
import type { MathState } from "../expr/types";
import type { RuleId } from "../rules";
import { renderState } from "../render/typeset";
import { interactive, recorded } from "../render/drag";
import { DebugPanel, noteRecording, useDebug } from "./debug";

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
            // Debug mode records every drag, to replay as a test.
            wrap: debug ? (spec) => spec.with(recorded(rules, width.value, height, noteRecording)) : undefined,
          }),
          width.value,
          height,
        ),
    [rules, width.value, height, debug],
  );
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
        <strong>Oops — that move broke the board.</strong>
        <span>Details are in the browser console.</span>
        <button onClick={() => this.setState({ error: null })}>Try again</button>
      </div>
    );
  }
}

/** A non-interactive rendering, e.g. for showing the goal. */
export function StaticMath({ state, width = 720, height = 110 }: { state: MathState; width?: number; height?: number }) {
  // Fitted to what's drawn, so a short expression isn't shrunk to fit an empty strip.
  const ref = useRef<SVGSVGElement>(null);
  const [view, setView] = useState(`0 0 ${width} ${height}`);
  useLayoutEffect(() => {
    const g = ref.current?.getBBox();
    if (g && g.width > 0) setView(`${g.x - 8} 0 ${g.width + 16} ${height}`);
  }, [state, width, height]);
  return (
    <svg ref={ref} className="static-math" viewBox={view} role="img" aria-label="goal">
      {renderState({ state }, width, height)}
    </svg>
  );
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
