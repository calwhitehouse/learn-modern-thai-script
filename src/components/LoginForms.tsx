"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { AuthCaptcha } from "@/components/AuthCaptcha";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { isHCaptchaConfigured } from "@/lib/hcaptcha";

type LoginFormsProps = {
  next: string;
  isSignup: boolean;
};

function SignInIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 17 15 12 10 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CreateAccountIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AuthModeIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700">
      {children}
    </span>
  );
}

/**
 * Client-rendered forms so password managers (e.g. Keeper) injecting DOM
 * do not cause React hydration mismatches on the server HTML.
 */
export function LoginForms({ next, isSignup }: LoginFormsProps) {
  const captchaRequired = isHCaptchaConfigured();
  const [showSignUp, setShowSignUp] = useState(isSignup);
  const [signInCaptchaToken, setSignInCaptchaToken] = useState("");
  const [signUpCaptchaToken, setSignUpCaptchaToken] = useState("");
  const createAccountRef = useRef<HTMLDivElement>(null);

  const signInReady = !captchaRequired || signInCaptchaToken.length > 0;
  const signUpReady = !captchaRequired || signUpCaptchaToken.length > 0;

  useEffect(() => {
    const shouldOpen =
      isSignup ||
      (typeof window !== "undefined" && window.location.hash === "#create-account");

    if (!shouldOpen) return;

    setShowSignUp(true);

    const scrollToForm = () => {
      createAccountRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToForm);
    });
  }, [isSignup]);

  return (
    <>
      {!showSignUp ? (
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
          <AuthSubmitButton
            disabled={!signInReady}
            pendingLabel="Signing in…"
            className="mt-2"
          >
            Sign in
          </AuthSubmitButton>
        </form>
      ) : null}

      {showSignUp ? (
        <div id="create-account" ref={createAccountRef} className="scroll-mt-4">
          <form id="signup-panel" action={signUp} className="mt-6 flex flex-col gap-3">
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
            <AuthSubmitButton
              disabled={!signUpReady}
              pendingLabel="Creating account…"
              className="mt-1 w-full"
            >
              Create account
            </AuthSubmitButton>
          </form>
          <div className="mt-6 border-t border-stone-200 pt-6">
            <button
              type="button"
              onClick={() => setShowSignUp(false)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-stone-300 bg-stone-50 px-4 py-4 text-left transition-colors hover:border-stone-400 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
            >
              <span className="text-sm font-semibold text-stone-900">Display login form</span>
              <AuthModeIcon>
                <SignInIcon />
              </AuthModeIcon>
            </button>
          </div>
        </div>
      ) : (
        <div
          id="create-account"
          ref={createAccountRef}
          className="mt-6 scroll-mt-4 border-t border-stone-200 pt-6"
        >
          <button
            type="button"
            onClick={() => setShowSignUp(true)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-stone-300 bg-stone-50 px-4 py-4 text-left transition-colors hover:border-stone-400 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
          >
            <span className="text-sm font-semibold text-stone-900">New here? Create an account</span>
            <AuthModeIcon>
              <CreateAccountIcon />
            </AuthModeIcon>
          </button>
        </div>
      )}
    </>
  );
}
