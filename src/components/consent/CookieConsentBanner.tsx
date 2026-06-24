"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GoogleAnalytics } from "@/components/consent/GoogleAnalytics";
import { isAnalyticsEnabled } from "@/lib/analytics";
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const syncFromStorage = useCallback(() => {
    const stored = readCookieConsent();
    setChoice(stored);
    setShowBanner(!stored);
    setReady(true);
  }, []);

  useEffect(() => {
    syncFromStorage();

    const onConsentChanged = () => syncFromStorage();
    const onOpenSettings = () => {
      setShowBanner(true);
    };

    window.addEventListener("lmts:cookie-consent-changed", onConsentChanged);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);

    return () => {
      window.removeEventListener("lmts:cookie-consent-changed", onConsentChanged);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
    };
  }, [syncFromStorage]);

  const saveChoice = (analytics: boolean) => {
    const saved = writeCookieConsent(analytics);
    setChoice(saved);
    setShowBanner(false);
  };

  if (!ready) return null;

  return (
    <>
      {choice?.analytics && isAnalyticsEnabled() ? <GoogleAnalytics /> : null}

      {showBanner ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white p-4 shadow-lg sm:p-5"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <div className="app-container flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl text-sm text-stone-700">
              <p id="cookie-consent-title" className="font-medium text-stone-900">
                Cookies on this site
              </p>
              <p id="cookie-consent-description" className="mt-1 leading-relaxed">
                We use essential cookies to keep you signed in and run the app. With your
                permission, we also use Google Analytics to understand how the site is used. You can
                accept or reject analytics cookies. See our{" "}
                <Link
                  href="/privacy"
                  className="text-stone-900 underline-offset-2 hover:underline"
                >
                  Privacy policy
                </Link>{" "}
                for details.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => saveChoice(false)}
                className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={() => saveChoice(true)}
                className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
              >
                Accept analytics
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
