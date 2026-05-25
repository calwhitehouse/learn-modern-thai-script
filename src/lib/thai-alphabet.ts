/** Thai consonants in traditional alphabetical order (44). */
export const THAI_CONSONANTS = [
  "ก",
  "ข",
  "ฃ",
  "ค",
  "ฅ",
  "ฆ",
  "ง",
  "จ",
  "ฉ",
  "ช",
  "ซ",
  "ฌ",
  "ญ",
  "ด",
  "ต",
  "ถ",
  "ท",
  "ธ",
  "น",
  "บ",
  "ป",
  "ผ",
  "ฝ",
  "พ",
  "ฟ",
  "ภ",
  "ม",
  "ย",
  "ร",
  "ล",
  "ว",
  "ศ",
  "ษ",
  "ส",
  "ห",
  "ฬ",
  "อ",
  "ฮ",
] as const;

/** Tone marks and non-vowel diacritics (tap separately when spelling). */
export const THAI_TONE_MARKS = ["่", "้", "๊", "๋", "็", "์", "ํ"] as const;

/** Vowel characters and sara (including ำ and ั as single code points). */
export const THAI_VOWELS = [
  "ะ",
  "ั",
  "า",
  "ำ",
  "ิ",
  "ี",
  "ึ",
  "ื",
  "ุ",
  "ู",
  "เ",
  "แ",
  "โ",
  "ใ",
  "ไ",
] as const;

/** Vowels + tone marks for spelling keyboards. */
export const THAI_VOWELS_AND_MARKS: readonly string[] = [
  ...THAI_TONE_MARKS,
  ...THAI_VOWELS,
];

/** Full keyboard: consonants, then vowels and marks. */
export const THAI_LETTER_GRID: readonly string[] = [
  ...THAI_CONSONANTS,
  ...THAI_VOWELS_AND_MARKS,
];

/** Grouped layout for word/sentence spelling practice. */
export const THAI_SPELLING_KEYBOARD_GROUPS = [
  { id: "consonants", label: "Consonants", letters: THAI_CONSONANTS },
  { id: "marks", label: "Tone marks", letters: THAI_TONE_MARKS },
  { id: "vowels", label: "Vowels", letters: THAI_VOWELS },
] as const;
