import Link from "next/link";
import { ThaiText } from "@/components/ThaiText";
import { cn } from "@/lib/cn";

const SIGNUP_HREF = "/login?mode=signup#create-account";

const CTA_PAIR_GRID_CLASS = "mx-auto grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2";

const CTA_BUTTON_BASE =
  "flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-center text-sm font-semibold shadow-sm transition-colors";

type LandingPageProps = {
  isAuthenticated: boolean;
};

type CtaVariant = "default" | "onDark";

function PrimaryCta({
  isAuthenticated,
  variant = "default",
  className,
}: {
  isAuthenticated: boolean;
  variant?: CtaVariant;
  className?: string;
}) {
  const linkClass = cn(
    CTA_BUTTON_BASE,
    variant === "onDark"
      ? "bg-white text-stone-900 hover:bg-stone-100"
      : "bg-brand-teal text-white hover:bg-brand-teal-hover",
    className,
  );

  if (isAuthenticated) {
    return (
      <Link href="/practice" className={linkClass}>
        Start practicing
      </Link>
    );
  }

  return (
    <Link href={SIGNUP_HREF} className={linkClass}>
      Create a free account
    </Link>
  );
}

function SecondaryCta({
  isAuthenticated,
  variant = "default",
  href,
  children,
  className,
}: {
  isAuthenticated: boolean;
  variant?: CtaVariant;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const linkClass = cn(
    CTA_BUTTON_BASE,
    variant === "onDark"
      ? "border-2 border-white bg-transparent text-white shadow-none hover:bg-white/15"
      : "border border-stone-300 bg-white text-stone-800 shadow-none hover:bg-stone-50",
    className,
  );

  if (children !== undefined && href !== undefined) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    );
  }

  if (isAuthenticated) {
    return (
      <Link href="/dashboard" className={linkClass}>
        Go to dashboard
      </Link>
    );
  }

  return (
    <Link href="/login" className={linkClass}>
      Sign in
    </Link>
  );
}

export function LandingPage({ isAuthenticated }: LandingPageProps) {
  return (
    <article className="landing-page -mx-1 flex flex-col gap-14 pb-4 sm:-mx-0">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl bg-brand-teal-tint px-5 py-10 sm:px-8 sm:py-12">
        <div className="relative z-10 flex flex-col gap-6">
          <p className="border-l-4 border-brand-cyan pl-3 text-sm font-semibold tracking-wide text-stone-800">
            For non-native Thai learners
          </p>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-4xl">
            You learned looped Thai script. Real life uses modern Thai script.
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-stone-600 sm:text-lg">
            Most courses teach the old-style looped alphabet — the one with the little loops on each
            letter. That&apos;s fine for textbooks. Then you walk past a shop sign or open a Thai app
            and the letters look different. Same language. Different shapes. This site helps you
            bridge that gap.
          </p>
          <div className={CTA_PAIR_GRID_CLASS}>
            <PrimaryCta isAuthenticated={isAuthenticated} />
            <SecondaryCta isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </header>

      {/* Quick reference — high on page */}
      <section
        className="flex flex-col items-center gap-4 rounded-2xl border border-brand-border bg-white px-5 py-5 text-center sm:px-6"
        aria-labelledby="quick-ref-heading"
      >
        <div>
          <h2 id="quick-ref-heading" className="text-lg font-semibold text-stone-900">
            Need the character chart right now?
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">
            Our free{" "}
            <strong className="font-medium text-stone-800">Thai script quick reference</strong>{" "}
            shows
            every consonant, vowel, and tone mark in looped script next to the modern form — no
            account needed.
          </p>
        </div>
        <Link
          href="/quick-reference"
          className="shrink-0 rounded-xl bg-brand-teal px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-teal-hover"
        >
          Open quick reference
        </Link>
      </section>

      {/* Problem */}
      <section className="flex flex-col gap-4" aria-labelledby="problem-heading">
        <h2 id="problem-heading" className="text-xl font-semibold text-stone-900 sm:text-2xl">
          Why modern Thai fonts trip people up
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-stone-600 sm:text-base">
          <p>
            If you&apos;re a non-native learner, you probably started with looped Thai script — the
            style in many textbooks and classroom materials. Teachers like it because the loops make
            each letter distinct.
          </p>
          <p>
            Out in Thailand, you&apos;ll see{" "}
            <strong className="font-medium text-stone-800">modern Thai script</strong>{" "}
            everywhere:
            café menus, BTS signs, LINE messages, news headlines. Designers dropped the loops to fit
            small screens and tight logos. The letter is still ก or ม. It just doesn&apos;t look
            like the version you memorised.
          </p>
          <p>
            It&apos;s not that your Thai is bad. Nobody told you the second alphabet was coming.
          </p>
        </div>
      </section>

      {/* Visual */}
      <section
        className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
        aria-labelledby="demo-heading"
      >
        <h2 id="demo-heading" className="text-center text-xl font-medium text-stone-900">
          Same word. Two ways to write it.
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-brand-border bg-stone-50 px-4 py-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-800">
              Modern Thai script
            </p>
            <ThaiText variant="modern" className="mt-3 block text-5xl text-stone-900 sm:text-6xl">
              สวัสดี
            </ThaiText>
            <p className="mt-2 text-xs text-stone-600">What you see on signs and apps</p>
          </div>
          <div className="rounded-xl border border-brand-border bg-stone-50 px-4 py-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-800">
              Looped Thai script
            </p>
            <ThaiText variant="looped" className="mt-3 block text-5xl text-stone-900 sm:text-6xl">
              สวัสดี
            </ThaiText>
            <p className="mt-2 text-xs text-stone-600">What many courses teach first</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="flex flex-col gap-6" aria-labelledby="benefits-heading">
        <h2 id="benefits-heading" className="text-xl font-semibold text-stone-900 sm:text-2xl">
          Built for learners who already know the basics
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          <li className="rounded-xl border border-stone-200 bg-white p-5">
            <h3 className="font-semibold text-stone-900">Read Thai signs faster</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Train your eye to match modern letters back to the looped forms you already know, so
              menus and street signs stop feeling like a different language.
            </p>
          </li>
          <li className="rounded-xl border border-stone-200 bg-white p-5">
            <h3 className="font-semibold text-stone-900">Practice, not just lookup</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Quizzes for single letters, whole words, and short sentences. You tap the looped
              letters that match the modern prompt — active recall beats staring at a chart.
            </p>
          </li>
          <li className="rounded-xl border border-stone-200 bg-white p-5">
            <h3 className="font-semibold text-stone-900">Review what you miss</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Spaced repetition brings tricky cards back when you need them. Mistakes show up in
              Review so you don&apos;t keep guessing the same letter wrong.
            </p>
          </li>
        </ul>
      </section>

      {/* Start practicing */}
      <section className="flex flex-col gap-6" aria-labelledby="start-heading">
        <h2 id="start-heading" className="text-xl font-semibold text-stone-900 sm:text-2xl">
          Start practicing now
        </h2>
        <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
          The quizzes, review queue, and progress tracking live behind a free account. Here&apos;s
          how you get going once you&apos;re signed in:
        </p>
        <ol className="flex flex-col gap-5">
          <li className="flex gap-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal text-sm font-semibold text-white"
              aria-hidden
            >
              1
            </span>
            <div>
              <h3 className="font-semibold text-stone-900">Create a free account</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Sign up with your email. It takes a minute, and you get full access to every practice
                deck — no paid tier, no credit card.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal text-sm font-semibold text-white"
              aria-hidden
            >
              2
            </span>
            <div>
              <h3 className="font-semibold text-stone-900">Open Practice and pick a deck</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Start with Letters if you&apos;re still mapping shapes. Move on to Words and
                Sentences when you want longer prompts. Each card shows modern Thai and asks you to
                pick or spell the looped equivalent.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal text-sm font-semibold text-white"
              aria-hidden
            >
              3
            </span>
            <div>
              <h3 className="font-semibold text-stone-900">Use Review and track your progress</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Cards you miss come back on a schedule so they stick. Check Progress to see which
                decks feel solid and which letters still need work.
              </p>
            </div>
          </li>
        </ol>
        {!isAuthenticated ? (
          <div className="flex justify-center">
            <Link
              href={SIGNUP_HREF}
              className="inline-flex items-center justify-center rounded-xl bg-brand-teal px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-hover"
            >
              Create a free account
            </Link>
          </div>
        ) : null}
      </section>

      {/* Practice tools */}
      <section
        className="rounded-2xl border border-stone-200 bg-white px-5 py-8 sm:px-8"
        aria-labelledby="tools-heading"
      >
        <h2 id="tools-heading" className="text-xl font-semibold text-stone-900">
          What you get with a free account
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-600">
          Everything below unlocks after you sign in. Same account, same login — just pick where you
          want to start.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-700">
            <strong className="text-stone-900">Letters</strong> — match looped consonants, vowels,
            and tone marks
          </li>
          <li className="rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-700">
            <strong className="text-stone-900">Words</strong> — spell words letter by letter in
            looped script
          </li>
          <li className="rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-700">
            <strong className="text-stone-900">Sentences</strong> — longer prompts for when
            single letters feel easy
          </li>
          <li className="rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-700">
            <strong className="text-stone-900">Review &amp; progress</strong> — spaced repetition
            and stats on what to work on next
          </li>
        </ul>
      </section>

      {/* Final CTA */}
      <section
        className="flex flex-col items-center gap-5 rounded-2xl bg-brand-teal px-6 py-10 text-center sm:px-10"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="max-w-md text-2xl font-semibold text-white">
          Ready to read modern Thai script with confidence?
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-white/90">
          {isAuthenticated
            ? "Pick up where you left off — practice a deck or clear your review queue."
            : "Create a free account and start with the letter deck. Five minutes a day adds up."}
        </p>
        <div className={CTA_PAIR_GRID_CLASS}>
          <PrimaryCta isAuthenticated={isAuthenticated} variant="onDark" />
          {!isAuthenticated ? (
            <SecondaryCta href="/quick-reference" variant="onDark" isAuthenticated={false}>
              Browse quick reference first
            </SecondaryCta>
          ) : (
            <SecondaryCta isAuthenticated={isAuthenticated} variant="onDark" />
          )}
        </div>
      </section>
    </article>
  );
}
