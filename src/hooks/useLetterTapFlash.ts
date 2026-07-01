"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LETTER_FLASH_MS = 500;

export function useLetterTapFlash() {
  const [flashWrong, setFlashWrong] = useState<string | null>(null);
  const [flashCorrect, setFlashCorrect] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFlash = useCallback(() => {
    setFlashWrong(null);
    setFlashCorrect(null);
  }, []);

  const scheduleClear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(clearFlash, LETTER_FLASH_MS);
  };

  const flashWrongLetter = (letter: string) => {
    setFlashCorrect(null);
    setFlashWrong(letter);
    scheduleClear();
  };

  const flashCorrectLetter = (letter: string) => {
    setFlashWrong(null);
    setFlashCorrect(letter);
    scheduleClear();
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { flashWrong, flashCorrect, flashWrongLetter, flashCorrectLetter, clearFlash };
}
