import type { Chapter } from "../puzzles";

export const quadratics: Chapter = {
  id: "quadratics",
  title: "Quadratic equations",
  blurb: "Equations with an x². They usually have two answers: when a product is 0, one of its factors must be.",
  after: ["roots"],
  lesson: [
    {
      title: "When a product is zero",
      text: [
        "If two numbers multiply to 0, one of them must be 0: there's no other way to get 0. So `x(x − 3) = 0` means `x = 0` or `x − 3 = 0`.",
        'Drag one factor away from the product: the equation splits into two, joined by "or". Each one is a small equation to finish.',
      ],
      example: {
        start: "x(x - 3) = 0",
        steps: [
          { say: "Drag the x away from the bracket.", then: "x - 3 = 0 | x = 0" },
          { say: "Finish the first one: carry the 3 across.", then: "x = 3 | x = 0" },
        ],
        after: "Two answers: x = 3 or x = 0. Try both in x(x − 3): each gives 0.",
      },
    },
    {
      title: "Getting to zero",
      text: [
        "To use that, first get 0 on one side and a product on the other. Drop one whole side onto the other to take it away from both, then factor: take out what the terms share.",
      ],
      example: {
        start: "x^2 = 5x",
        steps: [
          { say: "Drop the 5x onto the x²: it's taken away from both sides, leaving 0.", then: "x^2 - 5x = 0" },
          { say: "Tap the ² to write x² as x·x.", then: "x·x - 5x = 0" },
          { say: "Both terms have an x: take it out in front.", then: "x(x - 5) = 0" },
        ],
        after: "Now split it: x = 0 or x = 5.",
      },
      watch: "Don't divide both sides by x! x might be 0, and dividing by it loses that answer.",
    },
    {
      title: "Plus or minus",
      text: [
        "`x² = 9` has two answers: `3² = 9`, but `(−3)² = 9` too. Carry the ² across and the other side becomes its square root, with a + and a −.",
      ],
      example: { start: "x^2 = 9", steps: [{ say: "Carry the ² across the =.", then: "x = 3 | x = -3" }] },
    },
    {
      title: "Brackets squared",
      text: ["The same works on a whole bracket: `(x − 1)² = 4` means `x − 1 = 2` or `x − 1 = −2`. Then finish each one."],
      example: {
        start: "(x - 1)^2 = 4",
        steps: [{ say: "Carry the ² across.", then: "x - 1 = 2 | x - 1 = -2" }],
        after: "So x = 3 or x = −1.",
      },
    },
  ],
  unlocks: ["split-zero", "root-both-sides", "move-side"],
  puzzles: [
    { id: "k1", start: "x^2 = 9", goal: "x = 3 | x = -3", hint: "Carry the ² across the =." },
    { id: "k2", start: "x^2 = 25", goal: "x = 5 | x = -5" },
    { id: "k3", start: "x^2 = 5", goal: "x = √5 | x = -√5" },
    { id: "k4", start: "x(x - 3) = 0", goal: "x = 0 | x = 3", hint: "Drag the x away from the bracket: one of them must be 0." },
    { id: "k5", start: "x^2 - 16 = 0", goal: "x = 4 | x = -4", hint: "Get x² on its own first." },
    { id: "k6", start: "x^2 + 5 = 30", goal: "x = 5 | x = -5" },
    { id: "k7", start: "2x^2 = 18", goal: "x = 3 | x = -3" },
    { id: "k8", start: "x^2/2 = 8", goal: "x = 4 | x = -4" },
    { id: "k9", start: "4x^2 = 36", goal: "x = 3 | x = -3" },
    { id: "k10", start: "(x - 2)(x + 5) = 0", goal: "x = 2 | x = -5" },
    { id: "k11", start: "(x + 1)(x - 4) = 0", goal: "x = -1 | x = 4" },
    { id: "k12", start: "2x^2 - 8 = 0", goal: "x = 2 | x = -2" },
    { id: "k13", start: "x^2 + 9 = 2x^2", goal: "x = 3 | x = -3" },
    { id: "k14", start: "2x(x - 1) = 0", goal: "x = 0 | x = 1" },
    { id: "k15", start: "x^2 - 3x = 0", goal: "x = 0 | x = 3", hint: "Tap the ² to see x·x, then take an x out in front." },
    { id: "k16", start: "x^2 + 2x = 0", goal: "x = 0 | x = -2" },
    { id: "k17", start: "(2x - 1)(x + 3) = 0", goal: "x = 1/2 | x = -3" },
    { id: "k18", start: "x^2 = 4x", goal: "x = 0 | x = 4", hint: "Get everything on one side first: 0 on the other." },
    { id: "k19", start: "x^2 = x", goal: "x = 0 | x = 1" },
    { id: "k20", start: "(x - 1)^2 = 4", goal: "x = 3 | x = -1", hint: "Carry the ² across: the bracket is x − 1 = 2, or −2." },
    { id: "k21", start: "(x + 2)^2 = 9", goal: "x = 1 | x = -5" },
    { id: "k22", start: "x^2 = 6x", goal: "x = 0 | x = 6" },
    { id: "k23", start: "(x - 3)^2 = 16", goal: "x = 7 | x = -1" },
    { id: "k24", start: "(x + 1)^2 - 9 = 0", goal: "x = 2 | x = -4", via: ["(x + 1)^2 = 9", "x + 1 = 3 | x + 1 = -3"] },
    { id: "k25", start: "3x^2 = 12x", goal: "x = 0 | x = 4" },
    { id: "k26", start: "3(x - 1)^2 = 12", goal: "x = 3 | x = -1", via: ["(x - 1)^2 = 4", "x - 1 = 2 | x - 1 = -2"] },
    {
      id: "k27",
      start: "x^3 = 4x",
      goal: "x = 0 | x = 2 | x = -2",
      hint: "Take an x out first. Then x² − 4 = 0 has two answers of its own.",
      via: ["x(x^2 - 4) = 0", "x = 0 | x^2 - 4 = 0"],
    },
    {
      id: "k28",
      start: "x^2 + 2x + 3x + 6 = 0",
      goal: "x = -2 | x = -3",
      hint: "Work in pairs, like in Factoring. Then one bracket must be 0.",
      via: ["x(x + 2) + 3x + 6 = 0", "(x + 2)(x + 3) = 0"],
    },
    { id: "k29", start: "x^2 - 2x + 3x - 6 = 0", goal: "x = 2 | x = -3", via: ["x(x - 2) + 3x - 6 = 0", "(x - 2)(x + 3) = 0"] },
    { id: "k30", start: "2x^2 + 3x = x^2 + 5x", goal: "x = 0 | x = 2", via: ["x^2 - 2x = 0"] },
  ],
};
