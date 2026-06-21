"use client";

import { useEffect, useRef } from "react";
import { logStudySession } from "@/app/actions/quiz";

type SessionSummaryProps = {
  total: number;
  correct: number;
  onDone: () => void;
  sessionId: string;
  deckId?: string;
  source: "practice" | "review";
  drillSetIds?: string[];
  sessionPrompts?: string[];
};

/** Tiers match a 10-card session: under 70%, 70–99%, 100%. Works for any session length. */
function sessionMessage(correct: number, total: number, accuracy: number): string {
  const stats = `${correct} of ${total} (${accuracy}%)`;
  if (accuracy === 100) return `Perfect - ${stats}`;
  if (accuracy >= 70) return `Great effort - ${stats}`;
  return `Keep going - ${stats}`;
}

export function SessionSummary({
  total,
  correct,
  onDone,
  sessionId,
  deckId,
  source,
  drillSetIds,
  sessionPrompts,
}: SessionSummaryProps) {
  const loggedRef = useRef(false);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const message = sessionMessage(correct, total, accuracy);

  useEffect(() => {
    if (loggedRef.current || total < 1) return;
    loggedRef.current = true;

    void logStudySession({
      sessionId,
      deckId: deckId ?? null,
      source,
      cardCount: total,
      practicedOn: new Date().toLocaleDateString("en-CA"),
      drillSetIds: drillSetIds?.length ? drillSetIds : undefined,
      sessionPrompts:
        source === "practice" && sessionPrompts?.length ? sessionPrompts : undefined,
    });
  }, [sessionId, deckId, source, total, drillSetIds, sessionPrompts]);

  return (
    <section className="flex w-full flex-col gap-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-center text-lg font-semibold text-stone-900">Session complete</h2>
        <p className="mt-1 text-center text-base font-semibold text-stone-600">{message}</p>
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
