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
type Base = { id: string; from?: string };

/** `explicit`: a ·1 a learner should see and simplify themselves (left behind by distributing). */
export type Num = Base & { kind: "num"; value: number; explicit?: boolean };
export type Var = Base & { kind: "var"; name: string };
export type Neg = Base & { kind: "neg"; arg: Expr };
export type Sum = Base & { kind: "sum"; terms: Expr[] };
export type Prod = Base & { kind: "prod"; factors: Expr[] };
export type Frac = Base & { kind: "frac"; num: Expr; den: Expr };
/** `radical`: draw x^(1/n) as ⁿ√x (purely notation; keys and values ignore it). */
export type Pow = Base & { kind: "pow"; base: Expr; exp: Expr; radical?: boolean };
/** A named constant; only e for now. */
export type Const = Base & { kind: "const"; name: "e" };
/** log_base(arg); ln is log with base e. */
export type Log = Base & { kind: "log"; base: Expr; arg: Expr };

export type Expr = Num | Var | Neg | Sum | Prod | Frac | Pow | Const | Log;

/** One side = a plain expression; two sides = an equation. */
export type MathState = { sides: Expr[] };
