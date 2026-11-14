import type { ChapterTexts } from "..";

export const esChapters: ChapterTexts = {
  shuffle: {
    title: "Ordenar términos",
    blurb: "Los términos se pueden sumar en cualquier orden, y los números sueltos se pueden operar entre sí.",
  },

  collect: {
    title: "Términos semejantes",
    blurb: "Los términos con las mismas letras se pueden sumar: 3x + 2x = 5x. Un término menos sí mismo da 0.",
  },

  distribute: {
    title: "Propiedad distributiva",
    blurb: "Un número fuera del paréntesis multiplica a cada término de dentro. Y un factor que tienen todos los términos se puede sacar factor común.",
  },

  brackets: {
    title: "Producto de polinomios",
    blurb: "Para multiplicar dos paréntesis, multiplica cada término del primero por cada término del segundo.",
  },

  balance: {
    title: "Resolver ecuaciones",
    blurb: "Si haces lo mismo en los dos miembros, la igualdad se mantiene. Un término que pasa al otro lado del = hace lo contrario: si sumaba, pasa restando.",
  },

  powers: {
    title: "Potencias",
    blurb: "x³ significa x·x·x. Si cuentas las x, puedes deducir tú mismo las propiedades de las potencias.",
  },

  factor: {
    title: "Factorización",
    blurb: "Factorizar es lo contrario de desarrollar. Busca un factor que tengan todos los términos y sácalo delante de un paréntesis.",
  },

  formulas: {
    title: "Despejar en fórmulas",
    blurb: "Una fórmula es una ecuación con varias letras. Para despejar una de ellas, usa los mismos movimientos que con la x.",
  },

  inequalities: {
    title: "Inecuaciones",
    blurb:
      "Las inecuaciones se resuelven como las ecuaciones, con una diferencia: al multiplicar o dividir por un número negativo, la desigualdad cambia de sentido.",
  },

  fractions: {
    title: "Fracciones",
    blurb:
      "Para sumar fracciones, primero hay que reducirlas a común denominador. Multiplicar el numerador y el denominador por el mismo número no cambia el valor de la fracción.",
  },

  simultaneous: {
    title: "Sistemas de ecuaciones",
    blurb: "Dos ecuaciones con dos incógnitas que se cumplen a la vez. Despeja una letra en una de las ecuaciones y sustitúyela en la otra.",
  },

  roots: {
    title: "Radicales",
    blurb: "√x es x elevado a ½, así que las propiedades de las potencias también sirven para las raíces.",
  },

  explog: {
    title: "Exponenciales y logaritmos",
    blurb:
      "ln(x) es el exponente al que hay que elevar e para obtener x. Por eso ln y e^ se anulan entre sí, y el logaritmo de un producto es la suma de los logaritmos.",
  },
};
