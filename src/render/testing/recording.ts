import type { MathState } from "../../expr/types";
import type { RuleId } from "../../rules";

/** A drag recorded in the app's debug mode, replayable in tests (harness `replay`). */
export type Recording = {
  version: 1;
  /** What this recording shows (fill in when saving it as a test). */
  note?: string;
  state: MathState;
  rules: RuleId[];
  W: number;
  H: number;
  draggedId: string;
  /** Where on the piece it was grabbed, in its own coordinates. */
  anchor: [number, number];
  /** Every pointer position, in canvas coordinates. */
  pointers: [number, number][];
  /** What letting go gave, printed. */
  dropped: string;
  /** To turn a recording into a regression test: what letting go *should* give. */
  expect?: { drops: string };
};
