/**
 * One finger per drag. The drag engine follows every pointermove/pointerup on
 * the page and never hears pointercancel, so on a touchscreen:
 *
 * - a second finger (a resting thumb, a palm) made the carried piece jump to
 *   it, and lifting that finger dropped the piece there — a move nobody made;
 * - a touch iOS cancels (a second finger turning it into a pinch, a
 *   notification, a system swipe) left the drag stuck: the piece followed the
 *   next finger, and the next release completed the move.
 *
 * So while a press on a draggable canvas is down, other pointers are kept
 * away from the page, and a cancelled press is ended where it started: the
 * piece goes back, nothing changes, and it isn't a tap (taps are only ever
 * trusted events, see MathCanvas).
 */

/** Where drags start: the board, and the hero's draggable word. */
const SURFACES = ".canvas, .feel-word";

let active: { id: number; x: number; y: number; kind: string } | null = null;

/** End the press `active` where it began (the engine ends a drag on pointerup, at the event's position). */
function endAtStart() {
  if (!active) return;
  const { id, x, y, kind } = active;
  active = null;
  const end = { pointerId: id, pointerType: kind, clientX: x, clientY: y, bubbles: true, cancelable: true, isPrimary: true };
  document.dispatchEvent(new PointerEvent("pointermove", { ...end, buttons: 1 }));
  document.dispatchEvent(new PointerEvent("pointerup", end));
}

function install() {
  const other = (e: PointerEvent) => active !== null && e.pointerId !== active.id;

  window.addEventListener(
    "pointerdown",
    (e) => {
      // A new first finger: the press we were following ended without our hearing of it.
      if (other(e) && e.isPrimary) endAtStart();
      if (other(e)) {
        // A second finger: not a new grab, not a tap, not part of this drag.
        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      }
      if (e.target instanceof Element && e.target.closest(SURFACES)) {
        active = { id: e.pointerId, x: e.clientX, y: e.clientY, kind: e.pointerType };
      }
    },
    { capture: true },
  );

  window.addEventListener("pointermove", (e) => other(e) && e.stopImmediatePropagation(), { capture: true });

  window.addEventListener(
    "pointerup",
    (e) => {
      if (other(e)) return e.stopImmediatePropagation();
      if (active && e.pointerId === active.id) active = null;
    },
    { capture: true },
  );

  window.addEventListener(
    "pointercancel",
    (e) => {
      if (active && e.pointerId === active.id) endAtStart();
    },
    { capture: true },
  );
}

if (typeof window !== "undefined") install();
