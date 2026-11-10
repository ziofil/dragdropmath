import type { MathState } from "../expr/types";
import { evaluate, variables, type Env } from "../expr/eval";

const DEFAULTS: Env = { x: 3, y: 2, z: 6, a: 5, b: 4, c: 2 };

/** Values to plug in: the goal's solution if it is "x = number", else small defaults. */
export function checkEnv(state: MathState, goal?: MathState): Env {
  if (goal?.sides.length === 2) {
    const [l, r] = goal.sides;
    if (l.kind === "var" && variables(r).length === 0) return { [l.name]: evaluate(r, {}) };
    if (r.kind === "var" && variables(l).length === 0) return { [r.name]: evaluate(l, {}) };
  }
  const names = variables({ kind: "sum", id: "_", terms: state.sides });
  return Object.fromEntries(names.map((n) => [n, DEFAULTS[n] ?? 2]));
}

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 1000) / 1000)).replace("-", "−");

/**
 * The invariant: legal moves never change the value (or, for an equation,
 * never break the solution). Watching this number *not* change is the point.
 */
export function Invariant({ state, env }: { state: MathState; env: Env }) {
  const names = Object.keys(env);
  const given = names.length ? names.map((n) => `${n} = ${fmt(env[n])}`).join(", ") : "no letters";
  try {
    const vals = state.sides.map((s) => evaluate(s, env));
    if (vals.length === 1) {
      return (
        <div className="invariant" title="Legal moves never change this value">
          <span className="invariant-label">with {given}</span>
          <span className="invariant-value">= {fmt(vals[0])}</span>
        </div>
      );
    }
    const ok = Math.abs(vals[0] - vals[1]) < 1e-9;
    return (
      <div className={`invariant ${ok ? "" : "invariant-bad"}`} title="Legal moves keep the solution a solution">
        <span className="invariant-label">check {given}</span>
        <span className="invariant-value">
          {fmt(vals[0])} {ok ? "=" : "≠"} {fmt(vals[1])} {ok ? "✓" : ""}
        </span>
      </div>
    );
  } catch {
    return null;
  }
}
