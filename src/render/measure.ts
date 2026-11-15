/** The font the maths is drawn in (a skin can change it: see ui/skins.ts). */
let MATH_FONT = `"STIX Two Text", "Times New Roman", serif`;

/** Draw (and measure) the maths in this font family from now on. */
export function setMathFamily(family: string): void {
  MATH_FONT = `${family}, "STIX Two Text", "Times New Roman", serif`;
  clearTextWidths();
}

// Widths change with the font: what was laid out with the old one is drawn again (useFontEpoch).
let epoch = 0;
const listeners = new Set<() => void>();
/** Changes whenever measured widths do. */
export const fontEpoch = () => epoch;
export function subscribeFont(f: () => void): () => void {
  listeners.add(f);
  return () => listeners.delete(f);
}

const cache = new Map<string, number>();
let ctx: CanvasRenderingContext2D | null = null;

/** Forget measured widths (the math font arrived after they were taken with a fallback). */
export function clearTextWidths(): void {
  cache.clear();
  epoch++;
  listeners.forEach((f) => f());
}

/** Advance width of `text` in px. Wait for fonts (see main.tsx) before the first call. */
export function textWidth(text: string, size: number, italic = false): number {
  const k = `${italic ? "i" : "r"}|${text}`;
  let em = cache.get(k);
  if (em === undefined) {
    if (typeof document === "undefined") return text.length * 0.5 * size; // tests run without a DOM
    ctx ??= document.createElement("canvas").getContext("2d")!;
    ctx.font = `${italic ? "italic " : ""}100px ${MATH_FONT}`;
    em = ctx.measureText(text).width / 100;
    cache.set(k, em);
  }
  return em * size;
}
