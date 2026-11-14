/**
 * Every interface string, in English: the source for the other languages.
 * Functions build a sentence around numbers or names (each language orders
 * and inflects them its own way). `backticks` mark maths where MathText is used.
 */
export const en = {
  /** <html lang>, and the page title. */
  htmlLang: "en",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Language",

  // Top bar
  makeExercises: "Make exercises",
  /** Any expression, every move: the page, its link on the home page, and its input. */
  sandbox: "Sandbox",
  openSandbox: "Open the sandbox →",
  sandboxIntro: "Type any expression or equation and play with every move.",
  sandboxInput: "Expression or equation",
  sandboxPlaceholder: "e.g. 3(x - 2) = 2x + 1   or   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Load",
  debugOn: "Debug mode is on (Shift+D)",

  // Home
  /** "Algebra you can feel.": the word is drawn with letters you can drag. Keep it one short word. */
  heroBefore: "Algebra you can ",
  heroWord: "feel",
  heroAfter: ".",
  heroText: "Drag any part of an equation. It can only move in ways the maths allows. Rearrange it until it matches the goal.",
  learningPath: "Learning path",
  nextUp: "next up",
  mastered: "mastered",
  everyChapterOpen: "Every chapter is open. The arrows show a suggested order.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) => `Chapter ${n}: ${title}, ${done} of ${total} solved`,
  chapterN: (n: number) => `Chapter ${n}`,
  /** A list of names: "A", "A and B", "A, B and C". */
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Builds on ${titles}.`,
  notMasteredYet: (titles: string) => ` Not mastered yet: ${titles}. You can start anyway.`,
  startLesson: "Start the lesson →",
  backToLesson: "Back to the lesson →",
  leadsOnTo: (titles: string) => `Leads on to ${titles}.`,
  badges: "Badges",
  noBadgesYet: "Answer the test in any chapter to earn its badge.",
  badgesEarned: (n: number, total: number) => `${n} of ${total}`,
  /** A badge by its tier: 1 bronze, 2 silver, 3 gold. */
  tierBadge: (tier: 1 | 2 | 3) => `${["", "Bronze", "Silver", "Gold"][tier]} badge`,
  badgeNotEarned: "badge not earned yet",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) => `${chapter}: ${tier ? `${["", "bronze", "silver", "gold"][tier]} badge` : "not earned yet"}`,

  // Chapter page
  backToPath: "← Learning path",
  exercises: "Exercises",
  practiceNote: "Every exercise is new, made up just for you. Start with easy ones and move up when you feel ready.",
  /** Followed by the chapters' links, then leadsOnToEnd. */
  leadsOnToStart: "Leads on to ",
  leadsOnToEnd: ". You can go there any time.",
  watchOut: "Watch out.",
  level: { easy: "Easy", medium: "Medium", hard: "Hard" },
  anotherOne: "Another one →",
  learnMoves: "Learn the moves",
  learnMovesNote: "Each move on its own. Try one as many times as you like.",
  practice: "Practice",
  testSkills: "Test your skills",
  testNote: "Work out the answer in your head, then pick it. Right answers earn the chapter's badge: 10 at Easy for bronze, at Medium for silver, at Hard for gold.",
  /** How many practice exercises are solved at a level. */
  solvedN: (n: number) => `${n} solved`,
  toPractice: "On to practice →",
  testRight: "Right! It counts towards the badge.",
  /**
   * Learning the moves: each drill's name (on its button) and what to do (above
   * the goal). Keys are the drills of game/generate/moves.ts.
   */
  drills: {
    commute: { name: "Swap the order", how: "Drag a term past its neighbour. With + and ×, the order doesn't matter." },
    combine: { name: "Add numbers", how: "Drop one number onto the other to add them up." },
    "multiply-numbers": { name: "Multiply numbers", how: "Drop one number onto the other number it multiplies." },
    "numbers-first": { name: "Number in front", how: "Tap a product like `x·3` to write it the usual way, `3x`." },
    "multiply-out": { name: "Work out a product", how: "Tap a product of numbers, like `2·3`, to work it out." },
    collect: { name: "Collect like terms", how: "Drop a term onto a like term, one with the same letter. They add up." },
    "collect-cancel": { name: "Cancel opposites", how: "Drop a term onto its opposite. They cancel out." },
    distribute: { name: "Multiply out brackets", how: "Drop the number in front onto the brackets. It multiplies every term inside." },
    "distribute-neg": { name: "Minus before brackets", how: "Drop the minus onto the brackets. Every sign inside changes." },
    "factor-out": { name: "Take out a common factor", how: "Both terms share a factor. Drag one of them out in front, past the left end." },
    "x-times-x": { name: "x times x", how: "Drop one x onto the other. `x·x` is written `x²`." },
    "merge-powers": { name: "Same base: add exponents", how: "Drop one power onto the other with the same base. The exponents add up." },
    "power-to-product": { name: "A square as a product", how: "Tap the ² to write the brackets twice." },
    "move-term": { name: "Move a term across", how: "Drag the number across the =. Its sign changes on the way." },
    "move-factor": { name: "Divide both sides", how: "Drag the number in front of the letter across the =. It divides the other side." },
    "move-denominator": { name: "Multiply both sides", how: "Drag the bottom of the fraction across the =. It multiplies the other side." },
    "move-sign": { name: "Move a minus across", how: "Drag just the minus across the =. The other side changes sign." },
    "swap-sides": { name: "Swap the sides", how: "Drag one side across the = and past the far end. The two sides change places." },
    "evaluate-fraction": { name: "Work out a fraction", how: "Tap the fraction bar to work it out." },
    "divide-numbers": { name: "Simplify a fraction", how: "Drop the bottom number onto the top one. Both are divided by their common factor." },
    "cancel-factor": { name: "Cancel a common factor", how: "Drop the number on the bottom onto the same number on top. Both disappear." },
    "power-of-power": { name: "Power of a power", how: "Drop the outer exponent onto the inner one. They multiply." },
    "divide-powers": { name: "Same base: subtract exponents", how: "Drop the power on the bottom onto the one on top. The exponents subtract." },
    "flip-across-bar": { name: "Across the fraction bar", how: "Drag the power up across the bar. Its exponent changes sign." },
    "power-one": { name: "Power of 1", how: "Drop the exponent 1 onto its base: `x¹` is just `x`." },
    "zero-power": { name: "Power of 0", how: "Drop the exponent 0 onto its base. Anything to the power 0 is 1." },
    "tap-power": { name: "Work out a power", how: "Tap the exponent to work the power out: `2³` becomes 8." },
    "power-of-product": { name: "Exponent into brackets", how: "Drag the exponent into the brackets. Every factor inside gets its own copy." },
    "split-number": { name: "Split a number", how: "Tap the number to split it into two factors." },
    "factor-shared": { name: "Share a factor", how: "Drop the `x` of one term onto another term with an `x`. The two terms share it." },
    "move-letter-factor": { name: "Divide by a letter", how: "Drag one of the multiplied letters across the =. It divides the other side." },
    "move-letter-denominator": { name: "Multiply by a letter", how: "Drag the letter on the bottom across the =. It multiplies the other side." },
    "ineq-move-term": { name: "Move a term across", how: "Drag the number across the inequality sign. Its sign changes, and the inequality sign stays as it is." },
    "ineq-swap": { name: "Swap the sides", how: "Drag one side past the other. The inequality sign turns round with them." },
    "ineq-sign": { name: "Move a minus across", how: "Drag just the minus across. The inequality sign turns round." },
    "add-fractions": { name: "Add fractions", how: "The bottoms are the same: drop one fraction onto the other. The tops add up." },
    "expand-fraction": { name: "Same denominators", how: "Drag the bottom of one fraction onto the other fraction. Its top and bottom are both multiplied by it." },
    "multiply-fractions": { name: "Multiply fractions", how: "Drop one fraction onto the other. Tops multiply, and so do bottoms." },
    "divide-by-fraction": { name: "Divide by a fraction", how: "Drag the fraction on the bottom up across the bar. It turns upside down and multiplies." },
    "split-fraction": { name: "Split a fraction", how: "Pull a term out of the top. It takes a copy of the bottom with it." },
    "times-one": { name: "Times 1", how: "Drop the 1 onto what it multiplies. Multiplying by 1 changes nothing." },
    substitute: { name: "Substitute", how: "Drag the `y` of `y = …` onto the `y` in the other equation. It becomes what `y` equals." },
    "evaluate-root": { name: "Work out a root", how: "Tap the root to work it out." },
    "split-square": { name: "Split under a root", how: "Tap the number under the root. A square splits off (a cube, under a cube root)." },
    "pull-out-of-power": { name: "Split a root", how: "Pull the number out of the root. It gets its own root." },
    "root-notation": { name: "A root as a power", how: "Tap the root to write it as a power: √ is a power of ½, ∛ a power of ⅓." },
    "root-across": { name: "A root's power across the =", how: "Drag the ½ (or ⅓, or ¼) across the =. On the other side it becomes a square (or a cube, or a fourth power)." },
    "exp-of-log": { name: "A power undoes a log", how: "Drop the base onto the log in its exponent. They undo each other." },
    "evaluate-log": { name: "Logs you know", how: "Tap the log to work it out: `ln(e) = 1`, and the log of 1 is 0." },
    "power-of-base": { name: "As a power of the base", how: "Tap the number in the log to write it as a power of the log's base." },
    "log-of-product": { name: "Split a log", how: "Pull the number out of the log. It gets its own log." },
    "log-of-power": { name: "Exponent out of a log", how: "Drag the exponent out in front of the log." },
    "power-into-log": { name: "Number into a log", how: "Drop the number in front onto the log. It becomes an exponent inside." },
    "combine-logs": { name: "Combine logs", how: "Drop one log onto the other. Adding logs multiplies inside, subtracting divides." },
    "exp-across": { name: "Base across the =", how: "Drag the base across the =. It becomes a log on the other side." },
    "log-across": { name: "Log across the =", how: "Drag the log across the =. It becomes a power on the other side." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Exercise ${label}${solved ? " — solved" : ""}`,
  solved: "solved",
  goldNote: "Gold badge. Keep going as long as you like.",
  /** The badge so far (`tier`, 0 for none yet), and `more` exercises still to solve for the next one. */
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${["", "Bronze", "Silver"][tier]} badge. ` : ""}${more} more right answer${more === 1 ? "" : "s"} at ${["Easy", "Medium", "Hard"][tier]} for ${["bronze", "silver", "gold"][tier]}.`,

  // Guided example
  exampleN: (n: number) => `Example ${n}`,
  notThisStep: "That move works, but it isn't the one for this step. Putting it back.",
  done: "Done.",
  keepGoing: "You can keep going: any move is allowed now.",
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
  startOver: "Start over",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: lesson`,
  nextExercise: "Next exercise →",
  exercisesNav: "Exercises",
  previousTitle: (label: string) => `Previous: exercise ${label}`,
  previousLabel: (label: string) => `Previous exercise (${label})`,
  nextTitle: (label: string) => `Next: exercise ${label}`,
  nextLabel: (label: string) => `Next exercise (${label})`,
  exerciseN: (label: string) => `Exercise ${label}`,
  guessPrompt: "Predict first: what does it become?",
  reveal: "Reveal",
  guessedBeforeRight: "You predicted this one right first time.",
  guessedBeforeWrong: (picked: boolean) => `Your first prediction was ${picked ? "the red one" : "wrong"}. The green one is right.`,
  rightFirstTime: "Right first time. Now solve it.",
  notQuite: "Not quite. The green one is right. Solve it to see where yours went wrong.",
  solvedBefore: "✓ You've solved this one before. You can solve it again.",
  makeItLookLike: "Make it look like",
  pickFirst: "Pick an answer above, then solve it here.",
  hint: "Hint",
  undo: "Undo",
  reset: "Reset",
  solvedBang: "Solved!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${["", "Bronze", "Silver", "Gold"][tier]} badge for ${chapter}.`,
  theExercise: "the exercise",
  goal: "goal",
  moveCrashed: "Something went wrong with that move.",
  moveCrashedDetails: "Details are in the browser console.",
  tryAgain: "Try again",

  // Making a set
  ownTitle: "Your own exercises",
  ownIntro:
    "Write a set of exercises, for example for your students, and share it as a link. For each exercise, students predict the answer first, then solve it by hand. Nothing is stored online: the whole set is saved in the link.",
  upload: "Upload a .yaml file",
  startFromExample: "Start from the example",
  yamlLabel: "The exercise set, in YAML",
  check: "Check",
  checking: "Checking it can be solved with these moves…",
  unsolvable: "Couldn't solve it in 10 steps with these moves. It may need moves from a later chapter (`moves:`).",
  solvableIn: (n: number) => `Can be solved in ${n} move${n === 1 ? "" : "s"}.`,
  linkLabel: "Link to the set",
  copied: "Copied",
  copy: "Copy",
  open: "Open",
  makeLink: "Make the link",
  fixMarked: "Fix the exercises marked ✗, then check again.",
  howToWrite: "How to write a set",
  /** The format, as YAML: keep the keys (title, moves, exercises, start, goal, wrong, hint) and the maths; translate the rest. */
  formatExample: `title: A name for the set
moves: balance       # optional: a chapter's number, id or title —
                     # its moves and every earlier chapter's. Leave out: all moves.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # optional: two wrong answers to choose from
    hint: A short hint.       # optional
    moves: collect            # optional: moves for this exercise only`,
  /** Followed by the examples in code: `2x + 3 = 11`, `x/3`, …; then twoEquations. */
  writeMathsAs: "Write maths as you'd type it:",
  or: "or",
  twoEquations: ["Two equations at once go on one line with", "between them."],
  /** The example set: same keys and maths; the title, comments and hint in this language. */
  exampleSet: `title: Homework week 3
# Moves up to "Solving equations" (a chapter's number, id or title). Leave out for all moves.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Two wrong answers to choose from (optional: else they're made for you).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: The 2 leaves first, then the 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "This link doesn't work",
  brokenLinkText: "It may have been cut short when it was copied. Ask for it again, or go to the learning path.",
  learningPathButton: "Learning path",
  /** Around a ★: before it, and after it. */
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} of ${total} solved · `,
    ` ${stars} predicted right first time. For each one, predict the answer first, then solve it by hand.`,
  ],
  makeOwnSet: "Make a set of your own",
  ofCount: (n: number, count: number) => `${n} of ${count}`,
  backToSet: (title: string) => `Back to ${title}`,

  // Checking a set (shown to whoever writes one)
  set: {
    defaultTitle: "My exercises",
    badYaml: (msg: string) => `This isn't valid YAML: ${msg}`,
    expectedTop: "Expected `title:` and `exercises:` at the top.",
    noChapter: (name: string) => `No chapter called "${name}" for \`moves:\` (use a chapter's number, id or title).`,
    expectedList: "Expected a list under `exercises:`.",
    emptyList: "The list under `exercises:` is empty.",
    needsStart: "It needs a `start:`.",
    needsGoal: "It needs a `goal:`.",
    noChapterShort: (name: string) => `No chapter called "${name}" for \`moves:\`.`,
    cantReadStart: (err: string) => `Can't read the start: ${err}`,
    cantReadGoal: (err: string) => `Can't read the goal: ${err}`,
    doesntFollow: "The goal doesn't follow from the start (check for a typo).",
    twoWrong: "`wrong:` should list two wrong answers.",
    cantReadWrong: (w: string, err: string) => `Can't read the wrong answer "${w}": ${err}`,
    wrongShape: (w: string, why: string) => `The wrong answer "${w}" doesn't look like the goal: ${why}.`,
    wrongIsRight: (w: string) => `The wrong answer "${w}" is actually right.`,
    noDecoys: "No convincing wrong answers could be made: add `wrong:`, or it's solved without predicting first.",
    decoysMade: (list: string) => `Wrong answers made to choose from: ${list}.`,
    shapeCount: "a different number of equations",
    shapeRelation: "an expression where an equation is expected, or the other way round",
    shapeIsolated: (letter: string) => `it doesn't say what ${letter} is`,
  },
};

export type Strings = typeof en;
/**
 * Another language's strings. While the design settles (ENGLISH_ONLY), new
 * strings are written in English only: a translation may lack them, and
 * English stands in.
 */
export type Translation = Omit<Partial<Strings>, "drills"> & { drills?: Partial<Strings["drills"]> };
