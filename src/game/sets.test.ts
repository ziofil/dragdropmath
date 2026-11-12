import { describe, expect, it } from "vitest";
import { decodeSet, encodeSet, EXAMPLE_SET, readSet, setKey } from "./sets";

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
});
