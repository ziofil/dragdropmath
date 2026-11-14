import type { Chapter } from "../puzzles";

export const collect: Chapter = {
  id: "collect",
  title: "Like terms",
  blurb: "Terms with the same letters can be added together: 3x + 2x = 5x. A term minus itself is 0.",
  after: ["shuffle"],
  lesson: [
    {
      title: "What 3x means",
      text: ["`3x` means `x + x + x`. So `3x + 2x` is three x's plus two x's, which is `5x`."],
      example: {
        start: "3x + 2x",
        steps: [{ say: "Drop the 2x onto the 3x.", then: "5x" }],
      },
    },
    {
      title: "Only like terms add together",
      text: [
        "Like terms have exactly the same letters. Only like terms can be added together. `3x + 2` can't become `5x`, because the `2` has no x. Plain numbers only add to plain numbers.",
      ],
      example: {
        start: "x + 4 + x",
        steps: [
          {
            say: "The two x's are like terms. Drop the second x onto the first.",
            then: "2x + 4",
          },
        ],
        after: "The 4 has no x, so it stays as it is.",
      },
    },
    {
      title: "Different letters don't add",
      text: [
        "`x` and `y` can stand for different numbers, so `2x + 3y` can't be simplified. But in `2x + 3y + x`, the two x-terms can be added.",
      ],
      example: {
        start: "2x + 3y + x",
        steps: [
          {
            say: "Drop the x onto the 2x. The 3y stays as it is.",
            then: "3x + 3y",
          },
        ],
        after: "x-terms and y-terms stay separate.",
      },
    },
    {
      title: "Subtracting",
      text: ["Subtracting works the same way: `5y − 2y` is `3y`. Anything minus itself is 0, so `a + b − a` is just `b`."],
      example: {
        start: "a + b - a",
        steps: [{ say: "Drop the −a onto the a. They cancel.", then: "b" }],
      },
      watch: "`x + x` is `2x`, not `x²`. `x²` means `x·x`, which comes later.",
    },
  ],
  unlocks: [],
};
