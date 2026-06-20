import { normalizeThai } from "@/lib/thai-text";

/** Deck slug — keep in sync with `public.decks` and `DeckSlug` type. */
export const SIMILAR_LETTERS_DECK_SLUG = "similar-letters" as const;

export type SimilarLetterGroup = {
  id: string;
  /** Short label shown above the choice buttons (the letters in this set). */
  label: string;
  letters: readonly string[];
  /** Shown after a correct answer. */
  tip: string;
};

/**
 * Letters that are easily confused in modern Thai typefaces.
 * Each letter appears in exactly one group.
 */
export const SIMILAR_LETTER_GROUPS: readonly SimilarLetterGroup[] = [
  {
    id: "d-t-family",
    label: "ด ต ถ ท ธ",
    letters: ["ด", "ต", "ถ", "ท", "ธ"],
    tip: "Watch the loop and bowl — these mid consonants often look alike in looped script.",
  },
  {
    id: "bp-ph-family",
    label: "บ ป พ ฟ",
    letters: ["บ", "ป", "พ", "ฟ"],
    tip: "Similar loops and curves — common in shop names and menus.",
  },
  {
    id: "ph-top-family",
    label: "ผ ฝ ภ",
    letters: ["ผ", "ฝ", "ภ"],
    tip: "Tall ascenders with a loop — easy to mix up in modern print.",
  },
  {
    id: "s-ch-family",
    label: "ช ซ ศ ษ ส",
    letters: ["ช", "ซ", "ศ", "ษ", "ส"],
    tip: "Wavy tops and tails — check the fine details.",
  },
  {
    id: "kh-family",
    label: "ข ค ฆ",
    letters: ["ข", "ค", "ฆ"],
    tip: "High consonants with similar heads — common in formal text.",
  },
  {
    id: "r-l-w",
    label: "ร ล ว",
    letters: ["ร", "ล", "ว"],
    tip: "Curved strokes — the tail length and loop differ.",
  },
  {
    id: "n-m",
    label: "น ณ ม",
    letters: ["น", "ณ", "ม"],
    tip: "Rounded shapes with a loop or curl on the side.",
  },
  {
    id: "ch-pair",
    label: "ฉ ช",
    letters: ["ฉ", "ช"],
    tip: "Two tall consonants with a double curve on top.",
  },
  {
    id: "e-vowels",
    label: "เ แ",
    letters: ["เ", "แ"],
    tip: "Leading vowels — แ has a slightly wider hook.",
  },
  {
    id: "a-vowels",
    label: "า ำ",
    letters: ["า", "ำ"],
    tip: "Long /aa/ vs /am/ — the circle on ำ is the clue.",
  },
  {
    id: "i-vowels",
    label: "ิ ี",
    letters: ["ิ", "ี"],
    tip: "Short vs long /i/ — check the stroke length above the consonant.",
  },
  {
    id: "ue-vowels",
    label: "ึ ื",
    letters: ["ึ", "ื"],
    tip: "Short vs long /ue/ — similar hooks above the line.",
  },
  {
    id: "u-vowels",
    label: "ุ ู",
    letters: ["ุ", "ู"],
    tip: "Short vs long /u/ — look below the consonant.",
  },
  {
    id: "ai-vowels",
    label: "ใ ไ",
    letters: ["ใ", "ไ"],
    tip: "Both spell /ai/ before a consonant — the hook direction differs.",
  },
] as const;

const letterToGroup = new Map<string, SimilarLetterGroup>();

for (const group of SIMILAR_LETTER_GROUPS) {
  for (const letter of group.letters) {
    letterToGroup.set(normalizeThai(letter), group);
  }
}

export function getSimilarLetterGroup(letter: string): SimilarLetterGroup | null {
  return letterToGroup.get(normalizeThai(letter)) ?? null;
}

export function getSimilarLetterChoices(letter: string): readonly string[] | null {
  return getSimilarLetterGroup(letter)?.letters ?? null;
}

/** All letters used in similar-letter drills (for seeding the deck). */
export function getAllSimilarLetters(): string[] {
  return SIMILAR_LETTER_GROUPS.flatMap((g) => [...g.letters]);
}
