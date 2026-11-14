/**
 * The site's languages. English is the source: the interface strings are in
 * en.ts, and the lessons are in the chapters themselves (game/chapters/). Every
 * other language gives the same strings (ui.ts, checked by the type checker)
 * and the chapters' text (chapters.ts, checked against the English in
 * i18n.test.ts: same parts, same steps, same maths).
 *
 * The language is the viewer's choice (kept in this browser), else their
 * browser's, else English. Switching re-renders the whole app (App is keyed by it).
 */
import { useSyncExternalStore } from "react";
import type { Chapter, Guided, LessonPart } from "../game/puzzles";
import { en, type Strings } from "./en";
import { it } from "./it/ui";
import { es } from "./es/ui";
import { de } from "./de/ui";
import { fr } from "./fr/ui";
import { pt } from "./pt/ui";
import { pl } from "./pl/ui";
import { nl } from "./nl/ui";
import { tr } from "./tr/ui";
import { el } from "./el/ui";
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
export type { Strings };

/** A chapter's words in one language: everything in it that isn't maths or structure. */
export type ChapterText = {
  title: string;
  blurb: string;
  lesson: {
    title: string;
    text: string[];
    /** The example's instructions (`say`), one per step, if the part has an example. */
    steps?: string[];
    /** The example's closing remark, if it has one. */
    after?: string;
    watch?: string;
  }[];
};

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

const UI: Record<Lang, Strings> = { en, it, es, de, fr, pt, pl, nl, tr, el };
const CHAPTERS_IN: Record<Exclude<Lang, "en">, ChapterTexts> = { it: itChapters, es: esChapters, de: deChapters, fr: frChapters, pt: ptChapters, pl: plChapters, nl: nlChapters, tr: trChapters, el: elChapters };

const KEY = "mathbyhand.lang.v1";
const isLang = (s: unknown): s is Lang => LANGS.some((l) => l.code === s);

function initialLang(): Lang {
  try {
    const kept = localStorage.getItem(KEY);
    if (isLang(kept)) return kept;
  } catch {
    /* storage unavailable: fall through to the browser's languages */
  }
  const wanted = typeof navigator === "undefined" ? [] : navigator.languages ?? [navigator.language];
  for (const w of wanted) {
    const code = w?.slice(0, 2).toLowerCase();
    if (isLang(code)) return code;
  }
  return "en";
}

let current: Lang = initialLang();
const listeners = new Set<() => void>();

export const getLang = (): Lang => current;

export function setLang(lang: Lang): void {
  if (lang === current) return;
  current = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* it just won't be remembered */
  }
  listeners.forEach((l) => l());
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getLang,
    getLang,
  );
}

/** The interface strings in the current language. */
export const t = (): Strings => UI[current];

/** The chapter's words in the current language (English: its own). */
export function chapterText(chapter: Chapter, lang: Lang = current): ChapterText {
  if (lang !== "en") {
    const words = CHAPTERS_IN[lang][chapter.id];
    if (words) return words;
  }
  return englishText(chapter);
}

export function englishText(chapter: Chapter): ChapterText {
  return {
    title: chapter.title,
    blurb: chapter.blurb,
    lesson: chapter.lesson.map(partText),
  };
}

function partText(part: LessonPart): ChapterText["lesson"][number] {
  return {
    title: part.title,
    text: part.text,
    ...(part.example ? exampleText(part.example) : {}),
    ...(part.watch ? { watch: part.watch } : {}),
  };
}

const exampleText = (ex: Guided) => ({ steps: ex.steps.map((s) => s.say), ...(ex.after ? { after: ex.after } : {}) });

/** Every chapter title, in every language (sets name a chapter by its title in any of them). */
export function allTitles(chapter: Chapter): string[] {
  return [chapter.title, ...Object.values(CHAPTERS_IN).map((c) => c[chapter.id]?.title).filter((s): s is string => !!s)];
}
