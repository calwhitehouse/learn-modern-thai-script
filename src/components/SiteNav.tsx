"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/NavLink";
import { useNavigationLoading } from "@/components/NavigationLoading";
import type { NavItem } from "@/lib/data";
import { cn } from "@/lib/cn";
import { signOut } from "@/app/actions/auth";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6 text-stone-800"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SiteNavProps = {
  items: readonly NavItem[];
  showSignOut?: boolean;
};

export function SiteNav({ items, showSignOut = false }: SiteNavProps) {
  const pathname = usePathname();
  const startNavigation = useNavigationLoading();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="app-container flex flex-col gap-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            onClick={() => startNavigation?.()}
            className="inline-flex min-w-0 flex-1 items-center"
          >
            <img
              src="/learn-modern-thai-script-logo.png"
              alt="Learn Modern Thai Script"
              width={300}
              height={100}
              className="h-11 w-auto max-w-[min(100%,20rem)] object-contain object-left"
            />
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="app-nav-burger items-center justify-center rounded-lg p-1.5 text-stone-800 hover:bg-stone-100"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon open={menuOpen} />
            </button>

            {showSignOut ? (
              <form action={signOut} className="app-nav-auth-desktop">
                <button
                  type="submit"
                  className="text-xs text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
                >
                  Sign out
                </button>
              </form>
            ) : null}
          </div>
        </div>

        <nav
          className="app-nav-desktop gap-1 pb-1 text-sm"
          aria-label="Main"
        >
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={isNavActive(pathname, item.href)}
            />
          ))}
        </nav>

        <nav
          id="mobile-nav-menu"
          className={cn(
            "app-nav-mobile-panel border-t border-stone-200 pt-3",
            menuOpen && "is-open",
          )}
          aria-label="Main"
        >
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={isNavActive(pathname, item.href)}
              layout="stack"
              onNavigate={closeMenu}
            />
          ))}
          {showSignOut ? (
            <form
              action={signOut}
              className="app-nav-auth-mobile mt-2 border-t border-stone-200 pt-2"
            >
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2.5 text-left text-base text-stone-600 hover:bg-stone-100"
              >
                Sign out
              </button>
            </form>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
