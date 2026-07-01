"use client";

import { AppLink } from "@/components/AppLink";
import { SpellingAutoScrollToggle } from "@/components/quiz/SpellingAutoScrollToggle";

type PracticeDeckNavProps = {
  showAutoScrollToggle?: boolean;
};

export function PracticeDeckNav({ showAutoScrollToggle = false }: PracticeDeckNavProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <AppLink href="/practice" className="text-xs text-stone-500 hover:text-stone-800">
        Back to practice
      </AppLink>
      {showAutoScrollToggle ? <SpellingAutoScrollToggle /> : null}
    </div>
  );
}
