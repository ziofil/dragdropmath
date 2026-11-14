import type { Chapter } from "../puzzles";

export const roots: Chapter = {
  id: "roots",
  title: "Roots",
  blurb: "√x is x to the power ½, so the rules for powers work for roots too.",
  after: ["powers", "fractions"],
  lesson: [
    {
      title: "Square roots",
      text: ["`√9` is the number that gives 9 when multiplied by itself. It's 3, since `3·3 = 9`."],
      example: {
        start: "√9",
        steps: [{ say: "Tap the 9 to split it into equal factors.", then: "√(3·3)" }],
        after: "Then pull one 3 out of the root. Once you've seen how it works, you can tap a root like √9 to work it out in one step.",
      },
    },
    {
      title: "A root is a power",
      text: [
        "`√x` is `x` to the power `½`. So `√x·√x = x^(1/2 + 1/2) = x`. All the rules for powers work for roots too.",
      ],
      example: {
        start: "x^(1/2)",
        steps: [{ say: "Tap it: a power of ½ is a square root.", then: "√x" }],
      },
    },
    {
      title: "The root of a product",
      text: ["The root of a product is the product of the roots: `√(4x) = √4·√x = 2√x`."],
      example: {
        start: "√(4x)",
        steps: [
          {
            say: "Pull the 4 out of the root. It gets its own √.",
            then: "√4·√x",
          },
        ],
        after: "And √4 is 2, so it's 2√x.",
      },
      watch: "A root does not split over a sum: `√(9 + 16)` is `√25 = 5`, not `3 + 4`.",
    },
    {
      title: "Undoing a root",
      text: [
        "To solve `√x = 3`, square both sides. Tap the root to write it as `x^(1/2)`. Then drag the ½ across the =. On the other side it becomes a square.",
      ],
      example: {
        start: "√x = 3",
        steps: [
          { say: "Tap the root to write it as a power.", then: "x^(1/2) = 3" },
          { say: "Drag the ½ across the =. It becomes a square.", then: "x = 3^2" },
          { say: "Work it out.", then: "x = 9" },
        ],
      },
    },
  ],
  unlocks: ["root-notation", "split-square", "root-across", "evaluate-root"],
};
