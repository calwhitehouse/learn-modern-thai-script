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
import { THAI_LETTER_GRID, THAI_SPELLING_KEYBOARD_GROUPS } from "@/lib/thai-alphabet";
import { getSimilarDrillSetForCard, SIMILAR_LETTERS_DECK_SLUG } from "@/lib/similar-letters";
import { collectDrillSetIds } from "@/lib/similar-letters-session";
import { splitThaiForSpelling, thaiEquals } from "@/lib/thai-text";
import { cn } from "@/lib/cn";
import type { QuizCardWithDeck } from "@/lib/types";

type AdaptiveQuizProps = {
  deckId: string;
  cards: QuizCardWithDeck[];
  finishHref: string;
  onSpellingModeChange?: (isSpelling: boolean) => void;
};

export function AdaptiveQuiz({
  deckId,
  cards,
  finishHref,
  onSpellingModeChange,
}: AdaptiveQuizProps) {
  const session = useQuizSession({ cards, deckId, finishHref });
  const {
    card,
    done,
    queue,
    index,
    router,
    sessionId,
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
  const { flashWrong, flashCorrect, flashWrongLetter, flashCorrectLetter, clearFlash } =
    useLetterTapFlash();
  const [spellingDone, setSpellingDone] = useState(false);
  const prevCardIdRef = useRef<string | null>(null);
  const hadWrongRef = useRef(false);
  const promptRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [promptScrollTick, setPromptScrollTick] = useState(0);
  const { enabled: autoScrollEnabled } = useSpellingAutoScroll();

  const isSimilarLetter = card?.deck_slug === SIMILAR_LETTERS_DECK_SLUG;
  const isLetter = card?.type === "letter" && !isSimilarLetter;
  const isSpellingCard = card?.type === "word" || card?.type === "sentence";
  const similarDrillSet = useMemo(
    () =>
      isSimilarLetter && card
        ? getSimilarDrillSetForCard(card.answer_text, card.similar_set_id)
        : null,
    [isSimilarLetter, card],
  );
  const segments = useMemo(
    () => (card && !isLetter && !isSimilarLetter ? splitThaiForSpelling(card.answer_text) : []),
    [card, isLetter, isSimilarLetter],
  );

  useEffect(() => {
    if (!card?.id || prevCardIdRef.current === card.id) return;
    prevCardIdRef.current = card.id;
    setLetterAnswer(null);
    setPicked([]);
    setHadWrong(false);
    hadWrongRef.current = false;
    clearFlash();
    setSpellingDone(false);
    setPromptScrollTick(0);
  }, [card?.id, clearFlash]);

  useEffect(() => {
    onSpellingModeChange?.(Boolean(card && isSpellingCard));
  }, [card?.id, isSpellingCard, onSpellingModeChange]);

  useScrollToRefWhen(promptScrollTick > 0 && autoScrollEnabled, promptRef, {
    trigger: promptScrollTick,
  });
  useScrollToRefWhen(Boolean(letterAnswer || spellingDone), successRef);

  const sessionDrillSetIds = useMemo(() => collectDrillSetIds(queue), [queue]);

  if (done || !card) {
    return (
      <SessionSummary
        total={queue.length}
        correct={correctCount}
        onDone={() => router.push(finishHref)}
        sessionId={sessionId}
        deckId={deckId}
        source="review"
        drillSetIds={sessionDrillSetIds.length > 0 ? sessionDrillSetIds : undefined}
      />
    );
  }

  const letterAnswered = Boolean(letterAnswer);
  const spellingFinished = spellingDone;
  const isLetterPick = isLetter || isSimilarLetter;

  const onLetterPick = (letter: string) => {
    if (letterAnswered) return;

    if (!thaiEquals(letter, card.answer_text)) {
      hadWrongRef.current = true;
      recordWrongLetter(letter);
      flashWrongLetter(letter);
      return;
    }

    flashCorrectLetter(letter);
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
      flashWrongLetter(letter);
      return;
    }

    flashCorrectLetter(letter);
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
    clearFlash();
    setSpellingDone(false);
    goNext();
  };

  const built = picked.join("");
  const answered = isLetterPick ? letterAnswered : spellingFinished;
  const showSuccess = Boolean(letterAnswer || spellingDone);

  const promptSize = isSimilarLetter || isLetter ? "letter" : "word";
  const promptHint = isSimilarLetter
    ? "Tap the matching looped letter below — only the easy-to-confuse ones in this set."
    : isLetter
      ? "Tap the matching looped letter below"
      : `Tap each looped letter in order (${picked.length}/${segments.length})`;

  return (
    <section className="flex w-full flex-col gap-5">
      <p className="text-xs text-stone-500">
        Card {index + 1} of {queue.length}
      </p>

      <QuizCard ref={promptRef}>
        <p className="text-sm text-stone-600">Modern Script</p>
        <QuizPromptText size={promptSize}>
          {card.prompt_text}
        </QuizPromptText>
        <p className="mt-4 text-sm text-stone-600">{promptHint}</p>

        {!isLetter && !isSimilarLetter && (
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
          {isLetterPick ? (
            <p className="text-emerald-800 font-semibold text-lg">Correct</p>
          ) : (
            <p className={hadWrong ? "text-amber-950 font-semibold text-lg" : "text-emerald-800 font-semibold text-lg"}>
              {hadWrong
                ? "Completed — there was at least one wrong tap."
                : "Correct — perfect spelling."}
            </p>
          )}
          {!isLetterPick && (
            <p className="mt-2">
              Answer:{" "}
              <ThaiText variant="looped" className="text-xl">
                {card.answer_text}
              </ThaiText>
            </p>
          )}
          {card.explanation ? (
            <QuizSuccessExplanation
              text={card.explanation}
              prefix={isLetterPick ? undefined : "English: "}
            />
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

      {isSimilarLetter && similarDrillSet ? (
        <LoopedLetterGrid
          letters={similarDrillSet.letters}
          onPick={onLetterPick}
          disabled={answered}
          flashWrong={flashWrong}
          flashCorrect={flashCorrect}
          highlightCorrect={
            letterAnswer?.wasCorrect ? letterAnswer.picked : null
          }
          centered
        />
      ) : (
        <LoopedLetterGrid
          letters={isLetter ? THAI_LETTER_GRID : undefined}
          groups={isLetter ? undefined : THAI_SPELLING_KEYBOARD_GROUPS}
          onPick={isLetter ? onLetterPick : onSpellingPick}
          disabled={answered}
          flashWrong={flashWrong}
          flashCorrect={flashCorrect}
          highlightCorrect={
            isLetter && letterAnswer?.wasCorrect ? letterAnswer.picked : null
          }
        />
      )}
    </section>
  );
}
