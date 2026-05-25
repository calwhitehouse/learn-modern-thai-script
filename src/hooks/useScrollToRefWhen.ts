import { useEffect, type RefObject } from "react";

type ScrollOptions = {
  /** When true (default), only scroll on narrow / touch viewports. */
  mobileOnly?: boolean;
};

function shouldScrollOnDevice(mobileOnly: boolean): boolean {
  if (!mobileOnly) return true;
  return window.matchMedia(
    "(max-width: 48rem), (hover: none) and (pointer: coarse)",
  ).matches;
}

/** Smoothly scrolls the target into view when `active` becomes true. */
export function useScrollToRefWhen(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
  options: ScrollOptions = {},
) {
  const { mobileOnly = true } = options;

  useEffect(() => {
    if (!active || !ref.current) return;
    if (!shouldScrollOnDevice(mobileOnly)) return;

    const frame = requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => cancelAnimationFrame(frame);
  }, [active, mobileOnly]);
}
