import type { Chapter } from "../puzzles";

export const distribute: Chapter = {
  id: "distribute",
  title: "The distributive law",
  blurb: "A factor outside brackets multiplies every term inside — and a factor every term shares can be taken back out.",
  after: ["collect"],
  lesson: [
    {
      title: "A factor visits every term",
      text: [
        "`2(x + 3)` means 2 lots of `(x + 3)`. That's 2 lots of x, plus 2 lots of 3: `2x + 2·3`. The factor outside visits every term inside.",
        "Picture a rectangle 2 tall and `x + 3` wide. Cut it in two: one part is `2·x`, the other `2·3`. Together they make the whole thing.",
      ],
      example: {
        start: "2(x + 3)",
        steps: [
          {
            say: "Drop the 2 onto the brackets. Watch it visit both terms.",
            then: "2x + 2·3",
          },
          { say: "Now drop the 2 of 2·3 onto the 3.", then: "2x + 6" },
        ],
      },
    },
    {
      title: "A minus in front",
      text: ["`−(x − 4)` means `−1` times the brackets. The −1 visits every term too, so every sign inside flips."],
      example: {
        start: "-(x - 4)",
        steps: [{ say: "Drop the minus onto the brackets.", then: "-x + 4" }],
      },
      watch: "A common slip is writing `−(x − 4)` as `−x − 4`. The minus has to reach the 4 as well.",
    },
    {
      title: "Taking a factor out",
      text: ["Going backwards is called factoring. If every term has a 3, the 3 can come out in front of brackets: `3x + 3y = 3(x + y)`."],
      example: {
        start: "3x + 3y",
        steps: [
          {
            say: "Both terms have a 3. Carry one 3 out in front, past the left end.",
            then: "3(x + y)",
          },
        ],
        after: "Multiply it back out and you get 3x + 3y again.",
      },
    },
    {
      title: "When x meets x",
      text: [
        "Sometimes a letter meets itself: `x(x + 2)` gives `x·x`. It has a shorter name, `x²` (x squared). Picture a square with sides x: its area is x·x.",
      ],
      example: {
        start: "x(x + 2)",
        steps: [
          { say: "Drop the x onto the brackets.", then: "x·x + x·2" },
          { say: "Drop one x onto the other.", then: "x^2 + x·2" },
        ],
      },
    },
  ],
  unlocks: ["distribute", "distribute-neg", "factor-out", "merge-powers"],
  puzzles: [
    {
      id: "d1",
      start: "a(b + c)",
      goal: "ab + ac",
      hint: "Drop the a onto the brackets.",
    },
    {
      id: "d3",
      start: "ab + ac",
      goal: "a(b + c)",
      hint: "Pull an a out of either term.",
    },
    { id: "d4", start: "3x + 3y", goal: "3(x + y)" },
    { id: "d20", start: "4a + 4", goal: "4(a + 1)" },
    { id: "d5", start: "xy + x", goal: "x(y + 1)" },
    { id: "d9", start: "xy + xz", goal: "x(y + z)" },
    {
      id: "d19",
      start: "-(y + 3)",
      goal: "-y - 3",
      hint: "Drop the minus onto the brackets.",
    },
    { id: "d2", start: "2(x + 3)", goal: "2x + 6" },
    { id: "d21", start: "5(a + 2)", goal: "5a + 10" },
    { id: "d10", start: "3(x - 2)", goal: "3x - 6" },
    {
      id: "d6",
      start: "-(x - 4)",
      goal: "4 - x",
      hint: "Drop the minus onto the brackets.",
    },
    { id: "d22", start: "3(y + 4) - 12", goal: "3y" },
    { id: "d11", start: "a(b + c) - ab", goal: "ac" },
    { id: "d12", start: "2(a + b) - 2a", goal: "2b" },
    { id: "d13", start: "x(y + 2) - xy", goal: "2x" },
    {
      id: "d14",
      start: "-(2x + 3) + 5",
      goal: "-2x + 2",
      hint: "The minus reaches every term in the brackets.",
    },
    { id: "d15", start: "3(2x + 1) + x", goal: "7x + 3" },
    { id: "d8", start: "x(x + 2) - 2x", goal: "x^2" },
    { id: "d16", start: "x(x - 1) + x", goal: "x^2" },
    { id: "d23", start: "-(a - b) + (a + b)", goal: "2b" },
    { id: "d7", start: "2(x + 1) + 3(x - 1)", goal: "5x - 1" },
    { id: "d17", start: "2(3x - 1) - (x - 2)", goal: "5x" },
    {
      id: "d18",
      start: "4(x + 1) - 2(x + 3)",
      goal: "2x - 2",
      hint: "The −2 visits both terms of its brackets.",
    },
    { id: "d24", start: "x(x + 2) + 3(x + 2)", goal: "x^2 + 5x + 6" },
    { id: "d25", start: "2(3a + b) - 3(a - b)", goal: "3a + 5b" },
    { id: "d26", start: "x(x + y) - y(x - y)", goal: "x^2 + y^2" },
    {
      id: "d27",
      start: "2y(y + 3) - y(y + 4)",
      goal: "y^2 + 2y",
      hint: "Each factor in front visits both terms of its brackets. Then gather the y² terms and the y terms.",
    },
    { id: "d28", start: "a(a + b) - b(a - b) - b^2", goal: "a^2" },
    { id: "d29", start: "3x(x + 2) - 2x(x + 1)", goal: "x^2 + 4x" },
    { id: "d30", start: "3a(a - 1) - 2a(a - 2)", goal: "a^2 + a" },
  ],
};
