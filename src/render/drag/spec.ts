import type { DragSpec, DragSpecBuilder } from "dragology";
import type { MathState } from "../../expr/types";
import { children, locate } from "../../expr/tree";
import { feelOf, movesFor, operatorTap, type Candidate, type RuleId } from "../../rules";
import { dragCtx } from "../../rules/types";
import type { RenderCtx } from "../typeset";
import { below, farEnd, landing, outInFront, overOtherSide, pullOut, rowSlot, SLIDE } from "./carry";
import type { DragEnv } from "./env";
import { growLog, shedLog } from "./logs";
import { flipSign } from "./sign";
import { mergeApproach } from "./merge";
import { turnRelation } from "./relation";
import { relOf } from "../../expr/build";

/**
 * A canvas whose pieces respond to the pointer under these rules: what can
 * be grabbed, tapped, and what dragging does.
 */
export function interactive(opts: {
  state: MathState;
  d: DragSpecBuilder<MathState>;
  rules: readonly RuleId[];
  draggedId?: string | null;
  onTap?: (next: MathState) => void;
  /** Wraps every drag spec (debug mode uses it to record drags). */
  wrap?: (spec: DragSpec<MathState>) => DragSpec<MathState>;
}): RenderCtx {
  const { state, d, rules, draggedId, onTap, wrap } = opts;
  const moves = movesFor(state, rules);
  const rc: RenderCtx = {
    state,
    draggedId,
    interact: {
      grabbable: moves.grabbable,
      opTap: (termId) => operatorTap(state, termId, rules),
      tap: (id) => moves.tap(id)?.state ?? null,
      onTap,
      drag: (id) => {
        const spec = dragSpec({ rc, d, rules }, id);
        return wrap ? wrap(spec) : spec;
      },
    },
  };
  return rc;
}

/**
 * What dragging a piece does, by where the carried piece is:
 *
 *   heading for a mergeable piece          → the merge forms gradually (see merge.tsx)
 *   between two pieces of its row          → reorder into that gap
 *   near where it started                  → nothing
 *   elsewhere (across =, out in front...)  → the nearest other move's landing spot
 *
 * How each move is reached comes from its rule's `feel`.
 */
export function dragSpec(env: DragEnv, id: string): DragSpec<MathState> {
  const { rc, d, rules } = env;
  const candidates = movesFor(rc.state, rules).drag(id);
  const c0 = dragCtx(rc.state, id);
  // Only sums and products are rows you can reorder along; elsewhere (fraction
  // parts, exponents, ...) the only "within" option is staying put.
  const inRow = c0?.parent?.kind === "sum" || c0?.parent?.kind === "prod";
  const siblings = inRow ? children(c0!.parent!) : [];

  const carry = (c: Candidate) => feelOf(c).carry ?? "landing";
  const reorders = new Map<number, MathState>();
  for (const c of candidates) {
    if (c.targetId || carry(c) !== "reorder") continue;
    const loc = locate(c.state, id)!;
    reorders.set(loc.path[loc.path.length - 1], c.state);
  }
  // Reordering within the row (or staying put) is one option; moves that leave
  // the row (across =, out in front of brackets...) compete by landing spot.
  const away = candidates.filter((c) => !c.targetId && carry(c) !== "reorder");
  let moves = d.closest([
    rowSlot(env, id, siblings.map((s) => s.id), c0?.index ?? 0, reorders),
    ...away.map((c) => {
      const how = carry(c);
      return how === "out-in-front"
        ? outInFront(env, id, c.state)
        : how === "pull-out"
          ? pullOut(env, id, c.state)
          : how === "below"
            ? below(env, id, c.state)
            : how === "far-end"
              ? farEnd(env, id, c.state)
            : landing(env, id, c.state);
    }),
    // Across =: anywhere over the other side will do, too.
    ...away.filter((c) => carry(c) === "landing").flatMap((c) => overOtherSide(env, id, c.state)),
  ]);

  // What the carried piece wears on the way.
  const grows = away.find((c) => feelOf(c).wears === "grow-log");
  const sheds = candidates.filter((c) => c.targetId && feelOf(c).wears === "shed-log");
  const flips = away.find((c) => feelOf(c).wears === "flip-sign");
  if (grows) moves = moves.with(growLog(rc, grows.state));
  else if (sheds.length) moves = moves.with(shedLog(rc, sheds));
  else if (flips) moves = moves.with(flipSign(rc, flips.state, candidates.filter((c) => c.targetId).map((c) => c.state)));

  // Switching between moves (staying in the row, across the =, out in front …) slides too.
  moves = moves.withBranchTransition(SLIDE);

  const merges = candidates.filter((c) => c.targetId);
  // A side swap reorders the equation like a reorder does a row: it mustn't jump past a forming merge either.
  const swaps = away.filter((c) => c.rule === "swap-sides").map((c) => c.state);
  const spec = merges.length === 0 ? moves.withFloating() : mergeApproach(moves.withFloating(), env, merges, [...reorders.values(), ...swaps]);
  // A move that turns an inequality round (the − of −x < 6 carried across): the sign turns as it's crossed.
  const turns = candidates.some((c) => relOf(c.state) !== relOf(rc.state));
  return turns ? spec.with(turnRelation(rc)) : spec;
}
