import type { DragSpecBuilder } from "dragology";
import type { MathState } from "../../expr/types";
import type { RuleId } from "../../rules";
import type { RenderCtx } from "../typeset";

/** What every drag spec needs: the laid-out canvas, Dragology's spec builder, and the rules in play. */
export type DragEnv = { rc: RenderCtx; d: DragSpecBuilder<MathState>; rules: readonly RuleId[] };
