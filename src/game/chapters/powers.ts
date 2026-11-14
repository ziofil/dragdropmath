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
    "tap-power",
    "divide-powers",
    "flip-across-bar",
    "power-one",
    "pull-out-of-power",
    "power-of-product",
  ],
};
