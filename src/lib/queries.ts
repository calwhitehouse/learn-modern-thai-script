import { selectDiversePracticeSessionCards } from "@/lib/diverse-practice-session";
import { selectPracticeSessionCards } from "@/lib/quiz";
import {
  isSimilarLettersDeck,
  selectSimilarLettersSessionCards,
} from "@/lib/similar-letters-session";
import { RECENT_SESSION_LOOKBACK } from "@/lib/session-variety";
import { getFullProgressStats } from "@/lib/stats";
import { isDue } from "@/lib/srs";
import { shuffle } from "@/lib/quiz-utils";
import { createClient } from "@/lib/supabase/server";
import type { Deck, DeckSlug, ProgressStats, QuizCard, QuizCardWithDeck } from "@/lib/types";

export async function getDecks(): Promise<Deck[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decks")
    .select("id, slug, title, description, sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Deck[];
}

export async function getDeckBySlug(slug: DeckSlug): Promise<Deck | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decks")
    .select("id, slug, title, description, sort_order")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Deck | null) ?? null;
}

export async function getDeckCards(deckId: string): Promise<QuizCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cards")
    .select("id, type, prompt_text, answer_text, explanation, difficulty, similar_set_id")
    .eq("deck_id", deckId)
    .eq("is_active", true)
    .order("difficulty", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as QuizCard[];
}

export async function getCardsByDeckIds(
  deckIds: string[],
): Promise<Record<string, QuizCard[]>> {
  if (deckIds.length === 0) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cards")
    .select("id, deck_id, type, prompt_text, answer_text, explanation, difficulty, similar_set_id")
    .in("deck_id", deckIds)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  const byDeck: Record<string, QuizCard[]> = {};
  for (const row of data ?? []) {
    const deckId = row.deck_id as string;
    byDeck[deckId] = byDeck[deckId] ?? [];
    byDeck[deckId].push({
      id: row.id as string,
      type: row.type as QuizCard["type"],
      prompt_text: row.prompt_text as string,
      answer_text: row.answer_text as string,
      explanation: row.explanation as string,
      difficulty: row.difficulty as number,
      similar_set_id: (row.similar_set_id as string | null) ?? null,
    });
  }
  return byDeck;
}

export async function getDueReviewCards(): Promise<QuizCardWithDeck[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: progressRows, error: progressError } = await supabase
    .from("user_card_progress")
    .select("card_id, next_review_at, mastered_at")
    .eq("user_id", user.id);

  if (progressError) throw new Error(progressError.message);

  const dueProgress = (progressRows ?? [])
    .filter((row) => isDue(row.next_review_at, row.mastered_at))
    .sort((a, b) => {
      const ta = a.next_review_at ? new Date(a.next_review_at).getTime() : 0;
      const tb = b.next_review_at ? new Date(b.next_review_at).getTime() : 0;
      return ta - tb;
    });

  const dueIds = dueProgress.map((row) => row.card_id);
  if (dueIds.length === 0) return [];

  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .select(
      "id, deck_id, type, prompt_text, answer_text, explanation, difficulty, similar_set_id, decks(slug)",
    )
    .in("id", dueIds)
    .eq("is_active", true);

  if (cardsError) throw new Error(cardsError.message);

  const cardMap = new Map(
    (cards ?? []).map((c) => {
      const rawDeck = c.decks as { slug: string } | { slug: string }[] | null;
      const deckSlug = Array.isArray(rawDeck) ? rawDeck[0]?.slug : rawDeck?.slug;
      const row: QuizCardWithDeck = {
        id: c.id as string,
        deck_id: c.deck_id as string,
        deck_slug: deckSlug as DeckSlug | undefined,
        type: c.type as QuizCard["type"],
        prompt_text: c.prompt_text as string,
        answer_text: c.answer_text as string,
        explanation: c.explanation as string,
        difficulty: c.difficulty as number,
        similar_set_id: (c.similar_set_id as string | null) ?? null,
      };
      return [row.id, row] as const;
    }),
  );

  const ordered = dueIds
    .map((id) => cardMap.get(id))
    .filter(Boolean) as QuizCardWithDeck[];

  // Shuffle on server only so FlashcardQuiz hydration matches.
  return shuffle(ordered);
}

const RECENT_DRILL_SESSION_LOOKBACK = RECENT_SESSION_LOOKBACK;

/** Drill set ids from the user's last few sessions that included similar-letter cards. */
async function getRecentSessionDrillSetIds(userId: string): Promise<string[][]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_sessions")
    .select("drill_set_ids, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(RECENT_DRILL_SESSION_LOOKBACK * 3);

  if (error) throw new Error(error.message);

  const sessions: string[][] = [];
  for (const row of data ?? []) {
    const ids = (row.drill_set_ids as string[] | null) ?? [];
    if (ids.length === 0) continue;
    sessions.push(ids);
    if (sessions.length >= RECENT_DRILL_SESSION_LOOKBACK) break;
  }

  return sessions;
}

/** Prompt texts from recent practice sessions on one deck. */
async function getRecentSessionPrompts(userId: string, deckId: string): Promise<string[][]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_sessions")
    .select("session_prompts, completed_at")
    .eq("user_id", userId)
    .eq("deck_id", deckId)
    .eq("source", "practice")
    .order("completed_at", { ascending: false })
    .limit(RECENT_SESSION_LOOKBACK * 3);

  if (error) throw new Error(error.message);

  const sessions: string[][] = [];
  for (const row of data ?? []) {
    const prompts = (row.session_prompts as string[] | null) ?? [];
    if (prompts.length === 0) continue;
    sessions.push(prompts);
    if (sessions.length >= RECENT_SESSION_LOOKBACK) break;
  }

  return sessions;
}

export async function getPracticeSession(deckId: string): Promise<QuizCard[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cards = await getDeckCards(deckId);
  const similarLetters = isSimilarLettersDeck(cards);

  if (!user) {
    return similarLetters
      ? selectSimilarLettersSessionCards(cards, [])
      : selectPracticeSessionCards(cards, []);
  }

  if (cards.length === 0) return [];

  const { data: progressRows, error } = await supabase
    .from("user_card_progress")
    .select("card_id, next_review_at, mastered_at, correct_count, incorrect_count")
    .eq("user_id", user.id)
    .in("card_id", cards.map((c) => c.id));

  if (error) throw new Error(error.message);

  const progress = progressRows ?? [];
  if (similarLetters) {
    const recentSessionDrillSetIds = await getRecentSessionDrillSetIds(user.id);
    return selectSimilarLettersSessionCards(cards, progress, { recentSessionDrillSetIds });
  }

  const recentSessionPrompts = await getRecentSessionPrompts(user.id, deckId);
  return selectDiversePracticeSessionCards(cards, progress, { recentSessionPrompts });
}

export async function getProgressStats(): Promise<ProgressStats> {
  const full = await getFullProgressStats();
  return {
    cardsCompleted: full.cardsCompleted,
    perfectCompletions: full.perfectCompletions,
    perfectRatePercent: full.perfectRatePercent,
    totalWrongLetterTaps: full.totalWrongLetterTaps,
    masteredCount: full.masteredCount,
    dueCount: full.dueCount,
    cardsStudied: full.cardsStudied,
  };
}

export async function getUserEmail(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}
