import Link from "next/link";
import { LetterReferenceTable } from "@/components/LetterReferenceTable";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Letter reference</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Quick comparison of each character in old-style looped script and modern Thai script.
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
              href="/login"
              className="text-sm font-medium text-stone-800 underline-offset-2 hover:underline"
            >
              Sign in to practice
            </Link>
          )}
        </p>
      </header>

      <LetterReferenceTable />
    </div>
  );
}
