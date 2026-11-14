/**
 * This viewer's stored values. Per-viewer convenience only: storage can be
 * missing or blocked, and what's there can be unreadable or of the wrong
 * shape (an older version, a hand edit), so reads fall back and writes may
 * quietly do nothing.
 */

/** The value stored under `key`, if it reads and has the right shape; else `fallback`. */
export function readJson<T>(key: string, fallback: T, ok: (v: unknown) => boolean): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const v: unknown = JSON.parse(raw);
    return ok(v) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Store `value` under `key` (nothing happens when storage is unavailable). */
export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: it just won't persist */
  }
}

/** A plain object (not null, not a list). */
export const isRecord = (v: unknown): boolean => typeof v === "object" && v !== null && !Array.isArray(v);
/** A list of strings. */
export const isStrings = (v: unknown): boolean => Array.isArray(v) && v.every((x) => typeof x === "string");
