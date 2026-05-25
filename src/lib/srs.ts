const DAY_MS = 24 * 60 * 60 * 1000;

const STREAK_INTERVAL_DAYS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
};

export type SrsState = {
  correct_count: number;
  incorrect_count: number;
  current_streak: number;
};

export type SrsUpdate = SrsState & {
  interval_days: number;
  next_review_at: string | null;
  mastered_at: string | null;
};

/** Each wrong letter tap increments incorrect_count and schedules review today. */
export function applyWrongLetterTap(prev: SrsState): SrsUpdate {
  return {
    correct_count: prev.correct_count,
    incorrect_count: prev.incorrect_count + 1,
    current_streak: 0,
    interval_days: 0,
    next_review_at: new Date().toISOString(),
    mastered_at: null,
  };
}

/** Finishing a card: advance SRS only on a perfect run (no wrong letter taps). */
export function applyCardCompletion(prev: SrsState, perfect: boolean): SrsUpdate {
  if (!perfect) {
    return {
      correct_count: prev.correct_count + 1,
      incorrect_count: prev.incorrect_count,
      current_streak: 0,
      interval_days: 0,
      next_review_at: new Date().toISOString(),
      mastered_at: null,
    };
  }

  const streak = Math.min(prev.current_streak + 1, 5);
  const correct_count = prev.correct_count + 1;

  if (streak >= 5) {
    return {
      correct_count,
      incorrect_count: prev.incorrect_count,
      current_streak: 5,
      interval_days: 0,
      next_review_at: null,
      mastered_at: new Date().toISOString(),
    };
  }

  const intervalDays = STREAK_INTERVAL_DAYS[streak] ?? 1;
  const next = new Date(Date.now() + intervalDays * DAY_MS);

  return {
    correct_count,
    incorrect_count: prev.incorrect_count,
    current_streak: streak,
    interval_days: intervalDays,
    next_review_at: next.toISOString(),
    mastered_at: null,
  };
}

export function isDue(nextReviewAt: string | null, masteredAt: string | null): boolean {
  if (masteredAt) return false;
  if (!nextReviewAt) return true;
  return new Date(nextReviewAt).getTime() <= Date.now();
}
