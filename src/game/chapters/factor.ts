import type { Chapter } from "../puzzles";

export const factor: Chapter = {
  id: "factor",
  title: "Factoring",
  blurb: "Factoring is expanding in reverse. Find a factor that every term has, and take it out in front of brackets.",
  after: ["brackets"],
  unlocks: ["split-number", "factor-shared"],
};
