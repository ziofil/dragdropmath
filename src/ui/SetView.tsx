/**
 * Exercise sets of one's own (see game/sets.ts): a page to write or upload
 * one and get its link, the set's page a student opens from that link, and
 * its exercises (the usual exercise screen, guessing first).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { parseState } from "../expr/parse";
import { choicesFor, loadGuesses } from "../game/guess";
import { loadSolved } from "../game/scoring";
import { autoDecoys } from "../game/autoDecoys";
import { decodeSet, encodeSet, EXAMPLE_SET, movesOf, readSet, setKey, type CheckedSet, type ExerciseSet } from "../game/sets";
import type { SolveAnswer, SolveRequest } from "../game/solveWorker";
import { StaticMath } from "./MathCanvas";
import { PuzzleView, type Exercise } from "./PuzzleView";

// ---------- making a set ----------

/** Can each exercise be solved with its moves? Checked one by one in a worker; null while not known yet. */
function useSolvable(set: ExerciseSet | null): (number | null | "checking")[] {
  const [found, setFound] = useState<(number | null | "checking")[]>([]);
  useEffect(() => {
    if (!set) return setFound([]);
    setFound(set.exercises.map(() => "checking"));
    const worker = new Worker(new URL("../game/solveWorker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<SolveAnswer>) => setFound((f) => f.map((v, i) => (i === e.data.id ? e.data.moves : v)));
    set.exercises.forEach((ex, id) => worker.postMessage({ id, start: ex.start, goal: ex.goal, rules: movesOf(set, ex) } satisfies SolveRequest));
    return () => worker.terminate();
  }, [set]);
  return found;
}

export function SetMaker() {
  const [text, setText] = useState(EXAMPLE_SET);
  const [checked, setChecked] = useState<CheckedSet | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const usable = checked?.set && checked.exercises.every((e) => e.problems.length === 0) ? checked.set : null;
  const solvable = useSolvable(usable);

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
    setLink(`${location.origin}${location.pathname}#/set/${code}`);
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
    <main className="set-maker">
      <a href="#/" className="back">
        ← Learning path
      </a>
      <h1>Your own exercises</h1>
      <p>
        Write a set of exercises (for your students, say) and share it as a link. Each one is guessed first, then
        solved by hand. Nothing is stored online: the whole set travels inside the link.
      </p>
      <div className="maker-actions">
        <button onClick={() => file.current?.click()}>Upload a .yaml file</button>
        <input ref={file} type="file" accept=".yaml,.yml,.txt,text/yaml" hidden onChange={(e) => upload(e.target.files?.[0])} />
        <button onClick={() => (setText(EXAMPLE_SET), check(EXAMPLE_SET))}>Start from the example</button>
      </div>
      <textarea
        className="yaml"
        value={text}
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
          setChecked(null);
          setLink(null);
        }}
        rows={16}
        aria-label="The exercise set, in YAML"
      />
      <div className="maker-actions">
        <button className="primary" onClick={() => check()}>
          Check
        </button>
      </div>

      {checked && (
        <section className="checked" aria-live="polite">
          {checked.problems.map((p) => (
            <p key={p} className="problem">
              {p}
            </p>
          ))}
          <ol className="checked-list">
            {checked.exercises.map((e, i) => {
              const s = solvable[i];
              return (
                <li key={i} className={e.problems.length ? "bad" : "good"}>
                  <span className="mark" aria-hidden="true">
                    {e.problems.length ? "✗" : "✓"}
                  </span>
                  <span className="what">
                    {e.exercise.start || "?"} → {e.exercise.goal || "?"}
                  </span>
                  {e.problems.map((p) => (
                    <span key={p} className="problem">
                      {p}
                    </span>
                  ))}
                  {e.notes.map((p) => (
                    <span key={p} className="note">
                      {p}
                    </span>
                  ))}
                  {usable && (
                    <span className={s === null ? "warn" : "note"}>
                      {s === "checking"
                        ? "Checking it can be solved with these moves…"
                        : s === null
                          ? "Couldn't find a way to solve it with these moves in 10 steps: it may need moves of a later chapter (`moves:`)."
                          : `Can be solved in ${s} move${s === 1 ? "" : "s"}.`}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {usable ? (
            link ? (
              <div className="link-box">
                <input readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Link to the set" />
                <button onClick={copy}>{copied ? "Copied" : "Copy"}</button>
                <a className="button" href={link}>
                  Open
                </a>
              </div>
            ) : (
              <button className="primary" onClick={makeLink}>
                Make the link
              </button>
            )
          ) : (
            !checked.problems.length && <p className="problem">Fix the exercises marked ✗, then check again.</p>
          )}
        </section>
      )}

      <details className="format">
        <summary>How to write a set</summary>
        <pre>{`title: A name for the set
moves: balance       # optional: a chapter's number, id or title —
                     # its moves and every earlier chapter's. Leave out: all moves.
exercises:
  - start: 2x + 3 = 11
    goal: x = 4
    wrong: [x = 7, x = 8]    # optional: two wrong answers to guess between
    hint: A short hint.       # optional
    moves: collect            # optional: moves for this exercise only`}</pre>
        <p>
          Write maths as you'd type it: <code>2x + 3 = 11</code>, <code>x/3</code>, <code>x^2</code>, <code>√x</code> or{" "}
          <code>sqrt(x)</code>, <code>ln(x)</code>, <code>log_2(8)</code>, <code>x &lt;= 3</code>. Two equations at once go on one line
          with <code>;</code> between them.
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
  const at = (k: number) => `#/set/${code}/${k}`;
  const count = set.exercises.length;
  return {
    puzzle: { id, start: ex.start, goal: ex.goal, ...(ex.hint ? { hint: ex.hint } : {}) },
    rules: movesOf(set, ex),
    label: `${n} of ${count}`,
    choices: choicesFor({ id, goal: ex.goal }, decoys),
    back: [{ href: `#/set/${code}`, text: `← ${set.title}` }],
    prev: n > 1 ? { href: at(n - 1), text: `${n - 1}` } : undefined,
    next: n < count ? { href: at(n + 1), text: `${n + 1}` } : undefined,
    onward: n < count ? { href: at(n + 1), text: "Next exercise →" } : { href: `#/set/${code}`, text: `Back to ${set.title}` },
  };
}

export function SetRoute({ code, n }: { code: string; n: number | null }) {
  const set = useSet(code);
  const exercise = useMemo(() => (typeof set === "object" && n !== null ? exerciseOfSet(set, code, n) : null), [set, code, n]);
  if (set === "loading") return <main className="set-page" />;
  if (set === "broken" || (n !== null && !exercise))
    return (
      <main className="set-page">
        <h1>This link doesn't work</h1>
        <p>It may have been cut short when it was copied. Ask for it again, or go to the learning path.</p>
        <a className="button primary" href="#/">
          Learning path
        </a>
      </main>
    );
  if (exercise) return <PuzzleView key={exercise.puzzle.id} exercise={exercise} />;
  return <SetPage set={set} code={code} />;
}

function SetPage({ set, code }: { set: ExerciseSet; code: string }) {
  const solved = loadSolved();
  const guesses = loadGuesses();
  const key = setKey(code);
  const ids = set.exercises.map((_, i) => `set-${key}-${i + 1}`);
  const done = ids.filter((id) => solved.has(id)).length;
  const stars = ids.filter((id) => guesses[id] === "right").length;
  return (
    <main className="set-page">
      <a href="#/" className="back">
        ← Learning path
      </a>
      <h1>{set.title}</h1>
      <p>
        {done} of {set.exercises.length} solved · <span className="star">★</span> {stars} guessed right first time. For each one,
        guess what it becomes first, then show it by hand.
      </p>
      <ol className="exercises set-exercises">
        {set.exercises.map((ex, i) => {
          const id = ids[i];
          const ok = solved.has(id);
          return (
            <li key={id}>
              <a href={`#/set/${code}/${i + 1}`} className={`ex-card set-card ${ok ? "solved" : ""}`} title={`Exercise ${i + 1}${ok ? " — solved" : ""}`}>
                <span className="ex-num">{i + 1}</span>
                <StaticMath state={parseState(ex.start)} />
                <span className="set-marks">
                  {ok && <span className="ex-check">✓</span>}
                  {guesses[id] === "right" && <span className="ex-star">★</span>}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <p className="set-own">
        <a href="#/sets/new">Make a set of your own</a>
      </p>
    </main>
  );
}
