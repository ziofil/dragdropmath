/**
 * Drags through the real Dragology engine, headlessly (see testing/harness):
 * every move must be reachable by a hand, merges must form gradually and land
 * under the hand, and what letting go gives must match what's shown.
 */
import { describe, expect, it } from "vitest";
import { Vec2 } from "dragology";
import type { Expr, Log, MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import { allNodes } from "../expr/tree";
import { ALL_RULES, candidatesFor, handles, isGrabbable, signId, signOwner, type RuleId } from "../rules";
import { allPuzzles } from "../game/puzzles";
import { solution } from "../game/solver";
import { MERGE_AT } from "./drag";
import { ANCHOR, Grip, harness, show, type Harness } from "./testing/harness";

const same = (a: Parameters<typeof stateKey>[0], b: Parameters<typeof stateKey>[0]) => stateKey(a, "exact") === stateKey(b, "exact");

/** Drop points along the row through the piece's home, nearest first. */
const ROW = Array.from({ length: 201 }, (_, i) => Vec2(i * 4 - 400, 0)).sort((p, q) => p.len() - q.len());
/** Then a coarser 2D search around home, for vertical moves (across a fraction bar...). */
const AROUND = Array.from({ length: 41 * 21 }, (_, i) => Vec2((i % 41) * 8 - 160, Math.floor(i / 41) * 8 - 80))
  .filter((v) => v.y !== 0)
  .sort((p, q) => p.len() - q.len());

/** Drop piece `id` (grabbed at ANCHOR, fresh drag each time) with the pointer at `p`. */
const dropAt = (h: Harness, id: string, p: Vec2) => new Grip(h, id, ANCHOR).at(p).state;

function checkAllMovesReachable(src: string | MathState, rules: readonly RuleId[]) {
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
      if (!ROW.some(gives) && !AROUND.some(gives)) {
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

describe("moves inside small superscripts can be reached too", () => {
  // Mid-puzzle states the puzzle starts don't cover: combining exponents in place.
  it.each(["x^(3 + 2)", "x^(5 - 2)", "x^(2·3)", "x^(1 + 2) + 3x", "2^(1/2 + 1/2)", "(2·2)^(1/2)", "3^((1 + 1)/2)", "x = 3^2", "x^(1/2) = 3", "(3·3)^(1/2)", "3ln(x) - ln(x)", "x - (y + 1) = 3", "-x = 0", "(x - 2)/2", "x·x + x·2 - 2x", "2·(3/4)", "x = -(2 - 7)", "3 > x", "7 = x", "3 ≤ x + 1", "√2·√2", "√x·√x·3", "-x/2 > 1", "-2x ≤ 6", "√(x^4)", "(x + 1)(2x + 3)", "(2x - 3)(2x + 3)", "(3 + 2x)(3 - 2x)", "a(a - 3) + 4a - 12"])("%s", (src) => {
    expect(checkAllMovesReachable(src, ALL_RULES)).toEqual([]);
  });
});

// Slow (minutes): run with `npm run test:all`.
const SLOW = !!(globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.SLOW;
describe.runIf(SLOW)("on the way to solving, every move can still be reached by dragging", () => {
  // The starts are checked below; these are the states a learner passes
  // through (as the moves and tidying make them, marks and all).
  it.each(allPuzzles().map((r) => [r.puzzle.id, r] as const))("%s", (_, ref) => {
    const path = solution(parseState(ref.puzzle.start), parseState(ref.puzzle.goal), ref.rules, { maxDepth: 10, maxStates: 120_000 })!;
    const problems = path.slice(1, -1).flatMap((s) => checkAllMovesReachable(s, ref.rules).map((p) => `at ${show(s)}: ${p}`));
    expect(problems).toEqual([]);
  }, 60_000);
});

describe("every allowed move can be reached by dragging", () => {
  it.each(allPuzzles().map((r) => [r.puzzle.id, r.puzzle.start, r.rules] as const))("%s: %s", (_, src, rules) => {
    expect(checkAllMovesReachable(src, rules)).toEqual([]);
  }, 20_000); // exhaustive: every move of the exercise, along many drag paths
});

describe("pulling a factor out of a log", () => {
  it.each([
    ["ln(2x)", "2", -1, "ln(2) + ln(x)"],
    ["ln(2x)", "x", 1, "ln(2) + ln(x)"],
    ["log_2(8x)", "8", -1, "log_2(8) + log_2(x)"],
  ] as const)("%s: carrying the %s out, a faint log goes with it and firms up", (src, what, dir, split) => {
    const h = harness(src);
    const grip = h.grab(what, ANCHOR);
    const piece = grip.id;
    const frames = Array.from({ length: 31 }, (_, i) => grip.by(Vec2((dir * 160 * i) / 30, 0)));
    const shell = frames.map((f) => f.keyOpacity("carry-shell", piece));
    // There from the moment it's picked up, faint...
    expect(shell[0]).toBeCloseTo(0.2);
    // ...never fading as it comes out...
    for (let i = 1; i < shell.length; i++) expect(shell[i]).toBeGreaterThanOrEqual(shell[i - 1]);
    // ...and fully there once the split is what dropping would do.
    const last = frames[frames.length - 1];
    expect(last.drops).toBe(split);
    expect(shell[shell.length - 1]).toBe(1);
    // Meanwhile no second log shows up at the destination: the carried one is it.
    // (Only the log left behind, around the rest, has a visible label.)
    const labels = [...last.preview.byId.keys()].filter(
      (id) => id !== piece && (last.keyOpacity("ln", id) > 0 || last.keyOpacity("log", id) > 0),
    );
    expect(labels).toHaveLength(1);
  });

  it("other drags carry nothing extra", () => {
    const h = harness("2x + 3");
    const grip = h.grab("2", ANCHOR);
    expect(grip.at(Vec2(300, 100)).keyOpacity("carry-shell", grip.id)).toBe(0);
  });
});

describe("combining two logs", () => {
  it.each([
    ["ln(2) + ln(x)", "ln(x)", "ln(2*x)"],
    ["ln(12) - ln(3)", "-ln(3)", "ln(12/3)"],
    ["ln(12) - ln(3)", "ln(12)", "ln(12/3)"],
  ] as const)("%s: carrying %s, its ln( ) fades on the way to the other log", (src, what, merged) => {
    const h = harness(src);
    const T = h.find(what);
    const L = (T.kind === "neg" ? T.arg : T) as Log;
    const target = h.candidates(T.id).find((c) => c.rule === "combine-logs")!.targetId!;
    const grip = h.grab(T.id);
    const frames = grip.path(grip.start.add(h.endsUpOffset(T.id, target)));
    const label = (f: (typeof frames)[number]) => f.layerOpacity(L.base.id);
    const bracket = (f: (typeof frames)[number]) => f.keyOpacity("lp", L.arg.id);
    const inside = (f: (typeof frames)[number]) => f.keyOpacity(L.arg.kind === "num" ? "t-num" : "t-var", L.arg.id);
    // Solid when picked up...
    expect(label(frames[0])).toBeCloseTo(1);
    expect(bracket(frames[0])).toBeCloseTo(1);
    // ...fading steadily while it's still being carried, the inside staying solid...
    const carried = frames.filter((f) => f.drops !== merged);
    for (let i = 1; i < carried.length; i++) expect(label(carried[i])).toBeLessThanOrEqual(label(carried[i - 1]) + 1e-9);
    const lastCarried = carried[carried.length - 1];
    expect(label(lastCarried)).toBeLessThan(0.6);
    expect(bracket(lastCarried)).toBeCloseTo(label(lastCarried));
    expect(inside(lastCarried)).toBe(1);
    if (T.kind === "neg") expect(lastCarried.layerOpacity(signId(T.id))).toBeCloseTo(label(lastCarried));
    // ...and the merge still happens on the target.
    expect(frames[frames.length - 1].drops).toBe(merged);
  });
});

describe("merging forms gradually and only snaps on release", () => {
  it("ln(2) + ln(x): carrying ln(x) onto ln(2), the + fades out steadily on the way", () => {
    const h = harness("ln(2) + ln(x)");
    const lnx = h.find("ln(x)");
    const ln2 = h.find("ln(2)");
    const grip = h.grab(lnx.id);
    const frames = grip.path(grip.start.add(h.endsUpOffset(lnx.id, ln2.id)), 20);
    const plus = frames.map((f) => f.keyOpacity("plus-*"));
    // At the start nothing has changed yet...
    expect(plus[0]).toBeCloseTo(1);
    expect(frames[0].drops).toBe("ln(2) + ln(x)");
    // ...halfway it's part-way there, and letting go there wouldn't merge...
    expect(plus[10]).toBeGreaterThan(0.2);
    expect(plus[10]).toBeLessThan(0.95);
    expect(frames[10].drops).not.toBe("ln(2*x)");
    // ...the change only ever goes one way...
    for (let i = 1; i < plus.length; i++) expect(plus[i]).toBeLessThanOrEqual(plus[i - 1] + 1e-6);
    // ...and where the piece ends up the picture is the result, and letting go merges.
    expect(plus[20]).toBeCloseTo(0);
    expect(frames[20].drops).toBe("ln(2*x)");
  });
});

describe("holding the piece where it ends up shows the result exactly, recentred, under the hand", () => {
  it.each([
    ["ln(2) + ln(x)", "ln(x)", "ln(2)"],
    ["ln(2) + ln(x)", "ln(2)", "ln(x)"],
  ])("%s: %s onto %s", (src, carried, onto) => {
    const h = harness(src);
    const me = h.find(carried);
    const target = h.find(onto);
    const merged = h.merged(me.id, target.id);
    const grip = h.grab(me.id);
    const f = grip.at(grip.start.add(h.endsUpOffset(me.id, target.id)));
    expect(f.drops).toBe(show(merged));
    const off: string[] = [];
    for (const n of f.state.sides.flatMap(allNodes)) {
      const want = h.originOf(n.id, f.state);
      const got = f.positionOf(n.id);
      if (want && (!got || got.dist(want) > 0.5)) off.push(`${show({ sides: [n] })}: shown at ${got?.x.toFixed(1)}, result at ${want.x.toFixed(1)}`);
    }
    expect(off).toEqual([]);
  });
});

describe("letting go gives what the picture shows", () => {
  it.each([
    // The case a learner hit: the 1 onto the 2 looked like 3, but letting go gave back 1 + 2.
    ["4 + x + 1 + 2", "1", "2", "4 + x + 3"],
    ["ln(2) + ln(x)", "ln(2)", "ln(x)", "ln(2*x)"],
    ["3x + 2x + 1", "2*x", "3*x", "5*x + 1"],
  ])("%s: %s towards %s", (src, carried, onto, merged) => {
    const h = harness(src);
    const me = h.find(carried);
    const target = h.find(onto);
    const grip = h.grab(me.id);
    // Sweep a band around the straight path to the target, overshooting it.
    const to = grip.centreOn(h.centreOf(target.id));
    const wrong: string[] = [];
    let sawMerged = false;
    for (let i = 0; i <= 60; i++) {
      for (const dy of [-12, 0, 12]) {
        const f = grip.at(grip.start.add(to.sub(grip.start).mul((i / 60) * 1.4)).add(Vec2(0, dy)));
        if (f.drops === merged) sawMerged = true;
        if (f.blend >= MERGE_AT && f.drops !== merged) wrong.push(`at ${i}/60 (dy ${dy}) shows ${f.blend.toFixed(2)} of ${merged}, gives ${f.drops}`);
      }
    }
    expect(wrong).toEqual([]);
    expect(sawMerged).toBe(true);
  });
});

describe("a copy made by distributing is an ordinary piece afterwards", () => {
  it("2(x + 3) → 2x + 2·3, then the 2 of 2·3 onto the 3: no 2 flies between it and 2x", () => {
    // Reach 2x + 2·3 the way a learner does, so the copy still carries its "made from" mark.
    let state = parseState("2(x + 3)");
    const first2 = state.sides.flatMap(allNodes).find((n) => n.kind === "num" && n.value === 2)!;
    state = candidatesFor(state, first2.id, ALL_RULES).find((c) => c.rule === "distribute")!.state;
    expect(show(state)).toBe("2*x + 2*3");
    const h = harness(state);
    const twos = state.sides.flatMap(allNodes).filter((n): n is Expr => n.kind === "num" && n.value === 2);
    expect(twos.some((n) => n.from)).toBe(true);
    // The 2 next to the 3 (the carried one: it went in on the far side), and the one in 2x (its copy).
    const term = (n: Expr) => state.sides.flatMap(allNodes).find((p) => p.kind === "prod" && p.factors.includes(n))!;
    const copy = twos.find((n) => show({ sides: [term(n)] }) === "2*3")!;
    const other = twos.find((n) => n !== copy)!;

    const stray: string[] = [];
    const grip = h.grab(copy.id, Vec2(6, -10));
    const to = grip.start.add(h.originOf(h.find("3").id)!.sub(h.originOf(copy.id)!));
    const otherAt = h.originOf(other.id)!.x;
    for (let i = 0; i <= 30; i++) {
      const f = grip.at(grip.start.add(to.sub(grip.start).mul((i / 30) * 1.3)));
      for (const g of f.glyphs()) {
        if (g.text === "2" && g.layer !== other.id && g.opacity > 0.05 && Math.abs(g.x - otherAt) < 30) stray.push(`step ${i}: ${g.layer} drawn at ${g.x.toFixed(0)}`);
      }
      // The copy's own layer, if still there, carries no "fly back" mark any more.
      const mine = f.preview.byId.get(copy.id)?.element.props as { dragologyEmergeFrom?: string } | undefined;
      if (mine?.dragologyEmergeFrom) stray.push(`step ${i}: the copy still says it came from ${mine.dragologyEmergeFrom}`);
    }
    expect(stray).toEqual([]);
  });
});

describe("a term carried across = changes sign on the piece itself", () => {
  it.each([
    // −5 crosses: its − fades into a +.
    ["x - 5 = 2", "-5", "x = 2 + 5", "−", "+"],
    // 5 crosses (its + stays in the row): a − fades in on it.
    ["x + 5 = 2", "5", "x = 2 - 5", null, "−"],
    // From the right side to the left.
    ["2 = x - 5", "-5", "2 + 5 = x", "−", "+"],
  ] as const)("%s: carrying %s across", (src, what, moved, oldSign, newSign) => {
    const h = harness(src);
    const piece = h.find(what);
    const result = h.candidates(piece.id).find((c) => c.rule === "move-term")!.state;
    expect(show(result)).toBe(moved);
    const grip = h.grab(piece.id);
    // Carry it to where it lands over there, like a hand.
    const body = piece.kind === "neg" ? piece.arg : piece;
    const frames = grip.path(grip.start.add(h.originOf(piece.id, result)!.sub(h.originOf(body.id)!)), 40);
    const carried = frames.map((f) => f.keyOpacity("carry-sign", piece.id));
    // Picked up: no new sign yet, the old one (if any) fully there.
    expect(carried[0]).toBe(0);
    if (oldSign) expect(frames[0].layerOpacity(signId(piece.id))).toBe(1);
    // Crossing: the new sign only ever firms up...
    for (let i = 1; i < carried.length; i++) expect(carried[i]).toBeGreaterThanOrEqual(carried[i - 1]);
    // ...and over there it's fully the new sign, the old one gone, and letting go moves it.
    const last = frames[frames.length - 1];
    expect(last.drops).toBe(moved);
    expect(carried[carried.length - 1]).toBe(1);
    if (oldSign) expect(last.layerOpacity(signId(piece.id))).toBe(0);
    // Exactly one sign shows for the moved term: the carried one (none waiting at the destination).
    const visible = (ch: string) => last.glyphs().filter((g) => g.text === ch && g.opacity > 0.05);
    expect(visible(newSign)).toHaveLength(1);
    if (oldSign) expect(visible(oldSign)).toHaveLength(0);
    // The carried number never jumps: it stays under the hand the whole way.
    const digit = String((body as { value: number }).value);
    const offsets = frames.map((f) => {
      const g = f.glyphs().find((d) => d.text === digit && d.opacity > 0.5 && Math.abs(d.x - f.pointer.x) < 80);
      return g ? g.x - f.pointer.x : NaN;
    });
    for (const o of offsets) expect(o).toBeCloseTo(offsets[0], 1);
  });
});

describe("the sign changes exactly while the cursor crosses the = sign", () => {
  it.each(["x - 5 = 2", "2 = x - 5"])("%s", (src) => {
    const h = harness(src);
    const piece = h.find("-5");
    const grip = h.grab(piece.id);
    const rc = h.rc(piece.id);
    const { left, right } = rc.eq!;
    const fromLeft = h.state.sides[0].kind === "sum";
    const [near, far] = fromLeft ? [left, right] : [right, left];
    const at = (x: number) => grip.at(Vec2(x, grip.start.y)).keyOpacity("carry-sign", piece.id);
    const step = fromLeft ? 1 : -1;
    // Up to the near edge: still the old sign; at or past the far edge: fully the new one.
    expect(at(near - step * 1)).toBe(0);
    expect(at(near)).toBe(0);
    expect(at((near + far) / 2)).toBeCloseTo(0.5);
    expect(at(far)).toBe(1);
    expect(at(far + step * 5)).toBe(1);
  });
});

describe("a piece absorbed into its target: the target stays put and changes there", () => {
  it.each([
    // The 2 onto the 5: the 5 becomes 7 where it is; only letting go moves it (to where the 2 was).
    ["x = 2 + 5", "2", "5", "x = 7", "7"],
    ["3x + 2x + 1", "3*x", "2*x", "5*x + 1", "5"],
    ["3x + 2x + 1", "2*x", "3*x", "5*x + 1", "5"],
    ["4 + x + 1 + 2", "1", "2", "4 + x + 3", "3"],
  ])("%s: %s onto %s", (src, carried, onto, merged, shows) => {
    const h = harness(src);
    const me = h.find(carried);
    const target = h.find(onto);
    const grip = h.grab(me.id);
    const frames = grip.path(grip.centreOn(h.centreOf(target.id)), 30);
    const home = h.originOf(target.id)!;
    // All the way there, the target doesn't move...
    const moved = frames.filter((f) => {
      const at = f.positionOf(target.id);
      return at && at.dist(home) > 0.5;
    });
    expect(moved.map((f) => `${f.drops} at ${f.positionOf(target.id)!.x.toFixed(1)}`)).toEqual([]);
    // ...and on it, it has become the result in place, and letting go merges.
    const last = frames[frames.length - 1];
    expect(last.drops).toBe(merged);
    // (Drawn where the target was: in its layer or one inside it, e.g. the 5 of 5x.)
    const there = last.glyphs().filter((g) => g.opacity > 0.9 && Math.abs(g.x - home.x) < 6).map((g) => g.text);
    expect(there).toContain(shows);
  });
});

describe("multiplying brackets: the carried bracket goes in, a copy splits off", () => {
  it.each([
    // [start, carried, stays put (nth match), makes room (nth match), result]
    ["(x + 4)(x - 1)", "x + 4", ["x", 1], ["1", 0], "(x + 4)*x - (x + 4)*1"],
    // Carried in from the right, it goes after each term.
    ["(x - 1)(x + 4)", "x + 4", ["1", 0], ["x", 0], "x*(x + 4) - 1*(x + 4)"],
    ["(2x + 1)(x + 3)", "x + 3", ["1", 0], ["2", 0], "2*x*(x + 3) + 1*(x + 3)"],
    ["2(x + 1)", "2", ["x", 0], ["1", 0], "2*x + 2*1"],
  ] as const)("%s: carrying %s in, one term stays put, the other makes room", (src, what, [stays, si], [moves, mi], result) => {
    const h = harness(src);
    const piece = h.find(what);
    const target = h.candidates(piece.id).find((c) => c.rule === "distribute")!;
    expect(show(target.state)).toBe(result);
    const still = h.find(stays, si);
    const room = h.find(moves, mi);
    const grip = h.grab(piece.id);
    const frames = grip.path(grip.start.add(h.endsUpOffset(piece.id, target.targetId!)), 30);
    const glyphX = (f: (typeof frames)[number], id: string) => f.glyphs().find((g) => g.layer === id)!.x;
    const x0 = glyphX(frames[0], still.id);
    const wrong: string[] = [];
    let last = glyphX(frames[0], room.id);
    const dir = Math.sign(glyphX(frames[30], room.id) - last);
    frames.forEach((f, i) => {
      // The near term doesn't budge…
      if (Math.abs(glyphX(f, still.id) - x0) > 1) wrong.push(`step ${i}: ${stays} at ${glyphX(f, still.id).toFixed(0)}, was ${x0.toFixed(0)}`);
      // …the far one only ever moves aside one way (no jumping back and forth).
      const x = glyphX(f, room.id);
      if ((x - last) * dir < -1) wrong.push(`step ${i}: ${moves} went back from ${last.toFixed(0)} to ${x.toFixed(0)}`);
      last = x;
    });
    expect(wrong).toEqual([]);
    expect(frames[30].drops).toBe(result);
    expect(frames[30].blend).toBeGreaterThan(0.95);
  });
});

describe("a bracket onto the same bracket", () => {
  // (x + 1)(x + 1): carried to the first term inside, it multiplies out; carried right over its twin, it's a square.
  it.each([
    ["distribute", "(x + 1)*x + (x + 1)*1"],
    ["merge-powers", "(x + 1)^2"],
  ] as const)("%s: carried to where that move completes, it drops as %s", (rule, result) => {
    const h = harness("(x + 1)(x + 1)");
    const piece = h.find("x + 1", 0);
    const target = h.candidates(piece.id).find((c) => c.rule === rule)!;
    const grip = h.grab(piece.id);
    const frames = grip.path(grip.start.add(h.endsUpOffset(piece.id, target.targetId!, rule)), 30);
    expect(frames[30].drops).toBe(result);
  });
});

describe("every merge in every puzzle animates sanely", () => {
  // Carry each mergeable piece, like a hand, to where it ends up in the result.
  it.each(allPuzzles().map((r) => [r.puzzle.id, r.puzzle.start, r.rules] as const))("%s: %s", (_, src, rules) => {
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
    expect([...new Set(problems)].slice(0, 8)).toEqual([]);
  });
});

describe("an inequality sign turns round as a minus is carried across it", () => {
  /** The relation sign's horizontal scale in a frame: 1 facing as drawn, −1 turned round. */
  const facing = (f: { preview: { byId: Map<string, { element: { props: { transform?: string } } }> } }) => {
    const m = f.preview.byId.get("rel")!.element.props.transform!.match(/scale\(\s*([-\d.eE]+)/);
    return parseFloat(m![1]);
  };
  it.each([
    ["-x < 4", "x > -4"],
    ["-x ≤ -6", "x ≥ 6"],
    ["4 ≥ -x", "-4 ≤ x"],
  ])("%s → %s", (src, result) => {
    const h = harness(src);
    const owner = h.state.sides.flatMap(allNodes).find((n) => n.kind === "neg" && allNodes(h.state.sides[0]).includes(n) === src.startsWith("-"))!;
    const grip = h.grab(signId(owner.id));
    const rc = h.rc(signId(owner.id));
    const across = (rc.eq!.right - rc.eq!.left) * (src.startsWith("-") ? 1 : -1);
    const to = Vec2((src.startsWith("-") ? rc.eq!.right : rc.eq!.left) + across * 2, grip.start.y);
    const frames = grip.path(to, 40);
    // Relative to how it faces at the start (≥ is ≤ drawn facing the other way).
    const s0 = facing(frames[0]);
    expect(Math.abs(s0)).toBeCloseTo(1);
    const scales = frames.map((f) => facing(f) / s0);
    // It only ever turns one way: no flicking back and forth.
    for (let i = 1; i < scales.length; i++) expect(scales[i]).toBeLessThanOrEqual(scales[i - 1] + 1e-9);
    expect(scales[scales.length - 1]).toBeCloseTo(-1);
    // Part-way through, it's edge-on: really turning, not swapping.
    expect(scales.some((s) => Math.abs(s) < 0.3)).toBe(true);
    expect(frames[frames.length - 1].drops).toBe(result);
  });
});
