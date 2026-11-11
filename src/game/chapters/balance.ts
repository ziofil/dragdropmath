import type { Chapter } from "../puzzles";

export const balance: Chapter = {
  id: "balance",
  title: "Solving equations",
  blurb:
    "An equation is a balance. Whatever crosses the = changes into its opposite.",
  after: ["distribute"],
  lesson: [
    {
      title: "An equation is a balance",
      text: [
        "An equation says two amounts are equal, like a balance that's level. Do the same thing to both sides and it stays level.",
        "Moving a term across `=` is exactly that. From `x + 3 = 10`, take 3 from both sides: `x = 10 − 3`. That's why the `+3` arrives as `−3`.",
      ],
      example: {
        start: "x + 3 = 10",
        steps: [
          {
            say: "Carry the 3 across the =. Watch its sign as it crosses.",
            then: "x = 10 - 3",
          },
          { say: "Drop the −3 onto the 10.", then: "x = 7" },
        ],
      },
    },
    {
      title: "Dividing both sides",
      text: [
        "A number multiplying a whole side arrives dividing the other side: from `2x = 8`, divide both sides by 2 to get `x = 8/2`.",
      ],
      example: {
        start: "2x = 8",
        steps: [
          {
            say: "Carry the 2 across: it divides the other side.",
            then: "x = 8/2",
          },
          { say: "Drop the 2 onto the 8.", then: "x = 4" },
        ],
      },
    },
    {
      title: "Bottoms and minuses",
      text: [
        "Dividing goes the other way too: from `x/3 = 4`, multiply both sides by 3. The bottom 3 arrives on the other side multiplying.",
        "A minus in front of a whole side can cross as well: `−x = 6` becomes `x = −6`.",
      ],
      example: {
        start: "x/3 = 4",
        steps: [{ say: "Carry the 3 across the =.", then: "x = 4·3" }],
      },
    },
    {
      title: "Undo the outside first",
      text: [
        "In `3x + 1`, the x was multiplied by 3 first, then 1 was added. To get x alone, undo in reverse: the 1 leaves first, then the 3.",
      ],
      example: {
        start: "3x + 1 = 13",
        steps: [
          { say: "Carry the 1 across.", then: "3x = 13 - 1" },
          { say: "Work it out.", then: "3x = 12" },
          { say: "Carry the 3 across.", then: "x = 12/3" },
          { say: "And work that out.", then: "x = 4" },
        ],
      },
      watch: "Check your answer by putting it back in: 3·4 + 1 = 13. ✓",
    },
  ],
  unlocks: [
    "move-term",
    "swap-sides",
    "move-factor",
    "move-denominator",
    "move-sign",
    "divide-numbers",
    "cancel-factor",
  ],
  puzzles: [
    { id: "b4", start: "-x = 6", goal: "x = -6" },
    {
      id: "b1",
      start: "x + 3 = 10",
      goal: "x = 7",
      hint: "Drag the 3 across the = sign.",
    },
    { id: "b2", start: "2x = 8", goal: "x = 4" },
    { id: "b3", start: "x - 5 = 2", goal: "x = 7" },
    { id: "b5", start: "x/3 = 4", goal: "x = 12" },
    { id: "b9", start: "x + 7 = 3", goal: "x = -4" },
    {
      id: "b10",
      start: "10 = 2x",
      goal: "x = 5",
      hint: "Drag the whole right side across to swap the sides, or solve it where it is.",
    },
    { id: "b11", start: "7 - x = 2", goal: "x = 5" },
    { id: "b6", start: "3x + 1 = 13", goal: "x = 4" },
    {
      id: "b7",
      start: "2(x + 1) = 10",
      goal: "x = 4",
      hint: "There's a shortcut: deal with the 2 first.",
    },
    {
      id: "b12",
      start: "x/2 + 1 = 5",
      goal: "x = 8",
      hint: "Undo the outside first: the + 1.",
    },
    { id: "b13", start: "x/3 - 2 = 1", goal: "x = 9" },
    { id: "b14", start: "3(x - 1) = 6", goal: "x = 3" },
    { id: "b15", start: "2x + 3 + x = 15", goal: "x = 4" },
    { id: "b16", start: "5x - 2 - 2x = 2x + 3", goal: "x = 5" },
    { id: "b8", start: "5x - 2 = 3x + 6", goal: "x = 4" },
    { id: "b17", start: "3x - 4 = x + 6", goal: "x = 5" },
    { id: "b18", start: "4 - 3x = 2x - 6", goal: "x = 2" },
  ],
};
