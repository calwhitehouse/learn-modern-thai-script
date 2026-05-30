import { cn } from "@/lib/cn";

type QuizCardProps = {
  children: React.ReactNode;
  className?: string;
};

/** White prompt card used in practice and review quizzes. */
export function QuizCard({ children, className }: QuizCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

type QuizThaiBlockProps = {
  children: React.ReactNode;
  className?: string;
};

/** Extra horizontal inset so Thai glyphs (especially leading vowels) are not tight on the card edge. */
export function QuizThaiBlock({ children, className }: QuizThaiBlockProps) {
  return (
    <div className={cn("overflow-visible py-1 ps-4 pe-3 sm:ps-5 sm:pe-4", className)}>
      {children}
    </div>
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
        "mt-4 flex min-h-[3rem] flex-wrap items-center gap-2 rounded-lg bg-stone-50 py-3 ps-5 pe-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
