/** Every chapter's exercise shapes, by level. */
import type { Level, Shape } from "../write";
import { shapes as balance } from "./balance";
import { shapes as shuffle } from "./shuffle";
import { shapes as collect } from "./collect";
import { shapes as distribute } from "./distribute";
import { shapes as brackets } from "./brackets";
import { shapes as factor } from "./factor";
import { shapes as powers } from "./powers";
import { shapes as roots } from "./roots";
import { shapes as fractions } from "./fractions";
import { shapes as explog } from "./explog";
import { shapes as formulas } from "./formulas";
import { shapes as inequalities } from "./inequalities";
import { shapes as simultaneous } from "./simultaneous";

export const SHAPES: Record<string, Record<Level, Shape[]>> = { balance, shuffle, collect, distribute, brackets, factor, powers, roots, fractions, explog, formulas, inequalities, simultaneous };
