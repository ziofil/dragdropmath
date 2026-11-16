import { describe, expect, it } from "vitest";
import { decodeSet, encodeSet, movesOf, positiveOf, setKey } from "./sets";
import { readSet } from "./readSet";
import { rulesOf } from "./puzzles";
import { solveMoves } from "./solveWorker";
import { LEVELS, PRACTICE } from "./generate/practice";
import { SLOW } from "./testing/corpus";
import { rng } from "./generate/write";
import { en } from "../i18n";

const EXAMPLE_SET = en.exampleSet;

describe("exercise sets of one's own", () => {
  it("the example reads cleanly, with wrong answers for every exercise", () => {
    const r = readSet(EXAMPLE_SET);
    expect(r.problems).toEqual([]);
    expect(r.set!.title).toBe("Homework week 3");
    expect(r.exercises.map((e) => e.problems)).toEqual([[], [], []]);
    expect(r.exercises[0].decoys).toEqual(["x = 7", "x = 8"]); // its own
    for (const e of r.exercises) expect(e.decoys).toHaveLength(2); // made for the others
  });

  it("says what's wrong, exercise by exercise", () => {
    const r = readSet(`title: Oops
moves: algebra
exercises:
  - start: 2x + 3 = 11
    goal: x = 5
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 4, y = 1]
  - start: 3x +
    goal: x
`);
    expect(r.problems.join(" ")).toMatch(/No chapter called "algebra"/);
    expect(r.exercises[0].problems.join(" ")).toMatch(/doesn't follow from the start/);
    expect(r.exercises[1].problems.join(" ")).toMatch(/"x = 4" is actually right/);
    expect(r.exercises[1].problems.join(" ")).toMatch(/"y = 1" doesn't look like the goal/);
    expect(r.exercises[2].problems.join(" ")).toMatch(/Can't read the start/);
  });

  it("impossible maths isn't right: ∞ equals nothing, a start with no value is said so", () => {
    const r = readSet(`exercises:
  - start: x/0 = 1
    goal: x = 5
  - start: 1/(x - x) = 2
    goal: x = 1
  - start: 2x + 3 = 11
    goal: x = 4
`);
    expect(r.exercises[0].problems.join(" ")).toMatch(/no value/);
    expect(r.exercises[1].problems.join(" ")).toMatch(/no value/);
    expect(r.exercises[2].problems).toEqual([]);
  });

  it("not YAML, or not a set", () => {
    expect(readSet("title: [unclosed").problems[0]).toMatch(/isn't valid YAML/);
    expect(readSet("- just a list").problems.length).toBeGreaterThan(0);
  });

  it("travels in a link and comes back the same", async () => {
    const set = readSet(EXAMPLE_SET).set!;
    const code = await encodeSet(set);
    expect(code).toMatch(/^[\w-]+$/); // safe in a URL
    expect(await decodeSet(code)).toEqual(set);
    expect(setKey(code)).toBe(setKey(code));
  });

  it("a link made by hand is checked as the maker checks: no wrong goal, no right 'wrong' answer, nothing huge", async () => {
    const set = {
      title: "T",
      exercises: [
        { start: "2x = 4", goal: "x = 2", wrong: ["x = 2", "x = 8"] }, // a "wrong" answer that's the goal
        { start: "2x = 4", goal: "x = 3" }, // a goal that doesn't follow
        { start: "x + 1 = 3", goal: "x = 2", wrong: ["x = 4", "x = 1"] },
      ],
    };
    const back = await decodeSet(await encodeSet(set));
    expect(back.exercises).toEqual([{ start: "2x = 4", goal: "x = 2" }, { start: "x + 1 = 3", goal: "x = 2", wrong: ["x = 4", "x = 1"] }]);
    // Thousands of exercises in a short link: refused.
    const many = { title: "T", exercises: Array.from({ length: 5000 }, () => ({ start: "2x = 4", goal: "x = 2" })) };
    await expect(decodeSet(await encodeSet(many))).rejects.toThrow();
    await expect(decodeSet("A".repeat(50_000))).rejects.toThrow();
  });

  it("a link keeps a chapter by its id, whatever the teacher wrote", async () => {
    const set = { title: "T", moves: "5", exercises: [{ start: "2x = 4", goal: "x = 2", moves: "Fractions" }] };
    const back = await decodeSet(await encodeSet(set));
    // 5 is the fifth chapter on the path now; the title, any language's, is its chapter.
    expect(back.moves).toBe("brackets");
    expect(back.exercises[0].moves).toBe("fractions");
  });

  it("a number in a link made before the chapters were reordered means the order then", async () => {
    // Links made until 2026-11-15 kept what the teacher wrote: "moves: 5" was Solving equations then.
    const old = await packed(["Old", "5", [["2x = 4", "x = 2", "", "", "", "10"]]]);
    const set = await decodeSet(old);
    expect(set.moves).toBe("balance");
    expect(set.exercises[0].moves).toBe("fractions");
    expect(movesOf(set, set.exercises[0])).toEqual(rulesOf("fractions"));
  });

  it("letters are positive where a chapter says, or where there's a root, a log or a power", () => {
    const set = { title: "T", exercises: [] };
    expect(positiveOf(set, { start: "√x = 3", goal: "x = 9" })).toBe(true);
    expect(positiveOf(set, { start: "2x + 1 < 7", goal: "x < 3" })).toBe(false);
    expect(positiveOf({ ...set, moves: "roots" }, { start: "2x = 4", goal: "x = 2" })).toBe(true);
  });
});

describe("checking a set: the app's own exercises can be solved, quickly", () => {
  it.each([
    ["5(x + 2) - 4(x + 5) = -9", "x = 1", "balance"],
    ["5(x + 2) = 4(x + 3)", "x = 2", "balance"],
    ["(3/8)/(5/9 - 4/9)", "27/8", "fractions"],
    ["(x + 7)/5 = (x - 2)/2", "x = 8", "balance"],
  ])("%s", (start, goal, chapter) => {
    expect(solveMoves({ start, goal, rules: rulesOf(chapter), positive: false })).not.toBeNull();
  }, 10_000);

  // The practice exercises, as a teacher would paste them into a set: some chapters' (every one in a slow run).
  for (const chapter of SLOW ? Object.keys(PRACTICE) : ["balance", "inequalities", "simultaneous"])
    it(`${chapter}'s practice`, () => {
      for (const level of SLOW ? LEVELS : (["easy", "medium"] as const))
        for (const shape of PRACTICE[chapter][level]) {
          const d = shape.make(rng(7));
          if (d) expect(solveMoves({ start: d.start, goal: d.goal, rules: rulesOf(chapter), positive: !!d.positive }), `${d.start} ⇒ ${d.goal}`).not.toBeNull();
        }
    }, 120_000);
});

/** A link's code for this packed set, as links were made before (no normalising). */
async function packed(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const out = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer());
  return btoa(String.fromCharCode(...out)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
