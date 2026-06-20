"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoopedLetterGrid } from "@/components/quiz/LoopedLetterGrid";
import { QuizCard, QuizPromptText } from "@/components/quiz/QuizCard";
import {
  QuizSuccessExplanation,
  QuizSuccessPanel,
} from "@/components/quiz/QuizSuccessPanel";
import { SessionSummary } from "@/components/quiz/SessionSummary";
import { useScrollToRefWhen } from "@/hooks/useScrollToRefWhen";
import { useQuizSession } from "@/components/quiz/useQuizSession";
import { getSimilarLetterGroup } from "@/lib/similar-letters";
import { thaiEquals } from "@/lib/thai-text";
import type { QuizCardWithDeck } from "@/lib/types";

type SimilarLetterQuizProps = {
  deckId: string;
  cards: QuizCardWithDeck[];
  finishHref: string;
};

export function SimilarLetterQuiz({ deckId, cards, finishHref }: SimilarLetterQuizProps) {
  const {
    router,
    queue,
    index,
    card,
    done,
    correctCount,
    recordWrongLetter,
    completeCard,
    goNext,
  } = useQuizSession({ cards, deckId, finishHref });

  const [answerState, setAnswerState] = useState<{
    picked: string;
    wasCorrect: boolean;
  } | null>(null);
  const [flashWrong, setFlashWrong] = useState<string | null>(null);
  const prevCardIdRef = useRef<string | null>(null);
  const hadWrongRef = useRef(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const choiceGroup = useMemo(
    () => (card ? getSimilarLetterGroup(card.answer_text) : null),
    [card],
  );

  useEffect(() => {
    if (!card?.id || prevCardIdRef.current === card.id) return;
    prevCardIdRef.current = card.id;
    hadWrongRef.current = false;
    setAnswerState(null);
    setFlashWrong(null);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
  }, [card?.id]);

  useEffect(
    () => () => {
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    },
    [],
  );

  useScrollToRefWhen(Boolean(answerState), successRef);

  if (done || !card) {
    return (
      <SessionSummary
        total={queue.length}
        correct={correctCount}
        onDone={() => router.push(finishHref)}
      />
    );
  }

  if (!choiceGroup) {
    return (
      <p className="text-sm text-rose-700">
        This card is not part of a similar-letter set. Skip it in Review or re-sync the deck.
      </p>
    );
  }

  const answered = Boolean(answerState);

  const onPick = (letter: string) => {
    if (answered) return;

    if (!thaiEquals(letter, card.answer_text)) {
      hadWrongRef.current = true;
      recordWrongLetter(letter);
      setFlashWrong(letter);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = setTimeout(() => setFlashWrong(null), 500);
      return;
    }

    setAnswerState({ picked: letter, wasCorrect: true });
    completeCard(!hadWrongRef.current);
  };

  const onNext = () => {
    setAnswerState(null);
    setFlashWrong(null);
    goNext();
  };

  return (
    <section className="flex w-full flex-col gap-5">
      <p className="text-xs text-stone-500">
        Card {index + 1} of {queue.length}
      </p>

      <QuizCard>
        <p className="text-sm text-stone-600">Modern Script</p>
        <QuizPromptText size="letter">{card.prompt_text}</QuizPromptText>
        <p className="mt-4 text-sm text-stone-600">
          Tap the matching looped letter below — only the easy-to-confuse ones in this set.
        </p>
      </QuizCard>

      {answerState && (
        <QuizSuccessPanel ref={successRef}>
          <p className="text-emerald-800 font-semibold text-lg">Correct</p>
          {card.explanation ? (
            <QuizSuccessExplanation text={card.explanation} />
          ) : null}
          <button
            type="button"
            onClick={onNext}
            className="mt-4 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
          >
            {index + 1 >= queue.length ? "See summary" : "Next card"}
          </button>
        </QuizSuccessPanel>
      )}

      <LoopedLetterGrid
        letters={choiceGroup.letters}
        onPick={onPick}
        disabled={answered}
        flashWrong={flashWrong}
        highlightCorrect={answerState?.wasCorrect ? answerState.picked : null}
        centered
      />
    </section>
  );
}
