"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/data";
import { cn } from "@/lib/cn";
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
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 transition-colors",
                  active
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
