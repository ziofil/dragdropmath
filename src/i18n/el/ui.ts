import type { Strings } from "../en";

const medal = ["", "Χάλκινο μετάλλιο", "Ασημένιο μετάλλιο", "Χρυσό μετάλλιο"] as const;
const exercises = (n: number) => (n === 1 ? "άσκηση" : "ασκήσεις");

export const el: Strings = {
  htmlLang: "el",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Γλώσσα",

  // Top bar
  makeExercises: "Φτιάξε ασκήσεις",
  sandbox: "Εργαστήριο",
  openSandbox: "Άνοιξε το εργαστήριο →",
  sandboxIntro: "Γράψε όποια παράσταση ή εξίσωση θέλεις και δοκίμασε όλες τις κινήσεις.",
  sandboxInput: "Παράσταση ή εξίσωση",
  sandboxPlaceholder: "π.χ. 3(x - 2) = 2x + 1   ή   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Φόρτωσε",
  debugOn: "Η λειτουργία αποσφαλμάτωσης είναι ενεργή (Shift+D)",

  // Home
  heroBefore: "Η άλγεβρα στα ",
  heroWord: "χέρια",
  heroAfter: " σου.",
  heroText:
    "Σύρε όποιο κομμάτι μιας εξίσωσης θέλεις. Κινείται μόνο με τρόπους που επιτρέπουν τα μαθηματικά. Άλλαξέ τη μέχρι να γίνει ίδια με τον στόχο.",
  learningPath: "Διαδρομή μάθησης",
  nextUp: "επόμενο",
  mastered: "ολοκληρώθηκε",
  everyChapterOpen: "Όλα τα κεφάλαια είναι ανοιχτά. Τα βέλη δείχνουν μια προτεινόμενη σειρά.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) =>
    `Κεφάλαιο ${n}: ${title}, ${done} από ${total} λυμένες`,
  chapterN: (n: number) => `Κεφάλαιο ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} και ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Χρειάζεσαι πρώτα: ${titles}.`,
  notMasteredYet: (titles: string) => ` Δεν έχεις ολοκληρώσει ακόμα: ${titles}. Μπορείς όμως να ξεκινήσεις κανονικά.`,
  startLesson: "Ξεκίνα το μάθημα →",
  backToLesson: "Πίσω στο μάθημα →",
  leadsOnTo: (titles: string) => `Μετά συνεχίζεις με: ${titles}.`,
  badges: "Μετάλλια",
  noBadgesYet: "Λύσε ασκήσεις σε οποιοδήποτε κεφάλαιο για να κερδίσεις το μετάλλιό του.",
  badgesEarned: (n: number, total: number) => `${n} από ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => medal[tier],
  badgeNotEarned: "δεν το έχεις κερδίσει ακόμα",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? medal[tier].toLowerCase() : "δεν το έχεις κερδίσει ακόμα"}`,

  // Chapter page
  backToPath: "← Διαδρομή μάθησης",
  exercises: "Ασκήσεις",
  practiceNote: "Ξεκινούν εύκολες και δυσκολεύουν σιγά σιγά. Οι τελευταίες χρειάζονται και όσα έμαθες σε προηγούμενα κεφάλαια.",
  leadsOnToStart: "Μετά συνεχίζεις με: ",
  leadsOnToEnd: ". Μπορείς να πας εκεί όποτε θέλεις.",
  watchOut: "Προσοχή.",

  // Progress
  solvedOf: (done: number, total: number) => `Έλυσες ${done} από ${total} ${exercises(total)}`,
  guessedRight: (n: number, total: number) => `${n} από ${total} σωστές προβλέψεις με την πρώτη`,
  exerciseTitle: (label: string, solved: boolean) => `Άσκηση ${label}${solved ? " — λυμένη" : ""}`,
  solved: "λυμένη",
  guessedRightFirstTime: "σωστή πρόβλεψη με την πρώτη",
  guessFirstShort: "Πρώτα πρόβλεψη",
  goldNote: "Χρυσό μετάλλιο. Έλυσες όλες τις ασκήσεις.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${medal[tier]}. ` : ""}Ακόμα ${more} ${exercises(more)} για το ${["χάλκινο", "ασημένιο", "χρυσό"][tier]}.`,

  // Guided example
  exampleN: (n: number) => `Παράδειγμα ${n}`,
  notThisStep: "Η κίνηση είναι σωστή, αλλά δεν είναι αυτή που θέλουμε σε αυτό το βήμα. Την παίρνω πίσω.",
  done: "Έτοιμο.",
  keepGoing: "Μπορείς να συνεχίσεις: τώρα επιτρέπεται κάθε κίνηση.",
  stepOf: (n: number, total: number) => `Βήμα ${n} από ${total}`,
  startOver: "Από την αρχή",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: μάθημα`,
  nextExercise: "Επόμενη άσκηση →",
  backToThePath: "Πίσω στη διαδρομή μάθησης",
  exercisesNav: "Ασκήσεις",
  previousTitle: (label: string) => `Προηγούμενη: άσκηση ${label}`,
  previousLabel: (label: string) => `Προηγούμενη άσκηση (${label})`,
  nextTitle: (label: string) => `Επόμενη: άσκηση ${label}`,
  nextLabel: (label: string) => `Επόμενη άσκηση (${label})`,
  exerciseN: (label: string) => `Άσκηση ${label}`,
  guessPrompt: "Σκέψου πρώτα: τι θα γίνει;",
  reveal: "Δείξε μου",
  guessedBeforeRight: "Σε αυτήν η πρόβλεψή σου ήταν σωστή με την πρώτη.",
  guessedBeforeWrong: (picked: boolean) =>
    `${picked ? "Την πρώτη φορά είχες προβλέψει την κόκκινη" : "Η πρώτη σου πρόβλεψη ήταν λάθος"}. Η σωστή είναι η πράσινη.`,
  rightFirstTime: "Σωστή πρόβλεψη με την πρώτη! Τώρα λύσε την άσκηση.",
  notQuite: "Όχι ακριβώς. Η σωστή είναι η πράσινη. Λύσε την άσκηση για να δεις πού έκανες λάθος.",
  solvedBefore: "✓ Αυτήν την έχεις ήδη λύσει. Μπορείς να τη λύσεις ξανά.",
  makeItLookLike: "Φέρ' το στη μορφή",
  positiveLetters: "Εδώ τα γράμματα παριστάνουν θετικούς αριθμούς.",
  pickFirst: "Διάλεξε μια απάντηση από πάνω και μετά λύσε την άσκηση εδώ.",
  hint: "Υπόδειξη",
  undo: "Αναίρεση",
  reset: "Επαναφορά",
  solvedBang: "Λύθηκε!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${medal[tier]} στο κεφάλαιο «${chapter}».`,
  theExercise: "η άσκηση",
  goal: "στόχος",
  moveCrashed: "Κάτι πήγε στραβά με αυτή την κίνηση.",
  moveCrashedDetails: "Θα βρεις λεπτομέρειες στην κονσόλα του προγράμματος περιήγησης.",
  tryAgain: "Δοκίμασε ξανά",

  // Making a set
  ownTitle: "Οι δικές σου ασκήσεις",
  ownIntro:
    "Γράψε μια σειρά ασκήσεων, για παράδειγμα για τους μαθητές σου, και μοιράσου τη με έναν σύνδεσμο. Σε κάθε άσκηση οι μαθητές πρώτα προβλέπουν την απάντηση και μετά τη λύνουν με το χέρι. Τίποτα δεν αποθηκεύεται στο διαδίκτυο: όλη η σειρά βρίσκεται μέσα στον σύνδεσμο.",
  upload: "Ανέβασε ένα αρχείο .yaml",
  startFromExample: "Ξεκίνα από το παράδειγμα",
  yamlLabel: "Η σειρά ασκήσεων σε YAML",
  check: "Έλεγχος",
  checking: "Ελέγχω αν λύνεται με αυτές τις κινήσεις…",
  unsolvable: "Δεν λύθηκε σε 10 βήματα με αυτές τις κινήσεις. Ίσως χρειάζεται κινήσεις από επόμενο κεφάλαιο (`moves:`).",
  solvableIn: (n: number) => `Λύνεται με ${n} ${n === 1 ? "κίνηση" : "κινήσεις"}.`,
  linkLabel: "Σύνδεσμος για τη σειρά",
  copied: "Αντιγράφηκε",
  copy: "Αντιγραφή",
  open: "Άνοιγμα",
  makeLink: "Φτιάξε τον σύνδεσμο",
  fixMarked: "Διόρθωσε τις ασκήσεις με ✗ και έλεγξε ξανά.",
  howToWrite: "Πώς γράφεις μια σειρά",
  formatExample: `title: Ένα όνομα για τη σειρά
moves: balance       # προαιρετικό: αριθμός, id ή τίτλος κεφαλαίου —
                     # οι κινήσεις του και όλων των προηγούμενων. Αν λείπει: όλες οι κινήσεις.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # προαιρετικό: δύο λάθος απαντήσεις για επιλογή
    hint: Μια σύντομη υπόδειξη.   # προαιρετικό
    moves: collect            # προαιρετικό: κινήσεις μόνο για αυτή την άσκηση`,
  writeMathsAs: "Γράψε τα μαθηματικά όπως θα τα πληκτρολογούσες:",
  or: "ή",
  twoEquations: ["Δύο εξισώσεις μαζί γράφονται στην ίδια γραμμή, με", "ανάμεσά τους."],
  exampleSet: `title: Εργασία για το σπίτι, 3η εβδομάδα
# Κινήσεις μέχρι το κεφάλαιο «Εξισώσεις» (αριθμός, id ή τίτλος κεφαλαίου). Αν λείπει: όλες οι κινήσεις.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Δύο λάθος απαντήσεις για επιλογή (προαιρετικό: αλλιώς φτιάχνονται αυτόματα).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Πρώτα φεύγει το 2, μετά το 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Αυτός ο σύνδεσμος δεν λειτουργεί",
  brokenLinkText: "Ίσως κόπηκε όταν αντιγράφηκε. Ζήτησέ τον ξανά ή πήγαινε στη διαδρομή μάθησης.",
  learningPathButton: "Διαδρομή μάθησης",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} από ${total} λυμένες · `,
    ` ${stars} σωστές προβλέψεις με την πρώτη. Σε κάθε άσκηση, πρόβλεψε πρώτα την απάντηση και μετά λύσε την άσκηση με το χέρι.`,
  ],
  makeOwnSet: "Φτιάξε τη δική σου σειρά",
  ofCount: (n: number, count: number) => `${n} από ${count}`,
  backToSet: (title: string) => `Πίσω στο «${title}»`,

  // Checking a set
  set: {
    defaultTitle: "Οι ασκήσεις μου",
    badYaml: (msg: string) => `Δεν είναι έγκυρο YAML: ${msg}`,
    expectedTop: "Στην αρχή χρειάζονται τα `title:` και `exercises:`.",
    noChapter: (name: string) =>
      `Δεν υπάρχει κεφάλαιο «${name}» για το \`moves:\` (γράψε τον αριθμό, το id ή τον τίτλο ενός κεφαλαίου).`,
    expectedList: "Κάτω από το `exercises:` χρειάζεται μια λίστα.",
    emptyList: "Η λίστα κάτω από το `exercises:` είναι κενή.",
    needsStart: "Λείπει το `start:`.",
    needsGoal: "Λείπει το `goal:`.",
    noChapterShort: (name: string) => `Δεν υπάρχει κεφάλαιο «${name}» για το \`moves:\`.`,
    cantReadStart: (err: string) => `Δεν μπορώ να διαβάσω την αρχική μορφή: ${err}`,
    cantReadGoal: (err: string) => `Δεν μπορώ να διαβάσω τον στόχο: ${err}`,
    doesntFollow: "Ο στόχος δεν προκύπτει από την αρχική μορφή (έλεγξε μήπως υπάρχει τυπογραφικό λάθος).",
    twoWrong: "Το `wrong:` πρέπει να έχει δύο λάθος απαντήσεις.",
    cantReadWrong: (w: string, err: string) => `Δεν μπορώ να διαβάσω τη λάθος απάντηση «${w}»: ${err}`,
    wrongShape: (w: string, why: string) => `Η λάθος απάντηση «${w}» δεν μοιάζει με τον στόχο: ${why}.`,
    wrongIsRight: (w: string) => `Η λάθος απάντηση «${w}» είναι στην πραγματικότητα σωστή.`,
    noDecoys:
      "Δεν βγήκαν πειστικές λάθος απαντήσεις: πρόσθεσε `wrong:`, αλλιώς η άσκηση λύνεται χωρίς πρόβλεψη.",
    decoysMade: (list: string) => `Λάθος απαντήσεις που φτιάχτηκαν για επιλογή: ${list}.`,
    shapeCount: "έχει διαφορετικό πλήθος εξισώσεων",
    shapeRelation: "είναι παράσταση εκεί που περιμένουμε εξίσωση, ή το αντίστροφο",
    shapeIsolated: (letter: string) => `δεν λέει πόσο είναι το ${letter}`,
  },
};
