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
  makingExercise: "Aufgabe wird erstellt …",
  anotherOne: "Noch eine →",
  progressHere:
    "Dein Fortschritt wird nur in diesem Browser gespeichert. Sichere ihn in einer Datei, damit er nicht verloren geht oder damit du ihn auf ein anderes Gerät mitnehmen kannst.",
  saveProgress: "Fortschritt als Datei exportieren",
  loadProgress: "Fortschritt aus einer Datei laden",
  progressSaved: "Gespeichert. Lade diese Datei hier oder in einem anderen Browser, dann hast du deinen Fortschritt wieder.",
  copyright: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Open Source unter der MIT-Lizenz.`,
  aboutLink: "Info",
  support: {
    heading: "Unterstützen",
    text: "DragDropMath ist kostenlos und werbefrei, und das bleibt auch so. Wenn es dir oder deiner Klasse geholfen hat, kannst du es mit einer kleinen Spende unterstützen.",
    button: "Auf Ko-fi unterstützen",
  },
  about: {
    title: "Über DragDropMath",
    sections: [
      {
        heading: "Worum es geht",
        text: [
          "Mit DragDropMath machst du Algebra mit den Händen. Du ziehst an einem beliebigen Teil eines Terms oder einer Gleichung, und er bewegt sich nur so, wie es die Mathematik erlaubt. Ein falscher Schritt passiert einfach nicht. So lernst du, was erlaubt ist, indem du es spürst, und nicht, indem du Regeln auswendig lernst.",
          "Ein Lernpfad führt vom Ordnen von Termen bis zu quadratischen Gleichungen. Jedes Kapitel hat eine Lektion, Übungen in drei Schwierigkeitsstufen und „Im Kopf“: Dort stellst du dir das Ergebnis zuerst im Kopf vor, bevor du es ausrechnest. Lehrkräfte können eigene Aufgabenreihen schreiben und als Link teilen.",
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
  progressReplace: (saved: string) =>
    `Damit wird dein Fortschritt in diesem Browser durch den aus der Datei ersetzt${saved ? ` (gespeichert am ${saved})` : ""}. Laden?`,
  progressLoadIt: "Laden",
  cancel: "Abbrechen",
  progressNoRoom: "Dein Browser konnte ihn nicht speichern, deshalb wurde nichts geändert.",
  progressBlocked:
    "Dieser Browser speichert für diese Seite nichts (ein privates Fenster oder der Speicher ist ausgeschaltet), also gibt es keinen Fortschritt, den du sichern könntest.",
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
      how: "Zieh die Zahl rechts auf die andere Zahl, mit der sie multipliziert wird.",
      text: ["Auch beim Multiplizieren ist die Reihenfolge egal: `2·x·5` ist `2·5·x`. Also kannst du die 2 und die 5 multiplizieren und bekommst `10x`."],
    },
    collect: {
      name: "Gleichartige Terme zusammenfassen",
      how: "Zieh einen Term auf einen gleichartigen, also einen mit denselben Variablen mit denselben Exponenten. Die beiden werden addiert.",
      text: [
        "`3x` bedeutet `x + x + x`. Also ist `3x + 2x` drei x plus zwei x, zusammen `5x`.",
        "Addieren kannst du nur gleichartige Terme, also Terme mit genau denselben Variablen mit denselben Exponenten. Aus `3x + 2` wird nicht `5x`, x-Terme und y-Terme bleiben getrennt, und ebenso `x²` und `3x`.",
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
      how: "Tippe auf das ², um die Klammer zweimal hinzuschreiben. Dann multipliziere aus wie im letzten Beispiel (halte einen Faktor gedrückt, um ihn allein zu ziehen: Kurz antippen nimmt den ganzen Term) und fasse gleichartige Terme zusammen.",
      text: ["`(x + 1)²` ist `(x + 1)(x + 1)`, also multiplizierst du es genauso aus."],
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
    "letter-in": {
      name: "Variable mal Klammer",
      how: "Zieh die Variable vor der Klammer auf die Klammer. Dann halte eine der beiden nebeneinanderstehenden Variablen gedrückt und zieh sie auf die andere: `x·x` ist `x²`. (Kurz antippen würde den ganzen Term nehmen.)",
      text: ["Die Variable wird mit jedem Term in der Klammer multipliziert, genau wie eine Zahl: `x(x + 3) = x·x + x·3`. Und `x·x` ist eine Potenz, nämlich `x²`, wie im Kapitel Potenzen."],
    },
    "zero-product": {
      name: "Satz vom Nullprodukt",
      how: "Zieh eine Klammer nach unten aus dem Produkt heraus: Die Gleichung zerfällt in zwei, entweder ist diese Klammer 0 oder die andere. Dann löst du beide.",
      text: [
        "Ein Produkt ist nur dann 0, wenn einer seiner Faktoren 0 ist: `3·0 = 0`, aber `3·2` nicht. Also heißt `(x − 2)(x + 3) = 0`: `x − 2 = 0` oder `x + 3 = 0`. Das sind zwei Lösungen.",
        "Darum teilst du beide Seiten nie durch etwas, das 0 sein könnte: Hier würdest du dabei eine Lösung verlieren.",
      ],
    },
    "take-out-then-split": {
      name: "Variable ausklammern, dann aufteilen",
      how: "Halte die Variable in einem Term gedrückt und zieh sie nach vorn, links über das Ende hinaus. Dann zieh sie nach unten aus dem Produkt heraus.",
      text: ["Steht keine Zahl allein da, steckt in jedem Term ein x: Klammere es aus, `x² − 3x = x(x − 3)`. Jetzt ist es ein Produkt gleich 0, also `x = 0` oder `x − 3 = 0`."],
    },
    "split-middle": {
      name: "Faktorisieren, dann aufteilen",
      how: "Tippe auf den mittleren Term: Er wird in zwei Terme zerlegt. Klammere aus jedem Paar einen Faktor aus, dann die gemeinsame Klammer. Zum Schluss zieh eine Klammer nach unten aus dem Produkt heraus.",
      text: ["`x² + x − 6` ist ein Produkt aus zwei Klammern: `(x + 3)(x − 2)`. Die beiden Zahlen ergeben multipliziert `−6` und addiert `1`, die Zahl vor dem x. Sobald ein Produkt gleich 0 dasteht, liefert jede Klammer eine Lösung."],
    },
    "power-of-power": {
      name: "Potenzen potenzieren",
      how: "Zieh den äußeren Exponenten auf den inneren. Sie werden multipliziert: Tippe auf das ·, um es auszurechnen.",
      text: ["`(x²)³` ist `x²·x²·x²`. Das sind 2 + 2 + 2 = 6 x, also werden die Exponenten multipliziert."],
    },
    "factor-shared": {
      name: "Paarweise ausklammern",
      how: "Halte das `x` eines Terms gedrückt und zieh es auf einen anderen Term mit `x`: Es wird aus beiden ausgeklammert. Dann klammere aus, was die letzten beiden Terme gemeinsam haben (oft eine Zahl), und danach die Klammer, die beide Produkte gemeinsam haben.",
      text: ["Bei vier Termen arbeitest du paarweise. Klammere aus den ersten beiden Termen einen gemeinsamen Faktor aus, dann aus den letzten beiden. Sind die beiden Klammern gleich, klammerst du auch die Klammer aus."],
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
    "split-fraction": {
      name: "Bruch aufteilen",
      how: "Zieh einen Term aus dem Zähler heraus. Er nimmt eine Kopie des Nenners mit.",
      text: ["Eine Summe im Zähler kannst du in einen Bruch pro Term aufteilen, alle mit demselben Nenner: `(x + 5)/6 = x/6 + 5/6`."],
    },
    "join-powers": {
      name: "Wurzeln zusammenfassen",
      how: "Zieh eine Wurzel auf die andere. Sie kommen unter ein gemeinsames Wurzelzeichen.",
      text: [
        "`√2·√3` zum Quadrat ist `2·3`, also ist `√2·√3` die positive Zahl, deren Quadrat 6 ist: `√(2·3) = √6`. Zwei Wurzeln derselben Art lassen sich unter einer zusammenfassen.",
        "Dasselbe gilt für jeden gemeinsamen Exponenten: `x³y³` ist xxx·yyy, also xy·xy·xy, und das ist `(xy)³`.",
      ],
    },
    "root-notation": {
      name: "Wurzel als Potenz",
      how: "Tippe auf die Wurzel, um sie als Potenz zu schreiben: √ ist hoch ½, ∛ ist hoch ⅓.",
      text: ["Jede Wurzel ist eine Potenz: `√x = x^(1/2)`, `∛x = x^(1/3)`, und die n-te Wurzel aus x ist `x^(1/n)`. Darum gelten alle Potenzgesetze auch für Wurzeln: `√x·√x = x^(1/2 + 1/2) = x`."],
    },
    "fraction-power": {
      name: "Wurzeln und Potenzen zusammen",
      how: "Zieh die Wurzel auf die Potenz: Die Exponenten werden addiert. Dann schreib die ganze Zahl in Halben: Zieh den Nenner des ½ auf sie und tippe auf das ·, um es auszurechnen. Dann addiere die Brüche und tippe auf das + im Zähler.",
      text: ["`√x` ist `x^(1/2)`, also ist `√x·x² = x^(1/2 + 2) = x^(5/2)`. Ein Bruch im Exponenten funktioniert wie jeder andere Exponent: Multiplizierst du Potenzen, addierst du die Exponenten."],
    },
    "exp-of-log": {
      name: "Potenz hebt Logarithmus auf",
      how: "Zieh die Basis auf den Logarithmus in ihrem Exponenten. Die beiden heben sich auf.",
      text: ["`e` ist eine besondere Zahl, ungefähr 2,718. `ln(x)` ist der Exponent, mit dem man e potenzieren muss, um x zu bekommen. Deshalb heben sich ln und e^ gegenseitig auf: `e^(ln x) = x`. Logarithmen zu anderen Basen funktionieren genauso: `2^(log₂ x) = x`."],
    },
    "evaluate-log": {
      name: "Bekannte Logarithmen",
      how: "Tippe auf den Logarithmus, um ihn auszurechnen: `ln(e) = 1`, und der Logarithmus von 1 ist 0.",
      text: ["`ln(e) = 1`, denn `e¹ = e`. Und der Logarithmus von 1 ist 0, denn `e⁰ = 1`."],
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
    "bracket-times-bracket": {
      name: "Klammer mal Klammer",
      how: "Zieh eine Klammer auf die andere: Sie wird mit beiden Termen darin multipliziert. Dann multipliziere jeden neuen Term genauso aus: Halte einen seiner Faktoren gedrückt und zieh ihn auf den anderen (kurz antippen nimmt den ganzen Term). Danach halte ein x von `x·x` gedrückt, zieh es auf das andere und fasse gleichartige Terme zusammen.",
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
    "tap-operator": {
      name: "Auf das Rechenzeichen tippen",
      how: "Tippe auf das + zwischen den beiden Zahlen: Sie werden addiert, genau als würdest du eine auf die andere ziehen.",
      text: ["Tippst du auf das Rechenzeichen zwischen zwei Teilen, wird es ausgerechnet: Ein + addiert, ein − subtrahiert, ein · multipliziert. Das ist dasselbe, als würdest du einen Teil auf den anderen ziehen: Nimm, was schneller geht."],
    },
    "multiply-out": {
      name: "Zahlen in einem Produkt multiplizieren",
      how: "Tippe auf das ·: Alle Zahlen im Produkt werden multipliziert, und aus `4x·3` wird `12x`.",
      text: ["Beim Multiplizieren ist die Reihenfolge egal, also ist `4x·3` dasselbe wie `4·3·x`. Die Zahlen lassen sich multiplizieren, auch wenn eine Variable dazwischensteht."],
    },
    "times-zero": {
      name: "Mal null",
      how: "Tippe auf die 0: Das ganze Produkt wird 0. Dann tippe auf das +, um zu addieren.",
      text: ["Alles mal 0 ist 0. Also ist `0·(x + 4)` gleich 0, egal was x ist."],
    },
    "evaluate-power": {
      name: "Potenz ausrechnen",
      how: "Zieh den Exponenten auf die Zahl: Aus `2³` wird 8.",
      text: ["`2³` bedeutet `2·2·2`: Die kleine Zahl, der Exponent, zählt, wie oft die 2 multipliziert wird. Eine Potenz einer Zahl kannst du also ausrechnen: `2³ = 8`.", "Tippst du stattdessen auf den Exponenten, wird die Potenz ausgeschrieben: Aus `2³` wird `2·2·2`."],
    },
    "divide-powers": {
      name: "Gleiche Basis: Exponenten subtrahieren",
      how: "Zieh die Potenz im Nenner auf die Potenz mit derselben Basis im Zähler. Die Exponenten werden subtrahiert: Tippe auf das −, um es auszurechnen.",
      text: ["In `x⁵/x²` stehen fünf x im Zähler und zwei im Nenner. Je zwei kürzen sich weg, und oben bleiben drei übrig: Beim Dividieren werden die Exponenten subtrahiert."],
    },
    "flip-across-bar": {
      name: "Über den Bruchstrich",
      how: "Zieh die Potenz über den Bruchstrich, vom Nenner nach oben oder vom Zähler nach unten. Ihr Exponent ändert sein Vorzeichen.",
      text: ["Stehen im Nenner mehr x, wird der Exponent negativ: `x²/x⁵` ist `x^(2 − 5) = x⁻³`, und gleichzeitig ist es `1/x³`. Also bedeutet `x⁻³` dasselbe wie `1/x³`: Wandert eine Potenz über den Bruchstrich, ändert ihr Exponent sein Vorzeichen, egal in welche Richtung."],
    },
    "power-of-product": {
      name: "Exponent in die Klammer",
      how: "Zieh den Exponenten in die Klammer: Jeder Faktor darin bekommt eine eigene Kopie. Dann zieh den Exponenten der Zahl auf die Zahl, um sie auszurechnen.",
      text: ["`(2x)³` ist `2x·2x·2x`, also `2³·x³`. Jeder Faktor in der Klammer bekommt den Exponenten."],
    },
    "minus-bracket": {
      name: "Minus vor der Klammer in einer Summe",
      how: "Zieh das − vor der Klammer auf die Klammer: Jedes Vorzeichen darin dreht sich um. (Wo sich die ganze Summe bewegen lässt, nimmt kurzes Antippen des − die ganze Summe: Halte es gedrückt, um nur das Minus zu nehmen.)",
      text: ["`5 − (x + 2)` zieht das ganze `x + 2` ab, also das x und die 2. Deshalb dreht das Minus jedes Vorzeichen in der Klammer um: `5 − x − 2`."],
    },
    "split-number": {
      name: "Zahl zerlegen",
      how: "Tippe auf die Zahl vor der Variablen: Sie wird in zwei Faktoren zerlegt, zuerst den, den sie mit der anderen Zahl gemeinsam hat. Tippe auch auf die andere Zahl. Dann tippe auf das + zwischen den Termen: Der gemeinsame Faktor wird ausgeklammert.",
      text: ["Ein gemeinsamer Faktor ist nicht immer zu sehen. In `6x + 9` sind beide Terme durch 3 teilbar, aber in `6x` steht keine 3, die man ausklammern könnte.", "Tippe auf die 6: Sie wird in `3·2` zerlegt, zuerst die 3, die sie mit der 9 gemeinsam hat. Jetzt ist eine 3 da: `3·2x + 9 = 3(2x + 3)`."],
    },
    "split-term": {
      name: "Mittleren Term aufteilen",
      how: "Tippe auf die Variable im mittleren Term: Er wird in zwei Terme aufgeteilt. (Tippst du auf seine Zahl, wird stattdessen die Zahl zerlegt.) Dann klammere paarweise aus wie im letzten Beispiel: Tippe auf das + zwischen den ersten beiden Termen, dann auf das zwischen den letzten beiden und dann auf das zwischen den beiden Produkten.",
      text: ["Um `x² + 5x + 6` zu faktorisieren, suchst du zwei Zahlen, die addiert 5 und multipliziert 6 ergeben: 2 und 3. Schreib `5x` als `2x + 3x`.", "Jetzt hast du vier Terme, und die lassen sich paarweise ausklammern: `x(x + 2) + 3(x + 2)`, dann `(x + 2)(x + 3)`."],
    },
    "difference-of-squares": {
      name: "Dritte binomische Formel",
      how: "Beide Terme sind Quadrate, und das eine wird vom anderen abgezogen: Tippe auf das Minus dazwischen. (Haben die beiden Terme eine Zahl gemeinsam, wird die beim Tippen zuerst ausgeklammert, `4x² − 4 = 4(x² − 1)`: Dann tippe noch einmal auf das Minus.)",
      text: ["Ein Quadrat minus ein Quadrat lässt sich immer gleich faktorisieren: `a² − b² = (a − b)(a + b)`. Multiplizier es zur Probe aus: Die mittleren Terme heben sich auf.", "Das klappt nur bei einer Differenz, also Quadrat minus Quadrat. Eine Summe von zwei Quadraten wie `x² + 9` lässt sich gar nicht faktorisieren. Ein Quadrat minus eine Zahl, die keine Quadratzahl ist, wie `x² − 7`, schon, aber mit Wurzeln: `(x − √7)(x + √7)`."],
    },
    "cancel-factor": {
      name: "Gemeinsamen Faktor kürzen",
      how: "Zieh die Zahl im Nenner auf dieselbe Zahl im Zähler (oder umgekehrt): Sie kürzen sich weg.",
      text: ["Eine Zahl, die den ganzen Zähler und den ganzen Nenner multipliziert, kannst du kürzen: `(3x)/3` ist `x`, denn `3x` geteilt durch 3 ist x. In `(3x + 1)/3` geht das nicht: Die 3 multipliziert nur einen Teil des Zählers."],
    },
    "evaluate-fraction": {
      name: "Bruch ausrechnen",
      how: "Tippe auf die Zahl im Zähler: Sie wird zerlegt, mit der Zahl aus dem Nenner zuerst (aus 14 über 7 wird `7·2`). Dann zieh die 7 im Nenner auf diese 7: Sie kürzen sich weg.",
      text: ["Ein Bruch, bei dem eine ganze Zahl herauskommt, lässt sich ausrechnen: `12/3` ist 4, denn `12 = 3·4`, und die 3 im Zähler kürzt sich mit der 3 im Nenner."],
    },
    "divide-numbers": {
      name: "Bruch kürzen",
      how: "Tippe auf die Zahl im Zähler, dann auf die im Nenner: Beide werden zerlegt, der gemeinsame Faktor zuerst (aus 8 und 12 werden `4·2` und `4·3`). Dann zieh die eine 4 auf die andere: Sie kürzen sich weg.",
      text: ["Einen Bruch kürzt du, indem du Zähler und Nenner durch dieselbe Zahl teilst: `8/12 = 2/3`. Sein Wert ändert sich dabei nicht.", "Zerlegst du die Zahlen, siehst du, was sie gemeinsam haben: `8/12 = (4·2)/(4·3)`, und die 4en kürzen sich weg."],
    },
    "factor-then-cancel": {
      name: "Erst ausklammern, dann kürzen",
      how: "Halte die Zahl in einem Term im Zähler gedrückt und zieh sie nach vorn, links über das Ende hinaus (oder tippe auf das + zwischen den Termen). Dann zieh sie auf dieselbe Zahl im Nenner: Sie kürzen sich weg.",
      text: ["Kürzen kannst du nur einen Faktor des ganzen Zählers. In `(2x + 6)/2` ist die 2 ein Faktor jedes einzelnen Terms, also klammere sie zuerst aus: `(2(x + 3))/2`. Jetzt ist sie ein Faktor des ganzen Zählers und kürzt sich mit dem Nenner."],
    },
    "divide-by-fraction": {
      name: "Durch einen Bruch teilen",
      how: "Zieh den Nenner des unteren Bruchs nach oben in den Zähler. Dort multipliziert er den Zähler. Tippe auf das ·, um es auszurechnen, und kürze dann, was Zähler und Nenner gemeinsam haben.",
      text: ["Was eine Zahl bewirkt, hängt davon ab, wie viele Bruchstriche über ihr stehen. In `4/(3/5)` steht die 5 unter zwei Bruchstrichen: Sie teilt durch eine Division, also multipliziert sie. Deshalb kann sie nach oben in den Zähler wandern und bedeutet dort dasselbe: `(4·5)/3`.", "Darum teilst du durch einen Bruch, indem du mit seinem Kehrwert multiplizierst: `4/(3/5) = 4·5/3`."],
    },
    "evaluate-root": {
      name: "Wurzel ausrechnen",
      how: "Tippe auf die Wurzel, um sie als Potenz zu schreiben: `√9` ist `9^(1/2)`. Dann zieh das ½ auf die 9, um es auszurechnen.",
      text: ["`√9` ist die positive Zahl, die mit sich selbst multipliziert 9 ergibt: 3, denn `3·3 = 9` (−3 auch, aber √ meint die positive). Genauso ist `∛8 = 2`, denn `2·2·2 = 8`.", "Als Potenz ist `√9 = 9^(1/2)`: Ziehst du das ½ auf die 9, wird es ausgerechnet, wie bei jedem Exponenten."],
    },
    "pull-out-of-power": {
      name: "Wurzel aufteilen",
      how: "Zieh die Zahl aus der Wurzel heraus: Sie bekommt ihre eigene Wurzel. Dann rechne diese Wurzel aus: Tippe auf sie und zieh das ½ auf die Zahl.",
      text: ["Die Wurzel aus einem Produkt ist das Produkt der Wurzeln: `√(4x) = √4·√x = 2√x`."],
    },
    "split-square": {
      name: "Wurzel vereinfachen",
      how: "Tippe auf die Zahl unter der Wurzel: Eine Quadratzahl wird abgespalten (bei einer dritten Wurzel eine Kubikzahl). Dann zieh sie aus der Wurzel heraus wie im letzten Beispiel und rechne ihre Wurzel aus.",
      text: ["Auch eine Wurzel, die nicht aufgeht, lässt sich oft vereinfachen. Zerleg die Zahl darunter so, dass eine Quadratzahl abgespalten wird: `√12 = √(4·3) = 2√3`."],
    },
    "root-of-power": {
      name: "Wurzel aus einer Potenz",
      how: "Tippe auf die Wurzel, um sie als Potenz zu schreiben. Zieh ihren äußeren Exponenten auf den inneren und tippe auf das ·, um das Produkt auszurechnen. Dann kürze, was Zähler und Nenner des Exponenten gemeinsam haben.",
      text: ["Eine Wurzel ist eine Potenz, also ist die Wurzel aus einer Potenz eine Potenz einer Potenz: `∛(x⁶) = (x⁶)^(1/3) = x^(6/3) = x²`. Die Exponenten werden multipliziert, wie im Kapitel Potenzen."],
    },
    "rationalise": {
      name: "Nenner rational machen",
      how: "Zieh die Wurzel im Nenner nach oben auf den Zähler: Zähler und Nenner werden beide mit ihr multipliziert. Dann tippe auf das · im Nenner und kürze, was sich noch kürzen lässt.",
      text: ["Multiplizierst du Zähler und Nenner mit derselben Zahl, ändert sich der Bruch nicht. Nimm die Wurzel, die schon im Nenner steht: `√3·√3 = 3`, also ist `1/√3 = √3/(√3·√3) = √3/3`. Jetzt steht unter dem Bruchstrich keine Wurzel mehr."],
    },
    "log-across": {
      name: "Logarithmus über das =",
      how: "Zieh den Logarithmus über das =. Auf der anderen Seite wird daraus eine Potenz. Ist das eine Potenz einer Zahl, zieh ihren Exponenten auf die Zahl, um sie auszurechnen.",
      text: ["Ein Logarithmus wird durch eine Potenz aufgehoben. Aus `ln(x) = 2` wandert das ln hinüber und wird zu e: `x = e²`."],
    },
    "move-term": {
      name: "Term hinüberbringen",
      how: "Zieh die Zahl über das =. Unterwegs ändert sich ihr Vorzeichen. Lässt du sie auf der Zahl dort fallen, werden beide gleich zusammengerechnet; lässt du sie daneben los, tippe auf das −, um es auszurechnen.",
      text: ["Eine Gleichung sagt, dass zwei Seiten gleich sind. Machst du auf beiden Seiten dasselbe, bleiben sie gleich.", "Genau das passiert, wenn ein Term über das `=` wandert. Aus `x + 3 = 10` wird, wenn du auf beiden Seiten 3 abziehst, `x = 10 − 3`. Deshalb wird auf der anderen Seite aus `+3` ein `−3`."],
    },
    "move-factor": {
      name: "Beide Seiten dividieren",
      how: "Zieh die Zahl vor der Variablen über das =. Jetzt teilt sie die andere Seite. Dann rechne den Bruch aus: Tippe auf die Zahl im Zähler, um sie zu zerlegen, und zieh den Nenner auf den passenden Faktor.",
      text: ["Eine Zahl, die eine ganze Seite multipliziert, teilt die andere Seite, wenn sie hinüberwandert. Aus `2x = 8` wird, wenn du beide Seiten durch 2 teilst, `x = 8/2`, und `8/2 = (2·4)/2 = 4`."],
    },
    "two-steps": {
      name: "Zwei Schritte",
      how: "Bring die Zahl, die addiert wird, hinüber und lass sie auf der Zahl dort fallen. Dann bring die Zahl vor der Variablen hinüber und rechne den Bruch aus: Zerleg den Zähler und kürze.",
      text: ["In `3x + 4 = 19` wurde x erst mit 3 multipliziert, dann wurde 4 addiert. Um x zurückzubekommen, machst du beides in umgekehrter Reihenfolge rückgängig: zuerst die 4 abziehen, dann durch 3 teilen.", "Die 3 kann nicht zuerst hinüber: Sie multipliziert nur das x, nicht die ganze Seite."],
    },
    "root-across": {
      name: "Wurzel über das =",
      how: "Tippe auf die Wurzel, um sie als Potenz zu schreiben (½, bei ∛ ⅓), dann zieh diesen Exponenten über das =: Die andere Seite wird quadriert (bei ∛ hoch 3 genommen). Dann zieh den Exponenten auf die Zahl, um sie auszurechnen.",
      text: ["Um `√x = 3` zu lösen, quadrierst du beide Seiten: `x = 3²`. Quadrieren hebt eine Wurzel auf, also verschwindet das √, und die andere Seite wird quadriert. Hoch 3 hebt eine dritte Wurzel auf, und so weiter.", "Als Potenz geschrieben, `x^(1/2) = 3`, wandert das ½ hinüber und wird zum Quadrat: derselbe Schritt."],
    },
    "ineq-move-factor": {
      name: "Beide Seiten dividieren",
      how: "Zieh die Zahl vor der Variablen über das Ungleichheitszeichen. Jetzt teilt sie die andere Seite, und das Zeichen bleibt, wie es ist. Dann rechne den Bruch aus: Zerleg den Zähler und kürze.",
      text: ["Multiplizierst oder dividierst du beide Seiten mit einer positiven Zahl, bleibt das Zeichen ebenfalls, wie es ist: Aus `2x < 8` wird `x < 8/2`."],
    },
    "ineq-negative": {
      name: "Durch eine negative Zahl teilen",
      how: "Zieh die Zahl hinüber und rechne den Bruch aus: Das Zeichen bleibt, wie es ist. Dann zieh das Minus hinüber: Das Zeichen dreht sich um.",
      text: ["Teilst du beide Seiten durch eine negative Zahl, dreht sich das Zeichen um, genau wie beim Multiplizieren mit −1: `−2x < 6` heißt `x > −3`.", "Hier sind es zwei Schritte, die du schon kennst: durch 2 teilen (das Zeichen bleibt), dann das Minus hinüberbringen (das Zeichen dreht sich um)."],
    },
    "plus-minus": {
      name: "Zwei Lösungen beim Quadrat",
      how: "Zieh die 2 über das =. Ein Quadrat hat zwei Wurzeln: Die Gleichung zerfällt in zwei, eine mit + und eine mit −. Dann zieh jedes ½ auf die Zahl, um sie auszurechnen.",
      text: ["`3² = 9`, aber auch `(−3)² = 9`. Also heißt `x² = 9`: `x = 3` oder `x = −3`. Vergisst du das Minus, verlierst du eine Lösung."],
    },
    "fraction-zero": {
      name: "Ein Bruch gleich 0",
      how: "Fass den Nenner des Bruchs an seinem + oder − an und zieh ihn über das =. Jetzt multipliziert er die andere Seite: Tippe auf die 0, denn 0 mal irgendwas ist 0. Dann bring die Zahl hinüber.",
      text: ["Ein Bruch ist nur dann 0, wenn sein Zähler 0 ist. Sein Nenner darf nie 0 sein, und das sagt die Bedingung hinter der Gleichung: `x ≠ −2` sorgt dafür, dass `x + 2` nicht 0 wird.", "Also darf der Nenner hinüberwandern und die andere Seite multiplizieren: Aus `(x − 3)/(x + 2) = 0` wird `x − 3 = 0·(x + 2)`, also `x − 3 = 0`. Verletzt eine Lösung die Bedingung, wird sie durchgestrichen."],
    },
    "letter-factor": {
      name: "Durch eine Variable teilen",
      how: "Zieh die Variable vor dem x über das =. Jetzt teilt sie die andere Seite. Dann zieh sie auf dieselbe Variable im Zähler: Sie kürzen sich weg.",
      text: ["Durch eine Variable darfst du beide Seiten nur teilen, wenn sie nicht 0 sein kann, und das sagt die Bedingung hinter der Gleichung: `a ≠ 0`.", "Teile nie durch x selbst: Teilst du in `x² = 3x` durch x, bekommst du `x = 3` und verlierst die Lösung `x = 0`. Bring stattdessen alles auf eine Seite und faktorisiere."],
    },
    "alone-first": {
      name: "Der ganze Weg",
      how: "Noch steht keine Variable allein: Bring das x der ersten Gleichung hinüber, dann hast du `y = …`. Setze dann y in die andere Gleichung ein, löse sie nach x auf und setze x wieder ein, um y zu bestimmen.",
      text: ["Hier ist das ganze Verfahren, von Anfang bis Ende:", "1. Stell in einer Gleichung eine Variable frei. Nimm die einfachste: eine Variable ohne Zahl davor. In `x + y = 7` bringst du das x hinüber: `y = 7 − x`.", "2. Einsetzen: Ersetze diese Variable in der anderen Gleichung durch das, wofür sie steht, und zwar in Klammern. Steht ein Minus davor, dreht sich jedes Vorzeichen in der Klammer um.", "3. Löse die Gleichung, die übrig bleibt: Sie hat nur noch eine Variable.", "4. Setze den Wert in `y = …` ein, um die andere Variable zu bestimmen."],
    },
    "fraction-of-fractions": {
      name: "Ein Bruch aus zwei Brüchen",
      how: "Zieh den Nenner des unteren Bruchs nach oben in den Zähler, dann den Nenner des oberen Bruchs nach unten in den Nenner. Tippe anschließend auf jedes ·, um es auszurechnen.",
      text: ["In `(a/b)/(c/d)` kann jede der vier Zahlen über den Hauptbruchstrich an die Stelle wandern, über der gleich viele Bruchstriche stehen, und bedeutet dort dasselbe (wie die 5 im letzten Beispiel): d wandert nach oben zu a, b nach unten zu c, c nach oben zu b und a nach unten zu d. (Außer wenn a 0 sein könnte: Durch 0 kann man nicht teilen.)", "Wandern die beiden Nenner, wird daraus ein einziger Bruch: `(a·d)/(c·b)`."],
    },
    "minus-number-in": {
      name: "Eine negative Zahl vor der Klammer",
      how: "Zieh die Zahl auf die Klammer und tippe auf das ·, um es auszurechnen. Dann zieh das Minus auf die Klammer: Jedes Vorzeichen darin dreht sich um.",
      text: ["`−3(x − 2)` bedeutet −1 mal 3 mal die Klammer. Multipliziere zuerst mit 3: `−(3x − 6)`. Dann dreht das Minus jedes Vorzeichen in der Klammer um: `−3x + 6`.", "Achte auf das letzte Vorzeichen: `−3` mal `−2` ist `+6`. Minus mal Minus ergibt Plus."],
    },
    "substitute-back": {
      name: "Wieder einsetzen",
      how: "Zieh das `x` aus `x = …` auf das `x` in der anderen Gleichung. Dann tippe auf das · und das +, um y auszurechnen.",
      text: ["Kennst du x, liefert dir die andere Gleichung y: Setze dort den Wert für x ein und rechne aus. Jetzt hast du beide, und das Paar ist die Lösung.", "Zur Probe setzt du beide Werte in die Gleichung ein, die du zuletzt nicht benutzt hast: Auf beiden Seiten muss dasselbe herauskommen."],
    },
    "square-both-sides": {
      name: "Beide Seiten quadrieren",
      how: "Tippe auf die Wurzel, um sie als Potenz mit dem Exponenten ½ zu schreiben, und zieh das ½ über das =: Die andere Seite wird quadriert. Multipliziere aus, bring alles auf eine Seite, faktorisiere und teile wie im letzten Beispiel in zwei Gleichungen auf. Die Lösung, die eine Bedingung verletzt, wird durchgestrichen.",
      text: ["Eine Wurzel ist nie negativ, also gilt `√(x + 7) = x + 1` nur, wenn `x + 1 ≥ 0` ist, also `x ≥ −1`. (Und was unter der Wurzel steht, darf auch nicht negativ sein: `x ≥ −7`.) Das sind die Bedingungen, die schon am Anfang dastehen: Sie gelten die ganze Rechnung über.", "Beim Quadrieren gehen sie verloren: `x + 7 = (x + 1)²` gilt auch für `x = −3`, wo `x + 1` negativ ist. Die quadrierte Gleichung liefert also `x = 2` oder `x = −3`, und −3 verletzt eine Bedingung: Sie wird durchgestrichen. Die einzige Lösung ist `x = 2`."],
    },
    "substitute": {
      name: "Einsetzen",
      how: "Zieh das `y` aus `y = …` auf das `y` in der anderen Gleichung: Es wird durch das ersetzt, wofür `y` steht. Jetzt kommt in dieser Gleichung nur noch x vor: Fasse die x zusammen und löse sie.",
      text: ["`y = 2x` und `x + y = 9` sind zwei Gleichungen mit denselben x und y, und beide gelten gleichzeitig. Eine Gleichung mit zwei Unbekannten hat viele Lösungen, zwei zusammen meistens nur eine.", "`y = 2x` sagt, dass y und 2x gleich sind. Also kannst du in der anderen Gleichung y durch 2x ersetzen. Übrig bleibt eine Gleichung mit nur einer Variablen, und die kannst du lösen."],
    },
    "zero-power": {
      name: "Hoch 0",
      how: "Tippe auf den Exponenten 0: Aus `x⁰` wird 1. Dann tippe auf das +, um zu addieren.",
      text: ["`x³/x³` ist 1 (wenn x nicht 0 ist), und gleichzeitig ist es `x^(3 − 3) = x⁰`. Also ist jede Zahl außer 0 hoch 0 gleich 1."],
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
  nextStep: "Nächster Schritt",
  noNextStep: "Von hier aus findet sich kein Schritt: Probier „Rückgängig“ oder „Von vorn“.",
  undo: "Rückgängig",
  solvedBang: "Gelöst!",
  where: "wobei",
  moveCrashed: "Bei diesem Schritt ist etwas schiefgegangen.",
  moveCrashedDetails: "Versuch es noch einmal oder fang diese Aufgabe von vorn an.",
  pageCrashed: "Auf dieser Seite ist etwas schiefgegangen.",
  pageCrashedDetails: "Versuch es noch einmal oder geh zurück zum Lernpfad. Dein Fortschritt ist sicher.",
  tryAgain: "Nochmal versuchen",

  // Making a set
  ownTitle: "Eigene Aufgaben",
  ownIntro:
    "Stell eine Aufgabenreihe zusammen, zum Beispiel für deine Klasse, und teile sie als Link. Bei jeder Aufgabe stellen sich die Schülerinnen und Schüler das Ergebnis zuerst im Kopf vor und rechnen es dann von Hand aus. Online wird nichts gespeichert: Die ganze Reihe steckt im Link.",
  upload: "Eine .yaml-Datei hochladen",
  startFromExample: "Mit dem Beispiel anfangen",
  yamlLabel: "Die Aufgabenreihe als YAML",
  form: {
    asForm: "Formular",
    asYaml: "YAML",
    viewLabel: "Aufgabenreihe schreiben als",
    title: "Titel",
    moves: "Erlaubte Schritte",
    allMoves: "Alle Schritte",
    upTo: (n: number, title: string) => `Bis ${n}. ${title}`,
    start: (n: number) => `Aufgabe ${n}: Start`,
    goal: (n: number) => `Aufgabe ${n}: Ziel`,
    remove: (n: number) => `Aufgabe ${n} entfernen`,
    addOne: "Aufgabe hinzufügen",
    fromChapter: "Aufgaben aus den Übungen eines Kapitels hinzufügen",
    chapter: "Kapitel",
    level: "Stufe",
    howMany: "Wie viele",
    addMade: (n: number) => `${n} hinzufügen`,
    making: "Werden erstellt …",
    cantRead:
      "Im YAML dieser Reihe steckt ein Fehler, deshalb kann das Formular sie nicht anzeigen. Korrigiere ihn in der YAML-Ansicht oder fang mit dem Beispiel an.",
  },
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
    noValue: "Der Start hat für keine Zahl einen Wert (eine Division durch 0?).",
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
