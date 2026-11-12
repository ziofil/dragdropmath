import type { Chapter } from "../puzzles";

export const fractions: Chapter = {
  id: "fractions",
  title: "Fractions",
  blurb:
    "To add fractions, first make the bottoms the same. Multiplying the top and bottom by the same number doesn't change a fraction's value.",
  after: ["factor", "formulas"],
  lesson: [
    {
      title: "Adding fractions",
      text: [
        "`3/4` means 3 quarters. When the bottoms are the same, you just add the tops: 1 fifth plus 2 fifths is 3 fifths, so `1/5 + 2/5 = 3/5`.",
      ],
      example: {
        start: "1/5 + 2/5",
        steps: [
          {
            say: "The bottoms are the same. Drop one fraction onto the other.",
            then: "(1 + 2)/5",
          },
          { say: "Work it out.", then: "3/5" },
        ],
      },
    },
    {
      title: "Equivalent fractions",
      text: [
        "Dividing the top and bottom by the same number doesn't change the value: `6/8 = 3/4`.",
        "Multiplying the top and bottom by the same number doesn't change it either: `1/2 = 2/4 = 3/6`.",
      ],
      example: {
        start: "6/8",
        steps: [
          {
            say: "Drop the 8 onto the 6. Both are divided by their common factor, 2.",
            then: "3/4",
          },
        ],
      },
    },
    {
      title: "Making the bottoms the same",
      text: [
        "To add `1/2 + 1/3`, turn both into sixths first. Multiply the top and bottom of `1/2` by 3, and the top and bottom of `1/3` by 2. Now both bottoms are 6.",
      ],
      example: {
        start: "1/2 + 1/3",
        steps: [
          {
            say: "Drag the 3 from ⅓ onto ½: its top and bottom are multiplied by 3.",
            then: "(1·3)/(2·3) + 1/3",
          },
        ],
      },
      watch: "`1/2 + 1/3` is not `2/5`. Tops only add when the bottoms are already the same.",
    },
    {
      title: "Multiplying fractions",
      text: ["Multiplying is simpler: multiply the tops, and multiply the bottoms. Half of a third is `(1·1)/(2·3) = 1/6`."],
      example: {
        start: "(2/3)·(9/4)",
        steps: [{ say: "Drop one fraction onto the other.", then: "(2·9)/(3·4)" }],
        after: "Then cancel the common factors of the top and bottom to get 3/2.",
      },
    },
  ],
  unlocks: ["expand-fraction", "add-fractions", "split-fraction", "multiply-fractions", "divide-by-fraction", "times-one"],
  puzzles: [
    { id: "f1", start: "6/8", goal: "3/4", hint: "Drop the 8 onto the 6." },
    { id: "f19", start: "10/15", goal: "2/3" },
    {
      id: "f2",
      start: "1/5 + 2/5",
      goal: "3/5",
      hint: "Same bottoms: drop one fraction onto the other.",
    },
    {
      id: "f6",
      start: "(x + 2)/2",
      goal: "x/2 + 1",
      hint: "Pull the 2 out of the top.",
    },
    { id: "f10", start: "x/3 + x/3", goal: "(2x)/3" },
    { id: "f11", start: "1/x + 2/x", goal: "3/x" },
    { id: "f12", start: "2/3 + 1/3", goal: "1" },
    { id: "f13", start: "3/4 - 1/4", goal: "1/2" },
    { id: "f5", start: "2 + 1/3", goal: "7/3", hint: "Drag the 3 onto the 2." },
    { id: "f20", start: "2 - 1/3", goal: "5/3" },
    { id: "f7", start: "(x/3)·(6/x)", goal: "2" },
    { id: "f9", start: "x/2 = 3/4", goal: "x = 3/2" },
    { id: "f14", start: "(2/3)·(9/4)", goal: "3/2" },
    { id: "f21", start: "(3/5)·(10/9)", goal: "2/3" },
    { id: "f15", start: "(2x + 4)/2", goal: "x + 2" },
    {
      id: "f22",
      start: "(a^2 + 3a)/(a + 3)",
      goal: "a",
      hint: "Factor the top first. Then top and bottom share something you can cancel.",
    },
    { id: "f16", start: "x/4 = 3/2", goal: "x = 6" },
    {
      id: "f8",
      start: "(1/2)/(3/4)",
      goal: "2/3",
      hint: "Drag ¾ up across the bar.",
    },
    { id: "f23", start: "(3y + 3)/(y^2 + y)", goal: "3/y" },
    {
      id: "f3",
      start: "1/2 + 1/3",
      goal: "5/6",
      hint: "Drag the 3 onto ½, and the 2 onto ⅓, to make the bottoms match.",
    },
    {
      id: "f4",
      start: "1/3 + 1/6",
      goal: "1/2",
      hint: "Tap the 6 to split it into factors.",
    },
    {
      id: "f17",
      start: "1/2 + 1/4",
      goal: "3/4",
      hint: "Tap the 4 to split it. 4 is 2·2.",
    },
    { id: "f18", start: "x/2 + x/3", goal: "(5x)/6" },
    { id: "f24", start: "2/3 - 1/4", goal: "5/12" },
    { id: "f25", start: "(n^2 - 4n)/(2n - 8)", goal: "n/2", via: ["(n*(n - 4))/(2*n - 8)"] },
    { id: "f26", start: "(2x + 6)/3 = 4", goal: "x = 3" },
    { id: "f27", start: "x/2 = 1 + 1/2", goal: "x = 3" },
    { id: "f29", start: "(k^2 + 2k)/k = 5", goal: "k = 3" },
    {
      id: "f28",
      start: "(1 + 1/2)·(2/3)",
      goal: "1",
      hint: "Turn 1 + ½ into a single fraction first.",
    },
    { id: "f30", start: "((x + 1)^2 - 1)/x", goal: "x + 2" },
  ],
};
