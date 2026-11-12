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
  puzzles: [
    {
      id: "g5",
      start: "x(x + 2) + 3(x + 2)",
      goal: "(x + 2)(x + 3)",
      hint: "Both terms have the same bracket. Take it out in front.",
    },
    { id: "g10", start: "x(x + 1) - 2(x + 1)", goal: "(x + 1)(x - 2)" },
    { id: "g11", start: "ab + ac + ad", goal: "a(b + c + d)" },
    { id: "g18", start: "3x + 3y", goal: "3(x + y)" },
    {
      id: "g1",
      start: "x^2 + 3x",
      goal: "x(x + 3)",
      hint: "Tap the ² to write x² as x·x. Then both terms have an x.",
    },
    {
      id: "g2",
      start: "2x + 6",
      goal: "2(x + 3)",
      hint: "Tap the 6 to split it into factors.",
    },
    { id: "g3", start: "x^2 + xy", goal: "x(x + y)" },
    { id: "g12", start: "5x + 10", goal: "5(x + 2)" },
    { id: "g13", start: "4x - 8", goal: "4(x - 2)" },
    { id: "g14", start: "x^2 - 5x", goal: "x(x - 5)" },
    { id: "g20", start: "x^3 + x^2", goal: "x^2(x + 1)" },
    {
      id: "g15",
      start: "6x + 9",
      goal: "3(2x + 3)",
      hint: "Which number divides both 6 and 9?",
    },
    {
      id: "g21",
      start: "(x + 1)^2 + 2(x + 1)",
      goal: "(x + 1)(x + 3)",
      hint: "Write the square as a product. Then both terms have an (x + 1).",
    },
    {
      id: "g22",
      start: "x(x + 3) + 2x + 6",
      goal: "(x + 3)(x + 2)",
      hint: "Factor 2x + 6. Does it give an (x + 3)?",
    },
    { id: "g23", start: "x(x - 2) + 5x - 10", goal: "(x - 2)(x + 5)" },
    { id: "g4", start: "3x^2 + 6x", goal: "3x(x + 2)" },
    { id: "g16", start: "2x^2 + 4x", goal: "2x(x + 2)" },
    { id: "g17", start: "x^2 + 4x + x + 4", goal: "(x + 4)(x + 1)" },
    { id: "g24", start: "ab + 2a + 3b + 6", goal: "(b + 2)(a + 3)" },
    {
      id: "g6",
      start: "x^2 + 2x + 3x + 6",
      goal: "(x + 2)(x + 3)",
      hint: "Work in pairs: drop an x from x² onto 2x, then a 3 onto the 6.",
    },
    { id: "g7", start: "x^2 - 3x + 2x - 6", goal: "(x - 3)(x + 2)" },
    { id: "g9", start: "x^2 - xy + xy - y^2", goal: "(x - y)(x + y)" },
    { id: "g25", start: "2x^2 + 6x - x - 3", goal: "(x + 3)(2x - 1)" },
    { id: "g8", start: "x^2 + xy + xy + y^2", goal: "(x + y)^2" },
    { id: "g26", start: "x^3 - 3x^2 + 2x - 6", goal: "(x - 3)(x^2 + 2)" },
    { id: "g19", start: "2x^2 - 4x + 3x - 6", goal: "(x - 2)(2x + 3)" },
    { id: "g27", start: "2x^3 + 4x^2 + 3x + 6", goal: "(x + 2)(2x^2 + 3)" },
    { id: "g28", start: "6x^2 + 3x + 4x + 2", goal: "(2x + 1)(3x + 2)" },
    {
      id: "g29",
      start: "2x^2 + 6x + 4x + 12",
      goal: "2(x + 3)(x + 2)",
      hint: "All four terms have a factor of 2. Take it out first, then factor the rest in pairs.",
    },
    { id: "g30", start: "6x^2 + 4x + 9x + 6", goal: "(3x + 2)(2x + 3)" },
  ],
};
