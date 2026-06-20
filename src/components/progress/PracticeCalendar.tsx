"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;

type PracticeCalendarProps = {
  /** Local calendar dates (YYYY-MM-DD) with a completed practice or review session. */
  activeDays: string[];
};

function dateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function PracticeCalendar({ activeDays }: PracticeCalendarProps) {
  const activeSet = useMemo(() => new Set(activeDays), [activeDays]);
  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const todayKey = new Date().toLocaleDateString("en-CA");
  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const last = new Date(view.year, view.month + 1, 0);
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = last.getDate();
    const result: Array<{ day: number | null; key: string | null }> = [];

    for (let i = 0; i < startPad; i++) {
      result.push({ day: null, key: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ day, key: dateKey(view.year, view.month, day) });
    }

    return result;
  }, [view.year, view.month]);

  const goPrevMonth = () => {
    setView((current) =>
      current.month === 0
        ? { year: current.year - 1, month: 11 }
        : { year: current.year, month: current.month - 1 },
    );
  };

  const goNextMonth = () => {
    setView((current) =>
      current.month === 11
        ? { year: current.year + 1, month: 0 }
        : { year: current.year, month: current.month + 1 },
    );
  };

  return (
    <section className="w-full rounded-xl border border-stone-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-medium text-stone-900">Practice calendar</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrevMonth}
            className="flex h-6 w-6 items-center justify-center rounded text-stone-500 hover:bg-stone-100"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="min-w-[4.5rem] text-center text-xs text-stone-600">{monthLabel}</span>
          <button
            type="button"
            onClick={goNextMonth}
            className="flex h-6 w-6 items-center justify-center rounded text-stone-500 hover:bg-stone-100"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-stone-400">
        {WEEKDAYS.map((label, index) => (
          <div key={`${label}-${index}`} className="flex h-5 items-center justify-center">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, index) => (
          <div
            key={cell.key ?? `pad-${index}`}
            className="flex h-6 items-center justify-center"
          >
            {cell.day && cell.key ? (
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[11px] leading-none",
                  activeSet.has(cell.key)
                    ? "bg-emerald-500 font-medium text-white"
                    : "text-stone-600",
                  cell.key === todayKey &&
                    (activeSet.has(cell.key) ? "ring-1 ring-emerald-700" : "ring-1 ring-stone-300"),
                )}
              >
                {cell.day}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <p className="mt-2 text-[10px] leading-snug text-stone-500">
        Green = finished practice or review.
      </p>
    </section>
  );
}
