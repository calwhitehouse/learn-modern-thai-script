import type { Metadata } from "next";

export const SITE_NAME = "Learn Modern Thai Script";

export const DEFAULT_DESCRIPTION =
  "Practice reading modern Thai script from old-style looped letterforms.";

export const HOME_TITLE = "Thai Script Letter Reference";

export const HOME_DESCRIPTION =
  "Compare each Thai character in old-style looped script and modern script. Free letter reference for learners moving from looped to modern Thai writing.";

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
