import type { Chapter } from "../puzzles";

export const brackets: Chapter = {
  id: "brackets",
  title: "Multiplying brackets",
  blurb: "To multiply two brackets, multiply each term in the first bracket by each term in the second.",
  after: ["distribute"],
  unlocks: ["power-to-product"],
};
