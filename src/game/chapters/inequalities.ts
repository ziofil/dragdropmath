import type { Chapter } from "../puzzles";

export const inequalities: Chapter = {
  id: "inequalities",
  title: "Inequalities",
  blurb:
    "An inequality is a balance that tips. Adding or dividing by a positive number keeps it tipped the same way. Multiplying by −1 swaps which side is heavier, so the sign turns round.",
  after: ["balance"],
  lesson: [
    {
      title: "Bigger and smaller",
      text: ["`x < 7` says x is smaller than 7. The sign opens towards the bigger side."],
      example: {
        start: "x + 2 ≥ 5",
        steps: [
          {
            say: "Just like an equation: carry the 2 across.",
            then: "x ≥ 5 - 2",
          },
          { say: "Work it out.", then: "x ≥ 3" },
        ],
      },
    },
    {
      title: "Reading from either end",
      text: [
        "`3 > x` and `x < 3` say the same thing, read from opposite ends: x is smaller than 3. So the two sides can change places, as long as the sign turns round to keep pointing the same way.",
      ],
      example: {
        start: "3 > x",
        steps: [{ say: "Drag the 3 across to the other side. Watch the sign as it passes.", then: "x < 3" }],
      },
    },
    {
      title: "The same moves as equations",
      text: ["Adding or taking away the same amount on both sides keeps the order. So does dividing both sides by a positive number."],
      example: {
        start: "2x < 8",
        steps: [
          {
            say: "Carry the 2 across. It's positive, so the sign stays as it is.",
            then: "x < 8/2",
          },
          { say: "Work it out.", then: "x < 4" },
        ],
      },
    },
    {
      title: "A minus turns it round",
      text: ["Multiplying by −1 reverses the order: `2 < 3`, but `−2 > −3`. So when a minus crosses, the sign turns round."],
      example: {
        start: "-x < 4",
        steps: [
          {
            say: "Carry just the minus across. Keep an eye on the < as you pass it.",
            then: "x > -4",
          },
        ],
        after: "Try a number: x = 0 works in −x < 4 (0 < 4), and in x > −4 (0 > −4).",
      },
      watch: "Only multiplying or dividing by a negative number turns the sign. Moving a term across never does.",
    },
  ],
  unlocks: [],
  puzzles: [
    {
      id: "i3",
      start: "-x < 4",
      goal: "x > -4",
      hint: "Carry the minus across, and watch the sign as it passes.",
    },
    {
      id: "i1",
      start: "x + 3 < 10",
      goal: "x < 7",
      hint: "Just like an equation: carry the 3 across.",
    },
    { id: "i2", start: "2x ≥ 8", goal: "x ≥ 4" },
    { id: "i4", start: "x - 5 > 2", goal: "x > 7" },
    { id: "i17", start: "y + 6 ≥ 2", goal: "y ≥ -4" },
    { id: "i7", start: "x/3 ≥ 2", goal: "x ≥ 6" },
    {
      id: "i8",
      start: "5 < x + 2",
      goal: "x > 3",
      hint: "Drag the whole left side across: 5 < x + 2 and x + 2 > 5 say the same thing.",
    },
    { id: "i18", start: "8 > 2n", goal: "n < 4" },
    { id: "i11", start: "-x/2 > 1", goal: "x < -2" },
    {
      id: "i5",
      start: "-2x ≤ 6",
      goal: "x ≥ -3",
      hint: "Deal with the minus first, then the 2.",
    },
    { id: "i19", start: "-3a < 12", goal: "a > -4" },
    { id: "i6", start: "3 - x > 1", goal: "x < 2" },
    { id: "i10", start: "-(x - 1) ≥ 3", goal: "x ≤ -2" },
    { id: "i12", start: "6 - 2x > 0", goal: "x < 3" },
    { id: "i13", start: "2x - 3 ≥ 5", goal: "x ≥ 4" },
    { id: "i14", start: "x/2 + 1 ≤ 4", goal: "x ≤ 6" },
    { id: "i20", start: "k/4 - 1 > 2", goal: "k > 12" },
    { id: "i15", start: "3(x - 2) < 9", goal: "x < 5" },
    { id: "i21", start: "2(y + 1) > 8", goal: "y > 3" },
    { id: "i22", start: "10 - 3x ≤ 1", goal: "x ≥ 3" },
    { id: "i23", start: "6 < 2(4 - y)", goal: "y < 1" },
    { id: "i9", start: "4x + 1 < 2x + 7", goal: "x < 3" },
    { id: "i16", start: "5 - x ≥ 2x - 4", goal: "x ≤ 3" },
    { id: "i24", start: "4(m + 1) - 2m < 10", goal: "m < 3" },
    { id: "i25", start: "2(a - 1) > 3(a - 2)", goal: "a < 4" },
    {
      id: "i26",
      start: "3(x + 1) < x + 9",
      goal: "x < 3",
      hint: "Open the bracket first, then gather the x's on one side.",
    },
    { id: "i27", start: "-(x + 2) ≤ 2x - 5", goal: "x ≥ 1" },
    { id: "i28", start: "5(n - 1) ≥ 2(n + 2)", goal: "n ≥ 3" },
    { id: "i29", start: "3(2 - p) > 2(p - 2)", goal: "p < 2", via: ["-3p - 2p > -2·2 - 3·2"] },
    { id: "i30", start: "2(3x - 1) > 4(x + 1) - x", goal: "x > 2", via: ["2*3*x > 4*x + 4 - x + 2", "2*3*x - 3*x > 6"] },
  ],
};
