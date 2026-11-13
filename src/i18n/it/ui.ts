import type { Strings } from "../en";

const medal = ["", "Medaglia di bronzo", "Medaglia d'argento", "Medaglia d'oro"] as const;

export const it: Strings = {
  htmlLang: "it",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Lingua",

  // Top bar
  makeExercises: "Crea esercizi",
  sandbox: "Laboratorio",
  openSandbox: "Apri il laboratorio →",
  sandboxIntro: "Scrivi un'espressione o un'equazione qualsiasi e prova tutte le mosse.",
  sandboxInput: "Espressione o equazione",
  sandboxPlaceholder: "es. 3(x - 2) = 2x + 1   oppure   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Carica",
  debugOn: "Modalità debug attiva (Shift+D)",

  // Home
  heroBefore: "L'algebra da ",
  heroWord: "toccare",
  heroAfter: " con mano.",
  heroText:
    "Trascina una parte qualsiasi di un'equazione: si sposta solo nei modi che la matematica permette. Trasformala finché non diventa uguale all'obiettivo.",
  learningPath: "Percorso",
  nextUp: "il prossimo",
  mastered: "completato",
  everyChapterOpen: "Tutti i capitoli sono aperti. Le frecce suggeriscono un ordine.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) =>
    `Capitolo ${n}: ${title}, ${done} su ${total} risolti`,
  chapterN: (n: number) => `Capitolo ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Si basa su ${titles}.`,
  notMasteredYet: (titles: string) => ` Non hai ancora completato ${titles}, ma puoi cominciare lo stesso.`,
  startLesson: "Inizia la lezione →",
  backToLesson: "Torna alla lezione →",
  leadsOnTo: (titles: string) => `Poi puoi passare a ${titles}.`,
  badges: "Medaglie",
  noBadgesYet: "Risolvi gli esercizi di un capitolo per vincere la sua medaglia.",
  badgesEarned: (n: number, total: number) => `${n} su ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => medal[tier],
  badgeNotEarned: "medaglia non ancora vinta",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? medal[tier].toLowerCase() : "medaglia non ancora vinta"}`,

  // Chapter page
  backToPath: "← Percorso",
  exercises: "Esercizi",
  practiceNote: "Si parte facili e si sale di difficoltà. Gli ultimi usano anche quello che hai imparato nei capitoli precedenti.",
  leadsOnToStart: "Poi puoi passare a ",
  leadsOnToEnd: ". Puoi andarci quando vuoi.",
  watchOut: "Attenzione.",

  // Progress
  solvedOf: (done: number, total: number) => `${done} su ${total} esercizi risolti`,
  guessedRight: (n: number, total: number) => `${n} su ${total} previsioni giuste al primo colpo`,
  exerciseTitle: (label: string, solved: boolean) => `Esercizio ${label}${solved ? " — risolto" : ""}`,
  solved: "risolto",
  guessedRightFirstTime: "previsione giusta al primo colpo",
  guessFirstShort: "Prima la previsione",
  goldNote: "Medaglia d'oro. Hai risolto tutti gli esercizi.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${medal[tier]}. ` : ""}${more === 1 ? "Ancora 1 esercizio" : `Ancora ${more} esercizi`} per ${["il bronzo", "l'argento", "l'oro"][tier]}.`,

  // Guided example
  exampleN: (n: number) => `Esempio ${n}`,
  notThisStep: "Questa mossa funziona, ma non è quella di questo passaggio. La rimetto a posto.",
  done: "Fatto.",
  keepGoing: "Puoi continuare: ora puoi fare qualsiasi mossa.",
  stepOf: (n: number, total: number) => `Passaggio ${n} di ${total}`,
  startOver: "Ricomincia",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: lezione`,
  nextExercise: "Esercizio successivo →",
  backToThePath: "Torna al percorso",
  exercisesNav: "Esercizi",
  previousTitle: (label: string) => `Precedente: esercizio ${label}`,
  previousLabel: (label: string) => `Esercizio precedente (${label})`,
  nextTitle: (label: string) => `Successivo: esercizio ${label}`,
  nextLabel: (label: string) => `Esercizio successivo (${label})`,
  exerciseN: (label: string) => `Esercizio ${label}`,
  guessPrompt: "Prima fai una previsione: che cosa diventa?",
  reveal: "Mostra",
  guessedBeforeRight: "Qui la tua previsione era giusta al primo colpo.",
  guessedBeforeWrong: (picked: boolean) =>
    `${picked ? "La prima volta avevi previsto quella rossa" : "La prima volta la previsione era sbagliata"}. Quella giusta è la verde.`,
  rightFirstTime: "Previsione giusta al primo colpo! Ora risolvilo.",
  notQuite: "Non proprio. Quella giusta è la verde. Risolvilo per capire dove hai sbagliato.",
  solvedBefore: "✓ Questo l'hai già risolto. Puoi risolverlo di nuovo.",
  makeItLookLike: "Trasformalo in",
  positiveLetters: "Qui le lettere indicano numeri positivi.",
  pickFirst: "Scegli una risposta qui sopra, poi risolvilo qui.",
  hint: "Suggerimento",
  undo: "Annulla",
  reset: "Ricomincia",
  solvedBang: "Risolto!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${medal[tier]} in ${chapter}.`,
  theExercise: "l'esercizio",
  goal: "obiettivo",
  moveCrashed: "Qualcosa è andato storto con questa mossa.",
  moveCrashedDetails: "I dettagli sono nella console del browser.",
  tryAgain: "Riprova",

  // Making a set
  ownTitle: "I tuoi esercizi",
  ownIntro:
    "Scrivi una serie di esercizi, per esempio per i tuoi studenti, e condividila con un link. In ogni esercizio gli studenti prima prevedono il risultato, poi lo risolvono a mano. Non viene salvato niente online: tutta la serie è contenuta nel link.",
  upload: "Carica un file .yaml",
  startFromExample: "Parti dall'esempio",
  yamlLabel: "La serie di esercizi, in YAML",
  check: "Controlla",
  checking: "Controllo che si possa risolvere con queste mosse…",
  unsolvable:
    "Non sono riuscito a risolverlo in 10 passaggi con queste mosse. Forse servono mosse di un capitolo successivo (`moves:`).",
  solvableIn: (n: number) => `Si risolve in ${n === 1 ? "1 mossa" : `${n} mosse`}.`,
  linkLabel: "Link alla serie",
  copied: "Copiato",
  copy: "Copia",
  open: "Apri",
  makeLink: "Crea il link",
  fixMarked: "Correggi gli esercizi segnati con ✗, poi controlla di nuovo.",
  howToWrite: "Come scrivere una serie",
  formatExample: `title: Un nome per la serie
moves: balance       # facoltativo: numero, id o titolo di un capitolo —
                     # le sue mosse e quelle dei capitoli prima. Se manca: tutte le mosse.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # facoltativo: due risposte sbagliate tra cui scegliere
    hint: Un breve suggerimento.   # facoltativo
    moves: collect            # facoltativo: mosse solo per questo esercizio`,
  writeMathsAs: "Scrivi la matematica come la digiteresti:",
  or: "o",
  twoEquations: ["Due equazioni insieme vanno su una sola riga, con", "in mezzo."],
  exampleSet: `title: Compiti settimana 3
# Mosse fino a "Equazioni" (numero, id o titolo di un capitolo). Se manca: tutte le mosse.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Due risposte sbagliate tra cui scegliere (facoltativo: altrimenti vengono create da sole).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Prima sposta il 2, poi il 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Questo link non funziona",
  brokenLinkText: "Forse è stato tagliato quando è stato copiato. Chiedilo di nuovo, oppure vai al percorso.",
  learningPathButton: "Percorso",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} su ${total} risolti · `,
    ` ${stars} previsioni giuste al primo colpo. In ogni esercizio, prima prevedi il risultato, poi risolvilo a mano.`,
  ],
  makeOwnSet: "Crea una serie tutta tua",
  ofCount: (n: number, count: number) => `${n} di ${count}`,
  backToSet: (title: string) => `Torna a ${title}`,

  // Checking a set
  set: {
    defaultTitle: "I miei esercizi",
    badYaml: (msg: string) => `Questo non è YAML valido: ${msg}`,
    expectedTop: "In cima servono `title:` ed `exercises:`.",
    noChapter: (name: string) =>
      `Non c'è nessun capitolo "${name}" per \`moves:\` (usa il numero, l'id o il titolo di un capitolo).`,
    expectedList: "Sotto `exercises:` serve un elenco.",
    emptyList: "L'elenco sotto `exercises:` è vuoto.",
    needsStart: "Manca `start:`.",
    needsGoal: "Manca `goal:`.",
    noChapterShort: (name: string) => `Non c'è nessun capitolo "${name}" per \`moves:\`.`,
    cantReadStart: (err: string) => `Non riesco a leggere il punto di partenza: ${err}`,
    cantReadGoal: (err: string) => `Non riesco a leggere l'obiettivo: ${err}`,
    doesntFollow: "Dal punto di partenza non si arriva all'obiettivo (controlla che non ci siano errori di battitura).",
    twoWrong: "`wrong:` deve contenere due risposte sbagliate.",
    cantReadWrong: (w: string, err: string) => `Non riesco a leggere la risposta sbagliata "${w}": ${err}`,
    wrongShape: (w: string, why: string) => `La risposta sbagliata "${w}" non ha la stessa forma dell'obiettivo: ${why}.`,
    wrongIsRight: (w: string) => `La risposta sbagliata "${w}" in realtà è giusta.`,
    noDecoys:
      "Non è stato possibile creare risposte sbagliate credibili: aggiungi `wrong:`, altrimenti l'esercizio si risolve senza previsione.",
    decoysMade: (list: string) => `Risposte sbagliate create tra cui scegliere: ${list}.`,
    shapeCount: "ha un numero diverso di equazioni",
    shapeRelation: "è un'espressione dove ci si aspetta un'equazione, o viceversa",
    shapeIsolated: (letter: string) => `non dice quanto vale ${letter}`,
  },
};
