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
  noBadgesYet: "Solve exercises in any chapter to earn its badge.",
  badgesEarned: (n: number, total: number) => `${n} of ${total}`,
  /** A badge by its tier: 1 bronze, 2 silver, 3 gold. */
  tierBadge: (tier: 1 | 2 | 3) => `${["", "Bronze", "Silver", "Gold"][tier]} badge`,
  badgeNotEarned: "badge not earned yet",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) => `${chapter}: ${tier ? `${["", "bronze", "silver", "gold"][tier]} badge` : "not earned yet"}`,

  // Chapter page
  backToPath: "← Learning path",
  exercises: "Exercises",
  practiceNote: "They start easy and get harder. Later ones also use what you learned in earlier chapters.",
  /** Followed by the chapters' links, then leadsOnToEnd. */
  leadsOnToStart: "Leads on to ",
  leadsOnToEnd: ". You can go there any time.",
  watchOut: "Watch out.",

  // Progress
  solvedOf: (done: number, total: number) => `${done} of ${total} exercises solved`,
  guessedRight: (n: number, total: number) => `${n} of ${total} predicted right first time`,
  exerciseTitle: (label: string, solved: boolean) => `Exercise ${label}${solved ? " — solved" : ""}`,
  solved: "solved",
  guessedRightFirstTime: "predicted right first time",
  guessFirstShort: "Predict first",
  goldNote: "Gold badge. Every exercise solved.",
  /** The badge so far (`tier`, 0 for none yet), and `more` exercises still to solve for the next one. */
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${["", "Bronze", "Silver"][tier]} badge. ` : ""}${more} more exercise${more === 1 ? "" : "s"} for ${["bronze", "silver", "gold"][tier]}.`,

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
  backToThePath: "Back to the learning path",
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
  positiveLetters: "Here, letters stand for positive numbers.",
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
