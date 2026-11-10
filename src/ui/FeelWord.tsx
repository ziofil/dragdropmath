import { useLayoutEffect, useRef, useState } from "react";
import { DraggableRenderer, translate, type Draggable } from "dragology";
import { textWidth } from "../render/measure";

/**
 * The word "feel" in the title, with letters you can pick up and rearrange.
 * Just for fun: the order lives only in this component, so it resets on refresh.
 */
type State = { order: string[] };

const LETTERS: Record<string, string> = { f: "f", e1: "e", e2: "e", l: "l" };

function moveItem<T>(xs: T[], from: number, to: number): T[] {
  const out = xs.filter((_, i) => i !== from);
  out.splice(to, 0, xs[from]);
  return out;
}

export function FeelWord() {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(48);

  // Match the heading's font size (it scales with the viewport).
  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const update = () => setSize(parseFloat(getComputedStyle(el).fontSize) || 48);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const widths = Object.fromEntries(Object.entries(LETTERS).map(([id, ch]) => [id, textWidth(ch, size, true) + 0.04 * size]));
  const total = Object.values(widths).reduce((a, b) => a + b, 0);
  const height = size * 1.3;
  const baseline = size * 1.0;
  const pad = 0.1 * size;

  const draggable: Draggable<State> = ({ state, d, draggedId }) => {
    let x = pad;
    return (
      <g>
        {state.order.map((id, i) => {
          const at = x;
          x += widths[id];
          return (
            <g
              id={`feel-${id}`}
              transform={translate(at, baseline)}
              dragologyZIndex={draggedId === `feel-${id}` ? "/1" : false}
              dragologyOnDrag={() =>
                d.closest(state.order.map((_, j) => ({ order: moveItem(state.order, i, j) }))).withFloating()
              }
            >
              <rect transform={translate(0, -size * 0.85)} width={widths[id]} height={size * 1.1} className="feel-hit" />
              <text fontSize={size} className="feel-letter">
                {LETTERS[id]}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <span ref={ref} className="feel-word" aria-label="feel">
      <DraggableRenderer
        draggable={draggable}
        initialState={{ order: ["f", "e1", "e2", "l"] }}
        width={total + 2 * pad}
        height={height}
      />
    </span>
  );
}
