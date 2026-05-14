import Link from "next/link";
import {
  JsonLd,
  buildBreadcrumbSchema,
  type BreadcrumbItem,
} from "@/lib/seo/json-ld";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "light" | "dark";
};

// Server component: renders both the visible breadcrumb trail and the
// BreadcrumbList JSON-LD. The "Home" item is prepended automatically so
// callers only pass the trail below the homepage.
export function Breadcrumbs({
  items,
  className,
  variant = "light",
}: BreadcrumbsProps) {
  const fullTrail: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...items,
  ];

  const isDark = variant === "dark";
  const baseColor = isDark ? "text-white/55" : "text-brand-midnight/55";
  const activeColor = isDark ? "text-white" : "text-brand-midnight";
  const separatorColor = isDark ? "text-white/25" : "text-brand-midnight/25";
  const linkHover = isDark ? "hover:text-white" : "hover:text-brand-primary";

  return (
    <>
      <JsonLd
        id={`schema-breadcrumb-${fullTrail.map((i) => i.label).join("-").toLowerCase().replace(/[^a-z0-9-]/g, "-")}`}
        schema={buildBreadcrumbSchema(fullTrail)}
      />
      <nav
        aria-label="Breadcrumb"
        className={["text-xs font-bold uppercase tracking-widest", className]
          .filter(Boolean)
          .join(" ")}
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {fullTrail.map((item, index) => {
            const isLast = index === fullTrail.length - 1;
            return (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={`${baseColor} ${linkHover} transition-colors`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? activeColor : baseColor}
                  >
                    {item.label}
                  </span>
                )}
                {!isLast ? (
                  <span aria-hidden="true" className={separatorColor}>
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
