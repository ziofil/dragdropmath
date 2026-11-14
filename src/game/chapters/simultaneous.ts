import type { Chapter } from "../puzzles";

export const simultaneous: Chapter = {
  id: "simultaneous",
  title: "Simultaneous equations",
  blurb: "Two equations with two unknowns, both true at the same time. Get one letter on its own in one equation, then substitute it into the other.",
  after: ["formulas"],
  unlocks: ["substitute"],
};
