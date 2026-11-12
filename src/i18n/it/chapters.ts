import type { ChapterTexts } from "..";

export const itChapters: ChapterTexts = {
  shuffle: {
    title: "Riordinare i termini",
    blurb: "I termini di una somma si possono scrivere in qualsiasi ordine, e i numeri si possono sommare o moltiplicare tra loro.",
    lesson: [
      {
        title: "L'ordine non conta",
        text: [
          "Se cambi l'ordine degli addendi, la somma non cambia. `2 + x` e `x + 2` sono la stessa cosa.",
          "Ogni parte di una somma si chiama termine. Puoi trascinare i termini nell'ordine che vuoi.",
        ],
        steps: ["Trascina il 2 oltre la x."],
      },
      {
        title: "Ogni termine porta con sé il suo segno",
        text: [
          "In `5 − 3 + x` i termini sono `5`, `−3` e `x`. Il meno appartiene al 3: quando il 3 si sposta, il meno va con lui.",
        ],
        steps: ["Trascina la x all'inizio. Il 3 si porta dietro il suo meno."],
        watch: "`5 − 3` e `3 − 5` non sono la stessa cosa. Quando sposti il 3, il suo meno deve seguirlo.",
      },
      {
        title: "Sommare i numeri",
        text: [
          "Due numeri nella stessa somma si possono sommare tra loro: trascina uno sull'altro. La x è un numero che ancora non conosciamo, quindi resta com'è.",
        ],
        steps: ["Trascina il 4 sul 3."],
        after: "3 + 4 = 7. La x resta com'è.",
      },
      {
        title: "Moltiplicare in qualsiasi ordine",
        text: [
          "Anche nella moltiplicazione l'ordine non conta: `2·x·5` è uguale a `2·5·x`. Quindi puoi moltiplicare il 2 per il 5 e ottenere 10.",
          "Di solito si scrive prima il numero e si toglie il puntino: `10·x` si scrive `10x`.",
        ],
        steps: ["Trascina il 5 sul 2."],
      },
    ],
    hints: {
      s1: "Trascina il 2 oltre la x.",
      s2: "Trascina il 4 sul 3.",
      s3: "Trascina un numero sull'altro.",
      s8: "Il 4 si porta dietro il suo meno.",
      s17: "2 − 7 è minore di zero.",
      s24: "Metti per primo il termine con la a e per ultimo il numero.",
    },
  },

  collect: {
    title: "Termini simili",
    blurb: "I termini con le stesse lettere si possono sommare: 3x + 2x = 5x. Un termine meno se stesso fa 0.",
    lesson: [
      {
        title: "Che cosa vuol dire 3x",
        text: ["`3x` vuol dire `x + x + x`. Quindi `3x + 2x` sono tre x più due x, cioè `5x`."],
        steps: ["Trascina il 2x sul 3x."],
      },
      {
        title: "Si sommano solo i termini simili",
        text: [
          "I termini simili hanno esattamente le stesse lettere, e solo loro si possono sommare. `3x + 2` non può diventare `5x`, perché il `2` non ha la x. I numeri si sommano solo con altri numeri.",
        ],
        steps: ["Le due x sono termini simili. Trascina la seconda x sulla prima."],
        after: "Il 4 non ha la x, quindi resta com'è.",
      },
      {
        title: "Lettere diverse non si sommano",
        text: [
          "`x` e `y` possono indicare numeri diversi, quindi `2x + 3y` non si può ridurre. Però in `2x + 3y + x` i due termini con la x si possono sommare.",
        ],
        steps: ["Trascina la x sul 2x. Il 3y resta com'è."],
        after: "I termini con la x e quelli con la y restano separati.",
      },
      {
        title: "Sottrarre",
        text: [
          "La sottrazione funziona allo stesso modo: `5y − 2y` fa `3y`. Qualsiasi cosa meno se stessa fa 0, quindi `a + b − a` è semplicemente `b`.",
        ],
        steps: ["Trascina il −a sulla a. Si annullano."],
        watch: "`x + x` fa `2x`, non `x²`. `x²` vuol dire `x·x`: lo vedremo più avanti.",
      },
    ],
    hints: {
      c4: "Qualsiasi cosa meno se stessa fa 0.",
      c17: "Tratta ab come se fosse una lettera sola: 3ab + 2ab funziona come 3x + 2x.",
      c9: "Prima calcola 2·3. Poi somma i termini con la x.",
      c6: "Somma i termini con la x, poi quelli con la y.",
      c27: "Riduci i termini con la b, poi metti le lettere in ordine, con il numero per ultimo.",
    },
  },

  distribute: {
    title: "Proprietà distributiva",
    blurb:
      "Un numero davanti a una parentesi moltiplica ogni termine al suo interno. Un fattore comune a tutti i termini si può raccogliere fuori.",
    lesson: [
      {
        title: "Moltiplica ogni termine nella parentesi",
        text: [
          "`2(x + 3)` vuol dire 2 volte `(x + 3)`, cioè 2 volte x più 2 volte 3: `2x + 2·3`. Il numero fuori moltiplica ogni termine dentro.",
          "Pensa a un rettangolo alto 2 e largo `x + 3`. Dividilo in due parti: una ha area `2·x`, l'altra `2·3`. Insieme formano tutto il rettangolo.",
        ],
        steps: ["Trascina il 2 sulla parentesi. Moltiplica entrambi i termini.", "Ora trascina il 2 di 2·3 sul 3."],
      },
      {
        title: "Un meno davanti",
        text: ["`−(x − 4)` vuol dire `−1` per la parentesi. Il −1 moltiplica ogni termine, quindi tutti i segni dentro cambiano."],
        steps: ["Trascina il meno sulla parentesi."],
        watch: "Un errore comune è scrivere `−(x − 4)` come `−x − 4`. Il meno moltiplica anche il 4.",
      },
      {
        title: "Raccogliere un fattore comune",
        text: [
          "Il procedimento inverso si chiama raccoglimento a fattor comune. Se tutti i termini hanno il fattore 3, puoi portare il 3 fuori, davanti a una parentesi: `3x + 3y = 3(x + y)`.",
        ],
        steps: ["Entrambi i termini hanno un 3. Trascina un 3 fuori, tutto a sinistra."],
        after: "Se sviluppi di nuovo, ritrovi 3x + 3y.",
      },
      {
        title: "x per x",
        text: [
          "A volte una lettera viene moltiplicata per se stessa: `x(x + 2)` dà `x·x`. Si scrive `x²` (x al quadrato). Un quadrato di lato x ha area `x·x`.",
        ],
        steps: ["Trascina la x sulla parentesi.", "Trascina una x sull'altra."],
      },
    ],
    hints: {
      d1: "Trascina la a sulla parentesi.",
      d3: "Porta fuori una a da uno dei due termini.",
      d19: "Trascina il meno sulla parentesi.",
      d6: "Trascina il meno sulla parentesi.",
      d14: "Il meno moltiplica ogni termine nella parentesi.",
      d18: "Il −2 moltiplica entrambi i termini della sua parentesi.",
      d27: "Ogni fattore davanti moltiplica entrambi i termini della sua parentesi. Poi somma i termini in y² e quelli in y.",
    },
  },

  brackets: {
    title: "Prodotto di polinomi",
    blurb: "Per moltiplicare due parentesi, moltiplica ogni termine della prima per ogni termine della seconda.",
    lesson: [
      {
        title: "Una parentesi è un unico fattore",
        text: [
          "In `(x + 1)(x + 2)` la prima parentesi moltiplica tutta la seconda. Considera `(x + 1)` come un unico fattore e applica la proprietà distributiva: moltiplica sia la `x` sia il `2`.",
        ],
        steps: [
          "Trascina tutta la (x + 1) sulla (x + 2). Moltiplica entrambi i termini.",
          "Ora trascina la x sulla (x + 1) che ha accanto.",
          "Poi trascina il 2 sulla sua (x + 1).",
        ],
        after: "Vengono quattro termini: x·x, 1·x, 2·x e 2·1. Riduci i termini simili e ottieni x² + 3x + 2.",
      },
      {
        title: "Moltiplicare due parentesi",
        text: [
          "Moltiplica ogni termine della prima parentesi per ogni termine della seconda. Due termini per due termini danno quattro termini. Poi riduci i termini simili.",
          "In `(x + 3)(x − 3)` i due termini centrali sono `+3x` e `−3x`. Si annullano, e resta `x² − 9`.",
        ],
      },
      {
        title: "Il quadrato di una parentesi",
        text: ["`(x + 1)²` è `(x + 1)(x + 1)`, quindi funziona allo stesso modo. Tocca il ² per scriverlo per esteso."],
        steps: ["Tocca il ² per scriverlo come prodotto."],
        watch:
          "`(x + 1)²` non è `x² + 1`. Prova con x = 2: `(2 + 1)² = 9`, ma `2² + 1 = 5`. La differenza sono i due termini centrali, `x + x = 2x`.",
      },
    ],
    hints: {
      m1: "Trascina la x sulla parentesi. Come si scrive x·x?",
      m2: "Trascina una parentesi intera sull'altra. Poi sviluppa ogni parte.",
      m18: "x·x² sono tre x moltiplicate tra loro: x³.",
      m5: "Guarda i due termini centrali.",
      m25: "Ci sono tre fattori. Moltiplicane prima due, poi moltiplica il risultato per il terzo.",
      m7: "Tocca il ² per scriverlo come (x + 2)(x + 2).",
      m9: "Non è semplicemente a² + b². Moltiplica ogni termine per ogni termine.",
    },
  },

  balance: {
    title: "Equazioni",
    blurb:
      "Se fai la stessa cosa a entrambi i membri, l'equazione resta vera. Un termine che passa dall'altra parte dell'= fa l'operazione opposta.",
    lesson: [
      {
        title: "La stessa cosa a entrambi i membri",
        text: [
          "Un'equazione dice che due cose sono uguali. Se fai la stessa cosa a entrambi i membri, restano uguali.",
          "Portare un termine dall'altra parte dell'`=` vuol dire proprio questo. Da `x + 3 = 10`, togli 3 a entrambi i membri: `x = 10 − 3`. Ecco perché `+3` diventa `−3` nell'altro membro.",
        ],
        steps: ["Trascina il 3 dall'altra parte dell'=. Cambia segno.", "Trascina il −3 sul 10."],
      },
      {
        title: "Dividere entrambi i membri",
        text: [
          "Se un numero moltiplica tutto un membro, quando passa dall'altra parte divide l'altro membro. Da `2x = 8`, dividi entrambi i membri per 2: `x = 8/2`.",
        ],
        steps: ["Trascina il 2 dall'altra parte dell'=. Divide l'altro membro.", "Trascina il 2 sull'8."],
      },
      {
        title: "Frazioni e segni meno",
        text: [
          "Lo stesso vale per la divisione. Da `x/3 = 4`, moltiplica entrambi i membri per 3: il 3 al denominatore passa dall'altra parte e moltiplica l'altro membro.",
          "Anche un meno davanti a tutto un membro può passare dall'altra parte: `−x = 6` diventa `x = −6`.",
        ],
        steps: ["Trascina il 3 dall'altra parte dell'=."],
      },
      {
        title: "A ritroso",
        text: [
          "In `3x + 1`, la x viene prima moltiplicata per 3, poi si aggiunge 1. Per isolare la x, disfa queste operazioni in ordine inverso: prima sposta l'1, poi il 3.",
        ],
        steps: ["Porta l'1 dall'altra parte.", "Calcola.", "Porta il 3 dall'altra parte.", "Calcola."],
        watch: "Fai la verifica: sostituisci la soluzione nell'equazione. 3·4 + 1 = 13. ✓",
      },
    ],
    hints: {
      b1: "Trascina il 3 dall'altra parte del segno =.",
      b10: "Trascina tutto il secondo membro dall'altra parte per scambiare i membri, oppure risolvila così com'è.",
      b21: "La soluzione può essere una frazione.",
      b22: "Tutto il numeratore è diviso per 2. Prima porta il 2 dall'altra parte.",
      b7: "Più veloce: porta il 2 dall'altra parte prima di sviluppare.",
      b12: "Prima sposta il + 1.",
      b23: "Un meno davanti a una parentesi cambia tutti i segni al suo interno.",
    },
  },

  powers: {
    title: "Potenze",
    blurb: "x³ vuol dire x·x·x. Conta le x e scoprirai da solo le proprietà delle potenze.",
    lesson: [
      {
        title: "Prodotto di potenze",
        text: [
          "`x³` vuol dire `x·x·x`. Il numero piccolo è l'esponente: dice quante x vengono moltiplicate.",
          "Quindi `x²·x³` sono due x per tre x: cinque x in tutto. Quando moltiplichi potenze con la stessa base, sommi gli esponenti.",
        ],
        steps: ["Stessa base: trascina una potenza sull'altra.", "Calcola."],
      },
      {
        title: "Potenza di potenza",
        text: ["`(x²)³` è `x²·x²·x²`. Sono 2 + 2 + 2 = 6 x, quindi gli esponenti si moltiplicano."],
        steps: ["Trascina il 3 esterno sul 2 interno.", "Calcola."],
      },
      {
        title: "Quoziente di potenze",
        text: [
          "`x⁵/x²` ha cinque x al numeratore e due al denominatore. Semplificandone due sopra e sotto, restano tre x al numeratore. Quando dividi, sottrai gli esponenti.",
        ],
        steps: ["Trascina x² su x⁵.", "Calcola."],
      },
      {
        title: "Esponente zero ed esponenti negativi",
        text: [
          "`x³/x³` fa 1, ma è anche `x^(3 − 3) = x⁰`. Quindi qualsiasi numero elevato a 0 fa 1.",
          "Se ci sono più x al denominatore che al numeratore, l'esponente diventa negativo: `x⁻²` vuol dire `1/x²`. Quando una potenza attraversa la linea di frazione, il suo esponente cambia segno.",
        ],
        steps: ["Trascina x³ in su, oltre la linea di frazione."],
        watch: "`2x³` è `2·x·x·x`: l'esponente riguarda solo la x. `(2x)³` è diverso: fa `8x³`.",
      },
    ],
    hints: {
      w1: "Stessa base: trascina una potenza sull'altra, poi somma gli esponenti.",
      w2: "Trascina il 3 esterno sul 2 interno, poi moltiplica.",
      w3: "Porta il 2 fuori dalla parentesi. Va elevato al cubo anche lui.",
      w6: "Trascina x³ in su, oltre la linea di frazione.",
      w11: "Una x da sola è x¹.",
      w5: "Il risultato ha un esponente negativo.",
      w21: "Prima sviluppa il prodotto: x per x² fa x³.",
      w25: "Moltiplica ogni termine per x⁻¹. x⁻¹ per x fa x⁰.",
      w30: "Scrivilo come (x² + 3)(x² + 3), poi moltiplica ogni termine per ogni termine.",
    },
  },

  factor: {
    title: "Scomposizione in fattori",
    blurb: "Scomporre è il contrario di sviluppare. Trova un fattore comune a tutti i termini e raccoglilo davanti a una parentesi.",
    lesson: [
      {
        title: "Lo sviluppo al contrario",
        text: [
          "Scomporre disfa lo sviluppo. `x² + 3x` è `x·x + 3·x`. Entrambi i termini hanno una `x`, quindi puoi raccoglierla: `x(x + 3)`.",
        ],
        steps: [
          "Tocca il ² per scrivere x² per esteso.",
          "Ora entrambi i termini hanno una x. Trascina una x fuori, tutto a sinistra.",
        ],
        after: "Per verificare, sviluppa x(x + 3): ritrovi x² + 3x.",
      },
      {
        title: "Scomporre i numeri",
        text: [
          "Per trovare un fattore comune, scomponi i numeri in fattori. In `2x + 6`, tocca il 6 per ottenere `2·3`. Ora entrambi i termini hanno un 2.",
        ],
        steps: ["Tocca il 6 per scomporlo.", "Trascina un 2 fuori, davanti."],
      },
      {
        title: "Raccogliere una parentesi",
        text: [
          "In `x(x + 2) + 3(x + 2)` entrambi i termini contengono la stessa parentesi `(x + 2)`. È un fattore comune, quindi puoi raccoglierla come qualsiasi altro fattore.",
        ],
        steps: ["Trascina la (x + 2) fuori, davanti."],
      },
      {
        title: "Quattro termini: raccoglimento parziale",
        text: [
          "Con quattro termini, raccogli un fattore dai primi due e poi uno dagli ultimi due. Se le due parentesi sono uguali, raccogli anche quella.",
        ],
        watch: "Verifica sempre una scomposizione rifacendo la moltiplicazione: devi ritrovare esattamente l'espressione di partenza.",
      },
    ],
    hints: {
      g5: "Entrambi i termini hanno la stessa parentesi. Raccoglila.",
      g1: "Tocca il ² per scrivere x² come x·x. Così entrambi i termini hanno una x.",
      g2: "Tocca il 6 per scomporlo in fattori.",
      g15: "Quale numero divide sia 6 sia 9?",
      g21: "Scrivi il quadrato come prodotto. Così entrambi i termini contengono (x + 1).",
      g22: "Scomponi 2x + 6. Salta fuori una (x + 3)?",
      g6: "Lavora a coppie: trascina una x da x² su 2x, poi un 3 sul 6.",
      g29: "Tutti e quattro i termini hanno il fattore 2. Raccoglilo per primo, poi scomponi il resto a coppie.",
    },
  },

  formulas: {
    title: "Formule inverse",
    blurb: "Una formula è un'equazione con più lettere. Per ricavarne una, usa le stesse mosse che usi con la x.",
    lesson: [
      {
        title: "Ricavare una lettera",
        text: [
          "`v = u + at` dà la velocità `v` a partire dalla velocità iniziale `u`, dall'accelerazione `a` e dal tempo `t`. La formula inversa dà invece il tempo: `t = (v − u)/a`.",
          "Isolare una lettera in un membro si dice ricavarla. Si fa come quando risolvi un'equazione in x: tratta le altre lettere come se fossero numeri.",
        ],
        steps: [
          "La t è moltiplicata per a. Prima porta la u dall'altra parte.",
          "Ora porta la a dall'altra parte. Divide l'altro membro.",
        ],
        after: "Leggila da destra a sinistra: t = (v − u)/a.",
      },
      {
        title: "Le lettere si spostano come i numeri",
        text: [
          "Una lettera che moltiplica tutto un membro può passare dall'altra parte dell'`=` e dividere l'altro membro, proprio come `2x = 8` diventava `x = 8/2`. (Puoi dividere solo per una lettera diversa da 0. In queste formule lo è sempre.)",
        ],
        steps: ["Porta la m dall'altra parte."],
        watch: "Può passare dall'altra parte solo un fattore di tutto il membro. In `u + at` la `a` moltiplica solo la `t`, quindi prima sposta la `u`.",
      },
      {
        title: "Lettere al denominatore",
        text: [
          "Se un membro è tutto una frazione, la lettera al denominatore può passare dall'altra parte e moltiplicare l'altro membro, proprio come `x/3 = 4` diventava `x = 4·3`.",
        ],
        steps: ["Porta la A dall'altra parte. Moltiplica l'altro membro."],
      },
      {
        title: "Quando la lettera compare due volte",
        text: [
          "In `ax + bx = c` la x compare due volte, quindi spostando un solo termine non riesci a isolarla. Prima raccogli la x. Poi la parentesi che la moltiplica può passare dall'altra parte.",
        ],
        steps: ["Entrambi i termini hanno una x. Trascina una x fuori, davanti.", "Ora porta tutta la (a + b) dall'altra parte."],
      },
    ],
    hints: {
      q6: "La A è al denominatore. Portala dall'altra parte.",
      q8: "Prima sposta la u, poi la a.",
      q16: "La x compare due volte. Prima raccoglila.",
      q17: "La P compare in entrambi i termini.",
      q22: "Porta i due termini con la x nello stesso membro, poi raccogli la x.",
    },
  },

  inequalities: {
    title: "Disequazioni",
    blurb:
      "Le disequazioni si risolvono come le equazioni, con una differenza: se moltiplichi o dividi per un numero negativo, il verso si inverte.",
    lesson: [
      {
        title: "Minore e maggiore",
        text: ["`x < 7` vuol dire che x è minore di 7. La parte aperta del simbolo è rivolta verso il numero più grande."],
        steps: ["Come in un'equazione, porta il 2 dall'altra parte.", "Calcola."],
      },
      {
        title: "Scambiare i membri",
        text: [
          "`3 > x` e `x < 3` dicono la stessa cosa: x è minore di 3. Quindi puoi scambiare i due membri, purché tu inverta anche il verso.",
        ],
        steps: ["Trascina il 3 nell'altro membro. Il verso si inverte."],
      },
      {
        title: "Le stesse mosse delle equazioni",
        text: [
          "Se aggiungi o togli la stessa quantità a entrambi i membri, il verso resta lo stesso. Vale anche se moltiplichi o dividi entrambi i membri per un numero positivo.",
        ],
        steps: ["Porta il 2 dall'altra parte. È positivo, quindi il verso resta lo stesso.", "Calcola."],
      },
      {
        title: "Un meno inverte il verso",
        text: ["Moltiplicare per −1 inverte l'ordine: `2 < 3`, ma `−2 > −3`. Quindi quando un meno passa dall'altra parte, il verso si inverte."],
        steps: ["Porta dall'altra parte solo il meno. Il < si gira."],
        after: "Verifica con un numero: x = 0 soddisfa sia −x < 4 sia x > −4.",
        watch: "Il verso si inverte solo se moltiplichi o dividi per un numero negativo. Spostare un termine dall'altra parte non lo cambia mai.",
      },
    ],
    hints: {
      i3: "Porta il meno dall'altra parte. Il verso si inverte.",
      i1: "Come in un'equazione, porta il 3 dall'altra parte.",
      i8: "Trascina tutto il primo membro dall'altra parte: 5 < x + 2 e x + 2 > 5 dicono la stessa cosa.",
      i5: "Prima sposta il meno, poi il 2.",
      i26: "Prima sviluppa la parentesi, poi porta i termini con la x nello stesso membro.",
    },
  },

  fractions: {
    title: "Frazioni",
    blurb:
      "Per sommare due frazioni, prima riducile allo stesso denominatore. Se moltiplichi numeratore e denominatore per lo stesso numero, il valore della frazione non cambia.",
    lesson: [
      {
        title: "Sommare frazioni",
        text: [
          "`3/4` vuol dire 3 quarti. Se i denominatori sono uguali, basta sommare i numeratori: 1 quinto più 2 quinti fa 3 quinti, quindi `1/5 + 2/5 = 3/5`.",
        ],
        steps: ["I denominatori sono uguali. Trascina una frazione sull'altra.", "Calcola."],
      },
      {
        title: "Frazioni equivalenti",
        text: [
          "Se dividi numeratore e denominatore per lo stesso numero, il valore non cambia: `6/8 = 3/4`.",
          "Non cambia nemmeno se li moltiplichi per lo stesso numero: `1/2 = 2/4 = 3/6`.",
        ],
        steps: ["Trascina l'8 sul 6. Si dividono entrambi per il loro fattore comune, 2."],
      },
      {
        title: "Ridurre allo stesso denominatore",
        text: [
          "Per calcolare `1/2 + 1/3`, trasforma prima entrambe le frazioni in sesti. Moltiplica numeratore e denominatore di `1/2` per 3, e quelli di `1/3` per 2. Ora i due denominatori sono 6.",
        ],
        steps: ["Trascina il 3 di ⅓ su ½: il suo numeratore e il suo denominatore vengono moltiplicati per 3."],
        watch: "`1/2 + 1/3` non fa `2/5`. I numeratori si sommano solo quando i denominatori sono già uguali.",
      },
      {
        title: "Moltiplicare frazioni",
        text: [
          "La moltiplicazione è più semplice: moltiplichi i numeratori tra loro e i denominatori tra loro. La metà di un terzo è `(1·1)/(2·3) = 1/6`.",
        ],
        steps: ["Trascina una frazione sull'altra."],
        after: "Poi semplifica i fattori comuni a numeratore e denominatore e ottieni 3/2.",
      },
    ],
    hints: {
      f1: "Trascina l'8 sul 6.",
      f2: "Stesso denominatore: trascina una frazione sull'altra.",
      f5: "Trascina il 3 sul 2.",
      f6: "Porta il 2 fuori dal numeratore.",
      f22: "Prima scomponi il numeratore. Poi numeratore e denominatore avranno un fattore comune da semplificare.",
      f8: "Trascina ¾ in su, oltre la linea di frazione.",
      f3: "Trascina il 3 su ½ e il 2 su ⅓, così i denominatori diventano uguali.",
      f4: "Tocca il 6 per scomporlo in fattori.",
      f17: "Tocca il 4 per scomporlo: 4 è 2·2.",
      f28: "Prima trasforma 1 + ½ in un'unica frazione.",
    },
  },

  simultaneous: {
    title: "Sistemi di equazioni",
    blurb:
      "Due equazioni in due incognite, vere tutte e due contemporaneamente. Ricava una lettera da un'equazione, poi sostituiscila nell'altra.",
    lesson: [
      {
        title: "Due equazioni insieme",
        text: [
          "`y = 2x` e `x + y = 9` sono due equazioni con le stesse x e y. Un'equazione in due incognite ha infinite soluzioni. Due equazioni messe a sistema di solito ne hanno una sola.",
          "Per risolvere il sistema, elimina una lettera. Resta un'equazione in una sola incognita, che sai già risolvere.",
        ],
      },
      {
        title: "Il metodo di sostituzione",
        text: [
          "`y = 2x` dice che y e 2x sono uguali. Quindi nell'altra equazione puoi mettere 2x al posto di y. Questo si chiama sostituzione.",
        ],
        steps: [
          "Trascina la y di y = 2x sulla y dell'altra equazione.",
          "Ora l'equazione contiene solo la x. Somma i termini con la x.",
        ],
        after: "Risolvila: x = 3. Poi sostituisci x = 3 in y = 2x per trovare y.",
      },
      {
        title: "Ricavare una lettera",
        text: [
          "Per sostituire ti serve un'equazione del tipo `y = …` o `x = …`. Se non ce l'hai, ricavala: in `x − y = 1`, porta il −y dall'altra parte e ottieni `x = 1 + y`.",
        ],
        steps: [
          "Nella seconda equazione, porta il −y dall'altra parte dell'=.",
          "Ora la x è isolata. Trascinala sulla x della prima equazione.",
        ],
        after: "Ora la prima equazione contiene solo la y: 2y + 1 = 7, quindi y = 3.",
        watch: "Sostituisci tutta l'espressione. Se x = 1 + y, allora 2x diventa 2(1 + y), non 2 + y.",
      },
      {
        title: "Trovare l'altra lettera",
        text: [
          "Quando conosci una lettera, per esempio `x = 3`, sostituiscila nell'altra equazione per trovare l'altra lettera. Trascina la x di `x = 3` su una x dell'altra equazione.",
        ],
      },
    ],
    hints: {
      e1: "y vale 3: trascina la y di y = 3 sulla y dell'altra equazione.",
      e4: "Trascina la y di y = 2x sulla y dell'altra equazione. Quando conosci x, sostituiscila in y = 2x.",
      e18: "Nessuna lettera è ancora isolata. Porta il −y dall'altra parte per ottenere x = 1 + y. Poi sostituisci.",
      e21: "Ricava y dalla prima equazione: y = 5 − x.",
      e27: "x = 1 + y, quindi 2x diventa 2(1 + y). Usa tutta la parentesi.",
    },
  },

  roots: {
    title: "Radicali",
    blurb: "√x è x elevato a ½, quindi le proprietà delle potenze valgono anche per le radici.",
    lesson: [
      {
        title: "Radici quadrate",
        text: ["`√9` è il numero che, moltiplicato per se stesso, dà 9. È 3, perché `3·3 = 9`."],
        steps: ["Tocca il 9 per scomporlo in fattori uguali."],
        after:
          "Poi porta un 3 fuori dalla radice. Una volta capito come funziona, puoi toccare una radice come √9 per calcolarla in un solo passaggio.",
      },
      {
        title: "Una radice è una potenza",
        text: [
          "`√x` è `x` elevato a `½`. Quindi `√x·√x = x^(1/2 + 1/2) = x`. Tutte le proprietà delle potenze valgono anche per le radici.",
        ],
        steps: ["Toccala: una potenza con esponente ½ è una radice quadrata."],
      },
      {
        title: "La radice di un prodotto",
        text: ["La radice di un prodotto è il prodotto delle radici: `√(4x) = √4·√x = 2√x`."],
        steps: ["Porta il 4 fuori dalla radice. Avrà una radice tutta sua."],
        after: "E √4 fa 2, quindi viene 2√x.",
        watch: "La radice di una somma non si spezza: `√(9 + 16)` è `√25 = 5`, non `3 + 4`.",
      },
      {
        title: "Eliminare una radice",
        text: [
          "Per risolvere `√x = 3`, eleva al quadrato entrambi i membri. Tocca la radice per scriverla come `x^(1/2)`. Poi trascina l'esponente ½ dall'altra parte dell'=: nell'altro membro diventa un quadrato.",
        ],
        steps: ["Tocca la radice per scriverla come potenza.", "Trascina l'esponente ½ dall'altra parte dell'=. Diventa un quadrato.", "Calcola."],
      },
    ],
    hints: {
      r2: "Toccala.",
      r5: "Trascina una √x sull'altra. Una radice quadrata moltiplicata per se stessa dà quello che c'è sotto.",
      r1: "Tocca la √ per calcolarla. Oppure tocca il 9 per scomporlo in 3·3, poi porta un 3 fuori dalla radice.",
      r16: "Tratta √3 come una lettera: 2√3 + √3 funziona come 2x + x.",
      r8: "Tocca la radice per scriverla come potenza, poi trascina l'esponente ½ dall'altra parte del segno =.",
      r6: "Tocca la radice per scriverla come potenza con esponente ½, poi trascina il ½ sul 2.",
      r3: "Porta il 4 fuori dalla radice. Avrà una radice tutta sua.",
      r20: "x³ è x²·x, e x² esce dalla radice come x.",
      r11: "Prima isola la √x.",
      r22: "Prima porta fuori il 4: così le √x diventano termini simili.",
      r4: "Tocca il 12 per separare un quadrato perfetto.",
      r29: "Scomponi l'8 per trovare un quadrato perfetto sotto radice.",
    },
  },

  explog: {
    title: "Esponenziali e logaritmi",
    blurb:
      "ln(x) è l'esponente da dare a e per ottenere x. Quindi ln ed e^ si annullano a vicenda, e il logaritmo di un prodotto è la somma dei logaritmi.",
    lesson: [
      {
        title: "Che cosa vuol dire ln",
        text: [
          "`e` è un numero speciale, che vale circa 2,718. `ln(x)` è l'esponente da dare a e per ottenere x. Quindi `ln(e³) = 3`.",
          "Questo vuol dire che ln ed e^ si annullano a vicenda: `e^(ln x) = x`.",
        ],
        steps: ["Trascina la e sul ln. Si annullano a vicenda."],
      },
      {
        title: "Il logaritmo di un prodotto",
        text: [
          "Quando moltiplichi potenze di e, gli esponenti si sommano. Quindi il logaritmo di un prodotto è la somma dei logaritmi: `ln(2x) = ln(2) + ln(x)`.",
        ],
        steps: ["Porta il 2 fuori dal ln. Avrà un ln tutto suo."],
      },
      {
        title: "Il logaritmo di una potenza",
        text: ["`x³` è `x·x·x`, quindi `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
        steps: ["Trascina il 3 fuori, davanti al ln."],
      },
      {
        title: "Risolvere con i logaritmi",
        text: [
          "Per far scendere la x da un esponente, applica ln a entrambi i membri. Da `e^x = 5`, trascina la e dall'altra parte dell'=: diventa ln, e ottieni `x = ln(5)`.",
        ],
        steps: ["Trascina la e dall'altra parte dell'=."],
      },
    ],
    hints: {
      l2: "Trascina la e sul ln.",
      l3: "Trascina il ln su quello che c'è dentro.",
      l4: "Trascina il 3 fuori, davanti.",
      l8: "Trascina la e dall'altra parte del segno =.",
      l12: "Una radice è una potenza. Trascina la √ fuori, davanti.",
      l1: "Trascina la x fuori, davanti al ln. Quanto fa ln(e)?",
      l14: "Prima porta il fattore ½ dentro il ln.",
      l7: "Tocca l'8 per scriverlo come potenza di 2. Poi trascina il 3 fuori, davanti, e tocca log₂(2).",
      l15: "A quale esponente va elevato e per ottenere 1?",
      l19: "Quando sottrai due logaritmi, dividi gli argomenti.",
      l20: "È la stessa mossa che con la e, ma il 2 diventa log₂.",
      l22: "Stessa base: somma gli esponenti.",
      l23: "Prima spezza il ln. Quanto fa ln(e)?",
      l26: "Prima isola la potenza.",
    },
  },
};
