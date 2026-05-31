import { forwardRef, type ReactNode } from "react";
import { ThaiText } from "@/components/ThaiText";
import { cn } from "@/lib/cn";

type QuizCardProps = {
  children: ReactNode;
  className?: string;
};

/** White prompt card used in practice and review quizzes. */
export const QuizCard = forwardRef<HTMLDivElement, QuizCardProps>(function QuizCard(
  { children, className },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "scroll-mt-4 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
});

type QuizThaiBlockProps = {
  children: React.ReactNode;
  className?: string;
};

/** Extra horizontal inset so Thai glyphs (especially leading vowels) are not tight on the card edge. */
export function QuizThaiBlock({ children, className }: QuizThaiBlockProps) {
  return (
    <div className={cn("overflow-visible px-4 py-1 sm:px-5", className)}>
      {children}
    </div>
  );
}

type QuizPromptTextProps = {
  children: React.ReactNode;
  variant?: "modern" | "looped";
  size?: "letter" | "word";
  className?: string;
};

/** Large Thai prompt line on quiz cards (modern or looped). */
export function QuizPromptText({
  children,
  variant = "modern",
  size = "word",
  className,
}: QuizPromptTextProps) {
  return (
    <QuizThaiBlock className="mt-2">
      <ThaiText
        variant={variant}
        className={cn(
          "block",
          size === "letter" ? "text-5xl leading-none" : "text-4xl leading-relaxed",
          className,
        )}
      >
        {children}
      </ThaiText>
    </QuizThaiBlock>
  );
}

type QuizSpellingTrackProps = {
  children: React.ReactNode;
  className?: string;
};

/** Row of spelling slots / picked looped letters. */
export function QuizSpellingTrack({ children, className }: QuizSpellingTrackProps) {
  return (
    <div
      className={cn(
        "mt-4 flex min-h-[3rem] flex-wrap items-center justify-center gap-2 rounded-lg bg-stone-50 px-3 py-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
