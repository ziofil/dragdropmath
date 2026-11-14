import type { Chapter } from "../puzzles";

export const shuffle: Chapter = {
  id: "shuffle",
  title: "Rearranging terms",
  blurb: "Terms can be added in any order, and plain numbers can be worked out.",
  after: [],
  unlocks: ["commute", "combine", "multiply-numbers", "numbers-first", "multiply-out"],
};
