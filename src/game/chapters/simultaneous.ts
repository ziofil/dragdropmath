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
};
