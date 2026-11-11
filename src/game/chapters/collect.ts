import type { Chapter } from "../puzzles";

export const collect: Chapter = {
  id: "collect",
  title: "Like terms",
  blurb: "3x + 2x = 5x, just as 3 apples + 2 apples = 5 apples. Terms with the same letters combine; opposites cancel.",
  after: ["shuffle"],
  lesson: [
    {
      title: "What 3x means",
      text: ["`3x` means `x + x + x`: three x's. So `3x + 2x` is three x's and two more: `5x`."],
      example: {
        start: "3x + 2x",
        steps: [{ say: "Drop the 2x onto the 3x.", then: "5x" }],
      },
    },
    {
      title: "Only like terms combine",
      text: [
        "Terms only combine if they're the same kind. `3x + 2` can't become `5x`, just as 3 apples and 2 pears aren't 5 apples. Plain numbers are a kind of their own.",
      ],
      example: {
        start: "x + 4 + x",
        steps: [
          {
            say: "The two x's are the same kind. Drop the second one onto the first.",
            then: "2x + 4",
          },
        ],
        after: "The 4 is a different kind, so it stays.",
      },
    },
    {
      title: "Different letters, different kinds",
      text: [
        "`x` and `y` stand for amounts that may be different, so `2x + 3y` stays as it is. But in `2x + 3y + x`, the two x-terms can meet.",
      ],
      example: {
        start: "2x + 3y + x",
        steps: [
          {
            say: "Drop the x onto the 2x. The 3y has to wait.",
            then: "3x + 3y",
          },
        ],
        after: "The x's and the y's never mix.",
      },
    },
    {
      title: "Taking away",
      text: ["A minus term counts down: `5y − 2y` is `3y`. And something minus itself is nothing, so `a + b − a` is just `b`."],
      example: {
        start: "a + b - a",
        steps: [{ say: "Drop the −a onto the a. They cancel.", then: "b" }],
      },
      watch: "`x + x` is `2x`, not `x²`. Adding x's counts them. Multiplying them is something else, which comes later.",
    },
  ],
  unlocks: [],
  puzzles: [
    { id: "c1", start: "3x + 2x", goal: "5x" },
    { id: "c2", start: "x + 4 + x", goal: "2x + 4" },
    { id: "c3", start: "5y - 2y + 3", goal: "3y + 3" },
    {
      id: "c4",
      start: "a + b - a",
      goal: "b",
      hint: "Something minus itself is nothing.",
    },
    {
      id: "c17",
      start: "3ab + 2ab",
      goal: "5ab",
      hint: "ab is a kind of its own, just like x. Three of them and two more…",
    },
    { id: "c18", start: "xy + 3 + 2xy", goal: "3xy + 3" },
    {
      id: "c9",
      start: "2·x·3 + x",
      goal: "7x",
      hint: "Work out 2·3 first: then it's x's and an x.",
    },
    { id: "c19", start: "x + y - x + 2y", goal: "3y" },
    { id: "c5", start: "2x + 3 + 4x - 1", goal: "6x + 2" },
    { id: "c10", start: "3x + 2 + x + 5", goal: "4x + 7" },
    { id: "c11", start: "5a - 2a + a", goal: "4a" },
    { id: "c6", start: "2x + 3y + x + y", goal: "3x + 4y", hint: "Gather the x's, then the y's. They never mix." },
    { id: "c7", start: "4x - y + 2y - 3x", goal: "x + y" },
    { id: "c8", start: "3a + 2b - a + 5 - 2b", goal: "2a + 5" },
    { id: "c12", start: "4·x·2 - 3x + y·2 + y", goal: "5x + 3y" },
    { id: "c13", start: "a - 3b + 2a + 4b - a", goal: "2a + b" },
    { id: "c16", start: "3·x + 2·y·3 - x - 4y + 1", goal: "2x + 2y + 1" },
    { id: "c21", start: "5x - 3 + 2y - 4x + 3", goal: "x + 2y" },
    { id: "c20", start: "y·2·2 - y + 6 - 2·3", goal: "3y" },
    { id: "c14", start: "x + y + x + y + x", goal: "3x + 2y" },
    { id: "c15", start: "6y - 2 + y - 3y + 5", goal: "4y + 3" },
    { id: "c22", start: "2 + 3a + 2·b·3 - a - 2b", goal: "2a + 4b + 2" },
    { id: "c23", start: "3·2 + y - 2·x·2 + 5x", goal: "x + y + 6" },
    { id: "c24", start: "4·2 - y + 3x + 2y - x", goal: "2x + y + 8" },
    {
      id: "c27",
      start: "5 - c + 3b - b + a",
      goal: "a + 2b - c + 5",
      hint: "Collect the b's, then put the letters in order, with the plain number last.",
    },
    { id: "c25", start: "5·2 - y·3 + 4y + 2·x·3", goal: "6x + y + 10" },
    { id: "c26", start: "3·4 + b·2 - 5b + a·2·2", goal: "4a - 3b + 12" },
    { id: "c28", start: "2·3 - c + b + 2a - a", goal: "a + b - c + 6" },
    { id: "c29", start: "3·3 - y·2 + 5y + 2·x·2", goal: "4x + 3y + 9" },
    { id: "c30", start: "2·3 - z + y + 2·x·3 - x", goal: "5x + y - z + 6" },
  ],
};
