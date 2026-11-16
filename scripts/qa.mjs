// QA sweep against the dev server: open every page; report crashes, console
// errors and maths drawn outside its box; then walk through what once broke
// (each check says which bug it pins). Phone screenshots go to scripts/.out/.
//   npx vite --port 5179 &   then   node scripts/qa.mjs      (QA_PORT=… for another port)
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
mkdirSync("scripts/.out", { recursive: true });
const BASE = `http://localhost:${process.env.QA_PORT ?? 5179}/`;
const b = await chromium.launch({ channel: "chrome", headless: true });
const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
let errs = [];
let failed = 0;
p.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 200)));
p.on("console", (m) => m.type() === "error" && errs.push("console: " + m.text().slice(0, 200)));
p.on("response", (r) => r.status() === 404 && !r.url().endsWith("/favicon.ico") && errs.push("404: " + r.url()));
const check = (what, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${what}${ok || !detail ? "" : `: ${detail}`}`);
};
const go = async (h, wait = 300) => {
  await p.goto(BASE + h);
  await p.waitForTimeout(wait);
};
const reload = async () => {
  await p.reload();
  await p.waitForTimeout(500);
};
const fresh = async () => {
  await go("#/");
  await p.evaluate(() => localStorage.clear());
};

await go("#/", 800);
const chapters = await p.evaluate(async () => (await import("/src/game/puzzles.ts")).CHAPTERS.map((c) => c.id));
const exercises = chapters.flatMap((c) => ["easy", "medium", "hard"].flatMap((l) => [1, 2, 3].flatMap((seed) => [`#/practice/${c}/${l}/${seed}`, `#/predict/${c}/${l}/${seed}`])));
// Odd links: earlier forms (still working), and broken ones (a page that says so).
const odd = ["#/moves/fractions", "#/test/fractions/easy/1", "#/c/fractions/test", "#/c/nope", "#/practice/nope/easy/1", "#/practice/fractions/nope/1", "#/set/garbage", "#/set/garbage/3", "#/at/nope", "#/whatever"];
const pages = ["#/", "#/sandbox", "#/sets/new", ...chapters.map((c) => `#/c/${c}`), ...exercises, ...odd];
for (const h of pages) {
  errs = [];
  await go(h, 250);
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
    if (!document.querySelector("main")) out.push("nothing shown");
    return [...new Set(out)];
  });
  if (errs.length || issues.length) {
    failed++;
    console.log("FAIL", h, [...new Set(errs)], issues);
  }
}
console.log("checked", pages.length, "pages");
errs = [];

// ---------- what once broke ----------

const boardTop = () => p.evaluate(() => Math.round(document.querySelector(".board .canvas").getBoundingClientRect().top + scrollY));
const actionsTop = () => p.evaluate(() => Math.round(document.querySelector(".board-actions").getBoundingClientRect().top + scrollY));
const said = () => p.evaluate(() => document.querySelector(".board-status")?.textContent ?? "");
/** The run at balance, easy (the mind's eye). */
const easyScore = () => p.evaluate(() => JSON.parse(localStorage.getItem("mathbyhand.score.v1") ?? "{}").easy ?? 0);
const scoreAt = (n) => p.evaluate((n) => localStorage.setItem("mathbyhand.score.v1", JSON.stringify({ easy: n, medium: 0, hard: 0 })), n);
const cards = () => p.$$("button.predict-choice");
/** On a chapter's predict exercise: which card is right (by its maths, as the card labels it). */
const rightCard = () =>
  p.evaluate(async () => {
    const [, , chapter, level, seed] = location.hash.split("/");
    const goal = (await import("/src/game/generate/practice.ts")).practiceExercise(chapter, level, Number(seed)).goal;
    const { parseState } = await import("/src/expr/parse.ts");
    const { printState } = await import("/src/expr/key.ts");
    const label = printState(parseState(goal)).replace(/\*/g, "·");
    return [...document.querySelectorAll("button.predict-choice svg")].findIndex((s) => s.getAttribute("aria-label") === label);
  });

for (const [w, h] of [[375, 800], [1100, 900]]) {
  await p.setViewportSize({ width: w, height: h });
  // Bug 5: answering moves nothing (the board, its buttons).
  await fresh();
  await go("#/predict/balance/easy/7", 500);
  const [b0, a0] = [await boardTop(), await actionsTop()];
  await (await cards())[0].click();
  await p.waitForTimeout(200);
  check(`${w}px: answering moves neither the board nor its buttons (bug 5)`, b0 === (await boardTop()) && a0 === (await actionsTop()), `${b0}/${a0} → ${await boardTop()}/${await actionsTop()}`);
  await fresh();
  await go("#/predict/balance/easy/7", 500);
  await p.click("text=Reveal");
  await p.waitForTimeout(200);
  check(`${w}px: revealing moves neither the board nor its buttons (bug 5)`, b0 === (await boardTop()) && a0 === (await actionsTop()));
}

// Bugs 1, 2, 4: a reveal is kept; after it, no prompt without cards, and it takes one off the score.
await fresh();
await scoreAt(9);
await go("#/predict/balance/easy/7", 500);
await p.click("text=Reveal");
await p.waitForTimeout(150);
check("after Reveal: no 'predict first' without cards (bugs 1, 4)", !(await said()).includes("Pick an answer"));
check("after Reveal: the Easy score goes down by 1", (await easyScore()) === 8 && (await said()).includes("Easy score: 8 (−1)"), await said());
await reload();
check("Reveal, reload: the cards stay answered, the score not taken again (bug 2)", (await cards()).length === 0 && (await said()).includes("green one") && (await easyScore()) === 8);
// A wrong pick: one down; a right one: one up, once.
await scoreAt(9);
await go("#/predict/balance/easy/8", 500);
await (await cards())[((await rightCard()) + 1) % 3].click();
await p.waitForTimeout(150);
check("a wrong pick: the score down by 1", (await easyScore()) === 8);
await scoreAt(9);
await go("#/predict/balance/easy/9", 500);
const rightAt = await rightCard();
if (rightAt >= 0) {
  await (await cards())[rightAt].click();
  await p.waitForTimeout(150);
  check("a right pick: the score up by 1, said", (await easyScore()) === 10 && (await said()).includes("Easy score: 10 (+1)"), await said());
  await reload();
  check("…and a reload doesn't count it again (bug 3)", (await easyScore()) === 10);
} else check("found the right card by its maths", false);
// The score is never below 0.
await scoreAt(0);
await go("#/predict/balance/easy/11", 500);
await p.click("text=Reveal");
await p.waitForTimeout(150);
check("at 0, a reveal leaves the score at 0", (await easyScore()) === 0);

// Bug 6: switching skin keeps work in progress (and doesn't ask the prediction again).
await go("#/sandbox", 400);
await p.fill(".sandbox-form input", "3x = 12");
await p.selectOption(".topbar-pick select", "codex");
await p.waitForTimeout(600);
check("switching skin keeps what's typed (bug 6)", (await p.inputValue(".sandbox-form input")) === "3x = 12");
await fresh();
await go("#/predict/balance/medium/3", 500);
await (await cards())[0].click();
await p.selectOption(".topbar-pick select", "neon");
await p.waitForTimeout(600);
check("switching skin mid-exercise doesn't ask again (bug 3)", (await cards()).length === 0);
await p.selectOption(".topbar-pick select", "classic");

// The three ways into a chapter start from its node on the path: the lesson, practice, the mind's eye.
await p.setViewportSize({ width: 1100, height: 900 });
await go("#/at/balance", 600);
const panelLinks = await p.$$eval(".path-panel .panel-mode a", (as) => as.map((a) => a.getAttribute("href")));
check(
  "the path panel leads to the lesson, practice and the mind's eye",
  panelLinks[0] === "#/c/balance" && panelLinks.slice(1, 4).every((h) => h.startsWith("#/practice/balance/")) && panelLinks.slice(4, 7).every((h) => h.startsWith("#/predict/balance/")),
  panelLinks.join(" "),
);
await go("#/c/balance/practice", 400);
check("an old link to a chapter's practice opens its node on the path", (await p.evaluate(() => location.hash)) === "#/at/balance");
await go("#/test/roots/hard/1", 300);
check("an old link opens as it's written now", (await p.evaluate(() => location.hash)) === "#/predict/roots/hard/1");
await go("#/whatever", 300);
check("an unknown address says so", (await p.textContent("main h1")).length > 0 && !(await p.$(".path")));

// Bug 8: a set maker's ✓ isn't drawn as a badge mark.
await go("#/sets/new", 300);
await p.click(".maker-actions >> nth=1 >> button.primary");
await p.waitForTimeout(300);
const markStyle = await p.$eval(".maker-mark", (m) => getComputedStyle(m).borderStyle);
check("the set maker's ✓ has no dashed pill (bug 8)", markStyle === "none");

// Bug 9: every skin draws every framed box and every button the same way.
for (const skin of ["classic", "codex", "paper", "neon"]) {
  await p.selectOption(".topbar-pick select", skin);
  await p.waitForTimeout(400);
  for (const [h, sels] of [["#/", [".scores", ".path-card", ".path-panel", ".home-sandbox"]], ["#/predict/balance/easy/3", [".predict-choice"]]]) {
    await go(h, 400);
    const looks = await p.evaluate((sels) => sels.flatMap((s) => [...document.querySelectorAll(s)].map((e) => { const c = getComputedStyle(e); return `${c.borderTopWidth} ${c.borderLeftWidth} ${c.borderTopStyle}`; })), sels);
    check(`${skin}: ${h} frames alike`, new Set(looks).size <= 1, looks.join(", "));
  }
  await go("#/sets/new", 300);
  const radii = await p.$$eval(".topbar .button, .maker-actions button, .topbar-pick select", (bs) => [...new Set(bs.map((b) => getComputedStyle(b).borderTopLeftRadius))]);
  check(`${skin}: buttons share one corner`, radii.length === 1, radii.join(", "));
}
await p.selectOption(".topbar-pick select", "classic");
if (errs.length) {
  failed++;
  console.log("FAIL console during the checks:", [...new Set(errs)]);
}

// Phone width: no sideways scrolling; a few screenshots.
await p.setViewportSize({ width: 320, height: 700 });
for (const h of ["#/", "#/sets/new", "#/sandbox", ...chapters.map((c) => `#/c/${c}`), ...chapters.map((c) => `#/predict/${c}/hard/1`)]) {
  await go(h, 400);
  const side = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (side) {
    failed++;
    console.log("FAIL", h, "phone: page scrolls sideways");
  }
  if (["#/", "#/c/fractions", "#/predict/roots/hard/1"].includes(h)) await p.screenshot({ path: `scripts/.out/qa-phone-${h.replace(/[#/]/g, "") || "home"}.png` });
}
console.log(failed ? `${failed} failed` : "all good");
await b.close();
process.exit(failed ? 1 : 0);
