"use client";

import { useSpellingAutoScroll } from "@/hooks/useSpellingAutoScroll";
import { cn } from "@/lib/cn";

export function SpellingAutoScrollToggle() {
  const { enabled, setEnabled } = useSpellingAutoScroll();

  return (
    <div className="flex items-center gap-2 text-xs text-stone-600">
      <span className="select-none">Auto-scroll to prompt</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Auto-scroll to prompt after each letter"
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
          enabled ? "bg-brand-teal" : "bg-stone-300",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute top-0.5 left-0.5 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
            enabled && "translate-x-4",
          )}
        />
      </button>
    </div>
  );
}
