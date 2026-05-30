import { LoginFormsLoader } from "@/components/LoginFormsLoader";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string; next?: string; mode?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error;
  const message = params.message;
  const next = params.next ?? "/dashboard";
  const isSignup = params.mode === "signup";

  const configHint =
    error?.includes("Invalid path") || error?.includes("Invalid URL") ? (
      <p className="mt-2 text-xs text-rose-700">
        Check <code className="rounded bg-rose-100 px-1">.env.local</code>:{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code> must be your project URL only (e.g.{" "}
        <code>https://xxx.supabase.co</code>) — not <code>/rest/v1/</code>. Use the{" "}
        <strong>anon public</strong> key from Settings → API.
      </p>
    ) : null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center py-4">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-stone-900">
          Learn Modern Thai Script
        </h1>
        <p className="mt-2 text-center text-sm text-stone-600">
          Sign in to practice learning modern Thai script.
        </p>

        {error ? (
          <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
            <p>{error}</p>
            {configHint}
          </div>
        ) : null}
        {message ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}

        <LoginFormsLoader next={next} isSignup={isSignup} />
      </div>
    </div>
  );
}
