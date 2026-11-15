import type { Chapter } from "../puzzles";

export const powers: Chapter = {
  id: "powers",
  title: "Powers",
  blurb: "x³ means x·x·x. Count the x's and you can work out the rules for powers.",
  after: ["brackets"],
  unlocks: [
    "power-of-power",
    "zero-power",
    "evaluate-power",
    "tap-power",
    "divide-powers",
    "flip-across-bar",
    "power-one",
    "power-of-product",
    "split-exponent",
  ],
  positive: true,
};
