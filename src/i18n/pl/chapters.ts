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
    blurb: "Liczba przed nawiasem mnoży każdy wyraz w nawiasie.",
  },

  brackets: {
    title: "Mnożenie sum algebraicznych",
    blurb: "Żeby pomnożyć dwa nawiasy, pomnóż każdy wyraz z pierwszego nawiasu przez każdy wyraz z drugiego.",
  },

  balance: {
    title: "Równania",
    blurb: "Gdy z obiema stronami zrobisz to samo, równanie dalej jest prawdziwe. To, co przechodzi na drugą stronę =, robi tam coś odwrotnego: plus staje się minusem, mnożenie dzieleniem, pierwiastek potęgą, a logarytm potęgą.",
  },

  powers: {
    title: "Potęgi",
    blurb: "x³ oznacza x·x·x. Policz iksy, a odkryjesz prawa działań na potęgach.",
  },

  factor: {
    title: "Rozkład na czynniki",
    blurb: "Rozkład na czynniki to zapisanie sumy w postaci iloczynu. Czynnik, który ma każdy wyraz, wystarczy zapisać raz, przed nawiasem: 3x + 3y = 3(x + y).",
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
  quadratic: {
    title: "Równania kwadratowe",
    blurb:
      "Równanie z x² może mieć dwa rozwiązania. Doprowadź do tego, żeby po jednej stronie było 0, a drugą stronę zapisz jako iloczyn: iloczyn jest równy 0 tylko wtedy, gdy któryś z czynników jest zerem. Albo zostaw sam kwadrat po jednej stronie: x² = 9 oznacza x = 3 lub x = −3.",
  },

  roots: {
    title: "Pierwiastki",
    blurb: "√x to x do potęgi ½, a ∛x to x do potęgi ⅓, więc prawa działań na potęgach działają też dla pierwiastków.",
  },

  explog: {
    title: "Funkcja wykładnicza i logarytmy",
    blurb:
      "ln(x) to wykładnik, do którego trzeba podnieść e, żeby dostać x. Dlatego ln i e^ znoszą się nawzajem, a logarytm iloczynu to suma logarytmów.",
  },
};
