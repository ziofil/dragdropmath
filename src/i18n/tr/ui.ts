import type { Strings } from "../en";

/**
 * Türkçe. Sayılara ve değişken adlara gelen ekler okunuşa göre değiştiği için
 * (3'ü, 2'yi, 10'u…), değişken sayılar içeren cümleler ek almayacak biçimde kuruldu.
 */
export const tr: Strings = {
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
  noBadgesYet: "Bir bölümün rozetini kazanmak için o bölümden alıştırma çöz.",
  badgesEarned: (n: number, total: number) => `${n}/${total}`,
  tierBadge: (tier: 1 | 2 | 3) => `${["", "Bronz", "Gümüş", "Altın"][tier]} rozet`,
  badgeNotEarned: "rozet henüz kazanılmadı",
  shelfTitle: (chapter: string, tier: 0 | 1 | 2 | 3) =>
    `${chapter}: ${tier ? `${["", "bronz", "gümüş", "altın"][tier]} rozet` : "henüz kazanılmadı"}`,

  // Chapter page
  backToPath: "← Öğrenme yolu",
  exercises: "Alıştırmalar",
  practiceNote: "Her alıştırma yeni, yalnızca senin için hazırlanıyor. Kolaylarla başla, kendini hazır hissettiğinde bir üst seviyeye geç.",
  leadsOnToStart: "Sonra gelenler: ",
  leadsOnToEnd: ". İstediğin zaman geçebilirsin.",
  watchOut: "Dikkat!",
  level: { easy: "Kolay", medium: "Orta", hard: "Zor" },
  anotherOne: "Bir tane daha →",

  // Progress
  exerciseTitle: (label: string, solved: boolean) => `Alıştırma ${label}${solved ? " — çözüldü" : ""}`,
  solved: "çözüldü",
  goldNote: "Altın rozet. İstediğin kadar devam edebilirsin.",
  badgeNote: (tier: 0 | 1 | 2, more: number) =>
    `${tier ? `${["", "Bronz", "Gümüş"][tier]} rozet. ` : ""}${["Bronz", "Gümüş", "Altın"][tier]} rozet için ${more} ${["kolay", "orta düzey", "zor"][tier]} alıştırma daha.`,

  // Guided example
  exampleN: (n: number) => `Örnek ${n}`,
  notThisStep: "Bu hamle geçerli, ama bu adımda yapılacak olan bu değil. Geri alıyorum.",
  done: "Tamam.",
  keepGoing: "Devam edebilirsin: artık her hamle serbest.",
  stepOf: (n: number, total: number) => `Adım ${n}/${total}`,
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
  goal: "hedef",
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
