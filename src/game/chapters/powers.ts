import type { Chapter } from "../puzzles";

export const powers: Chapter = {
  id: "powers",
  title: "Powers",
  blurb: "x³ is just x·x·x. Count the x's and the rules for exponents write themselves.",
  after: ["brackets"],
  lesson: [
    {
      title: "Counting factors",
      text: [
        "`x³` is `x·x·x`: the small number, the exponent, counts how many x's are multiplied.",
        "So `x²·x³` is two x's, then three more: five in all. When you multiply powers of the same thing, the exponents add.",
      ],
      example: {
        start: "x^2·x^3",
        steps: [
          {
            say: "Same base: drop one power onto the other.",
            then: "x^(2 + 3)",
          },
          { say: "Now count them up.", then: "x^5" },
        ],
      },
    },
    {
      title: "A power of a power",
      text: ["`(x²)³` is three lots of `x²` multiplied together: 2 + 2 + 2 = 6 x's. The exponents multiply."],
      example: {
        start: "(x^2)^3",
        steps: [
          { say: "Drop the outer 3 onto the inner 2.", then: "x^(2·3)" },
          { say: "Work it out.", then: "x^6" },
        ],
      },
    },
    {
      title: "Dividing cancels",
      text: ["`x⁵/x²` has five x's on top and two below. Two pairs cancel and three x's are left: the exponents subtract."],
      example: {
        start: "x^5/x^2",
        steps: [
          { say: "Drop the x² onto the x⁵.", then: "x^(5 - 2)" },
          { say: "Work it out.", then: "x^3" },
        ],
      },
    },
    {
      title: "Zero and below",
      text: [
        "`x³/x³` is 1, and it's also `x^(3 − 3) = x⁰`. So anything to the power 0 is 1.",
        "Cancel more x's than you have and the count goes below zero: `x⁻²` means `1/x²`. Carrying a power across the fraction bar flips the sign of its exponent.",
      ],
      example: {
        start: "1/x^3",
        steps: [{ say: "Carry the x³ up across the bar.", then: "x^-3" }],
      },
      watch: "`2x³` is `2·x·x·x`: the power belongs to the x only. `(2x)³` is different: it's `8x³`.",
    },
  ],
  unlocks: [
    "power-of-power",
    "zero-power",
    "evaluate-power",
    "divide-powers",
    "flip-across-bar",
    "power-one",
    "pull-out-of-power",
    "power-of-product",
  ],
  puzzles: [
    { id: "w10", start: "2^3", goal: "8" },
    {
      id: "w1",
      start: "x^2·x^3",
      goal: "x^5",
      hint: "Same base: drop one power onto the other, then add up the exponents.",
    },
    {
      id: "w2",
      start: "(x^2)^3",
      goal: "x^6",
      hint: "Drop the outer 3 onto the inner 2, then multiply.",
    },
    {
      id: "w3",
      start: "(2x)^3",
      goal: "8x^3",
      hint: "Pull the 2 out of the brackets — it takes its own ³.",
    },
    { id: "w4", start: "x^5/x^2", goal: "x^3" },
    {
      id: "w5",
      start: "x^3/x^5",
      goal: "x^-2",
      hint: "Exponents can go below zero.",
    },
    {
      id: "w6",
      start: "1/x^3",
      goal: "x^-3",
      hint: "Carry the x³ up across the fraction bar.",
    },
    { id: "w7", start: "x^-2·x^5", goal: "x^3" },
    { id: "w8", start: "x^0 + 4", goal: "5" },
    { id: "w11", start: "x·x^4", goal: "x^5", hint: "x on its own is x¹." },
    { id: "w12", start: "(x^3)^2·x", goal: "x^7" },
    { id: "w13", start: "3x^2·2x^3", goal: "6x^5" },
    { id: "w14", start: "(2x^2)^3", goal: "8x^6" },
    { id: "w15", start: "x^2·x^-2", goal: "1" },
    { id: "w16", start: "(x^4·x^2)/x^3", goal: "x^3" },
    { id: "w9", start: "(x^2·y)^3/y", goal: "x^6·y^2" },
    { id: "w17", start: "(x^3·y^2)/(x·y)", goal: "x^2·y" },
  ],
};
