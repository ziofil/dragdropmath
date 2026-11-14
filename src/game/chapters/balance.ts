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
        steps: [
          { say: "Drag the 3 across the =.", then: "x = 4·3" },
          { say: "Drop the 4 onto the 3.", then: "x = 12" },
        ],
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
  unlocks: ["move-term", "swap-sides", "move-factor", "move-denominator", "move-sign", "divide-numbers", "evaluate-fraction", "cancel-factor"],
};
