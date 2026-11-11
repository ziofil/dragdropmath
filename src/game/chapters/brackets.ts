import type { Chapter } from "../puzzles";

export const brackets: Chapter = {
  id: "brackets",
  title: "Multiplying brackets",
  blurb: "When two brackets multiply, every term in one meets every term in the other. Count the meetings and nothing gets lost.",
  after: ["distribute"],
  lesson: [
    {
      title: "A whole bracket is one factor",
      text: [
        "In `(x + 1)(x + 2)`, the whole first bracket multiplies the whole second one. Treat `(x + 1)` as a single factor and distribute it: it visits the `x` and it visits the `2`.",
      ],
      example: {
        start: "(x + 1)(x + 2)",
        steps: [
          {
            say: "Drop the whole (x + 1) onto (x + 2). It splits and visits both terms.",
            then: "(x + 1)x + (x + 1)·2",
          },
          {
            say: "Now drop the x onto the (x + 1) next to it.",
            then: "x·x + 1·x + (x + 1)·2",
          },
          { say: "And the 2 onto its (x + 1).", then: "x·x + x + 2x + 2·1" },
        ],
        after: "Four meetings: x·x, 1·x, 2·x, 2·1. Tidy them up and it's x² + 3x + 2.",
      },
    },
    {
      title: "Count the meetings",
      text: [
        "Every term of one bracket meets every term of the other. Two terms times two terms makes four meetings. Then like terms tidy it up.",
        "In `(x + 3)(x − 3)` the two middle meetings are `+3x` and `−3x`. They cancel, leaving `x² − 9`.",
      ],
    },
    {
      title: "Squares are products too",
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
      watch: "`(x + 1)²` is not `x² + 1`. Try x = 2: `(2 + 1)² = 9`, but `2² + 1 = 5`. The middle meetings make up the difference.",
    },
  ],
  unlocks: ["power-to-product"],
  puzzles: [
    {
      id: "m1",
      start: "x(x + 3)",
      goal: "x^2 + 3x",
      hint: "Drop the x onto the brackets. What is x·x called?",
    },
    { id: "m16", start: "y(y + 2)", goal: "y^2 + 2y" },
    {
      id: "m2",
      start: "(x + 1)(x + 2)",
      goal: "x^2 + 3x + 2",
      hint: "Drop one whole bracket onto the other: it multiplies each term inside. Then do each piece.",
    },
    { id: "m11", start: "(x + 5)(x + 1)", goal: "x^2 + 6x + 5" },
    { id: "m17", start: "(2x + 3)(x + 1)", goal: "2x^2 + 5x + 3" },
    {
      id: "m18",
      start: "(x + 1)(x^2 + 1)",
      goal: "x^3 + x^2 + x + 1",
      hint: "x·x² is three x's multiplied together: x³.",
    },
    { id: "m3", start: "(x + 4)(x - 1)", goal: "x^2 + 3x - 4" },
    { id: "m19", start: "(2a + 1)(a - 2)", goal: "2a^2 - 3a - 2" },
    { id: "m4", start: "(2x + 1)(x + 3)", goal: "2x^2 + 7x + 3" },
    { id: "m12", start: "(3x + 2)(x - 1)", goal: "3x^2 - x - 2" },
    { id: "m13", start: "(x + 1)(x - 1) + 1", goal: "x^2" },
    { id: "m20", start: "(a + 1)(a + 2) - a^2", goal: "3a + 2" },
    { id: "m21", start: "(a + 2)(a + 3)", goal: "a^2 + 5a + 6" },
    { id: "m22", start: "(p + 2)(p - 3)", goal: "p^2 - p - 6" },
    {
      id: "m5",
      start: "(x + 3)(x - 3)",
      goal: "x^2 - 9",
      hint: "Keep an eye on the two middle terms.",
    },
    { id: "m23", start: "(x - 5)(x + 5)", goal: "x^2 - 25" },
    { id: "m6", start: "(x + y)(x - y)", goal: "x^2 - y^2" },
    { id: "m24", start: "(a + 3)(a - 1) - 2a", goal: "a^2 - 3" },
    {
      id: "m25",
      start: "2(x + 1)(x + 2)",
      goal: "2x^2 + 6x + 4",
      hint: "Three factors: multiply two of them out first, then bring in the third.",
    },
    { id: "m10", start: "(x + 1)^2 - x^2", goal: "2x + 1" },
    { id: "m15", start: "x^2 - (x + 1)(x - 1)", goal: "1" },
    { id: "m14", start: "(x - 2)(x - 4)", goal: "x^2 - 6x + 8" },
    {
      id: "m7",
      start: "(x + 2)^2",
      goal: "x^2 + 4x + 4",
      hint: "Tap the ²: a square is something times itself.",
    },
    { id: "m26", start: "(2x + 1)^2", goal: "4x^2 + 4x + 1" },
    {
      id: "m9",
      start: "(a + b)^2",
      goal: "a^2 + 2ab + b^2",
      hint: "Is it just a² + b²? Count every meeting.",
    },
    { id: "m27", start: "x(x + 1)(x - 1)", goal: "x^3 - x" },
    { id: "m8", start: "(x - 3)^2", goal: "x^2 - 6x + 9" },
    { id: "m28", start: "(x + y)^2 - 2xy", goal: "x^2 + y^2" },
    { id: "m29", start: "(x - y)^2", goal: "x^2 - 2xy + y^2" },
    { id: "m30", start: "(x - 2)^2 + 4x", goal: "x^2 + 4" },
  ],
};
