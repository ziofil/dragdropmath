import type { Chapter } from "../puzzles";

export const shuffle: Chapter = {
  id: "shuffle",
  title: "Rearranging terms",
  blurb: "Terms can be added in any order, and plain numbers can be worked out.",
  after: [],
  lesson: [
    {
      title: "Order doesn't matter",
      text: [
        "The order you add things in doesn't change the total. `2 + x` and `x + 2` are the same.",
        "Each part of a sum is called a term. You can drag terms into any order.",
      ],
      example: {
        start: "2 + x",
        steps: [{ say: "Drag the 2 past the x.", then: "x + 2" }],
      },
    },
    {
      title: "Each term keeps its sign",
      text: ["In `5 − 3 + x` the terms are `5`, `−3` and `x`. The minus belongs to the 3. When the 3 moves, its minus moves with it."],
      example: {
        start: "5 - 3 + x",
        steps: [
          {
            say: "Drag the x to the front. The 3 keeps its minus.",
            then: "x + 5 - 3",
          },
        ],
      },
      watch: "`5 − 3` and `3 − 5` are not the same. When you move the 3, its minus must go with it.",
    },
    {
      title: "Adding numbers",
      text: [
        "Two numbers in the same sum can be added together. Drop one onto the other. The x is a number we don't know yet, so it stays as it is.",
      ],
      example: {
        start: "3 + x + 4",
        steps: [
          {
            say: "Drop the 4 onto the 3.",
            then: "7 + x",
          },
        ],
        after: "3 + 4 = 7. The x stays as it is.",
      },
    },
    {
      title: "Multiplying in any order",
      text: [
        "The order doesn't matter when you multiply either: `2·x·5` is `2·5·x`. So you can multiply the 2 and the 5 to get 10.",
        "We usually write the number first and leave out the dot: `10·x` is written `10x`.",
      ],
      example: {
        start: "2·x·5",
        steps: [{ say: "Drop the 5 onto the 2.", then: "10x" }],
      },
    },
  ],
  unlocks: ["commute", "combine", "multiply-numbers", "numbers-first", "multiply-out"],
};
