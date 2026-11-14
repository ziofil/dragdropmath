/**
 * Dragology animates between two renders by matching elements (by id, then
 * by dragologyKey or position inside each id'd group) and blending their
 * props. It throws — blanking the board — when matched elements differ in
 * type, in a non-numeric string prop (e.g. className "m-var" vs "m-num"), or
 * in the shape of their transform. Its interpolation code isn't exported, so
 * this mirrors its rules and checks every move in every puzzle.
 */
import { describe, expect, it } from "vitest";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import type { MathState } from "../expr/types";
import { parseState } from "../expr/parse";
import { printState } from "../expr/key";
import { allNodes } from "../expr/tree";
import { candidatesFor, handles, tapFor, type RuleId } from "../rules";
import { allPuzzles } from "../game/testing/exercises";
import { neighbours } from "../game/solver";
import { renderState } from "./typeset";

type El = ReactElement<Record<string, unknown>>;

const render = (state: MathState) => renderState({ state }, 720, 220) as El;

function kids(e: El): El[] {
  const out: El[] = [];
  const walk = (n: ReactNode) => {
    if (Array.isArray(n)) n.forEach(walk);
    else if (isValidElement(n)) out.push(n as El);
  };
  walk(e.props.children as ReactNode);
  return out;
}

function byId(root: El): Map<string, El> {
  const m = new Map<string, El>();
  const walk = (e: El) => {
    if (typeof e.props.id === "string") m.set(e.props.id, e);
    kids(e).forEach(walk);
  };
  walk(root);
  return m;
}

const transformShape = (t: unknown) => (typeof t === "string" ? (t.match(/[a-z]+\(/gi) ?? []).join(" ") : "");

/** Problems blending element a into b (ignoring id'd children, which are matched on their own). */
function lerpProblems(a: El, b: El, where: string): string[] {
  if (a.type !== b.type) return [`${where}: <${String(a.type)}> vs <${String(b.type)}>`];
  const problems: string[] = [];
  for (const k of new Set([...Object.keys(a.props), ...Object.keys(b.props)])) {
    if (k === "children" || k.startsWith("dragology") || k.startsWith("data-") || /^on[A-Z]/.test(k)) continue;
    const x = a.props[k];
    const y = b.props[k];
    if (k === "transform") {
      if (x && y && transformShape(x) !== transformShape(y)) problems.push(`${where}: transform ${x} vs ${y}`);
      continue;
    }
    // Paths blend point by point (Dragology interpolates "d"), as long as they're drawn with the same commands.
    if (k === "d" && typeof x === "string" && typeof y === "string") {
      const cmds = (p: string) => p.replace(/[^a-zA-Z]/g, "");
      if (cmds(x) !== cmds(y)) problems.push(`${where}: d "${x}" vs "${y}"`);
      continue;
    }
    if (typeof x === "string" && typeof y === "string" && x !== y && (isNaN(parseFloat(x)) || isNaN(parseFloat(y)))) {
      problems.push(`${where}: ${k} "${x}" vs "${y}"`);
    }
  }
  const keyed = (e: El) => {
    const m = new Map<string, El>();
    let n = 0;
    for (const c of kids(e)) {
      if (typeof c.props.id === "string") continue;
      m.set((c.props.dragologyKey as string | undefined) ?? String(n++), c);
    }
    return m;
  };
  const ka = keyed(a);
  const kb = keyed(b);
  for (const [k, ca] of ka) {
    const cb = kb.get(k);
    if (cb) problems.push(...lerpProblems(ca, cb, `${where} > ${k}`));
  }
  return problems;
}

function checkTransition(before: MathState, after: MathState): string[] {
  const A = byId(render(before));
  const B = byId(render(after));
  const problems: string[] = [];
  for (const [id, a] of A) {
    const b = B.get(id);
    if (b) problems.push(...lerpProblems(a, b, `#${id}`));
  }
  return problems.map((p) => `${printState(before)} ⟶ ${printState(after)}: ${p}`);
}

describe("every move can be animated", () => {
  it.each(allPuzzles().map((r) => [r.puzzle.id, r.puzzle.start, r.rules] as const))("%s: %s", (_, src, rules) => {
    // The start state and everything one or two moves away.
    const start = parseState(src);
    const problems: string[] = [];
    const visit = (s: MathState, depth: number) => {
      for (const h of handles(s)) {
        for (const c of candidatesFor(s, h, rules as RuleId[])) problems.push(...checkTransition(s, c.state));
        const tap = tapFor(s, h, rules as RuleId[]);
        if (tap) problems.push(...checkTransition(s, tap.state));
      }
      if (depth > 0) neighbours(s, rules).slice(0, 12).forEach((n) => visit(n, depth - 1));
    };
    visit(start, 1);
    expect([...new Set(problems)].slice(0, 5)).toEqual([]);
  });
});

describe("what you carry is what you grabbed", () => {
  /** All text inside node `id`'s own group (what gets carried when it is dragged). */
  const carriedText = (src: string, nodeText: string) => {
    const state = parseState(src);
    const node = state.sides.flatMap(allNodes).find((n) => printState({ sides: [n] }) === nodeText)!;
    const texts: string[] = [];
    const walk = (e: El) => {
      if (typeof e.props.children === "string") texts.push(e.props.children);
      kids(e).forEach(walk);
    };
    walk(byId(render(state)).get(node.id)!);
    return texts.join("");
  };

  it.each([
    ["x + 2", "2", "2"], // no "+" travels with the 2…
    ["3x + 2x", "2*x", "2x"], // …or with 2x
    ["2·x·5", "5", "5"], // nor a "·" with the 5
    ["x - 2", "-2", "−2"], // a "−" is part of the term's value, so it does travel
    ["a + b - a", "-a", "−a"],
    ["a + b - a", "b", "b"],
  ])("%s: carrying %s carries %s", (src, node, expected) => {
    expect(carriedText(src, node)).toBe(expected);
  });
});
