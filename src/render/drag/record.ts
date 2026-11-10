import { modifier, Modifier, type DragFrame, type DragInitContext, type DragSpecData } from "dragology";
import type { MathState } from "../../expr/types";
import { printState } from "../../expr/key";
import type { RuleId } from "../../rules";
import type { Recording } from "../testing/recording";

/**
 * Records a drag as it happens: the state it started from, the piece and
 * where on it it was grabbed, and every pointer position (canvas
 * coordinates) — enough to replay it exactly in a test (testing/harness `replay`).
 */
class Record extends Modifier<MathState> {
  readonly name = "record";
  readonly recording: Recording;

  constructor(
    ctx: DragInitContext<MathState>,
    inner: DragSpecData<MathState>,
    rules: readonly RuleId[],
    W: number,
    H: number,
    private readonly onChange: (r: Recording) => void,
  ) {
    super(ctx, inner);
    this.recording = {
      version: 1,
      state: ctx.startState,
      rules: [...rules],
      W,
      H,
      draggedId: ctx.draggedId!,
      anchor: [round(ctx.anchorPos.x), round(ctx.anchorPos.y)],
      pointers: [],
      dropped: printState(ctx.startState),
    };
    onChange(this.recording);
  }

  frame(frame: DragFrame) {
    const r = this.inner.run(frame);
    this.recording.pointers.push([round(frame.pointer.x), round(frame.pointer.y)]);
    this.recording.dropped = printState(r.dropState);
    this.onChange(this.recording);
    return r;
  }
}

const round = (v: number) => Math.round(v * 100) / 100;

/** Wrap a drag spec so the drag is recorded (debug mode). */
export const recorded = modifier(Record);
