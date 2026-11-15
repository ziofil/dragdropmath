// The one owner of outcomes: each exercise counts once, a badge only from a right answer, a streak only from first answers.
import { beforeEach, describe, expect, it } from "vitest";
import { badgeTier, KEEP, loadProgress, record, seen, streakOf, toNextTier, type Context } from "./scoring";

// A stand-in for the browser's storage (the tests run in node).
const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage;

const ch = { id: "balance" };
const predict = (level: "easy" | "medium" | "hard" = "easy"): Context => ({ kind: "predict", chapter: "balance", level });
const practice: Context = { kind: "practice", chapter: "balance", level: "easy" };
const set: Context = { kind: "set" };
/** n right predictions at a level, on fresh exercises. */
const rightOnes = (n: number, level: "easy" | "medium" | "hard" = "easy", from = 0) => {
  for (let i = from; i < from + n; i++) record(`predict-balance-${level}-${i}`, predict(level), "right");
};

describe("record", () => {
  beforeEach(() => store.clear());

  it("counts a right prediction once, however often it's told", () => {
    const first = record("p1", predict(), "right", "x = 4");
    expect(first).toMatchObject({ first: true, counted: true, streak: { now: 1, best: 1 } });
    // A reload and a pick again (any pick): nothing more.
    expect(record("p1", predict(), "right", "x = 4")).toMatchObject({ first: false, counted: false, streak: null });
    expect(record("p1", predict(), "wrong", "x = 7")).toMatchObject({ first: false, counted: false });
    expect(loadProgress().balance).toEqual({ easy: 1, medium: 0, hard: 0 });
    expect(streakOf(ch)).toEqual({ now: 1, best: 1 });
    expect(seen("p1")).toEqual({ predicted: "right", pick: "x = 4" });
  });

  it("keeps a reveal: picking the right one after a reload doesn't count (bug: reveal, reload, pick)", () => {
    expect(record("p1", predict(), "revealed")).toMatchObject({ first: true, counted: false });
    expect(record("p1", predict(), "right", "x = 4")).toMatchObject({ first: false, counted: false });
    expect(loadProgress().balance).toBeUndefined();
    expect(seen("p1").predicted).toBe("revealed");
  });

  it("gives the badge only from a right answer (bug: a badge on a wrong pick or on Reveal)", () => {
    rightOnes(9);
    expect(record("w", predict(), "wrong", "x = 7").tier).toEqual({ before: 0, after: 0 });
    expect(record("r", predict(), "revealed").tier).toEqual({ before: 0, after: 0 });
    expect(record("ok", predict(), "right").tier).toEqual({ before: 0, after: 1 });
    expect(record("ok2", predict(), "right").tier).toEqual({ before: 1, after: 1 });
  });

  it("builds a streak from first predictions only: reloading the same one doesn't farm it", () => {
    record("a", predict(), "right");
    record("a", predict(), "right");
    record("a", predict(), "right");
    expect(streakOf(ch)).toEqual({ now: 1, best: 1 });
    record("b", predict(), "right");
    record("c", predict(), "wrong");
    expect(streakOf(ch)).toEqual({ now: 0, best: 2 });
    record("d", predict(), "right");
    record("e", predict(), "revealed");
    expect(streakOf(ch)).toEqual({ now: 0, best: 2 });
  });

  it("counts a predict exercise with nothing to pick once solved", () => {
    expect(record("n", predict(), "tried")).toMatchObject({ counted: false });
    expect(record("n", predict(), "solved")).toMatchObject({ first: true, counted: true });
    expect(record("n", predict(), "solved")).toMatchObject({ first: false, counted: false });
    expect(loadProgress().balance.easy).toBe(1);
    // Solving after a prediction adds nothing.
    record("m", predict(), "wrong");
    expect(record("m", predict(), "solved")).toMatchObject({ first: true, counted: false });
    expect(loadProgress().balance.easy).toBe(1);
  });

  it("counts practice by tries, apart from the badge", () => {
    for (let i = 0; i < 12; i++) record(`practice-${i}`, practice, "tried");
    record("practice-0", practice, "tried");
    record("practice-0", practice, "solved");
    expect(loadProgress("practice").balance).toEqual({ easy: 12, medium: 0, hard: 0 });
    expect(loadProgress().balance).toBeUndefined();
  });

  it("keeps a set's exercises solved and predicted, counting nowhere", () => {
    expect(record("set-k-1", set, "right", "x = 4")).toMatchObject({ first: true, counted: false, streak: null });
    record("set-k-1", set, "solved");
    expect(seen("set-k-1")).toEqual({ predicted: "right", pick: "x = 4", solved: true });
    expect(store.has("mathbyhand.counts.v1")).toBe(false);
  });

  it("forgets only the oldest, beyond KEEP", () => {
    record("oldest", set, "solved");
    record("old", set, "solved");
    const all = JSON.parse(store.get("mathbyhand.outcomes.v1")!);
    for (let i = 0; i < KEEP - 2; i++) all[`x${i}`] = { tried: true };
    store.set("mathbyhand.outcomes.v1", JSON.stringify(all));
    record("oldest", set, "tried"); // told again: now the latest
    record("new", set, "tried");
    expect(seen("old")).toEqual({});
    expect(seen("oldest")).toEqual({ solved: true, tried: true });
    expect(seen("new")).toEqual({ tried: true });
    expect(Object.keys(JSON.parse(store.get("mathbyhand.outcomes.v1")!))).toHaveLength(KEEP);
  });
});

describe("the badge", () => {
  beforeEach(() => store.clear());

  it("bronze for 10 easy, and says what silver takes", () => {
    rightOnes(9);
    expect(badgeTier(ch, loadProgress())).toBe(0);
    expect(toNextTier(ch, loadProgress())).toEqual({ level: "easy", more: 1 });
    rightOnes(1, "easy", 9);
    expect(badgeTier(ch, loadProgress())).toBe(1);
    expect(toNextTier(ch, loadProgress())).toEqual({ level: "medium", more: 10 });
  });

  it("gold straight away for 10 hard ones", () => {
    rightOnes(10, "hard");
    expect(badgeTier(ch, loadProgress())).toBe(3);
    expect(toNextTier(ch, loadProgress())).toBeNull();
  });
});

describe("what earlier versions stored", () => {
  beforeEach(() => store.clear());

  it("is read once into the outcomes, test ids as predict ones", () => {
    store.set("mathbyhand.guesses.v1", JSON.stringify({ "set-k-1": "wrong", "set-k-2": "revealed" }));
    store.set("mathbyhand.picks.v1", JSON.stringify({ "set-k-1": "x = 7" }));
    store.set("mathbyhand.solved.v1", JSON.stringify(["set-k-1"]));
    store.set("graspable.solved.v1", JSON.stringify(["old-1"]));
    store.set("mathbyhand.counted.v1", JSON.stringify(["test-balance-easy-5", "practice-balance-easy-6"]));
    expect(seen("set-k-1")).toEqual({ predicted: "wrong", pick: "x = 7", solved: true });
    expect(seen("set-k-2")).toEqual({ predicted: "revealed" });
    expect(seen("old-1")).toEqual({ solved: true });
    expect(seen("predict-balance-easy-5")).toEqual({ predicted: "right" });
    expect(seen("practice-balance-easy-6")).toEqual({ tried: true });
    // Counted already: the same exercise again counts nothing.
    expect(record("predict-balance-easy-5", predict(), "right").counted).toBe(false);
  });
});
