import type { Chapter } from "../puzzles";

export const formulas: Chapter = {
  id: "formulas",
  title: "Rearranging formulas",
  blurb: "A formula is an equation with several letters. Use the same moves as for x to get one letter on its own.",
  after: ["balance"],
  lesson: [
    {
      title: "Making a letter the subject",
      text: [
        "`v = u + at` gives a speed `v` from a start speed `u`, an acceleration `a` and a time `t`. Rearranged, it gives the time instead: `t = (v − u)/a`.",
        "Getting one letter on its own is called making it the subject. It works like solving for x. Treat the other letters as numbers.",
      ],
      example: {
        start: "v = u + at",
        steps: [
          { say: "The t is multiplied by a. First drag the u across.", then: "v - u = at" },
          { say: "Now drag the a across. It divides the other side.", then: "(v - u)/a = t" },
        ],
        after: "Read it from right to left: t = (v − u)/a.",
      },
    },
    {
      title: "Letters move like numbers",
      text: [
        "A letter that multiplies a whole side can move across the `=` and divide the other side, just as `2x = 8` became `x = 8/2`. (You can only divide by a letter that isn't 0. In these formulas it never is.)",
      ],
      example: { start: "F = ma", steps: [{ say: "Drag the m across.", then: "F/m = a" }] },
      watch: "Only a factor of the whole side can move across. In `u + at` the `a` multiplies only the `t`, so move the `u` first.",
    },
    {
      title: "Letters on the bottom",
      text: [
        "If a whole side is a fraction, the letter on the bottom can move across and multiply the other side, just as `x/3 = 4` became `x = 4·3`.",
      ],
      example: { start: "P = F/A", steps: [{ say: "Drag the A across. It multiplies the other side.", then: "PA = F" }] },
    },
    {
      title: "When the letter is in two places",
      text: [
        "In `ax + bx = c`, x appears twice, so moving one term won't get x on its own. Take the x out as a factor first. Then the bracket it's multiplied by can move across.",
      ],
      example: {
        start: "ax + bx = c",
        steps: [
          { say: "Both terms have an x. Drag one x out in front.", then: "x(a + b) = c" },
          { say: "Now drag the whole (a + b) across.", then: "x = c/(a + b)" },
        ],
      },
    },
  ],
  unlocks: ["move-letter-factor", "move-letter-denominator"],
};
