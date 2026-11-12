import type { Strings } from "../en";

/** "1 exercice", "2 exercices" (in French, 0 and 1 take the singular). */
const s = (n: number) => (n > 1 ? "s" : "");

const BADGE = ["", "de bronze", "d'argent", "d'or"] as const;

export const fr: Strings = {
  htmlLang: "fr",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Langue",

  // Top bar
  makeExercises: "Créer des exercices",
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
  leadsOnTo: (titles: string) => `Ensuite : ${titles}.`,
  badges: "Badges",
  noBadgesYet: "Résous des exercices dans un chapitre pour gagner son badge.",
  badgesEarned: (n: number, total: number) => `${n} sur ${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `Badge ${BADGE[tier]}`,
  badgeNotEarned: "badge pas encore gagné",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) => `${chapter} : ${tier ? `badge ${BADGE[tier]}` : "pas encore gagné"}`,

  // Chapter page
  backToPath: "← Parcours",
  exercises: "Exercices",
  practiceNote: "D'abord faciles, puis de plus en plus durs. Les derniers reprennent aussi ce que tu as vu dans les chapitres précédents.",
  leadsOnToStart: "Ensuite : ",
  leadsOnToEnd: ". Tu peux y aller quand tu veux.",
  watchOut: "Attention !",

  // Progress
  solvedOf: (done: number, total: number) => `${done} exercice${s(done)} résolu${s(done)} sur ${total}`,
  guessedRight: (n: number, total: number) => `${n} sur ${total} trouvé${s(n)} du premier coup`,
  exerciseTitle: (label: string, solved: boolean) => `Exercice ${label}${solved ? " — résolu" : ""}`,
  solved: "résolu",
  guessedRightFirstTime: "trouvé du premier coup",
  guessFirstShort: "Réfléchis d'abord",
  goldNote: "Badge d'or. Tous les exercices sont résolus.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `Badge ${BADGE[tier]}. ` : ""}Encore ${more} exercice${s(more)} pour ${["le bronze", "l'argent", "l'or"][tier]}.`,

  // Guided example
  exampleN: (n: number) => `Exemple ${n}`,
  notThisStep: "Ce mouvement est correct, mais ce n'est pas celui de cette étape. On le remet en place.",
  done: "Terminé.",
  keepGoing: "Tu peux continuer : maintenant, tous les mouvements sont permis.",
  stepOf: (n: number, total: number) => `Étape ${n} sur ${total}`,
  startOver: "Recommencer",

  // Exercise
  lessonLink: (chapter: string) => `${chapter} : le cours`,
  nextExercise: "Exercice suivant →",
  backToThePath: "Retour au parcours",
  exercisesNav: "Exercices",
  previousTitle: (label: string) => `Précédent : exercice ${label}`,
  previousLabel: (label: string) => `Exercice précédent (${label})`,
  nextTitle: (label: string) => `Suivant : exercice ${label}`,
  nextLabel: (label: string) => `Exercice suivant (${label})`,
  exerciseN: (label: string) => `Exercice ${label}`,
  guessPrompt: "Réfléchis d'abord : qu'est-ce que ça donne ?",
  reveal: "Voir",
  guessedBeforeRight: "Tu avais trouvé celui-ci du premier coup.",
  guessedBeforeWrong: (picked: boolean) =>
    `Ta première réponse ${picked ? "était la rouge" : "était fausse"}. La bonne, c'est la verte.`,
  rightFirstTime: "Trouvé du premier coup. Maintenant, résous-le.",
  notQuite: "Pas tout à fait. La bonne, c'est la verte. Résous l'exercice pour comprendre où ça coince.",
  solvedBefore: "✓ Tu as déjà résolu cet exercice. Tu peux le refaire.",
  makeItLookLike: "Transforme-la en",
  positiveLetters: "Ici, les lettres désignent des nombres positifs.",
  pickFirst: "Choisis une réponse ci-dessus, puis résous l'exercice ici.",
  hint: "Indice",
  undo: "Annuler",
  reset: "Remettre à zéro",
  solvedBang: "Résolu !",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `Badge ${BADGE[tier]} : ${chapter}.`,
  theExercise: "l'exercice",
  goal: "objectif",
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
