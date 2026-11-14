import type { Chapter } from "../puzzles";

export const formulas: Chapter = {
  id: "formulas",
  title: "Rearranging formulas",
  blurb: "A formula is an equation with several letters. Use the same moves as for x to get one letter on its own.",
  after: ["balance"],
  unlocks: ["move-letter-factor", "move-letter-denominator"],
};
