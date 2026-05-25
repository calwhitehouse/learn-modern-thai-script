"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/NavLink";
import { NAV_ITEMS } from "@/lib/data";
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

export function AppNav() {
  const pathname = usePathname();
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
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-stone-900"
          >
            Learn Modern Thai Script
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

            <form action={signOut}>
              <button
                type="submit"
                className="text-xs text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <nav
          className="app-nav-desktop gap-1 overflow-x-auto pb-1 text-sm"
          aria-label="Main"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <NavLink key={item.href} href={item.href} label={item.label} active={active} />
            );
          })}
        </nav>

        <nav
          id="mobile-nav-menu"
          className={cn(
            "app-nav-mobile-panel border-t border-stone-200 pt-3",
            menuOpen && "is-open",
          )}
          aria-label="Main"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={active}
                layout="stack"
                onNavigate={closeMenu}
              />
            );
          })}
        </nav>
      </div>
    </header>
  );
}
