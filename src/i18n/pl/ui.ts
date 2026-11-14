import type { Translation } from "../en";

/**
 * Polish plural forms: 1 zadanie, 2–4 zadania, 5+ zadań (and 12–14 zadań, 22–24 zadania).
 */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14) ? few : many;
};

const medal = ["", "Brązowa odznaka", "Srebrna odznaka", "Złota odznaka"] as const;

export const pl: Translation = {
  htmlLang: "pl",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Język",

  // Top bar
  makeExercises: "Ułóż zadania",
  sandbox: "Piaskownica",
  openSandbox: "Otwórz piaskownicę →",
  sandboxIntro: "Wpisz dowolne wyrażenie lub równanie i wypróbuj wszystkie ruchy.",
  sandboxInput: "Wyrażenie lub równanie",
  sandboxPlaceholder: "np. 3(x - 2) = 2x + 1   albo   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Wczytaj",
  debugOn: "Tryb debugowania włączony (Shift+D)",

  // Home
  heroBefore: "Algebra, którą ",
  heroWord: "poczujesz",
  heroAfter: " w palcach.",
  heroText:
    "Przeciągnij dowolną część równania. Da się ją przesunąć tylko tak, jak pozwala matematyka. Przekształcaj je, aż dojdziesz do celu.",
  learningPath: "Ścieżka nauki",
  nextUp: "następny",
  mastered: "opanowane",
  everyChapterOpen: "Wszystkie rozdziały są otwarte. Strzałki pokazują proponowaną kolejność.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) =>
    `Rozdział ${n}: ${title}, rozwiązane ${done} z ${total}`,
  chapterN: (n: number) => `Rozdział ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} i ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Najpierw warto znać: ${titles}.`,
  notMasteredYet: (titles: string) => ` Jeszcze nieopanowane: ${titles}. Możesz jednak zacząć już teraz.`,
  startLesson: "Zacznij lekcję →",
  backToLesson: "Wróć do lekcji →",
  leadsOnTo: (titles: string) => `Dalej: ${titles}.`,
  badges: "Odznaki",
  noBadgesYet: "Rozwiąż test w dowolnym rozdziale, a zdobędziesz jego odznakę.",
  badgesEarned: (n: number, total: number) => `${n} z ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => medal[tier],
  badgeNotEarned: "odznaka jeszcze niezdobyta",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? `${["", "brązowa", "srebrna", "złota"][tier]} odznaka` : "odznaka jeszcze niezdobyta"}`,

  // Chapter page
  backToPath: "← Ścieżka nauki",
  practiceNote: "Każde zadanie jest nowe, ułożone specjalnie dla ciebie. Zacznij od łatwych i przejdź wyżej, kiedy poczujesz, że już czas.",
  leadsOnToStart: "Dalej możesz przejść do: ",
  leadsOnToEnd: ". Zajrzyj tam, kiedy chcesz.",
  watchOut: "Uwaga!",
  level: { easy: "Łatwe", medium: "Średnie", hard: "Trudne" },
  anotherOne: "Jeszcze jedno →",
  practice: "Ćwiczenia",
  testSkills: "Sprawdź się",
  testNote:
    "Oblicz wynik w pamięci, a potem go wybierz. Za dobre odpowiedzi dostajesz odznakę rozdziału: 10 na poziomie „Łatwe” to brązowa, na „Średnie” srebrna, na „Trudne” złota.",
  solvedN: (n: number) => `${n} ${plural(n, "rozwiązane", "rozwiązane", "rozwiązanych")}`,
  testRight: "Dobrze! To się liczy do odznaki.",
  drills: {
    commute: { name: "Zmiana kolejności", how: "Przeciągnij wyraz za sąsiada. Przy + i × kolejność nie ma znaczenia." },
    combine: { name: "Dodawanie liczb", how: "Przeciągnij jedną liczbę na drugą, żeby je dodać." },
    "multiply-numbers": { name: "Mnożenie liczb", how: "Przeciągnij liczbę na drugą liczbę, przez którą ją mnożysz." },
    "numbers-first": { name: "Liczba na początek", how: "Dotknij iloczynu takiego jak `x·3`, żeby zapisać go tak jak zwykle: `3x`." },
    "multiply-out": { name: "Obliczanie iloczynu", how: "Dotknij iloczynu liczb, np. `2·3`, żeby go obliczyć." },
    collect: { name: "Redukcja wyrazów podobnych", how: "Przeciągnij wyraz na wyraz podobny, czyli z tą samą literą. Dodają się." },
    "collect-cancel": { name: "Wyrazy przeciwne", how: "Przeciągnij wyraz na wyraz do niego przeciwny. Znoszą się." },
    distribute: { name: "Wymnażanie nawiasu", how: "Przeciągnij liczbę sprzed nawiasu na nawias. Mnoży każdy wyraz w środku." },
    "distribute-neg": { name: "Minus przed nawiasem", how: "Przeciągnij minus na nawias. Każdy znak w środku się zmienia." },
    "factor-out": { name: "Wyłączanie wspólnego czynnika", how: "Oba wyrazy mają wspólny czynnik. Przeciągnij go z jednego z nich na sam początek, przed całe wyrażenie." },
    "x-times-x": { name: "x razy x", how: "Przeciągnij jeden x na drugi. `x·x` zapisujemy jako `x²`." },
    "merge-powers": { name: "Ta sama podstawa: dodaj wykładniki", how: "Przeciągnij jedną potęgę na drugą o tej samej podstawie. Wykładniki się dodają." },
    "power-to-product": { name: "Kwadrat jako iloczyn", how: "Dotknij ², żeby zapisać nawias dwa razy." },
    "move-term": { name: "Przenoszenie wyrazu", how: "Przenieś liczbę na drugą stronę =. Po drodze zmienia znak." },
    "move-factor": { name: "Dzielenie obu stron", how: "Przenieś liczbę sprzed litery na drugą stronę =. Dzieli drugą stronę." },
    "move-denominator": { name: "Mnożenie obu stron", how: "Przenieś mianownik ułamka na drugą stronę =. Mnoży drugą stronę." },
    "move-sign": { name: "Przenoszenie minusa", how: "Przenieś sam minus na drugą stronę =. Druga strona zmienia znak." },
    "swap-sides": { name: "Zamiana stron", how: "Przeciągnij jedną stronę przez = i dalej, za drugi koniec. Strony zamieniają się miejscami." },
    "evaluate-fraction": { name: "Obliczanie ułamka", how: "Dotknij kreski ułamkowej, żeby obliczyć ułamek." },
    "divide-numbers": { name: "Skracanie ułamka", how: "Przeciągnij liczbę z mianownika na liczbę w liczniku. Obie dzielą się przez ich wspólny dzielnik." },
    "cancel-factor": { name: "Skracanie wspólnego czynnika", how: "Przeciągnij liczbę z mianownika na taką samą liczbę w liczniku. Obie znikają." },
    "power-of-power": { name: "Potęga potęgi", how: "Przeciągnij zewnętrzny wykładnik na wewnętrzny. Wykładniki się mnożą." },
    "divide-powers": { name: "Ta sama podstawa: odejmij wykładniki", how: "Przeciągnij potęgę z mianownika na potęgę w liczniku. Wykładniki się odejmują." },
    "flip-across-bar": { name: "Przez kreskę ułamkową", how: "Przeciągnij potęgę w górę przez kreskę ułamkową. Jej wykładnik zmienia znak." },
    "power-one": { name: "Wykładnik 1", how: "Przeciągnij wykładnik 1 na jego podstawę: `x¹` to po prostu `x`." },
    "zero-power": { name: "Wykładnik 0", how: "Przeciągnij wykładnik 0 na jego podstawę. Każda liczba (różna od zera) do potęgi 0 daje 1." },
    "tap-power": { name: "Obliczanie potęgi", how: "Dotknij wykładnika, żeby obliczyć potęgę: `2³` zmienia się w 8." },
    "power-of-product": { name: "Wykładnik do nawiasu", how: "Przeciągnij wykładnik do nawiasu. Każdy czynnik w środku dostaje swój własny." },
    "split-number": { name: "Rozkład liczby", how: "Dotknij liczby, żeby rozłożyć ją na dwa czynniki." },
    "factor-shared": { name: "Wyłączanie litery", how: "Przeciągnij `x` z jednego wyrazu na inny wyraz z `x`. Wyłączasz je przed nawias z obu wyrazów naraz." },
    "move-letter-factor": { name: "Dzielenie przez literę", how: "Przenieś jedną z mnożonych liter na drugą stronę =. Dzieli drugą stronę." },
    "move-letter-denominator": { name: "Mnożenie przez literę", how: "Przenieś literę z mianownika na drugą stronę =. Mnoży drugą stronę." },
    "ineq-move-term": { name: "Przenoszenie wyrazu", how: "Przenieś liczbę na drugą stronę znaku nierówności. Liczba zmienia znak, ale zwrot nierówności zostaje ten sam." },
    "ineq-swap": { name: "Zamiana stron", how: "Przeciągnij jedną stronę za drugą. Znak nierówności odwraca się razem z nimi." },
    "ineq-sign": { name: "Przenoszenie minusa", how: "Przenieś na drugą stronę sam minus. Nierówność zmienia zwrot." },
    "add-fractions": { name: "Dodawanie ułamków", how: "Mianowniki są takie same: przeciągnij jeden ułamek na drugi. Liczniki się dodają." },
    "expand-fraction": { name: "Wspólny mianownik", how: "Przeciągnij mianownik jednego ułamka na drugi ułamek. Jego licznik i mianownik mnożą się przez tę liczbę." },
    "multiply-fractions": { name: "Mnożenie ułamków", how: "Przeciągnij jeden ułamek na drugi. Liczniki się mnożą, mianowniki też." },
    "divide-by-fraction": { name: "Dzielenie przez ułamek", how: "Przeciągnij ułamek z mianownika w górę przez kreskę ułamkową. Zamienia się w swoją odwrotność i mnoży." },
    "split-fraction": { name: "Rozbijanie ułamka", how: "Wyciągnij wyraz z licznika. Zabiera ze sobą kopię mianownika." },
    "times-one": { name: "Razy 1", how: "Przeciągnij 1 na to, co mnoży. Mnożenie przez 1 niczego nie zmienia." },
    substitute: { name: "Podstawianie", how: "Przeciągnij `y` z `y = …` na `y` w drugim równaniu. W jego miejsce wchodzi to, ile wynosi `y`." },
    "evaluate-root": { name: "Obliczanie pierwiastka", how: "Dotknij pierwiastka, żeby go obliczyć." },
    "split-square": { name: "Rozkład pod pierwiastkiem", how: "Dotknij liczby pod pierwiastkiem. Wydziela się z niej kwadrat." },
    "pull-out-of-power": { name: "Rozbijanie pierwiastka", how: "Wyciągnij liczbę spod pierwiastka. Dostaje swój własny √." },
    "root-notation": { name: "Pierwiastek jako potęga", how: "Dotknij pierwiastka, żeby zapisać go jako potęgę o wykładniku ½." },
    "root-across": { name: "Potęga ½ na drugą stronę =", how: "Przenieś ½ na drugą stronę =. Tam zmienia się w kwadrat." },
    "exp-of-log": { name: "Potęga znosi logarytm", how: "Przeciągnij podstawę na logarytm w jej wykładniku. Znoszą się nawzajem." },
    "evaluate-log": { name: "Znane logarytmy", how: "Dotknij logarytmu, żeby go obliczyć: `ln(e) = 1`, a logarytm z 1 to 0." },
    "power-of-base": { name: "Potęga podstawy", how: "Dotknij liczby w logarytmie, żeby zapisać ją jako potęgę podstawy logarytmu." },
    "log-of-product": { name: "Rozbijanie logarytmu", how: "Wyciągnij liczbę spod logarytmu. Dostaje swój własny logarytm." },
    "log-of-power": { name: "Wykładnik przed logarytm", how: "Przeciągnij wykładnik przed logarytm." },
    "power-into-log": { name: "Liczba pod logarytm", how: "Przeciągnij liczbę sprzed logarytmu na logarytm. Pod logarytmem staje się wykładnikiem." },
    "combine-logs": { name: "Łączenie logarytmów", how: "Przeciągnij jeden logarytm na drugi. Przy dodawaniu liczby pod logarytmem się mnożą, przy odejmowaniu dzielą." },
    "exp-across": { name: "Podstawa na drugą stronę =", how: "Przenieś podstawę na drugą stronę =. Tam zmienia się w logarytm." },
    "log-across": { name: "Logarytm na drugą stronę =", how: "Przenieś logarytm na drugą stronę =. Tam zmienia się w potęgę." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Zadanie ${label}${solved ? " — rozwiązane" : ""}`,
  goldNote: "Złota odznaka. Możesz ćwiczyć dalej, ile chcesz.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${medal[tier]}. ` : ""}Jeszcze ${more} ${plural(more, "dobra odpowiedź", "dobre odpowiedzi", "dobrych odpowiedzi")} na poziomie „${["Łatwe", "Średnie", "Trudne"][tier]}” do ${["brązowej", "srebrnej", "złotej"][tier]}.`,

  // Guided example
  notThisStep: "Ten ruch jest poprawny, ale w tym kroku chodzi o inny. Cofam go.",
  done: "Gotowe.",
  keepGoing: "Możesz działać dalej: teraz wolno wykonać dowolny ruch.",
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
  guessPrompt: "Najpierw pomyśl: co z tego wyjdzie?",
  reveal: "Pokaż",
  guessedBeforeRight: "Tu twoja pierwsza odpowiedź była dobra.",
  guessedBeforeWrong: (picked: boolean) =>
    `${picked ? "Twoja pierwsza odpowiedź to ta czerwona" : "Twoja pierwsza odpowiedź była błędna"}. Dobra jest ta zielona.`,
  rightFirstTime: "Dobrze za pierwszym razem. Teraz to rozwiąż.",
  notQuite: "Niezupełnie. Dobra jest ta zielona. Rozwiąż zadanie, a zobaczysz, gdzie był błąd.",
  solvedBefore: "✓ To zadanie jest już rozwiązane. Możesz rozwiązać je jeszcze raz.",
  makeItLookLike: "Doprowadź do postaci",
  pickFirst: "Wybierz odpowiedź powyżej, a potem rozwiąż zadanie tutaj.",
  hint: "Podpowiedź",
  undo: "Cofnij",
  reset: "Od nowa",
  solvedBang: "Rozwiązane!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${medal[tier]} za rozdział „${chapter}”.`,
  theExercise: "zadanie",
  moveCrashed: "Coś poszło nie tak przy tym ruchu.",
  moveCrashedDetails: "Szczegóły są w konsoli przeglądarki.",
  tryAgain: "Spróbuj jeszcze raz",

  // Making a set
  ownTitle: "Twoje własne zadania",
  ownIntro:
    "Ułóż zestaw zadań, na przykład dla swoich uczniów, i udostępnij go jako link. W każdym zadaniu uczeń najpierw przewiduje wynik, a potem rozwiązuje je ręcznie. Nic nie jest zapisywane w sieci: cały zestaw mieści się w linku.",
  upload: "Wczytaj plik .yaml",
  startFromExample: "Zacznij od przykładu",
  yamlLabel: "Zestaw zadań w formacie YAML",
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
    ` dobrze za pierwszym razem: ${stars}. W każdym zadaniu najpierw przewidź wynik, a potem rozwiąż je ręcznie.`,
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
    twoWrong: "W `wrong:` powinny być dwie błędne odpowiedzi.",
    cantReadWrong: (w: string, err: string) => `Nie da się odczytać błędnej odpowiedzi „${w}”: ${err}`,
    wrongShape: (w: string, why: string) => `Błędna odpowiedź „${w}” nie ma postaci celu: ${why}.`,
    wrongIsRight: (w: string) => `Błędna odpowiedź „${w}” jest tak naprawdę poprawna.`,
    noDecoys: "Nie udało się utworzyć przekonujących błędnych odpowiedzi: dodaj `wrong:` albo zadanie obejdzie się bez przewidywania wyniku.",
    decoysMade: (list: string) => `Błędne odpowiedzi utworzone do wyboru: ${list}.`,
    shapeCount: "inna liczba równań",
    shapeRelation: "wyrażenie tam, gdzie powinno być równanie, albo odwrotnie",
    shapeIsolated: (letter: string) => `nie mówi, ile wynosi ${letter}`,
  },
};
