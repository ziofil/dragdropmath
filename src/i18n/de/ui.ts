import type { Translation } from "../en";

const TIER = ["", "Bronze", "Silber", "Gold"] as const;

export const de: Translation = {
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
  noBadgesYet: "Mach in einem Kapitel den Test, um sein Abzeichen zu bekommen.",
  badgesEarned: (n: number, total: number) => `${n} von ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `${TIER[tier]}abzeichen`,
  badgeNotEarned: "Abzeichen noch nicht erreicht",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) => `${chapter}: ${tier ? `${TIER[tier]}abzeichen` : "noch nicht erreicht"}`,

  // Chapter page
  backToPath: "← Lernpfad",
  practiceNote: "Jede Aufgabe ist neu, extra für dich erstellt. Fang mit den leichten an und geh eine Stufe höher, wenn du so weit bist.",
  leadsOnToStart: "Darauf baut auf: ",
  leadsOnToEnd: ". Du kannst jederzeit dorthin wechseln.",
  watchOut: "Vorsicht!",
  level: { easy: "Leicht", medium: "Mittel", hard: "Schwer" },
  anotherOne: "Noch eine →",
  learnMoves: "Umformungen kennenlernen",
  learnMovesNote: "Jede Umformung einzeln. Probier sie so oft aus, wie du willst.",
  practice: "Üben",
  testSkills: "Teste dein Können",
  testNote:
    "Rechne die Antwort im Kopf aus und wähl sie dann aus. Richtige Antworten bringen dir das Abzeichen des Kapitels: 10 bei „Leicht“ für Bronze, bei „Mittel“ für Silber, bei „Schwer“ für Gold.",
  solvedN: (n: number) => `${n} gelöst`,
  testRight: "Richtig! Das zählt für das Abzeichen.",
  drills: {
    commute: { name: "Reihenfolge tauschen", how: "Zieh einen Term an seinem Nachbarn vorbei. Bei + und × ist die Reihenfolge egal." },
    combine: { name: "Zahlen addieren", how: "Zieh eine Zahl auf die andere, um sie zu addieren." },
    "multiply-numbers": { name: "Zahlen multiplizieren", how: "Zieh eine Zahl auf die Zahl, mit der sie multipliziert wird." },
    "numbers-first": { name: "Zahl nach vorn", how: "Tippe auf ein Produkt wie `x·3`, um es wie üblich zu schreiben: `3x`." },
    "multiply-out": { name: "Produkt ausrechnen", how: "Tippe auf ein Produkt aus Zahlen wie `2·3`, um es auszurechnen." },
    collect: { name: "Gleichartige Terme zusammenfassen", how: "Zieh einen Term auf einen gleichartigen, also einen mit derselben Variablen. Die beiden werden addiert." },
    "collect-cancel": { name: "Gegenzahlen aufheben", how: "Zieh einen Term auf denselben Term mit umgekehrtem Vorzeichen. Die beiden heben sich auf." },
    distribute: { name: "Klammer ausmultiplizieren", how: "Zieh die Zahl vor der Klammer auf die Klammer. Sie wird mit jedem Term darin multipliziert." },
    "distribute-neg": { name: "Minus vor der Klammer", how: "Zieh das Minus auf die Klammer. Jedes Vorzeichen darin dreht sich um." },
    "factor-out": { name: "Gemeinsamen Faktor ausklammern", how: "Beide Terme haben einen Faktor gemeinsam. Zieh ihn aus einem der beiden ganz nach links vor den Term." },
    "x-times-x": { name: "x mal x", how: "Zieh ein x auf das andere. `x·x` schreibt man `x²`." },
    "merge-powers": { name: "Gleiche Basis: Exponenten addieren", how: "Zieh eine Potenz auf die andere mit gleicher Basis. Die Exponenten werden addiert." },
    "power-to-product": { name: "Ein Quadrat als Produkt", how: "Tippe auf das ², um die Klammer zweimal hinzuschreiben." },
    "move-term": { name: "Term hinüberbringen", how: "Zieh die Zahl über das =. Dabei ändert sich ihr Vorzeichen." },
    "move-factor": { name: "Beide Seiten dividieren", how: "Zieh die Zahl vor der Variablen über das =. Jetzt teilt sie die andere Seite." },
    "move-denominator": { name: "Beide Seiten multiplizieren", how: "Zieh den Nenner des Bruchs über das =. Jetzt multipliziert er die andere Seite." },
    "move-sign": { name: "Minus hinüberbringen", how: "Zieh nur das Minus über das =. Die andere Seite ändert ihr Vorzeichen." },
    "swap-sides": { name: "Seiten tauschen", how: "Zieh eine Seite über das = und am anderen Ende vorbei. Die beiden Seiten tauschen die Plätze." },
    "evaluate-fraction": { name: "Bruch ausrechnen", how: "Tippe auf den Bruchstrich, um den Bruch auszurechnen." },
    "divide-numbers": { name: "Bruch kürzen", how: "Zieh die Zahl im Nenner auf die im Zähler. Beide werden durch ihren gemeinsamen Teiler geteilt." },
    "cancel-factor": { name: "Gemeinsamen Faktor kürzen", how: "Zieh die Zahl im Nenner auf dieselbe Zahl im Zähler. Beide fallen weg." },
    "power-of-power": { name: "Potenzen potenzieren", how: "Zieh den äußeren Exponenten auf den inneren. Sie werden multipliziert." },
    "divide-powers": { name: "Gleiche Basis: Exponenten subtrahieren", how: "Zieh die Potenz im Nenner auf die im Zähler. Die Exponenten werden subtrahiert." },
    "flip-across-bar": { name: "Über den Bruchstrich", how: "Zieh die Potenz nach oben über den Bruchstrich. Ihr Exponent ändert das Vorzeichen." },
    "power-one": { name: "Hoch 1", how: "Zieh den Exponenten 1 auf seine Basis: `x¹` ist einfach `x`." },
    "zero-power": { name: "Hoch 0", how: "Zieh den Exponenten 0 auf seine Basis. Alles hoch 0 ist 1." },
    "tap-power": { name: "Potenz ausrechnen", how: "Tippe auf den Exponenten, um die Potenz auszurechnen: Aus `2³` wird 8." },
    "power-of-product": { name: "Exponent in die Klammer", how: "Zieh den Exponenten in die Klammer. Jeder Faktor darin bekommt einen eigenen." },
    "split-number": { name: "Zahl zerlegen", how: "Tippe auf die Zahl, um sie in zwei Faktoren zu zerlegen." },
    "factor-shared": { name: "Gemeinsames x ausklammern", how: "Zieh das `x` eines Terms auf einen anderen Term mit `x`. Es wird aus beiden Termen ausgeklammert." },
    "move-letter-factor": { name: "Durch eine Variable teilen", how: "Zieh eine der multiplizierten Variablen über das =. Jetzt teilt sie die andere Seite." },
    "move-letter-denominator": { name: "Mit einer Variablen multiplizieren", how: "Zieh die Variable im Nenner über das =. Jetzt multipliziert sie die andere Seite." },
    "ineq-move-term": { name: "Term hinüberbringen", how: "Zieh die Zahl über das Ungleichheitszeichen. Ihr Vorzeichen ändert sich, das Ungleichheitszeichen bleibt, wie es ist." },
    "ineq-swap": { name: "Seiten tauschen", how: "Zieh eine Seite an der anderen vorbei. Das Ungleichheitszeichen dreht sich dabei um." },
    "ineq-sign": { name: "Minus hinüberbringen", how: "Zieh nur das Minus hinüber. Das Ungleichheitszeichen dreht sich um." },
    "add-fractions": { name: "Brüche addieren", how: "Die Nenner sind gleich: Zieh einen Bruch auf den anderen. Die Zähler werden addiert." },
    "expand-fraction": { name: "Gleichnamig machen", how: "Zieh den Nenner des einen Bruchs auf den anderen Bruch. Dessen Zähler und Nenner werden damit multipliziert." },
    "multiply-fractions": { name: "Brüche multiplizieren", how: "Zieh einen Bruch auf den anderen. Zähler mal Zähler, Nenner mal Nenner." },
    "divide-by-fraction": { name: "Durch einen Bruch teilen", how: "Zieh den Bruch im Nenner nach oben über den Bruchstrich. Er wird zum Kehrwert und multipliziert." },
    "split-fraction": { name: "Bruch aufteilen", how: "Zieh einen Term aus dem Zähler heraus. Er nimmt eine Kopie des Nenners mit." },
    "times-one": { name: "Mal 1", how: "Zieh die 1 auf das, was sie multipliziert. Mal 1 ändert nichts." },
    substitute: { name: "Einsetzen", how: "Zieh das `y` aus `y = …` auf das `y` in der anderen Gleichung. Es wird durch das ersetzt, wofür `y` steht." },
    "evaluate-root": { name: "Wurzel ausrechnen", how: "Tippe auf die Wurzel, um sie auszurechnen." },
    "split-square": { name: "Unter der Wurzel zerlegen", how: "Tippe auf die Zahl unter der Wurzel. Eine Quadratzahl wird abgespalten." },
    "pull-out-of-power": { name: "Wurzel aufteilen", how: "Zieh die Zahl aus der Wurzel. Sie bekommt ihre eigene √." },
    "root-notation": { name: "Wurzel als Potenz", how: "Tippe auf die Wurzel, um sie als Potenz hoch ½ zu schreiben." },
    "root-across": { name: "Hoch ½ über das =", how: "Zieh das ½ über das =. Auf der anderen Seite wird daraus ein Quadrat." },
    "exp-of-log": { name: "Potenz hebt Logarithmus auf", how: "Zieh die Basis auf den Logarithmus in ihrem Exponenten. Die beiden heben sich auf." },
    "evaluate-log": { name: "Bekannte Logarithmen", how: "Tippe auf den Logarithmus, um ihn auszurechnen: `ln(e) = 1`, und der Logarithmus von 1 ist 0." },
    "power-of-base": { name: "Als Potenz der Basis", how: "Tippe auf die Zahl im Logarithmus, um sie als Potenz seiner Basis zu schreiben." },
    "log-of-product": { name: "Logarithmus aufteilen", how: "Zieh die Zahl aus dem Logarithmus heraus. Sie bekommt ihren eigenen Logarithmus." },
    "log-of-power": { name: "Exponent vor den Logarithmus", how: "Zieh den Exponenten nach vorn vor den Logarithmus." },
    "power-into-log": { name: "Zahl in den Logarithmus", how: "Zieh die Zahl vor dem Logarithmus auf den Logarithmus. Darin wird sie zum Exponenten." },
    "combine-logs": { name: "Logarithmen zusammenfassen", how: "Zieh einen Logarithmus auf den anderen. Bei einer Summe wird innen multipliziert, bei einer Differenz dividiert." },
    "exp-across": { name: "Basis über das =", how: "Zieh die Basis über das =. Auf der anderen Seite wird daraus ein Logarithmus." },
    "log-across": { name: "Logarithmus über das =", how: "Zieh den Logarithmus über das =. Auf der anderen Seite wird daraus eine Potenz." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Aufgabe ${label}${solved ? " – gelöst" : ""}`,
  goldNote: "Goldabzeichen. Üb ruhig weiter, so viel du willst.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${TIER[tier]}abzeichen. ` : ""}Noch ${more} ${more === 1 ? "richtige Antwort" : "richtige Antworten"} bei „${["Leicht", "Mittel", "Schwer"][tier]}“ bis ${TIER[tier + 1]}.`,

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
  pickFirst: "Wähl oben eine Antwort, dann rechne hier.",
  hint: "Tipp",
  undo: "Rückgängig",
  reset: "Zurücksetzen",
  solvedBang: "Gelöst!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${TIER[tier]}abzeichen für ${chapter}.`,
  theExercise: "die Aufgabe",
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
