"use client";

import { useState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { AuthCaptcha } from "@/components/AuthCaptcha";
import { isHCaptchaConfigured } from "@/lib/hcaptcha";

type LoginFormsProps = {
  next: string;
  isSignup: boolean;
};

/**
 * Client-rendered forms so password managers (e.g. Keeper) injecting DOM
 * do not cause React hydration mismatches on the server HTML.
 */
export function LoginForms({ next, isSignup }: LoginFormsProps) {
  const captchaRequired = isHCaptchaConfigured();
  const [signInCaptchaToken, setSignInCaptchaToken] = useState("");
  const [signUpCaptchaToken, setSignUpCaptchaToken] = useState("");

  const signInReady = !captchaRequired || signInCaptchaToken.length > 0;
  const signUpReady = !captchaRequired || signUpCaptchaToken.length > 0;

  return (
    <>
      <form action={signIn} className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="captchaToken" value={signInCaptchaToken} />
        <label htmlFor="signin-email" className="text-sm text-stone-700">
          Email
          <input
            id="signin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <label htmlFor="signin-password" className="text-sm text-stone-700">
          Password
          <input
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <AuthCaptcha
          onVerify={(token) => setSignInCaptchaToken(token)}
          onExpire={() => setSignInCaptchaToken("")}
        />
        <button
          type="submit"
          disabled={!signInReady}
          className="mt-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sign in
        </button>
      </form>

      <form action={signUp} className="mt-6 border-t border-stone-200 pt-6">
        <input type="hidden" name="captchaToken" value={signUpCaptchaToken} />
        <p className="text-sm text-stone-600">New here? Create an account.</p>
        <label htmlFor="signup-email" className="mt-3 block text-sm text-stone-700">
          Email
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <label htmlFor="signup-password" className="mt-3 block text-sm text-stone-700">
          Password
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <div className="mt-3">
          <AuthCaptcha
            onVerify={(token) => setSignUpCaptchaToken(token)}
            onExpire={() => setSignUpCaptchaToken("")}
          />
        </div>
        <button
          type="submit"
          disabled={!signUpReady}
          className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSignup ? "Create account" : "Sign up"}
        </button>
      </form>
    </>
  );
}
