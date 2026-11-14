import type { Chapter } from "../puzzles";

export const balance: Chapter = {
  id: "balance",
  title: "Solving equations",
  blurb: "Do the same thing to both sides and the equation stays true. A term that moves across the = does the opposite on the other side.",
  after: ["distribute"],
  unlocks: ["move-term", "swap-sides", "move-factor", "move-denominator", "move-sign", "divide-numbers", "evaluate-fraction", "cancel-factor"],
};
