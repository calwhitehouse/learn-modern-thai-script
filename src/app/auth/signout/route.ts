import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  clearSupabaseAuthCookies,
  expiredSupabaseAuthCookieOptions,
} from "@/lib/supabase/auth-cookies";

async function signOutAndRedirect(request: NextRequest) {
  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  const expired = expiredSupabaseAuthCookieOptions();

  clearSupabaseAuthCookies(cookieStore.getAll(), (name) => {
    try {
      cookieStore.set(name, "", expired);
    } catch {
      /* Route handler: response cookies are authoritative */
    }
    response.cookies.set(name, "", expired);
  });

  return response;
}

export async function POST(request: NextRequest) {
  return signOutAndRedirect(request);
}
