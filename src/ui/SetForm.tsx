/**
 * The set maker's form: a set made without writing YAML. Its title, the moves
 * it allows, and its exercises, typed in or made from a chapter's practice
 * (a level, how many). The YAML stays the one source (the form reads it and
 * writes it back, keeping its comments and whatever else it holds: wrong
 * answers, hints), so either view can be used, and switched between.
 */
import { useState } from "react";
import { isMap, isSeq, parseDocument, type Document } from "yaml";
import { CHAPTERS } from "../game/puzzles";
import { freshSeed, LEVELS, type Level } from "../game/generate/practice";
import { makeExercise, type MakeRequest } from "../game/exerciseWorker";
import { workerClient } from "../util/worker";
import { chapterText, t } from "../i18n";

/** Practice's exercises, made off the page's thread (a Hard one takes a moment). */
const make = workerClient(() => new Worker(new URL("../game/exerciseWorker.ts", import.meta.url), { type: "module" }), makeExercise, 30_000);

type Row = { start: string; goal: string };

/** What the form shows of the YAML, or null when it can't be read as a set. */
function read(text: string): { doc: Document; title: string; moves: string; rows: Row[] } | null {
  const doc = parseDocument(text);
  if (doc.errors.length) return null;
  const top = doc.contents;
  if (top !== null && !isMap(top)) return null;
  const list = doc.get("exercises");
  if (list !== undefined && list !== null && !isSeq(list)) return null;
  const s = (v: unknown) => (v === undefined || v === null ? "" : String(v));
  const rows = isSeq(list) ? list.items.map((item) => (isMap(item) ? { start: s(item.get("start")), goal: s(item.get("goal")) } : { start: "", goal: "" })) : [];
  return { doc, title: s(doc.get("title")), moves: s(doc.get("moves")), rows };
}

export function SetForm({ text, onText }: { text: string; onText: (text: string) => void }) {
  const f = t().form;
  const now = read(text);
  const [from, setFrom] = useState<{ chapter: string; level: Level; count: number }>({ chapter: CHAPTERS[0].id, level: "easy", count: 5 });
  const [making, setMaking] = useState(false);
  if (!now) return <p className="maker-problem">{f.cantRead}</p>;
  const { doc } = now;

  /** Change the YAML through its document, so its comments and other fields stay. */
  const change = (edit: (d: Document) => void) => {
    const d = doc.clone();
    edit(d);
    onText(String(d));
  };
  /** A field set; `optional` ones go when emptied (an exercise's start and goal stay, empty, while typed). */
  const setField = (path: (string | number)[], value: string, optional = false) =>
    change((d) => {
      if (optional && value === "") d.deleteIn(path);
      else d.setIn(path, value);
    });
  const add = (rows: { start: string; goal: string; moves?: string }[]) =>
    change((d) => {
      if (!isSeq(d.get("exercises"))) d.set("exercises", d.createNode([]));
      for (const r of rows) d.addIn(["exercises"], d.createNode(r));
    });
  const addMade = async () => {
    setMaking(true);
    try {
      const made = await Promise.all(Array.from({ length: from.count }, () => make({ mode: "practice", chapter: from.chapter, level: from.level, seed: freshSeed() } satisfies MakeRequest)));
      // An exercise keeps its chapter's moves when the set allows others.
      const own = now.moves === from.chapter ? {} : { moves: from.chapter };
      add(made.flatMap((m) => (m ? [{ start: m.start, goal: m.goal, ...own }] : [])));
    } finally {
      setMaking(false);
    }
  };

  return (
    <div className="set-form">
      <label className="set-form-field">
        <span>{f.title}</span>
        <input value={now.title} onChange={(e) => setField(["title"], e.target.value, true)} placeholder={t().set.defaultTitle} />
      </label>
      <label className="set-form-field">
        <span>{f.moves}</span>
        <select value={CHAPTERS.some((c) => c.id === now.moves) ? now.moves : now.moves ? "?" : ""} onChange={(e) => setField(["moves"], e.target.value, true)}>
          <option value="">{f.allMoves}</option>
          {CHAPTERS.map((c, i) => (
            <option key={c.id} value={c.id}>
              {f.upTo(i + 1, chapterText(c).title)}
            </option>
          ))}
          {now.moves && !CHAPTERS.some((c) => c.id === now.moves) && (
            <option value="?" disabled>
              {now.moves}
            </option>
          )}
        </select>
      </label>

      <ol className="set-form-rows">
        {now.rows.map((r, i) => (
          <li key={i} className="set-form-row">
            <input value={r.start} onChange={(e) => setField(["exercises", i, "start"], e.target.value)} placeholder="2x + 3 = 11" aria-label={f.start(i + 1)} />
            <span aria-hidden="true">→</span>
            <input value={r.goal} onChange={(e) => setField(["exercises", i, "goal"], e.target.value)} placeholder="x = 4" aria-label={f.goal(i + 1)} />
            <button className="quiet" onClick={() => change((d) => d.deleteIn(["exercises", i]))} aria-label={f.remove(i + 1)} title={f.remove(i + 1)}>
              ×
            </button>
          </li>
        ))}
      </ol>
      <div className="set-form-actions">
        <button onClick={() => add([{ start: "", goal: "" }])}>{f.addOne}</button>
      </div>

      <fieldset className="set-form-made">
        <legend>{f.fromChapter}</legend>
        <select value={from.chapter} onChange={(e) => setFrom({ ...from, chapter: e.target.value })} aria-label={f.chapter}>
          {CHAPTERS.map((c, i) => (
            <option key={c.id} value={c.id}>
              {i + 1}. {chapterText(c).title}
            </option>
          ))}
        </select>
        <select value={from.level} onChange={(e) => setFrom({ ...from, level: e.target.value as Level })} aria-label={f.level}>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {t().level[l]}
            </option>
          ))}
        </select>
        <input type="number" min={1} max={20} value={from.count} onChange={(e) => setFrom({ ...from, count: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })} aria-label={f.howMany} />
        <button onClick={addMade} disabled={making}>
          {making ? f.making : f.addMade(from.count)}
        </button>
      </fieldset>
    </div>
  );
}
