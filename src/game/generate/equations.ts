/**
 * Equations with the earlier chapters inside — fractions, roots, logs and
 * powers — as recipes (see linear.ts): solved where equations are (the
 * balance chapter), each built back from its answer. A teacher's form of a
 * piece (ln(x³) − ln(x) for 2ln(x)) is written in with writeAs, which checks
 * it is the same for every value of the letters.
 */
import type { RuleId } from "../../rules";
import { ex, expBoth, from, logBoth, over, plus, rootOf, spread, termExpr, times, writeAs } from "./unmove";
import { pickAnswer, type Recipe } from "./linear";
import { gcd, one } from "./write";


const FRACTIONS: RuleId[] = ["add-fractions", "expand-fraction", "split-fraction", "times-one", "multiply-numbers", "evaluate-fraction", "cancel-factor", "divide-numbers"];
const LOGS: RuleId[] = ["log-of-product", "log-of-power", "power-into-log", "combine-logs", "evaluate-log", "power-of-base", "exp-of-log"];
const ROOTS: RuleId[] = ["pull-out-of-power", "split-square", "evaluate-root", "root-notation", "power-of-product", "power-of-power", "power-to-product", "merge-powers", "evaluate-power", "tap-power"];

export const fractionEquals: Recipe = {
  id: "fraction-equals",
  name: "a fraction equal to a number",
  answer: (r) => r.int(1, 6),
  steps: ({ r, u, x0 }) => {
    // (ax + b)/c = d
    const a = r.int(2, 4);
    const c = r.int(2, 5);
    const b = r.signed(1, 9);
    const top = a * x0 + b;
    if (top <= 0 || top % c !== 0 || a === c) return null;
    return [times(a), plus(u(b)!), over(c)];
  },
};

export const wholeEquals: Recipe = {
  id: "whole-equals",
  name: "the letter over a number, equal to a whole number and a fraction",
  answer: (r) => r.int(2, 9),
  steps: ({ r, x0 }) => {
    // x/q = n ± p/q
    const q = r.int(2, 5);
    if (gcd(x0, q) > 1 || x0 < q) return null;
    const minus = r.next() < 0.4;
    const n = minus ? Math.ceil(x0 / q) : Math.floor(x0 / q);
    const p = Math.abs(x0 - n * q);
    return [over(q, 0, { exact: false }), writeAs(FRACTIONS, ex(`${n} ${minus ? "-" : "+"} ${p}/${q}`), 1)];
  },
};

export const cancelEquals: Recipe = {
  id: "cancel-equals",
  name: "cancel, then solve",
  positive: true,
  answer: (r) => r.int(2, 7),
  steps: ({ r, u, x }) => {
    // (k² + ak)/k = b
    const a = r.int(1, 5);
    return [plus(u(a)!), writeAs(["cancel-factor", "factor-out", "merge-powers", "divide-powers", "split-fraction", "times-one"], ex(`(${x}^2 + ${a === 1 ? "" : a}${x})/${x}`))];
  },
};

export const letterUnlikeEquals: Recipe = {
  id: "letter-unlike-equals",
  name: "the letter over two different bottoms, equal to a number",
  steps: ({ r, x0 }) => {
    // x/a + x/b = c: over the common bottom l, (tx)/l = c.
    const a = r.int(2, 5);
    const b = r.int(a + 1, 6);
    const l = (a * b) / gcd(a, b);
    const [ka, kb] = [l / a, l / b];
    const t = ka + kb;
    if ((x0 * t) % l !== 0) return null;
    const top = (k: number) => (k === 1 ? "x" : `(${k}x)`);
    // Each fraction made up to the common bottom, then the bottoms worked out (as the moves go).
    const raw = (k: number, d: number) => (k === 1 ? `x/${d}` : `${top(k)}/(${d}*${k})`);
    const done = (k: number) => `${top(k)}/${l}`;
    const [add, expand]: RuleId[][] = [["add-fractions", "combine"], ["expand-fraction", "multiply-numbers"]];
    return [
      times(t),
      over(l),
      writeAs(add, ex(`${done(ka)} + ${done(kb)}`)),
      ka !== 1 && kb !== 1 && writeAs(expand, ex(`${done(ka)} + ${raw(kb, b)}`)),
      writeAs(expand, ex(`${raw(ka, a)} + ${raw(kb, b)}`)),
      writeAs(expand, ex(`x/${a} + x/${b}`)),
    ];
  },
};

export const squareOfTimesRoot: Recipe = {
  id: "square-of-times-root",
  name: "the square of a number times a root",
  positive: true,
  answer: (r) => r.int(2, 7),
  steps: ({ r, x0 }) => {
    // (a√x)² = b
    const a = r.int(2, 3);
    if (a * a * x0 > 30) return null;
    return [times(a * a), writeAs(ROOTS, ex(`(${a}√x)^2`))];
  },
};

export const rootsSumEquals: Recipe = {
  id: "roots-sum-equals",
  name: "two roots of the letter that add up, equal to a number",
  positive: true,
  answer: (r) => r.int(2, 5) ** 2,
  steps: ({ r, x, x0 }) => {
    // √(k²x) + c√x = d
    const k = r.int(2, 4);
    const c = r.int(1, 3);
    if ((k + c) * Math.sqrt(x0) > 30) return null;
    return [rootOf(2), times(k + c), spread([ex(`${k}√${x}`), termExpr(c, ex(`√${x}`))]), writeAs(ROOTS, ex(`√(${k * k}${x})`), 0, { path: [0] })];
  },
};

export const expEquals: Recipe = {
  id: "exp-equals",
  name: "e to a multiple of the letter, equal to a number",
  positive: true,
  steps: ({ r }) => {
    // e^(ax) = c → x = ln(c)/a (any letter)
    const a = r.int(2, 5);
    const c = r.int(2, 12);
    if (c === a) return null;
    return { value: ex(`ln(${c})/${a}`), steps: [times(a), expBoth("e")] };
  },
};

export const sameBaseProduct: Recipe = {
  id: "same-base-product",
  name: "two powers of e multiplied",
  positive: true,
  steps: ({ r, x }) => {
    // e^(ax)·e^(bx) = c → x = ln(c)/(a + b)
    const a = r.int(1, 4);
    const b = r.int(1, 3);
    const c = r.int(2, 12);
    if (c === a + b) return null;
    const kx = (k: number) => (k === 1 ? x : `${k}${x}`);
    const e = (k: number) => (k === 1 ? `e^${x}` : `e^(${kx(k)})`);
    return { value: ex(`ln(${c})/${a + b}`), steps: [times(a + b), expBoth("e"), writeAs(["merge-powers", "combine"], ex(`e^(${kx(a)} + ${kx(b)})`)), writeAs(["merge-powers"], ex(`${e(a)}·${e(b)}`))] };
  },
};

export const logSumEquals: Recipe = {
  id: "log-sum-equals",
  name: "a sum of logs equal to a number",
  positive: true,
  answer: (r) => one(r, [2, 4, 8, 3, 9]),
  steps: ({ r, u, x0 }) => {
    // log_b(n) + log_b(bᵏ) = m
    const b = x0 % 2 === 0 ? 2 : 3;
    const k = r.int(1, b === 2 ? 3 : 2);
    return [logBoth(b), plus(u(k)!), writeAs(LOGS, ex(`log_${b}(${b ** k})`), 0, { path: [1] })];
  },
};

export const logWithE: Recipe = {
  id: "log-with-e",
  name: "an ln with e inside",
  positive: true,
  steps: ({ r, x }) => {
    // ln(x/eᵏ) = n, ln(eᵏ·x) = n → x = eᵐ
    const k = r.int(1, 2);
    const m = r.int(2, 6);
    const overE = r.next() < 0.5;
    const n = overE ? m - k : m + k;
    if (n < 2) return null;
    const ek = k === 1 ? "e" : `e^${k}`;
    return { value: ex(`e^${m}`), steps: [logBoth("e"), plus(ex(`${overE ? -k : k}`)), writeAs(LOGS, ex(overE ? `ln(${x}/${ek})` : k === 1 ? `ln(e·${x})` : `ln(${ek}·${x})`))] };
  },
};

export const isolateExp: Recipe = {
  id: "isolate-exp",
  name: "a power of e to get on its own, then a linear exponent",
  positive: true,
  steps: ({ r }) => {
    // a·e^(bx + c) + d = ak + d → x = (ln(k) − c)/b
    const a = r.int(2, 3);
    const b = r.int(2, 3);
    const c = r.signed(1, 3);
    const k = r.int(2, 7);
    const d = r.signed(1, 5);
    if (a * k + d <= 0 || k === a) return null;
    return { value: ex(`(ln(${k}) ${c < 0 ? "+" : "-"} ${Math.abs(c)})/${b}`), steps: [times(b), plus(ex(`${c}`)), expBoth("e"), times(a), plus(ex(`${d}`))] };
  },
};

export const isolateLn: Recipe = {
  id: "isolate-ln",
  name: "an ln taken away, to get on its own and undo",
  positive: true,
  steps: ({ r }) => {
    // d − a·ln(x + c) = e → x = eᵏ − c
    const a = r.int(2, 3);
    const k = r.int(2, 4);
    const c = r.signed(1, 4);
    const d = a * k + r.int(1, 5);
    if (d > 30) return null;
    return { value: ex(`e^${k} ${c < 0 ? "+" : "-"} ${Math.abs(c)}`), steps: [plus(ex(`${c}`)), logBoth("e"), times(a), from(d)] };
  },
};

export const splitLog: Recipe = {
  id: "split-log",
  name: "the log of a product or a quotient, split and worked out",
  positive: true,
  answer: (r) => one(r, [2, 4, 8, 16, 3, 9, 27]),
  steps: ({ r, u, x, x0 }) => {
    // log_B(Bᵏ·x) = n, log_B(x/Bᵏ) = n
    const B = x0 % 2 === 0 ? 2 : 3;
    const k = r.int(2, B === 2 ? 4 : 2);
    const overB = r.next() < 0.5;
    const m = Math.round(Math.log(x0) / Math.log(B));
    if (overB ? m - k < 1 : false) return null;
    return [logBoth(B), plus(u(overB ? -k : k)!), writeAs(LOGS, ex(overB ? `log_${B}(${x}/${B ** k})` : `log_${B}(${B ** k}${x})`))];
  },
};

export const powersInLogs: Recipe = {
  id: "powers-in-logs",
  name: "logs of powers to collect, then solve",
  positive: true,
  steps: ({ r }) => {
    // L(xᵃ) ± L(xᵇ) + c = d → x = base^m, L = ln or log₂
    const ln = r.next() < 0.5;
    const a = r.int(2, 4);
    const b = r.int(1, 2);
    const minus = r.next() < 0.5;
    const s = minus ? a - b : a + b;
    const m = r.int(2, 3);
    const c = r.signed(1, 4);
    if (s < 2 || a === b || s * m + c <= 0 || s * m + c > 20) return null;
    const L = ln ? "ln" : "log_2";
    const pw = (k: number) => (k === 1 ? "x" : `x^${k}`);
    return {
      value: ex(ln ? `e^${m}` : `${2 ** m}`),
      steps: [logBoth(ln ? "e" : 2), times(s), plus(ex(`${c}`)), writeAs(LOGS, ex(`${L}(${pw(a)}) ${minus ? "-" : "+"} ${L}(${pw(b)})`), 0, { path: [0] })],
    };
  },
};

export const logOfQuotient: Recipe = {
  id: "log-of-quotient",
  name: "the log of a quotient of powers of x and y, equal to a number",
  positive: true,
  steps: ({ r }) => {
    // log₂((xᵃyᵇ)/(xᶜyᵇ)) = em → x = 2ᵐ
    const e = r.int(2, 3);
    const m = r.int(2, 3);
    const c = r.int(1, 2);
    const b = r.int(1, 3);
    const pw = (v: string, k: number) => (k === 1 ? v : `${v}^${k}`);
    return {
      value: ex(`${2 ** m}`),
      steps: [logBoth(2), times(e), writeAs(LOGS, ex(`log_2(x^${e})`)), writeAs(["divide-powers", "power-one", "zero-power", "cancel-factor", "flip-across-bar"], ex(`log_2((${pw("x", c + e)}·${pw("y", b)})/(${pw("x", c)}·${pw("y", b)}))`))],
    };
  },
};

export { pickAnswer };
