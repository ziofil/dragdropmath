import type { Translation } from "../en";

const TIER = ["", "bronze", "prata", "ouro"];

export const pt: Translation = {
  htmlLang: "pt-BR",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Idioma",

  // Top bar
  makeExercises: "Criar exercícios",
  sandbox: "Laboratório",
  openSandbox: "Abrir o laboratório →",
  sandboxIntro: "Digite qualquer expressão ou equação e experimente todos os movimentos.",
  sandboxInput: "Expressão ou equação",
  sandboxPlaceholder: "ex.: 3(x - 2) = 2x + 1   ou   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Carregar",
  debugOn: "O modo de depuração está ligado (Shift+D)",

  // Home
  heroBefore: "Álgebra na ponta dos ",
  heroWord: "dedos",
  heroAfter: ".",
  heroText:
    "Arraste qualquer parte de uma equação. Ela só se mexe do jeito que a matemática permite. Transforme a equação até ela ficar igual ao objetivo.",
  learningPath: "Trilha de aprendizagem",
  nextUp: "próximo",
  mastered: "dominado",
  everyChapterOpen: "Todos os capítulos estão liberados. As setas mostram uma ordem sugerida.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) =>
    `Capítulo ${n}: ${title}, ${done} de ${total} resolvidos`,
  chapterN: (n: number) => `Capítulo ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Usa o que você viu em ${titles}.`,
  notMasteredYet: (titles: string) => ` Você ainda não domina: ${titles}. Mas pode começar mesmo assim.`,
  startLesson: "Começar a lição →",
  backToLesson: "Voltar à lição →",
  leadsOnTo: (titles: string) => `Prepara para ${titles}.`,
  badges: "Medalhas",
  noBadgesYet: "Faça o teste de qualquer capítulo para ganhar a medalha dele.",
  badgesEarned: (n: number, total: number) => `${n} de ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `Medalha de ${TIER[tier]}`,
  badgeNotEarned: "medalha ainda não conquistada",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? `medalha de ${TIER[tier]}` : "ainda não conquistada"}`,

  // Chapter page
  backToPath: "← Trilha de aprendizagem",
  practiceNote: "Cada exercício é novo, criado só para você. Comece pelos fáceis e suba de nível quando se sentir à vontade.",
  leadsOnToStart: "Prepara para ",
  leadsOnToEnd: ". Você pode ir para lá quando quiser.",
  watchOut: "Atenção.",
  level: { easy: "Fácil", medium: "Médio", hard: "Difícil" },
  anotherOne: "Outro →",
  practice: "Prática",
  testSkills: "Teste o que você aprendeu",
  testNote:
    "Resolva de cabeça e depois escolha a resposta. Os acertos valem a medalha do capítulo: 10 no Fácil para o bronze, no Médio para a prata e no Difícil para o ouro.",
  solvedN: (n: number) => `${n} ${n === 1 ? "resolvido" : "resolvidos"}`,
  testRight: "Acertou! Conta para a medalha.",
  drills: {
    commute: { name: "Trocar a ordem", how: "Arraste um termo para além do termo ao lado. Com + e ×, a ordem não importa." },
    combine: { name: "Somar números", how: "Arraste um número até o outro para somá-los." },
    "multiply-numbers": { name: "Multiplicar números", how: "Arraste um número até o outro número que ele multiplica." },
    "numbers-first": { name: "Número na frente", how: "Toque num produto como `x·3` para escrevê-lo do jeito de sempre, `3x`." },
    "multiply-out": { name: "Calcular um produto", how: "Toque num produto de números, como `2·3`, para calculá-lo." },
    collect: { name: "Juntar termos semelhantes", how: "Arraste um termo até um termo semelhante, com a mesma letra. Eles se somam." },
    "collect-cancel": { name: "Cancelar opostos", how: "Arraste um termo até o seu oposto. Eles se cancelam." },
    distribute: { name: "Aplicar a distributiva", how: "Arraste o número da frente até os parênteses. Ele multiplica cada termo de dentro." },
    "distribute-neg": { name: "Menos antes dos parênteses", how: "Arraste o menos até os parênteses. Todos os sinais de dentro se invertem." },
    "factor-out": { name: "Colocar em evidência", how: "Os dois termos têm um fator comum. Arraste um deles para fora, à esquerda de tudo." },
    "x-times-x": { name: "x vezes x", how: "Arraste um x até o outro. `x·x` se escreve `x²`." },
    "merge-powers": { name: "Mesma base: somar expoentes", how: "Arraste uma potência até a outra de mesma base. Os expoentes se somam." },
    "power-to-product": { name: "Quadrado como produto", how: "Toque no ² para escrever os parênteses duas vezes." },
    "move-term": { name: "Passar um termo", how: "Passe o número para o outro lado do =. No caminho, ele troca de sinal." },
    "move-factor": { name: "Dividir os dois membros", how: "Passe o número que está na frente da letra para o outro lado do =. Ele divide o outro membro." },
    "move-denominator": { name: "Multiplicar os dois membros", how: "Passe o denominador da fração para o outro lado do =. Ele multiplica o outro membro." },
    "move-sign": { name: "Passar um menos", how: "Passe só o menos para o outro lado do =. O outro membro troca de sinal." },
    "swap-sides": { name: "Trocar os membros", how: "Arraste um membro para o outro lado do =, até depois da outra ponta. Os dois membros trocam de lugar." },
    "evaluate-fraction": { name: "Calcular uma fração", how: "Toque no traço da fração para calculá-la." },
    "divide-numbers": { name: "Simplificar uma fração", how: "Arraste o denominador até o numerador. Os dois são divididos pelo fator comum." },
    "cancel-factor": { name: "Cancelar um fator comum", how: "Arraste o número do denominador até o mesmo número no numerador. Os dois somem." },
    "power-of-power": { name: "Potência de potência", how: "Arraste o expoente de fora até o de dentro. Eles se multiplicam." },
    "divide-powers": { name: "Mesma base: subtrair expoentes", how: "Arraste a potência do denominador até a do numerador. Os expoentes se subtraem." },
    "flip-across-bar": { name: "Atravessar o traço da fração", how: "Arraste a potência para cima, atravessando o traço da fração. O expoente troca de sinal." },
    "power-one": { name: "Expoente 1", how: "Arraste o expoente 1 até a base: `x¹` é só `x`." },
    "zero-power": { name: "Expoente 0", how: "Arraste o expoente 0 até a base. Tudo elevado a 0 dá 1." },
    "tap-power": { name: "Calcular uma potência", how: "Toque no expoente para calcular a potência: `2³` vira 8." },
    "power-of-product": { name: "Expoente dentro dos parênteses", how: "Arraste o expoente para dentro dos parênteses. Cada fator de dentro ganha o seu próprio expoente." },
    "split-number": { name: "Decompor um número", how: "Toque no número para decompô-lo em dois fatores." },
    "factor-shared": { name: "Fator em comum", how: "Arraste o `x` de um termo até outro termo que tenha `x`. Ele fica em evidência para os dois termos." },
    "move-letter-factor": { name: "Dividir por uma letra", how: "Passe uma das letras multiplicadas para o outro lado do =. Ela divide o outro membro." },
    "move-letter-denominator": { name: "Multiplicar por uma letra", how: "Passe a letra do denominador para o outro lado do =. Ela multiplica o outro membro." },
    "ineq-move-term": { name: "Passar um termo", how: "Passe o número para o outro lado do sinal de desigualdade. Ele troca de sinal, mas a desigualdade não se inverte." },
    "ineq-swap": { name: "Trocar os membros", how: "Arraste um membro para além do outro. O sinal de desigualdade se inverte junto." },
    "ineq-sign": { name: "Passar um menos", how: "Passe só o menos para o outro lado. O sinal de desigualdade se inverte." },
    "add-fractions": { name: "Somar frações", how: "Os denominadores são iguais: arraste uma fração até a outra. Os numeradores se somam." },
    "expand-fraction": { name: "Igualar denominadores", how: "Arraste o denominador de uma fração até a outra fração. O numerador e o denominador dela são multiplicados por ele." },
    "multiply-fractions": { name: "Multiplicar frações", how: "Arraste uma fração até a outra. Numerador vezes numerador, denominador vezes denominador." },
    "divide-by-fraction": { name: "Dividir por uma fração", how: "Arraste a fração do denominador para cima, atravessando o traço. Ela se inverte e passa a multiplicar." },
    "split-fraction": { name: "Separar uma fração", how: "Puxe um termo para fora do numerador. Ele leva junto uma cópia do denominador." },
    "times-one": { name: "Vezes 1", how: "Arraste o 1 até o que ele multiplica. Multiplicar por 1 não muda nada." },
    substitute: { name: "Substituir", how: "Arraste o `y` de `y = …` até o `y` da outra equação. No lugar dele entra o valor de `y`." },
    "evaluate-root": { name: "Calcular uma raiz", how: "Toque na raiz para calculá-la." },
    "split-square": { name: "Decompor dentro da raiz", how: "Toque no número dentro da raiz. Ele se decompõe e aparece um quadrado." },
    "pull-out-of-power": { name: "Separar uma raiz", how: "Tire o número de dentro da raiz. Ele ganha uma √ só para ele." },
    "root-notation": { name: "Raiz como potência", how: "Toque na raiz para escrevê-la como potência de expoente ½." },
    "root-across": { name: "O ½ para o outro lado", how: "Passe o ½ para o outro lado do =. Lá ele vira um quadrado." },
    "exp-of-log": { name: "A potência desfaz o log", how: "Arraste a base até o log que está no expoente dela. Um desfaz o outro." },
    "evaluate-log": { name: "Logaritmos conhecidos", how: "Toque no log para calculá-lo: `ln(e) = 1`, e o logaritmo de 1 é 0." },
    "power-of-base": { name: "Potência da base", how: "Toque no número dentro do log para escrevê-lo como potência da base do log." },
    "log-of-product": { name: "Separar um log", how: "Tire o número de dentro do log. Ele ganha um log só para ele." },
    "log-of-power": { name: "Expoente para fora do log", how: "Arraste o expoente para a frente do log." },
    "power-into-log": { name: "Número para dentro do log", how: "Arraste o número da frente até o log. Lá dentro, ele vira um expoente." },
    "combine-logs": { name: "Juntar logs", how: "Arraste um log até o outro. Somar logs multiplica o que está dentro; subtrair, divide." },
    "exp-across": { name: "A base para o outro lado", how: "Passe a base para o outro lado do =. Lá ela vira um log." },
    "log-across": { name: "O log para o outro lado", how: "Passe o log para o outro lado do =. Lá ele vira uma potência." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Exercício ${label}${solved ? " — resolvido" : ""}`,
  goldNote: "Medalha de ouro. Pode continuar praticando quanto quiser.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `Medalha de ${TIER[tier]}. ` : ""}${more === 1 ? "Falta 1 acerto" : `Faltam ${more} acertos`} no ${["Fácil", "Médio", "Difícil"][tier]} para a medalha de ${TIER[tier + 1]}.`,

  // Guided example
  notThisStep: "Esse movimento vale, mas não é o deste passo. Vou desfazer.",
  done: "Pronto.",
  keepGoing: "Pode continuar: agora vale qualquer movimento.",
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
  guessPrompt: "Pense primeiro: no que isso vai dar?",
  reveal: "Mostrar",
  guessedBeforeWrong: (picked: boolean) =>
    `Sua primeira resposta ${picked ? "foi a vermelha" : "estava errada"}. A verde é a certa.`,
  guessedBeforeRight: "Você acertou este de primeira.",
  rightFirstTime: "Acertou de primeira! Agora resolva.",
  notQuite: "Não foi dessa vez. A verde é a certa. Resolva para ver onde a sua deu errado.",
  solvedBefore: "✓ Você já resolveu este. Pode resolver de novo.",
  makeItLookLike: "Transforme em",
  pickFirst: "Escolha uma resposta acima e depois resolva aqui.",
  hint: "Dica",
  undo: "Desfazer",
  reset: "Recomeçar",
  solvedBang: "Resolvido!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `Medalha de ${TIER[tier]} em ${chapter}.`,
  theExercise: "o exercício",
  moveCrashed: "Algo deu errado com esse movimento.",
  moveCrashedDetails: "Os detalhes estão no console do navegador.",
  tryAgain: "Tentar de novo",

  // Making a set
  ownTitle: "Seus próprios exercícios",
  ownIntro:
    "Monte uma lista de exercícios, por exemplo para seus alunos, e compartilhe como um link. Em cada exercício, o aluno primeiro prevê o resultado e depois resolve à mão. Nada fica guardado na internet: a lista inteira vai dentro do link.",
  upload: "Enviar um arquivo .yaml",
  startFromExample: "Começar pelo exemplo",
  yamlLabel: "A lista de exercícios, em YAML",
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
# Movimentos até "Equações do 1º grau" (número, id ou título de um capítulo). Sem isso: todos.
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
    ` ${stars} acertados de primeira. Em cada um, primeiro preveja o resultado e depois resolva à mão.`,
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
    twoWrong: "`wrong:` deve ter duas respostas erradas.",
    cantReadWrong: (w: string, err: string) => `Não foi possível ler a resposta errada "${w}": ${err}`,
    wrongShape: (w: string, why: string) => `A resposta errada "${w}" não tem a mesma forma do objetivo: ${why}.`,
    wrongIsRight: (w: string) => `A resposta errada "${w}" na verdade está certa.`,
    noDecoys:
      "Não foi possível criar respostas erradas convincentes: acrescente `wrong:`, ou o exercício será resolvido sem a previsão.",
    decoysMade: (list: string) => `Respostas erradas criadas para escolher: ${list}.`,
    shapeCount: "tem um número diferente de equações",
    shapeRelation: "é uma expressão onde se espera uma equação, ou o contrário",
    shapeIsolated: (letter: string) => `não diz quanto vale ${letter}`,
  },
};
