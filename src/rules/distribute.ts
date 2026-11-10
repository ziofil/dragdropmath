import type { Expr } from "../expr/types";
import { cloneFresh, negate, num, prod, sum } from "../expr/build";
import { key } from "../expr/key";
import { adopt, dragCtx, replaceIn, signOwner, without, type Candidate, type Rule } from "./types";
import { nodeAt, parentLoc } from "../expr/tree";
import { visibleOne } from "./shapes";

/** a(b + c) → ab + ac (drop a factor onto the parentheses next to it). */
export const distribute: Rule = {
  id: "distribute",
  name: "Distribute",
  gesture: "Drop a factor onto the brackets it multiplies — it visits every term inside.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (c?.parent?.kind !== "prod") return [];
    const f = c.node;
    const factors = c.parent.factors;
    return factors.flatMap((s, j): Candidate[] => {
      if (j === c.index || s.kind !== "sum") return [];
      // The dragged factor itself goes into the first term; the others get clones.
      // Each term gets its own copy of the factor (flying out of the carried one).
      // A ·1 stays visible as 2·1 (and 2(x − 1) → 2x − 2·1), for the learner to simplify.
      const spread = sum(
        s.terms.map((t, k) => prod([k === 0 ? f : cloneFresh(f), visibleOne(t)])),
        s.id,
      );
      const newFactors = factors.slice();
      newFactors[j] = spread;
      return [
        {
          rule: "distribute",
          state: replaceIn(state, c.parentLoc!, { ...c.parent!, factors: without(newFactors, c.index) } as Expr),
          targetId: s.id,
        },
      ];
    });
  },
};

/** −(a − b) → −a + b (drop the minus sign onto its brackets). */
export const distributeNeg: Rule = {
  id: "distribute-neg",
  name: "Distribute a minus",
  gesture: "Drop a minus sign onto its brackets — every sign inside flips.",
  apply(state, id) {
    // Carried by the minus sign alone, onto its own brackets.
    const owner = signOwner(id);
    const c = owner ? dragCtx(state, owner) : null;
    if (c?.node.kind !== "neg" || c.node.arg.kind !== "sum") return [];
    const s = c.node.arg;
    return [
      {
        rule: "distribute-neg",
        // The carried minus becomes the sign of the first term (−(x − 4) → −x + 4),
        // so it lands somewhere instead of vanishing while its contents stay.
        state: replaceIn(state, c.loc, sum(s.terms.map((t, i) => (i === 0 ? adopt(negate(t), c.node.id) : negate(t))), s.id)),
        targetId: s.id,
      },
    ];
  },
};

/**
 * ab + ac → a(b + c) (drag a factor out of one term; it must appear in every term).
 * Also covers a whole term: ab + a → a(b + 1).
 */
export const factorOut: Rule = {
  id: "factor-out",
  feel: { carry: "out-in-front" },
  name: "Factor out",
  gesture: "Pull a factor that's in every term out in front of brackets.",
  apply(state, id) {
    const c = dragCtx(state, id);
    if (!c) return [];
    const f = c.node;
    const fKey = key(f);

    // Climb from the dragged node to the sum it's a factor of: node → [prod] → [neg] → sum.
    let termLoc = c.loc;
    let up = parentLoc(termLoc);
    if (up && nodeAt(state, up).kind === "prod") [termLoc, up] = [up, parentLoc(up)];
    if (up && nodeAt(state, up).kind === "neg") [termLoc, up] = [up, parentLoc(up)];
    if (!up) return [];
    const s = nodeAt(state, up);
    if (s.kind !== "sum") return [];
    const myTermIdx = termLoc.path[termLoc.path.length - 1];

    // Remove one copy of f from a term (the dragged copy, in the dragged term).
    const strip = (t: Expr, mine: boolean): Expr | null => {
      if (t.kind === "neg") {
        const inner = strip(t.arg, mine);
        return inner && negate(inner);
      }
      if (mine ? t.id === f.id : key(t) === fKey) return num(1);
      if (t.kind === "prod") {
        const i = t.factors.findIndex((x) => (mine ? x.id === f.id : key(x) === fKey));
        return i < 0 ? null : prod(without(t.factors, i), t.id);
      }
      return null;
    };

    const stripped = s.terms.map((t, i) => strip(t, i === myTermIdx));
    if (stripped.some((t) => t === null)) return [];
    return [{ rule: "factor-out", state: replaceIn(state, up, prod([f, sum(stripped as Expr[], s.id)])) }];
  },
};
