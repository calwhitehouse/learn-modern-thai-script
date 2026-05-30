import { forwardRef, type ReactNode } from "react";
import { ThaiText } from "@/components/ThaiText";
import { formatCardExplanationForDisplay } from "@/lib/format-card-explanation";

type QuizSuccessPanelProps = {
  children: ReactNode;
};

export const QuizSuccessPanel = forwardRef<HTMLDivElement, QuizSuccessPanelProps>(
  function QuizSuccessPanel({ children }, ref) {
    return (
      <div
        ref={ref}
        className="scroll-mt-4 rounded-xl border border-green-400 bg-green-100 p-4 text-center text-sm text-stone-700"
      >
        {children}
      </div>
    );
  },
);

type QuizSuccessExplanationProps = {
  text: string;
  /** Optional label before the explanation (e.g. "English: "). */
  prefix?: string;
};

/** Card explanation line (letter name/notes; prompt glyph omitted). */
export function QuizSuccessExplanation({ text, prefix }: QuizSuccessExplanationProps) {
  const display = formatCardExplanationForDisplay(text);

  return (
    <p className="mt-2 text-lg leading-relaxed">
      <ThaiText variant="modern" className="inline leading-relaxed">
        {prefix}
        {display}
      </ThaiText>
    </p>
  );
}
