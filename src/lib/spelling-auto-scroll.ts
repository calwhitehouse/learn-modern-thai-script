export const SPELLING_AUTO_SCROLL_STORAGE_KEY = "lmts-spelling-auto-scroll";
export const SPELLING_AUTO_SCROLL_CHANGED_EVENT = "lmts:spelling-auto-scroll-changed";

export function readSpellingAutoScroll(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const raw = localStorage.getItem(SPELLING_AUTO_SCROLL_STORAGE_KEY);
    if (raw === null) return true;
    return raw === "true";
  } catch {
    return true;
  }
}

export function writeSpellingAutoScroll(enabled: boolean): void {
  localStorage.setItem(SPELLING_AUTO_SCROLL_STORAGE_KEY, String(enabled));
  window.dispatchEvent(
    new CustomEvent(SPELLING_AUTO_SCROLL_CHANGED_EVENT, { detail: enabled }),
  );
}
