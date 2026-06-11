import type { TrustpilotSummary } from "@/lib/trustpilot";

/**
 * Trustpilot's official star colour for a given rating (rounded to the
 * nearest whole star), so our badge reads as authentically Trustpilot.
 */
function starColor(stars: number): string {
  const rounded = Math.round(stars);
  if (rounded <= 1) return "#ff3722";
  if (rounded === 2) return "#ff8622";
  if (rounded === 3) return "#ffce00";
  if (rounded === 4) return "#73cf11";
  return "#00b67a";
}

export const TRUSTPILOT_STAR_PATH =
  "M12 0l3.09 9.5h9.91l-8.09 5.88 3.09 9.5-8.09-5.88-8.09 5.88 3.09-9.5L0 9.5h9.91z";

/** A single Trustpilot-style star tile, filled `fill` (0–1) with `color`. */
function StarTile({
  fill,
  color,
  size,
}: {
  fill: number;
  color: string;
  size: number;
}) {
  const clamped = Math.max(0, Math.min(1, fill));
  return (
    <span
      className="relative inline-block"
      style={{ width: size, height: size, background: "#dcdce6" }}
      aria-hidden="true"
    >
      <span
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${clamped * 100}%`, background: color }}
      />
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 m-auto"
        style={{ width: size * 0.64, height: size * 0.64 }}
        fill="white"
      >
        <path d={TRUSTPILOT_STAR_PATH} />
      </svg>
    </span>
  );
}

/** The five Trustpilot star tiles for a given rating. Reusable. */
export function TrustpilotStars({
  stars,
  size = 22,
  gap = 4,
}: {
  stars: number;
  size?: number;
  gap?: number;
}) {
  const color = starColor(stars);
  return (
    <span className="flex items-center" style={{ gap }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarTile key={i} fill={stars - i} color={color} size={size} />
      ))}
    </span>
  );
}

type TrustpilotScoreProps = {
  data: TrustpilotSummary;
  /** "light" for white backgrounds, "dark" for the footer. */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * On-brand Trustpilot score badge: the Trustpilot wordmark, live star
 * rating, TrustScore and review count. Links to the public profile.
 * Pure presentational — safe in both server and client component trees.
 */
export function TrustpilotScore({
  data,
  variant = "light",
  className,
}: TrustpilotScoreProps) {
  const isDark = variant === "dark";
  const textColor = isDark ? "text-white" : "text-brand-midnight";
  const subColor = isDark ? "text-white/60" : "text-brand-midnight/60";

  return (
    <a
      href={data.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`Coast Competitions is rated ${data.starsString} ${data.trustScore} out of 5 on Trustpilot`}
      className={`inline-flex flex-col gap-1.5 ${className ?? ""}`}
    >
      <span className={`flex items-center gap-1.5 font-extrabold tracking-tight ${textColor}`}>
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" style={{ color: "#00b67a" }} fill="currentColor" aria-hidden="true">
          <path d={TRUSTPILOT_STAR_PATH} />
        </svg>
        <span className="text-[0.95rem]">Trustpilot</span>
      </span>

      <TrustpilotStars stars={data.stars} />

      <span className={`text-xs font-semibold ${subColor}`}>
        {data.starsString ? `${data.starsString} · ` : ""}
        <span className={textColor}>TrustScore {data.trustScore.toFixed(1)}</span>
        {" · "}
        {data.numberOfReviews.toLocaleString("en-GB")}{" "}
        {data.numberOfReviews === 1 ? "review" : "reviews"}
      </span>
    </a>
  );
}
