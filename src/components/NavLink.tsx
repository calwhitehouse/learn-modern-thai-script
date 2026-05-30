"use client";

import Link from "next/link";
import { useNavigationLoading } from "@/components/NavigationLoading";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  label: string;
  active: boolean;
  layout?: "inline" | "stack";
  onNavigate?: () => void;
};

export function NavLink({
  href,
  label,
  active,
  layout = "inline",
  onNavigate,
}: NavLinkProps) {
  const startNavigation = useNavigationLoading();

  return (
    <Link
      href={href}
      onClick={() => {
        onNavigate?.();
        startNavigation?.();
      }}
      className={cn(
        "inline-flex items-center transition-colors",
        layout === "inline" && "whitespace-nowrap rounded-full px-3 py-1.5 text-sm",
        layout === "stack" && "w-full rounded-lg px-3 py-2.5 text-base",
        active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100",
      )}
    >
      {label}
    </Link>
  );
}
