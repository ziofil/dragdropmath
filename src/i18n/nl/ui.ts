import type { Strings } from "../en";

const tierName = ["", "Bronzen", "Zilveren", "Gouden"] as const;
const metal = ["brons", "zilver", "goud"] as const;

export const nl: Strings = {
  htmlLang: "nl",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Taal",

  // Top bar
  makeExercises: "Oefeningen maken",
  sandbox: "Zandbak",
  openSandbox: "Open de zandbak →",
  sandboxIntro: "Typ een willekeurige uitdrukking of vergelijking en probeer alle zetten uit.",
  sandboxInput: "Uitdrukking of vergelijking",
  sandboxPlaceholder: "bijv. 3(x - 2) = 2x + 1   of   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Laden",
  debugOn: "Debugmodus staat aan (Shift+D)",

  // Home
  heroBefore: "Algebra die je ",
  heroWord: "voelt",
  heroAfter: ".",
  heroText:
    "Sleep elk stukje van een vergelijking. Het kan alleen bewegen zoals de wiskunde het toestaat. Schuif net zo lang tot het eruitziet als het doel.",
  learningPath: "Leerpad",
  nextUp: "volgende",
  mastered: "beheerst",
  everyChapterOpen: "Alle hoofdstukken zijn open. De pijlen geven een handige volgorde aan.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) =>
    `Hoofdstuk ${n}: ${title}, ${done} van ${total} opgelost`,
  chapterN: (n: number) => `Hoofdstuk ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} en ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Bouwt voort op ${titles}.`,
  notMasteredYet: (titles: string) => ` Nog niet beheerst: ${titles}. Je kunt toch al beginnen.`,
  startLesson: "Begin met de les →",
  backToLesson: "Terug naar de les →",
  leadsOnTo: (titles: string) => `Hierna komt ${titles}.`,
  badges: "Badges",
  noBadgesYet: "Los oefeningen op in een hoofdstuk om de badge ervan te verdienen.",
  badgesEarned: (n: number, total: number) => `${n} van ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `${tierName[tier]} badge`,
  badgeNotEarned: "badge nog niet verdiend",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? `${tierName[tier].toLowerCase()} badge` : "nog niet verdiend"}`,

  // Chapter page
  backToPath: "← Leerpad",
  exercises: "Oefeningen",
  practiceNote: "Ze beginnen makkelijk en worden steeds moeilijker. In de latere oefeningen gebruik je ook wat je in eerdere hoofdstukken hebt geleerd.",
  leadsOnToStart: "Hierna komt ",
  leadsOnToEnd: ". Daar kun je altijd heen.",
  watchOut: "Let op.",

  // Progress
  solvedOf: (done: number, total: number) => `${done} van ${total} oefeningen opgelost`,
  guessedRight: (n: number, total: number) => `${n} van ${total} in één keer goed voorspeld`,
  exerciseTitle: (label: string, solved: boolean) => `Oefening ${label}${solved ? " — opgelost" : ""}`,
  solved: "opgelost",
  guessedRightFirstTime: "in één keer goed voorspeld",
  guessFirstShort: "Eerst voorspellen",
  goldNote: "Gouden badge. Alle oefeningen opgelost.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${tierName[tier]} badge. ` : ""}Nog ${more} ${more === 1 ? "oefening" : "oefeningen"} voor ${metal[tier]}.`,

  // Guided example
  exampleN: (n: number) => `Voorbeeld ${n}`,
  notThisStep: "Die zet mag wel, maar hij hoort niet bij deze stap. We zetten hem terug.",
  done: "Klaar.",
  keepGoing: "Je mag verder gaan: nu is elke zet toegestaan.",
  stepOf: (n: number, total: number) => `Stap ${n} van ${total}`,
  startOver: "Opnieuw beginnen",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: les`,
  nextExercise: "Volgende oefening →",
  backToThePath: "Terug naar het leerpad",
  exercisesNav: "Oefeningen",
  previousTitle: (label: string) => `Vorige: oefening ${label}`,
  previousLabel: (label: string) => `Vorige oefening (${label})`,
  nextTitle: (label: string) => `Volgende: oefening ${label}`,
  nextLabel: (label: string) => `Volgende oefening (${label})`,
  exerciseN: (label: string) => `Oefening ${label}`,
  guessPrompt: "Voorspel eerst: wat komt eruit?",
  reveal: "Laat zien",
  guessedBeforeRight: "Deze had je in één keer goed voorspeld.",
  guessedBeforeWrong: (picked: boolean) =>
    `${picked ? "Je koos eerst de rode" : "Je eerste antwoord was fout"}. De groene is goed.`,
  rightFirstTime: "In één keer goed. Los hem nu op.",
  notQuite: "Net niet. De groene is goed. Los hem op, dan zie je waar het bij jou misging.",
  solvedBefore: "✓ Deze heb je al eens opgelost. Je mag hem nog een keer doen.",
  makeItLookLike: "Maak er dit van",
  positiveLetters: "Letters staan hier voor positieve getallen.",
  pickFirst: "Kies hierboven een antwoord en los het dan hier op.",
  hint: "Tip",
  undo: "Ongedaan maken",
  reset: "Opnieuw",
  solvedBang: "Opgelost!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${tierName[tier]} badge voor ${chapter}.`,
  theExercise: "de oefening",
  goal: "doel",
  moveCrashed: "Er ging iets mis bij die zet.",
  moveCrashedDetails: "Details staan in de console van de browser.",
  tryAgain: "Probeer opnieuw",

  // Making a set
  ownTitle: "Je eigen oefeningen",
  ownIntro:
    "Stel een reeks oefeningen samen, bijvoorbeeld voor je leerlingen, en deel die als link. Bij elke oefening voorspellen leerlingen eerst het antwoord en lossen ze het daarna met de hand op. Er wordt niets online opgeslagen: de hele reeks zit in de link.",
  upload: "Upload een .yaml-bestand",
  startFromExample: "Begin met het voorbeeld",
  yamlLabel: "De oefenreeks, in YAML",
  check: "Controleren",
  checking: "We kijken of het met deze zetten op te lossen is…",
  unsolvable: "Lukte niet in 10 stappen met deze zetten. Misschien zijn er zetten uit een later hoofdstuk nodig (`moves:`).",
  solvableIn: (n: number) => `Op te lossen in ${n} ${n === 1 ? "zet" : "zetten"}.`,
  linkLabel: "Link naar de reeks",
  copied: "Gekopieerd",
  copy: "Kopiëren",
  open: "Openen",
  makeLink: "Maak de link",
  fixMarked: "Verbeter de oefeningen met een ✗ en controleer opnieuw.",
  howToWrite: "Zo schrijf je een reeks",
  formatExample: `title: Een naam voor de reeks
moves: balance       # mag weg: nummer, id of titel van een hoofdstuk —
                     # de zetten daarvan en van alle eerdere hoofdstukken. Weglaten: alle zetten.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # mag weg: twee foute antwoorden om uit te kiezen
    hint: Een korte tip.      # mag weg
    moves: collect            # mag weg: zetten voor alleen deze oefening`,
  writeMathsAs: "Schrijf wiskunde zoals je het zou typen:",
  or: "of",
  twoEquations: ["Twee vergelijkingen tegelijk zet je op één regel, met", "ertussen."],
  exampleSet: `title: Huiswerk week 3
# Zetten tot en met "Vergelijkingen oplossen" (nummer, id of titel van een hoofdstuk). Weglaten voor alle zetten.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Twee foute antwoorden om uit te kiezen (mag weg: dan worden ze voor je gemaakt).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Eerst gaat de 2 naar de andere kant, dan de 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Deze link werkt niet",
  brokenLinkText: "Misschien is hij bij het kopiëren afgekapt. Vraag hem nog een keer op, of ga naar het leerpad.",
  learningPathButton: "Leerpad",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} van ${total} opgelost · `,
    ` ${stars} in één keer goed voorspeld. Voorspel bij elke oefening eerst het antwoord en los het dan met de hand op.`,
  ],
  makeOwnSet: "Maak zelf een reeks",
  ofCount: (n: number, count: number) => `${n} van ${count}`,
  backToSet: (title: string) => `Terug naar ${title}`,

  // Checking a set (shown to whoever writes one)
  set: {
    defaultTitle: "Mijn oefeningen",
    badYaml: (msg: string) => `Dit is geen geldige YAML: ${msg}`,
    expectedTop: "Bovenaan moeten `title:` en `exercises:` staan.",
    noChapter: (name: string) =>
      `Er is geen hoofdstuk "${name}" voor \`moves:\` (gebruik het nummer, de id of de titel van een hoofdstuk).`,
    expectedList: "Onder `exercises:` hoort een lijst te staan.",
    emptyList: "De lijst onder `exercises:` is leeg.",
    needsStart: "Er ontbreekt een `start:`.",
    needsGoal: "Er ontbreekt een `goal:`.",
    noChapterShort: (name: string) => `Er is geen hoofdstuk "${name}" voor \`moves:\`.`,
    cantReadStart: (err: string) => `De start is niet te lezen: ${err}`,
    cantReadGoal: (err: string) => `Het doel is niet te lezen: ${err}`,
    doesntFollow: "Het doel volgt niet uit de start (kijk even of er een typfout in zit).",
    twoWrong: "Bij `wrong:` horen twee foute antwoorden.",
    cantReadWrong: (w: string, err: string) => `Het foute antwoord "${w}" is niet te lezen: ${err}`,
    wrongShape: (w: string, why: string) => `Het foute antwoord "${w}" lijkt niet op het doel: ${why}.`,
    wrongIsRight: (w: string) => `Het foute antwoord "${w}" is eigenlijk goed.`,
    noDecoys:
      "Er konden geen overtuigende foute antwoorden worden gemaakt: voeg `wrong:` toe, of de oefening wordt opgelost zonder eerst te voorspellen.",
    decoysMade: (list: string) => `Gemaakte foute antwoorden om uit te kiezen: ${list}.`,
    shapeCount: "een ander aantal vergelijkingen",
    shapeRelation: "een uitdrukking waar een vergelijking wordt verwacht, of andersom",
    shapeIsolated: (letter: string) => `er staat niet wat ${letter} is`,
  },
};
