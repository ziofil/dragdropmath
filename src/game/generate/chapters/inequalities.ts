/** Exercise shapes for the chapter "inequalities" (see ../write.ts): linear, one unknown, like balance's, with the sign turning round when a negative multiplies or divides. */
import { NESTED } from "./nested";
import { ax, bracket, lin, pickAnswer, plus, type Level, type Rng, type Shape } from "../write";
import { finish, fractionsMinus, minusFraction, twoBracketsMixed } from "./balance";

type Rel = "<" | ">" | "≤" | "≥";
const RELS: Rel[] = ["<", ">", "≤", "≥"];
const turned: Record<Rel, Rel> = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
const rel = (r: Rng): Rel => RELS[r.int(0, 3)];
/** Mostly x, now and then another letter, as the hand-made ones do. */
const letter = (r: Rng) => (r.next() < 0.6 ? "x" : ["y", "n", "a", "k", "m", "p"][r.int(0, 5)]);
/** The answer as the goal reads it: "x ≥ -3". */
const sol = (v: string, s: Rel, x: number) => `${v} ${s} ${x}`;
/** a·v + b with any letter. */
const linv = (a: number, b: number, v: string) => lin(a, b, v);
/** a(v + b) with any letter. */
const bracketv = (a: number, b: number, v: string) => bracket(a, b).replace("x", v);
/** -v/a or v/a. */
const over = (a: number, v: string) => (a < 0 ? `-${v}/${-a}` : `${v}/${a}`);

const all: Shape[] = [
  // ---------- easy: one step, then work it out ----------
  {
    id: "add",
    name: "a number added or taken away",
    make: (r) => {
      // v + b R c, or c R v + b (the sides swap, the sign turns round).
      const v = letter(r);
      const x = r.signed(1, 9);
      const b = r.signed(1, 9);
      const c = x + b;
      const s = rel(r);
      if (c === 0) return null;
      const swap = r.next() < 0.3;
      return {
        shape: "add",
        start: swap ? `${c} ${s} ${linv(1, b, v)}` : `${linv(1, b, v)} ${s} ${c}`,
        goal: sol(v, swap ? turned[s] : s, x),
        via: [],
        answer: x,
        numbers: [b, c],
        along: [],
      };
    },
  },
  {
    id: "times",
    name: "a number times the letter",
    make: (r) => {
      // a·v R c, a positive or negative; or c R a·v.
      const v = letter(r);
      const x = pickAnswer(r);
      const a = r.next() < 0.15 ? -1 : r.signed(2, 6);
      const c = a * x;
      const s = rel(r);
      const swap = a > 0 && r.next() < 0.3;
      const after = a < 0 ? turned[s] : s;
      return {
        shape: "times",
        start: swap ? `${c} ${s} ${ax(a, v)}` : `${ax(a, v)} ${s} ${c}`,
        goal: sol(v, swap ? turned[after] : after, x),
        via: [],
        answer: x,
        numbers: [a, c],
        along: [],
      };
    },
  },
  {
    id: "divided",
    name: "the letter over a number",
    make: (r) => {
      // v/a R c, or -v/a R c.
      const v = letter(r);
      const a = r.int(2, 5);
      const c = r.signed(1, 5);
      const neg = r.next() < 0.5;
      const x = (neg ? -a : a) * c;
      const s = rel(r);
      // x/2 ≤ 1 is done in one move: too quick.
      if (!neg && Math.abs(c) === 1) return null;
      return {
        shape: "divided",
        start: `${over(neg ? -a : a, v)} ${s} ${c}`,
        goal: sol(v, neg ? turned[s] : s, x),
        via: [],
        answer: x,
        numbers: [a, c],
        along: [x],
      };
    },
  },
  // ---------- medium: two steps, a bracket, the letter on both sides ----------
  {
    id: "two-step",
    name: "times the letter, plus a number",
    make: (r) => {
      // a·v + b R c, or b - a·v R c (that one turns round).
      const v = letter(r);
      const x = pickAnswer(r);
      const a = r.int(2, 5);
      const b = r.signed(1, 12);
      const neg = r.next() < 0.5;
      const c = (neg ? -a : a) * x + b;
      const s = rel(r);
      if (c === 0) return null;
      if (neg && b < 0) return null;
      return {
        shape: "two-step",
        start: neg ? `${b} - ${ax(a, v)} ${s} ${c}` : `${linv(a, b, v)} ${s} ${c}`,
        goal: sol(v, neg ? turned[s] : s, x),
        via: [`${ax(neg ? -a : a, v)} ${s} ${c - b}`],
        answer: x,
        numbers: [a, b, c],
        along: [c - b],
      };
    },
  },
  {
    id: "over-plus",
    name: "the letter over a number, and a number",
    make: (r) => {
      // v/a + b R c, or b - v/a R c (that one turns round).
      const v = letter(r);
      const a = r.int(2, 4);
      const q = r.signed(2, 5);
      const x = a * q;
      const b = r.signed(1, 6);
      const s = rel(r);
      if (r.next() < 0.5) {
        const c = q + b;
        if (c === 0) return null;
        return {
          shape: "over-plus",
          start: `${v}/${a}${plus(b)} ${s} ${c}`,
          goal: sol(v, s, x),
          via: [`${v}/${a} ${s} ${q}`],
          answer: x,
          numbers: [a, b, c],
          along: [q],
        };
      }
      const c = b - q;
      if (c === 0 || b < 0) return null;
      return {
        shape: "over-plus",
        start: `${b} - ${v}/${a} ${s} ${c}`,
        goal: sol(v, turned[s], x),
        via: [`-${v}/${a} ${s} ${-q}`],
        answer: x,
        numbers: [a, b, c],
        along: [q],
      };
    },
  },
  {
    id: "bracket",
    name: "a bracket",
    make: (r) => {
      // a(v + b) R c, or c R a(d - v) (that one turns round twice: sides swap, then a minus).
      const v = letter(r);
      const x = pickAnswer(r);
      const a = r.int(2, 5);
      const s = rel(r);
      if (r.next() < 0.6) {
        const b = r.signed(1, 6);
        const c = a * (x + b);
        if (c === 0) return null;
        return {
          shape: "bracket",
          start: `${bracketv(a, b, v)} ${s} ${c}`,
          goal: sol(v, s, x),
          via: [`${linv(1, b, v)} ${s} ${c / a}`],
          answer: x,
          numbers: [a, b, c],
          along: [c / a],
        };
      }
      const d = r.int(1, 8);
      const c = a * (d - x);
      if (c === 0) return null;
      // c R a(d - v): d - v flip(R) c/a... read as c/a R d - v, so v R d - c/a.
      return {
        shape: "bracket",
        start: `${c} ${s} ${a}(${d} - ${v})`,
        goal: sol(v, s, x),
        via: [`${c / a} ${s} ${d} - ${v}`],
        answer: x,
        numbers: [a, c, d],
        along: [c / a],
      };
    },
  },
  {
    id: "both-sides",
    name: "the letter on both sides",
    make: (r) => {
      // a·v + b R c·v + d, a and c either way round (more on the right turns the sign round).
      const v = letter(r);
      const x = pickAnswer(r);
      let a = r.int(1, 5);
      let c = r.int(1, 5);
      if (r.next() < 0.3) a = -a;
      if (a === c) return null;
      const b = r.signed(1, 9);
      const d = (a - c) * x + b;
      const s = rel(r);
      if (d === 0) return null;
      const start = a < 0 ? `${b} - ${ax(-a, v)} ${s} ${linv(c, d, v)}` : `${linv(a, b, v)} ${s} ${linv(c, d, v)}`;
      return {
        shape: "both-sides",
        start,
        goal: sol(v, a > c ? s : turned[s], x),
        via: [a > c ? `${ax(a - c, v)} ${s} ${d - b}` : `${b - d} ${s} ${ax(c - a, v)}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [a - c, d - b],
      };
    },
  },
  // ---------- hard: brackets with the letter on both sides ----------
  {
    id: "brackets-both",
    name: "brackets on both sides",
    make: (r) => {
      // a(v + b) R c(v + d)
      const v = letter(r);
      const x = pickAnswer(r);
      const a = r.int(2, 5);
      const c = r.int(2, 5);
      const b = r.signed(1, 6);
      // A difference of at least 2, so there is a division at the end.
      if (Math.abs(a - c) < 2) return null;
      const top = a * (x + b);
      if (top % c !== 0) return null;
      const d = top / c - x;
      const s = rel(r);
      if (d === 0 || d === b || Math.abs(d) > 9) return null;
      return {
        shape: "brackets-both",
        start: `${bracketv(a, b, v)} ${s} ${bracketv(c, d, v)}`,
        goal: sol(v, a > c ? s : turned[s], x),
        via: [`${linv(a, a * b, v)} ${s} ${linv(c, c * d, v)}`, `${ax(a, v)} ${s} ${linv(c, c * d - a * b, v)}`, a > c ? `${ax(a - c, v)} ${s} ${c * d - a * b}` : `${a * b - c * d} ${s} ${ax(c - a, v)}`],
        answer: x,
        numbers: [a, b, c, d],
        along: [a * b, c * d, a - c, c * d - a * b],
      };
    },
  },
  {
    id: "bracket-less",
    name: "a bracket, less some of the letter",
    make: (r) => {
      // a(v + b) - c·v R e
      const v = letter(r);
      const x = pickAnswer(r);
      const a = r.int(2, 5);
      // More taken away than the bracket has: the sign turns round at the end.
      const c = a + r.int(2, 4);
      const b = r.signed(1, 6);
      const e = (a - c) * x + a * b;
      const s = rel(r);
      if (e === 0) return null;
      const k = a - c;
      return {
        shape: "bracket-less",
        start: `${bracketv(a, b, v)} - ${ax(c, v)} ${s} ${e}`,
        goal: sol(v, k > 0 ? s : turned[s], x),
        via: [`${linv(k, a * b, v)} ${s} ${e}`, `${ax(k, v)} ${s} ${e - a * b}`],
        answer: x,
        numbers: [a, b, c, e],
        along: [a * b, k, e - a * b],
      };
    },
  },
  {
    id: "minus-bracket",
    name: "a minus in front of a bracket",
    make: (r) => {
      // -(v + a) R b·v + c
      const v = letter(r);
      const x = pickAnswer(r);
      const a = r.signed(1, 6);
      const b = r.int(1, 4);
      const c = -(x + a) - b * x;
      const s = rel(r);
      if (c === 0 || c === a) return null;
      return {
        shape: "minus-bracket",
        start: `-(${linv(1, a, v)}) ${s} ${linv(b, c, v)}`,
        goal: sol(v, turned[s], x),
        via: [`${-a} - ${v} ${s} ${linv(b, c, v)}`, `${-a - c} ${s} ${ax(b + 1, v)}`],
        answer: x,
        numbers: [a, b, c],
        along: [a + c, b + 1],
      };
    },
  },
];

// ---------- hard: everything from solving equations at once (see balance.ts) ----------
all.push(
  { id: "two-brackets-mixed", name: "two brackets, one taken away, x on both sides", make: (r) => { const m = twoBracketsMixed(r, true); return m && finish("two-brackets-mixed", m, rel(r)); } },
  { id: "fractions-minus", name: "one fraction less another", make: (r) => { const m = fractionsMinus(r); return m && finish("fractions-minus", m, rel(r)); } },
  { id: "minus-fraction", name: "a number less a bracket over a number", make: (r) => { const m = minusFraction(r); return m && finish("minus-fraction", m, rel(r)); } },
);

const pick = (...ids: string[]) => ids.map((id) => all.find((s) => s.id === id)!);

/** By how many moves they take, and how much there is to keep track of. */
export const shapes: Record<Level, Shape[]> = {
  easy: pick("add", "times", "divided", "two-step", "over-plus", "bracket", "both-sides"),
  medium: pick("brackets-both", "bracket-less", "minus-bracket"),
  // Hard nests one thing in another (with x and y where the chapter allows): chapters/nested.ts.
  hard: NESTED.inequalities,
};
