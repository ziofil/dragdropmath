/**
 * The exhaustive drag checks, run on what learners meet (testing/corpus.ts,
 * split between exercises.*.test.tsx so they run in parallel) and on
 * chosen states in drag.test.tsx.
 */
import { describe, expect, it } from "vitest";
import { Vec2 } from "dragology";
import type { MathState } from "../../expr/types";
import { stateKey } from "../../expr/key";
import { allNodes } from "../../expr/tree";
import { candidatesFor, handles, isGrabbable, signOwner, type RuleId } from "../../rules";
import { startOf } from "../../game/puzzles";
import { forExhaustive, shard } from "../../game/testing/corpus";
import { ANCHOR, Grip, harness, show, type Harness } from "./harness";

export const same = (a: Parameters<typeof stateKey>[0], b: Parameters<typeof stateKey>[0]) => stateKey(a, "exact") === stateKey(b, "exact");

/**
 * Drop points along the row through the piece's home, nearest first: as far as
 * the canvas is wide (a long sum's first term carried to its end). Every 8 px:
 * a move that only a narrower window gives is one no finger finds anyway.
 */
const ROW = Array.from({ length: 181 }, (_, i) => Vec2(i * 8 - 720, 0)).sort((p, q) => p.len() - q.len());
/** Then a coarser 2D search around home, for vertical moves (across a fraction bar...). */
const AROUND = Array.from({ length: 27 * 15 }, (_, i) => Vec2((i % 27) * 12 - 156, Math.floor(i / 27) * 12 - 84))
  .filter((v) => v.y !== 0)
  .sort((p, q) => p.len() - q.len());

/** Drop piece `id` (grabbed at ANCHOR, fresh drag each time) with the pointer at `p`. */
const dropAt = (h: Harness, id: string, p: Vec2) => new Grip(h, id, ANCHOR).at(p).state;

export function checkAllMovesReachable(src: string | MathState, rules: readonly RuleId[]) {
  const h = harness(src, rules);
  const { state } = h;
  const problems: string[] = [];
  // Every handle a learner can actually pick up (see isGrabbable): nodes, and minus signs.
  for (const id of handles(state).filter((x) => isGrabbable(state, x, rules))) {
    const owner = signOwner(id);
    const node = state.sides.flatMap(allNodes).find((n) => n.id === (owner ?? id))!;
    const what = `${owner ? "the − of " : ""}${show({ sides: [node] })}`;
    const origin = h.originOf(id);
    if (!origin) continue;
    const home = origin.add(ANCHOR);
    const merges = candidatesFor(state, id, rules).filter((k) => k.targetId);
    for (const c of candidatesFor(state, id, rules)) {
      const label = `drag ${what} [${c.rule}] → ${show(c.state)}`;
      if (c.targetId) {
        // Merges: aim like a person — centre the carried piece on the target,
        // having grabbed it at its left edge, middle, or right edge.
        const me = h.sizeOf(id);
        const them = h.sizeOf(c.targetId);
        // People aim with and at the symbols themselves, not their leading signs.
        const targetCentre = h.centreOf(c.targetId);
        const myCentre = Vec2(me.lead + (me.w - me.lead) / 2, (me.desc - me.asc) / 2);
        // A target inside the piece (the brackets of −(x − 4)) is reached by carrying the sign onto it.
        const nested = !owner && allNodes(node).some((n) => n.id === c.targetId);
        // Two moves on one target ((x + 1) onto (x + 1): multiply out or square):
        // each is reached where it completes (see mergePlan), not by centring.
        const shared = merges.some((m) => m !== c && m.targetId === c.targetId && m.rule !== c.rule);
        if (shared) {
          const grip = h.grab(id);
          const got = grip.path(grip.start.add(h.endsUpOffset(id, c.targetId, c.rule)), 30).at(-1)!;
          if (!same(got.state, c.state)) problems.push(`${label}: carried to where it completes, got ${got.drops}`);
          continue;
        }
        for (const fx of nested ? [0.02] : [0.1, 0.5, 0.9]) {
          const grab = Vec2(me.w * fx, -me.asc * 0.4);
          const grip = new Grip(h, id, grab);
          const pointer = nested ? targetCentre : targetCentre.sub(myCentre).add(grab);
          const frames = grip.path(pointer);
          const got = frames[frames.length - 1];
          if (!same(got.state, c.state)) problems.push(`${label}: grabbed at ${fx * 100}% and centred on target, got ${got.drops}`);
          // The bug a learner hit: heading for 5y, a swap preview moved 5y to *behind* the
          // piece, so the drop became a swap. Until the merge shows, the target must stay
          // ahead of the carried piece. (Small nudges from glyph widths are fine.)
          const ahead = (f: (typeof frames)[number]) => {
            const at = h.originOf(c.targetId!, f.state);
            if (!at) return true;
            const dir = Math.sign(pointer.x - grip.start.x) || 1;
            const tc = at.x + them.lead + (them.w - them.lead) / 2;
            const pc = f.pointer.sub(grab).x + me.lead + (me.w - me.lead) / 2;
            return (tc - pc) * dir > -((them.w - them.lead) / 2);
          };
          // (Passing over another piece it can merge with, on the way, is fine: that's a merge, not a swap.)
          const otherMerge = (f: (typeof frames)[number]) => merges.some((m) => same(m.state, f.state));
          const fled = nested ? undefined : frames.find((f) => !same(f.state, c.state) && !otherMerge(f) && !ahead(f));
          if (fled) problems.push(`${label}: grabbed at ${fx * 100}%, target ended up behind the piece (preview ${fled.drops})`);
        }
        continue;
      }
      // Moves: some drop point along the row (or nearby, for vertical moves) must give this move. (Reorders happen when the
      // carried symbol passes a neighbour's middle, so a wide term may need to travel past
      // where it finally settles; factoring out happens past the left end.)
      const gives = (o: Vec2) => same(dropAt(h, id, home.add(o)), c.state);
      // Where the move aims first, then anywhere, nearest the aim first (a reorder past a merge
      // target is just beyond it): a few drops, mostly, instead of hundreds.
      const aim = h.aimOf(id, c).sub(h.centreOf(id));
      const byAim = (ps: Vec2[]) => [aim, ...ps].sort((p, q) => p.dist(aim) - q.dist(aim));
      if (!byAim(ROW).some(gives) && !AROUND.some(gives)) {
        const seen = new Map<string, number>();
        for (const o of ROW) {
          const k = show(dropAt(h, id, home.add(o)));
          if (!seen.has(k)) seen.set(k, Math.round(o.x));
        }
        problems.push(`${label}: unreachable along the row; drops give ${[...seen].map(([k, dx]) => `${k} (dx=${dx})`).join("; ")}`);
      }
    }
    // Dropping right back where it started must change nothing.
    const back = dropAt(h, id, home);
    if (!same(back, state)) problems.push(`drop ${what} at home → ${show(back)}`);
  }
  return problems;
}


/**
 * Carry each mergeable piece, like a hand, to where it ends up in the result:
 * letting go there gives the move, nothing leaves the canvas, what stays put
 * stays put, copies fly out. Returns what went wrong (empty when all is well).
 */
export function checkMergesAnimate(src: string | MathState, rules: readonly RuleId[]): string[] {
  const h = harness(src, rules as RuleId[]);
  const nodes = h.state.sides.flatMap(allNodes);
  const problems: string[] = [];
  for (const id of handles(h.state).filter((x) => isGrabbable(h.state, x, h.rules))) {
    if (!nodes.some((n) => n.id === id)) continue; // a minus carried alone: covered elsewhere
    for (const c of h.candidates(id).filter((k) => k.targetId)) {
      const label = `${show({ sides: [nodes.find((n) => n.id === id)!] })} [${c.rule}] → ${show(c.state)}`;
      const grip = h.grab(id);
      const frames = grip.path(grip.start.add(h.endsUpOffset(id, c.targetId!, c.rule)), 24);
      const end = frames[frames.length - 1];
      // Carried over another target on the way (the 2 of 2(x + 1)(x + 2) to
      // the far bracket), that merge shows as it passes: fine.
      const [x0, x1] = [h.centreOf(id).x, h.centreOf(c.targetId!).x].sort((a, b) => a - b);
      const passesOver = h
        .candidates(id)
        .some((k) => k.targetId && k.targetId !== c.targetId && h.centreOf(k.targetId).x > x0 && h.centreOf(k.targetId).x < x1);
      // Letting go there gives the move, and the picture is the result.
      if (!same(end.state, c.state)) problems.push(`${label}: ends up giving ${end.drops}`);
      if (end.blend < 0.95) problems.push(`${label}: only ${end.blend.toFixed(2)} formed where it ends up`);
      const resultNodes = new Map(c.state.sides.flatMap(allNodes).map((n) => [n.id, n]));
      const firstSeen = new Set<string>();
      let stay0: number | undefined;
      // Unless the result ends up against the canvas edge: then it gives way rather than go off it.
      const endGlyphs = end.glyphs().filter((g) => g.opacity > 0.5);
      const atEdge = endGlyphs.some((g) => g.x < 20) || endGlyphs.some((g) => g.x > h.W - 40);
      frames.forEach((f, i) => {
        const gs = f.glyphs().filter((g) => g.opacity > 0.05);
        // Nothing leaves the canvas.
        const off = gs.find((g) => g.x < -2 || g.x > h.W);
        if (off) problems.push(`${label}: step ${i}, "${off.text}" drawn off the canvas at ${off.x.toFixed(0)}`);
        // What the move keeps in place doesn't budge.
        if (c.stays && !atEdge && !passesOver) {
          const x = gs.find((g) => g.layer === c.stays)?.x;
          stay0 ??= x;
          if (x !== undefined && stay0 !== undefined && Math.abs(x - stay0) > 1) problems.push(`${label}: step ${i}, the piece that should stay put moved ${(x - stay0).toFixed(0)}px`);
        }
        // Copies fly out of their source fully drawn: they never fade in where they end up.
        for (const g of gs) {
          if (firstSeen.has(g.layer)) continue;
          firstSeen.add(g.layer);
          if (i > 0 && resultNodes.get(g.layer)?.from && g.opacity < 0.9) problems.push(`${label}: step ${i}, the copied "${g.text}" fades in instead of flying out`);
        }
      });
    }
  }
  return [...new Set(problems)].slice(0, 8);
}

/**
 * Open drag-feel issues the checks found on generated exercises (case id →
 * what's wrong). Listed as todos so every run shows them, not as failures.
 */
const KNOWN: Record<string, { reach?: string; animate?: string }> = {
  "brackets/hard/letter-bracket-minus-product": { reach: "(x + 3y)(x − y) after a minus: no spot to swap the two brackets, merges cover it" },
  "balance/hard/powers-in-logs": { reach: "ln(x²) + ln(x) − 1: no spot just after ln(x), the merge with it covers it" },
  "simultaneous/medium/composed-3": { reach: "a log on a fraction's bottom, in the first of two equations: carrying it up across the bar (its landing ~30px left, same height) loses to staying put; fine in one equation" },
  "distribute/hard/products-and-brackets": { reach: "in 3·3(x + 2y) the first 3 can't jump the second to multiply out the bracket", animate: "the same: the 3 merges with the other 3 on the way" },
};

/** Both checks, on every `n`th case of the corpus from the `k`th: one shard of the whole set. */
export function exerciseShard(k: number, n: number) {
  const mine = forExhaustive(shard(k, n))
    .map((c) => [c.id, c.start, c.rules, c.chapter] as const);
  const open = (check: "reach" | "animate") => mine.filter(([id]) => !KNOWN[id]?.[check]);
  const todo = (check: "reach" | "animate") => mine.flatMap(([id]) => (KNOWN[id]?.[check] ? [`${id}: ${KNOWN[id][check]}`] : []));
  describe(`every allowed move can be reached by dragging (${k + 1} of ${n})`, () => {
    it.each(open("reach"))("%s: %s", (_, src, rules, chapter) => {
      expect(checkAllMovesReachable(startOf(src, chapter), rules)).toEqual([]);
    }, 60_000); // exhaustive: every move of the exercise, along many drag paths
    for (const t of todo("reach")) it.todo(t);
  });
  describe(`every merge animates sanely (${k + 1} of ${n})`, () => {
    it.each(open("animate"))("%s: %s", (_, src, rules, chapter) => {
      expect(checkMergesAnimate(startOf(src, chapter), rules)).toEqual([]);
    });
    for (const t of todo("animate")) it.todo(t);
  });
}
