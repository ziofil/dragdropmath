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
  puzzles: [
    {
      id: "s1",
      start: "2 + x",
      goal: "x + 2",
      hint: "Drag the 2 past the x.",
    },
    {
      id: "s2",
      start: "3 + x + 4",
      goal: "x + 7",
      hint: "Drop the 4 onto the 3.",
    },
    { id: "s7", start: "y + 5 - 2", goal: "y + 3" },
    {
      id: "s3",
      start: "2·x·5",
      goal: "10x",
      hint: "Drop one number onto the other.",
    },
    {
      id: "s8",
      start: "10 - x - 4",
      goal: "6 - x",
      hint: "The 4 keeps its minus.",
    },
    { id: "s9", start: "2·a·3·b", goal: "6ab" },
    { id: "s14", start: "10 - 2·3·y", goal: "10 - 6y" },
    { id: "s5", start: "1 + 2y + 3", goal: "2y + 4" },
    { id: "s15", start: "7 - 2 + a", goal: "a + 5" },
    { id: "s16", start: "2 + 3·b·3", goal: "9b + 2" },
    { id: "s4", start: "4 + x + 1 + 2", goal: "x + 7" },
    {
      id: "s17",
      start: "2 - 7 + x",
      goal: "x - 5",
      hint: "2 − 7 is less than zero.",
    },
    { id: "s18", start: "3·x·2·y + 5 - 1", goal: "6xy + 4" },
    { id: "s10", start: "5 + a + 2 + b", goal: "a + b + 7" },
    { id: "s6", start: "3·y·2 + 1 + x", goal: "x + 6y + 1" },
    { id: "s11", start: "x + 1 + y + 2 + 3", goal: "x + y + 6" },
    { id: "s19", start: "4 + 2·a·5 - 3 + b", goal: "10a + b + 1" },
    { id: "s12", start: "2·x·3 + 4 - 1 + y", goal: "6x + y + 3" },
    { id: "s20", start: "5 - 2·3 + a·2·4 + 3", goal: "8a + 2" },
    { id: "s13", start: "4·y·5 - 7 + x + 2", goal: "x + 20y - 5" },
    { id: "s21", start: "2·a·3·b·2 + 5 - 3 + 4·c", goal: "12ab + 4c + 2" },
    { id: "s22", start: "4 + b·3·2 + a - 1", goal: "a + 6b + 3" },
    { id: "s23", start: "9 - 2·a·4 + 3·b·5 - 2", goal: "15b - 8a + 7" },
    {
      id: "s24",
      start: "4 - 6c + 5b + a·2·2",
      goal: "4a + 5b - 6c + 4",
      hint: "Put the a-term first and the plain number last.",
    },
    { id: "s25", start: "2·4 - z + y·3 + x·3·3", goal: "9x + 3y - z + 8" },
    { id: "s27", start: "2·3 - c + 2·b·4 + 3a", goal: "3a + 8b - c + 6" },
    { id: "s26", start: "2·5 - z + 3·y·3 + x·2·2", goal: "4x + 9y - z + 10" },
    { id: "s28", start: "4·2 + z·3·2 - y + 2·x·3", goal: "6x - y + 6z + 8" },
    { id: "s29", start: "3·4 + c·2·2 - b + 2·a·3", goal: "6a - b + 4c + 12" },
    { id: "s30", start: "2·2 - z·3·3 + y + 2·x·5", goal: "10x + y - 9z + 4" },
  ],
};
