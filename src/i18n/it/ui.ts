import type { Translation } from "../en";


export const it: Translation = {
  htmlLang: "it",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
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
  everyChapterOpen: "Tutti i capitoli sono aperti. Le frecce suggeriscono un ordine.",
  chapterN: (n: number) => `Capitolo ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Si basa su ${titles}.`,
  startLesson: "Inizia la lezione →",
  // Chapter page
  backToPath: "← Percorso",
  leadsOnToStart: "Poi puoi passare a ",
  leadsOnToEnd: ". Puoi andarci quando vuoi.",
  level: { easy: "Facile", medium: "Medio", hard: "Difficile" },
  anotherOne: "Un altro →",
  practice: "Esercitati",
  predict: "Mettiti alla prova",
  drills: {
    commute: { name: "Cambiare l'ordine", how: "Trascina un termine oltre quello accanto. Nelle somme e nelle moltiplicazioni l'ordine non conta." },
    combine: { name: "Sommare i numeri", how: "Trascina un numero sull'altro per sommarli." },
    "multiply-numbers": { name: "Moltiplicare i numeri", how: "Trascina un numero sull'altro numero che moltiplica." },
    "numbers-first": { name: "Il numero davanti", how: "Tocca un prodotto come `x·3` per scriverlo nel modo solito, `3x`." },
    "multiply-out": { name: "Calcolare un prodotto", how: "Tocca un prodotto di numeri, come `2·3`, per calcolarlo." },
    collect: { name: "Sommare i termini simili", how: "Trascina un termine su un termine simile, cioè con la stessa lettera. Si sommano." },
    "collect-cancel": { name: "Termini opposti", how: "Trascina un termine sul suo opposto. Si annullano." },
    distribute: { name: "Sviluppare una parentesi", how: "Trascina il numero davanti sulla parentesi. Moltiplica ogni termine al suo interno." },
    "distribute-neg": { name: "Meno davanti alla parentesi", how: "Trascina il meno sulla parentesi. Tutti i segni al suo interno cambiano." },
    "factor-out": { name: "Raccogliere un fattore comune", how: "Entrambi i termini hanno un fattore in comune. Trascinane uno fuori, tutto a sinistra." },
    "merge-powers": { name: "Stessa base: sommare gli esponenti", how: "Trascina una potenza sull'altra con la stessa base. Gli esponenti si sommano." },
    "power-to-product": { name: "Un quadrato come prodotto", how: "Tocca il ² per scrivere la parentesi due volte." },
    "move-term": { name: "Portare un termine dall'altra parte", how: "Trascina il numero dall'altra parte dell'=. Strada facendo cambia segno." },
    "move-factor": { name: "Dividere entrambi i membri", how: "Trascina il numero davanti alla lettera dall'altra parte dell'=. Divide l'altro membro." },
    "move-denominator": { name: "Moltiplicare entrambi i membri", how: "Trascina il denominatore dall'altra parte dell'=. Moltiplica l'altro membro." },
    "move-sign": { name: "Portare un meno dall'altra parte", how: "Trascina solo il meno dall'altra parte dell'=. L'altro membro cambia segno." },
    "swap-sides": { name: "Scambiare i membri", how: "Trascina un membro dall'altra parte dell'=, fino in fondo. I due membri si scambiano di posto." },
    "evaluate-fraction": { name: "Calcolare una frazione", how: "Tocca la linea di frazione per calcolarla." },
    "divide-numbers": { name: "Semplificare una frazione", how: "Trascina il denominatore sul numeratore. Si dividono entrambi per il loro fattore comune." },
    "cancel-factor": { name: "Semplificare un fattore comune", how: "Trascina il numero al denominatore sullo stesso numero al numeratore. Spariscono entrambi." },
    "power-of-power": { name: "Potenza di una potenza", how: "Trascina l'esponente esterno su quello interno. Si moltiplicano." },
    "divide-powers": { name: "Stessa base: sottrarre gli esponenti", how: "Trascina la potenza al denominatore su quella al numeratore. Gli esponenti si sottraggono." },
    "flip-across-bar": { name: "Oltre la linea di frazione", how: "Trascina la potenza in su, oltre la linea di frazione. Il suo esponente cambia segno." },
    "power-one": { name: "Esponente 1", how: "Trascina l'esponente 1 sulla sua base: `x¹` è semplicemente `x`." },
    "zero-power": { name: "Esponente 0", how: "Trascina l'esponente 0 sulla sua base. Qualsiasi cosa elevata alla 0 fa 1." },
    "tap-power": { name: "Calcolare una potenza", how: "Tocca l'esponente per calcolare la potenza: `2³` diventa 8." },
    "power-of-product": { name: "Esponente dentro la parentesi", how: "Trascina l'esponente dentro la parentesi. Ogni fattore al suo interno riceve il suo." },
    "split-number": { name: "Scomporre un numero", how: "Tocca il numero per scomporlo in due fattori." },
    "factor-shared": { name: "Mettere in comune un fattore", how: "Trascina la `x` di un termine su un altro termine con la `x`. Diventa un fattore comune a tutti e due." },
    "move-letter-factor": { name: "Dividere per una lettera", how: "Trascina una delle lettere moltiplicate dall'altra parte dell'=. Divide l'altro membro." },
    "move-letter-denominator": { name: "Moltiplicare per una lettera", how: "Trascina la lettera al denominatore dall'altra parte dell'=. Moltiplica l'altro membro." },
    "ineq-move-term": { name: "Portare un termine dall'altra parte", how: "Trascina il numero nell'altro membro. Cambia segno, ma il verso della disequazione resta lo stesso." },
    "ineq-swap": { name: "Scambiare i membri", how: "Trascina un membro oltre l'altro. Il simbolo si gira insieme a loro." },
    "ineq-sign": { name: "Portare un meno dall'altra parte", how: "Porta dall'altra parte solo il meno. Il verso si inverte." },
    "add-fractions": { name: "Sommare frazioni", how: "I denominatori sono uguali: trascina una frazione sull'altra. I numeratori si sommano." },
    "expand-fraction": { name: "Ridurre allo stesso denominatore", how: "Trascina il denominatore di una frazione sull'altra frazione. Il suo numeratore e il suo denominatore vengono moltiplicati per quel numero." },
    "multiply-fractions": { name: "Moltiplicare frazioni", how: "Trascina una frazione sull'altra. Si moltiplicano i numeratori tra loro e i denominatori tra loro." },
    "divide-by-fraction": { name: "Dividere per una frazione", how: "Trascina in su la frazione al denominatore, oltre la linea di frazione. Si capovolge e moltiplica." },
    "split-fraction": { name: "Spezzare una frazione", how: "Tira fuori un termine dal numeratore. Si porta dietro una copia del denominatore." },
    "times-one": { name: "Per 1", how: "Trascina l'1 su ciò che moltiplica. Moltiplicare per 1 non cambia niente." },
    substitute: { name: "Sostituire", how: "Trascina la `y` di `y = …` sulla `y` dell'altra equazione. Al suo posto arriva ciò a cui `y` è uguale." },
    "evaluate-root": { name: "Calcolare una radice", how: "Tocca la radice per calcolarla." },
    "split-square": { name: "Scomporre sotto radice", how: "Tocca il numero sotto la radice. Si scompone e ne esce un quadrato." },
    "pull-out-of-power": { name: "Spezzare una radice", how: "Porta il numero fuori dalla radice. Avrà una √ tutta sua." },
    "root-notation": { name: "Una radice come potenza", how: "Tocca la radice per scriverla come potenza con esponente ½." },
    "root-across": { name: "Esponente ½ dall'altra parte dell'=", how: "Trascina il ½ dall'altra parte dell'=. Nell'altro membro diventa un quadrato." },
    "exp-of-log": { name: "La potenza annulla il logaritmo", how: "Trascina la base sul logaritmo che ha all'esponente. Si annullano a vicenda." },
    "evaluate-log": { name: "Logaritmi da sapere", how: "Tocca il logaritmo per calcolarlo: `ln(e) = 1`, e il logaritmo di 1 è 0." },
    "power-of-base": { name: "Come potenza della base", how: "Tocca il numero nel logaritmo per scriverlo come potenza della base del logaritmo." },
    "log-of-product": { name: "Spezzare un logaritmo", how: "Porta il numero fuori dal logaritmo. Avrà un logaritmo tutto suo." },
    "log-of-power": { name: "Esponente fuori dal logaritmo", how: "Trascina l'esponente fuori, davanti al logaritmo." },
    "power-into-log": { name: "Numero dentro il logaritmo", how: "Trascina il numero davanti sul logaritmo. Diventa un esponente al suo interno." },
    "combine-logs": { name: "Unire i logaritmi", how: "Trascina un logaritmo sull'altro. Sommando i logaritmi si moltiplica all'interno, sottraendoli si divide." },
    "exp-across": { name: "Base dall'altra parte dell'=", how: "Trascina la base dall'altra parte dell'=. Nell'altro membro diventa un logaritmo." },
    "log-across": { name: "Logaritmo dall'altra parte dell'=", how: "Trascina il logaritmo dall'altra parte dell'=. Nell'altro membro diventa una potenza." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Esercizio ${label}${solved ? " — risolto" : ""}`,
  // Guided example
  done: "Fatto.",
  startOver: "Ricomincia",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: lezione`,
  nextExercise: "Esercizio successivo →",
  exercisesNav: "Esercizi",
  previousTitle: (label: string) => `Precedente: esercizio ${label}`,
  previousLabel: (label: string) => `Esercizio precedente (${label})`,
  nextTitle: (label: string) => `Successivo: esercizio ${label}`,
  nextLabel: (label: string) => `Esercizio successivo (${label})`,
  exerciseN: (label: string) => `Esercizio ${label}`,
  predictPrompt: "Prima fai una previsione: che cosa diventa?",
  reveal: "Mostra",
  predictedBeforeRight: "Qui la tua previsione era giusta al primo colpo.",
  predictedBeforeWrong: (picked: boolean) =>
    `${picked ? "La prima volta avevi previsto quella rossa" : "La prima volta la previsione era sbagliata"}. Quella giusta è la verde.`,
  rightFirstTime: "Previsione giusta al primo colpo! Ora risolvilo.",
  notQuite: "Non proprio. Quella giusta è la verde. Risolvilo per capire dove hai sbagliato.",
  solvedBefore: "✓ Questo l'hai già risolto. Puoi risolverlo di nuovo.",
  makeItLookLike: "Trasformalo in",
  pickFirst: "Scegli una risposta qui sopra, poi risolvilo qui.",
  hint: "Suggerimento",
  undo: "Annulla",
  solvedBang: "Risolto!",
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
