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
import { useLetterTapFlash } from "@/hooks/useLetterTapFlash";
import { useSpellingAutoScroll } from "@/hooks/useSpellingAutoScroll";
import { useQuizSession } from "@/components/quiz/useQuizSession";
import { ThaiText } from "@/components/ThaiText";
import { THAI_SPELLING_KEYBOARD_GROUPS } from "@/lib/thai-alphabet";
import { collectSessionPrompts } from "@/lib/diverse-practice-session";
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
    sessionId,
    correctCount,
    recordWrongLetter,
    completeCard,
    goNext,
  } = useQuizSession({ cards, deckId, finishHref });

  const [picked, setPicked] = useState<string[]>([]);
  const [hadWrong, setHadWrong] = useState(false);
  const { flashWrong, flashCorrect, flashWrongLetter, flashCorrectLetter, clearFlash } =
    useLetterTapFlash();
  const [finished, setFinished] = useState(false);
  const prevCardIdRef = useRef<string | null>(null);
  const hadWrongRef = useRef(false);
  const promptRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [promptScrollTick, setPromptScrollTick] = useState(0);
  const { enabled: autoScrollEnabled } = useSpellingAutoScroll();

  const segments = useMemo(
    () => (card ? splitThaiForSpelling(card.answer_text) : []),
    [card],
  );

  useEffect(() => {
    if (!card?.id || prevCardIdRef.current === card.id) return;
    prevCardIdRef.current = card.id;
    setPicked([]);
    setHadWrong(false);
    hadWrongRef.current = false;
    clearFlash();
    setFinished(false);
    setPromptScrollTick(0);
  }, [card?.id, clearFlash]);

  useScrollToRefWhen(promptScrollTick > 0 && autoScrollEnabled, promptRef, {
    trigger: promptScrollTick,
  });
  useScrollToRefWhen(finished, successRef);

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

  const onPick = (letter: string) => {
    if (finished) return;

    const expected = segments[picked.length];
    if (!expected) return;

    if (!thaiEquals(letter, expected)) {
      hadWrongRef.current = true;
      setHadWrong(true);
      recordWrongLetter(letter);
      flashWrongLetter(letter);
      return;
    }

    flashCorrectLetter(letter);
    const next = [...picked, letter];
    setPicked(next);

    if (next.length === segments.length) {
      setFinished(true);
      completeCard(!hadWrongRef.current);
    } else {
      setPromptScrollTick((tick) => tick + 1);
    }
  };

  const onNext = () => {
    setPicked([]);
    setHadWrong(false);
    hadWrongRef.current = false;
    clearFlash();
    setFinished(false);
    goNext();
  };

  const built = picked.join("");

  return (
    <section className="flex w-full flex-col gap-5">
      <p className="text-xs text-stone-500">
        Card {index + 1} of {queue.length}
      </p>

      <QuizCard ref={promptRef}>
        <p className="text-sm text-stone-600">Modern Script</p>
        <QuizPromptText>{card.prompt_text}</QuizPromptText>
        <p className="mt-4 text-sm text-stone-600">
          Tap each looped letter in order ({picked.length}/{segments.length})
        </p>

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
      </QuizCard>

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
            <QuizSuccessExplanation text={card.explanation} prefix="English: " />
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
        flashCorrect={flashCorrect}
      />
    </section>
  );
}
