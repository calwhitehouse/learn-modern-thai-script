"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoopedLetterGrid } from "@/components/quiz/LoopedLetterGrid";
import { QuizSuccessPanel } from "@/components/quiz/QuizSuccessPanel";
import { SessionSummary } from "@/components/quiz/SessionSummary";
import { useScrollToRefWhen } from "@/hooks/useScrollToRefWhen";
import { useQuizSession } from "@/components/quiz/useQuizSession";
import { ThaiText } from "@/components/ThaiText";
import { THAI_SPELLING_KEYBOARD_GROUPS } from "@/lib/thai-alphabet";
import { splitThaiForSpelling, thaiEquals } from "@/lib/thai-text";
import { cn } from "@/lib/cn";
import type { QuizCardWithDeck } from "@/lib/types";

type SpellingQuizProps = {
  deckId: string;
  cards: QuizCardWithDeck[];
  finishHref: string;
};

export function SpellingQuiz({ deckId, cards, finishHref }: SpellingQuizProps) {
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

  const [picked, setPicked] = useState<string[]>([]);
  const [hadWrong, setHadWrong] = useState(false);
  const [flashWrong, setFlashWrong] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const prevCardIdRef = useRef<string | null>(null);
  const hadWrongRef = useRef(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const segments = useMemo(
    () => (card ? splitThaiForSpelling(card.answer_text) : []),
    [card?.id, card?.answer_text],
  );

  useEffect(() => {
    if (!card?.id || prevCardIdRef.current === card.id) return;
    prevCardIdRef.current = card.id;
    setPicked([]);
    setHadWrong(false);
    hadWrongRef.current = false;
    setFlashWrong(null);
    setFinished(false);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
  }, [card?.id]);

  useEffect(
    () => () => {
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    },
    [],
  );

  useScrollToRefWhen(finished, successRef);

  if (done || !card) {
    return (
      <SessionSummary
        total={queue.length}
        correct={correctCount}
        onDone={() => router.push(finishHref)}
      />
    );
  }

  const onPick = (letter: string) => {
    if (finished) return;

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
      setFinished(true);
      completeCard(!hadWrongRef.current);
    }
  };

  const onNext = () => {
    setPicked([]);
    setHadWrong(false);
    hadWrongRef.current = false;
    setFlashWrong(null);
    setFinished(false);
    goNext();
  };

  const built = picked.join("");

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <p className="text-xs text-stone-500">
        Card {index + 1} of {queue.length}
      </p>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-600">Modern Script</p>
        <ThaiText variant="modern" className="mt-3 block text-4xl leading-relaxed">
          {card.prompt_text}
        </ThaiText>
        <p className="mt-4 text-sm text-stone-600">
          Tap each looped letter in order ({picked.length}/{segments.length})
        </p>

        <div className="mt-4 flex min-h-[3rem] flex-wrap items-center gap-1 rounded-lg bg-stone-50 px-3 py-2">
          {segments.map((seg, i) => (
            <span
              key={`${card.id}-slot-${i}-${seg}`}
              className={cn(
                "inline-flex min-w-[2rem] items-center justify-center border-b-2 border-stone-300 px-1",
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
        </div>

        {built.length > 0 && (
          <p className="mt-3 text-xs text-stone-500">
            Your looped text:{" "}
            <ThaiText variant="looped" className="text-lg">
              {built}
            </ThaiText>
          </p>
        )}
      </div>

      {finished && (
        <QuizSuccessPanel ref={successRef}>
          <p className={hadWrong ? "text-amber-950 font-semibold text-lg" : "text-emerald-800 font-semibold text-lg"}>
            {hadWrong
              ? "Completed — there was at least one wrong choice."
              : "Correct — perfect spelling."}
          </p>
          <p className="mt-2">
            Answer:{" "}
            <ThaiText variant="looped" className="text-xl">
              {card.answer_text}
            </ThaiText>
          </p>
          {card.explanation ? (
            <p className="mt-2">English: {card.explanation}</p>
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
        groups={THAI_SPELLING_KEYBOARD_GROUPS}
        onPick={onPick}
        disabled={finished}
        flashWrong={flashWrong}
      />
    </section>
  );
}
