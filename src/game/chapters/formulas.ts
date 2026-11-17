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

/**
 * The quantities the formulas are about, each with its SI unit (the same in every language; the names are in
 * i18n `quantities`). A letter means what its formula says it does: P is a power in P = IV, a pressure in
 * P = F/A, so every formula names its own.
 */
export const UNITS = {
  force: "N",
  mass: "kg",
  acceleration: "m/s²",
  momentum: "kg·m/s",
  velocity: "m/s",
  speed: "m/s",
  voltage: "V",
  current: "A",
  resistance: "Ω",
  power: "W",
  work: "J",
  distance: "m",
  charge: "C",
  time: "s",
  waveSpeed: "m/s",
  frequency: "Hz",
  wavelength: "m",
  density: "kg/m³",
  volume: "m³",
  pressure: "Pa",
  area: "m²",
  period: "s",
  gpe: "J",
  fieldStrength: "N/kg",
  height: "m",
  heat: "J",
  specificHeat: "J/(kg·°C)",
  tempRise: "°C",
  energy: "J",
  lightSpeed: "m/s",
  finalVelocity: "m/s",
  initialVelocity: "m/s",
  kineticEnergy: "J",
  displacement: "m",
  emf: "V",
  externalResistance: "Ω",
  internalResistance: "Ω",
  gravForce: "N",
  gravConstant: "N·m²/kg²",
  massOne: "kg",
  massOther: "kg",
  separation: "m",
  trolleyMass: "kg",
  otherTrolleyMass: "kg",
  velocityBefore: "m/s",
  velocityAfter: "m/s",
} as const;
export type Quantity = keyof typeof UNITS;
/** What each letter of a formula stands for, in the order they're said. */
type Means = Record<string, Quantity>;

/** A formula, what its letters stand for, and the quantities it's rearranged for: each goal, with that quantity the subject. */
type Formula = { start: string; means: Means; goals: string[]; via?: Record<string, string[]> };
/** Two formulas, what their letters stand for, and one quantity written in terms of others by substituting one into the other. */
type Pair = { start: string; means: Means; goal: string; letter: string; using: string[]; via?: string[] };

// What the letters stand for, formula by formula.
const NEWTON: Means = { F: "force", m: "mass", a: "acceleration" };
const MOMENTUM: Means = { p: "momentum", m: "mass", v: "velocity" };
const OHM: Means = { V: "voltage", I: "current", R: "resistance" };
const POWER_IV: Means = { P: "power", I: "current", V: "voltage" };
const WORK: Means = { W: "work", F: "force", d: "distance" };
const CHARGE: Means = { Q: "charge", I: "current", t: "time" };
const WAVE: Means = { v: "waveSpeed", f: "frequency", λ: "wavelength" };
const DENSITY: Means = { ρ: "density", m: "mass", V: "volume" };
const POWER_WT: Means = { P: "power", W: "work", t: "time" };
const SPEED: Means = { v: "speed", s: "distance", t: "time" };
const PRESSURE: Means = { P: "pressure", F: "force", A: "area" };
const PERIOD: Means = { f: "frequency", T: "period" };
const GPE: Means = { E: "gpe", m: "mass", g: "fieldStrength", h: "height" };
const HEATING: Means = { Q: "heat", m: "mass", c: "specificHeat", T: "tempRise" };
const EINSTEIN: Means = { E: "energy", m: "mass", c: "lightSpeed" };
const MOTION: Means = { v: "finalVelocity", u: "initialVelocity", a: "acceleration", t: "time" };
const POWER_VR: Means = { P: "power", V: "voltage", R: "resistance" };
const KINETIC: Means = { E: "kineticEnergy", m: "mass", v: "speed" };
const MOTION_S: Means = { v: "finalVelocity", u: "initialVelocity", a: "acceleration", s: "displacement" };
const MOTION_T: Means = { s: "displacement", u: "initialVelocity", v: "finalVelocity", t: "time" };
const MOTION_AT: Means = { s: "displacement", u: "initialVelocity", a: "acceleration", t: "time" };
const EMF: Means = { E: "emf", I: "current", R: "externalResistance", r: "internalResistance" };
const GRAVITY: Means = { F: "gravForce", G: "gravConstant", M: "massOne", m: "massOther", r: "separation" };
const COLLISION: Means = { m: "trolleyMass", u: "velocityBefore", M: "otherTrolleyMass", v: "velocityAfter" };

/** One move: a quantity multiplied or divided by another. */
const ONE_MOVE: Formula[] = [
  { start: "F = ma", means: NEWTON, goals: ["a = F/m", "m = F/a"] }, // Newton's second law
  { start: "p = mv", means: MOMENTUM, goals: ["v = p/m", "m = p/v"] },
  { start: "V = IR", means: OHM, goals: ["I = V/R", "R = V/I"] }, // Ohm's law
  { start: "P = IV", means: POWER_IV, goals: ["I = P/V", "V = P/I"] },
  { start: "W = Fd", means: WORK, goals: ["F = W/d", "d = W/F"] },
  { start: "Q = It", means: CHARGE, goals: ["I = Q/t", "t = Q/I"] },
  { start: "v = fλ", means: WAVE, goals: ["f = v/λ", "λ = v/f"] }, // the wave equation
  { start: "ρ = m/V", means: DENSITY, goals: ["m = ρV"] },
  { start: "P = W/t", means: POWER_WT, goals: ["W = Pt"] },
  { start: "v = s/t", means: SPEED, goals: ["s = vt"] },
  { start: "P = F/A", means: PRESSURE, goals: ["F = PA"] },
];

/** Two or three moves: a quantity on the bottom, a product of three, a sum. */
const TWO_MOVES: Formula[] = [
  { start: "ρ = m/V", means: DENSITY, goals: ["V = m/ρ"] },
  { start: "P = W/t", means: POWER_WT, goals: ["t = W/P"] },
  { start: "v = s/t", means: SPEED, goals: ["t = s/v"] },
  { start: "P = F/A", means: PRESSURE, goals: ["A = F/P"] },
  { start: "f = 1/T", means: PERIOD, goals: ["T = 1/f"] },
  { start: "E = mgh", means: GPE, goals: ["h = E/(mg)", "m = E/(gh)"] },
  { start: "Q = mcT", means: HEATING, goals: ["c = Q/(mT)", "T = Q/(mc)"] },
  { start: "E = mc^2", means: EINSTEIN, goals: ["m = E/c^2"] },
  { start: "v = u + at", means: MOTION, goals: ["u = v - at", "a = (v - u)/t", "t = (v - u)/a"] },
  { start: "a = (v - u)/t", means: MOTION, goals: ["v = u + at"] },
  { start: "P = V^2/R", means: POWER_VR, goals: ["R = V^2/P"] },
  { start: "E = (1/2)mv^2", means: KINETIC, goals: ["m = (2E)/v^2"] },
];

/** Several moves: a square, a bracket, the quantity in two places. */
const SEVERAL_MOVES: Formula[] = [
  { start: "E = (1/2)mv^2", means: KINETIC, goals: ["v = √((2E)/m)"] },
  { start: "v^2 = u^2 + 2as", means: MOTION_S, goals: ["s = (v^2 - u^2)/(2a)", "a = (v^2 - u^2)/(2s)", "u = √(v^2 - 2as)"] },
  { start: "s = ((u + v)t)/2", means: MOTION_T, goals: ["t = (2s)/(u + v)", "v = (2s)/t - u"] },
  { start: "s = ut + (1/2)at^2", means: MOTION_AT, goals: ["a = (2(s - ut))/t^2"] },
  { start: "E = I(R + r)", means: EMF, goals: ["I = E/(R + r)", "R = E/I - r"] },
  { start: "F = (GMm)/r^2", means: GRAVITY, goals: ["r = √((GMm)/F)"] },
  // A collision where the two stick together: momentum before = after, the speed after in two places.
  { start: "mu = mv + Mv", means: COLLISION, goals: ["v = (mu)/(m + M)"], via: { "v = (mu)/(m + M)": ["mu = v(m + M)"] } },
];

/** Two formulas into one. */
const PAIRS_MEDIUM: Pair[] = [
  { start: "P = IV; V = IR", means: { P: "power", I: "current", V: "voltage", R: "resistance" }, goal: "P = I^2R; V = IR", letter: "P", using: ["I", "R"] },
  { start: "W = Fd; F = ma", means: { W: "work", F: "force", d: "distance", m: "mass", a: "acceleration" }, goal: "W = mad; F = ma", letter: "W", using: ["m", "a", "d"] },
  { start: "v = fλ; f = 1/T", means: { v: "waveSpeed", f: "frequency", λ: "wavelength", T: "period" }, goal: "v = λ/T; f = 1/T", letter: "v", using: ["λ", "T"] },
  { start: "p = mv; v = s/t", means: { p: "momentum", m: "mass", v: "velocity", s: "distance", t: "time" }, goal: "p = (ms)/t; v = s/t", letter: "p", using: ["m", "s", "t"] },
];
const PAIRS_HARD: Pair[] = [
  { start: "P = IV; I = V/R", means: { P: "power", I: "current", V: "voltage", R: "resistance" }, goal: "P = V^2/R; I = V/R", letter: "P", using: ["V", "R"] },
  { start: "F = ma; a = (v - u)/t", means: { F: "force", m: "mass", a: "acceleration", v: "finalVelocity", u: "initialVelocity", t: "time" }, goal: "F = (m(v - u))/t; a = (v - u)/t", letter: "F", using: ["m", "u", "v", "t"] },
  // Energy kept: what's lost in height is gained in speed (E the same energy, first stored, then moving).
  { start: "E = mgh; E = (1/2)mv^2", means: { E: "energy", m: "mass", g: "fieldStrength", h: "height", v: "speed" }, goal: "E = mgh; v = √(2gh)", letter: "v", using: ["g", "h"], via: ["E = mgh; mgh = (1/2)mv^2"] },
];

/** Every formula and pair (for the tests: each one must be doable with the chapter's moves). */
export const FORMULA_BANK = { formulas: [...ONE_MOVE, ...TWO_MOVES, ...SEVERAL_MOVES], pairs: [...PAIRS_MEDIUM, ...PAIRS_HARD] };

const legendOf = (means: Means) => Object.entries(means).map(([letter, quantity]) => ({ letter, quantity, unit: UNITS[quantity] }));

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
      return { shape: id, start: f.start, goal, via: f.via?.[goal] ?? [], legend: legendOf(f.means) };
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
      return { shape: id, start: p.start, goal: p.goal, via: p.via ?? [], ask: { letter: p.letter, using: p.using }, legend: legendOf(p.means) };
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
