"use server";

import { redirect } from "next/navigation";
import { assertSupabaseUrl, getAuthCallbackUrl, safeNextPath } from "@/lib/auth-utils";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  assertSupabaseUrl();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? "/dashboard"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
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
