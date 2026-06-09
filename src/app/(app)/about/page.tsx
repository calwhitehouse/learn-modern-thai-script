import { ThaiText } from "@/components/ThaiText";

export default function AboutPage() {
  return (
    <article className="flex flex-col gap-6 text-sm leading-relaxed text-stone-700">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">About</h1>
      </header>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Modern vs looped</h2>
        <p className="mt-2">
          Non-native Thai language learners often learn to read and write using the old-style looped font script. The modern Thai script is increasingly common esepcially on shop signs and the news. This resource is intended to help you learn how the old-style looped script translates into the modern script.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-stone-500">Modern</p>
            <ThaiText variant="modern" className="mt-1 block text-3xl">
              สวัสดี
            </ThaiText>
          </div>
          <div>
            <p className="text-xs text-stone-500">Looped</p>
            <ThaiText variant="looped" className="mt-1 block text-3xl">
              สวัสดี
            </ThaiText>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">How to practice</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>
            <strong>Letters:</strong> Choose the matching old-style looped letter which corresponds to the modern loopless letter.
          </li>
          <li>
            <strong>Words & sentences:</strong> Choose consonants, vowels, and tone marks in order
            (e.g. บ้าน → บ, ้, า, น) to spell the word or sentence correctly.
          </li>
          <li>
            <strong>Review:</strong> Use Review for cards due today, including practicing your recent mistakes.</li>
        </ol>
      </section>
    </article>
  );
}
