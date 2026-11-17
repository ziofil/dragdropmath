import type { ChapterTexts } from "..";

export const ptChapters: ChapterTexts = {
  shuffle: {
    title: "Ordem dos termos",
    blurb: "Numa soma, os termos podem vir em qualquer ordem, e as contas só com números podem ser feitas.",
  },

  collect: {
    title: "Termos semelhantes",
    blurb: "Termos com as mesmas letras podem ser somados: 3x + 2x = 5x. Um termo menos ele mesmo dá 0.",
  },

  distribute: {
    title: "Propriedade distributiva",
    blurb: "Um número fora dos parênteses multiplica cada termo de dentro.",
  },

  brackets: {
    title: "Multiplicação de polinômios",
    blurb: "Para multiplicar dois parênteses, multiplique cada termo do primeiro por cada termo do segundo.",
  },

  balance: {
    title: "Resolução de equações",
    blurb:
      "Faça a mesma coisa nos dois membros e a igualdade continua valendo. O que passa para o outro lado do = faz o contrário lá: o mais vira menos, a multiplicação vira divisão, a raiz vira potência, o log vira potência.",
  },

  powers: {
    title: "Potências",
    blurb: "x³ quer dizer x·x·x. Conte os x e você descobre sozinho as propriedades das potências.",
  },

  factor: {
    title: "Fatoração",
    blurb: "Fatorar é escrever uma soma como um produto. Um fator que está em todos os termos pode aparecer uma vez só, na frente dos parênteses: 3x + 3y = 3(x + y).",
  },

  formulas: {
    title: "Isolando variáveis",
    blurb: "As fórmulas da Física, reorganizadas: isole qualquer grandeza e junte duas fórmulas numa só.",
  },

  inequalities: {
    title: "Inequações",
    blurb: "Resolva inequações como equações, com uma diferença: ao multiplicar ou dividir por um número negativo, o sinal se inverte.",
  },

  fractions: {
    title: "Frações",
    blurb:
      "Para somar frações, primeiro deixe os denominadores iguais. Multiplicar o numerador e o denominador pelo mesmo número não muda o valor da fração.",
  },

  simultaneous: {
    title: "Sistemas de equações",
    blurb: "Duas equações com duas incógnitas, as duas valendo ao mesmo tempo. Isole uma letra numa equação e substitua na outra.",
  },

  quadratic: {
    title: "Equações do 2º grau",
    blurb:
      "Uma equação com x² pode ter duas soluções. Deixe um dos membros igual a 0 e escreva o outro como um produto: um produto só dá 0 quando um dos fatores é 0. Ou isole o quadrado: x² = 9 quer dizer x = 3 ou x = −3.",
  },

  roots: {
    title: "Radicais",
    blurb: "√x é x elevado a ½, e ∛x é x elevado a ⅓, então as propriedades das potências valem também para as raízes.",
  },

  explog: {
    title: "Exponenciais e logaritmos",
    blurb:
      "ln(x) é o expoente a que se eleva o e para obter x. Por isso ln e e^ desfazem um ao outro, e o logaritmo de um produto é a soma dos logaritmos.",
  },
};
