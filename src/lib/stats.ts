import { createClient } from "@/lib/supabase/server";
import { isDue } from "@/lib/srs";
import type { FullProgressStats } from "@/lib/types";

export async function getFullProgressStats(): Promise<FullProgressStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const empty: FullProgressStats = {
    cardsCompleted: 0,
    perfectCompletions: 0,
    perfectRatePercent: 0,
    totalWrongLetterTaps: 0,
    cardsStudied: 0,
    masteredCount: 0,
    dueCount: 0,
    strongestDeck: null,
    weakestDeck: null,
    mostMissed: [],
  };

  if (!user) return empty;

  const { data: attempts, error: attemptsError } = await supabase
    .from("quiz_attempts")
    .select("was_correct, deck_id")
    .eq("user_id", user.id);

  if (attemptsError) throw new Error(attemptsError.message);

  const completionRows = attempts ?? [];
  const cardsCompleted = completionRows.length;
  const perfectCompletions = completionRows.filter((r) => r.was_correct).length;
  const perfectRatePercent =
    cardsCompleted > 0 ? Math.round((perfectCompletions / cardsCompleted) * 100) : 0;

  const { data: progressRows, error: progressError } = await supabase
    .from("user_card_progress")
    .select("card_id, next_review_at, mastered_at, incorrect_count")
    .eq("user_id", user.id);

  if (progressError) throw new Error(progressError.message);

  const progress = progressRows ?? [];
  const totalWrongLetterTaps = progress.reduce(
    (sum, row) => sum + ((row.incorrect_count as number) ?? 0),
    0,
  );
  const masteredCount = progress.filter((r) => r.mastered_at).length;
  const dueCount = progress.filter((r) =>
    isDue(r.next_review_at, r.mastered_at),
  ).length;

  const { data: decks } = await supabase.from("decks").select("id, title, slug");

  const deckTitle = new Map((decks ?? []).map((d) => [d.id as string, d.title as string]));

  const deckStats = new Map<string, { perfect: number; total: number }>();
  for (const row of completionRows) {
    const deckId = row.deck_id as string;
    const stat = deckStats.get(deckId) ?? { perfect: 0, total: 0 };
    stat.total += 1;
    if (row.was_correct) stat.perfect += 1;
    deckStats.set(deckId, stat);
  }

  let strongestDeck: FullProgressStats["strongestDeck"] = null;
  let weakestDeck: FullProgressStats["weakestDeck"] = null;

  for (const [deckId, stat] of deckStats) {
    if (stat.total < 3) continue;
    const accuracy = Math.round((stat.perfect / stat.total) * 100);
    const entry = { title: deckTitle.get(deckId) ?? "Deck", accuracy };

    if (!strongestDeck || accuracy > strongestDeck.accuracy) {
      strongestDeck = entry;
    }
    if (!weakestDeck || accuracy < weakestDeck.accuracy) {
      weakestDeck = entry;
    }
  }

  const missedIds = progress
    .filter((r) => (r.incorrect_count as number) > 0)
    .sort((a, b) => (b.incorrect_count as number) - (a.incorrect_count as number))
    .slice(0, 5)
    .map((r) => r.card_id as string);

  let mostMissed: FullProgressStats["mostMissed"] = [];

  if (missedIds.length > 0) {
    const { data: cards } = await supabase
      .from("cards")
      .select("id, prompt_text")
      .in("id", missedIds);

    const cardMap = new Map((cards ?? []).map((c) => [c.id as string, c.prompt_text as string]));
    mostMissed = missedIds
      .map((id) => {
        const p = progress.find((r) => r.card_id === id);
        return {
          promptText: cardMap.get(id) ?? "—",
          incorrectCount: (p?.incorrect_count as number) ?? 0,
        };
      })
      .filter((m) => m.incorrectCount > 0);
  }

  return {
    cardsCompleted,
    perfectCompletions,
    perfectRatePercent,
    totalWrongLetterTaps,
    cardsStudied: progress.length,
    masteredCount,
    dueCount,
    strongestDeck,
    weakestDeck,
    mostMissed,
  };
}
