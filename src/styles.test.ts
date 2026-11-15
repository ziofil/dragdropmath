// Skins are tokens: a skin may only set custom properties on :root (and draw the page behind everything: body,
// body::before, body::after). Every component reads tokens, so a new rule looks right in every skin by itself.
import { describe, expect, it } from "vitest";

// Read as text (a CSS import gives nothing in tests); node's fs, untyped (no node types here).
const fs: { readFileSync: (path: URL, encoding: "utf8") => string } = await import(/* @vite-ignore */ ["node", "fs"].join(":"));
const css = fs.readFileSync(new URL("./styles.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Every rule: its selector, its declarations, and the at-rules it's inside. */
function rules(text: string): { selector: string; body: string; within: string[] }[] {
  const out: { selector: string; body: string; within: string[] }[] = [];
  const stack: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      const head = text.slice(start, i).trim();
      const close = matching(text, i);
      if (head.startsWith("@")) {
        stack.push(head);
        start = i + 1;
        continue;
      }
      out.push({ selector: head, body: text.slice(i + 1, close), within: [...stack] });
      i = close;
      start = i + 1;
    } else if (text[i] === "}") {
      stack.pop();
      start = i + 1;
    }
  }
  return out;
}
function matching(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return i;
  }
  return text.length;
}

const all = rules(css).filter((r) => !r.within.some((w) => w.startsWith("@keyframes")));
const SKIN_TARGET = /^:root(\[data-skin="\w+"\]|:not\(\[data-skin\]\))( body(::before|::after)?)?$/;

describe("styles", () => {
  it("has no specificity hacks", () => {
    expect(css).not.toMatch(/#_|!important/);
  });

  it("lets a skin set tokens and the page behind, nothing else", () => {
    for (const r of all.filter((r) => r.selector.includes("data-skin"))) {
      for (const sel of r.selector.split(",").map((s) => s.trim())) expect(sel, r.selector).toMatch(SKIN_TARGET);
      // On :root itself: only tokens (and the colour scheme).
      if (!/body/.test(r.selector))
        for (const decl of r.body.split(";").map((d) => d.trim()).filter(Boolean)) expect(decl, r.selector).toMatch(/^(--[\w-]+|color-scheme)\s*:/);
    }
  });

  it("puts every hover look inside @media (hover: hover)", () => {
    for (const r of all.filter((r) => r.selector.includes(":hover"))) expect(r.within, r.selector).toContain("@media (hover: hover)");
  });

  it("has one rule for buttons", () => {
    const buttonRules = all.filter((r) => r.within.length === 0 && /(^|,)\s*button\s*(,|$)/.test(r.selector));
    expect(buttonRules.map((r) => r.selector)).toEqual(["button,\n.button"]);
  });
});
