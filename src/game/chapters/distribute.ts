import type { Chapter } from "../puzzles";

export const distribute: Chapter = {
  id: "distribute",
  title: "The distributive law",
  blurb: "A number outside brackets multiplies every term inside.",
  after: ["collect"],
  unlocks: ["distribute", "distribute-neg", "merge-powers"],
};
