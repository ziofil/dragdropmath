import { describe, expect, it } from "vitest";
import { CHAPTERS } from "../game/puzzles";
import { chapterText, englishText, ENGLISH_ONLY, LANGS, type Lang } from ".";
import { readSet } from "../game/sets";
import { t, setLang } from ".";

/** The `backticked` maths in a piece of text, in order. */
const maths = (s: string) => s.split("`").filter((_, i) => i % 2 === 1);

// Paused while the site is English only: the lessons may change before they are translated again.
describe.skipIf(ENGLISH_ONLY).each(LANGS.filter((l) => l.code !== "en").map((l) => l.code))("%s", (lang) => {
  it.each(CHAPTERS.map((c) => [c.id, c] as const))("chapter %s has the English one's shape and maths", (_, chapter) => {
    const en = englishText(chapter);
    const tr = chapterText(chapter, lang as Lang);
    expect(tr, "no translation").not.toBe(undefined);
    expect(tr.title && tr.blurb, "title and blurb").toBeTruthy();
    expect(maths(tr.blurb), "blurb").toEqual(maths(en.blurb));
  });

  it("its example set checks out", () => {
    setLang(lang as Lang);
    try {
      const r = readSet(t().exampleSet);
      expect(r.problems).toEqual([]);
      expect(r.exercises.map((e) => e.problems)).toEqual([[], [], []]);
    } finally {
      setLang("en");
    }
  });
});
