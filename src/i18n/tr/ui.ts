import type { Translation } from "../en";

/**
 * Türkçe. Sayılara ve değişken adlara gelen ekler okunuşa göre değiştiği için
 * (3'ü, 2'yi, 10'u…), değişken sayılar içeren cümleler ek almayacak biçimde kuruldu.
 */
export const tr: Translation = {
  htmlLang: "tr",
  pageTitle: "DragDropMath",
  logo: "DragDropMath",
  language: "Dil",

  // Top bar
  makeExercises: "Alıştırma hazırla",
  skin: "Tema",
  skins: { modern: "Modern", codex: "Codex", paper: "Kâğıt", blackboard: "Kara tahta" },
  settings: "Ayarlar",
  numbersInColour: "Renkli sayılar",
  debugMode: "Hata ayıklama modu",
  sandboxInput: "İfade ya da denklem",
  sandboxPlaceholder: "örn. 3(x - 2) = 2x + 1   veya   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Yükle",
  debugOn: "Hata ayıklama modu açık: kapatmak için dokun",

  // Home
  heroBefore: "Elle ",
  heroWord: "tutulur",
  heroAfter: " cebir.",
  heroText:
    "Bir denklemin istediğin parçasını sürükle. Parçalar yalnızca matematiğin izin verdiği şekilde hareket eder. Hedefe benzeyene kadar düzenlemeye devam et.",
  learningPath: "Öğrenme yolu",
  chapterNodeLabel: (n: number, title: string) => `Bölüm ${n}: ${title}`,
  chapterN: (n: number) => `Bölüm ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ve ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Ön bilgi: ${titles}.`,
  startLesson: "Konuya başla →",

  // Chapter page
  backToPath: "← Öğrenme yolu",
  level: { easy: "Kolay", medium: "Orta", hard: "Zor" },
  anotherOne: "Bir tane daha →",
  progressHere:
    "İlerlemen yalnızca bu tarayıcıda saklanır. Güvende tutmak ya da başka bir cihaza taşımak için onu bir dosyaya kaydet.",
  saveProgress: "İlerlemeni dosyaya aktar",
  loadProgress: "İlerlemeni dosyadan yükle",
  progressSaved: "Kaydedildi. İlerlemene yeniden kavuşmak için bu dosyayı burada ya da herhangi bir tarayıcıda yükle.",
  rightsReserved: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. Tüm hakları saklıdır.`,
  aboutLink: "Hakkında",
  about: {
    title: "DragDropMath hakkında",
    sections: [
      {
        heading: "Nedir?",
        text: [
          "DragDropMath, ellerinle yaptığın cebirdir. Bir ifadenin ya da denklemin istediğin parçasını sürüklersin ve o parça yalnızca matematiğin izin verdiği şekilde hareket eder. Yanlış bir hamle hiç gerçekleşmez; böylece neyin yapılabileceğini kuralları ezberleyerek değil, hissederek öğrenirsin.",
          "Terimleri düzenlemekten denklem sistemlerine uzanan bir öğrenme yolu var. Her bölümde bir konu anlatımı, üç düzeyde alıştırma ve cevabı çözmeden önce zihninde canlandırdığın “Zihinden” soruları bulunur. Öğretmenler kendi alıştırma setlerini yazıp bağlantı olarak paylaşabilir.",
        ],
      },
      {
        heading: "Kim yaptı?",
        text: [
          "DragDropMath'i Filippo Miatto hazırladı. Amacı, cebiri ezberlenecek bir kurallar listesi olmaktan çıkarıp görebileceğin ve dokunabileceğin bir şeye dönüştürmek.",
        ],
      },
      {
        heading: "Gizliliğin",
        text: [
          "Hesap yok, reklam yok, izleme yok. İlerlemen yalnızca kendi tarayıcında saklanır ve yaptığın hiçbir şey bir yere gönderilmez. Güvende tutmak ya da başka bir cihaza taşımak için Ayarlar'dan onu bir dosyaya kaydedebilirsin.",
          "Bir alıştırma seti tamamen kendi bağlantısının içinde durur: onunla ilgili hiçbir şey internette saklanmaz.",
        ],
      },
    ],
  },
  progressNotABackup: "Bu dosya bir DragDropMath ilerleme dosyası değil.",
  showMove: "Göster",
  lesson: "Konu anlatımı",
  practice: "Alıştırma yap",
  predict: "Zihinden",
  scores: "Zihinden puanları",
  scoreOf: (n: number) => `${n} puan`,
  scoreNow: (level: string, now: number, up: boolean, moved: boolean) =>
    `${level} düzeydeki puanın: ${now}${moved ? (up ? " (+1)" : " (−1)") : ""}.`,
  drills: {
    commute: {
      name: "Sırayı değiştir",
      how: "Bir terimi yanındakinin öbür yanına sürükle. + ve × işlemlerinde sıra fark etmez.",
      text: [
        "Toplarken sıranın önemi yoktur, sonuç değişmez: `2 + x` ile `x + 2` aynıdır.",
        "Bir toplamın her parçasına terim denir. Terim yer değiştirirken işaretini de yanında götürür: `5 − 3 + x` ifadesindeki eksi, 3'e aittir.",
      ],
    },
    combine: {
      name: "Sayıları topla",
      how: "Toplamak için bir sayıyı diğerinin üstüne bırak.",
      text: ["Aynı toplamdaki iki sayı toplanabilir. Harf ise henüz bilmediğimiz bir sayının yerini tutar, bu yüzden olduğu gibi kalır."],
    },
    "multiply-numbers": {
      name: "Sayıları çarp",
      how: "Bir sayıyı, çarpıldığı öbür sayının üstüne bırak.",
      text: ["Çarpmada da sıranın önemi yoktur: `2·x·5`, `2·5·x` ile aynıdır. Bu yüzden 2 ile 5 çarpılabilir ve `10x` elde edilir."],
    },
    "numbers-first": {
      name: "Sayı başa",
      how: "`x·3` gibi bir çarpıma dokun; alışılmış biçimde, `3x` olarak yazılsın.",
      text: ["Sayıyı başa yazar, çarpma noktasını da yazmayız: `x·3`, `3x` olarak yazılır. Bu o kadar basit ki bundan sonra kendiliğinden yapılacak."],
    },
    "multiply-out": {
      name: "Çarpımı hesapla",
      how: "`2·3` gibi sayılardan oluşan bir çarpımı hesaplamak için ona dokun.",
      text: ["Yalnızca sayılardan oluşan bir çarpım hesaplanabilir: `2·3`, 6 eder."],
    },
    collect: {
      name: "Benzer terimleri topla",
      how: "Bir terimi, harfi aynı olan benzer bir terimin üstüne bırak. Toplanırlar.",
      text: [
        "`3x`, `x + x + x` demektir. Yani `3x + 2x`, üç x ile iki x'in toplamıdır: `5x`.",
        "Yalnızca benzer terimler, yani harfleri tıpatıp aynı olan terimler toplanabilir. `3x + 2`, `5x` olamaz; x'li terimlerle y'li terimler de ayrı kalır.",
      ],
    },
    "collect-cancel": {
      name: "Zıt terimleri sadeleştir",
      how: "Bir terimi, zıt işaretli eşinin üstüne bırak. Birbirlerini götürürler.",
      text: ["Çıkarma da aynı şekilde işler: `5y − 2y`, `3y` eder. Bir şeyden kendisini çıkarırsan 0 kalır, bu yüzden `a + b − a` ifadesinden geriye yalnızca `b` kalır."],
    },
    distribute: {
      name: "Parantezi aç",
      how: "Öndeki sayıyı parantezin üstüne bırak: içerideki her terimle çarpılır. Sonra sayıları hesaplamak için · işaretine dokun.",
      text: [
        "`2(x + 3)`, 2 tane `(x + 3)` demektir: 2 tane x ile 2 tane 3, yani `2x + 2·3`. Dışarıdaki sayı içerideki her terimle çarpılır.",
        "Yüksekliği 2, genişliği `x + 3` olan bir dikdörtgen düşün. İki parçasının alanları `2·x` ve `2·3`; ikisi bir araya gelince dikdörtgenin tamamını oluşturur.",
      ],
    },
    "distribute-neg": {
      name: "Parantezin önünde eksi",
      how: "Eksiyi parantezin üstüne bırak. İçerideki bütün işaretler değişir.",
      text: ["`−(x − 4)`, parantezin −1 ile çarpılması demektir. −1 içerideki her terimle çarpılır, bu yüzden içerideki bütün işaretler değişir."],
    },
    "factor-out": {
      name: "Ortak çarpan parantezine al",
      how: "İki terimde de ortak bir çarpan var. Terimlerden birinde onu basılı tut, sonra en soldan dışarı, öne sürükle.",
      text: [
        "Bir toplamı çarpanlarına ayırmak, onu çarpım olarak yazmaktır. `3x + 3y` ifadesinde iki terim de 3 ile bir şeyin çarpımıdır. Bu yüzden 3 bir kez, parantezin önüne yazılır; parantezin içinde de her terimden geriye kalan durur: `3x + 3y = 3(x + y)`.",
        "Bu doğrudur, çünkü `3(x + y)` ifadesinde parantezi açarsan yeniden `3x + 3y` elde edersin: 3 içerideki her terimle tek tek çarpılır. Çarpanlara ayırmanın doğru olup olmadığını da böyle kontrol edersin.",
      ],
    },
    "split-exponent": {
      name: "Üssü ayır",
      how: "Üsten bir terimi dışarı çek. Kuvvet, tabanı aynı olan iki kuvvete ayrılır.",
      text: ["`2^(x + 3)`, x + 3 tane 2'nin çarpımıdır: önce x tane, sonra 3 tane daha. Yani `2^x·2^3` olur: üsteki bir toplam, kuvvetlerin çarpımına ayrılır."],
    },
    "merge-powers": {
      name: "Aynı taban: üsleri topla",
      how: "Bir kuvveti öbürünün üstüne bırak ya da aralarındaki · işaretine dokun. Üsler toplanır: hesaplamak için + işaretine dokun.",
      text: [
        "`x³`, `x·x·x` demektir. Üstteki küçük sayı, yani üs, kaç tane x olduğunu sayar.",
        "Yani `x²·x³`, iki x ile üç x'in çarpımıdır: toplam beş x. Tabanları aynı olan kuvvetler çarpılırken üsler toplanır.",
      ],
    },
    "power-to-product": {
      name: "Kareyi çarpım olarak yaz",
      how: "Parantezi iki kez yazmak için üsteki ²'ye dokun. Sonra parantezleri çarp ve benzer terimleri topla.",
      text: ["`(x + 1)²`, `(x + 1)(x + 1)` demektir; bu yüzden parantezler aynı yolla çarpılır."],
    },
    "move-term": {
      name: "Terimi karşıya geçir",
      how: "Sayıyı = işaretinin karşı tarafına sürükle. Geçerken işareti değişir. Sonra hesaplamak için − işaretine dokun.",
      text: [
        "Denklem, iki tarafın birbirine eşit olduğunu söyler. İki tarafa da aynı işlemi yaparsan eşitlik bozulmaz.",
        "Bir terimi `=` işaretinin karşı tarafına geçirmek tam olarak bunu yapar. `x + 3 = 10` denkleminde iki taraftan da 3 çıkar: `x = 10 − 3`. `+3` karşı tarafa bu yüzden `−3` olarak geçer.",
      ],
    },
    "move-factor": {
      name: "İki tarafı böl",
      how: "Harfin önündeki sayıyı = işaretinin karşı tarafına sürükle. Öbür tarafı böler. Sonra hesaplamak için kesir çizgisine dokun.",
      text: ["Bir tarafın tamamını çarpan sayı, karşı tarafa geçince öbür tarafı böler. `2x = 8` denkleminde iki tarafı da 2'ye böl: `x = 8/2`."],
    },
    "move-denominator": {
      name: "İki tarafı çarp",
      how: "Kesrin paydasını = işaretinin karşı tarafına sürükle. Öbür tarafla çarpılır. Sonra hesaplamak için · işaretine dokun.",
      text: ["Kesrin paydası karşı tarafa geçince öbür tarafla çarpılır. `x/3 = 4` denkleminde iki tarafı da 3 ile çarp: `x = 4·3`."],
    },
    "move-sign": {
      name: "Eksiyi karşıya geçir",
      how: "Yalnızca eksiyi = işaretinin karşı tarafına sürükle. Öbür tarafın işareti değişir.",
      text: ["Bir tarafın tamamının önündeki eksi de karşıya geçebilir: iki taraf da −1 ile çarpılır, böylece `−x = 6` denklemi `x = −6` olur."],
    },
    "swap-sides": {
      name: "Tarafların yerini değiştir",
      how: "Taraflardan birini = işaretinin karşısına, en uca kadar sürükle. İki taraf yer değiştirir.",
      text: ["`7 = x` ile `x = 7` aynı şeyi söyler, bu yüzden iki taraf yer değiştirebilir."],
    },
    "evaluate-fraction": {
      name: "Kesri hesapla",
      how: "Hesaplamak için kesir çizgisine dokun.",
      text: ["Sonucu tam sayı çıkan bir kesir hesaplanabilir: `12/3`, 4 eder."],
    },
    "divide-numbers": {
      name: "Kesri sadeleştir",
      how: "Paydadaki sayıyı basılı tut, sonra paydaki sayının üstüne bırak ya da kesir çizgisine dokun. İkisi de ortak çarpanlarına bölünür.",
      text: ["Bir kesrin payı ve paydası aynı sayıya bölünerek sadeleştirilebilir: `6/8 = 3/4`. Kesrin değeri değişmez."],
    },
    "letter-in": {
      name: "Harfle parantezi çarp",
      how: "Öndeki harfi parantezin üstüne bırak. Sonra iki x'i birbirinin üstüne bırak: `x·x`, `x²` demektir.",
      text: ["Harf de tıpkı bir sayı gibi içerideki her terimle çarpılır: `x(x + 3) = x·x + x·3`. `x·x` de bir kuvvettir: Üslü ifadeler bölümündeki gibi `x²`."],
    },
    "factor-then-cancel": {
      name: "Önce dışarı al, sonra sadeleştir",
      how: "Paydaki bir terimin sayısını basılı tut ve en soldan dışarı, öne sürükle. Sonra paydadaki sayıyı onun üstüne bırak: sadeleşirler.",
      text: [
        "Yalnızca payın tamamının çarpanı olan bir sayı sadeleştirilebilir. `(2x + 6)/2` ifadesinde 2, terimlerin her birinin çarpanıdır; bu yüzden önce onu dışarı al: `(2(x + 3))/2`. Artık 2 payın tamamının çarpanıdır ve paydadaki 2 ile sadeleşir.",
      ],
    },
    "cancel-factor": {
      name: "Ortak çarpanı sadeleştir",
      how: "Paydadaki sayıyı, paydaki aynı sayının üstüne bırak. İkisi de ortadan kalkar.",
      text: ["Pay ile paydadaki aynı sayı birbirini götürür: `(3x)/3`, `x` olur."],
    },
    "power-of-power": {
      name: "Üssün üssü",
      how: "Dıştaki üssü içteki üssün üstüne bırak. Üsler çarpılır: hesaplamak için · işaretine dokun.",
      text: ["`(x²)³`, `x²·x²·x²` demektir. Bu da 2 + 2 + 2 = 6 tane x eder; yani üsler çarpılır."],
    },
    "divide-powers": {
      name: "Aynı taban: üsleri çıkar",
      how: "Paydadaki kuvveti paydaki kuvvetin üstüne bırak. Üsler çıkarılır: hesaplamak için − işaretine dokun.",
      text: ["`x⁵/x²` ifadesinde üstte beş, altta iki x var. Her birinden ikişer tane sadeleşir ve üstte üç x kalır: bölmede üsler çıkarılır."],
    },
    "flip-across-bar": {
      name: "Kesir çizgisinin öbür tarafına",
      how: "Kuvveti yukarı, kesir çizgisinin öbür tarafına sürükle. Üssünün işareti değişir.",
      text: ["Paydada daha çok x varsa üs sıfırın altına iner: `x⁻²`, `1/x²` demektir. Bir kuvvet kesir çizgisinin öbür tarafına geçince üssünün işareti değişir."],
    },
    "power-one": {
      name: "Birinci kuvvet",
      how: "1 üssünü tabanının üstüne bırak.",
      text: ["`x¹`, bir tane x demektir: yalnızca `x`. Bu o kadar basit ki bundan sonra kendiliğinden yapılacak."],
    },
    "zero-power": {
      name: "Sıfırıncı kuvvet",
      how: "0 üssünü basılı tut, sonra tabanının üstüne bırak. Ardından toplamak için + işaretine dokun.",
      text: ["`x³/x³` 1'e eşittir, ama aynı zamanda `x^(3 − 3) = x⁰` demektir. Demek ki her şeyin sıfırıncı kuvveti 1'dir."],
    },
    "tap-power": {
      name: "Kuvveti hesapla",
      how: "Kuvveti hesaplamak için üsse dokun: `2³`, 8 olur.",
      text: ["Bir sayının kuvveti hesaplanabilir: `2³`, `2·2·2 = 8` demektir."],
    },
    "power-of-product": {
      name: "Üssü parantezin içine al",
      how: "Üssü parantezin içine sürükle: içerideki her çarpan bu üssü ayrı ayrı alır. Sonra hesaplamak için sayının üssüne dokun.",
      text: ["`(2x)³`, `2x·2x·2x` demektir; bu da `2³·x³` eder. İçerideki her çarpan üssü alır."],
    },
    "split-number": {
      name: "Sayıyı çarpanlarına ayır",
      how: "Sayıyı iki çarpana ayırmak için ona dokun. Sonra iki terimin ortak çarpanını en soldan dışarı, öne sürükle.",
      text: ["Ortak çarpanı bulmak için sayıları çarpanlarına ayır. `2x + 6` ifadesinde 6, `2·3` demektir; artık iki terimde de 2 var."],
    },
    "split-term": {
      name: "Ortadaki terimi ayır",
      how: "Ortadaki terime dokun. İkiye ayrılır ve terimleri ikişerli gruplayarak çarpanlarına ayırmaya hazır olur.",
      text: [
        "`x² + 5x + 6` ifadesini çarpanlarına ayırmak için toplamı 5, çarpımı 6 olan iki sayı ara: 2 ve 3. `5x` yerine `2x + 3x` yaz.",
        "Artık dört terim var ve ikişer ikişer çarpanlarına ayrılırlar: `x(x + 2) + 3(x + 2)`, sonra da `(x + 2)(x + 3)`.",
      ],
    },
    "difference-of-squares": {
      name: "İki kare farkı",
      how: "İki karenin arasındaki eksiye dokun.",
      text: ["Bir kareden bir kare çıkarılınca her zaman aynı şekilde çarpanlarına ayrılır: `a² − b² = (a − b)(a + b)`. Kontrol etmek için parantezleri çarp: ortadaki terimler birbirini götürür."],
    },
    "factor-shared": {
      name: "Ortak çarpan bul",
      how: "Bir terimdeki `x` harfini basılı tut, sonra içinde `x` olan başka bir terimin üstüne bırak: iki terim onu ortak çarpan olarak paylaşır. Son iki terimle de aynısını yap, sonra ikisinde de bulunan parantezi dışarı al.",
      text: ["Dört terim varsa ikişerli çalış. Önce ilk iki terimin ortak çarpanını dışarı al, sonra son iki terimin. İki parantez aynıysa o parantezi de dışarı al."],
    },
    "move-letter-factor": {
      name: "Harfe böl",
      how: "Çarpılan harflerden birini = işaretinin karşı tarafına sürükle. Öbür tarafı böler.",
      text: [
        "Formül, içinde birden çok harf olan bir denklemdir. Bir harfi yalnız bırakmaya, formülü o harfe göre düzenlemek denir. Bu, x için denklem çözmek gibidir: öbür harfleri sayıymış gibi düşün.",
        "Bir tarafın tamamını çarpan harf karşı tarafa geçip öbür tarafı bölebilir: `F = ma` formülünden `F/m = a` elde edilir. (Yalnızca 0 olmayan bir harfe bölebiliriz. Bu formüllerde hiçbiri 0 değildir.)",
        "İstediğin harf `ax + bx = c` gibi iki yerde geçiyorsa önce onu ortak çarpan olarak dışarı al: `x(a + b) = c`. Sonra parantezin tamamı karşıya geçebilir.",
      ],
    },
    "move-letter-denominator": {
      name: "Harfle çarp",
      how: "Paydadaki harfi = işaretinin karşı tarafına sürükle. Öbür tarafla çarpılır.",
      text: ["Bir tarafın tamamının paydasındaki harf karşı tarafa geçip öbür tarafla çarpılabilir: `P = F/A` formülünden `PA = F` elde edilir."],
    },
    "ineq-move-term": {
      name: "Terimi karşıya geçir",
      how: "Sayıyı eşitsizlik işaretinin karşı tarafına sürükle. Sayının işareti değişir, eşitsizliğin yönü ise aynı kalır. Sonra hesaplamak için − işaretine dokun.",
      text: [
        "`x < 7`, x'in 7'den küçük olduğunu söyler. İşaretin açık tarafı büyük sayıya bakar.",
        "İki tarafa aynı sayıyı eklemek ya da iki taraftan aynı sayıyı çıkarmak eşitsizliğin yönünü değiştirmez. Bu yüzden bir terim, tıpkı denklemdeki gibi karşıya geçer.",
      ],
    },
    "ineq-swap": {
      name: "Tarafların yerini değiştir",
      how: "Taraflardan birini öbürünün ötesine sürükle. Eşitsizlik işaretinin yönü de onlarla birlikte döner.",
      text: ["`3 > x` ile `x < 3` aynı şeyi söyler: x, 3'ten küçüktür. Bu yüzden taraflar yer değiştirebilir, yeter ki işaretin yönü de onlarla birlikte dönsün."],
    },
    "ineq-sign": {
      name: "Eksiyi karşıya geçir",
      how: "Yalnızca eksiyi karşı tarafa sürükle. Eşitsizlik işaretinin yönü değişir.",
      text: ["−1 ile çarpmak sıralamayı tersine çevirir: `2 < 3`, ama `−2 > −3`. Bu yüzden eksi karşı tarafa geçince eşitsizliğin yönü değişir."],
    },
    "add-fractions": {
      name: "Kesirleri topla",
      how: "Paydalar aynı: kesirlerden birini öbürünün üstüne bırak ya da aralarındaki + işaretine dokun. Sonra payları toplamak için üstteki + işaretine dokun.",
      text: ["`3/4`, dörtte üç demektir: bütünü dört eş parçaya bölüp üçünü almak. Paydalar aynıysa yalnızca payları topla: beşte bir ile beşte ikinin toplamı beşte üçtür, yani `1/5 + 2/5 = 3/5`."],
    },
    "expand-fraction": {
      name: "Paydaları eşitle",
      how: "Bir kesrin paydasını basılı tut ve öbür kesrin üstüne bırak, sonra aynısını öbür yönde yap: artık iki kesrin paydası aynı. Payları ve paydaları hesaplamak için her · işaretine dokun, sonra kesirleri topla.",
      text: [
        "Bir kesrin payını ve paydasını aynı sayıyla çarpmak kesrin değerini değiştirmez: `1/2 = 2/4 = 3/6`.",
        "Paydalar böyle eşitlenir. `1/2 + 1/3` toplamını bulmak için `1/2` kesrini 3 ile, `1/3` kesrini 2 ile genişlet: artık ikisinin de paydası 6.",
      ],
    },
    "multiply-fractions": {
      name: "Kesirleri çarp",
      how: "Kesirlerin arasındaki · işaretine dokun ya da birini öbürünün üstüne bırak: paylar çarpılır, paydalar da.",
      text: ["Çarpma daha kolaydır: payları çarp, paydaları da çarp. Üçte birin yarısı `(1·1)/(2·3) = 1/6` eder."],
    },
    "divide-by-fraction": {
      name: "Kesre böl",
      how: "Paydadaki kesri yukarı, payın üstüne sürükle. Ters çevrilir ve çarpan olur. Sonra hesaplamak için · işaretine dokun.",
      text: ["Bir kesre bölmek, o kesrin tersiyle çarpmaktır: `4/(3/5)`, `4·(5/3)` demektir."],
    },
    "split-fraction": {
      name: "Kesri ayır",
      how: "Paydaki bir terimi dışarı çek. Paydanın bir kopyasını da yanında götürür.",
      text: ["Payı bir toplam olan kesir, her terim için ayrı bir kesre ayrılabilir; hepsinin paydası aynı kalır: `(x + 5)/6 = x/6 + 5/6`."],
    },
    "times-one": {
      name: "1 ile çarpma",
      how: "1'i basılı tut, sonra çarptığı şeyin üstüne bırak.",
      text: ["1 ile çarpmak hiçbir şeyi değiştirmez: `1·x`, yalnızca `x` demektir. Bu o kadar basit ki bundan sonra kendiliğinden yapılacak."],
    },
    substitute: {
      name: "Yerine koy",
      how: "`y` harfini `y = …` denkleminden alıp öbür denklemdeki `y` harfinin üstüne sürükle: o harf, `y` neye eşitse ona dönüşür. Sonra x'i bul; y'yi bulmak için de x'i birinci denklemde yerine koy.",
      text: [
        "`y = 2x` ve `x + y = 9`, aynı x ve y hakkında iki denklemdir ve ikisi de aynı anda doğrudur. İki bilinmeyenli tek bir denklemin pek çok çözümü vardır; iki denklemin birlikte ise genellikle tek bir çözümü vardır.",
        "`y = 2x`, y ile 2x'in eşit olduğunu söyler; bu yüzden öbür denklemde y yerine 2x yazılabilir. Geriye tek harfli tek bir denklem kalır, onu nasıl çözeceğini de biliyorsun.",
        "Hiçbir denklemde yalnız duran bir harf yoksa önce bir harfi yalnız bırak: `x − y = 1` denkleminde −y'yi karşıya geçirerek `x = 1 + y` elde et.",
      ],
    },
    "evaluate-root": {
      name: "Kökü hesapla",
      how: "Hesaplamak için köke dokun.",
      text: ["`√9`, kendisiyle çarpılınca 9 eden sayıdır: 3, çünkü `3·3 = 9`. Aynı şekilde `∛8 = 2`, çünkü `2·2·2 = 8`."],
    },
    "split-square": {
      name: "Kökün içini ayır",
      how: "Kökün içindeki sayıya dokun: içinden bir tam kare ayrılır (küpkökte bir tam küp). Sonra onu kökün dışına çek ve hesaplamak için köküne dokun.",
      text: ["Tam çıkmayan bir kök de sadeleştirilebilir. İçindeki sayıyı, bir tam kare ayrılacak şekilde çarpanlarına ayır: `√12 = √(4·3)`."],
    },
    "join-powers": {
      name: "Kökleri birleştir",
      how: "Bir kökü öbürünün üstüne bırak. Tek bir kök işaretinin altında birleşirler.",
      text: [
        "`√2·√3` sayısının karesi `2·3` eder; yani `√2·√3`, karesi 6 olan sayıdır: `√(2·3) = √6`. Aynı türden iki kök tek bir kökte birleşir.",
        "Ortak olan her üs için de aynısı geçerlidir: `x³y³`, xxx·yyy demektir; bu da xy·xy·xy, yani `(xy)³` eder.",
      ],
    },
    "pull-out-of-power": {
      name: "Kökü ayır",
      how: "Sayıyı kökün içinden dışarı çek: ona ayrı bir kök gelir. Sonra hesaplamak için o köke dokun.",
      text: ["Bir çarpımın kökü, köklerin çarpımıdır: `√(4x) = √4·√x = 2√x`."],
    },
    "root-notation": {
      name: "Kökü kuvvet olarak yaz",
      how: "Kökü kuvvet olarak yazmak için ona dokun: √, ½ kuvveti; ∛ ise ⅓ kuvveti demektir.",
      text: [
        "Her kök bir kuvvettir: `√x = x^(1/2)`, `∛x = x^(1/3)`; x'in n'inci dereceden kökü de `x^(1/n)` olur. Bu yüzden kuvvetlerin bütün kuralları kökler için de geçerlidir: `√x·√x = x^(1/2 + 1/2) = x`.",
      ],
    },
    "root-of-power": {
      name: "Kuvvetin kökü",
      how: "Kökü kuvvet olarak yazmak için ona dokun. Sonra dıştaki üssü içteki üssün üstüne bırak ve çarpımı hesapla.",
      text: ["Kök bir kuvvet olduğuna göre, bir kuvvetin kökü de kuvvetin kuvvetidir: `∛(x⁶) = (x⁶)^(1/3) = x^(6·1/3) = x²`. Üsler, Üslü ifadeler bölümündeki gibi çarpılır."],
    },
    "fraction-power": {
      name: "Kökler ve kuvvetler bir arada",
      how: "Kökü kuvvetin üstüne bırak: üsler toplanır. Sonra üsteki kesirleri topla.",
      text: ["`√x`, `x^(1/2)` demektir; bu yüzden `√x·x² = x^(1/2 + 2) = x^(5/2)`. Kesirli bir üs de öbür üsler gibi davranır: kuvvetler çarpılırken üsler toplanır."],
    },
    "root-across": {
      name: "Kökün üssünü karşıya geçir",
      how: "½ üssünü (ya da ⅓, ¼ üssünü) = işaretinin karşı tarafına sürükle. Karşı tarafta kare (ya da küp, dördüncü kuvvet) olur. Sonra hesaplamak için üsse dokun.",
      text: ["`√x = 3` denklemini çözmek için iki tarafın karesini al. Kuvvet olarak yazınca `x^(1/2) = 3` olur; ½ karşı tarafa geçer ve kareye dönüşür: `x = 3²`."],
    },
    "exp-of-log": {
      name: "Kuvvet, logaritmayı geri alır",
      how: "Tabanı, üssündeki logaritmanın üstüne bırak. Birbirlerini götürürler.",
      text: [
        "`e` özel bir sayıdır, yaklaşık 2,718. `ln(x)`, e'nin x eden kuvvetidir; bu yüzden ln ile e^ birbirini geri alır: `e^(ln x) = x`. Başka tabanlardaki logaritmalar da aynı şekilde işler: `2^(log₂ x) = x`.",
      ],
    },
    "evaluate-log": {
      name: "Bilinen logaritmalar",
      how: "Hesaplamak için logaritmaya dokun: `ln(e) = 1`, 1'in logaritması da 0'dır.",
      text: ["`ln(e) = 1`, çünkü `e¹ = e`. 1'in logaritması da 0'dır, çünkü her şeyin sıfırıncı kuvveti 1'dir."],
    },
    "power-of-base": {
      name: "Tabanın kuvveti olarak yaz",
      how: "Logaritmanın içindeki sayıyı 2'nin kuvveti olarak yazmak için ona dokun. Sonra üssü logaritmanın önüne sürükle ve logaritmaya dokun.",
      text: ["`log₂(8)` değerini bulmak için 8'i 2'nin kuvveti olarak yaz: `8 = 2³`, yani `log₂(8) = 3`."],
    },
    "log-of-product": {
      name: "Logaritmayı ayır",
      how: "Sayıyı logaritmanın içinden dışarı çek. Ona ayrı bir logaritma gelir.",
      text: ["Kuvvetler çarpılırken üsler toplanır. Bu yüzden bir çarpımın logaritması, logaritmaların toplamıdır: `ln(2x) = ln(2) + ln(x)`."],
    },
    "log-of-root": {
      name: "Kökün logaritması",
      how: "Kökü kuvvet olarak yazmak için ona dokun. Sonra üssü logaritmanın önüne sürükle.",
      text: ["Kök bir kuvvettir, `√x = x^(1/2)`; bu yüzden üssü de öbür üsler gibi logaritmanın önüne çıkar: `ln(√x) = ½ln(x)`."],
    },
    "log-of-power": {
      name: "Üssü logaritmanın önüne al",
      how: "Üssü logaritmanın önüne sürükle.",
      text: ["`x³`, `x·x·x` demektir; bu yüzden `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
    },
    "power-into-log": {
      name: "Sayıyı logaritmanın içine al",
      how: "Öndeki sayıyı logaritmanın üstüne bırak. İçeride üs olur.",
      text: ["Tersi de doğrudur: `3ln(x)`, `ln(x³)` demektir."],
    },
    "combine-logs": {
      name: "Logaritmaları birleştir",
      how: "Bir logaritmayı öbürünün üstüne bırak ya da aralarındaki + (veya −) işaretine dokun. Logaritmalar toplanınca içleri çarpılır, çıkarılınca bölünür.",
      text: ["Tersi de geçerlidir: `ln(a) + ln(b) = ln(ab)` ve `ln(a) − ln(b) = ln(a/b)`."],
    },
    "move-exponent-term": {
      name: "Üsler arasında",
      how: "İki taraf da aynı tabanın kuvveti. Bir üsteki terimi öbür üsse sürükle: işareti değişir.",
      text: [
        "İki taraf da aynı tabanın kuvvetiyse üsleri eşittir; bu yüzden üsler de bir denklemin iki tarafı gibi dengededir.",
        "`2^(x − 3) = 2^4` denklemi `2^x = 2^(4 + 3)` olur: iki taraf da `2^3` ile çarpıldı.",
      ],
    },
    "exp-across": {
      name: "Tabanı karşıya geçir",
      how: "Tabanı = işaretinin karşı tarafına sürükle. Karşı tarafta logaritma olur.",
      text: ["x'i üsten kurtarmak için iki tarafın logaritmasını al. `e^x = 5` denkleminde e karşı tarafa geçer ve ln olur: `x = ln(5)`."],
    },
    "log-across": {
      name: "Logaritmayı karşıya geçir",
      how: "Logaritmayı = işaretinin karşı tarafına sürükle. Karşı tarafta kuvvet olur. Bu bir sayının kuvvetiyse, hesaplamak için üssüne dokun.",
      text: ["Logaritmayı kuvvet geri alır. `ln(x) = 2` denkleminde ln karşı tarafa geçer ve e olur: `x = e²`."],
    },
    "bracket-times-bracket": {
      name: "İki parantezi çarp",
      how: "Bir parantezi öbürünün üstüne bırak: içerideki iki terimle de çarpılır. Sonra her parantezi aynı şekilde aç ve benzer terimleri topla.",
      text: [
        "`(x + 1)(x + 2)` ifadesinde birinci parantez tek bir çarpandır: ikinci parantezin tamamıyla, yani hem x ile hem 2 ile çarpılır. Sonra her `(x + 1)` sırayla açılır.",
        "İki terim çarpı iki terim, dört terim eder. Ardından benzer terimleri topla: `(x + 1)(x + 2) = x² + 3x + 2`.",
      ],
    },
    "bracket-out": {
      name: "Parantezi dışarı al",
      how: "İki terimde de aynı parantez var. Terimlerden birinde onu basılı tut, sonra en soldan dışarı, öne sürükle.",
      text: ["Bir parantezin tamamı da ortak çarpan olabilir. `x(x + 2) + 3(x + 2)` ifadesinde iki terimde de `(x + 2)` var; bu yüzden o da her çarpan gibi öne alınır: `(x + 2)(x + 3)`."],
    },
    "ineq-move-factor": {
      name: "İki tarafı böl",
      how: "Harfin önündeki sayıyı eşitsizlik işaretinin karşı tarafına sürükle. Öbür tarafı böler, eşitsizliğin yönü ise aynı kalır. Sonra kesir çizgisine dokun.",
      text: ["İki tarafı pozitif bir sayıyla çarpmak ya da bölmek de eşitsizliğin yönünü değiştirmez: `2x < 8` ise `x < 8/2` olur."],
    },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Alıştırma ${label}${solved ? " — çözüldü" : ""}`,

  // Guided example
  done: "Tamam.",
  startOver: "Baştan başla",

  // Exercise
  lessonLink: (chapter: string) => `${chapter}: konu anlatımı`,
  nextExercise: "Sonraki alıştırma →",
  exercisesNav: "Alıştırmalar",
  previousTitle: (label: string) => `Önceki: alıştırma ${label}`,
  previousLabel: (label: string) => `Önceki alıştırma (${label})`,
  nextTitle: (label: string) => `Sonraki: alıştırma ${label}`,
  nextLabel: (label: string) => `Sonraki alıştırma (${label})`,
  exerciseN: (label: string) => `Alıştırma ${label}`,
  predictPrompt: "Önce zihninde canlandır: bu neye dönüşür?",
  reveal: "Cevabı göster",
  predictedBeforeRight: "Bunu ilk seferde doğru görmüştün.",
  predictedBeforeWrong: (picked: boolean) => `İlk cevabın ${picked ? "kırmızı olandı" : "yanlıştı"}. Doğrusu yeşil olan.`,
  rightFirstTime: "İlk seferde doğru. Şimdi çöz.",
  revealedNote: "Doğrusu yeşil olan. Şimdi çöz.",
  notQuite: "Olmadı. Doğrusu yeşil olan. Nerede yanıldığını görmek için çöz.",
  solvedBefore: "✓ Bunu daha önce çözmüştün. İstersen yeniden çözebilirsin.",
  makeItLookLike: "Şuna dönüştür",
  solveFor: (letters: string[]) => `${letters.map((l) => `\`${l}\``).join(" ve ")} için çöz.`,
  pickFirst: "Yukarıdan bir cevap seç, sonra burada çöz.",
  hint: "İpucu",
  undo: "Geri al",
  solvedBang: "Çözdün!",
  moveCrashed: "Bu hamlede bir şeyler ters gitti.",
  moveCrashedDetails: "Ayrıntılar tarayıcı konsolunda.",
  tryAgain: "Yeniden dene",

  // Making a set
  ownTitle: "Kendi alıştırmaların",
  ownIntro:
    "Örneğin öğrencilerin için bir alıştırma seti yaz ve bağlantı olarak paylaş. Öğrenciler her alıştırmada önce sonucu zihinlerinde canlandırır, sonra elle çözer. İnternette hiçbir şey saklanmaz: setin tamamı bağlantının içindedir.",
  upload: ".yaml dosyası yükle",
  startFromExample: "Örnekten başla",
  yamlLabel: "YAML biçiminde alıştırma seti",
  check: "Kontrol et",
  checking: "Bu hamlelerle çözülebiliyor mu diye bakılıyor…",
  unsolvable: "Bu hamlelerle 10 adımda çözülemedi. Daha sonraki bir bölümün hamleleri gerekebilir (`moves:`).",
  solvableIn: (n: number) => `${n} hamlede çözülebilir.`,
  linkLabel: "Setin bağlantısı",
  copied: "Kopyalandı",
  copy: "Kopyala",
  open: "Aç",
  makeLink: "Bağlantıyı oluştur",
  fixMarked: "✗ ile işaretli alıştırmaları düzelt, sonra yeniden kontrol et.",
  howToWrite: "Set nasıl yazılır?",
  formatExample: `title: Setin adı
moves: balance       # isteğe bağlı: bir bölümün numarası, id'si ya da başlığı;
                     # o bölümün ve önceki bütün bölümlerin hamleleri. Yazmazsan: bütün hamleler.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # isteğe bağlı: seçenek olarak iki yanlış cevap
    hint: Kısa bir ipucu.     # isteğe bağlı
    moves: collect            # isteğe bağlı: yalnızca bu alıştırmanın hamleleri`,
  writeMathsAs: "Matematiği klavyede yazar gibi yaz:",
  or: "ya da",
  twoEquations: ["Aynı anda iki denklem tek satıra yazılır; aralarına", "konur."],
  exampleSet: `title: 3. hafta ödevi
# "Denklem çözme" bölümüne kadarki hamleler (bölümün numarası, id'si ya da başlığı). Yazmazsan bütün hamleler.
moves: balance
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    # Seçenek olarak iki yanlış cevap (isteğe bağlı; yazmazsan kendiliğinden üretilir).
    wrong: [x = 7, x = 8]
  - start: x/3 - 2 = 1
    goal: x = 9
    hint: Önce 2'yi, sonra 3'ü karşı tarafa geçir.
  - start: 5 - (x - 1) = 2
    goal: x = 4
`,

  // A set, opened from its link
  brokenLink: "Bu bağlantı çalışmıyor",
  brokenLinkText: "Kopyalanırken yarım kalmış olabilir. Bağlantıyı yeniden iste ya da öğrenme yoluna git.",
  learningPathButton: "Öğrenme yolu",
  setSummary: (done: number, total: number, stars: number): [string, string] => [
    `${done}/${total} çözüldü · `,
    ` ${stars} ilk seferde doğru görüldü. Her alıştırmada önce sonucu zihninde canlandır, sonra elle çöz.`,
  ],
  makeOwnSet: "Kendi setini hazırla",
  ofCount: (n: number, count: number) => `${n}/${count}`,
  backToSet: (title: string) => `Geri dön: ${title}`,

  // Checking a set (shown to whoever writes one)
  set: {
    defaultTitle: "Alıştırmalarım",
    badYaml: (msg: string) => `Bu geçerli bir YAML değil: ${msg}`,
    expectedTop: "En üstte `title:` ve `exercises:` olmalı.",
    noChapter: (name: string) => `\`moves:\` için "${name}" adında bir bölüm yok (bölümün numarasını, id'sini ya da başlığını yaz).`,
    expectedList: "`exercises:` altında bir liste olmalı.",
    emptyList: "`exercises:` altındaki liste boş.",
    needsStart: "Bir `start:` gerekiyor.",
    needsGoal: "Bir `goal:` gerekiyor.",
    noChapterShort: (name: string) => `\`moves:\` için "${name}" adında bir bölüm yok.`,
    cantReadStart: (err: string) => `Başlangıç okunamadı: ${err}`,
    cantReadGoal: (err: string) => `Hedef okunamadı: ${err}`,
    doesntFollow: "Hedef, başlangıçtan elde edilemiyor (yazım hatası olabilir).",
    twoWrong: "`wrong:` altında iki yanlış cevap olmalı.",
    cantReadWrong: (w: string, err: string) => `"${w}" yanlış cevabı okunamadı: ${err}`,
    wrongShape: (w: string, why: string) => `"${w}" yanlış cevabı hedefe benzemiyor: ${why}.`,
    wrongIsRight: (w: string) => `"${w}" yanlış cevabı aslında doğru.`,
    noDecoys:
      "İnandırıcı yanlış cevaplar üretilemedi: `wrong:` ekle; eklemezsen alıştırma, önce cevabı zihinde canlandırma adımı olmadan doğrudan çözülür.",
    decoysMade: (list: string) => `Seçenek olarak üretilen yanlış cevaplar: ${list}.`,
    shapeCount: "denklem sayısı farklı",
    shapeRelation: "denklem beklenen yerde bir ifade var ya da tam tersi",
    shapeIsolated: (letter: string) => `${letter} değişkeninin neye eşit olduğunu söylemiyor`,
  },
};
