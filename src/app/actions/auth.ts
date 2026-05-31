"use server";

import { redirect } from "next/navigation";
import { assertSupabaseUrl, getAuthCallbackUrl, safeNextPath } from "@/lib/auth-utils";
import { isHCaptchaConfigured } from "@/lib/hcaptcha";
import { createClient } from "@/lib/supabase/server";

function getCaptchaToken(formData: FormData): string {
  return String(formData.get("captchaToken") ?? "").trim();
}

function captchaOptions(captchaToken: string) {
  return captchaToken ? { captchaToken } : {};
}

function redirectCaptchaRequired(next?: string, mode?: "signup") {
  const params = new URLSearchParams({
    error: "Please complete the CAPTCHA challenge.",
  });
  if (next) params.set("next", next);
  if (mode) params.set("mode", mode);
  redirect(`/login?${params.toString()}`);
}

export async function signIn(formData: FormData) {
  assertSupabaseUrl();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? "/dashboard"));
  const captchaToken = getCaptchaToken(formData);

  if (isHCaptchaConfigured() && !captchaToken) {
    redirectCaptchaRequired(next);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: captchaOptions(captchaToken),
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`,
    );
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  assertSupabaseUrl();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const emailRedirectTo = getAuthCallbackUrl();
  const captchaToken = getCaptchaToken(formData);

  if (isHCaptchaConfigured() && !captchaToken) {
    redirectCaptchaRequired(undefined, "signup");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      ...captchaOptions(captchaToken),
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&mode=signup`);
  }

  // Email confirmation off: session is available immediately
  if (data.session) {
    redirect("/dashboard");
  }

  redirect(
    `/login?message=${encodeURIComponent("Check your email to confirm your account, then sign in.")}&mode=signup`,
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
