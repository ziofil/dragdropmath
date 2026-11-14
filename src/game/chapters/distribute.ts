import type { Chapter } from "../puzzles";

export const distribute: Chapter = {
  id: "distribute",
  title: "The distributive law",
  blurb: "A number outside brackets multiplies every term inside. A factor that every term shares can be taken back out.",
  after: ["collect"],
  unlocks: ["distribute", "distribute-neg", "factor-out", "merge-powers"],
};
