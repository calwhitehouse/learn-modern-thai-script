"use client";

import Link, { useLinkStatus } from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  label: string;
  active: boolean;
  layout?: "inline" | "stack";
  onNavigate?: () => void;
};

function NavLinkPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <LoadingSpinner size="sm" className="ml-1.5 shrink-0" />;
}

export function NavLink({
  href,
  label,
  active,
  layout = "inline",
  onNavigate,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "inline-flex items-center transition-colors",
        layout === "inline" &&
          "whitespace-nowrap rounded-full px-3 py-1.5 text-sm",
        layout === "stack" && "w-full rounded-lg px-3 py-2.5 text-base",
        active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100",
      )}
    >
      {label}
      <NavLinkPending />
    </Link>
  );
}
