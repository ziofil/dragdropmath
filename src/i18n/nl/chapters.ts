import type { ChapterTexts } from "..";

export const nlChapters: ChapterTexts = {
  shuffle: {
    title: "Termen ordenen",
    blurb: "Termen mag je in elke volgorde optellen, en losse getallen kun je uitrekenen.",
    lesson: [
      {
        title: "De volgorde maakt niet uit",
        text: [
          "Bij optellen maakt de volgorde niet uit: de uitkomst blijft hetzelfde. `2 + x` en `x + 2` zijn gelijk.",
          "Elk deel van een som heet een term. Je kunt de termen in elke volgorde zetten door ze te slepen.",
        ],
        steps: ["Sleep de 2 achter de x."],
      },
      {
        title: "Elke term houdt zijn teken",
        text: ["In `5 − 3 + x` zijn de termen `5`, `−3` en `x`. Het minteken hoort bij de 3. Verplaats je de 3, dan gaat het minteken mee."],
        steps: ["Sleep de x naar voren. De 3 houdt zijn minteken."],
        watch: "`5 − 3` en `3 − 5` zijn niet hetzelfde. Verplaats je de 3, dan moet het minteken mee.",
      },
      {
        title: "Getallen optellen",
        text: [
          "Twee getallen in dezelfde som kun je bij elkaar optellen. Sleep het ene op het andere. De x is een getal dat we nog niet kennen, dus die blijft gewoon staan.",
        ],
        steps: ["Sleep de 4 op de 3."],
        after: "3 + 4 = 7. De x blijft gewoon staan.",
      },
      {
        title: "Vermenigvuldigen in elke volgorde",
        text: [
          "Ook bij vermenigvuldigen maakt de volgorde niet uit: `2·x·5` is `2·5·x`. Je kunt dus de 2 en de 5 met elkaar vermenigvuldigen. Dat geeft 10.",
          "Meestal zetten we het getal vooraan en laten we de maalpunt weg: `10·x` schrijf je als `10x`.",
        ],
        steps: ["Sleep de 5 op de 2."],
      },
    ],
  },

  collect: {
    title: "Gelijksoortige termen",
    blurb: "Termen met dezelfde letters kun je samennemen: 3x + 2x = 5x. Een term min zichzelf is 0.",
    lesson: [
      {
        title: "Wat 3x betekent",
        text: ["`3x` betekent `x + x + x`. Dus `3x + 2x` is drie keer x plus nog eens twee keer x: samen `5x`."],
        steps: ["Sleep de 2x op de 3x."],
      },
      {
        title: "Alleen gelijksoortige termen samennemen",
        text: [
          "Gelijksoortige termen hebben precies dezelfde letters. Alleen die kun je samennemen. `3x + 2` kan geen `5x` worden, want bij de `2` staat geen x. Losse getallen tel je alleen bij losse getallen op.",
        ],
        steps: ["De twee termen met x zijn gelijksoortig. Sleep de tweede x op de eerste."],
        after: "Bij de 4 staat geen x, dus die blijft gewoon staan.",
      },
      {
        title: "Verschillende letters tel je niet op",
        text: [
          "`x` en `y` kunnen voor verschillende getallen staan, dus `2x + 3y` kun je niet korter schrijven. Maar in `2x + 3y + x` kun je de twee x-termen wel samennemen.",
        ],
        steps: ["Sleep de x op de 2x. De 3y blijft staan."],
        after: "x-termen en y-termen blijven apart.",
      },
      {
        title: "Aftrekken",
        text: ["Aftrekken gaat net zo: `5y − 2y` is `3y`. Iets min zichzelf is 0, dus `a + b − a` is gewoon `b`."],
        steps: ["Sleep de −a op de a. Ze vallen tegen elkaar weg."],
        watch: "`x + x` is `2x`, niet `x²`. `x²` betekent `x·x`, en dat komt later.",
      },
    ],
  },

  distribute: {
    title: "Haakjes wegwerken",
    blurb: "Het getal voor de haakjes vermenigvuldig je met elke term tussen de haakjes. Een factor die in elke term zit, kun je weer buiten haakjes brengen.",
    lesson: [
      {
        title: "Elke term tussen de haakjes",
        text: [
          "`2(x + 3)` betekent 2 keer `(x + 3)`. Dat is 2 keer x plus 2 keer 3: `2x + 2·3`. Het getal voor de haakjes vermenigvuldig je met elke term ertussen.",
          "Denk aan een rechthoek van 2 hoog en `x + 3` breed. Verdeel hem in twee stukken: het ene heeft oppervlakte `2·x`, het andere `2·3`. Samen vormen ze de hele rechthoek.",
        ],
        steps: ["Sleep de 2 op de haakjes. Hij vermenigvuldigt beide termen.", "Sleep nu de 2 in 2·3 op de 3."],
      },
      {
        title: "Een minteken voor de haakjes",
        text: ["`−(x − 4)` betekent `−1` keer de haakjes. De −1 vermenigvuldigt elke term, dus alle tekens tussen de haakjes veranderen."],
        steps: ["Sleep het minteken op de haakjes."],
        watch: "Een veelgemaakte fout is `−(x − 4)` schrijven als `−x − 4`. Het minteken geldt ook voor de 4.",
      },
      {
        title: "Buiten haakjes brengen",
        text: ["Andersom heet dat ontbinden in factoren. Heeft elke term een factor 3, dan kun je de 3 buiten haakjes brengen: `3x + 3y = 3(x + y)`."],
        steps: ["Beide termen hebben een 3. Sleep één 3 naar voren, helemaal links voor de termen."],
        after: "Werk je de haakjes weer weg, dan krijg je 3x + 3y.",
      },
      {
        title: "x keer x",
        text: [
          "Soms wordt een letter met zichzelf vermenigvuldigd: `x(x + 2)` geeft `x·x`. Dat schrijven we als `x²` (x kwadraat). Een vierkant met zijden x heeft oppervlakte `x·x`.",
        ],
        steps: ["Sleep de x op de haakjes.", "Sleep de ene x op de andere."],
      },
    ],
  },

  brackets: {
    title: "Dubbele haakjes wegwerken",
    blurb: "Bij twee paar haakjes vermenigvuldig je elke term uit de eerste haakjes met elke term uit de tweede.",
    lesson: [
      {
        title: "Haakjes als één factor",
        text: [
          "In `(x + 1)(x + 2)` vermenigvuldigen de eerste haakjes alles wat tussen de tweede staat. Zie `(x + 1)` als één factor en werk de haakjes weg: hij vermenigvuldigt de `x` en de `2`.",
        ],
        steps: [
          "Sleep het hele stuk (x + 1) op (x + 2). Het vermenigvuldigt beide termen.",
          "Sleep nu de x op de (x + 1) ernaast.",
          "Sleep daarna de 2 op zijn (x + 1).",
        ],
        after: "Dat geeft vier termen: x·x, 1·x, 2·x en 2·1. Neem de gelijksoortige termen samen, dan krijg je x² + 3x + 2.",
      },
      {
        title: "Twee paar haakjes vermenigvuldigen",
        text: [
          "Vermenigvuldig elke term uit de eerste haakjes met elke term uit de tweede. Twee termen keer twee termen geeft vier termen. Neem daarna de gelijksoortige termen samen.",
          "In `(x + 3)(x − 3)` zijn de twee middelste termen `+3x` en `−3x`. Die vallen tegen elkaar weg, en er blijft `x² − 9` over.",
        ],
      },
      {
        title: "Haakjes in het kwadraat",
        text: ["`(x + 1)²` is `(x + 1)(x + 1)`, dus het werkt precies zo. Tik op de ² om het uit te schrijven."],
        steps: ["Tik op de ² om het als product te schrijven."],
        watch: "`(x + 1)²` is niet `x² + 1`. Probeer maar x = 2: `(2 + 1)² = 9`, maar `2² + 1 = 5`. Het verschil zit in de twee middelste termen, `x + x = 2x`.",
      },
    ],
  },

  balance: {
    title: "Vergelijkingen oplossen",
    blurb: "Doe aan beide kanten hetzelfde, dan blijft de vergelijking kloppen. Een term die naar de andere kant van het = gaat, doet daar het omgekeerde.",
    lesson: [
      {
        title: "Aan beide kanten hetzelfde",
        text: [
          "Een vergelijking zegt dat twee dingen gelijk zijn. Doe je aan beide kanten hetzelfde, dan blijven ze gelijk.",
          "Een term naar de andere kant van het `=` brengen doet precies dat. Bij `x + 3 = 10` haal je aan beide kanten 3 weg: `x = 10 − 3`. Daarom wordt `+3` aan de andere kant `−3`.",
        ],
        steps: ["Sleep de 3 naar de andere kant van het =. Het teken verandert.", "Sleep de −3 op de 10."],
      },
      {
        title: "Beide kanten delen",
        text: ["Wordt een hele kant met een getal vermenigvuldigd, dan ga je door dat getal delen als je het naar de andere kant brengt. Bij `2x = 8` deel je beide kanten door 2: `x = 8/2`."],
        steps: ["Sleep de 2 naar de andere kant van het =. Daar ga je erdoor delen.", "Sleep de 2 op de 8."],
      },
      {
        title: "Breuken en mintekens",
        text: [
          "Bij delen werkt het ook. Bij `x/3 = 4` vermenigvuldig je beide kanten met 3. De 3 uit de noemer gaat naar de andere kant en vermenigvuldigt daar.",
          "Ook een minteken voor een hele kant kan naar de overkant: `−x = 6` wordt `x = −6`.",
        ],
        steps: ["Sleep de 3 naar de andere kant van het =.", "Sleep de 4 op de 3."],
      },
      {
        title: "Terugrekenen in omgekeerde volgorde",
        text: [
          "In `3x + 1` wordt x eerst met 3 vermenigvuldigd en komt er daarna 1 bij. Om x alleen te krijgen, maak je dat in omgekeerde volgorde ongedaan: eerst gaat de 1 naar de overkant, dan de 3.",
        ],
        steps: ["Sleep de 1 naar de overkant.", "Reken het uit.", "Sleep de 3 naar de overkant.", "Reken het uit."],
        watch: "Controleer je antwoord door het in te vullen: 3·4 + 1 = 13. ✓",
      },
    ],
  },

  powers: {
    title: "Machten",
    blurb: "x³ betekent x·x·x. Tel de x'en, dan ontdek je zelf de rekenregels voor machten.",
    lesson: [
      {
        title: "Machten vermenigvuldigen",
        text: [
          "`x³` betekent `x·x·x`. Het kleine getal heet de exponent. Die vertelt hoeveel x'en er met elkaar worden vermenigvuldigd.",
          "Dus `x²·x³` is twee x'en keer drie x'en: vijf x'en in totaal. Vermenigvuldig je machten met hetzelfde grondtal, dan tel je de exponenten op.",
        ],
        steps: ["Hetzelfde grondtal: sleep de ene macht op de andere.", "Reken het uit."],
      },
      {
        title: "Macht van een macht",
        text: ["`(x²)³` is `x²·x²·x²`. Dat zijn 2 + 2 + 2 = 6 x'en, dus je vermenigvuldigt de exponenten."],
        steps: ["Sleep de buitenste 3 op de binnenste 2.", "Reken het uit."],
      },
      {
        title: "Machten delen",
        text: ["`x⁵/x²` heeft vijf x'en in de teller en twee in de noemer. Twee x'en vallen tegen elkaar weg, en er blijven er drie over in de teller. Bij delen trek je de exponenten dus van elkaar af."],
        steps: ["Sleep de x² op de x⁵.", "Reken het uit."],
      },
      {
        title: "Exponent nul en negatieve exponenten",
        text: [
          "`x³/x³` is 1, en het is ook `x^(3 − 3) = x⁰`. Alles tot de macht 0 is dus 1.",
          "Staan er meer x'en in de noemer dan in de teller, dan wordt de exponent negatief: `x⁻²` betekent `1/x²`. Breng je een macht naar de andere kant van de breukstreep, dan verandert het teken van de exponent.",
        ],
        steps: ["Sleep de x³ omhoog over de breukstreep."],
        watch: "`2x³` is `2·x·x·x`: de macht hoort alleen bij de x. `(2x)³` is iets anders: dat is `8x³`.",
      },
    ],
  },

  factor: {
    title: "Ontbinden in factoren",
    blurb: "Ontbinden is haakjes wegwerken, maar dan andersom. Zoek een factor die in elke term zit en breng die buiten haakjes.",
    lesson: [
      {
        title: "Haakjes wegwerken, maar andersom",
        text: [
          "Ontbinden maakt het wegwerken van haakjes ongedaan. `x² + 3x` is `x·x + 3·x`. Beide termen hebben een `x`, dus die kun je buiten haakjes brengen: `x(x + 3)`.",
        ],
        steps: ["Tik op de ² om x² helemaal uit te schrijven.", "Beide termen hebben nu een x. Sleep één x naar voren, helemaal links voor de termen."],
        after: "Controleer het: werk de haakjes van x(x + 3) weg. Je krijgt weer x² + 3x.",
      },
      {
        title: "Getallen splitsen",
        text: ["Om een gemeenschappelijke factor te vinden, splits je getallen in factoren. Tik in `2x + 6` op de 6, dan krijg je `2·3`. Nu hebben beide termen een 2."],
        steps: ["Tik op de 6 om hem te splitsen.", "Sleep een 2 naar voren."],
      },
      {
        title: "Haakjes als gemeenschappelijke factor",
        text: [
          "In `x(x + 2) + 3(x + 2)` hebben beide termen hetzelfde stuk tussen haakjes: `(x + 2)`. Dat is een gemeenschappelijke factor, dus je kunt het buiten haakjes brengen zoals elke andere factor.",
        ],
        steps: ["Sleep de (x + 2) naar voren."],
      },
      {
        title: "Vier termen: per twee",
        text: [
          "Bij vier termen ontbind je eerst de eerste twee en dan de laatste twee. Staat er daarna twee keer hetzelfde tussen haakjes, breng dat dan ook buiten haakjes.",
        ],
        watch: "Controleer een ontbinding altijd door de haakjes weer weg te werken. Dan moet je precies terugkrijgen waarmee je begon.",
      },
    ],
  },

  formulas: {
    title: "Formules omwerken",
    blurb: "Een formule is een vergelijking met meerdere letters. Met dezelfde zetten als bij x maak je één letter vrij.",
    lesson: [
      {
        title: "Een letter vrijmaken",
        text: [
          "`v = u + at` geeft een snelheid `v` uit een beginsnelheid `u`, een versnelling `a` en een tijd `t`. Als je de formule omwerkt, geeft hij juist de tijd: `t = (v − u)/a`.",
          "Eén letter alleen aan een kant krijgen heet die letter vrijmaken. Het gaat net als een vergelijking oplossen naar x. Doe gewoon alsof de andere letters getallen zijn.",
        ],
        steps: ["De t wordt met a vermenigvuldigd. Sleep eerst de u naar de overkant.", "Sleep nu de a naar de overkant. Daar ga je erdoor delen."],
        after: "Lees het van rechts naar links: t = (v − u)/a.",
      },
      {
        title: "Letters gaan net als getallen",
        text: [
          "Een letter die een hele kant vermenigvuldigt, kan naar de andere kant van het `=` en deelt daar, net zoals `2x = 8` werd tot `x = 8/2`. (Je kunt alleen delen door een letter die niet 0 is. In deze formules is dat nooit zo.)",
        ],
        steps: ["Sleep de m naar de overkant."],
        watch: "Alleen een factor van de hele kant mag naar de overkant. In `u + at` vermenigvuldigt de `a` alleen de `t`, dus breng eerst de `u` weg.",
      },
      {
        title: "Letters in de noemer",
        text: [
          "Is een hele kant een breuk, dan kan de letter in de noemer naar de andere kant en vermenigvuldigt hij daar, net zoals `x/3 = 4` werd tot `x = 4·3`.",
        ],
        steps: ["Sleep de A naar de overkant. Daar vermenigvuldigt hij."],
      },
      {
        title: "Als de letter twee keer voorkomt",
        text: [
          "In `ax + bx = c` komt x twee keer voor. Eén term verplaatsen is dan niet genoeg om x vrij te maken. Breng x eerst buiten haakjes. Daarna kan het stuk tussen haakjes waarmee x vermenigvuldigd wordt naar de overkant.",
        ],
        steps: ["Beide termen hebben een x. Sleep één x naar voren.", "Sleep nu het hele stuk (a + b) naar de overkant."],
      },
    ],
  },

  inequalities: {
    title: "Ongelijkheden",
    blurb: "Ongelijkheden los je op zoals vergelijkingen, met één verschil: vermenigvuldig of deel je door een negatief getal, dan klapt het teken om.",
    lesson: [
      {
        title: "Kleiner dan en groter dan",
        text: ["`x < 7` betekent: x is kleiner dan 7. De open kant van het teken wijst naar het grootste getal."],
        steps: ["Sleep net als bij een vergelijking de 2 naar de overkant.", "Reken het uit."],
      },
      {
        title: "De kanten omwisselen",
        text: [
          "`3 > x` en `x < 3` zeggen hetzelfde: x is kleiner dan 3. Je mag de twee kanten dus omwisselen, als je het teken ook omdraait.",
        ],
        steps: ["Sleep de 3 naar de andere kant. Het teken klapt om."],
      },
      {
        title: "Dezelfde zetten als bij vergelijkingen",
        text: ["Tel je aan beide kanten hetzelfde op of trek je het af, dan blijft het teken staan. Dat geldt ook als je beide kanten met een positief getal vermenigvuldigt of erdoor deelt."],
        steps: ["Sleep de 2 naar de overkant. Hij is positief, dus het teken blijft hetzelfde.", "Reken het uit."],
      },
      {
        title: "Een minteken laat het teken omklappen",
        text: ["Vermenigvuldigen met −1 draait de volgorde om: `2 < 3`, maar `−2 > −3`. Gaat er een minteken naar de overkant, dan klapt het teken dus om."],
        steps: ["Sleep alleen het minteken naar de overkant. De < klapt om."],
        after: "Controleer met een getal: x = 0 klopt bij −x < 4 en ook bij x > −4.",
        watch: "Alleen vermenigvuldigen of delen door een negatief getal laat het teken omklappen. Een term naar de overkant brengen doet dat nooit.",
      },
    ],
  },

  fractions: {
    title: "Breuken",
    blurb: "Om breuken op te tellen, maak je ze eerst gelijknamig. Teller en noemer met hetzelfde getal vermenigvuldigen verandert de waarde van een breuk niet.",
    lesson: [
      {
        title: "Breuken optellen",
        text: [
          "`3/4` betekent 3 vierde. Zijn de noemers gelijk, dan tel je gewoon de tellers op: 1 vijfde plus 2 vijfde is 3 vijfde, dus `1/5 + 2/5 = 3/5`.",
        ],
        steps: ["De noemers zijn gelijk. Sleep de ene breuk op de andere.", "Reken het uit."],
      },
      {
        title: "Gelijkwaardige breuken",
        text: [
          "Deel je teller en noemer door hetzelfde getal, dan verandert de waarde niet: `6/8 = 3/4`.",
          "Vermenigvuldig je teller en noemer met hetzelfde getal, dan verandert de waarde ook niet: `1/2 = 2/4 = 3/6`.",
        ],
        steps: ["Sleep de 8 op de 6. Ze worden allebei gedeeld door hun gemeenschappelijke factor, 2."],
      },
      {
        title: "Gelijknamig maken",
        text: [
          "Om `1/2 + 1/3` uit te rekenen, maak je er eerst allebei zesden van. Vermenigvuldig teller en noemer van `1/2` met 3, en teller en noemer van `1/3` met 2. Nu zijn beide noemers 6.",
        ],
        steps: ["Sleep de 3 van ⅓ op ½: teller en noemer worden met 3 vermenigvuldigd."],
        watch: "`1/2 + 1/3` is niet `2/5`. Tellers mag je alleen optellen als de noemers al gelijk zijn.",
      },
      {
        title: "Breuken vermenigvuldigen",
        text: ["Vermenigvuldigen is makkelijker: teller keer teller en noemer keer noemer. De helft van een derde is `(1·1)/(2·3) = 1/6`."],
        steps: ["Sleep de ene breuk op de andere."],
        after: "Deel daarna de gemeenschappelijke factoren van teller en noemer weg. Dan krijg je 3/2.",
      },
    ],
  },

  simultaneous: {
    title: "Stelsels van vergelijkingen",
    blurb: "Twee vergelijkingen met twee onbekenden, die allebei tegelijk kloppen. Maak in de ene vergelijking een letter vrij en vul die in de andere in.",
    lesson: [
      {
        title: "Twee vergelijkingen tegelijk",
        text: [
          "`y = 2x` en `x + y = 9` zijn twee vergelijkingen over dezelfde x en y. Eén vergelijking met twee onbekenden heeft heel veel oplossingen. Twee vergelijkingen samen hebben er meestal maar één.",
          "Om ze op te lossen, werk je één letter weg. Dan houd je één vergelijking met één onbekende over, en die kun je al oplossen.",
        ],
      },
      {
        title: "Substitueren",
        text: ["`y = 2x` zegt dat y en 2x gelijk zijn. In de andere vergelijking mag je y dus vervangen door 2x. Dat heet substitueren (invullen)."],
        steps: ["Sleep de y van y = 2x op de y in de andere vergelijking.", "Nu staat er alleen nog x in de vergelijking. Neem de x-termen samen."],
        after: "Los het op: x = 3. Vul daarna x = 3 in bij y = 2x om y te vinden.",
      },
      {
        title: "Een letter vrijmaken",
        text: [
          "Om te substitueren heb je een vergelijking nodig zoals `y = …` of `x = …`. Heb je die niet, maak er dan een: sleep in `x − y = 1` de −y naar de andere kant, dan krijg je `x = 1 + y`.",
        ],
        steps: ["Sleep in de tweede vergelijking de −y naar de andere kant van het =.", "Nu staat x alleen. Sleep hem op de x in de eerste vergelijking."],
        after: "Nu staat er in de eerste vergelijking alleen nog y: 2y + 1 = 7, dus y = 3.",
        watch: "Vul de hele uitdrukking in. Als x = 1 + y, dan is 2x gelijk aan 2(1 + y), niet aan 2 + y.",
      },
      {
        title: "De andere letter vinden",
        text: [
          "Weet je één letter, bijvoorbeeld `x = 3`, vul die dan in de andere vergelijking in om de andere letter te vinden. Sleep de x van `x = 3` op een x in de andere vergelijking.",
        ],
      },
    ],
  },

  roots: {
    title: "Wortels",
    blurb: "√x is x tot de macht ½, dus de rekenregels voor machten gelden ook voor wortels.",
    lesson: [
      {
        title: "Vierkantswortels",
        text: ["`√9` is het getal dat 9 oplevert als je het met zichzelf vermenigvuldigt. Dat is 3, want `3·3 = 9`."],
        steps: ["Tik op de 9 om hem in twee gelijke factoren te splitsen."],
        after: "Breng daarna één 3 buiten de wortel. Snap je hoe het werkt, dan kun je voortaan op een wortel zoals √9 tikken om hem in één stap uit te rekenen.",
      },
      {
        title: "Een wortel is een macht",
        text: [
          "`√x` is `x` tot de macht `½`. Dus `√x·√x = x^(1/2 + 1/2) = x`. Alle rekenregels voor machten gelden ook voor wortels.",
        ],
        steps: ["Tik erop: een macht ½ is een vierkantswortel."],
      },
      {
        title: "De wortel van een product",
        text: ["De wortel van een product is het product van de wortels: `√(4x) = √4·√x = 2√x`."],
        steps: ["Haal de 4 uit de wortel. Hij krijgt zijn eigen √."],
        after: "En √4 is 2, dus je krijgt 2√x.",
        watch: "Een wortel mag je niet over een som verdelen: `√(9 + 16)` is `√25 = 5`, niet `3 + 4`.",
      },
      {
        title: "Een wortel wegwerken",
        text: [
          "Om `√x = 3` op te lossen, kwadrateer je beide kanten. Tik op de wortel om hem als `x^(1/2)` te schrijven. Sleep dan de ½ naar de andere kant van het =. Daar wordt het een kwadraat.",
        ],
        steps: ["Tik op de wortel om hem als macht te schrijven.", "Sleep de ½ naar de andere kant van het =. Daar wordt het een kwadraat.", "Reken het uit."],
      },
    ],
  },

  explog: {
    title: "Exponenten en logaritmen",
    blurb: "ln(x) is de exponent die je op e moet zetten om x te krijgen. Dus ln en e^ heffen elkaar op, en de logaritme van een product is een som van logaritmen.",
    lesson: [
      {
        title: "Wat ln betekent",
        text: [
          "`e` is een bijzonder getal, ongeveer 2,718. `ln(x)` is de exponent die je op e moet zetten om x te krijgen. Dus `ln(e³) = 3`.",
          "ln en e^ heffen elkaar dus op: `e^(ln x) = x`.",
        ],
        steps: ["Sleep de e op de ln. Ze heffen elkaar op."],
      },
      {
        title: "De logaritme van een product",
        text: ["Vermenigvuldig je machten van e, dan tel je de exponenten op. Daarom is de logaritme van een product een som van logaritmen: `ln(2x) = ln(2) + ln(x)`."],
        steps: ["Haal de 2 uit de ln. Hij krijgt zijn eigen ln."],
      },
      {
        title: "De logaritme van een macht",
        text: ["`x³` is `x·x·x`, dus `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
        steps: ["Sleep de 3 naar voren, voor de ln."],
      },
      {
        title: "Oplossen met logaritmen",
        text: ["Om x uit een exponent te halen, neem je aan beide kanten de ln. Sleep in `e^x = 5` de e naar de andere kant van het =. Daar wordt het een ln: `x = ln(5)`."],
        steps: ["Sleep de e naar de andere kant van het =."],
      },
    ],
  },
};
