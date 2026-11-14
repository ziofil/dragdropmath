import type { Chapter } from "../puzzles";

export const explog: Chapter = {
  id: "explog",
  title: "Exponentials and logarithms",
  blurb: "ln(x) is the power of e that gives x. So ln and e^ undo each other, and the log of a product is a sum of logs.",
  after: ["roots"],
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
