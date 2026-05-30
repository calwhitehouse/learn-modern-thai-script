"use client";

import Link, { type LinkProps } from "next/link";
import { useNavigationLoading } from "@/components/NavigationLoading";
import { cn } from "@/lib/cn";

type AppLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
};

export function AppLink({ className, children, onClick, ...props }: AppLinkProps) {
  const startNavigation = useNavigationLoading();

  return (
    <Link
      className={cn(className)}
      onClick={(e) => {
        onClick?.(e);
        startNavigation?.();
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
