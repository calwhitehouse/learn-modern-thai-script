import type { Metadata } from "next";

export const SITE_NAME = "Learn Modern Thai Script";

export const DEFAULT_DESCRIPTION =
  "Bridge the gap between looped Thai script and modern Thai writing. Free reference chart and practice for non-native learners.";

/** Home landing — primary SEO target: looped → modern script gap */
export const HOME_TITLE = "Learn Modern Thai Script for Non-Native Learners";

export const HOME_DESCRIPTION =
  "You learned Thai with looped script in class, but signs and apps use modern Thai fonts. Compare characters, then practice reading modern Thai script with spaced repetition.";

/** Quick reference — character chart SEO */
export const QUICK_REFERENCE_TITLE = "Thai Script Quick Reference";

export const QUICK_REFERENCE_DESCRIPTION =
  "Side-by-side chart of looped Thai script and modern Thai script for every consonant, vowel, and tone mark. Free reference for learners reading Thai signs and menus.";

export const NO_INDEX = { index: false, follow: false } as const;

export const OG_IMAGE = {
  url: "/learn-modern-thai-script-logo.png",
  width: 1024,
  height: 244,
  alt: SITE_NAME,
} as const;

export const TWITTER_IMAGE = "/favicon.png";

export function openGraphDefaults(
  overrides: NonNullable<Metadata["openGraph"]> = {},
): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: SITE_NAME,
    locale: "en",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
    ...overrides,
  };
}

export function twitterDefaults(
  overrides: NonNullable<Metadata["twitter"]> = {},
): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [TWITTER_IMAGE],
    ...overrides,
  };
}
