import { useEffect, useMemo, useState } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { chapterById, CHAPTERS } from "../game/puzzles";
import { isDone, taskOf } from "../game/task";
import type { RuleId } from "../rules";
import { record, seen, STREAK_MARKS, type Context, type Recorded, type Tier } from "../game/scoring";
import { answer, arrive, canSolve, cardOf, type Phase } from "../game/predict";
import { Badge } from "./Badge";
import { Board } from "./Board";
import { chapterText, t } from "../i18n";
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
  // What this visit's outcomes earned, as scoring says: right ones in a row, a new badge.
  const [earned, setEarned] = useState<{ streak: number; badge: Tier }>({ streak: 0, badge: 0 });
  const tell = (r: Recorded) =>
    setEarned((e) => ({ streak: r.streak?.now ?? e.streak, badge: r.tier.after > r.tier.before ? r.tier.after : e.badge }));

  const pick = (choice: string | null) => {
    const next = answer(phase, puzzle.goal, choice);
    if (next === phase || next.kind !== "answered") return;
    setPhase(next);
    tell(record(puzzle.id, context, next.prediction, next.pick));
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
    if (solved) tell(record(puzzle.id, context, "solved"));
  }, [solved, puzzle.id, context]);

  const chapter = context.kind === "set" ? undefined : chapterById(context.chapter);
  const asking = phase.kind === "asking";
  // A chapter's predict exercise is done once answered: on to another straight away (solving it shows why).
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
            <Said phase={phase} streak={earned.streak} predict={context.kind === "predict"} />
            {before.solved && !solved && <span className="puzzle-before">{t().solvedBefore}</span>}
            {!solved && <NewBadge chapterId={chapter?.id} tier={earned.badge} />}
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
            onwardNow && (
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
          <NewBadge chapterId={chapter?.id} tier={earned.badge} />
          <a className="button primary" href={ex.onward.href}>
            {ex.onward.text}
          </a>
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

/** What the prediction came to: the prompt to pick first, or how it went. */
function Said({ phase, streak, predict }: { phase: Phase; streak: number; predict: boolean }) {
  if (phase.kind === "none") return null;
  if (phase.kind === "asking") return <span>{t().pickFirst}</span>;
  const { prediction, earlier, pick } = phase;
  if (prediction === "revealed") return <span>{t().revealedNote}</span>;
  if (prediction === "wrong") return <span className="said-wrong">{earlier ? t().predictedBeforeWrong(!!pick) : t().notQuite}</span>;
  return (
    <span className="said-right">
      <span className="star" aria-hidden="true">
        ★
      </span>{" "}
      {earlier ? t().predictedBeforeRight : predict ? t().predictRight : t().rightFirstTime}
      {streak >= 2 && <span className={STREAK_MARKS.includes(streak) ? "said-streak said-mark" : "said-streak"}>{t().inARow(streak)}</span>}
    </span>
  );
}

/** A badge just earned, if this visit earned one. */
function NewBadge({ chapterId, tier }: { chapterId?: string; tier: Tier }) {
  const chapter = chapterById(chapterId);
  if (!chapter || !tier) return null;
  return (
    <span className="puzzle-badge">
      <Badge tier={tier} n={CHAPTERS.indexOf(chapter) + 1} size={30} />
      {t().newBadge(tier, chapterText(chapter).title)}
    </span>
  );
}
