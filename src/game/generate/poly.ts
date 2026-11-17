/**
 * Polynomials, exactly: what the exercise makers compute with and write out
 * as a teacher would. Terms are a number times each letter's power (x²y is
 * {x: 2, y: 1}); a "letter" can stand for any piece when written out (u for
 * x² or √x: see `as`), so a quadratic in x², in √x or in x is one thing.
 *
 * Used by the pieces of expressions to simplify (composeExpr.ts) and by the
 * equation chapters (answers to brackets, an equation written as a teacher
 * writes it).
 */
import { parseState } from "../../expr/parse";
import type { Expr } from "../../expr/types";
import { gcd, type Rng } from "./write";

/** A monomial: each letter's power. */
export type Mono = Record<string, number>;
/** A polynomial: monomial key → coefficient (in the order terms first appeared). */
export type Poly = Map<string, { m: Mono; c: number }>;

export const keyOf = (m: Mono) =>
  Object.keys(m)
    .filter((v) => m[v] !== 0)
    .sort()
    .map((v) => `${v}${m[v]}`)
    .join("");
export const degree = (m: Mono) => Object.values(m).reduce((a, b) => a + b, 0);

export function add(p: Poly, q: Poly, sign = 1): Poly {
  const out: Poly = new Map([...p].map(([k, t]) => [k, { ...t }]));
  for (const [k, t] of q) out.set(k, { m: t.m, c: (out.get(k)?.c ?? 0) + sign * t.c });
  for (const [k, t] of out) if (t.c === 0) out.delete(k);
  return out;
}
export function mul(p: Poly, q: Poly): Poly {
  let out: Poly = new Map();
  for (const a of p.values())
    for (const b of q.values()) {
      const m: Mono = { ...a.m };
      for (const v in b.m) m[v] = (m[v] ?? 0) + b.m[v];
      out = add(out, new Map([[keyOf(m), { m, c: a.c * b.c }]]));
    }
  return out;
}
export const scale = (p: Poly, c: number): Poly => new Map([...p].map(([k, t]) => [k, { m: t.m, c: t.c * c }]));
export const mono = (c: number, m: Mono = {}): Poly => new Map([[keyOf(m), { m, c }]]);
export const terms = (p: Poly) => [...p.values()];

/**
 * A polynomial as written ("2x - 3", "x^2 + a·b"), its terms in the order
 * given: P("3 - x") keeps the 3 first.
 */
export function P(src: string): Poly {
  const p = polyOf(parseState(src).sides[0]);
  if (!p) throw new Error(`Not a polynomial: ${src}`);
  return p;
}

/** The polynomial a tree is (sums and products of numbers and powers of letters), or null if it isn't one. */
export function polyOf(e: Expr): Poly | null {
  let out: Poly = new Map();
  const visit = (e: Expr, sign: number): boolean => {
    if (e.kind === "sum") return e.terms.every((t) => visit(t, sign));
    if (e.kind === "neg") return visit(e.arg, -sign);
    let c = sign;
    const m: Mono = {};
    for (const f of e.kind === "prod" ? e.factors : [e]) {
      if (f.kind === "num") c *= f.value;
      else if (f.kind === "var") m[f.name] = (m[f.name] ?? 0) + 1;
      else if (f.kind === "pow" && f.base.kind === "var" && f.exp.kind === "num")
        m[f.base.name] = (m[f.base.name] ?? 0) + f.exp.value;
      else return false;
    }
    out = add(out, mono(c, m));
    return true;
  };
  return visit(e, 1) ? out : null;
}

/** a·x + n as a polynomial, the letter first (or the number, `numberFirst`): lin(2, -3) is 2x − 3. */
export const lin = (a: number, n: number, x = "x", numberFirst = false) => P((numberFirst ? `${n} + ${a}${x}` : `${a}${x} + ${n}`).replace("+ -", "- "));

/** "x^2·y", "xy", "" (no letters). A power is followed by a · so it reads back as written. */
export function letters(m: Mono): string {
  const vs = Object.keys(m)
    .filter((v) => m[v] !== 0)
    .sort();
  return vs.map((v, i) => `${v}${m[v] === 1 ? "" : `^${m[v]}`}${m[v] !== 1 && i < vs.length - 1 ? "·" : ""}`).join("");
}
/** c·m as written: "3x", "-x", "7", "x^2·y". */
export function termStr(c: number, m: Mono): string {
  const l = letters(m);
  if (!l) return `${c}`;
  return c === 1 ? l : c === -1 ? `-${l}` : `${c}${l}`;
}
/** A polynomial written out, its terms in the order given. */
export function polyStr(p: Poly | { m: Mono; c: number }[]): string {
  const ts = Array.isArray(p) ? p : terms(p);
  if (!ts.length) return "0";
  return ts.map((t, i) => (i === 0 ? termStr(t.c, t.m) : t.c < 0 ? ` - ${termStr(-t.c, t.m)}` : ` + ${termStr(t.c, t.m)}`)).join("");
}
/**
 * The answer as a teacher writes it: highest power first, then by letter;
 * of two terms, a plus first where it would start with a minus (4 − x, not
 * −x + 4).
 */
export function usual(p: Poly): string {
  const ts = terms(p).sort((a, b) => degree(b.m) - degree(a.m) || (keyOf(a.m) < keyOf(b.m) ? -1 : keyOf(a.m) > keyOf(b.m) ? 1 : 0));
  if (ts.length === 2 && ts[0].c < 0 && ts[1].c > 0) ts.reverse();
  return polyStr(ts);
}

/** a·x + n, a polynomial of degree 1 at most, with any letter. */
export const linear = (a: number, n: number, x = "x"): Poly => add(mono(a, a ? { [x]: 1 } : {}), mono(n));

/** c₀ + c₁x + c₂x² + …, the coefficients lowest power first. */
export const fromCoefs = (cs: readonly number[], x = "x"): Poly => cs.reduce((p, c, k) => (c ? add(p, mono(c, k ? { [x]: k } : {})) : p), new Map() as Poly);

/** The coefficient of xᵏ (0 if there's none). */
export const coefOf = (p: Poly, k: number, x = "x"): number => terms(p).find((t) => (t.m[x] ?? 0) === k && Object.keys(t.m).every((v) => v === x || !t.m[v]))?.c ?? 0;

/** The product of the brackets whose answers these are: p/q gives (q·x − p); 0 gives x. */
export const fromAnswers = (x: string, ...answers: readonly (readonly [number, number])[]): Poly => answers.reduce((p, [n, d]) => mul(p, linear(d, -n, x)), mono(1));

/** The answers as written: "x = 3 or x = -2", a fraction as p/q in lowest terms. */
export function answersText(x: string, ...answers: readonly (readonly [number, number])[]): string {
  const v = ([p, q]: readonly [number, number]) => {
    const g = gcd(p, q) * Math.sign(q);
    const [n, d] = [p / g, q / g];
    return d === 1 ? `${n}` : `${n < 0 ? "-" : ""}${Math.abs(n)}/${d}`;
  };
  return answers.map((w) => `${x} = ${v(w)}`).join(" or ");
}

/** Written out with each letter standing for a piece: {u: (n) => …} writes u² as x when u is √x. */
export type As = Record<string, (n: number) => string>;

/** The polynomial written out as a teacher writes it (highest power first), letters standing for pieces (`as`). */
export function written(p: Poly, as: As = {}): string {
  const s = usual(p);
  if (!Object.keys(as).length) return s;
  // Each letter with its power, as its piece; a number in front stays (3u² with u = √x → 3x).
  return s.replace(/([a-z])(\^(\d+))?/g, (all, v: string, _p, n?: string) => (as[v] ? as[v](n ? Number(n) : 1) : all));
}

/**
 * The equation p = 0 as a teacher might write it: some terms moved across
 * (their signs turned), both sides times k, the sides swapped now and then.
 * The highest power stays where it is. Every term stays a whole number.
 */
export function teacherWrites(r: Rng, p: Poly, { move = 0.5, k = 1, as = {} as As } = {}): string {
  const ts = terms(p);
  const top = Math.max(...ts.map((t) => degree(t.m)));
  const left: { m: Mono; c: number }[] = [];
  const right: { m: Mono; c: number }[] = [];
  for (const t of [...ts].sort((a, b) => degree(b.m) - degree(a.m))) {
    const across = degree(t.m) !== top && r.next() < move;
    (across ? right : left).push({ m: t.m, c: (across ? -t.c : t.c) * k });
  }
  const side = (xs: { m: Mono; c: number }[]) => (xs.length ? written(new Map(xs.map((t) => [keyOf(t.m), t])), as) : "0");
  const [L, R] = [side(left), side(right)];
  return r.next() < 0.2 && right.length ? `${R} = ${L}` : `${L} = ${R}`;
}

