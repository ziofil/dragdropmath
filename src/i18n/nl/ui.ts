import type { Translation } from "../en";


export const nl: Translation = {
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
  everyChapterOpen: "Alle hoofdstukken zijn open. De pijlen geven een handige volgorde aan.",
  chapterN: (n: number) => `Hoofdstuk ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} en ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Bouwt voort op ${titles}.`,
  startLesson: "Begin met de les →",
  // Chapter page
  backToPath: "← Leerpad",
  leadsOnToStart: "Hierna komt ",
  leadsOnToEnd: ". Daar kun je altijd heen.",
  level: { easy: "Makkelijk", medium: "Gemiddeld", hard: "Moeilijk" },
  anotherOne: "Nog een →",
  practice: "Oefenen",
  predict: "Test jezelf",
  drills: {
    commute: { name: "Volgorde omwisselen", how: "Sleep een term langs zijn buurman. Bij + en × maakt de volgorde niet uit." },
    combine: { name: "Getallen optellen", how: "Sleep het ene getal op het andere om ze op te tellen." },
    "multiply-numbers": { name: "Getallen vermenigvuldigen", how: "Sleep een getal op het getal waarmee het vermenigvuldigd wordt." },
    "numbers-first": { name: "Getal vooraan", how: "Tik op een product zoals `x·3` om het op de gewone manier te schrijven: `3x`." },
    "multiply-out": { name: "Product uitrekenen", how: "Tik op een product van getallen, zoals `2·3`, om het uit te rekenen." },
    collect: { name: "Gelijksoortige termen samennemen", how: "Sleep een term op een gelijksoortige term, dus een met dezelfde letter. Ze worden opgeteld." },
    "collect-cancel": { name: "Tegengestelde termen", how: "Sleep een term op zijn tegengestelde. Ze vallen tegen elkaar weg." },
    distribute: { name: "Haakjes wegwerken", how: "Sleep het getal voor de haakjes op de haakjes. Het vermenigvuldigt elke term ertussen." },
    "distribute-neg": { name: "Minteken voor de haakjes", how: "Sleep het minteken op de haakjes. Alle tekens ertussen veranderen." },
    "factor-out": { name: "Buiten haakjes brengen", how: "Beide termen hebben een gemeenschappelijke factor. Sleep die bij een van de twee naar voren, helemaal links voor de termen." },
    "merge-powers": { name: "Zelfde grondtal: exponenten optellen", how: "Sleep de ene macht op de andere met hetzelfde grondtal. De exponenten worden opgeteld." },
    "power-to-product": { name: "Een kwadraat als product", how: "Tik op de ² om de haakjes twee keer op te schrijven." },
    "move-term": { name: "Term naar de overkant", how: "Sleep het getal naar de andere kant van het =. Onderweg verandert het teken." },
    "move-factor": { name: "Beide kanten delen", how: "Sleep het getal voor de letter naar de andere kant van het =. Daar ga je erdoor delen." },
    "move-denominator": { name: "Beide kanten vermenigvuldigen", how: "Sleep de noemer van de breuk naar de andere kant van het =. Daar vermenigvuldigt hij." },
    "move-sign": { name: "Minteken naar de overkant", how: "Sleep alleen het minteken naar de andere kant van het =. Daar verandert het teken." },
    "swap-sides": { name: "Kanten omwisselen", how: "Sleep een kant over het = en voorbij het andere uiteinde. De twee kanten wisselen van plaats." },
    "evaluate-fraction": { name: "Breuk uitrekenen", how: "Tik op de breukstreep om de breuk uit te rekenen." },
    "divide-numbers": { name: "Breuk vereenvoudigen", how: "Sleep het getal in de noemer op het getal in de teller. Ze worden allebei gedeeld door hun gemeenschappelijke factor." },
    "cancel-factor": { name: "Gemeenschappelijke factor wegdelen", how: "Sleep het getal in de noemer op hetzelfde getal in de teller. Ze verdwijnen allebei." },
    "power-of-power": { name: "Macht van een macht", how: "Sleep de buitenste exponent op de binnenste. Ze worden vermenigvuldigd." },
    "divide-powers": { name: "Zelfde grondtal: exponenten aftrekken", how: "Sleep de macht in de noemer op die in de teller. De exponenten worden van elkaar afgetrokken." },
    "flip-across-bar": { name: "Over de breukstreep", how: "Sleep de macht omhoog over de breukstreep. Het teken van de exponent verandert." },
    "power-one": { name: "Tot de macht 1", how: "Sleep de exponent 1 op zijn grondtal: `x¹` is gewoon `x`." },
    "zero-power": { name: "Tot de macht 0", how: "Sleep de exponent 0 op zijn grondtal. Alles tot de macht 0 is 1." },
    "tap-power": { name: "Macht uitrekenen", how: "Tik op de exponent om de macht uit te rekenen: `2³` wordt 8." },
    "power-of-product": { name: "Exponent tussen de haakjes", how: "Sleep de exponent naar binnen, tussen de haakjes. Elke factor daar krijgt zijn eigen exponent." },
    "split-number": { name: "Getal splitsen", how: "Tik op het getal om het in twee factoren te splitsen." },
    "factor-shared": { name: "Samen buiten haakjes", how: "Sleep de `x` van een term op een andere term met een `x`. Die `x` komt voor beide termen samen buiten haakjes." },
    "move-letter-factor": { name: "Delen door een letter", how: "Sleep een van de vermenigvuldigde letters naar de andere kant van het =. Daar ga je erdoor delen." },
    "move-letter-denominator": { name: "Vermenigvuldigen met een letter", how: "Sleep de letter in de noemer naar de andere kant van het =. Daar vermenigvuldigt hij." },
    "ineq-move-term": { name: "Term naar de overkant", how: "Sleep het getal naar de andere kant van het ongelijkheidsteken. Zijn eigen teken verandert, maar het ongelijkheidsteken blijft staan." },
    "ineq-swap": { name: "Kanten omwisselen", how: "Sleep de ene kant voorbij de andere. Het ongelijkheidsteken klapt mee om." },
    "ineq-sign": { name: "Minteken naar de overkant", how: "Sleep alleen het minteken naar de overkant. Het ongelijkheidsteken klapt om." },
    "add-fractions": { name: "Breuken optellen", how: "De noemers zijn gelijk: sleep de ene breuk op de andere. De tellers worden opgeteld." },
    "expand-fraction": { name: "Gelijknamig maken", how: "Sleep de noemer van de ene breuk op de andere breuk. Daarvan worden teller en noemer ermee vermenigvuldigd." },
    "multiply-fractions": { name: "Breuken vermenigvuldigen", how: "Sleep de ene breuk op de andere. Teller keer teller, en noemer keer noemer." },
    "divide-by-fraction": { name: "Delen door een breuk", how: "Sleep de breuk in de noemer omhoog over de breukstreep. Hij wordt omgekeerd en gaat vermenigvuldigen." },
    "split-fraction": { name: "Breuk splitsen", how: "Haal een term uit de teller. Hij neemt een kopie van de noemer mee." },
    "times-one": { name: "Keer 1", how: "Sleep de 1 op wat hij vermenigvuldigt. Keer 1 verandert niets." },
    substitute: { name: "Substitueren", how: "Sleep de `y` van `y = …` op de `y` in de andere vergelijking. Die wordt vervangen door waar `y` gelijk aan is." },
    "evaluate-root": { name: "Wortel uitrekenen", how: "Tik op de wortel om hem uit te rekenen." },
    "split-square": { name: "Splitsen onder de wortel", how: "Tik op het getal onder de wortel. Er wordt een kwadraat afgesplitst." },
    "pull-out-of-power": { name: "Wortel splitsen", how: "Haal het getal uit de wortel. Het krijgt zijn eigen √." },
    "root-notation": { name: "Een wortel als macht", how: "Tik op de wortel om hem te schrijven als macht ½." },
    "root-across": { name: "Macht ½ naar de overkant", how: "Sleep de ½ naar de andere kant van het =. Daar wordt het een kwadraat." },
    "exp-of-log": { name: "Macht heft logaritme op", how: "Sleep het grondtal op de logaritme in zijn exponent. Ze heffen elkaar op." },
    "evaluate-log": { name: "Bekende logaritmen", how: "Tik op de logaritme om hem uit te rekenen: `ln(e) = 1`, en de logaritme van 1 is 0." },
    "power-of-base": { name: "Als macht van het grondtal", how: "Tik op het getal in de logaritme om het te schrijven als macht van het grondtal van de logaritme." },
    "log-of-product": { name: "Logaritme splitsen", how: "Haal het getal uit de logaritme. Het krijgt zijn eigen logaritme." },
    "log-of-power": { name: "Exponent uit de logaritme", how: "Sleep de exponent naar voren, voor de logaritme." },
    "power-into-log": { name: "Getal in de logaritme", how: "Sleep het getal voor de logaritme op de logaritme. Binnenin wordt het een exponent." },
    "combine-logs": { name: "Logaritmen samennemen", how: "Sleep de ene logaritme op de andere. Optellen wordt binnenin vermenigvuldigen, aftrekken wordt delen." },
    "exp-across": { name: "Grondtal naar de overkant", how: "Sleep het grondtal naar de andere kant van het =. Daar wordt het een logaritme." },
    "log-across": { name: "Logaritme naar de overkant", how: "Sleep de logaritme naar de andere kant van het =. Daar wordt het een macht." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Oefening ${label}${solved ? " — opgelost" : ""}`,
  // Guided example
  done: "Klaar.",
  startOver: "Opnieuw beginnen",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: les`,
  nextExercise: "Volgende oefening →",
  exercisesNav: "Oefeningen",
  previousTitle: (label: string) => `Vorige: oefening ${label}`,
  previousLabel: (label: string) => `Vorige oefening (${label})`,
  nextTitle: (label: string) => `Volgende: oefening ${label}`,
  nextLabel: (label: string) => `Volgende oefening (${label})`,
  exerciseN: (label: string) => `Oefening ${label}`,
  predictPrompt: "Voorspel eerst: wat komt eruit?",
  reveal: "Laat zien",
  predictedBeforeRight: "Deze had je in één keer goed voorspeld.",
  predictedBeforeWrong: (picked: boolean) =>
    `${picked ? "Je koos eerst de rode" : "Je eerste antwoord was fout"}. De groene is goed.`,
  rightFirstTime: "In één keer goed. Los hem nu op.",
  notQuite: "Net niet. De groene is goed. Los hem op, dan zie je waar het bij jou misging.",
  solvedBefore: "✓ Deze heb je al eens opgelost. Je mag hem nog een keer doen.",
  makeItLookLike: "Maak er dit van",
  pickFirst: "Kies hierboven een antwoord en los het dan hier op.",
  hint: "Tip",
  undo: "Ongedaan maken",
  solvedBang: "Opgelost!",
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
