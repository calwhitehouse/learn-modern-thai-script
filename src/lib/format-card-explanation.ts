const EXPLANATION_SEP = " — ";

const THAI_LETTER = /^\p{Script=Thai}$/u;

/**
 * Letter-deck explanations are stored as "ก — gaaw gài (Chicken)". The quiz prompt
 * already shows the character, so the success line is name/notes only.
 */
export function formatCardExplanationForDisplay(text: string): string {
  const normalized = text.normalize("NFC").trim();
  const sepIndex = normalized.indexOf(EXPLANATION_SEP);
  if (sepIndex <= 0) return normalized;

  const lead = normalized.slice(0, sepIndex);
  if ([...lead].length !== 1 || !THAI_LETTER.test(lead)) return normalized;

  return normalized.slice(sepIndex + EXPLANATION_SEP.length);
}
