"use server";

import { revalidatePath } from "next/cache";
import { isQuizSelectedAnswerLengthValid } from "@/lib/quiz-limits";
import { applyCardCompletion, applyWrongLetterTap } from "@/lib/srs";
import { createClient } from "@/lib/supabase/server";

type ProgressRow = {
  correct_count: number;
  incorrect_count: number;
  current_streak: number;
};

async function getProgress(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  cardId: string,
): Promise<ProgressRow> {
  const { data } = await supabase
    .from("user_card_progress")
    .select("correct_count, incorrect_count, current_streak")
    .eq("user_id", userId)
    .eq("card_id", cardId)
    .maybeSingle();

  return data ?? { correct_count: 0, incorrect_count: 0, current_streak: 0 };
}

async function saveProgress(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  cardId: string,
  srs: ReturnType<typeof applyWrongLetterTap>,
) {
  return supabase.from("user_card_progress").upsert(
    {
      user_id: userId,
      card_id: cardId,
      correct_count: srs.correct_count,
      incorrect_count: srs.incorrect_count,
      current_streak: srs.current_streak,
      interval_days: srs.interval_days,
      next_review_at: srs.next_review_at,
      mastered_at: srs.mastered_at,
    },
    { onConflict: "user_id,card_id" },
  );
}

function revalidateProgress() {
  revalidatePath("/review");
  revalidatePath("/progress");
  revalidatePath("/dashboard");
}

export type RecordWrongLetterInput = {
  cardId: string;
  deckId: string;
  selectedLetter: string;
};

/** Log one incorrect letter tap and bump incorrect_count for the card. */
export async function recordWrongLetterTap(input: RecordWrongLetterInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Not signed in" };
  }

  const prev = await getProgress(supabase, user.id, input.cardId);
  const srs = applyWrongLetterTap(prev);

  const { error } = await saveProgress(supabase, user.id, input.cardId, srs);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidateProgress();

  return { ok: true as const, incorrectCount: srs.incorrect_count };
}

export type SubmitCardCompletionInput = {
  cardId: string;
  deckId: string;
  sessionId: string;
  perfect: boolean;
  correctAnswer: string;
};

/** Log a finished card (quiz_attempt) and update SRS from perfect vs imperfect completion. */
export async function submitCardCompletion(input: SubmitCardCompletionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Not signed in" };
  }

  if (!isQuizSelectedAnswerLengthValid(input.correctAnswer)) {
    return { ok: false as const, error: "Invalid answer length" };
  }

  const { error: attemptError } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    card_id: input.cardId,
    deck_id: input.deckId,
    was_correct: input.perfect,
    selected_answer: input.correctAnswer,
    session_id: input.sessionId,
  });

  if (attemptError) {
    return { ok: false as const, error: attemptError.message };
  }

  const prev = await getProgress(supabase, user.id, input.cardId);
  const srs = applyCardCompletion(prev, input.perfect);

  const { error: progressError } = await saveProgress(
    supabase,
    user.id,
    input.cardId,
    srs,
  );

  if (progressError) {
    return { ok: false as const, error: progressError.message };
  }

  revalidateProgress();

  return { ok: true as const, perfect: input.perfect };
}
