import type { ChapterTexts } from "..";

export const plChapters: ChapterTexts = {
  shuffle: {
    title: "Porządkowanie wyrazów",
    blurb: "Wyrazy sumy można dodawać w dowolnej kolejności, a same liczby można od razu obliczyć.",
  },

  collect: {
    title: "Wyrazy podobne",
    blurb: "Wyrazy z tymi samymi literami można do siebie dodawać: 3x + 2x = 5x. Wyraz minus ten sam wyraz daje 0.",
  },

  distribute: {
    title: "Rozdzielność mnożenia",
    blurb: "Liczba przed nawiasem mnoży każdy wyraz w nawiasie. Czynnik, który mają wszystkie wyrazy, można z powrotem wyłączyć przed nawias.",
  },

  brackets: {
    title: "Mnożenie sum algebraicznych",
    blurb: "Żeby pomnożyć dwa nawiasy, pomnóż każdy wyraz z pierwszego nawiasu przez każdy wyraz z drugiego.",
  },

  balance: {
    title: "Równania",
    blurb: "Gdy z obiema stronami zrobisz to samo, równanie dalej jest prawdziwe. Wyraz przeniesiony na drugą stronę = zmienia działanie na przeciwne.",
  },

  powers: {
    title: "Potęgi",
    blurb: "x³ oznacza x·x·x. Policz iksy, a odkryjesz prawa działań na potęgach.",
  },

  factor: {
    title: "Rozkład na czynniki",
    blurb: "Rozkład na czynniki to wymnażanie na odwrót. Znajdź czynnik, który ma każdy wyraz, i wyłącz go przed nawias.",
  },

  formulas: {
    title: "Przekształcanie wzorów",
    blurb: "Wzór to równanie z kilkoma literami. Żeby wyznaczyć z niego jedną literę, użyj tych samych ruchów co przy x.",
  },

  inequalities: {
    title: "Nierówności",
    blurb:
      "Nierówności rozwiązuje się jak równania, z jedną różnicą: mnożenie lub dzielenie przez liczbę ujemną zmienia zwrot nierówności.",
  },

  fractions: {
    title: "Ułamki",
    blurb:
      "Żeby dodać ułamki, najpierw sprowadź je do wspólnego mianownika. Pomnożenie licznika i mianownika przez tę samą liczbę nie zmienia wartości ułamka.",
  },

  simultaneous: {
    title: "Układy równań",
    blurb: "Dwa równania z dwiema niewiadomymi, prawdziwe jednocześnie. Wyznacz jedną literę z jednego równania i podstaw ją do drugiego.",
  },

  roots: {
    title: "Pierwiastki",
    blurb: "√x to x do potęgi ½, więc prawa działań na potęgach działają też dla pierwiastków.",
  },

  explog: {
    title: "Logarytmy",
    blurb:
      "ln(x) to wykładnik, do którego trzeba podnieść e, żeby dostać x. Dlatego ln i e^ znoszą się nawzajem, a logarytm iloczynu to suma logarytmów.",
  },
};
