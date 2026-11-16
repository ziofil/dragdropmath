import type { Translation } from "../en";

/** "1 exercice", "2 exercices" (in French, 0 and 1 take the singular). */
const s = (n: number) => (n > 1 ? "s" : "");

export const fr: Translation = {
  htmlLang: "fr",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
  language: "Langue",

  // Top bar
  makeExercises: "Créer des exercices",
  skin: "Thème",
  skins: { modern: "Moderne", codex: "Codex", paper: "Papier", blackboard: "Tableau noir" },
  settings: "Paramètres",
  numbersInColour: "Nombres en couleur",
  debugMode: "Mode débogage",
  sandboxInput: "Expression ou équation",
  sandboxPlaceholder: "ex. 3(x - 2) = 2x + 1   ou   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Charger",
  debugOn: "Le mode débogage est activé : appuie ici pour le désactiver",

  // Home
  heroBefore: "L'algèbre à ",
  heroWord: "toucher",
  heroAfter: " du doigt.",
  heroText:
    "Fais glisser n'importe quelle partie d'une équation. Elle ne bouge que comme les maths le permettent. Transforme-la jusqu'à obtenir le résultat demandé.",
  learningPath: "Parcours",
  chapterNodeLabel: (n: number, title: string) => `Chapitre ${n} : ${title}`,
  chapterN: (n: number) => `Chapitre ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Prérequis : ${titles}.`,
  startLesson: "Commencer le cours →",

  // Chapter page
  backToPath: "← Parcours",
  level: { easy: "Facile", medium: "Moyen", hard: "Difficile" },
  anotherOne: "Un autre →",
  progressHere:
    "Ta progression est enregistrée uniquement dans ce navigateur. Exporte-la dans un fichier pour la mettre à l'abri, ou pour la retrouver sur un autre appareil.",
  saveProgress: "Exporter la progression dans un fichier",
  loadProgress: "Charger la progression depuis un fichier",
  progressSaved: "C'est enregistré. Charge ce fichier ici, ou dans n'importe quel navigateur, pour retrouver ta progression.",
  rightsReserved: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Tous droits réservés.`,
  aboutLink: "À propos",
  about: {
    title: "À propos de DragDropMath",
    sections: [
      {
        heading: "Qu'est-ce que c'est ?",
        text: [
          "DragDropMath, c'est de l'algèbre qu'on fait avec les mains. Tu fais glisser n'importe quelle partie d'une expression ou d'une équation, et elle ne peut bouger que comme les maths le permettent. Un mouvement interdit ne se produit tout simplement pas : tu comprends ce qui est permis en le sentant, pas en apprenant des règles par cœur.",
          "Un parcours te mène de l'ordre des termes jusqu'aux systèmes d'équations. Chaque chapitre propose un cours, de l'entraînement sur trois niveaux et des exercices « De tête », où tu te représentes la réponse dans ta tête avant de faire le calcul. Les enseignants peuvent écrire leurs propres séries d'exercices et les partager sous forme de lien.",
        ],
      },
      {
        heading: "Qui l'a créé ?",
        text: [
          "DragDropMath a été créé par Filippo Miatto, pour faire de l'algèbre quelque chose qu'on peut voir et toucher, plutôt qu'une liste de règles à retenir.",
        ],
      },
      {
        heading: "Ta vie privée",
        text: [
          "Pas de compte, pas de publicité, aucun pistage. Ta progression est enregistrée uniquement dans ton navigateur, et rien de ce que tu fais n'est envoyé nulle part. Dans les Paramètres, tu peux l'enregistrer dans un fichier, pour la mettre à l'abri ou la transférer sur un autre appareil.",
          "Une série d'exercices tient tout entière dans son lien : rien n'en est stocké en ligne.",
        ],
      },
    ],
  },
  progressNotABackup: "Ce fichier n'est pas un fichier de progression DragDropMath.",
  showMove: "Montrer",
  lesson: "Cours",
  practice: "Entraîne-toi",
  predict: "De tête",
  scores: "Scores « De tête »",
  scoreOf: (n: number) => `score ${n}`,
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) =>
    `Score au niveau ${level} : ${now}${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  drills: {
    commute: {
      name: "Changer l'ordre",
      how: "Fais glisser un terme au-delà de son voisin. Avec + et ×, l'ordre ne compte pas.",
      text: [
        "L'ordre dans lequel on additionne ne change pas le résultat : `2 + x` et `x + 2`, c'est la même chose.",
        "Chaque morceau d'une somme s'appelle un terme. Un terme garde son signe quand il se déplace : dans `5 − 3 + x`, le moins appartient au 3.",
      ],
    },
    combine: {
      name: "Additionner des nombres",
      how: "Dépose un nombre sur l'autre pour les additionner.",
      text: ["Deux nombres d'une même somme peuvent s'additionner. Une lettre représente un nombre qu'on ne connaît pas encore : elle reste telle quelle."],
    },
    "multiply-numbers": {
      name: "Multiplier des nombres",
      how: "Dépose un nombre sur l'autre nombre qu'il multiplie.",
      text: ["Pour la multiplication non plus, l'ordre ne compte pas : `2·x·5`, c'est `2·5·x`. On peut donc multiplier le 2 et le 5, ce qui donne `10x`."],
    },
    "numbers-first": {
      name: "Le nombre devant",
      how: "Appuie sur un produit comme `x·3` pour l'écrire comme d'habitude : `3x`.",
      text: ["On écrit le nombre en premier, sans le point : `x·3` s'écrit `3x`. C'est si simple qu'à partir de maintenant, ça se fait tout seul."],
    },
    "multiply-out": {
      name: "Calculer un produit",
      how: "Appuie sur un produit de nombres, comme `2·3`, pour le calculer.",
      text: ["Un produit de nombres se calcule directement : `2·3` fait 6."],
    },
    collect: {
      name: "Réduire les termes semblables",
      how: "Dépose un terme sur un terme semblable, c'est-à-dire avec la même lettre. Ils s'additionnent.",
      text: [
        "`3x` veut dire `x + x + x`. Donc `3x + 2x`, c'est trois x plus deux x : `5x`.",
        "On n'additionne que des termes semblables, c'est-à-dire avec exactement les mêmes lettres. `3x + 2` ne peut pas devenir `5x`, et les termes en x restent séparés des termes en y.",
      ],
    },
    "collect-cancel": {
      name: "Annuler des opposés",
      how: "Dépose un terme sur son opposé. Ils s'annulent.",
      text: ["La soustraction marche de la même façon : `5y − 2y`, c'est `3y`. Une quantité moins elle-même, ça fait 0, donc `a + b − a`, c'est simplement `b`."],
    },
    distribute: {
      name: "Développer",
      how: "Dépose le nombre devant sur la parenthèse : il multiplie chaque terme à l'intérieur. Ensuite, appuie sur le · pour calculer.",
      text: [
        "`2(x + 3)`, c'est 2 fois `(x + 3)` : 2 fois x plus 2 fois 3, soit `2x + 2·3`. Le nombre devant la parenthèse multiplie chaque terme à l'intérieur.",
        "Imagine un rectangle de hauteur 2 et de largeur `x + 3`. Ses deux parties ont pour aires `2·x` et `2·3`, et ensemble elles forment le rectangle entier.",
      ],
    },
    "distribute-neg": {
      name: "Un moins devant la parenthèse",
      how: "Dépose le signe moins sur la parenthèse. Tous les signes à l'intérieur changent.",
      text: ["`−(x − 4)`, c'est −1 fois la parenthèse. Le −1 multiplie chaque terme, donc tous les signes à l'intérieur changent."],
    },
    "factor-out": {
      name: "Mettre en facteur",
      how: "Les deux termes ont un facteur commun. Appuie longuement dessus dans l'un des termes, puis fais-le glisser devant, au-delà du bord gauche.",
      text: [
        "Factoriser une somme, c'est l'écrire comme un produit. Dans `3x + 3y`, les deux termes sont de la forme « quelque chose fois 3 ». On peut donc écrire le 3 une seule fois, devant une parenthèse qui contient ce qui reste de chaque terme : `3x + 3y = 3(x + y)`.",
        "C'est juste, car en développant `3(x + y)` on retrouve `3x + 3y` : le 3 multiplie chaque terme de la parenthèse. C'est d'ailleurs comme ça qu'on vérifie une factorisation.",
      ],
    },
    "split-exponent": {
      name: "Séparer un exposant",
      how: "Sors un terme de l'exposant. La puissance se sépare en deux puissances de même base.",
      text: ["`2^(x + 3)`, c'est x + 3 facteurs 2 multipliés entre eux : x facteurs, puis 3 de plus. C'est donc `2^x·2^3` : une somme dans un exposant devient un produit de puissances."],
    },
    "merge-powers": {
      name: "Même base : additionner les exposants",
      how: "Dépose une puissance sur l'autre, ou appuie sur le · entre elles. Les exposants s'additionnent : appuie sur le + pour les calculer.",
      text: [
        "`x³` veut dire `x·x·x`. Le petit nombre, l'exposant, compte les x.",
        "Donc `x²·x³`, c'est deux x fois trois x : cinq x en tout. Quand on multiplie des puissances de même base, on additionne les exposants.",
      ],
    },
    "power-to-product": {
      name: "Un carré comme produit",
      how: "Appuie sur le ² pour écrire la parenthèse deux fois. Ensuite, développe et réduis.",
      text: ["`(x + 1)²`, c'est `(x + 1)(x + 1)` : on le développe donc de la même façon."],
    },
    "move-term": {
      name: "Faire passer un terme",
      how: "Fais passer le nombre de l'autre côté du =. Au passage, son signe change. Ensuite, appuie sur le − pour calculer.",
      text: [
        "Une équation dit que deux membres sont égaux. Si on fait la même chose aux deux membres, ils restent égaux.",
        "Faire passer un terme de l'autre côté du `=`, c'est exactement ça. Dans `x + 3 = 10`, on enlève 3 aux deux membres : `x = 10 − 3`. Voilà pourquoi `+3` devient `−3` de l'autre côté.",
      ],
    },
    "move-factor": {
      name: "Diviser les deux membres",
      how: "Fais passer de l'autre côté du = le nombre devant la lettre. Il divise l'autre membre. Ensuite, appuie sur la barre de fraction pour calculer.",
      text: ["Un nombre qui multiplie tout un membre divise l'autre membre quand il passe de l'autre côté. Dans `2x = 8`, on divise les deux membres par 2 : `x = 8/2`."],
    },
    "move-denominator": {
      name: "Multiplier les deux membres",
      how: "Fais passer le dénominateur de l'autre côté du =. Il multiplie l'autre membre. Ensuite, appuie sur le · pour calculer.",
      text: ["Le dénominateur d'une fraction multiplie l'autre membre quand il passe de l'autre côté. Dans `x/3 = 4`, on multiplie les deux membres par 3 : `x = 4·3`."],
    },
    "move-sign": {
      name: "Faire passer un moins",
      how: "Fais passer seulement le signe moins de l'autre côté du =. L'autre membre change de signe.",
      text: ["Un moins devant tout un membre peut lui aussi passer de l'autre côté : on multiplie les deux membres par −1, donc `−x = 6` devient `x = −6`."],
    },
    "swap-sides": {
      name: "Échanger les membres",
      how: "Fais glisser un membre de l'autre côté du =, jusqu'au bout. Les deux membres échangent leurs places.",
      text: ["`7 = x` et `x = 7` disent la même chose : les deux membres peuvent donc échanger leurs places."],
    },
    "evaluate-fraction": {
      name: "Calculer une fraction",
      how: "Appuie sur la barre de fraction pour la calculer.",
      text: ["Une fraction qui tombe juste se calcule : `12/3` fait 4."],
    },
    "divide-numbers": {
      name: "Simplifier une fraction",
      how: "Appuie sur la barre de fraction. Le numérateur et le dénominateur sont divisés par leur facteur commun.",
      text: ["On simplifie une fraction en divisant son numérateur et son dénominateur par un même nombre : `6/8 = 3/4`. Sa valeur ne change pas."],
    },
    "letter-in": {
      name: "Une lettre fois une parenthèse",
      how: "Dépose la lettre devant sur la parenthèse. Ensuite, dépose un x sur l'autre : `x·x`, c'est `x²`.",
      text: ["La lettre multiplie chaque terme à l'intérieur, exactement comme un nombre : `x(x + 3) = x·x + x·3`. Et `x·x` est une puissance, `x²`, comme dans le chapitre Puissances."],
    },
    "factor-then-cancel": {
      name: "Factoriser, puis simplifier",
      how: "Appuie longuement sur le nombre d'un terme du numérateur, puis fais-le glisser devant, au-delà du bord gauche. Ensuite, appuie sur la barre de fraction : ça se simplifie.",
      text: ["On ne peut simplifier que par un facteur de tout le numérateur. Dans `(2x + 6)/2`, le 2 est un facteur de chaque terme : mets-le d'abord en facteur, `(2(x + 3))/2`. Maintenant, c'est un facteur de tout le numérateur, et il se simplifie avec le dénominateur."],
    },
    "cancel-factor": {
      name: "Simplifier par un facteur commun",
      how: "Appuie sur la barre de fraction. Ce que le numérateur et le dénominateur ont en commun se simplifie.",
      text: ["Un même nombre au numérateur et au dénominateur se simplifie : `(3x)/3`, c'est `x`."],
    },
    "power-of-power": {
      name: "Puissance d'une puissance",
      how: "Dépose l'exposant extérieur sur l'exposant intérieur. Ils se multiplient : appuie sur le · pour calculer.",
      text: ["`(x²)³`, c'est `x²·x²·x²`. Ça fait 2 + 2 + 2 = 6 x, donc les exposants se multiplient."],
    },
    "divide-powers": {
      name: "Même base : soustraire les exposants",
      how: "Appuie sur la barre de fraction. Les puissances d'une même base se regroupent et leurs exposants se soustraient : appuie sur le − pour calculer.",
      text: ["`x⁵/x²` a cinq x au numérateur et deux au dénominateur. On en simplifie deux de chaque côté, et il en reste trois au numérateur : diviser, c'est soustraire les exposants."],
    },
    "flip-across-bar": {
      name: "De l'autre côté de la barre",
      how: "Fais monter la puissance de l'autre côté de la barre de fraction. Son exposant change de signe.",
      text: ["Quand il y a plus de x au dénominateur, l'exposant devient négatif : `x⁻²` veut dire `1/x²`. Quand une puissance traverse la barre de fraction, son exposant change de signe."],
    },
    "power-one": {
      name: "Exposant 1",
      how: "Dépose l'exposant 1 sur sa base.",
      text: ["`x¹`, c'est un seul x : simplement `x`. C'est si simple qu'à partir de maintenant, ça se fait tout seul."],
    },
    "zero-power": {
      name: "Exposant 0",
      how: "Appuie longuement sur l'exposant 0, puis dépose-le sur sa base. Ensuite, appuie sur le + pour additionner.",
      text: ["`x³/x³` vaut 1, et c'est aussi `x^(3 − 3) = x⁰`. Donc tout nombre à la puissance 0 vaut 1."],
    },
    "tap-power": {
      name: "Calculer une puissance",
      how: "Appuie sur l'exposant pour calculer la puissance : `2³` devient 8.",
      text: ["Une puissance d'un nombre se calcule : `2³`, c'est `2·2·2 = 8`."],
    },
    "power-of-product": {
      name: "Exposant dans la parenthèse",
      how: "Fais glisser l'exposant dans la parenthèse : chaque facteur à l'intérieur reçoit le sien. Ensuite, appuie sur l'exposant du nombre pour le calculer.",
      text: ["`(2x)³`, c'est `2x·2x·2x`, c'est-à-dire `2³·x³`. Chaque facteur à l'intérieur reçoit l'exposant."],
    },
    "split-number": {
      name: "Décomposer un nombre",
      how: "Appuie sur le nombre pour le décomposer en deux facteurs. Ensuite, fais glisser devant le facteur commun aux deux termes, au-delà du bord gauche.",
      text: ["Pour trouver un facteur commun, décompose les nombres en facteurs. Dans `2x + 6`, le 6, c'est `2·3` : maintenant, les deux termes ont un 2."],
    },
    "split-term": {
      name: "Décomposer le terme du milieu",
      how: "Appuie sur le terme du milieu. Il se sépare en deux, prêt à être factorisé deux par deux.",
      text: [
        "Pour factoriser `x² + 5x + 6`, cherche deux nombres dont la somme fait 5 et le produit 6 : 2 et 3. Écris `5x` sous la forme `2x + 3x`.",
        "Il y a maintenant quatre termes, qu'on factorise deux par deux : `x(x + 2) + 3(x + 2)`, puis `(x + 2)(x + 3)`.",
      ],
    },
    "difference-of-squares": {
      name: "Différence de deux carrés",
      how: "Appuie sur le moins entre les deux carrés.",
      text: ["Un carré moins un carré se factorise toujours de la même façon (c'est une identité remarquable) : `a² − b² = (a − b)(a + b)`. Développe pour vérifier : les termes du milieu s'annulent."],
    },
    "factor-shared": {
      name: "Mettre un facteur en commun",
      how: "Appuie longuement sur le `x` d'un terme, puis dépose-le sur un autre terme qui a un `x` : il devient leur facteur commun. Fais de même avec les deux derniers termes, puis mets en facteur la parenthèse qu'ils ont en commun.",
      text: ["Avec quatre termes, on procède deux par deux. Factorise les deux premiers termes par un facteur commun, puis les deux derniers. Si les deux parenthèses sont identiques, mets aussi la parenthèse en facteur."],
    },
    "move-letter-factor": {
      name: "Diviser par une lettre",
      how: "Fais passer de l'autre côté du = une des lettres multipliées. Elle divise l'autre membre.",
      text: [
        "Une formule est une équation avec plusieurs lettres. Isoler l'une d'elles, c'est l'exprimer en fonction des autres. On s'y prend comme pour trouver x : les autres lettres se traitent comme des nombres.",
        "Une lettre qui multiplie tout un membre peut passer de l'autre côté et diviser l'autre membre : `F = ma` donne `F/m = a`. (À condition que cette lettre ne soit pas nulle, ce qui n'arrive jamais dans ces formules.)",
        "Quand la lettre cherchée apparaît à deux endroits, comme dans `ax + bx = c`, mets-la d'abord en facteur : `x(a + b) = c`. Ensuite, toute la parenthèse peut passer de l'autre côté.",
      ],
    },
    "move-letter-denominator": {
      name: "Multiplier par une lettre",
      how: "Fais passer la lettre du dénominateur de l'autre côté du =. Elle multiplie l'autre membre.",
      text: ["Une lettre au dénominateur de tout un membre peut passer de l'autre côté et multiplier l'autre membre : `P = F/A` donne `PA = F`."],
    },
    "ineq-move-term": {
      name: "Faire passer un terme",
      how: "Fais passer le nombre de l'autre côté du signe d'inégalité. Son signe change, mais le sens de l'inégalité reste le même. Ensuite, appuie sur le − pour calculer.",
      text: [
        "`x < 7` veut dire que x est inférieur à 7. Le côté ouvert du signe est tourné vers le plus grand nombre.",
        "Ajouter ou retrancher la même chose aux deux membres ne change pas le sens de l'inégalité. Un terme passe donc de l'autre côté comme dans une équation.",
      ],
    },
    "ineq-swap": {
      name: "Échanger les membres",
      how: "Fais glisser un membre au-delà de l'autre. Le signe d'inégalité se retourne avec eux.",
      text: ["`3 > x` et `x < 3` disent la même chose : x est inférieur à 3. Les membres peuvent donc échanger leurs places, à condition que le signe se retourne avec eux."],
    },
    "ineq-sign": {
      name: "Faire passer un moins",
      how: "Fais passer seulement le signe moins de l'autre côté. Le signe d'inégalité se retourne.",
      text: ["Multiplier par −1 inverse l'ordre : `2 < 3`, mais `−2 > −3`. Donc quand un moins passe de l'autre côté, le signe se retourne."],
    },
    "add-fractions": {
      name: "Additionner des fractions",
      how: "Les dénominateurs sont les mêmes : dépose une fraction sur l'autre, ou appuie sur le + entre elles. Ensuite, appuie sur le + du numérateur pour additionner les numérateurs.",
      text: ["`3/4`, c'est 3 quarts. Quand les dénominateurs sont les mêmes, il suffit d'additionner les numérateurs : 1 cinquième plus 2 cinquièmes, ça fait 3 cinquièmes, donc `1/5 + 2/5 = 3/5`."],
    },
    "expand-fraction": {
      name: "Mettre au même dénominateur",
      how: "Appuie longuement sur le dénominateur d'une fraction, puis dépose-le sur l'autre fraction, et fais ensuite l'inverse : les deux ont maintenant le même dénominateur. Appuie sur chaque · pour calculer les numérateurs et les dénominateurs, puis additionne les fractions.",
      text: [
        "Multiplier le numérateur et le dénominateur par un même nombre ne change pas une fraction : `1/2 = 2/4 = 3/6`.",
        "C'est comme ça qu'on met des fractions au même dénominateur. Pour calculer `1/2 + 1/3`, multiplie le numérateur et le dénominateur de `1/2` par 3, et ceux de `1/3` par 2 : ce sont maintenant des sixièmes.",
      ],
    },
    "multiply-fractions": {
      name: "Multiplier des fractions",
      how: "Appuie sur le · entre les fractions, ou dépose l'une sur l'autre : on multiplie les numérateurs entre eux, et les dénominateurs entre eux.",
      text: ["Multiplier, c'est plus simple : on multiplie les numérateurs, et on multiplie les dénominateurs. La moitié d'un tiers, c'est `(1·1)/(2·3) = 1/6`."],
    },
    rationalise: {
      name: "Un entier au dénominateur",
      how: "Fais monter la racine du dénominateur jusqu'au numérateur : le numérateur et le dénominateur sont tous les deux multipliés par elle. Ensuite, appuie sur le · du dénominateur.",
      text: ["Multiplier le numérateur et le dénominateur par un même nombre ne change pas une fraction. Prends la racine qui est déjà au dénominateur : `√3·√3 = 3`, donc `1/√3 = √3/(√3·√3) = √3/3`. Il n'y a plus de racine sous la barre."],
    },
    "zero-product": {
      name: "Un produit nul",
      how: "Fais descendre une parenthèse hors du produit : l'équation se sépare en deux, cette parenthèse vaut 0 ou l'autre vaut 0. Ensuite, résous chacune des deux.",
      text: [
        "Un produit est nul seulement si l'un de ses facteurs est nul : `3·0 = 0`, mais `3·2` ne l'est pas. Donc `(x − 2)(x + 3) = 0` veut dire `x − 2 = 0` ou `x + 3 = 0` : deux solutions.",
        "C'est pour ça qu'on ne divise jamais les deux membres par quelque chose qui peut valoir 0 : ici, on perdrait une solution.",
      ],
    },
    "plus-minus": {
      name: "Les deux racines d'un carré",
      how: "Fais passer le 2 de l'autre côté du =. Un carré a deux racines : l'équation se sépare en deux, une avec + et une avec −.",
      text: ["`3² = 9`, et `(−3)² = 9` aussi. Donc `x² = 9` veut dire `x = 3` ou `x = −3`. Si tu oublies le moins, tu perds une solution."],
    },
    "take-out-then-split": {
      name: "Factoriser par x, puis séparer",
      how: "Appuie longuement sur le x d'un terme, puis fais-le glisser devant, au-delà du bord gauche. Ensuite, fais-le descendre hors du produit.",
      text: ["Quand il n'y a pas de nombre tout seul, chaque terme contient un x : mets-le en facteur, `x² − 3x = x(x − 3)`. C'est maintenant un produit nul, donc `x = 0` ou `x − 3 = 0`."],
    },
    "split-middle": {
      name: "Factoriser, puis séparer",
      how: "Appuie sur le terme du milieu : il se coupe en deux. Mets un facteur en évidence dans chaque paire, puis la parenthèse qu'elles ont en commun. Ensuite, fais descendre une parenthèse hors du produit.",
      text: ["`x² + x − 6` est le produit de deux parenthèses : `(x + 3)(x − 2)`. Les deux nombres ont pour produit `−6` et pour somme `1`, le coefficient de x. Une fois qu'on a un produit nul, chaque parenthèse donne une solution."],
    },
    "square-both-sides": {
      name: "Élever les deux membres au carré",
      how: "Fais passer la racine de l'autre côté du = : l'autre membre est élevé au carré. Ensuite, développe et résous. En dessous, il y a les conditions : une solution qui n'en respecte pas une est barrée.",
      text: ["Une racine n'est jamais négative, donc `√(x² + 5) = x + 1` n'est vraie que si `x + 1 ≥ 0`. En élevant les deux membres au carré, on perd cette information : `x² + 5 = (x + 1)²` serait vraie aussi si `x + 1` était négatif. C'est pour ça que les conditions sont données dès le départ, et restent vraies jusqu'au bout."],
    },
    "divide-by-fraction": {
      name: "Diviser par une fraction",
      how: "Fais monter le dénominateur de la petite fraction jusqu'au numérateur : il le multiplie. Ensuite, appuie sur le · et sur la barre pour calculer.",
      text: [
        "Ce que fait un nombre dépend du nombre de barres au-dessus de lui. Dans `4/(3/5)`, le 5 est sous deux barres : on divise par une division, donc il multiplie. Il peut donc monter au numérateur sans rien changer : `(4·5)/3`.",
        "Voilà pourquoi diviser par une fraction, c'est multiplier par son inverse : `4/(3/5) = 4·5/3`.",
      ],
    },
    "split-fraction": {
      name: "Séparer une fraction",
      how: "Sors un terme du numérateur. Il emporte une copie du dénominateur.",
      text: ["Une somme au numérateur peut se séparer en une fraction par terme, toutes avec le même dénominateur : `(x + 5)/6 = x/6 + 5/6`."],
    },
    "times-one": {
      name: "Fois 1",
      how: "Appuie longuement sur le 1, puis dépose-le sur ce qu'il multiplie.",
      text: ["Multiplier par 1 ne change rien : `1·x`, c'est simplement `x`. C'est si simple qu'à partir de maintenant, ça se fait tout seul."],
    },
    substitute: {
      name: "Substituer",
      how: "Fais glisser le `y` de `y = …` sur le `y` de l'autre équation : il est remplacé par ce que vaut `y`. Ensuite, trouve x, puis remplace x dans la première équation pour trouver y.",
      text: [
        "`y = 2x` et `x + y = 9` sont deux équations sur les mêmes x et y, vraies en même temps. Une équation à deux inconnues a une infinité de solutions ; deux équations ensemble n'en ont en général qu'une.",
        "`y = 2x` dit que y et 2x sont égaux : on peut donc remplacer y par 2x dans l'autre équation. Il reste une équation à une seule inconnue, que tu sais résoudre.",
        "Si aucune équation n'a de lettre déjà isolée, commence par en isoler une : dans `x − y = 1`, fais passer le −y de l'autre côté pour obtenir `x = 1 + y`.",
      ],
    },
    "evaluate-root": {
      name: "Calculer une racine",
      how: "Appuie sur la racine pour la calculer.",
      text: ["`√9`, c'est le nombre qui, multiplié par lui-même, donne 9 : c'est 3, car `3·3 = 9`. De même, `∛8 = 2`, car `2·2·2 = 8`."],
    },
    "split-square": {
      name: "Décomposer sous la racine",
      how: "Appuie sur le nombre sous la racine : un carré s'en détache (un cube, sous une racine cubique). Ensuite, sors-le de la racine, et appuie sur sa racine pour la calculer.",
      text: ["Une racine qui ne tombe pas juste peut quand même se simplifier. Décompose le nombre sous la racine pour faire apparaître un carré : `√12 = √(4·3)`."],
    },
    "join-powers": {
      name: "Regrouper des racines",
      how: "Dépose une racine sur l'autre. Elles se retrouvent sous un seul radical.",
      text: [
        "Le carré de `√2·√3`, c'est `2·3` : `√2·√3` est donc le nombre dont le carré vaut 6, `√(2·3) = √6`. Deux racines de même type se regroupent sous une seule.",
        "C'est pareil pour n'importe quel exposant commun : `x³y³`, c'est xxx·yyy, c'est-à-dire xy·xy·xy, donc `(xy)³`.",
      ],
    },
    "pull-out-of-power": {
      name: "Séparer une racine",
      how: "Sors le nombre de la racine : il a droit à sa propre racine. Ensuite, appuie sur cette racine pour la calculer.",
      text: ["La racine d'un produit est le produit des racines : `√(4x) = √4·√x = 2√x`."],
    },
    "root-notation": {
      name: "Une racine comme puissance",
      how: "Appuie sur la racine pour l'écrire comme une puissance : √ est une puissance ½, ∛ une puissance ⅓.",
      text: ["Toute racine est une puissance : `√x = x^(1/2)`, `∛x = x^(1/3)`, et la racine n-ième de x, c'est `x^(1/n)`. Toutes les règles sur les puissances marchent donc aussi pour les racines : `√x·√x = x^(1/2 + 1/2) = x`."],
    },
    "root-of-power": {
      name: "Racine d'une puissance",
      how: "Appuie sur la racine pour l'écrire comme une puissance. Ensuite, dépose l'exposant extérieur sur l'exposant intérieur, et calcule le produit.",
      text: ["Une racine est une puissance, donc la racine d'une puissance est une puissance de puissance : `∛(x⁶) = (x⁶)^(1/3) = x^(6·1/3) = x²`. Les exposants se multiplient, comme dans le chapitre Puissances."],
    },
    "fraction-power": {
      name: "Racines et puissances ensemble",
      how: "Dépose la racine sur la puissance : les exposants s'additionnent. Ensuite, additionne les fractions dans l'exposant.",
      text: ["`√x`, c'est `x^(1/2)`, donc `√x·x² = x^(1/2 + 2) = x^(5/2)`. Un exposant fractionnaire se comporte comme n'importe quel autre : pour multiplier des puissances, on additionne les exposants."],
    },
    "root-across": {
      name: "L'exposant d'une racine de l'autre côté du =",
      how: "Fais passer le ½ (ou le ⅓, ou le ¼) de l'autre côté du =. Là-bas, il devient un carré (ou un cube, ou une puissance 4). Ensuite, appuie sur l'exposant pour calculer.",
      text: ["Pour résoudre `√x = 3`, on élève les deux membres au carré. Écrit comme une puissance, `x^(1/2) = 3`, le ½ passe de l'autre côté et devient un carré : `x = 3²`."],
    },
    "exp-of-log": {
      name: "Une puissance annule un logarithme",
      how: "Dépose la base sur le logarithme de son exposant. Ils s'annulent.",
      text: ["`e` est un nombre particulier, qui vaut environ 2,718. `ln(x)` est la puissance de e qui donne x : ln et e^ s'annulent donc l'un l'autre, `e^(ln x) = x`. Les logarithmes dans d'autres bases marchent de la même façon : `2^(log₂ x) = x`."],
    },
    "evaluate-log": {
      name: "Logarithmes à connaître",
      how: "Appuie sur le logarithme pour le calculer : `ln(e) = 1`, et le logarithme de 1 vaut 0.",
      text: ["`ln(e) = 1`, car `e¹ = e`. Et le logarithme de 1 vaut 0, car tout nombre à la puissance 0 vaut 1."],
    },
    "power-of-base": {
      name: "Comme puissance de la base",
      how: "Appuie sur le nombre dans le logarithme pour l'écrire comme une puissance de 2. Ensuite, fais glisser l'exposant devant le logarithme, puis appuie sur le logarithme.",
      text: ["Pour calculer `log₂(8)`, écris 8 comme une puissance de 2 : `8 = 2³`, donc `log₂(8) = 3`."],
    },
    "log-of-product": {
      name: "Séparer un logarithme",
      how: "Sors le nombre du logarithme. Il a droit à son propre logarithme.",
      text: ["Quand on multiplie des puissances, on additionne leurs exposants. Le logarithme d'un produit est donc une somme de logarithmes : `ln(2x) = ln(2) + ln(x)`."],
    },
    "log-of-root": {
      name: "Logarithme d'une racine",
      how: "Appuie sur la racine pour l'écrire comme une puissance. Ensuite, fais glisser l'exposant devant le logarithme.",
      text: ["Une racine est une puissance, `√x = x^(1/2)`, donc son exposant sort du logarithme comme n'importe quel autre : `ln(√x) = ½ln(x)`."],
    },
    "log-of-power": {
      name: "Exposant hors du logarithme",
      how: "Fais glisser l'exposant devant le logarithme.",
      text: ["`x³`, c'est `x·x·x`, donc `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
    },
    "power-into-log": {
      name: "Nombre dans le logarithme",
      how: "Dépose le nombre devant sur le logarithme. Il devient un exposant à l'intérieur.",
      text: ["Et dans l'autre sens : `3ln(x)`, c'est `ln(x³)`."],
    },
    "combine-logs": {
      name: "Regrouper des logarithmes",
      how: "Dépose un logarithme sur l'autre, ou appuie sur le + (ou le −) entre eux. Additionner des logarithmes multiplie à l'intérieur, les soustraire divise.",
      text: ["Ça marche aussi dans l'autre sens : `ln(a) + ln(b) = ln(ab)`, et `ln(a) − ln(b) = ln(a/b)`."],
    },
    "move-exponent-term": {
      name: "D'un exposant à l'autre",
      how: "Les deux membres sont des puissances de même base. Fais passer un terme d'un exposant dans l'autre : il change de signe.",
      text: [
        "Quand les deux membres sont des puissances de même base, leurs exposants sont égaux : on peut donc les manipuler comme les deux membres d'une équation.",
        "`2^(x − 3) = 2^4` devient `2^x = 2^(4 + 3)` : on a multiplié les deux membres par `2^3`.",
      ],
    },
    "exp-across": {
      name: "La base de l'autre côté du =",
      how: "Fais passer la base de l'autre côté du =. Là-bas, elle devient un logarithme.",
      text: ["Pour faire sortir x d'un exposant, on prend le logarithme des deux membres. Dans `e^x = 5`, le e passe de l'autre côté et devient ln : `x = ln(5)`."],
    },
    "log-across": {
      name: "Le logarithme de l'autre côté du =",
      how: "Fais passer le logarithme de l'autre côté du =. Là-bas, il devient une puissance. Si c'est une puissance d'un nombre, appuie sur son exposant pour la calculer.",
      text: ["Une puissance annule un logarithme. Dans `ln(x) = 2`, le ln passe de l'autre côté et devient e : `x = e²`."],
    },
    "bracket-times-bracket": {
      name: "Une parenthèse fois une parenthèse",
      how: "Dépose une parenthèse sur l'autre : elle multiplie les deux termes à l'intérieur. Ensuite, développe chaque parenthèse de la même façon, et réduis.",
      text: [
        "Dans `(x + 1)(x + 2)`, la première parenthèse est un seul facteur : elle multiplie toute la seconde, le x et le 2. Ensuite, on développe chaque `(x + 1)` à son tour.",
        "Deux termes fois deux termes, ça donne quatre termes. Il ne reste plus qu'à réduire : `(x + 1)(x + 2) = x² + 3x + 2`.",
      ],
    },
    "bracket-out": {
      name: "Mettre une parenthèse en facteur",
      how: "Les deux termes ont la même parenthèse. Appuie longuement dessus dans l'un des termes, puis fais-la glisser devant, au-delà du bord gauche.",
      text: ["Une parenthèse entière peut être un facteur commun. Dans `x(x + 2) + 3(x + 2)`, les deux termes contiennent `(x + 2)` : elle passe devant comme n'importe quel autre facteur, `(x + 2)(x + 3)`."],
    },
    "ineq-move-factor": {
      name: "Diviser les deux membres",
      how: "Fais passer de l'autre côté du signe le nombre devant la lettre. Il divise l'autre membre, et le sens de l'inégalité reste le même. Ensuite, appuie sur la barre de fraction.",
      text: ["Multiplier ou diviser les deux membres par un nombre positif ne change pas non plus le sens de l'inégalité : `2x < 8` donne `x < 8/2`."],
    },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Exercice ${label}${solved ? " — résolu" : ""}`,

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
  predictPrompt: "Dans ta tête d'abord : qu'est-ce que ça devient ?",
  reveal: "Voir la réponse",
  predictedBeforeRight: "Tu avais vu juste du premier coup.",
  predictedBeforeWrong: (picked: boolean) =>
    `Ta première réponse ${picked ? "était la rouge" : "était fausse"}. La bonne, c'est la verte.`,
  rightFirstTime: "Juste du premier coup. Maintenant, résous-le.",
  revealedNote: "La bonne réponse, c'est la verte. Maintenant, résous-le.",
  notQuite: "Pas tout à fait. La bonne, c'est la verte. Résous l'exercice pour voir où ton raisonnement a dérapé.",
  solvedBefore: "✓ Tu as déjà résolu cet exercice. Tu peux le refaire.",
  makeItLookLike: "Transforme-la en",
  solveFor: (letters: string[]) => `Trouve ${letters.map((l) => `\`${l}\``).join(" et ")}.`,
  pickFirst: "Choisis une réponse ci-dessus, puis résous l'exercice ici.",
  hint: "Indice",
  undo: "Annuler",
  solvedBang: "Résolu !",
  where: "où",
  moveCrashed: "Ce mouvement a provoqué une erreur.",
  moveCrashedDetails: "Les détails sont dans la console du navigateur.",
  tryAgain: "Réessayer",

  // Making a set
  ownTitle: "Tes propres exercices",
  ownIntro:
    "Écris une série d'exercices, par exemple pour tes élèves, et partage-la sous forme de lien. Pour chaque exercice, les élèves se représentent d'abord la réponse dans leur tête, puis le résolvent à la main. Rien n'est stocké en ligne : toute la série tient dans le lien.",
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
    wrong: [x = 7, x = 8]    # facultatif : deux réponses fausses parmi lesquelles choisir
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
    # Deux réponses fausses parmi lesquelles choisir (facultatif, sinon elles sont créées pour toi).
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
    ` ${stars} vu${s(stars)} juste du premier coup. Pour chaque exercice, représente-toi d'abord la réponse dans ta tête, puis résous-le à la main.`,
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
      "Impossible de créer des réponses fausses crédibles : ajoute `wrong:`, sinon l'exercice se résout sans qu'on se représente d'abord la réponse.",
    decoysMade: (list: string) => `Réponses fausses créées pour le choix : ${list}.`,
    shapeCount: "le nombre d'équations n'est pas le même",
    shapeRelation: "une expression là où on attend une équation, ou l'inverse",
    shapeIsolated: (letter: string) => `elle ne donne pas la valeur de ${letter}`,
  },
};
