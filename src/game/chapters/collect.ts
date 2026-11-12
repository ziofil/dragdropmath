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
  puzzles: [
    { id: "c1", start: "3x + 2x", goal: "5x" },
    { id: "c2", start: "x + 4 + x", goal: "2x + 4" },
    { id: "c3", start: "5y - 2y + 3", goal: "3y + 3" },
    {
      id: "c4",
      start: "a + b - a",
      goal: "b",
      hint: "Anything minus itself is 0.",
    },
    {
      id: "c17",
      start: "3ab + 2ab",
      goal: "5ab",
      hint: "Treat ab like a single letter: 3ab + 2ab works like 3x + 2x.",
    },
    { id: "c18", start: "xy + 3 + 2xy", goal: "3xy + 3" },
    {
      id: "c9",
      start: "2·x·3 + x",
      goal: "7x",
      hint: "Work out 2·3 first. Then add the x-terms.",
    },
    { id: "c19", start: "x + y - x + 2y", goal: "3y" },
    { id: "c5", start: "2x + 3 + 4x - 1", goal: "6x + 2" },
    { id: "c10", start: "3x + 2 + x + 5", goal: "4x + 7" },
    { id: "c11", start: "5a - 2a + a", goal: "4a" },
    { id: "c6", start: "2x + 3y + x + y", goal: "3x + 4y", hint: "Add the x-terms, then the y-terms." },
    { id: "c7", start: "4x - y + 2y - 3x", goal: "x + y" },
    { id: "c8", start: "3a + 2b - a + 5 - 2b", goal: "2a + 5" },
    { id: "c12", start: "4·x·2 - 3x + y·2 + y", goal: "5x + 3y" },
    { id: "c13", start: "a - 3b + 2a + 4b - a", goal: "2a + b" },
    { id: "c16", start: "3·x + 2·y·3 - x - 4y + 1", goal: "2x + 2y + 1" },
    { id: "c21", start: "5x - 3 + 2y - 4x + 3", goal: "x + 2y" },
    { id: "c20", start: "y·2·2 - y + 6 - 2·3", goal: "3y" },
    { id: "c14", start: "x + y + x + y + x", goal: "3x + 2y" },
    { id: "c15", start: "6y - 2 + y - 3y + 5", goal: "4y + 3" },
    { id: "c22", start: "2 + 3a + 2·b·3 - a - 2b", goal: "2a + 4b + 2" },
    { id: "c23", start: "3·2 + y - 2·x·2 + 5x", goal: "x + y + 6" },
    { id: "c24", start: "4·2 - y + 3x + 2y - x", goal: "2x + y + 8" },
    {
      id: "c27",
      start: "5 - c + 3b - b + a",
      goal: "a + 2b - c + 5",
      hint: "Collect the b's, then put the letters in order, with the plain number last.",
    },
    { id: "c25", start: "2ab + 3a - ab + 2b - a", goal: "ab + 2a + 2b" },
    { id: "c26", start: "-3y + 5x + 4y - 5x", goal: "y" },
    { id: "c28", start: "3xy - 2x - 2xy + 5x", goal: "xy + 3x" },
    { id: "c29", start: "a + 2b - 3c + 4a + 5c", goal: "5a + 2b + 2c" },
    { id: "c30", start: "x^2 + 3x - 2x^2 + 4x^2 - 5", goal: "3x^2 + 3x - 5" },
  ],
};
