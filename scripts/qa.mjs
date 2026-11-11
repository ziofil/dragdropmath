// QA sweep against the dev server (port 5179): open every page; report crashes,
// console errors and maths drawn outside its box. Phone screenshots go to scripts/.out/.
//   node scripts/qa.mjs
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
mkdirSync("scripts/.out", { recursive: true });
const KNOWN = /does not recognize the `%s` prop|unique "key" prop|404 \(Not Found\)/;
const b = await chromium.launch({ channel: "chrome", headless: true });
const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
let errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 200)));
p.on("console", (m) => m.type() === "error" && !KNOWN.test(m.text()) && errs.push("console: " + m.text().slice(0, 200)));
await p.goto("http://localhost:5179/#/");
await p.waitForTimeout(800);
const ids = await p.evaluate(async () => {
  const m = await import("/src/game/puzzles.ts");
  return { chapters: m.CHAPTERS.map((c) => c.id), puzzles: m.allPuzzles().map((r) => r.puzzle.id) };
});
const pages = ["#/", ...ids.chapters.map((c) => `#/c/${c}`), ...ids.puzzles.map((q) => `#/p/${q}`)];
for (const h of pages) {
  errs = [];
  await p.goto("http://localhost:5179/" + h);
  await p.waitForTimeout(250);
  const issues = await p.evaluate(() => {
    const out = [];
    for (const svg of document.querySelectorAll("svg.static-math, .canvas svg")) {
      const box = svg.getBoundingClientRect();
      for (const t of svg.querySelectorAll("text, path.m-root")) {
        const r = t.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1)
          out.push(`"${t.textContent || "√"}" outside its ${svg.classList.contains("static-math") ? "goal" : "canvas"}`);
      }
    }
    if (document.querySelector(".canvas-error")) out.push("canvas crashed");
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push("page scrolls sideways");
    return [...new Set(out)];
  });
  if (errs.length || issues.length) console.log(h, [...new Set(errs)], issues);
}
// Phone width: home and a lesson.
await p.setViewportSize({ width: 375, height: 800 });
for (const h of ["#/", "#/c/fractions", "#/p/m4"]) {
  await p.goto("http://localhost:5179/" + h);
  await p.waitForTimeout(400);
  const side = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (side) console.log(h, "phone: page scrolls sideways");
  await p.screenshot({ path: `scripts/.out/qa-phone-${h.replace(/[#/]/g, "") || "home"}.png`, fullPage: false });
}
console.log("checked", pages.length, "pages");
await b.close();
