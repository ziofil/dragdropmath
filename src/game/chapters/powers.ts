import type { Chapter } from "../puzzles";

export const powers: Chapter = {
  id: "powers",
  title: "Powers",
  blurb: "x³ means x·x·x. Count the x's and you can work out the rules for powers.",
  after: ["brackets"],
  lesson: [
    {
      title: "Multiplying powers",
      text: [
        "`x³` means `x·x·x`. The small number is the exponent. It tells you how many x's are multiplied.",
        "So `x²·x³` is two x's times three x's: five x's in all. When you multiply powers of the same base, you add the exponents.",
      ],
      example: {
        start: "x^2·x^3",
        steps: [
          {
            say: "Same base: drop one power onto the other.",
            then: "x^(2 + 3)",
          },
          { say: "Work it out.", then: "x^5" },
        ],
      },
    },
    {
      title: "A power of a power",
      text: ["`(x²)³` is `x²·x²·x²`. That's 2 + 2 + 2 = 6 x's, so you multiply the exponents."],
      example: {
        start: "(x^2)^3",
        steps: [
          { say: "Drop the outer 3 onto the inner 2.", then: "x^(2·3)" },
          { say: "Work it out.", then: "x^6" },
        ],
      },
    },
    {
      title: "Dividing powers",
      text: ["`x⁵/x²` has five x's on top and two on the bottom. Two x's cancel from each, leaving three x's on top. When you divide, you subtract the exponents."],
      example: {
        start: "x^5/x^2",
        steps: [
          { say: "Drop the x² onto the x⁵.", then: "x^(5 - 2)" },
          { say: "Work it out.", then: "x^3" },
        ],
      },
    },
    {
      title: "Zero and negative powers",
      text: [
        "`x³/x³` is 1, and it's also `x^(3 − 3) = x⁰`. So anything to the power 0 is 1.",
        "If there are more x's on the bottom than on top, the exponent goes below zero: `x⁻²` means `1/x²`. Moving a power across the fraction bar changes the sign of its exponent.",
      ],
      example: {
        start: "1/x^3",
        steps: [{ say: "Drag the x³ up across the bar.", then: "x^-3" }],
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
    { id: "w6", start: "1/x^3", goal: "x^-3", hint: "Drag the x³ up across the fraction bar." },
    {
      id: "w1",
      start: "x^2·x^3",
      goal: "x^5",
      hint: "Same base: drop one power onto the other, then add up the exponents.",
    },
    { id: "w11", start: "x·x^4", goal: "x^5", hint: "x on its own is x¹." },
    { id: "w4", start: "x^5/x^2", goal: "x^3" },
    { id: "w18", start: "y^7/y^3", goal: "y^4" },
    {
      id: "w2",
      start: "(x^2)^3",
      goal: "x^6",
      hint: "Drop the outer 3 onto the inner 2, then multiply.",
    },
    { id: "w19", start: "(a^3)^4", goal: "a^12" },
    { id: "w8", start: "x^0 + 4", goal: "5" },
    { id: "w5", start: "x^3/x^5", goal: "x^-2", hint: "The answer has a negative exponent." },
    { id: "w7", start: "x^-2·x^5", goal: "x^3" },
    {
      id: "w3",
      start: "(2x)^3",
      goal: "8x^3",
      hint: "Pull the 2 out of the brackets. It is cubed too.",
    },
    { id: "w20", start: "(3y)^2", goal: "9y^2" },
    { id: "w15", start: "x^2·x^-2", goal: "1" },
    { id: "w12", start: "(x^3)^2·x", goal: "x^7" },
    { id: "w13", start: "3x^2·2x^3", goal: "6x^5" },
    { id: "w14", start: "(2x^2)^3", goal: "8x^6" },
    { id: "w21", start: "x(x^2 + 3)", goal: "x^3 + 3x", hint: "Multiply out the brackets first: x times x² is x³." },
    { id: "w16", start: "(x^4·x^2)/x^3", goal: "x^3" },
    { id: "w17", start: "(x^3·y^2)/(x·y)", goal: "x^2·y" },
    { id: "w9", start: "(x^2·y)^3/y", goal: "x^6·y^2" },
    { id: "w22", start: "x^3(x^2 - 1) + x^3", goal: "x^5" },
    { id: "w23", start: "(3x^2)^2 - 4x^4", goal: "5x^4" },
    { id: "w26", start: "3x^2(x^3 - 2) + 6x^2", goal: "3x^5" },
    { id: "w24", start: "2x(x^2 + 1) - x^3", goal: "x^3 + 2x" },
    { id: "w25", start: "x^-1·(x^3 + x)", goal: "x^2 + 1", hint: "Multiply each term by x⁻¹. x⁻¹ times x is x⁰." },
    { id: "w27", start: "(x^2 + x)(x - 1)", goal: "x^3 - x" },
    { id: "w28", start: "(a^2 + b)(a^2 - b)", goal: "a^4 - b^2", via: ["a^4 - a^2*b + b*(a^2 - b)"] },
    { id: "w29", start: "(2x^2)^2 + x(x^3 - 1)", goal: "5x^4 - x" },
    { id: "w30", start: "(x^2 + 3)^2", goal: "x^4 + 6x^2 + 9", hint: "Write it as (x² + 3)(x² + 3), then multiply each term by each term." },
  ],
};
