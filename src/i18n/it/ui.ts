import type { Translation } from "../en";


export const it: Translation = {
  htmlLang: "it",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
  language: "Lingua",

  // Top bar
  makeExercises: "Crea esercizi",
  skin: "Tema",
  skins: { modern: "Moderno", codex: "Codex", paper: "Carta", blackboard: "Lavagna" },
  settings: "Impostazioni",
  numbersInColour: "Numeri a colori",
  debugMode: "Modalità debug",
  sandboxInput: "Espressione o equazione",
  sandboxPlaceholder: "es. 3(x - 2) = 2x + 1   oppure   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Carica",
  debugOn: "Modalità debug attiva: tocca per disattivarla",

  // Home
  heroBefore: "L'algebra da ",
  heroWord: "toccare",
  heroAfter: " con mano.",
  heroText:
    "Trascina una parte qualsiasi di un'equazione: si sposta solo nei modi che la matematica permette. Trasformala finché non diventa uguale all'obiettivo.",
  learningPath: "Percorso",
  chapterNodeLabel: (n: number, title: string) => `Capitolo ${n}: ${title}`,
  chapterN: (n: number) => `Capitolo ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Si basa su ${titles}.`,
  startLesson: "Inizia la lezione →",

  // Chapter page
  backToPath: "← Percorso",
  level: { easy: "Facile", medium: "Medio", hard: "Difficile" },
  makingExercise: "Sto preparando un esercizio…",
  anotherOne: "Un altro →",
  progressHere:
    "I tuoi progressi sono salvati solo in questo browser. Salvali in un file per non perderli, o per portarli su un altro dispositivo.",
  saveProgress: "Esporta i progressi in un file",
  loadProgress: "Carica i progressi da un file",
  progressSaved: "Salvato. Carica quel file qui, o in qualsiasi altro browser, per ritrovare i tuoi progressi.",
  rightsReserved: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Tutti i diritti riservati.`,
  aboutLink: "Informazioni",
  about: {
    title: "Informazioni su DragDropMath",
    sections: [
      {
        heading: "Che cos'è",
        text: [
          "DragDropMath è algebra da fare con le mani. Trascini una parte qualsiasi di un'espressione o di un'equazione, e questa si sposta solo nei modi che la matematica permette. Una mossa sbagliata semplicemente non succede: così impari che cosa si può fare sentendolo, non imparando a memoria delle regole.",
          "C'è un percorso che va dal riordinare i termini fino alle equazioni di secondo grado. Ogni capitolo ha una lezione, esercizi su tre livelli e gli esercizi di «A mente», in cui prima immagini il risultato a mente e poi lo ricavi. Gli insegnanti possono scrivere le proprie serie di esercizi e condividerle con un link.",
        ],
      },
      {
        heading: "Chi l'ha fatto",
        text: [
          "DragDropMath è stato creato da Filippo Miatto, perché l'algebra diventi qualcosa che si può vedere e toccare, e non un elenco di regole da ricordare.",
        ],
      },
      {
        heading: "La tua privacy",
        text: [
          "Niente account, niente pubblicità, nessun tracciamento. I tuoi progressi restano solo nel tuo browser, e niente di quello che fai viene inviato da qualche parte. Nelle Impostazioni puoi salvarli in un file, per non perderli o per portarli su un altro dispositivo.",
          "Una serie di esercizi è contenuta tutta nel suo link: non ne viene salvato niente online.",
        ],
      },
    ],
  },
  progressNotABackup: "Questo file non contiene progressi di DragDropMath.",
  progressReplace: (saved: string) =>
    `I tuoi progressi in questo browser verranno sostituiti con quelli del file${saved ? ` (salvato il ${saved})` : ""}. Vuoi caricarlo?`,
  progressLoadIt: "Caricalo",
  cancel: "Annulla",
  progressNoRoom: "Il browser non è riuscito a salvarlo, quindi non è cambiato niente.",
  progressBlocked:
    "Questo browser non conserva niente per questo sito (una finestra in incognito, o il salvataggio dei dati disattivato), quindi non ci sono progressi da salvare.",
  showMove: "Mostra",
  lesson: "Lezione",
  practice: "Esercitati",
  predict: "A mente",
  scores: "Punteggi di «A mente»",
  scoreOf: (n: number) => `punteggio ${n}`,
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) =>
    `Punteggio al livello ${level.toLowerCase()}: ${now}${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  drills: {
    commute: {
      name: "Cambiare l'ordine",
      how: "Trascina un termine oltre quello accanto. Nelle somme e nei prodotti l'ordine non conta.",
      text: [
        "L'ordine in cui sommi non cambia il risultato: `2 + x` e `x + 2` sono la stessa cosa.",
        "Ogni parte di una somma si chiama termine. Quando si sposta, un termine si porta dietro il suo segno: in `5 − 3 + x` il meno appartiene al 3.",
      ],
    },
    combine: {
      name: "Sommare i numeri",
      how: "Trascina un numero sull'altro per sommarli.",
      text: ["Due numeri nella stessa somma si possono sommare tra loro. Una lettera sta al posto di un numero che non conosciamo ancora, quindi resta com'è."],
    },
    "multiply-numbers": {
      name: "Moltiplicare i numeri",
      how: "Trascina il numero a destra sull'altro numero che moltiplica.",
      text: ["Anche nella moltiplicazione l'ordine non conta: `2·x·5` è `2·5·x`. Quindi il 2 e il 5 si possono moltiplicare tra loro, e si ottiene `10x`."],
    },
    "numbers-first": {
      name: "Il numero davanti",
      how: "Tocca un prodotto come `x·3` per scriverlo nel modo solito, `3x`.",
      text: ["Si scrive prima il numero e si omette il puntino: `x·3` si scrive `3x`. È così semplice che d'ora in poi succede da solo."],
    },
    "multiply-out": {
      name: "Calcolare un prodotto",
      how: "Tocca un prodotto di numeri, come `2·3`, per calcolarlo.",
      text: ["Un prodotto di soli numeri si può calcolare: `2·3` fa 6."],
    },
    collect: {
      name: "Sommare i termini simili",
      how: "Trascina un termine su un termine simile, cioè con le stesse lettere con gli stessi esponenti. Si sommano.",
      text: [
        "`3x` vuol dire `x + x + x`. Quindi `3x + 2x` sono tre x più due x: `5x`.",
        "Si sommano solo i termini simili, cioè quelli con esattamente le stesse lettere, con gli stessi esponenti. `3x + 2` non può diventare `5x`, i termini in x restano separati da quelli in y, e lo stesso vale per `x²` e `3x`.",
      ],
    },
    "collect-cancel": {
      name: "Termini opposti",
      how: "Trascina un termine sul suo opposto. Si annullano.",
      text: ["Con la sottrazione funziona allo stesso modo: `5y − 2y` fa `3y`. Qualsiasi cosa meno se stessa fa 0, quindi `a + b − a` è semplicemente `b`."],
    },
    distribute: {
      name: "Sviluppare una parentesi",
      how: "Trascina il numero davanti sulla parentesi: moltiplica ogni termine al suo interno. Poi tocca il · per calcolare i numeri.",
      text: [
        "`2(x + 3)` vuol dire 2 volte `(x + 3)`: 2 volte x più 2 volte 3, cioè `2x + 2·3`. Il numero fuori moltiplica ogni termine dentro la parentesi.",
        "Pensa a un rettangolo alto 2 e largo `x + 3`. Le sue due parti hanno area `2·x` e `2·3`, e insieme formano tutto il rettangolo.",
      ],
    },
    "distribute-neg": {
      name: "Meno davanti alla parentesi",
      how: "Trascina il meno sulla parentesi. Tutti i segni al suo interno cambiano.",
      text: ["`−(x − 4)` vuol dire −1 per la parentesi. Il −1 moltiplica ogni termine, quindi tutti i segni all'interno cambiano."],
    },
    "factor-out": {
      name: "Raccogliere un fattore comune",
      how: "Entrambi i termini hanno un fattore in comune. Tienilo premuto in uno dei due termini, poi trascinalo fuori, davanti a tutto, oltre l'estremità sinistra.",
      text: [
        "Scomporre una somma vuol dire scriverla come prodotto. In `3x + 3y` entrambi i termini sono qualcosa per 3. Allora il 3 si può scrivere una volta sola, davanti a una parentesi che contiene ciò che resta di ogni termine: `3x + 3y = 3(x + y)`.",
        "Funziona perché, sviluppando `3(x + y)`, si ritrova `3x + 3y`: il 3 moltiplica ogni termine dentro la parentesi. È anche il modo per verificare una scomposizione.",
      ],
    },
    "split-exponent": {
      name: "Spezzare un esponente",
      how: "Tira fuori un termine dall'esponente. La potenza si spezza in due potenze con la stessa base.",
      text: ["`2^(x + 3)` è il prodotto di x + 3 fattori uguali a 2: prima x, poi altri 3. Quindi è `2^x·2^3`: una somma all'esponente diventa un prodotto di potenze."],
    },
    "merge-powers": {
      name: "Stessa base: sommare gli esponenti",
      how: "Trascina una potenza sull'altra, oppure tocca il · tra le due. Gli esponenti si sommano: tocca il + per calcolarli.",
      text: [
        "`x³` vuol dire `x·x·x`. Il numero piccolo, l'esponente, conta quante x ci sono.",
        "Quindi `x²·x³` sono due x per tre x: cinque x in tutto. Nel prodotto di potenze con la stessa base, gli esponenti si sommano.",
      ],
    },
    "power-to-product": {
      name: "Un quadrato come prodotto",
      how: "Tocca il ² per scrivere la parentesi due volte. Poi sviluppa il prodotto come nell'esempio precedente (per spostare un fattore da solo, tienilo premuto: con un tocco rapido prendi tutto il termine) e somma i termini simili.",
      text: ["`(x + 1)²` è `(x + 1)(x + 1)`, quindi si sviluppa allo stesso modo."],
    },
    "move-term": {
      name: "Portare un termine dall'altra parte",
      how: "Trascina il numero dall'altra parte dell'=. Strada facendo cambia segno. Poi tocca il − per fare il calcolo.",
      text: [
        "Un'equazione dice che due membri sono uguali. Se fai la stessa cosa a entrambi i membri, restano uguali.",
        "Portare un termine dall'altra parte dell'`=` fa proprio questo. Da `x + 3 = 10`, togli 3 a entrambi i membri: `x = 10 − 3`. Ecco perché `+3` diventa `−3` nell'altro membro.",
      ],
    },
    "move-factor": {
      name: "Dividere entrambi i membri",
      how: "Trascina il numero davanti alla lettera dall'altra parte dell'=. Divide l'altro membro. Poi tocca la linea di frazione per fare il calcolo.",
      text: ["Un numero che moltiplica un intero membro, quando passa dall'altra parte, divide l'altro membro. Da `2x = 8`, dividi entrambi i membri per 2: `x = 8/2`."],
    },
    "move-denominator": {
      name: "Moltiplicare entrambi i membri",
      how: "Trascina il denominatore dall'altra parte dell'=. Moltiplica l'altro membro. Poi tocca il · per fare il calcolo.",
      text: ["Il denominatore di una frazione, quando passa dall'altra parte, moltiplica l'altro membro. Da `x/3 = 4`, moltiplica entrambi i membri per 3: `x = 4·3`."],
    },
    "move-sign": {
      name: "Portare un meno dall'altra parte",
      how: "Trascina solo il meno dall'altra parte dell'=. L'altro membro cambia segno.",
      text: ["Anche un meno davanti a un intero membro può passare dall'altra parte: entrambi i membri vengono moltiplicati per −1, quindi `−x = 6` diventa `x = −6`."],
    },
    "swap-sides": {
      name: "Scambiare i membri",
      how: "Trascina un membro dall'altra parte dell'=, fino in fondo. I due membri si scambiano di posto.",
      text: ["`7 = x` e `x = 7` dicono la stessa cosa, quindi i due membri si possono scambiare di posto."],
    },
    "evaluate-fraction": {
      name: "Calcolare una frazione",
      how: "Tocca la linea di frazione per calcolarla.",
      text: ["Una frazione che dà un numero intero si può calcolare: `12/3` fa 4."],
    },
    "divide-numbers": {
      name: "Semplificare una frazione",
      how: "Tocca la linea di frazione. Numeratore e denominatore vengono divisi per il loro fattore comune.",
      text: ["Una frazione si semplifica dividendo numeratore e denominatore per lo stesso numero: `6/8 = 3/4`. Il suo valore non cambia."],
    },
    "letter-in": {
      name: "Una lettera per una parentesi",
      how: "Trascina la lettera davanti sulla parentesi. Poi tieni premuta una delle due lettere vicine e lasciala sull'altra: `x·x` è `x²`. (Con un tocco rapido prenderesti tutto il termine.)",
      text: ["La lettera moltiplica ogni termine dentro la parentesi, proprio come farebbe un numero: `x(x + 3) = x·x + x·3`. E `x·x` è una potenza, `x²`, come hai visto nel capitolo Potenze."],
    },
    "factor-then-cancel": {
      name: "Raccogliere, poi semplificare",
      how: "Tieni premuto il numero in un termine del numeratore e trascinalo fuori, davanti a tutto, oltre l'estremità sinistra. Poi tocca la linea di frazione: si semplifica.",
      text: [
        "Puoi semplificare solo un fattore di tutto il numeratore. In `(2x + 6)/2` il 2 è un fattore di ciascun termine, quindi prima raccoglilo: `(2(x + 3))/2`. Ora è un fattore di tutto il numeratore, e si semplifica con il denominatore.",
      ],
    },
    "cancel-factor": {
      name: "Semplificare un fattore comune",
      how: "Tocca la linea di frazione. Ciò che numeratore e denominatore hanno in comune si semplifica.",
      text: ["Un numero che moltiplica tutto il numeratore e tutto il denominatore si semplifica: `(3x)/3` è `x`. In `(3x + 1)/3` invece no: il 3 moltiplica solo una parte del numeratore."],
    },
    "power-of-power": {
      name: "Potenza di una potenza",
      how: "Trascina l'esponente esterno su quello interno. Si moltiplicano: tocca il · per fare il calcolo.",
      text: ["`(x²)³` è `x²·x²·x²`. Sono 2 + 2 + 2 = 6 x, quindi gli esponenti si moltiplicano."],
    },
    "divide-powers": {
      name: "Stessa base: sottrarre gli esponenti",
      how: "Tocca la linea di frazione. Le potenze con la stessa base si uniscono e i loro esponenti si sottraggono: tocca il − per fare il calcolo.",
      text: ["`x⁵/x²` ha cinque x al numeratore e due al denominatore. Se ne semplificano due sopra e due sotto, e sopra ne restano tre: nella divisione gli esponenti si sottraggono."],
    },
    "flip-across-bar": {
      name: "Oltre la linea di frazione",
      how: "Trascina la potenza in su, oltre la linea di frazione. Il suo esponente cambia segno.",
      text: ["Se al denominatore ci sono più x, l'esponente diventa negativo: `x⁻²` vuol dire `1/x²`. Quando una potenza passa dall'altra parte della linea di frazione, il suo esponente cambia segno."],
    },
    "power-one": {
      name: "Esponente 1",
      how: "Trascina l'esponente 1 sulla sua base.",
      text: ["`x¹` è una x sola: semplicemente `x`. È così semplice che d'ora in poi succede da solo."],
    },
    "zero-power": {
      name: "Esponente 0",
      how: "Tieni premuto l'esponente 0, poi trascinalo sulla sua base. Poi tocca il + per fare la somma.",
      text: ["`x³/x³` fa 1 (se x non è 0), ma è anche `x^(3 − 3) = x⁰`. Quindi qualsiasi numero diverso da 0, elevato alla 0, fa 1."],
    },
    "tap-power": {
      name: "Calcolare una potenza",
      how: "Tocca l'esponente per calcolare la potenza: `2³` diventa 8.",
      text: ["La potenza di un numero si può calcolare: `2³` è `2·2·2 = 8`."],
    },
    "power-of-product": {
      name: "Esponente dentro la parentesi",
      how: "Trascina l'esponente dentro la parentesi: ogni fattore al suo interno riceve il suo. Poi tocca l'esponente del numero per calcolarlo.",
      text: ["`(2x)³` è `2x·2x·2x`, cioè `2³·x³`. Ogni fattore dentro la parentesi viene elevato all'esponente."],
    },
    "split-number": {
      name: "Scomporre un numero",
      how: "Tocca il numero davanti alla lettera per scomporlo in due fattori. Tocca anche l'altro numero. Poi tocca il + tra i due termini: il fattore comune viene raccolto. (Oppure tienilo premuto e trascinalo fuori, davanti a tutto, oltre l'estremità sinistra.)",
      text: ["Per trovare un fattore comune, scomponi i numeri in fattori. In `2x + 6`, il 6 è `2·3`, e adesso entrambi i termini hanno un 2."],
    },
    "split-term": {
      name: "Spezzare il termine di mezzo",
      how: "Tocca il termine di mezzo. Si spezza in due, pronto per il raccoglimento parziale.",
      text: [
        "Per scomporre `x² + 5x + 6`, cerca due numeri che sommati diano 5 e moltiplicati diano 6: 2 e 3. Scrivi `5x` come `2x + 3x`.",
        "Ora i termini sono quattro, e si raccolgono a due a due: `x(x + 2) + 3(x + 2)`, poi `(x + 2)(x + 3)`.",
      ],
    },
    "difference-of-squares": {
      name: "Differenza di due quadrati",
      how: "Tocca il meno tra i due quadrati.",
      text: [
        "Un quadrato meno un quadrato si scompone sempre allo stesso modo: `a² − b² = (a − b)(a + b)`. Per verificarlo, sviluppa il prodotto: i termini di mezzo si annullano.",
        "Funziona solo con una differenza, un quadrato meno un quadrato. Una somma di due quadrati, come `x² + 9`, non si scompone affatto. Un quadrato meno un numero che non è un quadrato perfetto, come `x² − 7`, invece sì, ma con le radici: `(x − √7)(x + √7)`.",
      ],
    },
    "factor-shared": {
      name: "Mettere in comune un fattore",
      how: "Tieni premuta la `x` di un termine, poi trascinala su un altro termine con la `x`: diventa comune a tutti e due. (Oppure tocca il segno tra due termini: si raccoglie ciò che hanno in comune.) Poi raccogli ciò che hanno in comune gli ultimi due termini (spesso un numero), e infine la parentesi comune ai due prodotti.",
      text: ["Con quattro termini si lavora a coppie: è il raccoglimento parziale. Raccogli un fattore comune dai primi due termini, poi dagli ultimi due. Se le due parentesi sono uguali, raccogli anche la parentesi."],
    },
    "ineq-move-term": {
      name: "Portare un termine dall'altra parte",
      how: "Trascina il numero dall'altra parte del simbolo di disuguaglianza. Cambia segno, ma il verso della disequazione resta lo stesso. Poi tocca il − per fare il calcolo.",
      text: [
        "`x < 7` dice che x è minore di 7. La parte aperta del simbolo è rivolta verso il numero più grande.",
        "Se aggiungi o togli la stessa quantità a entrambi i membri, il verso resta lo stesso. Quindi un termine passa dall'altra parte proprio come in un'equazione.",
      ],
    },
    "ineq-swap": {
      name: "Scambiare i membri",
      how: "Trascina un membro oltre l'altro. Il simbolo di disuguaglianza si gira insieme a loro.",
      text: ["`3 > x` e `x < 3` dicono la stessa cosa: x è minore di 3. Quindi i membri si possono scambiare, purché il simbolo si giri insieme a loro."],
    },
    "ineq-sign": {
      name: "Portare un meno dall'altra parte",
      how: "Porta dall'altra parte solo il meno. Il verso della disequazione si inverte.",
      text: ["Moltiplicando per −1 l'ordine si inverte: `2 < 3`, ma `−2 > −3`. Quindi quando un meno passa dall'altra parte, il verso si inverte."],
    },
    "add-fractions": {
      name: "Sommare frazioni",
      how: "I denominatori sono uguali: trascina una frazione sull'altra, oppure tocca il + tra le due. Poi tocca il + al numeratore per sommare i numeratori.",
      text: ["`3/4` vuol dire 3 quarti. Quando i denominatori sono uguali, basta sommare i numeratori: 1 quinto più 2 quinti fa 3 quinti, quindi `1/5 + 2/5 = 3/5`."],
    },
    "expand-fraction": {
      name: "Ridurre allo stesso denominatore",
      how: "Tieni premuto il denominatore di una frazione, poi trascinalo sull'altra frazione, e poi fai il contrario: ora hanno lo stesso denominatore. Tocca ogni · per calcolare numeratori e denominatori, poi somma le frazioni.",
      text: [
        "Se moltiplichi numeratore e denominatore per lo stesso numero, la frazione non cambia: `1/2 = 2/4 = 3/6`.",
        "È così che si riduce allo stesso denominatore. Per sommare `1/2 + 1/3`, moltiplica numeratore e denominatore di `1/2` per 3, e quelli di `1/3` per 2: ora sono entrambe in sesti.",
      ],
    },
    "multiply-fractions": {
      name: "Moltiplicare frazioni",
      how: "Tocca il · tra le frazioni, oppure trascina una frazione sull'altra: si moltiplicano i numeratori tra loro e i denominatori tra loro.",
      text: ["Moltiplicare è più semplice: si moltiplicano i numeratori e si moltiplicano i denominatori. La metà di un terzo è `(1·1)/(2·3) = 1/6`."],
    },
    "divide-by-fraction": {
      name: "Dividere per una frazione",
      how: "Trascina in su il denominatore della frazione più in basso, fino al numeratore principale: lo moltiplica. Poi tocca il · e la linea di frazione per fare il calcolo.",
      text: [
        "Quello che fa un numero dipende da quante linee di frazione ha sopra. In `4/(3/5)` il 5 sta sotto due linee: diviso una divisione, moltiplica. Quindi può salire al numeratore senza cambiare nulla: `(4·5)/3`.",
        "Ecco perché dividere per una frazione vuol dire moltiplicare per la sua reciproca, cioè la frazione capovolta: `4/(3/5) = 4·5/3`.",
      ],
    },
    "split-fraction": {
      name: "Spezzare una frazione",
      how: "Tira fuori un termine dal numeratore. Si porta dietro una copia del denominatore.",
      text: ["Una somma al numeratore si può spezzare in una frazione per ogni termine, tutte con lo stesso denominatore: `(x + 5)/6 = x/6 + 5/6`."],
    },
    "times-one": {
      name: "Per 1",
      how: "Tieni premuto l'1, poi trascinalo su ciò che moltiplica.",
      text: ["Moltiplicare per 1 non cambia niente: `1·x` è semplicemente `x`. È così semplice che d'ora in poi succede da solo."],
    },
    substitute: {
      name: "Sostituire",
      how: "Trascina la `y` di `y = …` sulla `y` dell'altra equazione: al suo posto arriva ciò a cui `y` è uguale. Poi ricava x, e sostituiscilo nella prima equazione per trovare y.",
      text: [
        "`y = 2x` e `x + y = 9` sono due equazioni con le stesse x e y, vere tutte e due contemporaneamente. Un'equazione in due incognite ha infinite soluzioni; due equazioni insieme di solito ne hanno una sola.",
        "`y = 2x` dice che y e 2x sono uguali, quindi nell'altra equazione y si può sostituire con 2x. Resta un'equazione in una sola lettera, che sai già risolvere.",
        "Se in nessuna equazione c'è una lettera già isolata, prima isolane una: in `x − y = 1`, porta il −y dall'altra parte e ottieni `x = 1 + y`.",
      ],
    },
    "evaluate-root": {
      name: "Calcolare una radice",
      how: "Tocca la radice per calcolarla.",
      text: ["`√9` è il numero positivo che, moltiplicato per se stesso, dà 9: cioè 3, perché `3·3 = 9` (anche −3 lo dà, ma √ indica quello positivo). Allo stesso modo `∛8 = 2`, perché `2·2·2 = 8`."],
    },
    "split-square": {
      name: "Scomporre sotto radice",
      how: "Tocca il numero sotto la radice: si separa un quadrato (un cubo, sotto una radice cubica). Poi portalo fuori dalla radice e tocca la sua radice per calcolarla.",
      text: ["Una radice che non dà un numero intero si può comunque semplificare. Scomponi il numero sotto radice in modo da separare un quadrato: `√12 = √(4·3)`."],
    },
    "join-powers": {
      name: "Unire le radici",
      how: "Trascina una radice sull'altra. Finiscono sotto un'unica radice.",
      text: [
        "Il quadrato di `√2·√3` è `2·3`, quindi `√2·√3` è il numero positivo il cui quadrato è 6: `√(2·3) = √6`. Due radici con lo stesso indice si uniscono sotto un'unica radice.",
        "Lo stesso vale per qualsiasi esponente in comune: `x³y³` è xxx·yyy, cioè xy·xy·xy, quindi `(xy)³`.",
      ],
    },
    "pull-out-of-power": {
      name: "Spezzare una radice",
      how: "Porta il numero fuori dalla radice: avrà una radice tutta sua. Poi tocca quella radice per calcolarla.",
      text: ["La radice di un prodotto è il prodotto delle radici: `√(4x) = √4·√x = 2√x`."],
    },
    "root-notation": {
      name: "Una radice come potenza",
      how: "Tocca la radice per scriverla come potenza: √ è una potenza con esponente ½, ∛ con esponente ⅓.",
      text: ["Ogni radice è una potenza: `√x = x^(1/2)`, `∛x = x^(1/3)`, e la radice n-esima di x è `x^(1/n)`. Quindi tutte le proprietà delle potenze valgono anche per le radici: `√x·√x = x^(1/2 + 1/2) = x`."],
    },
    "root-of-power": {
      name: "Radice di una potenza",
      how: "Tocca la radice per scriverla come potenza. Poi trascina l'esponente esterno su quello interno e calcola il prodotto.",
      text: ["Una radice è una potenza, quindi la radice di una potenza è una potenza di potenza: `∛(x⁶) = (x⁶)^(1/3) = x^(6·1/3) = x²`. Gli esponenti si moltiplicano, come hai visto nel capitolo Potenze."],
    },
    "fraction-power": {
      name: "Radici e potenze insieme",
      how: "Trascina la radice sulla potenza: gli esponenti si sommano. Poi scrivi il numero intero come frazione con denominatore 2: trascina il denominatore di ½ sul numero, e tocca il · per fare il calcolo. Poi somma le frazioni, e tocca il + al numeratore.",
      text: ["`√x` è `x^(1/2)`, quindi `√x·x² = x^(1/2 + 2) = x^(5/2)`. Un esponente frazionario funziona come tutti gli altri: per moltiplicare potenze con la stessa base, si sommano gli esponenti."],
    },
    "root-across": {
      name: "L'esponente della radice oltre l'=",
      how: "Tocca la radice per scriverla come potenza (con esponente ½, oppure ⅓ o ¼), poi trascina l'esponente dall'altra parte dell'=: nell'altro membro diventa un quadrato (o un cubo, o una quarta potenza). Poi tocca l'esponente per calcolarla.",
      text: ["Per risolvere `√x = 3`, eleva al quadrato entrambi i membri. Scritta come potenza, `x^(1/2) = 3`, il ½ passa dall'altra parte e diventa un quadrato: `x = 3²`."],
    },
    "exp-of-log": {
      name: "La potenza annulla il logaritmo",
      how: "Trascina la base sul logaritmo che ha all'esponente. Si annullano a vicenda.",
      text: ["`e` è un numero speciale, circa 2,718. `ln(x)` è l'esponente da dare a e per ottenere x, quindi ln ed e^ si annullano a vicenda: `e^(ln x) = x`. I logaritmi in altre basi funzionano allo stesso modo: `2^(log₂ x) = x`."],
    },
    "evaluate-log": {
      name: "Logaritmi da sapere",
      how: "Tocca il logaritmo per calcolarlo: `ln(e) = 1`, e il logaritmo di 1 è 0.",
      text: ["`ln(e) = 1`, perché `e¹ = e`. E il logaritmo di 1 è 0, perché `e⁰ = 1`."],
    },
    "power-of-base": {
      name: "Come potenza della base",
      how: "Tocca il numero dentro il logaritmo per scriverlo come potenza di 2. Poi trascina l'esponente fuori, davanti al logaritmo, e tocca il logaritmo.",
      text: ["Per calcolare `log₂(8)`, scrivi 8 come potenza di 2: `8 = 2³`, quindi `log₂(8) = 3`."],
    },
    "log-of-product": {
      name: "Spezzare un logaritmo",
      how: "Porta il numero fuori dal logaritmo. Avrà un logaritmo tutto suo.",
      text: ["Nel prodotto di potenze gli esponenti si sommano. Quindi il logaritmo di un prodotto è la somma dei logaritmi: `ln(2x) = ln(2) + ln(x)`."],
    },
    "log-of-root": {
      name: "Logaritmo di una radice",
      how: "Tocca la radice per scriverla come potenza. Poi trascina l'esponente fuori, davanti al logaritmo.",
      text: ["Una radice è una potenza, `√x = x^(1/2)`, quindi il suo esponente esce dal logaritmo come qualsiasi altro: `ln(√x) = ½ln(x)`."],
    },
    "log-of-power": {
      name: "Esponente fuori dal logaritmo",
      how: "Trascina l'esponente fuori, davanti al logaritmo.",
      text: ["`x³` è `x·x·x`, quindi `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
    },
    "power-into-log": {
      name: "Numero dentro il logaritmo",
      how: "Trascina il numero davanti sul logaritmo. Diventa un esponente al suo interno.",
      text: ["Al contrario: `3ln(x)` è `ln(x³)`."],
    },
    "combine-logs": {
      name: "Unire i logaritmi",
      how: "Trascina un logaritmo sull'altro, oppure tocca il + (o il −) tra i due. Sommando i logaritmi si moltiplica all'interno, sottraendoli si divide.",
      text: ["Vale anche al contrario: `ln(a) + ln(b) = ln(ab)`, e `ln(a) − ln(b) = ln(a/b)`."],
    },
    "move-exponent-term": {
      name: "Da un esponente all'altro",
      how: "Entrambi i membri sono potenze con la stessa base. Trascina un termine di un esponente nell'altro: cambia segno.",
      text: [
        "Quando entrambi i membri sono potenze con la stessa base, i loro esponenti sono uguali, quindi si comportano come i due membri di un'equazione.",
        "`2^(x − 3) = 2^4` diventa `2^x = 2^(4 + 3)`: entrambi i membri sono stati moltiplicati per `2^3`.",
      ],
    },
    "exp-across": {
      name: "Base dall'altra parte dell'=",
      how: "Trascina la base dall'altra parte dell'=. Nell'altro membro diventa un logaritmo.",
      text: ["Per tirare fuori x da un esponente, si applica il logaritmo a entrambi i membri. Da `e^x = 5`, la e passa dall'altra parte e diventa ln: `x = ln(5)`."],
    },
    "log-across": {
      name: "Logaritmo dall'altra parte dell'=",
      how: "Trascina il logaritmo dall'altra parte dell'=. Nell'altro membro diventa una potenza. Se è la potenza di un numero, tocca l'esponente per calcolarla.",
      text: ["Un logaritmo si annulla con una potenza. Da `ln(x) = 2`, il ln passa dall'altra parte e diventa e: `x = e²`."],
    },
    "bracket-times-bracket": {
      name: "Parentesi per parentesi",
      how: "Trascina una parentesi sull'altra: moltiplica entrambi i termini al suo interno. Poi sviluppa allo stesso modo ogni nuovo termine: tieni premuto uno dei suoi fattori e lascialo sull'altro (con un tocco rapido prendi tutto il termine). Infine tieni premuta una delle x di `x·x`, lasciala sull'altra e somma i termini simili.",
      text: [
        "In `(x + 1)(x + 2)`, la prima parentesi è un unico fattore: moltiplica tutta la seconda, sia la x sia il 2. Poi si sviluppa ogni `(x + 1)`, una alla volta.",
        "Due termini per due termini danno quattro termini. Poi si sommano i termini simili: `(x + 1)(x + 2) = x² + 3x + 2`.",
      ],
    },
    "bracket-out": {
      name: "Raccogliere una parentesi",
      how: "Entrambi i termini hanno la stessa parentesi. Tienila premuta in uno dei due termini, poi trascinala fuori, davanti a tutto, oltre l'estremità sinistra.",
      text: ["Anche un'intera parentesi può essere un fattore comune. In `x(x + 2) + 3(x + 2)` entrambi i termini hanno `(x + 2)`, quindi si raccoglie davanti come qualsiasi altro fattore: `(x + 2)(x + 3)`."],
    },
    "ineq-move-factor": {
      name: "Dividere entrambi i membri",
      how: "Trascina il numero davanti alla lettera dall'altra parte del simbolo. Divide l'altro membro, e il verso resta lo stesso. Poi tocca la linea di frazione.",
      text: ["Anche se moltiplichi o dividi entrambi i membri per un numero positivo, il verso resta lo stesso: da `2x < 8`, `x < 8/2`."],
    },
    rationalise: {
      name: "Razionalizzare il denominatore",
      how: "Trascina in su la radice del denominatore, sul numeratore: numeratore e denominatore vengono moltiplicati entrambi per lei. Poi tocca il · al denominatore.",
      text: ["Se moltiplichi numeratore e denominatore per lo stesso numero, la frazione non cambia. Scegli la radice che è già al denominatore: `√3·√3 = 3`, quindi `1/√3 = √3/(√3·√3) = √3/3`. Ora sotto la linea di frazione non c'è più nessuna radice."],
    },
    "zero-product": {
      name: "Legge di annullamento del prodotto",
      how: "Trascina in giù una parentesi, fuori dal prodotto: l'equazione si spezza in due, o è 0 quella parentesi o è 0 l'altra. Poi risolvile una alla volta.",
      text: [
        "Un prodotto è 0 solo quando uno dei suoi fattori è 0: `3·0 = 0`, ma `3·2` no. Quindi `(x − 2)(x + 3) = 0` vuol dire `x − 2 = 0` oppure `x + 3 = 0`: due soluzioni.",
        "Per questo non si dividono mai entrambi i membri per qualcosa che potrebbe valere 0: qui si perderebbe una soluzione.",
      ],
    },
    "plus-minus": {
      name: "Le due radici di un quadrato",
      how: "Trascina il 2 dall'altra parte dell'=. Un quadrato ha due radici: l'equazione si spezza in due, una con il + e una con il −.",
      text: ["`3² = 9`, ma anche `(−3)² = 9`. Quindi `x² = 9` vuol dire `x = 3` oppure `x = −3`. Se ti dimentichi il meno, perdi una soluzione."],
    },
    "take-out-then-split": {
      name: "Raccogliere la lettera, poi separare",
      how: "Tieni premuta la lettera in un termine e trascinala fuori, davanti a tutto, oltre l'estremità sinistra (oppure tocca il segno tra i termini). Poi trascina la lettera in giù, fuori dal prodotto, e risolvi quello che resta.",
      text: ["Se manca il termine noto, ogni termine ha una x: raccoglila, `x² − 3x = x(x − 3)`. Ora è un prodotto uguale a 0, quindi `x = 0` oppure `x − 3 = 0`."],
    },
    "split-middle": {
      name: "Scomporre, poi separare",
      how: "Tocca il termine centrale: si spezza in due. Raccogli un fattore da ciascuna coppia, poi la parentesi che hanno in comune. Infine trascina in giù una parentesi, fuori dal prodotto.",
      text: ["`x² + x − 6` è il prodotto di due parentesi: `(x + 3)(x − 2)`. I due numeri hanno prodotto `−6` e somma `1`, il coefficiente della x. Quando hai un prodotto uguale a 0, ogni parentesi ti dà una soluzione."],
    },
    "fraction-zero": {
      name: "Una frazione uguale a 0",
      how: "Trascina il denominatore della frazione oltre l'= (afferralo dal segno +). Moltiplica l'altro membro: tocca lo 0 per fare il calcolo, perché 0 per qualsiasi numero fa 0. Poi porta il numero dall'altra parte.",
      text: ["Una frazione vale 0 solo quando il suo numeratore è 0. Il denominatore non può mai essere 0, e lo dice la condizione scritta dopo l'equazione: `x ≠ −2` garantisce che `x + 2` non sia 0.", "Quindi il denominatore può passare dall'altra parte e moltiplicare l'altro membro: `(x − 3)/(x + 2) = 0` diventa `x − 3 = 0·(x + 2)`, cioè `x − 3 = 0`. Se una soluzione non rispetta la condizione, va scartata."],
    },
    "square-both-sides": {
      name: "Elevare al quadrato entrambi i membri",
      how: "Tocca la radice per scriverla come potenza con esponente ½, poi trascina l'esponente ½ dall'altra parte dell'=: l'altro membro viene elevato al quadrato. Poi svolgi i calcoli e risolvi. Sotto ci sono le condizioni: una soluzione che non le rispetta viene scartata.",
      text: ["Una radice non è mai negativa, quindi `√(x² + 5) = x + 1` vale solo dove `x + 1 ≥ 0`. Elevando al quadrato questa informazione si perde: `x² + 5 = (x + 1)²` varrebbe anche se `x + 1` fosse negativo. Per questo le condizioni si scrivono all'inizio, e restano valide fino alla fine."],
    },
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
  predictPrompt: "Prima prevedilo a mente: che cosa diventa?",
  reveal: "Mostra la risposta",
  predictedBeforeRight: "Qui l'avevi previsto giusto al primo colpo.",
  predictedBeforeWrong: (picked: boolean) =>
    `${picked ? "La prima volta avevi scelto quella rossa" : "La prima volta la risposta era sbagliata"}. Quella giusta è la verde.`,
  rightFirstTime: "Giusto al primo colpo! Ora risolvilo.",
  revealedNote: "Quella giusta è la verde. Ora risolvilo.",
  notQuite: "Non proprio. Quella giusta è la verde. Risolvilo per capire dove hai sbagliato.",
  solvedBefore: "✓ Questo l'hai già risolto. Puoi risolverlo di nuovo.",
  makeItLookLike: "Trasformalo in",
  solveFor: (letters: string[]) => `Ricava ${letters.map((l) => `\`${l}\``).join(" e ")}.`,
  pickFirst: "Scegli una risposta qui sopra, poi risolvilo qui.",
  hint: "Suggerimento",
  nextStep: "Prossimo passo",
  noNextStep: "Da qui non trovo nessun passo: prova Annulla, oppure Ricomincia.",
  undo: "Annulla",
  solvedBang: "Risolto!",
  where: "con",
  moveCrashed: "Qualcosa è andato storto con questa mossa.",
  moveCrashedDetails: "Riprova, oppure ricomincia questo esercizio da capo.",
  pageCrashed: "Qualcosa è andato storto in questa pagina.",
  pageCrashedDetails: "Riprova, oppure torna al percorso. I tuoi progressi sono al sicuro.",
  tryAgain: "Riprova",

  // Making a set
  ownTitle: "I tuoi esercizi",
  ownIntro:
    "Scrivi una serie di esercizi, per esempio per i tuoi studenti, e condividila con un link. In ogni esercizio gli studenti prima prevedono il risultato a mente, poi lo risolvono a mano. Non viene salvato niente online: tutta la serie è contenuta nel link.",
  upload: "Carica un file .yaml",
  startFromExample: "Parti dall'esempio",
  yamlLabel: "La serie di esercizi, in YAML",
  form: {
    asForm: "Modulo",
    asYaml: "YAML",
    viewLabel: "Scrivi la serie come",
    title: "Titolo",
    moves: "Mosse consentite",
    allMoves: "Tutte le mosse",
    upTo: (n: number, title: string) => `Fino a ${n}. ${title}`,
    start: (n: number) => `Esercizio ${n}: partenza`,
    goal: (n: number) => `Esercizio ${n}: obiettivo`,
    remove: (n: number) => `Rimuovi l'esercizio ${n}`,
    addOne: "Aggiungi un esercizio",
    fromChapter: "Aggiungi esercizi presi da un capitolo",
    chapter: "Capitolo",
    level: "Livello",
    howMany: "Quanti",
    addMade: (n: number) => `Aggiungine ${n}`,
    making: "Li sto preparando…",
    cantRead: "Lo YAML di questa serie contiene un errore, quindi il modulo non può mostrarla. Correggilo nella vista YAML, oppure parti dall'esempio.",
  },
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
  or: "oppure",
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
    ` ${stars} previsti giusti al primo colpo. In ogni esercizio, prima prevedi il risultato a mente, poi risolvilo a mano.`,
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
    noValue: "Il punto di partenza non ha un valore per nessun numero (c'è una divisione per 0?).",
    twoWrong: "`wrong:` deve contenere due risposte sbagliate.",
    cantReadWrong: (w: string, err: string) => `Non riesco a leggere la risposta sbagliata "${w}": ${err}`,
    wrongShape: (w: string, why: string) => `La risposta sbagliata "${w}" non ha la stessa forma dell'obiettivo: ${why}.`,
    wrongIsRight: (w: string) => `La risposta sbagliata "${w}" in realtà è giusta.`,
    noDecoys:
      "Non è stato possibile creare risposte sbagliate credibili: aggiungi `wrong:`, altrimenti l'esercizio si risolve senza prima prevedere il risultato.",
    decoysMade: (list: string) => `Risposte sbagliate create tra cui scegliere: ${list}.`,
    shapeCount: "ha un numero diverso di equazioni",
    shapeRelation: "è un'espressione dove ci si aspetta un'equazione, o viceversa",
    shapeIsolated: (letter: string) => `non dice quanto vale ${letter}`,
  },
};
