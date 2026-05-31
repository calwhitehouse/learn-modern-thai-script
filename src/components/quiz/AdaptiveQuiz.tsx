"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoopedLetterGrid } from "@/components/quiz/LoopedLetterGrid";
import { QuizCard, QuizPromptText, QuizSpellingTrack } from "@/components/quiz/QuizCard";
import {
  QuizSuccessExplanation,
  QuizSuccessPanel,
} from "@/components/quiz/QuizSuccessPanel";
import { SessionSummary } from "@/components/quiz/SessionSummary";
import { useScrollToRefWhen } from "@/hooks/useScrollToRefWhen";
import { useQuizSession } from "@/components/quiz/useQuizSession";
import { ThaiText } from "@/components/ThaiText";
import { THAI_LETTER_GRID, THAI_SPELLING_KEYBOARD_GROUPS } from "@/lib/thai-alphabet";
import { splitThaiForSpelling, thaiEquals } from "@/lib/thai-text";
import { cn } from "@/lib/cn";
import type { QuizCardWithDeck } from "@/lib/types";

type AdaptiveQuizProps = {
  deckId: string;
  cards: QuizCardWithDeck[];
  finishHref: string;
};

export function AdaptiveQuiz({ deckId, cards, finishHref }: AdaptiveQuizProps) {
  const session = useQuizSession({ cards, deckId, finishHref });
  const {
    card,
    done,
    queue,
    index,
    router,
    correctCount,
    recordWrongLetter,
    completeCard,
    goNext,
  } = session;

  const [letterAnswer, setLetterAnswer] = useState<{
    picked: string;
    wasCorrect: boolean;
  } | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [hadWrong, setHadWrong] = useState(false);
  const [flashWrong, setFlashWrong] = useState<string | null>(null);
  const [spellingDone, setSpellingDone] = useState(false);
  const prevCardIdRef = useRef<string | null>(null);
  const hadWrongRef = useRef(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [promptScrollTick, setPromptScrollTick] = useState(0);

  const isLetter = card?.type === "letter";
  const segments = useMemo(
    () => (card && !isLetter ? splitThaiForSpelling(card.answer_text) : []),
    [card?.id, card?.answer_text, isLetter],
  );

  useEffect(() => {
    if (!card?.id || prevCardIdRef.current === card.id) return;
    prevCardIdRef.current = card.id;
    setLetterAnswer(null);
    setPicked([]);
    setHadWrong(false);
    hadWrongRef.current = false;
    setFlashWrong(null);
    setSpellingDone(false);
    setPromptScrollTick(0);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
  }, [card?.id]);

  useEffect(
    () => () => {
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    },
    [],
  );

  useScrollToRefWhen(promptScrollTick > 0, promptRef, { trigger: promptScrollTick });
  useScrollToRefWhen(Boolean(letterAnswer || spellingDone), successRef);

  if (done || !card) {
    return (
      <SessionSummary
        total={queue.length}
        correct={correctCount}
        onDone={() => router.push(finishHref)}
      />
    );
  }

  const letterAnswered = Boolean(letterAnswer);
  const spellingFinished = spellingDone;

  const onLetterPick = (letter: string) => {
    if (letterAnswered) return;

    if (!thaiEquals(letter, card.answer_text)) {
      hadWrongRef.current = true;
      recordWrongLetter(letter);
      setFlashWrong(letter);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = setTimeout(() => setFlashWrong(null), 500);
      return;
    }

    setLetterAnswer({ picked: letter, wasCorrect: true });
    completeCard(!hadWrongRef.current);
  };

  const onSpellingPick = (letter: string) => {
    if (spellingFinished) return;

    const expected = segments[picked.length];
    if (!expected) return;

    if (!thaiEquals(letter, expected)) {
      hadWrongRef.current = true;
      setHadWrong(true);
      recordWrongLetter(letter);
      setFlashWrong(letter);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = setTimeout(() => setFlashWrong(null), 500);
      return;
    }

    const next = [...picked, letter];
    setPicked(next);

    if (next.length === segments.length) {
      setSpellingDone(true);
      completeCard(!hadWrongRef.current);
    } else {
      setPromptScrollTick((tick) => tick + 1);
    }
  };

  const resetAndNext = () => {
    setLetterAnswer(null);
    setPicked([]);
    setHadWrong(false);
    hadWrongRef.current = false;
    setFlashWrong(null);
    setSpellingDone(false);
    goNext();
  };

  const built = picked.join("");
  const answered = isLetter ? letterAnswered : spellingFinished;
  const showSuccess = Boolean(letterAnswer || spellingDone);

  return (
    <section className="flex w-full flex-col gap-5">
      <p className="text-xs text-stone-500">
        Card {index + 1} of {queue.length}
      </p>

      <QuizCard ref={promptRef}>
        <p className="text-sm text-stone-600">Modern Script</p>
        <QuizPromptText size={isLetter ? "letter" : "word"}>
          {card.prompt_text}
        </QuizPromptText>
        <p className="mt-4 text-sm text-stone-600">
          {isLetter
            ? "Tap the matching looped letter below"
            : `Tap each looped letter in order (${picked.length}/${segments.length})`}
        </p>

        {!isLetter && (
          <>
            <QuizSpellingTrack>
              {segments.map((seg, i) => (
                <span
                  key={`${card.id}-slot-${i}-${seg}`}
                  className={cn(
                    "inline-flex min-w-[2rem] items-center justify-center border-b-2 border-stone-300 px-2",
                    picked[i] && "border-emerald-600",
                  )}
                >
                  {picked[i] ? (
                    <ThaiText variant="looped" className="text-2xl">
                      {picked[i]}
                    </ThaiText>
                  ) : (
                    <span className="text-stone-300">·</span>
                  )}
                </span>
              ))}
            </QuizSpellingTrack>
            {built.length > 0 && (
              <div>
                <p className="text-xs text-stone-500">Your looped text:</p>
                <ThaiText as="div" variant="looped" className="mt-1 w-full text-lg">
                  {built}
                </ThaiText>
              </div>
            )}
          </>
        )}
      </QuizCard>

      {showSuccess && (
        <QuizSuccessPanel ref={successRef}>
          {isLetter ? (
            <p className="text-emerald-800 font-semibold text-lg">Correct</p>
          ) : (
            <p className={hadWrong ? "text-amber-950 font-semibold text-lg" : "text-emerald-800 font-semibold text-lg"}>
              {hadWrong
                ? "Completed — there was at least one wrong tap."
                : "Correct — perfect spelling."}
            </p>
          )}
          {!isLetter && (
            <p className="mt-2">
              Answer:{" "}
              <ThaiText variant="looped" className="text-xl">
                {card.answer_text}
              </ThaiText>
            </p>
          )}
          {card.explanation ? (
            <QuizSuccessExplanation text={card.explanation} prefix="English: " />
          ) : null}
          <button
            type="button"
            onClick={resetAndNext}
            className="mt-4 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
          >
            {index + 1 >= queue.length ? "See summary" : "Next card"}
          </button>
        </QuizSuccessPanel>
      )}

      <LoopedLetterGrid
        letters={isLetter ? THAI_LETTER_GRID : undefined}
        groups={isLetter ? undefined : THAI_SPELLING_KEYBOARD_GROUPS}
        onPick={isLetter ? onLetterPick : onSpellingPick}
        disabled={answered}
        flashWrong={flashWrong}
        highlightCorrect={
          isLetter && letterAnswer?.wasCorrect ? letterAnswer.picked : null
        }
      />
    </section>
  );
}
