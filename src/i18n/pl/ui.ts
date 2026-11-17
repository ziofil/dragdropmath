import type { Translation } from "../en";

export const pl: Translation = {
  htmlLang: "pl",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
  language: "Język",

  // Top bar
  makeExercises: "Ułóż zadania",
  skin: "Motyw",
  skins: { modern: "Nowoczesny", codex: "Codex", paper: "Papier", blackboard: "Tablica" },
  settings: "Ustawienia",
  numbersInColour: "Kolorowe liczby",
  debugMode: "Tryb debugowania",
  sandboxInput: "Wyrażenie lub równanie",
  sandboxPlaceholder: "np. 3(x - 2) = 2x + 1   albo   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Wczytaj",
  debugOn: "Tryb debugowania jest włączony: dotknij, żeby go wyłączyć",

  // Home
  heroBefore: "Algebra, którą ",
  heroWord: "poczujesz",
  heroAfter: " w palcach.",
  heroText:
    "Przeciągnij dowolną część równania. Da się ją przesunąć tylko tak, jak pozwala matematyka. Przekształcaj je, aż dojdziesz do celu.",
  learningPath: "Ścieżka nauki",
  chapterNodeLabel: (n: number, title: string) => `Rozdział ${n}: ${title}`,
  chapterN: (n: number) => `Rozdział ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} i ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Najpierw warto znać: ${titles}.`,
  startLesson: "Zacznij lekcję →",

  // Chapter page
  backToPath: "← Ścieżka nauki",
  level: { easy: "Łatwe", medium: "Średnie", hard: "Trudne" },
  makingExercise: "Tworzę zadanie…",
  anotherOne: "Jeszcze jedno →",
  progressHere:
    "Twoje postępy są zapisane tylko w tej przeglądarce. Zapisz je do pliku, żeby ich nie stracić albo przenieść je na inne urządzenie.",
  saveProgress: "Zapisz postępy do pliku",
  loadProgress: "Wczytaj postępy z pliku",
  progressSaved: "Zapisano. Wczytaj ten plik tutaj albo w dowolnej przeglądarce, żeby odzyskać swoje postępy.",
  rightsReserved: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Wszelkie prawa zastrzeżone.`,
  aboutLink: "O stronie",
  about: {
    title: "O DragDropMath",
    sections: [
      {
        heading: "Co to jest",
        text: [
          "DragDropMath to algebra, którą robisz rękami. Przeciągasz dowolną część wyrażenia albo równania, a da się ją przesunąć tylko tak, jak pozwala matematyka. Błędny ruch po prostu się nie wykona, więc uczysz się, co wolno, czując to, a nie wkuwając reguły na pamięć.",
          "Ścieżka nauki prowadzi od porządkowania wyrazów aż do równań kwadratowych. Każdy rozdział ma lekcję, ćwiczenia na trzech poziomach i zadania „W myślach”, w których najpierw wyobrażasz sobie wynik, a dopiero potem go wyliczasz. Nauczyciele mogą układać własne zestawy zadań i udostępniać je jako link.",
        ],
      },
      {
        heading: "Kto to zrobił",
        text: [
          "DragDropMath tworzy Filippo Miatto, żeby algebrę dało się zobaczyć i dotknąć, a nie tylko zapamiętać jako listę reguł.",
        ],
      },
      {
        heading: "Twoja prywatność",
        text: [
          "Nie ma kont, reklam ani śledzenia. Twoje postępy są zapisane tylko w twojej przeglądarce i nic z tego, co robisz, nie jest nigdzie wysyłane. W Ustawieniach możesz zapisać je do pliku, żeby ich nie stracić albo przenieść je na inne urządzenie.",
          "Zestaw zadań mieści się w całości w swoim linku: nic na jego temat nie jest przechowywane w sieci.",
        ],
      },
    ],
  },
  progressNotABackup: "To nie jest plik z postępami DragDropMath.",
  progressReplace: (saved: string) =>
    `Postępy zapisane w tej przeglądarce zostaną zastąpione postępami z pliku${saved ? ` (zapisanego ${saved})` : ""}. Wczytać?`,
  progressLoadIt: "Wczytaj",
  cancel: "Anuluj",
  progressNoRoom: "Przeglądarka nie zdołała ich zapisać, więc nic się nie zmieniło.",
  progressBlocked:
    "Ta przeglądarka nic nie zapisuje dla tej strony (okno prywatne albo wyłączona pamięć), więc nie ma postępów do zapisania.",
  showMove: "Pokaż",
  lesson: "Lekcja",
  practice: "Ćwiczenia",
  predict: "W myślach",
  scores: "Punkty: „W myślach”",
  scoreOf: (n: number) => `${n} pkt`,
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) =>
    `${level}: masz teraz ${now} pkt${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  drills: {
    commute: {
      name: "Zmiana kolejności",
      how: "Przeciągnij wyraz za sąsiedni. Przy + i × kolejność nie ma znaczenia.",
      text: [
        "Kolejność dodawania nie zmienia sumy: `2 + x` i `x + 2` to to samo.",
        "Każdy składnik sumy nazywamy wyrazem. Wyraz przesuwa się razem ze swoim znakiem: w `5 − 3 + x` minus należy do 3.",
      ],
    },
    combine: {
      name: "Dodawanie liczb",
      how: "Upuść jedną liczbę na drugą, żeby je dodać.",
      text: ["Dwie liczby w tej samej sumie można do siebie dodać. Litera oznacza liczbę, której jeszcze nie znamy, więc zostaje bez zmian."],
    },
    "multiply-numbers": {
      name: "Mnożenie liczb",
      how: "Upuść liczbę na drugą liczbę, przez którą jest mnożona.",
      text: ["Przy mnożeniu kolejność też nie ma znaczenia: `2·x·5` to `2·5·x`. Dlatego 2 i 5 można pomnożyć i wychodzi `10x`."],
    },
    "numbers-first": {
      name: "Liczba na początek",
      how: "Dotknij iloczynu takiego jak `x·3`, żeby zapisać go tak jak zwykle: `3x`.",
      text: ["Liczbę piszemy na początku i pomijamy kropkę: `x·3` zapisujemy jako `3x`. To tak proste, że od teraz dzieje się samo."],
    },
    "multiply-out": {
      name: "Obliczanie iloczynu",
      how: "Dotknij iloczynu liczb, np. `2·3`, żeby go obliczyć.",
      text: ["Iloczyn samych liczb można obliczyć: `2·3` to 6."],
    },
    collect: {
      name: "Redukcja wyrazów podobnych",
      how: "Upuść wyraz na wyraz podobny, czyli z tymi samymi literami w tych samych potęgach. Dodają się.",
      text: [
        "`3x` oznacza `x + x + x`. Zatem `3x + 2x` to trzy iksy plus dwa iksy, czyli `5x`.",
        "Dodawać można tylko wyrazy podobne, czyli takie, które mają dokładnie te same litery w tych samych potęgach. `3x + 2` nie zamieni się w `5x`, wyrazy z x i wyrazy z y zostają osobno, tak samo jak `x²` i `3x`.",
      ],
    },
    "collect-cancel": {
      name: "Wyrazy przeciwne",
      how: "Upuść wyraz na wyraz do niego przeciwny. Znoszą się.",
      text: ["Z odejmowaniem jest tak samo: `5y − 2y` to `3y`. Cokolwiek minus to samo daje 0, więc `a + b − a` to po prostu `b`."],
    },
    distribute: {
      name: "Wymnażanie nawiasu",
      how: "Upuść liczbę sprzed nawiasu na nawias: mnoży każdy wyraz w środku. Potem dotknij ·, żeby obliczyć iloczyny liczb.",
      text: [
        "`2(x + 3)` to dwa razy `(x + 3)`: dwa razy x plus dwa razy 3, czyli `2x + 2·3`. Liczba przed nawiasem mnoży każdy wyraz w nawiasie.",
        "Wyobraź sobie prostokąt o wysokości 2 i szerokości `x + 3`. Jego dwie części mają pola `2·x` i `2·3`, a razem tworzą cały prostokąt.",
      ],
    },
    "distribute-neg": {
      name: "Minus przed nawiasem",
      how: "Upuść minus na nawias. Każdy znak w środku zmienia się na przeciwny.",
      text: ["`−(x − 4)` oznacza −1 razy nawias. −1 mnoży każdy wyraz, więc każdy znak w nawiasie zmienia się na przeciwny."],
    },
    "factor-out": {
      name: "Wyłączanie wspólnego czynnika",
      how: "Oba wyrazy mają wspólny czynnik. Naciśnij go i przytrzymaj w jednym z wyrazów, a potem wyciągnij go na sam początek, za lewy koniec.",
      text: [
        "Rozłożyć sumę na czynniki to zapisać ją w postaci iloczynu. W `3x + 3y` oba wyrazy to coś razy 3. Można więc zapisać 3 tylko raz, przed nawiasem, w którym zostaje to, co każdy wyraz ma oprócz niej: `3x + 3y = 3(x + y)`.",
        "To prawda, bo po wymnożeniu `3(x + y)` znowu dostajemy `3x + 3y`: 3 mnoży każdy wyraz w nawiasie. Właśnie tak sprawdza się rozkład na czynniki.",
      ],
    },
    "split-exponent": {
      name: "Rozbijanie wykładnika",
      how: "Wyciągnij wyraz z wykładnika. Potęga rozpada się na dwie potęgi o tej samej podstawie.",
      text: [
        "`2^(x + 3)` to iloczyn x + 3 dwójek: najpierw x dwójek, a potem jeszcze trzech. To więc `2^x·2^3`: suma w wykładniku zamienia się w iloczyn potęg.",
      ],
    },
    "merge-powers": {
      name: "Ta sama podstawa: dodaj wykładniki",
      how: "Upuść jedną potęgę na drugą albo dotknij · między nimi. Wykładniki się dodają: dotknij +, żeby je obliczyć.",
      text: [
        "`x³` oznacza `x·x·x`. Mała liczba, czyli wykładnik, mówi, ile jest iksów.",
        "Zatem `x²·x³` to dwa iksy razy trzy iksy: razem pięć iksów. Przy mnożeniu potęg o tej samej podstawie wykładniki się dodaje.",
      ],
    },
    "power-to-product": {
      name: "Kwadrat jako iloczyn",
      how: "Dotknij ², żeby zapisać nawias dwa razy. Potem wymnóż nawiasy i zredukuj wyrazy podobne.",
      text: ["`(x + 1)²` to `(x + 1)(x + 1)`, więc wymnaża się go tak samo."],
    },
    "move-term": {
      name: "Przenoszenie wyrazu",
      how: "Przenieś liczbę na drugą stronę =. Po drodze zmienia znak. Potem dotknij −, żeby obliczyć różnicę.",
      text: [
        "Równanie mówi, że dwie strony są równe. Jeśli z obiema stronami zrobisz to samo, dalej będą równe.",
        "Przeniesienie wyrazu na drugą stronę `=` robi właśnie to. Z `x + 3 = 10` odejmij 3 od obu stron: `x = 10 − 3`. Dlatego `+3` po drugiej stronie staje się `−3`.",
      ],
    },
    "move-factor": {
      name: "Dzielenie obu stron",
      how: "Przenieś liczbę sprzed litery na drugą stronę =. Dzieli drugą stronę. Potem dotknij kreski ułamkowej, żeby obliczyć ułamek.",
      text: ["Liczba, która mnoży całą stronę, po przeniesieniu dzieli drugą stronę. Z `2x = 8` podziel obie strony przez 2: `x = 8/2`."],
    },
    "move-denominator": {
      name: "Mnożenie obu stron",
      how: "Przenieś mianownik ułamka na drugą stronę =. Mnoży drugą stronę. Potem dotknij ·, żeby obliczyć iloczyn.",
      text: ["Mianownik ułamka po przeniesieniu na drugą stronę mnoży ją. Z `x/3 = 4` pomnóż obie strony przez 3: `x = 4·3`."],
    },
    "move-sign": {
      name: "Przenoszenie minusa",
      how: "Przenieś sam minus na drugą stronę =. Druga strona zmienia znak.",
      text: ["Minus przed całą stroną też można przenieść: obie strony mnożymy przez −1, więc `−x = 6` zmienia się w `x = −6`."],
    },
    "swap-sides": {
      name: "Zamiana stron",
      how: "Przeciągnij jedną stronę przez = i dalej, za drugi koniec. Strony zamieniają się miejscami.",
      text: ["`7 = x` i `x = 7` mówią to samo, więc strony mogą zamienić się miejscami."],
    },
    "evaluate-fraction": {
      name: "Obliczanie ułamka",
      how: "Dotknij kreski ułamkowej, żeby obliczyć ułamek.",
      text: ["Ułamek, który daje liczbę całkowitą, można obliczyć: `12/3` to 4."],
    },
    "divide-numbers": {
      name: "Skracanie ułamka",
      how: "Dotknij kreski ułamkowej. Licznik i mianownik dzielą się przez swój wspólny dzielnik.",
      text: ["Ułamek można skrócić, dzieląc licznik i mianownik przez tę samą liczbę: `6/8 = 3/4`. Jego wartość się nie zmienia."],
    },
    "letter-in": {
      name: "Litera razy nawias",
      how: "Upuść literę sprzed nawiasu na nawias. Potem połącz obie litery: `x·x` to `x²`.",
      text: [
        "Litera mnoży każdy wyraz w nawiasie, tak samo jak liczba: `x(x + 3) = x·x + x·3`. A `x·x` to potęga, `x²`, jak w rozdziale „Potęgi”.",
      ],
    },
    "factor-then-cancel": {
      name: "Wyłącz, a potem skróć",
      how: "Przytrzymaj liczbę w wyrazie z licznika i wyciągnij ją na początek, za lewy koniec. Potem dotknij kreski ułamkowej: czynnik się skraca.",
      text: [
        "Skrócić można tylko czynnik całego licznika. W `(2x + 6)/2` dwójka jest czynnikiem każdego wyrazu, więc najpierw wyłącz ją przed nawias: `(2(x + 3))/2`. Teraz jest czynnikiem całego licznika i skraca się z mianownikiem.",
      ],
    },
    "cancel-factor": {
      name: "Skracanie wspólnego czynnika",
      how: "Dotknij kreski ułamkowej. To, co licznik i mianownik mają wspólne, się skraca.",
      text: ["Liczba, która mnoży cały licznik i cały mianownik, się skraca: `(3x)/3` to `x`. W `(3x + 1)/3` już nie: tam 3 mnoży tylko część licznika."],
    },
    "power-of-power": {
      name: "Potęga potęgi",
      how: "Upuść zewnętrzny wykładnik na wewnętrzny. Mnożą się: dotknij ·, żeby obliczyć iloczyn.",
      text: ["`(x²)³` to `x²·x²·x²`. To 2 + 2 + 2 = 6 iksów, więc wykładniki się mnożą."],
    },
    "divide-powers": {
      name: "Ta sama podstawa: odejmij wykładniki",
      how: "Dotknij kreski ułamkowej. Potęgi o tej samej podstawie łączą się, a ich wykładniki się odejmują: dotknij −, żeby obliczyć różnicę.",
      text: [
        "W `x⁵/x²` jest pięć iksów w liczniku i dwa w mianowniku. Dwa iksy z licznika skracają się z dwoma z mianownika i w liczniku zostają trzy: przy dzieleniu wykładniki się odejmuje.",
      ],
    },
    "flip-across-bar": {
      name: "Przez kreskę ułamkową",
      how: "Przeciągnij potęgę w górę przez kreskę ułamkową. Jej wykładnik zmienia znak.",
      text: [
        "Gdy w mianowniku jest więcej iksów, wykładnik schodzi poniżej zera: `x⁻²` oznacza `1/x²`. Przeniesienie potęgi przez kreskę ułamkową zmienia znak jej wykładnika.",
      ],
    },
    "power-one": {
      name: "Wykładnik 1",
      how: "Upuść wykładnik 1 na jego podstawę.",
      text: ["`x¹` to jeden x, czyli po prostu `x`. To tak proste, że od teraz dzieje się samo."],
    },
    "zero-power": {
      name: "Wykładnik 0",
      how: "Naciśnij i przytrzymaj wykładnik 0, a potem upuść go na jego podstawę. Potem dotknij +, żeby dodać.",
      text: ["`x³/x³` to 1 (gdy x jest różne od 0), ale to także `x^(3 − 3) = x⁰`. Dlatego każda liczba (różna od zera) do potęgi 0 daje 1."],
    },
    "tap-power": {
      name: "Obliczanie potęgi",
      how: "Dotknij wykładnika, żeby obliczyć potęgę: `2³` zmienia się w 8.",
      text: ["Potęgę liczby można obliczyć: `2³` to `2·2·2 = 8`."],
    },
    "power-of-product": {
      name: "Wykładnik do nawiasu",
      how: "Przeciągnij wykładnik do nawiasu: każdy czynnik w środku dostaje swój własny. Potem dotknij wykładnika przy liczbie, żeby obliczyć potęgę.",
      text: ["`(2x)³` to `2x·2x·2x`, czyli `2³·x³`. Każdy czynnik w nawiasie dostaje wykładnik."],
    },
    "split-number": {
      name: "Rozkład liczby",
      how: "Dotknij liczby, żeby rozłożyć ją na dwa czynniki. Potem wyciągnij czynnik wspólny dla obu wyrazów na początek, za lewy koniec.",
      text: ["Żeby znaleźć wspólny czynnik, rozkładaj liczby na czynniki. W `2x + 6` liczba 6 to `2·3` i teraz oba wyrazy mają 2."],
    },
    "split-term": {
      name: "Rozbijanie środkowego wyrazu",
      how: "Dotknij środkowego wyrazu. Rozpada się na dwa i można już rozkładać parami.",
      text: [
        "Żeby rozłożyć `x² + 5x + 6`, szukamy dwóch liczb, które w sumie dają 5, a w iloczynie 6: to 2 i 3. Zapisz `5x` jako `2x + 3x`.",
        "Teraz są cztery wyrazy i rozkładają się parami: `x(x + 2) + 3(x + 2)`, a potem `(x + 2)(x + 3)`.",
      ],
    },
    "difference-of-squares": {
      name: "Różnica kwadratów",
      how: "Dotknij minusa między dwoma kwadratami.",
      text: [
        "Kwadrat minus kwadrat zawsze rozkłada się tak samo: `a² − b² = (a − b)(a + b)`. Wymnóż, żeby sprawdzić: środkowe wyrazy się redukują.",
        "Działa to tylko dla różnicy: kwadrat minus kwadrat. Sumy dwóch kwadratów, jak `x² + 9`, w ogóle nie da się rozłożyć na czynniki. Kwadrat minus liczba, która nie jest kwadratem liczby całkowitej, jak `x² − 7`, rozkłada się, ale z pierwiastkami: `(x − √7)(x + √7)`.",
      ],
    },
    "factor-shared": {
      name: "Grupowanie wyrazów",
      how: "Naciśnij i przytrzymaj `x` jednego wyrazu, a potem upuść go na inny wyraz z `x`: wychodzi przed nawias z obu naraz. Potem wyłącz to, co mają wspólne dwa ostatnie wyrazy (często liczbę), a na koniec nawias wspólny dla obu iloczynów.",
      text: [
        "Gdy są cztery wyrazy, pracuj parami. Wyłącz wspólny czynnik z dwóch pierwszych wyrazów, a potem z dwóch ostatnich. Jeśli nawiasy wyjdą takie same, wyłącz przed nawias również ten nawias.",
      ],
    },
    "move-letter-factor": {
      name: "Dzielenie przez literę",
      how: "Przenieś jedną z mnożonych liter na drugą stronę =. Dzieli drugą stronę.",
      text: [
        "Wzór to równanie z kilkoma literami. Wyznaczanie jednej litery ze wzoru działa tak jak rozwiązywanie równania z x: pozostałe litery traktuj jak liczby.",
        "Litera, która mnoży całą stronę, może przejść na drugą stronę i ją podzielić: z `F = ma` dostajemy `F/m = a`. (Dzielić wolno tylko przez literę różną od 0: tutaj zakładamy, że taka jest.)",
        "Gdy szukana litera występuje w dwóch miejscach, jak w `ax + bx = c`, najpierw wyłącz ją przed nawias: `x(a + b) = c`. Wtedy cały nawias może przejść na drugą stronę (o ile `a + b` nie jest równe 0).",
      ],
    },
    "move-letter-denominator": {
      name: "Mnożenie przez literę",
      how: "Przenieś literę z mianownika na drugą stronę =. Mnoży drugą stronę.",
      text: ["Litera w mianowniku całej strony może przejść na drugą stronę i ją pomnożyć: z `P = F/A` dostajemy `PA = F`."],
    },
    "ineq-move-term": {
      name: "Przenoszenie wyrazu",
      how: "Przenieś liczbę na drugą stronę znaku nierówności. Liczba zmienia znak, a zwrot nierówności zostaje ten sam. Potem dotknij −, żeby obliczyć różnicę.",
      text: [
        "`x < 7` mówi, że x jest mniejsze od 7. Znak nierówności otwiera się w stronę większej liczby.",
        "Dodanie lub odjęcie tego samego po obu stronach nie zmienia zwrotu nierówności. Wyraz przenosi się więc tak samo jak w równaniu.",
      ],
    },
    "ineq-swap": {
      name: "Zamiana stron",
      how: "Przeciągnij jedną stronę za drugą. Znak nierówności odwraca się razem z nimi.",
      text: [
        "`3 > x` i `x < 3` mówią to samo: x jest mniejsze od 3. Strony mogą się więc zamienić, o ile znak nierówności odwróci się razem z nimi.",
      ],
    },
    "ineq-sign": {
      name: "Przenoszenie minusa",
      how: "Przenieś na drugą stronę sam minus. Nierówność zmienia zwrot.",
      text: ["Mnożenie przez −1 odwraca kolejność: `2 < 3`, ale `−2 > −3`. Dlatego gdy minus przechodzi na drugą stronę, nierówność zmienia zwrot."],
    },
    "add-fractions": {
      name: "Dodawanie ułamków",
      how: "Mianowniki są takie same: upuść jeden ułamek na drugi albo dotknij + między nimi. Potem dotknij + w liczniku, żeby dodać liczniki.",
      text: [
        "`3/4` to trzy czwarte. Gdy mianowniki są takie same, wystarczy dodać liczniki: jedna piąta plus dwie piąte to trzy piąte, więc `1/5 + 2/5 = 3/5`.",
      ],
    },
    "expand-fraction": {
      name: "Wspólny mianownik",
      how: "Naciśnij i przytrzymaj mianownik jednego ułamka, upuść go na drugi ułamek, a potem zrób to samo w drugą stronę: teraz oba mają ten sam mianownik. Dotknij każdej kropki ·, żeby obliczyć liczniki i mianowniki, a potem dodaj ułamki.",
      text: [
        "Pomnożenie licznika i mianownika przez tę samą liczbę nie zmienia ułamka: `1/2 = 2/4 = 3/6`.",
        "Tak właśnie sprowadza się ułamki do wspólnego mianownika. Żeby dodać `1/2 + 1/3`, pomnóż licznik i mianownik `1/2` przez 3, a `1/3` przez 2: teraz oba ułamki to szóste części.",
      ],
    },
    "multiply-fractions": {
      name: "Mnożenie ułamków",
      how: "Dotknij · między ułamkami albo upuść jeden na drugi: liczniki się mnożą, mianowniki też.",
      text: ["Mnożenie jest prostsze: mnożymy liczniki i mnożymy mianowniki. Połowa jednej trzeciej to `(1·1)/(2·3) = 1/6`."],
    },
    "divide-by-fraction": {
      name: "Dzielenie przez ułamek",
      how: "Przeciągnij mianownik dolnego ułamka w górę, do licznika: mnoży licznik. Potem dotknij · i kreski ułamkowej, żeby to obliczyć.",
      text: [
        "To, co robi liczba, zależy od tego, pod iloma kreskami ułamkowymi stoi. W `4/(3/5)` piątka jest pod dwiema kreskami: dzieli przez dzielenie, czyli mnoży. Dlatego można ją przenieść w górę, do licznika, i wartość się nie zmieni: `(4·5)/3`.",
        "Właśnie dlatego dzielenie przez ułamek to mnożenie przez jego odwrotność: `4/(3/5) = 4·5/3`.",
      ],
    },
    rationalise: {
      name: "Usuwanie niewymierności z mianownika",
      how: "Przeciągnij pierwiastek z mianownika w górę, do licznika: licznik i mianownik mnożą się przez niego. Potem dotknij · w mianowniku.",
      text: [
        "Pomnożenie licznika i mianownika przez tę samą liczbę nie zmienia wartości ułamka. Wybierz pierwiastek, który już stoi w mianowniku: `√3·√3 = 3`, więc `1/√3 = √3/(√3·√3) = √3/3`. Teraz pod kreską ułamkową nie ma już pierwiastka.",
      ],
    },
    "zero-product": {
      name: "Iloczyn równy 0",
      how: "Ściągnij jeden nawias w dół, poza iloczyn: równanie rozpada się na dwa, ten nawias jest równy 0 albo drugi. Potem rozwiąż każde z nich.",
      text: [
        "Iloczyn jest równy 0 tylko wtedy, gdy któryś z czynników jest równy 0: `3·0 = 0`, ale `3·2` już nie. Zatem `(x − 2)(x + 3) = 0` oznacza, że `x − 2 = 0` lub `x + 3 = 0`: są dwa rozwiązania.",
        "Dlatego nigdy nie dzielimy obu stron przez coś, co może być zerem: tutaj zgubilibyśmy jedno rozwiązanie.",
      ],
    },
    "plus-minus": {
      name: "Dwa pierwiastki kwadratowe",
      how: "Przeciągnij dwójkę na drugą stronę =. Liczba ma dwa pierwiastki kwadratowe: równanie rozpada się na dwa, jedno z +, drugie z −.",
      text: [
        "`3² = 9`, ale też `(−3)² = 9`. Zatem `x² = 9` oznacza, że `x = 3` lub `x = −3`. Kto zapomni o minusie, gubi jedno rozwiązanie.",
      ],
    },
    "take-out-then-split": {
      name: "Wyłącz literę, a potem rozbij",
      how: "Przytrzymaj literę w jednym wyrazie i wyciągnij ją na początek, za lewy koniec. Potem ściągnij ją w dół, poza iloczyn.",
      text: [
        "Gdy nie ma wyrazu wolnego, w każdym wyrazie jest x: wyłącz je przed nawias, `x² − 3x = x(x − 3)`. Teraz to iloczyn równy 0, więc `x = 0` lub `x − 3 = 0`.",
      ],
    },
    "split-middle": {
      name: "Rozłóż na czynniki, a potem rozbij",
      how: "Dotknij środkowego wyrazu: rozbija się na dwa. Z każdej pary wyłącz wspólny czynnik, a potem wspólny nawias. Na koniec ściągnij jeden nawias w dół, poza iloczyn.",
      text: [
        "`x² + x − 6` to iloczyn dwóch nawiasów: `(x + 3)(x − 2)`. Te dwie liczby dają w iloczynie `−6`, a w sumie `1`, czyli współczynnik przy x. Gdy mamy iloczyn równy 0, każdy nawias daje jedno rozwiązanie.",
      ],
    },
    "square-both-sides": {
      name: "Podnoszenie obu stron do kwadratu",
      how: "Przeciągnij pierwiastek na drugą stronę =: druga strona zostaje podniesiona do kwadratu. Potem wymnóż i rozwiąż. Pod spodem są założenia: rozwiązanie, które któregoś z nich nie spełnia, zostaje skreślone.",
      text: [
        "Pierwiastek nigdy nie jest ujemny, więc `√(x² + 5) = x + 1` może zachodzić tylko wtedy, gdy `x + 1 ≥ 0`. Po podniesieniu obu stron do kwadratu ta informacja ginie: `x² + 5 = (x + 1)²` byłoby prawdziwe także wtedy, gdyby `x + 1` było ujemne. Dlatego założenia podaje się na początku i obowiązują przez całe rozwiązanie.",
      ],
    },
    "split-fraction": {
      name: "Rozbijanie ułamka",
      how: "Wyciągnij wyraz z licznika. Zabiera ze sobą kopię mianownika.",
      text: [
        "Ułamek z sumą w liczniku można rozbić na osobny ułamek dla każdego wyrazu, wszystkie o tym samym mianowniku: `(x + 5)/6 = x/6 + 5/6`.",
      ],
    },
    "times-one": {
      name: "Razy 1",
      how: "Naciśnij i przytrzymaj 1, a potem upuść ją na to, co mnoży.",
      text: ["Mnożenie przez 1 niczego nie zmienia: `1·x` to po prostu `x`. To tak proste, że od teraz dzieje się samo."],
    },
    substitute: {
      name: "Podstawianie",
      how: "Przeciągnij `y` z `y = …` na `y` w drugim równaniu: w jego miejsce wchodzi to, ile wynosi `y`. Potem wyznacz x i wstaw je do pierwszego równania, żeby obliczyć y.",
      text: [
        "`y = 2x` i `x + y = 9` to dwa równania o tych samych x i y, prawdziwe jednocześnie. Jedno równanie z dwiema niewiadomymi ma wiele rozwiązań, a dwa razem zwykle tylko jedno.",
        "`y = 2x` mówi, że y i 2x są równe, więc w drugim równaniu można zastąpić y przez 2x. Zostaje jedno równanie z jedną literą, a takie już umiesz rozwiązać.",
        "Jeśli w żadnym równaniu litera nie stoi sama, najpierw ją wyznacz: w `x − y = 1` przenieś −y na drugą stronę i dostaniesz `x = 1 + y`.",
      ],
    },
    "evaluate-root": {
      name: "Obliczanie pierwiastka",
      how: "Dotknij pierwiastka, żeby go obliczyć.",
      text: ["`√9` to liczba dodatnia, która pomnożona przez siebie daje 9: to 3, bo `3·3 = 9` (−3 też, ale √ oznacza tę dodatnią). Tak samo `∛8 = 2`, bo `2·2·2 = 8`."],
    },
    "split-square": {
      name: "Rozkład pod pierwiastkiem",
      how: "Dotknij liczby pod pierwiastkiem: wydziela się z niej kwadrat (a pod pierwiastkiem sześciennym sześcian). Potem wyciągnij go spod pierwiastka i dotknij jego pierwiastka, żeby go obliczyć.",
      text: [
        "Pierwiastek, który nie wychodzi całkowity, nadal można uprościć. Rozłóż liczbę pod nim na czynniki tak, żeby wydzielić kwadrat: `√12 = √(4·3)`.",
      ],
    },
    "join-powers": {
      name: "Łączenie pierwiastków",
      how: "Upuść jeden pierwiastek na drugi. Trafiają pod jeden znak pierwiastka.",
      text: [
        "`√2·√3` podniesione do kwadratu daje `2·3`, więc `√2·√3` to liczba dodatnia, której kwadrat wynosi 6: `√(2·3) = √6`. Dwa pierwiastki tego samego stopnia łączą się pod jednym.",
        "Tak samo jest z każdym wspólnym wykładnikiem: `x³y³` to xxx·yyy, czyli xy·xy·xy, a więc `(xy)³`.",
      ],
    },
    "pull-out-of-power": {
      name: "Rozbijanie pierwiastka",
      how: "Wyciągnij liczbę spod pierwiastka: dostaje swój własny pierwiastek. Potem dotknij tego pierwiastka, żeby go obliczyć.",
      text: ["Pierwiastek z iloczynu to iloczyn pierwiastków: `√(4x) = √4·√x = 2√x`."],
    },
    "root-notation": {
      name: "Pierwiastek jako potęga",
      how: "Dotknij pierwiastka, żeby zapisać go jako potęgę: √ to potęga o wykładniku ½, a ∛ o wykładniku ⅓.",
      text: [
        "Każdy pierwiastek jest potęgą: `√x = x^(1/2)`, `∛x = x^(1/3)`, a pierwiastek stopnia n z x to `x^(1/n)`. Dlatego wszystkie prawa działań na potęgach działają też dla pierwiastków: `√x·√x = x^(1/2 + 1/2) = x`.",
      ],
    },
    "root-of-power": {
      name: "Pierwiastek z potęgi",
      how: "Dotknij pierwiastka, żeby zapisać go jako potęgę. Potem upuść zewnętrzny wykładnik na wewnętrzny i oblicz iloczyn.",
      text: [
        "Pierwiastek to potęga, więc pierwiastek z potęgi to potęga potęgi: `∛(x⁶) = (x⁶)^(1/3) = x^(6·1/3) = x²`. Wykładniki się mnożą, jak w rozdziale „Potęgi”.",
      ],
    },
    "fraction-power": {
      name: "Pierwiastki i potęgi razem",
      how: "Upuść pierwiastek na potęgę: wykładniki się dodają. Potem zamień liczbę całkowitą na połówki: upuść na nią mianownik ułamka ½ i dotknij ·, żeby to obliczyć. Następnie dodaj ułamki i dotknij + w liczniku.",
      text: [
        "`√x` to `x^(1/2)`, więc `√x·x² = x^(1/2 + 2) = x^(5/2)`. Wykładnik ułamkowy działa jak każdy inny: przy mnożeniu potęg wykładniki się dodaje.",
      ],
    },
    "root-across": {
      name: "Potęga pierwiastka na drugą stronę =",
      how: "Przenieś ½ (albo ⅓, albo ¼) na drugą stronę =. Tam zmienia się w kwadrat (albo sześcian, albo czwartą potęgę). Potem dotknij wykładnika, żeby obliczyć potęgę.",
      text: [
        "Żeby rozwiązać `√x = 3`, podnieś obie strony do kwadratu. Gdy zapiszesz to jako potęgę, `x^(1/2) = 3`, ½ przechodzi na drugą stronę i staje się kwadratem: `x = 3²`.",
      ],
    },
    "exp-of-log": {
      name: "Potęga znosi logarytm",
      how: "Upuść podstawę na logarytm w jej wykładniku. Znoszą się nawzajem.",
      text: [
        "`e` to szczególna liczba, około 2,718. `ln(x)` to wykładnik, do którego trzeba podnieść e, żeby dostać x, więc ln i e^ znoszą się nawzajem: `e^(ln x) = x`. Logarytmy o innych podstawach działają tak samo: `2^(log₂ x) = x`.",
      ],
    },
    "evaluate-log": {
      name: "Znane logarytmy",
      how: "Dotknij logarytmu, żeby go obliczyć: `ln(e) = 1`, a logarytm z 1 to 0.",
      text: ["`ln(e) = 1`, bo `e¹ = e`. A logarytm z 1 to 0, bo `e⁰ = 1`."],
    },
    "power-of-base": {
      name: "Potęga podstawy",
      how: "Dotknij liczby w logarytmie, żeby zapisać ją jako potęgę 2. Potem przeciągnij wykładnik przed logarytm i dotknij logarytmu.",
      text: ["Żeby obliczyć `log₂(8)`, zapisz 8 jako potęgę 2: `8 = 2³`, więc `log₂(8) = 3`."],
    },
    "log-of-product": {
      name: "Rozbijanie logarytmu",
      how: "Wyciągnij liczbę spod logarytmu. Dostaje swój własny logarytm.",
      text: ["Przy mnożeniu potęg wykładniki się dodaje. Dlatego logarytm iloczynu to suma logarytmów: `ln(2x) = ln(2) + ln(x)`."],
    },
    "log-of-root": {
      name: "Logarytm z pierwiastka",
      how: "Dotknij pierwiastka, żeby zapisać go jako potęgę. Potem przeciągnij wykładnik przed logarytm.",
      text: ["Pierwiastek to potęga, `√x = x^(1/2)`, więc jego wykładnik wychodzi przed logarytm jak każdy inny: `ln(√x) = ½ln(x)`."],
    },
    "log-of-power": {
      name: "Wykładnik przed logarytm",
      how: "Przeciągnij wykładnik przed logarytm.",
      text: ["`x³` to `x·x·x`, więc `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
    },
    "power-into-log": {
      name: "Liczba pod logarytm",
      how: "Upuść liczbę sprzed logarytmu na logarytm. Pod logarytmem staje się wykładnikiem.",
      text: ["W drugą stronę: `3ln(x)` to `ln(x³)`."],
    },
    "combine-logs": {
      name: "Łączenie logarytmów",
      how: "Upuść jeden logarytm na drugi albo dotknij + (lub −) między nimi. Przy dodawaniu liczby pod logarytmem się mnożą, przy odejmowaniu dzielą.",
      text: ["To też działa w drugą stronę: `ln(a) + ln(b) = ln(ab)`, a `ln(a) − ln(b) = ln(a/b)`."],
    },
    "move-exponent-term": {
      name: "Między wykładnikami",
      how: "Obie strony są potęgami o tej samej podstawie. Przeciągnij wyraz z jednego wykładnika do drugiego: zmienia znak.",
      text: [
        "Gdy obie strony są potęgami o tej samej podstawie, ich wykładniki są równe, więc można je przekształcać jak dwie strony równania.",
        "`2^(x − 3) = 2^4` zmienia się w `2^x = 2^(4 + 3)`: obie strony pomnożono przez `2^3`.",
      ],
    },
    "exp-across": {
      name: "Podstawa na drugą stronę =",
      how: "Przenieś podstawę na drugą stronę =. Tam zmienia się w logarytm.",
      text: ["Żeby wydostać x z wykładnika, zlogarytmuj obie strony. Z `e^x = 5` e przechodzi na drugą stronę i staje się logarytmem ln: `x = ln(5)`."],
    },
    "log-across": {
      name: "Logarytm na drugą stronę =",
      how: "Przenieś logarytm na drugą stronę =. Tam zmienia się w potęgę. Jeśli to potęga liczby, dotknij jej wykładnika, żeby ją obliczyć.",
      text: ["Logarytm znosi potęga. Z `ln(x) = 2` ln przechodzi na drugą stronę i staje się potęgą e: `x = e²`."],
    },
    "bracket-times-bracket": {
      name: "Nawias razy nawias",
      how: "Upuść jeden nawias na drugi: mnoży oba wyrazy w środku. Potem tak samo wymnóż każdy nawias i zredukuj wyrazy podobne.",
      text: [
        "W `(x + 1)(x + 2)` pierwszy nawias jest jednym czynnikiem: mnoży cały drugi nawias, czyli i x, i 2. Potem po kolei wymnażamy każde `(x + 1)`.",
        "Dwa wyrazy razy dwa wyrazy dają cztery wyrazy. Na koniec redukujemy wyrazy podobne: `(x + 1)(x + 2) = x² + 3x + 2`.",
      ],
    },
    "bracket-out": {
      name: "Wyłączanie nawiasu",
      how: "Oba wyrazy mają ten sam nawias. Naciśnij go i przytrzymaj w jednym z wyrazów, a potem wyciągnij go na sam początek, za lewy koniec.",
      text: [
        "Cały nawias też może być wspólnym czynnikiem. W `x(x + 2) + 3(x + 2)` oba wyrazy mają `(x + 2)`, więc wychodzi on przed nawias jak każdy inny czynnik: `(x + 2)(x + 3)`.",
      ],
    },
    "ineq-move-factor": {
      name: "Dzielenie obu stron",
      how: "Przenieś liczbę sprzed litery na drugą stronę znaku nierówności. Dzieli drugą stronę, a zwrot nierówności zostaje ten sam. Potem dotknij kreski ułamkowej.",
      text: ["Mnożenie lub dzielenie obu stron przez liczbę dodatnią też nie zmienia zwrotu nierówności: z `2x < 8` dostajemy `x < 8/2`."],
    },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Zadanie ${label}${solved ? " — rozwiązane" : ""}`,

  // Guided example
  done: "Gotowe.",
  startOver: "Od początku",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: lekcja`,
  nextExercise: "Następne zadanie →",
  exercisesNav: "Zadania",
  previousTitle: (label: string) => `Poprzednie: zadanie ${label}`,
  previousLabel: (label: string) => `Poprzednie zadanie (${label})`,
  nextTitle: (label: string) => `Następne: zadanie ${label}`,
  nextLabel: (label: string) => `Następne zadanie (${label})`,
  exerciseN: (label: string) => `Zadanie ${label}`,
  predictPrompt: "Najpierw w myślach: co z tego wyjdzie?",
  reveal: "Pokaż odpowiedź",
  predictedBeforeRight: "Tu twoja pierwsza odpowiedź była od razu dobra.",
  predictedBeforeWrong: (picked: boolean) =>
    `${picked ? "Twoja pierwsza odpowiedź to ta czerwona" : "Twoja pierwsza odpowiedź była błędna"}. Dobra jest ta zielona.`,
  rightFirstTime: "Dobrze za pierwszym razem. Teraz to rozwiąż.",
  revealedNote: "Dobra jest ta zielona. Teraz to rozwiąż.",
  notQuite: "Niezupełnie. Dobra jest ta zielona. Rozwiąż zadanie, a zobaczysz, gdzie był błąd.",
  solvedBefore: "✓ To zadanie jest już rozwiązane. Możesz rozwiązać je jeszcze raz.",
  makeItLookLike: "Doprowadź do postaci",
  solveFor: (letters: string[]) => `Wyznacz ${letters.map((l) => `\`${l}\``).join(" i ")}.`,
  pickFirst: "Wybierz odpowiedź powyżej, a potem rozwiąż zadanie tutaj.",
  hint: "Podpowiedź",
  nextStep: "Następny krok",
  noNextStep: "Nie udało się stąd znaleźć kroku: spróbuj „Cofnij” albo „Od początku”.",
  undo: "Cofnij",
  solvedBang: "Rozwiązane!",
  where: "dla",
  moveCrashed: "Coś poszło nie tak przy tym ruchu.",
  moveCrashedDetails: "Spróbuj jeszcze raz albo zacznij to zadanie od początku.",
  pageCrashed: "Coś poszło nie tak na tej stronie.",
  pageCrashedDetails: "Spróbuj jeszcze raz albo wróć do ścieżki nauki. Twoje postępy są bezpieczne.",
  tryAgain: "Spróbuj jeszcze raz",

  // Making a set
  ownTitle: "Twoje własne zadania",
  ownIntro:
    "Ułóż zestaw zadań, na przykład dla swoich uczniów, i udostępnij go jako link. W każdym zadaniu uczeń najpierw wyobraża sobie wynik, a potem rozwiązuje je ręcznie. Nic nie jest zapisywane w sieci: cały zestaw mieści się w linku.",
  upload: "Wczytaj plik .yaml",
  startFromExample: "Zacznij od przykładu",
  yamlLabel: "Zestaw zadań w formacie YAML",
  form: {
    asForm: "Formularz",
    asYaml: "YAML",
    viewLabel: "Zapisz zestaw jako",
    title: "Tytuł",
    moves: "Dozwolone ruchy",
    allMoves: "Wszystkie ruchy",
    upTo: (n: number, title: string) => `Do rozdziału ${n}. ${title}`,
    start: (n: number) => `Zadanie ${n}: punkt wyjścia`,
    goal: (n: number) => `Zadanie ${n}: cel`,
    remove: (n: number) => `Usuń zadanie ${n}`,
    addOne: "Dodaj zadanie",
    fromChapter: "Dodaj zadania z ćwiczeń do rozdziału",
    chapter: "Rozdział",
    level: "Poziom",
    howMany: "Ile",
    addMade: (n: number) => `Dodaj ${n}`,
    making: "Tworzę je…",
    cantRead:
      "W YAML-u tego zestawu jest błąd, więc formularz nie może go pokazać. Popraw go w widoku YAML albo zacznij od przykładu.",
  },
  check: "Sprawdź",
  checking: "Sprawdzam, czy da się to rozwiązać tymi ruchami…",
  unsolvable: "Nie udało się tego rozwiązać tymi ruchami w 10 krokach. Może potrzeba ruchów z dalszego rozdziału (`moves:`).",
  solvableIn: (n: number) => `Da się rozwiązać w ${n} ${n === 1 ? "ruchu" : "ruchach"}.`,
  linkLabel: "Link do zestawu",
  copied: "Skopiowano",
  copy: "Kopiuj",
  open: "Otwórz",
  makeLink: "Utwórz link",
  fixMarked: "Popraw zadania oznaczone ✗ i sprawdź jeszcze raz.",
  howToWrite: "Jak napisać zestaw",
  formatExample: `title: Nazwa zestawu
moves: balance       # opcjonalnie: numer, id lub tytuł rozdziału —
                     # jego ruchy i ruchy wszystkich wcześniejszych. Bez tego: wszystkie ruchy.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # opcjonalnie: dwie błędne odpowiedzi do wyboru
    hint: Krótka podpowiedź.  # opcjonalnie
    moves: collect            # opcjonalnie: ruchy tylko dla tego zadania`,
  writeMathsAs: "Wzory wpisuj tak, jak pisze się je na klawiaturze:",
  or: "lub",
  twoEquations: ["Dwa równania naraz zapisz w jednej linii i oddziel je znakiem", "(średnikiem)."],
  exampleSet: `title: Praca domowa, tydzień 3
# Ruchy do rozdziału „Równania” włącznie (numer, id lub tytuł rozdziału). Bez tego: wszystkie ruchy.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Dwie błędne odpowiedzi do wyboru (opcjonalnie: inaczej powstaną same).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Najpierw przenieś 2, potem 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Ten link nie działa",
  brokenLinkText: "Może został ucięty przy kopiowaniu. Poproś o niego jeszcze raz albo przejdź do ścieżki nauki.",
  learningPathButton: "Ścieżka nauki",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `Rozwiązane: ${done} z ${total} · `,
    ` dobrze przewidziane za pierwszym razem: ${stars}. W każdym zadaniu najpierw wyobraź sobie wynik, a potem rozwiąż je ręcznie.`,
  ],
  makeOwnSet: "Ułóż własny zestaw",
  ofCount: (n: number, count: number) => `${n} z ${count}`,
  backToSet: (title: string) => `Wróć do: ${title}`,

  // Checking a set (shown to whoever writes one)
  set: {
    defaultTitle: "Moje zadania",
    badYaml: (msg: string) => `To nie jest poprawny YAML: ${msg}`,
    expectedTop: "Na początku powinny być `title:` i `exercises:`.",
    noChapter: (name: string) => `Nie ma rozdziału „${name}” dla \`moves:\` (podaj numer, id lub tytuł rozdziału).`,
    expectedList: "Pod `exercises:` powinna być lista.",
    emptyList: "Lista pod `exercises:` jest pusta.",
    needsStart: "Brakuje `start:`.",
    needsGoal: "Brakuje `goal:`.",
    noChapterShort: (name: string) => `Nie ma rozdziału „${name}” dla \`moves:\`.`,
    cantReadStart: (err: string) => `Nie da się odczytać punktu wyjścia: ${err}`,
    cantReadGoal: (err: string) => `Nie da się odczytać celu: ${err}`,
    doesntFollow: "Cel nie wynika z punktu wyjścia (sprawdź, czy nie ma literówki).",
    noValue: "Punkt wyjścia nie ma wartości dla żadnej liczby (dzielenie przez 0?).",
    twoWrong: "W `wrong:` powinny być dwie błędne odpowiedzi.",
    cantReadWrong: (w: string, err: string) => `Nie da się odczytać błędnej odpowiedzi „${w}”: ${err}`,
    wrongShape: (w: string, why: string) => `Błędna odpowiedź „${w}” nie ma postaci celu: ${why}.`,
    wrongIsRight: (w: string) => `Błędna odpowiedź „${w}” jest tak naprawdę poprawna.`,
    noDecoys:
      "Nie udało się utworzyć przekonujących błędnych odpowiedzi: dodaj `wrong:` albo zadanie obejdzie się bez przewidywania wyniku w myślach.",
    decoysMade: (list: string) => `Błędne odpowiedzi utworzone do wyboru: ${list}.`,
    shapeCount: "inna liczba równań",
    shapeRelation: "wyrażenie tam, gdzie powinno być równanie, albo odwrotnie",
    shapeIsolated: (letter: string) => `nie mówi, ile wynosi ${letter}`,
  },
};
