import type { Chapter } from "../puzzles";

export const factor: Chapter = {
  id: "factor",
  title: "Factoring",
  blurb: "Factoring is expanding in reverse. Find a factor that every term has, and take it out in front of brackets.",
  after: ["brackets"],
  lesson: [
    {
      title: "Expanding in reverse",
      text: [
        "Factoring undoes expanding. `x² + 3x` is `x·x + 3·x`. Both terms have an `x`, so you can take it out in front: `x(x + 3)`.",
      ],
      example: {
        start: "x^2 + 3x",
        steps: [
          { say: "Tap the ² to write x² in full.", then: "x·x + 3x" },
          {
            say: "Both terms have an x now. Drag one x out in front, past the left end.",
            then: "x(x + 3)",
          },
        ],
        after: "To check, expand x(x + 3). You get x² + 3x again.",
      },
    },
    {
      title: "Splitting numbers",
      text: ["To find a common factor, split numbers into factors. In `2x + 6`, tap the 6 to get `2·3`. Now both terms have a 2."],
      example: {
        start: "2x + 6",
        steps: [
          { say: "Tap the 6 to split it.", then: "2x + 2·3" },
          { say: "Drag a 2 out in front.", then: "2(x + 3)" },
        ],
      },
    },
    {
      title: "Taking out a bracket",
      text: [
        "In `x(x + 2) + 3(x + 2)`, both terms have the same bracket `(x + 2)`. It is a common factor, so you can take it out like any other.",
      ],
      example: {
        start: "x(x + 2) + 3(x + 2)",
        steps: [{ say: "Drag the (x + 2) out in front.", then: "(x + 2)(x + 3)" }],
      },
    },
    {
      title: "Four terms: work in pairs",
      text: [
        "With four terms, factor the first two, then the last two. If the two brackets match, take that bracket out as well.",
      ],
      watch: "Always check a factoring by multiplying it back out. It should give exactly what you started with.",
    },
  ],
  unlocks: ["split-number", "factor-shared"],
};
