import type { TrustpilotSummary } from "@/lib/trustpilot";
import { TRUSTPILOT_STAR_PATH, TrustpilotStars } from "@/components/TrustpilotScore";

/**
 * A thin, full-width Trustpilot trust strip: just the Trustpilot logo and
 * the live star boxes (no score text). Sits between the nav bar and the
 * hero so it's the first thing visitors see. Links to the public profile.
 */
export function TrustpilotBanner({ data }: { data: TrustpilotSummary }) {
  return (
    <a
      href={data.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`Coast Competitions is rated ${data.starsString} ${data.trustScore} out of 5 on Trustpilot`}
      className="flex w-full items-center justify-center gap-2.5 border-b border-black/5 bg-white py-2.5"
    >
      <span className="flex items-center gap-1.5 font-extrabold tracking-tight text-brand-midnight">
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          style={{ color: "#00b67a" }}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={TRUSTPILOT_STAR_PATH} />
        </svg>
        <span className="text-[0.95rem]">Trustpilot</span>
      </span>
      <TrustpilotStars stars={data.stars} size={20} />
    </a>
  );
}
