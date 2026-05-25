import Link from "next/link";
import { DECK_META } from "@/lib/data";
import { getDecks, getProgressStats, getUserEmail } from "@/lib/queries";

export default async function DashboardPage() {
  const [email, stats, decks] = await Promise.all([
    getUserEmail(),
    getProgressStats(),
    getDecks(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-600">{email ? `Signed in as ${email}` : ""}</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <Stat label="Due today" value={stats.dueCount} />
        <Stat label="Mastered" value={stats.masteredCount} />
        <Stat label="Wrong taps" value={stats.totalWrongLetterTaps} />
        <Stat label="Perfect rate" value={`${stats.perfectRatePercent}%`} />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-stone-800">Practice decks</h2>
          <Link href="/practice" className="text-xs text-stone-500 hover:text-stone-800">
            View all
          </Link>
        </div>
        {decks.map((deck) => {
          const meta = DECK_META[deck.slug as keyof typeof DECK_META];
          if (!meta) return null;
          return (
            <Link
              key={deck.id}
              href={meta.href}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <h3 className="font-medium text-stone-900">{meta.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{meta.description}</p>
            </Link>
          );
        })}
      </section>

      <Link
        href="/review"
        className="rounded-xl border border-stone-300 bg-stone-100 px-4 py-3 text-center text-sm font-medium text-stone-800"
      >
        Review due cards ({stats.dueCount})
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}
