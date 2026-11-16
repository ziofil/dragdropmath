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
  skin: "Look",
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
  everyChapterOpen: "Every chapter is open. The arrows show a suggested order.",
  chapterNodeLabel: (n: number, title: string) => `Chapter ${n}: ${title}`,
  chapterN: (n: number) => `Chapter ${n}`,
  /** A list of names: "A", "A and B", "A, B and C". */
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Builds on ${titles}.`,
  startLesson: "Start the lesson →",

  // Chapter page
  backToPath: "← Learning path",
  /** Followed by the chapters' links, then leadsOnToEnd. */
  leadsOnToStart: "Leads on to ",
  leadsOnToEnd: ". You can go there any time.",
  level: { easy: "Easy", medium: "Medium", hard: "Hard" },
  anotherOne: "Another one →",
  progressHere: "Your progress is kept in this browser only. Save it to a file to keep it safe, or to carry it to another device.",
  saveProgress: "Save my progress",
  loadProgress: "Load progress from a file",
  progressSaved: "Saved. Load that file here, or in any browser, to get your progress back.",
  progressNotABackup: "That file isn't a Math by Hand progress file.",
  showMove: "Show",
  /** The three ways through a chapter. */
  lesson: "Lesson",
  practice: "Practice",
  predict: "Mind's eye",
  predictNote: "See the answer in your mind's eye, pick it, then solve it by hand to check. A right answer adds 1 to your score at its level; a wrong one, or a reveal, takes 1 away.",
  /** The mind's eye's scores, one per level across every chapter. */
  scores: "Mind's eye scores",
  scoresNote: "One for each level, across every chapter: +1 for a right answer, −1 for a wrong one or a reveal.",
  /** On a level's button: its score. */
  scoreOf: (n: number) => `score ${n}`,
  /** After a first answer: the score at its level, and how it moved. */
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) => `${level} score: ${now}${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  /**
   * Learning the moves: each drill's name (on its button) and what to do (above
   * the goal). Keys are the drills of game/generate/moves.ts.
   */
  drills: {
    commute: { name: "Swap the order", how: "Drag a term past its neighbour. With + and ×, the order doesn't matter.", text: ["The order you add things in doesn't change the total: `2 + x` and `x + 2` are the same.", "Each part of a sum is called a term. A term keeps its sign when it moves: in `5 − 3 + x` the minus belongs to the 3."] },
    combine: { name: "Add numbers", how: "Drop one number onto the other to add them up.", text: ["Two numbers in the same sum can be added together. A letter stands for a number we don't know yet, so it stays as it is."] },
    "multiply-numbers": { name: "Multiply numbers", how: "Drop one number onto the other number it multiplies.", text: ["The order doesn't matter when you multiply either: `2·x·5` is `2·5·x`. So the 2 and the 5 can be multiplied, to make `10x`."] },
    "numbers-first": { name: "Number in front", how: "Tap a product like `x·3` to write it the usual way, `3x`.", text: ["We write the number first and leave out the dot: `x·3` is written `3x`. This is so simple that from now on it happens on its own."] },
    "multiply-out": { name: "Work out a product", how: "Tap a product of numbers, like `2·3`, to work it out.", text: ["A product of plain numbers can be worked out: `2·3` is 6."] },
    collect: { name: "Collect like terms", how: "Drop a term onto a like term, one with the same letter. They add up.", text: ["`3x` means `x + x + x`. So `3x + 2x` is three x's plus two x's: `5x`.", "Only like terms add together: terms with exactly the same letters. `3x + 2` can't become `5x`, and x-terms and y-terms stay separate."] },
    "collect-cancel": { name: "Cancel opposites", how: "Drop a term onto its opposite. They cancel out.", text: ["Taking away works the same way: `5y − 2y` is `3y`. Anything minus itself is 0, so `a + b − a` is just `b`."] },
    distribute: { name: "Multiply out brackets", how: "Drop the number in front onto the brackets: it multiplies every term inside. Then tap the · to work out the numbers.", text: ["`2(x + 3)` means 2 lots of `(x + 3)`: 2 lots of x plus 2 lots of 3, `2x + 2·3`. The number outside multiplies every term inside.", "Think of a rectangle 2 tall and `x + 3` wide. Its two parts have areas `2·x` and `2·3`, and together they make the whole."] },
    "distribute-neg": { name: "Minus before brackets", how: "Drop the minus onto the brackets. Every sign inside changes.", text: ["`−(x − 4)` means −1 times the brackets. The −1 multiplies every term, so every sign inside changes."] },
    "factor-out": { name: "Take out a common factor", how: "Both terms share a factor. Press and hold it in one term, then drag it out in front, past the left end.", text: ["To factor a sum is to write it as a product. In `3x + 3y`, both terms are something times 3. So the 3 can be written once, in front of brackets that hold what each term has besides it: `3x + 3y = 3(x + y)`.", "It's true because multiplying `3(x + y)` out gives `3x + 3y` again: the 3 visits each term inside. That's also how to check a factoring."] },
    "split-exponent": { name: "Split an exponent", how: "Pull a term out of the exponent. The power splits into two powers of the same base.", text: ["`2^(x + 3)` is x + 3 twos multiplied together: x of them, then 3 more. So it's `2^x·2^3`: a sum in an exponent splits into a product of powers."] },
    "merge-powers": { name: "Same base: add exponents", how: "Drop one power onto the other, or tap the · between them. The exponents add up: tap the + to work them out.", text: ["`x³` means `x·x·x`. The small number, the exponent, counts the x's.", "So `x²·x³` is two x's times three x's: five x's in all. Multiplying powers of the same base adds the exponents."] },
    "power-to-product": { name: "A square as a product", how: "Tap the ² to write the brackets twice. Then multiply them out, and collect like terms.", text: ["`(x + 1)²` is `(x + 1)(x + 1)`, so it's multiplied out the same way."] },
    "move-term": { name: "Move a term across", how: "Drag the number across the =. Its sign changes on the way. Then tap the − to work it out.", text: ["An equation says two sides are equal. Do the same thing to both sides and they stay equal.", "Moving a term across the `=` does exactly that. From `x + 3 = 10`, take 3 from both sides: `x = 10 − 3`. That's why `+3` becomes `−3` on the other side."] },
    "move-factor": { name: "Divide both sides", how: "Drag the number in front of the letter across the =. It divides the other side. Then tap the fraction bar to work it out.", text: ["A number that multiplies a whole side divides the other side when it moves across. From `2x = 8`, divide both sides by 2: `x = 8/2`."] },
    "move-denominator": { name: "Multiply both sides", how: "Drag the bottom of the fraction across the =. It multiplies the other side. Then tap the · to work it out.", text: ["The bottom of a fraction multiplies the other side when it moves across. From `x/3 = 4`, multiply both sides by 3: `x = 4·3`."] },
    "move-sign": { name: "Move a minus across", how: "Drag just the minus across the =. The other side changes sign.", text: ["A minus in front of a whole side can move across too: both sides are multiplied by −1, so `−x = 6` becomes `x = −6`."] },
    "swap-sides": { name: "Swap the sides", how: "Drag one side across the = and past the far end. The two sides change places.", text: ["`7 = x` and `x = 7` say the same thing, so the two sides can change places."] },
    "evaluate-fraction": { name: "Work out a fraction", how: "Tap the fraction bar to work it out.", text: ["A fraction that comes out whole can be worked out: `12/3` is 4."] },
    "divide-numbers": { name: "Simplify a fraction", how: "Press and hold the bottom number, then drop it onto the top one, or tap the fraction bar. Both are divided by their common factor.", text: ["A fraction can be simplified by dividing its top and bottom by the same number: `6/8 = 3/4`. Its value doesn't change."] },
    "cancel-factor": { name: "Cancel a common factor", how: "Drop the number on the bottom onto the same number on top. Both disappear.", text: ["The same number on the top and the bottom cancels out: `(3x)/3` is `x`."] },
    "power-of-power": { name: "Power of a power", how: "Drop the outer exponent onto the inner one. They multiply: tap the · to work it out.", text: ["`(x²)³` is `x²·x²·x²`. That's 2 + 2 + 2 = 6 x's, so the exponents multiply."] },
    "divide-powers": { name: "Same base: subtract exponents", how: "Drop the power on the bottom onto the one on top. The exponents subtract: tap the − to work it out.", text: ["`x⁵/x²` has five x's on top and two on the bottom. Two cancel from each, leaving three on top: dividing subtracts the exponents."] },
    "flip-across-bar": { name: "Across the fraction bar", how: "Drag the power up across the bar. Its exponent changes sign.", text: ["With more x's on the bottom, the exponent goes below zero: `x⁻²` means `1/x²`. Moving a power across the fraction bar changes the sign of its exponent."] },
    "power-one": { name: "Power of 1", how: "Drop the exponent 1 onto its base.", text: ["`x¹` is one x: just `x`. This is so simple that from now on it happens on its own."] },
    "zero-power": { name: "Power of 0", how: "Press and hold the exponent 0, then drop it onto its base. Then tap the + to add up.", text: ["`x³/x³` is 1, and it's also `x^(3 − 3) = x⁰`. So anything to the power 0 is 1."] },
    "tap-power": { name: "Work out a power", how: "Tap the exponent to work the power out: `2³` becomes 8.", text: ["A power of a number can be worked out: `2³` is `2·2·2 = 8`."] },
    "power-of-product": { name: "Exponent into brackets", how: "Drag the exponent into the brackets: every factor inside gets its own copy. Then tap the number's exponent to work it out.", text: ["`(2x)³` is `2x·2x·2x`, which is `2³·x³`. Every factor inside gets the exponent."] },
    "split-number": { name: "Split a number", how: "Tap the number to split it into two factors. Then drag the factor both terms share out in front, past the left end.", text: ["To find a common factor, split numbers into factors. In `2x + 6`, the 6 is `2·3`, and now both terms have a 2."] },
    "split-term": { name: "Split the middle term", how: "Tap the middle term. It splits in two, ready to factor in pairs.", text: ["To factor `x² + 5x + 6`, look for two numbers that add up to 5 and multiply to 6: 2 and 3. Write `5x` as `2x + 3x`.", "Now there are four terms, and they factor in pairs: `x(x + 2) + 3(x + 2)`, then `(x + 2)(x + 3)`."] },
    "difference-of-squares": { name: "Difference of two squares", how: "Tap the minus between the two squares.", text: ["A square minus a square always factors the same way: `a² − b² = (a − b)(a + b)`. Multiply it out to check: the middle terms cancel."] },
    "factor-shared": { name: "Share a factor", how: "Press and hold the `x` of one term, then drop it onto another term with an `x`: the two share it. Do the same with the last two terms, then take out the bracket they share.", text: ["With four terms, work in pairs. Take a common factor out of the first two terms, then out of the last two. If the two brackets match, take the bracket out as well."] },
    "move-letter-factor": { name: "Divide by a letter", how: "Drag one of the multiplied letters across the =. It divides the other side.", text: ["A formula is an equation with several letters. Getting one letter on its own is called making it the subject. It works like solving for x: treat the other letters as numbers.", "A letter that multiplies a whole side can move across and divide the other side: `F = ma` gives `F/m = a`. (Only by a letter that isn't 0. In these formulas it never is.)", "When the letter you want is in two places, as in `ax + bx = c`, take it out as a factor first: `x(a + b) = c`. Then the whole bracket can move across."] },
    "move-letter-denominator": { name: "Multiply by a letter", how: "Drag the letter on the bottom across the =. It multiplies the other side.", text: ["A letter on the bottom of a whole side can move across and multiply the other side: `P = F/A` gives `PA = F`."] },
    "ineq-move-term": { name: "Move a term across", how: "Drag the number across the inequality sign. Its sign changes, and the inequality sign stays as it is. Then tap the − to work it out.", text: ["`x < 7` says x is less than 7. The open side of the sign faces the bigger number.", "Adding or taking away the same on both sides keeps the sign as it is. So a term moves across just as in an equation."] },
    "ineq-swap": { name: "Swap the sides", how: "Drag one side past the other. The inequality sign turns round with them.", text: ["`3 > x` and `x < 3` say the same thing: x is less than 3. So the sides can swap, as long as the sign turns round with them."] },
    "ineq-sign": { name: "Move a minus across", how: "Drag just the minus across. The inequality sign turns round.", text: ["Multiplying by −1 reverses the order: `2 < 3`, but `−2 > −3`. So when a minus moves across, the sign turns round."] },
    "add-fractions": { name: "Add fractions", how: "The bottoms are the same: drop one fraction onto the other, or tap the + between them. Then tap the + on top to add the tops.", text: ["`3/4` means 3 quarters. When the bottoms are the same, just add the tops: 1 fifth plus 2 fifths is 3 fifths, so `1/5 + 2/5 = 3/5`."] },
    "expand-fraction": { name: "Make the bottoms the same", how: "Press and hold the bottom of one fraction, then drop it onto the other fraction, then the other way round: now both have the same bottom. Tap each · to work out the tops and bottoms, then add the fractions.", text: ["Multiplying the top and the bottom by the same number doesn't change a fraction: `1/2 = 2/4 = 3/6`.", "That's how to make the bottoms the same. To add `1/2 + 1/3`, multiply the top and bottom of `1/2` by 3, and of `1/3` by 2: both are sixths now."] },
    "multiply-fractions": { name: "Multiply fractions", how: "Tap the · between the fractions, or drop one onto the other: tops multiply, and so do bottoms.", text: ["Multiplying is simpler: multiply the tops, and multiply the bottoms. Half of a third is `(1·1)/(2·3) = 1/6`."] },
    "divide-by-fraction": { name: "Divide by a fraction", how: "Drag the fraction on the bottom up onto the top. It turns upside down and multiplies. Then tap the · to work it out.", text: ["Dividing by a fraction is multiplying by it upside down: `4/(3/5)` is `4·(5/3)`."] },
    "split-fraction": { name: "Split a fraction", how: "Pull a term out of the top. It takes a copy of the bottom with it.", text: ["A sum on top of a fraction can be split into one fraction for each term, all over the same bottom: `(x + 5)/6 = x/6 + 5/6`."] },
    "times-one": { name: "Times 1", how: "Press and hold the 1, then drop it onto what it multiplies.", text: ["Multiplying by 1 changes nothing: `1·x` is just `x`. This is so simple that from now on it happens on its own."] },
    substitute: { name: "Substitute", how: "Drag the `y` of `y = …` onto the `y` in the other equation: it becomes what `y` equals. Then solve for x, and put x into the first equation to find y.", text: ["`y = 2x` and `x + y = 9` are two equations about the same x and y, both true at once. One equation with two unknowns has many solutions; two together usually have just one.", "`y = 2x` says y and 2x are equal, so y can be replaced by 2x in the other equation. That leaves one equation with one letter, which you know how to solve.", "If no equation has a letter on its own, make one first: in `x − y = 1`, move the −y across to get `x = 1 + y`."] },
    "evaluate-root": { name: "Work out a root", how: "Tap the root to work it out.", text: ["`√9` is the number that gives 9 when it's multiplied by itself: 3, since `3·3 = 9`. In the same way `∛8 = 2`, since `2·2·2 = 8`."] },
    "split-square": { name: "Split under a root", how: "Tap the number under the root: a square splits off (a cube, under a cube root). Then pull it out of the root, and tap its root to work it out.", text: ["A root that doesn't come out whole can still be simplified. Split the number under it so that a square splits off: `√12 = √(4·3)`."] },
    "join-powers": { name: "Join roots", how: "Drop one root onto the other. They share one root sign.", text: ["`√2·√3` squared is `2·3`, so `√2·√3` is the number whose square is 6: `√(2·3) = √6`. Two roots of the same kind join under one.", "The same goes for any shared exponent: `x³y³` is xxx·yyy, which is xy·xy·xy, so `(xy)³`."] },
    "pull-out-of-power": { name: "Split a root", how: "Pull the number out of the root: it gets its own root. Then tap that root to work it out.", text: ["The root of a product is the product of the roots: `√(4x) = √4·√x = 2√x`."] },
    "root-notation": { name: "A root as a power", how: "Tap the root to write it as a power: √ is a power of ½, ∛ a power of ⅓.", text: ["Every root is a power: `√x = x^(1/2)`, `∛x = x^(1/3)`, and the nth root of x is `x^(1/n)`. So all the rules for powers work for roots too: `√x·√x = x^(1/2 + 1/2) = x`."] },
    "root-across": { name: "A root's power across the =", how: "Drag the ½ (or ⅓, or ¼) across the =. On the other side it becomes a square (or a cube, or a fourth power). Then tap the exponent to work it out.", text: ["To solve `√x = 3`, square both sides. Written as a power, `x^(1/2) = 3`, the ½ moves across and becomes a square: `x = 3²`."] },
    "exp-of-log": { name: "A power undoes a log", how: "Drop the base onto the log in its exponent. They undo each other.", text: ["`e` is a special number, about 2.718. `ln(x)` is the power of e that gives x, so ln and e^ undo each other: `e^(ln x) = x`. Logs to other bases work the same way: `2^(log₂ x) = x`."] },
    "evaluate-log": { name: "Logs you know", how: "Tap the log to work it out: `ln(e) = 1`, and the log of 1 is 0.", text: ["`ln(e) = 1`, since `e¹ = e`. And the log of 1 is 0, since anything to the power 0 is 1."] },
    "power-of-base": { name: "As a power of the base", how: "Tap the number in the log to write it as a power of 2. Then drag the exponent out in front of the log, and tap the log.", text: ["To work out `log₂(8)`, write 8 as a power of 2: `8 = 2³`, so `log₂(8) = 3`."] },
    "log-of-product": { name: "Split a log", how: "Pull the number out of the log. It gets its own log.", text: ["Multiplying powers adds their exponents. So the log of a product is a sum of logs: `ln(2x) = ln(2) + ln(x)`."] },
    "log-of-power": { name: "Exponent out of a log", how: "Drag the exponent out in front of the log.", text: ["`x³` is `x·x·x`, so `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."] },
    "power-into-log": { name: "Number into a log", how: "Drop the number in front onto the log. It becomes an exponent inside.", text: ["The other way round: `3ln(x)` is `ln(x³)`."] },
    "combine-logs": { name: "Combine logs", how: "Drop one log onto the other, or tap the + (or −) between them. Adding logs multiplies inside, subtracting divides.", text: ["The other way round too: `ln(a) + ln(b) = ln(ab)`, and `ln(a) − ln(b) = ln(a/b)`."] },
    "move-exponent-term": { name: "Between exponents", how: "Both sides are powers of the same base. Drag a term of one exponent to the other: it flips sign.", text: ["When both sides are powers of the same base, their exponents are equal, so they balance like the two sides of an equation.", "`2^(x − 3) = 2^4` becomes `2^x = 2^(4 + 3)`: both sides were multiplied by `2^3`."] },
    "exp-across": { name: "Base across the =", how: "Drag the base across the =. It becomes a log on the other side.", text: ["To get x out of an exponent, take the log of both sides. From `e^x = 5`, the e moves across and becomes ln: `x = ln(5)`."] },
    "log-across": { name: "Log across the =", how: "Drag the log across the =. It becomes a power on the other side. When that's a power of a number, tap its exponent to work it out.", text: ["A log is undone by a power. From `ln(x) = 2`, the ln moves across and becomes e: `x = e²`."] },
    "bracket-times-bracket": { name: "A bracket times a bracket", how: "Drop one bracket onto the other: it multiplies both terms inside. Then multiply out each bracket the same way, and collect like terms.", text: ["In `(x + 1)(x + 2)`, the first bracket is one factor: it multiplies the whole of the second, the x and the 2. Then each `(x + 1)` is multiplied out in turn.", "Two terms times two terms gives four terms. Then collect like terms: `(x + 1)(x + 2) = x² + 3x + 2`."] },
    "bracket-out": { name: "Take out a bracket", how: "Both terms have the same bracket. Press and hold it in one term, then drag it out in front, past the left end.", text: ["A whole bracket can be a common factor. In `x(x + 2) + 3(x + 2)` both terms have `(x + 2)`, so it comes out in front like any other factor: `(x + 2)(x + 3)`."] },
    "ineq-move-factor": { name: "Divide both sides", how: "Drag the number in front of the letter across the sign. It divides the other side, and the sign stays as it is. Then tap the fraction bar.", text: ["Multiplying or dividing both sides by a positive number keeps the sign as it is too: from `2x < 8`, `x < 8/2`."] },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Exercise ${label}${solved ? " — solved" : ""}`,

  // Guided example
  done: "Done.",
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
  predictPrompt: "In your mind's eye: what does it become?",
  reveal: "Reveal",
  predictedBeforeRight: "You saw this one right first time.",
  predictedBeforeWrong: (picked: boolean) => `Your first answer was ${picked ? "the red one" : "wrong"}. The green one is right.`,
  rightFirstTime: "Right first time. Now solve it.",
  /** After Reveal (on this visit or an earlier one). */
  revealedNote: "The green one is right. Now solve it.",
  notQuite: "Not quite. The green one is right. Solve it to see where yours went wrong.",
  solvedBefore: "✓ You've solved this one before. You can solve it again.",
  makeItLookLike: "Make it look like",
  solveFor: (letters: string[]) => `Solve for ${letters.map((l) => `\`${l}\``).join(" and ")}.`,
  pickFirst: "Pick an answer above, then solve it here.",
  hint: "Hint",
  undo: "Undo",
  solvedBang: "Solved!",
  moveCrashed: "Something went wrong with that move.",
  moveCrashedDetails: "Details are in the browser console.",
  tryAgain: "Try again",

  // Making a set
  ownTitle: "Your own exercises",
  ownIntro:
    "Write a set of exercises, for example for your students, and share it as a link. For each exercise, students see the answer in their mind's eye first, then solve it by hand. Nothing is stored online: the whole set is saved in the link.",
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
    ` ${stars} seen right first time. For each one, see the answer in your mind's eye first, then solve it by hand.`,
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
    noDecoys: "No convincing wrong answers could be made: add `wrong:`, or it's solved without a mind's-eye answer first.",
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
export type Translation = Omit<Partial<Strings>, "drills"> & { drills?: Partial<Record<keyof Strings["drills"], Partial<MoveWords>>> };

/** A move's words: its name, what to do on its board, why it works, and a common mistake. */
export type MoveWords = { name: string; how: string; text: string[] };
