import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, openGraphDefaults, twitterDefaults } from "@/lib/seo";

const PRIVACY_TITLE = "Privacy Policy";
const PRIVACY_DESCRIPTION =
  "How Learn Modern Thai Script collects, uses, and protects your information when you use our website and practice tools.";
const CONTACT_EMAIL = "hello@learnmodernthaiscript.com";
const LAST_UPDATED = "30 May 2026";

export const metadata: Metadata = {
  title: PRIVACY_TITLE,
  description: PRIVACY_DESCRIPTION,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: openGraphDefaults({
    title: `${PRIVACY_TITLE} | ${SITE_NAME}`,
    description: PRIVACY_DESCRIPTION,
    url: "/privacy",
  }),
  twitter: twitterDefaults({
    title: `${PRIVACY_TITLE} | ${SITE_NAME}`,
    description: PRIVACY_DESCRIPTION,
  }),
};

export default function PrivacyPage() {
  return (
    <article className="flex flex-col gap-6 text-sm leading-relaxed text-stone-700">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Privacy Policy</h1>
        <p className="mt-1 text-stone-500">Last updated: {LAST_UPDATED}</p>
      </header>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Who we are</h2>
        <p className="mt-2">
          This privacy policy applies to <strong>{SITE_NAME}</strong> (the
          &ldquo;Service&rdquo;), a web application that helps learners practise reading
          modern Thai script. The Service is available at{" "}
          <Link href="/" className="text-stone-900 underline-offset-2 hover:underline">
            learnmodernthaiscript.com
          </Link>
          .
        </p>
        <p className="mt-2">
          For privacy questions or to exercise your rights, contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">What the Service does</h2>
        <p className="mt-2">When you use the Service, we may process information so that you can:</p>
        <ul className="mt-2 list-outside list-disc space-y-1 px-4">
          <li>Create an account and sign in with email and password</li>
          <li>Practise letters, similar letters, words, and sentences in quiz sessions</li>
          <li>Track spaced-repetition progress, review due cards, and view practice statistics</li>
          <li>See which days you completed practice on a calendar</li>
          <li>Browse public pages such as the home page and quick reference chart without an account</li>
        </ul>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Information we collect</h2>

        <h3 className="mt-4 font-medium text-stone-800">Account information</h3>
        <p className="mt-2">
          If you register, we collect your <strong>email address</strong> and{" "}
          <strong>password</strong>. Passwords are handled by our authentication provider; we do
          not store your password in plain text. We may also store a{" "}
          <strong>display name</strong> derived from your sign-up details or email address.
        </p>

        <h3 className="mt-4 font-medium text-stone-800">Learning and usage data</h3>
        <p className="mt-2">
          When you are signed in and use practice or review, we store data linked to your account,
          including:
        </p>
        <ul className="mt-2 list-outside list-disc space-y-1 px-4">
          <li>
            <strong>Progress records</strong> — correct and incorrect counts, streaks, review
            schedules, and mastery status per card
          </li>
          <li>
            <strong>Quiz attempts</strong> — which card you answered, whether the attempt was
            correct, the answer you selected, a session identifier, and a timestamp
          </li>
          <li>
            <strong>Study sessions</strong> — when you finish a practice or review session, how many
            cards it included, the calendar date practised, and (for session variety) which prompts
            or similar-letter drill sets appeared in that session
          </li>
        </ul>

        <h3 className="mt-4 font-medium text-stone-800">Technical and session data</h3>
        <p className="mt-2">
          We use <strong>cookies and similar technologies</strong> to keep you signed in and to
          operate the site securely. Our hosting and database providers may also process technical
          data such as IP address, browser type, and request logs when you access the Service.
        </p>

        <h3 className="mt-4 font-medium text-stone-800">Bot protection (hCaptcha)</h3>
        <p className="mt-2">
          On sign-in and sign-up, we use <strong>hCaptcha</strong> to reduce abuse. hCaptcha may
          collect device and interaction data to distinguish humans from bots. See{" "}
          <a
            href="https://www.hcaptcha.com/privacy"
            className="text-stone-900 underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            hCaptcha&apos;s privacy policy
          </a>
          .
        </p>

        <h3 className="mt-4 font-medium text-stone-800">Information you send us by email</h3>
        <p className="mt-2">
          If you email us (for example to request account deletion), we receive your email address,
          message content, and any information you choose to include.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">How we use your information</h2>
        <p className="mt-2">We use the information above to:</p>
        <ul className="mt-2 list-outside list-disc space-y-1 px-4">
          <li>Provide, maintain, and secure the Service</li>
          <li>Authenticate you and manage your account</li>
          <li>Save your learning progress and power spaced repetition and review</li>
          <li>Show practice statistics and calendar activity</li>
          <li>Improve session variety (for example, avoiding repeated prompts in close succession)</li>
          <li>Respond to support and privacy requests</li>
          <li>Protect the Service against fraud and abuse</li>
        </ul>
        <p className="mt-2">
          We rely on <strong>contract</strong> (to provide the Service you signed up for) and{" "}
          <strong>legitimate interests</strong> (security, abuse prevention, and improving the
          learning experience) as legal bases where applicable under UK and EU data protection law.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Who we share information with</h2>
        <p className="mt-2">
          We use trusted service providers to run the Service. They process data on our instructions
          and only as needed to provide their services:
        </p>
        <ul className="mt-2 list-outside list-disc space-y-1 px-4">
          <li>
            <strong>Supabase</strong> — authentication, database, and storage of account and
            learning data (
            <a
              href="https://supabase.com/privacy"
              className="text-stone-900 underline-offset-2 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Supabase privacy policy
            </a>
            )
          </li>
          <li>
            <strong>Vercel</strong> — website hosting and delivery (
            <a
              href="https://vercel.com/legal/privacy-policy"
              className="text-stone-900 underline-offset-2 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vercel privacy policy
            </a>
            )
          </li>
          <li>
            <strong>hCaptcha</strong> — bot protection on authentication (see above)
          </li>
        </ul>
        <p className="mt-2">
          We do not sell your personal information. We may disclose information if required by law or
          to protect the rights, safety, and security of users and the Service.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Analytics and search tools (current and planned)</h2>

        <h3 className="mt-4 font-medium text-stone-800">Currently</h3>
        <p className="mt-2">
          We do not use Google Analytics or similar visitor analytics cookies on the Service at this
          time. Basic technical logs may still be created by our hosting provider when pages are
          requested.
        </p>

        <h3 className="mt-4 font-medium text-stone-800">Google Analytics (planned)</h3>
        <p className="mt-2">
          We plan to add <strong>Google Analytics</strong> to understand how visitors use the public
          parts of the site (for example, which pages are visited and how users navigate). When
          enabled, Google may set cookies such as <code className="text-xs">_ga</code> and collect
          information such as pages viewed, approximate location (derived from IP), device and
          browser type, and referral source. Google processes this data as described in the{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-stone-900 underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Privacy Policy
          </a>
          . You can opt out of Google Analytics using the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            className="text-stone-900 underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Analytics Opt-out Browser Add-on
          </a>{" "}
          or your browser&apos;s cookie settings. Where required by law, we will ask for your consent
          before enabling non-essential analytics cookies and will update this policy when Analytics
          goes live.
        </p>

        <h3 className="mt-4 font-medium text-stone-800">Google Search Console (planned)</h3>
        <p className="mt-2">
          We plan to use <strong>Google Search Console</strong>{" "}
          to monitor how the site appears in
          Google Search (for example, search queries, impressions, and indexing status). Search
          Console is a site-owner tool: it does not place analytics cookies on visitors&apos; browsers.
          Google may process aggregated search performance data relating to our site as described in
          Google&apos;s privacy documentation.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Cookies</h2>
        <p className="mt-2">The Service uses cookies and similar storage for:</p>
        <ul className="mt-2 list-outside list-disc space-y-1 px-4">
          <li>
            <strong>Essential cookies</strong> — to keep you signed in and protect your session
            (via Supabase authentication)
          </li>
          <li>
            <strong>Security cookies</strong> — hCaptcha may set cookies when you use sign-in or
            sign-up
          </li>
          <li>
            <strong>Analytics cookies (planned)</strong> — if we enable Google Analytics, as
            described above
          </li>
        </ul>
        <p className="mt-2">
          You can control cookies through your browser settings. Blocking essential cookies may
          prevent you from staying signed in.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">How long we keep information</h2>
        <p className="mt-2">
          We keep your account and learning data while your account is active. If you delete your
          account or ask us to delete your data, we delete or anonymise personal information
          associated with your account, subject to any limited retention required by law or for
          legitimate security purposes (for example, short-lived server logs).
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">International transfers</h2>
        <p className="mt-2">
          Our service providers may process data in countries outside your own, including the United
          States. Where required, we rely on appropriate safeguards such as standard contractual
          clauses or equivalent mechanisms offered by those providers.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Your rights</h2>
        <p className="mt-2">
          Depending on where you live (including the UK and EEA), you may have the right to:
        </p>
        <ul className="mt-2 list-outside list-disc space-y-1 px-4">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Object to or restrict certain processing</li>
          <li>Data portability</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Lodge a complaint with your local data protection authority</li>
        </ul>
        <p className="mt-2">
          To request access, correction, or <strong>deletion of your account and data</strong>,
          email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          from the email address linked to your account. We will verify your request and respond
          within a reasonable time.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Children</h2>
        <p className="mt-2">
          The Service is not directed at children under 13. We do not knowingly collect personal
          information from children under 13. If you believe a child has provided us with personal
          information, contact us at {CONTACT_EMAIL} and we will take steps to delete it.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Changes to this policy</h2>
        <p className="mt-2">
          We may update this privacy policy from time to time (for example, when we enable Google
          Analytics or Search Console). We will post the revised policy on this page and update the
          &ldquo;Last updated&rdquo; date. Continued use of the Service after changes take effect
          constitutes acceptance of the updated policy where permitted by law.
        </p>
      </section>
    </article>
  );
}
