import type { Expr } from "./types";
import { allNodes } from "./tree";

export type Env = Record<string, number>;

export function evaluate(e: Expr, env: Env): number {
  switch (e.kind) {
    case "num":
      return e.value;
    case "var": {
      const v = env[e.name];
      if (v === undefined) throw new Error(`No value for variable ${e.name}`);
      return v;
    }
    case "neg":
      return -evaluate(e.arg, env);
    case "sum":
      return e.terms.reduce((acc, t) => acc + evaluate(t, env), 0);
    case "prod":
      return e.factors.reduce((acc, f) => acc * evaluate(f, env), 1);
    case "frac":
      return evaluate(e.num, env) / evaluate(e.den, env);
    case "pow": {
      const b = evaluate(e.base, env);
      const x = evaluate(e.exp, env);
      // An odd root of a negative number is real: ∛(−8) = −2 (JavaScript's ** says NaN).
      const n = Math.round(1 / x);
      if (b < 0 && n % 2 !== 0 && Math.abs(1 / x - n) < 1e-9) return -((-b) ** x);
      return b ** x;
    }
    case "const":
      return Math.E;
    case "log":
      return Math.log(evaluate(e.arg, env)) / Math.log(evaluate(e.base, env));
  }
}

export function variables(e: Expr): string[] {
  const names = allNodes(e).flatMap((n) => (n.kind === "var" ? [n.name] : []));
  return [...new Set(names)].sort();
}

export const isConstant = (e: Expr) => variables(e).length === 0;
