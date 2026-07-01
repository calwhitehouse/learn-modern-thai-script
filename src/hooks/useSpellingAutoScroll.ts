"use client";

import { useEffect, useState } from "react";
import {
  readSpellingAutoScroll,
  SPELLING_AUTO_SCROLL_CHANGED_EVENT,
  writeSpellingAutoScroll,
} from "@/lib/spelling-auto-scroll";

export function useSpellingAutoScroll() {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    setEnabledState(readSpellingAutoScroll());

    const onChange = (event: Event) => {
      setEnabledState((event as CustomEvent<boolean>).detail);
    };

    window.addEventListener(SPELLING_AUTO_SCROLL_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(SPELLING_AUTO_SCROLL_CHANGED_EVENT, onChange);
  }, []);

  const setEnabled = (value: boolean) => {
    writeSpellingAutoScroll(value);
    setEnabledState(value);
  };

  return { enabled, setEnabled };
}
