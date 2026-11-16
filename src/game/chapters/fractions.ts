import type { Chapter } from "../puzzles";

export const fractions: Chapter = {
  id: "fractions",
  title: "Fractions",
  blurb:
    "To add fractions, first make the bottoms the same. Multiplying the top and bottom by the same number doesn't change a fraction's value.",
  after: ["factor"],
  unlocks: ["divide-numbers", "evaluate-fraction", "cancel-factor", "expand-fraction", "add-fractions", "split-fraction", "multiply-fractions", "divide-by-fraction", "times-one"],
};
