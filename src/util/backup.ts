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

/**
 * Store what a backup file holds (its values replace the ones here; anything
 * not in it stays). Returns how many values were loaded, or null if the text
 * isn't a backup of this app.
 */
export function loadBackup(text: string): number | null {
  let b: unknown;
  try {
    b = JSON.parse(text);
  } catch {
    return null;
  }
  const ok = (x: unknown): x is Backup => {
    const v = x as Backup;
    return typeof v === "object" && v !== null && APPS.includes(v.app) && v.version === 1 && typeof v.data === "object" && v.data !== null;
  };
  if (!ok(b)) return null;
  const entries = Object.entries(b.data).filter(([k, v]) => OURS(k) && typeof v === "string");
  try {
    for (const [k, v] of entries) localStorage.setItem(k, v);
  } catch {
    return null;
  }
  return entries.length;
}
