import type { Metadata } from "next";
import Link from "next/link";
import { PRIVACY_CONTACT_EMAIL } from "@/lib/privacy";
import { SITE_NAME, openGraphDefaults, twitterDefaults } from "@/lib/seo";

const PRIVACY_TITLE = "Privacy Policy";
const PRIVACY_DESCRIPTION =
  "How Learn Modern Thai Script collects, uses, and protects your information.";
const LAST_UPDATED = "24 June 2026";

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
        <h2 className="font-medium text-stone-900">Overview</h2>
        <p className="mt-2">
          This policy describes how <strong>{SITE_NAME}</strong>{" "}
          (the &ldquo;Service&rdquo;), available at{" "}
          <Link href="/" className="text-stone-900 underline-offset-2 hover:underline">
            learnmodernthaiscript.com
          </Link>
          , handles personal information. The Service helps learners practise reading modern Thai
          script with accounts, quizzes, spaced repetition, and progress tracking.
        </p>
        <p className="mt-2">
          Contact:{" "}
          <a
            href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            {PRIVACY_CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Information we collect</h2>
        <ul className="mt-2 list-outside list-disc space-y-2 px-4">
          <li>
            <strong>Account data</strong> — email address, password (stored securely by our auth
            provider, not in plain text), and an optional display name.
          </li>
          <li>
            <strong>Learning data</strong> — quiz progress, review schedules, quiz attempts, and
            completed study sessions.
          </li>
          <li>
            <strong>Technical data</strong> — IP address, browser type, and similar request data
            processed by our hosting provider when you use the site.
          </li>
          <li>
            <strong>hCaptcha data</strong> — on sign-in and sign-up, hCaptcha may process device and
            interaction data for bot protection (
            <a
              href="https://www.hcaptcha.com/privacy"
              className="text-stone-900 underline-offset-2 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              hCaptcha privacy policy
            </a>
            ).
          </li>
          <li>
            <strong>Analytics data (with consent)</strong> — if you accept analytics cookies, Google
            Analytics may collect pages viewed, approximate location, device and browser
            information, and how you found the site.
          </li>
          <li>
            <strong>Emails you send us</strong> — such as privacy or deletion requests.
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">How we use information</h2>
        <p className="mt-2">We use personal information to:</p>
        <ul className="mt-2 list-outside list-disc space-y-1 px-4">
          <li>Provide and secure the Service</li>
          <li>Save your learning progress and run spaced repetition</li>
          <li>Respond to support and privacy requests</li>
          <li>Measure site usage when you consent to analytics</li>
          <li>Prevent abuse and fraud</li>
        </ul>
        <p className="mt-2">
          Depending on your location, we rely on <strong>contract</strong> (to deliver the Service),{" "}
          <strong>legitimate interests</strong> (security and service improvement), and{" "}
          <strong>consent</strong> (analytics cookies) as applicable.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Service providers</h2>
        <p className="mt-2">
          We use processors that handle data on our behalf:{" "}
          <strong>Supabase</strong> (auth and database), <strong>Vercel</strong> (hosting),{" "}
          <strong>Google</strong> (Analytics, when consented), and <strong>hCaptcha</strong> (bot
          protection). Their privacy policies apply to their processing.
        </p>
        <p className="mt-2">
          We do <strong>not</strong> sell personal information. We do not share personal information
          for cross-context behavioural advertising.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Cookies and your choices</h2>
        <p className="mt-2">We use cookies and similar technologies as follows:</p>
        <ul className="mt-2 list-outside list-disc space-y-2 px-4">
          <li>
            <strong>Essential</strong> — required to keep you signed in (Supabase session cookies).
            These run without consent because the Service cannot work without them.
          </li>
          <li>
            <strong>Security</strong> — hCaptcha may set cookies when you sign in or sign up.
          </li>
          <li>
            <strong>Analytics</strong> — placed only if you click <strong>Accept analytics</strong> in
            our cookie banner. You can reject non-essential cookies or change your choice anytime
            via <strong>Cookie settings</strong> in the footer.
          </li>
        </ul>
        <p className="mt-2">
          You can also control cookies in your browser. To opt out of Google Analytics after
          consenting, reject analytics in Cookie settings or use{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            className="text-stone-900 underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google&apos;s opt-out add-on
          </a>
          .
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Retention and international transfers</h2>
        <p className="mt-2">
          We keep account and learning data while your account is active. If you request deletion,
          we delete or anonymise associated personal data, except where limited retention is
          required by law or for security.
        </p>
        <p className="mt-2">
          Our providers may process data in countries other than yours (including the United
          States). Where required, we rely on appropriate safeguards such as standard contractual
          clauses.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Your rights</h2>
        <p className="mt-2">
          Depending on where you live, you may have rights to access, correct, delete, restrict, or
          object to processing of your personal information, to data portability, and to withdraw
          consent (including analytics cookies). California residents may have additional rights
          under the CCPA/CPRA, including the right to know what we collect and to request deletion.
          We do not sell or share personal information as defined under California law.
        </p>
        <p className="mt-2">
          To exercise your rights, including <strong>account and data deletion</strong>, email{" "}
          <a
            href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            {PRIVACY_CONTACT_EMAIL}
          </a>{" "}
          from the email address linked to your account. You may also complain to your local data
          protection authority where applicable.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Children</h2>
        <p className="mt-2">
          The Service is not directed at children. We do not knowingly collect personal information
          from children under 13, or under the minimum age required in their jurisdiction. Contact
          us if you believe a child has provided personal information.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-medium text-stone-900">Changes</h2>
        <p className="mt-2">
          We may update this policy and will revise the date above. Material changes may be
          highlighted on the site where appropriate.
        </p>
      </section>
    </article>
  );
}
