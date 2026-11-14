import type { Strings } from "../en";

const TIER = ["", "bronce", "plata", "oro"];

export const es: Strings = {
  htmlLang: "es",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Idioma",

  // Top bar
  makeExercises: "Crear ejercicios",
  sandbox: "Laboratorio",
  openSandbox: "Abrir el laboratorio →",
  sandboxIntro: "Escribe cualquier expresión o ecuación y prueba todos los movimientos.",
  sandboxInput: "Expresión o ecuación",
  sandboxPlaceholder: "p. ej. 3(x - 2) = 2x + 1   o   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Cargar",
  debugOn: "El modo de depuración está activado (Shift+D)",

  // Home
  heroBefore: "Álgebra que puedes ",
  heroWord: "tocar",
  heroAfter: ".",
  heroText:
    "Arrastra cualquier parte de una ecuación. Solo se mueve como lo permiten las matemáticas. Transfórmala hasta que quede igual que el objetivo.",
  learningPath: "Ruta de aprendizaje",
  nextUp: "siguiente",
  mastered: "dominado",
  everyChapterOpen: "Todos los capítulos están abiertos. Las flechas indican un orden recomendado.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) =>
    `Capítulo ${n}: ${title}, ${done} de ${total} resueltos`,
  chapterN: (n: number) => `Capítulo ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Se basa en ${titles}.`,
  notMasteredYet: (titles: string) => ` Aún no dominas: ${titles}. Puedes empezar igualmente.`,
  startLesson: "Empezar la lección →",
  backToLesson: "Volver a la lección →",
  leadsOnTo: (titles: string) => `Te prepara para ${titles}.`,
  badges: "Insignias",
  noBadgesYet: "Resuelve ejercicios de cualquier capítulo para ganar su insignia.",
  badgesEarned: (n: number, total: number) => `${n} de ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `Insignia de ${TIER[tier]}`,
  badgeNotEarned: "insignia aún no conseguida",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) => `${chapter}: ${tier ? `insignia de ${TIER[tier]}` : "aún no conseguida"}`,

  // Chapter page
  backToPath: "← Ruta de aprendizaje",
  exercises: "Ejercicios",
  practiceNote: "Cada ejercicio es nuevo, creado solo para ti. Empieza por los fáciles y sube de nivel cuando quieras.",
  leadsOnToStart: "Te prepara para ",
  leadsOnToEnd: ". Puedes ir cuando quieras.",
  watchOut: "¡Ojo!",
  level: { easy: "Fácil", medium: "Medio", hard: "Difícil" },
  anotherOne: "Otro →",

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Ejercicio ${label}${solved ? " — resuelto" : ""}`,
  solved: "resuelto",
  goldNote: "Insignia de oro. Puedes seguir practicando todo lo que quieras.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `Insignia de ${TIER[tier]}. ` : ""}${more === 1 ? `Te falta 1 ejercicio ${["fácil", "medio", "difícil"][tier]}` : `Te faltan ${more} ejercicios ${["fáciles", "medios", "difíciles"][tier]}`} para la insignia de ${TIER[tier + 1]}.`,

  // Guided example
  exampleN: (n: number) => `Ejemplo ${n}`,
  notThisStep: "Ese movimiento es correcto, pero no es el de este paso. Lo devuelvo a su sitio.",
  done: "Hecho.",
  keepGoing: "Puedes seguir: ahora vale cualquier movimiento.",
  stepOf: (n: number, total: number) => `Paso ${n} de ${total}`,
  startOver: "Empezar de nuevo",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: lección`,
  nextExercise: "Siguiente ejercicio →",
  exercisesNav: "Ejercicios",
  previousTitle: (label: string) => `Anterior: ejercicio ${label}`,
  previousLabel: (label: string) => `Ejercicio anterior (${label})`,
  nextTitle: (label: string) => `Siguiente: ejercicio ${label}`,
  nextLabel: (label: string) => `Ejercicio siguiente (${label})`,
  exerciseN: (label: string) => `Ejercicio ${label}`,
  guessPrompt: "Primero, predice: ¿cómo queda?",
  reveal: "Mostrar",
  guessedBeforeRight: "Este lo acertaste a la primera.",
  guessedBeforeWrong: (picked: boolean) => `Tu primera respuesta fue ${picked ? "la roja" : "incorrecta"}. La verde es la correcta.`,
  rightFirstTime: "¡A la primera! Ahora resuélvelo.",
  notQuite: "Casi. La verde es la correcta. Resuélvelo para ver dónde fallaba la tuya.",
  solvedBefore: "✓ Ya resolviste este. Puedes volver a resolverlo.",
  makeItLookLike: "Transfórmalo en",
  pickFirst: "Elige una respuesta arriba y luego resuélvelo aquí.",
  hint: "Pista",
  undo: "Deshacer",
  reset: "Reiniciar",
  solvedBang: "¡Resuelto!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `Insignia de ${TIER[tier]} en ${chapter}.`,
  theExercise: "el ejercicio",
  goal: "objetivo",
  moveCrashed: "Algo salió mal con ese movimiento.",
  moveCrashedDetails: "Los detalles están en la consola del navegador.",
  tryAgain: "Volver a intentarlo",

  // Making a set
  ownTitle: "Tus propios ejercicios",
  ownIntro:
    "Escribe una colección de ejercicios, por ejemplo para tus alumnos, y compártela con un enlace. En cada ejercicio, primero se predice la respuesta y luego se resuelve a mano. No se guarda nada en internet: toda la colección va dentro del enlace.",
  upload: "Subir un archivo .yaml",
  startFromExample: "Empezar con el ejemplo",
  yamlLabel: "La colección de ejercicios, en YAML",
  check: "Comprobar",
  checking: "Comprobando que se puede resolver con estos movimientos…",
  unsolvable:
    "No se ha podido resolver en 10 pasos con estos movimientos. Puede que necesite movimientos de un capítulo posterior (`moves:`).",
  solvableIn: (n: number) => `Se puede resolver en ${n} movimiento${n === 1 ? "" : "s"}.`,
  linkLabel: "Enlace a la colección",
  copied: "Copiado",
  copy: "Copiar",
  open: "Abrir",
  makeLink: "Crear el enlace",
  fixMarked: "Corrige los ejercicios marcados con ✗ y vuelve a comprobar.",
  howToWrite: "Cómo escribir una colección",
  formatExample: `title: Un nombre para la colección
moves: balance       # opcional: número, id o título de un capítulo —
                     # sus movimientos y los de todos los anteriores. Si no se pone: todos.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # opcional: dos respuestas incorrectas entre las que elegir
    hint: Una pista breve.    # opcional
    moves: collect            # opcional: movimientos solo para este ejercicio`,
  writeMathsAs: "Escribe las expresiones tal como las teclearías:",
  or: "o",
  twoEquations: ["Dos ecuaciones a la vez se escriben en una sola línea, con", "entre ellas."],
  exampleSet: `title: Tarea de la semana 3
# Movimientos hasta "Resolver ecuaciones" (número, id o título de un capítulo). Si no se pone: todos.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Dos respuestas incorrectas entre las que elegir (opcional: si no, se generan solas).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Primero pasa el 2, luego el 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Este enlace no funciona",
  brokenLinkText: "Puede que se cortara al copiarlo. Pídelo otra vez o ve a la ruta de aprendizaje.",
  learningPathButton: "Ruta de aprendizaje",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} de ${total} resueltos · `,
    ` ${stars} acertados a la primera. En cada uno, primero predice la respuesta y luego resuélvelo a mano.`,
  ],
  makeOwnSet: "Crea tu propia colección",
  ofCount: (n: number, count: number) => `${n} de ${count}`,
  backToSet: (title: string) => `Volver a ${title}`,

  // Checking a set (shown to whoever writes one)
  set: {
    defaultTitle: "Mis ejercicios",
    badYaml: (msg: string) => `Esto no es YAML válido: ${msg}`,
    expectedTop: "Faltan `title:` y `exercises:` al principio.",
    noChapter: (name: string) => `No hay ningún capítulo llamado "${name}" para \`moves:\` (usa el número, el id o el título de un capítulo).`,
    expectedList: "Debajo de `exercises:` tiene que ir una lista.",
    emptyList: "La lista de `exercises:` está vacía.",
    needsStart: "Falta `start:`.",
    needsGoal: "Falta `goal:`.",
    noChapterShort: (name: string) => `No hay ningún capítulo llamado "${name}" para \`moves:\`.`,
    cantReadStart: (err: string) => `No se entiende la expresión inicial: ${err}`,
    cantReadGoal: (err: string) => `No se entiende el objetivo: ${err}`,
    doesntFollow: "El objetivo no se deduce de la expresión inicial (revisa si hay alguna errata).",
    twoWrong: "En `wrong:` tiene que haber dos respuestas incorrectas.",
    cantReadWrong: (w: string, err: string) => `No se entiende la respuesta incorrecta "${w}": ${err}`,
    wrongShape: (w: string, why: string) => `La respuesta incorrecta "${w}" no tiene la forma del objetivo: ${why}.`,
    wrongIsRight: (w: string) => `La respuesta incorrecta "${w}" en realidad es correcta.`,
    noDecoys: "No se han podido generar respuestas incorrectas convincentes: añade `wrong:`, o el ejercicio se hará sin predecir antes.",
    decoysMade: (list: string) => `Respuestas incorrectas generadas para elegir: ${list}.`,
    shapeCount: "tiene un número distinto de ecuaciones",
    shapeRelation: "hay una expresión donde se espera una ecuación, o al revés",
    shapeIsolated: (letter: string) => `no dice cuánto vale ${letter}`,
  },
};
