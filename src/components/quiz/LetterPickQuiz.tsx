"use client";

import { useEffect, useRef, useState } from "react";
import { LoopedLetterGrid } from "@/components/quiz/LoopedLetterGrid";
import { SessionSummary } from "@/components/quiz/SessionSummary";
import { useQuizSession } from "@/components/quiz/useQuizSession";
import { ThaiText } from "@/components/ThaiText";
import { THAI_LETTER_GRID } from "@/lib/thai-alphabet";
import { thaiEquals } from "@/lib/thai-text";
import type { QuizCardWithDeck } from "@/lib/types";

type LetterPickQuizProps = {
  deckId: string;
  cards: QuizCardWithDeck[];
  finishHref: string;
};

export function LetterPickQuiz({ deckId, cards, finishHref }: LetterPickQuizProps) {
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

  if (done || !card) {
    return (
      <SessionSummary
        total={queue.length}
        correct={correctCount}
        onDone={() => router.push(finishHref)}
      />
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
    <section className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <p className="text-xs text-stone-500">
        Card {index + 1} of {queue.length}
      </p>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-600">Modern Script</p>
        <ThaiText variant="modern" className="mt-3 block text-5xl">
          {card.prompt_text}
        </ThaiText>
        <p className="mt-4 text-sm text-stone-600">
          Tap the matching old-style looped letter below.
        </p>
      </div>

      {answerState && (
        <div className="rounded-xl border border-green-400 bg-green-100 p-4 text-sm text-stone-700">
          <p className="text-emerald-800 font-semibold text-lg">Correct</p>
          {card.explanation ? (
            <p className="mt-2 text-lg">{card.explanation}</p>
          ) : null}
          <button
            type="button"
            onClick={onNext}
            className="mt-4 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
          >
            {index + 1 >= queue.length ? "See summary" : "Next card"}
          </button>
        </div>
      )}

      <LoopedLetterGrid
        letters={THAI_LETTER_GRID}
        onPick={onPick}
        disabled={answered}
        flashWrong={flashWrong}
        highlightCorrect={answerState?.wasCorrect ? answerState.picked : null}
      />
    </section>
  );
}
