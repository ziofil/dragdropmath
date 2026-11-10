export const MATH_FONT = `"STIX Two Text", "Times New Roman", serif`;

const cache = new Map<string, number>();
let ctx: CanvasRenderingContext2D | null = null;

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
