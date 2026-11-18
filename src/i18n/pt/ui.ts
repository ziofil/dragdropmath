import type { Translation } from "../en";


export const pt: Translation = {
  htmlLang: "pt-BR",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
  language: "Idioma",

  // Top bar
  makeExercises: "Criar exercícios",
  skin: "Tema",
  skins: { modern: "Moderno", codex: "Codex", paper: "Papel", blackboard: "Lousa" },
  settings: "Configurações",
  numbersInColour: "Números coloridos",
  debugMode: "Modo de depuração",
  sandboxInput: "Expressão ou equação",
  sandboxPlaceholder: "ex.: 3(x - 2) = 2x + 1   ou   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Carregar",
  debugOn: "O modo de depuração está ligado: toque para desligar",

  // Home
  heroBefore: "Álgebra na ponta dos ",
  heroWord: "dedos",
  heroAfter: ".",
  heroText:
    "Arraste qualquer parte de uma equação. Ela só se mexe do jeito que a matemática permite. Transforme a equação até ela ficar igual ao objetivo.",
  learningPath: "Trilha de aprendizagem",
  chapterNodeLabel: (n: number, title: string) => `Capítulo ${n}: ${title}`,
  chapterN: (n: number) => `Capítulo ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Usa o que você viu em ${titles}.`,
  startLesson: "Começar a lição →",

  // Chapter page
  backToPath: "← Trilha de aprendizagem",
  level: { easy: "Fácil", medium: "Médio", hard: "Difícil" },
  makingExercise: "Montando um exercício…",
  anotherOne: "Outro →",
  progressHere: "Seu progresso fica guardado só neste navegador. Salve-o num arquivo para não perdê-lo ou para levá-lo a outro aparelho.",
  saveProgress: "Exportar o progresso para um arquivo",
  loadProgress: "Carregar o progresso de um arquivo",
  progressSaved: "Pronto, salvo. Carregue esse arquivo aqui, ou em qualquer navegador, para recuperar o seu progresso.",
  rightsReserved: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Todos os direitos reservados.`,
  aboutLink: "Sobre",
  about: {
    title: "Sobre o DragDropMath",
    sections: [
      {
        heading: "O que é",
        text: [
          "O DragDropMath é álgebra que se faz com as mãos. Você arrasta qualquer parte de uma expressão ou equação, e ela só se mexe do jeito que a matemática permite. Um movimento errado simplesmente não acontece: assim você aprende o que é permitido sentindo, e não decorando regras.",
          "Há uma trilha de aprendizagem que vai da ordem dos termos até as equações do 2º grau. Cada capítulo tem uma lição, prática em três níveis e exercícios de “De cabeça”, em que você imagina a resposta antes de resolver. Professores podem montar suas próprias listas de exercícios e compartilhá-las por um link.",
        ],
      },
      {
        heading: "Quem fez",
        text: ["O DragDropMath foi feito por Filippo Miatto, para que a álgebra seja algo que se vê e se toca, e não uma lista de regras para decorar."],
      },
      {
        heading: "Sua privacidade",
        text: [
          "Não há contas, nem anúncios, nem rastreamento. Seu progresso fica guardado só no seu navegador, e nada do que você faz é enviado para lugar nenhum. Nas Configurações, você pode salvá-lo num arquivo, para não perdê-lo ou para levá-lo a outro aparelho.",
          "Uma lista de exercícios fica inteira dentro do link: nada dela é guardado na internet.",
        ],
      },
    ],
  },
  progressNotABackup: "Esse arquivo não é um arquivo de progresso do DragDropMath.",
  progressReplace: (saved: string) => `Isto substitui o seu progresso neste navegador pelo do arquivo${saved ? ` (salvo em ${saved})` : ""}. Carregar?`,
  progressLoadIt: "Carregar",
  cancel: "Cancelar",
  progressNoRoom: "Seu navegador não conseguiu guardá-lo, então nada foi alterado.",
  progressBlocked: "Este navegador não está guardando nada deste site (uma janela anônima, ou o armazenamento desativado), então não há progresso para salvar.",
  showMove: "Mostrar",
  lesson: "Lição",
  practice: "Prática",
  predict: "De cabeça",
  scores: "Pontuação em «De cabeça»",
  scoreOf: (n: number) => `pontuação ${n}`,
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) => `Pontuação no nível ${level}: ${now}${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  drills: {
    commute: { name: "Trocar a ordem", how: "Arraste um termo para além do vizinho. Com + e ×, a ordem não importa.", text: ["A ordem das parcelas não altera a soma: `2 + x` e `x + 2` são a mesma coisa.", "Cada parte de uma soma se chama termo. Um termo leva o seu sinal junto quando muda de lugar: em `5 − 3 + x`, o menos pertence ao 3."] },
    combine: { name: "Somar números", how: "Solte um número sobre o outro para somá-los.", text: ["Dois números de uma mesma soma podem ser somados. Uma letra representa um número que ainda não conhecemos, então ela fica como está."] },
    "multiply-numbers": { name: "Multiplicar números", how: "Solte o número da direita sobre o outro número que ele multiplica.", text: ["Na multiplicação a ordem também não importa: `2·x·5` é `2·5·x`. Então dá para multiplicar o 2 pelo 5, e fica `10x`."] },
    collect: { name: "Juntar termos semelhantes", how: "Solte um termo sobre um termo semelhante, com as mesmas letras e os mesmos expoentes. Eles se somam.", text: ["`3x` quer dizer `x + x + x`. Então `3x + 2x` é três x mais dois x: `5x`.", "Só termos semelhantes se somam: termos com exatamente as mesmas letras, com os mesmos expoentes. `3x + 2` não pode virar `5x`, os termos em x e os termos em y ficam separados, e `x²` e `3x` também."] },
    "collect-cancel": { name: "Cancelar opostos", how: "Solte um termo sobre o seu oposto. Eles se cancelam.", text: ["Subtrair funciona do mesmo jeito: `5y − 2y` é `3y`. Qualquer coisa menos ela mesma dá 0, então `a + b − a` é só `b`."] },
    distribute: { name: "Aplicar a distributiva", how: "Solte o número da frente sobre os parênteses: ele multiplica cada termo de dentro. Depois toque no · para fazer a conta.", text: ["`2(x + 3)` quer dizer 2 vezes `(x + 3)`: 2 vezes o x mais 2 vezes o 3, `2x + 2·3`. O número de fora multiplica cada termo de dentro.", "Pense num retângulo de altura 2 e largura `x + 3`. As duas partes dele têm áreas `2·x` e `2·3`, e juntas formam o retângulo inteiro."] },
    "distribute-neg": { name: "Menos antes dos parênteses", how: "Solte o menos sobre os parênteses. Todos os sinais de dentro se invertem.", text: ["`−(x − 4)` quer dizer −1 vezes os parênteses. O −1 multiplica cada termo, então todos os sinais de dentro se invertem."] },
    "factor-out": { name: "Colocar em evidência", how: "Os dois termos têm um fator comum. Pressione e segure esse fator num dos termos e arraste-o para fora, à esquerda de tudo.", text: ["Fatorar uma soma é escrevê-la como um produto. Em `3x + 3y`, os dois termos são alguma coisa vezes 3. Então o 3 pode ser escrito uma vez só, na frente de parênteses com o que sobra de cada termo: `3x + 3y = 3(x + y)`.", "Isso vale porque, aplicando a distributiva em `3(x + y)`, voltamos a `3x + 3y`: o 3 multiplica cada termo de dentro. É assim também que se confere uma fatoração."] },
    "split-exponent": { name: "Separar um expoente", how: "Puxe um termo para fora do expoente. A potência se separa em duas potências de mesma base.", text: ["`2^(x + 3)` é o 2 multiplicado por ele mesmo x + 3 vezes: x vezes, e depois mais 3. Então é `2^x·2^3`: uma soma no expoente vira um produto de potências."] },
    "merge-powers": { name: "Mesma base: somar expoentes", how: "Solte uma potência sobre a outra, ou toque no · entre elas. Os expoentes se somam: toque no + para fazer a conta.", text: ["`x³` quer dizer `x·x·x`. O número pequeno, o expoente, conta quantos x há.", "Então `x²·x³` é dois x vezes três x: cinco x ao todo. Ao multiplicar potências de mesma base, somam-se os expoentes."] },
    "power-to-product": { name: "Quadrado como produto", how: "Toque no ² para escrever os parênteses duas vezes. Depois aplique a distributiva como no exemplo anterior (para levar um fator sozinho, mantenha-o pressionado: um toque rápido pega o termo inteiro) e junte os termos semelhantes.", text: ["`(x + 1)²` é `(x + 1)(x + 1)`, então se multiplica do mesmo jeito."] },
    "move-denominator": { name: "Multiplicar os dois membros", how: "Passe o denominador da fração para o outro lado do =. Ele multiplica o outro membro. Depois toque no · para fazer a conta.", text: ["O denominador de uma fração passa para o outro lado multiplicando. Em `x/3 = 4`, multiplique os dois membros por 3: `x = 4·3`."] },
    "move-sign": { name: "Passar um menos", how: "Passe só o menos para o outro lado do =. O outro membro troca de sinal.", text: ["Um menos na frente de um membro inteiro também pode passar para o outro lado: os dois membros são multiplicados por −1, então `−x = 6` vira `x = −6`."] },
    "swap-sides": { name: "Trocar os membros", how: "Arraste um membro para o outro lado do =, até depois da outra ponta. Os dois membros trocam de lugar.", text: ["`7 = x` e `x = 7` dizem a mesma coisa, então os dois membros podem trocar de lugar."] },
    "letter-in": { name: "Letra vezes parênteses", how: "Solte a letra da frente sobre os parênteses. Depois mantenha pressionada uma das duas letras lado a lado e solte-a sobre a outra: `x·x` é `x²`. (Um toque rápido pegaria o termo inteiro.)", text: ["A letra multiplica cada termo de dentro, do mesmo jeito que um número: `x(x + 3) = x·x + x·3`. E `x·x` é uma potência, `x²`, como em Potências."] },
    "zero-product": { name: "Produto igual a zero", how: "Puxe um dos parênteses para baixo, para fora do produto: a equação se divide em duas, porque ou esses parênteses valem 0 ou os outros valem. Depois resolva cada uma.", text: ["Um produto só dá 0 quando um dos fatores é 0: `3·0 = 0`, mas `3·2` não. Então `(x − 2)(x + 3) = 0` quer dizer `x − 2 = 0` ou `x + 3 = 0`: duas soluções.", "É por isso que nunca se dividem os dois membros por algo que pode valer 0: aqui, você perderia uma solução."] },
    "take-out-then-split": { name: "Pôr a letra em evidência e separar", how: "Segure a letra de um termo e arraste-a para fora, à esquerda de tudo. Depois puxe-a para baixo, para fora do produto.", text: ["Quando não há termo independente, todos os termos têm x: coloque-o em evidência, `x² − 3x = x(x − 3)`. Agora é um produto igual a 0, então `x = 0` ou `x − 3 = 0`."] },
    "split-middle": { name: "Fatorar e separar", how: "Toque no termo do meio: ele se desmembra em dois. Coloque um fator em evidência em cada par e depois os parênteses que eles têm em comum. Por fim, puxe um dos parênteses para baixo, para fora do produto.", text: ["`x² + x − 6` é o produto de dois parênteses: `(x + 3)(x − 2)`. Os dois números têm produto `−6` e soma `1`, o coeficiente de x. Quando a equação vira um produto igual a 0, cada parêntese dá uma solução."] },
    "power-of-power": { name: "Potência de potência", how: "Solte o expoente de fora sobre o de dentro. Eles se multiplicam: toque no · para fazer a conta.", text: ["`(x²)³` é `x²·x²·x²`. São 2 + 2 + 2 = 6 x, então os expoentes se multiplicam."] },
    "factor-shared": { name: "Fator em comum", how: "Pressione e segure o `x` de um termo e solte-o sobre outro termo que tenha `x`: ele fica em evidência para os dois. Depois coloque em evidência o que os dois últimos termos têm em comum (muitas vezes um número) e, por fim, os parênteses que os dois produtos têm em comum.", text: ["Com quatro termos, trabalhe aos pares. Coloque um fator comum em evidência nos dois primeiros termos e depois nos dois últimos. Se os dois parênteses forem iguais, coloque os parênteses em evidência também."] },
    "ineq-move-term": { name: "Passar um termo", how: "Passe o número para o outro lado do sinal de desigualdade. Ele troca de sinal, e o sinal de desigualdade continua o mesmo. Depois toque no − para fazer a conta.", text: ["`x < 7` diz que x é menor que 7. A abertura do sinal fica virada para o número maior.", "Somar ou subtrair o mesmo valor nos dois membros mantém o sinal como está. Então um termo passa para o outro lado do mesmo jeito que numa equação."] },
    "ineq-swap": { name: "Trocar os membros", how: "Arraste um membro para além do outro. O sinal de desigualdade vira junto.", text: ["`3 > x` e `x < 3` dizem a mesma coisa: x é menor que 3. Então os membros podem trocar de lugar, desde que o sinal vire junto."] },
    "ineq-sign": { name: "Passar um menos", how: "Passe só o menos para o outro lado. O sinal de desigualdade se inverte.", text: ["Multiplicar por −1 inverte a ordem: `2 < 3`, mas `−2 > −3`. Por isso, quando um menos passa para o outro lado, o sinal se inverte."] },
    "add-fractions": { name: "Somar frações", how: "Os denominadores são iguais: solte uma fração sobre a outra, ou toque no + entre elas. Depois toque no + do numerador para somar.", text: ["`3/4` quer dizer 3 quartos. Quando os denominadores são iguais, basta somar os numeradores: 1 quinto mais 2 quintos são 3 quintos, então `1/5 + 2/5 = 3/5`."] },
    "expand-fraction": { name: "Igualar denominadores", how: "Pressione e segure o denominador de uma fração e solte-o sobre a outra fração; depois faça o contrário: agora as duas têm o mesmo denominador. Toque em cada · para calcular numeradores e denominadores e depois some as frações.", text: ["Multiplicar o numerador e o denominador pelo mesmo número não muda a fração: `1/2 = 2/4 = 3/6`.", "É assim que se igualam os denominadores. Para somar `1/2 + 1/3`, multiplique o numerador e o denominador de `1/2` por 3, e os de `1/3` por 2: agora as duas estão em sextos."] },
    "multiply-fractions": { name: "Multiplicar frações", how: "Toque no · entre as frações, ou solte uma sobre a outra: numerador vezes numerador, denominador vezes denominador.", text: ["Multiplicar é mais simples: multiplique os numeradores e multiplique os denominadores. A metade de um terço é `(1·1)/(2·3) = 1/6`."] },
    "split-fraction": { name: "Separar uma fração", how: "Puxe um termo para fora do numerador. Ele leva junto uma cópia do denominador.", text: ["Uma soma no numerador pode ser separada em uma fração para cada termo, todas com o mesmo denominador: `(x + 5)/6 = x/6 + 5/6`."] },
    "join-powers": { name: "Juntar raízes", how: "Solte uma raiz sobre a outra. Elas ficam sob um único radical.", text: ["`√2·√3` ao quadrado dá `2·3`, então `√2·√3` é o número positivo cujo quadrado é 6: `√(2·3) = √6`. Duas raízes de mesmo índice se juntam numa só.", "O mesmo vale para qualquer expoente em comum: `x³y³` é xxx·yyy, que é xy·xy·xy, ou seja, `(xy)³`."] },
    "root-notation": { name: "Raiz como potência", how: "Toque na raiz para escrevê-la como potência: √ é uma potência de expoente ½, e ∛ uma potência de expoente ⅓.", text: ["Toda raiz é uma potência: `√x = x^(1/2)`, `∛x = x^(1/3)`, e a raiz n-ésima de x é `x^(1/n)`. Então todas as propriedades das potências valem também para as raízes: `√x·√x = x^(1/2 + 1/2) = x`."] },
    "fraction-power": { name: "Raízes e potências juntas", how: "Solte a raiz sobre a potência: os expoentes se somam. Depois some as frações do expoente.", text: ["`√x` é `x^(1/2)`, então `√x·x² = x^(1/2 + 2) = x^(5/2)`. Um expoente fracionário funciona como qualquer outro: para multiplicar potências, somam-se os expoentes."] },
    "exp-of-log": { name: "A potência desfaz o log", how: "Solte a base sobre o log que está no expoente dela. Um desfaz o outro.", text: ["`e` é um número especial, aproximadamente 2,718. `ln(x)` é o expoente a que se eleva o e para obter x, então ln e e^ desfazem um ao outro: `e^(ln x) = x`. Logaritmos em outras bases funcionam do mesmo jeito: `2^(log₂ x) = x`."] },
    "evaluate-log": { name: "Logaritmos conhecidos", how: "Toque no log para calculá-lo: `ln(e) = 1`, e o logaritmo de 1 é 0.", text: ["`ln(e) = 1`, porque `e¹ = e`. E o logaritmo de 1 é 0, porque `e⁰ = 1`."] },
    "power-of-base": { name: "Potência da base", how: "Toque no número dentro do log para escrevê-lo como potência de 2. Depois arraste o expoente para a frente do log e toque no log.", text: ["Para calcular `log₂(8)`, escreva 8 como potência de 2: `8 = 2³`, então `log₂(8) = 3`."] },
    "log-of-product": { name: "Separar um log", how: "Tire o número de dentro do log. Ele ganha um log só para ele.", text: ["Ao multiplicar potências, somam-se os expoentes. Por isso o logaritmo de um produto é a soma dos logaritmos: `ln(2x) = ln(2) + ln(x)`."] },
    "log-of-root": { name: "Log de uma raiz", how: "Toque na raiz para escrevê-la como potência. Depois arraste o expoente para a frente do log.", text: ["Uma raiz é uma potência, `√x = x^(1/2)`, então o expoente dela sai do log como qualquer outro: `ln(√x) = ½ln(x)`."] },
    "log-of-power": { name: "Expoente para fora do log", how: "Arraste o expoente para a frente do log.", text: ["`x³` é `x·x·x`, então `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."] },
    "power-into-log": { name: "Número para dentro do log", how: "Solte o número da frente sobre o log. Lá dentro, ele vira um expoente.", text: ["Ao contrário também vale: `3ln(x)` é `ln(x³)`."] },
    "combine-logs": { name: "Juntar logs", how: "Solte um log sobre o outro, ou toque no + (ou no −) entre eles. Somar logs multiplica o que está dentro; subtrair, divide.", text: ["Ao contrário também: `ln(a) + ln(b) = ln(ab)`, e `ln(a) − ln(b) = ln(a/b)`."] },
    "move-exponent-term": { name: "Entre expoentes", how: "Os dois membros são potências de mesma base. Passe um termo de um expoente para o outro: ele troca de sinal.", text: ["Quando os dois membros são potências de mesma base, os expoentes são iguais, e eles se equilibram como os dois membros de uma equação.", "`2^(x − 3) = 2^4` vira `2^x = 2^(4 + 3)`: os dois membros foram multiplicados por `2^3`."] },
    "exp-across": { name: "A base para o outro lado", how: "Passe a base para o outro lado do =. Lá ela vira um log.", text: ["Para tirar o x do expoente, aplique o logaritmo nos dois membros. Em `e^x = 5`, o e passa para o outro lado e vira ln: `x = ln(5)`."] },
    "bracket-times-bracket": { name: "Parênteses vezes parênteses", how: "Solte um dos parênteses sobre o outro: ele multiplica os dois termos de dentro. Depois aplique a distributiva em cada termo novo do mesmo jeito: mantenha pressionado um dos fatores e solte-o sobre o outro (um toque rápido pega o termo inteiro). Em seguida, mantenha pressionado um x de `x·x`, solte-o sobre o outro e junte os termos semelhantes.", text: ["Em `(x + 1)(x + 2)`, os primeiros parênteses são um fator só: multiplicam tudo o que está nos segundos, o x e o 2. Depois cada `(x + 1)` é distribuído, um de cada vez.", "Dois termos vezes dois termos dão quatro termos. Depois junte os termos semelhantes: `(x + 1)(x + 2) = x² + 3x + 2`."] },
    "bracket-out": { name: "Parênteses em evidência", how: "Os dois termos têm os mesmos parênteses. Pressione e segure os parênteses num dos termos e arraste-os para fora, à esquerda de tudo.", text: ["Parênteses inteiros podem ser um fator comum. Em `x(x + 2) + 3(x + 2)`, os dois termos têm `(x + 2)`, então ele vai para a frente como qualquer outro fator: `(x + 2)(x + 3)`."] },
    "tap-operator": {
      name: "Toque no sinal entre eles",
      how: "Toque no + entre os dois números: eles se somam, do mesmo jeito que quando você solta um sobre o outro.",
      text: ["Tocar no sinal entre duas partes faz a conta: um + soma, um − subtrai, um · multiplica. É o mesmo que soltar uma sobre a outra: use o que for mais rápido."],
    },
    "multiply-out": {
      name: "Multiplicar os números de um produto",
      how: "Toque no ·: todos os números do produto se multiplicam, e `4x·3` vira `12x`.",
      text: ["Na multiplicação a ordem não importa, então `4x·3` é `4·3·x`. Os números podem ser multiplicados mesmo com uma letra entre eles."],
    },
    "times-zero": {
      name: "Vezes zero",
      how: "Toque no 0: o produto inteiro vira 0. Depois toque no + para fazer a soma.",
      text: ["Qualquer coisa vezes 0 dá 0. Então `0·(x + 4)` é 0, seja qual for o valor de x."],
    },
    "evaluate-power": {
      name: "Calcular uma potência",
      how: "Solte o expoente sobre o número: `2³` vira 8.",
      text: ["`2³` quer dizer `2·2·2`: o número pequeno, o expoente, conta quantas vezes o 2 é multiplicado. Então dá para calcular a potência de um número: `2³ = 8`.", "Já tocar no expoente escreve a potência por extenso: `2³` vira `2·2·2`."],
    },
    "divide-powers": {
      name: "Mesma base: subtrair expoentes",
      how: "Solte a potência do denominador sobre a potência de mesma base no numerador. Os expoentes se subtraem: toque no − para fazer a conta.",
      text: ["`x⁵/x²` tem cinco x em cima e dois embaixo. Dois de cada lado se cancelam, e sobram três em cima: na divisão, subtraem-se os expoentes."],
    },
    "flip-across-bar": {
      name: "Para o outro lado do traço",
      how: "Arraste a potência para o outro lado do traço de fração, de baixo para cima ou de cima para baixo. O expoente troca de sinal.",
      text: ["Com mais x embaixo, o expoente fica menor que zero: `x²/x⁵` é `x^(2 − 5) = x⁻³`, e também é `1/x³`. Então `x⁻³` quer dizer `1/x³`: quando uma potência passa para o outro lado do traço de fração, o expoente troca de sinal, seja qual for o sentido."],
    },
    "power-of-product": {
      name: "Expoente para dentro dos parênteses",
      how: "Arraste o expoente para dentro dos parênteses: cada fator de dentro ganha uma cópia dele. Depois solte o expoente do número sobre o número para fazer a conta.",
      text: ["`(2x)³` é `2x·2x·2x`, que é `2³·x³`. Cada fator de dentro fica com o expoente."],
    },
    "minus-bracket": {
      name: "Menos antes dos parênteses, numa soma",
      how: "Arraste o − da frente dos parênteses sobre eles: todos os sinais de dentro se invertem. (Onde a soma inteira pode se mexer, um toque rápido no − pega a soma: pressione e segure para pegar só o menos.)",
      text: ["`5 − (x + 2)` tira tudo de `x + 2`, o x e o 2. Então o menos inverte todos os sinais de dentro: `5 − x − 2`."],
    },
    "split-number": {
      name: "Decompor um número",
      how: "Toque no número da frente da letra: ele se decompõe em dois fatores, primeiro o que ele tem em comum com o outro número. Toque também no outro número. Depois toque no + entre os termos: o fator comum fica em evidência.",
      text: ["Nem sempre o fator comum aparece. Em `6x + 9`, os dois termos são divisíveis por 3, mas não há nenhum 3 em `6x` para colocar em evidência.", "Toque no 6: ele se decompõe em `3·2`, primeiro o 3 que ele tem em comum com o 9. Agora o 3 aparece: `3·2x + 9 = 3(2x + 3)`."],
    },
    "split-term": {
      name: "Desmembrar o termo do meio",
      how: "Toque na letra do termo do meio: ele se desmembra em dois. (Tocar no número dele decompõe o número.) Depois fatore aos pares, como no exemplo anterior: toque no + entre os dois primeiros termos, depois entre os dois últimos e, por fim, entre os dois produtos.",
      text: ["Para fatorar `x² + 5x + 6`, procure dois números com soma 5 e produto 6: 2 e 3. Escreva `5x` como `2x + 3x`.", "Agora são quatro termos, e eles se fatoram aos pares: `x(x + 2) + 3(x + 2)`, e depois `(x + 2)(x + 3)`."],
    },
    "difference-of-squares": {
      name: "Diferença de dois quadrados",
      how: "Os dois termos são quadrados, e um é subtraído do outro: toque no menos entre eles. (Se os dois termos tiverem um número em comum, o toque coloca esse número em evidência primeiro, `4x² − 4 = 4(x² − 1)`: depois toque no menos de novo.)",
      text: ["Um quadrado menos um quadrado sempre se fatora do mesmo jeito: `a² − b² = (a − b)(a + b)`. Aplique a distributiva para conferir: os termos do meio se cancelam.", "Só funciona com uma diferença, um quadrado menos um quadrado. Uma soma de dois quadrados, como `x² + 9`, não se fatora. Já um quadrado menos um número que não é quadrado perfeito, como `x² − 7`, se fatora, mas com raízes: `(x − √7)(x + √7)`."],
    },
    "cancel-factor": {
      name: "Cancelar um fator comum",
      how: "Solte o número do denominador sobre o mesmo número no numerador (ou o contrário): eles se cancelam.",
      text: ["Um número que multiplica o numerador inteiro e o denominador inteiro se cancela: `(3x)/3` é `x`, porque `3x` dividido por 3 dá x. Em `(3x + 1)/3`, não: o 3 multiplica só uma parte do numerador."],
    },
    "evaluate-fraction": {
      name: "Calcular uma fração",
      how: "Toque no numerador: ele se decompõe, com o denominador primeiro (14 sobre 7 vira `7·2`). Depois solte o 7 de baixo sobre esse 7: eles se cancelam.",
      text: ["Uma fração que dá um número inteiro pode ser calculada: `12/3` é 4, porque `12 = 3·4`, e o 3 de cima se cancela com o 3 de baixo."],
    },
    "divide-numbers": {
      name: "Simplificar uma fração",
      how: "Toque no numerador e depois no denominador: cada um se decompõe, primeiro o fator que eles têm em comum (8 e 12 viram `4·2` e `4·3`). Depois solte um 4 sobre o outro: eles se cancelam.",
      text: ["Para simplificar uma fração, divida o numerador e o denominador pelo mesmo número: `8/12 = 2/3`. O valor dela não muda.", "Decompor os números mostra o que eles têm em comum: `8/12 = (4·2)/(4·3)`, e os 4 se cancelam."],
    },
    "factor-then-cancel": {
      name: "Pôr em evidência e cancelar",
      how: "Pressione e segure o número de um termo do numerador e arraste-o para fora, à esquerda de tudo (ou toque no + entre os termos). Depois solte-o sobre o mesmo número no denominador: eles se cancelam.",
      text: ["Só dá para cancelar um fator do numerador inteiro. Em `(2x + 6)/2`, o 2 é fator de cada termo, então coloque-o em evidência primeiro: `(2(x + 3))/2`. Agora ele é fator do numerador inteiro e se cancela com o denominador."],
    },
    "divide-by-fraction": {
      name: "Dividir por uma fração",
      how: "Arraste o denominador da fração de baixo para cima, até o numerador. Ele multiplica o numerador. Toque no · para fazer a conta e depois cancele o que o numerador e o denominador têm em comum.",
      text: ["O que um número faz depende de quantos traços de fração há acima dele. Em `4/(3/5)`, o 5 está embaixo de dois traços: dividindo uma divisão, ele multiplica. Então ele pode subir para o numerador sem mudar nada: `(4·5)/3`.", "É por isso que dividir por uma fração é multiplicar pela fração invertida: `4/(3/5) = 4·5/3`."],
    },
    "evaluate-root": {
      name: "Calcular uma raiz",
      how: "Toque na raiz para escrevê-la como potência: `√9` é `9^(1/2)`. Depois solte o ½ sobre o 9 para fazer a conta.",
      text: ["`√9` é o número positivo que, multiplicado por ele mesmo, dá 9: 3, já que `3·3 = 9` (−3 também dá, mas √ indica o positivo). Do mesmo jeito, `∛8 = 2`, já que `2·2·2 = 8`.", "Como potência, `√9 = 9^(1/2)`: soltar o ½ sobre o 9 faz a conta, como com qualquer expoente."],
    },
    "pull-out-of-power": {
      name: "Separar uma raiz",
      how: "Tire o número de dentro da raiz: ele ganha uma raiz só para ele. Depois calcule essa raiz: toque nela e solte o ½ sobre o número.",
      text: ["A raiz de um produto é o produto das raízes: `√(4x) = √4·√x = 2√x`."],
    },
    "split-square": {
      name: "Simplificar uma raiz",
      how: "Toque no número dentro da raiz: um quadrado se separa dele (um cubo, numa raiz cúbica). Depois tire-o de dentro da raiz, como no exemplo anterior, e calcule a raiz dele.",
      text: ["Uma raiz que não dá um número inteiro ainda pode ser simplificada. Decomponha o número de dentro de modo que um quadrado se separe: `√12 = √(4·3) = 2√3`."],
    },
    "root-of-power": {
      name: "Raiz de uma potência",
      how: "Toque na raiz para escrevê-la como potência. Solte o expoente de fora sobre o de dentro e toque no · para calcular o produto. Depois cancele o que o numerador e o denominador do expoente têm em comum.",
      text: ["Uma raiz é uma potência, então a raiz de uma potência é uma potência de potência: `∛(x⁶) = (x⁶)^(1/3) = x^(6/3) = x²`. Os expoentes se multiplicam, como em Potências."],
    },
    "rationalise": {
      name: "Tirar a raiz do denominador",
      how: "Arraste a raiz do denominador para cima, até o numerador: o numerador e o denominador são multiplicados por ela. Depois toque no · de baixo e cancele o que sobrar, se der para cancelar alguma coisa.",
      text: ["Multiplicar o numerador e o denominador pelo mesmo número não muda a fração. Escolha a raiz que já está embaixo: `√3·√3 = 3`, então `1/√3 = √3/(√3·√3) = √3/3`. Agora não há mais raiz embaixo do traço."],
    },
    "log-across": {
      name: "Log para o outro lado do =",
      how: "Passe o log para o outro lado do =. Lá ele vira uma potência. Quando for a potência de um número, solte o expoente sobre o número para fazer a conta.",
      text: ["Um log se desfaz com uma potência. Em `ln(x) = 2`, o ln passa para o outro lado e vira e: `x = e²`."],
    },
    "move-term": {
      name: "Passar um termo",
      how: "Passe o número para o outro lado do =. No caminho, ele troca de sinal. Solte-o sobre o número que está lá e a conta é feita na hora; ou solte-o ao lado e toque no − para fazer a conta.",
      text: ["Uma equação diz que dois membros são iguais. Faça a mesma coisa nos dois membros e eles continuam iguais.", "Passar um termo para o outro lado do `=` é exatamente isso. Em `x + 3 = 10`, subtraia 3 dos dois membros: `x = 10 − 3`. É por isso que o `+3` vira `−3` do outro lado."],
    },
    "move-factor": {
      name: "Dividir os dois membros",
      how: "Passe o número da frente da letra para o outro lado do =. Ele divide o outro membro. Depois calcule a fração: toque no numerador para decompô-lo e solte o denominador sobre o fator igual a ele.",
      text: ["Um número que multiplica um membro inteiro passa para o outro lado dividindo. Em `2x = 8`, divida os dois membros por 2: `x = 8/2`, e `8/2 = (2·4)/2 = 4`."],
    },
    "two-steps": {
      name: "Dois passos",
      how: "Passe para o outro lado o número que está sendo somado e solte-o sobre o número que está lá. Depois passe o número da frente da letra e calcule a fração: decomponha o numerador e cancele.",
      text: ["Em `3x + 4 = 19`, o x foi multiplicado por 3 e depois somou-se 4. Para voltar ao x, desfaça na ordem inversa: primeiro tire o 4, depois divida por 3.", "O 3 não pode ir primeiro: ele multiplica só o x, não o membro inteiro."],
    },
    "root-across": {
      name: "Raiz para o outro lado do =",
      how: "Toque na raiz para escrevê-la como potência (½, ou ⅓ para uma ∛) e arraste esse expoente para o outro lado do =: o outro membro fica elevado ao quadrado (ao cubo, para uma ∛). Depois solte o expoente sobre o número para fazer a conta.",
      text: ["Para resolver `√x = 3`, eleve os dois membros ao quadrado: `x = 3²`. Elevar ao quadrado desfaz a raiz quadrada, então a √ some e o outro membro fica elevado ao quadrado. Elevar ao cubo desfaz a raiz cúbica, e assim por diante.", "Escrevendo como potência, `x^(1/2) = 3`, é o ½ que passa para o outro lado e vira um quadrado: é o mesmo movimento."],
    },
    "ineq-move-factor": {
      name: "Dividir os dois membros",
      how: "Passe o número da frente da letra para o outro lado do sinal de desigualdade. Ele divide o outro membro, e o sinal de desigualdade continua o mesmo. Depois calcule a fração: decomponha o numerador e cancele.",
      text: ["Multiplicar ou dividir os dois membros por um número positivo também mantém o sinal como está: de `2x < 8`, vem `x < 8/2`."],
    },
    "ineq-negative": {
      name: "Dividir por um número negativo",
      how: "Passe o número para o outro lado e calcule a fração: o sinal de desigualdade continua o mesmo. Depois passe o menos para o outro lado: o sinal se inverte.",
      text: ["Dividir os dois membros por um número negativo inverte o sinal, assim como multiplicar por −1: `−2x < 6` quer dizer `x > −3`.", "Aqui são dois movimentos que você já conhece: dividir por 2 (o sinal continua o mesmo) e depois passar o menos (o sinal se inverte)."],
    },
    "plus-minus": {
      name: "As duas raízes de um quadrado",
      how: "Passe o 2 para o outro lado do =. Um quadrado tem duas raízes: a equação se divide em duas, uma com + e outra com −. Depois solte cada ½ sobre o número para fazer a conta.",
      text: ["`3² = 9`, e `(−3)² = 9` também. Então `x² = 9` quer dizer `x = 3` ou `x = −3`. Se você esquecer o menos, perde uma solução."],
    },
    "fraction-zero": {
      name: "Fração igual a 0",
      how: "Pegue o denominador da fração pelo + ou pelo − e passe-o para o outro lado do =. Ele multiplica o outro membro: toque no 0, já que 0 vezes qualquer coisa dá 0. Depois passe o número para o outro lado.",
      text: ["Uma fração só vale 0 quando o numerador é 0. O denominador nunca pode ser 0, e a condição depois da equação diz isso: `x ≠ −2` impede que `x + 2` seja 0.", "Então o denominador pode passar para o outro lado multiplicando: `(x − 3)/(x + 2) = 0` dá `x − 3 = 0·(x + 2)`, que é `x − 3 = 0`. Se uma solução não cumprir a condição, ela é riscada."],
    },
    "letter-factor": {
      name: "Dividir por uma letra",
      how: "Passe a letra da frente do x para o outro lado do =. Ela divide o outro membro. Depois solte-a sobre a mesma letra no numerador: elas se cancelam.",
      text: ["Só dá para dividir os dois membros por uma letra quando ela não pode valer 0, e a condição depois da equação diz isso: `a ≠ 0`.", "Nunca divida pelo próprio x: em `x² = 3x`, dividir por x dá `x = 3` e perde a solução `x = 0`. Em vez disso, passe tudo para um membro só e fatore."],
    },
    "alone-first": {
      name: "O caminho completo",
      how: "Nenhuma letra está isolada ainda: passe o x da primeira equação para o outro lado, para ficar `y = …`. Depois substitua o y na outra equação, resolva-a para achar x e substitua o x de volta para achar y.",
      text: ["Este é o método completo, do começo ao fim:", "1. Isole uma letra numa das equações. Escolha a mais fácil: uma letra sem número na frente. Em `x + y = 7`, passe o x para o outro lado: `y = 7 − x`.", "2. Substitua: troque essa letra, na outra equação, pelo que ela vale, entre parênteses. Um menos na frente inverte todos os sinais de dentro.", "3. Resolva a equação que sobrou: ela tem uma letra só.", "4. Substitua o valor encontrado em `y = …` para achar a outra letra."],
    },
    "fraction-of-fractions": {
      name: "Fração de frações",
      how: "Arraste o denominador da fração de baixo para cima, até o numerador; depois arraste o denominador da fração de cima para baixo, até o denominador. Em seguida, toque em cada · para fazer as contas.",
      text: ["Em `(a/b)/(c/d)`, cada um dos quatro números pode atravessar o traço de fração principal e ir para o lugar que tem a mesma quantidade de traços acima dele, sem mudar o valor (como o 5 no exemplo anterior): o d sobe para junto do a, o b desce para junto do c, o c sobe para junto do b e o a desce para junto do d. (A não ser que o a possa valer 0: não se divide por 0.)", "Movendo os dois denominadores, tudo vira uma fração só: `(a·d)/(c·b)`."],
    },
    "minus-number-in": {
      name: "Número negativo na frente",
      how: "Solte o número sobre os parênteses e toque no · para fazer a conta. Depois solte o menos sobre os parênteses: todos os sinais de dentro se invertem.",
      text: ["`−3(x − 2)` quer dizer −1 vezes 3 vezes os parênteses. Multiplique por 3 primeiro: `−(3x − 6)`. Depois o menos inverte todos os sinais de dentro: `−3x + 6`.", "Atenção ao último sinal: `−3` vezes `−2` dá `+6`. Menos vezes menos dá mais."],
    },
    "substitute-back": {
      name: "Substituir de volta",
      how: "Arraste o `x` de `x = …` até o `x` da outra equação. Depois toque no · e no + para calcular o y.",
      text: ["Quando você já sabe o x, a outra equação dá o y: troque o x pelo valor dele e faça as contas. Agora você tem os dois, e esse par é a solução.", "Para conferir, substitua os dois valores na equação que você não usou por último: os dois membros têm que dar o mesmo resultado."],
    },
    "square-both-sides": {
      name: "Elevar os dois membros ao quadrado",
      how: "Toque na raiz para escrevê-la como potência de expoente ½ e arraste o ½ para o outro lado do =: o outro membro fica elevado ao quadrado. Aplique a distributiva, passe tudo para um membro só, fatore e separe, como no exemplo anterior. A solução que não cumpre alguma condição é riscada.",
      text: ["Uma raiz quadrada nunca é negativa, então `√(x + 7) = x + 1` só vale quando `x + 1 ≥ 0`, ou seja, `x ≥ −1`. (E o que está dentro da raiz também não pode ser negativo: `x ≥ −7`.) Essas são as condições, dadas logo no início: elas continuam valendo até o fim.", "Ao elevar os dois membros ao quadrado, elas se perdem: `x + 7 = (x + 1)²` também vale para `x = −3`, onde `x + 1` é negativo. Então a equação elevada ao quadrado dá `x = 2` ou `x = −3`, e o −3 não cumpre uma condição: ele é riscado. A única solução é `x = 2`."],
    },
    "substitute": {
      name: "Substituir",
      how: "Arraste o `y` de `y = …` até o `y` da outra equação: no lugar dele entra o valor de `y`. Agora essa equação só tem x: junte os x e resolva.",
      text: ["`y = 2x` e `x + y = 9` são duas equações com o mesmo x e o mesmo y, as duas valendo ao mesmo tempo. Uma equação com duas incógnitas tem muitas soluções; duas juntas costumam ter uma só.", "`y = 2x` diz que y e 2x são iguais, então dá para trocar y por 2x na outra equação. Sobra uma equação com uma letra só, que você já sabe resolver."],
    },
    "zero-power": {
      name: "Expoente 0",
      how: "Toque no expoente 0: `x⁰` vira 1. Depois toque no + para fazer a soma.",
      text: ["`x³/x³` é 1 (quando x não é 0), e também é `x^(3 − 3) = x⁰`. Então qualquer número diferente de 0, elevado a 0, dá 1."],
    },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Exercício ${label}${solved ? " — resolvido" : ""}`,
  // Guided example
  done: "Pronto.",
  startOver: "Recomeçar",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: lição`,
  nextExercise: "Próximo exercício →",
  exercisesNav: "Exercícios",
  previousTitle: (label: string) => `Anterior: exercício ${label}`,
  previousLabel: (label: string) => `Exercício anterior (${label})`,
  nextTitle: (label: string) => `Próximo: exercício ${label}`,
  nextLabel: (label: string) => `Próximo exercício (${label})`,
  exerciseN: (label: string) => `Exercício ${label}`,
  predictPrompt: "Imagine primeiro: no que isso vai dar?",
  reveal: "Ver a resposta",
  predictedBeforeWrong: (picked: boolean) =>
    `Sua primeira resposta ${picked ? "foi a vermelha" : "estava errada"}. A verde é a certa.`,
  predictedBeforeRight: "Você acertou este de primeira.",
  rightFirstTime: "Acertou de primeira. Agora resolva.",
  revealedNote: "A verde é a certa. Agora resolva.",
  notQuite: "Não foi dessa vez. A verde é a certa. Resolva para ver onde a sua deu errado.",
  solvedBefore: "✓ Você já resolveu este. Pode resolver de novo.",
  makeItLookLike: "Transforme em",
  solveFor: (letters: string[]) => `Encontre ${letters.map((l) => `\`${l}\``).join(" e ")}.`,
  pickFirst: "Escolha uma resposta acima e depois resolva aqui.",
  hint: "Dica",
  nextStep: "Próximo passo",
  noNextStep: "Nenhum passo encontrado a partir daqui: tente Desfazer ou Recomeçar.",
  undo: "Desfazer",
  solvedBang: "Resolvido!",
  where: "com",
  moveCrashed: "Algo deu errado com esse movimento.",
  moveCrashedDetails: "Tente de novo, ou recomece este exercício.",
  pageCrashed: "Algo deu errado nesta página.",
  pageCrashedDetails: "Tente de novo, ou volte para a trilha de aprendizagem. Seu progresso está a salvo.",
  tryAgain: "Tentar de novo",

  // Making a set
  ownTitle: "Seus próprios exercícios",
  ownIntro:
    "Monte uma lista de exercícios, por exemplo para seus alunos, e compartilhe como um link. Em cada exercício, o aluno primeiro imagina o resultado e depois resolve à mão. Nada fica guardado na internet: a lista inteira vai dentro do link.",
  upload: "Enviar um arquivo .yaml",
  startFromExample: "Começar pelo exemplo",
  yamlLabel: "A lista de exercícios, em YAML",
  form: {
    asForm: "Formulário",
    asYaml: "YAML",
    viewLabel: "Escrever a lista como",
    title: "Título",
    moves: "Movimentos permitidos",
    allMoves: "Todos os movimentos",
    upTo: (n: number, title: string) => `Até o ${n}. ${title}`,
    start: (n: number) => `Exercício ${n}: início`,
    goal: (n: number) => `Exercício ${n}: objetivo`,
    remove: (n: number) => `Remover o exercício ${n}`,
    addOne: "Adicionar um exercício",
    fromChapter: "Adicionar exercícios da prática de um capítulo",
    chapter: "Capítulo",
    level: "Nível",
    howMany: "Quantos",
    addMade: (n: number) => `Adicionar ${n}`,
    making: "Montando os exercícios…",
    cantRead: "O YAML desta lista tem um erro, então o formulário não consegue mostrá-la. Corrija-o na versão em YAML ou comece pelo exemplo.",
  },
  check: "Verificar",
  checking: "Verificando se dá para resolver com esses movimentos…",
  unsolvable:
    "Não deu para resolver em 10 passos com esses movimentos. Talvez precise de movimentos de um capítulo mais adiante (`moves:`).",
  solvableIn: (n: number) => `Dá para resolver em ${n} ${n === 1 ? "movimento" : "movimentos"}.`,
  linkLabel: "Link da lista",
  copied: "Copiado",
  copy: "Copiar",
  open: "Abrir",
  makeLink: "Gerar o link",
  fixMarked: "Corrija os exercícios marcados com ✗ e verifique de novo.",
  howToWrite: "Como escrever uma lista",
  formatExample: `title: Um nome para a lista
moves: balance       # opcional: número, id ou título de um capítulo —
                     # os movimentos dele e de todos os anteriores. Sem isso: todos.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # opcional: duas respostas erradas para escolher
    hint: Uma dica curta.     # opcional
    moves: collect            # opcional: movimentos só para este exercício`,
  writeMathsAs: "Escreva a matemática como você digitaria:",
  or: "ou",
  twoEquations: ["Duas equações ao mesmo tempo vão na mesma linha, com", "entre elas."],
  exampleSet: `title: Lição de casa – semana 3
# Movimentos até "Resolução de equações" (número, id ou título de um capítulo). Sem isso: todos.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Duas respostas erradas para escolher (opcional: senão, são criadas automaticamente).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Primeiro sai o 2, depois o 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Este link não funciona",
  brokenLinkText: "Talvez ele tenha sido cortado ao ser copiado. Peça o link de novo ou vá para a trilha de aprendizagem.",
  learningPathButton: "Trilha de aprendizagem",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} de ${total} resolvidos · `,
    ` ${stars} acertados de primeira. Em cada um, primeiro imagine a resposta e depois resolva à mão.`,
  ],
  makeOwnSet: "Monte sua própria lista",
  ofCount: (n: number, count: number) => `${n} de ${count}`,
  backToSet: (title: string) => `Voltar para ${title}`,

  // Checking a set (shown to whoever writes one)
  set: {
    defaultTitle: "Meus exercícios",
    badYaml: (msg: string) => `Isto não é um YAML válido: ${msg}`,
    expectedTop: "Era esperado `title:` e `exercises:` no início.",
    noChapter: (name: string) => `Não há nenhum capítulo chamado "${name}" para \`moves:\` (use o número, o id ou o título de um capítulo).`,
    expectedList: "Era esperada uma lista em `exercises:`.",
    emptyList: "A lista em `exercises:` está vazia.",
    needsStart: "Falta um `start:`.",
    needsGoal: "Falta um `goal:`.",
    noChapterShort: (name: string) => `Não há nenhum capítulo chamado "${name}" para \`moves:\`.`,
    cantReadStart: (err: string) => `Não foi possível ler o início: ${err}`,
    cantReadGoal: (err: string) => `Não foi possível ler o objetivo: ${err}`,
    doesntFollow: "Não dá para chegar ao objetivo a partir do início (confira se há algum erro de digitação).",
    noValue: "O início não tem valor para nenhum número (uma divisão por 0?).",
    twoWrong: "`wrong:` deve ter duas respostas erradas.",
    cantReadWrong: (w: string, err: string) => `Não foi possível ler a resposta errada "${w}": ${err}`,
    wrongShape: (w: string, why: string) => `A resposta errada "${w}" não tem a mesma forma do objetivo: ${why}.`,
    wrongIsRight: (w: string) => `A resposta errada "${w}" na verdade está certa.`,
    noDecoys:
      "Não foi possível criar respostas erradas convincentes: acrescente `wrong:`, ou o exercício será resolvido sem escolher a resposta antes.",
    decoysMade: (list: string) => `Respostas erradas criadas para escolher: ${list}.`,
    shapeCount: "tem um número diferente de equações",
    shapeRelation: "é uma expressão onde se espera uma equação, ou o contrário",
    shapeIsolated: (letter: string) => `não diz quanto vale ${letter}`,
  },
};
