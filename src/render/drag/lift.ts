import { modifier, Modifier, Vec2, type DragFrame, type DragInitContext, type DragSpecData } from "dragology";

/**
 * On a touchscreen the finger covers what it drags. So a touch drag carries
 * the piece a little above the fingertip: the wrapped spec sees the pointer
 * shifted up. The shift grows in over the first few pixels of movement, so
 * the piece doesn't jump when grabbed, and fades out again near the start,
 * so dropping it back where it came from still works.
 */

/** How far above the finger the piece rides, in canvas px. */
export const LIFT = 64;
/** Movement over which the lift grows in. */
const RAMP = 48;

// The drag engine only reports positions, so remember what kind of pointer
// went down last. Capture phase: this runs before the canvas starts a drag.
let lastPointer = "mouse";
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", (e) => (lastPointer = e.pointerType), { capture: true });
}

class ThumbLift<T extends object> extends Modifier<T> {
  readonly name = "thumbLift";
  private readonly on: boolean;
  private start: Vec2 | undefined;
  lift = 0;

  constructor(ctx: DragInitContext<T>, inner: DragSpecData<T>, force?: boolean) {
    super(ctx, inner);
    this.on = force ?? lastPointer === "touch";
  }

  frame(frame: DragFrame) {
    if (!this.on) return this.inner.run(frame);
    this.start ??= frame.pointer;
    const t = Math.min(1, frame.pointer.dist(this.start) / RAMP);
    this.lift = LIFT * t * t * (3 - 2 * t);
    return this.inner.run({ pointer: frame.pointer.add(Vec2(0, -this.lift)) });
  }

  treeView(props: Parameters<Modifier<T>["treeView"]>[0]) {
    return this.wrapperView(props, this.on ? `lifted ${Math.round(this.lift)}px` : "off (mouse)");
  }
}

/** `spec.with(thumbLift())`: lift touch drags above the finger. `force` overrides the touch check (tests). */
export const thumbLift = modifier(ThumbLift);
