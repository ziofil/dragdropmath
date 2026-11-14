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
};
