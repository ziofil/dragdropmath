import type { ChapterTexts } from "..";

export const trChapters: ChapterTexts = {
  shuffle: {
    title: "Terimleri sıralama",
    blurb: "Terimler herhangi bir sırayla toplanabilir; yalnızca sayılardan oluşan işlemler de hesaplanabilir.",
  },

  collect: {
    title: "Benzer terimler",
    blurb: "Harfleri aynı olan terimler toplanabilir: 3x + 2x = 5x. Bir terimden kendisini çıkarırsan 0 kalır.",
  },

  distribute: {
    title: "Dağılma özelliği",
    blurb: "Parantezin önündeki sayı, içerideki her terimle çarpılır.",
  },

  brackets: {
    title: "Parantezleri çarpma",
    blurb: "İki parantezi çarpmak için birinci parantezdeki her terimi ikinci parantezdeki her terimle çarp.",
  },

  balance: {
    title: "Denklem çözme",
    blurb: "İki tarafa aynı işlemi yaparsan denklem doğru kalır. = işaretinin karşı tarafına geçen her şey orada tersini yapar: artı eksi olur, çarpma bölme olur, kök kuvvet olur, logaritma kuvvet olur.",
  },

  powers: {
    title: "Üslü ifadeler",
    blurb: "x³, x·x·x demektir. Kaç tane x olduğunu sayarsan üslü ifadelerin kurallarını kendin bulabilirsin.",
  },

  factor: {
    title: "Çarpanlara ayırma",
    blurb: "Çarpanlara ayırmak, bir toplamı çarpım olarak yazmaktır. Her terimde bulunan bir çarpan, parantezin önüne bir kez yazılabilir: 3x + 3y = 3(x + y).",
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
    blurb: "√x, x üzeri ½; ∛x de x üzeri ⅓ demektir. Bu yüzden üslü ifadelerin kuralları kökler için de geçerlidir.",
  },

  explog: {
    title: "Üstel ifadeler ve logaritma",
    blurb: "ln(x), e'nin hangi kuvvetinin x ettiğini söyler. Bu yüzden ln ile e^ birbirini geri alır, bir çarpımın logaritması da logaritmaların toplamıdır.",
  },
};
