import type { ChapterTexts } from "..";

export const esChapters: ChapterTexts = {
  shuffle: {
    title: "Ordenar términos",
    blurb: "Los términos se pueden sumar en cualquier orden, y los números sueltos se pueden operar entre sí.",
    lesson: [
      {
        title: "El orden no importa",
        text: [
          "El orden de los sumandos no altera la suma. `2 + x` y `x + 2` son lo mismo.",
          "Cada parte de una suma se llama término. Puedes arrastrar los términos y ponerlos en el orden que quieras.",
        ],
        steps: ["Arrastra el 2 detrás de la x."],
      },
      {
        title: "Cada término lleva su signo",
        text: ["En `5 − 3 + x` los términos son `5`, `−3` y `x`. El signo menos es del 3. Cuando el 3 se mueve, su signo se mueve con él."],
        steps: ["Arrastra la x al principio. El 3 conserva su signo menos."],
        watch: "`5 − 3` y `3 − 5` no son lo mismo. Cuando muevas el 3, su signo menos tiene que ir con él.",
      },
      {
        title: "Sumar números",
        text: [
          "Dos números de la misma suma se pueden sumar. Suelta uno encima del otro. La x es un número que todavía no conocemos, así que se queda como está.",
        ],
        steps: ["Suelta el 4 sobre el 3."],
        after: "3 + 4 = 7. La x se queda como está.",
      },
      {
        title: "Multiplicar en cualquier orden",
        text: [
          "Al multiplicar, el orden tampoco importa: `2·x·5` es `2·5·x`. Así que puedes multiplicar el 2 por el 5 y obtener 10.",
          "Normalmente escribimos el número delante y no ponemos el punto: `10·x` se escribe `10x`.",
        ],
        steps: ["Suelta el 5 sobre el 2."],
      },
    ],
  },

  collect: {
    title: "Términos semejantes",
    blurb: "Los términos con las mismas letras se pueden sumar: 3x + 2x = 5x. Un término menos sí mismo da 0.",
    lesson: [
      {
        title: "Qué significa 3x",
        text: ["`3x` significa `x + x + x`. Así que `3x + 2x` son tres x más dos x, es decir, `5x`."],
        steps: ["Suelta el 2x sobre el 3x."],
      },
      {
        title: "Solo se suman los términos semejantes",
        text: [
          "Los términos semejantes tienen exactamente las mismas letras, y solo ellos se pueden sumar entre sí. `3x + 2` no puede convertirse en `5x`, porque el `2` no tiene x. Los números sin letra solo se suman con otros números sin letra.",
        ],
        steps: ["Las dos x son términos semejantes. Suelta la segunda x sobre la primera."],
        after: "El 4 no tiene x, así que se queda como está.",
      },
      {
        title: "Letras distintas no se suman",
        text: [
          "`x` e `y` pueden valer números distintos, así que `2x + 3y` no se puede simplificar. Pero en `2x + 3y + x` sí se pueden sumar los dos términos con x.",
        ],
        steps: ["Suelta la x sobre el 2x. El 3y se queda como está."],
        after: "Los términos con x y los términos con y van por separado.",
      },
      {
        title: "Restar",
        text: ["La resta funciona igual: `5y − 2y` es `3y`. Todo número menos sí mismo da 0, así que `a + b − a` es simplemente `b`."],
        steps: ["Suelta el −a sobre la a. Se anulan."],
        watch: "`x + x` es `2x`, no `x²`. `x²` significa `x·x`, y eso lo veremos más adelante.",
      },
    ],
  },

  distribute: {
    title: "Propiedad distributiva",
    blurb: "Un número fuera del paréntesis multiplica a cada término de dentro. Y un factor que tienen todos los términos se puede sacar factor común.",
    lesson: [
      {
        title: "Multiplica cada término de dentro",
        text: [
          "`2(x + 3)` significa 2 veces `(x + 3)`. Es decir, 2 veces x más 2 veces 3: `2x + 2·3`. El número de fuera multiplica a cada término de dentro.",
          "Piensa en un rectángulo de 2 de alto y `x + 3` de ancho. Divídelo en dos partes: una tiene área `2·x` y la otra `2·3`. Juntas forman el rectángulo entero.",
        ],
        steps: ["Suelta el 2 sobre el paréntesis. Multiplica a los dos términos.", "Ahora suelta el 2 de 2·3 sobre el 3."],
      },
      {
        title: "Un signo menos delante",
        text: ["`−(x − 4)` significa `−1` por el paréntesis. El −1 multiplica a cada término, así que cambian todos los signos de dentro."],
        steps: ["Suelta el signo menos sobre el paréntesis."],
        watch: "Un error muy típico es escribir `−(x − 4)` como `−x − 4`. El menos también multiplica al 4.",
      },
      {
        title: "Sacar factor común",
        text: [
          "El camino inverso se llama sacar factor común. Si todos los términos tienen un factor 3, puedes sacar el 3 delante de un paréntesis: `3x + 3y = 3(x + y)`.",
        ],
        steps: ["Los dos términos tienen un 3. Arrastra uno de los 3 hacia fuera, a la izquierda de todo."],
        after: "Si vuelves a aplicar la propiedad distributiva, obtienes 3x + 3y.",
      },
      {
        title: "x por x",
        text: [
          "A veces una letra se multiplica por sí misma: `x(x + 2)` da `x·x`. Eso se escribe `x²` (x al cuadrado). Un cuadrado de lado x tiene área `x·x`.",
        ],
        steps: ["Suelta la x sobre el paréntesis.", "Suelta una x sobre la otra."],
      },
    ],
  },

  brackets: {
    title: "Producto de polinomios",
    blurb: "Para multiplicar dos paréntesis, multiplica cada término del primero por cada término del segundo.",
    lesson: [
      {
        title: "Un paréntesis es un solo factor",
        text: [
          "En `(x + 1)(x + 2)`, el primer paréntesis multiplica a todo el segundo. Trata `(x + 1)` como un solo factor y aplica la propiedad distributiva: multiplica a la `x` y al `2`.",
        ],
        steps: [
          "Suelta todo el (x + 1) sobre (x + 2). Multiplica a los dos términos.",
          "Ahora suelta la x sobre el (x + 1) que tiene al lado.",
          "Después suelta el 2 sobre su (x + 1).",
        ],
        after: "Salen cuatro términos: x·x, 1·x, 2·x y 2·1. Agrupa los términos semejantes y te queda x² + 3x + 2.",
      },
      {
        title: "Multiplicar dos paréntesis",
        text: [
          "Multiplica cada término del primer paréntesis por cada término del segundo. Dos términos por dos términos dan cuatro términos. Después agrupa los términos semejantes.",
          "En `(x + 3)(x − 3)` los dos términos del medio son `+3x` y `−3x`. Se anulan y queda `x² − 9`.",
        ],
      },
      {
        title: "El cuadrado de un paréntesis",
        text: ["`(x + 1)²` es `(x + 1)(x + 1)`, así que se hace igual. Toca el ² para escribirlo como producto."],
        steps: ["Toca el ² para escribirlo como producto."],
        watch: "`(x + 1)²` no es `x² + 1`. Prueba con x = 2: `(2 + 1)² = 9`, pero `2² + 1 = 5`. La diferencia son los dos términos del medio, `x + x = 2x`.",
      },
    ],
  },

  balance: {
    title: "Resolver ecuaciones",
    blurb: "Si haces lo mismo en los dos miembros, la igualdad se mantiene. Un término que pasa al otro lado del = hace lo contrario: si sumaba, pasa restando.",
    lesson: [
      {
        title: "Lo mismo en los dos miembros",
        text: [
          "Una ecuación dice que dos cosas son iguales. Si haces lo mismo en los dos miembros, siguen siendo iguales.",
          "Pasar un término al otro lado del `=` es justo eso. En `x + 3 = 10`, resta 3 en los dos miembros: `x = 10 − 3`. Por eso el `+3` pasa al otro miembro como `−3`.",
        ],
        steps: ["Arrastra el 3 al otro lado del =. Cambia de signo.", "Suelta el −3 sobre el 10."],
      },
      {
        title: "Dividir los dos miembros",
        text: [
          "Si un número multiplica a todo un miembro, al pasarlo al otro lado pasa dividiendo. En `2x = 8`, divide los dos miembros entre 2: `x = 8/2`.",
        ],
        steps: ["Arrastra el 2 al otro lado del =. Pasa dividiendo.", "Suelta el 2 sobre el 8."],
      },
      {
        title: "Fracciones y signos menos",
        text: [
          "Con la división también funciona. En `x/3 = 4`, multiplica los dos miembros por 3: el 3 del denominador pasa al otro lado multiplicando.",
          "Un signo menos delante de todo un miembro también puede pasar al otro lado: `−x = 6` se convierte en `x = −6`.",
        ],
        steps: ["Arrastra el 3 al otro lado del =.", "Suelta el 4 sobre el 3."],
      },
      {
        title: "Deshacer en orden inverso",
        text: [
          "En `3x + 1`, primero se multiplica x por 3 y luego se suma 1. Para despejar la x, deshaz esos pasos en orden inverso: pasa primero el 1 y después el 3.",
        ],
        steps: ["Pasa el 1 al otro lado.", "Calcula.", "Pasa el 3 al otro lado.", "Calcula."],
        watch: "Comprueba la solución sustituyéndola en la ecuación: 3·4 + 1 = 13. ✓",
      },
    ],
  },

  powers: {
    title: "Potencias",
    blurb: "x³ significa x·x·x. Si cuentas las x, puedes deducir tú mismo las propiedades de las potencias.",
    lesson: [
      {
        title: "Producto de potencias",
        text: [
          "`x³` significa `x·x·x`. El número pequeño es el exponente: indica cuántas x se multiplican.",
          "Así que `x²·x³` son dos x por tres x: cinco x en total. Para multiplicar potencias de la misma base, se suman los exponentes.",
        ],
        steps: ["Misma base: suelta una potencia sobre la otra.", "Calcula."],
      },
      {
        title: "Potencia de una potencia",
        text: ["`(x²)³` es `x²·x²·x²`. Eso son 2 + 2 + 2 = 6 x, así que se multiplican los exponentes."],
        steps: ["Suelta el 3 de fuera sobre el 2 de dentro.", "Calcula."],
      },
      {
        title: "Cociente de potencias",
        text: [
          "`x⁵/x²` tiene cinco x en el numerador y dos en el denominador. Se simplifican dos x arriba y abajo, y quedan tres x en el numerador. Para dividir, se restan los exponentes.",
        ],
        steps: ["Suelta el x² sobre el x⁵.", "Calcula."],
      },
      {
        title: "Exponente cero y exponentes negativos",
        text: [
          "`x³/x³` es 1, y también es `x^(3 − 3) = x⁰`. Por eso cualquier número elevado a 0 da 1.",
          "Si hay más x abajo que arriba, el exponente se hace negativo: `x⁻²` significa `1/x²`. Al pasar una potencia al otro lado de la raya de fracción, su exponente cambia de signo.",
        ],
        steps: ["Arrastra el x³ hacia arriba, al otro lado de la raya."],
        watch: "`2x³` es `2·x·x·x`: el exponente solo afecta a la x. `(2x)³` es otra cosa: es `8x³`.",
      },
    ],
  },

  factor: {
    title: "Factorización",
    blurb: "Factorizar es lo contrario de desarrollar. Busca un factor que tengan todos los términos y sácalo delante de un paréntesis.",
    lesson: [
      {
        title: "Desarrollar al revés",
        text: [
          "Factorizar es el camino inverso de desarrollar. `x² + 3x` es `x·x + 3·x`. Los dos términos tienen una `x`, así que puedes sacarla factor común: `x(x + 3)`.",
        ],
        steps: [
          "Toca el ² para escribir x² como producto.",
          "Ahora los dos términos tienen una x. Arrastra una x hacia fuera, a la izquierda de todo.",
        ],
        after: "Para comprobarlo, desarrolla x(x + 3). Vuelve a salir x² + 3x.",
      },
      {
        title: "Descomponer números",
        text: ["Para encontrar un factor común, descompón los números en factores. En `2x + 6`, toca el 6 para obtener `2·3`. Ahora los dos términos tienen un 2."],
        steps: ["Toca el 6 para descomponerlo.", "Arrastra un 2 hacia fuera, delante de todo."],
      },
      {
        title: "Sacar un paréntesis",
        text: [
          "En `x(x + 2) + 3(x + 2)`, los dos términos tienen el mismo paréntesis, `(x + 2)`. Es un factor común, así que puedes sacarlo como cualquier otro.",
        ],
        steps: ["Arrastra el (x + 2) hacia fuera, delante de todo."],
      },
      {
        title: "Cuatro términos: de dos en dos",
        text: [
          "Con cuatro términos, saca factor común en los dos primeros y luego en los dos últimos. Si los dos paréntesis coinciden, saca también ese paréntesis.",
        ],
        watch: "Comprueba siempre una factorización volviendo a multiplicar. Tiene que darte exactamente lo que tenías al principio.",
      },
    ],
  },

  formulas: {
    title: "Despejar en fórmulas",
    blurb: "Una fórmula es una ecuación con varias letras. Para despejar una de ellas, usa los mismos movimientos que con la x.",
    lesson: [
      {
        title: "Despejar una letra",
        text: [
          "`v = u + at` da la velocidad `v` a partir de una velocidad inicial `u`, una aceleración `a` y un tiempo `t`. Si la reorganizas, te da el tiempo: `t = (v − u)/a`.",
          "Dejar una letra sola en un miembro se llama despejarla. Se hace igual que cuando resuelves una ecuación: trata las demás letras como si fueran números.",
        ],
        steps: ["La t está multiplicada por a. Primero pasa la u al otro lado.", "Ahora pasa la a al otro lado. Pasa dividiendo."],
        after: "Léelo de derecha a izquierda: t = (v − u)/a.",
      },
      {
        title: "Las letras se mueven como los números",
        text: [
          "Una letra que multiplica a todo un miembro puede pasar al otro lado del `=` dividiendo, igual que `2x = 8` se convertía en `x = 8/2`. (Solo se puede dividir entre una letra que no valga 0. En estas fórmulas nunca vale 0.)",
        ],
        steps: ["Pasa la m al otro lado."],
        watch: "Solo puede pasar al otro lado un factor de todo el miembro. En `u + at` la `a` solo multiplica a la `t`, así que primero pasa la `u`.",
      },
      {
        title: "Letras en el denominador",
        text: [
          "Si todo un miembro es una fracción, la letra del denominador puede pasar al otro lado multiplicando, igual que `x/3 = 4` se convertía en `x = 4·3`.",
        ],
        steps: ["Pasa la A al otro lado. Pasa multiplicando."],
      },
      {
        title: "Cuando la letra aparece dos veces",
        text: [
          "En `ax + bx = c`, la x aparece dos veces, así que pasando un solo término no consigues despejarla. Primero saca la x factor común. Después, el paréntesis que la multiplica puede pasar al otro lado.",
        ],
        steps: ["Los dos términos tienen una x. Arrastra una x hacia fuera, delante de todo.", "Ahora pasa todo el (a + b) al otro lado."],
      },
    ],
  },

  inequalities: {
    title: "Inecuaciones",
    blurb:
      "Las inecuaciones se resuelven como las ecuaciones, con una diferencia: al multiplicar o dividir por un número negativo, la desigualdad cambia de sentido.",
    lesson: [
      {
        title: "Menor que y mayor que",
        text: ["`x < 7` dice que x es menor que 7. La parte abierta del signo mira hacia el número mayor."],
        steps: ["Igual que en una ecuación, pasa el 2 al otro lado.", "Calcula."],
      },
      {
        title: "Intercambiar los miembros",
        text: [
          "`3 > x` y `x < 3` dicen lo mismo: x es menor que 3. Así que puedes intercambiar los dos miembros, siempre que también le des la vuelta al signo.",
        ],
        steps: ["Arrastra el 3 al otro miembro. El signo se da la vuelta."],
      },
      {
        title: "Los mismos movimientos que en las ecuaciones",
        text: [
          "Sumar o restar lo mismo en los dos miembros no cambia el sentido de la desigualdad. Multiplicar o dividir los dos miembros por un número positivo tampoco.",
        ],
        steps: ["Pasa el 2 al otro lado. Es positivo, así que el signo no cambia.", "Calcula."],
      },
      {
        title: "Un menos cambia el sentido",
        text: [
          "Multiplicar por −1 invierte el orden: `2 < 3`, pero `−2 > −3`. Por eso, cuando un signo menos pasa al otro lado, la desigualdad cambia de sentido.",
        ],
        steps: ["Pasa solo el signo menos al otro lado. El < se da la vuelta."],
        after: "Compruébalo con un número: x = 0 cumple tanto −x < 4 como x > −4.",
        watch: "La desigualdad solo cambia de sentido al multiplicar o dividir por un número negativo. Pasar un término al otro lado no la cambia nunca.",
      },
    ],
  },

  fractions: {
    title: "Fracciones",
    blurb:
      "Para sumar fracciones, primero hay que reducirlas a común denominador. Multiplicar el numerador y el denominador por el mismo número no cambia el valor de la fracción.",
    lesson: [
      {
        title: "Sumar fracciones",
        text: [
          "`3/4` significa 3 cuartos. Si los denominadores son iguales, basta con sumar los numeradores: 1 quinto más 2 quintos son 3 quintos, así que `1/5 + 2/5 = 3/5`.",
        ],
        steps: ["Los denominadores son iguales. Suelta una fracción sobre la otra.", "Calcula."],
      },
      {
        title: "Fracciones equivalentes",
        text: [
          "Dividir el numerador y el denominador entre el mismo número no cambia el valor: `6/8 = 3/4`.",
          "Multiplicarlos por el mismo número tampoco lo cambia: `1/2 = 2/4 = 3/6`.",
        ],
        steps: ["Suelta el 8 sobre el 6. Los dos se dividen entre su factor común, 2."],
      },
      {
        title: "Reducir a común denominador",
        text: [
          "Para sumar `1/2 + 1/3`, primero pasa las dos a sextos. Multiplica el numerador y el denominador de `1/2` por 3, y los de `1/3` por 2. Ahora los dos denominadores son 6.",
        ],
        steps: ["Arrastra el 3 de ⅓ sobre ½: su numerador y su denominador se multiplican por 3."],
        watch: "`1/2 + 1/3` no es `2/5`. Los numeradores solo se suman cuando los denominadores ya son iguales.",
      },
      {
        title: "Multiplicar fracciones",
        text: [
          "Multiplicar es más sencillo: se multiplican los numeradores entre sí y los denominadores entre sí. La mitad de un tercio es `(1·1)/(2·3) = 1/6`.",
        ],
        steps: ["Suelta una fracción sobre la otra."],
        after: "Después simplifica los factores comunes del numerador y el denominador, y te queda 3/2.",
      },
    ],
  },

  simultaneous: {
    title: "Sistemas de ecuaciones",
    blurb: "Dos ecuaciones con dos incógnitas que se cumplen a la vez. Despeja una letra en una de las ecuaciones y sustitúyela en la otra.",
    lesson: [
      {
        title: "Dos ecuaciones a la vez",
        text: [
          "`y = 2x` y `x + y = 9` son dos ecuaciones con las mismas x e y. Una ecuación con dos incógnitas tiene muchas soluciones. Dos ecuaciones juntas normalmente tienen solo una.",
          "Para resolver el sistema, elimina una de las letras. Te queda una ecuación con una sola incógnita, y eso ya sabes resolverlo.",
        ],
      },
      {
        title: "Sustitución",
        text: ["`y = 2x` dice que y vale lo mismo que 2x. Así que en la otra ecuación puedes cambiar la y por 2x. Esto se llama sustituir."],
        steps: [
          "Arrastra la y de y = 2x sobre la y de la otra ecuación.",
          "Ahora la ecuación solo tiene x. Agrupa los términos con x.",
        ],
        after: "Resuélvela: x = 3. Luego sustituye x = 3 en y = 2x para hallar y.",
      },
      {
        title: "Despejar una letra",
        text: [
          "Para sustituir, necesitas una ecuación del tipo `y = …` o `x = …`. Si no la tienes, consíguela: en `x − y = 1`, pasa el −y al otro lado y obtienes `x = 1 + y`.",
        ],
        steps: [
          "Pasa el −y al otro lado del = en la segunda ecuación.",
          "Ahora la x está despejada. Arrástrala sobre la x de la primera ecuación.",
        ],
        after: "Ahora la primera ecuación solo tiene y: 2y + 1 = 7, así que y = 3.",
        watch: "Sustituye la expresión entera. Si x = 1 + y, entonces 2x es 2(1 + y), no 2 + y.",
      },
      {
        title: "Hallar la otra letra",
        text: [
          "Cuando ya conoces una letra, por ejemplo `x = 3`, sustitúyela en la otra ecuación para hallar la otra letra. Arrastra la x de `x = 3` sobre una x de la otra ecuación.",
        ],
      },
    ],
  },

  roots: {
    title: "Radicales",
    blurb: "√x es x elevado a ½, así que las propiedades de las potencias también sirven para las raíces.",
    lesson: [
      {
        title: "Raíces cuadradas",
        text: ["`√9` es el número que, multiplicado por sí mismo, da 9. Es 3, porque `3·3 = 9`."],
        steps: ["Toca el 9 para descomponerlo en factores iguales."],
        after: "Luego saca un 3 fuera de la raíz. Cuando ya hayas visto cómo funciona, puedes tocar una raíz como √9 para calcularla de una vez.",
      },
      {
        title: "Una raíz es una potencia",
        text: [
          "`√x` es `x` elevado a `½`. Así que `√x·√x = x^(1/2 + 1/2) = x`. Todas las propiedades de las potencias sirven también para las raíces.",
        ],
        steps: ["Tócalo: una potencia de exponente ½ es una raíz cuadrada."],
      },
      {
        title: "La raíz de un producto",
        text: ["La raíz de un producto es el producto de las raíces: `√(4x) = √4·√x = 2√x`."],
        steps: ["Saca el 4 de la raíz. Cada factor lleva su propia √."],
        after: "Y √4 es 2, así que queda 2√x.",
        watch: "La raíz no se reparte en una suma: `√(9 + 16)` es `√25 = 5`, no `3 + 4`.",
      },
      {
        title: "Deshacer una raíz",
        text: [
          "Para resolver `√x = 3`, eleva al cuadrado los dos miembros. Toca la raíz para escribirla como `x^(1/2)`. Luego pasa el ½ al otro lado del =. Allí se convierte en un cuadrado.",
        ],
        steps: ["Toca la raíz para escribirla como potencia.", "Pasa el ½ al otro lado del =. Se convierte en un cuadrado.", "Calcula."],
      },
    ],
  },

  explog: {
    title: "Exponenciales y logaritmos",
    blurb:
      "ln(x) es el exponente al que hay que elevar e para obtener x. Por eso ln y e^ se anulan entre sí, y el logaritmo de un producto es la suma de los logaritmos.",
    lesson: [
      {
        title: "Qué significa ln",
        text: [
          "`e` es un número especial, aproximadamente 2,718. `ln(x)` es el exponente al que hay que elevar e para obtener x. Así que `ln(e³) = 3`.",
          "Esto quiere decir que ln y e^ se deshacen mutuamente: `e^(ln x) = x`.",
        ],
        steps: ["Suelta la e sobre el ln. Se anulan entre sí."],
      },
      {
        title: "El logaritmo de un producto",
        text: [
          "Al multiplicar potencias de e se suman sus exponentes. Por eso el logaritmo de un producto es la suma de los logaritmos: `ln(2x) = ln(2) + ln(x)`.",
        ],
        steps: ["Saca el 2 del ln. Cada factor lleva su propio ln."],
      },
      {
        title: "El logaritmo de una potencia",
        text: ["`x³` es `x·x·x`, así que `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
        steps: ["Arrastra el 3 hacia fuera, delante del ln."],
      },
      {
        title: "Resolver con logaritmos",
        text: [
          "Para sacar la x de un exponente, toma logaritmos en los dos miembros. En `e^x = 5`, pasa la e al otro lado del =. Se convierte en ln: `x = ln(5)`.",
        ],
        steps: ["Pasa la e al otro lado del =."],
      },
    ],
  },
};
