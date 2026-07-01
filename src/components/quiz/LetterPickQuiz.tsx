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
import { useLetterTapFlash } from "@/hooks/useLetterTapFlash";
import { useQuizSession } from "@/components/quiz/useQuizSession";
import { THAI_LETTER_GRID } from "@/lib/thai-alphabet";
import { collectSessionPrompts } from "@/lib/diverse-practice-session";
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
    sessionId,
    correctCount,
    recordWrongLetter,
    completeCard,
    goNext,
  } = useQuizSession({ cards, deckId, finishHref });

  const [answerState, setAnswerState] = useState<{
    picked: string;
    wasCorrect: boolean;
  } | null>(null);
  const { flashWrong, flashCorrect, flashWrongLetter, flashCorrectLetter, clearFlash } =
    useLetterTapFlash();
  const prevCardIdRef = useRef<string | null>(null);
  const hadWrongRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!card?.id || prevCardIdRef.current === card.id) return;
    prevCardIdRef.current = card.id;
    hadWrongRef.current = false;
    setAnswerState(null);
    clearFlash();
  }, [card?.id, clearFlash]);

  useScrollToRefWhen(Boolean(answerState), successRef);

  const sessionPrompts = useMemo(() => collectSessionPrompts(queue), [queue]);

  if (done || !card) {
    return (
      <SessionSummary
        total={queue.length}
        correct={correctCount}
        onDone={() => router.push(finishHref)}
        sessionId={sessionId}
        deckId={deckId}
        source="practice"
        sessionPrompts={sessionPrompts}
      />
    );
  }

  const answered = Boolean(answerState);

  const onPick = (letter: string) => {
    if (answered) return;

    if (!thaiEquals(letter, card.answer_text)) {
      hadWrongRef.current = true;
      recordWrongLetter(letter);
      flashWrongLetter(letter);
      return;
    }

    flashCorrectLetter(letter);
    setAnswerState({ picked: letter, wasCorrect: true });
    completeCard(!hadWrongRef.current);
  };

  const onNext = () => {
    setAnswerState(null);
    clearFlash();
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
          Tap the matching old-style looped letter below.
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
        letters={THAI_LETTER_GRID}
        onPick={onPick}
        disabled={answered}
        flashWrong={flashWrong}
        flashCorrect={flashCorrect}
        highlightCorrect={answerState?.wasCorrect ? answerState.picked : null}
      />
    </section>
  );
}
