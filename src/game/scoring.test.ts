// The one owner of outcomes: each exercise counts once; the mind's eye moves a score per level, up for a right first answer and down for a wrong one; practice and sets count nowhere.
import { beforeEach, describe, expect, it } from "vitest";
import { KEEP, loadScore, record, seen, type Context } from "./scoring";

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

const predict = (level: "easy" | "medium" | "hard" = "easy"): Context => ({ kind: "predict", chapter: "balance", level });
const practice: Context = { kind: "practice", chapter: "balance", level: "easy" };
const set: Context = { kind: "set" };
const score = () => loadScore();

describe("record", () => {
  beforeEach(() => store.clear());

  it("counts a right first answer once, however often it's told", () => {
    expect(record("p1", predict(), "right", "x = 4")).toMatchObject({ first: true, score: { level: "easy", was: 0, now: 1 } });
    // A reload and a pick again (any pick): nothing more.
    expect(record("p1", predict(), "right", "x = 4")).toMatchObject({ first: false, score: null });
    expect(record("p1", predict(), "wrong", "x = 7")).toMatchObject({ first: false, score: null });
    expect(score()).toEqual({ easy: 1, medium: 0, hard: 0 });
    expect(seen("p1")).toEqual({ predicted: "right", pick: "x = 4" });
  });

  it("takes one away for a wrong answer or a reveal, never below 0", () => {
    record("a", predict(), "right");
    record("b", predict(), "right");
    record("c", predict(), "wrong");
    expect(score().easy).toBe(1);
    expect(record("d", predict(), "revealed")).toMatchObject({ score: { was: 1, now: 0 } });
    expect(record("e", predict(), "wrong")).toMatchObject({ score: { was: 0, now: 0 } });
    expect(score().easy).toBe(0);
  });

  it("keeps a reveal: picking the right one after a reload doesn't count (bug: reveal, reload, pick)", () => {
    record("a", predict(), "right");
    record("p1", predict(), "revealed");
    expect(record("p1", predict(), "right", "x = 4")).toMatchObject({ first: false });
    expect(score().easy).toBe(0);
    expect(seen("p1").predicted).toBe("revealed");
  });

  it("keeps one score per level, across every chapter", () => {
    record("a", predict("hard"), "right");
    record("b", { kind: "predict", chapter: "roots", level: "hard" }, "right");
    record("c", predict("medium"), "right");
    expect(score()).toEqual({ easy: 0, medium: 1, hard: 2 });
  });

  it("counts a mind's-eye exercise with nothing to pick as right once solved", () => {
    expect(record("n", predict(), "tried")).toMatchObject({ score: null });
    expect(record("n", predict(), "solved")).toMatchObject({ first: true, score: { now: 1 } });
    expect(record("n", predict(), "solved")).toMatchObject({ first: false, score: null });
    // Solving after an answer adds nothing.
    record("m", predict(), "wrong");
    expect(record("m", predict(), "solved")).toMatchObject({ first: true, score: null });
  });

  it("counts practice and sets nowhere, but keeps what was done", () => {
    for (let i = 0; i < 12; i++) expect(record(`practice-${i}`, practice, "tried").score).toBeNull();
    record("practice-0", practice, "solved");
    expect(record("set-k-1", set, "right", "x = 4")).toMatchObject({ first: true, score: null });
    record("set-k-1", set, "solved");
    expect(seen("set-k-1")).toEqual({ predicted: "right", pick: "x = 4", solved: true });
    expect(seen("practice-0")).toEqual({ tried: true, solved: true });
    expect(store.has("mathbyhand.score.v1")).toBe(false);
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
    // Told already: the same exercise again changes nothing.
    expect(record("predict-balance-easy-5", predict(), "right").first).toBe(false);
  });
});
