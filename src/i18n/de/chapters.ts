import type { ChapterTexts } from "..";

export const deChapters: ChapterTexts = {
  shuffle: {
    title: "Terme ordnen",
    blurb: "Terme darfst du in beliebiger Reihenfolge addieren, und reine Zahlen kannst du ausrechnen.",
    lesson: [
      {
        title: "Die Reihenfolge ist egal",
        text: [
          "Beim Addieren ist die Reihenfolge egal, die Summe bleibt gleich. `2 + x` und `x + 2` sind dasselbe.",
          "Die einzelnen Teile einer Summe heißen Terme (oder Summanden). Du kannst sie in jede beliebige Reihenfolge ziehen.",
        ],
        steps: ["Zieh die 2 hinter das x."],
      },
      {
        title: "Jeder Term behält sein Vorzeichen",
        text: ["In `5 − 3 + x` sind die Terme `5`, `−3` und `x`. Das Minus gehört zur 3. Wenn die 3 wandert, wandert ihr Minus mit."],
        steps: ["Zieh das x nach vorn. Die 3 behält ihr Minus."],
        watch: "`5 − 3` und `3 − 5` sind nicht dasselbe. Wenn du die 3 verschiebst, muss ihr Minus mit.",
      },
      {
        title: "Zahlen zusammenrechnen",
        text: [
          "Zwei Zahlen in derselben Summe kannst du zusammenrechnen. Zieh die eine auf die andere. Das x ist eine Zahl, die wir noch nicht kennen, also bleibt es, wie es ist.",
        ],
        steps: ["Zieh die 4 auf die 3."],
        after: "3 + 4 = 7. Das x bleibt, wie es ist.",
      },
      {
        title: "Auch beim Multiplizieren egal",
        text: [
          "Auch beim Multiplizieren ist die Reihenfolge egal: `2·x·5` ist `2·5·x`. Du kannst also 2 mal 5 rechnen und bekommst 10.",
          "Meist schreibt man die Zahl zuerst und lässt den Malpunkt weg: Statt `10·x` schreibt man `10x`.",
        ],
        steps: ["Zieh die 5 auf die 2."],
      },
    ],
  },

  collect: {
    title: "Gleichartige Terme",
    blurb: "Terme mit denselben Variablen kannst du zusammenfassen: 3x + 2x = 5x. Ein Term minus sich selbst ist 0.",
    lesson: [
      {
        title: "Was 3x bedeutet",
        text: ["`3x` bedeutet `x + x + x`. Also ist `3x + 2x` drei x plus zwei x, und das sind `5x`."],
        steps: ["Zieh 2x auf 3x."],
      },
      {
        title: "Nur gleichartige Terme zusammenfassen",
        text: [
          "Gleichartige Terme haben genau dieselben Variablen. Nur sie lassen sich zusammenfassen. Aus `3x + 2` wird nicht `5x`, denn die `2` hat kein x. Reine Zahlen fasst du nur mit reinen Zahlen zusammen.",
        ],
        steps: ["Die beiden x sind gleichartig. Zieh das zweite x auf das erste."],
        after: "Die 4 hat kein x, also bleibt sie, wie sie ist.",
      },
      {
        title: "Verschiedene Variablen bleiben getrennt",
        text: [
          "`x` und `y` können für verschiedene Zahlen stehen, deshalb lässt sich `2x + 3y` nicht vereinfachen. Aber in `2x + 3y + x` kannst du die beiden x-Terme zusammenfassen.",
        ],
        steps: ["Zieh das x auf 2x. Das 3y bleibt, wie es ist."],
        after: "x-Terme und y-Terme bleiben getrennt.",
      },
      {
        title: "Subtrahieren",
        text: ["Beim Subtrahieren geht das genauso: `5y − 2y` ist `3y`. Alles minus sich selbst ist 0, also ist `a + b − a` einfach `b`."],
        steps: ["Zieh −a auf a. Die beiden heben sich auf."],
        watch: "`x + x` ist `2x`, nicht `x²`. `x²` bedeutet `x·x`, das kommt später.",
      },
    ],
  },

  distribute: {
    title: "Distributivgesetz",
    blurb:
      "Eine Zahl vor der Klammer wird mit jedem Term in der Klammer multipliziert. Einen Faktor, den alle Terme haben, kannst du wieder ausklammern.",
    lesson: [
      {
        title: "Jeden Term in der Klammer multiplizieren",
        text: [
          "`2(x + 3)` bedeutet 2-mal `(x + 3)`. Das ist 2-mal x plus 2-mal 3: `2x + 2·3`. Die Zahl vor der Klammer wird mit jedem Term in der Klammer multipliziert.",
          "Stell dir ein Rechteck vor, 2 hoch und `x + 3` breit. Teil es in zwei Stücke: Das eine hat den Flächeninhalt `2·x`, das andere `2·3`. Zusammen ergeben sie das ganze Rechteck.",
        ],
        steps: ["Zieh die 2 auf die Klammer. Sie wird mit beiden Termen multipliziert.", "Zieh jetzt in 2·3 die 2 auf die 3."],
      },
      {
        title: "Ein Minus vor der Klammer",
        text: ["`−(x − 4)` bedeutet `−1` mal die Klammer. Die −1 wird mit jedem Term multipliziert, also dreht sich jedes Vorzeichen in der Klammer um."],
        steps: ["Zieh das Minus auf die Klammer."],
        watch: "Ein typischer Fehler: `−(x − 4)` wird zu `−x − 4`. Das Minus gilt aber auch für die 4.",
      },
      {
        title: "Ausklammern",
        text: [
          "Der umgekehrte Weg heißt Ausklammern. Wenn jeder Term den Faktor 3 hat, kannst du die 3 vor eine Klammer ziehen: `3x + 3y = 3(x + y)`.",
        ],
        steps: ["Beide Terme haben eine 3. Zieh eine 3 ganz nach links vor den Term."],
        after: "Multiplizierst du wieder aus, bekommst du 3x + 3y.",
      },
      {
        title: "x mal x",
        text: [
          "Manchmal wird eine Variable mit sich selbst multipliziert: `x(x + 2)` ergibt `x·x`. Das schreibt man `x²` (x Quadrat). Ein Quadrat mit der Seitenlänge x hat den Flächeninhalt `x·x`.",
        ],
        steps: ["Zieh das x auf die Klammer.", "Zieh ein x auf das andere."],
      },
    ],
  },

  brackets: {
    title: "Klammern ausmultiplizieren",
    blurb: "Zwei Klammern multiplizierst du, indem du jeden Term der ersten Klammer mit jedem Term der zweiten multiplizierst.",
    lesson: [
      {
        title: "Eine Klammer ist ein Faktor",
        text: [
          "In `(x + 1)(x + 2)` wird die ganze zweite Klammer mit der ersten multipliziert. Behandle `(x + 1)` wie einen einzigen Faktor und multipliziere aus: Er wird mit dem `x` und mit der `2` multipliziert.",
        ],
        steps: [
          "Zieh die ganze (x + 1) auf (x + 2). Sie wird mit beiden Termen multipliziert.",
          "Zieh jetzt das x auf die (x + 1) daneben.",
          "Dann zieh die 2 auf ihre (x + 1).",
        ],
        after: "Das ergibt vier Terme: x·x, 1·x, 2·x und 2·1. Fass gleichartige Terme zusammen, dann erhältst du x² + 3x + 2.",
      },
      {
        title: "Zwei Klammern multiplizieren",
        text: [
          "Multipliziere jeden Term der ersten Klammer mit jedem Term der zweiten. Zwei Terme mal zwei Terme ergibt vier Terme. Danach fasst du gleichartige Terme zusammen.",
          "In `(x + 3)(x − 3)` sind die beiden mittleren Terme `+3x` und `−3x`. Sie heben sich auf, übrig bleibt `x² − 9`. Das ist die 3. binomische Formel.",
        ],
      },
      {
        title: "Eine Klammer quadrieren",
        text: ["`(x + 1)²` ist `(x + 1)(x + 1)`, das geht also genauso. Tippe auf das ², um es auszuschreiben."],
        steps: ["Tippe auf das ², um es als Produkt zu schreiben."],
        watch:
          "`(x + 1)²` ist nicht `x² + 1`. Probier x = 2: `(2 + 1)² = 9`, aber `2² + 1 = 5`. Der Unterschied sind die beiden mittleren Terme, `x + x = 2x`.",
      },
    ],
  },

  balance: {
    title: "Gleichungen lösen",
    blurb:
      "Machst du auf beiden Seiten dasselbe, bleibt die Gleichung richtig. Bringst du einen Term auf die andere Seite des =, kehrt sich dort seine Rechenart um.",
    lesson: [
      {
        title: "Auf beiden Seiten dasselbe",
        text: [
          "Eine Gleichung sagt, dass zwei Dinge gleich sind. Machst du auf beiden Seiten dasselbe, bleiben sie gleich.",
          "Wenn du einen Term über das `=` bringst, passiert genau das. Bei `x + 3 = 10` ziehst du auf beiden Seiten 3 ab: `x = 10 − 3`. Deshalb wird aus `+3` auf der anderen Seite `−3`.",
        ],
        steps: ["Zieh die 3 über das =. Ihr Vorzeichen ändert sich.", "Zieh die −3 auf die 10."],
      },
      {
        title: "Beide Seiten dividieren",
        text: [
          "Wird eine ganze Seite mit einer Zahl multipliziert, bringst du die Zahl hinüber und teilst damit die andere Seite. Bei `2x = 8` teilst du beide Seiten durch 2: `x = 8/2`.",
        ],
        steps: ["Zieh die 2 über das =. Jetzt teilt sie die andere Seite.", "Zieh die 2 auf die 8."],
      },
      {
        title: "Brüche und Minuszeichen",
        text: [
          "Beim Dividieren klappt das auch. Bei `x/3 = 4` multiplizierst du beide Seiten mit 3. Die 3 im Nenner wandert hinüber und multipliziert die andere Seite.",
          "Auch ein Minus vor einer ganzen Seite kann hinüber: Aus `−x = 6` wird `x = −6`.",
        ],
        steps: ["Zieh die 3 über das =.", "Zieh die 4 auf die 3."],
      },
      {
        title: "Rückwärts auflösen",
        text: [
          "In `3x + 1` wird x zuerst mit 3 multipliziert, dann wird 1 addiert. Um x allein zu bekommen, machst du das in umgekehrter Reihenfolge rückgängig: zuerst die 1 hinüber, dann die 3.",
        ],
        steps: ["Zieh die 1 hinüber.", "Rechne aus.", "Zieh die 3 hinüber.", "Rechne aus."],
        watch: "Mach die Probe und setz deine Lösung ein: 3·4 + 1 = 13. ✓",
      },
    ],
  },

  powers: {
    title: "Potenzen",
    blurb: "x³ bedeutet x·x·x. Wenn du die x zählst, kommst du selbst auf die Potenzgesetze.",
    lesson: [
      {
        title: "Potenzen multiplizieren",
        text: [
          "`x³` bedeutet `x·x·x`. Die kleine Zahl heißt Exponent. Sie gibt an, wie viele x miteinander multipliziert werden.",
          "`x²·x³` sind also zwei x mal drei x: insgesamt fünf x. Multiplizierst du Potenzen mit gleicher Basis, addierst du die Exponenten.",
        ],
        steps: ["Gleiche Basis: Zieh eine Potenz auf die andere.", "Rechne aus."],
      },
      {
        title: "Potenzen potenzieren",
        text: ["`(x²)³` ist `x²·x²·x²`. Das sind 2 + 2 + 2 = 6 x, also multiplizierst du die Exponenten."],
        steps: ["Zieh die äußere 3 auf die innere 2.", "Rechne aus."],
      },
      {
        title: "Potenzen dividieren",
        text: [
          "`x⁵/x²` hat fünf x im Zähler und zwei im Nenner. Zwei x kürzen sich weg, übrig bleiben drei x im Zähler. Beim Dividieren subtrahierst du die Exponenten.",
        ],
        steps: ["Zieh x² auf x⁵.", "Rechne aus."],
      },
      {
        title: "Null und negative Exponenten",
        text: [
          "`x³/x³` ist 1, und es ist auch `x^(3 − 3) = x⁰`. Also ist alles hoch 0 gleich 1.",
          "Stehen im Nenner mehr x als im Zähler, wird der Exponent negativ: `x⁻²` bedeutet `1/x²`. Bringst du eine Potenz über den Bruchstrich, ändert ihr Exponent das Vorzeichen.",
        ],
        steps: ["Zieh x³ nach oben über den Bruchstrich."],
        watch: "`2x³` ist `2·x·x·x`: Der Exponent gehört nur zum x. `(2x)³` ist etwas anderes: Das ist `8x³`.",
      },
    ],
  },

  factor: {
    title: "Faktorisieren",
    blurb: "Faktorisieren ist Ausmultiplizieren rückwärts. Such einen Faktor, den alle Terme haben, und klammere ihn aus.",
    lesson: [
      {
        title: "Ausmultiplizieren rückwärts",
        text: [
          "Faktorisieren macht das Ausmultiplizieren rückgängig. `x² + 3x` ist `x·x + 3·x`. Beide Terme enthalten ein `x`, also kannst du es ausklammern: `x(x + 3)`.",
        ],
        steps: ["Tippe auf das ², um x² auszuschreiben.", "Jetzt haben beide Terme ein x. Zieh ein x ganz nach links vor den Term."],
        after: "Zur Probe multiplizierst du x(x + 3) aus. Du bekommst wieder x² + 3x.",
      },
      {
        title: "Zahlen zerlegen",
        text: [
          "Um einen gemeinsamen Faktor zu finden, zerlegst du Zahlen in Faktoren. Tippe in `2x + 6` auf die 6, dann wird daraus `2·3`. Jetzt haben beide Terme eine 2.",
        ],
        steps: ["Tippe auf die 6, um sie zu zerlegen.", "Zieh eine 2 nach vorn."],
      },
      {
        title: "Eine Klammer ausklammern",
        text: [
          "In `x(x + 2) + 3(x + 2)` haben beide Terme dieselbe Klammer `(x + 2)`. Sie ist ein gemeinsamer Faktor, also kannst du sie ausklammern wie jeden anderen auch.",
        ],
        steps: ["Zieh die (x + 2) nach vorn."],
      },
      {
        title: "Vier Terme: paarweise vorgehen",
        text: [
          "Bei vier Termen faktorisierst du erst die ersten beiden, dann die letzten beiden. Sind die beiden Klammern gleich, klammerst du auch diese Klammer aus.",
        ],
        watch: "Mach nach dem Faktorisieren immer die Probe durch Ausmultiplizieren. Es muss genau das herauskommen, womit du angefangen hast.",
      },
    ],
  },

  formulas: {
    title: "Formeln umstellen",
    blurb: "Eine Formel ist eine Gleichung mit mehreren Variablen. Mit denselben Schritten wie bei x stellst du sie nach einer Variablen um.",
    lesson: [
      {
        title: "Nach einer Variablen auflösen",
        text: [
          "`v = u + at` liefert eine Geschwindigkeit `v` aus einer Anfangsgeschwindigkeit `u`, einer Beschleunigung `a` und einer Zeit `t`. Umgestellt liefert sie stattdessen die Zeit: `t = (v − u)/a`.",
          "Bringst du eine Variable allein auf eine Seite, löst du die Formel nach ihr auf. Das geht genauso wie bei x. Behandle die anderen Variablen einfach wie Zahlen.",
        ],
        steps: ["Das t wird mit a multipliziert. Zieh zuerst das u hinüber.", "Jetzt zieh das a hinüber. Es teilt die andere Seite."],
        after: "Von rechts nach links gelesen: t = (v − u)/a.",
      },
      {
        title: "Variablen wandern wie Zahlen",
        text: [
          "Eine Variable, die eine ganze Seite multipliziert, kann über das `=` wandern und die andere Seite teilen, so wie aus `2x = 8` die Gleichung `x = 8/2` wurde. (Teilen darfst du nur durch eine Variable, die nicht 0 ist. In diesen Formeln ist sie das nie.)",
        ],
        steps: ["Zieh das m hinüber."],
        watch: "Nur ein Faktor der ganzen Seite kann hinüber. In `u + at` multipliziert das `a` nur das `t`, also bring zuerst das `u` hinüber.",
      },
      {
        title: "Variablen im Nenner",
        text: [
          "Ist eine ganze Seite ein Bruch, kann die Variable im Nenner hinüberwandern und die andere Seite multiplizieren, so wie aus `x/3 = 4` die Gleichung `x = 4·3` wurde.",
        ],
        steps: ["Zieh das A hinüber. Es multipliziert die andere Seite."],
      },
      {
        title: "Wenn die Variable zweimal vorkommt",
        text: [
          "In `ax + bx = c` kommt x zweimal vor. Wenn du nur einen Term verschiebst, steht x also noch nicht allein. Klammere x zuerst aus. Dann kann die Klammer, mit der es multipliziert wird, hinüber.",
        ],
        steps: ["Beide Terme haben ein x. Zieh ein x nach vorn.", "Jetzt zieh die ganze (a + b) hinüber."],
      },
    ],
  },

  inequalities: {
    title: "Ungleichungen",
    blurb:
      "Ungleichungen löst du wie Gleichungen, mit einem Unterschied: Multiplizierst oder dividierst du mit einer negativen Zahl, dreht sich das Ungleichheitszeichen um.",
    lesson: [
      {
        title: "Kleiner und größer",
        text: ["`x < 7` heißt: x ist kleiner als 7. Die offene Seite des Zeichens zeigt zur größeren Zahl."],
        steps: ["Wie bei einer Gleichung: Zieh die 2 hinüber.", "Rechne aus."],
      },
      {
        title: "Seiten tauschen",
        text: [
          "`3 > x` und `x < 3` sagen dasselbe: x ist kleiner als 3. Du darfst also die Seiten tauschen, musst dabei aber das Zeichen umdrehen.",
        ],
        steps: ["Zieh die 3 auf die andere Seite. Das Zeichen dreht sich um."],
      },
      {
        title: "Dieselben Schritte wie bei Gleichungen",
        text: [
          "Addierst oder subtrahierst du auf beiden Seiten dasselbe, bleibt das Zeichen gleich. Das gilt auch, wenn du beide Seiten mit einer positiven Zahl multiplizierst oder durch sie teilst.",
        ],
        steps: ["Zieh die 2 hinüber. Sie ist positiv, also bleibt das Zeichen gleich.", "Rechne aus."],
      },
      {
        title: "Ein Minus dreht das Zeichen um",
        text: ["Mit −1 zu multiplizieren kehrt die Reihenfolge um: `2 < 3`, aber `−2 > −3`. Wenn also ein Minus hinüberwandert, dreht sich das Zeichen um."],
        steps: ["Zieh nur das Minus hinüber. Das < dreht sich um."],
        after: "Probe mit einer Zahl: x = 0 erfüllt sowohl −x < 4 als auch x > −4.",
        watch: "Nur Multiplizieren oder Dividieren mit einer negativen Zahl dreht das Zeichen um. Wenn du einen Term hinüberbringst, passiert das nie.",
      },
    ],
  },

  fractions: {
    title: "Brüche",
    blurb:
      "Um Brüche zu addieren, machst du sie zuerst gleichnamig. Erweitern, also Zähler und Nenner mit derselben Zahl multiplizieren, ändert den Wert eines Bruchs nicht.",
    lesson: [
      {
        title: "Brüche addieren",
        text: [
          "`3/4` bedeutet 3 Viertel. Bei gleichen Nennern addierst du einfach die Zähler: 1 Fünftel plus 2 Fünftel sind 3 Fünftel, also `1/5 + 2/5 = 3/5`.",
        ],
        steps: ["Die Nenner sind gleich. Zieh einen Bruch auf den anderen.", "Rechne aus."],
      },
      {
        title: "Kürzen und Erweitern",
        text: [
          "Teilst du Zähler und Nenner durch dieselbe Zahl, ändert sich der Wert nicht: `6/8 = 3/4`. Das nennt man Kürzen.",
          "Multiplizierst du Zähler und Nenner mit derselben Zahl, ändert er sich auch nicht: `1/2 = 2/4 = 3/6`. Das nennt man Erweitern.",
        ],
        steps: ["Zieh die 8 auf die 6. Beide werden durch ihren gemeinsamen Teiler 2 geteilt."],
      },
      {
        title: "Gleichnamig machen",
        text: [
          "Um `1/2 + 1/3` zu rechnen, machst du zuerst aus beiden Sechstel. Erweitere `1/2` mit 3 und `1/3` mit 2. Jetzt haben beide den Nenner 6.",
        ],
        steps: ["Zieh die 3 aus ⅓ auf ½: Zähler und Nenner werden mit 3 multipliziert."],
        watch: "`1/2 + 1/3` ist nicht `2/5`. Zähler darfst du nur addieren, wenn die Nenner schon gleich sind.",
      },
      {
        title: "Brüche multiplizieren",
        text: ["Multiplizieren ist einfacher: Zähler mal Zähler, Nenner mal Nenner. Die Hälfte von einem Drittel ist `(1·1)/(2·3) = 1/6`."],
        steps: ["Zieh einen Bruch auf den anderen."],
        after: "Dann kürzt du gemeinsame Faktoren von Zähler und Nenner und bekommst 3/2.",
      },
    ],
  },

  simultaneous: {
    title: "Gleichungssysteme",
    blurb:
      "Zwei Gleichungen mit zwei Unbekannten, die gleichzeitig gelten. Löse eine Gleichung nach einer Variablen auf und setze sie in die andere ein.",
    lesson: [
      {
        title: "Zwei Gleichungen auf einmal",
        text: [
          "`y = 2x` und `x + y = 9` sind zwei Gleichungen mit denselben x und y. Eine Gleichung mit zwei Unbekannten hat viele Lösungen. Zwei Gleichungen zusammen haben meistens nur eine.",
          "Zum Lösen schaffst du eine Variable weg. Übrig bleibt eine Gleichung mit einer Unbekannten, und die kannst du schon lösen.",
        ],
      },
      {
        title: "Einsetzen",
        text: [
          "`y = 2x` sagt, dass y und 2x gleich sind. Du kannst also in der anderen Gleichung y durch 2x ersetzen. Das nennt man Einsetzungsverfahren.",
        ],
        steps: [
          "Zieh das y aus y = 2x auf das y in der anderen Gleichung.",
          "Jetzt kommt in der Gleichung nur noch x vor. Fass die x-Terme zusammen.",
        ],
        after: "Löse sie: x = 3. Dann setzt du x = 3 in y = 2x ein und bekommst y.",
      },
      {
        title: "Nach einer Variablen auflösen",
        text: [
          "Zum Einsetzen brauchst du eine Gleichung wie `y = …` oder `x = …`. Hast du keine, mach dir eine: Zieh in `x − y = 1` das −y hinüber, dann bekommst du `x = 1 + y`.",
        ],
        steps: [
          "Zieh in der zweiten Gleichung das −y über das =.",
          "Jetzt steht x allein. Zieh es auf das x in der ersten Gleichung.",
        ],
        after: "Jetzt kommt in der ersten Gleichung nur noch y vor: 2y + 1 = 7, also y = 3.",
        watch: "Setz immer den ganzen Term ein. Wenn x = 1 + y ist, dann ist 2x gleich 2(1 + y), nicht 2 + y.",
      },
      {
        title: "Die zweite Variable bestimmen",
        text: [
          "Kennst du eine Variable, zum Beispiel `x = 3`, setzt du sie in die andere Gleichung ein und bekommst die zweite. Zieh dazu das x aus `x = 3` auf ein x in der anderen Gleichung.",
        ],
      },
    ],
  },

  roots: {
    title: "Wurzeln",
    blurb: "√x ist x hoch ½, deshalb gelten die Potenzgesetze auch für Wurzeln.",
    lesson: [
      {
        title: "Quadratwurzeln",
        text: ["`√9` ist die Zahl, die mit sich selbst multipliziert 9 ergibt. Das ist 3, denn `3·3 = 9`."],
        steps: ["Tippe auf die 9, um sie in gleiche Faktoren zu zerlegen."],
        after:
          "Dann ziehst du eine 3 aus der Wurzel heraus. Wenn du verstanden hast, wie es geht, kannst du auf eine Wurzel wie √9 tippen und sie in einem Schritt ausrechnen.",
      },
      {
        title: "Eine Wurzel ist eine Potenz",
        text: ["`√x` ist `x` hoch `½`. Also ist `√x·√x = x^(1/2 + 1/2) = x`. Alle Potenzgesetze gelten auch für Wurzeln."],
        steps: ["Tippe darauf: Hoch ½ ist eine Quadratwurzel."],
      },
      {
        title: "Die Wurzel aus einem Produkt",
        text: ["Die Wurzel aus einem Produkt ist das Produkt der Wurzeln: `√(4x) = √4·√x = 2√x`."],
        steps: ["Zieh die 4 aus der Wurzel. Sie bekommt ihre eigene √."],
        after: "Und √4 ist 2, also ergibt das 2√x.",
        watch: "Bei einer Summe darfst du die Wurzel nicht aufteilen: `√(9 + 16)` ist `√25 = 5`, nicht `3 + 4`.",
      },
      {
        title: "Eine Wurzel auflösen",
        text: [
          "Um `√x = 3` zu lösen, quadrierst du beide Seiten. Tippe auf die Wurzel, um sie als `x^(1/2)` zu schreiben. Dann zieh das ½ über das =. Auf der anderen Seite wird daraus ein Quadrat.",
        ],
        steps: ["Tippe auf die Wurzel, um sie als Potenz zu schreiben.", "Zieh das ½ über das =. Daraus wird ein Quadrat.", "Rechne aus."],
      },
    ],
  },

  explog: {
    title: "Logarithmen",
    blurb:
      "ln(x) ist der Exponent, mit dem man e potenzieren muss, um x zu bekommen. Darum heben sich ln und e^ gegenseitig auf, und der Logarithmus eines Produkts ist die Summe der Logarithmen.",
    lesson: [
      {
        title: "Was ln bedeutet",
        text: [
          "`e` ist eine besondere Zahl, etwa 2,718. Der natürliche Logarithmus `ln(x)` ist der Exponent, mit dem man e potenzieren muss, um x zu bekommen. Also ist `ln(e³) = 3`.",
          "Das heißt: ln und e^ machen sich gegenseitig rückgängig. `e^(ln x) = x`.",
        ],
        steps: ["Zieh das e auf das ln. Die beiden heben sich auf."],
      },
      {
        title: "Logarithmus eines Produkts",
        text: [
          "Multiplizierst du Potenzen von e, addieren sich die Exponenten. Deshalb ist der Logarithmus eines Produkts die Summe der Logarithmen: `ln(2x) = ln(2) + ln(x)`.",
        ],
        steps: ["Zieh die 2 aus dem ln heraus. Sie bekommt ihr eigenes ln."],
      },
      {
        title: "Logarithmus einer Potenz",
        text: ["`x³` ist `x·x·x`, also ist `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
        steps: ["Zieh die 3 vor das ln."],
      },
      {
        title: "Gleichungen mit Logarithmen lösen",
        text: [
          "Um x aus dem Exponenten zu holen, logarithmierst du beide Seiten. Zieh in `e^x = 5` das e über das =. Daraus wird ln: `x = ln(5)`.",
        ],
        steps: ["Zieh das e über das =."],
      },
    ],
  },
};
