import type { Chapter } from "../puzzles";

export const quadratic: Chapter = {
  id: "quadratic",
  title: "Second-degree equations",
  blurb: "An equation with x² can have two answers. Make one side 0 and write the other as a product: a product is 0 only when one of its factors is. Or get the square on its own: x² = 9 means x = 3 or x = −3.",
  after: ["simultaneous"],
  unlocks: ["zero-product"],
  // x² = 9: x may be −3 as well (unlike the chapters where letters stand for positive numbers).
  positive: false,
};
