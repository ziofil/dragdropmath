import type { Strings } from "../en";

const TIER = ["", "bronze", "prata", "ouro"];

export const pt: Strings = {
  htmlLang: "pt-BR",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Idioma",

  // Top bar
  makeExercises: "Criar exercícios",
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
  noBadgesYet: "Resolva exercícios de qualquer capítulo para ganhar a medalha dele.",
  badgesEarned: (n: number, total: number) => `${n} de ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `Medalha de ${TIER[tier]}`,
  badgeNotEarned: "medalha ainda não conquistada",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? `medalha de ${TIER[tier]}` : "ainda não conquistada"}`,

  // Chapter page
  backToPath: "← Trilha de aprendizagem",
  exercises: "Exercícios",
  practiceNote: "Eles começam fáceis e vão ficando mais difíceis. Os últimos também usam o que você aprendeu nos capítulos anteriores.",
  leadsOnToStart: "Prepara para ",
  leadsOnToEnd: ". Você pode ir para lá quando quiser.",
  watchOut: "Atenção.",

  // Progress
  solvedOf: (done: number, total: number) => `${done} de ${total} exercícios resolvidos`,
  guessedRight: (n: number, total: number) => `${n} de ${total} acertados de primeira`,
  exerciseTitle: (label: string, solved: boolean) => `Exercício ${label}${solved ? " — resolvido" : ""}`,
  solved: "resolvido",
  guessedRightFirstTime: "acertou de primeira",
  guessFirstShort: "Pense primeiro",
  goldNote: "Medalha de ouro. Todos os exercícios resolvidos.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `Medalha de ${TIER[tier]}. ` : ""}${more === 1 ? "Falta 1 exercício" : `Faltam ${more} exercícios`} para a medalha de ${TIER[tier + 1]}.`,

  // Guided example
  exampleN: (n: number) => `Exemplo ${n}`,
  notThisStep: "Esse movimento vale, mas não é o deste passo. Vou desfazer.",
  done: "Pronto.",
  keepGoing: "Pode continuar: agora vale qualquer movimento.",
  stepOf: (n: number, total: number) => `Passo ${n} de ${total}`,
  startOver: "Recomeçar",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: lição`,
  nextExercise: "Próximo exercício →",
  backToThePath: "Voltar à trilha de aprendizagem",
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
  positiveLetters: "Aqui, as letras representam números positivos.",
  pickFirst: "Escolha uma resposta acima e depois resolva aqui.",
  hint: "Dica",
  undo: "Desfazer",
  reset: "Recomeçar",
  solvedBang: "Resolvido!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `Medalha de ${TIER[tier]} em ${chapter}.`,
  theExercise: "o exercício",
  goal: "objetivo",
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
