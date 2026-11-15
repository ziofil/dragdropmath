/**
 * Drags through the real Dragology engine, headlessly (see testing/harness):
 * every move must be reachable by a hand, merges must form gradually and land
 * under the hand, and what letting go gives must match what's shown.
 */
import { describe, expect, it } from "vitest";
import { Vec2 } from "dragology";
import type { Expr, Log } from "../expr/types";
import { parseState } from "../expr/parse";
import { allNodes } from "../expr/tree";
import { ALL_RULES, candidatesFor, signId } from "../rules";
import { rulesOf } from "../game/puzzles";
import { corpus } from "../game/testing/corpus";
import { verify } from "../game/generate/verify";
import { MERGE_AT } from "./drag";
import { ANCHOR, harness, show } from "./testing/harness";
import { checkAllMovesReachable } from "./testing/checks";

describe("moves inside small superscripts can be reached too", () => {
  // Mid-puzzle states the puzzle starts don't cover: combining exponents in place.
  it.each(["x^(3 + 2)", "x^(5 - 2)", "x^(2·3)", "x^(1 + 2) + 3x", "2^(1/2 + 1/2)", "(2·2)^(1/2)", "3^((1 + 1)/2)", "x = 3^2", "x^(1/2) = 3", "(3·3)^(1/2)", "3ln(x) - ln(x)", "x - (y + 1) = 3", "-x = 0", "(x - 2)/2", "x·x + x·2 - 2x", "2·(3/4)", "x = -(2 - 7)", "3 > x", "7 = x", "3 ≤ x + 1", "√2·√2", "√x·√x·3", "-x/2 > 1", "-2x ≤ 6", "√(x^4)", "(x + 1)(2x + 3)", "(2x - 3)(2x + 3)", "(3 + 2x)(3 - 2x)", "a(a - 3) + 4a - 12"])("%s", (src) => {
    expect(checkAllMovesReachable(src, ALL_RULES)).toEqual([]);
  }, 60_000);
});

// Slow (minutes): run with `npm run test:all`.
const SLOW = !!(globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.SLOW;
describe.runIf(SLOW)("on the way to solving, every move can still be reached by dragging", () => {
  // The starts are checked below; these are the states a learner passes
  // through (as the moves and tidying make them, marks and all).
  it.each(corpus().map((c) => [c.id, c] as const))("%s", (_, ref) => {
    const check = verify(ref, ref.rules);
    expect("stuck" in check ? check.stuck : "").toBe("");
    const path = "path" in check ? check.path : [];
    const problems = path.slice(1, -1).flatMap((s) => checkAllMovesReachable(s, ref.rules).map((p) => `at ${show(s)}: ${p}`));
    expect(problems).toEqual([]);
  }, 60_000);
});

describe("pulling a factor out of a log", () => {
  it.each([
    ["ln(2x)", "2", -1, "ln(2) + ln(x)"],
    ["ln(2x)", "x", 1, "ln(2) + ln(x)"],
    ["log_2(8x)", "8", -1, "log_2(8) + log_2(x)"],
  ] as const)("%s: carrying the %s out, a faint log goes with it and firms up", (src, what, dir, split) => {
    // As in the logs chapter: its letters stand for positive numbers (ln(ab) splits only then).
    const h = harness({ ...parseState(src), letters: "positive" });
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

describe("a merge holds while the piece is over its target, and undoes the way it formed", () => {
  // Exercise 3.1: the a carried into a(b + c) showed ab + ac just before the b,
  // then faded on past the b while still inside the brackets.
  it.each([
    ["a(b + c)", 1, "(a*b + a*c)"],
    ["(b + c)a", -1, "(b*a + c*a)"],
  ])("%s: the a carried across the brackets", (src, dir, merged) => {
    const h = harness(src);
    const grip = h.grab(h.find("a").id);
    const b = h.centreOf(h.find("b").id).x;
    const c = h.centreOf(h.find("c").id).x;
    const at = (x: number) => grip.at(Vec2(x, grip.start.y));
    // Over the b, between b and c, over the c: the result, and letting go gives it.
    for (const x of [b, (b + c) / 2, c]) {
      const f = at(x);
      expect(f.blend, `at ${x.toFixed(0)}`).toBeGreaterThan(0.99);
      expect(f.drops).toBe(merged);
    }
    // Carried out the far side, it fades away again.
    const farOut = at((dir > 0 ? Math.max(b, c) : Math.min(b, c)) + dir * 150);
    expect(farOut.blend).toBeCloseTo(0);
    expect(farOut.drops).not.toBe(merged);
  });
});

describe("a copy made by distributing is an ordinary piece afterwards", () => {
  it("2(x + 3) → 2x + 2·3, then the 2 of 2·3 onto the 3: no 2 flies between it and 2x", () => {
    // Reach 2x + 2·3 the way a learner does, so the copy still carries its "made from" mark.
    let state = parseState("2(x + 3)");
    const first2 = state.sides.flatMap(allNodes).find((n) => n.kind === "num" && n.value === 2)!;
    state = candidatesFor(state, first2.id, ALL_RULES).find((c) => c.rule === "distribute")!.state;
    expect(show(state)).toBe("(2*x + 2*3)");
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
    ["(x + 4)(x - 1)", "x + 4", ["x", 1], ["1", 0], "((x + 4)*x - (x + 4)*1)"],
    // Carried in from the right, it goes after each term.
    ["(x - 1)(x + 4)", "x + 4", ["1", 0], ["x", 0], "(x*(x + 4) - 1*(x + 4))"],
    ["(2x + 1)(x + 3)", "x + 3", ["1", 0], ["2", 0], "(2*x*(x + 3) + 1*(x + 3))"],
    ["2(x + 1)", "2", ["x", 0], ["1", 0], "(2*x + 2*1)"],
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
    ["distribute", "((x + 1)*x + (x + 1)*1)"],
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

describe("substituting: the letter there turns into the value in place (11.6)", () => {
  it("y = x + 2; x = 4: carrying the x onto the x of x + 2", () => {
    const h = harness("y = x + 2; x = 4", ALL_RULES);
    const src = h.state.sides[2]; // the x of x = 4
    const target = h.find("x", 0);
    const at = h.centreOf(target.id);
    const c = h.candidates(src.id).find((k) => k.rule === "substitute")!;
    const g = h.grab(src.id);
    const frames = g.path(g.start.add(h.endsUpOffset(src.id, c.targetId!, c.rule)), 12);
    const end = frames[frames.length - 1];
    expect(show(end.state)).toBe("y = 4 + 2 ; x = 4");
    // No minus on the way (that's for carrying a term across its own =).
    for (const f of frames) expect(f.glyphs().filter((d) => d.text === "−" && d.opacity > 0.05)).toEqual([]);
    // Every 4 drawn is either the one of x = 4, or the new one where the x was: none flies in between.
    const four0 = frames[0].glyphs().find((d) => d.text === "4")!;
    for (const f of frames)
      for (const d of f.glyphs().filter((d) => d.text === "4" && d.opacity > 0.05)) {
        const home = Math.abs(d.x - four0.x) < 2 && Math.abs(d.y - four0.y) < 2;
        const there = Math.abs(d.y - at.y) < 20 && Math.abs(d.x - (at.x - h.sizeOf(target.id).w / 2)) < 20;
        expect(home || there, `a 4 at ${d.x.toFixed(0)},${d.y.toFixed(0)}`).toBe(true);
      }
  });
});

describe("a square carried across = turns into ½ (13.30)", () => {
  it("(2^x)^2 = 48/3: the ² can be carried across, by hand", () => {
    const r = { rules: rulesOf("balance") };
    const h = harness({ ...parseState("(2^x)^2 = 48/3"), letters: "positive" }, r.rules);
    const square = (h.state.sides[0] as Extract<Expr, { kind: "pow" }>).exp;
    expect(candidatesFor(h.state, square.id, r.rules).map((c) => show(c.state))).toContain("2^x = (48/3)^(1/2)");
    expect(checkAllMovesReachable(h.state, r.rules)).toEqual([]);
  });
});

describe("undoing a square by hand, where nothing can be lost (12.23, 12.30)", () => {
  it.each([
    ["r23", "(2√x)^2 = 12", "2*√(x) = 12^(1/2)"],
    ["r30", "x^2 = 4", "x = 4^(1/2)"], // where letters stand for positive numbers
  ])("%s: %s", (_, src, expected) => {
    const r = { rules: rulesOf("balance") };
    const h = harness({ ...parseState(src), letters: "positive" }, r.rules);
    const square = (h.state.sides[0] as Extract<Expr, { kind: "pow" }>).exp;
    expect(candidatesFor(h.state, square.id, r.rules).map((c) => show(c.state))).toContain(expected.replace(/\*/g, "*"));
    expect(checkAllMovesReachable(h.state, r.rules)).toEqual([]);
  });
});
