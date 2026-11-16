/**
 * Exercise sets of one's own (see game/sets.ts): the set's page a student
 * opens from its link, and its exercises (the usual exercise screen,
 * predicting first). Making one is SetMaker.tsx.
 */
import { useEffect, useMemo, useState } from "react";
import { parseState } from "../expr/parse";
import { choicesFor } from "../game/predict";
import { seen } from "../game/scoring";
import { autoDecoys } from "../game/autoDecoys";
import { decodeSet, movesOf, positiveOf, setKey, type ExerciseSet } from "../game/sets";
import { StaticMath } from "./MathCanvas";
import { NotFound } from "./NotFound";
import { href } from "./routes";
import { PuzzleView, type Exercise } from "./PuzzleView";
import { t } from "../i18n";

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
