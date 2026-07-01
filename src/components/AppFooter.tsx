import Link from "next/link";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { FOOTER_LINKS } from "@/lib/data";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white/90">
      <div className="app-container py-6 text-center text-sm text-stone-500">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
          aria-label="Footer"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline"
            >
              {link.label}
            </Link>
          ))}
          <CookieSettingsLink />
        </nav>
      </div>
    </footer>
  );
}
