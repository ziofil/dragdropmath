import type { RuleId } from "../rules";

export type Puzzle = {
  id: string;
  start: string;
  goal: string;
  hint?: string;
};

export type Chapter = {
  id: string;
  title: string;
  blurb: string;
  /** Rules this chapter unlocks; earlier chapters' rules stay available. */
  unlocks: RuleId[];
  puzzles: Puzzle[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: "shuffle",
    title: "Shuffle & squash",
    blurb: "Terms slide past each other freely. Numbers that touch can be squashed together.",
    unlocks: ["commute", "combine", "multiply-numbers", "numbers-first"],
    puzzles: [
      { id: "s1", start: "2 + x", goal: "x + 2", hint: "Grab the 2 and slide it past the x." },
      { id: "s2", start: "3 + x + 4", goal: "x + 7", hint: "Drop the 4 onto the 3." },
      { id: "s3", start: "2·x·5", goal: "10x", hint: "Numbers that multiply can be dropped on each other." },
      { id: "s4", start: "4 + x + 1 + 2", goal: "x + 7" },
      { id: "s5", start: "1 + 2y + 3", goal: "2y + 4" },
      { id: "s6", start: "3·y·2 + 1 + x", goal: "x + 6y + 1" },
    ],
  },
  {
    id: "collect",
    title: "Collect like terms",
    blurb: "3 apples + 2 apples = 5 apples. Terms with the same letters merge; opposites vanish.",
    unlocks: ["merge-powers"],
    puzzles: [
      { id: "c1", start: "3x + 2x", goal: "5x" },
      { id: "c2", start: "x + 4 + x", goal: "2x + 4" },
      { id: "c3", start: "5y - 2y + 3", goal: "3y + 3" },
      { id: "c4", start: "a + b - a", goal: "b", hint: "Something minus itself is nothing." },
      { id: "c5", start: "2x + 3 + 4x - 1", goal: "6x + 2" },
      { id: "c6", start: "x·x + 3x", goal: "x^2 + 3x", hint: "x times x has a shorter name — drop one x on the other." },
      { id: "c7", start: "x^2 + 3x + 2x^2 - x", goal: "3x^2 + 2x" },
    ],
  },
  {
    id: "distribute",
    title: "Distribute & factor",
    blurb: "A factor outside brackets visits every term inside — and can be pulled back out.",
    unlocks: ["distribute", "distribute-neg", "factor-out"],
    puzzles: [
      { id: "d1", start: "a(b + c)", goal: "ab + ac", hint: "Drop the a onto the brackets." },
      { id: "d2", start: "2(x + 3)", goal: "2x + 6" },
      { id: "d3", start: "ab + ac", goal: "a(b + c)", hint: "Pull an a out of either term." },
      { id: "d4", start: "3x + 3y", goal: "3(x + y)" },
      { id: "d5", start: "xy + x", goal: "x(y + 1)" },
      { id: "d6", start: "-(x - 4)", goal: "4 - x", hint: "Drop the minus onto the brackets." },
      { id: "d7", start: "2(x + 1) + 3(x - 1)", goal: "5x - 1" },
      { id: "d8", start: "x(x + 2) - 2x", goal: "x^2" },
    ],
  },
  {
    id: "balance",
    title: "Keep it balanced",
    blurb: "An equation is a balance. Whatever crosses the = changes into its opposite.",
    unlocks: ["move-term", "move-factor", "move-denominator", "move-sign", "divide-numbers", "cancel-factor"],
    puzzles: [
      { id: "b1", start: "x + 3 = 10", goal: "x = 7", hint: "Drag the 3 across the = sign." },
      { id: "b2", start: "2x = 8", goal: "x = 4" },
      { id: "b3", start: "x - 5 = 2", goal: "x = 7" },
      { id: "b4", start: "-x = 6", goal: "x = -6" },
      { id: "b5", start: "x/3 = 4", goal: "x = 12" },
      { id: "b6", start: "3x + 1 = 13", goal: "x = 4" },
      { id: "b7", start: "2(x + 1) = 10", goal: "x = 4", hint: "There's a shortcut: deal with the 2 first." },
      { id: "b8", start: "5x - 2 = 3x + 6", goal: "x = 4" },
    ],
  },
  {
    id: "fractions",
    title: "Fractions",
    blurb: "You can only add slices of the same size. So first make the bottoms match — multiplying top and bottom by the same thing changes nothing.",
    unlocks: ["split-number", "expand-fraction", "add-fractions", "split-fraction", "multiply-fractions", "divide-by-fraction", "times-one"],
    puzzles: [
      { id: "f1", start: "6/8", goal: "3/4", hint: "Drop the 8 onto the 6." },
      { id: "f2", start: "1/5 + 2/5", goal: "3/5", hint: "Same bottoms: drop one fraction onto the other." },
      { id: "f3", start: "1/2 + 1/3", goal: "5/6", hint: "Drag the 3 onto ½, and the 2 onto ⅓, to make the bottoms match." },
      { id: "f4", start: "1/3 + 1/6", goal: "1/2", hint: "Tap the 6 to split it — you only need part of it." },
      { id: "f5", start: "2 + 1/3", goal: "7/3", hint: "Drag the 3 onto the 2." },
      { id: "f6", start: "(x + 2)/2", goal: "x/2 + 1", hint: "Pull the 2 out of the top." },
      { id: "f7", start: "(x/3)·(6/x)", goal: "2" },
      { id: "f8", start: "(1/2)/(3/4)", goal: "2/3", hint: "Carry ¾ up across the bar." },
      { id: "f9", start: "x/2 = 3/4", goal: "x = 3/2" },
    ],
  },
  {
    id: "powers",
    title: "Powers",
    blurb: "x³ is just x·x·x. Count the x's and the rules for exponents write themselves.",
    unlocks: ["power-of-power", "zero-power", "evaluate-power", "divide-powers", "flip-across-bar", "power-one", "pull-out-of-power", "power-of-product"],
    puzzles: [
      { id: "w1", start: "x^2·x^3", goal: "x^5", hint: "Same base: drop one power onto the other, then add up the exponents." },
      { id: "w2", start: "(x^2)^3", goal: "x^6", hint: "Drop the outer 3 onto the inner 2, then multiply." },
      { id: "w3", start: "(2x)^3", goal: "8x^3", hint: "Pull the 2 out of the brackets — it takes its own ³." },
      { id: "w4", start: "x^5/x^2", goal: "x^3" },
      { id: "w5", start: "x^3/x^5", goal: "x^-2", hint: "Exponents can go below zero." },
      { id: "w6", start: "1/x^3", goal: "x^-3", hint: "Carry the x³ up across the fraction bar." },
      { id: "w7", start: "x^-2·x^5", goal: "x^3" },
      { id: "w8", start: "x^0 + 4", goal: "5" },
      { id: "w9", start: "(x^2·y)^3/y", goal: "x^6·y^2" },
    ],
  },
  {
    id: "roots",
    title: "Roots",
    blurb: "√x is x to the power ½ — so every power move works on roots, and the fractions do the rest.",
    unlocks: ["root-notation", "split-square", "root-across"],
    puzzles: [
      { id: "r1", start: "√9", goal: "3", hint: "Tap the 9 to split it into 3·3, then pull one 3 out of the root." },
      { id: "r2", start: "x^(1/2)", goal: "√x", hint: "Tap it." },
      { id: "r3", start: "√(4x)", goal: "2√x", hint: "Pull the 4 out of the root — it takes its own √ with it." },
      { id: "r4", start: "√12", goal: "2√3", hint: "Tap the 12 to split off a perfect square." },
      { id: "r5", start: "√x·√x", goal: "x", hint: "Same base: drop one onto the other. Then it's fractions." },
      { id: "r6", start: "√(x^2)", goal: "x", hint: "Drop the √ onto the 2." },
      { id: "r7", start: "(√x)^4", goal: "x^2" },
      { id: "r8", start: "√x = 3", goal: "x = 9", hint: "Carry the √ across the = sign." },
    ],
  },
  {
    id: "explog",
    title: "Exp & log",
    blurb: "ln asks “e to the what?”. So ln and e^ undo each other — and logs turn × into +.",
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
      { id: "l1", start: "ln(e^x)", goal: "x", hint: "Carry the x out in front of the ln. What is ln(e)?" },
      { id: "l2", start: "e^(ln(x))", goal: "x", hint: "Drop the e onto the ln." },
      { id: "l3", start: "ln(2x)", goal: "ln(2) + ln(x)", hint: "Drop the ln onto what's inside it." },
      { id: "l4", start: "ln(x^3)", goal: "3ln(x)", hint: "Carry the 3 out in front." },
      { id: "l5", start: "ln(a) + ln(b)", goal: "ln(ab)" },
      { id: "l6", start: "2ln(x) + ln(y)", goal: "ln(x^2·y)" },
      { id: "l7", start: "log_2(8)", goal: "3", hint: "Tap the 8 to write it as a power of 2. Then carry the 3 out in front, and tap log₂(2)." },
      { id: "l8", start: "e^x = 5", goal: "x = ln(5)", hint: "Drag the e across the = sign." },
      { id: "l9", start: "ln(x) = 2", goal: "x = e^2" },
      { id: "l10", start: "e^(2x) = 7", goal: "x = ln(7)/2" },
      { id: "l11", start: "ln(x) + ln(3) = ln(12)", goal: "x = 4" },
      { id: "l12", start: "ln(√x)", goal: "(1/2)ln(x)", hint: "A root is a power — carry the √ out in front." },
      { id: "l13", start: "ln(x^3) - ln(x)", goal: "2ln(x)" },
      { id: "l14", start: "e^((1/2)ln(x))", goal: "√x", hint: "Drop the ½ into the ln first." },
    ],
  },
];

export type PuzzleRef = { chapter: Chapter; puzzle: Puzzle; index: number; rules: RuleId[]; label: string };

/** "Exercise N.M": set N, exercise M within it (both from 1). */
export const exerciseLabel = (chapterIndex: number, index: number) => `${chapterIndex + 1}.${index + 1}`;

export function allPuzzles(): PuzzleRef[] {
  const out: PuzzleRef[] = [];
  const rules: RuleId[] = [];
  for (const [ci, chapter] of CHAPTERS.entries()) {
    rules.push(...chapter.unlocks);
    chapter.puzzles.forEach((puzzle, index) =>
      out.push({ chapter, puzzle, index, rules: [...rules], label: exerciseLabel(ci, index) }),
    );
  }
  return out;
}

export function findPuzzle(id: string): PuzzleRef | undefined {
  return allPuzzles().find((p) => p.puzzle.id === id);
}
