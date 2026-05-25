import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/data";

export function AppFooter() {
  const hasLinks = FOOTER_LINKS.length > 0;

  return (
    <footer className="mt-auto border-t border-stone-200 bg-white/90">
      <div
        className={
          hasLinks
            ? "mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-6 text-sm text-stone-500 sm:flex-row sm:justify-between"
            : "mx-auto max-w-lg px-4 py-6 text-center text-sm text-stone-500"
        }
      >
        <p>Built by Callum Whitehouse</p>
        {hasLinks ? (
          <nav
            className="flex flex-wrap justify-center gap-x-4 gap-y-1"
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
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
