import type { Chapter } from "../puzzles";

export const roots: Chapter = {
  id: "roots",
  title: "Roots",
  blurb: "√x is x to the power ½, and ∛x is x to the power ⅓, so the rules for powers work for roots too.",
  after: ["fractions"],
  unlocks: ["root-notation", "split-square", "evaluate-root", "pull-out-of-power", "join-powers"],
  positive: true,
};
