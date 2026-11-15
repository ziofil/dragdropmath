// Every translation, always checked (English only or not): it holds nothing English no longer has, in the same shape,
// and a report says how much of English it covers (English stands in for the rest).
import { afterAll, describe, expect, it } from "vitest";
import { CHAPTERS } from "../game/puzzles";
import { readSet } from "../game/sets";
import { chapterText, en, englishText, LANGS, loadLanguage, t, TRANSLATIONS, type Lang } from ".";

type Other = Exclude<Lang, "en">;
const OTHERS = LANGS.map((l) => l.code).filter((c): c is Other => c !== "en");

/** The `backticked` maths in a piece of text, in order. */
const maths = (s: string) => s.split("`").filter((_, i) => i % 2 === 1);
const kind = (v: unknown) => (Array.isArray(v) ? "list" : typeof v);

const report: string[] = [];
afterAll(() => console.log(`Translations (share of the English strings; English stands in for the rest):\n${report.join("\n")}`));

describe.each(OTHERS)("%s", (lang) => {
  it("has nothing English doesn't, each in the same shape", async () => {
    const tr = await TRANSLATIONS[lang]();
    for (const [key, value] of Object.entries(tr)) {
      expect(key in en, `${key}: English has no such string`).toBe(true);
      if (key === "drills") continue;
      expect(kind(value), key).toBe(kind(en[key as keyof typeof en]));
    }
    for (const [id, words] of Object.entries(tr.drills ?? {})) {
      const english = en.drills[id as keyof typeof en.drills];
      expect(english, `drills.${id}: English has no such move`).toBeDefined();
      for (const field of Object.keys(words ?? {})) expect(field in english, `drills.${id}.${field}`).toBe(true);
    }
    const keys = Object.keys(en).filter((k) => k !== "drills");
    const drills = Object.keys(en.drills);
    const done = keys.filter((k) => k in tr).length;
    const drillsDone = drills.filter((d) => tr.drills?.[d as keyof typeof en.drills]?.how).length;
    const off = CHAPTERS.filter((c) => maths(chapterText(c, lang).blurb).join() !== maths(englishText(c).blurb).join()).length;
    report.push(`  ${lang}: ${Math.round((100 * done) / keys.length)}% of strings, ${drillsDone}/${drills.length} moves${off ? `, ${off} chapter blurbs with other maths than the English` : ""}`);
  });

  it("names every chapter", () => {
    for (const c of CHAPTERS) {
      const words = chapterText(c, lang);
      expect(words.title && words.blurb, c.id).toBeTruthy();
    }
  });

  it("has an example set that checks out", async () => {
    await loadLanguage(lang);
    try {
      const r = readSet(t().exampleSet);
      expect(r.problems).toEqual([]);
      expect(r.exercises.map((e) => e.problems)).toEqual([[], [], []]);
    } finally {
      await loadLanguage("en");
    }
  });
});
