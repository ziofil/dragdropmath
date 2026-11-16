// Every move from what learners meet (the corpus), a step or two deep: each piece keeps one
// identity, a move without a target keeps the dragged piece, a merge's target existed, and an
// expression keeps its value. These are what the drawing relies on (ids are how a piece is
// followed across states), so they're checked everywhere rather than on hand-picked examples.
import { describe, expect, it } from "vitest";
import type { MathState } from "../expr/types";
import { printState, stateKey } from "../expr/key";
import { allNodes } from "../expr/tree";
import { flipRel, relOf } from "../expr/build";
import { evaluate, variables } from "../expr/eval";
import { candidatesFor, handles, isGrabbable, signOwner, tapFor } from ".";
import { corpus, SLOW } from "../game/testing/corpus";
import { startOf } from "../game/puzzles";
import { tidied } from "../game/tidy";

const DEPTH = SLOW ? 2 : 1;

const env = (s: MathState, k: number) => Object.fromEntries([...new Set(s.sides.flatMap(variables))].map((n, i) => [n, ((k * 7919 + i * 104729) % 1000) / 97 + 0.31]));
const close = (a: number, b: number) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));

describe("every move keeps the pieces whole", () => {
  for (const c of corpus())
    it(c.id, () => {
      const problems = new Set<string>();
      let frontier = [startOf(c.start, c.chapter)];
      const seen = new Set(frontier.map((s) => stateKey(s, "exact")));
      for (let depth = 0; depth < DEPTH && frontier.length; depth++) {
        const next: MathState[] = [];
        for (const s of frontier.slice(0, 30)) {
          const before = new Set(s.sides.flatMap(allNodes).map((n) => n.id));
          for (const h of handles(s)) {
            const drags = isGrabbable(s, h, c.rules) ? candidatesFor(s, h, c.rules) : [];
            const tap = tapFor(s, h, c.rules);
            for (const k of [...drags, ...(tap ? [tap] : [])]) {
              const what = `${k.rule}: ${printState(s)} → ${printState(k.state)}`;
              const ids = k.state.sides.flatMap(allNodes).map((n) => n.id);
              if (new Set(ids).size !== ids.length) problems.add(`a piece twice: ${what}`);
              if (k !== tap && !k.targetId && !ids.includes(signOwner(h) ?? h)) problems.add(`the dragged piece lost: ${what}`);
              if (k.targetId && !before.has(k.targetId)) problems.add(`a target that wasn't there: ${what}`);
              // The setting carries over: letters and conditions always; the relation unless turned round; the join unless a row splits into "or" rows.
              if (k.state.letters !== s.letters || JSON.stringify(k.state.conditions) !== JSON.stringify(s.conditions)) problems.add(`lost its setting: ${what}`);
              if (relOf(k.state) !== relOf(s) && relOf(k.state) !== flipRel(relOf(s))) problems.add(`a relation from nowhere: ${what}`);
              if (k.state.join !== s.join && !(k.state.join === "or" && k.state.sides.length > s.sides.length)) problems.add(`lost how its rows go together: ${what}`);
              if (s.sides.length === 1 && k.state.sides.length === 1)
                for (const n of [1, 2, 3]) {
                  const e = env(s, n);
                  const [a, b] = [evaluate(s.sides[0], e), evaluate(k.state.sides[0], e)];
                  if (Number.isFinite(a) && Number.isFinite(b) && !close(a, b)) problems.add(`changes the value: ${what}`);
                }
              const t = tidied(s, k.state);
              const key = stateKey(t, "exact");
              if (!seen.has(key)) {
                seen.add(key);
                next.push(t);
              }
            }
          }
        }
        frontier = next;
      }
      expect([...problems]).toEqual([]);
    });
});
