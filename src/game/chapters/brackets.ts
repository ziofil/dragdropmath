import type { Chapter } from "../puzzles";

export const brackets: Chapter = {
  id: "brackets",
  title: "Multiplying brackets",
  blurb: "To multiply two brackets, multiply each term in the first bracket by each term in the second.",
  after: ["distribute"],
  lesson: [
    {
      title: "A bracket is one factor",
      text: [
        "In `(x + 1)(x + 2)`, the first bracket multiplies the whole of the second. Treat `(x + 1)` as one factor and expand: it multiplies the `x` and the `2`.",
      ],
      example: {
        start: "(x + 1)(x + 2)",
        steps: [
          {
            say: "Drop the whole (x + 1) onto (x + 2). It multiplies both terms.",
            then: "(x + 1)x + (x + 1)·2",
          },
          {
            say: "Now drop the x onto the (x + 1) next to it.",
            then: "x·x + 1·x + 2(x + 1)",
          },
          { say: "Then drop the 2 onto its (x + 1).", then: "x·x + x + 2x + 2·1" },
        ],
        after: "That gives four terms: x·x, 1·x, 2·x and 2·1. Collect like terms to get x² + 3x + 2.",
      },
    },
    {
      title: "Multiplying two brackets",
      text: [
        "Multiply each term in the first bracket by each term in the second. Two terms times two terms gives four terms. Then collect like terms.",
        "In `(x + 3)(x − 3)` the two middle terms are `+3x` and `−3x`. They cancel, leaving `x² − 9`.",
      ],
    },
    {
      title: "Squaring a bracket",
      text: ["`(x + 1)²` is `(x + 1)(x + 1)`, so it works the same way. Tap the ² to write it out."],
      example: {
        start: "(x + 1)^2",
        steps: [
          {
            say: "Tap the ² to write it as a product.",
            then: "(x + 1)(x + 1)",
          },
        ],
      },
      watch: "`(x + 1)²` is not `x² + 1`. Try x = 2: `(2 + 1)² = 9`, but `2² + 1 = 5`. The difference is the two middle terms, `x + x = 2x`.",
    },
  ],
  unlocks: ["power-to-product"],
};
