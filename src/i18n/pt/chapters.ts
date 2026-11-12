import type { ChapterTexts } from "..";

export const ptChapters: ChapterTexts = {
  shuffle: {
    title: "Ordem dos termos",
    blurb: "Numa soma, os termos podem vir em qualquer ordem, e as contas só com números já podem ser feitas.",
    lesson: [
      {
        title: "A ordem não importa",
        text: [
          "Mudar a ordem das parcelas não muda a soma. `2 + x` e `x + 2` são a mesma coisa.",
          "Cada parte de uma soma se chama termo. Você pode arrastar os termos para a ordem que quiser.",
        ],
        steps: ["Arraste o 2 para depois do x."],
      },
      {
        title: "Cada termo leva o seu sinal",
        text: [
          "Em `5 − 3 + x`, os termos são `5`, `−3` e `x`. O sinal de menos é do 3: quando o 3 se move, o menos vai junto.",
        ],
        steps: ["Arraste o x para o começo. O 3 leva o seu menos junto."],
        watch: "`5 − 3` e `3 − 5` não são a mesma coisa. Quando você move o 3, o menos tem que ir com ele.",
      },
      {
        title: "Somando números",
        text: [
          "Dois números na mesma soma podem ser somados: arraste um até o outro. O x é um número que ainda não conhecemos, então ele fica como está.",
        ],
        steps: ["Arraste o 4 até o 3."],
        after: "3 + 4 = 7. O x fica como está.",
      },
      {
        title: "Multiplicando em qualquer ordem",
        text: [
          "Na multiplicação, a ordem também não importa: `2·x·5` é o mesmo que `2·5·x`. Então você pode multiplicar o 2 pelo 5 e obter 10.",
          "Normalmente escrevemos o número primeiro e não colocamos o ponto: `10·x` se escreve `10x`.",
        ],
        steps: ["Arraste o 5 até o 2."],
      },
    ],
    hints: {
      s1: "Arraste o 2 para depois do x.",
      s2: "Arraste o 4 até o 3.",
      s3: "Arraste um número até o outro.",
      s8: "O 4 leva o seu menos junto.",
      s17: "2 − 7 dá menos que zero.",
      s24: "Coloque primeiro o termo com a e, por último, o número sozinho.",
    },
  },

  collect: {
    title: "Termos semelhantes",
    blurb: "Termos com as mesmas letras podem ser somados: 3x + 2x = 5x. Um termo menos ele mesmo dá 0.",
    lesson: [
      {
        title: "O que quer dizer 3x",
        text: ["`3x` quer dizer `x + x + x`. Então `3x + 2x` é três x mais dois x, ou seja, `5x`."],
        steps: ["Arraste o 2x até o 3x."],
      },
      {
        title: "Só termos semelhantes se somam",
        text: [
          "Termos semelhantes têm exatamente as mesmas letras, e só eles podem ser somados. `3x + 2` não vira `5x`, porque o `2` não tem x. Número sozinho só se soma com número sozinho.",
        ],
        steps: ["Os dois x são termos semelhantes. Arraste o segundo x até o primeiro."],
        after: "O 4 não tem x, então fica como está.",
      },
      {
        title: "Letras diferentes não se somam",
        text: [
          "`x` e `y` podem representar números diferentes, então não dá para simplificar `2x + 3y`. Mas em `2x + 3y + x`, os dois termos em x podem ser somados.",
        ],
        steps: ["Arraste o x até o 2x. O 3y fica como está."],
        after: "Os termos em x e os termos em y ficam separados.",
      },
      {
        title: "Subtraindo",
        text: [
          "A subtração funciona do mesmo jeito: `5y − 2y` é `3y`. Qualquer coisa menos ela mesma dá 0, então `a + b − a` é só `b`.",
        ],
        steps: ["Arraste o −a até o a. Eles se cancelam."],
        watch: "`x + x` é `2x`, e não `x²`. `x²` quer dizer `x·x`, e isso vem mais adiante.",
      },
    ],
    hints: {
      c4: "Qualquer coisa menos ela mesma dá 0.",
      c17: "Trate ab como se fosse uma letra só: 3ab + 2ab funciona como 3x + 2x.",
      c9: "Faça 2·3 primeiro. Depois some os termos em x.",
      c6: "Some os termos em x e depois os termos em y.",
      c27: "Junte os termos em b e depois coloque as letras em ordem, com o número sozinho no final.",
    },
  },

  distribute: {
    title: "Propriedade distributiva",
    blurb:
      "Um número fora dos parênteses multiplica cada termo de dentro. Um fator que aparece em todos os termos pode ser colocado em evidência.",
    lesson: [
      {
        title: "Multiplique cada termo de dentro",
        text: [
          "`2(x + 3)` quer dizer 2 vezes `(x + 3)`. Isso dá 2 vezes x mais 2 vezes 3: `2x + 2·3`. O número de fora multiplica cada termo de dentro.",
          "Pense num retângulo de altura 2 e largura `x + 3`. Divida-o em duas partes: uma tem área `2·x`, a outra `2·3`. Juntas, elas formam o retângulo inteiro.",
        ],
        steps: ["Arraste o 2 até os parênteses. Ele multiplica os dois termos.", "Agora arraste o 2 de 2·3 até o 3."],
      },
      {
        title: "Um menos na frente",
        text: ["`−(x − 4)` quer dizer `−1` vezes os parênteses. O −1 multiplica cada termo, então todos os sinais de dentro trocam."],
        steps: ["Arraste o menos até os parênteses."],
        watch: "Um erro comum é escrever `−(x − 4)` como `−x − 4`. O menos multiplica o 4 também.",
      },
      {
        title: "Colocando um fator em evidência",
        text: [
          "Fazer o caminho de volta se chama fatorar. Se todos os termos têm o fator 3, você pode colocar o 3 em evidência, na frente dos parênteses: `3x + 3y = 3(x + y)`.",
        ],
        steps: ["Os dois termos têm um 3. Arraste um 3 para fora, à esquerda de tudo."],
        after: "Aplique a distributiva de novo e você volta a 3x + 3y.",
      },
      {
        title: "x vezes x",
        text: [
          "Às vezes uma letra é multiplicada por ela mesma: `x(x + 2)` dá `x·x`. Escrevemos isso como `x²` (x ao quadrado). Um quadrado de lado x tem área `x·x`.",
        ],
        steps: ["Arraste o x até os parênteses.", "Arraste um x até o outro."],
      },
    ],
    hints: {
      d1: "Arraste o a até os parênteses.",
      d3: "Coloque o a em evidência: arraste para fora o a de um dos termos.",
      d19: "Arraste o menos até os parênteses.",
      d6: "Arraste o menos até os parênteses.",
      d14: "O menos multiplica cada termo dentro dos parênteses.",
      d18: "O −2 multiplica os dois termos dos parênteses dele.",
      d27: "Cada fator da frente multiplica os dois termos dos seus parênteses. Depois some os termos em y² e os termos em y.",
    },
  },

  brackets: {
    title: "Multiplicação de polinômios",
    blurb: "Para multiplicar dois parênteses, multiplique cada termo do primeiro por cada termo do segundo.",
    lesson: [
      {
        title: "Um parêntese é um fator só",
        text: [
          "Em `(x + 1)(x + 2)`, o primeiro parêntese multiplica o segundo inteiro. Trate `(x + 1)` como um fator só e aplique a distributiva: ele multiplica o `x` e o `2`.",
        ],
        steps: [
          "Arraste o (x + 1) inteiro até o (x + 2). Ele multiplica os dois termos.",
          "Agora arraste o x até o (x + 1) ao lado dele.",
          "Depois arraste o 2 até o seu (x + 1).",
        ],
        after: "Ficam quatro termos: x·x, 1·x, 2·x e 2·1. Junte os termos semelhantes e você obtém x² + 3x + 2.",
      },
      {
        title: "Multiplicando dois parênteses",
        text: [
          "Multiplique cada termo do primeiro parêntese por cada termo do segundo. Dois termos vezes dois termos dão quatro termos. Depois junte os termos semelhantes.",
          "Em `(x + 3)(x − 3)`, os dois termos do meio são `+3x` e `−3x`. Eles se cancelam e sobra `x² − 9`.",
        ],
      },
      {
        title: "O quadrado de um parêntese",
        text: ["`(x + 1)²` é `(x + 1)(x + 1)`, então funciona do mesmo jeito. Toque no ² para escrever por extenso."],
        steps: ["Toque no ² para escrever como um produto."],
        watch:
          "`(x + 1)²` não é `x² + 1`. Teste com x = 2: `(2 + 1)² = 9`, mas `2² + 1 = 5`. A diferença são os dois termos do meio, `x + x = 2x`.",
      },
    ],
    hints: {
      m1: "Arraste o x até os parênteses. Como se escreve x·x?",
      m2: "Arraste um parêntese inteiro até o outro. Depois aplique a distributiva em cada parte.",
      m18: "x·x² são três x multiplicados: x³.",
      m5: "Olhe para os dois termos do meio.",
      m25: "São três fatores. Multiplique dois deles primeiro e depois multiplique pelo terceiro.",
      m7: "Toque no ² para escrever como (x + 2)(x + 2).",
      m9: "Não é só a² + b². Multiplique cada termo por cada termo.",
    },
  },

  balance: {
    title: "Equações do 1º grau",
    blurb:
      "Faça a mesma coisa nos dois membros e a igualdade continua valendo. Um termo que passa para o outro lado do = vai com a operação inversa.",
    lesson: [
      {
        title: "O mesmo nos dois membros",
        text: [
          "Uma equação diz que duas coisas são iguais. Se você fizer a mesma coisa nos dois membros, eles continuam iguais.",
          "Passar um termo para o outro lado do `=` é exatamente isso. Em `x + 3 = 10`, tire 3 dos dois membros: `x = 10 − 3`. É por isso que o `+3` vira `−3` do outro lado.",
        ],
        steps: ["Passe o 3 para o outro lado do =. Ele troca de sinal.", "Arraste o −3 até o 10."],
      },
      {
        title: "Dividindo os dois membros",
        text: [
          "Se um número multiplica um membro inteiro, ele passa para o outro lado dividindo. Em `2x = 8`, divida os dois membros por 2: `x = 8/2`.",
        ],
        steps: ["Passe o 2 para o outro lado do =. Ele divide o outro membro.", "Arraste o 2 até o 8."],
      },
      {
        title: "Frações e sinais de menos",
        text: [
          "Com a divisão também funciona. Em `x/3 = 4`, multiplique os dois membros por 3. O 3 do denominador passa para o outro lado multiplicando.",
          "Um menos na frente de um membro inteiro também pode passar: `−x = 6` vira `x = −6`.",
        ],
        steps: ["Passe o 3 para o outro lado do =."],
      },
      {
        title: "Desfaça na ordem inversa",
        text: [
          "Em `3x + 1`, o x é multiplicado por 3 e depois somamos 1. Para isolar o x, desfaça isso na ordem inversa: passe primeiro o 1, depois o 3.",
        ],
        steps: ["Passe o 1 para o outro lado.", "Faça a conta.", "Passe o 3 para o outro lado.", "Faça a conta."],
        watch: "Tire a prova colocando a resposta de volta na equação: 3·4 + 1 = 13. ✓",
      },
    ],
    hints: {
      b1: "Passe o 3 para o outro lado do =.",
      b10: "Passe o membro da direita inteiro para o outro lado para trocar os membros de lugar, ou resolva do jeito que está.",
      b21: "A resposta pode ser uma fração.",
      b22: "O numerador inteiro está dividido por 2. Passe o 2 para o outro lado primeiro.",
      b7: "Mais rápido: passe o 2 para o outro lado antes de aplicar a distributiva.",
      b12: "Passe o + 1 primeiro.",
      b23: "Um menos na frente dos parênteses troca todos os sinais de dentro.",
    },
  },

  powers: {
    title: "Potências",
    blurb: "x³ quer dizer x·x·x. Conte os x e você descobre sozinho as propriedades das potências.",
    lesson: [
      {
        title: "Multiplicação de potências",
        text: [
          "`x³` quer dizer `x·x·x`. O número pequeno é o expoente: ele diz quantos x estão sendo multiplicados.",
          "Então `x²·x³` são dois x vezes três x: cinco x ao todo. Na multiplicação de potências de mesma base, você conserva a base e soma os expoentes.",
        ],
        steps: ["Mesma base: arraste uma potência até a outra.", "Faça a conta."],
      },
      {
        title: "Potência de potência",
        text: ["`(x²)³` é `x²·x²·x²`. São 2 + 2 + 2 = 6 x, então você multiplica os expoentes."],
        steps: ["Arraste o 3 de fora até o 2 de dentro.", "Faça a conta."],
      },
      {
        title: "Divisão de potências",
        text: [
          "`x⁵/x²` tem cinco x no numerador e dois no denominador. Cancelando dois x em cima e embaixo, sobram três x no numerador. Na divisão, você subtrai os expoentes.",
        ],
        steps: ["Arraste o x² até o x⁵.", "Faça a conta."],
      },
      {
        title: "Expoente zero e expoente negativo",
        text: [
          "`x³/x³` é 1, mas também é `x^(3 − 3) = x⁰`. Por isso, tudo elevado a 0 dá 1.",
          "Se houver mais x no denominador do que no numerador, o expoente fica negativo: `x⁻²` quer dizer `1/x²`. Quando uma potência atravessa o traço da fração, o expoente troca de sinal.",
        ],
        steps: ["Arraste o x³ para cima, atravessando o traço da fração."],
        watch: "`2x³` é `2·x·x·x`: o expoente é só do x. `(2x)³` é diferente: dá `8x³`.",
      },
    ],
    hints: {
      w6: "Arraste o x³ para cima, atravessando o traço da fração.",
      w1: "Mesma base: arraste uma potência até a outra e depois some os expoentes.",
      w11: "x sozinho é x¹.",
      w2: "Arraste o 3 de fora até o 2 de dentro e depois multiplique.",
      w5: "A resposta tem expoente negativo.",
      w3: "Tire o 2 de dentro dos parênteses. Ele também fica elevado ao cubo.",
      w21: "Aplique a distributiva primeiro: x vezes x² dá x³.",
      w25: "Multiplique cada termo por x⁻¹. x⁻¹ vezes x dá x⁰.",
      w30: "Escreva como (x² + 3)(x² + 3) e multiplique cada termo por cada termo.",
    },
  },

  factor: {
    title: "Fatoração",
    blurb: "Fatorar é fazer a distributiva ao contrário. Ache um fator que está em todos os termos e coloque-o em evidência.",
    lesson: [
      {
        title: "A distributiva ao contrário",
        text: [
          "Fatorar desfaz a distributiva. `x² + 3x` é `x·x + 3·x`. Os dois termos têm um `x`, então dá para colocá-lo em evidência: `x(x + 3)`.",
        ],
        steps: [
          "Toque no ² para escrever x² por extenso.",
          "Agora os dois termos têm um x. Arraste um x para fora, à esquerda de tudo.",
        ],
        after: "Para conferir, aplique a distributiva em x(x + 3). Você volta a x² + 3x.",
      },
      {
        title: "Decompondo números",
        text: [
          "Para achar um fator comum, decomponha os números em fatores. Em `2x + 6`, toque no 6 para obter `2·3`. Agora os dois termos têm um 2.",
        ],
        steps: ["Toque no 6 para decompô-lo.", "Arraste um 2 para fora, na frente."],
      },
      {
        title: "Colocando um parêntese em evidência",
        text: [
          "Em `x(x + 2) + 3(x + 2)`, os dois termos têm o mesmo parêntese `(x + 2)`. Ele é um fator comum, então pode ser colocado em evidência como qualquer outro.",
        ],
        steps: ["Arraste o (x + 2) para fora, na frente."],
      },
      {
        title: "Quatro termos: agrupamento",
        text: [
          "Com quatro termos, fatore os dois primeiros e depois os dois últimos. Se os dois parênteses forem iguais, coloque esse parêntese em evidência também.",
        ],
        watch: "Sempre tire a prova de uma fatoração aplicando a distributiva. Tem que dar exatamente o que você tinha no começo.",
      },
    ],
    hints: {
      g5: "Os dois termos têm o mesmo parêntese. Coloque-o em evidência.",
      g1: "Toque no ² para escrever x² como x·x. Aí os dois termos têm um x.",
      g2: "Toque no 6 para decompô-lo em fatores.",
      g15: "Que número divide 6 e 9 ao mesmo tempo?",
      g21: "Escreva o quadrado como um produto. Aí os dois termos têm um (x + 1).",
      g22: "Fatore 2x + 6. Aparece um (x + 3)?",
      g6: "Agrupe em pares: arraste um x do x² até o 2x e depois um 3 até o 6.",
      g29: "Os quatro termos têm o fator 2. Coloque-o em evidência primeiro e depois fatore o resto em pares.",
    },
  },

  formulas: {
    title: "Isolando variáveis",
    blurb: "Uma fórmula é uma equação com várias letras. Use os mesmos movimentos que você usa com o x para isolar uma delas.",
    lesson: [
      {
        title: "Isolando uma letra",
        text: [
          "`v = u + at` dá a velocidade `v` a partir da velocidade inicial `u`, da aceleração `a` e do tempo `t`. Reorganizando, ela dá o tempo: `t = (v − u)/a`.",
          "Deixar uma letra sozinha num membro se chama isolar essa letra. Funciona como resolver uma equação em x: trate as outras letras como se fossem números.",
        ],
        steps: ["O t está multiplicado por a. Primeiro passe o u para o outro lado.", "Agora passe o a. Ele divide o outro membro."],
        after: "Lendo da direita para a esquerda: t = (v − u)/a.",
      },
      {
        title: "Letras se movem como números",
        text: [
          "Uma letra que multiplica um membro inteiro pode passar para o outro lado do `=` dividindo, do mesmo jeito que `2x = 8` virou `x = 8/2`. (Só dá para dividir por uma letra que não seja 0. Nessas fórmulas, ela nunca é.)",
        ],
        steps: ["Passe o m para o outro lado."],
        watch: "Só pode passar para o outro lado um fator do membro inteiro. Em `u + at`, o `a` multiplica só o `t`, então passe o `u` primeiro.",
      },
      {
        title: "Letras no denominador",
        text: [
          "Se um membro inteiro é uma fração, a letra do denominador pode passar para o outro lado multiplicando, do mesmo jeito que `x/3 = 4` virou `x = 4·3`.",
        ],
        steps: ["Passe o A para o outro lado. Ele multiplica o outro membro."],
      },
      {
        title: "Quando a letra aparece duas vezes",
        text: [
          "Em `ax + bx = c`, o x aparece duas vezes, então passar um termo só não isola o x. Coloque o x em evidência primeiro. Depois, o parêntese que multiplica o x pode passar para o outro lado.",
        ],
        steps: ["Os dois termos têm um x. Arraste um x para fora, na frente.", "Agora passe o (a + b) inteiro para o outro lado."],
      },
    ],
    hints: {
      q6: "O A está no denominador. Passe-o para o outro lado.",
      q8: "Passe o u primeiro, depois o a.",
      q16: "O x aparece em dois lugares. Coloque-o em evidência primeiro.",
      q17: "O P está nos dois termos.",
      q22: "Leve os dois termos em x para o mesmo membro e depois coloque o x em evidência.",
    },
  },

  inequalities: {
    title: "Inequações",
    blurb: "Resolva inequações como equações, com uma diferença: ao multiplicar ou dividir por um número negativo, o sinal se inverte.",
    lesson: [
      {
        title: "Menor que e maior que",
        text: ["`x < 7` diz que x é menor que 7. A abertura do sinal fica virada para o número maior."],
        steps: ["Como numa equação, passe o 2 para o outro lado.", "Faça a conta."],
      },
      {
        title: "Trocando os membros de lugar",
        text: [
          "`3 > x` e `x < 3` dizem a mesma coisa: x é menor que 3. Então você pode trocar os dois membros de lugar, desde que inverta o sinal também.",
        ],
        steps: ["Arraste o 3 para o outro lado. O sinal se inverte."],
      },
      {
        title: "Os mesmos movimentos das equações",
        text: [
          "Somar ou subtrair o mesmo valor nos dois membros mantém o sinal. Multiplicar ou dividir os dois membros por um número positivo também.",
        ],
        steps: ["Passe o 2 para o outro lado. Ele é positivo, então o sinal continua o mesmo.", "Faça a conta."],
      },
      {
        title: "Um menos inverte o sinal",
        text: [
          "Multiplicar por −1 inverte a ordem: `2 < 3`, mas `−2 > −3`. Por isso, quando um menos passa para o outro lado, o sinal se inverte.",
        ],
        steps: ["Passe só o menos para o outro lado. O < se inverte."],
        after: "Teste com um número: x = 0 satisfaz tanto −x < 4 quanto x > −4.",
        watch: "Só multiplicar ou dividir por um número negativo inverte o sinal. Passar um termo para o outro lado nunca inverte.",
      },
    ],
    hints: {
      i3: "Passe o menos para o outro lado. O sinal se inverte.",
      i1: "Como numa equação, passe o 3 para o outro lado.",
      i8: "Passe o membro da esquerda inteiro para o outro lado: 5 < x + 2 e x + 2 > 5 dizem a mesma coisa.",
      i5: "Passe primeiro o menos, depois o 2.",
      i26: "Aplique a distributiva primeiro e depois leve os termos em x para o mesmo membro.",
    },
  },

  fractions: {
    title: "Frações",
    blurb:
      "Para somar frações, primeiro deixe os denominadores iguais. Multiplicar o numerador e o denominador pelo mesmo número não muda o valor da fração.",
    lesson: [
      {
        title: "Soma de frações",
        text: [
          "`3/4` quer dizer 3 quartos. Quando os denominadores são iguais, basta somar os numeradores: 1 quinto mais 2 quintos dá 3 quintos, então `1/5 + 2/5 = 3/5`.",
        ],
        steps: ["Os denominadores são iguais. Arraste uma fração até a outra.", "Faça a conta."],
      },
      {
        title: "Frações equivalentes",
        text: [
          "Dividir o numerador e o denominador pelo mesmo número não muda o valor: `6/8 = 3/4`.",
          "Multiplicar o numerador e o denominador pelo mesmo número também não muda: `1/2 = 2/4 = 3/6`.",
        ],
        steps: ["Arraste o 8 até o 6. Os dois são divididos pelo fator comum, 2."],
      },
      {
        title: "Igualando os denominadores",
        text: [
          "Para somar `1/2 + 1/3`, transforme as duas frações em sextos primeiro. Multiplique o numerador e o denominador de `1/2` por 3, e o numerador e o denominador de `1/3` por 2. Agora os dois denominadores são 6.",
        ],
        steps: ["Arraste o 3 de ⅓ até ½: o numerador e o denominador dela são multiplicados por 3."],
        watch: "`1/2 + 1/3` não é `2/5`. Só se somam os numeradores quando os denominadores já são iguais.",
      },
      {
        title: "Multiplicação de frações",
        text: [
          "Multiplicar é mais simples: numerador vezes numerador, denominador vezes denominador. A metade de um terço é `(1·1)/(2·3) = 1/6`.",
        ],
        steps: ["Arraste uma fração até a outra."],
        after: "Depois simplifique os fatores comuns do numerador e do denominador e você chega a 3/2.",
      },
    ],
    hints: {
      f1: "Arraste o 8 até o 6.",
      f2: "Mesmos denominadores: arraste uma fração até a outra.",
      f6: "Tire o 2 do numerador.",
      f5: "Arraste o 3 até o 2.",
      f22: "Fatore o numerador primeiro. Aí o numerador e o denominador têm algo em comum para simplificar.",
      f8: "Arraste o ¾ para cima, atravessando o traço da fração.",
      f3: "Arraste o 3 até ½ e o 2 até ⅓, para igualar os denominadores.",
      f4: "Toque no 6 para decompô-lo em fatores.",
      f17: "Toque no 4 para decompô-lo. 4 é 2·2.",
      f28: "Primeiro transforme 1 + ½ numa fração só.",
    },
  },

  simultaneous: {
    title: "Sistemas de equações",
    blurb: "Duas equações com duas incógnitas, as duas valendo ao mesmo tempo. Isole uma letra numa equação e substitua na outra.",
    lesson: [
      {
        title: "Duas equações ao mesmo tempo",
        text: [
          "`y = 2x` e `x + y = 9` são duas equações com os mesmos x e y. Uma equação com duas incógnitas tem muitas soluções. Duas equações juntas costumam ter só uma.",
          "Para resolver, elimine uma das letras. Sobra uma equação com uma incógnita só, que você já sabe resolver.",
        ],
      },
      {
        title: "Substituição",
        text: ["`y = 2x` diz que y e 2x são iguais. Então você pode trocar y por 2x na outra equação. Isso se chama substituição."],
        steps: ["Arraste o y de y = 2x até o y da outra equação.", "Agora a equação só tem x. Junte os termos em x."],
        after: "Resolva: x = 3. Depois substitua x = 3 em y = 2x para achar o y.",
      },
      {
        title: "Isolando uma letra",
        text: [
          "Para substituir, você precisa de uma equação do tipo `y = …` ou `x = …`. Se não tiver, crie uma: em `x − y = 1`, passe o −y para o outro lado e fica `x = 1 + y`.",
        ],
        steps: [
          "Passe o −y para o outro lado do = na segunda equação.",
          "Agora o x está isolado. Arraste-o até o x da primeira equação.",
        ],
        after: "Agora a primeira equação só tem y: 2y + 1 = 7, então y = 3.",
        watch: "Substitua a expressão inteira. Se x = 1 + y, então 2x é 2(1 + y), e não 2 + y.",
      },
      {
        title: "Achando a outra letra",
        text: [
          "Quando você já sabe o valor de uma letra, por exemplo `x = 3`, substitua na outra equação para achar a outra letra. Arraste o x de `x = 3` até um x da outra equação.",
        ],
      },
    ],
    hints: {
      e1: "y vale 3: arraste o y de y = 3 até o y da outra equação.",
      e4: "Arraste o y de y = 2x até o y da outra equação. Quando souber o x, substitua em y = 2x.",
      e18: "Nenhuma letra está isolada ainda. Passe o −y para o outro lado para obter x = 1 + y. Depois substitua.",
      e21: "Isole o y na primeira equação: y = 5 − x.",
      e27: "x = 1 + y, então 2x vira 2(1 + y). Use o parêntese inteiro.",
    },
  },

  roots: {
    title: "Radicais",
    blurb: "√x é x elevado a ½, então as propriedades das potências valem também para as raízes.",
    lesson: [
      {
        title: "Raiz quadrada",
        text: ["`√9` é o número que, multiplicado por ele mesmo, dá 9. É 3, porque `3·3 = 9`."],
        steps: ["Toque no 9 para decompô-lo em fatores iguais."],
        after: "Depois tire um 3 de dentro da raiz. Quando já tiver entendido como funciona, você pode tocar numa raiz como √9 para calcular de uma vez.",
      },
      {
        title: "Raiz é potência",
        text: [
          "`√x` é `x` elevado a `½`. Então `√x·√x = x^(1/2 + 1/2) = x`. Todas as propriedades das potências valem para as raízes.",
        ],
        steps: ["Toque nela: uma potência de expoente ½ é uma raiz quadrada."],
      },
      {
        title: "Raiz de um produto",
        text: ["A raiz de um produto é o produto das raízes: `√(4x) = √4·√x = 2√x`."],
        steps: ["Tire o 4 de dentro da raiz. Ele ganha uma raiz só para ele."],
        after: "E √4 é 2, então fica 2√x.",
        watch: "A raiz não se distribui numa soma: `√(9 + 16)` é `√25 = 5`, e não `3 + 4`.",
      },
      {
        title: "Desfazendo uma raiz",
        text: [
          "Para resolver `√x = 3`, eleve os dois membros ao quadrado. Toque na raiz para escrevê-la como `x^(1/2)`. Depois passe o ½ para o outro lado do =. Lá ele vira um quadrado.",
        ],
        steps: [
          "Toque na raiz para escrevê-la como potência.",
          "Passe o ½ para o outro lado do =. Ele vira um quadrado.",
          "Faça a conta.",
        ],
      },
    ],
    hints: {
      r2: "Toque nela.",
      r5: "Arraste um √x até o outro. Uma raiz quadrada vezes ela mesma dá o que está dentro.",
      r16: "Trate √3 como uma letra: 2√3 + √3 funciona como 2x + x.",
      r1: "Toque no √ para calcular. Ou toque no 9 para decompô-lo em 3·3 e depois tire um 3 de dentro da raiz.",
      r8: "Toque na raiz para escrevê-la como potência e depois passe o ½ para o outro lado do =.",
      r6: "Toque na raiz para escrevê-la como potência de ½ e depois arraste o ½ até o 2.",
      r3: "Tire o 4 de dentro da raiz. Ele ganha uma raiz só para ele.",
      r20: "x³ é x²·x, e o x² sai da raiz como x.",
      r11: "Isole o √x primeiro.",
      r4: "Toque no 12 para separar um quadrado perfeito.",
      r22: "Tire o 4 primeiro: aí os √x viram termos semelhantes.",
      r29: "Decomponha o 8 para achar um quadrado perfeito lá dentro.",
    },
  },

  explog: {
    title: "Exponenciais e logaritmos",
    blurb:
      "ln(x) é o expoente a que se eleva o e para obter x. Por isso ln e e^ desfazem um ao outro, e o logaritmo de um produto é a soma dos logaritmos.",
    lesson: [
      {
        title: "O que é ln",
        text: [
          "`e` é um número especial, que vale mais ou menos 2,718. `ln(x)` é o expoente a que se eleva o e para obter x. Então `ln(e³) = 3`.",
          "Isso quer dizer que ln e e^ desfazem um ao outro: `e^(ln x) = x`.",
        ],
        steps: ["Arraste o e até o ln. Um desfaz o outro."],
      },
      {
        title: "Logaritmo de um produto",
        text: [
          "Multiplicar potências de e soma os expoentes. Por isso o logaritmo de um produto é a soma dos logaritmos: `ln(2x) = ln(2) + ln(x)`.",
        ],
        steps: ["Tire o 2 de dentro do ln. Ele ganha um ln só para ele."],
      },
      {
        title: "Logaritmo de uma potência",
        text: ["`x³` é `x·x·x`, então `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
        steps: ["Arraste o 3 para a frente do ln."],
      },
      {
        title: "Resolvendo com logaritmos",
        text: [
          "Para tirar o x do expoente, aplique ln nos dois membros. Em `e^x = 5`, passe o e para o outro lado do =. Ele vira ln: `x = ln(5)`.",
        ],
        steps: ["Passe o e para o outro lado do =."],
      },
    ],
    hints: {
      l2: "Arraste o e até o ln.",
      l3: "Arraste o ln até o que está dentro dele.",
      l4: "Arraste o 3 para a frente.",
      l19: "Quando você subtrai logaritmos, divide o que está dentro.",
      l8: "Passe o e para o outro lado do =.",
      l20: "É o mesmo movimento do e, mas o 2 vira log₂.",
      l12: "Uma raiz é uma potência. Arraste o √ para a frente.",
      l15: "e elevado a quanto dá 1?",
      l1: "Arraste o x para a frente do ln. Quanto vale ln(e)?",
      l14: "Primeiro arraste o ½ para dentro do ln.",
      l7: "Toque no 8 para escrevê-lo como potência de 2. Depois arraste o 3 para a frente e toque em log₂(2).",
      l22: "Mesma base: some os expoentes.",
      l23: "Separe o ln primeiro. Quanto vale ln(e)?",
      l26: "Isole a potência primeiro.",
    },
  },
};
