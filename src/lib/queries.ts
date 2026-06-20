import { selectPracticeSessionCards } from "@/lib/quiz";
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
    .select("id, type, prompt_text, answer_text, explanation, difficulty")
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
    .select("id, deck_id, type, prompt_text, answer_text, explanation, difficulty")
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
      "id, deck_id, type, prompt_text, answer_text, explanation, difficulty, decks(slug)",
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

export async function getPracticeSession(deckId: string): Promise<QuizCard[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cards = await getDeckCards(deckId);
  if (!user) return selectPracticeSessionCards(cards, []);

  if (cards.length === 0) return [];

  const { data: progressRows, error } = await supabase
    .from("user_card_progress")
    .select("card_id, next_review_at, mastered_at, correct_count, incorrect_count")
    .eq("user_id", user.id)
    .in("card_id", cards.map((c) => c.id));

  if (error) throw new Error(error.message);

  return selectPracticeSessionCards(cards, progressRows ?? []);
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
