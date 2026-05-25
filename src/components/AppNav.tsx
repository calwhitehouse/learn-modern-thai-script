"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/NavLink";
import { NAV_ITEMS } from "@/lib/data";
import { signOut } from "@/app/actions/auth";

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight text-stone-900">
            Learn Modern Thai Script
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <NavLink key={item.href} href={item.href} label={item.label} active={active} />
            );
          })}
        </nav>
      </div>
    </header>
  );
}
