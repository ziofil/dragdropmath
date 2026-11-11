import type { Chapter } from "../puzzles";

export const simultaneous: Chapter = {
  id: "simultaneous",
  title: "Simultaneous equations",
  blurb: "Two equations, two unknowns, both true at once. Use one to get rid of a letter in the other.",
  after: ["balance"],
  lesson: [
    {
      title: "Two equations at once",
      text: [
        "`y = 2x` and `x + y = 9` are two facts about the same x and y. One equation with two unknowns has many answers; two equations together usually pin down just one pair.",
        "The trick is to get rid of one letter, so you're back to one equation with one unknown, which you already know how to solve.",
      ],
    },
    {
      title: "Substituting",
      text: ["`y = 2x` says y and 2x are the same amount. So wherever y appears in the other equation, you can put 2x instead."],
      example: {
        start: "y = 2x; x + y = 9",
        steps: [
          { say: "Drag the y of y = 2x onto the y in the other equation.", then: "y = 2x; x + 2x = 9" },
          { say: "Now it's an equation in x alone. Collect the x's.", then: "y = 2x; 3x = 9" },
        ],
        after: "Solve it: x = 3. Then put x = 3 into y = 2x to get y.",
      },
    },
    {
      title: "Adding the equations",
      text: [
        "Equal things added to equal things are equal: you can add two equations, left side to left side and right to right. In `x + y = 7` and `x − y = 1`, the y's then cancel.",
      ],
      example: {
        start: "x + y = 7; x - y = 1",
        steps: [{ say: "Drop the left side of the second equation onto the left side of the first.", then: "2x = 8; x - y = 1" }],
        after: "x + y + x − y: the y's cancel, leaving 2x. And 7 + 1 = 8. So 2x = 8, and x = 4.",
      },
      watch: "Add the whole equation: both sides. Adding only one side would break the balance.",
    },
    {
      title: "Finishing off",
      text: [
        "Once you know one letter, say `x = 3`, put it back into either equation to find the other: drag the x of `x = 3` onto an x in the other equation.",
      ],
    },
  ],
  unlocks: ["substitute", "add-rows"],
  puzzles: [
    {
      id: "e1",
      start: "x + y = 7; x - y = 1",
      goal: "2x = 8; x - y = 1",
      hint: "Drop the left side of one equation onto the left side of the other.",
    },
    { id: "e2", start: "y = 2x; x + y = 9", goal: "y = 2x; 3x = 9", hint: "Drag the y of y = 2x onto the y in the other equation." },
    { id: "e3", start: "y = 3; x + y = 5", goal: "y = 3; x = 2", hint: "y is 3: put 3 in place of the y in the other equation." },
    { id: "e4", start: "x = 4; x + y = 6", goal: "x = 4; y = 2" },
    { id: "e5", start: "x = 2; 3x + y = 10", goal: "x = 2; y = 4" },
    { id: "e6", start: "y = x + 1; x + y = 7", goal: "y = x + 1; x = 3", hint: "Substitute first, then solve for x." },
    { id: "e7", start: "y = 2x; x + y = 9", goal: "x = 3; y = 6", via: ["y = 2x; x = 3"] },
    { id: "e8", start: "x = 2y; x + y = 9", goal: "x = 6; y = 3", via: ["x = 2y; y = 3"] },
    { id: "e9", start: "y = 3x; 2x + y = 10", goal: "x = 2; y = 6", via: ["y = 3x; x = 2"] },
    { id: "e10", start: "y = 4x; x + y = 15", goal: "x = 3; y = 12", via: ["y = 4x; x = 3"] },
    { id: "e11", start: "x + y = 8; x = 3y", goal: "x = 6; y = 2", via: ["y = 2; x = 3y"] },
    { id: "e12", start: "y = 5 - x; 2x + y = 8", goal: "x = 3; y = 2", via: ["y = 5 - x; x + 5 = 8", "y = 5 - x; x = 3"] },
    { id: "e13", start: "3x - y = 5; x + y = 7", goal: "x = 3; y = 4", via: ["4x = 12; x + y = 7", "x = 3; x + y = 7"] },
    { id: "e14", start: "x + y = 6; y - x = 2", goal: "x = 2; y = 4", via: ["x + y = 6; 2y = 8", "y = 4; x + y = 6"] },
    { id: "e15", start: "x + y = 7; x - y = 1", goal: "x = 4; y = 3", via: ["x = 4; x - y = 1"] },
    { id: "e16", start: "x + y = 10; x - y = 4", goal: "x = 7; y = 3", via: ["x = 7; x - y = 4"] },
    { id: "e17", start: "a + b = 9; a - b = 3", goal: "a = 6; b = 3", via: ["a = 6; a - b = 3"] },
    { id: "e18", start: "2x + y = 11; x - y = 1", goal: "x = 4; y = 3", via: ["x = 4; x - y = 1"] },
    { id: "e19", start: "x + 2y = 8; x - 2y = 0", goal: "x = 4; y = 2", via: ["2x = 8; x - 2y = 0", "x = 4; x - 2y = 0"] },
    { id: "e20", start: "5x + 2y = 16; 3x - 2y = 0", goal: "x = 2; y = 3", via: ["8x = 16; 3x - 2y = 0", "x = 2; 3x - 2y = 0"] },
    { id: "e21", start: "y = 10 - 2x; x + y = 7", goal: "x = 3; y = 4", via: ["y = 10 - 2x; 10 - x = 7", "y = 10 - 2x; x = 3"] },
    { id: "e22", start: "y - x = 1; x + y = 5", goal: "x = 2; y = 3", via: ["y - x = 1; 2y = 6", "y = 3; y - x = 1"] },
    {
      id: "e23",
      start: "2x + y = 8; x + y = 5",
      goal: "x = 3; y = 2",
      hint: "Neither letter is alone yet: rearrange x − y = 1 to x = y + 1 first.",
      via: ["y = 5 - x; 2x + y = 8", "y = 5 - x; x + 5 = 8", "y = 5 - x; x = 3"],
    },
    { id: "e24", start: "y = x + 1; x + y = 7", goal: "x = 3; y = 4", via: ["y = x + 1; 2x + 1 = 7", "y = x + 1; x = 3"] },
    { id: "e25", start: "y = x - 2; 2x + y = 7", goal: "x = 3; y = 1", via: ["y = x - 2; 3x - 2 = 7", "y = x - 2; x = 3"] },
    { id: "e26", start: "x = y + 3; x + y = 11", goal: "x = 7; y = 4", via: ["x = y + 3; 2y + 3 = 11", "x = y + 3; y = 4"] },
    { id: "e27", start: "y = 2x + 1; 3x + y = 11", goal: "x = 2; y = 5", via: ["y = 2x + 1; 5x + 1 = 11", "y = 2x + 1; x = 2"] },
    { id: "e28", start: "y = 2x - 3; x + y = 6", goal: "x = 3; y = 3", via: ["y = 2x - 3; 3x - 3 = 6", "y = 2x - 3; x = 3"] },
    {
      id: "e29",
      start: "x - y = 1; 2y + x = 7",
      goal: "x = 3; y = 2",
      via: ["x = y + 1; 2y + x = 7", "x = y + 1; 3y + 1 = 7", "x = y + 1; y = 2"],
    },
    {
      id: "e30",
      start: "3x + 2y = 13; x - y = 1",
      goal: "x = 3; y = 2",
      via: ["x = y + 1; 3x + 2y = 13", "x = y + 1; 5y + 3 = 13", "x = y + 1; y = 2"],
    },
  ],
};
