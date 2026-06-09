import type { Metadata } from "next";
import Link from "next/link";
import { LetterReferenceTable } from "@/components/LetterReferenceTable";
import {
  QUICK_REFERENCE_DESCRIPTION,
  QUICK_REFERENCE_TITLE,
  openGraphDefaults,
  twitterDefaults,
} from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: QUICK_REFERENCE_TITLE,
  description: QUICK_REFERENCE_DESCRIPTION,
  alternates: {
    canonical: "/quick-reference",
  },
  openGraph: openGraphDefaults({
    title: QUICK_REFERENCE_TITLE,
    description: QUICK_REFERENCE_DESCRIPTION,
    url: "/quick-reference",
  }),
  twitter: twitterDefaults({
    title: QUICK_REFERENCE_TITLE,
    description: QUICK_REFERENCE_DESCRIPTION,
  }),
};

export default async function QuickReferencePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Quick reference</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Compare each character in old-style looped Thai script and modern Thai script — consonants,
          vowels, and tone marks.
        </p>
        <p className="mt-3">
          {user ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-stone-800 underline-offset-2 hover:underline"
            >
              Go to dashboard to practice
            </Link>
          ) : (
            <Link
              href="/login?mode=signup#create-account"
              className="text-sm font-medium text-stone-800 underline-offset-2 hover:underline"
            >
              Sign up to practice with quizzes and review
            </Link>
          )}
        </p>
      </header>

      <LetterReferenceTable />
    </div>
  );
}
