import type { Translation } from "../en";


export const nl: Translation = {
  htmlLang: "nl",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
  language: "Taal",

  // Top bar
  makeExercises: "Oefeningen maken",
  skin: "Thema",
  skins: { modern: "Modern", codex: "Codex", paper: "Papier", blackboard: "Schoolbord" },
  settings: "Instellingen",
  numbersInColour: "Getallen in kleur",
  debugMode: "Debugmodus",
  sandboxInput: "Uitdrukking of vergelijking",
  sandboxPlaceholder: "bijv. 3(x - 2) = 2x + 1   of   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Laden",
  debugOn: "De debugmodus staat aan: tik om hem uit te zetten",

  // Home
  heroBefore: "Algebra die je ",
  heroWord: "voelt",
  heroAfter: ".",
  heroText:
    "Sleep elk stukje van een vergelijking. Het kan alleen bewegen zoals de wiskunde het toestaat. Schuif net zo lang tot het eruitziet als het doel.",
  learningPath: "Leerpad",
  chapterNodeLabel: (n: number, title: string) => `Hoofdstuk ${n}: ${title}`,
  chapterN: (n: number) => `Hoofdstuk ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} en ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Bouwt voort op ${titles}.`,
  startLesson: "Begin met de les →",

  // Chapter page
  backToPath: "← Leerpad",
  level: { easy: "Makkelijk", medium: "Gemiddeld", hard: "Moeilijk" },
  makingExercise: "Oefening wordt gemaakt…",
  anotherOne: "Nog een →",
  progressHere:
    "Je voortgang wordt alleen in deze browser bewaard. Sla hem op in een bestand, zodat je hem niet kwijtraakt of op een ander apparaat verder kunt.",
  saveProgress: "Voortgang exporteren naar een bestand",
  loadProgress: "Voortgang laden uit een bestand",
  progressSaved: "Opgeslagen. Laad dat bestand hier, of in een andere browser, en je hebt je voortgang terug.",
  copyright: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Open source onder de MIT-licentie.`,
  aboutLink: "Over",
  about: {
    title: "Over DragDropMath",
    sections: [
      {
        heading: "Wat het is",
        text: [
          "Met DragDropMath doe je algebra met je handen. Je sleept elk stukje van een uitdrukking of vergelijking, en het kan alleen bewegen zoals de wiskunde het toestaat. Een foute zet gebeurt gewoon niet. Zo leer je wat mag door het te voelen, niet door regels uit je hoofd te leren.",
          "Er is een leerpad van termen ordenen tot kwadratische vergelijkingen. Elk hoofdstuk heeft een les, oefeningen op drie niveaus en ‘Uit het hoofd’-opgaven, waarbij je het antwoord eerst in gedachten voor je ziet en het daarna uitwerkt. Docenten kunnen zelf reeksen oefeningen maken en die als link delen.",
        ],
      },
      {
        heading: "Wie het heeft gemaakt",
        text: [
          "DragDropMath is gemaakt door Filippo Miatto, om van algebra iets te maken wat je kunt zien en aanraken, in plaats van een rijtje regels om te onthouden.",
        ],
      },
      {
        heading: "Je privacy",
        text: [
          "Er zijn geen accounts, geen advertenties en je wordt niet gevolgd. Je voortgang wordt alleen in je eigen browser bewaard, en niets van wat je doet wordt ergens naartoe gestuurd. Bij Instellingen kun je hem opslaan in een bestand, zodat je hem niet kwijtraakt of naar een ander apparaat kunt meenemen.",
          "Een reeks oefeningen zit helemaal in de link zelf: er wordt niets van online opgeslagen.",
        ],
      },
    ],
  },
  progressNotABackup: "Dit is geen voortgangsbestand van DragDropMath.",
  progressReplace: (saved: string) =>
    `Hiermee vervang je je voortgang in deze browser door die uit het bestand${saved ? ` (opgeslagen op ${saved})` : ""}. Laden?`,
  progressLoadIt: "Laden",
  cancel: "Annuleren",
  progressNoRoom: "Je browser kon hem niet opslaan, dus er is niets veranderd.",
  progressBlocked:
    "Deze browser bewaart niets voor deze site (een privévenster, of opslag staat uit), dus er is geen voortgang om op te slaan.",
  showMove: "Voordoen",
  lesson: "Les",
  practice: "Oefenen",
  predict: "Uit het hoofd",
  scores: "Scores ‘Uit het hoofd’",
  scoreOf: (n: number) => `score ${n}`,
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) =>
    `${level}: score ${now}${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  drills: {
    commute: {
      name: "Volgorde omwisselen",
      how: "Sleep een term langs zijn buurman. Bij + en × maakt de volgorde niet uit.",
      text: [
        "De volgorde waarin je optelt, verandert de uitkomst niet: `2 + x` en `x + 2` zijn hetzelfde.",
        "Elk deel van een som heet een term. Een term neemt zijn teken mee als hij verschuift: in `5 − 3 + x` hoort het minteken bij de 3.",
      ],
    },
    combine: {
      name: "Getallen optellen",
      how: "Sleep het ene getal op het andere om ze op te tellen.",
      text: ["Twee getallen in dezelfde som kun je bij elkaar optellen. Een letter staat voor een getal dat we nog niet kennen, dus die blijft gewoon staan."],
    },
    "multiply-numbers": {
      name: "Getallen vermenigvuldigen",
      how: "Sleep het getal rechts op het andere getal waarmee het vermenigvuldigd wordt.",
      text: ["Ook bij vermenigvuldigen maakt de volgorde niet uit: `2·x·5` is `2·5·x`. Je kunt de 2 en de 5 dus met elkaar vermenigvuldigen, en dan krijg je `10x`."],
    },
    collect: {
      name: "Gelijksoortige termen samennemen",
      how: "Sleep een term op een gelijksoortige term, dus een met dezelfde letters met dezelfde exponenten. Ze worden opgeteld.",
      text: [
        "`3x` betekent `x + x + x`. Dus `3x + 2x` is drie x'en plus twee x'en: `5x`.",
        "Alleen gelijksoortige termen kun je optellen: termen met precies dezelfde letters, met dezelfde exponenten. Van `3x + 2` kun je geen `5x` maken, termen met x en termen met y blijven apart, en `x²` en `3x` ook.",
      ],
    },
    "collect-cancel": {
      name: "Tegengestelde termen",
      how: "Sleep een term op zijn tegengestelde. Ze vallen tegen elkaar weg.",
      text: ["Aftrekken werkt net zo: `5y − 2y` is `3y`. Iets min zichzelf is 0, dus `a + b − a` is gewoon `b`."],
    },
    distribute: {
      name: "Haakjes wegwerken",
      how: "Sleep het getal voor de haakjes op de haakjes: het vermenigvuldigt elke term ertussen. Tik daarna op de · om de getallen uit te rekenen.",
      text: [
        "`2(x + 3)` betekent 2 keer `(x + 3)`: 2 keer x plus 2 keer 3, dus `2x + 2·3`. Het getal buiten de haakjes vermenigvuldigt elke term ertussen.",
        "Denk aan een rechthoek van 2 hoog en `x + 3` breed. De twee stukken hebben een oppervlakte van `2·x` en `2·3`, en samen vormen ze de hele rechthoek.",
      ],
    },
    "distribute-neg": {
      name: "Minteken voor de haakjes",
      how: "Sleep het minteken op de haakjes. Alle tekens ertussen veranderen.",
      text: ["`−(x − 4)` betekent −1 keer de haakjes. Die −1 vermenigvuldigt elke term, dus alle tekens ertussen veranderen."],
    },
    "factor-out": {
      name: "Buiten haakjes brengen",
      how: "Beide termen hebben een gemeenschappelijke factor. Houd die in een van de termen ingedrukt en sleep hem naar voren, voorbij het linkeruiteinde.",
      text: [
        "Ontbinden in factoren betekent: een som schrijven als een product. In `3x + 3y` zijn beide termen iets keer 3. Die 3 kun je dus één keer opschrijven, voor haakjes met daartussen wat elke term verder nog heeft: `3x + 3y = 3(x + y)`.",
        "Dat klopt, want als je in `3(x + y)` de haakjes wegwerkt, krijg je weer `3x + 3y`: de 3 gaat langs elke term tussen de haakjes. Zo kun je ook controleren of je goed hebt ontbonden.",
      ],
    },
    "split-exponent": {
      name: "Exponent splitsen",
      how: "Haal een term uit de exponent. De macht valt uiteen in twee machten met hetzelfde grondtal.",
      text: ["`2^(x + 3)` is x + 3 tweeën met elkaar vermenigvuldigd: eerst x stuks, en dan nog 3. Het is dus `2^x·2^3`: een som in de exponent wordt een product van machten."],
    },
    "merge-powers": {
      name: "Zelfde grondtal: exponenten optellen",
      how: "Sleep de ene macht op de andere, of tik op de · ertussen. De exponenten worden opgeteld: tik op de + om ze uit te rekenen.",
      text: [
        "`x³` betekent `x·x·x`. Het kleine getal, de exponent, telt hoeveel x'en er zijn.",
        "Dus `x²·x³` is twee x'en keer drie x'en: vijf x'en in totaal. Vermenigvuldig je machten met hetzelfde grondtal, dan tel je de exponenten op.",
      ],
    },
    "power-to-product": {
      name: "Een kwadraat als product",
      how: "Tik op de ² om de haakjes twee keer op te schrijven. Werk ze daarna weg zoals bij het vorige voorbeeld (houd een factor ingedrukt om hem los te slepen: kort tikken pakt de hele term) en neem gelijksoortige termen samen.",
      text: ["`(x + 1)²` is `(x + 1)(x + 1)`, dus die werk je op dezelfde manier uit."],
    },
    "move-denominator": {
      name: "Beide kanten vermenigvuldigen",
      how: "Sleep de noemer van de breuk naar de andere kant van het =. Daar gaat hij vermenigvuldigen. Tik daarna op de · om het uit te rekenen.",
      text: ["De noemer van een breuk gaat vermenigvuldigen als hij naar de overkant gaat. Bij `x/3 = 4` vermenigvuldig je beide kanten met 3: `x = 4·3`."],
    },
    "move-sign": {
      name: "Minteken naar de overkant",
      how: "Sleep alleen het minteken naar de andere kant van het =. Daar verandert het teken van de hele kant.",
      text: ["Een minteken voor een hele kant kan ook naar de overkant: beide kanten worden met −1 vermenigvuldigd, dus `−x = 6` wordt `x = −6`."],
    },
    "swap-sides": {
      name: "Kanten omwisselen",
      how: "Sleep een kant over het = en voorbij het andere uiteinde. De twee kanten wisselen van plaats.",
      text: ["`7 = x` en `x = 7` zeggen hetzelfde, dus de twee kanten mogen van plaats wisselen."],
    },
    "letter-in": {
      name: "Letter keer haakjes",
      how: "Sleep de letter voor de haakjes op de haakjes. Houd daarna een van de twee letters naast elkaar ingedrukt en sleep hem op de andere: `x·x` is `x²`. (Kort tikken zou de hele term pakken.)",
      text: ["De letter vermenigvuldigt elke term tussen de haakjes, net als een getal: `x(x + 3) = x·x + x·3`. En `x·x` is een macht, `x²`, zoals bij Machten."],
    },
    "zero-product": {
      name: "Een product gelijk aan 0",
      how: "Trek één paar haakjes omlaag, los van het product: de vergelijking splitst in tweeën, die haakjes zijn 0 of de andere. Los daarna elk deel op.",
      text: [
        "Een product is alleen 0 als een van de factoren 0 is: `3·0 = 0`, maar `3·2` niet. Dus `(x − 2)(x + 3) = 0` betekent `x − 2 = 0` of `x + 3 = 0`: twee oplossingen.",
        "Daarom deel je nooit beide kanten door iets dat 0 kan zijn: hier zou je dan een oplossing kwijtraken.",
      ],
    },
    "take-out-then-split": {
      name: "Letter buiten haakjes, dan splitsen",
      how: "Houd de letter in een term ingedrukt en sleep hem naar voren, voorbij het linkeruiteinde. Trek hem daarna omlaag, los van het product.",
      text: ["Staat er geen los getal, dan zit in elke term een x: haal die buiten haakjes, `x² − 3x = x(x − 3)`. Nu heb je een product gelijk aan 0, dus `x = 0` of `x − 3 = 0`."],
    },
    "split-middle": {
      name: "Ontbinden, dan splitsen",
      how: "Tik op de middelste term: hij splitst in tweeën. Haal uit elk tweetal een factor buiten haakjes, en daarna de haakjes die ze gemeen hebben. Trek dan één paar haakjes omlaag, los van het product.",
      text: ["`x² + x − 6` is een product van twee paar haakjes: `(x + 3)(x − 2)`. De twee getallen geven vermenigvuldigd `−6` en opgeteld `1`, het getal voor de x. Is het eenmaal een product gelijk aan 0, dan levert elk paar haakjes een oplossing op."],
    },
    "power-of-power": {
      name: "Macht van een macht",
      how: "Sleep de buitenste exponent op de binnenste. Ze worden vermenigvuldigd: tik op de · om het uit te rekenen.",
      text: ["`(x²)³` is `x²·x²·x²`. Dat zijn 2 + 2 + 2 = 6 x'en, dus de exponenten worden vermenigvuldigd."],
    },
    "factor-shared": {
      name: "Samen buiten haakjes",
      how: "Houd de `x` van een term ingedrukt en sleep hem op een andere term met een `x`: die twee brengen hem samen buiten haakjes. Haal daarna buiten haakjes wat de laatste twee termen gemeen hebben (vaak een getal), en dan de haakjes die de twee producten gemeen hebben.",
      text: ["Bij vier termen werk je per paar. Breng een gemeenschappelijke factor buiten haakjes bij de eerste twee termen, en daarna bij de laatste twee. Staat er twee keer hetzelfde tussen de haakjes, dan haal je ook die haakjes naar voren."],
    },
    "ineq-move-term": {
      name: "Term naar de overkant",
      how: "Sleep het getal naar de andere kant van het ongelijkheidsteken. Zijn eigen teken verandert, maar het ongelijkheidsteken blijft staan. Tik daarna op de − om het uit te rekenen.",
      text: [
        "`x < 7` zegt dat x kleiner is dan 7. De open kant van het teken wijst naar het grootste getal.",
        "Tel je aan beide kanten hetzelfde op of trek je aan beide kanten hetzelfde af, dan blijft het teken staan. Een term gaat dus naar de overkant net als bij een vergelijking.",
      ],
    },
    "ineq-swap": {
      name: "Kanten omwisselen",
      how: "Sleep de ene kant voorbij de andere. Het ongelijkheidsteken klapt mee om.",
      text: ["`3 > x` en `x < 3` zeggen hetzelfde: x is kleiner dan 3. De kanten mogen dus van plaats wisselen, als het teken maar mee omklapt."],
    },
    "ineq-sign": {
      name: "Minteken naar de overkant",
      how: "Sleep alleen het minteken naar de overkant. Het ongelijkheidsteken klapt om.",
      text: ["Vermenigvuldigen met −1 draait de volgorde om: `2 < 3`, maar `−2 > −3`. Gaat er een minteken naar de overkant, dan klapt het teken dus om."],
    },
    "add-fractions": {
      name: "Breuken optellen",
      how: "De noemers zijn gelijk: sleep de ene breuk op de andere, of tik op de + ertussen. Tik daarna op de + in de teller om de tellers op te tellen.",
      text: ["`3/4` betekent drie vierde. Zijn de noemers gelijk, dan tel je gewoon de tellers op: één vijfde plus twee vijfde is drie vijfde, dus `1/5 + 2/5 = 3/5`."],
    },
    "expand-fraction": {
      name: "Gelijknamig maken",
      how: "Houd de noemer van de ene breuk ingedrukt en sleep hem op de andere breuk, en daarna andersom: nu hebben ze dezelfde noemer. Tik op elke · om de tellers en noemers uit te rekenen, en tel dan de breuken op.",
      text: [
        "Teller en noemer met hetzelfde getal vermenigvuldigen verandert een breuk niet: `1/2 = 2/4 = 3/6`.",
        "Zo maak je breuken gelijknamig. Om `1/2 + 1/3` op te tellen, vermenigvuldig je teller en noemer van `1/2` met 3, en die van `1/3` met 2: nu zijn het allebei zesden.",
      ],
    },
    "multiply-fractions": {
      name: "Breuken vermenigvuldigen",
      how: "Tik op de · tussen de breuken, of sleep de ene breuk op de andere: teller keer teller, en noemer keer noemer.",
      text: ["Vermenigvuldigen is eenvoudiger: vermenigvuldig de tellers met elkaar, en de noemers met elkaar. De helft van een derde is `(1·1)/(2·3) = 1/6`."],
    },
    "split-fraction": {
      name: "Breuk splitsen",
      how: "Haal een term uit de teller. Hij neemt een kopie van de noemer mee.",
      text: ["Een som in de teller kun je splitsen in een aparte breuk voor elke term, allemaal met dezelfde noemer: `(x + 5)/6 = x/6 + 5/6`."],
    },
    "join-powers": {
      name: "Wortels samenvoegen",
      how: "Sleep de ene wortel op de andere. Ze komen samen onder één wortelteken.",
      text: [
        "Het kwadraat van `√2·√3` is `2·3`, dus `√2·√3` is het positieve getal waarvan het kwadraat 6 is: `√(2·3) = √6`. Twee wortels van dezelfde soort kun je onder één wortel samenvoegen.",
        "Dat geldt voor elke exponent die ze gemeen hebben: `x³y³` is xxx·yyy, en dat is xy·xy·xy, dus `(xy)³`.",
      ],
    },
    "root-notation": {
      name: "Een wortel als macht",
      how: "Tik op de wortel om hem als macht te schrijven: √ is een macht ½, ∛ een macht ⅓.",
      text: ["Elke wortel is een macht: `√x = x^(1/2)`, `∛x = x^(1/3)`, en de n-demachtswortel uit x is `x^(1/n)`. Alle rekenregels voor machten gelden dus ook voor wortels: `√x·√x = x^(1/2 + 1/2) = x`."],
    },
    "fraction-power": {
      name: "Wortels en machten samen",
      how: "Sleep de wortel op de macht: de exponenten worden opgeteld. Schrijf daarna het hele getal als halven: sleep de noemer van de ½ erop en tik op de · om het uit te rekenen. Tel dan de breuken op en tik op de + in de teller.",
      text: ["`√x` is `x^(1/2)`, dus `√x·x² = x^(1/2 + 2) = x^(5/2)`. Een breuk als exponent werkt net als elke andere exponent: vermenigvuldig je machten, dan tel je de exponenten op."],
    },
    "exp-of-log": {
      name: "Macht heft logaritme op",
      how: "Sleep het grondtal op de logaritme in zijn exponent. Ze heffen elkaar op.",
      text: ["`e` is een bijzonder getal, ongeveer 2,718. `ln(x)` is de exponent die je op e moet zetten om x te krijgen, dus ln en e^ heffen elkaar op: `e^(ln x) = x`. Logaritmen met een ander grondtal werken net zo: `2^(log₂ x) = x`."],
    },
    "evaluate-log": {
      name: "Bekende logaritmen",
      how: "Tik op de logaritme om hem uit te rekenen: `ln(e) = 1`, en de logaritme van 1 is 0.",
      text: ["`ln(e) = 1`, want `e¹ = e`. En de logaritme van 1 is 0, want `e⁰ = 1`."],
    },
    "power-of-base": {
      name: "Als macht van het grondtal",
      how: "Tik op het getal in de logaritme om het als macht van 2 te schrijven. Sleep daarna de exponent naar voren, voor de logaritme, en tik op de logaritme.",
      text: ["Om `log₂(8)` uit te rekenen, schrijf je 8 als macht van 2: `8 = 2³`, dus `log₂(8) = 3`."],
    },
    "log-of-product": {
      name: "Logaritme splitsen",
      how: "Haal het getal uit de logaritme. Het krijgt zijn eigen logaritme.",
      text: ["Als je machten vermenigvuldigt, tel je de exponenten op. Daarom is de logaritme van een product een som van logaritmen: `ln(2x) = ln(2) + ln(x)`."],
    },
    "log-of-root": {
      name: "Logaritme van een wortel",
      how: "Tik op de wortel om hem als macht te schrijven. Sleep daarna de exponent naar voren, voor de logaritme.",
      text: ["Een wortel is een macht, `√x = x^(1/2)`, dus de exponent komt uit de logaritme zoals elke andere exponent: `ln(√x) = ½ln(x)`."],
    },
    "log-of-power": {
      name: "Exponent uit de logaritme",
      how: "Sleep de exponent naar voren, voor de logaritme.",
      text: ["`x³` is `x·x·x`, dus `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
    },
    "power-into-log": {
      name: "Getal in de logaritme",
      how: "Sleep het getal voor de logaritme op de logaritme. Binnenin wordt het een exponent.",
      text: ["En andersom: `3ln(x)` is `ln(x³)`."],
    },
    "combine-logs": {
      name: "Logaritmen samennemen",
      how: "Sleep de ene logaritme op de andere, of tik op de + (of −) ertussen. Optellen wordt binnenin vermenigvuldigen, aftrekken wordt delen.",
      text: ["Ook dit kan andersom: `ln(a) + ln(b) = ln(ab)`, en `ln(a) − ln(b) = ln(a/b)`."],
    },
    "move-exponent-term": {
      name: "Tussen exponenten",
      how: "Beide kanten zijn machten met hetzelfde grondtal. Sleep een term van de ene exponent naar de andere: zijn teken verandert.",
      text: [
        "Zijn beide kanten machten met hetzelfde grondtal, dan zijn hun exponenten gelijk. Je kunt ze dus in evenwicht houden, net als de twee kanten van een vergelijking.",
        "`2^(x − 3) = 2^4` wordt `2^x = 2^(4 + 3)`: beide kanten zijn met `2^3` vermenigvuldigd.",
      ],
    },
    "exp-across": {
      name: "Grondtal naar de overkant",
      how: "Sleep het grondtal naar de andere kant van het =. Daar wordt het een logaritme.",
      text: ["Om x uit een exponent te halen, neem je van beide kanten de logaritme. Bij `e^x = 5` gaat de e naar de overkant en wordt daar ln: `x = ln(5)`."],
    },
    "bracket-times-bracket": {
      name: "Haakjes keer haakjes",
      how: "Sleep de ene haakjes op de andere: ze vermenigvuldigen beide termen ertussen. Werk daarna elke nieuwe term op dezelfde manier uit: houd een van de factoren ingedrukt en sleep hem op de andere (kort tikken pakt de hele term). Houd dan een x van `x·x` ingedrukt, sleep hem op de andere en neem gelijksoortige termen samen.",
      text: [
        "In `(x + 1)(x + 2)` is het eerste paar haakjes één factor: het vermenigvuldigt alles tussen de tweede haakjes, de x en de 2. Daarna werk je elke `(x + 1)` om de beurt weg.",
        "Twee termen keer twee termen geeft vier termen. Neem daarna gelijksoortige termen samen: `(x + 1)(x + 2) = x² + 3x + 2`.",
      ],
    },
    "bracket-out": {
      name: "Haakjes naar voren halen",
      how: "Beide termen hebben dezelfde haakjes. Houd ze in een van de termen ingedrukt en sleep ze naar voren, voorbij het linkeruiteinde.",
      text: ["Ook een heel stuk tussen haakjes kan een gemeenschappelijke factor zijn. In `x(x + 2) + 3(x + 2)` hebben beide termen `(x + 2)`, dus dat komt naar voren zoals elke andere factor: `(x + 2)(x + 3)`."],
    },
    "tap-operator": {
      name: "Tik op het teken ertussen",
      how: "Tik op de + tussen de twee getallen: ze worden opgeteld, net als wanneer je het ene op het andere sleept.",
      text: ["Tik je op het teken tussen twee stukjes, dan reken je ze uit: een + telt ze op, een − trekt er een af, een · vermenigvuldigt. Het werkt hetzelfde als het ene op het andere slepen: kies wat het snelst gaat."],
    },
    "multiply-out": {
      name: "De getallen in een product vermenigvuldigen",
      how: "Tik op de ·: alle getallen in het product worden vermenigvuldigd, en `4x·3` wordt `12x`.",
      text: ["Bij vermenigvuldigen maakt de volgorde niet uit, dus `4x·3` is `4·3·x`. Ook met een letter ertussen kun je de getallen met elkaar vermenigvuldigen."],
    },
    "times-zero": {
      name: "Keer nul",
      how: "Tik op de 0: het hele product wordt 0. Tik daarna op de + om op te tellen.",
      text: ["Alles keer 0 is 0. Dus `0·(x + 4)` is 0, wat x ook is."],
    },
    "evaluate-power": {
      name: "Een macht uitrekenen",
      how: "Sleep de exponent op het getal: `2³` wordt 8.",
      text: ["`2³` betekent `2·2·2`: het kleine getal, de exponent, telt hoe vaak je 2 met zichzelf vermenigvuldigt. Een macht van een getal kun je dus uitrekenen: `2³ = 8`.", "Tik je op de exponent, dan schrijf je de macht juist uit: `2³` wordt `2·2·2`."],
    },
    "divide-powers": {
      name: "Zelfde grondtal: exponenten aftrekken",
      how: "Sleep de macht in de noemer op de macht met hetzelfde grondtal in de teller. Hun exponenten worden van elkaar afgetrokken: tik op de − om het uit te rekenen.",
      text: ["In `x⁵/x²` staan vijf x'en boven en twee onder. Twee ervan vallen boven en onder tegen elkaar weg, en er blijven er drie boven over: bij delen trek je de exponenten af."],
    },
    "flip-across-bar": {
      name: "Over de breukstreep",
      how: "Sleep de macht over de breukstreep, van onder naar boven of van boven naar onder. Het teken van zijn exponent verandert.",
      text: ["Staan er onder meer x'en, dan wordt de exponent kleiner dan nul: `x²/x⁵` is `x^(2 − 5) = x⁻³`, en het is ook `1/x³`. Dus `x⁻³` betekent `1/x³`: breng je een macht naar de andere kant van de breukstreep, dan verandert het teken van de exponent, welke kant je ook op gaat."],
    },
    "power-of-product": {
      name: "Exponent tussen de haakjes",
      how: "Sleep de exponent tussen de haakjes: elke factor daar krijgt zijn eigen exponent. Sleep daarna de exponent van het getal op het getal om het uit te rekenen.",
      text: ["`(2x)³` is `2x·2x·2x`, en dat is `2³·x³`. Elke factor tussen de haakjes krijgt de exponent."],
    },
    "minus-bracket": {
      name: "Minteken voor de haakjes, in een som",
      how: "Sleep het minteken voor de haakjes op de haakjes: alle tekens ertussen veranderen. (Kan de hele som bewegen, dan pak je met kort drukken op de − de hele som: houd hem ingedrukt om alleen het minteken te pakken.)",
      text: ["`5 − (x + 2)` trekt heel `x + 2` af, de x en de 2. Het minteken verandert dus alle tekens ertussen: `5 − x − 2`."],
    },
    "split-number": {
      name: "Een getal splitsen",
      how: "Tik op het getal voor de letter: het splitst in twee factoren, met voorop de factor die het met het andere getal gemeen heeft. Tik ook op het andere getal. Tik daarna op de + tussen de termen: de gemeenschappelijke factor komt buiten haakjes.",
      text: ["Een gemeenschappelijke factor zie je niet altijd meteen. In `6x + 9` zijn beide termen deelbaar door 3, maar in `6x` staat geen 3 die je buiten haakjes kunt brengen.", "Tik op de 6: die splitst in `3·2`, met voorop de 3 die hij met 9 gemeen heeft. Nu staat er wel een 3: `3·2x + 9 = 3(2x + 3)`."],
    },
    "split-term": {
      name: "De middelste term splitsen",
      how: "Tik op de letter van de middelste term: hij splitst in tweeën. (Tik je op het getal, dan splitst juist het getal.) Ontbind daarna per tweetal, zoals bij het vorige voorbeeld: tik op de + tussen de eerste twee termen, dan tussen de laatste twee, en dan tussen de twee producten.",
      text: ["Om `x² + 5x + 6` te ontbinden, zoek je twee getallen die opgeteld 5 en vermenigvuldigd 6 geven: 2 en 3. Schrijf `5x` als `2x + 3x`.", "Nu heb je vier termen, en die ontbind je per tweetal: `x(x + 2) + 3(x + 2)`, en dan `(x + 2)(x + 3)`."],
    },
    "difference-of-squares": {
      name: "Verschil van twee kwadraten",
      how: "Beide termen zijn kwadraten, en de ene wordt van de andere afgetrokken: tik op het minteken ertussen. (Hebben de twee termen een getal gemeen, dan brengt de tik dat eerst buiten haakjes, `4x² − 4 = 4(x² − 1)`: tik dan nog een keer op het minteken.)",
      text: ["Een kwadraat min een kwadraat ontbind je altijd op dezelfde manier: `a² − b² = (a − b)(a + b)`. Werk de haakjes weg om het te controleren: de middelste termen vallen tegen elkaar weg.", "Het werkt alleen bij een verschil, een kwadraat min een kwadraat. Een som van twee kwadraten, zoals `x² + 9`, kun je helemaal niet ontbinden. Een kwadraat min een getal dat geen kwadraat is, zoals `x² − 7`, wel, maar dan met wortels: `(x − √7)(x + √7)`."],
    },
    "cancel-factor": {
      name: "Een gemeenschappelijke factor wegdelen",
      how: "Sleep het getal in de noemer op hetzelfde getal in de teller (of andersom): ze vallen tegen elkaar weg.",
      text: ["Een getal dat de hele teller en de hele noemer vermenigvuldigt, kun je wegdelen: `(3x)/3` is `x`, want `3x` gedeeld door 3 is x. In `(3x + 1)/3` kan dat niet: de 3 vermenigvuldigt maar een deel van de teller."],
    },
    "evaluate-fraction": {
      name: "Een breuk uitrekenen",
      how: "Tik op de teller: die splitst, met het getal uit de noemer voorop (14 gedeeld door 7 wordt `7·2`). Sleep daarna de 7 uit de noemer op die 7: ze vallen tegen elkaar weg.",
      text: ["Komt er bij een breuk een heel getal uit, dan kun je hem uitrekenen: `12/3` is 4, want `12 = 3·4`, en de 3 in de teller valt weg tegen de 3 in de noemer."],
    },
    "divide-numbers": {
      name: "Een breuk vereenvoudigen",
      how: "Tik op de teller en daarna op de noemer: ze splitsen allebei, met de factor die ze gemeen hebben voorop (8 en 12 worden `4·2` en `4·3`). Sleep daarna de ene 4 op de andere: ze vallen tegen elkaar weg.",
      text: ["Je vereenvoudigt een breuk door teller en noemer door hetzelfde getal te delen: `8/12 = 2/3`. De waarde verandert niet.", "Door de getallen te splitsen zie je wat ze gemeen hebben: `8/12 = (4·2)/(4·3)`, en de 4'en vallen tegen elkaar weg."],
    },
    "factor-then-cancel": {
      name: "Eerst buiten haakjes, dan wegdelen",
      how: "Houd het getal in een term in de teller ingedrukt en sleep het naar voren, voorbij het linkeruiteinde (of tik op de + tussen de termen). Sleep het daarna op hetzelfde getal in de noemer: ze vallen tegen elkaar weg.",
      text: ["Je kunt alleen een factor van de hele teller wegdelen. In `(2x + 6)/2` is de 2 een factor van elke term, dus breng hem eerst buiten haakjes: `(2(x + 3))/2`. Nu is hij een factor van de hele teller, en valt hij weg tegen de noemer."],
    },
    "divide-by-fraction": {
      name: "Delen door een breuk",
      how: "Sleep de noemer van de onderste breuk omhoog naar de teller. Daar gaat hij de teller vermenigvuldigen. Tik op de · om het uit te rekenen, en deel dan weg wat teller en noemer gemeen hebben.",
      text: ["Wat een getal doet, hangt af van hoeveel breukstrepen erboven staan. In `4/(3/5)` staat de 5 onder twee breukstrepen: je deelt door een deling, dus hij vermenigvuldigt. Hij mag dus naar de teller, zonder dat de waarde verandert: `(4·5)/3`.", "Daarom is delen door een breuk hetzelfde als vermenigvuldigen met het omgekeerde: `4/(3/5) = 4·5/3`."],
    },
    "evaluate-root": {
      name: "Een wortel uitrekenen",
      how: "Tik op de wortel om hem als macht te schrijven: `√9` is `9^(1/2)`. Sleep daarna de ½ op de 9 om het uit te rekenen.",
      text: ["`√9` is het positieve getal dat keer zichzelf 9 geeft: 3, want `3·3 = 9` (−3 ook, maar √ betekent het positieve getal). Zo is ook `∛8 = 2`, want `2·2·2 = 8`.", "Als macht is `√9 = 9^(1/2)`: sleep je de ½ op de 9, dan reken je het uit, net als bij elke andere exponent."],
    },
    "pull-out-of-power": {
      name: "Een wortel splitsen",
      how: "Haal het getal onder de wortel vandaan: het krijgt zijn eigen wortel. Reken die wortel daarna uit: tik erop, en sleep de ½ op het getal.",
      text: ["De wortel van een product is het product van de wortels: `√(4x) = √4·√x = 2√x`."],
    },
    "split-square": {
      name: "Een wortel vereenvoudigen",
      how: "Tik op het getal onder de wortel: er splitst een kwadraat af (bij een derdemachtswortel een derde macht). Haal dat onder de wortel vandaan, zoals bij het vorige voorbeeld, en reken zijn wortel uit.",
      text: ["Ook een wortel waar geen heel getal uitkomt, kun je soms vereenvoudigen. Splits het getal eronder zo dat er een kwadraat afsplitst: `√12 = √(4·3) = 2√3`."],
    },
    "root-of-power": {
      name: "De wortel van een macht",
      how: "Tik op de wortel om hem als macht te schrijven. Sleep de buitenste exponent op de binnenste, en tik op de · om het product uit te rekenen. Deel daarna weg wat teller en noemer van de exponent gemeen hebben.",
      text: ["Een wortel is een macht, dus de wortel van een macht is een macht van een macht: `∛(x⁶) = (x⁶)^(1/3) = x^(6/3) = x²`. De exponenten worden vermenigvuldigd, zoals bij Machten."],
    },
    "rationalise": {
      name: "Een heel getal in de noemer",
      how: "Sleep de wortel in de noemer omhoog naar de teller: teller en noemer worden er allebei mee vermenigvuldigd. Tik daarna op de · in de noemer, en deel weg wat er nog weg kan.",
      text: ["Teller en noemer met hetzelfde getal vermenigvuldigen verandert een breuk niet. Neem de wortel die al in de noemer staat: `√3·√3 = 3`, dus `1/√3 = √3/(√3·√3) = √3/3`. Nu staat er geen wortel meer onder de breukstreep."],
    },
    "log-across": {
      name: "Logaritme naar de overkant",
      how: "Sleep de logaritme naar de andere kant van het =. Daar wordt hij een macht. Is dat een macht van een getal, sleep dan de exponent op het getal om het uit te rekenen.",
      text: ["Een logaritme hef je op met een macht. Bij `ln(x) = 2` gaat de ln naar de overkant en wordt daar e: `x = e²`."],
    },
    "move-term": {
      name: "Een term naar de overkant",
      how: "Sleep het getal naar de andere kant van het =. Onderweg verandert zijn teken. Sleep het op het getal aan de overkant, dan worden ze samen uitgerekend; of laat het ernaast los en tik op de − om het uit te rekenen.",
      text: ["Een vergelijking zegt dat twee kanten gelijk zijn. Doe je aan beide kanten hetzelfde, dan blijven ze gelijk.", "Een term naar de andere kant van het `=` brengen doet precies dat. Bij `x + 3 = 10` trek je aan beide kanten 3 af: `x = 10 − 3`. Daarom wordt `+3` aan de overkant `−3`."],
    },
    "move-factor": {
      name: "Beide kanten delen",
      how: "Sleep het getal voor de letter naar de andere kant van het =. Daar gaat het delen. Reken daarna de breuk uit: tik op de teller om hem te splitsen, en sleep de noemer op de factor die erbij past.",
      text: ["Een getal dat een hele kant vermenigvuldigt, gaat delen als het naar de overkant gaat. Bij `2x = 8` deel je beide kanten door 2: `x = 8/2`, en `8/2 = (2·4)/2 = 4`."],
    },
    "two-steps": {
      name: "In twee stappen",
      how: "Breng het getal dat erbij wordt opgeteld naar de overkant, en sleep het op het getal dat daar staat. Breng daarna het getal voor de letter naar de overkant, en reken de breuk uit: splits de teller, en deel weg.",
      text: ["In `3x + 4 = 19` is x eerst met 3 vermenigvuldigd, en is er daarna 4 bij opgeteld. Om x terug te krijgen, maak je dat in omgekeerde volgorde ongedaan: eerst de 4 eraf, dan delen door 3.", "De 3 kan niet als eerste: die vermenigvuldigt alleen de x, niet de hele kant."],
    },
    "root-across": {
      name: "Een wortel naar de overkant",
      how: "Tik op de wortel om hem als macht te schrijven (½, of ⅓ bij een ∛), en sleep die exponent naar de andere kant van het =: de andere kant wordt gekwadrateerd (bij een ∛ tot de derde macht verheven). Sleep daarna de exponent op het getal om het uit te rekenen.",
      text: ["Om `√x = 3` op te lossen, kwadrateer je beide kanten: `x = 3²`. Een kwadraat heft een wortel op, dus de √ verdwijnt en de andere kant wordt gekwadrateerd. Een derde macht heft een derdemachtswortel op, enzovoort.", "Schrijf je het als macht, `x^(1/2) = 3`, dan is het de ½ die naar de overkant gaat en daar een kwadraat wordt: dezelfde zet."],
    },
    "ineq-move-factor": {
      name: "Beide kanten delen",
      how: "Sleep het getal voor de letter naar de andere kant van het ongelijkheidsteken. Daar gaat het delen, en het ongelijkheidsteken blijft staan. Reken daarna de breuk uit: splits de teller, en deel weg.",
      text: ["Vermenigvuldig of deel je beide kanten door een positief getal, dan blijft het teken ook staan: bij `2x < 8` krijg je `x < 8/2`."],
    },
    "ineq-negative": {
      name: "Delen door een negatief getal",
      how: "Sleep het getal naar de overkant en reken de breuk uit: het ongelijkheidsteken blijft staan. Sleep daarna het minteken naar de overkant: het ongelijkheidsteken klapt om.",
      text: ["Deel je beide kanten door een negatief getal, dan klapt het ongelijkheidsteken om, net als bij vermenigvuldigen met −1: `−2x < 6` betekent `x > −3`.", "Hier zijn het twee zetten die je al kent: delen door 2 (het teken blijft staan), en dan het minteken naar de overkant (het teken klapt om)."],
    },
    "plus-minus": {
      name: "De twee wortels van een kwadraat",
      how: "Sleep de 2 naar de andere kant van het =. Een kwadraat heeft twee wortels: de vergelijking splitst in tweeën, een met + en een met −. Sleep daarna elke ½ op het getal om het uit te rekenen.",
      text: ["`3² = 9`, maar `(−3)² = 9` ook. Dus `x² = 9` betekent `x = 3` of `x = −3`. Vergeet je het minteken, dan raak je een oplossing kwijt."],
    },
    "fraction-zero": {
      name: "Een breuk gelijk aan 0",
      how: "Pak de noemer van de breuk bij zijn + of − en sleep hem naar de andere kant van het =. Daar gaat hij vermenigvuldigen: tik op de 0, want 0 keer iets is 0. Breng daarna het getal naar de overkant.",
      text: ["Een breuk is alleen 0 als de teller 0 is. De noemer mag nooit 0 zijn, en dat staat in de voorwaarde achter de vergelijking: `x ≠ −2` zorgt dat `x + 2` niet 0 wordt.", "De noemer mag dus naar de overkant en daar vermenigvuldigen: `(x − 3)/(x + 2) = 0` geeft `x − 3 = 0·(x + 2)`, dus `x − 3 = 0`. Voldoet een oplossing niet aan de voorwaarde, dan wordt hij doorgestreept."],
    },
    "letter-factor": {
      name: "Delen door een letter",
      how: "Sleep de letter voor x naar de andere kant van het =. Daar gaat hij delen. Sleep hem daarna op dezelfde letter in de teller: ze vallen tegen elkaar weg.",
      text: ["Je mag beide kanten alleen door een letter delen als die niet 0 kan zijn, en dat staat in de voorwaarde achter de vergelijking: `a ≠ 0`.", "Deel nooit door x zelf: als je in `x² = 3x` door x deelt, krijg je `x = 3` en raak je de oplossing `x = 0` kwijt. Breng alles naar één kant en ontbind in factoren."],
    },
    "alone-first": {
      name: "De hele aanpak",
      how: "Nog geen enkele letter staat alleen: breng de x van de eerste vergelijking naar de overkant, zodat je `y = …` krijgt. Vul y daarna in in de andere vergelijking, los die op naar x, en vul x weer in om y te vinden.",
      text: ["Dit is de hele aanpak, van begin tot eind:", "1. Maak in één vergelijking een letter vrij. Kies de makkelijkste: een letter zonder getal ervoor. In `x + y = 7` breng je de x naar de overkant: `y = 7 − x`.", "2. Substitueer: vervang die letter in de andere vergelijking door waar hij gelijk aan is, tussen haakjes. Staat er een minteken voor, dan veranderen alle tekens ertussen.", "3. Los de vergelijking op die overblijft: daar zit nog maar één letter in.", "4. Vul de gevonden waarde in in `y = …` om de andere letter te vinden."],
    },
    "fraction-of-fractions": {
      name: "Een breuk van twee breuken",
      how: "Sleep de noemer van de onderste breuk omhoog naar de teller, en daarna de noemer van de bovenste breuk omlaag naar de noemer. Tik dan op elke · om het uit te rekenen.",
      text: ["In `(a/b)/(c/d)` mag elk van de vier getallen over de hoofdbreukstreep naar de plek met evenveel breukstrepen erboven, zonder dat de waarde verandert (zoals de 5 bij het vorige voorbeeld): d gaat omhoog naast a, b gaat omlaag naast c, c gaat omhoog naast b, en a gaat omlaag naast d. (Behalve als a 0 kan zijn: door 0 kun je niet delen.)", "Verplaats je de twee noemers, dan wordt het één breuk: `(a·d)/(c·b)`."],
    },
    "minus-number-in": {
      name: "Een negatief getal voor de haakjes",
      how: "Sleep het getal op de haakjes en tik op de · om het uit te rekenen. Sleep daarna het minteken op de haakjes: alle tekens ertussen veranderen.",
      text: ["`−3(x − 2)` betekent −1 keer 3 keer de haakjes. Vermenigvuldig eerst met 3: `−(3x − 6)`. Daarna verandert het minteken alle tekens ertussen: `−3x + 6`.", "Let op het laatste teken: `−3` keer `−2` is `+6`. Min keer min is plus."],
    },
    "substitute-back": {
      name: "Terug invullen",
      how: "Sleep de `x` van `x = …` op de `x` in de andere vergelijking. Tik daarna op de · en de + om y uit te rekenen.",
      text: ["Weet je x, dan vind je y met de andere vergelijking: vul daar de waarde van x in en reken het uit. Nu heb je ze allebei, en dat paar is de oplossing.", "Controleer het door beide waarden in te vullen in de vergelijking die je het laatst niet hebt gebruikt: aan beide kanten moet hetzelfde uitkomen."],
    },
    "square-both-sides": {
      name: "Beide kanten kwadrateren",
      how: "Tik op de wortel om hem als macht met exponent ½ te schrijven, en sleep de ½ over het =: de andere kant wordt gekwadrateerd. Werk de haakjes weg, breng alles naar één kant, ontbind in factoren en splits, zoals bij het vorige voorbeeld. Een oplossing die niet aan een voorwaarde voldoet, wordt doorgestreept.",
      text: ["Een wortel is nooit negatief, dus `√(x + 7) = x + 1` klopt alleen als `x + 1 ≥ 0`, dus als `x ≥ −1`. (En wat onder de wortel staat, mag ook niet negatief zijn: `x ≥ −7`.) Dat zijn de voorwaarden, die er vanaf het begin bij staan: ze blijven de hele tijd gelden.", "Door beide kanten te kwadrateren raak je ze kwijt: `x + 7 = (x + 1)²` klopt ook bij `x = −3`, waar `x + 1` negatief is. De gekwadrateerde vergelijking geeft dus `x = 2` of `x = −3`, en −3 voldoet niet aan een voorwaarde: die wordt doorgestreept. De enige oplossing is `x = 2`."],
    },
    "substitute": {
      name: "Substitueren",
      how: "Sleep de `y` van `y = …` op de `y` in de andere vergelijking: die wordt vervangen door waar `y` gelijk aan is. Nu staat er in die vergelijking alleen nog x: neem de x'en samen en los hem op.",
      text: ["`y = 2x` en `x + y = 9` zijn twee vergelijkingen over dezelfde x en y, die allebei tegelijk kloppen. Eén vergelijking met twee onbekenden heeft veel oplossingen; twee samen hebben er meestal maar één.", "`y = 2x` zegt dat y en 2x gelijk zijn, dus in de andere vergelijking mag je y vervangen door 2x. Dan houd je één vergelijking met één letter over, en die kun je al oplossen."],
    },
    "zero-power": {
      name: "Tot de macht 0",
      how: "Tik op de exponent 0: `x⁰` wordt 1. Tik daarna op de + om op te tellen.",
      text: ["`x³/x³` is 1 (als x niet 0 is), en het is ook `x^(3 − 3) = x⁰`. Elk getal behalve 0 tot de macht 0 is dus 1."],
    },
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
  predictPrompt: "Zie het in gedachten voor je: wat wordt het?",
  reveal: "Laat zien",
  predictedBeforeRight: "Deze zag je meteen de eerste keer goed.",
  predictedBeforeWrong: (picked: boolean) =>
    `Je eerste antwoord was ${picked ? "de rode" : "fout"}. De groene is goed.`,
  rightFirstTime: "In één keer goed. Los hem nu op.",
  revealedNote: "De groene is goed. Los hem nu op.",
  notQuite: "Net niet. De groene is goed. Los hem op, dan zie je waar het bij jou misging.",
  solvedBefore: "✓ Deze heb je al eens opgelost. Je mag hem nog een keer doen.",
  makeItLookLike: "Maak er dit van",
  solveFor: (letters: string[]) => `Los op naar ${letters.map((l) => `\`${l}\``).join(" en ")}.`,
  pickFirst: "Kies hierboven een antwoord en los het dan hier op.",
  hint: "Tip",
  nextStep: "Volgende stap",
  noNextStep: "Vanaf hier is geen stap te vinden: probeer ‘Ongedaan maken’ of ‘Opnieuw beginnen’.",
  undo: "Ongedaan maken",
  solvedBang: "Opgelost!",
  where: "waarbij",
  moveCrashed: "Er ging iets mis bij die zet.",
  moveCrashedDetails: "Probeer het nog eens, of begin deze oefening opnieuw.",
  pageCrashed: "Er ging iets mis op deze pagina.",
  pageCrashedDetails: "Probeer het nog eens, of ga terug naar het leerpad. Je voortgang is veilig.",
  tryAgain: "Probeer opnieuw",

  // Making a set
  ownTitle: "Je eigen oefeningen",
  ownIntro:
    "Stel een reeks oefeningen samen, bijvoorbeeld voor je leerlingen, en deel die als link. Bij elke oefening zien leerlingen het antwoord eerst in gedachten voor zich, en daarna lossen ze het met de hand op. Er wordt niets online opgeslagen: de hele reeks zit in de link.",
  upload: "Upload een .yaml-bestand",
  startFromExample: "Begin met het voorbeeld",
  yamlLabel: "De oefenreeks, in YAML",
  form: {
    asForm: "Formulier",
    asYaml: "YAML",
    viewLabel: "Schrijf de reeks als",
    title: "Titel",
    moves: "Toegestane zetten",
    allMoves: "Alle zetten",
    upTo: (n: number, title: string) => `Tot en met ${n}. ${title}`,
    start: (n: number) => `Oefening ${n}: start`,
    goal: (n: number) => `Oefening ${n}: doel`,
    remove: (n: number) => `Oefening ${n} verwijderen`,
    addOne: "Oefening toevoegen",
    fromChapter: "Oefeningen toevoegen uit ‘Oefenen’ bij een hoofdstuk",
    chapter: "Hoofdstuk",
    level: "Niveau",
    howMany: "Hoeveel",
    addMade: (n: number) => `${n} toevoegen`,
    making: "Ze worden gemaakt…",
    cantRead:
      "In de YAML van deze reeks zit een fout, dus het formulier kan hem niet tonen. Verbeter hem in de YAML-weergave, of begin met het voorbeeld.",
  },
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
    ` ${stars} meteen de eerste keer goed gezien. Zie bij elke oefening eerst het antwoord in gedachten voor je, en los het dan met de hand op.`,
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
    noValue: "De start heeft voor geen enkel getal een waarde (een deling door 0?).",
    twoWrong: "Bij `wrong:` horen twee foute antwoorden.",
    cantReadWrong: (w: string, err: string) => `Het foute antwoord "${w}" is niet te lezen: ${err}`,
    wrongShape: (w: string, why: string) => `Het foute antwoord "${w}" lijkt niet op het doel: ${why}.`,
    wrongIsRight: (w: string) => `Het foute antwoord "${w}" is eigenlijk goed.`,
    noDecoys:
      "Er konden geen overtuigende foute antwoorden worden gemaakt: voeg `wrong:` toe, of de oefening wordt opgelost zonder dat je eerst in gedachten een antwoord kiest.",
    decoysMade: (list: string) => `Gemaakte foute antwoorden om uit te kiezen: ${list}.`,
    shapeCount: "een ander aantal vergelijkingen",
    shapeRelation: "een uitdrukking waar een vergelijking wordt verwacht, of andersom",
    shapeIsolated: (letter: string) => `er staat niet wat ${letter} is`,
  },
};
