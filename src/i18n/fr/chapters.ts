import type { ChapterTexts } from "..";

export const frChapters: ChapterTexts = {
  shuffle: {
    title: "Ordre des termes",
    blurb: "On peut additionner les termes dans n'importe quel ordre, et calculer directement les nombres.",
    lesson: [
      {
        title: "L'ordre ne compte pas",
        text: [
          "L'ordre dans lequel on additionne ne change pas le résultat. `2 + x` et `x + 2`, c'est pareil.",
          "Chaque morceau d'une somme s'appelle un terme. Tu peux faire glisser les termes dans l'ordre que tu veux.",
        ],
        steps: ["Fais passer le 2 après le x."],
      },
      {
        title: "Chaque terme garde son signe",
        text: ["Dans `5 − 3 + x`, les termes sont `5`, `−3` et `x`. Le signe moins appartient au 3 : quand le 3 bouge, son moins le suit."],
        steps: ["Fais glisser le x au début. Le 3 garde son signe moins."],
        watch: "`5 − 3` et `3 − 5`, ce n'est pas la même chose. Quand tu déplaces le 3, son signe moins doit suivre.",
      },
      {
        title: "Additionner des nombres",
        text: [
          "Deux nombres d'une même somme peuvent s'additionner : dépose l'un sur l'autre. Le x est un nombre qu'on ne connaît pas encore, donc il ne change pas.",
        ],
        steps: ["Dépose le 4 sur le 3."],
        after: "3 + 4 = 7. Le x ne change pas.",
      },
      {
        title: "Multiplier dans n'importe quel ordre",
        text: [
          "Pour la multiplication non plus, l'ordre ne compte pas : `2·x·5`, c'est `2·5·x`. Tu peux donc multiplier le 2 par le 5 pour obtenir 10.",
          "D'habitude, on écrit le nombre en premier et on ne met pas le point : `10·x` s'écrit `10x`.",
        ],
        steps: ["Dépose le 5 sur le 2."],
      },
    ],
  },

  collect: {
    title: "Réduire une expression",
    blurb: "Les termes qui ont les mêmes lettres s'additionnent : 3x + 2x = 5x. Un terme moins lui-même, ça fait 0.",
    lesson: [
      {
        title: "Que veut dire 3x ?",
        text: ["`3x` veut dire `x + x + x`. Donc `3x + 2x`, c'est trois x plus deux x, soit `5x`."],
        steps: ["Dépose le 2x sur le 3x."],
      },
      {
        title: "Seuls les termes semblables s'additionnent",
        text: [
          "Des termes semblables ont exactement les mêmes lettres. On ne peut additionner que des termes semblables. `3x + 2` ne peut pas devenir `5x`, car le `2` n'a pas de x. Les nombres seuls s'additionnent uniquement entre eux.",
        ],
        steps: ["Les deux x sont des termes semblables. Dépose le second x sur le premier."],
        after: "Le 4 n'a pas de x, donc il ne change pas.",
      },
      {
        title: "Des lettres différentes ne s'additionnent pas",
        text: [
          "`x` et `y` peuvent valoir des nombres différents, donc on ne peut pas réduire `2x + 3y`. Mais dans `2x + 3y + x`, on peut additionner les deux termes en x.",
        ],
        steps: ["Dépose le x sur le 2x. Le 3y ne change pas."],
        after: "Les termes en x et les termes en y restent séparés.",
      },
      {
        title: "Soustraire",
        text: ["La soustraction marche pareil : `5y − 2y`, c'est `3y`. Un nombre moins lui-même, ça fait 0, donc `a + b − a`, c'est simplement `b`."],
        steps: ["Dépose le −a sur le a. Ils s'annulent."],
        watch: "`x + x` fait `2x`, pas `x²`. `x²` veut dire `x·x` : on le verra plus tard.",
      },
    ],
  },

  distribute: {
    title: "Distributivité",
    blurb:
      "Un nombre devant une parenthèse multiplie chaque terme à l'intérieur. Un facteur commun à tous les termes peut être remis devant : c'est factoriser.",
    lesson: [
      {
        title: "Multiplier chaque terme de la parenthèse",
        text: [
          "`2(x + 3)` veut dire 2 fois `(x + 3)`. C'est 2 fois x plus 2 fois 3 : `2x + 2·3`. Le nombre devant multiplie chaque terme de la parenthèse.",
          "Imagine un rectangle de hauteur 2 et de largeur `x + 3`. Coupe-le en deux : une partie a pour aire `2·x`, l'autre `2·3`. Ensemble, elles forment tout le rectangle.",
        ],
        steps: ["Dépose le 2 sur la parenthèse. Il multiplie les deux termes.", "Maintenant, dans 2·3, dépose le 2 sur le 3."],
      },
      {
        title: "Un signe moins devant",
        text: ["`−(x − 4)` veut dire `−1` fois la parenthèse. Le −1 multiplie chaque terme : tous les signes à l'intérieur changent."],
        steps: ["Dépose le signe moins sur la parenthèse."],
        watch: "Une erreur classique : écrire que `−(x − 4)` donne `−x − 4`. Le moins multiplie aussi le 4.",
      },
      {
        title: "Mettre en facteur",
        text: [
          "Faire le chemin inverse, c'est factoriser. Si tous les termes ont un facteur 3, tu peux mettre le 3 en facteur devant une parenthèse : `3x + 3y = 3(x + y)`.",
        ],
        steps: ["Les deux termes contiennent un 3. Fais glisser un 3 devant, au-delà du bord gauche."],
        after: "Développe à nouveau et tu retrouves 3x + 3y.",
      },
      {
        title: "x fois x",
        text: [
          "Parfois, une lettre est multipliée par elle-même : `x(x + 2)` donne `x·x`. On l'écrit `x²` (« x au carré »). Un carré de côté x a pour aire `x·x`.",
        ],
        steps: ["Dépose le x sur la parenthèse.", "Dépose un x sur l'autre."],
      },
    ],
  },

  brackets: {
    title: "Double distributivité",
    blurb: "Pour multiplier deux parenthèses, on multiplie chaque terme de la première par chaque terme de la seconde.",
    lesson: [
      {
        title: "Une parenthèse est un seul facteur",
        text: [
          "Dans `(x + 1)(x + 2)`, la première parenthèse multiplie toute la seconde. Considère `(x + 1)` comme un seul facteur et développe : il multiplie le `x` et le `2`.",
        ],
        steps: [
          "Dépose tout le bloc (x + 1) sur (x + 2). Il multiplie les deux termes.",
          "Maintenant, dépose le x sur le (x + 1) juste à côté.",
          "Puis dépose le 2 sur son (x + 1).",
        ],
        after: "On obtient quatre termes : x·x, 1·x, 2·x et 2·1. Réduis pour obtenir x² + 3x + 2.",
      },
      {
        title: "Multiplier deux parenthèses",
        text: [
          "Multiplie chaque terme de la première parenthèse par chaque terme de la seconde. Deux termes fois deux termes, ça donne quatre termes. Ensuite, réduis.",
          "Dans `(x + 3)(x − 3)`, les deux termes du milieu sont `+3x` et `−3x`. Ils s'annulent, et il reste `x² − 9`.",
        ],
      },
      {
        title: "Le carré d'une parenthèse",
        text: ["`(x + 1)²`, c'est `(x + 1)(x + 1)` : on fait donc pareil. Appuie sur le ² pour l'écrire en entier."],
        steps: ["Appuie sur le ² pour l'écrire sous forme de produit."],
        watch:
          "`(x + 1)²` n'est pas égal à `x² + 1`. Essaie avec x = 2 : `(2 + 1)² = 9`, mais `2² + 1 = 5`. La différence, ce sont les deux termes du milieu : `x + x = 2x`.",
      },
    ],
  },

  balance: {
    title: "Résoudre une équation",
    blurb:
      "Si on fait la même chose aux deux membres, l'égalité reste vraie. Un terme qui passe de l'autre côté du = fait l'opération inverse.",
    lesson: [
      {
        title: "La même chose des deux côtés",
        text: [
          "Une équation dit que deux quantités sont égales. Si tu fais la même opération sur les deux membres, ils restent égaux.",
          "Faire passer un terme de l'autre côté du `=`, c'est exactement ça. À partir de `x + 3 = 10`, on enlève 3 aux deux membres : `x = 10 − 3`. Voilà pourquoi `+3` devient `−3` de l'autre côté.",
        ],
        steps: ["Fais passer le 3 de l'autre côté du =. Son signe change.", "Dépose le −3 sur le 10."],
      },
      {
        title: "Diviser les deux membres",
        text: [
          "Si un nombre multiplie tout un membre, il divise l'autre membre quand il passe de l'autre côté. À partir de `2x = 8`, on divise les deux membres par 2 : `x = 8/2`.",
        ],
        steps: ["Fais passer le 2 de l'autre côté du =. Il divise l'autre membre.", "Dépose le 2 sur le 8."],
      },
      {
        title: "Fractions et signes moins",
        text: [
          "Ça marche aussi avec une division. À partir de `x/3 = 4`, on multiplie les deux membres par 3. Le 3 du dénominateur passe de l'autre côté et multiplie l'autre membre.",
          "Un signe moins devant tout un membre peut aussi passer de l'autre côté : `−x = 6` devient `x = −6`.",
        ],
        steps: ["Fais passer le 3 de l'autre côté du =.", "Dépose le 4 sur le 3."],
      },
      {
        title: "Défaire dans l'ordre inverse",
        text: [
          "Dans `3x + 1`, on multiplie x par 3, puis on ajoute 1. Pour isoler x, on défait ces opérations dans l'ordre inverse : d'abord le 1, puis le 3.",
        ],
        steps: ["Fais passer le 1 de l'autre côté.", "Calcule.", "Fais passer le 3 de l'autre côté.", "Calcule."],
        watch: "Vérifie ta solution en la remplaçant dans l'équation : 3·4 + 1 = 13. ✓",
      },
    ],
  },

  powers: {
    title: "Puissances",
    blurb: "x³ veut dire x·x·x. Compte les x et tu retrouves toutes les règles sur les puissances.",
    lesson: [
      {
        title: "Multiplier des puissances",
        text: [
          "`x³` veut dire `x·x·x`. Le petit nombre est l'exposant : il indique combien de x sont multipliés.",
          "Donc `x²·x³`, c'est deux x fois trois x : cinq x en tout. Quand on multiplie des puissances de même base, on additionne les exposants.",
        ],
        steps: ["Même base : dépose une puissance sur l'autre.", "Calcule."],
      },
      {
        title: "Puissance d'une puissance",
        text: ["`(x²)³`, c'est `x²·x²·x²`. Ça fait 2 + 2 + 2 = 6 x, donc on multiplie les exposants."],
        steps: ["Dépose le 3 extérieur sur le 2 intérieur.", "Calcule."],
      },
      {
        title: "Diviser des puissances",
        text: [
          "`x⁵/x²` a cinq x au numérateur et deux au dénominateur. On en simplifie deux de chaque côté, et il reste trois x au numérateur. Quand on divise, on soustrait les exposants.",
        ],
        steps: ["Dépose le x² sur le x⁵.", "Calcule."],
      },
      {
        title: "Exposant nul, exposants négatifs",
        text: [
          "`x³/x³` vaut 1, mais c'est aussi `x^(3 − 3) = x⁰`. Donc n'importe quel nombre (non nul) à la puissance 0 vaut 1.",
          "S'il y a plus de x au dénominateur qu'au numérateur, l'exposant devient négatif : `x⁻²` veut dire `1/x²`. Quand une puissance traverse la barre de fraction, son exposant change de signe.",
        ],
        steps: ["Fais monter le x³ de l'autre côté de la barre."],
        watch: "`2x³`, c'est `2·x·x·x` : la puissance ne porte que sur le x. `(2x)³`, c'est autre chose : ça fait `8x³`.",
      },
    ],
  },

  factor: {
    title: "Factorisation",
    blurb: "Factoriser, c'est développer à l'envers. Trouve un facteur commun à tous les termes et mets-le devant une parenthèse.",
    lesson: [
      {
        title: "Développer à l'envers",
        text: [
          "Factoriser, c'est défaire un développement. `x² + 3x`, c'est `x·x + 3·x`. Les deux termes contiennent un `x`, donc tu peux le mettre en facteur : `x(x + 3)`.",
        ],
        steps: [
          "Appuie sur le ² pour écrire x² en entier.",
          "Maintenant, les deux termes contiennent un x. Fais glisser un x devant, au-delà du bord gauche.",
        ],
        after: "Pour vérifier, développe x(x + 3). Tu retrouves x² + 3x.",
      },
      {
        title: "Décomposer les nombres",
        text: [
          "Pour trouver un facteur commun, décompose les nombres en produits. Dans `2x + 6`, appuie sur le 6 pour obtenir `2·3`. Maintenant, les deux termes contiennent un 2.",
        ],
        steps: ["Appuie sur le 6 pour le décomposer.", "Fais glisser un 2 devant."],
      },
      {
        title: "Mettre une parenthèse en facteur",
        text: [
          "Dans `x(x + 2) + 3(x + 2)`, les deux termes ont la même parenthèse `(x + 2)`. C'est un facteur commun : tu peux le mettre en facteur comme n'importe quel autre.",
        ],
        steps: ["Fais glisser le (x + 2) devant."],
      },
      {
        title: "Quatre termes : par paires",
        text: [
          "Avec quatre termes, factorise les deux premiers, puis les deux derniers. Si tu obtiens deux fois la même parenthèse, mets-la à son tour en facteur.",
        ],
        watch: "Vérifie toujours une factorisation en redéveloppant. Tu dois retrouver exactement l'expression de départ.",
      },
    ],
  },

  formulas: {
    title: "Transformer une formule",
    blurb: "Une formule est une équation avec plusieurs lettres. Avec les mêmes mouvements que pour x, tu peux en isoler une.",
    lesson: [
      {
        title: "Isoler une lettre",
        text: [
          "`v = u + at` donne une vitesse `v` à partir d'une vitesse de départ `u`, d'une accélération `a` et d'une durée `t`. Une fois transformée, elle donne plutôt la durée : `t = (v − u)/a`.",
          "Isoler une lettre, c'est l'exprimer en fonction des autres. Ça marche comme quand tu résous une équation en x : traite les autres lettres comme des nombres.",
        ],
        steps: [
          "Le t est multiplié par a. Commence par faire passer le u de l'autre côté.",
          "Maintenant, fais passer le a de l'autre côté. Il divise l'autre membre.",
        ],
        after: "Lis-la de droite à gauche : t = (v − u)/a.",
      },
      {
        title: "Les lettres bougent comme les nombres",
        text: [
          "Une lettre qui multiplie tout un membre peut passer de l'autre côté du `=` et diviser l'autre membre, tout comme `2x = 8` est devenu `x = 8/2`. (On ne peut diviser que par une lettre qui ne vaut pas 0. Dans ces formules, c'est toujours le cas.)",
        ],
        steps: ["Fais passer le m de l'autre côté."],
        watch: "Seul un facteur de tout le membre peut passer de l'autre côté. Dans `u + at`, le `a` ne multiplie que le `t` : fais donc d'abord passer le `u`.",
      },
      {
        title: "Des lettres au dénominateur",
        text: [
          "Si tout un membre est une fraction, la lettre du dénominateur peut passer de l'autre côté et multiplier l'autre membre, tout comme `x/3 = 4` est devenu `x = 4·3`.",
        ],
        steps: ["Fais passer le A de l'autre côté. Il multiplie l'autre membre."],
      },
      {
        title: "Quand la lettre apparaît deux fois",
        text: [
          "Dans `ax + bx = c`, x apparaît deux fois : déplacer un seul terme ne suffit pas pour l'isoler. Mets d'abord x en facteur. Ensuite, la parenthèse qui le multiplie peut passer de l'autre côté.",
        ],
        steps: [
          "Les deux termes contiennent un x. Fais glisser un x devant.",
          "Maintenant, fais passer toute la parenthèse (a + b) de l'autre côté.",
        ],
      },
    ],
  },

  inequalities: {
    title: "Inéquations",
    blurb:
      "On résout une inéquation comme une équation, à une différence près : multiplier ou diviser par un nombre négatif change le sens de l'inégalité.",
    lesson: [
      {
        title: "Inférieur, supérieur",
        text: ["`x < 7` veut dire que x est inférieur à 7. Le côté ouvert du signe est tourné vers le plus grand nombre."],
        steps: ["Comme pour une équation, fais passer le 2 de l'autre côté.", "Calcule."],
      },
      {
        title: "Échanger les deux membres",
        text: [
          "`3 > x` et `x < 3` disent la même chose : x est inférieur à 3. Tu peux donc échanger les deux membres, à condition de retourner aussi le signe.",
        ],
        steps: ["Fais glisser le 3 de l'autre côté. Le signe se retourne."],
      },
      {
        title: "Les mêmes mouvements que pour les équations",
        text: [
          "Ajouter ou soustraire la même quantité aux deux membres ne change pas le sens de l'inégalité. Multiplier ou diviser les deux membres par un nombre positif non plus.",
        ],
        steps: ["Fais passer le 2 de l'autre côté. Il est positif, donc le sens ne change pas.", "Calcule."],
      },
      {
        title: "Un signe moins change le sens",
        text: [
          "Multiplier par −1 inverse l'ordre : `2 < 3`, mais `−2 > −3`. Donc quand un signe moins passe de l'autre côté, le sens de l'inégalité change.",
        ],
        steps: ["Fais passer seulement le signe moins de l'autre côté. Le < se retourne."],
        after: "Vérifie avec un nombre : x = 0 convient à la fois pour −x < 4 et pour x > −4.",
        watch: "Seule une multiplication ou une division par un nombre négatif change le sens. Faire passer un terme de l'autre côté, jamais.",
      },
    ],
  },

  fractions: {
    title: "Calculs avec des fractions",
    blurb:
      "Pour additionner des fractions, il faut d'abord les mettre au même dénominateur. Multiplier le numérateur et le dénominateur par un même nombre ne change pas la valeur d'une fraction.",
    lesson: [
      {
        title: "Additionner des fractions",
        text: [
          "`3/4` veut dire 3 quarts. Quand les dénominateurs sont les mêmes, il suffit d'additionner les numérateurs : 1 cinquième plus 2 cinquièmes, ça fait 3 cinquièmes, donc `1/5 + 2/5 = 3/5`.",
        ],
        steps: ["Les dénominateurs sont les mêmes. Dépose une fraction sur l'autre.", "Calcule."],
      },
      {
        title: "Fractions égales",
        text: [
          "Diviser le numérateur et le dénominateur par un même nombre ne change pas la valeur : `6/8 = 3/4`.",
          "Les multiplier par un même nombre non plus : `1/2 = 2/4 = 3/6`.",
        ],
        steps: ["Dépose le 8 sur le 6. Les deux sont divisés par leur facteur commun, 2."],
      },
      {
        title: "Mettre au même dénominateur",
        text: [
          "Pour calculer `1/2 + 1/3`, écris d'abord les deux fractions en sixièmes. Multiplie le numérateur et le dénominateur de `1/2` par 3, et ceux de `1/3` par 2. Les deux dénominateurs valent alors 6.",
        ],
        steps: ["Fais glisser le 3 de ⅓ sur ½ : son numérateur et son dénominateur sont multipliés par 3."],
        watch: "`1/2 + 1/3` ne fait pas `2/5`. On n'additionne les numérateurs que si les dénominateurs sont déjà les mêmes.",
      },
      {
        title: "Multiplier des fractions",
        text: [
          "La multiplication est plus simple : on multiplie les numérateurs entre eux, et les dénominateurs entre eux. La moitié d'un tiers, c'est `(1·1)/(2·3) = 1/6`.",
        ],
        steps: ["Dépose une fraction sur l'autre."],
        after: "Ensuite, simplifie par les facteurs communs au numérateur et au dénominateur pour obtenir 3/2.",
      },
    ],
  },

  simultaneous: {
    title: "Systèmes d'équations",
    blurb: "Deux équations à deux inconnues, vraies en même temps. Isole une lettre dans une équation, puis remplace-la dans l'autre.",
    lesson: [
      {
        title: "Deux équations à la fois",
        text: [
          "`y = 2x` et `x + y = 9` sont deux équations avec les mêmes x et y. Une équation à deux inconnues a plein de solutions. Deux équations ensemble n'en ont en général qu'une seule.",
          "Pour résoudre le système, on élimine une lettre. Il reste une équation à une inconnue, et ça, tu sais déjà le faire.",
        ],
      },
      {
        title: "La substitution",
        text: ["`y = 2x` dit que y et 2x sont égaux. Tu peux donc remplacer y par 2x dans l'autre équation. C'est ce qu'on appelle la substitution."],
        steps: [
          "Fais glisser le y de y = 2x sur le y de l'autre équation.",
          "Maintenant, il n'y a plus que des x dans l'équation. Regroupe les x.",
        ],
        after: "Résous-la : x = 3. Puis remplace x par 3 dans y = 2x pour trouver y.",
      },
      {
        title: "Isoler une lettre",
        text: [
          "Pour substituer, il te faut une équation de la forme `y = …` ou `x = …`. Si tu n'en as pas, fabrique-la : dans `x − y = 1`, fais passer le −y de l'autre côté pour obtenir `x = 1 + y`.",
        ],
        steps: [
          "Dans la seconde équation, fais passer le −y de l'autre côté du =.",
          "Maintenant, x est isolé. Fais-le glisser sur le x de la première équation.",
        ],
        after: "Il n'y a plus que des y dans la première équation : 2y + 1 = 7, donc y = 3.",
        watch: "Remplace par toute l'expression. Si x = 1 + y, alors 2x devient 2(1 + y), et pas 2 + y.",
      },
      {
        title: "Trouver l'autre lettre",
        text: [
          "Une fois que tu connais une lettre, par exemple `x = 3`, remplace-la dans l'autre équation pour trouver l'autre lettre. Fais glisser le x de `x = 3` sur un x de l'autre équation.",
        ],
      },
    ],
  },

  roots: {
    title: "Racines carrées",
    blurb: "√x, c'est x à la puissance ½ : les règles sur les puissances marchent donc aussi pour les racines.",
    lesson: [
      {
        title: "La racine carrée",
        text: ["`√9` est le nombre qui, multiplié par lui-même, donne 9. C'est 3, car `3·3 = 9`."],
        steps: ["Appuie sur le 9 pour le décomposer en deux facteurs égaux."],
        after:
          "Ensuite, sors un 3 de la racine. Une fois que tu as compris le principe, tu peux appuyer sur une racine comme √9 pour la calculer d'un coup.",
      },
      {
        title: "Une racine est une puissance",
        text: [
          "`√x`, c'est `x` à la puissance `½`. Donc `√x·√x = x^(1/2 + 1/2) = x`. Toutes les règles sur les puissances marchent aussi pour les racines.",
        ],
        steps: ["Appuie dessus : une puissance ½, c'est une racine carrée."],
      },
      {
        title: "La racine d'un produit",
        text: ["La racine d'un produit est le produit des racines : `√(4x) = √4·√x = 2√x`."],
        steps: ["Sors le 4 de la racine. Il a droit à sa propre racine."],
        after: "Et √4 vaut 2, donc ça fait 2√x.",
        watch: "La racine d'une somme n'est pas la somme des racines : `√(9 + 16)`, c'est `√25 = 5`, pas `3 + 4`.",
      },
      {
        title: "Défaire une racine",
        text: [
          "Pour résoudre `√x = 3`, on élève les deux membres au carré. Appuie sur la racine pour l'écrire `x^(1/2)`. Puis fais passer le ½ de l'autre côté du =. Là-bas, il devient un carré.",
        ],
        steps: [
          "Appuie sur la racine pour l'écrire sous forme de puissance.",
          "Fais passer le ½ de l'autre côté du =. Il devient un carré.",
          "Calcule.",
        ],
      },
    ],
  },

  explog: {
    title: "Exponentielle et logarithme",
    blurb:
      "ln(x) est la puissance de e qui donne x. Donc ln et e^ s'annulent l'un l'autre, et le logarithme d'un produit est une somme de logarithmes.",
    lesson: [
      {
        title: "Que veut dire ln ?",
        text: [
          "`e` est un nombre particulier, qui vaut environ 2,718. `ln(x)` est la puissance de e qui donne x. Donc `ln(e³) = 3`.",
          "Autrement dit, ln et e^ s'annulent l'un l'autre : `e^(ln x) = x`.",
        ],
        steps: ["Dépose le e sur le ln. Ils s'annulent."],
      },
      {
        title: "Le logarithme d'un produit",
        text: [
          "Quand on multiplie des puissances de e, on additionne leurs exposants. Donc le logarithme d'un produit est la somme des logarithmes : `ln(2x) = ln(2) + ln(x)`.",
        ],
        steps: ["Sors le 2 du ln. Il a droit à son propre ln."],
      },
      {
        title: "Le logarithme d'une puissance",
        text: ["`x³`, c'est `x·x·x`, donc `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
        steps: ["Fais glisser le 3 devant le ln."],
      },
      {
        title: "Résoudre avec les logarithmes",
        text: [
          "Pour faire descendre x d'un exposant, on prend le ln des deux membres. À partir de `e^x = 5`, fais passer le e de l'autre côté du =. Il devient ln : `x = ln(5)`.",
        ],
        steps: ["Fais passer le e de l'autre côté du =."],
      },
    ],
  },
};
