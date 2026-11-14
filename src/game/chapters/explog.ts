import type { Chapter } from "../puzzles";

export const explog: Chapter = {
  id: "explog",
  title: "Exponentials and logarithms",
  blurb: "ln(x) is the power of e that gives x. So ln and e^ undo each other, and the log of a product is a sum of logs.",
  after: ["roots"],
  lesson: [
    {
      title: "What ln means",
      text: [
        "`e` is a special number, about 2.718. `ln(x)` is the power of e that gives x. So `ln(e³) = 3`.",
        "This means ln and e^ undo each other: `e^(ln x) = x`.",
      ],
      example: {
        start: "e^(ln(x))",
        steps: [{ say: "Drop the e onto the ln. They undo each other.", then: "x" }],
      },
    },
    {
      title: "The log of a product",
      text: ["Multiplying powers of e adds their exponents. So the log of a product is a sum of logs: `ln(2x) = ln(2) + ln(x)`."],
      example: {
        start: "ln(2x)",
        steps: [
          {
            say: "Pull the 2 out of the ln. It gets its own ln.",
            then: "ln(2) + ln(x)",
          },
        ],
      },
    },
    {
      title: "The log of a power",
      text: ["`x³` is `x·x·x`, so `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
      example: {
        start: "ln(x^3)",
        steps: [{ say: "Drag the 3 out in front of the ln.", then: "3ln(x)" }],
      },
    },
    {
      title: "Solving with logs",
      text: ["To get x out of an exponent, take ln of both sides. From `e^x = 5`, drag the e across the =. It becomes ln: `x = ln(5)`."],
      example: {
        start: "e^x = 5",
        steps: [{ say: "Drag the e across the =.", then: "x = ln(5)" }],
      },
    },
  ],
  unlocks: [
    "exp-of-log",
    "log-of-product",
    "log-of-power",
    "power-into-log",
    "combine-logs",
    "evaluate-log",
    "power-of-base",
    "exp-across",
    "log-across",
  ],
};
