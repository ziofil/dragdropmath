/**
 * Settings, from the top bar: the theme, the language, numbers in colour,
 * debug mode (on the dev server only), and saving progress to a file (and loading it back). A panel
 * over the page, so what's on the page stays as it is while one is changed.
 */
import { TOOLS } from "./tools";
import { useEffect, useRef, useState } from "react";
import { setDebug, setLang, setNumbers, setSkin, SKINS, useSettings, type SkinId } from "./settings";
import { LANGS, t, type Lang } from "../i18n";
import { applyBackup, backupText, canStore, readBackup } from "../util/backup";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    // Closed by a click outside it, or Escape.
    const away = (e: PointerEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <div className="settings" ref={box}>
      <button className="button quiet settings-toggle" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((o) => !o)}>
        {t().settings}
      </button>
      {open && <SettingsPanel />}
    </div>
  );
}

function SettingsPanel() {
  const { skin, lang, numbers, debug } = useSettings();
  return (
    <section className="card settings-panel" role="dialog" aria-label={t().settings}>
      <label className="settings-row">
        <span>{t().skin}</span>
        <Pick value={skin} label={t().skin} options={SKINS.map((s) => [s.id, t().skins[s.id]])} onPick={(v) => setSkin(v as SkinId)} />
      </label>
      <label className="settings-row">
        <span>{t().language}</span>
        <Pick value={lang} label={t().language} options={LANGS.map((l) => [l.code, l.name])} onPick={(v) => setLang(v as Lang)} />
      </label>
      <label className="settings-row">
        <span>{t().numbersInColour}</span>
        <input type="checkbox" className="settings-numbers" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} />
      </label>
      {/* A tool for working on the app: on the dev server only (tools.ts). */}
      {TOOLS && (
        <label className="settings-row">
          <span>{t().debugMode}</span>
          <input type="checkbox" className="settings-debug" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
        </label>
      )}
      <ProgressBackup />
    </section>
  );
}

/** A setting's drop-down, as a quiet button (its arrow drawn by .pick: the select's own sits too far right). */
function Pick({ value, label, options, onPick }: { value: string; label: string; options: [string, string][]; onPick: (v: string) => void }) {
  return (
    <span className="pick">
      <select className="button quiet" value={value} onChange={(e) => onPick(e.target.value)} aria-label={label}>
        {options.map(([v, name]) => (
          <option key={v} value={v}>
            {name}
          </option>
        ))}
      </select>
    </span>
  );
}

/** Saving progress to a file and loading it back: it otherwise lives only in this browser. */
function ProgressBackup() {
  const [said, setSaid] = useState<string | null>(null);
  // A file read and waiting to be confirmed: loading it replaces the progress here.
  const [pending, setPending] = useState<ReturnType<typeof readBackup>>(null);
  const file = useRef<HTMLInputElement>(null);
  const save = () => {
    if (!canStore()) return setSaid(t().progressBlocked);
    const blob = new Blob([backupText()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dragdropmath-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setSaid(t().progressSaved);
  };
  const pick = async (f: File | undefined) => {
    if (!f) return;
    const b = readBackup(await f.text());
    setSaid(b ? null : t().progressNotABackup);
    setPending(b);
  };
  const load = () => {
    if (!pending) return;
    if (applyBackup(pending.entries) === null) {
      setPending(null);
      return setSaid(t().progressNoRoom);
    }
    // Everything reads its progress afresh.
    location.reload();
  };
  return (
    <div className="settings-backup">
      <p>{t().progressHere}</p>
      <div className="settings-backup-actions">
        <button onClick={save}>{t().saveProgress}</button>
        <button onClick={() => file.current?.click()}>{t().loadProgress}</button>
        <input
          ref={file}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {pending && (
        <div className="settings-backup-confirm" role="alertdialog" aria-label={t().loadProgress}>
          <p>{t().progressReplace(pending.saved ? new Date(pending.saved).toLocaleDateString() : "")}</p>
          <div className="settings-backup-actions">
            <button className="primary" onClick={load}>
              {t().progressLoadIt}
            </button>
            <button onClick={() => setPending(null)}>{t().cancel}</button>
          </div>
        </div>
      )}
      {said && (
        <p className="settings-backup-said" role="status">
          {said}
        </p>
      )}
    </div>
  );
}
