import type { ChapterTexts } from "..";

export const frChapters: ChapterTexts = {
  shuffle: {
    title: "Ordre des termes",
    blurb: "On peut additionner les termes dans n'importe quel ordre, et calculer directement les nombres.",
  },

  collect: {
    title: "Réduire une expression",
    blurb: "Les termes qui ont les mêmes lettres s'additionnent : 3x + 2x = 5x. Un terme moins lui-même, ça fait 0.",
  },

  distribute: {
    title: "Distributivité",
    blurb:
      "Un nombre devant une parenthèse multiplie chaque terme à l'intérieur. Un facteur commun à tous les termes peut être remis devant : c'est factoriser.",
  },

  brackets: {
    title: "Double distributivité",
    blurb: "Pour multiplier deux parenthèses, on multiplie chaque terme de la première par chaque terme de la seconde.",
  },

  balance: {
    title: "Résoudre une équation",
    blurb:
      "Si on fait la même chose aux deux membres, l'égalité reste vraie. Un terme qui passe de l'autre côté du = fait l'opération inverse.",
  },

  powers: {
    title: "Puissances",
    blurb: "x³ veut dire x·x·x. Compte les x et tu retrouves toutes les règles sur les puissances.",
  },

  factor: {
    title: "Factorisation",
    blurb: "Factoriser, c'est développer à l'envers. Trouve un facteur commun à tous les termes et mets-le devant une parenthèse.",
  },


  inequalities: {
    title: "Inéquations",
    blurb:
      "On résout une inéquation comme une équation, à une différence près : multiplier ou diviser par un nombre négatif change le sens de l'inégalité.",
  },

  fractions: {
    title: "Calculs avec des fractions",
    blurb:
      "Pour additionner des fractions, il faut d'abord les mettre au même dénominateur. Multiplier le numérateur et le dénominateur par un même nombre ne change pas la valeur d'une fraction.",
  },

  simultaneous: {
    title: "Systèmes d'équations",
    blurb: "Deux équations à deux inconnues, vraies en même temps. Isole une lettre dans une équation, puis remplace-la dans l'autre.",
  },

  roots: {
    title: "Racines carrées",
    blurb: "√x, c'est x à la puissance ½ : les règles sur les puissances marchent donc aussi pour les racines.",
  },

  explog: {
    title: "Exponentielle et logarithme",
    blurb:
      "ln(x) est la puissance de e qui donne x. Donc ln et e^ s'annulent l'un l'autre, et le logarithme d'un produit est une somme de logarithmes.",
  },

  quadratic: {
    title: "Équations du second degré",
    blurb:
      "Une équation avec x² peut avoir deux solutions. Ramène un membre à 0 et écris l'autre sous forme de produit : un produit est nul seulement si l'un de ses facteurs est nul. Ou isole le carré : x² = 9 veut dire x = 3 ou x = −3.",
  },
};
