// A chapter's progress: how many solved at each level, each exercise counted once; the badge is the highest level reached.
import { beforeEach, describe, expect, it } from "vitest";
import { badgeTier, countSolved, isCounted, loadProgress, toNextTier } from "./scoring";

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

describe("progress", () => {
  beforeEach(() => store.clear());

  it("counts each exercise once", () => {
    countSolved("balance", "easy", "ex-1");
    countSolved("balance", "easy", "ex-1");
    countSolved("balance", "easy", "ex-2");
    expect(loadProgress().balance).toEqual({ easy: 2, medium: 0, hard: 0 });
    expect(isCounted("ex-1")).toBe(true);
    expect(isCounted("ex-3")).toBe(false);
  });

  it("gives bronze for 10 easy, and says what silver takes", () => {
    for (let i = 0; i < 9; i++) countSolved("balance", "easy", `e${i}`);
    expect(badgeTier(ch, loadProgress())).toBe(0);
    expect(toNextTier(ch, loadProgress())).toEqual({ level: "easy", more: 1 });
    countSolved("balance", "easy", "e9");
    expect(badgeTier(ch, loadProgress())).toBe(1);
    expect(toNextTier(ch, loadProgress())).toEqual({ level: "medium", more: 10 });
  });

  it("gives gold straight away for 10 hard ones", () => {
    for (let i = 0; i < 10; i++) countSolved("balance", "hard", `h${i}`);
    expect(badgeTier(ch, loadProgress())).toBe(3);
    expect(toNextTier(ch, loadProgress())).toBeNull();
  });
});
