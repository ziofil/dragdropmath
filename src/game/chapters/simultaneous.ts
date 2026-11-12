import type { Chapter } from "../puzzles";

export const simultaneous: Chapter = {
  id: "simultaneous",
  title: "Simultaneous equations",
  blurb: "Two equations with two unknowns, both true at the same time. Get one letter on its own in one equation, then substitute it into the other.",
  after: ["formulas"],
  lesson: [
    {
      title: "Two equations at once",
      text: [
        "`y = 2x` and `x + y = 9` are two equations about the same x and y. One equation with two unknowns has many solutions. Two equations together usually have just one.",
        "To solve them, get rid of one letter. That leaves one equation with one unknown, which you already know how to solve.",
      ],
    },
    {
      title: "Substituting",
      text: ["`y = 2x` says y and 2x are equal. So you can replace y with 2x in the other equation. This is called substituting."],
      example: {
        start: "y = 2x; x + y = 9",
        steps: [
          { say: "Drag the y of y = 2x onto the y in the other equation.", then: "y = 2x; x + 2x = 9" },
          { say: "Now the equation only has x in it. Collect the x's.", then: "y = 2x; 3x = 9" },
        ],
        after: "Solve it: x = 3. Then put x = 3 into y = 2x to find y.",
      },
    },
    {
      title: "Getting a letter on its own",
      text: [
        "To substitute, you need an equation like `y = …` or `x = …`. If you don't have one, make one: in `x − y = 1`, drag the −y across to get `x = 1 + y`.",
      ],
      example: {
        start: "x + y = 7; x - y = 1",
        steps: [
          { say: "Drag the −y across the = in the second equation.", then: "x + y = 7; x = 1 + y" },
          { say: "Now x is on its own. Drag it onto the x in the first equation.", then: "1 + y + y = 7; x = 1 + y" },
        ],
        after: "Now the first equation only has y: 2y + 1 = 7, so y = 3.",
      },
      watch: "Substitute the whole expression. If x = 1 + y, then 2x is 2(1 + y), not 2 + y.",
    },
    {
      title: "Finding the other letter",
      text: [
        "Once you know one letter, say `x = 3`, substitute it into the other equation to find the other letter. Drag the x of `x = 3` onto an x in the other equation.",
      ],
    },
  ],
  unlocks: ["substitute"],
  puzzles: [
    { id: "e1", start: "y = 3; x + y = 5", goal: "x = 2; y = 3", hint: "y is 3: drag the y of y = 3 onto the y in the other equation." },
    { id: "e2", start: "x = 4; x + y = 6", goal: "x = 4; y = 2" },
    { id: "e3", start: "x = 2; 3x + y = 10", goal: "x = 2; y = 4" },
    {
      id: "e4",
      start: "y = 2x; x + y = 12",
      goal: "x = 4; y = 8",
      hint: "Drag the y of y = 2x onto the y in the other equation. Once you know x, put it into y = 2x.",
      via: ["y = 2x; x = 4"],
    },
    { id: "e5", start: "y = 2x; x + y = 9", goal: "x = 3; y = 6", via: ["y = 2x; x = 3"] },
    { id: "e6", start: "y = x + 2; x + y = 10", goal: "x = 4; y = 6", via: ["y = x + 2; 2x + 2 = 10", "y = x + 2; x = 4"] },
    { id: "e7", start: "x = 2y; x + y = 9", goal: "x = 6; y = 3", via: ["x = 2y; y = 3"] },
    { id: "e8", start: "y = 3x; 2x + y = 10", goal: "x = 2; y = 6", via: ["y = 3x; x = 2"] },
    { id: "e9", start: "y = 4x; x + y = 15", goal: "x = 3; y = 12", via: ["y = 4x; x = 3"] },
    { id: "e10", start: "x + y = 8; x = 3y", goal: "x = 6; y = 2", via: ["y = 2; x = 3y"] },
    { id: "e11", start: "y = 5 - x; 2x + y = 8", goal: "x = 3; y = 2", via: ["y = 5 - x; x + 5 = 8", "y = 5 - x; x = 3"] },
    { id: "e12", start: "y = 10 - 2x; x + y = 7", goal: "x = 3; y = 4", via: ["y = 10 - 2x; 10 - x = 7", "y = 10 - 2x; x = 3"] },
    { id: "e13", start: "y = x + 1; x + y = 7", goal: "x = 3; y = 4", via: ["y = x + 1; 2x + 1 = 7", "y = x + 1; x = 3"] },
    { id: "e14", start: "y = x - 2; 2x + y = 7", goal: "x = 3; y = 1", via: ["y = x - 2; 3x - 2 = 7", "y = x - 2; x = 3"] },
    { id: "e15", start: "x = y + 3; x + y = 11", goal: "x = 7; y = 4", via: ["x = y + 3; 2y + 3 = 11", "x = y + 3; y = 4"] },
    { id: "e16", start: "y = 2x + 1; 3x + y = 11", goal: "x = 2; y = 5", via: ["y = 2x + 1; 5x + 1 = 11", "y = 2x + 1; x = 2"] },
    { id: "e17", start: "y = 2x - 3; x + y = 6", goal: "x = 3; y = 3", via: ["y = 2x - 3; 3x - 3 = 6", "y = 2x - 3; x = 3"] },
    {
      id: "e18",
      start: "x + y = 7; x - y = 1",
      goal: "x = 4; y = 3",
      hint: "Neither letter is on its own yet. Drag the −y across to get x = 1 + y. Then substitute.",
      via: ["x + y = 7; x = 1 + y", "2y + 1 = 7; x = 1 + y", "y = 3; x = 1 + y"],
    },
    { id: "e19", start: "x + y = 10; x - y = 4", goal: "x = 7; y = 3", via: ["x + y = 10; x = 4 + y", "2y + 4 = 10; x = 4 + y", "y = 3; x = 4 + y"] },
    { id: "e20", start: "a + b = 9; a - b = 3", goal: "a = 6; b = 3", via: ["a + b = 9; a = 3 + b", "2b + 3 = 9; a = 3 + b", "b = 3; a = 3 + b"] },
    {
      id: "e21",
      start: "x + y = 5; 2x + y = 8",
      goal: "x = 3; y = 2",
      hint: "Get y on its own in the first equation: y = 5 − x.",
      via: ["y = 5 - x; 2x + y = 8", "y = 5 - x; x + 5 = 8", "y = 5 - x; x = 3"],
    },
    { id: "e22", start: "y - x = 1; x + y = 5", goal: "x = 2; y = 3", via: ["y = 1 + x; x + y = 5", "y = 1 + x; 2x + 1 = 5", "y = 1 + x; x = 2"] },
    { id: "e23", start: "x + y = 6; y - x = 2", goal: "x = 2; y = 4", via: ["x + y = 6; y = 2 + x", "2x + 2 = 6; y = 2 + x", "x = 2; y = 2 + x"] },
    { id: "e24", start: "x + 2y = 8; x - 2y = 0", goal: "x = 4; y = 2", via: ["x + 2y = 8; x = 2y", "4y = 8; x = 2y", "y = 2; x = 2y"] },
    { id: "e25", start: "4x + y = 14; x + y = 5", goal: "x = 3; y = 2", via: ["4x + y = 14; y = 5 - x", "3x + 5 = 14; y = 5 - x", "x = 3; y = 5 - x"] },
    { id: "e26", start: "x - y = 1; 2y + x = 7", goal: "x = 3; y = 2", via: ["x = y + 1; 2y + x = 7", "x = y + 1; 3y + 1 = 7", "x = y + 1; y = 2"] },
    {
      id: "e27",
      start: "2x + y = 11; x - y = 1",
      goal: "x = 4; y = 3",
      hint: "x = 1 + y, so 2x becomes 2(1 + y). Use the whole bracket.",
      via: ["2x + y = 11; x = 1 + y", "2(1 + y) + y = 11; x = 1 + y", "3y + 2 = 11; x = 1 + y", "y = 3; x = 1 + y"],
    },
    {
      id: "e28",
      start: "3x - y = 5; x + y = 7",
      goal: "x = 3; y = 4",
      via: ["3x - y = 5; y = 7 - x", "3x - (7 - x) = 5; y = 7 - x", "4x - 7 = 5; y = 7 - x", "x = 3; y = 7 - x"],
    },
    {
      id: "e29",
      start: "3x + 2y = 13; x - y = 1",
      goal: "x = 3; y = 2",
      via: ["x = y + 1; 3x + 2y = 13", "x = y + 1; 5y + 3 = 13", "x = y + 1; y = 2"],
    },
    {
      id: "e30",
      start: "x - 2y = 1; 3x + y = 10",
      goal: "x = 3; y = 1",
      via: ["x = 1 + 2y; 3x + y = 10", "x = 1 + 2y; 3(1 + 2y) + y = 10", "x = 1 + 2y; 7y + 3 = 10", "x = 1 + 2y; y = 1"],
    },
  ],
};
