/**
 * Exercise shapes for the chapter "simultaneous" (see ../write.ts): two
 * linear equations, solved by substituting. Each picks the answer (x, y)
 * first, whole and positive, and builds the equations around it. Milestones:
 * the letter on its own, substituted, collected, one letter found.
 */
import { NESTED } from "./nested";
import { ax, type Level, type Rng, type Shape } from "../write";

/** The two letters: mostly x and y, now and then a and b. */
const letters = (r: Rng): [string, string] => (r.next() < 0.8 ? ["x", "y"] : ["a", "b"]);

/** A sum of terms written as a person would: terms(2, "x", -1, "y", 3, "") → "2x - y + 3". */
function terms(...parts: (number | string)[]): string {
  let out = "";
  for (let i = 0; i < parts.length; i += 2) {
    const c = parts[i] as number;
    const v = parts[i + 1] as string;
    if (c === 0) continue;
    const t = v ? ax(Math.abs(c), v) : `${Math.abs(c)}`;
    out += out === "" ? (c < 0 ? `-${t}` : t) : c < 0 ? ` - ${t}` : ` + ${t}`;
  }
  return out;
}
/** p·(e), "e" when p is 1. */
const times = (p: number, e: string) => (p === 1 ? e : `${p}(${e})`);
const goalOf = (X: string, Y: string, x: number, y: number) => `${X} = ${x}; ${Y} = ${y}`;
const ok = (...ns: number[]) => ns.every((n) => n !== 0 && Math.abs(n) <= 15);

/** One letter already known: x = 2; px + y = c, or y = 3; x ± py = c. Substitute, then solve. */
function known(id: string, knowX: boolean): Shape {
  return {
    id,
    name: "one letter already known",
    make: (r) => {
      const [X, Y] = letters(r);
      const x = r.int(1, 6);
      const y = r.int(1, 6);
      const p = r.int(1, 3);
      if (knowX) {
        const c = p * x + y;
        if (!ok(c)) return null;
        return {
          shape: id,
          start: `${X} = ${x}; ${terms(p, X, 1, Y)} = ${c}`,
          goal: goalOf(X, Y, x, y),
          via: [`${X} = ${x}; ${terms(p * x, "", 1, Y)} = ${c}`],
          numbers: [x, p, c].filter((n) => n !== 1),
          along: [p * x],
        };
      }
      const sign = r.next() < 0.4 ? -1 : 1;
      const c = x + sign * p * y;
      if (!ok(c)) return null;
      return {
        shape: id,
        start: `${Y} = ${y}; ${terms(1, X, sign * p, Y)} = ${c}`,
        goal: goalOf(X, Y, x, y),
        via: [`${Y} = ${y}; ${terms(1, X, sign * p * y, "")} = ${c}`],
        numbers: [y, p, c].filter((n) => n !== 1),
        along: [p * y],
      };
    },
  };
}

const all: Shape[] = [
  // ---------- easy ----------
  known("known-x", true),
  known("known-y", false),
  {
    id: "multiple",
    name: "one letter a number of times the other",
    make: (r) => {
      // y = kx; px + y = c, or x = ky; x + qy = c (either equation first).
      const [X, Y] = letters(r);
      const k = r.int(2, 4);
      const p = r.int(1, 3);
      const yIs = r.next() < 0.6;
      // The letter that is k times the other, and the one it is made of.
      const [A, B] = yIs ? [Y, X] : [X, Y];
      const b = r.int(1, 5);
      const a = k * b;
      const c = p * b + a;
      if (!ok(c) || a > 15) return null;
      const def = `${A} = ${ax(k, B)}`;
      const other = yIs ? `${terms(p, B, 1, A)} = ${c}` : `${terms(1, A, p, B)} = ${c}`;
      const first = r.next() < 0.75;
      const rows = (d: string, o: string) => (first ? `${d}; ${o}` : `${o}; ${d}`);
      return {
        shape: "multiple",
        start: rows(def, other),
        goal: yIs ? goalOf(X, Y, b, a) : goalOf(X, Y, a, b),
        via: [rows(def, `${ax(p + k, B)} = ${c}`), rows(def, `${B} = ${b}`)],
        numbers: [k, p, c].filter((n) => n !== 1),
        along: [p + k, a],
      };
    },
  },
  // ---------- medium ----------
  {
    id: "linear",
    name: "a letter given as mx + b",
    make: (r) => {
      // y = mx + b; px + y = c.
      const [X, Y] = letters(r);
      const x = r.int(1, 5);
      const m = r.int(1, 3);
      const b = r.signed(1, 5);
      const y = m * x + b;
      const p = r.int(1, 3);
      const c = p * x + y;
      if (y <= 0 || !ok(c) || y > 12) return null;
      const def = `${Y} = ${terms(m, X, b, "")}`;
      return {
        shape: "linear",
        start: `${def}; ${terms(p, X, 1, Y)} = ${c}`,
        goal: goalOf(X, Y, x, y),
        via: [`${def}; ${terms(p, X, m, X, b, "")} = ${c}`, `${def}; ${terms(p + m, X, b, "")} = ${c}`, `${def}; ${ax(p + m, X)} = ${c - b}`, `${def}; ${X} = ${x}`],
        numbers: [m, b, p, c].filter((n) => n !== 1),
        along: [p + m, c - b],
      };
    },
  },
  {
    id: "take-away",
    name: "a letter given as a number take away",
    make: (r) => {
      // y = b - mx; px + y = c (p ≠ m).
      const [X, Y] = letters(r);
      const x = r.int(1, 5);
      const m = r.int(1, 2);
      const y = r.int(1, 6);
      const b = y + m * x;
      const p = r.int(1, 3);
      if (p === m) return null;
      const c = p * x + y;
      if (!ok(b, c)) return null;
      const def = `${Y} = ${terms(b, "", -m, X)}`;
      return {
        shape: "take-away",
        start: `${def}; ${terms(p, X, 1, Y)} = ${c}`,
        goal: goalOf(X, Y, x, y),
        via: [`${def}; ${terms(p - m, X, b, "")} = ${c}`, `${def}; ${ax(p - m, X)} = ${c - b}`, `${def}; ${X} = ${x}`],
        numbers: [b, m, p, c].filter((n) => n !== 1),
        along: [p - m, c - b],
      };
    },
  },
  {
    id: "sum-difference",
    name: "the sum and the difference",
    make: (r) => {
      // x + y = s; x - y = d (or y - x = d when y is the bigger).
      const [X, Y] = letters(r);
      const x = r.int(1, 8);
      const y = r.int(1, 8);
      if (x === y) return null;
      const [big, small] = x > y ? [X, Y] : [Y, X];
      const [bv, sv] = x > y ? [x, y] : [y, x];
      const s = x + y;
      const d = bv - sv;
      const diffFirst = r.next() < 0.3;
      const sum = `${X} + ${Y} = ${s}`;
      const diff = `${big} - ${small} = ${d}`;
      const def = `${big} = ${d} + ${small}`;
      const rows = (a: string, b: string) => (diffFirst ? `${b}; ${a}` : `${a}; ${b}`);
      return {
        shape: "sum-difference",
        start: rows(sum, diff),
        goal: goalOf(X, Y, x, y),
        via: [rows(sum, def), rows(`${ax(2, small)} + ${d} = ${s}`, def), rows(`${ax(2, small)} = ${s - d}`, def), rows(`${small} = ${sv}`, def)],
        numbers: [s, d].filter((n) => n !== 1),
        along: [s - d],
      };
    },
  },
  // ---------- hard ----------
  {
    id: "sum-and-other",
    name: "a sum, and another equation",
    make: (r) => {
      // x + y = s; px + y = c → y = s - x, then substitute.
      const [X, Y] = letters(r);
      const x = r.int(1, 6);
      const y = r.int(1, 6);
      // 3x or more, so there is a division at the end.
      const p = r.int(3, 4);
      const s = x + y;
      const c = p * x + y;
      if (!ok(c)) return null;
      const def = `${Y} = ${s} - ${X}`;
      const other = `${terms(p, X, 1, Y)} = ${c}`;
      const first = r.next() < 0.5;
      const rows = (a: string, b: string) => (first ? `${a}; ${b}` : `${b}; ${a}`);
      return {
        shape: "sum-and-other",
        start: rows(`${X} + ${Y} = ${s}`, other),
        goal: goalOf(X, Y, x, y),
        via: [rows(def, other), rows(def, `${terms(p - 1, X, s, "")} = ${c}`), rows(def, `${ax(p - 1, X)} = ${c - s}`), rows(def, `${X} = ${x}`)],
        numbers: [s, p, c],
        along: [p - 1, c - s],
      };
    },
  },
  {
    id: "bracket-sub",
    name: "substituting a whole bracket",
    make: (r) => {
      // px + qy = c; x - ky = d → x = d + ky, and px becomes p(d + ky).
      const [X, Y] = letters(r);
      const y = r.int(1, 4);
      const k = r.int(1, 2);
      const d = r.int(1, 4);
      const x = d + k * y;
      const p = r.int(2, 3);
      const q = r.int(1, 2);
      const c = p * x + q * y;
      if (!ok(c) || x > 9) return null;
      const def = `${X} = ${terms(d, "", k, Y)}`;
      const other = `${terms(p, X, q, Y)} = ${c}`;
      const first = r.next() < 0.5;
      const rows = (a: string, b: string) => (first ? `${a}; ${b}` : `${b}; ${a}`);
      return {
        shape: "bracket-sub",
        start: rows(other, `${terms(1, X, -k, Y)} = ${d}`),
        goal: goalOf(X, Y, x, y),
        via: [
          rows(other, def),
          rows(`${times(p, terms(d, "", k, Y))} + ${ax(q, Y)} = ${c}`, def),
          rows(`${terms(p * k + q, Y, p * d, "")} = ${c}`, def),
          rows(`${ax(p * k + q, Y)} = ${c - p * d}`, def),
          rows(`${Y} = ${y}`, def),
        ],
        numbers: [p, q, c, k, d].filter((n) => n !== 1),
        along: [p * d, p * k + q, c - p * d],
      };
    },
  },
  {
    id: "minus-bracket",
    name: "taking away a substituted bracket",
    make: (r) => {
      // px - y = c; x + y = s → y = s - x, and -y becomes -(s - x).
      const [X, Y] = letters(r);
      const x = r.int(1, 6);
      const y = r.int(1, 6);
      const p = r.int(2, 4);
      const s = x + y;
      const c = p * x - y;
      if (c <= 0 || !ok(c)) return null;
      const def = `${Y} = ${s} - ${X}`;
      const first = r.next() < 0.5;
      const rows = (a: string, b: string) => (first ? `${a}; ${b}` : `${b}; ${a}`);
      return {
        shape: "minus-bracket",
        start: rows(`${ax(p, X)} - ${Y} = ${c}`, `${X} + ${Y} = ${s}`),
        goal: goalOf(X, Y, x, y),
        via: [
          rows(`${ax(p, X)} - ${Y} = ${c}`, def),
          rows(`${ax(p, X)} - (${s} - ${X}) = ${c}`, def),
          rows(`${terms(p + 1, X, -s, "")} = ${c}`, def),
          rows(`${ax(p + 1, X)} = ${c + s}`, def),
          rows(`${X} = ${x}`, def),
        ],
        numbers: [p, c, s],
        along: [p + 1, c + s],
      };
    },
  },
];

// ---------- hard: an equation to tidy first (brackets, a common factor), then substitute ----------
all.push(
  {
    id: "tidy-factor",
    name: "a common factor to divide out first",
    make: (r) => {
      // p(x + y) = ps; qx - y = c → x + y = s → y = s - x → qx - (s - x) = c.
      const [X, Y] = letters(r);
      const x = r.int(1, 6);
      const y = r.int(1, 6);
      const p = r.int(2, 3);
      const q = r.int(2, 4);
      const s = x + y;
      const c = q * x - y;
      if (c <= 0 || p * s > 30 || !ok(c)) return null;
      const def = `${Y} = ${s} - ${X}`;
      const other = `${ax(q, X)} - ${Y} = ${c}`;
      const first = r.next() < 0.6;
      const rows = (a: string, b: string) => (first ? `${a}; ${b}` : `${b}; ${a}`);
      return {
        shape: "tidy-factor",
        start: rows(`${p}(${X} + ${Y}) = ${p * s}`, other),
        goal: goalOf(X, Y, x, y),
        via: [
          rows(`${X} + ${Y} = ${s}`, other),
          rows(def, other),
          rows(def, `${ax(q, X)} - (${s} - ${X}) = ${c}`),
          rows(def, `${terms(q + 1, X, -s, "")} = ${c}`),
          rows(def, `${ax(q + 1, X)} = ${c + s}`),
          rows(def, `${X} = ${x}`),
        ],
        numbers: [p, p * s, q, c],
        along: [s, q + 1, c + s],
      };
    },
  },
  {
    id: "tidy-bracket",
    name: "a bracket to expand first",
    make: (r) => {
      // p(x - a) = y + b; x + qy = c → y = px - K → x + q(px - K) = c.
      const [X, Y] = letters(r);
      const x = r.int(2, 6);
      const p = r.int(2, 3);
      const a = r.int(1, 3);
      const y = r.int(1, 6);
      const b = p * (x - a) - y;
      const K = p * a + b;
      const q = r.int(1, 2);
      const c = x + q * y;
      if (x === a || b === 0 || K <= 0 || !ok(c, K)) return null;
      const def = `${Y} = ${terms(p, X, -K, "")}`;
      const other = `${terms(1, X, q, Y)} = ${c}`;
      const first = r.next() < 0.6;
      const rows = (u: string, v: string) => (first ? `${u}; ${v}` : `${v}; ${u}`);
      return {
        shape: "tidy-bracket",
        start: rows(`${p}(${X} - ${a}) = ${terms(1, Y, b, "")}`, other),
        goal: goalOf(X, Y, x, y),
        via: [
          rows(`${terms(p, X, -p * a, "")} = ${terms(1, Y, b, "")}`, other),
          rows(def, other),
          rows(def, `${X} + ${times(q, terms(p, X, -K, ""))} = ${c}`),
          ...(q === 1 ? [] : [rows(def, `${X} + ${terms(p * q, X, -q * K, "")} = ${c}`)]),
          rows(def, `${terms(1 + p * q, X, -q * K, "")} = ${c}`),
          rows(def, `${ax(1 + p * q, X)} = ${c + q * K}`),
          rows(def, `${X} = ${x}`),
        ],
        numbers: [p, a, b, q, c],
        along: [p * a, K, q * K, 1 + p * q, c + q * K],
      };
    },
  },
  {
    id: "minus-bracket-sub",
    name: "substituting into a bracket that is taken away",
    make: (r) => {
      // x + y = s; px - q(y - t) = c → y = s - x → px - q(s - x - t) = c.
      const [X, Y] = letters(r);
      const x = r.int(1, 6);
      const y = r.int(2, 7);
      const p = r.int(2, 3);
      const q = 2;
      const t = r.int(1, 3);
      const s = x + y;
      const c = p * x - q * (y - t);
      if (y === t || !ok(c)) return null;
      const def = `${Y} = ${s} - ${X}`;
      const first = r.next() < 0.6;
      const rows = (u: string, v: string) => (first ? `${u}; ${v}` : `${v}; ${u}`);
      const k = q * (t - s);
      return {
        shape: "minus-bracket-sub",
        start: rows(`${X} + ${Y} = ${s}`, `${ax(p, X)} - ${q}(${Y} - ${t}) = ${c}`),
        goal: goalOf(X, Y, x, y),
        via: [
          rows(def, `${ax(p, X)} - ${q}(${Y} - ${t}) = ${c}`),
          rows(def, `${ax(p, X)} - ${q}(${s} - ${X} - ${t}) = ${c}`),
          rows(def, `${ax(p, X)} - ${q}(${s - t} - ${X}) = ${c}`),
          rows(def, `${terms(p, X, -q * (s - t), "", q, X)} = ${c}`),
          rows(def, `${terms(p + q, X, k, "")} = ${c}`),
          rows(def, `${ax(p + q, X)} = ${c - k}`),
          rows(def, `${X} = ${x}`),
        ],
        numbers: [s, p, q, t, c],
        along: [s - t, k, p + q, c - k],
      };
    },
  },
);

const pick = (...ids: string[]) => ids.map((id) => all.find((s) => s.id === id)!);

export const shapes: Record<Level, Shape[]> = {
  easy: pick("known-x", "known-y", "multiple", "linear", "take-away"),
  medium: pick("sum-difference", "sum-and-other", "bracket-sub", "minus-bracket"),
  // And brackets inside brackets: chapters/nested.ts.
  hard: [...pick("tidy-factor", "tidy-bracket", "minus-bracket-sub"), ...NESTED.simultaneous],
};
