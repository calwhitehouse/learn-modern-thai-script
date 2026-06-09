import type { DeckSlug } from "@/lib/types";

export const DECK_META: Record<
  DeckSlug,
  { title: string; description: string; href: string }
> = {
  letters: {
    title: "Letters",
    description:
      "Pick the matching looped consonant, vowel, or tone mark for each modern prompt.",
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

export type NavItem = { href: string; label: string };

export const PUBLIC_NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/quick-reference", label: "Quick Reference" },
];

export const AUTH_NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/quick-reference", label: "Quick Reference" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/practice", label: "Practice" },
  { href: "/review", label: "Review" },
  { href: "/progress", label: "Progress" },
  { href: "/about", label: "About" },
];

export function getNavItemsForUser(isAuthenticated: boolean): readonly NavItem[] {
  return isAuthenticated ? AUTH_NAV_ITEMS : PUBLIC_NAV_ITEMS;
}

/** Add entries here for Privacy Policy and other footer links. */
export const FOOTER_LINKS: { href: string; label: string }[] = [
  // { href: "/privacy", label: "Privacy policy" },
];
