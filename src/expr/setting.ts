/** A board's setting (see Setting in types.ts): read it, carry it over, assume things about letters. */
import { SETTING_KEYS, type MathState, type Setting } from "./types";

/** The setting of a board, without the keys it leaves unset. */
export function settingOf(s: MathState): Setting {
  const out: Setting = {};
  for (const k of SETTING_KEYS) if (s[k] !== undefined) (out as Record<string, unknown>)[k] = s[k];
  return out;
}

/** `next` in the setting of `from`, except where `next` sets its own. */
export const inSetting = (next: MathState, from: MathState): MathState => ({ ...settingOf(from), ...next });

/** `s` with its letters standing for positive numbers, when `positive`. */
export const assuming = <S extends MathState>(s: S, positive: boolean | undefined): S => (positive ? { ...s, letters: "positive" } : s);
