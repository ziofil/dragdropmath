import type { Translation } from "../en";

/** "1 exercice", "2 exercices" (in French, 0 and 1 take the singular). */
const s = (n: number) => (n > 1 ? "s" : "");

const BADGE = ["", "de bronze", "d'argent", "d'or"] as const;

export const fr: Translation = {
  htmlLang: "fr",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Langue",

  // Top bar
  makeExercises: "Créer des exercices",
  sandbox: "Bac à sable",
  openSandbox: "Ouvrir le bac à sable →",
  sandboxIntro: "Écris n'importe quelle expression ou équation et essaie tous les mouvements.",
  sandboxInput: "Expression ou équation",
  sandboxPlaceholder: "ex. 3(x - 2) = 2x + 1   ou   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Charger",
  debugOn: "Mode débogage activé (Maj+D)",

  // Home
  heroBefore: "L'algèbre à ",
  heroWord: "toucher",
  heroAfter: " du doigt.",
  heroText:
    "Fais glisser n'importe quelle partie d'une équation. Elle ne bouge que comme les maths le permettent. Transforme-la jusqu'à obtenir le résultat demandé.",
  learningPath: "Parcours",
  nextUp: "à suivre",
  mastered: "maîtrisé",
  everyChapterOpen: "Tous les chapitres sont ouverts. Les flèches indiquent un ordre conseillé.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) =>
    `Chapitre ${n} : ${title}, ${done} exercice${s(done)} résolu${s(done)} sur ${total}`,
  chapterN: (n: number) => `Chapitre ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Prérequis : ${titles}.`,
  notMasteredYet: (titles: string) => ` Tu ne maîtrises pas encore : ${titles}. Tu peux commencer quand même.`,
  startLesson: "Commencer le cours →",
  backToLesson: "Retour au cours →",
  badges: "Badges",
  noBadgesYet: "Fais le test d'un chapitre pour gagner son badge.",
  badgesEarned: (n: number, total: number) => `${n} sur ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `Badge ${BADGE[tier]}`,
  badgeNotEarned: "badge pas encore gagné",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) => `${chapter} : ${tier ? `badge ${BADGE[tier]}` : "pas encore gagné"}`,

  // Chapter page
  backToPath: "← Parcours",
  leadsOnToStart: "Ensuite : ",
  leadsOnToEnd: ". Tu peux y aller quand tu veux.",
  level: { easy: "Facile", medium: "Moyen", hard: "Difficile" },
  anotherOne: "Un autre →",
  practice: "Entraîne-toi",
  predict: "Teste-toi",
  predictNote: "Trouve la réponse de tête, puis choisis-la. Les bonnes réponses font gagner le badge du chapitre : 10 au niveau Facile pour le bronze, au niveau Moyen pour l'argent, au niveau Difficile pour l'or.",
  solvedN: (n: number) => `${n} résolu${s(n)}`,
  predictRight: "Bonne réponse ! Elle compte pour le badge.",
  drills: {
    commute: { name: "Changer l'ordre", how: "Fais glisser un terme au-delà de son voisin. Avec + et ×, l'ordre ne compte pas." },
    combine: { name: "Additionner des nombres", how: "Dépose un nombre sur l'autre pour les additionner." },
    "multiply-numbers": { name: "Multiplier des nombres", how: "Dépose un nombre sur l'autre nombre qu'il multiplie." },
    "numbers-first": { name: "Le nombre devant", how: "Appuie sur un produit comme `x·3` pour l'écrire comme d'habitude : `3x`." },
    "multiply-out": { name: "Calculer un produit", how: "Appuie sur un produit de nombres, comme `2·3`, pour le calculer." },
    collect: { name: "Réduire les termes semblables", how: "Dépose un terme sur un terme semblable, c'est-à-dire avec la même lettre. Ils s'additionnent." },
    "collect-cancel": { name: "Annuler des opposés", how: "Dépose un terme sur son opposé. Ils s'annulent." },
    distribute: { name: "Développer", how: "Dépose le nombre devant sur la parenthèse. Il multiplie chaque terme à l'intérieur." },
    "distribute-neg": { name: "Un moins devant la parenthèse", how: "Dépose le signe moins sur la parenthèse. Tous les signes à l'intérieur changent." },
    "factor-out": { name: "Mettre en facteur", how: "Les deux termes ont un facteur commun. Fais-en glisser un devant, au-delà du bord gauche." },
    "x-times-x": { name: "x fois x", how: "Dépose un x sur l'autre. `x·x` s'écrit `x²`." },
    "merge-powers": { name: "Même base : additionner les exposants", how: "Dépose une puissance sur l'autre de même base. Les exposants s'additionnent." },
    "power-to-product": { name: "Un carré comme produit", how: "Appuie sur le ² pour écrire la parenthèse deux fois." },
    "move-term": { name: "Faire passer un terme", how: "Fais passer le nombre de l'autre côté du =. Au passage, son signe change." },
    "move-factor": { name: "Diviser les deux membres", how: "Fais passer de l'autre côté du = le nombre devant la lettre. Il divise l'autre membre." },
    "move-denominator": { name: "Multiplier les deux membres", how: "Fais passer le dénominateur de l'autre côté du =. Il multiplie l'autre membre." },
    "move-sign": { name: "Faire passer un moins", how: "Fais passer seulement le signe moins de l'autre côté du =. L'autre membre change de signe." },
    "swap-sides": { name: "Échanger les membres", how: "Fais glisser un membre de l'autre côté du =, jusqu'au bout. Les deux membres échangent leurs places." },
    "evaluate-fraction": { name: "Calculer une fraction", how: "Appuie sur la barre de fraction pour la calculer." },
    "divide-numbers": { name: "Simplifier une fraction", how: "Dépose le dénominateur sur le numérateur. Les deux sont divisés par leur facteur commun." },
    "cancel-factor": { name: "Simplifier par un facteur commun", how: "Dépose le nombre du dénominateur sur le même nombre au numérateur. Les deux disparaissent." },
    "power-of-power": { name: "Puissance d'une puissance", how: "Dépose l'exposant extérieur sur l'exposant intérieur. Ils se multiplient." },
    "divide-powers": { name: "Même base : soustraire les exposants", how: "Dépose la puissance du dénominateur sur celle du numérateur. Les exposants se soustraient." },
    "flip-across-bar": { name: "De l'autre côté de la barre", how: "Fais monter la puissance de l'autre côté de la barre de fraction. Son exposant change de signe." },
    "power-one": { name: "Exposant 1", how: "Dépose l'exposant 1 sur sa base : `x¹`, c'est simplement `x`." },
    "zero-power": { name: "Exposant 0", how: "Dépose l'exposant 0 sur sa base. N'importe quoi à la puissance 0 vaut 1." },
    "tap-power": { name: "Calculer une puissance", how: "Appuie sur l'exposant pour calculer la puissance : `2³` devient 8." },
    "power-of-product": { name: "Exposant dans la parenthèse", how: "Fais glisser l'exposant dans la parenthèse. Chaque facteur à l'intérieur reçoit le sien." },
    "split-number": { name: "Décomposer un nombre", how: "Appuie sur le nombre pour le décomposer en deux facteurs." },
    "factor-shared": { name: "Mettre un facteur en commun", how: "Dépose le `x` d'un terme sur un autre terme qui a un `x`. Il devient un facteur commun aux deux." },
    "move-letter-factor": { name: "Diviser par une lettre", how: "Fais passer de l'autre côté du = une des lettres multipliées. Elle divise l'autre membre." },
    "move-letter-denominator": { name: "Multiplier par une lettre", how: "Fais passer la lettre du dénominateur de l'autre côté du =. Elle multiplie l'autre membre." },
    "ineq-move-term": { name: "Faire passer un terme", how: "Fais passer le nombre de l'autre côté du signe d'inégalité. Son signe change, mais le sens de l'inégalité reste le même." },
    "ineq-swap": { name: "Échanger les membres", how: "Fais glisser un membre au-delà de l'autre. Le signe d'inégalité se retourne avec eux." },
    "ineq-sign": { name: "Faire passer un moins", how: "Fais passer seulement le signe moins de l'autre côté. Le signe d'inégalité se retourne." },
    "add-fractions": { name: "Additionner des fractions", how: "Les dénominateurs sont les mêmes : dépose une fraction sur l'autre. Les numérateurs s'additionnent." },
    "expand-fraction": { name: "Mettre au même dénominateur", how: "Fais glisser le dénominateur d'une fraction sur l'autre fraction. Son numérateur et son dénominateur sont multipliés par ce nombre." },
    "multiply-fractions": { name: "Multiplier des fractions", how: "Dépose une fraction sur l'autre. On multiplie les numérateurs entre eux, et les dénominateurs entre eux." },
    "divide-by-fraction": { name: "Diviser par une fraction", how: "Fais monter la fraction du dénominateur de l'autre côté de la barre. Elle se retourne et multiplie." },
    "split-fraction": { name: "Séparer une fraction", how: "Sors un terme du numérateur. Il emporte une copie du dénominateur." },
    "times-one": { name: "Fois 1", how: "Dépose le 1 sur ce qu'il multiplie. Multiplier par 1 ne change rien." },
    substitute: { name: "Substituer", how: "Fais glisser le `y` de `y = …` sur le `y` de l'autre équation. Il est remplacé par ce que vaut `y`." },
    "evaluate-root": { name: "Calculer une racine", how: "Appuie sur la racine pour la calculer." },
    "split-square": { name: "Décomposer sous la racine", how: "Appuie sur le nombre sous la racine. Il se décompose en faisant apparaître un carré." },
    "pull-out-of-power": { name: "Séparer une racine", how: "Sors le nombre de la racine. Il a droit à sa propre √." },
    "root-notation": { name: "Une racine comme puissance", how: "Appuie sur la racine pour l'écrire comme une puissance ½." },
    "root-across": { name: "Une puissance ½ de l'autre côté du =", how: "Fais passer le ½ de l'autre côté du =. Là-bas, il devient un carré." },
    "exp-of-log": { name: "Une puissance annule un logarithme", how: "Dépose la base sur le logarithme de son exposant. Ils s'annulent." },
    "evaluate-log": { name: "Logarithmes à connaître", how: "Appuie sur le logarithme pour le calculer : `ln(e) = 1`, et le logarithme de 1 vaut 0." },
    "power-of-base": { name: "Comme puissance de la base", how: "Appuie sur le nombre dans le logarithme pour l'écrire comme une puissance de la base du logarithme." },
    "log-of-product": { name: "Séparer un logarithme", how: "Sors le nombre du logarithme. Il a droit à son propre logarithme." },
    "log-of-power": { name: "Exposant hors du logarithme", how: "Fais glisser l'exposant devant le logarithme." },
    "power-into-log": { name: "Nombre dans le logarithme", how: "Dépose le nombre devant sur le logarithme. Il devient un exposant à l'intérieur." },
    "combine-logs": { name: "Regrouper des logarithmes", how: "Dépose un logarithme sur l'autre. Additionner des logarithmes multiplie à l'intérieur, les soustraire divise." },
    "exp-across": { name: "La base de l'autre côté du =", how: "Fais passer la base de l'autre côté du =. Là-bas, elle devient un logarithme." },
    "log-across": { name: "Le logarithme de l'autre côté du =", how: "Fais passer le logarithme de l'autre côté du =. Là-bas, il devient une puissance." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Exercice ${label}${solved ? " — résolu" : ""}`,
  goldNote: "Badge d'or. Tu peux continuer autant que tu veux.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `Badge ${BADGE[tier]}. ` : ""}Encore ${more} bonne${s(more)} réponse${s(more)} au niveau ${["Facile", "Moyen", "Difficile"][tier]} pour ${["le bronze", "l'argent", "l'or"][tier]}.`,

  // Guided example
  done: "Terminé.",
  startOver: "Recommencer",

  // Exercise
  lessonLink: (chapter: string) => `${chapter} : le cours`,
  nextExercise: "Exercice suivant →",
  exercisesNav: "Exercices",
  previousTitle: (label: string) => `Précédent : exercice ${label}`,
  previousLabel: (label: string) => `Exercice précédent (${label})`,
  nextTitle: (label: string) => `Suivant : exercice ${label}`,
  nextLabel: (label: string) => `Exercice suivant (${label})`,
  exerciseN: (label: string) => `Exercice ${label}`,
  predictPrompt: "Réfléchis d'abord : qu'est-ce que ça donne ?",
  reveal: "Voir",
  predictedBeforeRight: "Tu avais trouvé celui-ci du premier coup.",
  predictedBeforeWrong: (picked: boolean) =>
    `Ta première réponse ${picked ? "était la rouge" : "était fausse"}. La bonne, c'est la verte.`,
  rightFirstTime: "Trouvé du premier coup. Maintenant, résous-le.",
  notQuite: "Pas tout à fait. La bonne, c'est la verte. Résous l'exercice pour comprendre où ça coince.",
  solvedBefore: "✓ Tu as déjà résolu cet exercice. Tu peux le refaire.",
  makeItLookLike: "Transforme-la en",
  pickFirst: "Choisis une réponse ci-dessus, puis résous l'exercice ici.",
  hint: "Indice",
  undo: "Annuler",
  solvedBang: "Résolu !",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `Badge ${BADGE[tier]} : ${chapter}.`,
  moveCrashed: "Ce mouvement a provoqué une erreur.",
  moveCrashedDetails: "Les détails sont dans la console du navigateur.",
  tryAgain: "Réessayer",

  // Making a set
  ownTitle: "Tes propres exercices",
  ownIntro:
    "Écris une série d'exercices, par exemple pour tes élèves, et partage-la sous forme de lien. Pour chaque exercice, on prévoit d'abord la réponse, puis on le résout à la main. Rien n'est stocké en ligne : toute la série tient dans le lien.",
  upload: "Importer un fichier .yaml",
  startFromExample: "Partir de l'exemple",
  yamlLabel: "La série d'exercices, en YAML",
  check: "Vérifier",
  checking: "On vérifie qu'il se résout avec ces mouvements…",
  unsolvable:
    "Impossible de le résoudre en 10 étapes avec ces mouvements. Il faut peut-être ceux d'un chapitre plus avancé (`moves:`).",
  solvableIn: (n: number) => `Se résout en ${n} mouvement${s(n)}.`,
  linkLabel: "Lien vers la série",
  copied: "Copié",
  copy: "Copier",
  open: "Ouvrir",
  makeLink: "Créer le lien",
  fixMarked: "Corrige les exercices marqués ✗, puis vérifie à nouveau.",
  howToWrite: "Comment écrire une série",
  formatExample: `title: Le nom de la série
moves: balance       # facultatif : le numéro, l'id ou le titre d'un chapitre —
                     # ses mouvements et ceux des chapitres d'avant. Sans cette ligne : tous.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # facultatif : deux réponses fausses à proposer
    hint: Un petit indice.    # facultatif
    moves: collect            # facultatif : les mouvements pour cet exercice seulement`,
  writeMathsAs: "Écris les maths comme tu les taperais :",
  or: "ou",
  twoEquations: ["Pour deux équations à la fois, écris-les sur une seule ligne avec", "entre les deux."],
  exampleSet: `title: Devoirs semaine 3
# Mouvements jusqu'à « Résoudre une équation » (numéro, id ou titre d'un chapitre). Sans cette ligne : tous les mouvements.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Deux réponses fausses à proposer (facultatif, sinon elles sont créées pour toi).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Fais d'abord passer le 2 de l'autre côté, puis le 3.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Ce lien ne fonctionne pas",
  brokenLinkText: "Il a peut-être été coupé au moment du copier-coller. Redemande-le, ou va au parcours.",
  learningPathButton: "Parcours",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done} sur ${total} résolu${s(done)} · `,
    ` ${stars} trouvé${s(stars)} du premier coup. Pour chaque exercice, prévois d'abord la réponse, puis résous-le à la main.`,
  ],
  makeOwnSet: "Créer ta propre série",
  ofCount: (n: number, count: number) => `${n} sur ${count}`,
  backToSet: (title: string) => `Retour à « ${title} »`,

  // Checking a set (shown to whoever writes one)
  set: {
    defaultTitle: "Mes exercices",
    badYaml: (msg: string) => `Ce n'est pas du YAML valide : ${msg}`,
    expectedTop: "Il faut `title:` et `exercises:` au début.",
    noChapter: (name: string) =>
      `Aucun chapitre ne s'appelle « ${name} » pour \`moves:\` (indique le numéro, l'id ou le titre d'un chapitre).`,
    expectedList: "Il faut une liste sous `exercises:`.",
    emptyList: "La liste sous `exercises:` est vide.",
    needsStart: "Il manque `start:`.",
    needsGoal: "Il manque `goal:`.",
    noChapterShort: (name: string) => `Aucun chapitre ne s'appelle « ${name} » pour \`moves:\`.`,
    cantReadStart: (err: string) => `Impossible de lire le départ : ${err}`,
    cantReadGoal: (err: string) => `Impossible de lire l'objectif : ${err}`,
    doesntFollow: "On ne peut pas passer du départ à l'objectif (vérifie qu'il n'y a pas de faute de frappe).",
    twoWrong: "`wrong:` doit contenir deux réponses fausses.",
    cantReadWrong: (w: string, err: string) => `Impossible de lire la réponse fausse « ${w} » : ${err}`,
    wrongShape: (w: string, why: string) => `La réponse fausse « ${w} » n'a pas la même forme que l'objectif : ${why}.`,
    wrongIsRight: (w: string) => `La réponse fausse « ${w} » est en fait juste.`,
    noDecoys:
      "Impossible de créer des réponses fausses crédibles : ajoute `wrong:`, sinon l'exercice se résout directement.",
    decoysMade: (list: string) => `Réponses fausses créées pour le choix : ${list}.`,
    shapeCount: "le nombre d'équations n'est pas le même",
    shapeRelation: "une expression là où on attend une équation, ou l'inverse",
    shapeIsolated: (letter: string) => `elle ne donne pas la valeur de ${letter}`,
  },
};
