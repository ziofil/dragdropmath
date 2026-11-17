import type { Translation } from "../en";


export const es: Translation = {
  htmlLang: "es",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
  language: "Idioma",

  // Top bar
  makeExercises: "Crear ejercicios",
  skin: "Tema",
  skins: { modern: "Moderno", codex: "Codex", paper: "Papel", blackboard: "Pizarra" },
  settings: "Ajustes",
  numbersInColour: "Números en color",
  debugMode: "Modo de depuración",
  sandboxInput: "Expresión o ecuación",
  sandboxPlaceholder: "p. ej. 3(x - 2) = 2x + 1   o   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Cargar",
  debugOn: "El modo de depuración está activado: toca para desactivarlo",

  // Home
  heroBefore: "Álgebra que puedes ",
  heroWord: "tocar",
  heroAfter: ".",
  heroText:
    "Arrastra cualquier parte de una ecuación. Solo se mueve como lo permiten las matemáticas. Transfórmala hasta que quede igual que el objetivo.",
  learningPath: "Ruta de aprendizaje",
  chapterNodeLabel: (n: number, title: string) => `Capítulo ${n}: ${title}`,
  chapterN: (n: number) => `Capítulo ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Se basa en ${titles}.`,
  startLesson: "Empezar la lección →",
  // Chapter page
  backToPath: "← Ruta de aprendizaje",
  level: { easy: "Fácil", medium: "Medio", hard: "Difícil" },
  makingExercise: "Preparando un ejercicio…",
  anotherOne: "Otro →",
  progressHere: "Tu progreso solo se guarda en este navegador. Guárdalo en un archivo para no perderlo o para llevarlo a otro dispositivo.",
  saveProgress: "Exportar el progreso a un archivo",
  loadProgress: "Cargar el progreso desde un archivo",
  progressSaved: "Guardado. Carga ese archivo aquí, o en cualquier navegador, para recuperar tu progreso.",
  rightsReserved: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Todos los derechos reservados.`,
  aboutLink: "Acerca de",
  about: {
    title: "Acerca de DragDropMath",
    sections: [
      {
        heading: "Qué es",
        text: [
          "DragDropMath es álgebra que se hace con las manos. Arrastras cualquier parte de una expresión o de una ecuación, y solo se mueve como lo permiten las matemáticas. Un movimiento incorrecto sencillamente no ocurre, así que aprendes lo que está permitido porque lo notas, no porque te sepas las reglas de memoria.",
          "Hay una ruta de aprendizaje que va desde ordenar términos hasta las ecuaciones de segundo grado. Cada capítulo tiene una lección, práctica en tres niveles y ejercicios de «De cabeza», en los que te imaginas la respuesta antes de resolverlo. Los profesores pueden escribir sus propias colecciones de ejercicios y compartirlas con un enlace.",
        ],
      },
      {
        heading: "Quién lo ha hecho",
        text: ["DragDropMath lo ha creado Filippo Miatto para que el álgebra sea algo que se puede ver y tocar, y no una lista de reglas que hay que memorizar."],
      },
      {
        heading: "Tu privacidad",
        text: [
          "No hay cuentas, ni anuncios, ni seguimiento. Tu progreso se guarda solo en tu navegador, y nada de lo que haces se envía a ningún sitio. Puedes guardarlo en un archivo desde Ajustes, para no perderlo o para llevarlo a otro dispositivo.",
          "Una colección de ejercicios va entera dentro de su enlace: no se guarda nada de ella en internet.",
        ],
      },
    ],
  },
  progressNotABackup: "Ese archivo no es un archivo de progreso de DragDropMath.",
  progressReplace: (saved: string) =>
    `Esto sustituirá tu progreso en este navegador por el del archivo${saved ? ` (guardado el ${saved})` : ""}. ¿Lo cargas?`,
  progressLoadIt: "Cargarlo",
  cancel: "Cancelar",
  progressNoRoom: "Tu navegador no ha podido guardarlo, así que no se ha cambiado nada.",
  progressBlocked:
    "Este navegador no guarda nada de este sitio (una ventana privada o el almacenamiento desactivado), así que no hay progreso que guardar.",
  showMove: "Muéstramelo",
  lesson: "Lección",
  practice: "Práctica",
  predict: "De cabeza",
  scores: "Puntuaciones de «De cabeza»",
  scoreOf: (n: number) => `puntuación: ${n}`,
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) =>
    `Puntuación del nivel ${level.toLowerCase()}: ${now}${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  drills: {
    commute: {
      name: "Cambiar el orden",
      how: "Arrastra un término más allá del de al lado. Al sumar y al multiplicar, el orden no importa.",
      text: [
        "El orden en que sumas no cambia el resultado: `2 + x` y `x + 2` son lo mismo.",
        "Cada parte de una suma se llama término. Un término conserva su signo cuando se mueve: en `5 − 3 + x`, el menos es del 3.",
      ],
    },
    combine: {
      name: "Sumar números",
      how: "Suelta un número sobre el otro para sumarlos.",
      text: ["Dos números de la misma suma se pueden sumar. Una letra representa un número que todavía no conocemos, así que se queda como está."],
    },
    "multiply-numbers": {
      name: "Multiplicar números",
      how: "Suelta un número sobre el otro número por el que se multiplica.",
      text: ["Al multiplicar, el orden tampoco importa: `2·x·5` es `2·5·x`. Así que el 2 y el 5 se pueden multiplicar, y queda `10x`."],
    },
    "numbers-first": {
      name: "El número delante",
      how: "Toca un producto como `x·3` para escribirlo como siempre, `3x`.",
      text: ["El número se escribe delante y el punto se omite: `x·3` se escribe `3x`. Es tan sencillo que, a partir de ahora, se hace solo."],
    },
    "multiply-out": {
      name: "Calcular un producto",
      how: "Toca un producto de números, como `2·3`, para calcularlo.",
      text: ["Un producto de números se puede calcular: `2·3` es 6."],
    },
    collect: {
      name: "Agrupar términos semejantes",
      how: "Suelta un término sobre otro semejante, es decir, con las mismas letras y los mismos exponentes. Se suman.",
      text: [
        "`3x` significa `x + x + x`. Así que `3x + 2x` son tres x más dos x: `5x`.",
        "Solo se suman los términos semejantes, es decir, los que tienen exactamente las mismas letras con los mismos exponentes. `3x + 2` no puede dar `5x`, los términos en x y los términos en y van por separado, y también `x²` y `3x`.",
      ],
    },
    "collect-cancel": {
      name: "Anular opuestos",
      how: "Suelta un término sobre su opuesto. Se anulan.",
      text: ["Restar funciona igual: `5y − 2y` es `3y`. Cualquier cosa menos sí misma da 0, así que `a + b − a` es simplemente `b`."],
    },
    distribute: {
      name: "Quitar paréntesis",
      how: "Suelta el número de delante sobre el paréntesis: multiplica a cada término de dentro. Luego toca el · para hacer las multiplicaciones.",
      text: [
        "`2(x + 3)` significa 2 veces `(x + 3)`: 2 veces x más 2 veces 3, `2x + 2·3`. El número de fuera multiplica a cada término de dentro.",
        "Piensa en un rectángulo de altura 2 y anchura `x + 3`. Sus dos partes tienen áreas `2·x` y `2·3`, y juntas forman el rectángulo entero.",
      ],
    },
    "distribute-neg": {
      name: "Un menos delante del paréntesis",
      how: "Suelta el signo menos sobre el paréntesis. Cambian todos los signos de dentro.",
      text: ["`−(x − 4)` significa −1 por el paréntesis. El −1 multiplica a cada término, así que cambian todos los signos de dentro."],
    },
    "factor-out": {
      name: "Sacar factor común",
      how: "Los dos términos tienen un factor común. Mantenlo pulsado en uno de ellos y arrástralo hacia fuera, delante de todo, más allá del extremo izquierdo.",
      text: [
        "Factorizar una suma es escribirla como un producto. En `3x + 3y`, los dos términos son algo por 3. Así que el 3 se puede escribir una sola vez, delante de un paréntesis con lo que le queda a cada término: `3x + 3y = 3(x + y)`.",
        "Es cierto porque, al desarrollar `3(x + y)`, vuelve a salir `3x + 3y`: el 3 multiplica a cada término de dentro. Así se comprueba también una factorización.",
      ],
    },
    "split-exponent": {
      name: "Separar un exponente",
      how: "Saca un término del exponente. La potencia se separa en dos potencias de la misma base.",
      text: ["`2^(x + 3)` son x + 3 doses multiplicados: x doses, y 3 más. Así que es `2^x·2^3`: una suma en el exponente se convierte en un producto de potencias."],
    },
    "merge-powers": {
      name: "Misma base: sumar exponentes",
      how: "Suelta una potencia sobre la otra, o toca el · que hay entre ellas. Los exponentes se suman: toca el + para hacer la suma.",
      text: [
        "`x³` significa `x·x·x`. El número pequeño, el exponente, cuenta las x.",
        "Así que `x²·x³` son dos x por tres x: cinco x en total. Al multiplicar potencias de la misma base, se suman los exponentes.",
      ],
    },
    "power-to-product": {
      name: "Un cuadrado como producto",
      how: "Toca el ² para escribir el paréntesis dos veces. Luego desarrolla el producto y agrupa los términos semejantes.",
      text: ["`(x + 1)²` es `(x + 1)(x + 1)`, así que se desarrolla de la misma manera."],
    },
    "move-term": {
      name: "Pasar un término al otro lado",
      how: "Arrastra el número al otro lado del =. Por el camino cambia de signo. Luego toca el − para hacer la resta.",
      text: [
        "Una ecuación dice que dos miembros son iguales. Si haces lo mismo en los dos, siguen siendo iguales.",
        "Pasar un término al otro lado del `=` es justo eso. En `x + 3 = 10`, resta 3 en los dos miembros: `x = 10 − 3`. Por eso el `+3` pasa al otro lado como `−3`.",
      ],
    },
    "move-factor": {
      name: "Dividir los dos miembros",
      how: "Arrastra el número que multiplica a la letra al otro lado del =. Pasa dividiendo. Luego toca la raya de fracción para calcularlo.",
      text: ["Un número que multiplica a todo un miembro pasa al otro lado dividiendo. En `2x = 8`, divide los dos miembros entre 2: `x = 8/2`."],
    },
    "move-denominator": {
      name: "Multiplicar los dos miembros",
      how: "Arrastra el denominador al otro lado del =. Pasa multiplicando. Luego toca el · para hacer la multiplicación.",
      text: ["El denominador de una fracción pasa al otro lado multiplicando. En `x/3 = 4`, multiplica los dos miembros por 3: `x = 4·3`."],
    },
    "move-sign": {
      name: "Pasar un menos al otro lado",
      how: "Arrastra solo el signo menos al otro lado del =. El otro miembro cambia de signo.",
      text: ["Un menos delante de todo un miembro también puede pasar al otro lado: los dos miembros se multiplican por −1, así que `−x = 6` se convierte en `x = −6`."],
    },
    "swap-sides": {
      name: "Intercambiar los miembros",
      how: "Arrastra un miembro al otro lado del =, hasta pasar el final. Los dos miembros se cambian de sitio.",
      text: ["`7 = x` y `x = 7` dicen lo mismo, así que los dos miembros se pueden intercambiar."],
    },
    "evaluate-fraction": {
      name: "Calcular una fracción",
      how: "Toca la raya de fracción para calcularla.",
      text: ["Una fracción que da un número entero se puede calcular: `12/3` es 4."],
    },
    "divide-numbers": {
      name: "Simplificar una fracción",
      how: "Toca la raya de fracción. El numerador y el denominador se dividen entre su factor común.",
      text: ["Una fracción se simplifica dividiendo el numerador y el denominador entre el mismo número: `6/8 = 3/4`. Su valor no cambia."],
    },
    "letter-in": {
      name: "Una letra por un paréntesis",
      how: "Suelta la letra de delante sobre el paréntesis. Luego toca el · entre las dos letras: `x·x` es `x²`. (Para llevar una letra sola, mantenla pulsada: con una pulsación rápida te llevas el término entero.)",
      text: ["La letra multiplica a cada término de dentro, igual que un número: `x(x + 3) = x·x + x·3`. Y `x·x` es una potencia, `x²`, como en Potencias."],
    },
    "factor-then-cancel": {
      name: "Sacar factor común y simplificar",
      how: "Mantén pulsado el número de un término del numerador y arrástralo hacia fuera, delante de todo, más allá del extremo izquierdo. Luego toca la raya de fracción: se simplifica.",
      text: [
        "Solo se puede simplificar un factor de todo el numerador. En `(2x + 6)/2`, el 2 es factor de cada término, así que primero sácalo factor común: `(2(x + 3))/2`. Ahora sí es factor de todo el numerador, y se simplifica con el denominador.",
      ],
    },
    "cancel-factor": {
      name: "Simplificar un factor común",
      how: "Toca la raya de fracción. Lo que tienen en común el numerador y el denominador se simplifica.",
      text: ["Un número que multiplica a todo el numerador y a todo el denominador se simplifica: `(3x)/3` es `x`. En `(3x + 1)/3` no: el 3 solo multiplica a una parte del numerador."],
    },
    "power-of-power": {
      name: "Potencia de una potencia",
      how: "Suelta el exponente de fuera sobre el de dentro. Se multiplican: toca el · para hacer la multiplicación.",
      text: ["`(x²)³` es `x²·x²·x²`. Son 2 + 2 + 2 = 6 x, así que los exponentes se multiplican."],
    },
    "divide-powers": {
      name: "Misma base: restar exponentes",
      how: "Toca la raya de fracción. Las potencias de la misma base se juntan y sus exponentes se restan: toca el − para hacer la resta.",
      text: ["`x⁵/x²` tiene cinco x en el numerador y dos en el denominador. Se van dos de cada lado y quedan tres arriba: al dividir, se restan los exponentes."],
    },
    "flip-across-bar": {
      name: "Al otro lado de la raya",
      how: "Arrastra la potencia hacia arriba, al otro lado de la raya de fracción. Su exponente cambia de signo.",
      text: ["Si hay más x abajo, el exponente queda por debajo de cero: `x⁻²` significa `1/x²`. Al pasar una potencia al otro lado de la raya de fracción, su exponente cambia de signo."],
    },
    "power-one": {
      name: "Exponente 1",
      how: "Suelta el exponente 1 sobre su base.",
      text: ["`x¹` es una sola x: simplemente `x`. Es tan sencillo que, a partir de ahora, se hace solo."],
    },
    "zero-power": {
      name: "Exponente 0",
      how: "Mantén pulsado el exponente 0 y suéltalo sobre su base. Luego toca el + para hacer la suma.",
      text: ["`x³/x³` es 1 (si x no es 0), y también es `x^(3 − 3) = x⁰`. Así que cualquier número distinto de 0 elevado a 0 es 1."],
    },
    "tap-power": {
      name: "Calcular una potencia",
      how: "Toca el exponente para calcular la potencia: `2³` se convierte en 8.",
      text: ["La potencia de un número se puede calcular: `2³` es `2·2·2 = 8`."],
    },
    "power-of-product": {
      name: "Exponente dentro del paréntesis",
      how: "Arrastra el exponente dentro del paréntesis: cada factor de dentro recibe el suyo. Luego toca el exponente del número para calcularlo.",
      text: ["`(2x)³` es `2x·2x·2x`, que es `2³·x³`. Cada factor de dentro queda elevado al exponente."],
    },
    "split-number": {
      name: "Descomponer un número",
      how: "Toca el número para descomponerlo en dos factores. Luego arrastra el factor que tienen los dos términos hacia fuera, delante de todo, más allá del extremo izquierdo.",
      text: ["Para encontrar un factor común, descompón los números en factores. En `2x + 6`, el 6 es `2·3`, y ahora los dos términos tienen un 2."],
    },
    "split-term": {
      name: "Descomponer el término central",
      how: "Toca el término central. Se descompone en dos, listo para factorizar por parejas.",
      text: [
        "Para factorizar `x² + 5x + 6`, busca dos números que sumen 5 y cuyo producto sea 6: el 2 y el 3. Escribe `5x` como `2x + 3x`.",
        "Ahora hay cuatro términos, y se factorizan por parejas: `x(x + 2) + 3(x + 2)`, y luego `(x + 2)(x + 3)`.",
      ],
    },
    "difference-of-squares": {
      name: "Diferencia de cuadrados",
      how: "Toca el signo menos que hay entre los dos cuadrados.",
      text: [
        "Un cuadrado menos otro cuadrado siempre se factoriza igual: `a² − b² = (a − b)(a + b)`. Desarróllalo para comprobarlo: los términos centrales se anulan.",
        "Solo funciona con una diferencia, un cuadrado menos otro cuadrado. Una suma de dos cuadrados, como `x² + 9`, no se puede factorizar. Un cuadrado menos un número que no es un cuadrado perfecto, como `x² − 7`, sí, pero con raíces: `(x − √7)(x + √7)`.",
      ],
    },
    "factor-shared": {
      name: "Compartir un factor",
      how: "Mantén pulsada la `x` de un término y suéltala sobre otro término que tenga `x`: queda como factor común de los dos. (O toca el signo entre dos términos: sale lo que tienen en común.) Luego saca lo que tienen en común los dos últimos términos (a menudo un número) y, después, el paréntesis que comparten los dos productos.",
      text: ["Con cuatro términos, se trabaja por parejas. Saca factor común en los dos primeros términos y luego en los dos últimos. Si los dos paréntesis coinciden, saca también el paréntesis como factor común."],
    },
    "move-letter-factor": {
      name: "Dividir entre una letra",
      how: "Arrastra una de las letras que se multiplican al otro lado del =. Pasa dividiendo.",
      text: [
        "Una fórmula es una ecuación con varias letras. Dejar una letra sola en un miembro se llama despejarla. Se hace igual que cuando resuelves una ecuación en x: trata las demás letras como si fueran números.",
        "Una letra que multiplica a todo un miembro puede pasar al otro lado dividiendo: `F = ma` da `F/m = a`. (Solo si esa letra no vale 0: aquí suponemos que no.)",
        "Cuando la letra que quieres despejar está en dos sitios, como en `ax + bx = c`, primero sácala factor común: `x(a + b) = c`. Después, el paréntesis entero puede pasar al otro lado.",
      ],
    },
    "move-letter-denominator": {
      name: "Multiplicar por una letra",
      how: "Arrastra la letra del denominador al otro lado del =. Pasa multiplicando.",
      text: ["Una letra en el denominador de todo un miembro puede pasar al otro lado multiplicando: `P = F/A` da `PA = F`."],
    },
    "ineq-move-term": {
      name: "Pasar un término al otro lado",
      how: "Arrastra el número al otro lado del signo de desigualdad. Cambia de signo, pero la desigualdad no cambia de sentido. Luego toca el − para hacer la resta.",
      text: [
        "`x < 7` dice que x es menor que 7. La parte abierta del signo mira hacia el número mayor.",
        "Sumar o restar lo mismo en los dos miembros no cambia el sentido de la desigualdad. Así que un término pasa al otro lado igual que en una ecuación.",
      ],
    },
    "ineq-swap": {
      name: "Intercambiar los miembros",
      how: "Arrastra un miembro más allá del otro. El signo de desigualdad se da la vuelta con ellos.",
      text: ["`3 > x` y `x < 3` dicen lo mismo: x es menor que 3. Así que los miembros se pueden intercambiar, siempre que el signo se dé la vuelta con ellos."],
    },
    "ineq-sign": {
      name: "Pasar un menos al otro lado",
      how: "Arrastra solo el signo menos al otro miembro. El signo de desigualdad se da la vuelta.",
      text: ["Multiplicar por −1 invierte el orden: `2 < 3`, pero `−2 > −3`. Por eso, cuando un menos pasa al otro lado, el signo de desigualdad se da la vuelta."],
    },
    "add-fractions": {
      name: "Sumar fracciones",
      how: "Los denominadores son iguales: suelta una fracción sobre la otra, o toca el + que hay entre ellas. Luego toca el + del numerador para sumar los numeradores.",
      text: ["`3/4` significa 3 cuartos. Cuando los denominadores son iguales, basta con sumar los numeradores: 1 quinto más 2 quintos son 3 quintos, así que `1/5 + 2/5 = 3/5`."],
    },
    "expand-fraction": {
      name: "Reducir a común denominador",
      how: "Mantén pulsado el denominador de una fracción y suéltalo sobre la otra fracción; luego, al revés: ahora las dos tienen el mismo denominador. Toca cada · para calcular los numeradores y los denominadores, y después suma las fracciones.",
      text: [
        "Multiplicar el numerador y el denominador por el mismo número no cambia una fracción: `1/2 = 2/4 = 3/6`.",
        "Así se reducen las fracciones a común denominador. Para sumar `1/2 + 1/3`, multiplica el numerador y el denominador de `1/2` por 3, y los de `1/3` por 2: ahora las dos son sextos.",
      ],
    },
    "multiply-fractions": {
      name: "Multiplicar fracciones",
      how: "Toca el · que hay entre las fracciones, o suelta una sobre la otra: se multiplican los numeradores entre sí y los denominadores entre sí.",
      text: ["Multiplicar es más sencillo: se multiplican los numeradores y se multiplican los denominadores. La mitad de un tercio es `(1·1)/(2·3) = 1/6`."],
    },
    "divide-by-fraction": {
      name: "Dividir entre una fracción",
      how: "Arrastra el denominador de la fracción de abajo hacia arriba, al numerador: pasa a multiplicarlo. Luego toca el · y la raya de fracción para calcular.",
      text: [
        "Lo que hace un número depende de cuántas rayas de fracción tiene encima. En `4/(3/5)` el 5 está bajo dos rayas: divide a algo que ya divide, así que multiplica. Por eso puede subir al numerador sin que cambie nada: `(4·5)/3`.",
        "Por eso dividir entre una fracción es multiplicar por su inversa: `4/(3/5) = 4·5/3`.",
      ],
    },
    rationalise: {
      name: "Sin raíces en el denominador",
      how: "Arrastra la raíz del denominador hacia arriba, al numerador: el numerador y el denominador quedan multiplicados por ella. Luego toca el · de abajo.",
      text: [
        "Multiplicar el numerador y el denominador por el mismo número no cambia una fracción. Elige la raíz que ya está abajo: `√3·√3 = 3`, así que `1/√3 = √3/(√3·√3) = √3/3`. Ya no queda ninguna raíz bajo la raya.",
      ],
    },
    "zero-product": {
      name: "Un producto igual a 0",
      how: "Arrastra uno de los paréntesis hacia abajo, fuera del producto: la ecuación se separa en dos, o ese paréntesis vale 0 o lo vale el otro. Luego resuelve cada una.",
      text: [
        "Un producto solo vale 0 si alguno de sus factores es 0: `3·0 = 0`, pero `3·2` no. Así que `(x − 2)(x + 3) = 0` significa `x − 2 = 0` o `x + 3 = 0`: dos soluciones.",
        "Por eso nunca se dividen los dos miembros entre algo que pueda valer 0: aquí perderías una solución.",
      ],
    },
    "plus-minus": {
      name: "Las dos raíces de un cuadrado",
      how: "Arrastra el 2 al otro lado del =. Un cuadrado tiene dos raíces: la ecuación se separa en dos, una con + y otra con −.",
      text: ["`3² = 9`, y también `(−3)² = 9`. Así que `x² = 9` significa `x = 3` o `x = −3`. Si te olvidas del signo menos, pierdes una solución."],
    },
    "take-out-then-split": {
      name: "Sacar la letra factor común y separar",
      how: "Mantén pulsada la letra de un término y arrástrala hacia fuera, delante de todo, más allá del extremo izquierdo (o toca el signo que hay entre los términos). Luego arrastra la letra hacia abajo, fuera del producto, y resuelve lo que queda.",
      text: [
        "Si no hay término independiente, todos los términos llevan x: saca factor común, `x² − 3x = x(x − 3)`. Ahora es un producto igual a 0, así que `x = 0` o `x − 3 = 0`.",
      ],
    },
    "split-middle": {
      name: "Factorizar y separar",
      how: "Toca el término del medio: se separa en dos. Saca factor común en cada pareja y luego el paréntesis que comparten. Después arrastra un paréntesis hacia abajo, fuera del producto.",
      text: [
        "`x² + x − 6` es el producto de dos paréntesis: `(x + 3)(x − 2)`. Los dos números multiplicados dan `−6` y sumados dan `1`, el coeficiente de la x. Cuando ya es un producto igual a 0, cada paréntesis da una solución.",
      ],
    },
    "square-both-sides": {
      name: "Elevar al cuadrado los dos miembros",
      how: "Arrastra la raíz al otro lado del =: el otro miembro queda elevado al cuadrado. Luego desarrolla y resuelve. Debajo están las condiciones: la solución que no cumpla alguna queda tachada.",
      text: [
        "Una raíz nunca es negativa, así que `√(x² + 5) = x + 1` solo se cumple donde `x + 1 ≥ 0`. Al elevar al cuadrado los dos miembros eso se pierde: `x² + 5 = (x + 1)²` se cumpliría también si `x + 1` fuera negativo. Por eso las condiciones se dan desde el principio, y se mantienen a lo largo de todo el ejercicio.",
      ],
    },
    "split-fraction": {
      name: "Separar una fracción",
      how: "Saca un término del numerador. Se lleva una copia del denominador.",
      text: ["Si el numerador de una fracción es una suma, se puede separar en una fracción por cada término, todas con el mismo denominador: `(x + 5)/6 = x/6 + 5/6`."],
    },
    "times-one": {
      name: "Por 1",
      how: "Mantén pulsado el 1 y suéltalo sobre lo que multiplica.",
      text: ["Multiplicar por 1 no cambia nada: `1·x` es simplemente `x`. Es tan sencillo que, a partir de ahora, se hace solo."],
    },
    substitute: {
      name: "Sustituir",
      how: "Arrastra la `y` de `y = …` sobre la `y` de la otra ecuación: se cambia por lo que vale `y`. Luego despeja la x y sustitúyela en la primera ecuación para hallar la y.",
      text: [
        "`y = 2x` y `x + y = 9` son dos ecuaciones con las mismas x e y, y las dos se cumplen a la vez. Una ecuación con dos incógnitas tiene muchas soluciones; dos juntas suelen tener solo una.",
        "`y = 2x` dice que y es igual a 2x, así que en la otra ecuación se puede sustituir la y por 2x. Queda una ecuación con una sola letra, que ya sabes resolver.",
        "Si ninguna ecuación tiene una letra despejada, despeja una primero: en `x − y = 1`, pasa el −y al otro lado y queda `x = 1 + y`.",
      ],
    },
    "evaluate-root": {
      name: "Calcular una raíz",
      how: "Toca la raíz para calcularla.",
      text: ["`√9` es el número positivo que, multiplicado por sí mismo, da 9: el 3, porque `3·3 = 9` (el −3 también, pero √ indica el positivo). Del mismo modo, `∛8 = 2`, porque `2·2·2 = 8`."],
    },
    "split-square": {
      name: "Descomponer dentro de la raíz",
      how: "Toca el número de dentro de la raíz: se separa un cuadrado (un cubo, si es una raíz cúbica). Luego sácalo de la raíz y toca su raíz para calcularla.",
      text: ["Una raíz que no es exacta también se puede simplificar. Descompón el número de dentro de forma que salga un cuadrado: `√12 = √(4·3)`."],
    },
    "join-powers": {
      name: "Juntar raíces",
      how: "Suelta una raíz sobre la otra. Quedan bajo un mismo signo de raíz.",
      text: [
        "`√2·√3` al cuadrado es `2·3`, así que `√2·√3` es el número positivo cuyo cuadrado es 6: `√(2·3) = √6`. Dos raíces del mismo índice se juntan en una sola.",
        "Lo mismo pasa con cualquier exponente común: `x³y³` es xxx·yyy, que es xy·xy·xy, es decir, `(xy)³`.",
      ],
    },
    "pull-out-of-power": {
      name: "Separar una raíz",
      how: "Saca el número de la raíz: lleva su propia raíz. Luego toca esa raíz para calcularla.",
      text: ["La raíz de un producto es el producto de las raíces: `√(4x) = √4·√x = 2√x`."],
    },
    "root-notation": {
      name: "Una raíz como potencia",
      how: "Toca la raíz para escribirla como potencia: √ es una potencia de exponente ½, y ∛, de exponente ⅓.",
      text: [
        "Toda raíz es una potencia: `√x = x^(1/2)`, `∛x = x^(1/3)`, y la raíz n-ésima de x es `x^(1/n)`. Así que todas las propiedades de las potencias sirven también para las raíces: `√x·√x = x^(1/2 + 1/2) = x`.",
      ],
    },
    "root-of-power": {
      name: "Raíz de una potencia",
      how: "Toca la raíz para escribirla como potencia. Luego suelta el exponente de fuera sobre el de dentro y calcula el producto.",
      text: [
        "Una raíz es una potencia, así que la raíz de una potencia es una potencia de una potencia: `∛(x⁶) = (x⁶)^(1/3) = x^(6·1/3) = x²`. Los exponentes se multiplican, como en Potencias.",
      ],
    },
    "fraction-power": {
      name: "Raíces y potencias juntas",
      how: "Suelta la raíz sobre la potencia: los exponentes se suman. Luego pasa el número entero a fracción con denominador 2: arrastra el denominador del ½ sobre él y toca el · para calcularlo. Después suma las fracciones y toca el + del numerador.",
      text: ["`√x` es `x^(1/2)`, así que `√x·x² = x^(1/2 + 2) = x^(5/2)`. Un exponente fraccionario funciona como cualquier otro: para multiplicar potencias, se suman los exponentes."],
    },
    "root-across": {
      name: "El exponente de una raíz al otro lado del =",
      how: "Arrastra el ½ (o el ⅓, o el ¼) al otro lado del =. Allí se convierte en un cuadrado (o un cubo, o una cuarta potencia). Luego toca el exponente para calcularlo.",
      text: ["Para resolver `√x = 3`, eleva al cuadrado los dos miembros. Escrita como potencia, `x^(1/2) = 3`, el ½ pasa al otro lado y se convierte en un cuadrado: `x = 3²`."],
    },
    "exp-of-log": {
      name: "Una potencia anula un logaritmo",
      how: "Suelta la base sobre el logaritmo de su exponente. Se anulan entre sí.",
      text: [
        "`e` es un número especial, aproximadamente 2,718. `ln(x)` es el exponente al que hay que elevar e para obtener x, así que ln y e^ se anulan entre sí: `e^(ln x) = x`. Los logaritmos en otras bases funcionan igual: `2^(log₂ x) = x`.",
      ],
    },
    "evaluate-log": {
      name: "Logaritmos conocidos",
      how: "Toca el logaritmo para calcularlo: `ln(e) = 1`, y el logaritmo de 1 es 0.",
      text: ["`ln(e) = 1`, porque `e¹ = e`. Y el logaritmo de 1 es 0, porque `e⁰ = 1`."],
    },
    "power-of-base": {
      name: "Como potencia de la base",
      how: "Toca el número del logaritmo para escribirlo como potencia de 2. Luego arrastra el exponente hacia fuera, delante del logaritmo, y toca el logaritmo.",
      text: ["Para calcular `log₂(8)`, escribe 8 como potencia de 2: `8 = 2³`, así que `log₂(8) = 3`."],
    },
    "log-of-product": {
      name: "Separar un logaritmo",
      how: "Saca el número del logaritmo. Lleva su propio logaritmo.",
      text: ["Al multiplicar potencias, se suman los exponentes. Por eso el logaritmo de un producto es la suma de los logaritmos: `ln(2x) = ln(2) + ln(x)`."],
    },
    "log-of-root": {
      name: "Logaritmo de una raíz",
      how: "Toca la raíz para escribirla como potencia. Luego arrastra el exponente hacia fuera, delante del logaritmo.",
      text: ["Una raíz es una potencia, `√x = x^(1/2)`, así que su exponente sale del logaritmo como cualquier otro: `ln(√x) = ½ln(x)`."],
    },
    "log-of-power": {
      name: "Exponente fuera del logaritmo",
      how: "Arrastra el exponente hacia fuera, delante del logaritmo.",
      text: ["`x³` es `x·x·x`, así que `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
    },
    "power-into-log": {
      name: "Número dentro del logaritmo",
      how: "Suelta el número de delante sobre el logaritmo. Se convierte en un exponente de dentro.",
      text: ["Y al revés: `3ln(x)` es `ln(x³)`."],
    },
    "combine-logs": {
      name: "Juntar logaritmos",
      how: "Suelta un logaritmo sobre el otro, o toca el + (o el −) que hay entre ellos. Al sumar logaritmos, lo de dentro se multiplica; al restarlos, se divide.",
      text: ["También al revés: `ln(a) + ln(b) = ln(ab)`, y `ln(a) − ln(b) = ln(a/b)`."],
    },
    "move-exponent-term": {
      name: "Entre exponentes",
      how: "Los dos miembros son potencias de la misma base. Arrastra un término de un exponente al otro: cambia de signo.",
      text: [
        "Cuando los dos miembros son potencias de la misma base, sus exponentes son iguales, así que funcionan como los dos miembros de una ecuación.",
        "`2^(x − 3) = 2^4` se convierte en `2^x = 2^(4 + 3)`: se han multiplicado los dos miembros por `2^3`.",
      ],
    },
    "exp-across": {
      name: "La base al otro lado del =",
      how: "Arrastra la base al otro lado del =. Allí se convierte en un logaritmo.",
      text: ["Para sacar la x de un exponente, se toman logaritmos en los dos miembros. En `e^x = 5`, la e pasa al otro lado y se convierte en ln: `x = ln(5)`."],
    },
    "log-across": {
      name: "El logaritmo al otro lado del =",
      how: "Arrastra el logaritmo al otro lado del =. Allí se convierte en una potencia. Si es la potencia de un número, toca su exponente para calcularla.",
      text: ["Un logaritmo se anula con una potencia. En `ln(x) = 2`, el ln pasa al otro lado y se convierte en e: `x = e²`."],
    },
    "bracket-times-bracket": {
      name: "Paréntesis por paréntesis",
      how: "Suelta un paréntesis sobre el otro: multiplica a los dos términos de dentro. Luego desarrolla cada paréntesis de la misma manera y agrupa los términos semejantes.",
      text: [
        "En `(x + 1)(x + 2)`, el primer paréntesis es un solo factor: multiplica a todo el segundo, a la x y al 2. Después se desarrolla cada `(x + 1)`, uno tras otro.",
        "Dos términos por dos términos dan cuatro términos. Luego se agrupan los términos semejantes: `(x + 1)(x + 2) = x² + 3x + 2`.",
      ],
    },
    "bracket-out": {
      name: "Sacar un paréntesis factor común",
      how: "Los dos términos tienen el mismo paréntesis. Mantenlo pulsado en uno de ellos y arrástralo hacia fuera, delante de todo, más allá del extremo izquierdo.",
      text: ["Un paréntesis entero puede ser factor común. En `x(x + 2) + 3(x + 2)`, los dos términos tienen `(x + 2)`, así que sale delante como cualquier otro factor: `(x + 2)(x + 3)`."],
    },
    "ineq-move-factor": {
      name: "Dividir los dos miembros",
      how: "Arrastra el número que multiplica a la letra al otro lado del signo. Pasa dividiendo, y la desigualdad no cambia de sentido. Luego toca la raya de fracción.",
      text: ["Multiplicar o dividir los dos miembros por un número positivo tampoco cambia el sentido de la desigualdad: de `2x < 8`, se pasa a `x < 8/2`."],
    },
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
  predictPrompt: "Piénsalo de cabeza: ¿en qué se convierte?",
  reveal: "Ver la solución",
  predictedBeforeRight: "Este lo viste bien a la primera.",
  predictedBeforeWrong: (picked: boolean) => `Tu primera respuesta fue ${picked ? "la roja" : "incorrecta"}. La verde es la correcta.`,
  rightFirstTime: "¡Bien a la primera! Ahora resuélvelo.",
  revealedNote: "La verde es la correcta. Ahora resuélvelo.",
  notQuite: "Casi. La verde es la correcta. Resuélvelo para ver dónde fallaba la tuya.",
  solvedBefore: "✓ Ya resolviste este. Puedes volver a resolverlo.",
  makeItLookLike: "Transfórmalo en",
  solveFor: (letters: string[]) => `Halla el valor de ${letters.map((l) => `\`${l}\``).join(" y de ")}.`,
  pickFirst: "Elige una respuesta arriba y luego resuélvelo aquí.",
  hint: "Pista",
  nextStep: "Siguiente paso",
  noNextStep: "No hay ningún paso posible desde aquí: prueba con Deshacer o Empezar de nuevo.",
  undo: "Deshacer",
  solvedBang: "¡Resuelto!",
  where: "con",
  moveCrashed: "Algo salió mal con ese movimiento.",
  moveCrashedDetails: "Vuelve a intentarlo o empieza este ejercicio de nuevo.",
  pageCrashed: "Algo salió mal en esta página.",
  pageCrashedDetails: "Vuelve a intentarlo o regresa a la ruta de aprendizaje. Tu progreso está a salvo.",
  tryAgain: "Volver a intentarlo",

  // Making a set
  ownTitle: "Tus propios ejercicios",
  ownIntro:
    "Escribe una colección de ejercicios, por ejemplo para tus alumnos, y compártela con un enlace. En cada ejercicio, los alumnos primero se imaginan la respuesta y luego lo resuelven a mano. No se guarda nada en internet: toda la colección va dentro del enlace.",
  upload: "Subir un archivo .yaml",
  startFromExample: "Empezar con el ejemplo",
  yamlLabel: "La colección de ejercicios, en YAML",
  form: {
    asForm: "Formulario",
    asYaml: "YAML",
    viewLabel: "Escribir la colección como",
    title: "Título",
    moves: "Movimientos permitidos",
    allMoves: "Todos los movimientos",
    upTo: (n: number, title: string) => `Hasta ${n}. ${title}`,
    start: (n: number) => `Ejercicio ${n}: inicio`,
    goal: (n: number) => `Ejercicio ${n}: objetivo`,
    remove: (n: number) => `Quitar el ejercicio ${n}`,
    addOne: "Añadir un ejercicio",
    fromChapter: "Añadir ejercicios de la práctica de un capítulo",
    chapter: "Capítulo",
    level: "Nivel",
    howMany: "Cuántos",
    addMade: (n: number) => `Añadir ${n}`,
    making: "Preparándolos…",
    cantRead: "El YAML de esta colección tiene un error, así que el formulario no puede mostrarla. Corrígelo en la vista YAML o empieza con el ejemplo.",
  },
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
  or: "o bien",
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
    ` ${stars} vistos bien a la primera. En cada uno, primero imagina la respuesta y luego resuélvelo a mano.`,
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
    noValue: "La expresión inicial no tiene valor para ningún número (¿hay una división entre 0?).",
    twoWrong: "En `wrong:` tiene que haber dos respuestas incorrectas.",
    cantReadWrong: (w: string, err: string) => `No se entiende la respuesta incorrecta "${w}": ${err}`,
    wrongShape: (w: string, why: string) => `La respuesta incorrecta "${w}" no tiene la forma del objetivo: ${why}.`,
    wrongIsRight: (w: string) => `La respuesta incorrecta "${w}" en realidad es correcta.`,
    noDecoys: "No se han podido generar respuestas incorrectas convincentes: añade `wrong:`, o el ejercicio se resolverá sin imaginar antes la respuesta.",
    decoysMade: (list: string) => `Respuestas incorrectas generadas para elegir: ${list}.`,
    shapeCount: "tiene un número distinto de ecuaciones",
    shapeRelation: "hay una expresión donde se espera una ecuación, o al revés",
    shapeIsolated: (letter: string) => `no dice cuánto vale ${letter}`,
  },
};
