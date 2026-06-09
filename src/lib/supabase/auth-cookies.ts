type CookieLike = { name: string };

const EXPIRED_COOKIE_OPTIONS = {
  path: "/",
  maxAge: 0,
  expires: new Date(0),
} as const;

/** Supabase SSR auth cookies: `sb-<project>-auth-token` and chunked `.0`, `.1`, … */
export function isSupabaseAuthCookie(name: string): boolean {
  return name.startsWith("sb-") && name.includes("auth-token");
}

export function listSupabaseAuthCookieNames(cookies: CookieLike[]): string[] {
  return cookies.map((cookie) => cookie.name).filter(isSupabaseAuthCookie);
}

type SetExpiredCookie = (name: string) => void;

/** Clear auth cookies on the response (and optionally the server cookie store). */
export function clearSupabaseAuthCookies(
  cookies: CookieLike[],
  setExpired: SetExpiredCookie,
): void {
  for (const name of listSupabaseAuthCookieNames(cookies)) {
    setExpired(name);
  }
}

export function expiredSupabaseAuthCookieOptions() {
  return EXPIRED_COOKIE_OPTIONS;
}
