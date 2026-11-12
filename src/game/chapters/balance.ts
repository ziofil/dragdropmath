import type { Chapter } from "../puzzles";

export const balance: Chapter = {
  id: "balance",
  title: "Solving equations",
  blurb: "Do the same thing to both sides and the equation stays true. A term that moves across the = does the opposite on the other side.",
  after: ["distribute"],
  lesson: [
    {
      title: "The same on both sides",
      text: [
        "An equation says two things are equal. If you do the same thing to both sides, they stay equal.",
        "Moving a term across the `=` does exactly that. From `x + 3 = 10`, take 3 from both sides: `x = 10 − 3`. That's why `+3` becomes `−3` on the other side.",
      ],
      example: {
        start: "x + 3 = 10",
        steps: [
          {
            say: "Drag the 3 across the =. Its sign changes.",
            then: "x = 10 - 3",
          },
          { say: "Drop the −3 onto the 10.", then: "x = 7" },
        ],
      },
    },
    {
      title: "Dividing both sides",
      text: ["If a number multiplies a whole side, moving it across makes it divide the other side. From `2x = 8`, divide both sides by 2: `x = 8/2`."],
      example: {
        start: "2x = 8",
        steps: [
          {
            say: "Drag the 2 across the =. It divides the other side.",
            then: "x = 8/2",
          },
          { say: "Drop the 2 onto the 8.", then: "x = 4" },
        ],
      },
    },
    {
      title: "Fractions and minus signs",
      text: [
        "It works for dividing too. From `x/3 = 4`, multiply both sides by 3. The 3 on the bottom moves across and multiplies the other side.",
        "A minus in front of a whole side can move across too: `−x = 6` becomes `x = −6`.",
      ],
      example: {
        start: "x/3 = 4",
        steps: [{ say: "Drag the 3 across the =.", then: "x = 4·3" }],
      },
    },
    {
      title: "Undo in reverse order",
      text: [
        "In `3x + 1`, x is multiplied by 3, then 1 is added. To get x on its own, undo these in reverse order: move the 1 first, then the 3.",
      ],
      example: {
        start: "3x + 1 = 13",
        steps: [
          { say: "Drag the 1 across.", then: "3x = 13 - 1" },
          { say: "Work it out.", then: "3x = 12" },
          { say: "Drag the 3 across.", then: "x = 12/3" },
          { say: "Work it out.", then: "x = 4" },
        ],
      },
      watch: "Check your answer by putting it back in: 3·4 + 1 = 13. ✓",
    },
  ],
  unlocks: ["move-term", "swap-sides", "move-factor", "move-denominator", "move-sign", "divide-numbers", "cancel-factor"],
  puzzles: [
    { id: "b4", start: "-x = 6", goal: "x = -6" },
    {
      id: "b1",
      start: "x + 3 = 10",
      goal: "x = 7",
      hint: "Drag the 3 across the = sign.",
    },
    { id: "b19", start: "y + 6 = 11", goal: "y = 5" },
    { id: "b2", start: "2x = 8", goal: "x = 4" },
    { id: "b3", start: "x - 5 = 2", goal: "x = 7" },
    { id: "b5", start: "x/3 = 4", goal: "x = 12" },
    { id: "b20", start: "a/5 = 2", goal: "a = 10" },
    { id: "b9", start: "x + 7 = 3", goal: "x = -4" },
    {
      id: "b10",
      start: "10 = 2x",
      goal: "x = 5",
      hint: "Drag the whole right side across to swap the sides, or solve it where it is.",
    },
    { id: "b11", start: "7 - x = 2", goal: "x = 5" },
    {
      id: "b21",
      start: "2x + 1 = 4",
      goal: "x = 3/2",
      hint: "The answer can be a fraction.",
    },
    {
      id: "b22",
      start: "(x + 3)/2 = 4",
      goal: "x = 5",
      hint: "The whole top is divided by 2. Drag the 2 across first.",
    },
    { id: "b6", start: "3x + 1 = 13", goal: "x = 4" },
    {
      id: "b7",
      start: "2(x + 1) = 10",
      goal: "x = 4",
      hint: "Quicker: drag the 2 across before you expand.",
    },
    {
      id: "b12",
      start: "x/2 + 1 = 5",
      goal: "x = 8",
      hint: "Move the + 1 first.",
    },
    { id: "b13", start: "x/3 - 2 = 1", goal: "x = 9" },
    { id: "b14", start: "3(x - 1) = 6", goal: "x = 3" },
    {
      id: "b23",
      start: "5 - (x - 1) = 2",
      goal: "x = 4",
      hint: "A minus in front of brackets changes every sign inside.",
    },
    { id: "b15", start: "2x + 3 + x = 15", goal: "x = 4" },
    { id: "b16", start: "5x - 2 - 2x = 2x + 3", goal: "x = 5" },
    { id: "b24", start: "(x - 1)/3 + 2 = 4", goal: "x = 7" },
    { id: "b8", start: "5x - 2 = 3x + 6", goal: "x = 4" },
    { id: "b17", start: "3x - 4 = x + 6", goal: "x = 5" },
    { id: "b18", start: "4 - 3x = 2x - 6", goal: "x = 2" },
    { id: "b25", start: "(x + 1)/2 = x - 3", goal: "x = 7" },
    { id: "b26", start: "3(2x - 1) = 4x + 5", goal: "x = 4" },
    { id: "b27", start: "2(3 - x) = x - 9", goal: "x = 5" },
    { id: "b28", start: "4(x + 1) = 2(x + 5) + x", goal: "x = 6", via: ["4*x = 2*x + 2*5 + x - 4"] },
    { id: "b29", start: "7 - 3(x - 1) = x - 2", goal: "x = 3" },
    { id: "b30", start: "(x + 5)/3 = x - 1", goal: "x = 4" },
  ],
};
