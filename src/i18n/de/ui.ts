import type { Strings } from "../en";

const TIER = ["", "Bronze", "Silber", "Gold"] as const;

export const de: Strings = {
  htmlLang: "de",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Sprache",

  // Top bar
  makeExercises: "Aufgaben erstellen",
  sandbox: "Spielwiese",
  openSandbox: "Zur Spielwiese →",
  sandboxIntro: "Gib einen beliebigen Term oder eine Gleichung ein und probier alle Umformungen aus.",
  sandboxInput: "Term oder Gleichung",
  sandboxPlaceholder: "z. B. 3(x - 2) = 2x + 1   oder   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Laden",
  debugOn: "Debug-Modus ist an (Shift+D)",

  // Home
  heroBefore: "Algebra zum ",
  heroWord: "Anfassen",
  heroAfter: ".",
  heroText:
    "Zieh an einem beliebigen Teil einer Gleichung. Er bewegt sich nur so, wie es die Mathematik erlaubt. Forme um, bis alles aussieht wie das Ziel.",
  learningPath: "Lernpfad",
  nextUp: "als Nächstes",
  mastered: "gemeistert",
  everyChapterOpen: "Alle Kapitel sind offen. Die Pfeile zeigen eine sinnvolle Reihenfolge.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) => `Kapitel ${n}: ${title}, ${done} von ${total} gelöst`,
  chapterN: (n: number) => `Kapitel ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Setzt voraus: ${titles}.`,
  notMasteredYet: (titles: string) => ` Noch nicht gemeistert: ${titles}. Du kannst trotzdem anfangen.`,
  startLesson: "Zur Lektion →",
  backToLesson: "Zurück zur Lektion →",
  leadsOnTo: (titles: string) => `Darauf baut auf: ${titles}.`,
  badges: "Abzeichen",
  noBadgesYet: "Löse Aufgaben in einem Kapitel, um sein Abzeichen zu bekommen.",
  badgesEarned: (n: number, total: number) => `${n} von ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `${TIER[tier]}abzeichen`,
  badgeNotEarned: "Abzeichen noch nicht erreicht",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) => `${chapter}: ${tier ? `${TIER[tier]}abzeichen` : "noch nicht erreicht"}`,

  // Chapter page
  backToPath: "← Lernpfad",
  exercises: "Aufgaben",
  practiceNote: "Sie fangen leicht an und werden immer schwerer. Die späteren brauchen auch, was du in früheren Kapiteln gelernt hast.",
  leadsOnToStart: "Darauf baut auf: ",
  leadsOnToEnd: ". Du kannst jederzeit dorthin wechseln.",
  watchOut: "Vorsicht!",

  // Progress
  solvedOf: (done: number, total: number) => `${done} von ${total} Aufgaben gelöst`,
  guessedRight: (n: number, total: number) => `${n} von ${total} auf Anhieb richtig vorhergesagt`,
  exerciseTitle: (label: string, solved: boolean) => `Aufgabe ${label}${solved ? " – gelöst" : ""}`,
  solved: "gelöst",
  guessedRightFirstTime: "auf Anhieb richtig vorhergesagt",
  guessFirstShort: "Erst überlegen",
  goldNote: "Goldabzeichen. Alle Aufgaben gelöst.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${TIER[tier]}abzeichen. ` : ""}Noch ${more} ${more === 1 ? "Aufgabe" : "Aufgaben"} bis ${TIER[tier + 1]}.`,

  // Guided example
  exampleN: (n: number) => `Beispiel ${n}`,
  notThisStep: "Das geht zwar, ist aber nicht der Schritt, um den es hier geht. Er wird zurückgenommen.",
  done: "Fertig.",
  keepGoing: "Du kannst weitermachen: Jetzt ist jeder Schritt erlaubt.",
  stepOf: (n: number, total: number) => `Schritt ${n} von ${total}`,
  startOver: "Von vorn",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: Lektion`,
  nextExercise: "Nächste Aufgabe →",
  backToThePath: "Zurück zum Lernpfad",
  exercisesNav: "Aufgaben",
  previousTitle: (label: string) => `Vorherige: Aufgabe ${label}`,
  previousLabel: (label: string) => `Vorherige Aufgabe (${label})`,
  nextTitle: (label: string) => `Nächste: Aufgabe ${label}`,
  nextLabel: (label: string) => `Nächste Aufgabe (${label})`,
  exerciseN: (label: string) => `Aufgabe ${label}`,
  guessPrompt: "Erst überlegen: Was kommt heraus?",
  reveal: "Auflösen",
  guessedBeforeRight: "Diese hast du auf Anhieb richtig vorhergesagt.",
  guessedBeforeWrong: (picked: boolean) => `Deine erste Antwort war ${picked ? "die rote" : "falsch"}. Die grüne ist richtig.`,
  rightFirstTime: "Auf Anhieb richtig. Jetzt rechne es aus.",
  notQuite: "Nicht ganz. Die grüne ist richtig. Rechne es aus, dann siehst du, wo dein Fehler lag.",
  solvedBefore: "✓ Diese Aufgabe hast du schon gelöst. Du kannst sie noch einmal lösen.",
  makeItLookLike: "Mach daraus",
  positiveLetters: "Hier stehen die Variablen für positive Zahlen.",
  pickFirst: "Wähl oben eine Antwort, dann rechne hier.",
  hint: "Tipp",
  undo: "Rückgängig",
  reset: "Zurücksetzen",
  solvedBang: "Gelöst!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${TIER[tier]}abzeichen für ${chapter}.`,
  theExercise: "die Aufgabe",
  goal: "Ziel",
  moveCrashed: "Bei diesem Schritt ist etwas schiefgegangen.",
  moveCrashedDetails: "Details stehen in der Browser-Konsole.",
  tryAgain: "Nochmal versuchen",

  // Making a set
  ownTitle: "Eigene Aufgaben",
  ownIntro:
    "Stell eine Aufgabenreihe zusammen, zum Beispiel für deine Klasse, und teile sie als Link. Bei jeder Aufgabe überlegen die Schülerinnen und Schüler zuerst, was herauskommt, und rechnen es dann von Hand aus. Online wird nichts gespeichert: Die ganze Reihe steckt im Link.",
  upload: "Eine .yaml-Datei hochladen",
  startFromExample: "Mit dem Beispiel anfangen",
  yamlLabel: "Die Aufgabenreihe als YAML",
  check: "Prüfen",
  checking: "Prüfe, ob es sich mit diesen Schritten lösen lässt …",
  unsolvable:
    "Mit diesen Schritten nicht in 10 Zügen lösbar. Vielleicht braucht es Schritte aus einem späteren Kapitel (`moves:`).",
  solvableIn: (n: number) => `Lösbar in ${n} ${n === 1 ? "Schritt" : "Schritten"}.`,
  linkLabel: "Link zur Aufgabenreihe",
  copied: "Kopiert",
  copy: "Kopieren",
  open: "Öffnen",
  makeLink: "Link erstellen",
  fixMarked: "Korrigiere die mit ✗ markierten Aufgaben und prüfe dann noch einmal.",
  howToWrite: "So schreibst du eine Aufgabenreihe",
  formatExample: `title: Ein Name für die Reihe
moves: balance       # optional: Nummer, ID oder Titel eines Kapitels –
                     # seine Schritte und die aller früheren Kapitel. Weglassen: alle Schritte.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # optional: zwei falsche Antworten zur Auswahl
    hint: Ein kurzer Tipp.    # optional
    moves: collect            # optional: Schritte nur für diese Aufgabe`,
  writeMathsAs: "Schreib die Mathematik so, wie du sie eintippen würdest:",
  or: "oder",
  twoEquations: ["Zwei Gleichungen auf einmal kommen in eine Zeile, mit", "dazwischen."],
  exampleSet: `title: Hausaufgaben Woche 3
# Schritte bis "Gleichungen lösen" (Nummer, ID oder Titel eines Kapitels). Weglassen: alle Schritte.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Zwei falsche Antworten zur Auswahl (optional: sonst werden sie automatisch erzeugt).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Zuerst kommt die 2 weg, dann die 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Dieser Link funktioniert nicht",
  brokenLinkText: "Vielleicht wurde er beim Kopieren abgeschnitten. Lass ihn dir noch einmal schicken oder geh zum Lernpfad.",
  learningPathButton: "Lernpfad",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} von ${total} gelöst · `,
    ` ${stars} auf Anhieb richtig vorhergesagt. Überlege bei jeder Aufgabe zuerst, was herauskommt, dann rechne sie von Hand aus.`,
  ],
  makeOwnSet: "Eigene Aufgabenreihe erstellen",
  ofCount: (n: number, count: number) => `${n} von ${count}`,
  backToSet: (title: string) => `Zurück zu ${title}`,

  // Checking a set
  set: {
    defaultTitle: "Meine Aufgaben",
    badYaml: (msg: string) => `Das ist kein gültiges YAML: ${msg}`,
    expectedTop: "Oben müssen `title:` und `exercises:` stehen.",
    noChapter: (name: string) =>
      `Es gibt kein Kapitel „${name}“ für \`moves:\` (gib Nummer, ID oder Titel eines Kapitels an).`,
    expectedList: "Unter `exercises:` muss eine Liste stehen.",
    emptyList: "Die Liste unter `exercises:` ist leer.",
    needsStart: "Es fehlt ein `start:`.",
    needsGoal: "Es fehlt ein `goal:`.",
    noChapterShort: (name: string) => `Es gibt kein Kapitel „${name}“ für \`moves:\`.`,
    cantReadStart: (err: string) => `Der Start lässt sich nicht lesen: ${err}`,
    cantReadGoal: (err: string) => `Das Ziel lässt sich nicht lesen: ${err}`,
    doesntFollow: "Das Ziel folgt nicht aus dem Start (vielleicht ein Tippfehler?).",
    twoWrong: "Unter `wrong:` sollten zwei falsche Antworten stehen.",
    cantReadWrong: (w: string, err: string) => `Die falsche Antwort „${w}“ lässt sich nicht lesen: ${err}`,
    wrongShape: (w: string, why: string) => `Die falsche Antwort „${w}“ sieht nicht aus wie das Ziel: ${why}.`,
    wrongIsRight: (w: string) => `Die falsche Antwort „${w}“ ist in Wirklichkeit richtig.`,
    noDecoys:
      "Es ließen sich keine überzeugenden falschen Antworten erzeugen: Füge `wrong:` hinzu, sonst wird die Aufgabe ohne Vorhersage gelöst.",
    decoysMade: (list: string) => `Erzeugte falsche Antworten zur Auswahl: ${list}.`,
    shapeCount: "eine andere Anzahl von Gleichungen",
    shapeRelation: "ein Term, wo eine Gleichung erwartet wird, oder umgekehrt",
    shapeIsolated: (letter: string) => `es sagt nicht, was ${letter} ist`,
  },
};
