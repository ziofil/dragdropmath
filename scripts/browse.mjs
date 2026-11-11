// Drive the real app in Chrome: node scripts/browse.mjs <hash> [steps.json]
// steps: [{ "drag": [fromText, nth, toText, nth, dx?, dy?, grabDx?, grabDy?] } | { "tap": [text, nth] } | { "wait": ms } | { "shot": name }]
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";

const [hash, stepsFile] = process.argv.slice(2);
const steps = stepsFile ? JSON.parse(readFileSync(stepsFile, "utf8")) : [];
const out = "scripts/.out";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && console.log(`[console.${m.type()}]`, m.text().slice(0, 400)));
page.on("pageerror", (e) => console.log("[pageerror]", e.message.slice(0, 400)));
await page.goto(`http://localhost:5179/${hash}`);
await page.waitForTimeout(800);

const glyphs = () =>
  page.$$eval(".board .canvas svg text", (ts) =>
    ts
      .map((t) => {
        const r = t.getBoundingClientRect();
        const op = Number(getComputedStyle(t).opacity) * Number(t.closest("g[opacity]")?.getAttribute("opacity") ?? 1);
        return { text: t.textContent, x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, op };
      })
      .filter((g) => g.w > 0 && g.op > 0.05),
  );
const show = async () => console.log("  board:", (await glyphs()).map((g) => g.text).join(" "));
const find = async (text, nth) => {
  const gs = (await glyphs()).filter((g) => g.text === text);
  if (!gs[nth]) throw new Error(`no ${text}#${nth}: ${(await glyphs()).map((g) => g.text).join(" ")}`);
  return gs[nth];
};

await show();
for (const s of steps) {
  if (s.wait) await page.waitForTimeout(s.wait);
  if (s.shot) await page.screenshot({ path: `${out}/${s.shot}.png` });
  if (s.tap) {
    const g = await find(s.tap[0], s.tap[1] ?? 0);
    await page.mouse.click(g.x, g.y);
    await page.waitForTimeout(700);
    console.log(`tap ${s.tap[0]}`);
    await show();
  }
  if (s.drag) {
    const [a, an, b, bn, dx = 0, dy = 0, gdx = 0, gdy = 0] = s.drag;
    const g0 = await find(a, an);
    const g = { x: g0.x + gdx, y: g0.y + gdy };
    const t = await find(b, bn);
    await page.mouse.move(g.x, g.y);
    await page.mouse.down();
    const n = 20;
    for (let i = 1; i <= n; i++) await page.mouse.move(g.x + ((t.x + dx - g.x) * i) / n, g.y + ((t.y + dy - g.y) * i) / n);
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(900);
    console.log(`drag ${a}#${an} → ${b}#${bn}`);
    await show();
  }
}
await browser.close();
