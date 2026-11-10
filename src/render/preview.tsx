/**
 * Editing a rendered preview (a LayeredSvgx) after the fact: what our custom
 * drag operators use to dress up, fade, or steer what Dragology shows.
 *
 * Dragology tags every rendered element with its path ("id/key/..."), which
 * it uses to find and blend elements, so anything added here gets the same
 * tags (`pathed`). Each helper returns a new preview; inputs are left alone.
 */
import { cloneElement, type ReactElement } from "react";
import { translate, type LayeredSvgx, type Svgx } from "dragology";

/** `el` (and everything inside) tagged with Dragology paths, as if rendered inside `parent` ("id/..."). */
export function pathed(el: Svgx, parent: string): Svgx {
  const props = el.props as { id?: string; dragologyKey?: string; children?: unknown };
  const path = props.id ? `${props.id}/` : `${parent}${props.dragologyKey ?? "0"}/`;
  let i = 0;
  const kids = ([] as unknown[]).concat(props.children ?? []).flat(Infinity).map((c) => {
    if (!c || typeof c !== "object" || !("props" in c)) return c;
    const k = (c as Svgx).props as { dragologyKey?: string };
    const step = k.dragologyKey ?? String(i++);
    return pathed(cloneElement(c as Svgx, { dragologyKey: step } as never) as Svgx, path);
  });
  return cloneElement(el, { "data-path": path } as never, ...(kids as Svgx[])) as Svgx;
}

/** The preview with layer `id`'s element replaced by `f(element)` (unchanged if there's no such layer). */
export function editLayer(layers: LayeredSvgx, id: string, f: (el: Svgx) => Svgx): LayeredSvgx {
  const layer = layers.byId.get(id);
  if (!layer) return layers;
  const byId = new Map(layers.byId);
  byId.set(id, { ...layer, element: f(layer.element) });
  return { ...layers, byId };
}

/** Layer `id` (with everything drawn in it) at this opacity. */
export const fadeLayer = (layers: LayeredSvgx, id: string, opacity: number) =>
  editLayer(layers, id, (el) => cloneElement(el, { opacity } as never) as Svgx);

/** Only the decorations keyed by `keys` inside layer `id` at this opacity (e.g. a log's brackets). */
export const fadeGlyphs = (layers: LayeredSvgx, id: string, keys: ReadonlySet<string>, opacity: number) =>
  editLayer(layers, id, (el) => withGlyphOpacity(el, keys, opacity) as Svgx);

function withGlyphOpacity(el: unknown, keys: ReadonlySet<string>, opacity: number): unknown {
  if (Array.isArray(el)) return el.map((c) => withGlyphOpacity(c, keys, opacity));
  if (!el || typeof el !== "object" || !("props" in el)) return el;
  const e = el as ReactElement<{ dragologyKey?: string; children?: unknown }>;
  if (e.props.dragologyKey && keys.has(e.props.dragologyKey)) return cloneElement(e as ReactElement<{ opacity?: number }>, { opacity });
  if (e.props.children === undefined) return e;
  return cloneElement(e, {}, withGlyphOpacity(e.props.children, keys, opacity) as never);
}

/**
 * Layer `id` drawn with these children instead of its own, plus `extra`
 * (tagged as part of the layer). E.g. the carried 2 of ln(2x) as it looks now,
 * wearing a faint ln( ).
 */
export function redrawLayer(layers: LayeredSvgx, id: string, children: readonly unknown[], extra?: Svgx): LayeredSvgx {
  return editLayer(layers, id, (el) => {
    const added = extra ? [pathed(extra, `${id}/`)] : [];
    return cloneElement(el, {}, ...(children as Svgx[]), ...added) as Svgx;
  });
}

/** Decorations keyed by `keys` at this opacity, in every layer (e.g. a row's "+" before some term). */
export function fadeGlyphsEverywhere(layers: LayeredSvgx, keys: ReadonlySet<string>, opacity: number): LayeredSvgx {
  let out = layers;
  for (const id of layers.byId.keys()) out = fadeGlyphs(out, id, keys, opacity);
  return out;
}

/**
 * The preview with piece `id` (its layer and all layers inside it) replaced by
 * how it's drawn in `from` — so a carried piece looks the same whichever
 * option is showing, while the rest of the preview shows that option.
 */
export function transplant(into: LayeredSvgx, from: LayeredSvgx, id: string): LayeredSvgx {
  if (!from.byId.has(id)) return into;
  const oldDesc = into.descendents?.get(id) ?? new Set<string>();
  const newDesc = from.descendents?.get(id) ?? new Set<string>();
  const byId = new Map(into.byId);
  for (const d of oldDesc) byId.delete(d);
  for (const k of [id, ...newDesc]) byId.set(k, from.byId.get(k)!);
  let descendents: LayeredSvgx["descendents"] = null;
  if (into.descendents) {
    descendents = new Map();
    for (const [k, set] of into.descendents) {
      if (oldDesc.has(k)) continue;
      if (!set.has(id)) descendents.set(k, set);
      else descendents.set(k, new Set([...[...set].filter((x) => !oldDesc.has(x)), ...newDesc]));
    }
    descendents.set(id, new Set(newDesc));
    for (const d of newDesc) descendents.set(d, new Set(from.descendents?.get(d) ?? []));
  }
  return { byId, descendents };
}

/** The children a layer is drawn with (to reuse its current look in another preview). */
export function layerChildren(layers: LayeredSvgx, id: string): unknown[] {
  const el = layers.byId.get(id)?.element as ReactElement<{ children?: unknown }> | undefined;
  return ([] as unknown[]).concat(el?.props.children ?? []);
}

/**
 * An invisible marker, used to steer Dragology's `between`: it blends two
 * previews by how far the dragged element is between its two positions, so
 * a marker at 0 in one and PROBE_SPAN in the other, "dragged" to t·PROBE_SPAN,
 * blends them by exactly t.
 */
export const PROBE = "merge-probe";
export const PROBE_SPAN = 100;

export function withProbe(layers: LayeredSvgx, x: number): LayeredSvgx {
  const byId = new Map(layers.byId);
  byId.set(PROBE, { element: pathed(<g id={PROBE} transform={translate(x, 0)} />, ""), stackingPath: [0] });
  const descendents = layers.descendents ? new Map(layers.descendents).set(PROBE, new Set<string>()) : null;
  return { byId, descendents };
}

/** How far a preview made by blending with the probe is towards the second one (0–1). */
export function probeBlend(layers: LayeredSvgx): number {
  const t = (layers.byId.get(PROBE)?.element.props as { transform?: string } | undefined)?.transform;
  const m = t?.match(/translate\(\s*([-+\d.eE]+)/);
  return m ? parseFloat(m[1]) / PROBE_SPAN : 0;
}
