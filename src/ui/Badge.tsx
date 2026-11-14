import type { Chapter } from "../game/puzzles";
import { badgeTier, TIER_NAMES, toNextTier, type Progress, type Tier } from "../game/scoring";
import { t } from "../i18n";

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
      aria-label={title ?? (tier ? t().tierBadge(tier) : t().badgeNotEarned)}
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

/** Where the chapter's badge stands, and what the next step takes. */
export function BadgeNote({ chapter, progress }: { chapter: Chapter; progress: Progress }) {
  const tier = badgeTier(chapter, progress);
  const next = toNextTier(chapter, progress);
  if (tier === 3 || !next) return <span className="badge-note">{t().goldNote}</span>;
  return <span className="badge-note">{t().badgeNote(tier as 0 | 1 | 2, next.more)}</span>;
}
