import type { Translation } from "../en";


export const de: Translation = {
  htmlLang: "de",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
  language: "Sprache",

  // Top bar
  makeExercises: "Aufgaben erstellen",
  skin: "Design",
  skins: { modern: "Modern", codex: "Codex", paper: "Papier", blackboard: "Tafel" },
  settings: "Einstellungen",
  numbersInColour: "Farbige Zahlen",
  debugMode: "Debug-Modus",
  sandboxInput: "Term oder Gleichung",
  sandboxPlaceholder: "z. B. 3(x - 2) = 2x + 1   oder   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Laden",
  debugOn: "Der Debug-Modus ist an: Tippe hier, um ihn auszuschalten",

  // Home
  heroBefore: "Algebra zum ",
  heroWord: "Anfassen",
  heroAfter: ".",
  heroText:
    "Zieh an einem beliebigen Teil einer Gleichung. Er bewegt sich nur so, wie es die Mathematik erlaubt. Forme um, bis alles aussieht wie das Ziel.",
  learningPath: "Lernpfad",
  chapterNodeLabel: (n: number, title: string) => `Kapitel ${n}: ${title}`,
  chapterN: (n: number) => `Kapitel ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Setzt voraus: ${titles}.`,
  startLesson: "Zur Lektion →",

  // Chapter page
  backToPath: "← Lernpfad",
  level: { easy: "Leicht", medium: "Mittel", hard: "Schwer" },
  anotherOne: "Noch eine →",
  progressHere:
    "Dein Fortschritt wird nur in diesem Browser gespeichert. Sichere ihn in einer Datei, damit er nicht verloren geht oder damit du ihn auf ein anderes Gerät mitnehmen kannst.",
  saveProgress: "Fortschritt als Datei exportieren",
  loadProgress: "Fortschritt aus einer Datei laden",
  progressSaved: "Gespeichert. Lade diese Datei hier oder in einem anderen Browser, dann hast du deinen Fortschritt wieder.",
  rightsReserved: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Alle Rechte vorbehalten.`,
  aboutLink: "Info",
  about: {
    title: "Über DragDropMath",
    sections: [
      {
        heading: "Worum es geht",
        text: [
          "Mit DragDropMath machst du Algebra mit den Händen. Du ziehst an einem beliebigen Teil eines Terms oder einer Gleichung, und er bewegt sich nur so, wie es die Mathematik erlaubt. Ein falscher Schritt passiert einfach nicht. So lernst du, was erlaubt ist, indem du es spürst, und nicht, indem du Regeln auswendig lernst.",
          "Ein Lernpfad führt vom Ordnen von Termen bis zu Gleichungssystemen. Jedes Kapitel hat eine Lektion, Übungen in drei Schwierigkeitsstufen und „Im Kopf“: Dort stellst du dir das Ergebnis zuerst im Kopf vor, bevor du es ausrechnest. Lehrkräfte können eigene Aufgabenreihen schreiben und als Link teilen.",
        ],
      },
      {
        heading: "Wer dahintersteckt",
        text: [
          "DragDropMath ist von Filippo Miatto. Algebra soll etwas sein, das man sehen und anfassen kann, und keine Liste von Regeln zum Auswendiglernen.",
        ],
      },
      {
        heading: "Datenschutz",
        text: [
          "Es gibt keine Konten, keine Werbung und kein Tracking. Dein Fortschritt wird nur in deinem eigenen Browser gespeichert, und nichts von dem, was du tust, wird irgendwohin geschickt. In den Einstellungen kannst du ihn in einer Datei sichern, damit er nicht verloren geht oder du ihn auf ein anderes Gerät mitnehmen kannst.",
          "Eine Aufgabenreihe steckt vollständig in ihrem Link: Online wird nichts davon gespeichert.",
        ],
      },
    ],
  },
  progressNotABackup: "Das ist keine Fortschrittsdatei von DragDropMath.",
  showMove: "Zeigen",
  lesson: "Lektion",
  practice: "Üben",
  predict: "Im Kopf",
  scores: "Punktestand bei „Im Kopf“",
  scoreOf: (n: number) => `Punkte: ${n}`,
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) =>
    `Punktestand ${level}: ${now}${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  drills: {
    commute: {
      name: "Reihenfolge tauschen",
      how: "Zieh einen Term an seinem Nachbarn vorbei. Bei + und × ist die Reihenfolge egal.",
      text: [
        "In welcher Reihenfolge du addierst, ändert das Ergebnis nicht: `2 + x` und `x + 2` sind dasselbe.",
        "Jeder Teil einer Summe heißt Term. Ein Term nimmt sein Vorzeichen mit, wenn er wandert: In `5 − 3 + x` gehört das Minus zur 3.",
      ],
    },
    combine: {
      name: "Zahlen addieren",
      how: "Zieh eine Zahl auf die andere, um sie zu addieren.",
      text: ["Zwei Zahlen in derselben Summe kannst du addieren. Eine Variable steht für eine Zahl, die wir noch nicht kennen, deshalb bleibt sie, wie sie ist."],
    },
    "multiply-numbers": {
      name: "Zahlen multiplizieren",
      how: "Zieh eine Zahl auf die Zahl, mit der sie multipliziert wird.",
      text: ["Auch beim Multiplizieren ist die Reihenfolge egal: `2·x·5` ist `2·5·x`. Also kannst du die 2 und die 5 multiplizieren und bekommst `10x`."],
    },
    "numbers-first": {
      name: "Zahl nach vorn",
      how: "Tippe auf ein Produkt wie `x·3`, um es wie üblich zu schreiben: `3x`.",
      text: ["Wir schreiben die Zahl zuerst und lassen den Malpunkt weg: Statt `x·3` schreibt man `3x`. Das ist so einfach, dass es ab jetzt von selbst passiert."],
    },
    "multiply-out": {
      name: "Produkt ausrechnen",
      how: "Tippe auf ein Produkt aus Zahlen wie `2·3`, um es auszurechnen.",
      text: ["Ein Produkt aus reinen Zahlen kannst du ausrechnen: `2·3` ist 6."],
    },
    collect: {
      name: "Gleichartige Terme zusammenfassen",
      how: "Zieh einen Term auf einen gleichartigen, also einen mit derselben Variablen. Die beiden werden addiert.",
      text: [
        "`3x` bedeutet `x + x + x`. Also ist `3x + 2x` drei x plus zwei x, zusammen `5x`.",
        "Addieren kannst du nur gleichartige Terme, also Terme mit genau denselben Variablen. Aus `3x + 2` wird nicht `5x`, und x-Terme und y-Terme bleiben getrennt.",
      ],
    },
    "collect-cancel": {
      name: "Gegenzahlen aufheben",
      how: "Zieh einen Term auf denselben Term mit umgekehrtem Vorzeichen. Die beiden heben sich auf.",
      text: ["Beim Subtrahieren geht es genauso: `5y − 2y` ist `3y`. Etwas minus sich selbst ist 0, also ist `a + b − a` einfach `b`."],
    },
    distribute: {
      name: "Klammer ausmultiplizieren",
      how: "Zieh die Zahl vor der Klammer auf die Klammer: Sie wird mit jedem Term darin multipliziert. Dann tippe auf das ·, um die Zahlen auszurechnen.",
      text: [
        "`2(x + 3)` bedeutet 2-mal `(x + 3)`: 2-mal x plus 2-mal 3, also `2x + 2·3`. Die Zahl vor der Klammer wird mit jedem Term in der Klammer multipliziert.",
        "Stell dir ein Rechteck vor, das 2 hoch und `x + 3` breit ist. Seine beiden Teile haben die Flächeninhalte `2·x` und `2·3`, und zusammen ergeben sie das ganze Rechteck.",
      ],
    },
    "distribute-neg": {
      name: "Minus vor der Klammer",
      how: "Zieh das Minus auf die Klammer. Jedes Vorzeichen darin dreht sich um.",
      text: ["`−(x − 4)` bedeutet −1 mal die Klammer. Die −1 wird mit jedem Term multipliziert, deshalb dreht sich jedes Vorzeichen in der Klammer um."],
    },
    "factor-out": {
      name: "Gemeinsamen Faktor ausklammern",
      how: "Beide Terme haben einen Faktor gemeinsam. Halte ihn in einem der Terme gedrückt und zieh ihn nach vorn, links über das Ende hinaus.",
      text: [
        "Faktorisieren heißt, eine Summe als Produkt zu schreiben. In `3x + 3y` ist jeder Term etwas mal 3. Also kannst du die 3 einmal vor eine Klammer schreiben, in der steht, was von jedem Term übrig bleibt: `3x + 3y = 3(x + y)`.",
        "Das stimmt, weil du beim Ausmultiplizieren von `3(x + y)` wieder `3x + 3y` bekommst: Die 3 wird mit jedem Term in der Klammer multipliziert. So kannst du auch jedes Ausklammern überprüfen.",
      ],
    },
    "split-exponent": {
      name: "Exponent aufteilen",
      how: "Zieh einen Term aus dem Exponenten heraus. Die Potenz zerfällt in zwei Potenzen mit derselben Basis.",
      text: ["`2^(x + 3)` sind x + 3 Zweien, alle miteinander multipliziert: erst x Stück, dann noch 3. Also ist es `2^x·2^3`: Aus einer Summe im Exponenten wird ein Produkt von Potenzen."],
    },
    "merge-powers": {
      name: "Gleiche Basis: Exponenten addieren",
      how: "Zieh eine Potenz auf die andere oder tippe auf das · dazwischen. Die Exponenten werden addiert: Tippe auf das +, um sie auszurechnen.",
      text: [
        "`x³` bedeutet `x·x·x`. Die kleine Zahl, der Exponent, zählt die x.",
        "Also ist `x²·x³` zwei x mal drei x, insgesamt fünf x. Multiplizierst du Potenzen mit gleicher Basis, werden die Exponenten addiert.",
      ],
    },
    "power-to-product": {
      name: "Ein Quadrat als Produkt",
      how: "Tippe auf das ², um die Klammer zweimal hinzuschreiben. Dann multipliziere aus und fasse gleichartige Terme zusammen.",
      text: ["`(x + 1)²` ist `(x + 1)(x + 1)`, also multiplizierst du es genauso aus."],
    },
    "move-term": {
      name: "Term hinüberbringen",
      how: "Zieh die Zahl über das =. Dabei ändert sich ihr Vorzeichen. Dann tippe auf das −, um es auszurechnen.",
      text: [
        "Eine Gleichung sagt, dass zwei Seiten gleich sind. Machst du auf beiden Seiten dasselbe, bleiben sie gleich.",
        "Genau das passiert, wenn ein Term über das `=` wandert. Aus `x + 3 = 10` wird, wenn du auf beiden Seiten 3 subtrahierst, `x = 10 − 3`. Deshalb wird aus `+3` auf der anderen Seite `−3`.",
      ],
    },
    "move-factor": {
      name: "Beide Seiten dividieren",
      how: "Zieh die Zahl vor der Variablen über das =. Jetzt teilt sie die andere Seite. Dann tippe auf den Bruchstrich, um es auszurechnen.",
      text: ["Eine Zahl, die eine ganze Seite multipliziert, teilt die andere Seite, wenn sie hinüberwandert. Aus `2x = 8` wird, wenn du beide Seiten durch 2 teilst, `x = 8/2`."],
    },
    "move-denominator": {
      name: "Beide Seiten multiplizieren",
      how: "Zieh den Nenner des Bruchs über das =. Jetzt multipliziert er die andere Seite. Dann tippe auf das ·, um es auszurechnen.",
      text: ["Der Nenner eines Bruchs multipliziert die andere Seite, wenn er hinüberwandert. Aus `x/3 = 4` wird, wenn du beide Seiten mit 3 multiplizierst, `x = 4·3`."],
    },
    "move-sign": {
      name: "Minus hinüberbringen",
      how: "Zieh nur das Minus über das =. Die andere Seite ändert ihr Vorzeichen.",
      text: ["Auch ein Minus vor einer ganzen Seite kann hinüberwandern: Beide Seiten werden mit −1 multipliziert, also wird aus `−x = 6` dann `x = −6`."],
    },
    "swap-sides": {
      name: "Seiten tauschen",
      how: "Zieh eine Seite über das = und am anderen Ende vorbei. Die beiden Seiten tauschen die Plätze.",
      text: ["`7 = x` und `x = 7` sagen dasselbe, also dürfen die beiden Seiten die Plätze tauschen."],
    },
    "evaluate-fraction": {
      name: "Bruch ausrechnen",
      how: "Tippe auf den Bruchstrich, um den Bruch auszurechnen.",
      text: ["Einen Bruch, der eine ganze Zahl ergibt, kannst du ausrechnen: `12/3` ist 4."],
    },
    "divide-numbers": {
      name: "Bruch kürzen",
      how: "Halte die Zahl im Nenner gedrückt und zieh sie auf die im Zähler, oder tippe auf den Bruchstrich. Beide werden durch ihren gemeinsamen Teiler geteilt.",
      text: ["Du kürzt einen Bruch, indem du Zähler und Nenner durch dieselbe Zahl teilst: `6/8 = 3/4`. Sein Wert ändert sich dabei nicht."],
    },
    "letter-in": {
      name: "Variable mal Klammer",
      how: "Zieh die Variable vor der Klammer auf die Klammer. Dann zieh die beiden x aufeinander: `x·x` ist `x²`.",
      text: ["Die Variable wird mit jedem Term in der Klammer multipliziert, genau wie eine Zahl: `x(x + 3) = x·x + x·3`. Und `x·x` ist eine Potenz, nämlich `x²`, wie im Kapitel Potenzen."],
    },
    "factor-then-cancel": {
      name: "Erst ausklammern, dann kürzen",
      how: "Halte die Zahl in einem Term im Zähler gedrückt und zieh sie nach vorn, links über das Ende hinaus. Dann zieh die Zahl im Nenner darauf: Die beiden kürzen sich.",
      text: ["Kürzen darfst du nur einen Faktor des ganzen Zählers. In `(2x + 6)/2` steckt die 2 in jedem Term einzeln, also klammerst du sie zuerst aus: `(2(x + 3))/2`. Jetzt ist sie ein Faktor des ganzen Zählers und lässt sich mit dem Nenner kürzen."],
    },
    "cancel-factor": {
      name: "Gemeinsamen Faktor kürzen",
      how: "Zieh die Zahl im Nenner auf dieselbe Zahl im Zähler. Beide fallen weg.",
      text: ["Dieselbe Zahl im Zähler und im Nenner kürzt sich weg: `(3x)/3` ist `x`."],
    },
    "power-of-power": {
      name: "Potenzen potenzieren",
      how: "Zieh den äußeren Exponenten auf den inneren. Sie werden multipliziert: Tippe auf das ·, um es auszurechnen.",
      text: ["`(x²)³` ist `x²·x²·x²`. Das sind 2 + 2 + 2 = 6 x, also werden die Exponenten multipliziert."],
    },
    "divide-powers": {
      name: "Gleiche Basis: Exponenten subtrahieren",
      how: "Zieh die Potenz im Nenner auf die im Zähler. Die Exponenten werden subtrahiert: Tippe auf das −, um es auszurechnen.",
      text: ["In `x⁵/x²` stehen fünf x im Zähler und zwei im Nenner. Zwei kürzen sich jeweils weg, und drei bleiben im Zähler: Beim Dividieren werden die Exponenten subtrahiert."],
    },
    "flip-across-bar": {
      name: "Über den Bruchstrich",
      how: "Zieh die Potenz nach oben über den Bruchstrich. Ihr Exponent ändert das Vorzeichen.",
      text: ["Stehen mehr x im Nenner, wird der Exponent negativ: `x⁻²` bedeutet `1/x²`. Wandert eine Potenz über den Bruchstrich, ändert ihr Exponent das Vorzeichen."],
    },
    "power-one": {
      name: "Hoch 1",
      how: "Zieh den Exponenten 1 auf seine Basis.",
      text: ["`x¹` ist ein einziges x, also einfach `x`. Das ist so einfach, dass es ab jetzt von selbst passiert."],
    },
    "zero-power": {
      name: "Hoch 0",
      how: "Halte den Exponenten 0 gedrückt und zieh ihn auf seine Basis. Dann tippe auf das +, um zu addieren.",
      text: ["`x³/x³` ist 1, und gleichzeitig ist es `x^(3 − 3) = x⁰`. Also ist alles hoch 0 gleich 1."],
    },
    "tap-power": {
      name: "Potenz ausrechnen",
      how: "Tippe auf den Exponenten, um die Potenz auszurechnen: Aus `2³` wird 8.",
      text: ["Die Potenz einer Zahl kannst du ausrechnen: `2³` ist `2·2·2 = 8`."],
    },
    "power-of-product": {
      name: "Exponent in die Klammer",
      how: "Zieh den Exponenten in die Klammer: Jeder Faktor darin bekommt einen eigenen. Dann tippe auf den Exponenten der Zahl, um die Potenz auszurechnen.",
      text: ["`(2x)³` ist `2x·2x·2x`, also `2³·x³`. Jeder Faktor in der Klammer bekommt den Exponenten."],
    },
    "split-number": {
      name: "Zahl zerlegen",
      how: "Tippe auf die Zahl, um sie in zwei Faktoren zu zerlegen. Dann zieh den Faktor, den beide Terme gemeinsam haben, nach vorn, links über das Ende hinaus.",
      text: ["Um einen gemeinsamen Faktor zu finden, zerlegst du Zahlen in Faktoren. In `2x + 6` ist die 6 gleich `2·3`, und schon haben beide Terme eine 2."],
    },
    "split-term": {
      name: "Mittleren Term aufteilen",
      how: "Tippe auf den mittleren Term. Er teilt sich in zwei Terme, und du kannst paarweise ausklammern.",
      text: [
        "Um `x² + 5x + 6` zu faktorisieren, suchst du zwei Zahlen, deren Summe 5 und deren Produkt 6 ist: 2 und 3. Schreib `5x` als `2x + 3x`.",
        "Jetzt hast du vier Terme und kannst paarweise ausklammern: `x(x + 2) + 3(x + 2)`, dann `(x + 2)(x + 3)`.",
      ],
    },
    "difference-of-squares": {
      name: "Dritte binomische Formel",
      how: "Tippe auf das Minus zwischen den beiden Quadraten.",
      text: ["Ein Quadrat minus ein Quadrat lässt sich immer auf dieselbe Weise faktorisieren: `a² − b² = (a − b)(a + b)`. Multiplizier zur Probe aus: Die mittleren Terme heben sich auf."],
    },
    "factor-shared": {
      name: "Paarweise ausklammern",
      how: "Halte das `x` eines Terms gedrückt und zieh es auf einen anderen Term mit `x`: Es wird aus beiden ausgeklammert. Mach dasselbe mit den letzten beiden Termen und klammere dann die Klammer aus, die beide gemeinsam haben.",
      text: ["Bei vier Termen arbeitest du paarweise. Klammere aus den ersten beiden Termen einen gemeinsamen Faktor aus, dann aus den letzten beiden. Sind die beiden Klammern gleich, klammerst du auch die Klammer aus."],
    },
    "move-letter-factor": {
      name: "Durch eine Variable teilen",
      how: "Zieh eine der multiplizierten Variablen über das =. Jetzt teilt sie die andere Seite.",
      text: [
        "Eine Formel ist eine Gleichung mit mehreren Variablen. Bringst du eine Variable allein auf eine Seite, stellst du die Formel nach ihr um. Das geht wie das Auflösen nach x: Behandle die anderen Variablen wie Zahlen.",
        "Eine Variable, die eine ganze Seite multipliziert, kann hinüberwandern und die andere Seite teilen: Aus `F = ma` wird `F/m = a`. (Das geht nur mit einer Variablen, die nicht 0 ist. In diesen Formeln ist sie das nie.)",
        "Steht die gesuchte Variable an zwei Stellen, wie in `ax + bx = c`, klammerst du sie zuerst aus: `x(a + b) = c`. Dann kann die ganze Klammer hinüberwandern.",
      ],
    },
    "move-letter-denominator": {
      name: "Mit einer Variablen multiplizieren",
      how: "Zieh die Variable im Nenner über das =. Jetzt multipliziert sie die andere Seite.",
      text: ["Eine Variable im Nenner einer ganzen Seite kann hinüberwandern und die andere Seite multiplizieren: Aus `P = F/A` wird `PA = F`."],
    },
    "ineq-move-term": {
      name: "Term hinüberbringen",
      how: "Zieh die Zahl über das Ungleichheitszeichen. Ihr Vorzeichen ändert sich, das Ungleichheitszeichen bleibt, wie es ist. Dann tippe auf das −, um es auszurechnen.",
      text: [
        "`x < 7` heißt: x ist kleiner als 7. Die offene Seite des Zeichens zeigt zur größeren Zahl.",
        "Addierst oder subtrahierst du auf beiden Seiten dasselbe, bleibt das Zeichen, wie es ist. Ein Term wandert also genauso hinüber wie bei einer Gleichung.",
      ],
    },
    "ineq-swap": {
      name: "Seiten tauschen",
      how: "Zieh eine Seite an der anderen vorbei. Das Ungleichheitszeichen dreht sich dabei um.",
      text: ["`3 > x` und `x < 3` sagen dasselbe: x ist kleiner als 3. Die Seiten dürfen also tauschen, solange sich das Zeichen mit umdreht."],
    },
    "ineq-sign": {
      name: "Minus hinüberbringen",
      how: "Zieh nur das Minus hinüber. Das Ungleichheitszeichen dreht sich um.",
      text: ["Multiplizieren mit −1 kehrt die Reihenfolge um: `2 < 3`, aber `−2 > −3`. Wandert also ein Minus hinüber, dreht sich das Zeichen um."],
    },
    "add-fractions": {
      name: "Brüche addieren",
      how: "Die Nenner sind gleich: Zieh einen Bruch auf den anderen oder tippe auf das + dazwischen. Dann tippe auf das + im Zähler, um die Zähler zu addieren.",
      text: ["`3/4` bedeutet 3 Viertel. Sind die Nenner gleich, addierst du einfach die Zähler: 1 Fünftel plus 2 Fünftel sind 3 Fünftel, also `1/5 + 2/5 = 3/5`."],
    },
    "expand-fraction": {
      name: "Gleichnamig machen",
      how: "Halte den Nenner des einen Bruchs gedrückt und zieh ihn auf den anderen Bruch, dann umgekehrt: Jetzt haben beide denselben Nenner. Tippe auf jedes ·, um Zähler und Nenner auszurechnen, dann addiere die Brüche.",
      text: [
        "Multiplizierst du Zähler und Nenner mit derselben Zahl, ändert sich der Bruch nicht: `1/2 = 2/4 = 3/6`. Das nennt man Erweitern.",
        "So machst du Brüche gleichnamig. Um `1/2 + 1/3` zu rechnen, erweiterst du `1/2` mit 3 und `1/3` mit 2: Jetzt sind beides Sechstel.",
      ],
    },
    "multiply-fractions": {
      name: "Brüche multiplizieren",
      how: "Tippe auf das · zwischen den Brüchen oder zieh einen auf den anderen: Zähler mal Zähler, Nenner mal Nenner.",
      text: ["Multiplizieren ist einfacher: Zähler mal Zähler und Nenner mal Nenner. Die Hälfte von einem Drittel ist `(1·1)/(2·3) = 1/6`."],
    },
    "divide-by-fraction": {
      name: "Durch einen Bruch teilen",
      how: "Zieh den Bruch im Nenner nach oben in den Zähler. Er wird zum Kehrwert und multipliziert. Dann tippe auf das ·, um es auszurechnen.",
      text: ["Durch einen Bruch teilst du, indem du mit seinem Kehrwert multiplizierst: `4/(3/5)` ist `4·(5/3)`."],
    },
    "split-fraction": {
      name: "Bruch aufteilen",
      how: "Zieh einen Term aus dem Zähler heraus. Er nimmt eine Kopie des Nenners mit.",
      text: ["Eine Summe im Zähler kannst du in einen Bruch pro Term aufteilen, alle mit demselben Nenner: `(x + 5)/6 = x/6 + 5/6`."],
    },
    "times-one": {
      name: "Mal 1",
      how: "Halte die 1 gedrückt und zieh sie auf das, was sie multipliziert.",
      text: ["Mal 1 ändert nichts: `1·x` ist einfach `x`. Das ist so einfach, dass es ab jetzt von selbst passiert."],
    },
    substitute: {
      name: "Einsetzen",
      how: "Zieh das `y` aus `y = …` auf das `y` in der anderen Gleichung: Es wird durch das ersetzt, wofür `y` steht. Dann löse nach x auf und setze x in die erste Gleichung ein, um y zu bestimmen.",
      text: [
        "`y = 2x` und `x + y = 9` sind zwei Gleichungen mit denselben x und y, und beide gelten gleichzeitig. Eine Gleichung mit zwei Unbekannten hat viele Lösungen, zwei zusammen meistens nur eine.",
        "`y = 2x` sagt, dass y und 2x gleich sind. Also kannst du in der anderen Gleichung y durch 2x ersetzen. Übrig bleibt eine Gleichung mit nur einer Variablen, und die kannst du lösen.",
        "Steht in keiner Gleichung eine Variable allein, sorgst du zuerst dafür: In `x − y = 1` bringst du das −y hinüber und bekommst `x = 1 + y`.",
      ],
    },
    "evaluate-root": {
      name: "Wurzel ausrechnen",
      how: "Tippe auf die Wurzel, um sie auszurechnen.",
      text: ["`√9` ist die Zahl, die mit sich selbst multipliziert 9 ergibt: 3, denn `3·3 = 9`. Genauso ist `∛8 = 2`, denn `2·2·2 = 8`."],
    },
    "split-square": {
      name: "Unter der Wurzel zerlegen",
      how: "Tippe auf die Zahl unter der Wurzel: Eine Quadratzahl wird abgespalten (unter einer dritten Wurzel eine Kubikzahl). Dann zieh sie aus der Wurzel und tippe auf ihre Wurzel, um sie auszurechnen.",
      text: ["Auch eine Wurzel, die nicht aufgeht, kannst du vereinfachen. Zerlege die Zahl darunter so, dass eine Quadratzahl abgespalten wird: `√12 = √(4·3)`."],
    },
    "join-powers": {
      name: "Wurzeln zusammenfassen",
      how: "Zieh eine Wurzel auf die andere. Sie kommen unter ein gemeinsames Wurzelzeichen.",
      text: [
        "`√2·√3` zum Quadrat ist `2·3`, also ist `√2·√3` die Zahl, deren Quadrat 6 ist: `√(2·3) = √6`. Zwei Wurzeln derselben Art lassen sich unter einer zusammenfassen.",
        "Dasselbe gilt für jeden gemeinsamen Exponenten: `x³y³` ist xxx·yyy, also xy·xy·xy, und das ist `(xy)³`.",
      ],
    },
    "pull-out-of-power": {
      name: "Wurzel aufteilen",
      how: "Zieh die Zahl aus der Wurzel: Sie bekommt ihre eigene Wurzel. Dann tippe auf diese Wurzel, um sie auszurechnen.",
      text: ["Die Wurzel aus einem Produkt ist das Produkt der Wurzeln: `√(4x) = √4·√x = 2√x`."],
    },
    "root-notation": {
      name: "Wurzel als Potenz",
      how: "Tippe auf die Wurzel, um sie als Potenz zu schreiben: √ ist hoch ½, ∛ ist hoch ⅓.",
      text: ["Jede Wurzel ist eine Potenz: `√x = x^(1/2)`, `∛x = x^(1/3)`, und die n-te Wurzel aus x ist `x^(1/n)`. Darum gelten alle Potenzgesetze auch für Wurzeln: `√x·√x = x^(1/2 + 1/2) = x`."],
    },
    "root-of-power": {
      name: "Wurzel aus einer Potenz",
      how: "Tippe auf die Wurzel, um sie als Potenz zu schreiben. Dann zieh den äußeren Exponenten auf den inneren und rechne das Produkt aus.",
      text: ["Eine Wurzel ist eine Potenz, also ist eine Wurzel aus einer Potenz eine Potenz einer Potenz: `∛(x⁶) = (x⁶)^(1/3) = x^(6·1/3) = x²`. Die Exponenten werden multipliziert, wie im Kapitel Potenzen."],
    },
    "fraction-power": {
      name: "Wurzeln und Potenzen zusammen",
      how: "Zieh die Wurzel auf die Potenz: Die Exponenten werden addiert. Dann addiere die Brüche im Exponenten.",
      text: ["`√x` ist `x^(1/2)`, also ist `√x·x² = x^(1/2 + 2) = x^(5/2)`. Ein Bruch im Exponenten funktioniert wie jeder andere Exponent: Multiplizierst du Potenzen, addierst du die Exponenten."],
    },
    "root-across": {
      name: "Wurzelexponent über das =",
      how: "Zieh das ½ (oder ⅓ oder ¼) über das =. Auf der anderen Seite wird daraus ein Quadrat (oder hoch 3 oder hoch 4). Dann tippe auf den Exponenten, um es auszurechnen.",
      text: ["Um `√x = 3` zu lösen, quadrierst du beide Seiten. Schreibst du es als Potenz, `x^(1/2) = 3`, wandert das ½ hinüber und wird zum Quadrat: `x = 3²`."],
    },
    "exp-of-log": {
      name: "Potenz hebt Logarithmus auf",
      how: "Zieh die Basis auf den Logarithmus in ihrem Exponenten. Die beiden heben sich auf.",
      text: ["`e` ist eine besondere Zahl, ungefähr 2,718. `ln(x)` ist der Exponent, mit dem man e potenzieren muss, um x zu bekommen. Deshalb heben sich ln und e^ gegenseitig auf: `e^(ln x) = x`. Logarithmen zu anderen Basen funktionieren genauso: `2^(log₂ x) = x`."],
    },
    "evaluate-log": {
      name: "Bekannte Logarithmen",
      how: "Tippe auf den Logarithmus, um ihn auszurechnen: `ln(e) = 1`, und der Logarithmus von 1 ist 0.",
      text: ["`ln(e) = 1`, denn `e¹ = e`. Und der Logarithmus von 1 ist 0, denn alles hoch 0 ist 1."],
    },
    "power-of-base": {
      name: "Als Potenz der Basis",
      how: "Tippe auf die Zahl im Logarithmus, um sie als Potenz von 2 zu schreiben. Dann zieh den Exponenten nach vorn vor den Logarithmus und tippe auf den Logarithmus.",
      text: ["Um `log₂(8)` auszurechnen, schreibst du 8 als Potenz von 2: `8 = 2³`, also ist `log₂(8) = 3`."],
    },
    "log-of-product": {
      name: "Logarithmus aufteilen",
      how: "Zieh die Zahl aus dem Logarithmus heraus. Sie bekommt ihren eigenen Logarithmus.",
      text: ["Beim Multiplizieren von Potenzen werden die Exponenten addiert. Deshalb ist der Logarithmus eines Produkts eine Summe von Logarithmen: `ln(2x) = ln(2) + ln(x)`."],
    },
    "log-of-root": {
      name: "Logarithmus einer Wurzel",
      how: "Tippe auf die Wurzel, um sie als Potenz zu schreiben. Dann zieh den Exponenten nach vorn vor den Logarithmus.",
      text: ["Eine Wurzel ist eine Potenz, `√x = x^(1/2)`, also kommt ihr Exponent wie jeder andere vor den Logarithmus: `ln(√x) = ½ln(x)`."],
    },
    "log-of-power": {
      name: "Exponent vor den Logarithmus",
      how: "Zieh den Exponenten nach vorn vor den Logarithmus.",
      text: ["`x³` ist `x·x·x`, also ist `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
    },
    "power-into-log": {
      name: "Zahl in den Logarithmus",
      how: "Zieh die Zahl vor dem Logarithmus auf den Logarithmus. Darin wird sie zum Exponenten.",
      text: ["Das geht auch umgekehrt: `3ln(x)` ist `ln(x³)`."],
    },
    "combine-logs": {
      name: "Logarithmen zusammenfassen",
      how: "Zieh einen Logarithmus auf den anderen oder tippe auf das + (oder −) dazwischen. Bei einer Summe wird innen multipliziert, bei einer Differenz dividiert.",
      text: ["Auch das geht umgekehrt: `ln(a) + ln(b) = ln(ab)` und `ln(a) − ln(b) = ln(a/b)`."],
    },
    "move-exponent-term": {
      name: "Zwischen den Exponenten",
      how: "Beide Seiten sind Potenzen mit derselben Basis. Zieh einen Term aus dem einen Exponenten in den anderen: Sein Vorzeichen ändert sich.",
      text: [
        "Sind beide Seiten Potenzen mit derselben Basis, sind ihre Exponenten gleich. Sie verhalten sich also wie die beiden Seiten einer Gleichung.",
        "Aus `2^(x − 3) = 2^4` wird `2^x = 2^(4 + 3)`: Beide Seiten wurden mit `2^3` multipliziert.",
      ],
    },
    "exp-across": {
      name: "Basis über das =",
      how: "Zieh die Basis über das =. Auf der anderen Seite wird daraus ein Logarithmus.",
      text: ["Um x aus dem Exponenten zu holen, logarithmierst du beide Seiten. Aus `e^x = 5` wandert das e hinüber und wird zu ln: `x = ln(5)`."],
    },
    "log-across": {
      name: "Logarithmus über das =",
      how: "Zieh den Logarithmus über das =. Auf der anderen Seite wird daraus eine Potenz. Ist es die Potenz einer Zahl, tippe auf ihren Exponenten, um sie auszurechnen.",
      text: ["Ein Logarithmus wird durch eine Potenz aufgehoben. Aus `ln(x) = 2` wandert das ln hinüber und wird zu e: `x = e²`."],
    },
    "bracket-times-bracket": {
      name: "Klammer mal Klammer",
      how: "Zieh eine Klammer auf die andere: Sie wird mit beiden Termen darin multipliziert. Dann multipliziere jede Klammer genauso aus und fasse gleichartige Terme zusammen.",
      text: [
        "In `(x + 1)(x + 2)` ist die erste Klammer ein Faktor: Sie wird mit der ganzen zweiten Klammer multipliziert, also mit dem x und mit der 2. Danach wird jedes `(x + 1)` der Reihe nach ausmultipliziert.",
        "Zwei Terme mal zwei Terme ergibt vier Terme. Dann fasst du gleichartige Terme zusammen: `(x + 1)(x + 2) = x² + 3x + 2`.",
      ],
    },
    "bracket-out": {
      name: "Klammer ausklammern",
      how: "Beide Terme haben dieselbe Klammer. Halte sie in einem der Terme gedrückt und zieh sie nach vorn, links über das Ende hinaus.",
      text: ["Auch eine ganze Klammer kann ein gemeinsamer Faktor sein. In `x(x + 2) + 3(x + 2)` haben beide Terme `(x + 2)`, also kommt die Klammer wie jeder andere Faktor nach vorn: `(x + 2)(x + 3)`."],
    },
    "ineq-move-factor": {
      name: "Beide Seiten dividieren",
      how: "Zieh die Zahl vor der Variablen über das Zeichen. Jetzt teilt sie die andere Seite, und das Zeichen bleibt, wie es ist. Dann tippe auf den Bruchstrich.",
      text: ["Auch wenn du beide Seiten mit einer positiven Zahl multiplizierst oder durch sie dividierst, bleibt das Zeichen, wie es ist: Aus `2x < 8` wird `x < 8/2`."],
    },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Aufgabe ${label}${solved ? " – gelöst" : ""}`,
  // Guided example
  done: "Fertig.",
  startOver: "Von vorn",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: Lektion`,
  nextExercise: "Nächste Aufgabe →",
  exercisesNav: "Aufgaben",
  previousTitle: (label: string) => `Vorherige: Aufgabe ${label}`,
  previousLabel: (label: string) => `Vorherige Aufgabe (${label})`,
  nextTitle: (label: string) => `Nächste: Aufgabe ${label}`,
  nextLabel: (label: string) => `Nächste Aufgabe (${label})`,
  exerciseN: (label: string) => `Aufgabe ${label}`,
  predictPrompt: "Stell es dir erst im Kopf vor: Was wird daraus?",
  reveal: "Auflösen",
  predictedBeforeRight: "Diese hast du auf Anhieb richtig vorhergesagt.",
  predictedBeforeWrong: (picked: boolean) => `Deine erste Antwort war ${picked ? "die rote" : "falsch"}. Die grüne ist richtig.`,
  rightFirstTime: "Auf Anhieb richtig. Jetzt rechne es aus.",
  notQuite: "Nicht ganz. Die grüne ist richtig. Rechne es aus, dann siehst du, wo dein Fehler lag.",
  revealedNote: "Die grüne ist richtig. Jetzt rechne es aus.",
  solvedBefore: "✓ Diese Aufgabe hast du schon gelöst. Du kannst sie noch einmal lösen.",
  makeItLookLike: "Mach daraus",
  solveFor: (letters: string[]) => `Löse nach ${letters.map((l) => `\`${l}\``).join(" und ")} auf.`,
  pickFirst: "Wähl oben eine Antwort, dann rechne hier.",
  hint: "Tipp",
  undo: "Rückgängig",
  solvedBang: "Gelöst!",
  moveCrashed: "Bei diesem Schritt ist etwas schiefgegangen.",
  moveCrashedDetails: "Details stehen in der Browser-Konsole.",
  tryAgain: "Nochmal versuchen",

  // Making a set
  ownTitle: "Eigene Aufgaben",
  ownIntro:
    "Stell eine Aufgabenreihe zusammen, zum Beispiel für deine Klasse, und teile sie als Link. Bei jeder Aufgabe stellen sich die Schülerinnen und Schüler das Ergebnis zuerst im Kopf vor und rechnen es dann von Hand aus. Online wird nichts gespeichert: Die ganze Reihe steckt im Link.",
  upload: "Eine .yaml-Datei hochladen",
  startFromExample: "Mit dem Beispiel anfangen",
  yamlLabel: "Die Aufgabenreihe als YAML",
  check: "Prüfen",
  checking: "Prüfe, ob es sich mit diesen Schritten lösen lässt …",
  unsolvable:
    "Mit diesen Schritten nicht in 10 Zügen lösbar. Vielleicht braucht es Schritte aus einem späteren Kapitel (`moves:`).",
  solvableIn: (n: number) => `Lösbar in ${n} ${n === 1 ? "Schritt" : "Schritten"}.`,
  linkLabel: "Link zur Aufgabenreihe",
  copied: "Kopiert",
  copy: "Kopieren",
  open: "Öffnen",
  makeLink: "Link erstellen",
  fixMarked: "Korrigiere die mit ✗ markierten Aufgaben und prüfe dann noch einmal.",
  howToWrite: "So schreibst du eine Aufgabenreihe",
  formatExample: `title: Ein Name für die Reihe
moves: balance       # optional: Nummer, ID oder Titel eines Kapitels –
                     # seine Schritte und die aller früheren Kapitel. Weglassen: alle Schritte.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # optional: zwei falsche Antworten zur Auswahl
    hint: Ein kurzer Tipp.    # optional
    moves: collect            # optional: Schritte nur für diese Aufgabe`,
  writeMathsAs: "Schreib die Mathematik so, wie du sie eintippen würdest:",
  or: "oder",
  twoEquations: ["Zwei Gleichungen auf einmal kommen in eine Zeile, mit", "dazwischen."],
  exampleSet: `title: Hausaufgaben Woche 3
# Schritte bis "Gleichungen lösen" (Nummer, ID oder Titel eines Kapitels). Weglassen: alle Schritte.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Zwei falsche Antworten zur Auswahl (optional: sonst werden sie automatisch erzeugt).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Zuerst kommt die 2 weg, dann die 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Dieser Link funktioniert nicht",
  brokenLinkText: "Vielleicht wurde er beim Kopieren abgeschnitten. Lass ihn dir noch einmal schicken oder geh zum Lernpfad.",
  learningPathButton: "Lernpfad",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} von ${total} gelöst · `,
    ` ${stars} auf Anhieb richtig vorhergesagt. Stell dir bei jeder Aufgabe zuerst im Kopf vor, was herauskommt, dann rechne sie von Hand aus.`,
  ],
  makeOwnSet: "Eigene Aufgabenreihe erstellen",
  ofCount: (n: number, count: number) => `${n} von ${count}`,
  backToSet: (title: string) => `Zurück zu ${title}`,

  // Checking a set
  set: {
    defaultTitle: "Meine Aufgaben",
    badYaml: (msg: string) => `Das ist kein gültiges YAML: ${msg}`,
    expectedTop: "Oben müssen `title:` und `exercises:` stehen.",
    noChapter: (name: string) =>
      `Es gibt kein Kapitel „${name}“ für \`moves:\` (gib Nummer, ID oder Titel eines Kapitels an).`,
    expectedList: "Unter `exercises:` muss eine Liste stehen.",
    emptyList: "Die Liste unter `exercises:` ist leer.",
    needsStart: "Es fehlt ein `start:`.",
    needsGoal: "Es fehlt ein `goal:`.",
    noChapterShort: (name: string) => `Es gibt kein Kapitel „${name}“ für \`moves:\`.`,
    cantReadStart: (err: string) => `Der Start lässt sich nicht lesen: ${err}`,
    cantReadGoal: (err: string) => `Das Ziel lässt sich nicht lesen: ${err}`,
    doesntFollow: "Das Ziel folgt nicht aus dem Start (vielleicht ein Tippfehler?).",
    twoWrong: "Unter `wrong:` sollten zwei falsche Antworten stehen.",
    cantReadWrong: (w: string, err: string) => `Die falsche Antwort „${w}“ lässt sich nicht lesen: ${err}`,
    wrongShape: (w: string, why: string) => `Die falsche Antwort „${w}“ sieht nicht aus wie das Ziel: ${why}.`,
    wrongIsRight: (w: string) => `Die falsche Antwort „${w}“ ist in Wirklichkeit richtig.`,
    noDecoys:
      "Es ließen sich keine überzeugenden falschen Antworten erzeugen: Füge `wrong:` hinzu, sonst wird die Aufgabe gelöst, ohne dass vorher im Kopf eine Antwort gewählt wird.",
    decoysMade: (list: string) => `Erzeugte falsche Antworten zur Auswahl: ${list}.`,
    shapeCount: "eine andere Anzahl von Gleichungen",
    shapeRelation: "ein Term, wo eine Gleichung erwartet wird, oder umgekehrt",
    shapeIsolated: (letter: string) => `es sagt nicht, was ${letter} ist`,
  },
};
