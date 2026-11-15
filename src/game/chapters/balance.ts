import type { Chapter } from "../puzzles";

export const balance: Chapter = {
  id: "balance",
  title: "Solving equations",
  blurb: "Do the same thing to both sides and the equation stays true. Whatever moves across the = does the opposite on the other side: a plus becomes a minus, a times becomes a divide, a root becomes a power, a log becomes a power.",
  after: ["explog"],
  unlocks: ["move-term", "swap-sides", "move-factor", "move-denominator", "move-sign", "root-across", "exp-across", "move-exponent-term", "log-across"],
};
