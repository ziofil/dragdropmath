import { describe, expect, it } from "vitest";
import { CHAPTERS } from "../game/puzzles";
import { chapterText, englishText, LANGS, type Lang } from ".";
import { readSet } from "../game/sets";
import { t, setLang } from ".";

/** The `backticked` maths in a piece of text, in order. */
const maths = (s: string) => s.split("`").filter((_, i) => i % 2 === 1);

describe.each(LANGS.filter((l) => l.code !== "en").map((l) => l.code))("%s", (lang) => {
  it.each(CHAPTERS.map((c) => [c.id, c] as const))("chapter %s has the English one's shape and maths", (_, chapter) => {
    const en = englishText(chapter);
    const tr = chapterText(chapter, lang as Lang);
    expect(tr, "no translation").not.toBe(undefined);
    expect(tr.lesson.length, "lesson parts").toBe(en.lesson.length);
    en.lesson.forEach((part, i) => {
      const other = tr.lesson[i];
      const at = `part ${i + 1}`;
      expect(other.text.length, `${at}: paragraphs`).toBe(part.text.length);
      part.text.forEach((p, k) => expect(maths(other.text[k]), `${at}, paragraph ${k + 1}`).toEqual(maths(p)));
      expect(other.steps?.length, `${at}: example steps`).toBe(part.steps?.length);
      expect(!!other.after, `${at}: example's closing remark`).toBe(!!part.after);
      expect(!!other.watch, `${at}: watch out`).toBe(!!part.watch);
      if (part.watch) expect(maths(other.watch!), `${at}: watch out`).toEqual(maths(part.watch));
    });
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
