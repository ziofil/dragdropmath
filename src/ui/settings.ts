/**
 * The viewer's settings: language, skin, numbers in colour, debug mode. One store, kept in this
 * browser; components read it with `useSettings` and redraw in place when it
 * changes (nothing is remounted, so work in progress stays).
 *
 * A skin is the same site in another mood: it sets `data-skin` on <html>
 * (its tokens in styles.css) and the font the maths is drawn in, which layout
 * measures (render/measure.ts): the new font is fetched first, then
 * everything switches at once and the boards lay themselves out again.
 */
import { TOOLS } from "./tools";
import { clearTextWidths, setMathFamily } from "../render/measure";
import { createStore } from "../util/store";
import { readJson, writeJson } from "../util/storage";
import { ENGLISH_ONLY, isLang, loadLanguage, t, type Lang } from "../i18n";

export type SkinId = "modern" | "codex" | "paper" | "blackboard";

/** The themes, and the font each draws the maths in (their names are in i18n: skins). */
export const SKINS: { id: SkinId; math: string }[] = [
  { id: "modern", math: `"STIX Two Text"` },
  // Leonardo's notebooks: iron-gall ink and red chalk on parchment.
  { id: "codex", math: `"IM Fell English"` },
  // A LaTeX article: black on white, nothing else.
  { id: "paper", math: `"STIX Two Text"` },
  // The same article, in chalk: white on black.
  { id: "blackboard", math: `"STIX Two Text"` },
];

export type Settings = { lang: Lang; skin: SkinId; numbers: boolean; debug: boolean };

const KEYS = { lang: "mathbyhand.lang.v1", skin: "mathbyhand.skin.v1", numbers: "mathbyhand.numbers.v1", debug: "mathbyhand.debug" } as const;
const isFlag = (v: unknown): v is number => v === 0 || v === 1;
const isSkin = (v: unknown): v is SkinId => SKINS.some((s) => s.id === v);

function initial(): Settings {
  const debugParam = typeof location !== "undefined" && new URLSearchParams(location.search).has("debug");
  return {
    lang: initialLang(),
    skin: readJson<SkinId>(KEYS.skin, "modern", isSkin),
    numbers: readJson<number>(KEYS.numbers, 0, isFlag) === 1,
    // Debug mode is a tool for working on the app (tools.ts): never on the site itself.
    debug: TOOLS && (debugParam || readJson<number>(KEYS.debug, 0, isFlag) === 1),
  };
}

/** The kept language, else the browser's (not while ENGLISH_ONLY: only one picked in Settings), else English. */
function initialLang(): Lang {
  // Kept as plain text (not JSON) by earlier versions.
  const kept = readJson<Lang | null>(KEYS.lang, null, isLang) ?? rawLang();
  if (kept) return kept;
  if (ENGLISH_ONLY) return "en";
  for (const w of typeof navigator === "undefined" ? [] : (navigator.languages ?? [navigator.language])) {
    const code = w?.slice(0, 2).toLowerCase();
    if (isLang(code)) return code;
  }
  return "en";
}

function rawLang(): Lang | null {
  try {
    const v = localStorage.getItem(KEYS.lang);
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

const store = createStore<Settings>(initial());
const update = (patch: Partial<Settings>) => store.set({ ...store.get(), ...patch });

export const settings = store.get;
/** The settings, in a component: it redraws when they change. */
export const useSettings = store.use;

// ---------- each one ----------

const skinById = (id: SkinId) => SKINS.find((s) => s.id === id)!;
const TIMEOUT = 2500;

/** Fetch a maths font, giving up after a while (never hang on it): true if it came in time. */
function fetchFont(family: string): { inTime: Promise<boolean>; loaded: Promise<unknown> } {
  const loaded = Promise.all([document.fonts.load(`46px ${family}`), document.fonts.load(`italic 46px ${family}`)]);
  const inTime = Promise.race([loaded.then(() => true), new Promise<boolean>((r) => setTimeout(() => r(false), TIMEOUT))]).catch(() => false);
  return { inTime, loaded };
}

/** Its font fetched, then the skin on the page all at once. */
async function applySkin(id: SkinId): Promise<void> {
  const family = skinById(id).math;
  const font = fetchFont(family);
  const inTime = await font.inTime;
  if (store.get().skin !== id) return; // another was picked meanwhile
  document.documentElement.dataset.skin = id;
  setMathFamily(family);
  // Measured with a fallback font: measure again once the font is in.
  if (!inTime) font.loaded.then(() => store.get().skin === id && clearTextWidths(), () => {});
}

export function setSkin(id: SkinId): Promise<void> {
  writeJson(KEYS.skin, id);
  update({ skin: id });
  return applySkin(id);
}

function showLanguage() {
  document.documentElement.lang = t().htmlLang;
  document.title = t().pageTitle;
}

export async function setLang(lang: Lang): Promise<void> {
  writeJson(KEYS.lang, lang);
  await loadLanguage(lang);
  showLanguage();
  update({ lang });
}

/** Numbers drawn in the skin's number colour (--num), to tell them from letters at a glance. */
const applyNumbers = (on: boolean) => {
  if (on) document.documentElement.dataset.numbers = "colour";
  else delete document.documentElement.dataset.numbers;
};

export function setNumbers(on: boolean): void {
  writeJson(KEYS.numbers, on ? 1 : 0);
  update({ numbers: on });
  applyNumbers(on);
}

export function setDebug(on: boolean): void {
  if (!TOOLS) return;
  writeJson(KEYS.debug, on ? 1 : 0);
  update({ debug: on });
}

/** Before the first draw: the skin and its font, and the language. */
export async function startSettings(): Promise<void> {
  const { skin, lang, numbers } = store.get();
  applyNumbers(numbers);
  await Promise.all([applySkin(skin), loadLanguage(lang).catch(() => loadLanguage("en"))]);
  showLanguage();
}
