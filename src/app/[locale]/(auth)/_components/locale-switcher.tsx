"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-sm">
      <Globe className="size-4 text-muted-foreground" />
      <span className="flex gap-1">
        {routing.locales.map((loc) => (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            prefetch={false}
            className={
              locale === loc
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {loc === "en" ? "ENG" : loc.toUpperCase()}
          </Link>
        ))}
      </span>
    </div>
  );
}
