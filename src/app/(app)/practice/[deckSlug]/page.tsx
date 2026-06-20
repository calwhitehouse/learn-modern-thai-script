import { AppLink } from "@/components/AppLink";
import { notFound } from "next/navigation";
import { LetterPickQuiz } from "@/components/quiz/LetterPickQuiz";
import { SimilarLetterQuiz } from "@/components/quiz/SimilarLetterQuiz";
import { SpellingQuiz } from "@/components/quiz/SpellingQuiz";
import { DECK_META } from "@/lib/data";
import { SESSION_SIZE } from "@/lib/quiz";
import { getDeckBySlug, getDeckCards, getPracticeSession } from "@/lib/queries";
import type { DeckSlug } from "@/lib/types";

type PracticeDeckPageProps = {
  params: Promise<{ deckSlug: string }>;
};

const SLUGS: DeckSlug[] = ["letters", "similar-letters", "words", "sentences"];

export default async function PracticeDeckPage({ params }: PracticeDeckPageProps) {
  const { deckSlug } = await params;
  if (!SLUGS.includes(deckSlug as DeckSlug)) notFound();

  const slug = deckSlug as DeckSlug;
  const deck = await getDeckBySlug(slug);
  if (!deck) notFound();

  const allCards = await getDeckCards(deck.id);
  const sessionCards = await getPracticeSession(deck.id);
  const meta = DECK_META[slug];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <AppLink href="/practice" className="text-xs text-stone-500 hover:text-stone-800">
          Back to practice
        </AppLink>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">{meta.title}</h1>
        <p className="mt-1 text-sm text-stone-600">{meta.description}</p>
        {sessionCards.length > 0 && sessionCards.length < allCards.length ? (
          <p className="mt-2 text-xs text-stone-500">
            Session: {sessionCards.length} of {allCards.length} cards (up to {SESSION_SIZE} per
            round)
          </p>
        ) : null}
      </header>

      {sessionCards.length === 0 ? (
        <p className="text-sm text-stone-600">No cards in this deck yet. Run supabase/seed.sql.</p>
      ) : slug === "similar-letters" ? (
        <SimilarLetterQuiz deckId={deck.id} cards={sessionCards} finishHref="/practice" />
      ) : slug === "letters" ? (
        <LetterPickQuiz deckId={deck.id} cards={sessionCards} finishHref="/practice" />
      ) : (
        <SpellingQuiz deckId={deck.id} cards={sessionCards} finishHref="/practice" />
      )}
    </div>
  );
}
