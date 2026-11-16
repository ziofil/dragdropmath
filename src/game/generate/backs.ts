/**
 * Steps back for expressions (see walk.ts): a sum written the long way, each
 * undone by one move. They return a few candidates; the walk keeps one the
 * chapter's moves undo.
 */
import type { Expr, MathState } from "../../expr/types";
import { frac, log, neg, num, prod, root, variable, pow } from "../../expr/build";
import type { RuleId } from "../../rules";
import { allNodes, children, mapTree } from "../../expr/tree";
import { parseExpr } from "../../expr/parse";
import { printState } from "../../expr/key";
import { sumOf, termExpr, termOf, termsOf, type UnMove } from "./unmove";
import { one, type Rng } from "./write";

/** A term's factors still hold a number to multiply (2·x·3: its m is x·3), not just a number inside one (√6, x²). */
const numbersToMultiply = (m: Expr | null) => !!m && (m.kind === "num" || (m.kind === "prod" && m.factors.some((f) => f.kind === "num")));

/** The expression (a lone side) with its terms changed by f. */
const onTerms = (s: MathState, f: (ts: Expr[]) => Expr[] | null): MathState | null => {
  if (s.sides.length !== 1) return null;
  const ts = f(termsOf(s.sides[0]));
  return ts ? { ...s, sides: [sumOf(ts)] } : null;
};

/** `ts` with `t` put in at a random place (not right next to `near`, when it can help it: a like term shouldn't sit beside its partner). */
function putIn(r: Rng, ts: Expr[], t: Expr, near = -1): Expr[] {
  const spots = Array.from({ length: ts.length + 1 }, (_, i) => i).filter((i) => near < 0 || ts.length < 2 || (i !== near && i !== near + 1));
  const at = one(r, spots.length ? spots : [ts.length]);
  return [...ts.slice(0, at), t, ...ts.slice(at)];
}

const TRIES = 4;
const many = (f: () => MathState | null): MathState[] => Array.from({ length: TRIES }, f).filter((x): x is MathState => !!x);

/** A number from 1 to `max` either sign, not 0 and not `not`. */
function part(r: Rng, max: number, not: number): number {
  for (;;) {
    const p = r.signed(1, max);
    if (p !== not) return p;
  }
}

/** 5x → 2x + 3x (or 7x − 2x, or 7 → 3 + 4): a term as two like terms, somewhere in the sum. Undone by combining them. */
export const splitLike = (max = 9, numbersOnly = false): UnMove => ({
  rules: ["combine"],
  trusted: true,
  on: (s, r) =>
    many(() =>
      onTerms(s, (ts) => {
        const i = r.int(0, ts.length - 1);
        const { k, m } = termOf(ts[i]);
        // Not a term with numbers still to multiply (2·x·3): it combines with nothing until they are.
        // Nor one with a fraction in it (6·(x²/y) − 5·(x²/y)): like terms are combined by what's on top, and these aren't.
        if (numbersToMultiply(m) || (numbersOnly && m !== null) || (m && allNodes(m).some((n) => n.kind === "frac"))) return null;
        const p = part(r, max, k);
        const q = k - p;
        if (q === 0 || Math.abs(q) > max) return null;
        const rest = ts.map((t, j) => (j === i ? termExpr(p, m) : t));
        return putIn(r, rest, termExpr(q, m), i);
      }),
    ),
});

/** Monomials a pair that cancels may be made of. */
const MONOS: ((r: Rng) => Expr)[] = [
  (r) => variable(one(r, ["x", "y", "a", "b"])),
  (r) => pow(variable(one(r, ["x", "y"])), num(2)),
  (r) => prod([variable("x"), variable(one(r, ["y", "a"]))]),
];

/** + 4y − 4y somewhere in the sum (of a letter it has, mostly). Undone by dropping one on the other. */
export const zeroPair = (): UnMove => ({
  rules: ["combine"],
  trusted: true,
  on: (s, r) =>
    many(() =>
      onTerms(s, (ts) => {
        const own = ts.map((t) => termOf(t).m).filter((m): m is Expr => !!m && !numbersToMultiply(m));
        const m = own.length && r.next() < 0.7 ? one(r, own) : one(r, MONOS)(r);
        const k = r.int(1, 7);
        const withOne = putIn(r, ts, termExpr(k, m));
        const at = withOne.findIndex((t) => termOf(t).k === k && termOf(t).m === m);
        return putIn(r, withOne, termExpr(-k, m), at);
      }),
    ),
});

/** 6x → 2·x·3 (or 3·2x): a term's number written as two factors. Undone by multiplying them. */
export const productCoef = (): UnMove => ({
  rules: ["multiply-numbers"],
  trusted: true,
  on: (s, r) =>
    many(() =>
      onTerms(s, (ts) => {
        const i = r.int(0, ts.length - 1);
        const { k, m } = termOf(ts[i]);
        // Once: 2·2·x·2 is a chore, not an exercise.
        if (numbersToMultiply(m)) return null;
        const ps = [2, 3, 4, 5].filter((p) => Math.abs(k) % p === 0 && Math.abs(k) / p >= 2);
        if (!ps.length) return null;
        const a = one(r, ps);
        const b = Math.abs(k) / a;
        const inner = m === null ? [num(a), num(b)] : r.next() < 0.5 ? [num(a), ...(m.kind === "prod" ? m.factors : [m]), num(b)] : [num(a), num(b), ...(m.kind === "prod" ? m.factors : [m])];
        const t = prod(inner);
        return ts.map((x, j) => (j === i ? (k < 0 ? neg(t) : t) : x));
      }),
    ),
});

/** A term moved to another place in the sum (b − 1 → −1 + b). Undone by moving it back. */
export const termMoved = (): UnMove => ({
  rules: ["commute"],
  trusted: true,
  on: (s, r) =>
    many(() =>
      onTerms(s, (ts) => {
        if (ts.length < 2) return null;
        const i = r.int(0, ts.length - 1);
        const rest = ts.filter((_, j) => j !== i);
        const at = r.int(0, rest.length);
        return at === i ? null : [...rest.slice(0, at), ts[i], ...rest.slice(at)];
      }),
    ),
});

/** The moves these steps back are undone by (for a walk's `needs`). */
export const COLLECTING: RuleId[] = ["combine"];

// ---------- the start as a person writes it ----------



/**
 * Every product written as a person writes it: its numbers multiplied and put
 * first, a letter met twice as a power (x·2·x → 2x², (x + 3)·3 → 3(x + 3)),
 * brackets last, a minus in front. Sums are left as they are. (walk.ts
 * checks the moves still get back from it.)
 */
export function written(s: MathState): MathState {
  return { ...s, sides: s.sides.map((e) => mapTree(e, tidyProduct)) };
}

function tidyProduct(e: Expr): Expr {
  if (e.kind !== "prod") return e;
  let k = 1;
  const letters = new Map<string, { base: Expr; n: number }>();
  const rest: Expr[] = [];
  const visit = (f: Expr) => {
    if (f.kind === "prod") return f.factors.forEach(visit);
    if (f.kind === "neg") {
      k = -k;
      return visit(f.arg);
    }
    if (f.kind === "num") {
      k *= f.value;
      return;
    }
    const isLetterPower = f.kind === "pow" && !f.radical && f.base.kind === "var" && f.exp.kind === "num";
    if (f.kind === "var" || isLetterPower) {
      const base = f.kind === "var" ? f : (f as Extract<Expr, { kind: "pow" }>).base;
      const n = f.kind === "var" ? 1 : ((f as Extract<Expr, { kind: "pow" }>).exp as Extract<Expr, { kind: "num" }>).value;
      const name = (base as Extract<Expr, { kind: "var" }>).name;
      const had = letters.get(name);
      letters.set(name, { base, n: (had?.n ?? 0) + n });
      return;
    }
    rest.push(f);
  };
  e.factors.forEach(visit);
  if (k === 0) return num(0);
  const ls = [...letters.values()].map(({ base, n }) => (n === 1 ? base : pow(base, num(n))));
  const fs = [...(Math.abs(k) === 1 ? [] : [num(Math.abs(k))]), ...ls, ...rest];
  const body = fs.length === 0 ? num(1) : fs.length === 1 ? fs[0] : prod(fs, e.id);
  return k < 0 ? neg(body) : body;
}

// ---------- powers ----------

type Pow = Extract<Expr, { kind: "pow" }>;

/** The powers of a letter in it (x³, not √x nor 2ˣ); `outside`: only those in no fraction (one fraction is enough to read). */
function letterPowers(s: MathState, outside = false): Pow[] {
  const out: Pow[] = [];
  const visit = (e: Expr, inFrac: boolean) => {
    if (e.kind === "pow" && !e.radical && e.base.kind === "var" && e.exp.kind === "num" && Number.isInteger(e.exp.value) && e.exp.value >= 2 && !(outside && inFrac)) out.push(e);
    for (const c of children(e)) visit(c, inFrac || e.kind === "frac");
  };
  s.sides.forEach((e) => visit(e, false));
  return out;
}

/** `s` with node `id` replaced by `by`. */
const replaced = (s: MathState, id: string, by: Expr): MathState => ({ ...s, sides: s.sides.map((e) => mapTree(e, (x) => (x.id === id ? by : x))) });

/** A power step back, made at a random power of a letter (a few tries). */
const atPower = (rules: RuleId[], f: (p: Pow, n: number, r: Rng) => Expr | null, outside = false): UnMove => ({
  rules,
  trusted: true,
  on: (s, r) =>
    many(() => {
      const ps = letterPowers(s, outside);
      if (!ps.length) return null;
      const p = one(r, ps);
      const made = f(p, (p.exp as Extract<Expr, { kind: "num" }>).value, r);
      return made && replaced(s, p.id, made);
    }),
});

const xp = (base: Expr, n: number): Expr => (n === 1 ? { ...base } : pow({ ...base }, num(n)));

/** x⁷ → x³·x⁴. Undone by merging the powers, then adding the exponents. */
export const splitPower = (): UnMove =>
  atPower(["merge-powers", "combine"], (p, n, r) => {
    const a = r.int(1, n - 1);
    return prod([xp(p.base, a), xp(p.base, n - a)]);
  });

/** x⁶ → (x²)³. Undone by the power of a power, then multiplying the exponents. */
export const nestPower = (): UnMove =>
  atPower(["power-of-power", "multiply-numbers"], (p, n, r) => {
    const ds = [2, 3].filter((d) => n % d === 0 && n / d >= 2);
    if (!ds.length) return null;
    const d = one(r, ds);
    return pow(pow({ ...p.base }, num(n / d)), num(d));
  });

/** x⁴ → x⁷/x³. Undone by dividing the powers, then subtracting the exponents. */
export const overPower = (): UnMove =>
  atPower(["divide-powers", "combine"], (p, n, r) => {
    const k = r.int(1, 4);
    return frac(xp(p.base, n + k), xp(p.base, k));
  }, true);

/** The number whose `n`th power `k` is (8, 3 → 2), if it's a whole one from 2 up. */
const nthRoot = (k: number, n: number): number | null => {
  const m = Math.round(Math.abs(k) ** (1 / n));
  return m >= 2 && m ** n === Math.abs(k) ? m : null;
};

/** x³y³ → (xy)³, 8x³ → (2x)³: factors to the same power, as one power of their product. Undone by the power of a product (then working out the number's power). */
export const groupPower = (): UnMove => ({
  rules: ["power-of-product", "tap-power", "evaluate-power"],
  trusted: true,
  on: (s, r) =>
    many(() => {
      const prods = s.sides.flatMap((e) => allNodes(e)).filter((e): e is Extract<Expr, { kind: "prod" }> => e.kind === "prod");
      if (!prods.length) return null;
      const P = one(r, prods);
      const pows = P.factors.filter((f): f is Pow => f.kind === "pow" && !f.radical && f.base.kind === "var" && f.exp.kind === "num" && f.exp.value >= 2);
      if (!pows.length) return null;
      const n = (one(r, pows).exp as Extract<Expr, { kind: "num" }>).value;
      const same = pows.filter((f) => (f.exp as Extract<Expr, { kind: "num" }>).value === n);
      const k = P.factors.find((f): f is Extract<Expr, { kind: "num" }> => f.kind === "num");
      const root = k ? nthRoot(k.value, n) : null;
      if (same.length + (root ? 1 : 0) < 2) return null;
      const inside = [...(root ? [num(root)] : []), ...same.map((f) => ({ ...f.base }))];
      const rest = P.factors.filter((f) => !same.includes(f as Pow) && !(root && f === k));
      const grouped = pow(prod(inside), num(n));
      return replaced(s, P.id, rest.length ? prod([...rest, grouped]) : grouped);
    }),
});

// ---------- logs ----------

/** ln(A·B) → ln(A) + ln(B), ln(A/B) → ln(A) − ln(B): a log of a product (or quotient) as a sum of logs, where it is a term. Undone by combining the logs. */
export const splitLog = (): UnMove => ({
  rules: ["combine-logs"],
  trusted: true,
  on: (s, r) =>
    many(() =>
      onTerms(s, (ts) => {
        const i = r.int(0, ts.length - 1);
        const t = ts[i];
        if (t.kind !== "log") return null;
        const a = t.arg;
        const parts: Expr[] | null =
          a.kind === "prod" && a.factors.length >= 2
            ? ((k) => [log(t.base, a.factors.length - k === 1 ? a.factors[k] : prod(a.factors.slice(k))), log(t.base, k === 1 ? a.factors[0] : prod(a.factors.slice(0, k)))].reverse())(r.int(1, a.factors.length - 1))
            : a.kind === "frac"
              ? [log(t.base, a.num), neg(log(t.base, a.den))]
              : null;
        return parts && [...ts.slice(0, i), ...parts, ...ts.slice(i + 1)];
      }),
    ),
});

// ---------- roots ----------

/** The order of a root (√: 2, ∛: 3), if it's a root of a number. */
const rootOrderOf = (m: Expr): number | null =>
  m.kind === "pow" && m.radical && m.exp.kind === "frac" && m.exp.num.kind === "num" && m.exp.num.value === 1 && m.exp.den.kind === "num" && m.base.kind === "num" ? m.exp.den.value : null;

/** 3√2 → √18, 2∛3 → ∛24: a number in front taken under its root. Undone by splitting off the power, pulling it out, and working out its root. */
export const rootIn = (): UnMove => ({
  rules: ["split-square", "pull-out-of-power", "evaluate-root", "multiply-numbers"],
  trusted: true,
  on: (s, r) =>
    many(() =>
      onTerms(s, (ts) => {
        const i = r.int(0, ts.length - 1);
        const { k, m } = termOf(ts[i]);
        const n = m && rootOrderOf(m);
        if (!m || !n || k < 2 || k ** n * ((m as Pow).base as Extract<Expr, { kind: "num" }>).value > 200) return null;
        const under = ((m as Pow).base as Extract<Expr, { kind: "num" }>).value;
        return ts.map((t, j) => (j === i ? root(num(k ** n * under), n) : t));
      }),
    ),
});

/** x² → ∛(x⁶): a letter's power written as a root of a bigger power. Undone by writing the root as a power, the power of a power, and working out the exponent. */
export const rootOfPower = (): UnMove =>
  atPower(["root-notation", "power-of-power", "multiply-numbers", "multiply-fractions", "evaluate-fraction", "divide-numbers"], (p, n, r) => {
    const k = one(r, [2, 3, 3, 4].filter((k) => n * k <= 12));
    return k ? root(pow({ ...p.base }, num(n * k)), k) : null;
  });

/** x^(5/2) → x²·√x: a fraction power split into a whole power and a root. Undone by merging them, and adding the fractions in the exponent. */
export const splitFractionPower = (): UnMove => ({
  rules: ["merge-powers", "root-notation", "add-fractions", "expand-fraction", "multiply-numbers", "combine", "evaluate-fraction"],
  trusted: true,
  on: (s, r) =>
    many(() => {
      const ps = s.sides.flatMap((e) => allNodes(e)).filter((e): e is Pow => e.kind === "pow" && !e.radical && e.base.kind === "var" && e.exp.kind === "frac" && e.exp.num.kind === "num" && e.exp.den.kind === "num");
      if (!ps.length) return null;
      const p = one(r, ps);
      const f = p.exp as Extract<Expr, { kind: "frac" }>;
      const [a, b] = [(f.num as Extract<Expr, { kind: "num" }>).value, (f.den as Extract<Expr, { kind: "num" }>).value];
      const w = Math.floor(a / b);
      if (w < 1 || a % b === 0) return null;
      const rest = a - w * b;
      const part = rest === 1 ? root({ ...p.base }, b) : pow({ ...p.base }, frac(num(rest), num(b)));
      return replaced(s, p.id, prod([xp(p.base, w), part]));
    }),
});

// ---------- powers with letters in the exponent ----------

/** Powers whose exponent has a letter in it (2ˣ, 3^(x + 1), a^(2n)), not inside a fraction when `outside`. */
function letterExponents(s: MathState, outside = false): Pow[] {
  const out: Pow[] = [];
  const visit = (e: Expr, inFrac: boolean) => {
    if (e.kind === "pow" && !e.radical && (e.base.kind === "num" || e.base.kind === "var") && allNodes(e.exp).some((x) => x.kind === "var") && !(outside && inFrac)) out.push(e);
    for (const c of children(e)) visit(c, inFrac || e.kind === "frac");
  };
  s.sides.forEach((e) => visit(e, false));
  return out;
}

/** A step back at a random power with a letter in its exponent. */
const atLetterExponent = (rules: RuleId[], f: (p: Pow, r: Rng) => Expr | null, outside = false): UnMove => ({
  rules,
  trusted: true,
  on: (s, r) =>
    many(() => {
      const ps = letterExponents(s, outside);
      if (!ps.length) return null;
      const p = one(r, ps);
      const made = f(p, r);
      return made && replaced(s, p.id, made);
    }),
});

/** A fresh copy (new ids) of a piece, as written. */
const same = (e: Expr): Expr => parseExpr(printState({ sides: [e] }));

/** An exponent as two parts that add up to it: x + 3 → x and 3; 5x → 2x and 3x. Null if it won't split. */
function twoParts(e: Expr, r: Rng): [Expr, Expr] | null {
  if (e.kind === "sum" && e.terms.length >= 2) {
    const k = r.int(1, e.terms.length - 1);
    const ts = e.terms.map(same);
    return [sumOf(ts.slice(0, k)), sumOf(ts.slice(k))];
  }
  const { k, m } = termOf(e);
  if (m && k >= 2) {
    const p = r.int(1, k - 1);
    return [termExpr(p, same(m)), termExpr(k - p, same(m))];
  }
  return null;
}

/** 2^(x + 3) → 2ˣ·2³, 3^(5x) → 3^(2x)·3^(3x): a power as a product of powers of its base. Undone by merging them, then adding up the exponent. */
export const splitLetterExponent = (): UnMove =>
  atLetterExponent(["merge-powers", "combine"], (p, r) => {
    const parts = twoParts(p.exp, r);
    // a¹ is written a.
    return parts && prod(parts.map((x) => (x.kind === "num" && x.value === 1 ? same(p.base) : pow(same(p.base), x))));
  });

/** 3^(2x) → (3ˣ)², 2^(3x) → (2³)ˣ: a power as a power of a power. Undone by the power of a power (then the numbers first). */
export const nestLetterExponent = (): UnMove =>
  atLetterExponent(["power-of-power", "numbers-first", "multiply-numbers"], (p, r) => {
    const { k, m } = termOf(p.exp);
    if (!m || k < 2 || k > 4) return null;
    return r.next() < 0.6 ? pow(pow(same(p.base), same(m)), num(k)) : pow(pow(same(p.base), num(k)), same(m));
  });

/** 5^(x + 1) → 5^(x + 3)/5²: a power over a power of its base. Undone by dividing the powers, then working out the exponent. */
export const overLetterExponent = (): UnMove =>
  atLetterExponent(["divide-powers", "combine"], (p, r) => {
    const k = r.int(1, 3);
    const up = plusConstant(p.exp, k);
    return frac(pow(same(p.base), up), k === 1 ? same(p.base) : pow(same(p.base), num(k)));
  }, true);

/** An exponent with a number added (x + 1, 3 → x + 4). */
function plusConstant(e: Expr, k: number): Expr {
  const ts = termsOf(e).map(same);
  const i = ts.findIndex((t) => termOf(t).m === null);
  if (i < 0) return sumOf([...ts, num(k)]);
  const v = termOf(ts[i]).k + k;
  return sumOf(v === 0 ? ts.filter((_, j) => j !== i) : ts.map((t, j) => (j === i ? termExpr(v, null) : t)));
}


/**
 * A letter or a power of one, somewhere, written as e to its log: x³ →
 * e^(ln(x³)). Undone by e^ undoing the ln. (Letters positive.)
 */
export const eOfLog = (): UnMove => ({
  rules: ["exp-of-log"],
  trusted: true,
  positive: true,
  on: (s, r) =>
    many(() => {
      const nodes = s.sides.flatMap((e) => allNodes(e)).filter((n) => n.kind === "var" || (n.kind === "pow" && n.base.kind === "var" && n.exp.kind === "num"));
      if (!nodes.length) return null;
      const n = one(r, nodes);
      // Not inside a log already (ln(e^(ln x)) is a chore, not an exercise).
      const inLog = s.sides.some((e) => allNodes(e).some((m) => m.kind === "log" && allNodes(m).some((k) => k.id === n.id)));
      if (inLog) return null;
      return { ...s, sides: s.sides.map((e) => mapTree(e, (x) => (x.id === n.id ? pow({ kind: "const", id: `e${x.id}`, name: "e" }, log({ kind: "const", id: `b${x.id}`, name: "e" }, x)) : x))) };
    }),
});
