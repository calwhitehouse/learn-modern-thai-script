import { useLayoutEffect, type RefObject } from "react";

type ScrollOptions = {
  /** When true, only scroll on narrow / touch viewports. */
  mobileOnly?: boolean;
  /** Re-scroll when this value changes (e.g. increment after each correct tap). */
  trigger?: number;
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
  const { mobileOnly = false, trigger } = options;

  useLayoutEffect(() => {
    if (!active) return;
    if (!shouldScrollOnDevice(mobileOnly)) return;

    const scroll = () => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    scroll();
    const retry = window.setTimeout(scroll, 50);
    return () => window.clearTimeout(retry);
  }, [active, mobileOnly, ref, trigger]);
}
