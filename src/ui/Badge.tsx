import type { Chapter } from "../game/puzzles";
import { badgeTier, TIER_NAMES, toNextTier, type Tier } from "../game/scoring";

/** A chapter's badge: a small medal with the chapter's number, coloured by how far it's earned (faint until then). */
export function Badge({ tier, n, size = 28, title }: { tier: Tier; n: number; size?: number; title?: string }) {
  const r = size / 2;
  return (
    <svg
      className={`badge badge-${tier ? TIER_NAMES[tier] : "none"}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={title ?? (tier ? `${TIER_NAMES[tier]} badge` : "badge not earned yet")}
    >
      {title && <title>{title}</title>}
      <circle className="badge-rim" cx={r} cy={r} r={r - 1} />
      <circle className="badge-face" cx={r} cy={r} r={r - 1 - size / 9} />
      <text className="badge-num" x={r} y={r} dominantBaseline="central" textAnchor="middle" fontSize={size * 0.42}>
        {n}
      </text>
    </svg>
  );
}

/** "bronze" → "Bronze". */
export const tierName = (t: Tier) => TIER_NAMES[t].charAt(0).toUpperCase() + TIER_NAMES[t].slice(1);

/** Where the chapter's badge stands, and what the next step takes. */
export function BadgeNote({ chapter, solved }: { chapter: Chapter; solved: ReadonlySet<string> }) {
  const tier = badgeTier(chapter, solved);
  const more = toNextTier(chapter, solved);
  const plural = (k: number) => `${k} more exercise${k === 1 ? "" : "s"}`;
  if (tier === 3) return <span className="badge-note">Gold badge. Every exercise solved.</span>;
  return (
    <span className="badge-note">
      {tier > 0 ? `${tierName(tier)} badge. ` : ""}
      {plural(more)} for {TIER_NAMES[tier + 1]}.
    </span>
  );
}
