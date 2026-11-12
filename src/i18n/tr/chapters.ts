import type { ChapterTexts } from "..";

export const trChapters: ChapterTexts = {
  shuffle: {
    title: "Terimleri sıralama",
    blurb: "Toplamada terimlerin sırası fark etmez. İfadedeki sayılar da hesaplanıp tek bir sayıya indirilebilir.",
    lesson: [
      {
        title: "Sıra fark etmez",
        text: [
          "Toplarken sırayı değiştirmek sonucu değiştirmez. `2 + x` ile `x + 2` aynı şeydir.",
          "Bir toplamın her bir parçasına terim denir. Terimleri sürükleyerek istediğin sıraya koyabilirsin.",
        ],
        steps: ["2'yi x'in öbür yanına sürükle."],
      },
      {
        title: "Her terim işaretini yanında taşır",
        text: ["`5 − 3 + x` ifadesinin terimleri `5`, `−3` ve `x`'tir. Eksi işareti 3'e aittir. 3 nereye giderse eksi de onunla gider."],
        steps: ["x'i en başa sürükle. 3, eksisini yanında götürür."],
        watch: "`5 − 3` ile `3 − 5` aynı değildir. 3'ü taşırken eksisi de onunla birlikte gitmeli.",
      },
      {
        title: "Sayıları toplama",
        text: [
          "Aynı toplamdaki iki sayıyı toplayabilirsin. Birini diğerinin üstüne bırakman yeterli. x henüz bilmediğimiz bir sayı, o yüzden olduğu gibi kalır.",
        ],
        steps: ["4'ü 3'ün üstüne bırak."],
        after: "3 + 4 = 7. x olduğu gibi kalır.",
      },
      {
        title: "Çarpmada da sıra fark etmez",
        text: [
          "Çarparken de sıranın önemi yoktur: `2·x·5` ile `2·5·x` aynıdır. Yani 2 ile 5'i çarpıp 10 bulabilirsin.",
          "Genellikle sayıyı başa yazarız, çarpma noktasını da yazmayız: `10·x` yerine `10x` yazılır.",
        ],
        steps: ["5'i 2'nin üstüne bırak."],
      },
    ],
    hints: {
      s1: "2'yi x'in öbür yanına sürükle.",
      s2: "4'ü 3'ün üstüne bırak.",
      s3: "Sayılardan birini diğerinin üstüne bırak.",
      s8: "4, eksisini yanında götürür.",
      s17: "2 − 7 sıfırdan küçüktür.",
      s24: "a'lı terimi başa, tek başına duran sayıyı sona koy.",
    },
  },

  collect: {
    title: "Benzer terimler",
    blurb: "Harfleri aynı olan terimler toplanabilir: 3x + 2x = 5x. Bir terimden kendisini çıkarırsan 0 kalır.",
    lesson: [
      {
        title: "3x ne demek?",
        text: ["`3x`, `x + x + x` demektir. Yani `3x + 2x` üç tane x ile iki tane x'in toplamıdır; bu da `5x` eder."],
        steps: ["2x'i 3x'in üstüne bırak."],
      },
      {
        title: "Yalnızca benzer terimler toplanır",
        text: [
          "Harfleri tamamen aynı olan terimlere benzer terimler denir. Yalnızca benzer terimler toplanabilir. `3x + 2` ifadesi `5x` olamaz, çünkü `2`'de x yok. Tek başına duran sayılar da ancak birbiriyle toplanır.",
        ],
        steps: ["İki x benzer terimdir. İkinci x'i birincinin üstüne bırak."],
        after: "4'te x yok, o yüzden olduğu gibi kalır.",
      },
      {
        title: "Farklı harfler toplanmaz",
        text: [
          "`x` ile `y` farklı sayılar olabilir; bu yüzden `2x + 3y` daha fazla sadeleşmez. Ama `2x + 3y + x` ifadesindeki iki x'li terim toplanabilir.",
        ],
        steps: ["x'i 2x'in üstüne bırak. 3y olduğu gibi kalır."],
        after: "x'li terimler ile y'li terimler ayrı kalır.",
      },
      {
        title: "Çıkarma",
        text: ["Çıkarma da aynı şekilde işler: `5y − 2y`, `3y` eder. Bir şeyden kendisini çıkarırsan 0 kalır; yani `a + b − a` ifadesi yalnızca `b`'dir."],
        steps: ["−a'yı a'nın üstüne bırak. Birbirlerini götürürler."],
        watch: "`x + x`, `2x` eder; `x²` etmez. `x²`, `x·x` demektir. Ona sonra geleceğiz.",
      },
    ],
    hints: {
      c4: "Bir şeyden kendisini çıkarırsan 0 kalır.",
      c17: "ab'yi tek bir harf gibi düşün: 3ab + 2ab, tıpkı 3x + 2x gibi toplanır.",
      c9: "Önce 2·3'ü hesapla. Sonra x'li terimleri topla.",
      c6: "Önce x'li terimleri, sonra y'li terimleri topla.",
      c27: "Önce b'li terimleri topla. Sonra harfleri sıraya koy; tek başına duran sayı en sona.",
    },
  },

  distribute: {
    title: "Dağılma özelliği",
    blurb: "Parantezin önündeki sayı, içerideki her terimle çarpılır. Her terimde ortak olan bir çarpan da yeniden parantezin önüne alınabilir.",
    lesson: [
      {
        title: "İçerideki her terimle çarp",
        text: [
          "`2(x + 3)`, 2 tane `(x + 3)` demektir. Bu da 2 tane x artı 2 tane 3 eder: `2x + 2·3`. Dışarıdaki sayı içerideki her terimle çarpılır.",
          "Yüksekliği 2, genişliği `x + 3` olan bir dikdörtgen düşün. Onu iki parçaya böl: birinin alanı `2·x`, diğerininki `2·3`. İkisi birlikte bütün dikdörtgeni oluşturur.",
        ],
        steps: ["2'yi parantezin üstüne bırak. İki terimle de çarpılır.", "Şimdi 2·3'teki 2'yi 3'ün üstüne bırak."],
      },
      {
        title: "Önünde eksi olan parantez",
        text: ["`−(x − 4)`, parantezin `−1` ile çarpılması demektir. −1 içerideki her terimle çarpılır, bu yüzden bütün işaretler değişir."],
        steps: ["Eksiyi parantezin üstüne bırak."],
        watch: "Sık yapılan bir hata, `−(x − 4)` yerine `−x − 4` yazmaktır. Eksi, 4'le de çarpılır.",
      },
      {
        title: "Ortak çarpan parantezine alma",
        text: [
          "Bu işlemi tersinden yapmaya çarpanlara ayırma denir. Her terimde 3 çarpanı varsa, 3'ü parantezin önüne alabilirsin: `3x + 3y = 3(x + y)`.",
        ],
        steps: ["İki terimde de 3 var. 3'lerden birini en soldan dışarı, öne sürükle."],
        after: "Parantezi yeniden açarsan 3x + 3y bulursun.",
      },
      {
        title: "x çarpı x",
        text: [
          "Bazen bir harf kendisiyle çarpılır: `x(x + 2)` ifadesinden `x·x` çıkar. Bunu `x²` (x kare) diye yazarız. Kenarı x olan bir karenin alanı da `x·x`'tir.",
        ],
        steps: ["x'i parantezin üstüne bırak.", "x'lerden birini diğerinin üstüne bırak."],
      },
    ],
    hints: {
      d1: "a'yı parantezin üstüne bırak.",
      d3: "Terimlerden birinden bir a'yı dışarı çek.",
      d19: "Eksiyi parantezin üstüne bırak.",
      d6: "Eksiyi parantezin üstüne bırak.",
      d14: "Eksi, parantezin içindeki her terimle çarpılır.",
      d18: "−2, kendi parantezindeki iki terimle de çarpılır.",
      d27: "Öndeki her çarpan, kendi parantezindeki iki terimle de çarpılır. Sonra y²'li terimleri ve y'li terimleri topla.",
    },
  },

  brackets: {
    title: "Parantezleri çarpma",
    blurb: "İki parantezi çarpmak için birinci parantezdeki her terimi ikinci parantezdeki her terimle çarp.",
    lesson: [
      {
        title: "Parantez tek bir çarpandır",
        text: [
          "`(x + 1)(x + 2)` çarpımında birinci parantez, ikinci parantezin tamamıyla çarpılır. `(x + 1)`'i tek bir çarpan gibi düşün ve dağıt: hem `x` ile hem `2` ile çarpılır.",
        ],
        steps: [
          "(x + 1)'in tamamını (x + 2)'nin üstüne bırak. İki terimle de çarpılır.",
          "Şimdi x'i yanındaki (x + 1)'in üstüne bırak.",
          "Sonra 2'yi kendi (x + 1)'inin üstüne bırak.",
        ],
        after: "Böylece dört terim çıkar: x·x, 1·x, 2·x ve 2·1. Benzer terimleri toplarsan x² + 3x + 2 bulursun.",
      },
      {
        title: "İki parantezin çarpımı",
        text: [
          "Birinci parantezdeki her terimi ikincideki her terimle çarp. İki terim çarpı iki terim, dört terim eder. Sonra benzer terimleri topla.",
          "`(x + 3)(x − 3)` çarpımında ortadaki iki terim `+3x` ve `−3x`'tir. Birbirlerini götürürler, geriye `x² − 9` kalır.",
        ],
      },
      {
        title: "Parantezin karesi",
        text: ["`(x + 1)²` demek `(x + 1)(x + 1)` demektir, yani aynı yolla çarpılır. Çarpım olarak yazmak için üsteki ²'ye dokun."],
        steps: ["Çarpım olarak yazmak için üsteki ²'ye dokun."],
        watch:
          "`(x + 1)²`, `x² + 1` değildir. x = 2 için dene: `(2 + 1)² = 9`, ama `2² + 1 = 5`. Aradaki fark ortadaki iki terimdir: `x + x = 2x`.",
      },
    ],
    hints: {
      m1: "x'i parantezin üstüne bırak. x·x nasıl yazılır?",
      m2: "Parantezlerden birini bütün olarak diğerinin üstüne bırak. Sonra her parçayı aç.",
      m18: "x·x², üç tane x'in çarpımıdır: x³.",
      m5: "Ortadaki iki terime bak.",
      m25: "Üç çarpan var. Önce ikisini çarp, sonra çıkanı üçüncüyle çarp.",
      m7: "Üsteki ²'ye dokun ve (x + 2)(x + 2) olarak yaz.",
      m9: "Sonuç yalnızca a² + b² değil. Her terimi her terimle çarp.",
    },
  },

  balance: {
    title: "Denklem çözme",
    blurb: "Eşitliğin iki tarafına aynı işlemi yaparsan eşitlik bozulmaz. = işaretinin karşı tarafına geçen terim, orada ters işleme dönüşür.",
    lesson: [
      {
        title: "İki tarafa aynı işlem",
        text: [
          "Denklem, iki şeyin birbirine eşit olduğunu söyler. İki tarafa da aynı işlemi yaparsan eşitlik korunur.",
          "Bir terimi `=` işaretinin karşı tarafına geçirmek tam olarak bunu yapar. `x + 3 = 10` denkleminde iki taraftan da 3 çıkar: `x = 10 − 3`. İşte bu yüzden `+3`, karşı tarafa `−3` olarak geçer.",
        ],
        steps: ["3'ü = işaretinin karşı tarafına sürükle. İşareti değişir.", "−3'ü 10'un üstüne bırak."],
      },
      {
        title: "İki tarafı bölme",
        text: [
          "Bir sayı bir tarafın tamamıyla çarpılıyorsa, karşıya geçince öbür tarafı böler. `2x = 8` denkleminde iki tarafı da 2'ye böl: `x = 8/2`.",
        ],
        steps: ["2'yi = işaretinin karşı tarafına sürükle. Öbür tarafı böler.", "2'yi 8'in üstüne bırak."],
      },
      {
        title: "Kesirler ve eksiler",
        text: [
          "Bölmede de aynısı geçerli. `x/3 = 4` denkleminde iki tarafı da 3'le çarp. Paydadaki 3 karşıya geçer ve öbür tarafla çarpılır.",
          "Bir tarafın tamamının önündeki eksi de karşıya geçebilir: `−x = 6`, `x = −6` olur.",
        ],
        steps: ["3'ü = işaretinin karşı tarafına sürükle."],
      },
      {
        title: "Ters sırayla geri al",
        text: [
          "`3x + 1` ifadesinde x önce 3'le çarpılmış, sonra üstüne 1 eklenmiş. x'i yalnız bırakmak için bunları ters sırayla geri al: önce 1'i, sonra 3'ü karşıya geçir.",
        ],
        steps: ["1'i karşı tarafa geçir.", "Hesapla.", "3'ü karşı tarafa geçir.", "Hesapla."],
        watch: "Bulduğun sonucu yerine koyarak sağlamasını yap: 3·4 + 1 = 13. ✓",
      },
    ],
    hints: {
      b1: "3'ü = işaretinin karşı tarafına sürükle.",
      b10: "Sağ tarafın tamamını öbür tarafa sürükleyerek tarafların yerini değiştir. Ya da denklemi olduğu yerde çöz.",
      b21: "Cevap kesirli çıkabilir.",
      b22: "Payın tamamı 2'ye bölünüyor. Önce 2'yi karşı tarafa geçir.",
      b7: "Kısa yol: parantezi açmadan önce 2'yi karşı tarafa geçir.",
      b12: "Önce + 1'i karşı tarafa geçir.",
      b23: "Parantezin önündeki eksi, içerideki bütün işaretleri değiştirir.",
    },
  },

  powers: {
    title: "Üslü ifadeler",
    blurb: "x³, x·x·x demektir. Kaç tane x olduğunu sayarsan üslü ifadelerin kurallarını kendin bulabilirsin.",
    lesson: [
      {
        title: "Üslü ifadelerde çarpma",
        text: [
          "`x³`, `x·x·x` demektir. Sağ üstteki küçük sayıya üs denir. Kaç tane x'in çarpıldığını gösterir.",
          "Yani `x²·x³`, iki x çarpı üç x'tir: toplam beş x. Tabanları aynı olan üslü ifadeler çarpılırken üsler toplanır.",
        ],
        steps: ["Tabanlar aynı: birini diğerinin üstüne bırak.", "Hesapla."],
      },
      {
        title: "Üssün üssü",
        text: ["`(x²)³`, `x²·x²·x²` demektir. Bu da 2 + 2 + 2 = 6 tane x eder; yani üsler çarpılır."],
        steps: ["Dıştaki 3'ü içteki 2'nin üstüne bırak.", "Hesapla."],
      },
      {
        title: "Üslü ifadelerde bölme",
        text: [
          "`x⁵/x²` ifadesinin payında beş, paydasında iki x var. Üstten ve alttan ikişer x sadeleşir, payda üç x kalır. Bölerken üsler çıkarılır.",
        ],
        steps: ["x²'yi x⁵'in üstüne bırak.", "Hesapla."],
      },
      {
        title: "Sıfırıncı ve negatif kuvvetler",
        text: [
          "`x³/x³` 1'e eşittir; ama aynı zamanda `x^(3 − 3) = x⁰`'dır. Yani bir sayının sıfırıncı kuvveti 1'dir.",
          "Alttaki x'ler üsttekilerden fazlaysa üs sıfırın altına iner: `x⁻²`, `1/x²` demektir. Bir kuvvet kesir çizgisinin öbür tarafına geçince üssünün işareti değişir.",
        ],
        steps: ["x³'ü yukarı, kesir çizgisinin öbür tarafına sürükle."],
        watch: "`2x³`, `2·x·x·x` demektir: üs yalnızca x'e aittir. `(2x)³` ise farklıdır: `8x³` eder.",
      },
    ],
    hints: {
      w6: "x³'ü yukarı, kesir çizgisinin öbür tarafına sürükle.",
      w1: "Tabanlar aynı: birini diğerinin üstüne bırak, sonra üsleri topla.",
      w11: "Tek başına x, x¹ demektir.",
      w2: "Dıştaki 3'ü içteki 2'nin üstüne bırak, sonra çarp.",
      w5: "Cevabın üssü negatif.",
      w3: "2'yi parantezin dışına çek. Onun da küpü alınır.",
      w21: "Önce parantezi aç: x çarpı x², x³ eder.",
      w25: "Her terimi x⁻¹ ile çarp. x⁻¹ çarpı x, x⁰ eder.",
      w30: "(x² + 3)(x² + 3) olarak yaz, sonra her terimi her terimle çarp.",
    },
  },

  factor: {
    title: "Çarpanlara ayırma",
    blurb: "Çarpanlara ayırma, parantez açmanın tersidir. Her terimde ortak olan bir çarpan bul ve onu parantezin önüne al.",
    lesson: [
      {
        title: "Parantez açmanın tersi",
        text: [
          "Çarpanlara ayırma, parantez açmayı geri alır. `x² + 3x` demek `x·x + 3·x` demektir. İki terimde de `x` var, yani onu öne alabilirsin: `x(x + 3)`.",
        ],
        steps: [
          "x²'yi açık hâliyle yazmak için üsteki ²'ye dokun.",
          "Artık iki terimde de x var. x'lerden birini en soldan dışarı, öne sürükle.",
        ],
        after: "Sağlamak için x(x + 3)'ü aç. Yine x² + 3x bulursun.",
      },
      {
        title: "Sayıları çarpanlarına ayırma",
        text: ["Ortak çarpanı bulmak için sayıları çarpanlarına ayır. `2x + 6` ifadesinde 6'ya dokunursan `2·3` olur. Artık iki terimde de 2 var."],
        steps: ["6'yı çarpanlarına ayırmak için ona dokun.", "Bir 2'yi öne sürükle."],
      },
      {
        title: "Parantezi ortak çarpan olarak alma",
        text: [
          "`x(x + 2) + 3(x + 2)` ifadesinde iki terimde de aynı parantez var: `(x + 2)`. Bu bir ortak çarpandır, yani onu da her çarpan gibi öne alabilirsin.",
        ],
        steps: ["(x + 2)'yi öne sürükle."],
      },
      {
        title: "Dört terim: ikişer ikişer grupla",
        text: [
          "Dört terim varsa önce ilk ikisini, sonra son ikisini çarpanlarına ayır. İki parantez aynı çıkarsa o parantezi de ortak çarpan olarak öne al.",
        ],
        watch: "Çarpanlara ayırdıktan sonra her zaman yeniden çarparak sağlamasını yap. Başladığın ifadenin aynısı çıkmalı.",
      },
    ],
    hints: {
      g5: "İki terimde de aynı parantez var. Onu öne al.",
      g1: "x²'yi x·x olarak yazmak için üsteki ²'ye dokun. Böylece iki terimde de x olur.",
      g2: "6'yı çarpanlarına ayırmak için ona dokun.",
      g15: "Hem 6'yı hem 9'u bölen sayı hangisi?",
      g21: "Kareyi çarpım olarak yaz. Böylece iki terimde de (x + 1) olur.",
      g22: "2x + 6'yı çarpanlarına ayır. Bir (x + 3) çıkıyor mu?",
      g6: "İkişer ikişer çalış: x²'deki bir x'i 2x'in üstüne, sonra bir 3'ü 6'nın üstüne bırak.",
      g29: "Dört terimin hepsinde 2 çarpanı var. Önce onu öne al, sonra kalanları ikişer ikişer çarpanlarına ayır.",
    },
  },

  formulas: {
    title: "Formülleri dönüştürme",
    blurb: "Formül, içinde birden çok harf olan bir denklemdir. Bir harfi yalnız bırakmak için x'te kullandığın hamlelerin aynısını kullan.",
    lesson: [
      {
        title: "Bir harfi diğerleri cinsinden yazma",
        text: [
          "`v = u + at` formülü, bir hızı (`v`) ilk hızdan (`u`), ivmeden (`a`) ve süreden (`t`) bulur. Formülü düzenlersen bu kez süreyi verir: `t = (v − u)/a`.",
          "Bir harfi yalnız bırakmaya, o harfi diğerleri cinsinden yazmak denir. x'i bulmak gibidir: öteki harfleri birer sayıymış gibi düşün.",
        ],
        steps: ["t, a ile çarpılmış. Önce u'yu karşı tarafa geçir.", "Şimdi a'yı karşı tarafa geçir. Öbür tarafı böler."],
        after: "Sağdan sola oku: t = (v − u)/a.",
      },
      {
        title: "Harfler de sayılar gibi hareket eder",
        text: [
          "Bir tarafın tamamıyla çarpılan bir harf, `=` işaretinin karşı tarafına geçip öbür tarafı bölebilir; tıpkı `2x = 8` denkleminin `x = 8/2` olması gibi. (Yalnızca 0 olmayan bir harfe bölebilirsin. Bu formüllerde hiçbiri 0 olmaz.)",
        ],
        steps: ["m'yi karşı tarafa geçir."],
        watch: "Karşıya yalnızca bir tarafın tamamıyla çarpılan çarpan geçebilir. `u + at` ifadesinde `a` yalnızca `t` ile çarpılıyor; o yüzden önce `u`'yu geçir.",
      },
      {
        title: "Paydadaki harfler",
        text: [
          "Bir tarafın tamamı kesirse, paydadaki harf karşıya geçip öbür tarafla çarpılabilir; tıpkı `x/3 = 4` denkleminin `x = 4·3` olması gibi.",
        ],
        steps: ["A'yı karşı tarafa geçir. Öbür tarafla çarpılır."],
      },
      {
        title: "Harf iki yerde geçiyorsa",
        text: [
          "`ax + bx = c` denkleminde x iki yerde geçiyor; bu yüzden tek bir terimi taşımak x'i yalnız bırakmaz. Önce x'i ortak çarpan olarak öne al. Sonra x'in çarpıldığı parantez karşıya geçebilir.",
        ],
        steps: ["İki terimde de x var. x'lerden birini öne sürükle.", "Şimdi (a + b)'nin tamamını karşı tarafa geçir."],
      },
    ],
    hints: {
      q6: "A paydada. Onu karşı tarafa geçir.",
      q8: "Önce u'yu, sonra a'yı karşı tarafa geçir.",
      q16: "x iki yerde geçiyor. Önce onu ortak çarpan olarak öne al.",
      q17: "P iki terimde de var.",
      q22: "İki x'li terimi aynı tarafta topla, sonra x'i ortak çarpan olarak öne al.",
    },
  },

  inequalities: {
    title: "Eşitsizlikler",
    blurb: "Eşitsizlikler de denklemler gibi çözülür, tek bir farkla: negatif bir sayıyla çarpar ya da bölersen eşitsizliğin yönü değişir.",
    lesson: [
      {
        title: "Küçüktür ve büyüktür",
        text: ["`x < 7`, x'in 7'den küçük olduğunu söyler. İşaretin açık ağzı büyük olana bakar."],
        steps: ["Denklemlerde olduğu gibi 2'yi karşı tarafa geçir.", "Hesapla."],
      },
      {
        title: "Tarafların yerini değiştirme",
        text: [
          "`3 > x` ile `x < 3` aynı şeyi söyler: x, 3'ten küçüktür. Yani iki tarafın yerini değiştirebilirsin; yeter ki işaretin yönünü de çevir.",
        ],
        steps: ["3'ü öbür tarafa sürükle. İşaretin yönü değişir."],
      },
      {
        title: "Denklemlerdeki hamlelerin aynısı",
        text: [
          "İki tarafa aynı sayıyı eklemek ya da iki taraftan aynı sayıyı çıkarmak işaretin yönünü değiştirmez. İki tarafı pozitif bir sayıyla çarpmak ya da bölmek de değiştirmez.",
        ],
        steps: ["2'yi karşı tarafa geçir. 2 pozitif olduğu için işaretin yönü aynı kalır.", "Hesapla."],
      },
      {
        title: "Eksi, yönü değiştirir",
        text: ["−1 ile çarpmak sıralamayı tersine çevirir: `2 < 3`, ama `−2 > −3`. Bu yüzden bir eksi karşı tarafa geçince işaretin yönü değişir."],
        steps: ["Yalnızca eksiyi karşı tarafa sürükle. < işaretinin yönü değişir."],
        after: "Bir sayıyla dene: x = 0 hem −x < 4'ü hem de x > −4'ü sağlar.",
        watch: "İşaretin yönünü yalnızca negatif bir sayıyla çarpmak ya da bölmek değiştirir. Bir terimi karşı tarafa geçirmek asla değiştirmez.",
      },
    ],
    hints: {
      i3: "Eksiyi karşı tarafa sürükle. İşaretin yönü değişir.",
      i1: "Denklemlerde olduğu gibi 3'ü karşı tarafa geçir.",
      i8: "Sol tarafın tamamını öbür tarafa sürükle: 5 < x + 2 ile x + 2 > 5 aynı şeyi söyler.",
      i5: "Önce eksiyi, sonra 2'yi karşı tarafa geçir.",
      i26: "Önce parantezi aç, sonra x'li terimleri aynı tarafta topla.",
    },
  },

  fractions: {
    title: "Kesirler",
    blurb: "Kesirleri toplamak için önce paydaları eşitle. Payı ve paydayı aynı sayıyla çarpmak kesrin değerini değiştirmez.",
    lesson: [
      {
        title: "Kesirlerde toplama",
        text: [
          "`3/4`, dörtte üç demektir. Paydalar aynıysa yalnızca payları toplarsın: beşte bir artı beşte iki, beşte üç eder; yani `1/5 + 2/5 = 3/5`.",
        ],
        steps: ["Paydalar aynı. Kesirlerden birini diğerinin üstüne bırak.", "Hesapla."],
      },
      {
        title: "Denk kesirler",
        text: [
          "Payı ve paydayı aynı sayıya bölmek kesrin değerini değiştirmez: `6/8 = 3/4`. Buna sadeleştirme denir.",
          "Payı ve paydayı aynı sayıyla çarpmak da değiştirmez: `1/2 = 2/4 = 3/6`. Buna da genişletme denir.",
        ],
        steps: ["8'i 6'nın üstüne bırak. İkisi de ortak çarpanları olan 2'ye bölünür."],
      },
      {
        title: "Paydaları eşitleme",
        text: [
          "`1/2 + 1/3` toplamını bulmak için önce ikisini de paydası 6 olan kesirlere çevir. `1/2` kesrinin payını ve paydasını 3'le, `1/3` kesrininkileri de 2'yle çarp. Artık iki payda da 6.",
        ],
        steps: ["⅓ kesrindeki 3'ü ½ kesrinin üstüne sürükle: payı ve paydası 3'le çarpılır."],
        watch: "`1/2 + 1/3`, `2/5` etmez. Paylar ancak paydalar zaten aynıysa toplanır.",
      },
      {
        title: "Kesirlerde çarpma",
        text: ["Çarpma daha kolay: payları çarp, paydaları çarp. Üçte birin yarısı `(1·1)/(2·3) = 1/6` eder."],
        steps: ["Kesirlerden birini diğerinin üstüne bırak."],
        after: "Sonra pay ile paydadaki ortak çarpanları sadeleştir; sonuç 3/2 olur.",
      },
    ],
    hints: {
      f1: "8'i 6'nın üstüne bırak.",
      f2: "Paydalar aynı: kesirlerden birini diğerinin üstüne bırak.",
      f6: "2'yi payın içinden dışarı çek.",
      f5: "3'ü 2'nin üstüne sürükle.",
      f22: "Önce payı çarpanlarına ayır. O zaman pay ile paydada sadeleşecek ortak bir çarpan çıkar.",
      f8: "¾ kesrini yukarı, kesir çizgisinin öbür tarafına sürükle.",
      f3: "Paydaları eşitlemek için 3'ü ½ kesrinin, 2'yi de ⅓ kesrinin üstüne sürükle.",
      f4: "6'yı çarpanlarına ayırmak için ona dokun.",
      f17: "4'ü çarpanlarına ayırmak için ona dokun. 4, 2·2'dir.",
      f28: "Önce 1 + ½ toplamını tek bir kesre çevir.",
    },
  },

  simultaneous: {
    title: "Denklem sistemleri",
    blurb: "İki bilinmeyenli iki denklem, ikisi de aynı anda doğru. Denklemlerden birinde bir harfi yalnız bırak, sonra onu öbür denklemde yerine koy.",
    lesson: [
      {
        title: "Aynı anda iki denklem",
        text: [
          "`y = 2x` ve `x + y = 9`, aynı x ve y için yazılmış iki denklemdir. İki bilinmeyenli tek bir denklemin pek çok çözümü vardır. İki denklem birlikte ise genellikle tek bir çözüm verir.",
          "Çözmek için harflerden birinden kurtul. Geriye tek bilinmeyenli bir denklem kalır; onu çözmeyi zaten biliyorsun.",
        ],
      },
      {
        title: "Yerine koyma",
        text: ["`y = 2x`, y ile 2x'in eşit olduğunu söyler. Yani öbür denklemde y yerine 2x yazabilirsin. Buna yerine koyma yöntemi denir."],
        steps: ["y = 2x denklemindeki y'yi öbür denklemdeki y'nin üstüne sürükle.", "Artık bu denklemde yalnızca x var. x'leri topla."],
        after: "Çöz: x = 3. Sonra y'yi bulmak için x = 3'ü y = 2x denkleminde yerine koy.",
      },
      {
        title: "Bir harfi yalnız bırakma",
        text: [
          "Yerine koyabilmek için `y = …` ya da `x = …` biçiminde bir denkleme ihtiyacın var. Yoksa kendin oluştur: `x − y = 1` denkleminde −y'yi karşı tarafa geçirirsen `x = 1 + y` olur.",
        ],
        steps: [
          "İkinci denklemde −y'yi = işaretinin karşı tarafına sürükle.",
          "Artık x yalnız. Onu birinci denklemdeki x'in üstüne sürükle.",
        ],
        after: "Artık birinci denklemde yalnızca y var: 2y + 1 = 7, yani y = 3.",
        watch: "İfadenin tamamını yerine koy. x = 1 + y ise 2x, 2 + y değil 2(1 + y) olur.",
      },
      {
        title: "Öbür harfi bulma",
        text: [
          "Harflerden birini bulduğunda, örneğin `x = 3`, onu öbür denklemde yerine koyarak diğer harfi bul. `x = 3` denklemindeki x'i öbür denklemdeki bir x'in üstüne sürükle.",
        ],
      },
    ],
    hints: {
      e1: "y, 3'e eşit: y = 3 denklemindeki y'yi öbür denklemdeki y'nin üstüne sürükle.",
      e4: "y = 2x denklemindeki y'yi öbür denklemdeki y'nin üstüne sürükle. x'i bulunca onu y = 2x denkleminde yerine koy.",
      e18: "Henüz hiçbir harf yalnız değil. −y'yi karşı tarafa geçirip x = 1 + y elde et. Sonra yerine koy.",
      e21: "Birinci denklemde y'yi yalnız bırak: y = 5 − x.",
      e27: "x = 1 + y olduğundan 2x, 2(1 + y) olur. Parantezin tamamını kullan.",
    },
  },

  roots: {
    title: "Köklü ifadeler",
    blurb: "√x, x üzeri ½ demektir. Bu yüzden üslü ifadelerin kuralları kökler için de geçerlidir.",
    lesson: [
      {
        title: "Karekök",
        text: ["`√9`, kendisiyle çarpılınca 9 eden sayıdır. Bu sayı 3'tür, çünkü `3·3 = 9`."],
        steps: ["9'u eşit çarpanlara ayırmak için ona dokun."],
        after: "Sonra 3'lerden birini kökün dışına çıkar. Nasıl işlediğini gördükten sonra √9 gibi bir köke dokunup onu tek adımda hesaplayabilirsin.",
      },
      {
        title: "Kök de bir kuvvettir",
        text: ["`√x`, `x` üzeri `½` demektir. Yani `√x·√x = x^(1/2 + 1/2) = x`. Üslü ifadelerin bütün kuralları kökler için de geçerlidir."],
        steps: ["Ona dokun: üssü ½ olan bir kuvvet, kareköktür."],
      },
      {
        title: "Çarpımın kökü",
        text: ["Bir çarpımın kökü, köklerin çarpımına eşittir: `√(4x) = √4·√x = 2√x`."],
        steps: ["4'ü kökün içinden dışarı çek. Ona ayrı bir √ gelir."],
        after: "√4 de 2 olduğundan sonuç 2√x olur.",
        watch: "Kök, toplama dağılmaz: `√(9 + 16)`, `√25 = 5` eder; `3 + 4` etmez.",
      },
      {
        title: "Kökten kurtulma",
        text: [
          "`√x = 3` denklemini çözmek için iki tarafın karesini al. Köke dokunup onu `x^(1/2)` olarak yaz. Sonra ½ üssünü = işaretinin karşı tarafına sürükle. Karşı tarafta kare olur.",
        ],
        steps: ["Kökü kuvvet olarak yazmak için ona dokun.", "½ üssünü = işaretinin karşı tarafına sürükle. Kare olur.", "Hesapla."],
      },
    ],
    hints: {
      r2: "Ona dokun.",
      r5: "√x'lerden birini diğerinin üstüne bırak. Bir karekökü kendisiyle çarparsan geriye kökün içindeki kalır.",
      r16: "√3'ü bir harf gibi düşün: 2√3 + √3, tıpkı 2x + x gibi toplanır.",
      r1: "Hesaplamak için √ işaretine dokun. Ya da 9'a dokunup 3·3'e ayır, sonra 3'lerden birini kökün dışına çıkar.",
      r8: "Kökü kuvvet olarak yazmak için ona dokun, sonra ½ üssünü = işaretinin karşı tarafına sürükle.",
      r6: "Köke dokunup onu üssü ½ olan bir kuvvet olarak yaz, sonra ½ üssünü 2'nin üstüne bırak.",
      r3: "4'ü kökün içinden dışarı çek. Ona ayrı bir √ gelir.",
      r20: "x³, x²·x demektir; x² de kökün dışına x olarak çıkar.",
      r11: "Önce √x'i yalnız bırak.",
      r4: "12'ye dokunup ondan bir tam kare ayır.",
      r22: "Önce 4'ü dışarı çek: o zaman √x'ler benzer terim olur.",
      r29: "İçeride bir tam kare bulmak için 8'i çarpanlarına ayır.",
    },
  },

  explog: {
    title: "Üstel ifadeler ve logaritma",
    blurb: "ln(x), e'nin hangi kuvvetinin x ettiğini söyler. Bu yüzden ln ile e^ birbirini geri alır, bir çarpımın logaritması da logaritmaların toplamıdır.",
    lesson: [
      {
        title: "ln ne demek?",
        text: [
          "`e` özel bir sayıdır, yaklaşık 2,718. `ln(x)`, e'nin x'i veren kuvvetidir. Yani `ln(e³) = 3`.",
          "Bu yüzden ln ile e^ birbirini geri alır: `e^(ln x) = x`.",
        ],
        steps: ["e'yi ln'in üstüne bırak. Birbirlerini götürürler."],
      },
      {
        title: "Çarpımın logaritması",
        text: [
          "e'nin kuvvetleri çarpılırken üsleri toplanır. Bu yüzden bir çarpımın logaritması, logaritmaların toplamıdır: `ln(2x) = ln(2) + ln(x)`.",
        ],
        steps: ["2'yi ln'in içinden dışarı çek. Ona ayrı bir ln gelir."],
      },
      {
        title: "Kuvvetin logaritması",
        text: ["`x³`, `x·x·x` demektir; bu yüzden `ln(x³) = ln(x) + ln(x) + ln(x) = 3ln(x)`."],
        steps: ["3'ü ln'in önüne sürükle."],
      },
      {
        title: "Logaritmayla denklem çözme",
        text: [
          "x'i üsten indirmek için iki tarafın ln'ini al. `e^x = 5` denkleminde e'yi = işaretinin karşı tarafına sürükle. Orada ln olur: `x = ln(5)`.",
        ],
        steps: ["e'yi = işaretinin karşı tarafına sürükle."],
      },
    ],
    hints: {
      l2: "e'yi ln'in üstüne bırak.",
      l3: "ln'i içindeki ifadenin üstüne bırak.",
      l4: "3'ü öne sürükle.",
      l19: "Logaritmalar çıkarılırken içlerindekiler bölünür.",
      l8: "e'yi = işaretinin karşı tarafına sürükle.",
      l20: "e'deki hamlenin aynısı, ama burada 2, log₂ olur.",
      l12: "Kök de bir kuvvettir. √ işaretini öne sürükle.",
      l15: "e'nin kaçıncı kuvveti 1 eder?",
      l1: "x'i ln'in önüne sürükle. ln(e) kaçtır?",
      l14: "Önce ½ çarpanını ln'in içine bırak.",
      l7: "8'e dokunup onu 2'nin kuvveti olarak yaz. Sonra 3'ü öne sürükle ve log₂(2)'ye dokun.",
      l22: "Tabanlar aynı, o yüzden üsleri topla.",
      l23: "Önce ln'i ikiye ayır. ln(e) kaçtır?",
      l26: "Önce kuvveti yalnız bırak.",
    },
  },
};
