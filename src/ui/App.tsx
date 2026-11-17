import { Component, lazy, Suspense, useEffect, useLayoutEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { chapterById } from "../game/puzzles";
import { ChapterView } from "./ChapterView";
import { Home } from "./Home";
import { SetRoute } from "./SetView";
import { ExerciseRoute } from "./Practice";
import { NotFound } from "./NotFound";
import { About } from "./About";
import { setDebug, useSettings } from "./settings";
import { SettingsButton } from "./SettingsPanel";
import { anchorOf, href, parse, type Route } from "./routes";
import { t } from "../i18n";

/** The set maker, loaded when opened: it brings the YAML library, which no other page needs. */
/** The sandbox, on the dev server only: a build for the site leaves it out. */
// (import.meta.env.DEV written out, not TOOLS: so a build drops the import, and the file with it.)
const Sandbox = import.meta.env.DEV ? lazy(() => import("./Sandbox").then((m) => ({ default: m.Sandbox }))) : null;
const SetMaker = lazy(() => import("./SetMaker").then((m) => ({ default: m.SetMaker })));

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
      return (
        <Suspense fallback={<main className="page" aria-busy="true" />}>
          <SetMaker />
        </Suspense>
      );
    case "sandbox":
      // A tool for working on the app: on the dev server only (tools.ts).
      return Sandbox ? (
        <Suspense fallback={<main className="page" aria-busy="true" />}>
          <Sandbox />
        </Suspense>
      ) : (
        <NotFound />
      );
    case "about":
      return <About />;
    case "missing":
      return <NotFound />;
  }
}

export function App() {
  const route = useRoute();
  const { debug } = useSettings();

  return (
    <div className="app">
      <nav className="topbar">
        <a href={href({ page: "home" })} className="topbar-logo">
          {t().logo}
          <span>.</span>
        </a>
        <span className="topbar-links">
          {import.meta.env.DEV && debug && (
            <button className="bare topbar-debug" onClick={() => setDebug(false)} title={t().debugOn}>
              debug ✕
            </button>
          )}
          {/* A tool for chasing moves: shown in debug mode only. Its name is the same in every language. */}
          {import.meta.env.DEV && debug && (
            <a href={href({ page: "sandbox" })} className="button quiet" aria-current={route.page === "sandbox" ? "page" : undefined}>
              Sandbox
            </a>
          )}
          {/* For teachers (or anyone): write exercises and share them as a link. */}
          <a href={href({ page: "make" })} className="button quiet" aria-current={route.page === "make" ? "page" : undefined}>
            {t().makeExercises}
          </a>
          <a href={href({ page: "about" })} className="button quiet" aria-current={route.page === "about" ? "page" : undefined}>
            {t().aboutLink}
          </a>
          <SettingsButton />
        </span>
      </nav>
      {/* Anything that goes wrong on a page stays on that page: the top bar, and the way back, stay. */}
      <PageErrorBoundary resetKey={href(route)}>
        <Page route={route} />
      </PageErrorBoundary>
    </div>
  );
}

/** A page that crashed: said in place of it, with a way on (going to another page clears it). */
class PageErrorBoundary extends Component<{ resetKey: string; children: ReactNode }, { error: Error | null; key: string }> {
  state = { error: null as Error | null, key: this.props.resetKey };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(props: { resetKey: string }, state: { error: Error | null; key: string }) {
    return props.resetKey === state.key ? null : { error: null, key: props.resetKey };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="page page-error" role="alert">
        <h1>{t().pageCrashed}</h1>
        <p>{t().pageCrashedDetails}</p>
        <div className="maker-actions">
          <button onClick={() => this.setState({ error: null })}>{t().tryAgain}</button>
          <a className="button primary" href={href({ page: "home" })}>
            {t().learningPathButton}
          </a>
        </div>
      </main>
    );
  }
}
