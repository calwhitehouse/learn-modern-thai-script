import Link from "next/link";
import { ReviewSession } from "@/components/review/ReviewSession";
import { getDueReviewCards } from "@/lib/queries";

export default async function ReviewPage() {
  const cards = await getDueReviewCards();

  return (
    <div className="flex flex-col gap-6">
      {cards.length === 0 ? (
        <>
          <header>
            <h1 className="text-2xl font-semibold text-stone-900">Review</h1>
            <p className="mt-1 text-sm text-stone-600">
              Cards you missed or that are due today, including wrong answers scheduled for review.
            </p>
          </header>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
            Nothing due right now.{" "}
            <Link
              href="/practice"
              className="font-medium text-stone-900 underline-offset-2 hover:underline"
            >
              Practice a deck
            </Link>{" "}
            to build your queue.
          </div>
        </>
      ) : (
        <ReviewSession
          cards={cards}
          deckId={cards[0]?.deck_id ?? ""}
          finishHref="/dashboard"
        />
      )}
    </div>
  );
}
