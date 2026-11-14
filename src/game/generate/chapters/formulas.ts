/**
 * Exercise shapes for the chapter "formulas" (see ../write.ts): real formulas,
 * with a letter to make the subject picked at random, and made-up equations
 * solved for x in terms of another letter (x = 5a).
 */
import { ax, gcd, terms, byIds, type Level, type Rng, type Shape } from "../write";

/** A formula and the subjects it can be rearranged for (each goal as the engine writes it). */
type Formula = { start: string; goals: string[]; via?: Record<string, string[]> };

const PRODUCTS: Formula[] = [
  { start: "F = ma", goals: ["a = F/m", "m = F/a"] },
  { start: "V = IR", goals: ["R = V/I", "I = V/R"] },
  { start: "d = st", goals: ["t = d/s", "s = d/t"] },
  { start: "p = mv", goals: ["v = p/m", "m = p/v"] },
  { start: "W = Fd", goals: ["d = W/F", "F = W/d"] },
  { start: "P = IV", goals: ["I = P/V", "V = P/I"] },
  { start: "A = lw", goals: ["w = A/l", "l = A/w"] },
  { start: "E = mc^2", goals: ["m = E/c^2"] },
  { start: "P = F/A", goals: ["F = PA", "A = F/P"] },
  { start: "s = d/t", goals: ["d = st", "t = d/s"] },
  { start: "D = m/V", goals: ["m = DV", "V = m/D"] },
];

const SUMS: Formula[] = [
  { start: "y = x + c", goals: ["x = y - c", "c = y - x"] },
  { start: "a = b - c", goals: ["b = a + c", "c = b - a"] },
  { start: "P = a + b + c", goals: ["a = P - b - c"] },
  { start: "v = u + at", goals: ["t = (v - u)/a", "a = (v - u)/t", "u = v - at"] },
  { start: "y = mx + c", goals: ["x = (y - c)/m", "m = (y - c)/x", "c = y - mx"] },
  { start: "2a + b = c", goals: ["a = (c - b)/2", "b = c - 2a"] },
  { start: "y = 3x + c", goals: ["x = (y - c)/3"] },
];

/** Two moves, or three: a fraction or a bracket to clear first, a letter in two places. */
const TWO_STEP: Formula[] = [
  { start: "A = (bh)/2", goals: ["h = (2A)/b", "b = (2A)/h"] },
  { start: "a = (v - u)/t", goals: ["t = (v - u)/a", "u = v - at"] },
  { start: "T = 2(a + b)", goals: ["a = T/2 - b", "b = T/2 - a"] },
  { start: "P = 2(l + w)", goals: ["l = P/2 - w"] },
  { start: "m(v - u) = I", goals: ["u = v - I/m"] },
  { start: "P = V^2/R", goals: ["R = V^2/P"] },
  { start: "V = lwh", goals: ["h = V/(lw)"] },
  { start: "E = (mv^2)/2", goals: ["m = (2E)/v^2"] },
  { start: "s = ((u + v)t)/2", goals: ["t = (2s)/(u + v)"] },
  { start: "px + qx = r", goals: ["x = r/(p + q)"] },
  { start: "A = P + Prt", goals: ["P = A/(1 + rt)"] },
  { start: "F = (9C)/5 + 32", goals: ["C = (5(F - 32))/9"] },
  { start: "C = (5(F - 32))/9", goals: ["F = (9C)/5 + 32"] },
  { start: "v^2 = u^2 + 2as", goals: ["s = (v^2 - u^2)/(2a)", "a = (v^2 - u^2)/(2s)"] },
  { start: "2x + a = x + b", goals: ["x = b - a"] },
];

/** Four or five moves: x on both sides, taken out as a factor. */
const LONGER: Formula[] = [
  { start: "3(x + y) = 2x + z", goals: ["x = z - 3y"] },
  { start: "ax + b = cx + d", goals: ["x = (d - b)/(a - c)"] },
  { start: "k(x - 1) = x", goals: ["x = k/(k - 1)"] },
  { start: "a(x + 1) = 2x + b", goals: ["x = (b - a)/(a - 2)"], via: { "x = (b - a)/(a - 2)": ["ax + a = 2x + b", "ax - 2x = b - a"] } },
];

/** Numbers written in a formula, not counting squares (for the beauty rules; the 32 and 100 of real formulas are what they are). */
const numbersIn = (s: string) => (s.replace(/\^2/g, "").match(/\d+/g) ?? []).map(Number).filter((n) => n <= 30);

function fromBank(id: string, bank: Formula[]): Shape {
  return {
    id,
    name: "a formula, one letter to make the subject",
    make: (r) => {
      const f = bank[r.int(0, bank.length - 1)];
      const goal = f.goals[r.int(0, f.goals.length - 1)];
      return { shape: id, start: f.start, goal, via: f.via?.[goal] ?? [], numbers: numbersIn(f.start), along: [] };
    },
  };
}

// ---------- solving for x in terms of a letter ----------

const LETTERS = ["a", "b", "c"];
/** " + 3a", " - a" after a term. */
const plusL = (m: number, l: string) => (m < 0 ? ` - ${ax(-m, l)}` : ` + ${ax(m, l)}`);
/** p·x + m·a */
const linL = (p: number, m: number, l: string) => `${ax(p)}${m === 0 ? "" : plusL(m, l)}`;
/** p(x + m·a) */
const bracketL = (p: number, m: number, l: string) => `${p === 1 ? "" : p}(${linL(1, m, l)})`;
/** How many a's x comes to: mostly small and positive, now and then negative. */
const pickK = (r: Rng) => (r.next() < 0.15 ? -r.int(1, 3) : r.int(1, 6));
const goalL = (k: number, l: string) => `x = ${ax(k, l)}`;
/**
 * From Px + Ra = Qx + Sa to the answer: the x's on one side, the a's on the
 * other, then the x's counted (left out when that is already x on its own).
 */
function collectL(P: number, R: number, Q: number, S: number, l: string, k: number): string[] {
  const d = P - Q;
  if (d > 0) return [`${ax(P)} - ${ax(Q)} = ${ax(S, l)}${plusL(-R, l)}`, ...(d === 1 ? [] : [`${ax(d)} = ${ax(d * k, l)}`])];
  return [`${ax(R, l)}${plusL(-S, l)} = ${ax(Q)} - ${ax(P)}`, ...(d === -1 ? [] : [`${ax(-d * k, l)} = ${ax(-d)}`])];
}
const small = (...ns: number[]) => ns.every((n) => n !== 0 && Math.abs(n) <= 12);

const letterShapes: Shape[] = [
  {
    id: "letters-both",
    name: "x on both sides, and a letter",
    make: (r) => {
      // px + ma = qx + na
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r);
      const q = r.int(1, 4);
      const d = r.int(1, 3);
      const p = q + d;
      const m = r.signed(1, 6);
      const n = m + d * k;
      if (!small(n) || n === m) return null;
      return {
        shape: "letters-both",
        start: `${linL(p, m, l)} = ${linL(q, n, l)}`,
        goal: goalL(k, l),
        via: collectL(p, m, q, n, l, k),
        numbers: [p, m, q, n],
        along: [d, d * k],
      };
    },
  },
  {
    id: "bracket-letter",
    name: "a bracket with a letter in it",
    make: (r) => {
      // p(x + ma) = na
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r);
      const p = r.int(2, 5);
      const m = r.signed(1, 4);
      const n = p * (k + m);
      if (!small(n) || k + m === 0) return null;
      return {
        shape: "bracket-letter",
        start: `${bracketL(p, m, l)} = ${ax(n, l)}`,
        goal: goalL(k, l),
        via: [`${linL(p, p * m, l)} = ${ax(n, l)}`, `${ax(p)} = ${ax(p * k, l)}`],
        numbers: [p, m, n],
        along: [p * m, p * k],
      };
    },
  },
  {
    id: "fraction-letter",
    name: "a fraction equal to x and a letter",
    make: (r) => {
      // (x + ma)/p = x + na
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r);
      const p = 3;
      const n = r.signed(1, 4);
      const m = k * (p - 1) + p * n;
      if (!small(m) || m === n) return null;
      return {
        shape: "fraction-letter",
        start: `(${linL(1, m, l)})/${p} = ${linL(1, n, l)}`,
        goal: goalL(k, l),
        via: [`${linL(1, m, l)} = ${bracketL(p, n, l)}`, `${linL(1, m, l)} = ${linL(p, p * n, l)}`, ...collectL(1, m, p, p * n, l, k)],
        numbers: [m, p, n],
        along: [p * n, p - 1, k * (p - 1)],
      };
    },
  },
  {
    id: "fraction-equal",
    name: "a fraction equal to a letter",
    make: (r) => {
      // (px + ma)/q = na
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r);
      const p = r.int(2, 4);
      const q = r.int(2, 4);
      const n = r.int(1, 4);
      const m = q * n - p * k;
      if (!small(m) || gcd(gcd(p, m), q) > 1 || gcd(p, m) > 1) return null;
      return {
        shape: "fraction-equal",
        start: `(${linL(p, m, l)})/${q} = ${ax(n, l)}`,
        goal: goalL(k, l),
        via: [`${linL(p, m, l)} = ${ax(q * n, l)}`, `${ax(p)} = ${ax(p * k, l)}`],
        numbers: [p, m, q, n],
        along: [q * n, p * k],
      };
    },
  },
  {
    id: "bracket-and-letter",
    name: "a bracket, a letter added, x on both sides",
    make: (r) => {
      // p(x + ma) + ra = x + sa
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r);
      const p = r.int(3, 4);
      const m = r.signed(1, 4);
      const t = r.signed(1, 5);
      const c = p * m + t;
      const s = (p - 1) * k + c;
      if (!small(c, s) || s === c) return null;
      return {
        shape: "bracket-and-letter",
        start: `${bracketL(p, m, l)}${plusL(t, l)} = ${linL(1, s, l)}`,
        goal: goalL(k, l),
        via: [`${linL(p, c, l)} = ${linL(1, s, l)}`, ...collectL(p, c, 1, s, l, k)],
        numbers: [p, m, t, s],
        along: [p * m, c, p - 1, (p - 1) * k],
      };
    },
  },
  {
    id: "two-brackets",
    name: "a bracket on each side",
    make: (r) => {
      // p(x + ma) = q(x + na)
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r);
      const q = r.int(2, 4);
      const p = q + r.int(1, 2);
      const m = r.signed(1, 4);
      const top = (p - q) * k + p * m;
      if (top % q !== 0) return null;
      const n = top / q;
      if (!small(n, p * m, q * n) || n === m) return null;
      return {
        shape: "two-brackets",
        start: `${bracketL(p, m, l)} = ${bracketL(q, n, l)}`,
        goal: goalL(k, l),
        via: [`${linL(p, p * m, l)} = ${linL(q, q * n, l)}`, ...collectL(p, p * m, q, q * n, l, k)],
        numbers: [p, m, q, n],
        along: [p * m, q * n, p - q, (p - q) * k],
      };
    },
  },
  {
    id: "two-fractions",
    name: "a fraction on each side",
    make: (r) => {
      // (x + ma)/p = (x + na)/q, cleared to q(x + ma) = p(x + na)
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r);
      const [p, q] = r.next() < 0.5 ? [2, 3] : [3, 2];
      const m = r.signed(1, 5);
      // q(k + m) = p(k + n)
      const top = q * (k + m) - p * k;
      if (top % p !== 0) return null;
      const n = top / p;
      if (!small(n, q * m, p * n) || n === m || k + m === 0 || k + n === 0) return null;
      return {
        shape: "two-fractions",
        start: `(${linL(1, m, l)})/${p} = (${linL(1, n, l)})/${q}`,
        goal: goalL(k, l),
        via: [`${q}*(${linL(1, m, l)}) = ${p}*(${linL(1, n, l)})`, `${linL(q, q * m, l)} = ${linL(p, p * n, l)}`, ...collectL(q, q * m, p, p * n, l, k)],
        numbers: [m, p, n, q],
        along: [q * m, p * n, q - p, (q - p) * k],
      };
    },
  },
];

// ---------- hard: brackets, fractions and collecting, with letters ----------

/** x in two places and other letters around: factor x out at the end. */
const FACTOR: Formula[] = [
  { start: "a(x - b) = c(x + b)", goals: ["x = (ab + bc)/(a - c)"], via: { "x = (ab + bc)/(a - c)": ["ax - ab = cx + cb", "ax - cx = cb + ab", "x(a - c) = cb + ab"] } },
  { start: "a(x + b) = c(x + d)", goals: ["x = (cd - ab)/(a - c)"], via: { "x = (cd - ab)/(a - c)": ["ax + ab = cx + cd", "ax - cx = cd - ab", "x(a - c) = cd - ab"] } },
  { start: "p(x - q) = x + r", goals: ["x = (pq + r)/(p - 1)"], via: { "x = (pq + r)/(p - 1)": ["px - pq = x + r", "px - x = r + pq", "x(p - 1) = r + pq"] } },
];

/** From Lx + Ka = fx + Ga, collected, to x = k·a: the x's to the side with more of them. */
function lastL(L: number, K: number, f: number, G: number, l: string, k: number): string[] {
  const d = L - f;
  if (d > 0) return d === 1 ? [] : [`${ax(d)} = ${ax(d * k, l)}`];
  return [`${ax(K - G, l)} = ${ax(-d)}`];
}

const mixedL: Shape[] = [
  {
    id: "fractions-minus",
    name: "one fraction less another, with a letter",
    make: (r) => {
      // (x + ma)/b - (x + na)/d = ea
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r) + r.int(0, 2);
      const [b, d] = [[2, 3], [3, 2], [3, 4], [4, 3]][r.int(0, 3)];
      const m = r.signed(1, 6);
      const n = r.signed(1, 6);
      const top = d * (k + m) - b * (k + n);
      if (k === 0 || m === n || top % (b * d) !== 0 || k + m === 0 || k + n === 0) return null;
      const e = top / (b * d);
      const N = b * d * e;
      const L = d - b;
      const K = d * m - b * n;
      if (e === 0 || K === 0 || K === N) return null;
      const rhs = ax(N, l);
      return {
        shape: "fractions-minus",
        start: `(${linL(1, m, l)})/${b} - (${linL(1, n, l)})/${d} = ${ax(e, l)}`,
        goal: goalL(k, l),
        via: [
          `${bracketL(d, m, l)} - ${bracketL(b, n, l)} = ${rhs}`,
          `${terms(d, "x", d * m, l)} - ${bracketL(b, n, l)} = ${rhs}`,
          `${terms(d, "x", d * m, l, -b, "x", -b * n, l)} = ${rhs}`,
          `${terms(L, "x", K, l)} = ${rhs}`,
          ...lastL(L, K, 0, N, l, k),
        ],
        numbers: [m, b, n, d, e],
        along: [d * m, b * n, N, K, N - K],
      };
    },
  },
  {
    id: "two-brackets-mixed",
    name: "two brackets, one taken away, with a letter",
    make: (r) => {
      // p(qx + ma) - d(x + na) = fx + Ga
      const l = LETTERS[r.int(0, 2)];
      const k = pickK(r);
      const p = r.int(2, 4);
      const q = r.int(1, 3);
      const m = r.signed(1, 5);
      const d = r.int(2, 4);
      const n = r.signed(1, 5);
      const f = r.int(1, 4);
      const L = p * q - d;
      const K = p * m - d * n;
      const G = (L - f) * k + K;
      if (L === f || L === 0 || K === 0 || G === 0 || p * q > 12 || Math.abs(G) > 20 || (q === 1 && (p === d || m === n))) return null;
      const R = `${terms(f, "x", G, l)}`;
      return {
        shape: "two-brackets-mixed",
        start: `${p}(${terms(q, "x", m, l)}) - ${bracketL(d, n, l)} = ${R}`,
        goal: goalL(k, l),
        via: [
          `${terms(p * q, "x", p * m, l)} - ${bracketL(d, n, l)} = ${R}`,
          `${terms(p * q, "x", p * m, l, -d, "x", -d * n, l)} = ${R}`,
          `${terms(L, "x", K, l)} = ${R}`,
          L > f ? `${ax(L)} = ${terms(f, "x", G - K, l)}` : `${terms(L, "x", K - G, l)} = ${ax(f)}`,
          ...lastL(L, K, f, G, l, k),
        ],
        numbers: [p, q, m, d, n, f, G],
        along: [p * q, p * m, d * n, L, K, G - K],
      };
    },
  },
];

const all: Shape[] = [fromBank("product", PRODUCTS), fromBank("sum", SUMS), fromBank("two-step", TWO_STEP), fromBank("formula", LONGER), ...letterShapes, fromBank("factor-twice", FACTOR), ...mixedL];

export const shapes: Record<Level, Shape[]> = {
  easy: byIds(all, "product", "sum", "two-step", "formula", "letters-both", "bracket-letter", "fraction-equal"),
  medium: byIds(all, "two-brackets", "two-fractions", "fraction-letter", "bracket-and-letter", "factor-twice"),
  hard: byIds(all, "fractions-minus", "two-brackets-mixed"),
};
