import { THAI_LETTER_GRID } from "@/lib/thai-alphabet";

/** Normalize Thai strings for reliable equality checks (NFC + trim). */
export function normalizeThai(text: string): string {
  return text.normalize("NFC").trim();
}

export function thaiEquals(a: string, b: string): boolean {
  return normalizeThai(a) === normalizeThai(b);
}

/**
 * Split text into individual tap targets for spelling practice.
 * Uses Unicode code points (not grapheme clusters) so บ้าน → บ, ้, า, น
 * and น้ำ → น, ้, ำ — matching separate keyboard keys.
 */
export function splitThaiForSpelling(text: string): string[] {
  return [...normalizeThai(text)];
}

/** @deprecated Use splitThaiForSpelling for word/sentence decks. */
export function splitThaiGraphemes(text: string): string[] {
  return splitThaiForSpelling(text);
}

const keyboardSet = new Set(THAI_LETTER_GRID.map((c) => normalizeThai(c)));

/** True when every character in the answer can be typed on the spelling keyboard. */
export function isSpellingAnswerSupported(answerText: string): boolean {
  return splitThaiForSpelling(answerText).every((ch) => keyboardSet.has(ch));
}
