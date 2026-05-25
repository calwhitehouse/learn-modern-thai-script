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
  highlightCorrect?: string | null;
};

function LetterButtons({
  letters,
  onPick,
  disabled,
  flashWrongNorm,
  highlightCorrectNorm,
  keyPrefix,
}: {
  letters: readonly string[];
  onPick: (letter: string) => void;
  disabled?: boolean;
  flashWrongNorm: string | null;
  highlightCorrectNorm: string | null;
  keyPrefix: string;
}) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-9">
      {letters.map((letter, index) => {
        const letterNorm = normalizeThai(letter);
        const isWrongFlash = flashWrongNorm === letterNorm;
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
              "flex min-h-[44px] touch-manipulation items-center justify-center rounded-lg border px-1 py-2 transition-colors",
              "border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50",
              "active:scale-[0.98]",
              "disabled:pointer-events-none disabled:opacity-50",
              isWrongFlash && "!border-rose-500 !bg-rose-50",
              isCorrectHighlight && "!border-emerald-600 !bg-emerald-50",
            )}
          >
            <ThaiText variant="looped" className="pointer-events-none text-xl sm:text-2xl">
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
  highlightCorrect,
}: LoopedLetterGridProps) {
  const flashWrongNorm = flashWrong ? normalizeThai(flashWrong) : null;
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
              highlightCorrectNorm={highlightCorrectNorm}
              keyPrefix={group.id}
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
      highlightCorrectNorm={highlightCorrectNorm}
      keyPrefix="flat"
    />
  );
}
