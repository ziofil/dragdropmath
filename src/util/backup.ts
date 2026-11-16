/**
 * Progress lives only in this browser (localStorage): clearing it, or moving
 * to another device, loses it. A backup is everything the app stored, as one
 * file to keep and load back later.
 */

/** What a backup file is: tagged, so loading something else is caught. */
type Backup = { app: typeof APP; version: 1; saved: string; data: Record<string, string> };
const APP = "dragdropmath";
/** The site's earlier name: its backups still load. */
const APPS: string[] = [APP, "math-by-hand"];

/** The app's own keys (older ones from when it had another name too); not the debug switch. */
const OURS = (key: string) => (key.startsWith("mathbyhand.") || key.startsWith("graspable.")) && key !== "mathbyhand.debug";

/** Everything stored, as the text of a backup file. */
export function backupText(now = new Date()): string {
  const data: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = key && localStorage.getItem(key);
      if (key && OURS(key) && value !== null) data[key] = value;
    }
  } catch {
    /* storage unavailable: an empty backup */
  }
  const backup: Backup = { app: APP, version: 1, saved: now.toISOString(), data };
  return JSON.stringify(backup, null, 1);
}

/** Can this browser keep anything for the site (not in some private modes, or with storage blocked)? */
export function canStore(): boolean {
  try {
    localStorage.setItem("mathbyhand.probe", "1");
    localStorage.removeItem("mathbyhand.probe");
    return true;
  } catch {
    return false;
  }
}

/** A backup file read: what it holds and when it was saved, or null if it isn't one of this app's (or is damaged). */
export function readBackup(text: string): { saved: string; entries: [string, string][] } | null {
  let b: unknown;
  try {
    b = JSON.parse(text);
  } catch {
    return null;
  }
  const v = b as Backup;
  if (typeof v !== "object" || v === null || !APPS.includes(v.app) || v.version !== 1 || typeof v.data !== "object" || v.data === null || Array.isArray(v.data)) return null;
  const entries = Object.entries(v.data).filter(([k]) => OURS(k));
  // Every value the app stores is JSON: one that isn't means the file was damaged or edited.
  for (const [, value] of entries) {
    if (typeof value !== "string") return null;
    try {
      JSON.parse(value);
    } catch {
      return null;
    }
  }
  return { saved: typeof v.saved === "string" ? v.saved : "", entries: entries as [string, string][] };
}

/**
 * Store what a backup holds (its values replace the ones here; anything not
 * in it stays), all or nothing: if storing fails partway (the browser's room
 * runs out), what was there is put back. Returns how many values were loaded,
 * or null if nothing could be stored.
 */
export function applyBackup(entries: [string, string][]): number | null {
  const before = new Map<string, string | null>();
  try {
    for (const [k] of entries) before.set(k, localStorage.getItem(k));
    for (const [k, v] of entries) localStorage.setItem(k, v);
    return entries.length;
  } catch {
    try {
      for (const [k, v] of before) {
        if (v === null) localStorage.removeItem(k);
        else localStorage.setItem(k, v);
      }
    } catch {
      /* storage unavailable: nothing more can be done */
    }
    return null;
  }
}

/** Read a backup and store it (see readBackup, applyBackup): how many values, or null. */
export function loadBackup(text: string): number | null {
  const b = readBackup(text);
  return b ? applyBackup(b.entries) : null;
}
