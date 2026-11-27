// Saving progress to a file and loading it back gives the same progress; other files are refused.
import { beforeEach, describe, expect, it } from "vitest";
import { applyBackup, backupText, canStore, loadBackup, readBackup } from "./backup";

const store = new Map<string, string>();
const fake = {
  get length() {
    return store.size;
  },
  key: (i: number) => [...store.keys()][i] ?? null,
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
};
(globalThis as { localStorage?: unknown }).localStorage = fake;

describe("progress backup", () => {
  beforeEach(() => store.clear());

  it("keeps the app's values, and only those", () => {
    store.set("mathbyhand.outcomes.v1", '{"a":1}');
    store.set("mathbyhand.skin.v1", '"codex"');
    store.set("mathbyhand.debug", "1");
    store.set("someone-else", "x");
    const text = backupText(new Date("2026-11-15T12:00:00Z"));
    store.clear();
    expect(loadBackup(text)).toBe(2);
    expect(Object.fromEntries(store)).toEqual({ "mathbyhand.outcomes.v1": '{"a":1}', "mathbyhand.skin.v1": '"codex"' });
  });

  it("refuses what isn't a backup", () => {
    expect(loadBackup("not json")).toBeNull();
    expect(loadBackup('{"app":"other","version":1,"data":{}}')).toBeNull();
    expect(store.size).toBe(0);
  });

  it("refuses a damaged file: a value that isn't what the app stores", () => {
    expect(readBackup('{"app":"dragdropmath","version":1,"saved":"","data":{"mathbyhand.score.v1":"{broken"}}')).toBeNull();
    expect(readBackup('{"app":"dragdropmath","version":1,"saved":"","data":{"mathbyhand.score.v1":3}}')).toBeNull();
    expect(readBackup('{"app":"dragdropmath","version":1,"saved":"","data":["x"]}')).toBeNull();
  });

  it("is all or nothing: storing that fails partway puts back what was there", () => {
    store.set("mathbyhand.score.v1", '{"easy":5}');
    const real = fake.setItem;
    let n = 0;
    fake.setItem = (k: string, v: string) => {
      if (++n === 2) throw new Error("QuotaExceededError");
      real(k, v);
    };
    try {
      expect(applyBackup([["mathbyhand.score.v1", '{"easy":9}'], ["mathbyhand.outcomes.v1", "{}"]])).toBeNull();
    } finally {
      fake.setItem = real;
    }
    expect(Object.fromEntries(store)).toEqual({ "mathbyhand.score.v1": '{"easy":5}' });
  });

  it("knows when the browser keeps nothing", () => {
    expect(canStore()).toBe(true);
    const real = fake.setItem;
    fake.setItem = () => {
      throw new Error("SecurityError");
    };
    try {
      expect(canStore()).toBe(false);
    } finally {
      fake.setItem = real;
    }
  });
});
