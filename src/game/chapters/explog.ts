import type { Chapter } from "../puzzles";

export const explog: Chapter = {
  id: "explog",
  title: "Exponentials and logarithms",
  blurb: "ln asks “e to the what?”. So ln and e^ undo each other — and logs turn × into +.",
  after: ["roots"],
  lesson: [
    {
      title: "ln asks: e to the what?",
      text: [
        "`e` is a special number, about 2.718. `ln(x)` asks: e to what power gives x? So `ln(e³) = 3`.",
        "That makes ln and e^ opposites. Each undoes the other: `e^(ln x) = x`.",
      ],
      example: {
        start: "e^(ln(x))",
        steps: [{ say: "Drop the e onto the ln: they undo each other.", then: "x" }],
      },
    },
    {
      title: "Logs turn × into +",
      text: ["Multiplying powers of e adds their exponents. So the log of a product is a sum of logs: `ln(2x) = ln(2) + ln(x)`."],
      example: {
        start: "ln(2x)",
        steps: [
          {
            say: "Pull the 2 out of the ln. It takes its own ln with it.",
            then: "ln(2) + ln(x)",
          },
        ],
      },
    },
    {
      title: "Powers come out in front",
      text: ["`x³` is `x·x·x`, so `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
      example: {
        start: "ln(x^3)",
        steps: [{ say: "Carry the 3 out in front of the ln.", then: "3ln(x)" }],
      },
    },
    {
      title: "Solving with logs",
      text: ["To get x out of an exponent, take ln of both sides. From `e^x = 5`, the e crosses the = and becomes ln: `x = ln(5)`."],
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
  puzzles: [
    {
      id: "l2",
      start: "e^(ln(x))",
      goal: "x",
      hint: "Drop the e onto the ln.",
    },
    {
      id: "l3",
      start: "ln(2x)",
      goal: "ln(2) + ln(x)",
      hint: "Drop the ln onto what's inside it.",
    },
    {
      id: "l4",
      start: "ln(x^3)",
      goal: "3ln(x)",
      hint: "Carry the 3 out in front.",
    },
    { id: "l5", start: "ln(a) + ln(b)", goal: "ln(ab)" },
    { id: "l19", start: "ln(p) - ln(q)", goal: "ln(p/q)", hint: "Subtracting logs divides what's inside." },
    {
      id: "l8",
      start: "e^x = 5",
      goal: "x = ln(5)",
      hint: "Drag the e across the = sign.",
    },
    { id: "l20", start: "2^t = 5", goal: "t = log_2(5)", hint: "Same move as with e — but a 2 becomes log₂." },
    { id: "l9", start: "ln(x) = 2", goal: "x = e^2" },
    {
      id: "l12",
      start: "ln(√x)",
      goal: "(1/2)ln(x)",
      hint: "A root is a power — carry the √ out in front.",
    },
    { id: "l15", start: "ln(1)", goal: "0", hint: "e to what power gives 1?" },
    { id: "l6", start: "2ln(x) + ln(y)", goal: "ln(x^2·y)" },
    { id: "l10", start: "e^(2x) = 7", goal: "x = ln(7)/2" },
    { id: "l13", start: "ln(x^3) - ln(x)", goal: "2ln(x)" },
    { id: "l16", start: "ln(x^2) + ln(x)", goal: "3ln(x)" },
    {
      id: "l1",
      start: "ln(e^x)",
      goal: "x",
      hint: "Carry the x out in front of the ln. What is ln(e)?",
    },
    { id: "l18", start: "ln(e^3)", goal: "3" },
    { id: "l21", start: "log_2(y) = 3", goal: "y = 8" },
    { id: "l17", start: "e^(x + 1) = 5", goal: "x = ln(5) - 1" },
    {
      id: "l14",
      start: "e^((1/2)ln(x))",
      goal: "√x",
      hint: "Drop the ½ into the ln first.",
    },
    {
      id: "l7",
      start: "log_2(8)",
      goal: "3",
      hint: "Tap the 8 to write it as a power of 2. Then carry the 3 out in front, and tap log₂(2).",
    },
    { id: "l22", start: "e^(2a)·e^a = 8", goal: "a = ln(8)/3", hint: "Same base: the exponents add." },
    { id: "l23", start: "ln(x/e) = 2", goal: "x = e^3", hint: "Split the ln first. What is ln(e)?" },
    { id: "l24", start: "log_2(√x) = 3", goal: "x = 64" },
    { id: "l11", start: "ln(x) + ln(3) = ln(12)", goal: "x = 4" },
    { id: "l25", start: "log_3(n) + log_3(9) = 3", goal: "n = 3" },
    { id: "l26", start: "2·3^x = 54", goal: "x = 3", hint: "Get the power on its own first." },
    { id: "l27", start: "(2^x)^2 = 64", goal: "x = 3" },
    { id: "l28", start: "2^y·2^3 = 32", goal: "y = 2" },
    { id: "l29", start: "2^(2x - 1) = 8", goal: "x = 2" },
    { id: "l30", start: "3(2^x)^2 = 48", goal: "x = 2" },
  ],
};
