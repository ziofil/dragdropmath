/**
 * Exercise sets of one's own (see game/sets.ts): a page to write or upload
 * one and get its link, the set's page a student opens from that link, and
 * its exercises (the usual exercise screen, predicting first).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { parseState } from "../expr/parse";
import { choicesFor } from "../game/predict";
import { seen } from "../game/scoring";
import { autoDecoys } from "../game/autoDecoys";
import { decodeSet, encodeSet, movesOf, positiveOf, readSet, setKey, type CheckedSet, type ExerciseSet } from "../game/sets";
import { solveMoves } from "../game/solveWorker";
import { workerClient } from "../util/worker";
import { StaticMath } from "./MathCanvas";
import { NotFound } from "./NotFound";
import { href } from "./routes";
import { PuzzleView, type Exercise } from "./PuzzleView";
import { SetForm } from "./SetForm";
import { t } from "../i18n";

// ---------- making a set ----------

/**
 * Can each exercise be solved with its moves? Checked one by one in a worker
 * ("checking" until known; null: no way found, or none within 20 s). Without
 * a working worker, checked here.
 */
function useSolvable(set: ExerciseSet | null): (number | null | "checking")[] {
  const [found, setFound] = useState<(number | null | "checking")[]>([]);
  useEffect(() => {
    if (!set) return setFound([]);
    setFound(set.exercises.map(() => "checking"));
    const solve = workerClient(() => new Worker(new URL("../game/solveWorker.ts", import.meta.url), { type: "module" }), solveMoves, 20_000);
    let live = true;
    set.exercises.forEach((ex, id) =>
      solve({ start: ex.start, goal: ex.goal, rules: movesOf(set, ex), positive: positiveOf(set, ex) }).then((moves) => live && setFound((f) => f.map((v, i) => (i === id ? moves : v)))),
    );
    return () => {
      live = false;
      solve.stop();
    };
  }, [set]);
  return found;
}

export function SetMaker() {
  const exampleSet = t().exampleSet;
  const [text, setText] = useState(exampleSet);
  const [checked, setChecked] = useState<CheckedSet | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const usable = checked?.set && checked.exercises.every((e) => e.problems.length === 0) ? checked.set : null;
  const solvable = useSolvable(usable);

  // The form for most; the YAML (the same set, as text) for those who'd rather type it.
  const [view, setView] = useState<"form" | "yaml">("form");
  const edit = (next: string) => {
    setText(next);
    setChecked(null);
    setLink(null);
  };
  const check = (t = text) => {
    setChecked(readSet(t));
    setLink(null);
    setCopied(false);
  };
  const upload = async (f: File | undefined) => {
    if (!f) return;
    const t = await f.text();
    setText(t);
    check(t);
  };
  const makeLink = async () => {
    if (!usable) return;
    const code = await encodeSet(usable);
    setLink(`${location.origin}${location.pathname}${href({ page: "set", code })}`);
  };
  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      /* the link is selectable anyway */
    }
  };

  return (
    <main className="page">
      <a href={href({ page: "home" })} className="back-link">
        {t().backToPath}
      </a>
      <h1>{t().ownTitle}</h1>
      <p className="page-intro">{t().ownIntro}</p>
      <div className="maker-actions">
        <span className="maker-view" role="group" aria-label={t().form.viewLabel}>
          <button aria-pressed={view === "form"} onClick={() => setView("form")}>
            {t().form.asForm}
          </button>
          <button aria-pressed={view === "yaml"} onClick={() => setView("yaml")}>
            {t().form.asYaml}
          </button>
        </span>
        <button onClick={() => file.current?.click()}>{t().upload}</button>
        <input ref={file} type="file" accept=".yaml,.yml,.txt,text/yaml" hidden onChange={(e) => {
            upload(e.target.files?.[0]);
            // So choosing the same file again (after editing) reads it again.
            e.target.value = "";
          }}
        />
        <button onClick={() => (setText(exampleSet), check(exampleSet))}>{t().startFromExample}</button>
      </div>
      {view === "form" ? (
        <SetForm text={text} onText={edit} />
      ) : (
        <textarea className="maker-yaml" value={text} spellCheck={false} onChange={(e) => edit(e.target.value)} rows={16} aria-label={t().yamlLabel} />
      )}
      <div className="maker-actions">
        <button className="primary" onClick={() => check()}>
          {t().check}
        </button>
      </div>

      {checked && (
        <section className="card maker-checked" aria-live="polite">
          {checked.problems.map((p) => (
            <p key={p} className="maker-problem">
              {p}
            </p>
          ))}
          <ol className="maker-list">
            {checked.exercises.map((e, i) => {
              const s = solvable[i];
              return (
                <li key={i} className={`card ${e.problems.length ? "is-bad" : "is-good"}`}>
                  <span className="maker-mark" aria-hidden="true">
                    {e.problems.length ? "✗" : "✓"}
                  </span>
                  <span className="maker-what">
                    {e.exercise.start || "?"} → {e.exercise.goal || "?"}
                  </span>
                  {e.problems.map((p) => (
                    <span key={p} className="maker-problem">
                      {p}
                    </span>
                  ))}
                  {e.notes.map((p) => (
                    <span key={p} className="maker-note">
                      {p}
                    </span>
                  ))}
                  {usable && (
                    <span className={s === null ? "maker-problem" : "maker-note"}>
                      {s === "checking"
                        ? t().checking
                        : s === null
                          ? t().unsolvable
                          : t().solvableIn(s)}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {usable ? (
            link ? (
              <div className="maker-link">
                <input readOnly value={link} onFocus={(e) => e.target.select()} aria-label={t().linkLabel} />
                <button onClick={copy}>{copied ? t().copied : t().copy}</button>
                <a className="button" href={link}>
                  {t().open}
                </a>
              </div>
            ) : (
              <button className="primary" onClick={makeLink}>
                {t().makeLink}
              </button>
            )
          ) : (
            !checked.problems.length && <p className="maker-problem">{t().fixMarked}</p>
          )}
        </section>
      )}

      <details className="maker-format">
        <summary>{t().howToWrite}</summary>
        <pre>{t().formatExample}</pre>
        <p>
          {t().writeMathsAs} <code>2x + 3 = 11</code>, <code>x/3</code>, <code>x^2</code>, <code>√x</code> {t().or}{" "}
          <code>sqrt(x)</code>, <code>ln(x)</code>, <code>log_2(8)</code>, <code>x &lt;= 3</code>. {t().twoEquations[0]} <code>;</code>{" "}
          {t().twoEquations[1]}
        </p>
      </details>
    </main>
  );
}

// ---------- a set, opened from its link ----------

/** The set behind a link (decoding is quick, but not instant). */
function useSet(code: string): ExerciseSet | "loading" | "broken" {
  const [set, setSet] = useState<ExerciseSet | "loading" | "broken">("loading");
  useEffect(() => {
    let live = true;
    decodeSet(code).then(
      (s) => live && setSet(s),
      () => live && setSet("broken"),
    );
    return () => {
      live = false;
    };
  }, [code]);
  return set;
}

/** The exercise screen for exercise `n` (from 1) of a set. */
function exerciseOfSet(set: ExerciseSet, code: string, n: number): Exercise | null {
  const ex = set.exercises[n - 1];
  if (!ex) return null;
  let decoys: string[] = [];
  try {
    decoys = ex.wrong ?? autoDecoys(parseState(ex.start), parseState(ex.goal));
  } catch {
    return null;
  }
  const key = setKey(code);
  const id = `set-${key}-${n}`;
  const at = (k: number) => href({ page: "set", code, n: k });
  const count = set.exercises.length;
  return {
    puzzle: { id, start: ex.start, goal: ex.goal, ...(ex.hint ? { hint: ex.hint } : {}) },
    rules: movesOf(set, ex),
    label: t().ofCount(n, count),
    choices: choicesFor({ id, goal: ex.goal }, decoys),
    back: [{ href: href({ page: "set", code }), text: `← ${set.title}` }],
    prev: n > 1 ? { href: at(n - 1), text: `${n - 1}` } : undefined,
    next: n < count ? { href: at(n + 1), text: `${n + 1}` } : undefined,
    onward: n < count ? { href: at(n + 1), text: t().nextExercise } : { href: href({ page: "set", code }), text: t().backToSet(set.title) },
    context: { kind: "set" },
    positiveLetters: positiveOf(set, ex),
  };
}

export function SetRoute({ code, n }: { code: string; n?: number }) {
  const set = useSet(code);
  const exercise = useMemo(() => (typeof set === "object" && n !== undefined ? exerciseOfSet(set, code, n) : null), [set, code, n]);
  if (set === "loading") return <main className="page" />;
  if (set === "broken" || (n !== undefined && !exercise)) return <NotFound />;
  if (exercise) return <PuzzleView key={exercise.puzzle.id} exercise={exercise} />;
  return <SetPage set={set} code={code} />;
}

function SetPage({ set, code }: { set: ExerciseSet; code: string }) {
  const key = setKey(code);
  const ids = set.exercises.map((_, i) => `set-${key}-${i + 1}`);
  const was = ids.map(seen);
  const done = was.filter((w) => w.solved).length;
  const stars = was.filter((w) => w.predicted === "right").length;
  const [beforeStar, afterStar] = t().setSummary(done, set.exercises.length, stars);
  return (
    <main className="page">
      <a href={href({ page: "home" })} className="back-link">
        {t().backToPath}
      </a>
      <h1>{set.title}</h1>
      <p className="page-intro">
        {beforeStar}
        <span className="star">★</span>
        {afterStar}
      </p>
      <ol className="set-list">
        {set.exercises.map((ex, i) => {
          const ok = !!was[i].solved;
          return (
            <li key={ids[i]}>
              <a href={href({ page: "set", code, n: i + 1 })} className={`card set-card ${ok ? "is-solved" : ""}`} title={t().exerciseTitle(String(i + 1), ok)}>
                <span className="set-num">{i + 1}</span>
                <StaticMath state={parseState(ex.start)} />
                <span className="set-marks">
                  {ok && <span className="set-check">✓</span>}
                  {was[i].predicted === "right" && <span className="star">★</span>}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <p className="set-own">
        <a href={href({ page: "make" })}>{t().makeOwnSet}</a>
      </p>
    </main>
  );
}
