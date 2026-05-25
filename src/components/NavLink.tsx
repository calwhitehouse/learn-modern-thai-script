"use client";

import Link, { useLinkStatus } from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  label: string;
  active: boolean;
};

function NavLinkPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <LoadingSpinner size="sm" className="ml-1.5 shrink-0" />;
}

export function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 transition-colors",
        active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100",
      )}
    >
      {label}
      <NavLinkPending />
    </Link>
  );
}
