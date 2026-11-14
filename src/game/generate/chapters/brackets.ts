/** Multiplying brackets: each term of one by each term of the other, then collect. */
import { NESTED } from "./nested";
import { byIds, lin, plus, poly, term, timesBracket, type Draft, type Level, type Rng, type Shape } from "../write";

/** One of these letters. */
const letter = (r: Rng, ls: string[]) => ls[r.int(0, ls.length - 1)];

/**
 * (ax + b)(cx + d), the way the moves go: the first bracket over the second's
 * terms (cx, then d), the cx part multiplied out first. Then the goal.
 */
function expand(a: number, b: number, c: number, d: number, x: string) {
  const first = lin(a, b, x);
  return {
    via: [`(${first})*${term(c, x)}${timesBracket(d, first)}`, `${poly([[a * c, `${x}^2`], [b * c, x]])}${timesBracket(d, first)}`],
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
        via: [`(${lin(1, p)})*x^2${timesBracket(q, lin(1, p))}`, `${poly([[1, "x^3"], [p, "x^2"]])}${timesBracket(q, lin(1, p))}`],
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

/** Easy (1–3 moves): one bracket times a letter. Medium (4–7): two brackets, squares, three factors. Hard: nested brackets, with x and y. */
export const shapes: Record<Level, Shape[]> = {
  easy: byIds(all, "letter-times", "power-times", "then-collect", "two-plus", "signs", "times-square", "then-take"),
  medium: byIds(all, "both-numbers", "square", "number-times", "three-factors"),
  // Hard nests one thing in another (with x and y where the chapter allows): chapters/nested.ts.
  hard: NESTED.brackets,
};
