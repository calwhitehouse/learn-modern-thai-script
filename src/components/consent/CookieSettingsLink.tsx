"use client";

import { openCookieSettings } from "@/lib/cookie-consent";

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline"
    >
      Cookie settings
    </button>
  );
}
