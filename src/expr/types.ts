/**
 * Expression trees.
 *
 * Every node carries a stable `id`. Dragology uses ids to match elements
 * across states, so a rewrite should keep the id of every node that
 * "survives" it — that is what makes a glyph visibly slide to its new place
 * instead of fading out and back in.
 *
 * `from` marks a node that was cloned out of another (e.g. the second `a`
 * when distributing a(b+c) → ab + ac); the renderer uses it so the clone
 * emerges from its source.
 *
 * Conventions (enforced by `normalize`):
 * - numbers are non-negative; negation is always a `neg` node
 * - sums and products are flat (associativity is implicit)
 * - negations are pulled out of products and fractions
 */
/**
 * `from`: a rule's mark on a copy it made (cloneFresh), naming its source.
 * Only a rule's own result holds these: the engine turns them into the
 * board's `copies` (expr/copies.ts), so boards never do.
 *
 * `slot`: a term that took over another's place in its row (multiplying out
 * makes (a + b)·d where d was) names that place, so the + in front of it stays
 * the same + and keeps its place (see render/typeset.tsx).
 */
type Base = { id: string; from?: string; slot?: string };

/** `explicit`: a ·1 normalizing keeps (one written in an exercise, or one a move shows landing before tidying; see rules/shapes.ts visibleOne). */
export type Num = Base & { kind: "num"; value: number; explicit?: boolean };
export type Var = Base & { kind: "var"; name: string };
export type Neg = Base & { kind: "neg"; arg: Expr };
/**
 * `grouped`: a bracket that a move just multiplied into (2(x + 3) + 1 →
 * (2x + 2·3) + 1), kept for a moment so what went inside can be seen inside;
 * tidying (game/tidy.ts) then lets it go, unless a minus holds it.
 */
export type Sum = Base & { kind: "sum"; terms: Expr[]; grouped?: true };
export type Prod = Base & { kind: "prod"; factors: Expr[] };
export type Frac = Base & { kind: "frac"; num: Expr; den: Expr };
/** `radical`: draw x^(1/n) as ⁿ√x (notation: values ignore it; ordered keys count it, see key.ts). */
export type Pow = Base & { kind: "pow"; base: Expr; exp: Expr; radical?: boolean };
/** A named constant; only e for now. */
export type Const = Base & { kind: "const"; name: "e" };
/** log_base(arg); ln is log with base e. */
export type Log = Base & { kind: "log"; base: Expr; arg: Expr };

export type Expr = Num | Var | Neg | Sum | Prod | Frac | Pow | Const | Log;

/**
 * How the two sides compare. `<` and `>` (and `≤`, `≥`) are the same sign
 * facing the other way — the renderer draws them so, and turns it round.
 */
export type Rel = "=" | "<" | ">" | "≤" | "≥";

/** A condition on the letters: x ≥ −7, x ≠ 2. */
export type Condition = { sides: [Expr, Expr]; rel: Rel | "≠" };

/**
 * A board: rows of expressions (what moves rewrite) and the setting they live
 * in (see Setting). One side = a plain expression; two sides = an equation
 * (or an inequality).
 */
export type MathState = {
  /**
   * One expression, or the two sides of an equation. Several equations at once
   * are rows: sides 2k and 2k + 1 are row k's (a system of equations, or the
   * possible answers of one).
   */
  sides: Expr[];
  /** The relation between two sides (default "="; rows are always equations). */
  rel?: Rel;
  /**
   * How rows go together: all true at once (simultaneous equations), or any
   * one of them true (the answers of one equation: x = 2 or x = −3).
   */
  join?: "and" | "or";
  /**
   * What the letters stand for: "positive" where the exercise says so (the
   * powers, roots and logs chapters), else any number. Moves whose correctness
   * depends on a sign ask rules/signs.ts, which reads this.
   */
  letters?: "positive";
  /**
   * What the letters must satisfy, given at the start and true throughout:
   * a root's inside isn't negative, nor what a root equals (√(x + 7) = x + 1:
   * x ≥ −7, x ≥ −1); a bottom isn't 0 (x ≠ 2). A row that breaks one isn't an
   * answer (squaring can make such rows): it's crossed out.
   */
  conditions?: Condition[];
  /**
   * Previews only: draw the side holding node `id` shifted so that node's
   * symbol starts at canvas x (a merge target staying put while it changes,
   * until the drop moves it where it belongs). Ignored by keys and rules.
   */
  pin?: { id: string; x: number };
  /**
   * The last move's copies: a new piece's id → the piece it grew out of
   * (2(x + 1) → 2x + 2·1: the second 2 grew out of the first). Drawn as
   * flying out of their source; never carried to the next move (see
   * expr/copies.ts). Ignored by keys and rules.
   */
  copies?: Record<string, string>;
};

/**
 * What a board says about its rows rather than what's written in them: the
 * relation, how rows go together, what the letters stand for, the conditions.
 * Moves rewrite the rows; the setting carries over unless a move says
 * otherwise (an inequality turned round, one row split into "or" rows).
 */
export type Setting = Pick<MathState, "rel" | "join" | "letters" | "conditions">;

/** Every key of a Setting (the type checker makes a new one appear here). */
export const SETTING_KEYS = Object.keys({ rel: 1, join: 1, letters: 1, conditions: 1 } satisfies Record<keyof Setting, 1>) as (keyof Setting)[];
