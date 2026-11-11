import type { Chapter } from "../puzzles";

export const formulas: Chapter = {
  id: "formulas",
  title: "Rearranging formulas",
  blurb: "A formula is an equation full of letters. Get the letter you want on its own, with the same moves as for x.",
  after: ["balance"],
  lesson: [
    {
      title: "Making a letter the subject",
      text: [
        "`v = u + at` gives a speed `v` from a start speed `u`, an acceleration `a` and a time `t`. Turned round, it tells you the time instead: `t = (v − u)/a`.",
        "Getting one letter alone on one side is called making it the subject. It works exactly like solving for x: the other letters are just numbers you don't know.",
      ],
      example: {
        start: "v = u + at",
        steps: [
          { say: "The t is buried in at. First carry the u across.", then: "v - u = at" },
          { say: "Now carry the a across: it divides the other side.", then: "(v - u)/a = t" },
        ],
        after: "t = (v − u)/a, with the sides read the other way round.",
      },
    },
    {
      title: "Letters cross like numbers",
      text: [
        "A letter multiplying a whole side can cross the `=` and divide the other side, just as `2x = 8` became `x = 8/2`. (Dividing by a letter only makes sense when it isn't 0. In formulas like these it never is.)",
      ],
      example: { start: "F = ma", steps: [{ say: "Carry the m across.", then: "F/m = a" }] },
      watch: "Only a factor of the whole side can cross. In `u + at` the `a` multiplies the `t` alone: move the `u` away first.",
    },
    {
      title: "Bottoms cross too",
      text: [
        "A letter on the bottom of a fraction that is a whole side crosses to multiply the other side, like `x/3 = 4` became `x = 4·3`.",
      ],
      example: { start: "P = F/A", steps: [{ say: "Carry the A across: it multiplies.", then: "PA = F" }] },
    },
    {
      title: "When the letter is in two places",
      text: [
        "In `ax + bx = c`, x appears twice, so neither term can be moved to free it. Take the x out in front first: then everything it's multiplied by is one bracket, and that can cross.",
      ],
      example: {
        start: "ax + bx = c",
        steps: [
          { say: "Both terms have an x. Carry one x out in front.", then: "x(a + b) = c" },
          { say: "Now carry the whole (a + b) across.", then: "x = c/(a + b)" },
        ],
      },
    },
  ],
  unlocks: ["move-letter-factor", "move-letter-denominator"],
  puzzles: [
    { id: "q1", start: "F = ma", goal: "a = F/m" },
    { id: "q2", start: "V = IR", goal: "R = V/I" },
    { id: "q3", start: "d = st", goal: "t = d/s" },
    { id: "q4", start: "y = x + c", goal: "x = y - c" },
    { id: "q5", start: "a = b - c", goal: "b = a + c" },
    { id: "q6", start: "P = F/A", goal: "F = PA", hint: "The A is on the bottom: carry it across." },
    { id: "q7", start: "E = mc^2", goal: "m = E/c^2" },
    { id: "q8", start: "v = u + at", goal: "t = (v - u)/a", hint: "Move the u away first, then the a." },
    { id: "q9", start: "y = mx + c", goal: "x = (y - c)/m" },
    { id: "q10", start: "2a + b = c", goal: "a = (c - b)/2" },
    { id: "q11", start: "A = (bh)/2", goal: "h = (2A)/b" },
    { id: "q12", start: "a = (v - u)/t", goal: "v = at + u" },
    { id: "q13", start: "T = 2(a + b)", goal: "a = T/2 - b" },
    { id: "q14", start: "m(v - u) = I", goal: "v = I/m + u" },
    { id: "q15", start: "P = V^2/R", goal: "R = V^2/P" },
    { id: "q16", start: "px + qx = r", goal: "x = r/(p + q)", hint: "x is in two places: take it out in front first." },
    { id: "q17", start: "A = P + Prt", goal: "P = A/(1 + rt)", hint: "P is in both terms." },
    { id: "q18", start: "F = (9C)/5 + 32", goal: "C = (5(F - 32))/9" },
    { id: "q19", start: "v^2 = u^2 + 2as", goal: "s = (v^2 - u^2)/(2a)" },
    { id: "q20", start: "2x + a = x + b", goal: "x = b - a" },
    { id: "q21", start: "3(x + y) = 2x + z", goal: "x = z - 3y" },
    { id: "q22", start: "ax + b = cx + d", goal: "x = (d - b)/(a - c)", hint: "Get both x-terms on one side, then take the x out." },
    { id: "q23", start: "(2x - a)/3 = a", goal: "x = 2a" },
    { id: "q24", start: "k(x - 1) = x", goal: "x = k/(k - 1)" },
    { id: "q25", start: "a(x + 1) = 2x + b", goal: "x = (b - a)/(a - 2)" },
    { id: "q26", start: "(x + 3a)/2 = x - a", goal: "x = 5a" },
    { id: "q27", start: "2(x + b) - 3b = x + 4b", goal: "x = 5b" },
    { id: "q28", start: "5(x - c) = 3x + c", goal: "x = 3c" },
    { id: "q29", start: "3(x - 2a) = x + 4a", goal: "x = 5a" },
    { id: "q30", start: "3x + 2a = 5(x - 2a)", goal: "x = 6a" },
  ],
};
