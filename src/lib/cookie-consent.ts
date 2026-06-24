export const COOKIE_CONSENT_STORAGE_KEY = "lmts-cookie-consent";
export const COOKIE_CONSENT_VERSION = 1;
export const OPEN_COOKIE_SETTINGS_EVENT = "lmts:open-cookie-settings";

export type CookieConsentChoice = {
  version: number;
  /** Non-essential analytics (Google Analytics). */
  analytics: boolean;
  updatedAt: string;
};

export function readCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CookieConsentChoice;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== "boolean") return null;

    return parsed;
  } catch {
    return null;
  }
}

export function writeCookieConsent(analytics: boolean): CookieConsentChoice {
  const choice: CookieConsentChoice = {
    version: COOKIE_CONSENT_VERSION,
    analytics,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(choice));
  window.dispatchEvent(new CustomEvent("lmts:cookie-consent-changed", { detail: choice }));

  return choice;
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
