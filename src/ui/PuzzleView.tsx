import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { MathState } from "../expr/types";
import { assuming } from "../expr/setting";
import { parseState } from "../expr/parse";
import { isDone, taskOf } from "../game/task";
import type { RuleId } from "../rules";
import { record, seen, type Change, type Context } from "../game/scoring";
import { answer, arrive, canSolve, cardOf, type Phase } from "../game/predict";
import { rowsOf } from "../game/answers";
import { variables } from "../expr/eval";
import { Board } from "./Board";
import { t } from "../i18n";
import { StaticMath, type ShowMove } from "./MathCanvas";
import { printState, stateKey } from "../expr/key";
import { tidied } from "../game/tidy";
import { nextStep as nextStepHere } from "../game/showWay";
import { workerClient } from "../util/worker";
import { useMoveHistory } from "./useMoveHistory";
import { MathText } from "./MathText";

/** A link: where to, and what it says. */
type Link = { href: string; text: string };

/**
 * Everything the exercise screen needs, wherever the exercise comes from: a
 * chapter's made-up ones (ui/Practice.tsx) or a set of one's own (ui/SetView.tsx).
 */
export type Exercise = {
  /** `via`: milestones of the way it was made (Next step heads through them). */
  puzzle: { id: string; start: string; goal: string; hint?: string; via?: string[]; legs?: RuleId[][]; ask?: { letter: string; using: string[] } };
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
  const start = useMemo((): MathState => assuming(parseState(puzzle.start), ex.positiveLetters), [puzzle, ex.positiveLetters]);
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

  // Next step: for a learner who's stuck, the next move played on the board (and kept). Not where solving
  // is what counts: a mind's-eye exercise with nothing to pick from scores when solved.
  const showMove = useRef<ShowMove | null>(null);
  const [stepping, setStepping] = useState<"idle" | "looking" | "none">("idle");
  // The way being followed: the states still ahead, while the board is where the way says it is.
  const plan = useRef<{ at: string; ahead: MathState[] } | null>(null);
  const canStep = !asking && !solved && !(context.kind === "predict" && phase.kind === "none");
  const nextStep = async () => {
    const from = moves.current;
    // The way is searched with terms in any order (as the board judges a solved equation): so are its steps matched.
    const key = (s: MathState) => stateKey(s, false);
    setStepping("looking");
    try {
      if (plan.current?.at !== key(from) || !plan.current.ahead.length) {
        const found = await askNext({ from: printState(from), goal: puzzle.goal, via: puzzle.via ?? [], ...(puzzle.legs ? { legs: puzzle.legs } : {}), rules: [...rules], positive: !!ex.positiveLetters });
        plan.current = found ? { at: key(from), ahead: found.map((x) => assuming(parseState(x), ex.positiveLetters)) } : null;
      }
      if (!plan.current) return setStepping("none");
      const [next, ...rest] = plan.current.ahead;
      // A step that only puts terms in order (the goal asks for one) is matched in that order.
      const exact = (s: MathState) => stateKey(s, "exact");
      const reorder = key(next) === key(from);
      const dropped = await showMove.current?.({ to: (s) => (reorder ? exact(tidied(from, s)) === exact(next) : key(tidied(from, s)) === key(next)) });
      // On the way: the next press goes on along it (once the board has settled where it said).
      plan.current = dropped ? { at: key(next), ahead: rest } : null;
      setStepping("idle");
    } catch {
      setStepping("none");
    }
  };
  // "Another one" has one place, the board's buttons, once the board is solved: an answer picked
  // is only half of an exercise (picking and moving on would score without doing any maths).

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
              const maths = <CardMaths text={c} />;
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
              <MathText text={askOf(puzzle, goal, task.letters)} />
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
            {stepping === "none" && !solved && <span className="puzzle-before">{t().noNextStep}</span>}
          </>
        }
        show={showMove}
        busy={stepping === "looking"}
        before={
          <>
            {puzzle.hint && (
              <button onClick={() => setShowHint((h) => !h)} aria-pressed={showHint} disabled={asking}>
                {t().hint}
              </button>
            )}
            {canStep && (
              <button onClick={nextStep} disabled={stepping === "looking"}>
                {t().nextStep}
              </button>
            )}
          </>
        }
        after={
          asking ? (
            <button onClick={() => pick(null)}>{t().reveal}</button>
          ) : (
            solved && (
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

/**
 * An answer on a card. The answers of one equation (x = 4 or x = −1) go on
 * one line, with a full-size "or" between them: stacked, the "or" came out
 * tiny and the maths filled a third of the card.
 */
function CardMaths({ text }: { text: string }) {
  const state = parseState(text);
  const rows = state.join === "or" ? rowsOf(state) : [state];
  if (rows.length < 2) return <StaticMath state={state} height={90} room={12} />;
  return (
    <span className="choice-rows">
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="choice-or">{t().or}</span>}
          <StaticMath state={row} height={300} scale={0.55} />
        </Fragment>
      ))}
    </span>
  );
}

/** Next step's search, off the page's thread (one worker for every exercise); an answer that takes over 15 s is given up. */
const askNext = workerClient(() => new Worker(new URL("../game/nextWorker.ts", import.meta.url), { type: "module" }), nextStepHere, 15_000);

/**
 * What a "solve" exercise asks, in words: one quantity in terms of others (two formulas combined); a quantity
 * made the subject (a formula: its answer has letters in it, t = (v − u)/a); else solve for the letters.
 */
function askOf(puzzle: Exercise["puzzle"], goal: MathState, letters: string[]): string {
  if (puzzle.ask) return t().inTermsOf(puzzle.ask.letter, puzzle.ask.using);
  const formula = letters.length === 1 && goal.sides.length === 2 && variables(goal.sides[1]).length > 0;
  return formula ? t().makeSubject(letters[0]) : t().solveFor(letters);
}
