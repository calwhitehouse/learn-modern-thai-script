import type { DeckSlug } from "@/lib/types";

export const DECK_META: Record<
  DeckSlug,
  { title: string; description: string; href: string }
> = {
  letters: {
    title: "Letters",
    description: "Pick the matching old-style looped letter.",
    href: "/practice/letters",
  },
  words: {
    title: "Words",
    description: "Spell each word by choosing the old-style looped letters in order.",
    href: "/practice/words",
  },
  sentences: {
    title: "Sentences",
    description: "Spell each sentence letter by letter in old-style looped script.",
    href: "/practice/sentences",
  },
};

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/practice", label: "Practice" },
  { href: "/review", label: "Review" },
  { href: "/progress", label: "Progress" },
  { href: "/about", label: "About" },
] as const;

/** Add entries here for Privacy Policy and other footer links. */
export const FOOTER_LINKS: { href: string; label: string }[] = [
  // { href: "/privacy", label: "Privacy policy" },
];
