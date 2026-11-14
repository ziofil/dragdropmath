import type { Translation } from "../en";

/**
 * Türkçe. Sayılara ve değişken adlara gelen ekler okunuşa göre değiştiği için
 * (3'ü, 2'yi, 10'u…), değişken sayılar içeren cümleler ek almayacak biçimde kuruldu.
 */
export const tr: Translation = {
  htmlLang: "tr",
  pageTitle: "Math by Hand",
  logo: "math by hand",
  language: "Dil",

  // Top bar
  makeExercises: "Alıştırma hazırla",
  sandbox: "Deneme alanı",
  openSandbox: "Deneme alanını aç →",
  sandboxIntro: "İstediğin bir ifadeyi ya da denklemi yaz, bütün hamleleri dene.",
  sandboxInput: "İfade ya da denklem",
  sandboxPlaceholder: "örn. 3(x - 2) = 2x + 1   veya   ln(x^2) = e^(ln(4))",
  sandboxLoad: "Yükle",
  debugOn: "Hata ayıklama modu açık (Shift+D)",

  // Home
  heroBefore: "Elle ",
  heroWord: "tutulur",
  heroAfter: " cebir.",
  heroText:
    "Bir denklemin istediğin parçasını sürükle. Parçalar yalnızca matematiğin izin verdiği şekilde hareket eder. Hedefe benzeyene kadar düzenlemeye devam et.",
  learningPath: "Öğrenme yolu",
  nextUp: "sıradaki",
  mastered: "tamamlandı",
  everyChapterOpen: "Bütün bölümler açık. Oklar önerilen sırayı gösteriyor.",
  chapterNodeLabel: (n: number, title: string, done: number, total: number) => `Bölüm ${n}: ${title}, ${done}/${total} çözüldü`,
  chapterN: (n: number) => `Bölüm ${n}`,
  list: (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ve ${items[items.length - 1]}`),
  buildsOn: (titles: string) => `Ön bilgi: ${titles}.`,
  notMasteredYet: (titles: string) => ` Henüz tamamlamadığın: ${titles}. Yine de başlayabilirsin.`,
  startLesson: "Konuya başla →",
  backToLesson: "Konuya dön →",
  leadsOnTo: (titles: string) => `Sonra gelenler: ${titles}.`,
  badges: "Rozetler",
  noBadgesYet: "Bir bölümün rozetini kazanmak için o bölümün testini çöz.",
  badgesEarned: (n: number, total: number) => `${n}/${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `${["", "Bronz", "Gümüş", "Altın"][tier]} rozet`,
  badgeNotEarned: "rozet henüz kazanılmadı",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? `${["", "bronz", "gümüş", "altın"][tier]} rozet` : "henüz kazanılmadı"}`,

  // Chapter page
  backToPath: "← Öğrenme yolu",
  practiceNote: "Her alıştırma yeni, yalnızca senin için hazırlanıyor. Kolaylarla başla, kendini hazır hissettiğinde bir üst seviyeye geç.",
  leadsOnToStart: "Sonra gelenler: ",
  leadsOnToEnd: ". İstediğin zaman geçebilirsin.",
  watchOut: "Dikkat!",
  level: { easy: "Kolay", medium: "Orta", hard: "Zor" },
  anotherOne: "Bir tane daha →",
  practice: "Alıştırma yap",
  testSkills: "Kendini sına",
  testNote:
    "Cevabı aklından bul, sonra seç. Doğru cevaplar bölümün rozetini kazandırır: Kolay seviyede 10 doğru bronz, Orta seviyede gümüş, Zor seviyede altın rozet getirir.",
  solvedN: (n: number) => `${n} çözüldü`,
  testRight: "Doğru! Rozet için sayıldı.",
  drills: {
    commute: { name: "Sırayı değiştir", how: "Bir terimi yanındakinin öbür yanına sürükle. + ve × işlemlerinde sıra fark etmez." },
    combine: { name: "Sayıları topla", how: "Toplamak için bir sayıyı diğerinin üstüne bırak." },
    "multiply-numbers": { name: "Sayıları çarp", how: "Bir sayıyı, çarpıldığı öbür sayının üstüne bırak." },
    "numbers-first": { name: "Sayı başa", how: "`x·3` gibi bir çarpıma dokun; alışılmış biçimde, `3x` olarak yazılsın." },
    "multiply-out": { name: "Çarpımı hesapla", how: "`2·3` gibi sayılardan oluşan bir çarpımı hesaplamak için ona dokun." },
    collect: { name: "Benzer terimleri topla", how: "Bir terimi, harfi aynı olan benzer bir terimin üstüne bırak. Toplanırlar." },
    "collect-cancel": { name: "Zıt terimler", how: "Bir terimi, zıt işaretli eşinin üstüne bırak. Birbirlerini götürürler." },
    distribute: { name: "Parantezi aç", how: "Öndeki sayıyı parantezin üstüne bırak. İçerideki her terimle çarpılır." },
    "distribute-neg": { name: "Parantezin önünde eksi", how: "Eksiyi parantezin üstüne bırak. İçerideki bütün işaretler değişir." },
    "factor-out": { name: "Ortak çarpan parantezine al", how: "İki terimde de ortak bir çarpan var. Birini en soldan dışarı, öne sürükle." },
    "x-times-x": { name: "x çarpı x", how: "x'lerden birini diğerinin üstüne bırak. `x·x`, `x²` diye yazılır." },
    "merge-powers": { name: "Aynı taban: üsleri topla", how: "Bir kuvveti, tabanı aynı olan öbür kuvvetin üstüne bırak. Üsler toplanır." },
    "power-to-product": { name: "Kareyi çarpım olarak yaz", how: "Parantezi iki kez yazmak için üsteki ²'ye dokun." },
    "move-term": { name: "Terimi karşıya geçir", how: "Sayıyı = işaretinin karşı tarafına sürükle. Geçerken işareti değişir." },
    "move-factor": { name: "İki tarafı böl", how: "Harfin önündeki sayıyı = işaretinin karşı tarafına sürükle. Öbür tarafı böler." },
    "move-denominator": { name: "İki tarafı çarp", how: "Kesrin paydasını = işaretinin karşı tarafına sürükle. Öbür tarafla çarpılır." },
    "move-sign": { name: "Eksiyi karşıya geçir", how: "Yalnızca eksiyi = işaretinin karşı tarafına sürükle. Öbür tarafın işareti değişir." },
    "swap-sides": { name: "Tarafların yerini değiştir", how: "Taraflardan birini = işaretinin karşısına, en uca kadar sürükle. İki taraf yer değiştirir." },
    "evaluate-fraction": { name: "Kesri hesapla", how: "Hesaplamak için kesir çizgisine dokun." },
    "divide-numbers": { name: "Kesri sadeleştir", how: "Paydadaki sayıyı paydaki sayının üstüne bırak. İkisi de ortak çarpanlarına bölünür." },
    "cancel-factor": { name: "Ortak çarpanı sadeleştir", how: "Paydadaki sayıyı, paydaki aynı sayının üstüne bırak. İkisi de ortadan kalkar." },
    "power-of-power": { name: "Üssün üssü", how: "Dıştaki üssü içteki üssün üstüne bırak. Üsler çarpılır." },
    "divide-powers": { name: "Aynı taban: üsleri çıkar", how: "Paydadaki kuvveti paydaki kuvvetin üstüne bırak. Üsler çıkarılır." },
    "flip-across-bar": { name: "Kesir çizgisinin öbür tarafına", how: "Kuvveti yukarı, kesir çizgisinin öbür tarafına sürükle. Üssünün işareti değişir." },
    "power-one": { name: "Birinci kuvvet", how: "1 üssünü tabanının üstüne bırak: `x¹`, yalnızca `x` demektir." },
    "zero-power": { name: "Sıfırıncı kuvvet", how: "0 üssünü tabanının üstüne bırak. Her sayının sıfırıncı kuvveti 1'dir." },
    "tap-power": { name: "Kuvveti hesapla", how: "Kuvveti hesaplamak için üsse dokun: `2³`, 8 olur." },
    "power-of-product": { name: "Üssü parantezin içine al", how: "Üssü parantezin içine sürükle. İçerideki her çarpan bu üssü ayrı ayrı alır." },
    "split-number": { name: "Sayıyı çarpanlarına ayır", how: "Sayıyı iki çarpana ayırmak için ona dokun." },
    "factor-shared": { name: "Ortak çarpan bul", how: "Bir terimdeki `x`'i, içinde `x` olan başka bir terimin üstüne bırak. `x`, iki terimin ortak çarpanı olur." },
    "move-letter-factor": { name: "Harfe böl", how: "Çarpılan harflerden birini = işaretinin karşı tarafına sürükle. Öbür tarafı böler." },
    "move-letter-denominator": { name: "Harfle çarp", how: "Paydadaki harfi = işaretinin karşı tarafına sürükle. Öbür tarafla çarpılır." },
    "ineq-move-term": { name: "Terimi karşıya geçir", how: "Sayıyı eşitsizlik işaretinin karşı tarafına sürükle. Sayının işareti değişir, eşitsizliğin yönü ise aynı kalır." },
    "ineq-swap": { name: "Tarafların yerini değiştir", how: "Taraflardan birini öbürünün ötesine sürükle. Eşitsizlik işaretinin yönü de onlarla birlikte döner." },
    "ineq-sign": { name: "Eksiyi karşıya geçir", how: "Yalnızca eksiyi karşı tarafa sürükle. Eşitsizlik işaretinin yönü değişir." },
    "add-fractions": { name: "Kesirleri topla", how: "Paydalar aynı: kesirlerden birini diğerinin üstüne bırak. Paylar toplanır." },
    "expand-fraction": { name: "Paydaları eşitle", how: "Bir kesrin paydasını öbür kesrin üstüne sürükle. O kesrin hem payı hem paydası bununla çarpılır." },
    "multiply-fractions": { name: "Kesirleri çarp", how: "Kesirlerden birini diğerinin üstüne bırak. Paylar çarpılır, paydalar da." },
    "divide-by-fraction": { name: "Kesre böl", how: "Paydadaki kesri yukarı, kesir çizgisinin öbür tarafına sürükle. Ters çevrilir ve çarpan olur." },
    "split-fraction": { name: "Kesri ayır", how: "Paydaki bir terimi dışarı çek. Paydanın bir kopyasını da yanında götürür." },
    "times-one": { name: "1 ile çarpma", how: "1'i çarptığı şeyin üstüne bırak. 1 ile çarpmak hiçbir şeyi değiştirmez." },
    substitute: { name: "Yerine koy", how: "`y = …` denklemindeki `y`'yi öbür denklemdeki `y`'nin üstüne sürükle. Onun yerine `y`'nin eşit olduğu ifade gelir." },
    "evaluate-root": { name: "Kökü hesapla", how: "Hesaplamak için köke dokun." },
    "split-square": { name: "Kökün içini ayır", how: "Kökün içindeki sayıya dokun. İçinden bir tam kare ayrılır." },
    "pull-out-of-power": { name: "Kökü ayır", how: "Sayıyı kökün içinden dışarı çek. Ona ayrı bir √ gelir." },
    "root-notation": { name: "Kökü kuvvet olarak yaz", how: "Kökü ½ kuvveti olarak yazmak için ona dokun." },
    "root-across": { name: "½ üssünü karşıya geçir", how: "½ üssünü = işaretinin karşı tarafına sürükle. Karşı tarafta kare olur." },
    "exp-of-log": { name: "Kuvvet, logaritmayı geri alır", how: "Tabanı, üssündeki logaritmanın üstüne bırak. Birbirlerini götürürler." },
    "evaluate-log": { name: "Bilinen logaritmalar", how: "Hesaplamak için logaritmaya dokun: `ln(e) = 1`, 1'in logaritması da 0'dır." },
    "power-of-base": { name: "Tabanın kuvveti olarak yaz", how: "Logaritmanın içindeki sayıya dokun; logaritmanın tabanının bir kuvveti olarak yazılsın." },
    "log-of-product": { name: "Logaritmayı ayır", how: "Sayıyı logaritmanın içinden dışarı çek. Ona ayrı bir logaritma gelir." },
    "log-of-power": { name: "Üssü logaritmanın önüne al", how: "Üssü logaritmanın önüne sürükle." },
    "power-into-log": { name: "Sayıyı logaritmanın içine al", how: "Öndeki sayıyı logaritmanın üstüne bırak. İçeride üs olur." },
    "combine-logs": { name: "Logaritmaları birleştir", how: "Bir logaritmayı diğerinin üstüne bırak. Logaritmalar toplanınca içleri çarpılır, çıkarılınca bölünür." },
    "exp-across": { name: "Tabanı karşıya geçir", how: "Tabanı = işaretinin karşı tarafına sürükle. Karşı tarafta logaritma olur." },
    "log-across": { name: "Logaritmayı karşıya geçir", how: "Logaritmayı = işaretinin karşı tarafına sürükle. Karşı tarafta kuvvet olur." },
  },

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Alıştırma ${label}${solved ? " — çözüldü" : ""}`,
  goldNote: "Altın rozet. İstediğin kadar devam edebilirsin.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${["", "Bronz", "Gümüş"][tier]} rozet. ` : ""}${["Bronz", "Gümüş", "Altın"][tier]} rozet için ${["Kolay", "Orta", "Zor"][tier]} seviyede ${more} doğru cevap daha.`,

  // Guided example
  notThisStep: "Bu hamle geçerli, ama bu adımda yapılacak olan bu değil. Geri alıyorum.",
  done: "Tamam.",
  keepGoing: "Devam edebilirsin: artık her hamle serbest.",
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
  guessPrompt: "Önce düşün: sonuç ne olur?",
  reveal: "Göster",
  guessedBeforeRight: "Bunu ilk seferde doğru bulmuştun.",
  guessedBeforeWrong: (picked: boolean) => `İlk cevabın ${picked ? "kırmızı olandı" : "yanlıştı"}. Doğrusu yeşil olan.`,
  rightFirstTime: "İlk seferde doğru. Şimdi çöz.",
  notQuite: "Olmadı. Doğrusu yeşil olan. Nerede yanıldığını görmek için çöz.",
  solvedBefore: "✓ Bunu daha önce çözmüştün. İstersen yeniden çözebilirsin.",
  makeItLookLike: "Şuna dönüştür",
  pickFirst: "Yukarıdan bir cevap seç, sonra burada çöz.",
  hint: "İpucu",
  undo: "Geri al",
  reset: "Sıfırla",
  solvedBang: "Çözdün!",
  newBadge: (tier: 1 | 2 | 3, chapter: string) => `${["", "Bronz", "Gümüş", "Altın"][tier]} rozet: ${chapter}.`,
  theExercise: "alıştırma",
  moveCrashed: "Bu hamlede bir şeyler ters gitti.",
  moveCrashedDetails: "Ayrıntılar tarayıcı konsolunda.",
  tryAgain: "Yeniden dene",

  // Making a set
  ownTitle: "Kendi alıştırmaların",
  ownIntro:
    "Örneğin öğrencilerin için bir alıştırma seti yaz ve bağlantı olarak paylaş. Öğrenciler her alıştırmada önce sonucun ne olacağını düşünür, sonra elle çözer. İnternette hiçbir şey saklanmaz: setin tamamı bağlantının içindedir.",
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
    ` ${stars} ilk seferde doğru. Her alıştırmada önce sonucun ne olacağını düşün, sonra elle çöz.`,
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
    noDecoys: "İnandırıcı yanlış cevaplar üretilemedi: `wrong:` ekle ya da alıştırma bu adım olmadan çözülsün.",
    decoysMade: (list: string) => `Seçenek olarak üretilen yanlış cevaplar: ${list}.`,
    shapeCount: "denklem sayısı farklı",
    shapeRelation: "denklem beklenen yerde bir ifade var ya da tam tersi",
    shapeIsolated: (letter: string) => `${letter} değişkeninin neye eşit olduğunu söylemiyor`,
  },
};
