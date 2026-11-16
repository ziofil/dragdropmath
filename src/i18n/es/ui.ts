import type { Translation } from "../en";


export const es: Translation = {
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
  everyChapterOpen: "Todos los capítulos están abiertos. Las flechas indican un orden recomendado.",
  chapterN: (n: number) => `Capítulo ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Se basa en ${titles}.`,
  startLesson: "Empezar la lección →",
  // Chapter page
  backToPath: "← Ruta de aprendizaje",
  leadsOnToStart: "Te prepara para ",
  leadsOnToEnd: ". Puedes ir cuando quieras.",
  level: { easy: "Fácil", medium: "Medio", hard: "Difícil" },
  anotherOne: "Otro →",
  practice: "Practica",
  predict: "Ponte a prueba",
  drills: {
    commute: { name: "Cambiar el orden", how: "Arrastra un término más allá del de al lado. Al sumar y al multiplicar, el orden no importa." },
    combine: { name: "Sumar números", how: "Suelta un número sobre el otro para sumarlos." },
    "multiply-numbers": { name: "Multiplicar números", how: "Suelta un número sobre el otro número por el que se multiplica." },
    "numbers-first": { name: "El número delante", how: "Toca un producto como `x·3` para escribirlo como siempre, `3x`." },
    "multiply-out": { name: "Calcular un producto", how: "Toca un producto de números, como `2·3`, para calcularlo." },
    collect: { name: "Agrupar términos semejantes", how: "Suelta un término sobre otro semejante, es decir, con la misma letra. Se suman." },
    "collect-cancel": { name: "Anular opuestos", how: "Suelta un término sobre su opuesto. Se anulan." },
    distribute: { name: "Quitar paréntesis", how: "Suelta el número de delante sobre el paréntesis. Multiplica a cada término de dentro." },
    "distribute-neg": { name: "Un menos delante del paréntesis", how: "Suelta el signo menos sobre el paréntesis. Cambian todos los signos de dentro." },
    "factor-out": { name: "Sacar factor común", how: "Los dos términos tienen un factor en común. Arrastra uno hacia fuera, a la izquierda de todo." },
    "merge-powers": { name: "Misma base: sumar exponentes", how: "Suelta una potencia sobre otra de la misma base. Los exponentes se suman." },
    "power-to-product": { name: "Un cuadrado como producto", how: "Toca el ² para escribir el paréntesis dos veces." },
    "move-term": { name: "Pasar un término al otro lado", how: "Arrastra el número al otro lado del =. Por el camino cambia de signo." },
    "move-factor": { name: "Dividir los dos miembros", how: "Arrastra el número que multiplica a la letra al otro lado del =. Pasa dividiendo." },
    "move-denominator": { name: "Multiplicar los dos miembros", how: "Arrastra el denominador al otro lado del =. Pasa multiplicando." },
    "move-sign": { name: "Pasar un menos al otro lado", how: "Arrastra solo el signo menos al otro lado del =. El otro miembro cambia de signo." },
    "swap-sides": { name: "Intercambiar los miembros", how: "Arrastra un miembro al otro lado del =, hasta el final. Los dos miembros se cambian de sitio." },
    "evaluate-fraction": { name: "Calcular una fracción", how: "Toca la raya de fracción para calcularla." },
    "divide-numbers": { name: "Simplificar una fracción", how: "Suelta el denominador sobre el numerador. Los dos se dividen entre su factor común." },
    "cancel-factor": { name: "Simplificar un factor común", how: "Suelta el número del denominador sobre el mismo número del numerador. Desaparecen los dos." },
    "power-of-power": { name: "Potencia de una potencia", how: "Suelta el exponente de fuera sobre el de dentro. Se multiplican." },
    "divide-powers": { name: "Misma base: restar exponentes", how: "Suelta la potencia del denominador sobre la del numerador. Los exponentes se restan." },
    "flip-across-bar": { name: "Al otro lado de la raya", how: "Arrastra la potencia hacia arriba, al otro lado de la raya de fracción. Su exponente cambia de signo." },
    "power-one": { name: "Exponente 1", how: "Suelta el exponente 1 sobre su base: `x¹` es simplemente `x`." },
    "zero-power": { name: "Exponente 0", how: "Suelta el exponente 0 sobre su base. Cualquier cosa elevada a 0 es 1." },
    "tap-power": { name: "Calcular una potencia", how: "Toca el exponente para calcular la potencia: `2³` se convierte en 8." },
    "power-of-product": { name: "Exponente dentro del paréntesis", how: "Arrastra el exponente dentro del paréntesis. Cada factor de dentro recibe el suyo." },
    "split-number": { name: "Descomponer un número", how: "Toca el número para descomponerlo en dos factores." },
    "factor-shared": { name: "Compartir un factor", how: "Suelta la `x` de un término sobre otro término que tenga `x`. Queda como factor común de los dos." },
    "move-letter-factor": { name: "Dividir entre una letra", how: "Arrastra una de las letras que se multiplican al otro lado del =. Pasa dividiendo." },
    "move-letter-denominator": { name: "Multiplicar por una letra", how: "Arrastra la letra del denominador al otro lado del =. Pasa multiplicando." },
    "ineq-move-term": { name: "Pasar un término al otro lado", how: "Arrastra el número al otro miembro. Cambia de signo, pero la desigualdad no cambia de sentido." },
    "ineq-swap": { name: "Intercambiar los miembros", how: "Arrastra un miembro más allá del otro. El signo de desigualdad se da la vuelta con ellos." },
    "ineq-sign": { name: "Pasar un menos al otro lado", how: "Pasa solo el signo menos al otro miembro. El signo de desigualdad se da la vuelta." },
    "add-fractions": { name: "Sumar fracciones", how: "Los denominadores son iguales: suelta una fracción sobre la otra. Los numeradores se suman." },
    "expand-fraction": { name: "Reducir a común denominador", how: "Arrastra el denominador de una fracción sobre la otra fracción. Su numerador y su denominador se multiplican por él." },
    "multiply-fractions": { name: "Multiplicar fracciones", how: "Suelta una fracción sobre la otra. Se multiplican los numeradores entre sí y los denominadores entre sí." },
    "divide-by-fraction": { name: "Dividir entre una fracción", how: "Arrastra la fracción del denominador hacia arriba, al otro lado de la raya. Se da la vuelta y multiplica." },
    "split-fraction": { name: "Separar una fracción", how: "Saca un término del numerador. Se lleva una copia del denominador." },
    "times-one": { name: "Por 1", how: "Suelta el 1 sobre lo que multiplica. Multiplicar por 1 no cambia nada." },
    substitute: { name: "Sustituir", how: "Arrastra la `y` de `y = …` sobre la `y` de la otra ecuación. Se cambia por lo que vale `y`." },
    "evaluate-root": { name: "Calcular una raíz", how: "Toca la raíz para calcularla." },
    "split-square": { name: "Descomponer dentro de la raíz", how: "Toca el número de dentro de la raíz. Se separa un cuadrado." },
    "pull-out-of-power": { name: "Separar una raíz", how: "Saca el número de la raíz. Lleva su propia √." },
    "root-notation": { name: "Una raíz como potencia", how: "Toca la raíz para escribirla como potencia de exponente ½." },
    "root-across": { name: "Un exponente ½ al otro lado del =", how: "Pasa el ½ al otro lado del =. Allí se convierte en un cuadrado." },
    "exp-of-log": { name: "Una potencia anula un logaritmo", how: "Suelta la base sobre el logaritmo de su exponente. Se anulan entre sí." },
    "evaluate-log": { name: "Logaritmos conocidos", how: "Toca el logaritmo para calcularlo: `ln(e) = 1`, y el logaritmo de 1 es 0." },
    "power-of-base": { name: "Como potencia de la base", how: "Toca el número del logaritmo para escribirlo como potencia de la base del logaritmo." },
    "log-of-product": { name: "Separar un logaritmo", how: "Saca el número del logaritmo. Lleva su propio logaritmo." },
    "log-of-power": { name: "Exponente fuera del logaritmo", how: "Arrastra el exponente hacia fuera, delante del logaritmo." },
    "power-into-log": { name: "Número dentro del logaritmo", how: "Suelta el número de delante sobre el logaritmo. Se convierte en un exponente de dentro." },
    "combine-logs": { name: "Juntar logaritmos", how: "Suelta un logaritmo sobre el otro. Al sumar logaritmos, lo de dentro se multiplica; al restarlos, se divide." },
    "exp-across": { name: "La base al otro lado del =", how: "Pasa la base al otro lado del =. Allí se convierte en un logaritmo." },
    "log-across": { name: "El logaritmo al otro lado del =", how: "Pasa el logaritmo al otro lado del =. Allí se convierte en una potencia." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Ejercicio ${label}${solved ? " — resuelto" : ""}`,
  // Guided example
  done: "Hecho.",
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
  predictPrompt: "Primero, predice: ¿cómo queda?",
  reveal: "Mostrar",
  predictedBeforeRight: "Este lo acertaste a la primera.",
  predictedBeforeWrong: (picked: boolean) => `Tu primera respuesta fue ${picked ? "la roja" : "incorrecta"}. La verde es la correcta.`,
  rightFirstTime: "¡A la primera! Ahora resuélvelo.",
  notQuite: "Casi. La verde es la correcta. Resuélvelo para ver dónde fallaba la tuya.",
  solvedBefore: "✓ Ya resolviste este. Puedes volver a resolverlo.",
  makeItLookLike: "Transfórmalo en",
  pickFirst: "Elige una respuesta arriba y luego resuélvelo aquí.",
  hint: "Pista",
  undo: "Deshacer",
  solvedBang: "¡Resuelto!",
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
