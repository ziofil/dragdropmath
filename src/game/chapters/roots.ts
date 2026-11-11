import type { Chapter } from "../puzzles";

export const roots: Chapter = {
  id: "roots",
  title: "Roots",
  blurb: "√x is x to the power ½ — so every power move works on roots, and the fractions do the rest.",
  after: ["powers", "fractions"],
  lesson: [
    {
      title: "What a root asks",
      text: ["`√9` asks: what times itself makes 9? It's 3, since `3·3 = 9`."],
      example: {
        start: "√9",
        steps: [{ say: "Tap the 9 to split it into equal factors.", then: "√(3·3)" }],
        after: "Then pull one 3 out of the root and see what's left.",
      },
    },
    {
      title: "A root is a power",
      text: [
        "`√x` is `x` to the power `½`. Two halves make a whole, so `√x·√x = x^(1/2 + 1/2) = x`. Everything you know about powers works on roots.",
      ],
      example: {
        start: "x^(1/2)",
        steps: [{ say: "Tap it: a power of ½ is a square root.", then: "√x" }],
      },
    },
    {
      title: "Roots split over products",
      text: ["Because a root is a power, it splits over a product: `√(4x) = √4·√x = 2√x`."],
      example: {
        start: "√(4x)",
        steps: [
          {
            say: "Pull the 4 out of the root. It takes its own √ with it.",
            then: "√4·√x",
          },
        ],
        after: "And √4 is 2, so it's 2√x.",
      },
      watch: "A root does not split over a sum: `√(9 + 16)` is `√25 = 5`, not `3 + 4`.",
    },
    {
      title: "Undoing a root",
      text: ["To get x out of `√x = 3`, square both sides. The √ crosses the = and becomes a square on the other side."],
      example: {
        start: "√x = 3",
        steps: [
          { say: "Carry the √ across the =.", then: "x = 3^2" },
          { say: "Work it out.", then: "x = 9" },
        ],
      },
    },
  ],
  unlocks: ["root-notation", "split-square", "root-across"],
  puzzles: [
    { id: "r2", start: "x^(1/2)", goal: "√x", hint: "Tap it." },
    {
      id: "r5",
      start: "√x·√x",
      goal: "x",
      hint: "Drop one √x onto the other: a square root times itself gives back what's inside.",
    },
    { id: "r12", start: "√2·√2", goal: "2" },
    {
      id: "r8",
      start: "√x = 3",
      goal: "x = 9",
      hint: "Carry the √ across the = sign.",
    },
    { id: "r9", start: "√x = 5", goal: "x = 25" },
    { id: "r7", start: "(√x)^4", goal: "x^2" },
    { id: "r10", start: "√(x^4)", goal: "x^2" },
    { id: "r6", start: "√(x^2)", goal: "x", hint: "Drop the √ onto the 2." },
    {
      id: "r11",
      start: "2√x = 6",
      goal: "x = 9",
      hint: "Get the √x on its own first.",
    },
    {
      id: "r1",
      start: "√9",
      goal: "3",
      hint: "Tap the 9 to split it into 3·3, then pull one 3 out of the root.",
    },
    { id: "r13", start: "√16", goal: "4" },
    {
      id: "r3",
      start: "√(4x)",
      goal: "2√x",
      hint: "Pull the 4 out of the root — it takes its own √ with it.",
    },
    { id: "r14", start: "√(9x)", goal: "3√x" },
    {
      id: "r4",
      start: "√12",
      goal: "2√3",
      hint: "Tap the 12 to split off a perfect square.",
    },
    { id: "r15", start: "√8", goal: "2√2" },
  ],
};
