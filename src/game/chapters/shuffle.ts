import type { Chapter } from "../puzzles";

export const shuffle: Chapter = {
  id: "shuffle",
  title: "Rearranging terms",
  blurb: "Terms can be added in any order, and numbers next to each other can be worked out.",
  after: [],
  lesson: [
    {
      title: "Order doesn't matter",
      text: [
        "A sum is a pile of things added together, and the order you add them in doesn't change the total. `2 + x` and `x + 2` are the same amount.",
        "Every piece of a sum is called a term. You can slide terms past each other as much as you like.",
      ],
      example: {
        start: "2 + x",
        steps: [{ say: "Grab the 2 and slide it past the x.", then: "x + 2" }],
      },
    },
    {
      title: "Each term owns its sign",
      text: ["In `5 − 3 + x` the terms are `5`, `−3` and `x`. The minus belongs to the 3: wherever the 3 goes, its minus goes with it."],
      example: {
        start: "5 - 3 + x",
        steps: [
          {
            say: "Slide the x all the way to the front. The −3 keeps its minus.",
            then: "x + 5 - 3",
          },
        ],
      },
      watch: "`5 − 3` and `3 − 5` are not the same. You can move the 3, but never leave its minus behind.",
    },
    {
      title: "Numbers can be worked out",
      text: [
        "Two plain numbers in the same sum can become one. Drop one on the other and they add up. The x is an amount we don't know yet, so it stays as it is.",
      ],
      example: {
        start: "3 + x + 4",
        steps: [
          {
            say: "Drop the 4 onto the 3: two numbers become one.",
            then: "7 + x",
          },
        ],
        after: "The x never moved. Only the numbers were worked out.",
      },
    },
    {
      title: "Products work the same way",
      text: [
        "In a product, the order of the factors doesn't matter either: `2·x·5` is `2·5·x`. So the 2 and the 5 can meet and become 10.",
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
      hint: "Grab the 2 and slide it past the x.",
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
      hint: "Numbers that multiply can be dropped on each other.",
    },
    {
      id: "s8",
      start: "10 - x - 4",
      goal: "6 - x",
      hint: "The 4 takes its minus with it.",
    },
    { id: "s9", start: "2·a·3·b", goal: "6ab" },
    { id: "s5", start: "1 + 2y + 3", goal: "2y + 4" },
    { id: "s4", start: "4 + x + 1 + 2", goal: "x + 7" },
    { id: "s10", start: "5 + a + 2 + b", goal: "a + b + 7" },
    { id: "s6", start: "3·y·2 + 1 + x", goal: "x + 6y + 1" },
    { id: "s11", start: "x + 1 + y + 2 + 3", goal: "x + y + 6" },
    { id: "s12", start: "2·x·3 + 4 - 1 + y", goal: "6x + y + 3" },
    { id: "s13", start: "4·y·5 - 7 + x + 2", goal: "x + 20y - 5" },
  ],
};
