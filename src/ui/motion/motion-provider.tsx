"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";

let lenis: Lenis | null = null;

/** The active smooth-scroll instance (null under reduced motion). Used to pause scrolling behind overlays. */
export const getLenis = () => lenis;

/**
 * App-wide motion settings:
 * - MotionConfig reducedMotion="user": Motion drops transform/layout animation when the OS asks for less motion.
 * - Lenis inertial scrolling, skipped entirely under prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.12, anchors: { offset: -80 } });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
