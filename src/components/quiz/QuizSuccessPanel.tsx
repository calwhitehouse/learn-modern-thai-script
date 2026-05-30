import { forwardRef, type ReactNode } from "react";

type QuizSuccessPanelProps = {
  children: ReactNode;
};

export const QuizSuccessPanel = forwardRef<HTMLDivElement, QuizSuccessPanelProps>(
  function QuizSuccessPanel({ children }, ref) {
    return (
      <div
        ref={ref}
        className="scroll-mt-4 rounded-xl border border-green-400 bg-green-100 px-5 py-4 text-sm text-stone-700"
      >
        {children}
      </div>
    );
  },
);
