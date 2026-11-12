import type { Strings } from "../en";

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

export const pl: Strings = {
  htmlLang: "pl",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Język",

  // Top bar
  makeExercises: "Ułóż zadania",
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
  noBadgesYet: "Rozwiązuj zadania w dowolnym rozdziale, a zdobędziesz jego odznakę.",
  badgesEarned: (n: number, total: number) => `${n} z ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => medal[tier],
  badgeNotEarned: "odznaka jeszcze niezdobyta",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? `${["", "brązowa", "srebrna", "złota"][tier]} odznaka` : "odznaka jeszcze niezdobyta"}`,

  // Chapter page
  backToPath: "← Ścieżka nauki",
  exercises: "Zadania",
  practiceNote: "Na początku są łatwe, potem coraz trudniejsze. W dalszych przyda się też to, co znasz z wcześniejszych rozdziałów.",
  leadsOnToStart: "Dalej możesz przejść do: ",
  leadsOnToEnd: ". Zajrzyj tam, kiedy chcesz.",
  watchOut: "Uwaga!",

  // Progress
  solvedOf: (done: number, total: number) => `Rozwiązane zadania: ${done} z ${total}`,
  guessedRight: (n: number, total: number) => `Dobrze za pierwszym razem: ${n} z ${total}`,
  exerciseTitle: (label: string, solved: boolean) => `Zadanie ${label}${solved ? " — rozwiązane" : ""}`,
  solved: "rozwiązane",
  guessedRightFirstTime: "dobrze za pierwszym razem",
  guessFirstShort: "Najpierw pomyśl",
  goldNote: "Złota odznaka. Wszystkie zadania rozwiązane.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${medal[tier]}. ` : ""}Jeszcze ${more} ${plural(more, "zadanie", "zadania", "zadań")} do ${["brązowej", "srebrnej", "złotej"][tier]}.`,

  // Guided example
  exampleN: (n: number) => `Przykład ${n}`,
  notThisStep: "Ten ruch jest poprawny, ale w tym kroku chodzi o inny. Cofam go.",
  done: "Gotowe.",
  keepGoing: "Możesz działać dalej: teraz wolno wykonać dowolny ruch.",
  stepOf: (n: number, total: number) => `Krok ${n} z ${total}`,
  startOver: "Od początku",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: lekcja`,
  nextExercise: "Następne zadanie →",
  backToThePath: "Wróć do ścieżki nauki",
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
  positiveLetters: "Tutaj litery oznaczają liczby dodatnie.",
  pickFirst: "Wybierz odpowiedź powyżej, a potem rozwiąż zadanie tutaj.",
  hint: "Podpowiedź",
  undo: "Cofnij",
  reset: "Od nowa",
  solvedBang: "Rozwiązane!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${medal[tier]} za rozdział „${chapter}”.`,
  theExercise: "zadanie",
  goal: "cel",
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
