/**
 * Hard exercises for Fractions: one fraction inside another, with two
 * letters, x and y, so nothing collapses too soon. (Powers, Roots, Logs and
 * Factoring nest by walking: ../walks/.)
 */
import { one as pick, type Shape } from "../write";

/** A coefficient in front: "3x", "x". */
const co = (c: number, s: string) => (c === 1 ? s : `${c}${s}`);

const COPRIME: [number, number][] = [
  [2, 3],
  [2, 5],
  [3, 4],
  [3, 5],
  [2, 7],
  [4, 5],
];


const fractions: Shape[] = [
  {
    id: "fraction-of-fractions",
    name: "a sum of fractions over a fraction",
    make: (r) => {
      // (x/a + x/b)/(y/(ab)) → ((a + b)x)/y
      const [a, b] = pick(r, COPRIME);
      const ab = a * b;
      return {
        shape: "fraction-of-fractions",
        start: `(x/${a} + x/${b})/(y/${ab})`,
        goal: `(${a + b}x)/y`,
        via: [`((${b}x)/${ab} + (${a}x)/${ab})/(y/${ab})`, `((${a + b}x)/${ab})/(y/${ab})`],
      };
    },
  },
  {
    id: "divide-letter-fractions",
    name: "a fraction of x and y divided by another",
    make: (r) => {
      // (px/y)/(x²/(qy)) + s/x → (pq + s)/x
      const p = r.int(2, 5);
      const q = r.int(2, 5);
      const s = r.int(1, 5);
      if (p * q > 30) return null;
      return {
        shape: "divide-letter-fractions",
        start: `((${p}x)/y)/(x^2/(${q}y)) + ${s}/x`,
        goal: `${p * q + s}/x`,
        // The q and the y under two bars go up onto the top (they multiply), then everything cancels down.
        via: [`((${p}x·${q}·y)/y)/x^2 + ${s}/x`, `${p * q}/x + ${s}/x`],
      };
    },
  },
  {
    id: "fraction-over-flipped",
    name: "a fraction over another with x and y swapped",
    make: (r) => {
      // (px/y)/(y/(qx)) − (s·x²)/y² → ((pq − s)x²)/y²
      const p = r.int(2, 5);
      const q = r.int(2, 5);
      const s = r.int(1, 5);
      if (p * q > 30 || p * q - s < 2) return null;
      return {
        shape: "fraction-over-flipped",
        start: `((${p}x)/y)/(y/(${q}x)) - ${co(s, "x^2")}/y^2`,
        goal: `(${p * q - s}x^2)/y^2`,
        // The q and the x under two bars go up onto the top, the outer y joins the inner bottom.
        via: [`((${p}x·${q}·x)/y)/y - ${co(s, "x^2")}/y^2`, `(${p * q}x^2)/y^2 - ${co(s, "x^2")}/y^2`],
      };
    },
  },
];


/** Each chapter's nested hard shapes. */
export const NESTED: Record<string, Shape[]> = { fractions };
