/** Multiplying brackets: each term of one by each term of the other, then collect. */
import { lin, plus, type Draft, type Level, type Rng, type Shape } from "../write";

/** c·v as a person writes it: "3x^2", "x", "-x", "7" (v empty: a number). */
const term = (c: number, v: string) => (v === "" ? `${c}` : c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);
/** Terms in the order given, zeros left out: [[1, "x^2"], [-3, "x"], [2, ""]] → "x^2 - 3x + 2". */
const poly = (ts: [number, string][]) =>
  ts
    .filter(([c]) => c !== 0)
    .map(([c, v], i) => (i === 0 ? term(c, v) : c < 0 ? ` - ${term(-c, v)}` : ` + ${term(c, v)}`))
    .join("");
/** " + 3(x + 1)", " - (x + 1)": d times a bracket, after a term. */
const times = (d: number, inside: string) => `${d < 0 ? " - " : " + "}${Math.abs(d) === 1 ? "" : Math.abs(d)}(${inside})`;

const letter = (r: Rng, ls: string[]) => ls[r.int(0, ls.length - 1)];

/**
 * (ax + b)(cx + d), the way the moves go: the first bracket over the second's
 * terms (cx, then d), the cx part multiplied out first. Then the goal.
 */
function expand(a: number, b: number, c: number, d: number, x: string) {
  const first = lin(a, b, x);
  return {
    via: [`(${first})*${term(c, x)}${times(d, first)}`, `${poly([[a * c, `${x}^2`], [b * c, x]])}${times(d, first)}`],
    /** All four products, before collecting. */
    four: poly([[a * c, `${x}^2`], [b * c, x], [a * d, x], [b * d, ""]]),
    goal: poly([[a * c, `${x}^2`], [a * d + b * c, x], [b * d, ""]]),
    along: [a * c, b * c, a * d, b * d, a * d + b * c].filter((n) => n !== 0),
  };
}

/** (x - k)^2 + 2kx = x^2 + k^2: the middle term cancels. */
function squarePlus(r: Rng): Draft {
  const k = r.signed(2, 5);
  const e = expand(1, k, 1, k, "x");
  const c = -2 * k;
  const tail = `${c < 0 ? " - " : " + "}${term(Math.abs(c), "x")}`;
  return {
    shape: "square",
    start: `(${lin(1, k)})^2${tail}`,
    goal: poly([[1, "x^2"], [k * k, ""]]),
    via: [`(${lin(1, k)})(${lin(1, k)})${tail}`, `${e.via[1]}${tail}`, `${e.goal}${tail}`],
    numbers: [k, c],
    along: e.along,
  };
}

/** A draft from another shape, written as this one (a shape that's sometimes made the other way). */
const another = (id: string, r: Rng, as: string): Draft | null => {
  const d = all.find((s) => s.id === id)!.make(r);
  return d && { ...d, shape: as };
};

const all: Shape[] = [
  {
    id: "letter-times",
    name: "a letter times a bracket",
    make: (r) => {
      // x(x + b), x(ax + b)
      const x = letter(r, ["x", "x", "y", "a"]);
      const a = r.next() < 0.6 ? 1 : r.int(2, 5);
      const b = r.int(1, 9) * (r.next() < 0.3 ? -1 : 1);
      return {
        shape: "letter-times",
        start: `${x}(${lin(a, b, x)})`,
        goal: poly([[a, `${x}^2`], [b, x]]),
        via: [],
        numbers: [a, b],
        along: [b],
      };
    },
  },
  {
    id: "power-times",
    name: "a power comes out of the bracket",
    make: (r) => {
      // x(x^2 + b) = x^3 + bx;  x^2(x + b) = x^3 + bx^2
      const b = r.int(1, 9) * (r.next() < 0.3 ? -1 : 1);
      if (r.next() < 0.5) return { shape: "power-times", start: `x(x^2${plus(b)})`, goal: poly([[1, "x^3"], [b, "x"]]), via: [], numbers: [b], along: [b] };
      return { shape: "power-times", start: `x^2(${lin(1, b)})`, goal: poly([[1, "x^3"], [b, "x^2"]]), via: [], numbers: [b], along: [b] };
    },
  },
  {
    id: "then-collect",
    name: "a letter times a bracket, then collect",
    make: (r) => {
      // x(x + p) + qx = x^2 + (p + q)x
      const x = letter(r, ["x", "x", "y", "a"]);
      const p = r.signed(1, 6);
      const q = r.signed(1, 6);
      if (p + q === 0) return null;
      return {
        shape: "then-collect",
        start: `${x}(${lin(1, p, x)})${q < 0 ? " - " : " + "}${term(Math.abs(q), x)}`,
        goal: poly([[1, `${x}^2`], [p + q, x]]),
        via: [],
        numbers: [p, q],
        along: [p + q],
      };
    },
  },
  {
    id: "two-plus",
    name: "two brackets, both plus",
    make: (r) => {
      // (x + p)(x + q)
      const x = letter(r, ["x", "x", "a", "p"]);
      const p = r.int(1, 6);
      const q = r.int(1, 6);
      if (p === q) return null;
      const e = expand(1, p, 1, q, x);
      return { shape: "two-plus", start: `(${lin(1, p, x)})(${lin(1, q, x)})`, goal: e.goal, via: e.via.slice(1), numbers: [p, q], along: e.along };
    },
  },
  {
    id: "times-square",
    name: "a bracket times a bracket with a square",
    make: (r) => {
      // (x + p)(x^2 + q) = x^3 + px^2 + qx + pq
      const p = r.int(1, 4);
      const q = r.int(1, 4);
      return {
        shape: "times-square",
        start: `(${lin(1, p)})(x^2 + ${q})`,
        goal: poly([[1, "x^3"], [p, "x^2"], [q, "x"], [p * q, ""]]),
        via: [`(${lin(1, p)})*x^2${times(q, lin(1, p))}`, `${poly([[1, "x^3"], [p, "x^2"]])}${times(q, lin(1, p))}`],
        numbers: [p, q],
        along: [p, q, p * q],
      };
    },
  },
  {
    id: "signs",
    name: "two brackets, a minus in one",
    make: (r) => {
      // (ax + b)(x + d), a sign somewhere
      const x = letter(r, ["x", "x", "a", "p"]);
      if (r.next() < 0.3) return another("difference", r, "signs");
      const a = r.next() < 0.6 ? 1 : 2;
      const b = r.signed(1, 5);
      const d = r.signed(1, 5);
      // One minus: two of them, or a big number with a 2 in front, makes it a hard one.
      if ((b > 0) === (d > 0) || (a > 1 && Math.abs(d) > 3)) return null;
      if (a === 1 && b === -d) return null;
      if (a > 1 && b % a === 0) return null;
      const e = expand(a, b, 1, d, x);
      return { shape: "signs", start: `(${lin(a, b, x)})(${lin(1, d, x)})`, goal: e.goal, via: e.via.slice(1), numbers: [a, b, d], along: e.along };
    },
  },
  {
    id: "both-numbers",
    name: "a number in front of x in both brackets",
    make: (r) => {
      // (ax + b)(cx + d)
      const a = r.int(2, 3);
      const c = r.int(2, 3);
      const b = r.signed(1, 4);
      const d = r.signed(1, 4);
      if (b < 0 && d < 0) return null;
      if (b % a === 0 || d % c === 0 || a * d + b * c === 0 || (a === c && b === d)) return null;
      const e = expand(a, b, c, d, "x");
      return { shape: "both-numbers", start: `(${lin(a, b)})(${lin(c, d)})`, goal: e.goal, via: [...e.via, e.four], numbers: [a, b, c, d], along: e.along };
    },
  },
  {
    id: "difference",
    name: "the middle terms cancel",
    make: (r) => {
      // (x + k)(x - k), or (x + y)(x - y)
      if (r.next() < 0.25) {
        const [x, y] = [["x", "y"], ["a", "b"], ["p", "q"]][r.int(0, 2)];
        // The minus first: (x + y)(x - y) takes a move more.
        const [s, t] = [-1, 1];
        const first = `${x}${s > 0 ? " + " : " - "}${y}`;
        return {
          shape: "difference",
          start: `(${first})(${x}${t > 0 ? " + " : " - "}${y})`,
          goal: `${x}^2 - ${y}^2`,
          via: [`${x}^2${s > 0 ? " + " : " - "}${x}${y}${t > 0 ? " + " : " - "}${y}(${first})`],
          numbers: [],
          along: [],
        };
      }
      const x = letter(r, ["x", "x", "a", "y"]);
      const k = r.int(2, 9);
      const [b, d] = [-k, k];
      const e = expand(1, b, 1, d, x);
      return { shape: "difference", start: `(${lin(1, b, x)})(${lin(1, d, x)})`, goal: e.goal, via: e.via.slice(1), numbers: [k], along: e.along.filter((n) => n !== 0) };
    },
  },
  {
    id: "then-take",
    name: "two brackets, then a term taken away",
    make: (r) => {
      // (x + p)(x + q) - x^2  or  (x + p)(x + q) + cx with the x terms cancelling
      const x = letter(r, ["x", "a", "a", "p"]);
      const p = r.signed(1, 5);
      const q = r.int(1, 5);
      // One of them 1, so it stays a medium one.
      if (p === q || p === -q || (Math.abs(p) !== 1 && q !== 1)) return null;
      const e = expand(1, p, 1, q, x);
      if (r.next() < 0.5) {
        return {
          shape: "then-take",
          start: `(${lin(1, p, x)})(${lin(1, q, x)}) - ${x}^2`,
          goal: poly([[p + q, x], [p * q, ""]]),
          via: [`${e.via[1]} - ${x}^2`, `${e.goal} - ${x}^2`],
          numbers: [p, q],
          along: e.along,
        };
      }
      const c = -(p + q);
      return {
        shape: "then-take",
        start: `(${lin(1, p, x)})(${lin(1, q, x)})${c < 0 ? " - " : " + "}${term(Math.abs(c), x)}`,
        goal: poly([[1, `${x}^2`], [p * q, ""]]),
        via: [`${e.via[1]}${c < 0 ? " - " : " + "}${term(Math.abs(c), x)}`, `${e.goal}${c < 0 ? " - " : " + "}${term(Math.abs(c), x)}`],
        numbers: [p, q, c],
        along: e.along,
      };
    },
  },
  {
    id: "number-times",
    name: "a number times two brackets",
    make: (r) => {
      // k(x + p)(x + q)
      const k = r.int(2, 3);
      const p = r.signed(1, 4);
      const q = r.int(1, 4);
      if (p === -q || Math.abs(p) === 1 || q === 1) return null;
      const e = expand(1, p, 1, q, "x");
      return {
        shape: "number-times",
        start: `${k}(${lin(1, p)})(${lin(1, q)})`,
        goal: poly([[k, "x^2"], [k * (p + q), "x"], [k * p * q, ""]]),
        via: [`${k}(${e.via[1]})`, `${k}(${e.goal})`],
        numbers: [k, p, q],
        along: [...e.along, k * (p + q), k * p * q],
      };
    },
  },
  {
    id: "square",
    name: "a bracket squared",
    make: (r) => {
      // (x + k)^2, (ax + b)^2; now and then (x - k)^2 + 2kx
      const pick = r.next();
      if (pick < 0.25) return squarePlus(r);
      if (pick < 0.5) return another("square-letters", r, "square");
      const a = r.next() < 0.3 ? r.int(2, 3) : 1;
      const b = a === 1 ? r.signed(2, 6) : r.int(1, 3) * (r.next() < 0.3 ? -1 : 1);
      if (b % a === 0 && a > 1) return null;
      const e = expand(a, b, a, b, "x");
      const inside = lin(a, b);
      return { shape: "square", start: `(${inside})^2`, goal: e.goal, via: [`(${inside})(${inside})`, ...e.via.slice(a === 1 ? 1 : 0)], numbers: [a, b], along: e.along };
    },
  },
  {
    id: "square-letters",
    name: "two letters squared",
    make: (r) => {
      // (x ± y)^2, or (x + y)^2 - 2xy
      const [x, y] = [["x", "y"], ["a", "b"], ["p", "q"]][r.int(0, 2)];
      const s = r.next() < 0.5 ? " + " : " - ";
      const inside = `${x}${s}${y}`;
      const via = [`(${inside})(${inside})`, `${x}^2${s}${x}${y}${s}${y}(${inside})`];
      const goal = `${x}^2${s}2${x}${y} + ${y}^2`;
      if (s === " + " && r.next() < 0.4) {
        return {
          shape: "square-letters",
          start: `(${inside})^2 - 2${x}${y}`,
          goal: `${x}^2 + ${y}^2`,
          via: [`(${inside})(${inside}) - 2${x}${y}`, `${via[1]} - 2${x}${y}`, `${goal} - 2${x}${y}`],
          numbers: [2],
          along: [2],
        };
      }
      return { shape: "square-letters", start: `(${inside})^2`, goal, via, numbers: [], along: [2] };
    },
  },
  {
    id: "three-factors",
    name: "x times two brackets",
    make: (r) => {
      // x(x + k)(x - k) = x^3 - k^2 x
      const k = r.int(1, 5);
      const [b, d] = r.next() < 0.5 ? [k, -k] : [-k, k];
      return {
        shape: "three-factors",
        start: `x(${lin(1, b)})(${lin(1, d)})`,
        goal: `x^3 - ${term(k * k, "x")}`,
        via: [`x(${expand(1, b, 1, d, "x").via[1]})`, `x(x^2 - ${k * k})`],
        numbers: [k],
        along: [k * k],
      };
    },
  },
];

// ---------- Hard: two expansions, one added to or taken from the other, then collected ----------

/** A term: its number and its letters as written ("x^2", "ab", "" for a number). */
type Term = [number, string];
/** The letters of a product, as written: x·x = x^2, a·b = ab. */
function mulVars(u: string, v: string): string {
  const pow: Record<string, number> = {};
  for (const w of [u, v]) for (const m of w.matchAll(/([a-z])(?:\^(\d+))?/g)) pow[m[1]] = (pow[m[1]] ?? 0) + Number(m[2] ?? 1);
  return Object.keys(pow)
    .sort()
    .map((l) => (pow[l] === 1 ? l : `${l}^${pow[l]}`))
    .join("");
}
const mul = (s: Term, t: Term): Term => [s[0] * t[0], mulVars(s[1], t[1])];
/** Like terms added up, in the order they first appear. */
function collect(ts: Term[]): Term[] {
  const m = new Map<string, number>();
  for (const [c, v] of ts) m.set(v, (m.get(v) ?? 0) + c);
  return [...m].map(([v, c]): Term => [c, v]).filter(([c]) => c !== 0);
}

/** One part of the expression: how it's written, the states it goes through as it's multiplied out (`sum`: needs a bracket after a minus), and what it comes to. */
type Part = { start: string; steps: { s: string; sum: boolean }[]; terms: Term[] };

/** (P)(Q), or (P)^2: the first bracket over the second's terms, as the moves go (see expand). */
function productPart(P: Term[], Q: Term[], square = false): Part {
  const A = poly(P);
  const [q0, q1] = Q;
  const back = `${q1[0] < 0 ? " - " : " + "}(${A})${q1[1] === "" && Math.abs(q1[0]) === 1 ? "" : `*${term(Math.abs(q1[0]), q1[1])}`}`;
  const four = [mul(P[0], q0), mul(P[1], q0), mul(P[0], q1), mul(P[1], q1)];
  const terms = collect(four);
  const steps = [
    ...(square ? [{ s: `(${A})(${A})`, sum: false }] : []),
    { s: `(${A})*${term(q0[0], q0[1])}${back}`, sum: true },
    // 2x: the 2 goes into the bracket first, (4x - 6)x.
    ...(q0[0] !== 1 ? [{ s: `(${poly(P.map(([c, v]): Term => [c * q0[0], v]))})*${q0[1]}${back}`, sum: true }] : []),
    { s: `${poly([four[0], four[1]])}${back}`, sum: true },
    // ... - (2x - 3)*3: the 3 into the bracket, then the minus.
    ...(q1[1] === "" && Math.abs(q1[0]) !== 1 && q1[0] < 0
      ? [{ s: `${poly([four[0], four[1]])} - (${poly(P.map(([c, v]): Term => [-c * q1[0], v]))})`, sum: true }]
      : []),
    { s: poly(four), sum: true },
    { s: poly(terms), sum: true },
  ];
  return { start: square ? `(${A})^2` : `(${A})(${poly(Q)})`, steps, terms };
}
/** k times a part: k(x + 1)^2. */
function scaled(k: number, p: Part): Part {
  const terms = p.terms.map(([c, v]): Term => [k * c, v]);
  return {
    start: `${k}${p.start}`,
    steps: [...p.steps.map(({ s, sum }) => ({ s: sum ? `${k}(${s})` : `${k}${s}`, sum: false })), { s: poly(terms), sum: true }],
    terms,
  };
}
/** A term times a bracket, 2x(x + 3): quick enough to need no steps of its own. */
function termTimes(t: Term, Q: Term[]): Part {
  const terms = Q.map((q) => mul(t, q));
  return { start: `${term(t[0], t[1])}(${poly(Q)})`, steps: [{ s: poly(terms), sum: true }], terms };
}
/** Like terms collected one kind at a time (x^2s, then xs, ...), each where it first appears. */
function collecting(ts: Term[]): string[] {
  const kinds = [...new Set(ts.map(([, v]) => v))];
  return kinds.map((_, k) => {
    const done = new Set(kinds.slice(0, k + 1));
    const out: Term[] = [];
    for (const [c, v] of ts) {
      if (!done.has(v)) out.push([c, v]);
      else if (!out.some(([, w]) => w === v)) out.push([ts.filter(([, w]) => w === v).reduce((a, [c2]) => a + c2, 0), v]);
    }
    return poly(out);
  });
}

/** p1 + p2 or p1 - p2: p1 multiplied out, then p2, then the minus shared out, then like terms collected. */
function combine(shape: string, p1: Part, sign: 1 | -1, p2: Part, numbers: number[]): Draft | null {
  const L1 = poly(p1.terms);
  const all2 = p2.terms.map(([c, v]): Term => [sign * c, v]);
  const result = collect([...p1.terms, ...all2]);
  if (!result.length || result[0][0] < 0) return null;
  const via = [
    ...p1.steps.map(({ s }) => `${s}${sign < 0 ? " - " : " + "}${p2.start}`),
    ...p2.steps.map(({ s, sum }) => `${L1}${sign < 0 ? (sum ? ` - (${s})` : ` - ${s}`) : ` + ${s}`}`),
    poly([...p1.terms, ...all2]),
    ...collecting([...p1.terms, ...all2]),
  ];
  const goal = poly(result);
  const along = [...p1.terms, ...p2.terms, ...result].map(([c]) => c);
  return {
    shape,
    start: `${p1.start}${sign < 0 ? " - " : " + "}${p2.start}`,
    goal,
    via: via.filter((v, i) => v !== via[i - 1] && v !== goal),
    numbers,
    along,
  };
}

const X = (c: number): Term => [c, "x"];
const N = (c: number): Term => [c, ""];

const mixed: Shape[] = [
  {
    id: "square-minus-product",
    name: "a square take away a product",
    make: (r) => {
      // (ax + b)^2 - (x + c)(x - c): (2x - 1)^2 - (x + 3)(x - 3) = 3x^2 - 4x + 10
      const a = r.int(1, 2);
      const b = r.signed(1, 4);
      const c = r.int(2, 5);
      // (2x ± 3)^2 is 22 moves and slow to check: with a 2, only (2x ± 1)^2.
      if ((a === 1 && Math.abs(b) === 1) || (a === 2 && Math.abs(b) !== 1)) return null;
      return combine("square-minus-product", productPart([X(a), N(b)], [X(a), N(b)], true), -1, productPart([X(1), N(c)], [X(1), N(-c)]), [a, b, c]);
    },
  },
  {
    id: "two-squares",
    name: "two squares, added or taken away",
    make: (r) => {
      // (x + p)^2 - (x - p)^2 = 4px;  (a + b)^2 - (a - b)^2 = 4ab;  (x + p)^2 + (x - p)^2 = 2x^2 + 2p^2
      const sign = r.next() < 0.7 ? -1 : 1;
      if (r.next() < 0.35) {
        const [u, v] = [["a", "b"], ["x", "y"], ["p", "q"]][r.int(0, 2)];
        return combine("two-squares", productPart([[1, u], [1, v]], [[1, u], [1, v]], true), sign, productPart([[1, u], [-1, v]], [[1, u], [-1, v]], true), [2]);
      }
      const p = r.int(2, 5);
      const q = r.next() < 0.5 ? p : r.int(1, 5);
      return combine("two-squares", productPart([X(1), N(p)], [X(1), N(p)], true), sign, productPart([X(1), N(-q)], [X(1), N(-q)], true), [p, q]);
    },
  },
  {
    id: "scaled-square",
    name: "a number times a square, take away a term times a bracket",
    make: (r) => {
      // k(x + p)^2 - mx(x + q): 3(x + 1)^2 - 2x(x + 3) = x^2 + 3
      const k = r.int(2, 3);
      const m = r.int(1, k);
      const p = r.signed(1, 3);
      const q = r.signed(1, 6);
      return combine("scaled-square", scaled(k, productPart([X(1), N(p)], [X(1), N(p)], true)), -1, termTimes([m, "x"], [X(1), N(q)]), [k, m, p, q]);
    },
  },
  {
    id: "product-minus-product",
    name: "one product take away another",
    make: (r) => {
      // (x + p)(x + q) - (x + s)(x + t): (x + 5)(x - 1) - (x + 2)(x - 3) = 5x + 1
      const [p, q, s, t] = [r.signed(1, 6), r.signed(1, 6), r.signed(1, 6), r.signed(1, 6)];
      if (p + q <= s + t || p === -q || s === -t || p * q === s * t || p === q || s === t) return null;
      return combine("product-minus-product", productPart([X(1), N(p)], [X(1), N(q)]), -1, productPart([X(1), N(s)], [X(1), N(t)]), [p, q, s, t]);
    },
  },
];

const byId = (...ids: string[]) => ids.map((id) => [...all, ...mixed].find((s) => s.id === id)!);

/** Easy (1–3 moves): one bracket times a letter. Medium (4–7): two brackets. Hard (7+): numbers in front of x in both, squares, three factors. */
export const shapes: Record<Level, Shape[]> = {
  easy: byId("letter-times", "power-times", "then-collect", "two-plus", "signs", "times-square", "then-take"),
  medium: byId("both-numbers", "square", "number-times", "three-factors"),
  hard: byId("square-minus-product", "two-squares", "scaled-square", "product-minus-product"),
};
