import type { ChapterTexts } from "..";

export const plChapters: ChapterTexts = {
  shuffle: {
    title: "Porządkowanie wyrazów",
    blurb: "Wyrazy sumy można dodawać w dowolnej kolejności, a same liczby można od razu obliczyć.",
    lesson: [
      {
        title: "Kolejność nie ma znaczenia",
        text: [
          "Kolejność dodawania nie zmienia wyniku. `2 + x` i `x + 2` to to samo.",
          "Każdy składnik sumy nazywamy wyrazem. Wyrazy możesz przeciągać i ustawiać w dowolnej kolejności.",
        ],
        steps: ["Przesuń 2 za x."],
      },
      {
        title: "Każdy wyraz ma swój znak",
        text: ["W `5 − 3 + x` wyrazami są `5`, `−3` i `x`. Minus należy do 3. Gdy 3 się przesuwa, minus idzie razem z nim."],
        steps: ["Przeciągnij x na początek. 3 zabiera ze sobą swój minus."],
        watch: "`5 − 3` i `3 − 5` to nie to samo. Gdy przesuwasz 3, jego minus musi iść razem z nim.",
      },
      {
        title: "Dodawanie liczb",
        text: [
          "Dwie liczby w tej samej sumie można dodać. Przeciągnij jedną na drugą. x to liczba, której jeszcze nie znamy, więc zostaje bez zmian.",
        ],
        steps: ["Przeciągnij 4 na 3."],
        after: "3 + 4 = 7. x zostaje bez zmian.",
      },
      {
        title: "Mnożenie w dowolnej kolejności",
        text: [
          "Przy mnożeniu kolejność też nie ma znaczenia: `2·x·5` to `2·5·x`. Możesz więc pomnożyć 2 przez 5 i dostać 10.",
          "Zwykle piszemy liczbę na początku i pomijamy kropkę: `10·x` zapisujemy jako `10x`.",
        ],
        steps: ["Przeciągnij 5 na 2."],
      },
    ],
  },

  collect: {
    title: "Wyrazy podobne",
    blurb: "Wyrazy z tymi samymi literami można do siebie dodawać: 3x + 2x = 5x. Wyraz minus ten sam wyraz daje 0.",
    lesson: [
      {
        title: "Co znaczy 3x",
        text: ["`3x` znaczy `x + x + x`. Zatem `3x + 2x` to trzy iksy plus dwa iksy, czyli `5x`."],
        steps: ["Przeciągnij 2x na 3x."],
      },
      {
        title: "Dodajemy tylko wyrazy podobne",
        text: [
          "Wyrazy podobne mają dokładnie te same litery. Tylko takie wyrazy można do siebie dodawać: to redukcja wyrazów podobnych. `3x + 2` nie zamieni się w `5x`, bo `2` nie ma x. Same liczby dodaje się tylko do samych liczb.",
        ],
        steps: ["Oba iksy to wyrazy podobne. Przeciągnij drugi x na pierwszy."],
        after: "4 nie ma x, więc zostaje bez zmian.",
      },
      {
        title: "Różnych liter nie dodajemy",
        text: [
          "`x` i `y` mogą oznaczać różne liczby, więc `2x + 3y` nie da się uprościć. Ale w `2x + 3y + x` dwa wyrazy z x można dodać.",
        ],
        steps: ["Przeciągnij x na 2x. 3y zostaje bez zmian."],
        after: "Wyrazy z x i wyrazy z y zostają osobno.",
      },
      {
        title: "Odejmowanie",
        text: ["Odejmowanie działa tak samo: `5y − 2y` to `3y`. Wyraz odjąć ten sam wyraz daje 0, więc `a + b − a` to po prostu `b`."],
        steps: ["Przeciągnij −a na a. Znoszą się."],
        watch: "`x + x` to `2x`, a nie `x²`. `x²` oznacza `x·x`, ale o tym później.",
      },
    ],
  },

  distribute: {
    title: "Rozdzielność mnożenia",
    blurb: "Liczba przed nawiasem mnoży każdy wyraz w nawiasie. Czynnik, który mają wszystkie wyrazy, można z powrotem wyłączyć przed nawias.",
    lesson: [
      {
        title: "Mnożymy każdy wyraz w nawiasie",
        text: [
          "`2(x + 3)` oznacza 2 razy `(x + 3)`. To 2 razy x plus 2 razy 3: `2x + 2·3`. Liczba przed nawiasem mnoży każdy wyraz w środku.",
          "Wyobraź sobie prostokąt o wysokości 2 i szerokości `x + 3`. Podziel go na dwie części: jedna ma pole `2·x`, druga `2·3`. Razem dają cały prostokąt.",
        ],
        steps: ["Przeciągnij 2 na nawias. Mnoży oba wyrazy.", "Teraz przeciągnij 2 z 2·3 na 3."],
      },
      {
        title: "Minus przed nawiasem",
        text: ["`−(x − 4)` oznacza `−1` razy nawias. −1 mnoży każdy wyraz, więc każdy znak w nawiasie się zmienia."],
        steps: ["Przeciągnij minus na nawias."],
        watch: "Częsty błąd to zapisanie `−(x − 4)` jako `−x − 4`. Minus mnoży także 4.",
      },
      {
        title: "Wyłączanie czynnika przed nawias",
        text: [
          "Droga w drugą stronę to wyłączanie wspólnego czynnika przed nawias. Jeśli każdy wyraz ma czynnik 3, możesz wyłączyć 3 przed nawias: `3x + 3y = 3(x + y)`.",
        ],
        steps: ["Oba wyrazy mają 3. Przeciągnij jedną 3 na sam początek, przed całe wyrażenie."],
        after: "Wymnóż z powrotem, a dostaniesz 3x + 3y.",
      },
      {
        title: "x razy x",
        text: [
          "Czasem litera mnoży się przez samą siebie: `x(x + 2)` daje `x·x`. Zapisujemy to jako `x²` (x do kwadratu). Kwadrat o boku x ma pole `x·x`.",
        ],
        steps: ["Przeciągnij x na nawias.", "Przeciągnij jeden x na drugi."],
      },
    ],
  },

  brackets: {
    title: "Mnożenie sum algebraicznych",
    blurb: "Żeby pomnożyć dwa nawiasy, pomnóż każdy wyraz z pierwszego nawiasu przez każdy wyraz z drugiego.",
    lesson: [
      {
        title: "Nawias to jeden czynnik",
        text: [
          "W `(x + 1)(x + 2)` pierwszy nawias mnoży cały drugi. Potraktuj `(x + 1)` jak jeden czynnik i wymnóż: mnoży on `x` i `2`.",
        ],
        steps: [
          "Przeciągnij cały nawias (x + 1) na (x + 2). Mnoży oba wyrazy.",
          "Teraz przeciągnij x na nawias (x + 1) obok niego.",
          "Potem przeciągnij 2 na nawias (x + 1) obok niej.",
        ],
        after: "Wychodzą cztery wyrazy: x·x, 1·x, 2·x i 2·1. Po redukcji wyrazów podobnych masz x² + 3x + 2.",
      },
      {
        title: "Mnożenie dwóch nawiasów",
        text: [
          "Pomnóż każdy wyraz pierwszego nawiasu przez każdy wyraz drugiego. Dwa wyrazy razy dwa wyrazy dają cztery wyrazy. Potem zredukuj wyrazy podobne.",
          "W `(x + 3)(x − 3)` dwa środkowe wyrazy to `+3x` i `−3x`. Znoszą się i zostaje `x² − 9`.",
        ],
      },
      {
        title: "Kwadrat nawiasu",
        text: ["`(x + 1)²` to `(x + 1)(x + 1)`, więc liczy się go tak samo. Dotknij ², żeby to rozpisać."],
        steps: ["Dotknij ², żeby zapisać to jako iloczyn."],
        watch: "`(x + 1)²` to nie `x² + 1`. Sprawdź dla x = 2: `(2 + 1)² = 9`, a `2² + 1 = 5`. Różnica to dwa środkowe wyrazy, `x + x = 2x`.",
      },
    ],
  },

  balance: {
    title: "Równania",
    blurb: "Gdy z obiema stronami zrobisz to samo, równanie dalej jest prawdziwe. Wyraz przeniesiony na drugą stronę = zmienia działanie na przeciwne.",
    lesson: [
      {
        title: "To samo po obu stronach",
        text: [
          "Równanie mówi, że dwie rzeczy są równe. Jeśli z obiema stronami zrobisz to samo, dalej będą równe.",
          "Przenoszenie wyrazu na drugą stronę `=` to właśnie to. Z `x + 3 = 10` odejmij 3 od obu stron: `x = 10 − 3`. Dlatego `+3` po drugiej stronie zmienia się w `−3`.",
        ],
        steps: ["Przenieś 3 na drugą stronę =. Zmienia znak.", "Przeciągnij −3 na 10."],
      },
      {
        title: "Dzielenie obu stron",
        text: [
          "Jeśli liczba mnoży całą stronę, to po przeniesieniu dzieli drugą stronę. Z `2x = 8` podziel obie strony przez 2: `x = 8/2`.",
        ],
        steps: ["Przenieś 2 na drugą stronę =. Dzieli drugą stronę.", "Przeciągnij 2 na 8."],
      },
      {
        title: "Ułamki i minusy",
        text: [
          "Z dzieleniem jest tak samo. Z `x/3 = 4` pomnóż obie strony przez 3. Trójka z mianownika przechodzi na drugą stronę i ją mnoży.",
          "Minus przed całą stroną też można przenieść: `−x = 6` zmienia się w `x = −6`.",
        ],
        steps: ["Przenieś 3 na drugą stronę =.", "Przeciągnij 4 na 3."],
      },
      {
        title: "Cofamy od końca",
        text: [
          "W `3x + 1` x najpierw mnożymy przez 3, a potem dodajemy 1. Żeby x został sam, cofnij te działania w odwrotnej kolejności: najpierw przenieś 1, potem 3.",
        ],
        steps: ["Przenieś 1 na drugą stronę.", "Oblicz.", "Przenieś 3 na drugą stronę.", "Oblicz."],
        watch: "Sprawdź wynik, podstawiając go z powrotem: 3·4 + 1 = 13. ✓",
      },
    ],
  },

  powers: {
    title: "Potęgi",
    blurb: "x³ oznacza x·x·x. Policz iksy, a odkryjesz prawa działań na potęgach.",
    lesson: [
      {
        title: "Mnożenie potęg",
        text: [
          "`x³` oznacza `x·x·x`. Mała liczba u góry to wykładnik. Mówi, ile iksów mnożymy.",
          "Zatem `x²·x³` to dwa iksy razy trzy iksy: razem pięć iksów. Gdy mnożysz potęgi o tej samej podstawie, dodajesz wykładniki.",
        ],
        steps: ["Ta sama podstawa: przeciągnij jedną potęgę na drugą.", "Oblicz."],
      },
      {
        title: "Potęga potęgi",
        text: ["`(x²)³` to `x²·x²·x²`. To 2 + 2 + 2 = 6 iksów, więc wykładniki się mnoży."],
        steps: ["Przeciągnij zewnętrzne 3 na wewnętrzne 2.", "Oblicz."],
      },
      {
        title: "Dzielenie potęg",
        text: [
          "`x⁵/x²` ma pięć iksów w liczniku i dwa w mianowniku. Dwa iksy skracają się w liczniku i mianowniku, w liczniku zostają trzy. Gdy dzielisz potęgi, odejmujesz wykładniki.",
        ],
        steps: ["Przeciągnij x² na x⁵.", "Oblicz."],
      },
      {
        title: "Wykładnik zerowy i ujemny",
        text: [
          "`x³/x³` to 1, ale to też `x^(3 − 3) = x⁰`. Zatem każda liczba (różna od zera) do potęgi 0 daje 1.",
          "Jeśli w mianowniku jest więcej iksów niż w liczniku, wykładnik spada poniżej zera: `x⁻²` oznacza `1/x²`. Gdy potęga przechodzi przez kreskę ułamkową, jej wykładnik zmienia znak.",
        ],
        steps: ["Przeciągnij x³ w górę przez kreskę ułamkową."],
        watch: "`2x³` to `2·x·x·x`: potęga dotyczy tylko x. `(2x)³` to co innego: to `8x³`.",
      },
    ],
  },

  factor: {
    title: "Rozkład na czynniki",
    blurb: "Rozkład na czynniki to wymnażanie na odwrót. Znajdź czynnik, który ma każdy wyraz, i wyłącz go przed nawias.",
    lesson: [
      {
        title: "Wymnażanie na odwrót",
        text: [
          "Rozkład na czynniki cofa wymnażanie. `x² + 3x` to `x·x + 3·x`. Oba wyrazy mają `x`, więc możesz wyłączyć go przed nawias: `x(x + 3)`.",
        ],
        steps: ["Dotknij ², żeby rozpisać x².", "Teraz oba wyrazy mają x. Przeciągnij jeden x na sam początek, przed całe wyrażenie."],
        after: "Dla sprawdzenia wymnóż x(x + 3). Znów dostaniesz x² + 3x.",
      },
      {
        title: "Rozkładanie liczb",
        text: ["Żeby znaleźć wspólny czynnik, rozłóż liczby na czynniki. W `2x + 6` dotknij 6, a dostaniesz `2·3`. Teraz oba wyrazy mają 2."],
        steps: ["Dotknij 6, żeby ją rozłożyć.", "Przeciągnij 2 przed nawias."],
      },
      {
        title: "Wyłączanie nawiasu",
        text: [
          "W `x(x + 2) + 3(x + 2)` oba wyrazy mają ten sam nawias `(x + 2)`. To wspólny czynnik, więc możesz go wyłączyć jak każdy inny.",
        ],
        steps: ["Przeciągnij (x + 2) na początek."],
      },
      {
        title: "Cztery wyrazy: grupowanie parami",
        text: [
          "Przy czterech wyrazach rozłóż najpierw dwa pierwsze, potem dwa ostatnie. Jeśli wyjdą takie same nawiasy, wyłącz także ten nawias.",
        ],
        watch: "Rozkład zawsze sprawdzaj, wymnażając go z powrotem. Musi wyjść dokładnie to, od czego zaczynasz.",
      },
    ],
  },

  formulas: {
    title: "Przekształcanie wzorów",
    blurb: "Wzór to równanie z kilkoma literami. Żeby wyznaczyć z niego jedną literę, użyj tych samych ruchów co przy x.",
    lesson: [
      {
        title: "Wyznaczanie litery ze wzoru",
        text: [
          "Wzór `v = u + at` pozwala obliczyć prędkość `v`, gdy znasz prędkość początkową `u`, przyspieszenie `a` i czas `t`. Po przekształceniu pozwala obliczyć czas: `t = (v − u)/a`.",
          "Wyznaczyć literę ze wzoru to doprowadzić do tego, żeby stała sama po jednej stronie. Robi się to tak jak przy rozwiązywaniu równania z x. Pozostałe litery traktuj jak liczby.",
        ],
        steps: ["t jest pomnożone przez a. Najpierw przenieś u na drugą stronę.", "Teraz przenieś a na drugą stronę. Dzieli drugą stronę."],
        after: "Czytaj od prawej do lewej: t = (v − u)/a.",
      },
      {
        title: "Litery przenosi się jak liczby",
        text: [
          "Litera, która mnoży całą stronę, może przejść na drugą stronę `=` i dzielić tamtą stronę, tak jak `2x = 8` zmieniło się w `x = 8/2`. (Dzielić można tylko przez literę różną od 0. W tych wzorach nigdy nie jest zerem.)",
        ],
        steps: ["Przenieś m na drugą stronę."],
        watch: "Przenieść można tylko czynnik całej strony. W `u + at` litera `a` mnoży tylko `t`, więc najpierw przenieś `u`.",
      },
      {
        title: "Litery w mianowniku",
        text: [
          "Jeśli cała strona jest ułamkiem, litera z mianownika może przejść na drugą stronę i mnożyć tamtą stronę, tak jak `x/3 = 4` zmieniło się w `x = 4·3`.",
        ],
        steps: ["Przenieś A na drugą stronę. Mnoży drugą stronę."],
      },
      {
        title: "Gdy litera jest w dwóch miejscach",
        text: [
          "W `ax + bx = c` x występuje dwa razy, więc przeniesienie jednego wyrazu nie wystarczy, żeby x został sam. Najpierw wyłącz x przed nawias. Potem nawias, przez który x jest mnożony, może przejść na drugą stronę.",
        ],
        steps: ["Oba wyrazy mają x. Przeciągnij jeden x na początek.", "Teraz przenieś cały nawias (a + b) na drugą stronę."],
      },
    ],
  },

  inequalities: {
    title: "Nierówności",
    blurb:
      "Nierówności rozwiązuje się jak równania, z jedną różnicą: mnożenie lub dzielenie przez liczbę ujemną zmienia zwrot nierówności.",
    lesson: [
      {
        title: "Mniejsze i większe",
        text: ["`x < 7` mówi, że x jest mniejsze od 7. Znak jest otwarty w stronę większej liczby."],
        steps: ["Tak jak w równaniu, przenieś 2 na drugą stronę.", "Oblicz."],
      },
      {
        title: "Zamiana stron",
        text: [
          "`3 > x` i `x < 3` mówią to samo: x jest mniejsze od 3. Strony możesz więc zamienić miejscami, o ile odwrócisz też znak.",
        ],
        steps: ["Przeciągnij 3 na drugą stronę. Znak się odwraca."],
      },
      {
        title: "Te same ruchy co w równaniach",
        text: [
          "Dodanie lub odjęcie tej samej liczby po obu stronach nie zmienia znaku nierówności. Podobnie mnożenie lub dzielenie obu stron przez liczbę dodatnią.",
        ],
        steps: ["Przenieś 2 na drugą stronę. Jest dodatnie, więc znak się nie zmienia.", "Oblicz."],
      },
      {
        title: "Minus zmienia zwrot",
        text: [
          "Mnożenie przez −1 odwraca kolejność: `2 < 3`, ale `−2 > −3`. Dlatego gdy minus przechodzi na drugą stronę, nierówność zmienia zwrot.",
        ],
        steps: ["Przenieś na drugą stronę sam minus. Znak < się odwraca."],
        after: "Sprawdź na liczbie: x = 0 spełnia i −x < 4, i x > −4.",
        watch: "Zwrot nierówności zmienia tylko mnożenie lub dzielenie przez liczbę ujemną. Przeniesienie wyrazu na drugą stronę nigdy go nie zmienia.",
      },
    ],
  },

  fractions: {
    title: "Ułamki",
    blurb:
      "Żeby dodać ułamki, najpierw sprowadź je do wspólnego mianownika. Pomnożenie licznika i mianownika przez tę samą liczbę nie zmienia wartości ułamka.",
    lesson: [
      {
        title: "Dodawanie ułamków",
        text: [
          "`3/4` to trzy czwarte. Gdy mianowniki są takie same, dodajesz tylko liczniki: jedna piąta plus dwie piąte to trzy piąte, więc `1/5 + 2/5 = 3/5`.",
        ],
        steps: ["Mianowniki są takie same. Przeciągnij jeden ułamek na drugi.", "Oblicz."],
      },
      {
        title: "Skracanie i rozszerzanie",
        text: [
          "Podzielenie licznika i mianownika przez tę samą liczbę nie zmienia wartości ułamka: `6/8 = 3/4`. To skracanie ułamka.",
          "Pomnożenie licznika i mianownika przez tę samą liczbę też jej nie zmienia: `1/2 = 2/4 = 3/6`. To rozszerzanie ułamka.",
        ],
        steps: ["Przeciągnij 8 na 6. Obie liczby dzielą się przez ich wspólny dzielnik, 2."],
      },
      {
        title: "Wspólny mianownik",
        text: [
          "Żeby dodać `1/2 + 1/3`, zamień oba ułamki na szóste. Pomnóż licznik i mianownik `1/2` przez 3, a licznik i mianownik `1/3` przez 2. Teraz oba mianowniki to 6.",
        ],
        steps: ["Przeciągnij 3 z ⅓ na ½: licznik i mianownik ½ mnożą się przez 3."],
        watch: "`1/2 + 1/3` to nie `2/5`. Liczniki dodaje się dopiero wtedy, gdy mianowniki są już takie same.",
      },
      {
        title: "Mnożenie ułamków",
        text: ["Mnożenie jest prostsze: mnożysz liczniki i mnożysz mianowniki. Połowa jednej trzeciej to `(1·1)/(2·3) = 1/6`."],
        steps: ["Przeciągnij jeden ułamek na drugi."],
        after: "Potem skróć wspólne czynniki licznika i mianownika, a dostaniesz 3/2.",
      },
    ],
  },

  simultaneous: {
    title: "Układy równań",
    blurb: "Dwa równania z dwiema niewiadomymi, prawdziwe jednocześnie. Wyznacz jedną literę z jednego równania i podstaw ją do drugiego.",
    lesson: [
      {
        title: "Dwa równania naraz",
        text: [
          "`y = 2x` i `x + y = 9` to dwa równania z tymi samymi x i y. Jedno równanie z dwiema niewiadomymi ma wiele rozwiązań. Dwa równania razem zwykle mają tylko jedno.",
          "Żeby je rozwiązać, pozbądź się jednej litery. Zostanie jedno równanie z jedną niewiadomą, a takie już umiesz rozwiązywać.",
        ],
      },
      {
        title: "Podstawianie",
        text: ["`y = 2x` mówi, że y i 2x są równe. Możesz więc w drugim równaniu wstawić 2x w miejsce y. To metoda podstawiania."],
        steps: ["Przeciągnij y z y = 2x na y w drugim równaniu.", "Teraz w równaniu jest tylko x. Zredukuj wyrazy podobne."],
        after: "Rozwiąż je: x = 3. Potem podstaw x = 3 do y = 2x i oblicz y.",
      },
      {
        title: "Wyznaczanie jednej litery",
        text: [
          "Do podstawiania potrzebujesz równania w postaci `y = …` albo `x = …`. Jeśli takiego nie masz, zrób je: w `x − y = 1` przenieś −y na drugą stronę, a dostaniesz `x = 1 + y`.",
        ],
        steps: ["Przenieś −y na drugą stronę = w drugim równaniu.", "Teraz x jest sam. Przeciągnij go na x w pierwszym równaniu."],
        after: "Teraz w pierwszym równaniu jest tylko y: 2y + 1 = 7, więc y = 3.",
        watch: "Podstawiaj całe wyrażenie. Jeśli x = 1 + y, to 2x to 2(1 + y), a nie 2 + y.",
      },
      {
        title: "Druga niewiadoma",
        text: [
          "Gdy znasz już jedną literę, na przykład `x = 3`, podstaw ją do drugiego równania i oblicz drugą. Przeciągnij x z `x = 3` na x w drugim równaniu.",
        ],
      },
    ],
  },

  roots: {
    title: "Pierwiastki",
    blurb: "√x to x do potęgi ½, więc prawa działań na potęgach działają też dla pierwiastków.",
    lesson: [
      {
        title: "Pierwiastek kwadratowy",
        text: ["`√9` to liczba, która pomnożona przez siebie daje 9. To 3, bo `3·3 = 9`."],
        steps: ["Dotknij 9, żeby rozłożyć ją na równe czynniki."],
        after: "Potem wyciągnij jedną 3 spod pierwiastka. Gdy już wiesz, jak to działa, możesz dotknąć pierwiastka takiego jak √9 i obliczyć go w jednym kroku.",
      },
      {
        title: "Pierwiastek to potęga",
        text: [
          "`√x` to `x` do potęgi `½`. Zatem `√x·√x = x^(1/2 + 1/2) = x`. Wszystkie prawa działań na potęgach działają też dla pierwiastków.",
        ],
        steps: ["Dotknij: potęga ½ to pierwiastek kwadratowy."],
      },
      {
        title: "Pierwiastek z iloczynu",
        text: ["Pierwiastek z iloczynu to iloczyn pierwiastków: `√(4x) = √4·√x = 2√x`."],
        steps: ["Wyciągnij 4 spod pierwiastka. Dostaje swój własny √."],
        after: "A √4 to 2, więc wychodzi 2√x.",
        watch: "Pierwiastek z sumy to nie suma pierwiastków: `√(9 + 16)` to `√25 = 5`, a nie `3 + 4`.",
      },
      {
        title: "Pozbywanie się pierwiastka",
        text: [
          "Żeby rozwiązać `√x = 3`, podnieś obie strony do kwadratu. Dotknij pierwiastka, żeby zapisać go jako `x^(1/2)`. Potem przenieś ½ na drugą stronę =. Tam zmienia się w kwadrat.",
        ],
        steps: ["Dotknij pierwiastka, żeby zapisać go jako potęgę.", "Przenieś ½ na drugą stronę =. Zmienia się w kwadrat.", "Oblicz."],
      },
    ],
  },

  explog: {
    title: "Logarytmy",
    blurb:
      "ln(x) to wykładnik, do którego trzeba podnieść e, żeby dostać x. Dlatego ln i e^ znoszą się nawzajem, a logarytm iloczynu to suma logarytmów.",
    lesson: [
      {
        title: "Co oznacza ln",
        text: [
          "`e` to szczególna liczba, około 2,718. `ln(x)` (logarytm naturalny) to wykładnik, do którego trzeba podnieść e, żeby dostać x. Zatem `ln(e³) = 3`.",
          "Oznacza to, że ln i e^ znoszą się nawzajem: `e^(ln x) = x`.",
        ],
        steps: ["Przeciągnij e na ln. Znoszą się nawzajem."],
      },
      {
        title: "Logarytm iloczynu",
        text: ["Przy mnożeniu potęg e wykładniki się dodają. Dlatego logarytm iloczynu to suma logarytmów: `ln(2x) = ln(2) + ln(x)`."],
        steps: ["Wyciągnij 2 spod ln. Dostaje swój własny ln."],
      },
      {
        title: "Logarytm potęgi",
        text: ["`x³` to `x·x·x`, więc `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
        steps: ["Przeciągnij 3 przed ln."],
      },
      {
        title: "Rozwiązywanie równań z logarytmami",
        text: ["Żeby wydostać x z wykładnika, zlogarytmuj obie strony. Z `e^x = 5` przenieś e na drugą stronę =. Zmienia się w ln: `x = ln(5)`."],
        steps: ["Przenieś e na drugą stronę =."],
      },
    ],
  },
};
