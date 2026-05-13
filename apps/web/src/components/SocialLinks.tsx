"use client";

import { SOCIAL_LINKS } from "@/lib/socials";
import { track } from "@/lib/analytics";

type SocialLinksProps = {
  /** Tailwind size classes for the icon container, e.g. "h-8 w-8". */
  className?: string;
  /** Tailwind size classes for the SVG itself. Default tightly hugs the wrapper. */
  iconClassName?: string;
  /** Optional override for the wrapper class (background, border, etc.). */
  wrapperClassName?: string;
  /** Optional override for the gap between icons. */
  gapClassName?: string;
};

const DEFAULT_WRAPPER =
  "w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-secondary transition-colors cursor-pointer border border-white/5";

export function SocialLinks({
  className,
  iconClassName = "w-4 h-4",
  wrapperClassName = DEFAULT_WRAPPER,
  gapClassName = "gap-4",
}: SocialLinksProps) {
  return (
    <div className={`flex ${gapClassName} ${className ?? ""}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(social.analyticsEvent)}
          className={wrapperClassName}
          title={social.name}
          aria-label={social.name}
        >
          <span className={`inline-flex ${iconClassName}`} aria-hidden>
            {social.icon}
          </span>
        </a>
      ))}
    </div>
  );
}
