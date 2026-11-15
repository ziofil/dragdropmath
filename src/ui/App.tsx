import { useEffect, useLayoutEffect, useMemo, useSyncExternalStore } from "react";
import { chapterById } from "../game/puzzles";
import { ChapterView } from "./ChapterView";
import { Home } from "./Home";
import { SetMaker, SetRoute } from "./SetView";
import { Sandbox } from "./Sandbox";
import { ExerciseRoute } from "./Practice";
import { NotFound } from "./NotFound";
import { useDebugShortcut } from "./debug";
import { setDebug, setLang, setSkin, SKINS, useSettings, type SkinId } from "./settings";
import { anchorOf, href, parse, type Route } from "./routes";
import { ENGLISH_ONLY, LANGS, t, type Lang } from "../i18n";

const subscribeHash = (f: () => void) => {
  window.addEventListener("hashchange", f);
  return () => window.removeEventListener("hashchange", f);
};
const hashNow = () => window.location.hash;

/** Where a route points on its page: an element, or the top. The one place that scrolls. */
function scrollTo(route: Route) {
  const id = anchorOf(route);
  const el = id && document.getElementById(id);
  if (el) el.scrollIntoView({ block: "start" });
  else window.scrollTo(0, 0);
}

/** The page the address shows; scrolled to where it points, also when its link is followed again. */
function useRoute(): Route {
  const hash = useSyncExternalStore(subscribeHash, hashNow, hashNow);
  const route = useMemo(() => parse(hash), [hash]);
  useLayoutEffect(() => {
    // An earlier form of the link: shown as it's written now.
    const now = href(route);
    if (route.page !== "missing" && (route.page !== "home" || route.at) && now !== hash) history.replaceState(null, "", now);
    scrollTo(route);
  }, [hash]); // eslint-disable-line react-hooks/exhaustive-deps
  // A link to where the address is already (the lesson, again, after scrolling away): no hashchange, so scroll here.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a") : null;
      if (a?.getAttribute("href") === window.location.hash) scrollTo(parse(window.location.hash));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return route;
}

function Page({ route }: { route: Route }) {
  switch (route.page) {
    case "home":
      return <Home key={route.at ?? ""} at={chapterById(route.at)} />;
    case "chapter": {
      const chapter = chapterById(route.chapter);
      // Keyed by the chapter: going to one of its sections keeps the page (and the lesson's boards) as they are.
      return chapter ? <ChapterView key={chapter.id} chapter={chapter} /> : <NotFound />;
    }
    case "exercise":
      return <ExerciseRoute key={href(route)} mode={route.mode} chapterId={route.chapter} level={route.level} seed={route.seed} />;
    case "set":
      return <SetRoute key={href(route)} code={route.code} n={route.n} />;
    case "make":
      return <SetMaker />;
    case "sandbox":
      return <Sandbox />;
    case "missing":
      return <NotFound />;
  }
}

export function App() {
  const route = useRoute();
  const { debug, skin, lang } = useSettings();
  useDebugShortcut();

  return (
    <div className="app">
      <nav className="topbar">
        <a href={href({ page: "home" })} className="topbar-logo">
          {t().logo}
          <span>.</span>
        </a>
        <span className="topbar-links">
          {debug && (
            <button className="bare topbar-debug" onClick={() => setDebug(false)} title={t().debugOn}>
              debug ✕
            </button>
          )}
          <a href={href({ page: "sandbox" })} className="button quiet" aria-current={route.page === "sandbox" ? "page" : undefined}>
            {t().sandbox}
          </a>
          {/* For teachers (or anyone): write exercises and share them as a link. */}
          <a href={href({ page: "make" })} className="button quiet" aria-current={route.page === "make" ? "page" : undefined}>
            {t().makeExercises}
          </a>
          <Pick value={skin} label={t().skin} options={SKINS.map((s) => [s.id, s.name])} onPick={(v) => setSkin(v as SkinId)} />
          {!ENGLISH_ONLY && <Pick value={lang} label={t().language} options={LANGS.map((l) => [l.code, l.name])} onPick={(v) => setLang(v as Lang)} />}
        </span>
      </nav>
      <Page route={route} />
    </div>
  );
}

/** A setting's drop-down, as a quiet button (its arrow drawn by .topbar-pick: the select's own sits too far right). */
function Pick({ value, label, options, onPick }: { value: string; label: string; options: [string, string][]; onPick: (v: string) => void }) {
  return (
    <span className="topbar-pick">
      <select className="button quiet" value={value} onChange={(e) => onPick(e.target.value)} aria-label={label}>
        {options.map(([v, name]) => (
          <option key={v} value={v}>
            {name}
          </option>
        ))}
      </select>
    </span>
  );
}
