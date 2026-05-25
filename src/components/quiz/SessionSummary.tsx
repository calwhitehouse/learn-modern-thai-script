type SessionSummaryProps = {
  total: number;
  correct: number;
  onDone: () => void;
};

/** Tiers match a 10-card session: under 70%, 70–99%, 100%. Works for any session length. */
function sessionMessage(correct: number, total: number, accuracy: number): string {
  const stats = `${correct} of ${total} (${accuracy}%)`;
  if (accuracy === 100) return `Perfect - ${stats}`;
  if (accuracy >= 70) return `Great effort - ${stats}`;
  return `Keep going - ${stats}`;
}

export function SessionSummary({ total, correct, onDone }: SessionSummaryProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const message = sessionMessage(correct, total, accuracy);

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-stone-900 text-center">Session complete</h2>
        <p className="mt-1 text-base font-semibold text-stone-600 text-center">{message}</p>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
      >
        Done
      </button>
    </section>
  );
}
