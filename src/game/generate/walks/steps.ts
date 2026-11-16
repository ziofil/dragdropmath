/**
 * Each chapter's own steps back (see walk.ts): what its walks write the long
 * way. A walk in a chapter takes these, and now and then an earlier
 * chapter's too — every chapter's exercises use what came before.
 */
import type { Back } from "../walk";
import { groupPower, nestPower, overPower, productCoef, rootIn, rootOfPower, splitFractionPower, splitLike, splitLog, splitPower, zeroPair } from "../backs";

export const OWN_STEPS: Record<string, readonly Back[]> = {
  shuffle: [splitLike(12, true), productCoef()],
  collect: [splitLike(), zeroPair(), productCoef()],
  powers: [splitPower(), nestPower(), overPower(), groupPower()],
  // A bracket put back (undone by multiplying it out).
  distribute: ["factor-out"],
  // Brackets multiplied out (undone by factoring).
  factor: ["distribute"],
  roots: [rootIn(), "root-notation", rootOfPower(), splitFractionPower(), "pull-out-of-power", "join-powers"],
  explog: ["power-into-log", "log-of-power", splitLog()],
};
