"use client";

import { useFormStatus } from "react-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { cn } from "@/lib/cn";

type AuthSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  disabled?: boolean;
  className?: string;
};

export function AuthSubmitButton({
  children,
  pendingLabel,
  disabled = false,
  className,
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-hover disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {pending ? (
        <>
          <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
