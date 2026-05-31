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
  const [showSignUp, setShowSignUp] = useState(isSignup);
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

      <div className="mt-6 border-t border-stone-200 pt-6">
        {!showSignUp ? (
          <button
            type="button"
            onClick={() => setShowSignUp(true)}
            aria-expanded={false}
            aria-controls="signup-panel"
            className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-stone-300 bg-stone-50 px-4 py-4 text-left transition-colors hover:border-stone-400 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
          >
            <span>
              <span className="block text-sm font-semibold text-stone-900">
                New here? Create an account
              </span>
              <span className="mt-1 block text-xs text-stone-600">
                Expand to show the sign-up form
              </span>
            </span>
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700"
              aria-hidden
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShowSignUp(false)}
              aria-expanded={true}
              aria-controls="signup-panel"
              className="mb-4 flex w-full items-center justify-between gap-3 rounded-xl bg-stone-50 px-4 py-4 text-left transition-colors hover:border-stone-400 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
            >
              <span className="block text-sm text-stone-700">Hide create account</span>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700"
                aria-hidden
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <form id="signup-panel" action={signUp} className="flex flex-col gap-3">
              <input type="hidden" name="captchaToken" value={signUpCaptchaToken} />
              <h2 className="text-sm font-semibold text-stone-900">Create your account</h2>
              <label htmlFor="signup-email" className="text-sm text-stone-700">
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
              <label htmlFor="signup-password" className="text-sm text-stone-700">
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
              <AuthCaptcha
                onVerify={(token) => setSignUpCaptchaToken(token)}
                onExpire={() => setSignUpCaptchaToken("")}
              />
              <button
                type="submit"
                disabled={!signUpReady}
                className="mt-1 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create account
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
