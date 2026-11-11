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
      text: [
        "To get x out of `√x = 3`, square both sides. Tap the root to see it as the power `x^(1/2)`, then carry the ½ across the =: on the other side it becomes a square.",
      ],
      example: {
        start: "√x = 3",
        steps: [
          { say: "Tap the root to see it as a power.", then: "x^(1/2) = 3" },
          { say: "Carry the ½ across the =: it turns into a square.", then: "x = 3^2" },
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
    { id: "r16", start: "2√3 + √3", goal: "3√3", hint: "√3 works just like a letter: two of them plus one more." },
    { id: "r17", start: "√x(√x + 1)", goal: "x + √x" },
    {
      id: "r1",
      start: "√9",
      goal: "3",
      hint: "Tap the 9 to split it into 3·3, then pull one 3 out of the root.",
    },
    { id: "r13", start: "√16", goal: "4" },
    {
      id: "r8",
      start: "√x = 3",
      goal: "x = 9",
      hint: "Tap the root to see it as a power, then carry the ½ across the = sign.",
    },
    { id: "r9", start: "√x = 5", goal: "x = 25" },
    { id: "r7", start: "(√x)^4", goal: "x^2" },
    { id: "r6", start: "√(x^2)", goal: "x", hint: "Tap the root to see it as a power of ½, then drop the ½ onto the 2." },
    { id: "r18", start: "√(x^2·y)", goal: "x√y" },
    { id: "r10", start: "√(x^4)", goal: "x^2" },
    {
      id: "r3",
      start: "√(4x)",
      goal: "2√x",
      hint: "Pull the 4 out of the root — it takes its own √ with it.",
    },
    { id: "r14", start: "√(9x)", goal: "3√x" },
    { id: "r19", start: "(√x + 1)(√x - 1)", goal: "x - 1" },
    { id: "r20", start: "√(x^3)", goal: "x√x", hint: "x³ is x²·x, and x² comes out of the root as x." },
    {
      id: "r11",
      start: "2√x = 6",
      goal: "x = 9",
      hint: "Get the √x on its own first.",
    },
    {
      id: "r4",
      start: "√12",
      goal: "2√3",
      hint: "Tap the 12 to split off a perfect square.",
    },
    { id: "r15", start: "√8", goal: "2√2" },
    { id: "r21", start: "(√x + 1)^2", goal: "x + 2√x + 1" },
    { id: "r22", start: "√(4x) + √x", goal: "3√x", hint: "Pull the 4 out first: then the √x's are like terms." },
    { id: "r23", start: "(2√x)^2 = 12", goal: "x = 3" },
    { id: "r24", start: "√x·√(4x)", goal: "2x" },
    { id: "r25", start: "√(x + 1)/2 = 2", goal: "x = 15" },
    { id: "r26", start: "√12 + √3", goal: "3√3" },
    { id: "r27", start: "√(2x + 5) = 3", goal: "x = 2" },
    { id: "r28", start: "2√(x - 1) = 6", goal: "x = 10" },
    { id: "r29", start: "√(8x^2)", goal: "2x√2", hint: "Split the 8 to find a perfect square inside." },
    { id: "r30", start: "√(9x^2) = 6", goal: "x = 2" },
  ],
};
