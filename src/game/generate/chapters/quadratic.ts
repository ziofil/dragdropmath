/**
 * Second-degree equations, made from their answers: x = 3 or x = −2 is
 * (x − 3)(x + 2) = 0, multiplied out (x² − x − 6 = 0), then written as a
 * teacher might, with terms moved across, both sides multiplied, the sides
 * swapped. Solved by factoring and splitting (a product is 0 when a factor
 * is), or by getting the square alone and taking its root (±).
 */
import { gcd, one, type Draft, type Level, type Rng, type Shape } from "../write";

/** a·x² + b·x + c as [a, b, c]. */
type Q = [number, number, number];

/** (p·x − q)·(s·x − t), multiplied out. */
const times = ([p, q]: [number, number], [s, t]: [number, number]): Q => [p * s, -(p * t + q * s), q * t];

/** One term as written: "3x^2", "-x", "7" (null for a 0). */
const termOf = (c: number, pow: 0 | 1 | 2, x: string): string | null =>
  c === 0 ? null : pow === 0 ? `${c}` : `${c === 1 ? "" : c === -1 ? "-" : c}${pow === 2 ? `${x}^2` : x}`;

/** Terms written one after another, with their signs: ["3x^2", "-x", "7"] → "3x^2 - x + 7" ("0" if none). */
function sumStr(ts: string[]): string {
  if (!ts.length) return "0";
  return ts.map((t, i) => (i === 0 ? t : t.startsWith("-") ? ` - ${t.slice(1)}` : ` + ${t}`)).join("");
}

/**
 * The equation a·x² + b·x + c = 0 as a teacher might write it: some terms
 * moved across (their signs turned), both sides multiplied by k, the sides
 * swapped. Every term stays a whole number.
 */
function written(r: Rng, [a, b, c]: Q, x: string, { move = 0.5, k = 1 } = {}): string {
  const left: string[] = [];
  const right: string[] = [];
  const put = (coef: number, pow: 0 | 1 | 2) => {
    if (coef === 0) return;
    const across = pow !== 2 && r.next() < move;
    const t = termOf(across ? -coef * k : coef * k, pow, x)!;
    (across ? right : left).push(t);
  };
  put(a, 2);
  put(b, 1);
  put(c, 0);
  const [L, R] = [sumStr(left), sumStr(right)];
  return r.next() < 0.2 && right.length ? `${R} = ${L}` : `${L} = ${R}`;
}

/** The answers, as written: "x = 3 or x = -2", a fraction as p/q. */
function answers(x: string, ...vs: [number, number][]): string {
  const v = ([p, q]: [number, number]) => {
    const g = gcd(p, q) * Math.sign(q);
    const [n, d] = [p / g, q / g];
    return d === 1 ? `${n}` : `${n < 0 ? "-" : ""}${Math.abs(n)}/${d}`;
  };
  return vs.map((w) => `${x} = ${v(w)}`).join(" or ");
}

/**
 * The way a side's (x + d)² is multiplied out, a few moves at a time:
 * (x + d)(x + d), x(x + d) + d(x + d), x·x + dx + dx + d², x² + 2dx + d².
 * `other` is the rest of the equation; `where` its conditions.
 */
function squareOut(x: string, d: number, other: string, where: string): string[] {
  const xd = d === 0 ? x : `${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
  if (d === 0) return [`${other} = ${x}·${x} where ${where}`];
  const dt = (k: number) => termOf(k, 1, x)!;
  return [
    `${other} = (${xd})(${xd}) where ${where}`,
    // (Not with d = ±1: the app never writes 1·(x + 1).)
    ...(Math.abs(d) === 1 ? [] : [`${other} = ${x}(${xd}) ${d < 0 ? "-" : "+"} ${Math.abs(d)}(${xd}) where ${where}`]),
    `${other} = ${sumStr([`${x}·${x}`, dt(d), dt(d), `${d * d}`])} where ${where}`,
    `${other} = ${sumStr([termOf(1, 2, x)!, dt(2 * d), `${d * d}`])} where ${where}`,
  ];
}

const letter = (r: Rng) => (r.next() < 0.75 ? "x" : one(r, ["t", "y", "a"]));
const draft = (shape: string, start: string, goal: string, via: string[] = []): Draft => ({ shape, start, goal, via });

/** Everything on the left, = 0: "x^2 - 7x + 12 = 0". */
const zeroForm = ([a, b, c]: Q, x: string) => `${sumStr([termOf(a, 2, x), termOf(b, 1, x), termOf(c, 0, x)].filter((t): t is string => t !== null))} = 0`;
/** (p·x − q) as written: "x - 3", "2x + 1". */
const factor = ([p, q]: [number, number], x: string) => `${p === 1 ? "" : p}${x} ${q < 0 ? "+" : "-"} ${Math.abs(q)}`;
/** The way through a factoring: everything on one side, then the product of the two brackets. */
const factoring = (fs: [[number, number], [number, number]], x: string) => [zeroForm(times(fs[0], fs[1]), x), `(${factor(fs[0], x)})(${factor(fs[1], x)}) = 0`];

const shapes: Shape[] = [
  {
    id: "pure",
    name: "a square equal to a number",
    make: (r) => {
      // x² = 9, 4x² − 36 = 0, 25 = 9x² (the answers ± a whole number or a fraction).
      const x = letter(r);
      const [p, q] = [r.int(1, 9), one(r, [1, 1, 1, 2, 3])];
      if (gcd(p, q) !== 1) return null;
      const k = one(r, [1, 1, 2, 3, 4]);
      return draft("pure", written(r, [q * q * k, 0, -p * p * k], x, { move: 0.6 }), answers(x, [p, q], [-p, q]));
    },
  },
  {
    id: "pure-fraction",
    name: "a fraction in front of x²",
    make: (r) => {
      // (1/q)·x² = p² ... written as (p'/q)x² = c with whole answers ±n.
      const x = letter(r);
      const [a, q, n] = [r.int(1, 3), one(r, [2, 3, 4]), r.int(1, 6)];
      if (gcd(a, q) !== 1 || (a * n * n) % q !== 0) return null;
      const c = (a * n * n) / q;
      return draft("pure-fraction", r.next() < 0.5 ? `(${a}/${q})${x}^2 = ${c}` : `(${a}/${q})${x}^2 - ${c} = 0`, answers(x, [n, 1], [-n, 1]), [`${x}^2 = ${n * n}`]);
    },
  },
  {
    id: "pure-root",
    name: "a square equal to a number that isn't a square",
    make: (r) => {
      // x² − 5 = 0 → x = √5 or x = −√5.
      const x = letter(r);
      const n = one(r, [2, 3, 5, 6, 7, 10]);
      return draft("pure-root", written(r, [1, 0, -n], x, { move: 0.6 }), `${x} = √${n} or ${x} = -√${n}`);
    },
  },
  {
    id: "spurious",
    name: "no number on its own: take the letter out",
    make: (r) => {
      // a·x² + b·x = 0 → x(ax + b) = 0 → x = 0 or x = −b/a.
      const x = letter(r);
      const [p, q] = [r.signed(1, 9), one(r, [1, 1, 2, 3])];
      if (gcd(p, q) !== 1) return null;
      const k = one(r, [1, 1, 2, 3]);
      const [a, b] = [q * k, -p * k];
      return draft("spurious", written(r, [a, b, 0], x), answers(x, [0, 1], [p, q]));
    },
  },
  {
    id: "factors-one",
    name: "x² and two whole answers",
    make: (r) => {
      const x = letter(r);
      const [u, v] = [r.signed(1, 9), r.signed(1, 9)];
      if (u === v || u === -v || u === 0 || v === 0) return null;
      return draft("factors-one", written(r, times([1, u], [1, v]), x, { move: 0.3 }), answers(x, [u, 1], [v, 1]), factoring([[1, u], [1, v]], x));
    },
  },
  {
    id: "factors-a",
    name: "a number in front of x², and a fraction for an answer",
    make: (r) => {
      // (px − q)(x − v) = 0 → x = q/p or x = v.
      const x = letter(r);
      const [p, q, v] = [one(r, [2, 3, 4, 5]), r.signed(1, 7), r.signed(1, 6)];
      // Both pairs of the split middle term share a number of 2 or more (px(x − v) and −q(x − v)): a shared 1 can't be taken out by hand.
      if (gcd(p, q) !== 1 || q === p * v || Math.abs(q) < 2 || Math.abs(v) < 2) return null;
      return draft("factors-a", written(r, times([p, q], [1, v]), x, { move: 0.3 }), answers(x, [q, p], [v, 1]), factoring([[p, q], [1, v]], x));
    },
  },
  {
    id: "square-of-bracket",
    name: "a bracket squared, equal to a number",
    make: (r) => {
      // (px + q)² = m² → px + q = m or px + q = −m.
      const x = letter(r);
      const [p, q, m] = [one(r, [1, 1, 2, 3]), r.signed(1, 6), r.int(1, 7)];
      if (q === m || q === -m) return null;
      const br = `${p === 1 ? "" : p}${x} ${q < 0 ? "-" : "+"} ${Math.abs(q)}`;
      const k = one(r, [1, 1, 1, 2, 3]);
      const left = `${k === 1 ? "" : k}(${br})^2`;
      const start = r.next() < 0.3 ? `${k * m * m} = ${left}` : `${left} = ${k * m * m}`;
      // The square alone, then its two roots, each solved.
      return draft("square-of-bracket", start, answers(x, [m - q, p], [-m - q, p]), [`(${br})^2 = ${m * m}`, `${br} = ${m} or ${br} = ${-m}`]);
    },
  },
  {
    id: "expand-first",
    name: "brackets to multiply out first",
    make: (r) => {
      // (x + u)(x + v) = b·x + c where the x² cancels down to (x − r1)(x − r2) = 0.
      const x = letter(r);
      const [r1, r2, u, v] = [r.signed(1, 7), r.signed(1, 7), r.signed(1, 6), r.signed(1, 6)];
      if (r1 === r2 || r1 === -r2) return null;
      // (x + u)(x + v) − (x − r1)(x − r2) = (u + v + r1 + r2)x + (uv − r1·r2).
      const [b, c] = [u + v + r1 + r2, u * v - r1 * r2];
      if (b === 0 && c === 0) return null;
      const bracket = (w: number) => `(${x} ${w < 0 ? "-" : "+"} ${Math.abs(w)})`;
      const right = sumStr([termOf(b, 1, x), termOf(c, 0, x)].filter((t): t is string => t !== null));
      const expanded = `${sumStr([termOf(1, 2, x), termOf(u + v, 1, x), termOf(u * v, 0, x)].filter((t): t is string => t !== null))} = ${right}`;
      // Multiplied out, then collected: x² + vx + ux + uv, then x² + (u + v)x + uv.
      const out = `${sumStr([termOf(1, 2, x), termOf(v, 1, x), termOf(u, 1, x), termOf(u * v, 0, x)].filter((t): t is string => t !== null))} = ${right}`;
      // (Not with u = ±1: the app never writes 1·(x + v).)
      const first = Math.abs(u) === 1 ? [] : [`${x}${bracket(v)} ${u < 0 ? "-" : "+"} ${Math.abs(u)}${bracket(v)} = ${right}`];
      return draft("expand-first", `${bracket(u)}${bracket(v)} = ${right}`, answers(x, [r1, 1], [r2, 1]), [...first, out, expanded, ...factoring([[1, r1], [1, r2]], x)]);
    },
  },
  {
    id: "root-cancels",
    name: "a root equal to x and a number: the squares cancel",
    make: (r) => {
      // √(x² + k) = x + d → x² + k = x² + 2dx + d² → x = (k − d²)/(2d); where x ≥ −d (a root is never negative).
      const x = letter(r);
      const [d, x0] = [r.int(1, 4), r.int(-1, 6)];
      const k = 2 * d * x0 + d * d;
      if (k <= 0 || x0 < -d) return null;
      const where = `${x} ≥ ${-d}`;
      // Squared, then the brackets multiplied out: the x² on each side cancel.
      return draft("root-cancels", `√(${x}^2 + ${k}) = ${x} + ${d} where ${where}`, `${x} = ${x0}`, [
        `${x}^2 + ${k} = (${x} + ${d})^2 where ${where}`,
        ...squareOut(x, d, `${x}^2 + ${k}`, where),
      ]);
    },
  },
  {
    id: "root-squared",
    name: "a root equal to x and a number: squared, a second-degree equation",
    make: (r) => {
      // √(a·x + b) = x + d squares to x² + (2d − a)x + d² − b = 0, made (x − r1)(x − r2): a = 2d + r1 + r2, b = d² − r1·r2.
      // Where a·x + b ≥ 0 (the root's inside) and x ≥ −d (what it equals): a root below −d is crossed out.
      const x = letter(r);
      const [d, r1, r2] = [r.int(-2, 4), r.signed(1, 6), r.signed(1, 6)];
      const [a, b] = [2 * d + r1 + r2, d * d - r1 * r2];
      if (r1 === r2 || a <= 0 || b === 0 || Math.abs(b) > 30) return null;
      const valid = [r1, r2].filter((v) => v >= -d);
      if (!valid.length) return null;
      const inside = `${a === 1 ? "" : a}${x} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
      const right = d === 0 ? x : `${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
      // The bound of the inside: x ≥ −b/a, a whole number or a fraction.
      const g = gcd(b, a);
      const bound = a / g === 1 ? `${-b / g}` : `${-b < 0 ? "-" : ""}${Math.abs(b / g)}/${a / g}`;
      // (Once, where the two bounds are the same.)
      const where = bound === `${-d}` ? `${x} ≥ ${-d}` : `${x} ≥ ${bound}, ${x} ≥ ${-d}`;
      const squared = `${inside} = (${right})^2`;
      return draft("root-squared", `√(${inside}) = ${right} where ${where}`, answers(x, ...valid.map((v): [number, number] => [v, 1])), [
        `${squared} where ${where}`,
        ...squareOut(x, d, inside, where),
        `${zeroForm([1, -(r1 + r2), r1 * r2], x)} where ${where}`,
        `(${factor([1, r1], x)})(${factor([1, r2], x)}) = 0 where ${where}`,
      ]);
    },
  },
  {
    id: "fraction-zero",
    name: "a fraction equal to 0: its bottom is never 0",
    make: (r) => {
      // (x − r1)(x − r2), multiplied out, over (x − r1) = 0, where x ≠ r1: x = r1 is crossed out, x = r2 is the answer.
      const x = letter(r);
      const [r1, r2] = [r.signed(1, 6), r.signed(1, 6)];
      if (r1 === r2 || r1 === -r2) return null;
      const top = zeroForm(times([1, r1], [1, r2]), x).replace(" = 0", "");
      const bottom = factor([1, r1], x);
      const where = `${x} ≠ ${r1}`;
      return draft("fraction-zero", `(${top})/(${bottom}) = 0 where ${where}`, `${x} = ${r2}`, [`${top} = 0 where ${where}`, `(${bottom})(${factor([1, r2], x)}) = 0 where ${where}`]);
    },
  },
];

// Right by construction (made from their answers); the tests solve every shape with the moves.
const chosen = (...ids: string[]) => ids.map((id) => shapes.find((s) => s.id === id)! as Shape);

export const shapesByLevel: Record<Level, Shape[]> = {
  easy: chosen("pure", "spurious", "factors-one"),
  medium: chosen("pure-root", "factors-one", "square-of-bracket", "factors-a", "pure-fraction", "root-cancels"),
  hard: chosen("factors-a", "square-of-bracket", "expand-first", "pure-root", "root-squared", "fraction-zero"),
};
