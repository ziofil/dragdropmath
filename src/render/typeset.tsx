import { translate, type DragSpec, type Svgx } from "dragology";
import type { Expr, Frac, MathState, Rel } from "../expr/types";
import { relOf } from "../expr/build";
import { rootIndex } from "../expr/key";
import { signId } from "../rules";
import { allNodes } from "../expr/tree";
import { textWidth } from "./measure";
import { t } from "../i18n";
import { breaks } from "../expr/conditions";
import { isLeft, rowCount, rowOf, sidesOf } from "../expr/rows";

/**
 * Math typesetting in plain SVG (Dragology needs real SVG elements it can
 * measure and interpolate, so no KaTeX/MathJax).
 *
 * Every expression node becomes `<g id={node.id}>` positioned with a
 * transform, nested like the tree. Whether and how a piece responds to the
 * pointer is not decided here: an interactive rendering brings `interact`
 * (see drag/), a static one (the goal) doesn't.
 *
 * Decorations inside a node (its glyph, sign, brackets, fraction bar) must
 * NOT get ids: Dragology lifts every id'd element into its own layer, and a
 * layer without `dragologyOnDrag` swallows clicks — the symbol would sit on
 * top of its own grab area. They use `dragologyKey` instead, which keeps
 * them in the node's group but still lets them fade in/out between states.
 *
 * A term's leading sign is drawn *inside the term's group*, so the sign
 * travels with its term — and grabbing the sign grabs the whole term.
 */

export type RenderCtx = {
  state: MathState;
  /** The piece being dragged, if any (drawn on top). */
  draggedId?: string | null;
  /** How pieces respond to the pointer. Absent → a static, non-interactive rendering. */
  interact?: Interact;
  /** Filled in by layout: each node's box, relative to its own origin (baseline-left). */
  sizes?: Map<string, Size>;
  /** Filled in by layout: each node's font size. */
  fontSizes?: Map<string, number>;
  /**
   * Where an equation's = sits on the canvas (x), when not in the middle: set from the board as it is
   * (pivotOf), and kept for every state a drag passes through, so a piece carried across still lands
   * across. Absent: the middle.
   */
  pivot?: number;
  /** Filled in by layout: the canvas it was laid out for (its size, and where its = sits). */
  canvas?: { W: number; H: number; pivot?: number };
  /** Filled in by layout: the drawing itself (where each piece is: see placesOf). */
  drawn?: Svgx;
  /** Each id'd piece's origin on the canvas, read off the drawing once (placesOf). */
  places?: Map<string, { x: number; y: number }>;
  /** Filled in by layout: where the = sign's glyph starts and ends (x), if there is one. */
  eq?: { left: number; right: number; centre: number; baseline: number; size: number };
};

export type Interact = {
  /** Can this piece (a node id, or a minus sign's handle) be picked up by itself (by a quick press or a held one)? */
  grabbable(id: string): boolean;
  /** Does a quick press pick it up (else it goes through to its term)? */
  pressable(id: string): boolean;
  /** What tapping the + or − in front of this term does (two plain numbers: add them up). */
  opTap(termId: string): MathState | null;
  /** What tapping it gives, if anything. */
  tap(id: string): MathState | null;
  /** Apply a tap's result. */
  onTap?(next: MathState): void;
  /** What dragging it does. */
  drag(id: string): DragSpec<MathState>;
};

/** `lead` = width of the leading sign (+, −, ·) at the start of the box; the symbol itself follows it. */
export type Size = { w: number; asc: number; desc: number; lead: number };

type Box = { w: number; asc: number; desc: number; draw: (x: number, y: number) => Svgx };
type Content = { w: number; asc: number; desc: number; parts: (x0: number) => Svgx[] };

type Lead = "plus" | "minus" | "uminus" | "dot";
export const LEAD: Record<Lead, { glyph: string; left: number; right: number }> = {
  plus: { glyph: "+", left: 0.24, right: 0.24 },
  minus: { glyph: "−", left: 0.24, right: 0.24 },
  uminus: { glyph: "−", left: 0, right: 0.04 },
  dot: { glyph: "⋅", left: 0.1, right: 0.1 },
};

/** Ascent and descent of a line of text, as fractions of the font size. */
export const ASC = 0.72;
export const DESC = 0.24;

/** A text decoration (keyed, so Dragology can match and fade it between states). */
/**
 * A decoration's React key, from its name (its dragologyKey: how Dragology
 * matches it across states inside its piece); both are always set together. Blending two states,
 * Dragology keeps React's keys; left to list positions, a glyph fading out and
 * another fading in at the same position share one, and React leaves one
 * behind on screen (a stray + after an undo). Keys starting with "." are the
 * ones Dragology accepts.
 */
export const named = (name: string) => `.k:${name}`;

export function glyph(gkey: string, text: string, x: number, y: number, size: number, cls: string) {
  return (
    <text key={named(gkey)} dragologyKey={gkey} transform={translate(x, y)} fontSize={size} className={cls}>
      {text}
    </text>
  );
}

function layoutNode(
  e: Expr,
  rc: RenderCtx,
  size: number,
  lead: Lead | null,
  opts: { parens?: boolean; asLn?: boolean; root?: RootGeometry } = {},
): Box {
  if (e.kind === "neg" && lead === null) lead = "uminus";
  const content = withParens(layoutContent(e, rc, size, opts.asLn ?? false, opts.root), size, opts.parens ?? false);

  const L = lead ? LEAD[lead] : null;
  const leadW = L ? (L.left + L.right) * size + textWidth(L.glyph, size) : 0;
  const w = leadW + content.w;
  const asc = Math.max(content.asc, ASC * size);
  const desc = Math.max(content.desc, DESC * size);
  const interactive = rc.interact !== undefined;
  // Symbols with no real move of their own let presses fall through to the
  // term underneath (pointer-events: none), so 3x + 2x moves as whole terms.
  // One that can only be tapped (the 4 of √4: tap to split it) takes the tap,
  // but dragging it carries what encloses it (the whole √4).
  const grabbable = interactive && rc.interact!.grabbable(e.id);
  // Inside a term among others (the x of 3xy + 2), a quick press goes through to the
  // term; a press held still picks the piece up (ui/MathCanvas.tsx, useHold).
  const pressable = grabbable && rc.interact!.pressable(e.id);
  const tap = interactive ? rc.interact!.tap(e.id) : null;
  rc.sizes?.set(e.id, { w, asc, desc, lead: leadW });
  rc.fontSizes?.set(e.id, size);
  // A minus sign is also its own piece (see signHandle); every layout records its size.
  if (e.kind === "neg" && L)
    rc.sizes?.set(signId(e.id), { w: textWidth(L.glyph, size) + 0.04 * size, asc: ASC * size, desc: DESC * size, lead: 0 });

  return {
    w,
    asc,
    desc,
    draw: (x, y) => (
      <g
        id={e.id}
        transform={translate(x, y)}
        // (One class for every interactive piece: Dragology can't blend between
        // two different class names; cursor and pointer-events it switches.)
        className={grabbable || tap ? "m-node" : undefined}
        // Only pieces you can carry take presses. One you can only tap lets
        // them through to what it's part of, so 2√x is grabbed anywhere; taps
        // are found by position instead (ui/MathCanvas.tsx, tapAt).
        style={interactive ? { pointerEvents: pressable ? "auto" : "none", cursor: pressable ? "grab" : undefined } : undefined}
        {...(grabbable ? { dragologyOnDrag: () => rc.interact!.drag(e.id), dragologyZIndex: rc.draggedId === e.id ? "/1" : false } : {})}
        // Copies (from distributing) fly out of their source fully visible —
        // every part of them, grabbable or not (the 2 and x of a copied 2x too).
        dragologyEmergeFrom={rc.state.copies?.[e.id]}
        dragologyEmergeMode={rc.state.copies?.[e.id] ? ("clone" as const) : undefined}
      >
        <rect key={named("hit")} dragologyKey="hit" transform={translate(0, -asc)} width={w} height={asc + desc} className="m-hit" />
        {L &&
          (e.kind === "neg" && interactive ? (
            signHandle(rc, e.id, L, size)
          ) : e.kind === "neg" ? (
            // Placed as its handle would be, so a still layout knows where the − is too (placesOf).
            <g id={signId(e.id)} transform={translate(L.left * size, 0)}>
              {glyph(`lead-${lead}`, L.glyph, 0, 0, size, "m-op")}
            </g>
          ) : (
            glyph(`lead-${lead}`, L.glyph, L.left * size, 0, size, "m-op")
          ))}
        {content.parts(leadW)}
      </g>
    ),
  };
}

/**
 * A minus sign as its own handle: grabbable alone only when a move exists for
 * the minus by itself (−x = 6 → carry the −; −(x − 4) → carry it onto the
 * brackets). Otherwise presses fall through to the term, as for −a in a + b − a.
 */
function signHandle(rc: RenderCtx, negId: string, L: { glyph: string; left: number }, size: number): Svgx {
  const id = signId(negId);
  const w = textWidth(L.glyph, size) + 0.04 * size;
  const asc = ASC * size;
  const desc = DESC * size;
  const grabbable = rc.interact!.grabbable(id);
  const pressable = grabbable && rc.interact!.pressable(id);
  // 10 − 4: tapping the − works it out (dragging still carries the term). Found by position (OP_TAP).
  const tappable = hasOpTap(rc, negId);
  return (
    <g
      id={id}
      transform={translate(L.left * size, 0)}
      className={grabbable ? "m-node" : undefined}
      style={{ pointerEvents: pressable ? "auto" : "none" }}
      {...(grabbable ? { dragologyOnDrag: () => rc.interact!.drag(id), dragologyZIndex: rc.draggedId === id ? "/1" : false } : {})}
    >
      <rect key={named("hit")} dragologyKey="hit" transform={translate(0, -asc)} width={w} height={asc + desc} className="m-hit" {...(tappable ? { [OP_TAP]: negId } : {})} />
      {glyph("t-sign", L.glyph, 0, 0, size, "m-op")}
    </g>
  );
}

/** Where a root's sign must reach: its overline's height (top) and how far below the baseline it dips. */
type RootGeometry = { top: number; bottom: number; stroke: number };

/**
 * The √ sign as a path: a short rising tick, down to the bottom, then up to
 * the top-right corner where the overline begins. An index (∛) sits above
 * the tick.
 */
function rootSign(e: Frac, size: number, g: RootGeometry): Content {
  const n = e.den.kind === "num" ? e.den.value : 2;
  const idxSize = size * 0.42;
  const idx = n === 2 ? 0 : textWidth(String(n), idxSize) * 0.85;
  const h = g.bottom - g.top;
  const w = 0.5 * size + 0.08 * h;
  const tickY = g.top + 0.62 * h;
  const pts: [number, number][] = [
    [idx, tickY],
    [idx + 0.14 * w, tickY - 0.07 * size],
    [idx + 0.42 * w, g.bottom],
    [idx + w, g.top],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  return {
    w: idx + w,
    asc: -g.top + g.stroke,
    desc: g.bottom + g.stroke,
    parts: (x0) => [
      <path key={named("root")} dragologyKey="root" transform={translate(x0, 0)} d={d} strokeWidth={g.stroke} className="m-root" />,
      ...(n === 2 ? [] : [glyph("rootidx", String(n), x0, tickY - 0.12 * size, idxSize, "m-num")]),
    ],
  };
}

/**
 * An operator glyph that belongs to its row (keyed by the item after it, so
 * it moves with that slot). `tapFor`: the term whose + this is, when tapping
 * it works the operation out (3 + 4 → 7): marked for the canvas to find
 * (OP_TAP), as taps go by position.
 */
function separator(kind: "plus" | "dot", key: string, size: number, tapFor?: string | null): Box {
  const L = LEAD[kind];
  const w = (L.left + L.right) * size + textWidth(L.glyph, size);
  return {
    w,
    asc: ASC * size,
    desc: DESC * size,
    // Always in its own group, tappable or not, so the glyph sits at the same
    // path in every state and slides along when terms reorder.
    draw: (x, y) => (
      <g key={named(`tap-${key}`)} dragologyKey={`tap-${key}`}>
        {tapFor && <rect key={named(`hit-${key}`)} dragologyKey={`hit-${key}`} transform={translate(x, y - ASC * size)} width={w} height={(ASC + DESC) * size} className="m-hit" {...{ [OP_TAP]: tapFor }} />}
        {glyph(key, L.glyph, x + L.left * size, y, size, "m-op")}
      </g>
    ),
  };
}

/** Does tapping the +, − or · in front of `termId` (a term or a factor) do something? */
const hasOpTap = (rc: RenderCtx, termId: string) => !!rc.interact?.opTap(termId);

/** Marks the + or − whose tap works out the sum in front of a term (the term's id). */
export const OP_TAP = "data-optap";

function withParens(c: Content, size: number, parens: boolean): Content {
  if (!parens) return c;
  const pw = textWidth("(", size) + 0.02 * size;
  const sy = Math.max(1, (c.asc + c.desc) / ((ASC + DESC) * size));
  const shiftY = (c.desc - c.asc) / 2 + ((ASC - DESC) / 2) * size * sy;
  const paren = (pkey: string, ch: string, x: number) => (
    <text key={named(pkey)} dragologyKey={pkey} transform={`${translate(x, shiftY)} scale(1, ${sy})`} fontSize={size} className="m-op">
      {ch}
    </text>
  );
  return {
    w: c.w + 2 * pw,
    asc: Math.max(c.asc, ASC * size * sy),
    desc: Math.max(c.desc, DESC * size * sy),
    parts: (x0) => [paren("lp", "(", x0), ...c.parts(x0 + pw), paren("rp", ")", x0 + pw + c.w)],
  };
}

/**
 * Where writing factors side by side would misread, show a ·: before a number
 * (x·5), before or after a fraction (2·¾ is not 2¾), and before a power of a
 * number (2·3ˣ is not 23ˣ). A root reads fine without one (2√3).
 */
const needsDot = (left: Expr, right: Expr) =>
  right.kind === "num" ||
  right.kind === "frac" ||
  left.kind === "frac" ||
  (right.kind === "pow" && !right.radical && right.base.kind === "num");

function row(boxes: Box[], gap = 0): Content {
  const xs: number[] = [];
  let w = 0;
  boxes.forEach((b, i) => {
    if (i > 0) w += gap;
    xs.push(w);
    w += b.w;
  });
  return {
    w,
    asc: Math.max(0, ...boxes.map((b) => b.asc)),
    desc: Math.max(0, ...boxes.map((b) => b.desc)),
    parts: (x0) => boxes.map((b, i) => b.draw(x0 + xs[i], 0)),
  };
}

function layoutContent(e: Expr, rc: RenderCtx, size: number, asLn: boolean, root?: RootGeometry): Content {
  switch (e.kind) {
    case "num":
    case "var": {
      const text = e.kind === "num" ? String(e.value) : e.name;
      const italic = e.kind === "var";
      const w = textWidth(text, size, italic) + (italic ? 0.04 * size : 0);
      return {
        w,
        asc: ASC * size,
        desc: DESC * size,
        // Keyed by kind: when a node changes kind under the same id (x⁰ → 1),
        // the glyphs crossfade. Same key + different className can't be
        // blended, and Dragology throws (see lerp.test.tsx).
        parts: (x0) => [glyph(`t-${e.kind}`, text, x0, 0, size, italic ? "m-var" : "m-num")],
      };
    }
    case "neg": {
      // The minus itself is the lead glyph of this node (see layoutNode).
      const arg = layoutNode(e.arg, rc, size, null, { parens: e.arg.kind === "sum" || e.arg.kind === "neg" });
      return row([arg]);
    }
    case "sum": {
      // A "+" belongs to the row, not to the term after it: carrying 2 out of
      // 2 + x carries just the 2, and the + waits in the row where it will
      // land. A "−" is part of its term's value, so it travels with the term.
      // Named after the place of the term it's in front of (a term that took another's place keeps
      // that one's +: see Base.slot), and only once in a row.
      const used = new Set<string>();
      const plusOf = (t: Expr) => {
        const name = t.slot && !used.has(t.slot) && !e.terms.some((u) => u.id === t.slot) ? t.slot : t.id;
        used.add(name);
        return `plus-${name}`;
      };
      return row(
        e.terms.flatMap((t, i) =>
          i > 0 && t.kind !== "neg"
            ? [separator("plus", plusOf(t), size, hasOpTap(rc, t.id) ? t.id : null), layoutNode(t, rc, size, null, { parens: t.kind === "sum" })]
            : [layoutNode(t, rc, size, i > 0 ? "minus" : null, { parens: t.kind === "sum" })],
        ),
      );
    }
    case "prod":
      // Likewise a "·" between factors belongs to the product, not the factor.
      return row(
        e.factors.flatMap((f, i) => {
          const factor = layoutNode(f, rc, size, null, { parens: f.kind === "sum" || f.kind === "neg" });
          return i > 0 && needsDot(e.factors[i - 1], f) ? [separator("dot", `dot-${f.id}`, size, hasOpTap(rc, f.id) ? f.id : null), factor] : [factor];
        }),
        0.03 * size,
      );
    case "frac": {
      if (root !== undefined) return rootSign(e, size, root);
      const inner = size * 0.92;
      const n = layoutNode(e.num, rc, inner, null);
      const d = layoutNode(e.den, rc, inner, null);
      const axis = 0.26 * size;
      const gap = 0.14 * size;
      const thick = 0.055 * size;
      const pad = 0.1 * size;
      const w = Math.max(n.w, d.w) + 2 * pad;
      const nY = -axis - gap - n.desc;
      const dY = -axis + gap + d.asc;
      return {
        w,
        asc: axis + gap + n.desc + n.asc,
        desc: gap + d.asc + d.desc - axis,
        parts: (x0) => [
          n.draw(x0 + (w - n.w) / 2, nY),
          <rect key={named("bar")} dragologyKey="bar" transform={translate(x0, -axis - thick / 2)} width={w} height={thick} className="m-bar" />,
          d.draw(x0 + (w - d.w) / 2, dY),
        ],
      };
    }
    case "pow": {
      if (rootIndex(e) !== null) {
        // ⁿ√x: the exponent 1/n is drawn as the √ itself. It isn't a handle of its
        // own (see rules/index.ts movesFor): pressing the √ picks up the whole root.
        // The √ is a stroked path whose top-right corner is exactly where the
        // overline starts; both use the same stroke, so they join up.
        const base = layoutNode(e.base, rc, size, null);
        const gap = 0.06 * size;
        const pad = 0.06 * size;
        const geo: RootGeometry = {
          top: -(base.asc + 0.08 * size),
          bottom: Math.max(base.desc * 0.85, 0.16 * size),
          stroke: 0.055 * size,
        };
        const sign = layoutNode(e.exp, rc, size, null, { root: geo });
        return {
          w: sign.w + gap + base.w + pad,
          asc: -geo.top + geo.stroke,
          desc: Math.max(geo.bottom + geo.stroke, base.desc),
          parts: (x0) => [
            sign.draw(x0, 0),
            <rect
              key={named("overline")} dragologyKey="overline"
              transform={translate(x0 + sign.w - geo.stroke / 2, geo.top - geo.stroke / 2)}
              width={gap + base.w + pad + geo.stroke / 2}
              height={geo.stroke}
              className="m-bar"
            />,
            base.draw(x0 + sign.w + gap, 0),
          ],
        };
      }
      const base = layoutNode(e.base, rc, size, null, { parens: !["num", "var", "const"].includes(e.base.kind) });
      const exp = layoutNode(e.exp, rc, size * 0.68, null);
      const raise = 0.44 * size;
      const gap = 0.03 * size;
      return {
        w: base.w + gap + exp.w,
        asc: Math.max(base.asc, raise + exp.asc),
        desc: Math.max(base.desc, exp.desc - raise),
        parts: (x0) => [base.draw(x0, 0), exp.draw(x0 + base.w + gap, -raise)],
      };
    }
    case "const": {
      // Inside ln, the base e *is* the "ln" label, so dragging the e of eˣ
      // across = visibly turns it into ln. (Different keys: the glyphs crossfade.)
      const text = asLn ? "ln" : e.name;
      const w = textWidth(text, size, !asLn) + (asLn ? 0.06 * size : 0.04 * size);
      return {
        w,
        asc: ASC * size,
        desc: DESC * size,
        parts: (x0) => [glyph(asLn ? "ln" : "t-const", text, x0, 0, size, asLn ? "m-fn" : "m-const")],
      };
    }
    case "log": {
      const arg = layoutNode(e.arg, rc, size, null, { parens: true });
      const gap = 0.04 * size;
      if (e.base.kind === "const") {
        const label = layoutNode(e.base, rc, size, null, { asLn: true });
        return row([label, arg], gap);
      }
      const word = textWidth("log", size) + 0.02 * size;
      const base = layoutNode(e.base, rc, size * 0.68, null, { parens: !["num", "var", "const"].includes(e.base.kind) });
      const drop = 0.28 * size;
      return {
        w: word + base.w + gap + arg.w,
        asc: Math.max(ASC * size, arg.asc),
        desc: Math.max(DESC * size, base.desc + drop, arg.desc),
        parts: (x0) => [glyph("log", "log", x0, 0, size, "m-fn"), base.draw(x0 + word, drop), arg.draw(x0 + word + base.w + gap, 0)],
      };
    }
  }
}

export const BASE_SIZE = 46;

/** Id of the relation sign's layer (=, <, ≤, ...): its own layer, so it can turn round. */
export const REL = "rel";

/** How a relation is drawn: < and > are one glyph facing either way (as are ≤ and ≥). */
export function relGlyph(r: Rel): { text: string; facing: 1 | -1 } {
  if (r === "<" || r === ">") return { text: "<", facing: r === "<" ? 1 : -1 };
  if (r === "≤" || r === "≥") return { text: "≤", facing: r === "≤" ? 1 : -1 };
  return { text: "=", facing: 1 };
}

/**
 * The relation sign, centred at x. `turn` (0–1) is how far it has turned
 * round (a half turn about its upright axis: < becomes >), drawn as a
 * horizontal scale through 0 so moving between states blends smoothly.
 */
export function relation(state: MathState, cx: number, baseline: number, size: number, turn = 0, id = REL): Svgx {
  const { text, facing } = relGlyph(relOf(state));
  const sx = facing * Math.cos(Math.PI * turn);
  return (
    <g id={id} transform={`${translate(cx, baseline)} scale(${sx}, 1)`}>
      {glyph("eq", text, -textWidth(text, size) / 2, 0, size, "m-op m-eq")}
    </g>
  );
}

/** Lay out a whole expression or equation centred in a W×H canvas (or with a piece pinned: see MathState.pin). */
export function renderState(rc: RenderCtx, W: number, H: number): Svgx {
  const drawn = layoutCanvas(rc, W, H);
  rc.drawn = drawn;
  rc.places = undefined;
  return drawn;
}

/**
 * The one layout: where every piece of a laid-out canvas is (its origin,
 * baseline-left), as drawn. The drag's aims, its hit-testing, Show and the
 * tests all read places from here.
 */
export function placesOf(rc: RenderCtx): Map<string, { x: number; y: number }> {
  if (!rc.drawn) throw new Error("placesOf: not laid out");
  return (rc.places ??= originsOf(rc.drawn));
}

function layoutCanvas(rc: RenderCtx, W: number, H: number): Svgx {
  rc.sizes ??= new Map();
  rc.fontSizes ??= new Map();
  rc.canvas = { W, H, ...(rc.pivot === undefined ? {} : { pivot: rc.pivot }) };
  if (rowCount(rc.state) > 1) return renderRows(rc, W, H);
  const build = (size: number) => {
    const sides = rc.state.sides.map((s) => layoutNode(s, rc, size, null, { parens: s.kind === "sum" && !!s.grouped }));
    const eqW = Math.max(textWidth("=", size), textWidth(relGlyph(relOf(rc.state)).text, size));
    const space = 0.35 * size;
    return { sides, eqW, space };
  };

  let size = BASE_SIZE;
  let { sides, eqW, space } = build(size);
  const halfWidth = (s: typeof sides) => (s.length === 1 ? s[0].w / 2 : Math.max(s[0].w, s[1].w) + space + eqW / 2);
  const maxHalf = W / 2 - 16;
  // Too wide or too tall (a fraction of fractions): drawn smaller, to fit.
  const tall = (s: typeof sides) => Math.max(...s.map((x) => x.asc)) + Math.max(...s.map((x) => x.desc));
  const pivot = sides.length === 2 ? rc.pivot : undefined;
  // With the = moved over (pivot), each side has the room on its own side of it.
  const fits = (b: { sides: typeof sides; eqW: number; space: number }) =>
    Math.min(
      1,
      pivot === undefined ? maxHalf / halfWidth(b.sides) : Math.min((pivot - 16) / (b.sides[0].w + b.space + b.eqW / 2), (W - 16 - pivot) / (b.sides[1].w + b.space + b.eqW / 2)),
      (H - 16) / tall(b.sides),
    );
  // Smaller maths isn't exactly in proportion (a subscript has a smallest size): fitted again, until it fits.
  for (let pass = 0, scale = fits({ sides, eqW, space }); pass < 3 && scale < 0.995; pass++, scale = fits({ sides, eqW, space })) {
    size *= scale;
    ({ sides, eqW, space } = build(size));
  }

  const asc = Math.max(...sides.map((s) => s.asc));
  const desc = Math.max(...sides.map((s) => s.desc));
  const baseline = H / 2 + (asc - desc) / 2;
  const cx = pivot ?? W / 2;
  const xs = sides.length === 1 ? [cx - sides[0].w / 2] : [cx - eqW / 2 - space - sides[0].w, cx + eqW / 2 + space];

  const dx = pinShift(rc, sides, xs, [baseline, baseline], W)?.dx ?? 0;
  xs.forEach((_, k) => (xs[k] += dx));

  if (sides.length === 1) {
    return <g>{sides[0].draw(xs[0], baseline)}</g>;
  }
  // The = sign stays put in the middle, like the pivot of a balance (unless a pinned piece moves its whole row).
  const mid = cx + dx;
  rc.eq = { left: mid - eqW / 2, right: mid + eqW / 2, centre: mid, baseline, size };
  return (
    <g>
      {sides[0].draw(xs[0], baseline)}
      {relation(rc.state, mid, baseline, size)}
      {sides[1].draw(xs[1], baseline)}
    </g>
  );
}

/**
 * Where the = of a board showing `state` goes (see RenderCtx.pivot): in the
 * middle, like the pivot of a balance (undefined), unless a long side and a
 * short one would then be shrunk to fit half the canvas each, where moving
 * the = over lets the equation use the whole width (on a phone, a long side
 * stays big enough to grab). Read off the board before a move; kept while
 * the move is made.
 */
export function pivotOf(state: MathState, W: number): number | undefined {
  if (state.sides.length !== 2) return undefined;
  const rc: RenderCtx = { state, sizes: new Map(), fontSizes: new Map() };
  const at = (size: number) => {
    const sides = state.sides.map((s) => layoutNode(s, rc, size, null, { parens: s.kind === "sum" && !!s.grouped }));
    const eqW = Math.max(textWidth("=", size), textWidth(relGlyph(relOf(state)).text, size));
    return { sides, eqW, space: 0.35 * size };
  };
  const b = at(BASE_SIZE);
  const half = Math.max(b.sides[0].w, b.sides[1].w) + b.space + b.eqW / 2;
  const row = b.sides[0].w + b.sides[1].w + 2 * b.space + b.eqW;
  const centred = Math.min(1, (W / 2 - 16) / half);
  const free = Math.min(1, (W - 32) / row);
  if (free <= centred * 1.05) return undefined;
  // The row at the size it then has, centred on the canvas: the = where that puts it.
  const k = free;
  return (W - row * k) / 2 + (b.sides[0].w + b.space + b.eqW / 2) * k;
}

/**
 * Several equations (rows), stacked with their = signs in one column: a system
 * (x + y = 5 and x − y = 1). Each row has an equal share of the canvas's
 * height and is centred in it, as one equation is on the whole canvas: a move
 * in one row never shifts another, and a row that gets shorter (a fraction
 * gone) stays where it was, so a piece lands where it's carried.
 */
function renderRows(rc: RenderCtx, W: number, H: number): Svgx {
  const n = rowCount(rc.state);
  const build = (size: number) => ({ sides: rc.state.sides.map((s) => layoutNode(s, rc, size, null, { parens: s.kind === "sum" && !!s.grouped })), size });
  const fit = (b: ReturnType<typeof build>) => {
    const eqW = textWidth("=", b.size);
    const space = 0.35 * b.size;
    const left = Math.max(...b.sides.filter((_, i) => isLeft(i)).map((s) => s.w));
    const right = Math.max(...b.sides.filter((_, i) => !isLeft(i)).map((s) => s.w));
    const rowH = Math.max(...b.sides.map((s) => s.asc + s.desc)) + 0.35 * b.size;
    // The = column stays put in the middle, as for one equation (so a term
    // carried across lands across, whatever the other rows look like).
    const half = Math.max(left, right) + space + eqW / 2;
    return { eqW, space, left, right, rowH, half };
  };
  let b = build(BASE_SIZE);
  let f = fit(b);
  const slot = (H - 16) / n;
  const scale = Math.min(1, (W / 2 - 16) / f.half, slot / f.rowH);
  if (scale < 1) {
    b = build(BASE_SIZE * scale);
    f = fit(b);
  }
  const { size } = b;
  const cx = W / 2;
  const gap = { left: cx - f.eqW / 2 - f.space, right: cx + f.eqW / 2 + f.space };
  const baselines = b.sides.map((_, k) => {
    const [L, R] = sidesOf(rowOf(k)).map((j) => b.sides[j]);
    return 8 + (rowOf(k) + 0.5) * slot + (Math.max(L.asc, R.asc) - Math.max(L.desc, R.desc)) / 2;
  });
  const xs = b.sides.map((s, k) => (isLeft(k) ? gap.left - s.w : gap.right));
  const pinned = pinShift(rc, b.sides, xs, baselines, W);
  const dxOf = (r: number) => (pinned && pinned.row === r ? pinned.dx : 0);
  const parts: Svgx[] = [];
  for (let r = 0; r < n; r++) {
    const dx = dxOf(r);
    const [i, j] = sidesOf(r);
    const row = [
      b.sides[i].draw(xs[i] + dx, baselines[i]),
      relation(rc.state, cx + dx, baselines[i], size, 0, r === 0 ? REL : `${REL}${r}`),
      b.sides[j].draw(xs[j] + dx, baselines[i]),
    ];
    // An answer that breaks a condition (x = −3 where x ≥ −1): faded, and struck through.
    if (breaks(rc.state, r)) {
      const [x0, x1] = [xs[i] + dx, xs[j] + dx + b.sides[j].w];
      const y = baselines[i] - 0.3 * size;
      // (Faded by a veil of the page's colour over it: the drawing is flattened into layers, so a group's opacity is lost.)
      const top = baselines[i] - ASC * size;
      parts.push(
        ...row,
        <g id={`crossed${r}`} dragologyZIndex="/1">
          <rect x={x0 - 0.1 * size} y={top} width={x1 - x0 + 0.2 * size} height={1.05 * size} className="m-veil" />
          <line x1={x0 - 0.1 * size} x2={x1 + 0.1 * size} y1={y} y2={y} className="m-strike" />
        </g>,
      );
    } else parts.push(...row);
    if (r === 0) rc.eq = { left: cx + dx - f.eqW / 2, right: cx + dx + f.eqW / 2, centre: cx + dx, baseline: baselines[0], size };
    // The answers of one equation: "or" between them, under the = column.
    if (rc.state.join === "or" && r < n - 1) {
      const word = t().or;
      const small = 0.45 * size;
      const y = (baselines[i] + baselines[sidesOf(r + 1)[0]]) / 2 - (ASC * size - small) / 2;
      parts.push(glyph(`or${r}`, word, cx - textWidth(word, small) / 2, y, small, "m-or"));
    }
  }
  return <g>{parts}</g>;
}

/**
 * A pinned piece (MathState.pin: a move keeps it where it was while its
 * result is shown): how far its whole row (both sides and the relation, so
 * nothing runs into anything) shifts for the piece's symbol to start where
 * asked. Never off the canvas: near an edge, the pinned piece gives way.
 */
function pinShift(rc: RenderCtx, sides: Box[], xs: number[], baselines: number[], W: number): { row: number; dx: number } | null {
  const pin = rc.state.pin;
  const k = pin ? rc.state.sides.findIndex((s) => allNodes(s).some((n) => n.id === pin.id)) : -1;
  if (!pin || k < 0) return null;
  const at = originsOf(sides[k].draw(xs[k], baselines[k])).get(pin.id);
  if (!at) return null;
  const dx = pin.x - (at.x + (rc.sizes?.get(pin.id)?.lead ?? 0));
  const row = sides.length === 1 ? [0] : sidesOf(rowOf(k));
  const margin = 4;
  const left = Math.min(...row.map((j) => xs[j]));
  const right = Math.max(...row.map((j) => xs[j] + sides[j].w));
  return { row: rowOf(k), dx: Math.min(Math.max(dx, margin - left), W - margin - right) };
}

/** Canvas origin of every id'd element in a drawn tree (following the translates). */
function originsOf(el: unknown, x = 0, y = 0, out = new Map<string, { x: number; y: number }>()) {
  if (Array.isArray(el)) {
    for (const c of el) originsOf(c, x, y, out);
    return out;
  }
  if (!el || typeof el !== "object" || !("props" in el)) return out;
  const props = (el as { props: { id?: string; transform?: string; children?: unknown } }).props;
  let nx = x;
  let ny = y;
  for (const m of props.transform?.matchAll(/translate\(\s*([-+\d.eE]+)[\s,]+([-+\d.eE]+)/g) ?? []) {
    nx += parseFloat(m[1]);
    ny += parseFloat(m[2]);
  }
  if (props.id) out.set(props.id, { x: nx, y: ny });
  originsOf(props.children, nx, ny, out);
  return out;
}
