import { AppLink } from "@/components/AppLink";
import { DECK_META } from "@/lib/data";
import { getDecks } from "@/lib/queries";

export default async function PracticePage() {
  const decks = await getDecks();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Practice</h1>
        <p className="mt-1 text-sm text-stone-600">
          Each card shows modern non-looped text. Pick the matching looped form in order to learn how the old Thai script translates to the modern version.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {decks.map((deck) => {
          const meta = DECK_META[deck.slug as keyof typeof DECK_META];
          if (!meta) return null;
          return (
            <li key={deck.id}>
              <AppLink
                href={meta.href}
                className="block rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
              >
                <h2 className="font-medium text-stone-900">{meta.title}</h2>
                <p className="mt-1 text-sm text-stone-600">{meta.description}</p>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
