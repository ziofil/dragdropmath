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
  makingExercise: "Alıştırma hazırlanıyor…",
  anotherOne: "Bir tane daha →",
  progressHere:
    "İlerlemen yalnızca bu tarayıcıda saklanır. Güvende tutmak ya da başka bir cihaza taşımak için onu bir dosyaya kaydet.",
  saveProgress: "İlerlemeni dosyaya aktar",
  loadProgress: "İlerlemeni dosyadan yükle",
  progressSaved: "Kaydedildi. İlerlemene yeniden kavuşmak için bu dosyayı burada ya da herhangi bir tarayıcıda yükle.",
  copyright: (year: number) => `© ${year > 2026 ? `2026–${year}` : "2026"} Filippo Miatto. MIT Lisansı ile açık kaynak.`,
  aboutLink: "Hakkında",
  about: {
    title: "DragDropMath hakkında",
    sections: [
      {
        heading: "Nedir?",
        text: [
          "DragDropMath, ellerinle yaptığın cebirdir. Bir ifadenin ya da denklemin istediğin parçasını sürüklersin ve o parça yalnızca matematiğin izin verdiği şekilde hareket eder. Yanlış bir hamle hiç gerçekleşmez; böylece neyin yapılabileceğini kuralları ezberleyerek değil, hissederek öğrenirsin.",
          "Terimleri düzenlemekten ikinci dereceden denklemlere uzanan bir öğrenme yolu var. Her bölümde bir konu anlatımı, üç düzeyde alıştırma ve cevabı çözmeden önce zihninde canlandırdığın “Zihinden” soruları bulunur. Öğretmenler kendi alıştırma setlerini yazıp bağlantı olarak paylaşabilir.",
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
  progressReplace: (saved: string) => `Bu işlem, bu tarayıcıdaki ilerlemenin yerine dosyadakini koyar${saved ? ` (${saved} tarihinde kaydedilmiş)` : ""}. Yüklensin mi?`,
  progressLoadIt: "Yükle",
  cancel: "Vazgeç",
  progressNoRoom: "Tarayıcın onu saklayamadı, bu yüzden hiçbir şey değişmedi.",
  progressBlocked: "Bu tarayıcı bu site için hiçbir şey saklamıyor (gizli pencere ya da depolama kapalı), bu yüzden kaydedilecek bir ilerleme yok.",
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
      how: "Sağdaki sayıyı, çarpıldığı öbür sayının üstüne bırak.",
      text: ["Çarpmada da sıranın önemi yoktur: `2·x·5`, `2·5·x` ile aynıdır. Bu yüzden 2 ile 5 çarpılabilir ve `10x` elde edilir."],
    },
    collect: {
      name: "Benzer terimleri topla",
      how: "Bir terimi, harfleri ve üsleri aynı olan benzer bir terimin üstüne bırak. Toplanırlar.",
      text: [
        "`3x`, `x + x + x` demektir. Yani `3x + 2x`, üç x ile iki x'in toplamıdır: `5x`.",
        "Yalnızca benzer terimler, yani harfleri de bu harflerin üsleri de tıpatıp aynı olan terimler toplanabilir. `3x + 2`, `5x` olamaz; x'li terimlerle y'li terimler ayrı kalır, `x²` ile `3x` de öyle.",
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
      how: "Parantezi iki kez yazmak için üsteki ²'ye dokun. Sonra parantezleri önceki örnekteki gibi çarp (bir çarpanı tek başına taşımak için basılı tut: kısa dokunuş bütün terimi alır) ve benzer terimleri topla.",
      text: ["`(x + 1)²`, `(x + 1)(x + 1)` demektir; bu yüzden parantezler aynı yolla çarpılır."],
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
    "letter-in": {
      name: "Harfle parantezi çarp",
      how: "Öndeki harfi parantezin üstüne bırak. Sonra yan yana duran iki harften birini basılı tut ve öbürünün üstüne bırak: `x·x`, `x²` demektir. (Kısa dokunuş bütün terimi alırdı.)",
      text: ["Harf de tıpkı bir sayı gibi içerideki her terimle çarpılır: `x(x + 3) = x·x + x·3`. `x·x` de bir kuvvettir: Üslü ifadeler bölümündeki gibi `x²`."],
    },
    "power-of-power": {
      name: "Üssün üssü",
      how: "Dıştaki üssü içteki üssün üstüne bırak. Üsler çarpılır: hesaplamak için · işaretine dokun.",
      text: ["`(x²)³`, `x²·x²·x²` demektir. Bu da 2 + 2 + 2 = 6 tane x eder; yani üsler çarpılır."],
    },
    "factor-shared": {
      name: "Ortak çarpan bul",
      how: "Bir terimdeki `x` harfini basılı tut, sonra içinde `x` olan başka bir terimin üstüne bırak: iki terim onu ortak çarpan olarak paylaşır. Sonra son iki terimin ortak çarpanını (çoğu zaman bir sayı), ardından iki çarpımda da bulunan parantezi dışarı al.",
      text: ["Dört terim varsa ikişerli çalış. Önce ilk iki terimin ortak çarpanını dışarı al, sonra son iki terimin. İki parantez aynıysa o parantezi de dışarı al."],
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
    "split-fraction": {
      name: "Kesri ayır",
      how: "Paydaki bir terimi dışarı çek. Paydanın bir kopyasını da yanında götürür.",
      text: ["Payı bir toplam olan kesir, her terim için ayrı bir kesre ayrılabilir; hepsinin paydası aynı kalır: `(x + 5)/6 = x/6 + 5/6`."],
    },
    "join-powers": {
      name: "Kökleri birleştir",
      how: "Bir kökü öbürünün üstüne bırak. Tek bir kök işaretinin altında birleşirler.",
      text: [
        "`√2·√3` sayısının karesi `2·3` eder; yani `√2·√3`, karesi 6 olan pozitif sayıdır: `√(2·3) = √6`. Aynı türden iki kök tek bir kökte birleşir.",
        "Ortak olan her üs için de aynısı geçerlidir: `x³y³`, xxx·yyy demektir; bu da xy·xy·xy, yani `(xy)³` eder.",
      ],
    },
    "root-notation": {
      name: "Kökü kuvvet olarak yaz",
      how: "Kökü kuvvet olarak yazmak için ona dokun: √, ½ kuvveti; ∛ ise ⅓ kuvveti demektir.",
      text: [
        "Her kök bir kuvvettir: `√x = x^(1/2)`, `∛x = x^(1/3)`; x'in n'inci dereceden kökü de `x^(1/n)` olur. Bu yüzden kuvvetlerin bütün kuralları kökler için de geçerlidir: `√x·√x = x^(1/2 + 1/2) = x`.",
      ],
    },
    "fraction-power": {
      name: "Kökler ve kuvvetler bir arada",
      how: "Kökü kuvvetin üstüne bırak: üsler toplanır. Sonra üsteki kesirleri topla.",
      text: ["`√x`, `x^(1/2)` demektir; bu yüzden `√x·x² = x^(1/2 + 2) = x^(5/2)`. Kesirli bir üs de öbür üsler gibi davranır: kuvvetler çarpılırken üsler toplanır."],
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
      text: ["`ln(e) = 1`, çünkü `e¹ = e`. 1'in logaritması da 0'dır, çünkü `e⁰ = 1`."],
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
    "bracket-times-bracket": {
      name: "İki parantezi çarp",
      how: "Bir parantezi öbürünün üstüne bırak: içerideki iki terimle de çarpılır. Sonra her yeni terimi aynı şekilde aç: çarpanlarından birini basılı tut ve öbürünün üstüne bırak (kısa dokunuş bütün terimi alır). Ardından `x·x` içindeki x'lerden birini basılı tut, öbürünün üstüne bırak ve benzer terimleri topla.",
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
    "zero-product": {
      name: "Sıfıra eşit bir çarpım",
      how: "Parantezlerden birini aşağı, çarpımın dışına çek: denklem ikiye ayrılır; ya bu parantez 0'dır ya da öbürü. Sonra ikisini de ayrı ayrı çöz.",
      text: [
        "Bir çarpım ancak çarpanlarından biri 0 ise 0 olur: `3·0 = 0` ama `3·2` öyle değil. Yani `(x − 2)(x + 3) = 0` ise `x − 2 = 0` ya da `x + 3 = 0` olur: iki kök.",
        "Bu yüzden iki tarafı asla 0 olabilecek bir şeye bölmeyiz: burada bir kökü kaybederdik.",
      ],
    },
    "take-out-then-split": {
      name: "Harfi dışarı al, sonra ayır",
      how: "Terimlerden birindeki harfi basılı tut ve en soldan dışarı, öne sürükle. Sonra onu aşağı, çarpımın dışına çek.",
      text: ["Sabit terim yoksa her terimde bir x vardır: onu ortak paranteze al, `x² − 3x = x(x − 3)`. Artık sıfıra eşit bir çarpım var; yani `x = 0` ya da `x − 3 = 0`."],
    },
    "split-middle": {
      name: "Çarpanlarına ayır, sonra ayır",
      how: "Ortadaki terime dokun: ikiye ayrılır. Her ikiliden bir çarpanı dışarı al, sonra ortak parantezi. Ardından parantezlerden birini aşağı, çarpımın dışına çek.",
      text: ["`x² + x − 6` iki parantezin çarpımıdır: `(x + 3)(x − 2)`. Bu iki sayının çarpımı `−6`, toplamı da x'in katsayısı olan `1`. Sıfıra eşit bir çarpım elde edince her parantez bir kök verir."],
    },
    "tap-operator": {
      name: "Aradaki işarete dokun",
      how: "İki sayının arasındaki + işaretine dokun: toplanırlar, tıpkı birini öbürünün üstüne bıraktığında olduğu gibi.",
      text: ["İki parçanın arasındaki işarete dokunursan işlem yapılır: + toplar, − çıkarır, · çarpar. Bu, birini öbürünün üstüne bırakmakla aynı işi görür: hangisi daha hızlıysa onu kullan."],
    },
    "multiply-out": {
      name: "Çarpımdaki sayıları çarp",
      how: "· işaretine dokun: çarpımdaki bütün sayılar çarpılır ve `4x·3`, `12x` olur.",
      text: ["Çarpmada sıranın önemi yoktur, bu yüzden `4x·3`, `4·3·x` demektir. Aralarında bir harf olsa bile sayılar çarpılabilir."],
    },
    "times-zero": {
      name: "Sıfırla çarpma",
      how: "0'a dokun: çarpımın tamamı 0 olur. Sonra toplamak için + işaretine dokun.",
      text: ["0 ile çarpılan her şey 0 eder. Bu yüzden `0·(x + 4)` ifadesi, x ne olursa olsun 0'dır."],
    },
    "evaluate-power": {
      name: "Kuvveti hesapla",
      how: "Üssü sayının üstüne bırak: `2³`, 8 olur.",
      text: ["`2³`, `2·2·2` demektir: küçük sayı, yani üs, 2'nin kaç kez çarpıldığını sayar. Bu yüzden bir sayının kuvveti hesaplanabilir: `2³ = 8`.", "Üsse dokunursan kuvvet bunun yerine çarpım olarak açık açık yazılır: `2³`, `2·2·2` olur."],
    },
    "divide-powers": {
      name: "Aynı taban: üsleri çıkar",
      how: "Paydadaki kuvveti, paydaki aynı tabanlı kuvvetin üstüne bırak. Üsler çıkarılır: hesaplamak için − işaretine dokun.",
      text: ["`x⁵/x²` ifadesinin payında beş, paydasında iki x var. Pay ve paydadan ikişer x sadeleşir, payda üç x kalır: bölmede üsler çıkarılır."],
    },
    "flip-across-bar": {
      name: "Kesir çizgisinin öbür yanına",
      how: "Kuvveti kesir çizgisinin öbür yanına sürükle: paydadan paya ya da paydan paydaya. Üssünün işareti değişir.",
      text: ["Paydada daha çok x varsa üs sıfırın altına iner: `x²/x⁵`, `x^(2 − 5) = x⁻³` demektir, aynı zamanda da `1/x³`. Yani `x⁻³`, `1/x³` demektir: bir kuvvet kesir çizgisinin öbür yanına geçince, hangi yöne giderse gitsin, üssünün işareti değişir."],
    },
    "power-of-product": {
      name: "Üssü parantezin içine al",
      how: "Üssü parantezin içine sürükle: içerideki her çarpan üssün bir kopyasını alır. Sonra sayının üssünü sayının üstüne bırakarak hesapla.",
      text: ["`(2x)³`, `2x·2x·2x` demektir; bu da `2³·x³` eder. İçerideki her çarpan üssü alır."],
    },
    "minus-bracket": {
      name: "Bir toplamda parantezin önünde eksi",
      how: "Parantezin önündeki eksiyi parantezin üstüne sürükle: içerideki bütün işaretler değişir. (Toplamın tamamı hareket edebiliyorsa eksiye kısa dokunuş bütün toplamı alır: yalnızca eksiyi almak için onu basılı tut.)",
      text: ["`5 − (x + 2)` ifadesinde `x + 2` toplamının tamamı, yani hem x hem 2 çıkarılır. Bu yüzden eksi içerideki her işareti değiştirir: `5 − x − 2`."],
    },
    "split-number": {
      name: "Sayıyı ayır",
      how: "Harfin önündeki sayıya dokun: iki çarpana ayrılır, öbür sayıyla ortak olan çarpan önde. Öbür sayıya da dokun. Sonra terimlerin arasındaki + işaretine dokun: ortak çarpan dışarı çıkar.",
      text: ["Ortak çarpan her zaman göze çarpmaz. `6x + 9` ifadesinde iki terim de 3'e bölünebilir, ama `6x` teriminde dışarı alınacak bir 3 görünmüyor.", "6'ya dokun: `3·2` olarak ayrılır, 9 ile ortak olan 3 önde. Artık bir 3 var: `3·2x + 9 = 3(2x + 3)`."],
    },
    "split-term": {
      name: "Ortadaki terimi ayır",
      how: "Ortadaki terimin harfine dokun: terim ikiye ayrılır. (Sayısına dokunursan sayı ayrılır.) Sonra önceki örnekteki gibi ikişerli çarpanlarına ayır: önce ilk iki terimin arasındaki + işaretine, sonra son iki terimin arasındakine, ardından iki çarpımın arasındakine dokun.",
      text: ["`x² + 5x + 6` ifadesini çarpanlarına ayırmak için toplamı 5, çarpımı 6 olan iki sayı ara: 2 ve 3. `5x` terimini `2x + 3x` olarak yaz.", "Artık dört terim var ve ikişerli çarpanlarına ayrılıyorlar: `x(x + 2) + 3(x + 2)`, sonra `(x + 2)(x + 3)`."],
    },
    "difference-of-squares": {
      name: "İki kare farkı",
      how: "İki terim de bir kare ve biri öbüründen çıkarılıyor: aradaki eksiye dokun. (İki terimin ortak bir sayısı varsa dokunuş önce onu dışarı alır, `4x² − 4 = 4(x² − 1)`: sonra eksiye yeniden dokun.)",
      text: ["Bir kareden bir kare çıkarılınca ifade her zaman aynı şekilde çarpanlarına ayrılır: `a² − b² = (a − b)(a + b)`. Kontrol etmek için çarpımı aç: ortadaki terimler birbirini götürür.", "Bu yalnızca fark için, yani bir kareden bir kare çıkarıldığında işe yarar. `x² + 9` gibi iki karenin toplamı hiç çarpanlarına ayrılmaz. `x² − 7` gibi bir kareden tam kare olmayan bir sayı çıkarıldığında ise ayrılır, ama köklerle: `(x − √7)(x + √7)`."],
    },
    "cancel-factor": {
      name: "Ortak çarpanı sadeleştir",
      how: "Paydadaki sayıyı, paydaki aynı sayının üstüne sürükle (ya da tersini yap): sadeleşirler.",
      text: ["Payın tamamını ve paydanın tamamını çarpan bir sayı sadeleşir: `(3x)/3`, `x` eder, çünkü `3x` bölü 3, x eder. `(3x + 1)/3` ifadesinde ise sadeleşmez: 3, payın yalnızca bir kısmını çarpar."],
    },
    "evaluate-fraction": {
      name: "Kesri hesapla",
      how: "Paydaki sayıya dokun: paydadaki sayı önde olacak şekilde ayrılır (14 bölü 7'de 14, `7·2` olur). Sonra paydadaki 7'yi bu 7'nin üstüne bırak: sadeleşirler.",
      text: ["Sonucu tam sayı çıkan bir kesir hesaplanabilir: `12/3`, 4 eder, çünkü `12 = 3·4` ve paydaki 3, paydadaki 3 ile sadeleşir."],
    },
    "divide-numbers": {
      name: "Kesri sadeleştir",
      how: "Önce paydaki, sonra paydadaki sayıya dokun: ikisi de ortak çarpan önde olacak şekilde ayrılır (8 ile 12, `4·2` ve `4·3` olur). Sonra 4'lerden birini öbürünün üstüne bırak: sadeleşirler.",
      text: ["Bir kesrin payı ve paydası aynı sayıya bölünerek kesir sadeleştirilebilir: `8/12 = 2/3`. Kesrin değeri değişmez.", "Sayıları ayırınca ortak çarpan ortaya çıkar: `8/12 = (4·2)/(4·3)` ve 4'ler sadeleşir."],
    },
    "factor-then-cancel": {
      name: "Dışarı al, sonra sadeleştir",
      how: "Paydaki bir terimin sayısını basılı tut ve en soldan dışarı, öne sürükle (ya da terimlerin arasındaki + işaretine dokun). Sonra onu paydadaki aynı sayının üstüne bırak: sadeleşirler.",
      text: ["Yalnızca payın tamamının çarpanı sadeleşebilir. `(2x + 6)/2` ifadesinde 2 her terimin çarpanıdır, bu yüzden önce onu dışarı al: `(2(x + 3))/2`. Artık payın tamamının çarpanıdır ve paydayla sadeleşir."],
    },
    "divide-by-fraction": {
      name: "Kesre bölme",
      how: "Alttaki kesrin paydasını yukarı, payın üstüne sürükle. Payla çarpılır. Hesaplamak için · işaretine dokun, sonra pay ile paydanın ortak çarpanlarını sadeleştir.",
      text: ["Bir sayının ne iş yaptığı, üstünde kaç kesir çizgisi olduğuna bağlıdır. `4/(3/5)` ifadesinde 5 iki çizginin altında: bir bölmeye bölündüğü için çarpar. Bu yüzden yukarı, paya çıkabilir ve anlam değişmez: `(4·5)/3`.", "Bir kesre bölmenin, o kesrin ters çevrilmişiyle çarpmak olmasının nedeni budur: `4/(3/5) = 4·5/3`."],
    },
    "evaluate-root": {
      name: "Kökü hesapla",
      how: "Kökü kuvvet olarak yazmak için ona dokun: `√9`, `9^(1/2)` demektir. Sonra hesaplamak için ½'yi 9'un üstüne bırak.",
      text: ["`√9`, kendisiyle çarpılınca 9 eden pozitif sayıdır: 3, çünkü `3·3 = 9` (−3 de 9 verir, ama √ pozitif olanı gösterir). Aynı şekilde `∛8 = 2`, çünkü `2·2·2 = 8`.", "Kuvvet olarak yazınca `√9 = 9^(1/2)`: 9'un üstüne bırakılan ½, her üs gibi onu hesaplar."],
    },
    "pull-out-of-power": {
      name: "Kökü ayır",
      how: "Sayıyı kökün dışına çek: ona ayrı bir kök gelir. Sonra o kökü hesapla: ona dokun ve ½'yi sayının üstüne bırak.",
      text: ["Bir çarpımın kökü, köklerin çarpımıdır: `√(4x) = √4·√x = 2√x`."],
    },
    "split-square": {
      name: "Kökü sadeleştir",
      how: "Kökün içindeki sayıya dokun: içinden bir tam kare ayrılır (küp kökte bir tam küp). Sonra önceki örnekteki gibi onu kökün dışına çek ve kökünü hesapla.",
      text: ["Sonucu tam sayı çıkmayan bir kök de sadeleştirilebilir. İçindeki sayıyı, çarpanlardan biri tam kare olacak şekilde ayır: `√12 = √(4·3) = 2√3`."],
    },
    "root-of-power": {
      name: "Kuvvetin kökü",
      how: "Kökü kuvvet olarak yazmak için ona dokun. Dıştaki üssü içteki üssün üstüne bırak ve çarpımı hesaplamak için · işaretine dokun. Sonra üssün payı ile paydasının ortak çarpanlarını sadeleştir.",
      text: ["Kök bir kuvvettir, bu yüzden bir kuvvetin kökü de bir kuvvetin kuvvetidir: `∛(x⁶) = (x⁶)^(1/3) = x^(6/3) = x²`. Üslü ifadeler bölümündeki gibi üsler çarpılır."],
    },
    "rationalise": {
      name: "Paydayı kökten kurtar",
      how: "Paydadaki kökü yukarı, payın üstüne sürükle: hem pay hem payda onunla çarpılır. Sonra paydadaki · işaretine dokun ve sadeleşen bir şey kalırsa sadeleştir.",
      text: ["Bir kesrin payını ve paydasını aynı sayıyla çarpmak kesrin değerini değiştirmez. Zaten paydada duran kökü seç: `√3·√3 = 3`, yani `1/√3 = √3/(√3·√3) = √3/3`. Artık kesir çizgisinin altında kök yok."],
    },
    "log-across": {
      name: "Logaritmayı karşıya geçir",
      how: "Logaritmayı = işaretinin karşı tarafına sürükle. Karşı tarafta kuvvet olur. Bu bir sayının kuvvetiyse, hesaplamak için üssü sayının üstüne bırak.",
      text: ["Logaritmayı kuvvet geri alır. `ln(x) = 2` denkleminde ln karşı tarafa geçer ve e olur: `x = e²`."],
    },
    "move-term": {
      name: "Terimi karşıya geçir",
      how: "Sayıyı = işaretinin karşı tarafına sürükle. Geçerken işareti değişir. Oradaki sayının üstüne bırakırsan birlikte hesaplanırlar; ya da yanına bırak ve hesaplamak için − işaretine dokun.",
      text: ["Bir denklem, iki tarafın eşit olduğunu söyler. İki tarafa da aynı işlemi yaparsan eşit kalırlar.", "Bir terimi `=` işaretinin karşı tarafına geçirmek tam olarak bunu yapar. `x + 3 = 10` denkleminde iki taraftan da 3 çıkar: `x = 10 − 3`. `+3` karşı tarafta bu yüzden `−3` olur."],
    },
    "move-factor": {
      name: "İki tarafı böl",
      how: "Harfin önündeki sayıyı = işaretinin karşı tarafına sürükle. Öbür tarafı böler. Sonra kesri hesapla: ayırmak için paydaki sayıya dokun ve paydayı ona uyan çarpanın üstüne bırak.",
      text: ["Bir tarafın tamamını çarpan sayı karşıya geçince öbür tarafı böler. `2x = 8` denkleminde iki tarafı da 2'ye böl: `x = 8/2` ve `8/2 = (2·4)/2 = 4`."],
    },
    "two-steps": {
      name: "İki adım",
      how: "Eklenen sayıyı karşıya geçir ve oradaki sayının üstüne bırak. Sonra harfin önündeki sayıyı karşıya geçir ve kesri hesapla: payı ayır ve sadeleştir.",
      text: ["`3x + 4 = 19` denkleminde x önce 3 ile çarpılmış, sonra 4 eklenmiş. x'e geri dönmek için bu işlemleri ters sırayla geri al: önce 4'ü çıkar, sonra 3'e böl.", "3 önce gidemez: o, tarafın tamamını değil, yalnızca x'i çarpar."],
    },
    "root-across": {
      name: "Kökü karşıya geçir",
      how: "Kökü kuvvet olarak yazmak için ona dokun (½; ∛ içinse ⅓), sonra bu üssü = işaretinin karşı tarafına sürükle: öbür tarafın karesi (∛ içinse küpü) alınır. Ardından hesaplamak için üssü sayının üstüne bırak.",
      text: ["`√x = 3` denklemini çözmek için iki tarafın karesini al: `x = 3²`. Kare almak kökü geri alır; bu yüzden √ gider ve öbür tarafın karesi alınır. Küp almak da küp kökü geri alır, öbürleri de böyle.", "Kuvvet olarak yazınca, `x^(1/2) = 3`, karşıya geçen ½'dir ve kareye dönüşür: aynı hamle."],
    },
    "ineq-move-factor": {
      name: "İki tarafı böl",
      how: "Harfin önündeki sayıyı eşitsizlik işaretinin karşı tarafına sürükle. Öbür tarafı böler, eşitsizliğin yönü ise aynı kalır. Sonra kesri hesapla: payı ayır ve sadeleştir.",
      text: ["İki tarafı pozitif bir sayıyla çarpmak ya da pozitif bir sayıya bölmek de eşitsizliğin yönünü değiştirmez: `2x < 8` ise `x < 8/2`."],
    },
    "ineq-negative": {
      name: "Negatif bir sayıya bölme",
      how: "Sayıyı karşıya sürükle ve kesri hesapla: eşitsizliğin yönü aynı kalır. Sonra eksiyi karşıya sürükle: eşitsizliğin yönü değişir.",
      text: ["İki tarafı negatif bir sayıya bölmek, tıpkı −1 ile çarpmak gibi, eşitsizliğin yönünü değiştirir: `−2x < 6`, `x > −3` demektir.", "Burada bildiğin iki hamle var: 2'ye böl (yön aynı kalır), sonra eksiyi karşıya geçir (yön değişir)."],
    },
    "plus-minus": {
      name: "Bir karenin iki kökü",
      how: "Üsteki 2'yi = işaretinin karşı tarafına sürükle. Bir karenin iki kökü vardır: denklem ikiye ayrılır, biri + ile, öbürü − ile. Sonra hesaplamak için her ½'yi sayının üstüne bırak.",
      text: ["`3² = 9`, ama `(−3)² = 9` da. Yani `x² = 9` ise `x = 3` ya da `x = −3`. Eksiyi unutursan bir kökü kaybedersin."],
    },
    "fraction-zero": {
      name: "Sıfıra eşit bir kesir",
      how: "Kesrin paydasını + ya da − işaretinden tutup = işaretinin karşı tarafına sürükle. Öbür tarafla çarpılır: 0'a dokun, çünkü 0 çarpı her şey 0'dır. Sonra sayıyı karşıya geçir.",
      text: ["Bir kesir ancak payı 0 olduğunda 0 olur. Paydası ise asla 0 olamaz; denklemin altındaki koşul da bunu söyler: `x ≠ −2`, `x + 2` ifadesinin 0 olmasını engeller.", "Bu yüzden payda karşıya geçip öbür tarafı çarpabilir: `(x − 3)/(x + 2) = 0` denkleminden `x − 3 = 0·(x + 2)`, yani `x − 3 = 0` elde edilir. Koşulu sağlamayan bir kök çıkarsa üstü çizilir."],
    },
    "letter-factor": {
      name: "Bir harfe bölme",
      how: "x'in önündeki harfi = işaretinin karşı tarafına sürükle. Öbür tarafı böler. Sonra onu paydaki aynı harfin üstüne bırak: sadeleşirler.",
      text: ["İki taraf ancak 0 olamayan bir harfe bölünebilir; denklemin altındaki koşul da bunu söyler: `a ≠ 0`.", "x'in kendisine asla bölme: `x² = 3x` denkleminde x'e bölersen `x = 3` bulursun ve `x = 0` kökünü kaybedersin. Bunun yerine her şeyi bir tarafa topla ve çarpanlarına ayır."],
    },
    "alone-first": {
      name: "Baştan sona yöntem",
      how: "Henüz hiçbir harf yalnız değil: `y = …` elde etmek için birinci denklemdeki x'i karşıya geçir. Sonra y'yi öbür denklemde yerine koy, x'i bul ve y'yi bulmak için x'i geri yerine koy.",
      text: ["İşte yöntemin tamamı, baştan sona:", "1. Denklemlerden birinde bir harfi yalnız bırak. En kolayını seç: önünde sayı olmayan bir harf. `x + y = 7` denkleminde x'i karşıya geçir: `y = 7 − x`.", "2. Yerine koy: öbür denklemde o harfin yerine, neye eşitse onu parantez içinde yaz. Önünde eksi varsa içerideki bütün işaretler değişir.", "3. Geriye kalan denklemi çöz: içinde tek bir harf var.", "4. Öbür harfi bulmak için bulduğun değeri `y = …` denkleminde yerine koy."],
    },
    "fraction-of-fractions": {
      name: "İki kesrin kesri",
      how: "Alttaki kesrin paydasını yukarı, payın üstüne sürükle; sonra üstteki kesrin paydasını aşağı, paydanın üstüne sürükle. Ardından hesaplamak için her · işaretine dokun.",
      text: ["`(a/b)/(c/d)` ifadesinde dört sayının her biri ana kesir çizgisini geçip, üstünde aynı sayıda kesir çizgisi olan yere gidebilir ve anlam değişmez (önceki örnekte 5'in yaptığı gibi): d yukarı, a'nın yanına; b aşağı, c'nin yanına; c yukarı, b'nin yanına; a da aşağı, d'nin yanına gider. (a'nın 0 olabileceği durum hariç: hiçbir şey 0'a bölünemez.)", "İki paydayı taşıyınca tek bir kesir elde edilir: `(a·d)/(c·b)`."],
    },
    "minus-number-in": {
      name: "Önde negatif bir sayı",
      how: "Sayıyı parantezin üstüne bırak ve hesaplamak için · işaretine dokun. Sonra eksiyi parantezin üstüne bırak: içerideki bütün işaretler değişir.",
      text: ["`−3(x − 2)`, −1 çarpı 3 çarpı parantez demektir. Önce 3 ile çarp: `−(3x − 6)`. Sonra eksi, içerideki bütün işaretleri değiştirir: `−3x + 6`.", "Son işarete dikkat: `−3` çarpı `−2`, `+6` eder. Eksi çarpı eksi artıdır."],
    },
    "substitute-back": {
      name: "Geri yerine koy",
      how: "`x = …` denklemindeki `x` harfini öbür denklemdeki `x` harfinin üstüne sürükle. Sonra y'yi bulmak için · ve + işaretlerine dokun.",
      text: ["x'i bulduktan sonra öbür denklem sana y'yi verir: orada x'in yerine değerini yaz ve hesapla. Artık ikisini de biliyorsun; bu ikili, sistemin çözümüdür.", "Doğrulamak için iki değeri de en son kullanmadığın denklemde yerine koy: iki taraf da aynı sonucu vermeli."],
    },
    "square-both-sides": {
      name: "İki tarafın karesini al",
      how: "Kökü ½ üslü bir kuvvet olarak yazmak için ona dokun, sonra ½'yi = işaretinin karşısına sürükle: öbür tarafın karesi alınır. Önceki örnekteki gibi parantezi aç, her şeyi bir tarafa topla, çarpanlarına ayır, sonra çarpımı parantezlere ayır. Bir koşulu sağlamayan kökün üstü çizilir.",
      text: ["Karekök hiçbir zaman negatif değildir; bu yüzden `√(x + 7) = x + 1` ancak `x + 1 ≥ 0`, yani `x ≥ −1` olduğunda geçerlidir. (Kökün içi de negatif olamaz: `x ≥ −7`.) Bunlar koşullardır; en başta verilirler ve çözüm boyunca geçerli kalırlar.", "İki tarafın karesini alınca bu bilgi kaybolur: `x + 7 = (x + 1)²` denklemi, `x + 1` ifadesinin negatif olduğu `x = −3` için de sağlanır. Bu yüzden karesi alınmış denklem `x = 2` ya da `x = −3` verir; −3 bir koşulu sağlamaz, üstü çizilir. Tek kök `x = 2`'dir."],
    },
    "substitute": {
      name: "Yerine koy",
      how: "`y` harfini `y = …` denkleminden alıp öbür denklemdeki `y` harfinin üstüne sürükle: o harf, `y` neye eşitse ona dönüşür. Artık o denklemde yalnızca x var: x'li terimleri topla ve denklemi çöz.",
      text: ["`y = 2x` ve `x + y = 9`, aynı x ve y hakkında iki denklemdir ve ikisi de aynı anda doğrudur. İki bilinmeyenli tek bir denklemin pek çok çözümü vardır; iki denklemin birlikte ise genellikle tek bir çözümü vardır.", "`y = 2x`, y ile 2x'in eşit olduğunu söyler; bu yüzden öbür denklemde y yerine 2x yazılabilir. Geriye tek harfli tek bir denklem kalır, onu nasıl çözeceğini de biliyorsun."],
    },
    "zero-power": {
      name: "Sıfırıncı kuvvet",
      how: "0 üssüne dokun: `x⁰`, 1 olur. Sonra toplamak için + işaretine dokun.",
      text: ["`x³/x³` 1'e eşittir (x, 0 değilse), ama aynı zamanda `x^(3 − 3) = x⁰` demektir. Demek ki 0 dışındaki her sayının sıfırıncı kuvveti 1'dir."],
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
  nextStep: "Sonraki adım",
  noNextStep: "Buradan sonrası için bir adım bulunamadı: Geri al ya da Baştan başla.",
  undo: "Geri al",
  solvedBang: "Çözdün!",
  where: "öyle ki",
  moveCrashed: "Bu hamlede bir şeyler ters gitti.",
  moveCrashedDetails: "Yeniden dene ya da bu alıştırmaya baştan başla.",
  pageCrashed: "Bu sayfada bir şeyler ters gitti.",
  pageCrashedDetails: "Yeniden dene ya da öğrenme yoluna geri dön. İlerlemen güvende.",
  tryAgain: "Yeniden dene",

  // Making a set
  ownTitle: "Kendi alıştırmaların",
  ownIntro:
    "Örneğin öğrencilerin için bir alıştırma seti yaz ve bağlantı olarak paylaş. Öğrenciler her alıştırmada önce sonucu zihinlerinde canlandırır, sonra elle çözer. İnternette hiçbir şey saklanmaz: setin tamamı bağlantının içindedir.",
  upload: ".yaml dosyası yükle",
  startFromExample: "Örnekten başla",
  yamlLabel: "YAML biçiminde alıştırma seti",
  form: {
    asForm: "Form",
    asYaml: "YAML",
    viewLabel: "Seti şu biçimde yaz",
    title: "Başlık",
    moves: "İzin verilen hamleler",
    allMoves: "Tüm hamleler",
    upTo: (n: number, title: string) => `${n}. bölüme kadar: ${title}`,
    start: (n: number) => `Alıştırma ${n}: başlangıç`,
    goal: (n: number) => `Alıştırma ${n}: hedef`,
    remove: (n: number) => `${n}. alıştırmayı kaldır`,
    addOne: "Alıştırma ekle",
    fromChapter: "Bir bölümün alıştırmalarından ekle",
    chapter: "Bölüm",
    level: "Düzey",
    howMany: "Kaç tane",
    addMade: (n: number) => `${n} tane ekle`,
    making: "Hazırlanıyor…",
    cantRead: "Bu setin YAML'ında bir hata var, bu yüzden form onu gösteremiyor. Hatayı YAML görünümünde düzelt ya da örnekten başla.",
  },
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
    noValue: "Başlangıç hiçbir sayı için tanımlı değil (0'a bölme mi var?).",
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
