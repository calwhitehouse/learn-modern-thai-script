"use client";

import { ThaiText } from "@/components/ThaiText";
import { cn } from "@/lib/cn";
import { normalizeThai } from "@/lib/thai-text";

export type LetterGroup = {
  id: string;
  label: string;
  letters: readonly string[];
};

type LoopedLetterGridProps = {
  /** Flat list (letters practice or legacy). */
  letters?: readonly string[];
  /** Grouped sections (words / sentences spelling). */
  groups?: readonly LetterGroup[];
  onPick: (letter: string) => void;
  disabled?: boolean;
  flashWrong?: string | null;
  flashCorrect?: string | null;
  highlightCorrect?: string | null;
  /** Modern font for similar-letter drills; default looped. */
  variant?: "modern" | "looped";
  /** Center choice buttons (similar-letter small sets). */
  centered?: boolean;
};

function LetterButtons({
  letters,
  onPick,
  disabled,
  flashWrongNorm,
  flashCorrectNorm,
  highlightCorrectNorm,
  keyPrefix,
  variant = "looped",
  centered = false,
}: {
  letters: readonly string[];
  onPick: (letter: string) => void;
  disabled?: boolean;
  flashWrongNorm: string | null;
  flashCorrectNorm: string | null;
  highlightCorrectNorm: string | null;
  keyPrefix: string;
  variant?: "modern" | "looped";
  centered?: boolean;
}) {
  const containerClass = centered
    ? "mx-auto flex w-full flex-wrap justify-center gap-2"
    : "grid grid-cols-4 gap-2 sm:grid-cols-5";

  const buttonClass = centered
    ? "flex h-11 w-[4.25rem] shrink-0 touch-manipulation items-center justify-center rounded-lg border px-1 transition-colors sm:h-12 sm:w-[4.75rem]"
    : "flex min-h-[44px] touch-manipulation items-center justify-center rounded-lg border px-1 py-2 transition-colors";

  return (
    <div className={containerClass}>
      {letters.map((letter, index) => {
        const letterNorm = normalizeThai(letter);
        const isWrongFlash = flashWrongNorm === letterNorm;
        const isCorrectFlash = flashCorrectNorm === letterNorm;
        const isCorrectHighlight = highlightCorrectNorm === letterNorm;

        return (
          <button
            key={`${keyPrefix}-${index}-${letterNorm}`}
            type="button"
            disabled={disabled}
            onPointerUp={(e) => {
              e.preventDefault();
              if (disabled) return;
              onPick(letter);
            }}
            className={cn(
              buttonClass,
              "border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50",
              "active:scale-[0.98]",
              "disabled:pointer-events-none disabled:opacity-50",
              isWrongFlash && "!border-rose-500 !bg-rose-50",
              (isCorrectFlash || isCorrectHighlight) && "!border-emerald-600 !bg-emerald-50",
            )}
          >
            <ThaiText variant={variant} className="pointer-events-none text-2xl sm:text-3xl">
              {letter}
            </ThaiText>
          </button>
        );
      })}
    </div>
  );
}

export function LoopedLetterGrid({
  letters,
  groups,
  onPick,
  disabled,
  flashWrong,
  flashCorrect,
  highlightCorrect,
  variant = "looped",
  centered = false,
}: LoopedLetterGridProps) {
  const flashWrongNorm = flashWrong ? normalizeThai(flashWrong) : null;
  const flashCorrectNorm = flashCorrect ? normalizeThai(flashCorrect) : null;
  const highlightCorrectNorm = highlightCorrect ? normalizeThai(highlightCorrect) : null;

  if (groups && groups.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <section key={group.id}>
            <h3 className="mb-2 text-xs font-medium text-stone-500">{group.label}</h3>
            <LetterButtons
              letters={group.letters}
              onPick={onPick}
              disabled={disabled}
              flashWrongNorm={flashWrongNorm}
              flashCorrectNorm={flashCorrectNorm}
              highlightCorrectNorm={highlightCorrectNorm}
              keyPrefix={group.id}
              variant={variant}
              centered={centered}
            />
          </section>
        ))}
      </div>
    );
  }

  const flatLetters = letters ?? [];

  return (
    <LetterButtons
      letters={flatLetters}
      onPick={onPick}
      disabled={disabled}
      flashWrongNorm={flashWrongNorm}
      flashCorrectNorm={flashCorrectNorm}
      highlightCorrectNorm={highlightCorrectNorm}
      keyPrefix="flat"
      variant={variant}
      centered={centered}
    />
  );
}
