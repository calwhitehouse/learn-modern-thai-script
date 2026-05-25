import { ThaiText } from "@/components/ThaiText";
import { getFullProgressStats } from "@/lib/stats";

export default async function ProgressPage() {
  const stats = await getFullProgressStats();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Progress</h1>
        <p className="mt-1 text-sm text-stone-600">
          Wrong letter taps and perfect card completions.
        </p>
      </header>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Item label="Wrong letter taps" value={stats.totalWrongLetterTaps} />
        <Item label="Cards completed" value={stats.cardsCompleted} />
        <Item label="Perfect completions" value={stats.perfectCompletions} />
        <Item label="Perfect rate" value={`${stats.perfectRatePercent}%`} />
        <Item label="Cards studied" value={stats.cardsStudied} />
        <Item label="Mastered cards" value={stats.masteredCount} />
        <Item label="Due for review" value={stats.dueCount} />
        <Item
          label="Strongest deck"
          value={
            stats.strongestDeck
              ? `${stats.strongestDeck.title} (${stats.strongestDeck.accuracy}% perfect)`
              : "—"
          }
        />
        <Item
          label="Weakest deck"
          value={
            stats.weakestDeck
              ? `${stats.weakestDeck.title} (${stats.weakestDeck.accuracy}% perfect)`
              : "—"
          }
        />
      </dl>

      {stats.mostMissed.length > 0 ? (
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-sm font-medium text-stone-900">
            Most wrong letter taps (by card)
          </h2>
          <ul className="mt-3 space-y-2">
            {stats.mostMissed.map((item) => (
              <li
                key={item.promptText}
                className="flex items-center justify-between gap-3 text-sm text-stone-700"
              >
                <ThaiText variant="modern" className="text-xl">
                  {item.promptText}
                </ThaiText>
                <span className="shrink-0 text-xs text-stone-500">
                  {item.incorrectCount} wrong {item.incorrectCount === 1 ? "tap" : "taps"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
        <h2 className="font-medium text-stone-900">How progress is tracked</h2>
        <ul className="mt-2 list-outside list-disc space-y-1 px-4">
          <li>Each incorrect letter choice adds 1 to that card&apos;s wrong-tap count.</li>
          <li>Finishing a card with zero wrong taps counts as a perfect completion.</li>
          <li>Wrong taps reset the review streak; perfect completions advance it.</li>
        </ul>
      </section>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <dt className="text-xs text-stone-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-stone-900">{value}</dd>
    </div>
  );
}
