import { assertSupabaseUrl } from "@/lib/auth-utils";

/** Fail fast when Supabase env vars are missing (e.g. misconfigured Vercel deploy). */
export function assertSupabaseEnv(): void {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL. Set it in .env.local or Vercel env.");
  }
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Use the anon public key from Supabase Settings → API.",
    );
  }
  if (key.startsWith("sb_secret_")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY must be the anon public key (eyJ…), not the service_role secret.",
    );
  }

  assertSupabaseUrl();
}
