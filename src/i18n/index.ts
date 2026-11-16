/**
 * The site's languages. English is the source: the interface strings are in
 * en.ts, and the lessons are in the chapters themselves (game/chapters/). Every
 * other language gives the same strings (ui.ts, checked by the type checker,
 * loaded only when chosen) and the chapters' titles and blurbs (chapters.ts,
 * always here: a set may name its chapter in any language).
 *
 * For now the site is in English only (ENGLISH_ONLY): new text is written in
 * English until the design is settled, then translated. English stands in
 * for whatever a translation doesn't have yet (i18n.test.ts reports how much).
 *
 * Which language is shown is a setting (ui/settings.ts): it loads the
 * language with `loadLanguage` and redraws.
 */
import type { Chapter } from "../game/puzzles";
import { en, type Strings, type Translation } from "./en";
import { itChapters } from "./it/chapters";
import { esChapters } from "./es/chapters";
import { deChapters } from "./de/chapters";
import { frChapters } from "./fr/chapters";
import { ptChapters } from "./pt/chapters";
import { plChapters } from "./pl/chapters";
import { nlChapters } from "./nl/chapters";
import { trChapters } from "./tr/chapters";
import { elChapters } from "./el/chapters";

export { en };
export type { Strings, Translation };

/** A chapter's words in one language: everything in it that isn't maths or structure. */
export type ChapterText = { title: string; blurb: string };
export type ChapterTexts = Record<string, ChapterText>;

export const LANGS = [
  { code: "en", name: "English" },
  { code: "it", name: "Italiano" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
  { code: "pl", name: "Polski" },
  { code: "nl", name: "Nederlands" },
  { code: "tr", name: "Türkçe" },
  { code: "el", name: "Ελληνικά" },
] as const;

export type Lang = (typeof LANGS)[number]["code"];
export const isLang = (s: unknown): s is Lang => LANGS.some((l) => l.code === s);

/** Only English on the site, and no language picker, until the design is settled. */
export const ENGLISH_ONLY = true;

/** Each translation's strings, fetched when first wanted. */
export const TRANSLATIONS: Record<Exclude<Lang, "en">, () => Promise<Translation>> = {
  it: () => import("./it/ui").then((m) => m.it),
  es: () => import("./es/ui").then((m) => m.es),
  de: () => import("./de/ui").then((m) => m.de),
  fr: () => import("./fr/ui").then((m) => m.fr),
  pt: () => import("./pt/ui").then((m) => m.pt),
  pl: () => import("./pl/ui").then((m) => m.pl),
  nl: () => import("./nl/ui").then((m) => m.nl),
  tr: () => import("./tr/ui").then((m) => m.tr),
  el: () => import("./el/ui").then((m) => m.el),
};
const CHAPTERS_IN: Record<Exclude<Lang, "en">, ChapterTexts> = { it: itChapters, es: esChapters, de: deChapters, fr: frChapters, pt: ptChapters, pl: plChapters, nl: nlChapters, tr: trChapters, el: elChapters };

/** A translation, with English for what it doesn't have. */
const withEnglish = (l: Translation): Strings =>
  ({
    ...en,
    ...l,
    set: { ...en.set, ...l.set },
    drills: Object.fromEntries(Object.entries(en.drills).map(([k, w]) => [k, { ...w, ...l.drills?.[k as keyof Strings["drills"]] }])),
  }) as Strings;

let lang: Lang = "en";
let strings: Strings = en;

/** Make `l` the language of every string from now on (fetching it first). */
export async function loadLanguage(l: Lang): Promise<void> {
  const s = l === "en" ? en : withEnglish(await TRANSLATIONS[l]());
  lang = l;
  strings = s;
}

/** The interface strings in the current language. */
export const t = (): Strings => strings;
export const currentLang = (): Lang => lang;

/** The chapter's words in the current language (English: its own). */
export function chapterText(chapter: Chapter, l: Lang = lang): ChapterText {
  return (l !== "en" && CHAPTERS_IN[l][chapter.id]) || englishText(chapter);
}

export const englishText = (chapter: Chapter): ChapterText => ({ title: chapter.title, blurb: chapter.blurb });

/** Every chapter title, in every language (sets name a chapter by its title in any of them). */
export function allTitles(chapter: Chapter): string[] {
  return [chapter.title, ...Object.values(CHAPTERS_IN).map((c) => c[chapter.id]?.title).filter((s): s is string => !!s)];
}
