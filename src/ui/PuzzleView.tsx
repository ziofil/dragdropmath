import { useEffect, useMemo, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { isDone, taskOf } from "../game/task";
import type { RuleId } from "../rules";
import { record, seen, type Change, type Context } from "../game/scoring";
import { answer, arrive, canSolve, cardOf, type Phase } from "../game/predict";
import { Board } from "./Board";
import { t } from "../i18n";
import { StaticMath } from "./MathCanvas";
import { useMoveHistory } from "./useMoveHistory";
import { MathText } from "./MathText";

/** A link: where to, and what it says. */
type Link = { href: string; text: string };

/**
 * Everything the exercise screen needs, wherever the exercise comes from: a
 * chapter's made-up ones (ui/Practice.tsx) or a set of one's own (ui/SetView.tsx).
 */
export type Exercise = {
  puzzle: { id: string; start: string; goal: string; hint?: string };
  rules: readonly RuleId[];
  /** "Exercise <title>" in the heading, between the ‹ › arrows. */
  label: string;
  /** In place of the ‹ title › arrows: the levels to switch between (a chapter's). */
  levels?: { href: string; text: string; current: boolean }[];
  /** The three answers to predict between, or null to solve it straight away. */
  choices: string[] | null;
  back: Link[];
  prev?: Link;
  next?: Link;
  /** Once done: where to go on. */
  onward: Link;
  /** What its outcomes count towards (scoring.ts). */
  context: Context;
  /** Its letters stand for positive numbers (said on screen; see rules/signs.ts). */
  positiveLetters?: boolean;
};

export function PuzzleView({ exercise: ex }: { exercise: Exercise }) {
  const { puzzle, rules, choices, context } = ex;
  const start = useMemo((): MathState => ({ ...parseState(puzzle.start), ...(ex.positiveLetters ? { letters: "positive" as const } : {}) }), [puzzle, ex.positiveLetters]);
  const goal = useMemo(() => parseState(puzzle.goal), [puzzle]);
  const task = useMemo(() => taskOf(goal), [goal]);
  // What was done here before: its prediction is shown as it was, never asked again.
  const [before] = useState(() => seen(puzzle.id));
  const [phase, setPhase] = useState<Phase>(() => arrive(choices, puzzle.goal, before));
  // How this visit's first answer moved the mind's eye's score, as scoring says.
  const [score, setScore] = useState<Change | null>(null);

  const pick = (choice: string | null) => {
    const next = answer(phase, puzzle.goal, choice);
    if (next === phase || next.kind !== "answered") return;
    setPhase(next);
    const r = record(puzzle.id, context, next.prediction, next.pick);
    if (r.score) setScore(r.score);
  };

  // With the answer hidden, any order of its terms will do (ln(5)/y + 1 is 1 + ln(5)/y), and a formula any equal form.
  const reached = (s: MathState) => isDone(goal, s, task);
  const moves = useMoveHistory(start, reached);
  const solved = reached(moves.current);
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    if (moves.canUndo) record(puzzle.id, context, "tried");
  }, [moves.canUndo, puzzle.id, context]);
  useEffect(() => {
    if (!solved) return;
    const r = record(puzzle.id, context, "solved");
    if (r.score) setScore(r.score);
  }, [solved, puzzle.id, context]);

  const asking = phase.kind === "asking";
  // A chapter's predict exercise is done once answered: on to another straight away (solving it shows why).
  // "Another one" has one place, the board's buttons: once answered, or once solved.
  const onwardNow = context.kind === "predict" && phase.kind === "answered";

  return (
    <main className="puzzle">
      <header className="puzzle-head">
        <span className="puzzle-back">
          {ex.back.map((b) => (
            <a key={b.href} href={b.href} className="back-link">
              {b.text}
            </a>
          ))}
        </span>
        {ex.levels ? (
          <nav className="level-pick" aria-label={ex.label}>
            {ex.levels.map((l) => (
              <a key={l.href} href={l.href} aria-current={l.current ? "page" : undefined}>
                {l.text}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="puzzle-nav" aria-label={t().exercisesNav}>
            <Step link={ex.prev} title={t().previousTitle} label={t().previousLabel} arrow="‹" />
            <div className="puzzle-title">{t().exerciseN(ex.label)}</div>
            <Step link={ex.next} title={t().nextTitle} label={t().nextLabel} arrow="›" />
          </nav>
        )}
      </header>

      {choices ? (
        // Predicting first: the answers stay where they are; picking (or revealing) colours them in place.
        <section className="puzzle-goal predict">
          <span className="puzzle-label">{t().predictPrompt}</span>
          <div className="predict-choices">
            {choices.map((c) => {
              const look = cardOf(phase, c, puzzle.goal);
              const maths = <StaticMath state={parseState(c)} height={90} room={12} />;
              return look === "open" ? (
                <button key={c} className="card predict-choice" onClick={() => pick(c)}>
                  {maths}
                </button>
              ) : (
                <div key={c} className={`card predict-choice is-${look}`}>
                  {maths}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="puzzle-goal">
          {/* An equation's answer stays hidden: finding it is the exercise. */}
          {task.kind === "solve" ? (
            <p className="puzzle-task">
              <MathText text={t().solveFor(task.letters)} />
            </p>
          ) : (
            <p className="puzzle-task">
              {t().makeItLookLike} <StaticMath state={goal} inline />
            </p>
          )}
        </section>
      )}

      <Board
        moves={moves}
        rules={rules}
        locked={!canSolve(phase)}
        status={
          <>
            <Said phase={phase} score={score} />
            {before.solved && !solved && <span className="puzzle-before">{t().solvedBefore}</span>}
          </>
        }
        before={
          puzzle.hint && (
            <button onClick={() => setShowHint((h) => !h)} aria-pressed={showHint} disabled={asking}>
              {t().hint}
            </button>
          )
        }
        after={
          asking ? (
            <button onClick={() => pick(null)}>{t().reveal}</button>
          ) : (
            (onwardNow || solved) && (
              <a className="button primary" href={ex.onward.href}>
                {ex.onward.text}
              </a>
            )
          )
        }
      />
      {showHint && puzzle.hint && !asking && <p className="puzzle-hint">{puzzle.hint}</p>}

      {solved && (
        <section className="card puzzle-solved" role="status">
          <div className="puzzle-solved-name">{t().solvedBang}</div>
          {score && phase.kind === "none" && <span className="said-score">{t().scoreNow(t().level[score.level], score.now, score.now > score.was, score.now !== score.was)}</span>}
        </section>
      )}
    </main>
  );
}

/** ‹ or ›: to the previous or next exercise, or an empty space the same size. */
function Step({ link, title, label, arrow }: { link?: Link; title: (s: string) => string; label: (s: string) => string; arrow: string }) {
  if (!link) return <span className="puzzle-step" aria-hidden="true" />;
  return (
    <a href={link.href} className="puzzle-step" title={title(link.text)} aria-label={label(link.text)}>
      {arrow}
    </a>
  );
}

/** What the prediction came to: the prompt to pick first, or how it went (and how the score moved). */
function Said({ phase, score }: { phase: Phase; score: Change | null }) {
  if (phase.kind === "none") return null;
  if (phase.kind === "asking") return <span>{t().pickFirst}</span>;
  const { prediction, earlier, pick } = phase;
  const moved = score && <span className="said-score">{t().scoreNow(t().level[score.level], score.now, score.now > score.was, score.now !== score.was)}</span>;
  if (prediction === "revealed") return <span>{t().revealedNote}{moved}</span>;
  if (prediction === "wrong") return <span className="said-wrong">{earlier ? t().predictedBeforeWrong(!!pick) : t().notQuite}{moved}</span>;
  return (
    <span className="said-right">
      <span className="star" aria-hidden="true">
        ★
      </span>{" "}
      {earlier ? t().predictedBeforeRight : t().rightFirstTime}
      {moved}
    </span>
  );
}
