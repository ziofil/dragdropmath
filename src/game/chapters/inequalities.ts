import type { Chapter } from "../puzzles";

export const inequalities: Chapter = {
  id: "inequalities",
  title: "Inequalities",
  blurb:
    "Solve inequalities like equations, with one difference: multiplying or dividing by a negative number turns the sign round.",
  after: ["balance"],
  lesson: [
    {
      title: "Less than and greater than",
      text: ["`x < 7` says x is less than 7. The open side of the sign faces the bigger number."],
      example: {
        start: "x + 2 ≥ 5",
        steps: [
          {
            say: "As with an equation, drag the 2 across.",
            then: "x ≥ 5 - 2",
          },
          { say: "Work it out.", then: "x ≥ 3" },
        ],
      },
    },
    {
      title: "Swapping the sides",
      text: [
        "`3 > x` and `x < 3` say the same thing: x is less than 3. So you can swap the two sides, as long as you turn the sign round too.",
      ],
      example: {
        start: "3 > x",
        steps: [{ say: "Drag the 3 to the other side. The sign turns round.", then: "x < 3" }],
      },
    },
    {
      title: "The same moves as equations",
      text: ["Adding or subtracting the same amount on both sides keeps the sign the same. So does multiplying or dividing both sides by a positive number."],
      example: {
        start: "2x < 8",
        steps: [
          {
            say: "Drag the 2 across. It's positive, so the sign stays the same.",
            then: "x < 8/2",
          },
          { say: "Work it out.", then: "x < 4" },
        ],
      },
    },
    {
      title: "A minus turns the sign round",
      text: ["Multiplying by −1 reverses the order: `2 < 3`, but `−2 > −3`. So when a minus moves across, the sign turns round."],
      example: {
        start: "-x < 4",
        steps: [
          {
            say: "Drag just the minus across. The < turns round.",
            then: "x > -4",
          },
        ],
        after: "Check with a number: x = 0 fits both −x < 4 and x > −4.",
      },
      watch: "Only multiplying or dividing by a negative number turns the sign. Moving a term across never does.",
    },
  ],
  unlocks: [],
};
