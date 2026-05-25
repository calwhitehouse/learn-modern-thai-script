"use client";

import Link, { useLinkStatus, type LinkProps } from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { cn } from "@/lib/cn";

type AppLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
};

function LinkPendingSpinner() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <LoadingSpinner size="sm" className="ml-2 shrink-0 align-middle" />;
}

export function AppLink({ className, children, ...props }: AppLinkProps) {
  return (
    <Link className={cn(className)} {...props}>
      <span className="flex items-center gap-2">
        <span className="min-w-0 flex-1">{children}</span>
        <LinkPendingSpinner />
      </span>
    </Link>
  );
}
