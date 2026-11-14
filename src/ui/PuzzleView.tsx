import { useEffect, useMemo, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { CHAPTERS, type Chapter } from "../game/puzzles";
import type { Level } from "../game/generate/write";
import type { RuleId } from "../rules";
import { matchesGoal } from "../game/solver";
import { badgeTier, countSolved, isCounted, loadProgress, loadSolved, markSolved, type Kind, type Tier } from "../game/scoring";
import { loadGuesses, loadPicks, saveGuess } from "../game/guess";
import { Badge } from "./Badge";
import { chapterText, t } from "../i18n";
import { MathCanvas, StaticMath, StillBoard } from "./MathCanvas";
import { useMoveHistory } from "./useMoveHistory";

/** A link: where to, and what it says. */
type Link = { href: string; text: string };

/**
 * Everything the exercise screen needs, wherever the exercise comes from: a
 * chapter's made-up ones (ui/Practice.tsx) or a set of one's own (ui/SetView.tsx).
 */
export type Exercise = {
  puzzle: { id: string; start: string; goal: string; hint?: string };
  rules: readonly RuleId[];
  /** "6.26", "3". */
  label: string;
  /** The heading, when it isn't "Exercise <label>". */
  title?: string;
  /** In place of the ‹ title › arrows: the levels to switch between (made-up practice). */
  levels?: { href: string; text: string; current: boolean }[];
  /** The three answers to guess between, or null to solve it straight away. */
  choices: string[] | null;
  back: Link[];
  prev?: Link;
  next?: Link;
  /** Once solved: where to go on. */
  onward: Link;
  /** Made up on the spot (a chapter's): nothing about it is kept, beyond the counts. */
  fresh?: true;
  /**
   * A chapter's practice or test exercise, counted at its level: in practice
   * once solved, in the test once predicted right (which earns the badge).
   */
  counts?: { chapter: Chapter; level: Level; kind: Kind };
  /** Its letters stand for positive numbers (said on screen; see rules/signs.ts). */
  positiveLetters?: boolean;
};

export function PuzzleView({ exercise: ex }: { exercise: Exercise }) {
  const { puzzle, rules } = ex;
  const chapter = ex.counts?.chapter;
  // A set's exercise keeps its prediction and that it's solved; a chapter's made-up one only adds to a count.
  const keep = !ex.fresh;
  const test = ex.counts?.kind === "test";
  const start = useMemo((): MathState => ({ ...parseState(puzzle.start), ...(ex.positiveLetters ? { letters: "positive" as const } : {}) }), [puzzle, ex.positiveLetters]);
  const goal = useMemo(() => parseState(puzzle.goal), [puzzle]);
  // The chapter's badge before this exercise, and with it solved.
  const tiers = useMemo(() => {
    if (!test || !ex.counts || isCounted(puzzle.id)) return { before: 0 as Tier, after: 0 as Tier };
    const { chapter, level } = ex.counts;
    const before = loadProgress();
    const c = before[chapter.id] ?? { easy: 0, medium: 0, hard: 0 };
    const after = { ...before, [chapter.id]: { ...c, [level]: c[level] + 1 } };
    return { before: badgeTier(chapter, before), after: badgeTier(chapter, after) };
    // Worked out once, on arriving: once solved it's counted, and the new badge must still show.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.id]);
  // Guess first (the chapter's last exercises): pick what it becomes before solving it.
  const choices = ex.choices;
  const [guessed, setGuessed] = useState<string | null>(null);
  // What was done on an earlier visit: shown again, and it can all be done again.
  const before = useMemo(
    () => (keep ? { guess: loadGuesses()[puzzle.id], pick: loadPicks()[puzzle.id], solved: loadSolved().has(puzzle.id) } : { guess: undefined, pick: undefined, solved: false }),
    [puzzle.id, keep],
  );
  const guessedBefore = before.guess !== undefined;
  const pick = (choice: string) => {
    setGuessed(choice);
    if (keep) saveGuess(puzzle.id, choice === puzzle.goal ? "right" : "wrong", choice);
    if (test && ex.counts && choice === puzzle.goal) countSolved(ex.counts.chapter.id, ex.counts.level, puzzle.id, "test");
  };
  // Skip predicting: the right answer turns green, as if picked (no star, nothing said).
  const [revealed, setRevealed] = useState(false);
  const reveal = () => {
    setRevealed(true);
    if (keep) saveGuess(puzzle.id, "revealed");
  };
  // The answers to show as answered: this visit's pick or reveal, or an earlier one.
  const earlier = guessed === null && (before.guess === "right" || before.guess === "wrong");
  const shownPick = guessed ?? (revealed ? null : (before.pick ?? (before.guess === "right" ? puzzle.goal : null)));
  const mustGuess = choices !== null && !guessedBefore && guessed === null && !revealed;
  const { current, onDrop, undo, reset, canUndo } = useMoveHistory(start, (s) => matchesGoal(s, goal));
  const [showHint, setShowHint] = useState(false);
  const solved = matchesGoal(current, goal);
  useEffect(() => {
    if (!solved || !ex.counts) return;
    const { chapter, level, kind } = ex.counts;
    // A test with no wrong answers to offer is solved straight away: solving it is its right answer.
    if (kind === "practice" || choices === null) countSolved(chapter.id, level, puzzle.id, kind);
  }, [solved, puzzle.id, ex.counts, choices]);
  useEffect(() => {
    if (solved && keep) markSolved(puzzle.id);
  }, [solved, puzzle.id, keep]);

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
        {ex.levels ? (
          <nav className="level-pick" aria-label={ex.title}>
            {ex.levels.map((l) => (
              <a key={l.href} href={l.href} aria-current={l.current ? "page" : undefined}>
                {l.text}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="ex-nav" aria-label={t().exercisesNav}>
            {prev ? (
              <a href={prev.href} className="ex-step" title={t().previousTitle(prev.text)} aria-label={t().previousLabel(prev.text)}>
                ‹
              </a>
            ) : (
              <span className="ex-step" aria-hidden="true" />
            )}
            <div className="title">{ex.title ?? t().exerciseN(ex.label)}</div>
            {next ? (
              <a href={next.href} className="ex-step" title={t().nextTitle(next.text)} aria-label={t().nextLabel(next.text)}>
                ›
              </a>
            ) : (
              <span className="ex-step" aria-hidden="true" />
            )}
          </nav>
        )}
      </header>

      {choices ? (
        // Predicting first: one panel that stays put. Picking (or revealing)
        // colours the cards in place; the green one is the goal.
        <section className="goal guess">
          {guessed !== null ? (
            <div className={`guess-result ${guessed === puzzle.goal ? "right" : "wrong"}`} role="status">
              {guessed === puzzle.goal ? (
                <>
                  <span className="star" aria-hidden="true">★</span> {test ? t().testRight : t().rightFirstTime}
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
          {/* The test: answered, it's done (solving it is only to see why). */}
          {test && !mustGuess && !solved && (
            <div className="answered-onward">
              <NewBadge chapter={chapter} tiers={tiers} />
              <a className="button primary" href={ex.onward.href}>
                {ex.onward.text}
              </a>
            </div>
          )}
        </section>
      ) : (
        <section className="goal">
          {before.solved && !solved && <p className="solved-before">{t().solvedBefore}</p>}
          <span className="goal-label">{t().makeItLookLike}</span>
          <StaticMath state={goal} />
        </section>
      )}

      <section className={`board ${mustGuess ? "board-waiting" : ""}`}>
        {mustGuess ? (
          <div className="still">
            <StillBoard state={start} />
            <p className="still-note">{t().pickFirst}</p>
          </div>
        ) : (
          <MathCanvas state={current} rules={rules} onDrop={onDrop} />
        )}
        <div className="board-bar">
          <div className="actions">
            {puzzle.hint && !mustGuess && (
              <button onClick={() => setShowHint((h) => !h)} aria-pressed={showHint}>
                {t().hint}
              </button>
            )}
            <button onClick={undo} disabled={!canUndo}>
              {t().undo}
            </button>
            <button onClick={reset} disabled={!canUndo}>
              {t().reset}
            </button>
          </div>
        </div>
        {showHint && puzzle.hint && !mustGuess && <p className="hint">{puzzle.hint}</p>}
      </section>

      {solved && (
        <section className="result" role="status">
          <div className="result-name">{t().solvedBang}</div>
          <NewBadge chapter={chapter} tiers={tiers} />
          <a className="button primary" href={ex.onward.href}>
            {ex.onward.text}
          </a>
        </section>
      )}
    </main>
  );
}

/** A badge just earned, if this exercise earned one. */
function NewBadge({ chapter, tiers }: { chapter?: Chapter; tiers: { before: Tier; after: Tier } }) {
  if (!chapter || tiers.after <= tiers.before) return null;
  return (
    <div className="new-badge">
      <Badge tier={tiers.after} n={CHAPTERS.indexOf(chapter) + 1} size={36} />
      {t().newBadge(tiers.after as 1 | 2 | 3, chapterText(chapter).title)}
    </div>
  );
}
