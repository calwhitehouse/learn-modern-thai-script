"use client";

import { signIn, signUp } from "@/app/actions/auth";

type LoginFormsProps = {
  next: string;
  isSignup: boolean;
};

/**
 * Client-rendered forms so password managers (e.g. Keeper) injecting DOM
 * do not cause React hydration mismatches on the server HTML.
 */
export function LoginForms({ next, isSignup }: LoginFormsProps) {
  return (
    <>
      <form action={signIn} className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />
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
        <button
          type="submit"
          className="mt-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
        >
          Sign in
        </button>
      </form>

      <form action={signUp} className="mt-6 border-t border-stone-200 pt-6">
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
        <button
          type="submit"
          className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-800"
        >
          {isSignup ? "Create account" : "Sign up"}
        </button>
      </form>
    </>
  );
}
