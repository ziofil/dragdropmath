/**
 * Rearranging formulas: real physics formulas, a quantity made the subject
 * ("make a the subject of F = ma"), and two formulas combined into one by
 * substituting (P = IV and V = IR give P = I²R). Every formula is one a
 * student meets in physics, written with its usual letters (λ and ρ too);
 * every quantity stands for a positive number (a mass, a time, a speed).
 * After Simultaneous equations: combining formulas is its substitution.
 */
import type { Chapter } from "../puzzles";
import type { Draft, Level, Rng, Shape } from "../generate/write";
import { carrying, d } from "../generate/drill";

/** A formula and the quantities it's rearranged for: each goal, with that quantity the subject. */
type Formula = { start: string; goals: string[]; via?: Record<string, string[]> };
/** Two formulas, and one quantity written in terms of others by substituting one into the other. */
type Pair = { start: string; goal: string; letter: string; using: string[]; via?: string[] };

/** One move: a quantity multiplied or divided by another. */
const ONE_MOVE: Formula[] = [
  { start: "F = ma", goals: ["a = F/m", "m = F/a"] }, // Newton's second law
  { start: "p = mv", goals: ["v = p/m", "m = p/v"] }, // momentum
  { start: "V = IR", goals: ["I = V/R", "R = V/I"] }, // Ohm's law
  { start: "P = IV", goals: ["I = P/V", "V = P/I"] }, // electrical power
  { start: "W = Fd", goals: ["F = W/d", "d = W/F"] }, // work done
  { start: "Q = It", goals: ["I = Q/t", "t = Q/I"] }, // charge
  { start: "v = fλ", goals: ["f = v/λ", "λ = v/f"] }, // the wave equation
  { start: "ρ = m/V", goals: ["m = ρV"] }, // density
  { start: "P = W/t", goals: ["W = Pt"] }, // power
  { start: "v = s/t", goals: ["s = vt"] }, // speed
  { start: "P = F/A", goals: ["F = PA"] }, // pressure
];

/** Two or three moves: a quantity on the bottom, a product of three, a sum. */
const TWO_MOVES: Formula[] = [
  { start: "ρ = m/V", goals: ["V = m/ρ"] },
  { start: "P = W/t", goals: ["t = W/P"] },
  { start: "v = s/t", goals: ["t = s/v"] },
  { start: "P = F/A", goals: ["A = F/P"] },
  { start: "f = 1/T", goals: ["T = 1/f"] }, // frequency and period
  { start: "E = mgh", goals: ["h = E/(mg)", "m = E/(gh)"] }, // gravitational potential energy
  { start: "Q = mcT", goals: ["c = Q/(mT)", "T = Q/(mc)"] }, // heating: T the temperature rise
  { start: "E = mc^2", goals: ["m = E/c^2"] },
  { start: "v = u + at", goals: ["u = v - at", "a = (v - u)/t", "t = (v - u)/a"] }, // velocity after a steady acceleration
  { start: "a = (v - u)/t", goals: ["v = u + at"] },
  { start: "P = V^2/R", goals: ["R = V^2/P"] },
  { start: "E = (1/2)mv^2", goals: ["m = (2E)/v^2"] }, // kinetic energy
];

/** Several moves: a square, a bracket, the quantity in two places. */
const SEVERAL_MOVES: Formula[] = [
  { start: "E = (1/2)mv^2", goals: ["v = √((2E)/m)"] },
  { start: "v^2 = u^2 + 2as", goals: ["s = (v^2 - u^2)/(2a)", "a = (v^2 - u^2)/(2s)", "u = √(v^2 - 2as)"] },
  { start: "s = ((u + v)t)/2", goals: ["t = (2s)/(u + v)", "v = (2s)/t - u"] },
  { start: "s = ut + (1/2)at^2", goals: ["a = (2(s - ut))/t^2"] },
  { start: "E = I(R + r)", goals: ["I = E/(R + r)", "R = E/I - r"] }, // e.m.f. and internal resistance
  { start: "F = (GMm)/r^2", goals: ["r = √((GMm)/F)"] }, // gravitation
  // A collision where the two stick together: momentum before = after, the speed after in two places.
  { start: "mu = mv + Mv", goals: ["v = (mu)/(m + M)"], via: { "v = (mu)/(m + M)": ["mu = v(m + M)"] } },
];

/** Two formulas into one. */
const PAIRS_MEDIUM: Pair[] = [
  { start: "P = IV; V = IR", goal: "P = I^2R; V = IR", letter: "P", using: ["I", "R"] },
  { start: "W = Fd; F = ma", goal: "W = mad; F = ma", letter: "W", using: ["m", "a", "d"] },
  { start: "v = fλ; f = 1/T", goal: "v = λ/T; f = 1/T", letter: "v", using: ["λ", "T"] },
  { start: "p = mv; v = s/t", goal: "p = (ms)/t; v = s/t", letter: "p", using: ["m", "s", "t"] },
];
const PAIRS_HARD: Pair[] = [
  { start: "P = IV; I = V/R", goal: "P = V^2/R; I = V/R", letter: "P", using: ["V", "R"] },
  { start: "F = ma; a = (v - u)/t", goal: "F = (m(v - u))/t; a = (v - u)/t", letter: "F", using: ["m", "u", "v", "t"] },
  // Energy kept: what's lost in height is gained in speed.
  { start: "E = mgh; E = (1/2)mv^2", goal: "E = mgh; v = √(2gh)", letter: "v", using: ["g", "h"], via: ["E = mgh; mgh = (1/2)mv^2"] },
];

/** Every formula and pair (for the tests: each one must be doable with the chapter's moves). */
export const FORMULA_BANK = { formulas: [...ONE_MOVE, ...TWO_MOVES, ...SEVERAL_MOVES], pairs: [...PAIRS_MEDIUM, ...PAIRS_HARD] };

const pick = <T,>(r: Rng, xs: readonly T[]): T => xs[r.int(0, xs.length - 1)];

function formulaShape(id: string, bank: Formula[]): Shape {
  return {
    id,
    name: "a physics formula, a quantity to make the subject",
    // Real formulas: written as physics writes them, not held to the made-up exercises' rules.
    curated: true,
    make: (r): Draft => {
      const f = pick(r, bank);
      const goal = pick(r, f.goals);
      return { shape: id, start: f.start, goal, via: f.via?.[goal] ?? [] };
    },
  };
}

function pairShape(id: string, bank: Pair[]): Shape {
  return {
    id,
    name: "two physics formulas combined into one",
    curated: true,
    make: (r): Draft => {
      const p = pick(r, bank);
      return { shape: id, start: p.start, goal: p.goal, via: p.via ?? [], ask: { letter: p.letter, using: p.using } };
    },
  };
}

const levels = (): Record<Level, Shape[]> => ({
  easy: [formulaShape("one-move", ONE_MOVE), formulaShape("two-moves", TWO_MOVES)],
  medium: [formulaShape("two-moves", TWO_MOVES), formulaShape("several-moves", SEVERAL_MOVES), pairShape("combine", PAIRS_MEDIUM)],
  hard: [formulaShape("several-moves", SEVERAL_MOVES), { ...pairShape("combine", [...PAIRS_MEDIUM, ...PAIRS_HARD]), weight: 2 }],
});

export const formulas: Chapter = {
  id: "formulas",
  title: "Rearranging formulas",
  blurb: "The formulas of physics, rearranged: make any quantity the subject, and combine two formulas into one.",
  after: ["simultaneous"],
  // Every quantity is a positive number (a mass, a time, a resistance): so a square root has one answer.
  positive: true,
  unlocks: ["move-letter-factor", "move-letter-denominator"],
  // The lesson: one board per move, in the order a learner meets them (words in i18n `drills`).
  drills: [
    // A quantity multiplying the subject: it divides the other side (F = ma, for a).
    d("move-letter-factor", (r) => pick(r, ["F = ma", "V = IR", "p = mv", "W = Fd", "P = IV", "Q = It", "v = fλ"])),
    // A quantity on the bottom: it multiplies the other side (ρ = m/V, for m).
    d("move-letter-denominator", (r) => pick(r, ["P = F/A", "ρ = m/V", "v = s/t", "P = W/t"])),
    // The quantity wanted in two places (a collision, the trolleys stick together): take it out as a factor first.
    d("letter-twice", () => ({ start: "mu = mv + Mv", via: ["mu = v(m + M)"], goal: "v = (mu)/(m + M)" }), "factor-out"),
    // Two formulas about the same circuit: substitute one into the other.
    carrying("alone", d("combine-formulas", () => ({ start: "P = IV; V = IR", goal: "P = I^2R; V = IR", via: ["P = I(IR); V = IR"] }), "substitute")),
  ],
  levels,
};
