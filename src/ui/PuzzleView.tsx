import { useEffect, useMemo, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { stateKey } from "../expr/key";
import { allPuzzles, CHAPTERS, lettersPositive, type Chapter, type PuzzleRef } from "../game/puzzles";
import type { RuleId } from "../rules";
import { matchesGoal } from "../game/solver";
import { badgeTier, loadSolved, markSolved, type Tier } from "../game/scoring";
import { TIDY_STEP_MS, tidySteps } from "../game/tidy";
import { choicesFor, loadGuesses, loadPicks, saveGuess } from "../game/guess";
import { Badge } from "./Badge";
import { chapterText, t } from "../i18n";
import { MathCanvas, StaticMath, StillBoard } from "./MathCanvas";

/** A state reached: by the learner's own move, or by tidying after it. */
type Entry = { state: MathState; tidy?: true };

/** A link: where to, and what it says. */
type Link = { href: string; text: string };

/**
 * Everything the exercise screen needs, wherever the exercise comes from: the
 * learning path (exerciseOfPath) or a set of one's own (ui/SetView.tsx).
 */
export type Exercise = {
  puzzle: { id: string; start: string; goal: string; hint?: string };
  rules: readonly RuleId[];
  /** "6.26", "3". */
  label: string;
  /** The three answers to guess between, or null to solve it straight away. */
  choices: string[] | null;
  back: Link[];
  prev?: Link;
  next?: Link;
  /** Once solved: where to go on. */
  onward: Link;
  /** The chapter whose badge solving it counts towards. */
  badgeOf?: Chapter;
  /** Its letters stand for positive numbers (said on screen; see rules/signs.ts). */
  positiveLetters?: boolean;
};

/** A learning-path exercise, as the exercise screen shows it. */
export function exerciseOfPath(pref: PuzzleRef): Exercise {
  const { puzzle, chapter } = pref;
  const all = allPuzzles();
  const at = all.findIndex((r) => r.puzzle.id === puzzle.id);
  const [prev, next] = [all[at - 1], all[at + 1]];
  const text = chapterText(chapter);
  const hint = text.hints[puzzle.id] ?? puzzle.hint;
  return {
    puzzle: { ...puzzle, ...(hint ? { hint } : {}) },
    rules: pref.rules,
    label: pref.label,
    choices: choicesFor(puzzle),
    back: [
      { href: `#/at/${chapter.id}`, text: t().backToPath },
      { href: `#/c/${chapter.id}`, text: t().lessonLink(text.title) },
    ],
    prev: prev && { href: `#/p/${prev.puzzle.id}`, text: prev.label },
    next: next && { href: `#/p/${next.puzzle.id}`, text: next.label },
    onward: next && next.chapter === chapter ? { href: `#/p/${next.puzzle.id}`, text: t().nextExercise } : { href: `#/at/${chapter.id}`, text: t().backToThePath },
    badgeOf: chapter,
    positiveLetters: lettersPositive(chapter),
  };
}

export function PuzzleView({ exercise: ex }: { exercise: Exercise }) {
  const { puzzle, rules, badgeOf: chapter } = ex;
  const start = useMemo((): MathState => ({ ...parseState(puzzle.start), ...(ex.positiveLetters ? { letters: "positive" as const } : {}) }), [puzzle, ex.positiveLetters]);
  const goal = useMemo(() => parseState(puzzle.goal), [puzzle]);
  // The chapter's badge before this exercise, and with it solved.
  const tiers = useMemo(() => {
    if (!chapter) return { before: 0 as Tier, after: 0 as Tier };
    const before = loadSolved();
    return { before: badgeTier(chapter, before), after: badgeTier(chapter, new Set([...before, puzzle.id])) };
  }, [chapter, puzzle.id]);
  // Guess first (the chapter's last exercises): pick what it becomes before solving it.
  const choices = ex.choices;
  const [guessed, setGuessed] = useState<string | null>(null);
  // What was done on an earlier visit: shown again, and it can all be done again.
  const before = useMemo(() => ({ guess: loadGuesses()[puzzle.id], pick: loadPicks()[puzzle.id], solved: loadSolved().has(puzzle.id) }), [puzzle.id]);
  const guessedBefore = before.guess !== undefined;
  const pick = (choice: string) => {
    setGuessed(choice);
    saveGuess(puzzle.id, choice === puzzle.goal ? "right" : "wrong", choice);
  };
  // Skip predicting: the right answer turns green, as if picked (no star, nothing said).
  const [revealed, setRevealed] = useState(false);
  const reveal = () => {
    setRevealed(true);
    saveGuess(puzzle.id, "revealed");
  };
  // The answers to show as answered: this visit's pick or reveal, or an earlier one.
  const earlier = guessed === null && (before.guess === "right" || before.guess === "wrong");
  const shownPick = guessed ?? (revealed ? null : (before.pick ?? (before.guess === "right" ? puzzle.goal : null)));
  const mustGuess = choices !== null && !guessedBefore && guessed === null && !revealed;
  const [history, setHistory] = useState<Entry[]>([{ state: start }]);
  const [showHint, setShowHint] = useState(false);
  // Pending tidying belongs to one move: undoing it cancels it. A move made
  // before it's shown takes it over (tidying from where it started).
  const generation = useRef(0);
  const tidyFrom = useRef<MathState | null>(null);
  useEffect(() => () => void generation.current++, []);

  const current = history[history.length - 1].state;
  const solved = matchesGoal(current, goal);
  useEffect(() => {
    if (solved) markSolved(puzzle.id);
  }, [solved, puzzle.id]);

  const onDrop = (next: MathState) => {
    if (stateKey(next, "exact") === stateKey(current, "exact")) return;
    const gen = ++generation.current;
    const from = tidyFrom.current ?? current;
    tidyFrom.current = null;
    setHistory((h) => [...h, { state: next }]);
    if (matchesGoal(next, goal)) return;
    const steps = tidySteps(from, next, history.map((e) => e.state));
    // Tidying stops once the goal is reached.
    const done = steps.findIndex((s) => matchesGoal(s, goal));
    const shown = done < 0 ? steps : steps.slice(0, done + 1);
    if (shown.length) tidyFrom.current = from;
    shown.forEach((state, i) =>
      setTimeout(() => {
        if (generation.current !== gen) return;
        setHistory((h) => [...h, { state, tidy: true }]);
        if (i === shown.length - 1) tidyFrom.current = null;
      }, TIDY_STEP_MS * (i + 1)),
    );
  };

  const cancelTidying = () => {
    generation.current++;
    tidyFrom.current = null;
  };
  // Undo takes back your last move, with the tidying after it.
  const undo = () => {
    cancelTidying();
    setHistory((h) => h.slice(0, Math.max(1, lastMove(h))));
  };
  const reset = () => {
    cancelTidying();
    setHistory([{ state: start }]);
  };

  const { prev, next } = ex;

  return (
    <main className="puzzle">
      <header className="puzzle-head">
        <span className="back-links">
          {ex.back.map((b, i) => (
            <a key={b.href} href={b.href} className={i === 0 ? "back" : "back back-lesson"}>
              {b.text}
            </a>
          ))}
        </span>
        <nav className="ex-nav" aria-label={t().exercisesNav}>
          {prev ? (
            <a href={prev.href} className="ex-step" title={t().previousTitle(prev.text)} aria-label={t().previousLabel(prev.text)}>
              ‹
            </a>
          ) : (
            <span className="ex-step" aria-hidden="true" />
          )}
          <div className="title">{t().exerciseN(ex.label)}</div>
          {next ? (
            <a href={next.href} className="ex-step" title={t().nextTitle(next.text)} aria-label={t().nextLabel(next.text)}>
              ›
            </a>
          ) : (
            <span className="ex-step" aria-hidden="true" />
          )}
        </nav>
      </header>

      {choices ? (
        // Predicting first: one panel that stays put. Picking (or revealing)
        // colours the cards in place; the green one is the goal.
        <section className="goal guess">
          {guessed !== null ? (
            <div className={`guess-result ${guessed === puzzle.goal ? "right" : "wrong"}`} role="status">
              {guessed === puzzle.goal ? (
                <>
                  <span className="star" aria-hidden="true">★</span> {t().rightFirstTime}
                </>
              ) : (
                <>{t().notQuite}</>
              )}
            </div>
          ) : earlier ? (
            <div className={`guess-result ${before.guess}`}>
              {before.guess === "right" ? (
                <>
                  <span className="star" aria-hidden="true">★</span> {t().guessedBeforeRight}
                </>
              ) : (
                <>{t().guessedBeforeWrong(!!before.pick)}</>
              )}
            </div>
          ) : (
            <span className="goal-label">{t().guessPrompt}</span>
          )}
          {mustGuess ? (
            <div className="choices">
              {choices.map((c) => (
                <button key={c} className="choice" onClick={() => pick(c)}>
                  <StaticMath state={parseState(c)} height={90} room={12} />
                </button>
              ))}
            </div>
          ) : (
            // The three answers stay: the right one green, a wrong pick red.
            <div className="choices answered">
              {choices.map((c) => (
                <div key={c} className={`choice ${c === puzzle.goal ? "is-right" : c === shownPick ? "is-picked" : ""}`}>
                  <StaticMath state={parseState(c)} height={90} room={12} />
                </div>
              ))}
            </div>
          )}
          {/* Once answered it keeps its place, so nothing below moves. */}
          <button className={`reveal ${mustGuess ? "" : "is-spent"}`} onClick={reveal} disabled={!mustGuess} aria-hidden={!mustGuess}>
            {t().reveal}
          </button>
          {before.solved && !solved && <p className="solved-before">{t().solvedBefore}</p>}
          {ex.positiveLetters && <p className="assume">{t().positiveLetters}</p>}
        </section>
      ) : (
        <section className="goal">
          {before.solved && !solved && <p className="solved-before">{t().solvedBefore}</p>}
          <span className="goal-label">{t().makeItLookLike}</span>
          <StaticMath state={goal} />
          {ex.positiveLetters && <p className="assume">{t().positiveLetters}</p>}
        </section>
      )}

      <section className={`board ${solved ? "board-solved" : ""} ${mustGuess ? "board-waiting" : ""}`}>
        {mustGuess ? (
          <div className="still">
            <StillBoard state={start} />
            <p className="still-note">{t().pickFirst}</p>
          </div>
        ) : (
          <MathCanvas state={current} rules={rules} onDrop={onDrop} />
        )}
        <div className="board-bar">
          <span />
          <div className="actions">
            {puzzle.hint && !mustGuess && (
              <button onClick={() => setShowHint((h) => !h)} aria-pressed={showHint}>
                {t().hint}
              </button>
            )}
            <button onClick={undo} disabled={history.length <= 1}>
              {t().undo}
            </button>
            <button onClick={reset} disabled={history.length <= 1}>
              {t().reset}
            </button>
          </div>
        </div>
        {showHint && puzzle.hint && !mustGuess && <p className="hint">{puzzle.hint}</p>}
      </section>

      {solved && (
        <section className="result" role="status">
          <div className="result-name">{t().solvedBang}</div>
          {chapter && tiers.after > tiers.before && (
            <div className="new-badge">
              <Badge tier={tiers.after} n={CHAPTERS.indexOf(chapter) + 1} size={36} />
              {t().newBadge(tiers.after as 1 | 2 | 3, chapterText(chapter).title)}
            </div>
          )}
          <a className="button primary" href={ex.onward.href}>
            {ex.onward.text}
          </a>
        </section>
      )}
    </main>
  );
}

/** Where the learner's last move is in the history (tidying after it comes later). */
function lastMove(h: Entry[]): number {
  let n = h.length - 1;
  while (n > 0 && h[n].tidy) n--;
  return n;
}
