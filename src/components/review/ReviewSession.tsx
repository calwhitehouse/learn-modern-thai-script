"use client";

import { useState } from "react";
import { AdaptiveQuiz } from "@/components/quiz/AdaptiveQuiz";
import { SpellingAutoScrollToggle } from "@/components/quiz/SpellingAutoScrollToggle";
import type { QuizCardWithDeck } from "@/lib/types";

type ReviewSessionProps = {
  cards: QuizCardWithDeck[];
  deckId: string;
  finishHref: string;
};

export function ReviewSession({ cards, deckId, finishHref }: ReviewSessionProps) {
  const [showAutoScrollToggle, setShowAutoScrollToggle] = useState(false);

  return (
    <>
      <header>
        {showAutoScrollToggle ? (
          <div className="flex items-center justify-end gap-3">
            <SpellingAutoScrollToggle />
          </div>
        ) : null}
        <h1
          className={
            showAutoScrollToggle
              ? "mt-2 text-2xl font-semibold text-stone-900"
              : "text-2xl font-semibold text-stone-900"
          }
        >
          Review
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Cards you missed or that are due today, including wrong answers scheduled for review.
        </p>
      </header>

      <AdaptiveQuiz
        deckId={deckId}
        cards={cards}
        finishHref={finishHref}
        onSpellingModeChange={setShowAutoScrollToggle}
      />
    </>
  );
}
