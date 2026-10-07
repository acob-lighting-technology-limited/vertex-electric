"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !window.matchMedia(QUERY).matches && !saveData;
}

/**
 * True when heavy motion (video, scroll-scrubbed sequences) is appropriate:
 * the user hasn't asked for reduced motion and isn't in data-saver mode.
 * False during SSR, so the static fallback is what ships in HTML.
 */
export function useMotionAllowed() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
