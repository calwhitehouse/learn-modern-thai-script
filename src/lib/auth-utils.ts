/** Auth email links — use env so it matches Supabase allowlist exactly. */
export function getAuthCallbackUrl(): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");
  return `${base}/auth/callback`;
}

/** Validate Supabase project URL (common mistake: copying the REST URL). */
export function assertSupabaseUrl(): void {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (url.includes("/rest/v1") || url.includes("/auth/v1")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be the project URL only (https://xxx.supabase.co), not the REST or Auth path.",
    );
  }
}

/** Safe internal path for post-login redirect. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}
