import type { Chapter } from "../puzzles";

export const factor: Chapter = {
  id: "factor",
  title: "Factoring",
  blurb: "Factoring is multiplying run backwards: find what the terms share, and take it out in front of brackets.",
  after: ["brackets"],
  lesson: [
    {
      title: "Multiplying, run backwards",
      text: [
        "Factoring undoes multiplying out. `x² + 3x` is `x·x + 3·x`. Both terms have an `x`, so it can come out in front: `x(x + 3)`.",
      ],
      example: {
        start: "x^2 + 3x",
        steps: [
          { say: "Tap the ² to write x² in full.", then: "x·x + 3x" },
          {
            say: "Both terms have an x now. Carry one x out in front, past the left end.",
            then: "x(x + 3)",
          },
        ],
        after: "Check it: multiply x(x + 3) back out and you're back where you started.",
      },
    },
    {
      title: "Look inside numbers",
      text: ["To see what terms share, split numbers into factors. In `2x + 6`, tap the 6 to see `2·3`. Now both terms have a 2."],
      example: {
        start: "2x + 6",
        steps: [
          { say: "Tap the 6 to split it.", then: "2x + 2·3" },
          { say: "Carry a 2 out in front.", then: "2(x + 3)" },
        ],
      },
    },
    {
      title: "A whole bracket can be shared",
      text: [
        "In `x(x + 2) + 3(x + 2)`, both terms have the same bracket `(x + 2)`. It's one shared factor, so it comes out like any other.",
      ],
      example: {
        start: "x(x + 2) + 3(x + 2)",
        steps: [{ say: "Carry the (x + 2) out in front.", then: "(x + 2)(x + 3)" }],
      },
    },
    {
      title: "Four terms: work in pairs",
      text: [
        "With four terms, take something out of the first two, then out of the last two. If the brackets match, that whole bracket is shared and comes out too.",
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
      hint: "Both terms share a whole bracket. Take it out in front.",
    },
    { id: "g10", start: "x(x + 1) - 2(x + 1)", goal: "(x + 1)(x - 2)" },
    { id: "g11", start: "ab + ac + ad", goal: "a(b + c + d)" },
    {
      id: "g1",
      start: "x^2 + 3x",
      goal: "x(x + 3)",
      hint: "x² is x·x — tap the ². Now both terms have an x to take out.",
    },
    {
      id: "g2",
      start: "2x + 6",
      goal: "2(x + 3)",
      hint: "Tap the 6: what is it made of?",
    },
    { id: "g3", start: "x^2 + xy", goal: "x(x + y)" },
    { id: "g12", start: "5x + 10", goal: "5(x + 2)" },
    { id: "g13", start: "4x - 8", goal: "4(x - 2)" },
    { id: "g14", start: "x^2 - 5x", goal: "x(x - 5)" },
    {
      id: "g15",
      start: "6x + 9",
      goal: "3(2x + 3)",
      hint: "What do 6 and 9 have in common?",
    },
    { id: "g4", start: "3x^2 + 6x", goal: "3x(x + 2)" },
    { id: "g16", start: "2x^2 + 4x", goal: "2x(x + 2)" },
    { id: "g17", start: "x^2 + 4x + x + 4", goal: "(x + 4)(x + 1)" },
    {
      id: "g6",
      start: "x^2 + 2x + 3x + 6",
      goal: "(x + 2)(x + 3)",
      hint: "Work in pairs: drop an x from x² onto 2x, then a 3 onto the 6.",
    },
    { id: "g7", start: "x^2 - 3x + 2x - 6", goal: "(x - 3)(x + 2)" },
    { id: "g9", start: "x^2 - xy + xy - y^2", goal: "(x - y)(x + y)" },
    { id: "g8", start: "x^2 + xy + xy + y^2", goal: "(x + y)^2" },
  ],
};
