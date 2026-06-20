"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordWrongLetterTap, submitCardCompletion } from "@/app/actions/quiz";
import type { QuizCardWithDeck } from "@/lib/types";

export type { QuizCardWithDeck };

type UseQuizSessionOptions = {
  cards: QuizCardWithDeck[];
  deckId: string;
  finishHref: string;
};

export function useQuizSession({ cards, deckId, finishHref }: UseQuizSessionOptions) {
  const router = useRouter();
  const [queue] = useState(cards);
  const [index, setIndex] = useState(0);
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}`,
  );
  const [perfectCount, setPerfectCount] = useState(0);

  const card = queue[index];
  const done = !card || index >= queue.length;
  const activeDeckId = card?.deck_id ?? deckId;

  const recordWrongLetter = (selectedLetter: string) => {
    if (!card) return;
    void recordWrongLetterTap({
      cardId: card.id,
      deckId: activeDeckId,
      selectedLetter,
    });
  };

  const completeCard = (perfect: boolean) => {
    if (!card) return;
    if (perfect) setPerfectCount((n) => n + 1);

    void submitCardCompletion({
      cardId: card.id,
      deckId: activeDeckId,
      sessionId,
      perfect,
      correctAnswer: card.answer_text,
    });
  };

  const goNext = () => setIndex((i) => i + 1);

  return {
    router,
    queue,
    index,
    card,
    done,
    sessionId,
    correctCount: perfectCount,
    finishHref,
    recordWrongLetter,
    completeCard,
    goNext,
  };
}
