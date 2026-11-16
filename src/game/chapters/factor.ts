import type { Chapter } from "../puzzles";

export const factor: Chapter = {
  id: "factor",
  title: "Factoring",
  blurb: "Factoring writes a sum as a product. A factor every term has can stand once, in front of brackets: 3x + 3y = 3(x + y).",
  after: ["brackets"],
  unlocks: ["factor-out", "split-number", "factor-shared", "split-term", "difference-of-squares"],
};
