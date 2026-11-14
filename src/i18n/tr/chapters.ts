import type { ChapterTexts } from "..";

export const trChapters: ChapterTexts = {
  shuffle: {
    title: "Terimleri sıralama",
    blurb: "Toplamada terimlerin sırası fark etmez. İfadedeki sayılar da hesaplanıp tek bir sayıya indirilebilir.",
  },

  collect: {
    title: "Benzer terimler",
    blurb: "Harfleri aynı olan terimler toplanabilir: 3x + 2x = 5x. Bir terimden kendisini çıkarırsan 0 kalır.",
  },

  distribute: {
    title: "Dağılma özelliği",
    blurb: "Parantezin önündeki sayı, içerideki her terimle çarpılır. Her terimde ortak olan bir çarpan da yeniden parantezin önüne alınabilir.",
  },

  brackets: {
    title: "Parantezleri çarpma",
    blurb: "İki parantezi çarpmak için birinci parantezdeki her terimi ikinci parantezdeki her terimle çarp.",
  },

  balance: {
    title: "Denklem çözme",
    blurb: "Eşitliğin iki tarafına aynı işlemi yaparsan eşitlik bozulmaz. = işaretinin karşı tarafına geçen terim, orada ters işleme dönüşür.",
  },

  powers: {
    title: "Üslü ifadeler",
    blurb: "x³, x·x·x demektir. Kaç tane x olduğunu sayarsan üslü ifadelerin kurallarını kendin bulabilirsin.",
  },

  factor: {
    title: "Çarpanlara ayırma",
    blurb: "Çarpanlara ayırma, parantez açmanın tersidir. Her terimde ortak olan bir çarpan bul ve onu parantezin önüne al.",
  },

  formulas: {
    title: "Formülleri dönüştürme",
    blurb: "Formül, içinde birden çok harf olan bir denklemdir. Bir harfi yalnız bırakmak için x'te kullandığın hamlelerin aynısını kullan.",
  },

  inequalities: {
    title: "Eşitsizlikler",
    blurb: "Eşitsizlikler de denklemler gibi çözülür, tek bir farkla: negatif bir sayıyla çarpar ya da bölersen eşitsizliğin yönü değişir.",
  },

  fractions: {
    title: "Kesirler",
    blurb: "Kesirleri toplamak için önce paydaları eşitle. Payı ve paydayı aynı sayıyla çarpmak kesrin değerini değiştirmez.",
  },

  simultaneous: {
    title: "Denklem sistemleri",
    blurb: "İki bilinmeyenli iki denklem, ikisi de aynı anda doğru. Denklemlerden birinde bir harfi yalnız bırak, sonra onu öbür denklemde yerine koy.",
  },

  roots: {
    title: "Köklü ifadeler",
    blurb: "√x, x üzeri ½ demektir. Bu yüzden üslü ifadelerin kuralları kökler için de geçerlidir.",
  },

  explog: {
    title: "Üstel ifadeler ve logaritma",
    blurb: "ln(x), e'nin hangi kuvvetinin x ettiğini söyler. Bu yüzden ln ile e^ birbirini geri alır, bir çarpımın logaritması da logaritmaların toplamıdır.",
  },
};
