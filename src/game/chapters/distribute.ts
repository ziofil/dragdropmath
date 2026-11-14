import type { Chapter } from "../puzzles";

export const distribute: Chapter = {
  id: "distribute",
  title: "The distributive law",
  blurb: "A number outside brackets multiplies every term inside. A factor that every term shares can be taken back out.",
  after: ["collect"],
  lesson: [
    {
      title: "Multiply every term inside",
      text: [
        "`2(x + 3)` means 2 lots of `(x + 3)`. That's 2 lots of x plus 2 lots of 3: `2x + 2·3`. The number outside multiplies every term inside.",
        "Think of a rectangle 2 tall and `x + 3` wide. Split it into two parts: one has area `2·x`, the other `2·3`. Together they make the whole rectangle.",
      ],
      example: {
        start: "2(x + 3)",
        steps: [
          {
            say: "Drop the 2 onto the brackets. It multiplies both terms.",
            then: "2x + 2·3",
          },
          { say: "Now drop the 2 in 2·3 onto the 3.", then: "2x + 6" },
        ],
      },
    },
    {
      title: "A minus in front",
      text: ["`−(x − 4)` means `−1` times the brackets. The −1 multiplies every term, so every sign inside changes."],
      example: {
        start: "-(x - 4)",
        steps: [{ say: "Drop the minus onto the brackets.", then: "-x + 4" }],
      },
      watch: "A common mistake is writing `−(x − 4)` as `−x − 4`. The minus multiplies the 4 too.",
    },
    {
      title: "Taking a factor out",
      text: ["Going backwards is called factoring. If every term has a factor of 3, you can take the 3 out in front of brackets: `3x + 3y = 3(x + y)`."],
      example: {
        start: "3x + 3y",
        steps: [
          {
            say: "Both terms have a 3. Drag one 3 out in front, past the left end.",
            then: "3(x + y)",
          },
        ],
        after: "Expand it again and you get 3x + 3y.",
      },
    },
    {
      title: "x times x",
      text: [
        "Sometimes a letter is multiplied by itself: `x(x + 2)` gives `x·x`. We write this as `x²` (x squared). A square with sides x has area `x·x`.",
      ],
      example: {
        start: "x(x + 2)",
        steps: [
          { say: "Drop the x onto the brackets.", then: "x·x + x·2" },
          { say: "Drop one x onto the other.", then: "x^2 + 2x" },
        ],
      },
    },
  ],
  unlocks: ["distribute", "distribute-neg", "factor-out", "merge-powers"],
};
