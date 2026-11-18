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
  makingExercise: "Création d'un exercice…",
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
          "Un parcours te mène de l'ordre des termes jusqu'aux équations du second degré. Chaque chapitre propose un cours, de l'entraînement sur trois niveaux et des exercices « De tête », où tu te représentes la réponse dans ta tête avant de faire le calcul. Les enseignants peuvent écrire leurs propres séries d'exercices et les partager sous forme de lien.",
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
  progressReplace: (saved: string) =>
    `Ta progression dans ce navigateur sera remplacée par celle du fichier${saved ? ` (enregistré le ${saved})` : ""}. Le charger ?`,
  progressLoadIt: "Le charger",
  cancel: "Annuler",
  progressNoRoom: "Ton navigateur n'a pas pu l'enregistrer, donc rien n'a changé.",
  progressBlocked:
    "Ce navigateur ne conserve rien pour ce site (navigation privée, ou stockage désactivé), donc il n'y a pas de progression à enregistrer.",
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
      how: "Dépose le nombre de droite sur l'autre nombre qu'il multiplie.",
      text: ["Pour la multiplication non plus, l'ordre ne compte pas : `2·x·5`, c'est `2·5·x`. On peut donc multiplier le 2 et le 5, ce qui donne `10x`."],
    },
    collect: {
      name: "Réduire les termes semblables",
      how: "Dépose un terme sur un terme semblable, c'est-à-dire avec les mêmes lettres aux mêmes puissances. Ils s'additionnent.",
      text: [
        "`3x` veut dire `x + x + x`. Donc `3x + 2x`, c'est trois x plus deux x : `5x`.",
        "On n'additionne que des termes semblables, c'est-à-dire avec exactement les mêmes lettres, aux mêmes puissances. `3x + 2` ne peut pas devenir `5x`, les termes en x restent séparés des termes en y, et `x²` et `3x` aussi.",
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
      how: "Appuie sur le ² pour écrire la parenthèse deux fois. Ensuite, développe comme dans l'exemple précédent (pour déplacer un facteur seul, appuie longuement dessus : un appui bref prend tout le terme), et réduis.",
      text: ["`(x + 1)²`, c'est `(x + 1)(x + 1)` : on le développe donc de la même façon."],
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
    "letter-in": {
      name: "Une lettre fois une parenthèse",
      how: "Dépose la lettre devant sur la parenthèse. Ensuite, appuie longuement sur l'une des deux lettres côte à côte et dépose-la sur l'autre : `x·x`, c'est `x²`. (Un appui bref prendrait tout le terme.)",
      text: ["La lettre multiplie chaque terme à l'intérieur, exactement comme un nombre : `x(x + 3) = x·x + x·3`. Et `x·x` est une puissance, `x²`, comme dans le chapitre Puissances."],
    },
    "power-of-power": {
      name: "Puissance d'une puissance",
      how: "Dépose l'exposant extérieur sur l'exposant intérieur. Ils se multiplient : appuie sur le · pour calculer.",
      text: ["`(x²)³`, c'est `x²·x²·x²`. Ça fait 2 + 2 + 2 = 6 x, donc les exposants se multiplient."],
    },
    "factor-shared": {
      name: "Mettre un facteur en commun",
      how: "Appuie longuement sur le `x` d'un terme, puis dépose-le sur un autre terme qui a un `x` : il devient leur facteur commun. (Ou appuie sur le signe entre deux termes : ce qu'ils ont en commun est mis en facteur.) Ensuite, mets en facteur ce que les deux derniers termes ont en commun (souvent un nombre), puis la parenthèse commune aux deux produits.",
      text: ["Avec quatre termes, on procède deux par deux. Factorise les deux premiers termes par un facteur commun, puis les deux derniers. Si les deux parenthèses sont identiques, mets aussi la parenthèse en facteur."],
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
    "zero-product": {
      name: "Un produit nul",
      how: "Fais descendre une parenthèse hors du produit : l'équation se sépare en deux, cette parenthèse vaut 0 ou l'autre vaut 0. Ensuite, résous chacune des deux.",
      text: [
        "Un produit est nul seulement si l'un de ses facteurs est nul : `3·0 = 0`, mais `3·2` ne l'est pas. Donc `(x − 2)(x + 3) = 0` veut dire `x − 2 = 0` ou `x + 3 = 0` : deux solutions.",
        "C'est pour ça qu'on ne divise jamais les deux membres par quelque chose qui peut valoir 0 : ici, on perdrait une solution.",
      ],
    },
    "take-out-then-split": {
      name: "Factoriser par la lettre, puis séparer",
      how: "Appuie longuement sur la lettre d'un terme, puis fais-la glisser devant, au-delà du bord gauche (ou appuie sur le signe entre les termes). Ensuite, fais descendre la lettre hors du produit, et résous ce qui reste.",
      text: ["Quand il n'y a pas de nombre tout seul, chaque terme contient un x : mets-le en facteur, `x² − 3x = x(x − 3)`. C'est maintenant un produit nul, donc `x = 0` ou `x − 3 = 0`."],
    },
    "split-middle": {
      name: "Factoriser, puis séparer",
      how: "Appuie sur le terme du milieu : il se coupe en deux. Mets un facteur en évidence dans chaque paire, puis la parenthèse qu'elles ont en commun. Ensuite, fais descendre une parenthèse hors du produit.",
      text: ["`x² + x − 6` est le produit de deux parenthèses : `(x + 3)(x − 2)`. Les deux nombres ont pour produit `−6` et pour somme `1`, le coefficient de x. Une fois qu'on a un produit nul, chaque parenthèse donne une solution."],
    },
    "split-fraction": {
      name: "Séparer une fraction",
      how: "Sors un terme du numérateur. Il emporte une copie du dénominateur.",
      text: ["Une somme au numérateur peut se séparer en une fraction par terme, toutes avec le même dénominateur : `(x + 5)/6 = x/6 + 5/6`."],
    },
    "join-powers": {
      name: "Regrouper des racines",
      how: "Dépose une racine sur l'autre. Elles se retrouvent sous un seul radical.",
      text: [
        "Le carré de `√2·√3`, c'est `2·3` : `√2·√3` est donc le nombre positif dont le carré vaut 6, `√(2·3) = √6`. Deux racines de même type se regroupent sous une seule.",
        "C'est pareil pour n'importe quel exposant commun : `x³y³`, c'est xxx·yyy, c'est-à-dire xy·xy·xy, donc `(xy)³`.",
      ],
    },
    "root-notation": {
      name: "Une racine comme puissance",
      how: "Appuie sur la racine pour l'écrire comme une puissance : √ est une puissance ½, ∛ une puissance ⅓.",
      text: ["Toute racine est une puissance : `√x = x^(1/2)`, `∛x = x^(1/3)`, et la racine n-ième de x, c'est `x^(1/n)`. Toutes les règles sur les puissances marchent donc aussi pour les racines : `√x·√x = x^(1/2 + 1/2) = x`."],
    },
    "fraction-power": {
      name: "Racines et puissances ensemble",
      how: "Dépose la racine sur la puissance : les exposants s'additionnent. Ensuite, écris le nombre entier sous forme de fraction de dénominateur 2 : dépose le dénominateur du ½ dessus, et appuie sur le · pour le calculer. Puis additionne les fractions, et appuie sur le + au numérateur.",
      text: ["`√x`, c'est `x^(1/2)`, donc `√x·x² = x^(1/2 + 2) = x^(5/2)`. Un exposant fractionnaire se comporte comme n'importe quel autre : pour multiplier des puissances, on additionne les exposants."],
    },
    "exp-of-log": {
      name: "Une puissance annule un logarithme",
      how: "Dépose la base sur le logarithme de son exposant. Ils s'annulent.",
      text: ["`e` est un nombre particulier, qui vaut environ 2,718. `ln(x)` est la puissance de e qui donne x : ln et e^ s'annulent donc l'un l'autre, `e^(ln x) = x`. Les logarithmes dans d'autres bases marchent de la même façon : `2^(log₂ x) = x`."],
    },
    "evaluate-log": {
      name: "Logarithmes à connaître",
      how: "Appuie sur le logarithme pour le calculer : `ln(e) = 1`, et le logarithme de 1 vaut 0.",
      text: ["`ln(e) = 1`, car `e¹ = e`. Et le logarithme de 1 vaut 0, car `e⁰ = 1`."],
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
    "bracket-times-bracket": {
      name: "Une parenthèse fois une parenthèse",
      how: "Dépose une parenthèse sur l'autre : elle multiplie les deux termes à l'intérieur. Ensuite, développe chaque nouveau terme de la même façon : appuie longuement sur l'un de ses facteurs et dépose-le sur l'autre (un appui bref prend tout le terme). Puis appuie longuement sur un x de `x·x`, dépose-le sur l'autre, et réduis.",
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
    "tap-operator": {
      name: "Appuyer sur le signe entre les deux",
      how: "Appuie sur le + entre les deux nombres : ils s'additionnent, exactement comme quand on dépose l'un sur l'autre.",
      text: ["Appuyer sur le signe entre deux morceaux effectue le calcul : un + les additionne, un − retranche l'un de l'autre, un · les multiplie. Ça revient au même que de déposer l'un sur l'autre : choisis ce qui va le plus vite."],
    },
    "multiply-out": {
      name: "Multiplier les nombres d'un produit",
      how: "Appuie sur le · : tous les nombres du produit sont multipliés entre eux, et `4x·3` devient `12x`.",
      text: ["Dans une multiplication, l'ordre ne compte pas : `4x·3`, c'est `4·3·x`. On peut donc multiplier les nombres entre eux, même s'il y a une lettre au milieu."],
    },
    "times-zero": {
      name: "Multiplier par zéro",
      how: "Appuie sur le 0 : tout le produit devient 0. Ensuite, appuie sur le + pour additionner.",
      text: ["N'importe quoi multiplié par 0 donne 0. Donc `0·(x + 4)` vaut 0, quelle que soit la valeur de x."],
    },
    "evaluate-power": {
      name: "Calculer une puissance",
      how: "Dépose l'exposant sur le nombre : `2³` devient 8.",
      text: ["`2³` veut dire `2·2·2` : le petit nombre, l'exposant, compte combien de fois on multiplie 2. On peut donc calculer la puissance d'un nombre : `2³ = 8`.", "Si tu appuies sur l'exposant, la puissance s'écrit plutôt sous forme de produit : `2³` devient `2·2·2`."],
    },
    "divide-powers": {
      name: "Même base : soustraire les exposants",
      how: "Dépose la puissance du dénominateur sur la puissance de même base au numérateur. Leurs exposants se soustraient : appuie sur le − pour calculer.",
      text: ["`x⁵/x²` a cinq x au numérateur et deux au dénominateur. On en simplifie deux de chaque côté, et il en reste trois au numérateur : quand on divise, on soustrait les exposants."],
    },
    "flip-across-bar": {
      name: "De l'autre côté du trait de fraction",
      how: "Fais glisser la puissance de l'autre côté du trait de fraction, en la montant du dénominateur ou en la descendant du numérateur. Son exposant change de signe.",
      text: ["Quand il y a plus de x au dénominateur, l'exposant devient négatif : `x²/x⁵`, c'est `x^(2 − 5) = x⁻³`, et c'est aussi `1/x³`. Donc `x⁻³` veut dire `1/x³` : quand une puissance traverse le trait de fraction, dans un sens comme dans l'autre, son exposant change de signe."],
    },
    "power-of-product": {
      name: "Exposant dans la parenthèse",
      how: "Fais glisser l'exposant dans la parenthèse : chaque facteur à l'intérieur reçoit sa propre copie. Ensuite, dépose l'exposant du nombre sur le nombre pour le calculer.",
      text: ["`(2x)³`, c'est `2x·2x·2x`, soit `2³·x³`. Chaque facteur à l'intérieur reçoit l'exposant."],
    },
    "minus-bracket": {
      name: "Un moins devant une parenthèse, dans une somme",
      how: "Dépose le − qui précède la parenthèse sur celle-ci : tous les signes à l'intérieur changent. (Quand toute la somme peut bouger, un appui bref sur le − prend toute la somme : appuie longuement dessus pour ne prendre que le moins.)",
      text: ["`5 − (x + 2)` retranche tout `x + 2`, le x et le 2. Le moins change donc tous les signes à l'intérieur : `5 − x − 2`."],
    },
    "split-number": {
      name: "Décomposer un nombre",
      how: "Appuie sur le nombre devant la lettre : il se décompose en deux facteurs, en commençant par celui qu'il a en commun avec l'autre nombre. Appuie aussi sur l'autre nombre. Ensuite, appuie sur le + entre les termes : leur facteur commun est mis en facteur.",
      text: ["Un facteur commun ne se voit pas toujours. Dans `6x + 9`, les deux termes sont divisibles par 3, mais il n'y a pas de 3 dans `6x` à mettre en facteur.", "Appuie sur le 6 : il devient `3·2`, avec d'abord le 3 qu'il a en commun avec 9. Maintenant, le 3 est bien là : `3·2x + 9 = 3(2x + 3)`."],
    },
    "split-term": {
      name: "Couper le terme du milieu",
      how: "Appuie sur la lettre du terme du milieu : il se coupe en deux. (Si tu appuies sur son nombre, c'est le nombre qui se décompose.) Ensuite, factorise deux par deux, comme dans l'exemple précédent : appuie sur le + entre les deux premiers termes, puis entre les deux derniers, puis entre les deux produits.",
      text: ["Pour factoriser `x² + 5x + 6`, cherche deux nombres dont la somme vaut 5 et le produit 6 : 2 et 3. Écris `5x` sous la forme `2x + 3x`.", "Il y a maintenant quatre termes, qu'on factorise deux par deux : `x(x + 2) + 3(x + 2)`, puis `(x + 2)(x + 3)`."],
    },
    "difference-of-squares": {
      name: "Différence de deux carrés",
      how: "Les deux termes sont des carrés, et l'un est retranché de l'autre : appuie sur le moins entre eux. (Si les deux termes ont un nombre en commun, l'appui le met d'abord en facteur, `4x² − 4 = 4(x² − 1)` : appuie alors de nouveau sur le moins.)",
      text: ["Un carré moins un carré se factorise toujours de la même façon : `a² − b² = (a − b)(a + b)`. Développe pour vérifier : les termes du milieu s'annulent.", "Ça ne marche que pour une différence, un carré moins un carré. Une somme de deux carrés, comme `x² + 9`, ne se factorise pas du tout. Un carré moins un nombre qui n'est pas un carré parfait, comme `x² − 7`, se factorise, mais avec des racines : `(x − √7)(x + √7)`."],
    },
    "cancel-factor": {
      name: "Simplifier par un facteur commun",
      how: "Dépose le nombre du dénominateur sur le même nombre au numérateur (ou l'inverse) : ils se simplifient.",
      text: ["Un nombre qui multiplie tout le numérateur et tout le dénominateur se simplifie : `(3x)/3`, c'est `x`, car `3x` divisé par 3 donne x. Dans `(3x + 1)/3`, non : le 3 ne multiplie qu'une partie du numérateur."],
    },
    "evaluate-fraction": {
      name: "Calculer une fraction",
      how: "Appuie sur le numérateur : il se décompose, en commençant par le dénominateur (dans 14 sur 7, le 14 devient `7·2`). Ensuite, dépose le 7 du dénominateur sur ce 7 : ils se simplifient.",
      text: ["Une fraction qui tombe juste peut se calculer : `12/3` vaut 4, car `12 = 3·4`, et le 3 du numérateur se simplifie avec le 3 du dénominateur."],
    },
    "divide-numbers": {
      name: "Simplifier une fraction",
      how: "Appuie sur le numérateur, puis sur le dénominateur : chacun se décompose, en commençant par leur facteur commun (8 et 12 deviennent `4·2` et `4·3`). Ensuite, dépose un 4 sur l'autre : ils se simplifient.",
      text: ["On simplifie une fraction en divisant son numérateur et son dénominateur par un même nombre : `8/12 = 2/3`. Sa valeur ne change pas.", "Décomposer les nombres montre ce qu'ils ont en commun : `8/12 = (4·2)/(4·3)`, et les 4 se simplifient."],
    },
    "factor-then-cancel": {
      name: "Mettre en facteur, puis simplifier",
      how: "Appuie longuement sur le nombre d'un terme du numérateur, puis fais-le glisser devant, au-delà du bord gauche (ou appuie sur le + entre les termes). Ensuite, dépose-le sur le même nombre au dénominateur : ils se simplifient.",
      text: ["On ne peut simplifier que par un facteur de tout le numérateur. Dans `(2x + 6)/2`, le 2 est un facteur de chaque terme : mets-le d'abord en facteur, `(2(x + 3))/2`. Maintenant, c'est un facteur de tout le numérateur, et il se simplifie avec le dénominateur."],
    },
    "divide-by-fraction": {
      name: "Diviser par une fraction",
      how: "Fais monter le dénominateur de la fraction du bas jusqu'au numérateur. Il multiplie le numérateur. Appuie sur le · pour calculer, puis simplifie ce que le numérateur et le dénominateur ont en commun.",
      text: ["Ce que fait un nombre dépend du nombre de traits de fraction au-dessus de lui. Dans `4/(3/5)`, le 5 est sous deux traits : on divise par une division, donc il multiplie. Il peut donc monter au numérateur sans que rien ne change : `(4·5)/3`.", "C'est pour ça que diviser par une fraction revient à multiplier par son inverse : `4/(3/5) = 4·5/3`."],
    },
    "evaluate-root": {
      name: "Calculer une racine",
      how: "Appuie sur la racine pour l'écrire comme une puissance : `√9`, c'est `9^(1/2)`. Ensuite, dépose le ½ sur le 9 pour calculer.",
      text: ["`√9` est le nombre positif qui, multiplié par lui-même, donne 9 : c'est 3, car `3·3 = 9` (−3 aussi, mais √ désigne le nombre positif). De même, `∛8 = 2`, car `2·2·2 = 8`.", "Sous forme de puissance, `√9 = 9^(1/2)` : le ½ déposé sur le 9 le calcule, comme n'importe quel exposant."],
    },
    "pull-out-of-power": {
      name: "Séparer une racine",
      how: "Sors le nombre de la racine : il a droit à sa propre racine. Ensuite, calcule cette racine : appuie dessus, puis dépose le ½ sur le nombre.",
      text: ["La racine d'un produit est le produit des racines : `√(4x) = √4·√x = 2√x`."],
    },
    "split-square": {
      name: "Simplifier une racine",
      how: "Appuie sur le nombre sous la racine : il se décompose et un carré apparaît (un cube, sous une racine cubique). Ensuite, sors ce carré de la racine, comme dans l'exemple précédent, et calcule sa racine.",
      text: ["Une racine qui ne tombe pas juste peut quand même se simplifier. Décompose le nombre sous le radical pour faire apparaître un carré : `√12 = √(4·3) = 2√3`."],
    },
    "root-of-power": {
      name: "Racine d'une puissance",
      how: "Appuie sur la racine pour l'écrire comme une puissance. Dépose son exposant extérieur sur l'exposant intérieur, et appuie sur le · pour calculer le produit. Ensuite, simplifie ce que le numérateur et le dénominateur de l'exposant ont en commun.",
      text: ["Une racine est une puissance, donc la racine d'une puissance est une puissance d'une puissance : `∛(x⁶) = (x⁶)^(1/3) = x^(6/3) = x²`. Les exposants se multiplient, comme dans le chapitre Puissances."],
    },
    "rationalise": {
      name: "Un entier au dénominateur",
      how: "Fais monter la racine du dénominateur jusqu'au numérateur : le numérateur et le dénominateur sont tous les deux multipliés par elle. Ensuite, appuie sur le · du dénominateur, et simplifie ce qui reste, s'il y a quelque chose à simplifier.",
      text: ["Multiplier le numérateur et le dénominateur par un même nombre ne change pas une fraction. Choisis la racine qui est déjà au dénominateur : `√3·√3 = 3`, donc `1/√3 = √3/(√3·√3) = √3/3`. Il n'y a plus de racine sous le trait de fraction."],
    },
    "log-across": {
      name: "Le logarithme de l'autre côté du =",
      how: "Fais passer le logarithme de l'autre côté du =. Il devient une puissance dans l'autre membre. Si c'est la puissance d'un nombre, dépose son exposant sur le nombre pour la calculer.",
      text: ["Une puissance annule un logarithme. Dans `ln(x) = 2`, le ln passe de l'autre côté et devient e : `x = e²`."],
    },
    "move-term": {
      name: "Faire passer un terme",
      how: "Fais passer le nombre de l'autre côté du =. Son signe change au passage. Dépose-le sur le nombre qui s'y trouve, et le calcul se fait ; ou lâche-le à côté, puis appuie sur le − pour calculer.",
      text: ["Une équation dit que deux membres sont égaux. Si on fait la même chose aux deux membres, ils restent égaux.", "Faire passer un terme de l'autre côté du `=`, c'est exactement ça. Dans `x + 3 = 10`, on retranche 3 aux deux membres : `x = 10 − 3`. C'est pour ça que `+3` devient `−3` de l'autre côté."],
    },
    "move-factor": {
      name: "Diviser les deux membres",
      how: "Fais passer le nombre devant la lettre de l'autre côté du =. Il divise l'autre membre. Ensuite, calcule la fraction : appuie sur le numérateur pour le décomposer, et dépose le dénominateur sur le facteur identique.",
      text: ["Un nombre qui multiplie tout un membre divise l'autre membre quand il passe de l'autre côté. Dans `2x = 8`, on divise les deux membres par 2 : `x = 8/2`, et `8/2 = (2·4)/2 = 4`."],
    },
    "two-steps": {
      name: "En deux étapes",
      how: "Fais passer de l'autre côté le nombre qui est ajouté, et dépose-le sur le nombre qui s'y trouve. Ensuite, fais passer le nombre devant la lettre, et calcule la fraction : décompose le numérateur, puis simplifie.",
      text: ["Dans `3x + 4 = 19`, x a été multiplié par 3, puis on a ajouté 4. Pour retrouver x, on défait ces opérations dans l'ordre inverse : d'abord on retranche 4, ensuite on divise par 3.", "Le 3 ne peut pas passer en premier : il ne multiplie que le x, pas tout le membre."],
    },
    "root-across": {
      name: "Une racine de l'autre côté du =",
      how: "Appuie sur la racine pour l'écrire comme une puissance (½, ou ⅓ pour une ∛), puis fais passer cet exposant de l'autre côté du = : l'autre membre est élevé au carré (au cube, pour une ∛). Ensuite, dépose l'exposant sur le nombre pour calculer.",
      text: ["Pour résoudre `√x = 3`, on élève les deux membres au carré : `x = 3²`. Le carré annule la racine : le √ disparaît, et l'autre membre est élevé au carré. De même, le cube annule la racine cubique, et ainsi de suite.", "Sous forme de puissance, `x^(1/2) = 3`, c'est le ½ qui passe de l'autre côté et devient un carré : c'est le même mouvement."],
    },
    "ineq-move-factor": {
      name: "Diviser les deux membres",
      how: "Fais passer le nombre devant la lettre de l'autre côté du signe d'inégalité. Il divise l'autre membre, et le sens de l'inégalité reste le même. Ensuite, calcule la fraction : décompose le numérateur, puis simplifie.",
      text: ["Multiplier ou diviser les deux membres par un nombre positif ne change pas non plus le sens de l'inégalité : `2x < 8` donne `x < 8/2`."],
    },
    "ineq-negative": {
      name: "Diviser par un nombre négatif",
      how: "Fais passer le nombre de l'autre côté, et calcule la fraction : le sens de l'inégalité reste le même. Ensuite, fais passer le moins de l'autre côté : le signe se retourne.",
      text: ["Diviser les deux membres par un nombre négatif retourne le signe d'inégalité, exactement comme multiplier par −1 : `−2x < 6` veut dire `x > −3`.", "Ici, ce sont deux mouvements que tu connais déjà : diviser par 2 (le sens reste le même), puis faire passer le moins de l'autre côté (le signe se retourne)."],
    },
    "plus-minus": {
      name: "Les deux racines d'un carré",
      how: "Fais passer le 2 de l'autre côté du =. Un carré a deux racines : l'équation se sépare en deux, l'une avec + et l'autre avec −. Ensuite, dépose chaque ½ sur le nombre pour calculer.",
      text: ["`3² = 9`, et `(−3)² = 9` aussi. Donc `x² = 9` veut dire `x = 3` ou `x = −3`. Si tu oublies le moins, tu perds une solution."],
    },
    "fraction-zero": {
      name: "Une fraction égale à 0",
      how: "Attrape le dénominateur de la fraction par son + ou son −, et fais-le passer de l'autre côté du =. Il multiplie l'autre membre : appuie sur le 0, car 0 fois n'importe quoi donne 0. Ensuite, fais passer le nombre de l'autre côté.",
      text: ["Une fraction est nulle seulement si son numérateur est nul. Son dénominateur ne peut jamais valoir 0, et la condition écrite après l'équation le rappelle : `x ≠ −2` empêche `x + 2` de valoir 0.", "Le dénominateur peut donc passer de l'autre côté et multiplier l'autre membre : `(x − 3)/(x + 2) = 0` donne `x − 3 = 0·(x + 2)`, c'est-à-dire `x − 3 = 0`. Si une solution ne respecte pas la condition, elle est barrée."],
    },
    "letter-factor": {
      name: "Diviser par une lettre",
      how: "Fais passer la lettre devant x de l'autre côté du =. Elle divise l'autre membre. Ensuite, dépose-la sur la même lettre au numérateur : elles se simplifient.",
      text: ["On ne peut diviser les deux membres par une lettre que si elle ne peut pas valoir 0, et la condition écrite après l'équation le précise : `a ≠ 0`.", "Ne divise jamais par x lui-même : dans `x² = 3x`, diviser par x donne `x = 3` et fait perdre la solution `x = 0`. Fais plutôt tout passer dans un seul membre, puis factorise."],
    },
    "alone-first": {
      name: "La méthode complète",
      how: "Aucune lettre n'est encore isolée : fais passer le x de la première équation de l'autre côté, pour obtenir `y = …`. Ensuite, remplace y dans l'autre équation, résous-la pour trouver x, puis remplace x pour trouver y.",
      text: ["Voici la méthode complète, du début à la fin :", "1. Isole une lettre dans l'une des équations. Choisis la plus simple : une lettre sans nombre devant. Dans `x + y = 7`, fais passer le x de l'autre côté : `y = 7 − x`.", "2. Substitue : dans l'autre équation, remplace cette lettre par ce qu'elle vaut, entre parenthèses. Un moins devant change tous les signes à l'intérieur.", "3. Résous l'équation qui reste : elle n'a plus qu'une seule lettre.", "4. Reporte la valeur trouvée dans `y = …` pour trouver l'autre lettre."],
    },
    "fraction-of-fractions": {
      name: "Une fraction de fractions",
      how: "Fais monter le dénominateur de la fraction du bas jusqu'au numérateur, puis fais descendre le dénominateur de la fraction du haut jusqu'au dénominateur. Ensuite, appuie sur chaque · pour calculer.",
      text: ["Dans `(a/b)/(c/d)`, chacun des quatre nombres peut traverser le trait de fraction principal pour aller à l'endroit qui a autant de traits au-dessus de lui, sans que rien ne change (comme le 5 dans l'exemple précédent) : d monte à côté de a, b descend à côté de c, c monte à côté de b, et a descend à côté de d. (Sauf si a peut valoir 0 : on ne divise jamais par 0.)", "En faisant passer les deux dénominateurs, on obtient une seule fraction : `(a·d)/(c·b)`."],
    },
    "minus-number-in": {
      name: "Un nombre négatif devant",
      how: "Dépose le nombre sur la parenthèse, et appuie sur le · pour calculer. Ensuite, dépose le moins sur la parenthèse : tous les signes à l'intérieur changent.",
      text: ["`−3(x − 2)`, c'est −1 fois 3 fois la parenthèse. On multiplie d'abord par 3 : `−(3x − 6)`. Ensuite, le moins change tous les signes à l'intérieur : `−3x + 6`.", "Attention au dernier signe : `−3` fois `−2`, ça fait `+6`. Moins par moins, ça donne plus."],
    },
    "substitute-back": {
      name: "Reporter la valeur",
      how: "Fais glisser le `x` de `x = …` sur le `x` de l'autre équation. Ensuite, appuie sur le · et sur le + pour calculer y.",
      text: ["Une fois x connu, l'autre équation te donne y : remplaces-y x par sa valeur, et calcule. Tu as maintenant les deux valeurs, et ce couple est la solution.", "Pour vérifier, remplace x et y par leurs valeurs dans l'équation que tu n'as pas utilisée en dernier : les deux membres doivent donner le même résultat."],
    },
    "square-both-sides": {
      name: "Élever les deux membres au carré",
      how: "Appuie sur la racine pour l'écrire comme une puissance d'exposant ½, puis fais passer le ½ de l'autre côté du = : l'autre membre est élevé au carré. Développe, fais tout passer dans un seul membre, factorise et sépare, comme dans l'exemple précédent. La solution qui ne respecte pas une condition est barrée.",
      text: ["Une racine n'est jamais négative, donc `√(x + 7) = x + 1` n'est vraie que si `x + 1 ≥ 0`, c'est-à-dire `x ≥ −1`. (Et ce qui est sous la racine ne peut pas être négatif non plus : `x ≥ −7`.) Ce sont les conditions, données dès le départ : elles restent vraies jusqu'au bout.", "En élevant les deux membres au carré, on les perd : `x + 7 = (x + 1)²` est vraie aussi pour `x = −3`, où `x + 1` est négatif. L'équation élevée au carré donne donc `x = 2` ou `x = −3`, et −3 ne respecte pas une condition : cette solution est barrée. La seule solution est `x = 2`."],
    },
    "substitute": {
      name: "Substituer",
      how: "Fais glisser le `y` de `y = …` sur le `y` de l'autre équation : il est remplacé par ce que vaut `y`. Cette équation ne contient plus que des x : réduis les termes en x et résous-la.",
      text: ["`y = 2x` et `x + y = 9` sont deux équations sur les mêmes x et y, vraies en même temps. Une équation à deux inconnues a une infinité de solutions ; deux équations ensemble n'en ont en général qu'une.", "`y = 2x` dit que y et 2x sont égaux : on peut donc remplacer y par 2x dans l'autre équation. Il reste une équation à une seule inconnue, que tu sais résoudre."],
    },
    "zero-power": {
      name: "Exposant 0",
      how: "Appuie sur l'exposant 0 : `x⁰` devient 1. Ensuite, appuie sur le + pour additionner.",
      text: ["`x³/x³` vaut 1 (si x n'est pas nul), et c'est aussi `x^(3 − 3) = x⁰`. Donc tout nombre non nul à la puissance 0 vaut 1."],
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
  nextStep: "Étape suivante",
  noNextStep: "Aucune étape trouvée à partir d'ici : essaie Annuler, ou Recommencer.",
  undo: "Annuler",
  solvedBang: "Résolu !",
  where: "où",
  moveCrashed: "Ce mouvement a provoqué une erreur.",
  moveCrashedDetails: "Réessaie, ou recommence cet exercice.",
  pageCrashed: "Un problème est survenu sur cette page.",
  pageCrashedDetails: "Réessaie, ou retourne au parcours. Ta progression ne risque rien.",
  tryAgain: "Réessayer",

  // Making a set
  ownTitle: "Tes propres exercices",
  ownIntro:
    "Écris une série d'exercices, par exemple pour tes élèves, et partage-la sous forme de lien. Pour chaque exercice, les élèves se représentent d'abord la réponse dans leur tête, puis le résolvent à la main. Rien n'est stocké en ligne : toute la série tient dans le lien.",
  upload: "Importer un fichier .yaml",
  startFromExample: "Partir de l'exemple",
  yamlLabel: "La série d'exercices, en YAML",
  form: {
    asForm: "Formulaire",
    asYaml: "YAML",
    viewLabel: "Écrire la série sous forme de",
    title: "Titre",
    moves: "Mouvements autorisés",
    allMoves: "Tous les mouvements",
    upTo: (n: number, title: string) => `Jusqu'à ${n}. ${title}`,
    start: (n: number) => `Exercice ${n} : départ`,
    goal: (n: number) => `Exercice ${n} : objectif`,
    remove: (n: number) => `Supprimer l'exercice ${n}`,
    addOne: "Ajouter un exercice",
    fromChapter: "Ajouter des exercices d'entraînement d'un chapitre",
    chapter: "Chapitre",
    level: "Niveau",
    howMany: "Combien",
    addMade: (n: number) => `Ajouter ${n}`,
    making: "Création en cours…",
    cantRead: "Le YAML de cette série contient une erreur, donc le formulaire ne peut pas l'afficher. Corrige-le dans la vue YAML, ou pars de l'exemple.",
  },
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
    noValue: "Le départ n'a de valeur pour aucun nombre (une division par 0 ?).",
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
